require('./style.styl')

module.exports = {
  template: require('./template.html'),
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