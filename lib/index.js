#!/usr/bin/env node
'use strict';
var fs = require("fs");
var inquirer = require('inquirer');

//检查该目录下是否有配置文件
fs.exists("webpack.config.js", function(exists){
	
	if(!exists) {
		init();
		return;
	}

	inquirer.prompt([{
		type: "list",
		name: "isCover",		
		message: function(a, b){
			return "已经有webpack.config.js，是否覆盖？"
		},
		choices: ["是", "否"],
		filter: function(val){
			if(val == "是" || val == true){
				return true	
			}
			return false;
		}
	}]).then(function(result){	
		fileConfig["isCover"] = result["isCover"];
		init();
	});
	
});

var fileConfig = {};  

function writeFile(fileName, content) {
	fs.open(fileName, 'w+', function(err, fd) {
	    if(err){
	       return console.error(err);
	    }
		fs.writeFile(fileName, content);  	
	});		
}

function createConfFile(config){
	console.log("conf:" + config);

	var fileName = "webpack.config.js";
	if(fileConfig["isCover"] == false) {
		fileName = "webpack.config.builder.js";
	}

	fs.open(fileName, 'w+', function(err, fd) {
	    if (err) {
	       return console.error(err);
	    }
		fs.writeFile(fileName, config["webpack"]);
	});
	console.log("成功创建" + fileName);
}

//创建package.json文件
function createPackageFile(config) {
	console.log("package:" + config);

	var content =  config["package"],
		fileName = 'package.json';
	
	fs.exists(fileName, function(exists){
		if(exists){

			fs.readFile("package.json", 'utf8', function(err, data){
				var packageJSON;
				try{
					packageJSON = JSON.parse(data);
					var dependencies = packageJSON["dependencies"];
					if(dependencies == undefined) {
						dependencies = {};
					}
					dependencies["plugins"] = 123;
				   	content = JSON.stringify(packageJSON, false, 4); 
				   	writeFile(fileName, content);

				}catch(e){								
					writeFile(fileName, content);
				}
			});
		}else {
			writeFile(fileName, content);			
		}
		
	});

}


function init() {

	var builder = require("./builder.js");
	inquirer.prompt([
		{
		    type: 'input',
			name: 'entry',
			message: function(a, b){
				return '请输入entry文件名';
			},
		},{
		    type: 'input',
			name: 'output',
			message: function(a, b){
				return '请输入output文件夹名';
			}
		},{
		    type: 'checkbox',
			name: 'style',
			message: function(a, b){
				return '选择支持样式格式';
			},
			choices: ['less', 'sass', 'styl']
		},{
		    type: 'checkbox',
			name: 'template',
			message: function(a, b){
				return '选择支持的模板格式';
			},
			choices: ['jsx'],
			filter: function (val) {
			    return val;
			}
		},{
		    type: 'checkbox',
			name: 'template',
			message: function(a, b){
				return '选择支持的模板格式';
			},
			choices: ['jsx'],
			filter: function (val) {
			    return val;
			}
		},{
			type: "list",
			name: "ES6",		
			message: function(a, b){
				return "是否支持ES6?"
			},
			choices: ["是", "否"],
			default: "是",
			filter: function(val){
				if(val == "是" || val == true){
					return true	
				}
				return false;
			}		
		},{
			type: "list",
			name: "ExtractTextPlugin",
			message: function(a, b) {
				return "是否提取css?"
			},
			choices: ["是", "否"],
			filter: function(val){
				if(val == "是" || val == true){
					return true	
				}
				return false;
			}
		}
	]).then(function (result) {
		var config = builder.init(result);
		createPackageFile(config);
		createConfFile(config);
	});
}