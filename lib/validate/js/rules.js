"use strict";

(function(){
	define([], function(){
		return {
			email:{
				validator: function(value){
					return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
				},
				message: 'Please enter a valid email address.'
			},
			url: {
				validator: function(value){
					return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
				},
				message: 'Please enter a valid URL.'
			},
			length: {
				validator: function(value, param){
					var len = $.trim(value).length;
					return len >= param[0] && len <= param[1]
				},
				message: 'Please enter a value between {0} and {1}.'
			},
			IdCard : {
			    validator:function(value){
			    	if(0 < value.length && 18 == value.length){
				    	iW = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
				    	iSum = 0;
				    	for(var i=0;i<17;i++){
				    	    iC = value.charAt(i) ;
				    	    iVal = parseInt(iC);
				    	    iSum += iVal * iW[i];
				    	}
				    	iJYM = iSum % 11;
				    	var sJYM = '';
				    	if(iJYM == 0) sJYM = "1";
				    	else if(iJYM == 1) sJYM = "0";
				    	else if(iJYM == 2) sJYM = "x";
				    	else if(iJYM == 3) sJYM = "9";
				    	else if(iJYM == 4) sJYM = "8";
				    	else if(iJYM == 5) sJYM = "7";
				    	else if(iJYM == 6) sJYM = "6";
				    	else if(iJYM == 7) sJYM = "5";
				    	else if(iJYM == 8) sJYM = "4";
				    	else if(iJYM == 9) sJYM = "3";
				    	else if(iJYM == 10) sJYM = "2";
				    	
				    	var cCheck = value.charAt(17).toLowerCase();
				    	
				    	if( cCheck != sJYM ){
				    	    return false;
				    	}else{
				    	    return true;
				    	}
			    	}else{
			    		return false;
			    	}
			    },
		        message : 'The second generation id card number format is not correct or id number error.' 
		    },
		    minLength: {
		        validator: function(value, param){
		            return value.length >= param[0];
		        },
		        message: 'Please enter at least {0} characters.'
		    },
		    phone : {
		        validator : function(value) { 
		            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value); 
		        }, 
		        message : 'Format is not correct, please use the following format:020-88888888' 
		    }, 
		    mobile : {
		        validator : function(value) { 
		            return /^(13|15|18|14)\d{9}$/i.test(value); 
		        }, 
		        message : 'Mobile phone number format is not correct.' 
		    }, 
		    phoneOrMobile : {
		        validator : function(value) { 
		            return /^(13|15|18|14)\d{9}$/i.test(value) || /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value); 
		        }, 
		        message : 'Please enter the correct landline telephone or mobile phone number.' 
		    }, 
		    intOrFloat : {
		        validator : function(value) { 
		            return /^\d+(\.\d+)?$/i.test(value); 
		        }, 
		        message : 'Please enter the Numbers, and ensure the correct format.' 
		    }, 
		    integer : {
		        validator : function(value) { 
		            return /^[+]?[1-9]+\d*$/i.test(value); 
		        }, 
		        message : 'please input an integer.' 
		    }, 
		    chinese : {
		        validator : function(value) { 
		            return /[\u4E00-\u9FA5\uF900-\uFA2D]/i.test(value); 
		        }, 
		        message : 'Please type in Chinese.' 
		    }, 
		    english : {
		        validator : function(value) { 
		            return /^[A-Za-z]+$/i.test(value); 
		        }, 
		        message : 'Please enter the English.' 
		    },
		    zip : {
		        validator : function(value) { 
		            return /^[1-9]\d{5}$/i.test(value); 
		        }, 
		        message : 'The postal code format is not correct.' 
		    }, 
		    ip : { 
		        validator : function(value) { 
		            return  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/.test(value); 
		        }, 
		        message : 'The IP address format is not correct.' 
		    }
		};
	})
})(this);