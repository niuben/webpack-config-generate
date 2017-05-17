#!/usr/bin/env node
'use strict';
var fs = require("fs");
var inquirer = require('inquirer');
var fileConfig = {};  

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

var webpackConf = [
	{
	    type: 'input',
		name: 'entry',
		title: '请输入entry文件名',
		message: function(a, b){
			return '请输入entry文件名';
		},
	},{
	    type: 'input',
		name: 'output',
		title: '请输入output文件夹名',
		message: function(a, b){
			return '请输入output文件夹名';
		}
	},{
	    type: 'checkbox',
		name: 'style',
		title: '选择支持样式格式',
		message: function(a, b){
			return '选择支持样式格式';
		},
		choices: ['css', 'less', 'sass', 'styl'],
		default: ['css', 'less'] 
	},{
	    type: 'checkbox',
		name: 'template',
		title: '选择支持的模板格式',
		message: function(a, b){
			return '选择支持的模板格式';
		},
		choices: ['jsx'],
		default: "jsx",
		filter: function (val) {
		    return val;
		}
	},{
		type: "list",
		name: "ES6",		
		title: "是否支持ES6?",
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
		title: "是否提取css?",
		message: function(a, b) {
			return "是否提取css?"
		},
		choices: ["是", "否"],
		default: "是",
		filter: function(val){
			if(val == "是" || val == true){
				return true	
			}
			return false;
		}
	}
];
function searchConf(conf, name){
	for (var i = conf.length - 1; i >= 0; i--) {
		if(conf[i]["name"] == name) {
			return conf[i];
		}
	}
	return null;
}

function init() {
	var builder = require("./builder.js");
	var totalResult = {};
	var showArr = [];
	//设置入口文件和输出地址
	var showNameArr = ["entry", "output"];
	showNameArr.map((name)=>{
		showArr.push(searchConf(webpackConf, name));
	});
	
	inquirer.prompt(showArr).then(function (result) {
		for(var i in result) {
			totalResult[i] = result[i];
		}

		showArr = [];
		var showNameArr = ["style", "template", "ES6", "ExtractTextPlugin"];
		var list = [];
		showNameArr.map((name)=>{
			var selfConf = searchConf(webpackConf, name);
			list.push(selfConf.title + "(默认值: " + selfConf["default"] + ")");
			// showArr.push(selfConf);
		});

		inquirer.prompt([{
			type: "list",
			name: "ES6",		
			message: "以下是默认配置（如果想修改请按回车键）",
			choices: list 
		}]).then(function(result) {
			for(var i in result) {
				totalResult[i] = result[i];
			}
		});
	});


}