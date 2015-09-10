"use strict";
require([
    "../../../requirejs_config"
], function(){
    require(["Vue"], function(Vue){

        // 自定义指令
        // 一旦注册好自定义指令，你就可以在 Vue.js 模板中像这样来使用它（需要添加 Vue.js 的指令前缀，默认为 v-）
        // 比如 <div v-my-directive="someValue"></div>

        // 所有的钩子函数会被复制到实际的指令对象中，而这个指令对象将会是所有钩子函数的 this上下文环境。
        // 指令对象上暴露了一些有用的公开属性：
        // el: 指令绑定的元素
        // vm: 拥有该指令的上下文 ViewModel
        // expression: 指令的表达式，不包括参数和过滤器
        // arg: 指令的参数
        // raw: 未被解析的原始表达式
        // name: 不带前缀的指令名
        // 这些属性是只读的，不要修改它们。你也可以给指令对象附加自定义的属性，但是注意不要覆盖已有的内部属性。
        Vue.directive('my-directive', {
            bind: function () {
                // 做绑定的准备工作
                // 比如添加事件监听器，或是其他只需要执行一次的复杂操作
            },
            update: function (newValue, oldValue) {
                // 根据获得的新值执行对应的更新
                // 对于初始值也会被调用一次
            },
            unbind: function () {
                // 做清理工作
                // 比如移除在 bind() 中添加的事件监听器
            }
        })

        // 如果你只需要 update 函数，你可以只传入一个函数，而不用传定义对象：
        Vue.directive('my-directive2', function (value) {
            // 这个函数会被作为 update() 函数使用
        })

        // 字面指令
        Vue.directive('literal-dir', {
            // 如果在创建自定义指令的时候传入 isLiteral: true ，
            // 那么特性值就会被看成直接字符串，并被赋值给该指令的 expression。
            // 字面指令不会试图建立数据监视。

            // 然而，在字面指令含有 Mustache 标签的情形下，指令的行为如下：
            // 指令实例会有一个属性，this._isDynamicLiteral 被设为 true；
            // 如果没有提供 update 函数，Mustache 表达式只会被求值一次，并将该值赋给 this.expression 。不会对表达式进行数据监视。
            // 如果提供了 update 函数，指令将会为表达式建立一个数据监视，并且在计算结果变化的时候调用 update。
            isLiteral: true,
            // 该选项允许在指令中使用 this.set(value) - 向 Vue 实例写回数据。
            twoWay: true,
            // 让自定义指令像 v-on 一样接受内联语句
            // 但是请明智地使用此功能，因为通常我们希望避免在模板中产生副作用。
            acceptStatement: true,
            // 深度数据观察
            // 当对象内部嵌套的属性发生变化时也能够触发指令的 update 函数
            deep: true,
            bind: function () {
                console.log(this.expression)

                this.handler = function () {
                    // 把数据写回 vm
                    // 如果指令这样绑定 v-literal-dir="a.b.c",
                    // 这里将会给 `vm.a.b.c` 赋值
                    this.set(this.el.value)
                }.bind(this)
                this.el.addEventListener('input', this.handler)
            },
            update: function(){
                console.log(arguments);
                this.el.removeEventListener('input', this.handler)
            }
        })

        // 自定义指令 实例
        Vue.directive('demo', {
            bind: function () {
                this.el.style.color = '#fff'
                this.el.style.backgroundColor = this.arg
            },
            update: function (value) {
                this.el.innerHTML =
                    'name - '       + this.name + '<br>' +
                    'raw - '        + this.raw + '<br>' +
                    'expression - ' + this.expression + '<br>' +
                    'argument - '   + this.arg + '<br>' +
                    'value - '      + value
            }
        })

        new Vue({
            el: '#demo',
            data: {
                msg      : 'hi!',
                age      : 0,
                checked  : true,
                picked   : 'one',
                selected : 'a',
                multiSelect: ['one', 'three'],
                options : [
                    { text: 'A', value: 'a' },
                    { text: 'B', value: 'b' }
                ]
            },
            computed: {
                //计算属性
                //str: function () {
                //    return this.msg + ' ' + this.age
                //}

                //为计算属性提供一个 setter
                str: {
                    // 保留简单获取数据的模式
                    // 然而，要注意这只发生在 JavaScript 程序内部访问的时候，数据绑定还是依赖驱动的。
                    // 当你在模板中绑定一个 {{example}} 的计算属性时，DOM 只会在反应式依赖改变时才会更新。
                    cache: false,
                    // getter
                    get: function () {
                        return this.msg + ' ' + this.age
                    },
                    // setter
                    set: function (newValue) {
                        var strs = newValue.split(' ')
                        this.msg = names[0]
                        this.age = names[names.length - 1]
                    }
                }
                //计算属性缓存 -- 反应式依赖
            }
        })
    });
});
