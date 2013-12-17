define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom", "dojo/dom-style", "dojo/router",
	"dojo/dom-class", "dojo/dom-attr", "dojo/dom-construct", "dojo/_base/config", "dojo/sniff",
	"dojox/app/Controller"],
	function (declare, lang, dom, domStyle, router, domClass, domAttr, domConstruct, dconfig, has, Controller){
		// module:
		//		dapp/tests/nestedTestApp/controllers/CustomRouter
		// summary:
		//		A custom router controller to use dojo router to manage transitions
		//
		// To fire the router changes use:
		//		router.go("/foo/bar"); // where /foo/bar matches the route being registered
		//
		return declare(Controller, {

			constructor: function (app){
				// summary:
				//		call setupRouters() to setup the routers to handle.
				//
				// Note: there are problems when using this controller with the History controller because it also sets
				// the url on transitions.  So do not use the History controller with this controller.
				//
				// app:
				//		dojox/app application instance.
				//
				this.app = app;
				this.setupRouters();
			},

			setupRouters: function (){
				router.register(":view", lang.hitch(this, function(evt){
					evt.preventDefault();
					// NOTE + causes problems with Router, so use & and replace it with + here
					var view = evt.params.view.replace("&", "+");
					view = view.replace("#", "");
					this.fireTransiton(view);
				}));
			  router.startup();
			},

			fireTransiton: function (target){
				console.log("in CustomRouter fireTransiton called for "+ target);
				// set url for TestInfo to #, to be able to easily run the test multiple times
				var url = "#";
				if(target !== "P1,S1,TestInfo"){
					url = url + target;
				}
				var transOpts = {
					title : target,
					target : target,
					url : url
				};
				// need a domNode, so use this.app.domNode.
				this.app.transitionToView(this.app.domNode,transOpts,null);
			}
		});
	});
