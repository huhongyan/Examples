"use strict";
define([
    "jquery",
    "json!pages/Index/menus.json",
    "backbone",
    'handlebars.runtime',
    "pages/Index/templates/templates.amd",
    "pages/Index/js/collection/menus.js",
    "NProgress",
    "mCustomScrollbar",
    "domReady!"
],function($, menus, Backbone, Handlebars, templates, Menus, NProgress){

    return Backbone.View.extend({
        template: templates.leftNavbar,
        collection: new Menus(),
        initialize: function(option){
            this.setElement(option.el);
            this.$el.html(this.template());
            this.$list = this.$el.find('#leftNavbarGroup');
            this.pageContainer = option.pageContainer;

            //this.listenTo(this.collection, 'all', this.render);
        },
        render:function(){
            var self = this;
            //this.collection = menus;
            self.$list.html(templates.leftNavbarSubPanel({'menus': menus}));
            self.resize();

            self.$list.mCustomScrollbar({
                axis: "y",
                theme: "minimal-dark",
                scrollbarPosition: "outside"
            });

            //this.collection.fetch({
            //    success : function(collection){
            //        self.$list.html(templates.leftNavbarSubPanel({'menus': collection.toJSON()}));
            //        self.resize();
            //
            //        self.$list.mCustomScrollbar({
            //            axis: "y",
            //            theme: "minimal-dark",
            //            scrollbarPosition: "outside"
            //        });
            //    }
            //}, {reset: true});

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

            this.toggleLink($target);
        },
        toggleAloneMenu: function(e){
            var $target = $(e.currentTarget);

            this.clearActive();
            $target.parents('.panel:eq(0)').addClass('active');

            this.toggleLink($target);
        },
        clearActive: function(){
            this.$el.find('.active').removeClass('active');
        },
        toggleLink: function($target){
            this.pageContainer.get(0).src = $target.data('href');

            //进度条..
            NProgress.configure({
                parent: '#page-container'
            }).start();
            this.pageContainer.on('load', function(){
                NProgress.done();
            });

            // this.pageContainer
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
