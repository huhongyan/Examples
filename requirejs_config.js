/**
 * 全局的模块配置文件
 * @authors Huhy (307036736@qq.com)
 * @date    2015-05-28 11:59:12
 * @version $Id$
 */
require.config({ 
    baseUrl: "/Example/",
    paths: {
    	// "bower": "bower_components",
    	"jquery": "bower_components/jquery/dist/jquery.min",
    	"domReady": "bower_components/domReady/domReady",
    	"require-css": "bower_components/require-css/css.min",
    	"handlebars": "bower_components/handlebars/handlebars.min",
    	"handlebars.runtime": "bower_components/handlebars/handlebars.runtime.amd.min",
        "underscore":"bower_components/underscore/underscore-min",
        "backbone": "bower_components/backbone/backbone-min",
        "backbone.localStorage": "bower_components/backbone.localStorage/backbone.localStorage-min",
    	// "angular": "bower_components/angular/angular.min",
    	"bootstrap": "bower_components/bootstrap/dist/js/bootstrap.min",
    	"Font-Awesome":"bower_components/Font-Awesome/css/font-awesome.min",
    	"mCustomScrollbar": "bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min",
        "jquery.mousewheel": "bower_components/jquery-mousewheel/jquery.mousewheel.min",
        "Threejs": "bower_components/three.js/build/three.min"
    }, 
    shim: { 
        'bootstrap': [
            "jquery",
            "require-css!bower_components/bootstrap/dist/css/bootstrap.min.css"
        ],
        "jquery.mousewheel": ["jquery"],
        "mCustomScrollbar": [
            "jquery.mousewheel",
            "require-css!bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css"
        ],
        "underscore": {
            exports: "_"
        },
        "backbone": {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        "backbone.localStorage": ['backbone'],
        "Threejs":{
            exports: "THREE"
        }
    } 
});