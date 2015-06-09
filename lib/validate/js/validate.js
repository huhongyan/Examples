"use strict";

(function(){
	define(["jquery", "lib/validate/js/rules", "lib/validate/js/lib/jquery.ba-resize", "require-css!lib/validate/css/style.css"], function($, rules){

		var Validate = function(){
			
			var global_options = {		//默认的属性
				container : 'body',
				required : undefined,
				validType : null,
				tipPlace : 'right',
					validTrigger:'blur',	//触发验证的事件
					cancelPrompt:'focus',	//取消提示事件
					missingMessage: 'This field is required.',
					invalidMessage : null,
					format : undefined,		//input的value的格式
					formatErrorMessage : 'format error',
					validCallback : null,	//通过验证的回调
					invalidCallback : null	//未通过验证的回调
				}, 
				_self = this;
				function _init(options){
					return _self.parser();
				}

				function validCallback(options,target){
					if(options.validCallback){
						options.validCallback(target);
					}else if(global_options.validCallback){
						global_options.validCallback(target);
					}
					hideTip(target);
				}

				function invalidCallback(options, target, msg){
					if(options.invalidCallback){
						if(options.invalidCallback(target, msg)){
							showTip(target);
						}
					}else if(!global_options.invalidCallback || global_options.invalidCallback(target, msg)){
						showTip(target);
					}
				}

				function validate(target){

					var options = $.data(target, 'validate').options;

					var box = $(target);
					var value = box.val();

					function setTipMessage(msg){
						$.data(target, 'validate').message = msg;
					}

				//标签可用性
				var disabled = box.attr('disabled');
				if (disabled == true || disabled == 'true'){
					return true;
				}

				//比输验证
				if (options.required || box.attr('required')){

					if(box.hasClass('validate-group')){
						var elems = box.find('input');

						if(!elems.length){
							return true;
						}

						for(var i = 0, len = elems.length; i < len; i++){
							if(elems[i].checked){
								validCallback(options, target);
								return true;
							}
						}
						
						box.addClass('validate-invalid');
						setTipMessage(options.missingMessage);
						invalidCallback(options, target, options.missingMessage);
						return false;
					}

					if (value == ''){
						box.addClass('validate-invalid');
						setTipMessage(options.missingMessage);
						invalidCallback(options, target, options.missingMessage);
						return false;
					}
				}

				//已定义规则验证
				var validType = options.validType || box.attr('validType');
				if (validType){
					var validTypes = validType.split('&');
					for(var i = 0, len = validTypes.length; i < len; i ++){
						var result = /([a-zA-Z_]+)(.*)/.exec(validTypes[i]);
						var rule = rules[result[1]];
						if (value && rule){
							var param = eval(result[2]);
							if (!rule['validator'](value, param)){
								box.addClass('validate-invalid');
								
								var message = rule['message'];
								if (param){
									for(var i=0; i<param.length; i++){
										message = message.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
									}
								}
								var msg = options.invalidMessage || message;
								setTipMessage(msg);
								invalidCallback(options, target, msg);
								return false;
							}
						}
					}
				}

				//文本域的内容格式正则验证
				var format = options.format || box.attr('format');
				if(format){
					try{
						var params = format.split('/'); 
						if(!!params[0]){
							throw new Error('Invalid flags supplied to RegExp');
						}
						var reg = new RegExp(params[1], params[2]);
						if(!value.match(reg)){
							box.addClass('validate-invalid');
							setTipMessage(options.formatErrorMessage);
							invalidCallback(options, target, options.formatErrorMessage);
							return false;
						}
					}catch(e){
						console.error(e.message);
						box.addClass('validate-invalid');
						setTipMessage(e.message);
						invalidCallback(options, target, e.message);
						return false;
					}
				}
				
				box.removeClass('validate-invalid');
				validCallback(options, target);
				return true;
			}

			function showTip(target){
				var box = $(target);
				var msg = $.data(target, 'validate').message;
				var options = $.data(target, 'validate').options; 
				var tip = $.data(target, 'validate').tip;
				var position = $(global_options.container).css('position');
				if(!position || position === 'static'){
					$(global_options.container).css('position', 'relative');
				}
				if (!tip){
					tip = $(
						'<div class="validate-tip ' + options.tipPlace + '">' +
						'<div class="validate-tip-pointer">' +
						'</div>' +
						'<div class="validate-tip-content">' +
						'</span>' +
						'</div>'
						).appendTo(global_options.container);
					$.data(target, 'validate').tip = tip;
				}
				tip.find('.validate-tip-content').html(msg);
				tip.css(tipPlace(box, options.tipPlace, tip)).css({display:'block'});

				$(document.body).resize(function(){
					tip.css(tipPlace(box, options.tipPlace, tip));
				});
			}

			function tipPlace(box, place, tip){

				var containerOffset = $(global_options.container).offset();
				var boxOffset = box.offset();
				var scrollH = 0;
				var scrollW = 0;

				if($(global_options.container).get(0) !== document.body && $(global_options.container).get(0) !== document.documentElement){
					scrollH = $(global_options.container).scrollTop();
					scrollW = $(global_options.container).scrollLeft();
				}

				var tipTop = boxOffset.top - containerOffset.top + scrollH;
				var tipLeft = boxOffset.left - containerOffset.left + scrollW;

				switch(place)
				{
					case 'left':
					var top = tipTop + (box.outerHeight() - tip.outerHeight())/2;
					return {
						left:tipLeft - tip.outerWidth(),
						top:top
					}
					break;
					case 'top':
					return {
						left:tipLeft + (box.outerWidth() - tip.outerWidth())/2,
						top:tipTop - tip.outerHeight()
					}
					break;
					case 'bottom':
					return {
						left:tipLeft + (box.outerWidth() - tip.outerWidth())/2,
						top:tipTop + box.outerHeight()
					}
					break;
					default:
					var top = tipTop + (box.outerHeight() - tip.outerHeight())/2;
					return {
						left:tipLeft + box.outerWidth(),
						top:top
					}
				}
			}
			
			function hideTip(target){
				var tip = $.data(target, 'validate').tip;
				if (tip){
					tip.css('display', 'none');
				}
			}

			function bindEvent(target){
				var box = $(target);
				var options = $.data(target, 'validate').options;
				
				var time = null;
				box.on(options.cancelPrompt, function(){
					clearTimeout(time);
					time = null;
					hideTip(target);
					
				}).on(options.validTrigger, function(){
					if (time){
						clearTimeout(time);
					}
					time = setTimeout(function(){
						validate(target);
					}, 200);
				});
			}

			function bindGroupEvent(target){
				var box = $(target);
				var time = null;
				box.on('click', 'input', function(){
					if(this.checked){
						clearTimeout(time);
						time = null;
						if(global_options.validCallback){
							global_options.validCallback(target);
						}
						hideTip(target);
					}else{
						if (time){
							clearTimeout(time);
						}
						time = setTimeout(function(){
							validate(target);
						}, 200);
					}
				})

			}

			function parseFn(string, $elem){
				var fn = window[$.trim(string)];
				if(typeof fn === 'function'){
					return fn
				}else{
					console.error(string + ' is undefined.');
				}
			}

			this.setCallback = function(validCallback, invalidCallback){
				global_options.validCallback = validCallback;
				global_options.invalidCallback = invalidCallback;
			}

			this.validate = function(target){
				validate(target);
			}

			this.isValidated = function(target, isall){

				var box = $(target), isValidated = true;
				if(box.hasClass('validate')){
					return validate(target);
				}else{
					var elems = box.find('.validate');
					for(var i = 0, len = elems.length; i < len; i++){
						if(!validate(elems[i])){
							//滚动条滚动到验证没通过的标签位置
							if(isValidated){
								var top = $(elems[i]).offset().top;
								var height = $(window).height();
								var scroll = $('body').scrollTop();
								if(top < scroll || (top - height) >= scroll){
									$('body').animate( {
										scrollTop : top
									}, 400);
								}
							}
							if(isall){
								isValidated = false;
								continue;
							}
							return false;
						}
					}
					return isValidated;
				}
			}

			this.rules = function(_rules){
				$.extend(rules, _rules);
			}

			this.parser = function(opts){

				if(opts && opts.validCallback){
					global_options.validCallback = opts.validCallback;
					opts.validCallback = null;
				}
				
				if(opts && opts.invalidCallback){
					global_options.invalidCallback = opts.invalidCallback;
					opts.invalidCallback = null;
				}

				if(opts && opts.container){
					global_options.container = opts.container;
				}

				$.each($(global_options.container).find('.validate'), function(i, elem){
					var t = $(this);
					$.data(this, 'validate', {
						options: $.extend({}, global_options, {
							required: t.attr('required'),
							validType: (t.attr('validType') || undefined),
							validTrigger: (t.attr('validTrigger') || undefined),
							cancelPrompt: (t.attr('cancelPrompt') || undefined),
							tipPlace : (t.attr('tipPlace') || undefined),
							missingMessage: (t.attr('missingMessage') || undefined),
							invalidMessage: (t.attr('invalidMessage') || undefined),
							format:(t.attr('format') || undefined),
							formatErrorMessage :(t.attr('formatErrorMessage') || undefined),
							invalidCallback : (t.attr('invalidCallback') && parseFn(t.attr('invalidCallback'), t) || undefined),
							validCallback : (t.attr('validCallback') && parseFn(t.attr('validCallback'), t) || undefined)
						}, opts)
					});

					if(t.hasClass('validate-group')){
						bindGroupEvent(elem)

					}else{
						bindEvent(elem);
					}	
				});

return this;
}

_init();
};

return new Validate();
});
})(this);