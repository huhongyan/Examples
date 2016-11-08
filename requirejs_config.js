/**
 * 全局的模块配置文件
 * @authors Huhy (307036736@qq.com)
 * @date    2015-05-28 11:59:12
 * @version $Id$
 */
require.config({ 
    baseUrl: "/Examples/",
    paths: {
    	"jquery": "bower_components/jquery/dist/jquery.min",
    	"domReady": "bower_components/domReady/domReady",
    	"require-css": "bower_components/require-css/css.min",
        "json": "bower_components/requirejs-json/json",
        "text": "bower_components/requirejs-text/text",
    	"handlebars": "node_modules/handlebars/dist/handlebars.min",
    	"handlebars.runtime": "lib/handlebars.runtime.amd.min",
        "handlebars_ext": "lib/handlebars_ext",
        "underscore":"bower_components/underscore/underscore-min",
        "backbone": "bower_components/backbone/backbone-min",
        "backbone.localStorage": "bower_components/backbone.localStorage/backbone.localStorage-min",
    	// "angular": "bower_components/angular/angular.min",
    	"bootstrap": "bower_components/bootstrap/dist/js/bootstrap.min",
    	"Font-Awesome":"bower_components/Font-Awesome/css/font-awesome.min",
    	"mCustomScrollbar": "bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min",
        "jquery.mousewheel": "bower_components/jquery-mousewheel/jquery.mousewheel.min",
        "NProgress": "bower_components/nprogress/nprogress",
        "Threejs": "bower_components/three.js/build/three.min",
        "Statsjs": "bower_components/stats.js/build/stats.min",
        "Tweenjs": "bower_components/tween.js/build/tween.min",

        /*  Vue  */
        "Vue": "bower_components/vue/dist/vue"

    }, 
    shim: {
        'json': ['text'],
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
        "NProgress": {
            deps: ['require-css!bower_components/nprogress/nprogress.css'],
            exports: 'NProgress'
        },
        "Threejs":{
            exports: "THREE"
        },
        "Statsjs":{
            exports: "Stats"
        },
        "Tweenjs":{
            exports: "TWEEN"
        }
    } 
});