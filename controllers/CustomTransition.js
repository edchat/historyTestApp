define(["require", "dojo/_base/lang", "dojo/_base/declare", "dojo/has", "dojo/on", "dojo/Deferred", "dojo/when",
	"dojo/dom-style", "dapp/controllers/Transition", "dapp/Controller", "dapp/utils/constraints"],
	function(require, lang, declare, has, on, Deferred, when, domStyle, Transition, Controller, constraints){

	var transit;
	var MODULE = "dapp/controllers/Transition";
	var LOGKEY = "logTransitions:";

	// module:
	//		dojox/app/controllers/Transition
	//		Bind "app-transition" event on dojox/app application instance.
	//		Do transition from one view to another view.
	return declare(Transition, {

		_handleAfterDeactivateCalls: function(subs, next, current, data){
			// summary:
			//		Call afterDeactivate for each of the current views which have been deactivated
			var F = MODULE+":_handleAfterDeactivateCalls";
			if(current && current._active){
				//now we need to loop forwards thru subs calling afterDeactivate
				for(var i = 0; i < subs.length; i++){
					var v = subs[i];
					if(v && v.afterDeactivate && v._active){
						this.app.log(LOGKEY,F,"afterDeactivate for v.id="+v.id);
						v.afterDeactivate(next, data);
						v._active = false;
					}
				}
			}
			// detach the domNode if necessary
			if((this.currentLastSubChildMatch != null) && this.currentLastSubChildMatch !== next){
				var v = this.currentLastSubChildMatch;
				if((v != null) && v.domNode && v.domNode.parentNode){
					this.app.log(LOGKEY,F," _handleAfterDeactivateCalls calling removeChild for v.id="+ v.id);
					v.domNode.parentNode.removeChild(v.domNode);
				}
			}
		},

		_handleBeforeActivateCalls: function(subs, current, data){
			// summary:
			//		Call beforeActivate for each of the next views about to be activated
			var F = MODULE+":_handleBeforeActivateCalls";
			//now we need to loop backwards thru subs calling beforeActivate (ok since next matches current)
			for(var i = subs.length-1; i >= 0; i--){
				var v = subs[i];
				if (!v.domNode.parentNode) {
					this.app.log(LOGKEY,F," _handleBeforeActivateCalls calling appendChild for v.id="+ v.id);
					v.parent.domNode.appendChild(v.domNode);
				}
				this.app.log(LOGKEY,F,"beforeActivate for v.id="+v.id);
				v.beforeActivate(current, data);
			}
		}

	});
});
