"use strict";
define([
    "jquery",
    "backbone",
    'handlebars.runtime',
    "pages/Index/templates/templates.amd",
    "./leftNavbarView.js",
    "domReady!"
],function($, Backbone, Handlebars, templates, LeftNavbarView){

    return Backbone.View.extend({
        template: templates.headerBar,
        // tagName: 'header',
        // className: "navbar navbar-default navbar-static-top navbar-nav-top",
        initialize: function(option){
            this.setElement(option.el);
        },
        render:function(){
            this.$el.html(this.template());
            !this.leftNavbarView && (this.leftNavbarView = new LeftNavbarView({'el': this.$el.find('#accordion')}));
            this.leftNavbarView.render();   //model... ?

            return this;
        } ,
        events: {
        },
    });
});