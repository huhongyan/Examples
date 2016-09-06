"use strict";
define([
    "jquery",
    "backbone",
    'handlebars.runtime',
    "pages/Index/templates/templates.amd",
    "./pages/Index/headerView.js",
    "./pages/Index/leftNavBarView.js",
    "domReady!"
],function($, Backbone, Handlebars, templates, HeaderView, LeftNavbarView){

    return Backbone.View.extend({
        template: templates.main,
        el: 'body',
        initialize: function(option){
            this.$el.html(this.template());
            this.$pageContainer = this.$el.find('#rightcontainer');
        },
        render: function(){
            !this.headerView && (this.headerView = new HeaderView({'el': this.$el.find('header')}).render());
            !this.leftNavbarView && (this.leftNavbarView = new LeftNavbarView({'el': this.$el.find('#accordion'), "pageContainer": this.$pageContainer}).render());

            return this;
        }
    });
});
