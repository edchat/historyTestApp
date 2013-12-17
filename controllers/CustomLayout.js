define(["dojo/_base/declare", "dojo/_base/lang", "dojo/sniff", "dojo/_base/array", "dojo/_base/window",
	"dojo/_base/config", "dojo/query", "dojo/dom-geometry", "dojo/dom-attr", "dojo/dom-style", "dijit/registry",
	"dojo/aspect",  "dapp/utils/layout", "dapp/utils/constraints", "dapp/Controller"],
function(declare, lang, has, array, win, config, query, domGeom, domAttr, domStyle, registry, LayoutBase, layout,
		 constraints, Controller){

//define(["dojo/_base/lang", "dojo/_base/declare", "dojo/sniff", "dojo/_base/window", "dojo/_base/config",
//		"dojo/dom-attr", "dojo/topic", "dojo/dom-style", "dojo/aspect", "dapp/utils/constraints", "dapp/Controller"],
//function(lang, declare, has, win, config, domAttr, topic, domStyle, aspect, constraints, Controller){
	// module:
	//		dojox/app/controllers/LayoutBase
	// summary:
	//		Bind "app-initLayout", "app-layoutView" and "app-resize" events on application instance.

	return declare(Controller, {

		constructor: function(app, events){
			// summary:
			//		bind "app-initLayout", "app-layoutView" and "app-resize" events on application instance.
			//
			// app:
			//		dojox/app application instance.
			// events:
			//		{event : handler}
			this.events = {
				"app-initLayout": this.initLayout,
				"app-layoutView": this.layoutView,
				"app-resize": this.onResize
			};
			var dm = lang.getObject("dojox.mobile", true);
			dm.disableResizeAll = true;
			// if we are using dojo mobile & we are hiding address bar we need to be bit smarter and listen to
			// dojo mobile events instead
			if(config.mblHideAddressBar){
			//	topic.subscribe("/dojox/mobile/afterResizeAll", lang.hitch(this, this.onResize));
				aspect.after(dm, "resizeAll", lang.hitch(this, this.onResize));
			}else{
				// bind to browsers orientationchange event for ios otherwise bind to browsers resize
				this.bind(win.global, has("ios") ? "orientationchange" : "resize", lang.hitch(this, this.onResize));
			//	aspect.after(dm, "resizeAll", lang.hitch(this, this.onResize));
			}
		},

		resizeSelectedChildren: function(w){
			for(var hash in w.selectedChildren){	// need this to handle all selectedChildren
				if(w.selectedChildren[hash] && w.selectedChildren[hash].domNode){
					this.app.log("in Layout resizeSelectedChildren calling resizeSelectedChildren calling _doResize for w.selectedChildren[hash].id="+w.selectedChildren[hash].id);
					this._doResize(w.selectedChildren[hash]);
					// Call resize on child widgets, needed to get the scrollableView to resize correctly initially
				//	array.forEach(w.selectedChildren[hash].domNode.children, function(child){
				//		if(registry.byId(child.id) && registry.byId(child.id).resize){
				//			registry.byId(child.id).resize();
				//		}
				//	});

					this.resizeSelectedChildren(w.selectedChildren[hash]);
				}
			}
		},

		onResize: function(){
			this._doResize(this.app);
			// this is needed to resize the children on an orientation change or a resize of the browser.
			// it was being done in _doResize, but was not needed for every call to _doResize.
			this.resizeSelectedChildren(this.app);
		},
		
		initLayout: function(event){
			// summary:
			//		Response to dojox/app "app-initLayout" event.
			//
			// example:
			//		Use emit to trigger "app-initLayout" event, and this function will respond to the event. For example:
			//		|	this.app.emit("app-initLayout", view);
			//
			// event: Object
			// |		{"view": view, "callback": function(){}};
			if (!event.view.domNode.parentNode) {
				event.view.parent.domNode.appendChild(event.view.domNode);
			}

			domAttr.set(event.view.domNode, "data-app-constraint", event.view.constraint);

			domAttr.set(event.view.domNode, "id", event.view.id);	// Set the id for the domNode
			if(event.callback){	// if the event has a callback, call it.
				event.callback();
			}
		},

		_doLayout: function(view){
			// summary:
			//		do view layout.
			//
			// view: Object
			//		view instance needs to do layout.
			if(!view){
				console.warn("layout empty view.");
				return;
			}
			this.app.log("in Layout _doLayout called for view.id="+view.id+" view=",view);

			var children;
			// TODO: probably need to handle selectedChildren here, not just selected child...
			// TODO: why are we passing view here? not parent? This call does not seem logical?
			var selectedChild = constraints.getSelectedChild(view, view.constraint);
			if(selectedChild && selectedChild.isFullScreen){
				console.warn("fullscreen sceen layout");
				/*
				 fullScreenScene=true;
				 children=[{domNode: selectedChild.domNode,constraint: "center"}];
				 query("> [constraint]",this.domNode).forEach(function(c){
				 if(selectedChild.domNode!==c.domNode){
				 dstyle(c.domNode,"display","none");
				 }
				 })
				 */
			}else{
				children = query("> [data-app-constraint]", view.domNode).map(function(node){
					var w = registry.getEnclosingWidget(node);
					if(w){
						w._constraint = domAttr.get(node, "data-app-constraint");
						return w;
					}

					return {
						domNode: node,
						_constraint: domAttr.get(node, "data-app-constraint")
					};
				});

				if(selectedChild){
					children = array.filter(children, function(c){
						// do not need to set display none here it is set in select.
						return c.domNode && c._constraint;
					}, view);
				}
			}
			// We don't need to layout children if this._contentBox is null for the operation will do nothing.
			if(view._contentBox && view._active !== false){
				layout.layoutChildren(view.domNode, view._contentBox, children);
			}

		},

		_doResize: function(view){
			// summary:
			//		resize view.
			//
			// view: Object
			//		view instance needs to do resize.
			this.app.log("in LayoutBase _doResize called for view.id="+view.id+" view=",view);
			var node = view.domNode;
			if(!node){
				this.app.log("Warning - View has not been loaded, in Layout _doResize view.domNode is not set for view.id="+view.id+" view=",view);
				return;
			}

			// If either height or width wasn't specified by the user, then query node for it.
			// But note that setting the margin box and then immediately querying dimensions may return
			// inaccurate results, so try not to depend on it.
			var mb = {};
			if( !("h" in mb) || !("w" in mb) ){
				mb = lang.mixin(domGeom.getMarginBox(node), mb);	// just use dojo/_base/html.marginBox() to fill in missing values
			}

			// Compute and save the size of my border box and content box
			// (w/out calling dojo/_base/html.contentBox() since that may fail if size was recently set)
			if(view !== this.app){
				var cs = domStyle.getComputedStyle(node);
				var me = domGeom.getMarginExtents(node, cs);
				var be = domGeom.getBorderExtents(node, cs);
				var bb = (view._borderBox = {
					w: mb.w - (me.w + be.w),
					h: mb.h - (me.h + be.h)
				});
				var pe = domGeom.getPadExtents(node, cs);
				view._contentBox = {
					l: domStyle.toPixelValue(node, cs.paddingLeft),
					t: domStyle.toPixelValue(node, cs.paddingTop),
					w: bb.w - pe.w,
					h: bb.h - pe.h
				};
			}else{
				// if we are layouting the top level app the above code does not work when hiding address bar
				// so let's use similar code to dojo mobile.
				view._contentBox = {
					l: 0,
					t: 0,
					h: win.global.innerHeight || win.doc.documentElement.clientHeight,
					w: win.global.innerWidth || win.doc.documentElement.clientWidth
				};
			}

		//	this.inherited(arguments);
			this._doLayout(view);
		},

		layoutView: function(event){
			// summary:
			//		Response to dojox/app "app-layoutView" event.
			//
			// example:
			//		Use emit to trigger "app-layoutView" event, and this function will response the event. For example:
			//		|	this.app.emit("app-layoutView", view);
			//
			// event: Object
			// |		{"parent":parent, "view":view, "removeView": boolean}
			var parent = event.parent || this.app;
			var view = event.view;

			if(!view){
				return;
			}

			this.app.log("in LayoutBase layoutView called for event.view.id="+event.view.id);

			// if the parent has a child in the view constraint it has to be hidden, and this view displayed.
			var parentSelChild = constraints.getSelectedChild(parent, view.constraint);
			if(event.removeView){	// if this view is being removed set display to none and the selectedChildren entry to null
				view.viewShowing = false;
				this.hideView(view);
				if(view == parentSelChild){
					constraints.setSelectedChild(parent, view.constraint, null);	// remove from selectedChildren
				}
			}else if(view !== parentSelChild){
				if(parentSelChild){
				//	domStyle.set(parentSelChild.domNode, "zIndex", 25);
					parentSelChild.viewShowing = false;
					if(event.transition == "none" || event.currentLastSubChildMatch !== parentSelChild){
						this.hideView(parentSelChild); // only call hideView for transition none or when the transition will not hide it
					}
				}
				view.viewShowing = true;
				this.showView(view);
				//domStyle.set(view.domNode, "zIndex", 50);
				constraints.setSelectedChild(parent, view.constraint, view);
			}else{ // this view is already the selected child and showing
				view.viewShowing = true;
			}

			if(event.doResize){
				this._doResize(event.parent || this.app);
				this._doResize(event.view);
			}

		},

		hideView: function(view){
			this.app.log("logTransitions:","LayoutBase"+" setting domStyle display none for view.id=["+view.id+"], visibility=["+view.domNode.style.visibility+"]");
			domStyle.set(view.domNode, "display", "none");
		},

		showView: function(view){
			if(view.domNode){
				this.app.log("logTransitions:","LayoutBase"+" setting domStyle display to display for view.id=["+view.id+"], visibility=["+view.domNode.style.visibility+"]");
				domStyle.set(view.domNode, "display", "");
			}
		}
	});
});
