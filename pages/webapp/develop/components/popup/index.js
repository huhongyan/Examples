require('./style.styl');

module.exports = {
  template: require('./template.html'),
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