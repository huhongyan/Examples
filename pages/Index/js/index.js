"use strict";
require([
     "../../../requirejs_config"
], function(){
    require(["jquery", "bootstrap", "mCustomScrollbar", "require-css!../css/index.css", "domReady!"], function($, bootstrap){
    	setHeight();
    	$(window).resize(function(){
    		setHeight();
    	});

    	//滚动条
    	$('#leftNavbarGroup').mCustomScrollbar({
    		axis: "y",
    		theme: "minimal-dark",
    		scrollbarPosition: "outside"
    	});

    	//隐藏侧边栏事件
    	$('.navbar-slider').off().on('click', function(){
    		$('body').toggleClass('left-navbar-hidden');
    	});

        function setHeight(){
            var winH = window.innerHeight;
            var winW = window.innerWidth;
            var navTopH = $('.navbar-nav-top').outerHeight();
            var searchH = $('.navbar-search').outerHeight();
            var contentH = winH-navTopH;
            var leftNavH = winH-navTopH-searchH-20;
            if(winW >= 768){
                $('#accordion').css('min-height', contentH);
                $('#page-container').height(contentH);
                $('#leftNavbarGroup').css('max-height', leftNavH);
            }else{
                $('#accordion').height('auto');
                $('#page-container').height('auto');
            }
        }
    });
});
