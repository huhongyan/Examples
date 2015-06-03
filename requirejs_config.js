/**
 * 全局的模块配置文件
 * @authors Huhy (huhongyan@oso.com)
 * @date    2015-05-28 11:59:12
 * @version $Id$
 */
require.config({ 
	baseUrl: "D:/huhy/Examples/",
    paths: {
    	// "bower": "bower_components",
    	"jquery": "bower_components/jquery/dist/jquery.min",
    	"domReady": "bower_components/domReady/domReady",
    	"require-css": "bower_components/require-css/css.min",
    	"handlebars": "bower_components/handlebars/handlebars.min",
    	"handlebars.runtime": "bower_components/handlebars/handlebars.runtime.amd.min",
    	"angular": "bower_components/angular/angular.min",
    	"bootstrap": "bower_components/bootstrap/dist/js/bootstrap.min",
    	"Font-Awesome":"bower_components/Font-Awesome/css/font-awesome.min",
    	"mCustomScrollbar": "bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min"
    }, 
    shim: { 
        'bootstrap': [
            "jquery",
            "require-css!bower_components/bootstrap/dist/css/bootstrap.min.css"
        ],
        "mCustomScrollbar": [
            "jquery",
            "bower_components/jquery-mousewheel/jquery.mousewheel.min",
            "require-css!bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css"
        ] 
    } 
});