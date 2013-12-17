require(["dojo/_base/window","dojox/app/main", "dojox/json/ref", "dojo/sniff", "dojo/aspect", "dojox/mobile/ListItem"],
	function(win, Application, json, has, aspect, ListItem){
	win.global.modelApp = {};
	modelApp.list = { 
		identifier: "label",
		'items':[]
	};


	var configurationFile = "./config.json";

	require(["dojo/text!"+configurationFile], function(configJson){
		aspect.before(ListItem.prototype, "resize", function(){
		//	console.count("in ListItem resize");
		//	console.log("in ListItem resize "+this.id);
		});

		var config = json.fromJson(configJson);
		var width = window.innerWidth || document.documentElement.clientWidth;
		if(width <= 600){
			has.add("phone", true);
		}
		has.add("ie9orLess", has("ie") && (has("ie") <= 9));
		Application(config);
	});
});
