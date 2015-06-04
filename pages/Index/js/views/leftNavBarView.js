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

                    self.$list.mCustomScrollbar({
                        axis: "y",
                        theme: "minimal-dark",
                        scrollbarPosition: "outside"
                    });
                }
            }, {reset: true});

            return this;
        } ,
        events: {
            "click .navbar-slider": "navbarSlider",
            "click .nav-left-sub>li": "toggleSubMenu",
            "click .alone": "toggleAloneMenu"
        },
        navbarSlider: function(e){
            $('body').toggleClass('left-navbar-hidden');
        },
        toggleSubMenu: function(e){
            var $target = $(e.currentTarget);

            this.clearActive();
            $target.addClass('active').parents('.panel:eq(0)').addClass('active');
        },
        toggleAloneMenu: function(e){
            var $target = $(e.currentTarget);

            this.clearActive();
            $target.parents('.panel:eq(0)').addClass('active');
        },
        clearActive: function(){
            this.$el.find('.active').removeClass('active');
        },
        resize: function(){
            var self = this;
            $(window).resize(function(){
                self.setHeight();
            });

            $(window).resize();
        },
        setHeight: function(){
            var winH = window.innerHeight;
            var winW = window.innerWidth;
            var searchH = $('.navbar-search').outerHeight();
            var leftNavH = $('#accordion').height() - searchH;
            if(winW >= 768){
                $('#leftNavbarGroup').css('max-height', leftNavH).find('.mCustomScrollBox').css('max-height', leftNavH);
            }else{
                $('#leftNavbarGroup').css('max-height', 'auto').find('.mCustomScrollBox').css('max-height', 'auto');
            }
        }
    });
});