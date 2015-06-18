define(function() {
	Date.prototype.format = function (format){
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		}
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o)
		{
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
	String.prototype.startWith = function(str){var t=this;return t.indexOf(str) == 0;};
	String.prototype.endWith = function(str){var t = this;return t.substring(t.length-str.length,t.length) == str;};
	var locallanguage = ((""+window.navigator.language).startWith("en")?"en":"zh");
	var rt = {
		/**
		获取语言环境(zh,en)
		**/
		getLanguage: function() {
			return locallanguage;
		},
		/**
		标准时间格式,适用适应语言
		**/
		formatDate: function (date) {
			if(typeof date !="undefined" && date !="") {
				var rtdate = "";
				if ("en"== locallanguage) {
					//dd/MM/yyyy HH:mm
					rtdate = new Date(date).format('MM/dd/yyyy hh:mm');
				} else {
					rtdate = new Date(date).format('yyyy-MM-dd hh:mm');
				}
				if (rtdate.endWith(" 00:00")) {
					rtdate = rtdate.substr(0,10);
				}
				return rtdate;
			} else {
				return "";
			}
		},
		/**
		短时间
		**/
		shortFormatDate: function (date) {
			if(typeof date !="undefined" && date !="") {
				var rtdate = "";
				if ("en"== locallanguage) {
					rtdate = new Date(date).format('MM/dd HH:mm');
				} else {
					rtdate = new Date(date).format('MM-dd hh:mm');
				}
				return rtdate;
			} else {
				return "";
			}
		},
		/**
		
		**/
		getDate2LongTime: function(date) {
			return Date.parse(date)
		},
		Now: function() {
			return new Date();
		},
		changeOneDecimal: function(floatvar) {
			var f_x = parseFloat(floatvar);
			if (isNaN(f_x)) return "";
			var f_x = Math.round(floatvar*10)/10;
			return f_x;
		},
		getDiffDate: function(endDate,rtnType) {
			var startT = rt.getDate2LongTime(new Date());
			var ss=(startT-endDate)/(1000);//共计秒数
			var mm = ss/60;//共计分钟数
			var hh= ss/3600;//共计小时数
			var dd= hh/24;//共计天数
			if(rtnType=="ss") {
				return rt.changeOneDecimal(ss);
			} else if(rtnType=="hh") {
				return rt.changeOneDecimal(hh);
			} else if(rtnType=="mm") {
				return rt.changeOneDecimal(mm);
			} else if(rtnType=="dd") {
				return rt.changeOneDecimal(dd);
			} else {
				return rt.changeOneDecimal(dd);
			}
		},
		/**
		 * ldate : long for Date
		 * jet_long: jet_lag for WHSE
		 **/
		getDateForPs:function(ldate,jet_long) {
			return new Date((ldate+ jet_long) + (new Date().getTimezoneOffset()*60*1000) );
		},
		/**
		 * ldate : long for Date
		 * sFormat: 'yyyy-MM-dd'
		 * jet_long: jet_lag for WHSE
		 **/
		getFormartDateStringForPs: function(ldate,sFormat,jet_long) {
			return new Date( (ldate+jet_long) + (new Date().getTimezoneOffset()*60*1000) ).format(sFormat);
		}
	}
	return rt;
});