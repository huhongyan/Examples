require('./style.styl');

module.exports = {
  template: require('./template.html'),
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