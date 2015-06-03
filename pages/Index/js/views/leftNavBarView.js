"use strict";
define([
    "jquery",
    "backbone",
    'handlebars.runtime',
    "pages/Index/templates/templates.amd",
    "../collection/menus.js",
    "domReady!"
],function($, Backbone, Handlebars, templates, Menus){

    return Backbone.View.extend({
        template: templates.leftNavbar,
        collection: new Menus(),
        initialize: function(option){
            this.setElement(option.el);
            this.$el.html(this.template());
            this.$list = this.$el.find('#leftNavbarGroup');

            this.listenTo(this.collection, 'all', this.render);

            this.collection.fetch({
                success : function(collection){

                }
            });
            //}, {reset: true});
        },
        render:function(){
            this.$list.html(templates.leftNavbarSubPanel({'menus': this.collection.toJSON()}));

            return this;
        } ,
        events: {
        },
    });
});