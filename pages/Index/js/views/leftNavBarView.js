"use strict";
define([
    "jquery",
    "backbone",
    'handlebars.runtime',
    "pages/Index/templates/templates.amd",
    "../collection/menus.js",
    "mCustomScrollbar",
    "domReady!"
],function($, Backbone, Handlebars, templates, Menus){

    return Backbone.View.extend({
        template: templates.leftNavbar,
        collection: new Menus(),
        initialize: function(option){
            // var self = this;

            this.setElement(option.el);
            this.$el.html(this.template());
            this.$list = this.$el.find('#leftNavbarGroup');

            //this.listenTo(this.collection, 'all', this.render);

            
        },
        render:function(){
            var self = this;
            this.collection.fetch({
                success : function(collection){
                    self.$list.html(templates.leftNavbarSubPanel({'menus': collection.toJSON()}));
                    self.resize();
                }
            }, {reset: true});

            return this;
        } ,
        events: {
            "click .navbar-slider": "navbarSlider"
        },
        navbarSlider: function(){
            $('body').toggleClass('left-navbar-hidden');
        },
        resize: function(){
            var self = this;
            $(window).resize(function(){
                self.setHeight();
                //滚动条 -- 在每次窗口变化时重新渲染
                self.$list.mCustomScrollbar({
                    axis: "y",
                    theme: "minimal-dark",
                    scrollbarPosition: "outside"
                });
            });

            $(window).resize();
        },
        setHeight: function(){
            var winH = window.innerHeight;
            var winW = window.innerWidth;
            var navTopH = $('.navbar-nav-top').outerHeight();
            var searchH = $('.navbar-search').outerHeight();
            var contentH = winH-navTopH;
            var leftNavH = winH-navTopH-searchH-20;
            if(winW >= 768){
                $('#accordion').css('min-height', contentH);
                $('#page-container').height(contentH);
                $('#leftNavbarGroup').css('max-height', leftNavH).find('.mCustomScrollBox').css('max-height', leftNavH);
            }else{
                $('#accordion').height('auto');
                $('#page-container').height('auto');
            }
        }
    });
});