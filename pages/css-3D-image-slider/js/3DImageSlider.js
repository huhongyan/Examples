"use strict";

(function(){
	define(["jquery", "require-css!pages/css-3D-image-slider/css/style.css"], function($){

		var imageSlider3D = function(options){

			options = $.extend({
				target : undefined,				//插件作用的ul
				transitionDuration : undefined, //动画过渡时间 默认1s  
				perspective : 800,				//景深 
				perspectiveOrigin : '50% 100px',	//设置 3D 元素的基点位置
				opacity : undefined,			//li的透明度
				height : 280,
				width : 450,
				hoverSlide : false				//鼠标悬浮滑动, 默认false， 可以赋值ture，或者function（滑动之后的callback）

			}, options);

			var rotateYUnit = 0,	//单位角度
				$target = $(options.target),
				_self = this,
				pageNum = 0;	


			//检验target是不是ul标签
			function validTarget($target){

				if(!$target.length){
					return false;
				}

				if($target.is('ul')){
					return true;
				}

				//是否需要判断唯一性？

				return false;
			}

			//构建html结构
			function buildHTML(options){

				if(!validTarget($target)){
					return ;
				}

				$target.css({
					"width" : options.width,
					"height" : options.height,
					"-webkit-transform":"rotateY(0deg)", 
					"-moz-transform":"rotateY(0deg)", 
					"-ms-transform":"rotateY(0deg)", 
					"transform":"rotateY(0deg)"
				}).data('data', {
					rotateY : 0,
					index : 0
				}).wrap('<div class="css3dimageslider"></div>').parent().css({
					"-webkit-perspective": options.perspective,
					"-moz-perspective": options.perspective,
					"-ms-perspective": options.perspective,
					"perspective": options.perspective,
					"-webkit-perspective-origin": options.perspectiveOrigin, 
				  	"-moz-perspective-origin": options.perspectiveOrigin,
				  	"-ms-perspective-origin": options.perspectiveOrigin,
				  	"perspective-origin": options.perspectiveOrigin,
					"width" : options.width,
					"height" : options.height
				});

				//动画过渡时间
				if(options.transitionDuration){
					var dur = options.transitionDuration + "s";
					$target.css({
						"-webkit-transition-duration" : dur,
						"-moz-transition-duration" : dur,
						"-ms-transition-duration" : dur,
						"transition-duration" : dur
					});
				}

				//ul的透明度
				if(options.opacity){
					$target.css('opacity', options.opacity);
				}

				//transform
				var arr = $target.children('li');

				pageNum = arr.length;
				rotateYUnit = 360 / pageNum;

				$.each(arr, function(index, elem){
					var transform = "rotateY(" + (index * rotateYUnit) + "deg) translateZ(" + options.width/(2 * Math.tan(Math.PI / 360 * rotateYUnit)) +"px)";
					$(elem).css({
						"-webkit-transform" : transform,
						"-moz-transform": transform,
						"-ms-transform": transform,
						"transform": transform,
						"width" : options.width,
						"height" : options.height
					});
				});

				//绑定事件
				bindEvent();
			}

			//绑定事件
			function bindEvent(){

				//鼠标悬浮滑动
				if(options.hoverSlide){

					var callback = $.isFunction(options.hoverSlide) ? options.hoverSlide : undefined;

					$target.hover(function(e){

		                $target.data('pageX', e.pageX);

		            },function(e){

		                var pageX = $target.data('pageX') - e.pageX;

		                if(pageX < -10){
		                    _self.slideToRight(1, callback);
		                }else if(pageX > 10){
		                    _self.slideToLeft(1, callback);
		                } 
		            }); 
				}
			}

			function transform(rotateY){
				var transform = "rotateY("+ rotateY +"deg)"; 
				$target.css({
					"-webkit-transform":transform, 
					"-moz-transform":transform, 
					"-ms-transform":transform, 
					"transform":transform
				});
			}

			//滑动显示index位置的li
			_self.sliding = function(index, direction, callback){
				
				if (!$.isNumeric(index)) {
					return;
				}

				var data = $target.data('data');

				//向左转到index
				if(direction === "left"){
					var count = index - data.index;
					var num = count < 0 ? (count + pageNum) : count;

					_self.slideToLeft(num, callback);

				//向右转到index
				}else if(direction === "right"){
					var count = data.index - index;
					var num = count < 0 ? (count + pageNum) : count;

					_self.slideToRight(num, callback);
				}
			}

			//向左转动
			_self.slideToLeft = function(num, callback){
				if (!$.isNumeric(num)) {
					num = 1;
				}
				var data = $target.data('data');

				data.rotateY = data.rotateY - rotateYUnit * num;

				var count = data.index + num;
				data.index = count >= pageNum ? (count - pageNum) : count;

				transform(data.rotateY);

				if(callback){
					callback(data.index);
				}
			}

			//向右转动
			_self.slideToRight = function(num, callback){
				if (!$.isNumeric(num)) {
					num = 1;
				}
				var data = $target.data('data');

				data.rotateY = data.rotateY + rotateYUnit * num;

				var count = data.index - num;
				data.index = count < 0 ? (count + pageNum) : count;
				
				transform(data.rotateY);

				if(callback){
					callback(data.index);
				}
			}


			buildHTML(options);
		}

		return imageSlider3D;
	});
})(this);