/**
 * Created by Administrator on 2015/11/24.
 */
'use strict';
;(function(){

    var Slide = function(options){
        return new Slide.prototype.init(options);
    };

    Slide.prototype.init = function(options){
        var imgArray = this.__imgArray = $.merge([], options.imgArray),
            duration = this.__duration = options.duration || 2,
            $container = this.$container = $(document.createElement("div"));

        this.$imgList = null;
        this.$paginationList = null;
        this.__imgWidth = window.innerWidth - 170;
        this.deleteCallback = options.deleteCallback || function(){};

        createHTML.call(this, $container, imgArray, duration);
    };

    Slide.prototype.init.prototype = Slide.prototype;

    Slide.prototype.open = function(currentIndex){
        var length = this.__imgArray.length,
            index = parseInt(currentIndex);
        index = this.__currentIndex = index ? index < 0 ? 0 : index > length - 1 ? length - 1 : index : 0;
        if(!length){

        }else {
            adjust.call(this, index, length);
            this.$container.fadeIn();
        }
    };

    Slide.prototype.close = function(){
        closeSlide.call(this);
    };

    Slide.prototype.resize = function(){
        this.__imgWidth = window.innerWidth - 170;
        adjust.call(this, this.__currentIndex, this.__imgArray.length);
    };

    Slide.prototype.slideImg = function(isPrev){
        slideImg.call(this, isPrev);
    };

    Slide.prototype.getImgArray = function(){
        return $.merge([], this.__imgArray);
    };

    this.Slide = Slide;

    function createHTML($container, imgArray, duration){
        var html = ['<button class="slide-btn btn-close"></button>',
            '<button class="slide-btn btn-delete"></button>',
            '<button class="slide-btn btn-prev"></button>',
            '<button class="slide-btn btn-next"></button>',
            '<div class="slide-img-container">',
            '<ul class="slide-img" style="transition-duration: ' + duration + 's"></ul>',
            '</div>',
            '<div class="slide-pagination-container">',
            '<ul class="slide-pagination" style="transition-duration: ' + duration + 's"></ul></div>'];

        $container.addClass('slide-container').append(html.join('')).appendTo(document.body);
        fillItems.call(this, $container, imgArray);
        bindEvent.call(this, $container);
    }

    function fillItems($container, imgArray){
        var len = imgArray.length;
        if(len > 0) {
            var $imgList = this.$imgList = $container.find(".slide-img"),
                $paginationList = this.$paginationList = $container.find(".slide-pagination"),
                imgListHtml = [],
                paginationListHtml = [];

            for(var i = 0; i < len; i++){
                var item = imgArray[i];
                imgListHtml.push('<li class="slide-img-item" style="background-image: url('+ item.src +')"></li>');
                paginationListHtml.push('<li class="slide-pagination-item"><span class="num-page">'+ (i + 1) +'</span>/<span class="num-total">' + len + '</span><span class="slide-title">'+ item.title +'</span></li>');
            }
            $imgList.append(imgListHtml.join(""));
            $paginationList.append(paginationListHtml.join(""));
        }
    }

    function bindEvent($container){
        var slide = this;
        $container.on("click", ".btn-prev:not(.disable)", function (evt) {
            slideImg.call(slide, true);
        }).on("click", ".btn-next:not(.disable)", function (evt) {
            slideImg.call(slide, false);
        }).on("click", ".btn-delete", function (evt) {
            deleteImg.call(slide);
        }).on("click", ".btn-close", function (evt) {
            closeSlide.call(slide);
        });
    }

    function slideImg(isPrev){
        var currentIndex = this.__currentIndex,
            length = this.__imgArray.length;
        if(isPrev)
            this.__currentIndex = --currentIndex;
        else
            this.__currentIndex = ++currentIndex;

        adjust.call(this, currentIndex, length);
    }

    function adjust(currentIndex, length){
        var $imgList = this.$imgList,
            $paginationList = this.$paginationList,
            imgWidth = this.__imgWidth;

        $imgList.css("transform", "translate3d(" + -(imgWidth * currentIndex) +"px, 0, 0)");
        $paginationList.css("transform", "translate3d(0, " + -(42 * currentIndex) +"px, 0)");

        disable.call(this, currentIndex, length);
    }

    function disable(currentIndex, length){
        var $container = this.$container;
        if(currentIndex == length -1){
            if(length == 1){
                $container.find(".btn-prev").addClass("disable");
                $container.find(".btn-next").addClass("disable");
            }else {
                $container.find(".btn-next").addClass("disable");
                $container.find(".btn-prev").removeClass("disable");
            }
        }else if(currentIndex == 0){
            $container.find(".btn-prev").addClass("disable");
            $container.find(".btn-next").removeClass("disable");
        }else{
            $container.find(".btn-prev").removeClass("disable");
            $container.find(".btn-next").removeClass("disable");
        }
    }

    function closeSlide(){
        this.$container.fadeOut();
    }

    function deleteImg(){
        var currentIndex = this.__currentIndex,
            imgArray = this.__imgArray,
            length = imgArray.length,
            deletedImg = null,
            deletedIndex;

        if(!imgArray.length){
            return;
        }else{
            deletedIndex = currentIndex;
            deletedImg = imgArray[currentIndex];

            for(var i = currentIndex; i < length - 1;){
                imgArray[i] = imgArray[++i];
            }
            imgArray.pop();
            var $imgList = this.$imgList,
                $paginationList = this.$paginationList;

            length = imgArray.length;
            $imgList.find('.slide-img-item').eq(currentIndex).remove();
            $paginationList.find('.slide-pagination-item:eq('+ currentIndex +')').remove()
                .end().find('.slide-pagination-item').each(function(i, el){
                    $(el).find('.num-page').text(i + 1).end().find('.num-total').text(length);
            });
        }

        if(!length){
            closeSlide.call(this);
        }else if(currentIndex >= length) {
            this.__currentIndex = --currentIndex;
            adjust.call(this, currentIndex, length);
        }else {
            disable.call(this, currentIndex, length);
        }

        // callback
        this.deleteCallback(deletedIndex, deletedImg);
    }

}).call(window);