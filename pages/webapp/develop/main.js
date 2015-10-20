// With proper loader configuration you can load,
// pre-process and insert css directly with require().
// See webpack.config.js for details.  
require('./main.styl');

var Vue = require('vue');

var app = new Vue({
    el: '#app',
    data: {
        view: 'page-a',
        currentIndex: 1,
        isVertical: true
    },
    template: '#main_temp',
    computed: {
        url: function(){
            return 'image/' + this.currentIndex + '.jpg';
        },
        height: function(){
            return window.innerWidth;
        },
        width: function(){
            return window.innerHeight;
        }
    },
    components: {
        // define the main pages as async components.
        'page-a': function(resolve) {
            require(['./views/a'], resolve)
        },
        'page-b': function(resolve) {
            require(['./views/a'], resolve)
        }
    }
})

/**
 * Some really crude routing logic here, just for
 * demonstration purposes. The key thing to note here is
 * that we are simply changing the view of the root app -
 * Vue's async components and Webpack's code splitting will
 * automatically handle all the lazy loading for us.
 */
//
function route() {
    var hash = parseInt(window.location.hash.slice(1)) || 1;
    app.currentIndex = hash;
    app.view = hash%2 ? 'page-a':'page-b';
}

function changeOrientation(){
    var ori = window.orientation;
    app.isVertical = (!ori || window.orientation == 180);
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);
window.addEventListener('orientationchange', changeOrientation);
