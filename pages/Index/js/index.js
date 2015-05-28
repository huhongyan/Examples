"use strict";
require([
     "../../../requirejs_config", 
], function(){
    require(["jquery", "bootstrap", "require-css!../css/index.css", "domReady!"], function($, bootstrap){
    	setHeight();
    	$(window).resize(function(){
    		setHeight();
    	});

        function setHeight(){
            var winH = window.innerHeight;
            var winW = window.innerWidth;
            if(winW >= 768){
                $('#accordion').css('min-height', winH-50);
                $('#page-container').css('min-height', winH-50);
            }else{
                $('#accordion').css('min-height', 0);
                $('#page-container').css('min-height', 0);
            }
        }
    });
});
