define(["dojo/dom", "dojo/dom-style", "dojo/_base/connect","dijit/registry", "dojo/sniff",
	"dojo/router", "dojox/mobile/TransitionEvent"],
function(dom, domStyle, connect, registry, has, router, TransitionEvent){
	var app = null;
	var MODULE = "P1";
	return {
		init: function(){
			app = this.app;
		},

		beforeActivate: function(){
			// summary:
			//		view life cycle beforeActivate()
			//console.log(MODULE+" beforeActivate");
		},

		afterActivate: function(previousView, data){
			// summary:
			//		view life cycle afterActivate()
			//console.log(MODULE+" afterActivate");
		/*
			//loop test
			if(this.app.loopCount++ < ){
				if(history){
					history.back();
				}
			}else{
			//	console.time("timing transition loop");
				console.timeEnd("timing transition loop");
			}
		*/
			if(!this.app.timedAutoFlow && !this.app.timed100Loops){
				return;
			}
			var usedHistory = false;
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

			if(this.app.loopCount === 4){
				if(previousView.id !== "TestApp_V4") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_V4 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_0"); //P1,S1,(V1) P1,S1
				router.go("#P1,S1");
			}else if(this.app.loopCount === 5) {
				if(previousView.id !== "TestApp_P1_S1_V1") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P1_S1_V1 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_2"); //P1,S1,V3
				router.go("#P1,S1,V3");
			}else if(this.app.loopCount === 6) {
				if(previousView.id !== "TestApp_P1_S1_V1") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P1_S1_V1 it was "+previousView.id);
				}
				if(history){
					setTimeout(function(){
						history.back();
					}, 500);
					usedHistory = true;
				}
			//	liWidget = registry.byId("dojox_mobile_ListItem_1"); //V2
			//	router.go("#V2");
			}else if(this.app.loopCount === 7) {
				if(previousView.id !== "TestApp_P1_S1_V3") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P1_S1_V3 it was "+previousView.id);
				}
				if(history){
					setTimeout(function(){
						history.back();
					}, 500);
					usedHistory = true;
				}
			//	liWidget = registry.byId("dojox_mobile_ListItem_1"); //V2
			//	router.go("#V2");
			}else if(this.app.loopCount === 8) {
				if(previousView.id !== "TestApp_P1_S1_V1") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P1_S1_V1 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_7"); //P2,S2,Ss2,V5
				router.go("#P2,S2,Ss2,V5");
			}else if(this.app.loopCount === 11) {
				if(previousView.id !== "TestApp_P2") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P2 it was "+previousView.id);
				}
			//	liWidget = registry.byId("dojox_mobile_ListItem_6"); //P2,S2,Ss2,V5+P2,S2,Ss2,V6
				liWidget = registry.byId("dojox_mobile_ListItem_3"); //P1,S1,V8
				router.go("#P1,S1,V8");
			}else if(this.app.loopCount === 12) {
				if(previousView.id !== "TestApp_P1") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P1 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_4"); //-P1,S1,V8
				router.go("#-P1,S1,V8");
			}else if(this.app.loopCount === 13) {
				if(previousView.id !== "TestApp_P1_S1_V8") {
					console.error("Step "+this.app.loopCount+" PreviousView.id should have been TestApp_P1_S1_V8 it was "+previousView.id);
				}
				liWidget = registry.byId("dojox_mobile_ListItem_6"); //P2,S2,Ss2,V5+P2,S2,Ss2,V6
				router.go("#P2,S2,Ss2,V5&P2,S2,Ss2,V6"); // NOTE + causes problems with Router, so use & and replace it
			}
			if(liWidget && !usedHistory && !has("useRouter")){
				console.log("in P1 calling ev.dispatch for this.app.loopCount ="+this.app.loopCount+" liWidget=",liWidget);
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
			if(this.app.loopCount === 4){
				if(nextView.id !== "TestApp_P1_S1_V1") {
					console.error("Step "+this.app.loopCount+" nextView.id should have been TestApp_P1_S1_V1 it was "+nextView.id);
				}
			}
			if(this.app.loopCount === 5){
				if(nextView.id !== "TestApp_P1_S1_V3") {
					console.error("Step "+this.app.loopCount+" nextView.id should have been TestApp_P1_S1_V3 it was "+nextView.id);
				}
			}
			if(this.app.loopCount === 6){
				if(nextView.id !== "TestApp_P1_S1_V1") {
					console.error("Step "+this.app.loopCount+" nextView.id should have been TestApp_P1_S1_V1 it was "+nextView.id);
				}
			}
			if(this.app.loopCount === 8 || this.app.loopCount === 13){
				if(nextView.id !== "TestApp_P2") {
					console.error("Step "+this.app.loopCount+" nextView.id should have been TestApp_P2 it was "+nextView.id);
				}
			}
			if(this.app.loopCount === 11 || this.app.loopCount === 12){
				if(nextView.id !== "TestApp_P1_S1_V8") {
					console.error("Step "+this.app.loopCount+" nextView.id should have been TestApp_P1_S1_V8 it was "+nextView.id);
				}
			}
		}
	};
});
