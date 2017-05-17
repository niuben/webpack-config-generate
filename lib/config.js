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
			version: "2.1.0"
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
		package: [{
			"babel-loader": "7.0.0",			
		}],
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
			version: "0.17.0"
		},{
			name: "css-loader",
			version: "0.28.1"
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
		package: [{
			name: "style-loader",
			version: "0.17.0"
		},{
			name: "css-loader",
			version: "0.28.1"
		},{
			name: "scss-loader",
		    version: "0.0.1"
		}],
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
		package: [{
			name: "style-loader",
			version: "0.17.0"
		},{
			name: "css-loader",
			version: "0.28.1"
		},{
			name: "less-loader",
		    version: "4.0.3"
		}],
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
		package: [{
			name: "url-loader",
			version: "0.5.8"
		}],
		content: {
            test: "#/\.(png|jpg|gif)$/#",
            loader: 'url-loader?limit=8192'
        }
	},{
		name: "jsx",
		type: "loader",
		package: {
			"babel-loader": "7.0.0"
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
