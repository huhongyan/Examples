webpackJsonp([1],{

/***/ 72:
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = {
	    template: __webpack_require__(73),
	    props: ['url', 'index', 'width', 'height'],
	    data: function(){
	        return {
	            seconds: 30,
	            refresh: 0,
	            isStart: false,
	            isEnd: false,
	            isCompleted: false,
	            conRatio: (this.width * 0.65 - 39)/(this.height * 0.8 - 39)
	        };
	    },
	    //directives: {
	    //    refresh: function(newValue){
	    //        this.isStart = false;
	    //        this.isEnd = false;
	    //        this.isCompleted = false;
	    //    }
	    //},
	    replace: true,
	    components: {
	        'app-timer': __webpack_require__(74),
	        'app-puzzle': __webpack_require__(78),
	        'app-pane': __webpack_require__(82),
	        'app-popup': __webpack_require__(86)
	    }
	}


/***/ },

/***/ 73:
/***/ function(module, exports) {

	module.exports = "<div class=\"view\" v-transition>\r\n    <app-timer seconds=\"{{* seconds}}\" refresh=\"{{refresh}}\" is-start=\"{{isStart}}\" is-end=\"{{@ isEnd}}\" width=\"{{width}}\" height=\"{{height * 0.2}}\"></app-timer>\r\n    <app-puzzle url=\"{{url}}\" refresh=\"{{refresh}}\" is-start=\"{{@ isStart}}\" is-end=\"{{@ isEnd}}\" is-completed=\"{{@ isCompleted}}\" width=\"{{width * 0.65}}\" height=\"{{height * 0.8}}\" con-ratio=\"{{conRatio}}\"></app-puzzle>\r\n    <app-pane url=\"{{url}}\" width=\"{{width * 0.35}}\" height=\"{{height * 0.8}}\" con-ratio=\"{{conRatio}}\"></app-pane>\r\n    <app-popup refresh=\"{{@ refresh}}\" is-start=\"{{@ isStart}}\" is-completed=\"{{@ isCompleted}}\" is-end=\"{{@ isEnd}}\" index=\"{{index}}\"></app-popup>\r\n</div>\r\n";

/***/ },

/***/ 74:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(75);

	module.exports = {
	  template: __webpack_require__(77),
	  replace: true,
	  props: {
	    seconds: {
	      type: Number,
	      required: true
	    },
	    isStart: {
	      type: Boolean,
	      required: true
	    },
	    isEnd: {
	      type: Boolean,
	      required: true
	    },
	    width: {
	      type: Number
	    },
	    height: {
	      type: Number,
	      required: true
	    },
	    refresh: {
	      type: Number
	    }
	  },
	  directives: {
	    refresh: function(refresh){
	      this.el && (this.el.className = 'timer-bar-info');
	    }
	  },
	  methods: {
	    animationEnd: function(ev){
	      target = ev.target;

	      target.className = '';
	      ev.targetVM.isEnd = true;
	    }
	  }
	}

/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(76);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/stylus-loader/index.js!./style.styl", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/stylus-loader/index.js!./style.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 76:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".timer {\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: -webkit-flex;\n  align-items: center;\n  padding: 0 15px;\n}\n.timer .timer-bar {\n  height: 20px;\n  width: 100%;\n  overflow: hidden;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);\n  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);\n}\n.timer .timer-bar .timer-bar-info {\n  height: 100%;\n  background-color: #5bc0de;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,0.15);\n  box-shadow: inset 0 -1px 0 rgba(0,0,0,0.15);\n}\n.timer .timer-bar .timer-bar-info.start {\n  -webkit-animation-name: timer;\n  -webkit-animation-timing-function: linear;\n  -webkit-animation-play-state: running;\n}\n.timer .timer-bar .timer-bar-info.paused {\n  -webkit-animation-play-state: paused;\n}\n@-webkit-keyframes timer {\n  form {\n    transform: translateX(0);\n  }\n  to {\n    transform: translateX(-100%);\n  }\n}\n@-moz-keyframes timer {\n  form {\n    transform: translateX(0);\n  }\n  to {\n    transform: translateX(-100%);\n  }\n}\n@-webkit-keyframes timer {\n  form {\n    transform: translateX(0);\n  }\n  to {\n    transform: translateX(-100%);\n  }\n}\n@-o-keyframes timer {\n  form {\n    transform: translateX(0);\n  }\n  to {\n    transform: translateX(-100%);\n  }\n}\n@keyframes timer {\n  form {\n    transform: translateX(0);\n  }\n  to {\n    transform: translateX(-100%);\n  }\n}\n", ""]);

	// exports


/***/ },

/***/ 77:
/***/ function(module, exports) {

	module.exports = "<div class=\"timer\" v-style=\"width: width + 'px', height: height + 'px'\">\r\n    <div class=\"timer-bar\">\r\n        <div v-refresh=\"refresh\" class=\"timer-bar-info\" v-on=\"webkitAnimationEnd: animationEnd\" v-class=\"start: isStart, paused: isEnd\" v-style=\"-webkit-animation-duration: seconds + 's'\"></div>\r\n    </div>\r\n</div>";

/***/ },

/***/ 78:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(79)

	module.exports = {
	  template: __webpack_require__(81),
	  props: ['url', 'width', 'height', 'conRatio', 'isStart', 'isEnd', 'isCompleted', 'refresh'],
	  computed: {
	    containerWidth: function(){
	      return this.width - 30;
	    },
	    containerHeight: function(){
	      return this.height - 30;
	    },
	    imgHeight: function(){
	      return this.containerHeight - 9;
	    },
	    imgWidth: function () {
	      return this.containerWidth - 9;
	    },
	    canvasHeight: function(){
	      return Math.floor(this.imgHeight / 3);
	    },
	    canvasWidth: function(){
	      return Math.floor(this.imgWidth / 3)
	    }
	  },
	  directives: {
	      refresh: function(newValue){
	        var vm = this.vm;

	        if(vm.selectedElem){
	          vm.selectedElem.className = '';
	          vm.selectedElem = null;
	        }

	        var img = new Image();
	        img.onload = function(){
	          var imgRatio = this.width / this.height;
	          vm._draw(imgRatio, img);
	        };

	        img.src = vm.url;
	      }
	  },
	  methods: {
	    touchItemStart: function(ev){

	      if(ev.touches.length > 1){
	        return true;
	      }
	      if(this.isEnd){
	        return true;
	      }

	      if(!this.selectedElem){
	        this.selectedElem = ev.target;
	        this.selectedElem.className = 'selected';

	        // 时间条开始
	        !this.isStart && (this.isStart = true);

	      }else{
	        var selectedEl = this.selectedElem,
	            target = ev.target;


	        var top = selectedEl.style.top;
	        var left = selectedEl.style.left;
	        var curIndex = selectedEl._curIndex;

	        selectedEl.style.top = target.style.top;
	        selectedEl.style.left = target.style.left;
	        selectedEl._curIndex = target._curIndex;
	        selectedEl.className = '';

	        this.selectedElem = null;

	        target.style.top = top;
	        target.style.left = left;
	        target._curIndex = curIndex;

	        if(this._isCompleted()){
	          this.isCompleted = this.isEnd = true;
	        }
	      }
	      return false;
	    },
	    touchItemEnd: function(){

	    },
	    _draw: function (imgRatio, img){
	      var vm = this;
	      var canvasVms = vm._disrupt(vm.$children);
	      var conRatio = vm.conRatio;
	      var imgUtilHeight,
	          imgUtilWidth,
	          canvasHeight = vm.canvasHeight,
	          canvasWidth = vm.canvasWidth;
	      if(imgRatio > conRatio){
	        imgUtilHeight = Math.floor(img.height / 3);
	        imgUtilWidth = Math.floor(img.height * conRatio / 3);
	      }else {
	        imgUtilWidth = Math.floor(img.width / 3);
	        imgUtilHeight = Math.floor(img.width / conRatio / 3);
	      }
	      for(var i= 0, len=canvasVms.length; i<len; i++){
	        var canvas = canvasVms[i].$el;
	        var index = canvas._curIndex;
	        canvas._index = i;
	        canvas.width = canvasWidth;
	        canvas.height = canvasHeight;
	        canvas.style.left = ((index % 3) * canvasWidth + 4) + 'px';
	        canvas.style.top = (Math.floor(index / 3) * canvasHeight + 4) + 'px';
	        var sx = (i % 3) * imgUtilWidth;
	        var sy = Math.floor(i / 3) * imgUtilHeight;
	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(img, sx, sy, imgUtilWidth, imgUtilHeight, 1, 1, canvasWidth - 2, canvasHeight - 2);
	      }
	    },
	    _disrupt: function(canvasVms){

	      for(var i= 0, len=canvasVms.length; i<len;i++){
	        canvasVms[i].$el._curIndex = i;
	      }

	      return canvasVms.sort(function(){
	        return Math.random()-0.5
	      });
	    },
	    _isCompleted: function(){
	      var canvasVms = this.$children;
	      for(var i= 0, len=canvasVms.length; i<len; i++){
	        var canvas = canvasVms[i].$el;
	        if(canvas._curIndex != canvas._index)
	          break;
	      }
	      if(i != len)
	        return false;

	      return true;
	    }
	  },
	  compiled: function(){

	  }
	}

/***/ },

/***/ 79:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(80);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/stylus-loader/index.js!./style.styl", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/stylus-loader/index.js!./style.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 80:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".puzzle {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  display: -webkit-flex;\n  justify-content: flex-end;\n  align-items: flex-start;\n}\n.puzzle .puzzle-container {\n  background-color: #fff;\n  border: 1px solid #ddd;\n  padding: 4px 3px 3px 4px;\n  position: relative;\n}\n.puzzle .puzzle-container canvas {\n  position: absolute;\n  transition: all 0.4s ease;\n}\n.puzzle .puzzle-container canvas.selected {\n  outline: 1px solid #12697b;\n}\n", ""]);

	// exports


/***/ },

/***/ 81:
/***/ function(module, exports) {

	module.exports = "<div class=\"puzzle\" v-refresh=\"refresh\" v-style=\"width: width + 'px', height: height + 'px'\">\r\n    <div class=\"puzzle-container\" v-style=\"width: containerWidth + 'px', height: containerHeight + 'px'\" >\r\n        <!--<img v-attr=\"src: url\" alt=\"拼图\" v-style=\"width: imgWidth + 'px', height: imgHeight + 'px'\"/>-->\r\n        <canvas  v-repeat=\"9\" v-on=\"touchstart: touchItemStart, touchend:touchItemEnd\"></canvas>\r\n    </div>\r\n</div>";

/***/ },

/***/ 82:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(83)

	module.exports = {
	  template: __webpack_require__(85),
	  replace: true,
	  props: ['url', 'width', 'height', 'conRatio'],
	  directives: {
	    resize: function (newValue, oldValue) {

	      if(!newValue){
	        return;
	      }

	      var canvas = this.el;
	      var vm = this.vm;

	      var imgWidth;
	      var imgHeight;
	      var conRatio = newValue;

	      var canvasWidth = vm.width - 60;
	      var canvasHeight = canvasWidth / conRatio;

	      var img = new Image();
	      img.onload = function () {
	        var imgRatio = this.width / this.height;

	        if (imgRatio > conRatio) {
	          imgHeight = img.height;
	          imgWidth = img.height * conRatio;
	        } else {
	          imgWidth = img.width;
	          imgHeight = img.width / conRatio;
	        }
	        canvas.width = canvasWidth;
	        canvas.height = canvasHeight;
	        var ctx = canvas.getContext("2d");
	        ctx.fillStyle = "#fff";
	        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	        ctx.drawImage(img, 0, 0, imgWidth, imgHeight, 2, 2, canvasWidth - 4, canvasHeight - 4);
	      };

	      img.src = vm.url;
	    }
	  }
	}

/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(84);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/stylus-loader/index.js!./style.styl", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/stylus-loader/index.js!./style.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 84:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".pane {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  display: -webkit-flex;\n  justify-content: center;\n  align-items: flex-end;\n  margin-bottom: 30px;\n}\n", ""]);

	// exports


/***/ },

/***/ 85:
/***/ function(module, exports) {

	module.exports = "<div class=\"pane\" v-style=\"width: width + 'px', height: height + 'px'\">\r\n  <canvas v-resize=\"conRatio\"></canvas>\r\n</div>";

/***/ },

/***/ 86:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(87);

	module.exports = {
	  template: __webpack_require__(89),
	  replace: true,
	  props: ['isEnd', 'isCompleted', 'index', 'refresh', 'isStart'],
	  methods: {
	    refreshPage: function(ev){
	      this.refresh += 1;
	      this.isEnd = false;
	      this.isCompleted = false;
	      this.isStart = false;
	      return false;
	    },
	    gotoNext: function(){
	      window.location.hash = '#' + (this.index + 1);
	      return false;
	    }
	  }
	}

/***/ },

/***/ 87:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(88);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/stylus-loader/index.js!./style.styl", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./../../../../../node_modules/stylus-loader/index.js!./style.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 88:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".popup {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  display: -webkit-flex;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(0,0,0,0.1);\n  transition: all 0.4s ease;\n}\n.popup.fade-enter {\n  opacity: 0;\n  -webkit-transform: translate3d(0, -100%, 0);\n  transform: translate3d(0, -100%, 0);\n}\n.popup.fade-leave {\n  opacity: 0;\n  -webkit-transform: translate3d(0, 100%, 0);\n  transform: translate3d(0, 100%, 0);\n}\n.popup .info-container {\n  width: 80%;\n  height: 80%;\n  background-color: #fff;\n}\n.popup .info-container .btn {\n  display: inline-block;\n  text-align: center;\n  vertical-align: middle;\n  border: 1px solid #ddd;\n  white-space: nowrap;\n  padding: 6px 12px;\n  border-radius: 4px;\n  user-select: none;\n}\n", ""]);

	// exports


/***/ },

/***/ 89:
/***/ function(module, exports) {

	module.exports = "<div class=\"popup\" v-show=\"isEnd\" v-transition=\"fade\">\r\n    <div class=\"info-container\">\r\n        <p > {{isCompleted ? '恭喜你！': '失败了！'}}</p>\r\n        <botton class=\"btn btn-refresh\" v-on=\"touchstart: refreshPage\">重新开始</botton>\r\n        <botton class=\"btn btn-next\" v-show=\"isCompleted\" v-on=\"touchstart: gotoNext\">下一关</botton>\r\n    </div>\r\n</div>";

/***/ }

});