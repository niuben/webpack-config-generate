var packageJSON = require("./package.init.js");
var configJSON = require("./config.js");
var moduleArr = [];
var result;

function isArray(param) { 
	if (Object.prototype.toString.call(param) === '[object Array]') { 
  		return true; 
  	}
  	return false;
}

// function getModuleObj(obj) {
// 	var obj = {
// 		"moduleName": obj.moduleName
// 	}
// 	if(version) {
// 		obj.version = obj.version;
// 	}
// 	if(valName) {
// 		obj.varName = obj.varName;
// 	}
// 	return obj;
// }

function init(result){
	var config = {};
		
	//循环结果
	for(var name in result) {

		if(name == "entry") {
			config["entry"] = "./" + result[name];
			continue;
		}else if(name == "output") {			
			moduleArr.push({
				valName: "path",
				moduleName: "path"
			});			
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
	
	var JSONStr = "module.exports= " + JSON.stringify(config, false, 4);
	JSONStr = JSONStr.replace(/"#/g, "").replace(/#"/g, "").replace(/'#/g, "").replace(/#'/g, "").replace(/\\"/g, '"').replace(/\\'/g, "'");
	
	//模块引用
	moduleArr.map((module)=>{

		if(module.varName != undefined) {
			JSONStr = "var " + module.varName + " = require('"+ module.moduleName + "'); \r\n" + JSONStr;		
		}
		if(module.version != undefined) {
			dependencies[module.moduleName] = module.version;
		}
		
	});	

	// packageJSON = JSON.stringify(packageJSON, false, 4);	
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

			}
						
			if(typeof obj.package == "object" && obj.package.length != undefined) {
				
				for(var i = 0; i < obj.package.length; i++) {
					//当是插件类型是才会有valName					
					var moduleObj = {
						moduleName: obj.package[i]["name"],
						version: obj.package[i]["version"]
					}
					if(obj.type == "plugin") {
						moduleObj.varName = obj["name"];
					}

					// var moduleObj = getModuleObj(obj.push(moduleObj);
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