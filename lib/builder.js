var packageJSON = require("./package.init.js");
var configJSON = require("./config.js");
var moduleArr = []
var result;

function getDefalutePackage(){
	return {
		"webpack": ""
	}
}

function isArray(param) { 
	if (Object.prototype.toString.call(param) === '[object Array]') { 
  		return true; 
  	}
  	return false;
}

function getModuleObj(varName, moduleName, version) {
	var obj = {
		  "varName": varName,
		"moduleName": moduleName,
	}
	if(version) {
		obj.version = version;
	}
	return obj;
}

function init(result){
	var config = {};
		
	//循环结果
	for(var name in result) {

		if(name == "entry") {
			config["entry"] = "./" + result[name];
			continue;
		}else if(name == "output") {
			var moduleObj = getModuleObj("path", "path");
			moduleArr.push(moduleObj);
			config["output"] = {
				path: result[name],
				filename: "bundle.js"
			}
			continue;
		}

		var val = result[name];
		if(val == false) {
			continue;
		}else if (val == true) {
			var obj = getObjByName(name);			
			if(obj != undefined) {
				config = create(obj, config, result);
			}
		}else if(isArray(val) == true) {
			val.map(function(sName, index){
				var obj = getObjByName(sName);				
				if(obj != undefined) {
					config = create(obj, config, result);
				}
			});
		}
	}

	var dependencies = packageJSON.dependencies;
	//模块引用
	moduleArr.map((module)=>{
		JSONStr = "var " + module.varName + " = require('"+ module.moduleName + "'); \r\n" + JSONStr;
		if(module.version != undefined) {
			dependencies[module.moduleName] = module.version;
		}
	});
	
	var JSONStr = "module.exports= " + JSON.stringify(config, false, 4);
	JSONStr = JSONStr.replace(/"#/g, "").replace(/#"/g, "").replace(/'#/g, "").replace(/#'/g, "").replace(/\\"/g, '"').replace(/\\'/g, "'");
	
	packageJSON = JSON.stringify(packageJSON, false, 4);
	return {
		webpack: JSONStr,
		package: packageJSON
	}
}

function create(obj, config, result) {
	
	switch(obj.type) {
		case "conf":
			if(isArray(obj.content)){				
				for(var i in obj.content){
					config[i] = obj.content[i]
				}
			}else{
				config[obj["name"]] = obj.content;
			}
		break;
		case "loader":
		case "plugin":
			
			var contentObj;
			if(obj.type == "loader") {
				if(config.module == undefined) {					
					config["module"] = {
						loaders: []	
					}
				}
				contentObj = config.module.loaders;
			}

			if(obj.type == "plugin"){
				if( config.plugins == undefined) {
					config.plugins = [];
				}
				contentObj = config.plugins;

				if(obj.package && obj.package.length == 1) {
					var moduleObj = getModuleObj(obj["name"], obj.package[0]["name"], obj.package[0]["version"])
					moduleArr.push(moduleObj);
				}
			}
			
			if(isArray(obj.content)){
				for(var i in obj.content){
					config = create(obj.content[i], config, result);
				}
			}else if(typeof obj.content == "function") {
				contentObj.push(obj.content(true))
			}else{
				contentObj.push(obj.content);				
			}
		break;
	}
	return config;
}

function getObjByName(name){	
	for (var i = 0, max = configJSON.length; i < max; i++) {
		if(configJSON[i].name == name) {
			return configJSON[i];
		}
	}
}

module.exports = {
	init: init
};