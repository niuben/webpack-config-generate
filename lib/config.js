var checkIsExtractText = function(result){
	for(var i in result) {
		if( i == "ExtractTextPlugin") {
			return result[i];
		} 
	}
	return false;
}

module.exports = [{
		name: "ExtractTextPlugin",
		type: "plugin",				
		package: [{
			  name: "extract-text-webpack-plugin",
			version: "1.2.3"
		}],
		content:[{
			type: "plugin",
			content: '#new ExtractTextPlugin("app.css")#'
		}]
	},{
		name: "sourcemap",
		type: "conf",
		content: {
			devtool: "source-map"
		}
	},{
		name: "ES6",
		type: "loader",
		package: {
			"babel-loader": ""
		},
		content: {
	        test: "#/\.(js)$/#",
			exclude: "#/node_modules/#",
	        loader: 'babel-loader',
	        query: {
	            presets: ['es2015']             
	        }
        }
	},{
		name: "css",
		type: "loader",
		package: [{
			name: "style-loader",
			version: ""
		},{
			name: "css-loader",
			version: ""
		}],
		content: function(result){
			if(!checkIsExtractText(result)) {
				return {				 
          			test: "#/\.css$/#", 
          			loader: "style-loader!css-loader"
        		}
        	}
        	return {				 
      			test: "#/\.css$/#", 
      			loader: '#ExtractTextPlugin.extract("style-loader", "css-loader")#'
    		}
        }
    },{
		name: "scss",
		type: "loader",
		package: {				
			"style-loader": "",
			"css-loader": "",
			"scss-loader": ""
		},
		content: function(result){
			if(!checkIsExtractText(result)) {				
				return { 
		        	test: "#/\.scss$/#", 
					loader: "style-loader!css-loader!sass-loader"
		    	}
			}
			return { 
				test: "#/\.scss$/#", 
				loader: '#ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader", {publicPath: "./"})#'
			}
		}
			
    },{
		name: "less",
		type: "loader",
		package: {
			"style-loader": "",
			"css-loader": "",
			"less-loader": ""
		},
		content: function(result){
			if(!checkIsExtractText(result)) {				
				return { 
		        	test: "#/\.less$/#", 
					loader: "style-loader!css-loader!less-loader"
		    	}
			}
			return { 
				test: "#/\.less$/#", 
				loader: '#ExtractTextPlugin.extract("style-loader", "css-loader!less-loader", {publicPath: "./"})#'
			}
	    }
    },{
		name: "image",
		type: "loader",
		package: {
			"url-loader": ""
		},
		content: {
            test: "#/\.(png|jpg|gif)$/#",
            loader: 'url-loader?limit=8192'
        }
	},{
		name: "jsx",
		type: "loader",
		package: {
			"babel-loader": ""
		},
		content: {
	        test: "#/\.(js)$/#",
			exclude: "#/node_modules/#",
	        loader: 'babel-loader',
	        query: {
	            presets: ['react']             
	        }
        }
	}
]
