"use strict";

require([
     "../../requirejs_config", 
], function(){
    require(["jquery", "pages/css-3D-image-slider/js/3DImageSlider"], function($, Slider){

    	$(function(){
            
    		var slider = new Slider({
                target:'#css3dimageslider',
                opacity:0.7,
                height : 280,
                perspective:1800,
                perspectiveOrigin : '50% -200px',
                width : 450,
                transitionDuration : 1,
                hoverSlide : function(curIndex){
                    $("#css3dimagePager li").removeClass("active");
                    $("#css3dimagePager li:eq(" + curIndex + ")").addClass("active");
                }
            });

            $('#css3dimagePager li').click(function(){
                var $self = $(this);
                slider.sliding($self.index(), "left", function(curIndex){
                    $("#css3dimagePager li").removeClass("active");
                    $self.addClass("active");
                });
            });     
            
    	})
    
    });

});
