
module.exports = {
    template: require('./template.html'),
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
        'app-timer': require('../../components/timer'),
        'app-puzzle': require('../../components/puzzle'),
        'app-pane': require('../../components/pane'),
        'app-popup': require('../../components/popup')
    }
}
