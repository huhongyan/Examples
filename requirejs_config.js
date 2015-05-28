/**
 * 全局的模块配置文件
 * @authors Huhy (huhongyan@oso.com)
 * @date    2015-05-28 11:59:12
 * @version $Id$
 */
require.config({ 
	//baseUrl: "D:/huhy/Examples",
    paths: {
    	"bower": "D:/huhy/Examples/bower_components",
    	"jquery": "D:/huhy/Examples/bower_components/jquery/dist/jquery.min",
    	"domReady": "D:/huhy/Examples/bower_components/domReady/domReady",
    	"require-css": "D:/huhy/Examples/bower_components/require-css/css.min",
    	"handlebars": "D:/huhy/Examples/bower_components/handlebars/handlebars.min",
    	"handlebars.runtime": "D:/huhy/Examples/bower_components/handlebars/handlebars.runtime.amd.min",
    	"angular": "D:/huhy/Examples/bower_components/angular/angular.min",
    	"bootstrap": "D:/huhy/Examples/bower_components/bootstrap/dist/js/bootstrap.min",
    	"mCustomScrollbar": "D:/huhy/Examples/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min"
    }, 
    shim: { 
        'bootstrap': {
          	deps: [
          		"jquery",
          		"require-css!D:/huhy/Examples/bower_components/bootstrap/dist/css/bootstrap.min.css"
          	]
        },
        "mCustomScrollbar": {
        	deps: [
          		"jquery",
          		"D:/huhy/Examples/bower_components/jquery-mousewheel/jquery.mousewheel.min.js",
          		"require-css!D:/huhy/Examples/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css"
          	]
        } 
    } 
});