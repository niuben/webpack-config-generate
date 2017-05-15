#!/usr/bin/env node
'use strict';

var inquirer = require('inquirer');
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
	var fs = require("fs");
	fs.open('webpack.config.js', 'w+', function(err, fd) {
	    if (err) {
	       return console.error(err);
	    }
		fs.writeFile('webpack.config.js', config["webpack"]);  	
	});
	console.log("成功创建webpack.config.js");

	fs.open('package.json', 'w+', function(err, fd) {
	    if (err) {
	       return console.error(err);
	    }
		fs.writeFile('package.json', config["package"]);  	
	});
	console.log("成功创建package.json");

});