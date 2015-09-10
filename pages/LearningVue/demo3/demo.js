"use strict";
require([
    "../../../requirejs_config"
], function(){
    require(["Vue"], function(Vue){

        // 自定义过滤器
        // 传递一个过滤器 ID和一个过滤器函数来注册一个自定义过滤器。
        // 过滤器函数会接受一个参数值并返回将其转换后的值
        Vue.filter('reverse', function (value) {
            return value.split('').reverse().join('')
        })

        // 过滤器函数也可以接受内联参数
        // 使用如： <span v-text="message | wrap 'before' 'after'"></span>
        Vue.filter('wrap', function (value, begin, end) {
            return begin + value + end
        })

        // 双向过滤器
        // 使用过滤器把来自模型的值在显示到视图之前进行转换
        // 也可以把来自视图的值（input 元素）在写回模型之前进行转换
        Vue.filter('currencyDisplay', {
                // model -> view
                // formats the value when updating the input element.
                read: function(val) {
                    return '$'+val.toFixed(2)
                },
                // view -> model
                // formats the value when updating the data.
                write: function(val, oldVal) {
                    var number = +val.replace(/[^\d.]/g, '')
                    return isNaN(number) ? 0 : number
                }

        })

        // 如果一个过滤器参数没有被引号包裹，它会在当前 vm 的数据作用域里当做表达式进行动态求值。
        // 此外，过滤器函数的 this 上下文永远是调用它的当前 vm。
        // 例如: <span>{{msg | concat userInput}}</span>


        new Vue({
            el: '#demo',
            data: {
                money: 123.45
            },
            //filters: {
            //    currencyDisplay: {
            //        read: function(val) {
            //            return '$'+val.toFixed(2)
            //        },
            //        write: function(val, oldVal) {
            //            var number = +val.replace(/[^\d.]/g, '')
            //            return isNaN(number) ? 0 : number
            //        }
            //    }
            //}
        })
    });
});
