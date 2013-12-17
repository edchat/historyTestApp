define(["dojo/dom", "dojo/dom-style", "dojo/_base/connect","dijit/registry", "dojo/sniff",
	"dojo/router", "dojox/mobile/TransitionEvent"],
function(dom, domStyle, connect, registry, has, router, TransitionEvent){
		var _connectResults = []; // events connect result
		var	list = null;
		var listId = 'list4';
		var backId = 'sc4back1';
		var insert10Id = 'sc4insert10x';
		var app = null;
		var MODULE = "V4";

	var loadMore = function(){
		if(!app){
			return;
		}
		if(!app.listStart){
			app.listStart = 1;
			app.listCount = 5;
		}
		setTimeout(function(){ // to simulate network latency
			for(var i = app.listStart; i < app.listStart+5; i++){
				var newdata = {'label': 'Item #'+i};
				app.stores.longlistStore.store.put(newdata);
			}
			app.listStart += app.listCount;
			app.listTotal = app.listStart-1;
			return false;
		}, 500);
	};
	return {
		init: function(){
			app = this.app;
			
			var connectResult = connect.connect(dom.byId(insert10Id), "click", function(){
				//Add 10 items to the end of the model
				loadMore();
			});
			_connectResults.push(connectResult);
		},


		beforeActivate: function(){
			// summary:
			//		view life cycle beforeActivate()
			//console.log(MODULE+" beforeActivate");
			if(dom.byId(backId) && !has("phone")){
				domStyle.set(dom.byId(backId), "visibility", "hidden"); // hide the back button in tablet mode
			}
			
			app.list4 = registry.byId(listId);

			list = app.list4;
			if(!list.store){
				list.setStore(app.stores.longlistStore.store);
			}

			if(dom.byId("tab1WrapperA")){ 
				domStyle.set(dom.byId("tab1WrapperA"), "visibility", "visible");  // show the nav view if it being used
				domStyle.set(dom.byId("tab1WrapperB"), "visibility", "visible");  // show the nav view if it being used
			}
		},
		afterActivate: function(previousView, data){
			//console.log(MODULE+" afterActivate");
			if(!this.app.timedAutoFlow){
				return;
			}
			var usedHistory = false;
			this.app.loopCount++;
		//	console.log("Step "+this.app.loopCount+" previousView.id is "+previousView.id);
			//console.log(MODULE+" afterActivate this.app.loopCount="+this.app.loopCount);
			var liWidget = null;
			if(this.app.loopCount === 3){
				if(previousView.id !== "TestApp_V2") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_V2 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_0"); //P1,S1,V1
				router.go("#P1,S1");
			}else if(this.app.loopCount === 8) {
				if(previousView.id !== "TestApp_P1") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P1 it was "+previousView.id);
				}
				if(history){
					setTimeout(function(){
						history.back();
					}, 500);
					usedHistory = true;
				}
			}else if(this.app.loopCount === 10) {
				if(previousView.id !== "TestApp_V2") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_V2 it was "+previousView.id);
				}
				if(history){
					setTimeout(function(){
						console.log("Step 10 doing history forward.");
						history.forward();
					}, 500);
					usedHistory = true;
				}
			}
			if(liWidget && !usedHistory && !has("useRouter")){
				var ev = new TransitionEvent(liWidget.domNode, liWidget.params);
				ev.dispatch();
			}
		},
		beforeDeactivate: function(){
			//console.log(MODULE+" beforeDeactivate");
		},
		afterDeactivate: function(nextView, data){
			//console.log(MODULE+" afterDeactivate");
		//	console.log("Step "+this.app.loopCount+" nextView.id is "+nextView.id);
			if(this.app.loopCount === 3){
				if(nextView.id !== "TestApp_P1") {
					console.error("Step "+this.app.loopCount+" nextView.id should have been TestApp_P1 it was "+nextView.id);
				}
			}

		},

		destroy: function(){
			var connectResult = _connectResults.pop();
			while(connectResult){
				connect.disconnect(connectResult);
				connectResult = _connectResults.pop();
			}
		}
	};
});
