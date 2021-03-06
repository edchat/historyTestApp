define(["dojo/dom", "dojo/dom-style", "dojo/_base/connect","dijit/registry", "dojo/sniff",
	"dojo/router", "dojox/mobile/TransitionEvent"],
function(dom, domStyle, connect, registry, has, router, TransitionEvent){
		var _connectResults = []; // events connect result
		var	list = null;
		var listId = 'list2';
		var backId = 'sc2back1';
		var insert10Id = 'sc2insert10x';
		var app = null;
		var MODULE = "V2";

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
		}, 50);
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
			
			app.list2 = registry.byId(listId);

			list = app.list2;
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
			if(!this.app.timedAutoFlow && !this.app.timed100Loops){
				return;
			}
			if(!this.app.loopCount){
				this.app.loopCount = 0;
			//	console.log("V2:afterActivate loopCount = 0 start timer");
			//	console.time("timing transition loop");
				for(var i = 0; i < 20; i++){
					loadMore();
				}
			}
			this.app.loopCount++;
		//	if(previousView){
		//		console.log("Step "+this.app.loopCount+" previousView.id is "+previousView.id);
		//	}
			//console.log(MODULE+" afterActivate this.app.loopCount="+this.app.loopCount);
			var usedHistory = false;
			var liWidget = null;
			if(this.app.timed100Loops){
				if(this.app.loopCount < 100) {
					liWidget = registry.byId("dojox_mobile_ListItem_6"); //0 - P1,S1,V1 6 - P2,S2,Ss2,V5+P2,S2,Ss2,V6
					if(liWidget){
						var ev = new TransitionEvent(liWidget.domNode, liWidget.params);
						ev.dispatch();
					}
				}else{
					console.log("V2:afterActivate loopCount = 100 stop timer");
					console.timeEnd("timing transition loop");
				}
				return;
			}
			if(this.app.loopCount === 1){
			//	if(previousView) {
			//		console.error("Step "+this.app.loopCount+" PreviousView.id should have been null it was not",previousView);
			//	}
				liWidget = registry.byId("dojox_mobile_ListItem_1"); //V2
				router.go("#V2");
			}else if(this.app.loopCount === 2) {
				if(previousView.id !== "TestApp_V2") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_V2 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_5"); //V4
				router.go("#V4");
			}else if(this.app.loopCount === 7) {
				if(previousView.id !== "TestApp_P1") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P1 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_0"); //P1,S1,V1
				router.go("#P1,S1");
			}else if(this.app.loopCount === 9) {
				if(previousView.id !== "TestApp_V4") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_V4 it was "+previousView.id);
				}
				if(history){
					setTimeout(function(){
						history.forward();
					}, 500);
					usedHistory = true;
				}
			}
			if(liWidget && !usedHistory && !has("useRouter")){
			//	setTimeout(function(){
					var ev = new TransitionEvent(liWidget.domNode, liWidget.params);
					ev.dispatch();
			//	}, 500);
			}
		},
		beforeDeactivate: function(){
			//console.log(MODULE+" beforeDeactivate");
		},
		afterDeactivate: function(nextView, data){
			//console.log(MODULE+" afterDeactivate");
		//	console.log("Step "+this.app.loopCount+" nextView.id is "+nextView.id);
			if(this.app.loopCount === 1){
				if(nextView.id !== "TestApp_V2") {
					console.error("Step "+this.app.loopCount+" nextView.id should have been TestApp_V2 it was "+nextView.id);
				}
			}
			if(this.app.loopCount === 2){
				if(nextView.id !== "TestApp_V4") {
					console.error("Step "+this.app.loopCount+" nextView.id should have been TestApp_V4 it was "+nextView.id);
				}
			}
			if(this.app.loopCount === 7){
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
