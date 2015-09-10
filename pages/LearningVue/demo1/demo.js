"use strict";
require([
    "../../../requirejs_config"
], function(){
    require(["Vue"], function(Vue){
        var demo = new Vue({
            el: '#demo',
            data: {
                title: 'todos',
                todos: [
                    {
                        done: true,
                        content: 'Learn JavaScript'
                    },
                    {
                        done: false,
                        content: 'Learn Vue.js'
                    }
                ]
                //todos: ['Learn JavaScript', 'Learn Vue.js']
            },
            methods: {
                toggle: function (item, e) {
                    item.done = !item.done
                },
                submit: function(e){
                    console.log(e.keyCode);
                }
            }
        });
        window.demo = demo;
    });
});
