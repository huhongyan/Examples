"use strict";
require([
     "../../../requirejs_config", 
], function(){
    require(["jquery", "bootstrap", "mCustomScrollbar", "require-css!../css/index.css", "domReady!"], function($, bootstrap){
    	setHeight();
    	$(window).resize(function(){
    		setHeight();
    	});

    	//滚动条
    	$('#accordion .panel-group').mCustomScrollbar({
    		axis: "y",
    		theme: "minimal-dark",
    		scrollbarPosition: "outside"
    	});

        function setHeight(){
            var winH = window.innerHeight;
            var winW = window.innerWidth;
            var navTopH = $('.navbar-nav-top').outerHeight();
            var searchH = $('.navbar-search').outerHeight();
            console.log(navTopH);
            console.log(searchH);
            if(winW >= 768){
                $('#accordion').css('min-height', winH-navTopH);
                $('#page-container').height(winH-navTopH);
                $('#accordion .panel-group').css('max-height', winH-navTopH-searchH-20);
            }else{
                $('#accordion').height('auto');
                $('#page-container').height('auto');
            }
        }
    });
});
