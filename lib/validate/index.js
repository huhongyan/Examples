"use strict";

require([
     "../../requirejs_config", 
], function(){
    require(["jquery", "bootstrap", "lib/validate/js/validate"], function($, Bootstrap, Validate){

    	$(function(){
            
    		$('#b1').click(function(){
    			Validate.isValidated('#form');
    			
    		});
            $('#b2').click(function(){
                Validate.isValidated('#form', true);
                
            });

            $('#btn2').click(function(){
                Validate.setCallback(function(elem){
                    $(elem).css({
                        'border':'1px solid blue',
                        'box-shadow':'none'
                    });
                
                },function(elem,msg){
                    $(elem).css({
                        'border':'1px solid red',
                        'box-shadow': 'inset 0 1px 0 red,0 1px 2px red'
                    });
                    return true;
                });
            });

            $('#btn3').click(function(){
                Validate.setCallback(function(elem){
                    $(elem).css({
                        'border':'1px solid blue',
                        'box-shadow':'none'
                    });
                
                },function(elem,msg){
                    $(elem).css({
                        'border':'1px solid red',
                        'box-shadow': 'inset 0 1px 0 red,0 1px 2px red'
                    });
                });
            });
    	})
    
    });

});
