"use strict";
define([
    "jquery",
    "backbone",
    'handlebars.runtime',
    "pages/Index/templates/templates.amd",
    "domReady!"
],function($, Backbone, Handlebars, templates){

    return Backbone.View.extend({
        template: templates.headerBar,
        initialize: function(option){
            this.setElement(option.el);
        },
        render:function(){
            this.$el.html(this.template());

            return this;
        } ,
        events: {
            "click #sidebar-collapse": "leftNavBarCollapse"
        },
        leftNavBarCollapse: function(e){
            $('#accordion').toggleClass('menu-compact');
        }
    });
});