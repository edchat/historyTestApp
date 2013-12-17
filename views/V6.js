define(["dojo/dom", "dojo/dom-style", "dojo/_base/connect","dijit/registry", "dojo/sniff",
	"dojo/router", "dojox/mobile/TransitionEvent"],
function(dom, domStyle, connect, registry, has, router, TransitionEvent){
		var _connectResults = []; // events connect result
		var	list = null;
		var listId = 'list6';
		var backId = 'sc6back1';
		var insert10Id = 'sc6insert10x';
		var app = null;
		var MODULE = "V6";

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
			
		//	app.list4 = registry.byId(listId);

		//	list = app.list4;
		//	if(!list.store){
		//		list.setStore(app.stores.longlistStore.store);
		//	}

		//	if(dom.byId("tab1WrapperA")){
		//		domStyle.set(dom.byId("tab1WrapperA"), "visibility", "visible");  // show the nav view if it being used
		//		domStyle.set(dom.byId("tab1WrapperB"), "visibility", "visible");  // show the nav view if it being used
		//	}
		},
		afterActivate: function(previousView, data){
			//console.log(MODULE+" afterActivate");
		/*
			if(!this.app.loopCount){
				this.app.loopCount = 0;
				console.time("timing transition loop");
			}
			//loop test
			if(this.app.loopCount++ < 100){
			//	dojox_mobile_ListItem_0
				var liWidget = registry.byId("dojox_mobile_ListItem_0");
				var ev = new TransitionEvent(liWidget.domNode, liWidget.params);
				ev.dispatch();
			}else{
			//	console.time("timing transition loop");
				console.timeEnd("timing transition loop");
			}
		*/
			if(!this.app.timedAutoFlow && !this.app.timed100Loops){
				return;
			}
			this.app.loopCount++;
		//	console.log("Step "+this.app.loopCount+" previousView.id is "+previousView.id);
			//console.log(MODULE+" afterActivate this.app.loopCount="+this.app.loopCount);
			var liWidget = null;
			if(this.app.timed100Loops){
				if(this.app.loopCount < 100) {
					if(history){
						history.back();
					}
				}else{
					console.log("P1:afterActivate loopCount = 100 stop timer");
					console.timeEnd("timing transition loop");
				}
				return;
			}

			if(this.app.loopCount === 10){
				if(previousView.id !== "TestApp_P2") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P2 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_0"); //P1,S1,V1
				router.go("#P1,S1");
			}else if(this.app.loopCount === 15) {
				if(previousView.id !== "TestApp_P2_S2_Ss2_V6") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P2 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_12"); //Test Instructions
				router.go("#P1,S1,TestInfo");
			}
			if(liWidget && !has("useRouter")){
				setTimeout(function(){ // to simulate network latency
					var ev = new TransitionEvent(liWidget.domNode, liWidget.params);
					ev.dispatch();
				}, 50);
			}
		},
		beforeDeactivate: function(){
			//console.log(MODULE+" beforeDeactivate");
		},
		afterDeactivate: function(nextView, data){
			//console.log(MODULE+" afterDeactivate");
		//	console.log("Step "+this.app.loopCount+" nextView.id is "+nextView.id);
			if(this.app.loopCount === 10){
				if(nextView.id !== "TestApp_P1") {
					console.error("Step "+this.app.loopCount+" nextView.id should have been TestApp_P1 it was "+nextView.id);
				}
			}
			if(this.app.loopCount === 15){
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
