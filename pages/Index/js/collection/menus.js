"use strict";
define([
  	"pages/Index/config",
  	"backbone",
  	"backbone.localStorage",
  	"../models/menu.js"
], function(config, Backbone, LocalStorage, Menu) {

    return Backbone.Collection.extend({
    	url: config.url,
    	model: Menu,
    	// localStorage: new LocalStorage('example-menus')
    });
}); 