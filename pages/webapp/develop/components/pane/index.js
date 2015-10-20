require('./style.styl')

module.exports = {
  template: require('./template.html'),
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