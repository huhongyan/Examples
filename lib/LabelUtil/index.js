"use strict";
require([
     "../../requirejs_config",
], function(){
    require(["jquery", "./js/labelUtil.js"], function($, LabelUtil){
    	$(function(){
    		new LabelUtil({
                selector: '#btn1',
                labelType: '11',
                saveCallback: function(dialog, opts){
                    //TODO
                }
            });
    	})
    	
    });

});
