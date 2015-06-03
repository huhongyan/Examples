"use strict";
define([
	"pages/Index/config",
  	"backbone"
], function(config, Backbone) {

    return Backbone.Model.extend({
    	url: config.url,
    	defaults: {
			title: '',
			href: '',
			active: false
		}
    });
}); 