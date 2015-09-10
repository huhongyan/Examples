"use strict";
require([
    "../../../requirejs_config"
], function(){
    require(["Vue"], function(Vue){

        // 组件系统
        // 用 Vue 扩展出来的 ViewModel 子类当做可复用的组件
        // 扩展 Vue 得到一个可复用的构造函数
        var MyComponent = Vue.extend({
            template: '<p>A custom component!</p>',

            // 定义组件初始化默认数据和元素的方式： 传递一个函数
            // data 和 el 的值通常并不希望被所有实例共享
            data: function () {
                return {
                    title: 'Hello!'
                }
            }
        })

        // 把构造函数注册到 my-component 这个 id
        // 之后就能在父级实例的模板中使用注册过的组件(务必在初始化根实例之前注册组件)
        Vue.component('my-component', MyComponent)

        // 更简单的方式
        // 如果接收到的是一个对象，Vue.component() 会为你隐式调用 Vue.extend()
        // 注意：该方法返回全局 Vue 对象，
        // 而非注册的构造函数
        Vue.component('my-component2', {
            // 一个 “prop” 是指组件的数据对象上的一个预期会从父级组件取得的字段。
            // 一个子组件需要通过 props 选项显式声明它希望获得的 props
            // 然后，我们可以像这样向这个组件传递数据：<my-component2 msg="hello!"></my-component2>
            props: ['myMsg'],
            template: '<p>A custom component!</p>'
        })

        // 没有必要，也不应该全局注册所有组件
        // 以限制一个组件仅对另一个组件及其后代可用，
        // 只要在另一个组件的 components 选项中传入这个组件即可
        // (这种封装形式同样适用于其他资源，例如指令和过滤器)
        var Parent = Vue.extend({
            components: {
                child: {
                    // child 只能被
                    // Parent 及其后代组件使用
                }
            }
        })

        // Vue.js 支持两种不同风格的调用组件的 API：
        // 过程式的基于构造函数的 API，
        // 以及基于模板的声明式的 Web Components 风格 API。

        // table 元素对能出现在其内部的元素类型有限制, 因此自定义元素会被提到外部而且无法正常渲染。
        // 在那种情况下你可以使用指令式组件语法： <tr v-component="my-component"></tr>。



        // 组件可以对接收的 props 声明一定的规则限制
        // 其中type可以是 String Number Boolean Function Object Array 任一原生构造函数
        // type 还可以是自定义构造函数，将会是一个 instanceof 检查。
        // 如果 prop 检验不通过，Vue 会拒绝这次针对子组件的赋值，并且在使用开发版本时会抛出一个警告。
        Vue.component('example', {
            props: {
                // 基本类型检查 (`null` 表示接受所有类型)
                onSomeEvent: Function,
                // 必需性检查
                requiredProp: {
                    type: String,
                    required: true
                },
                // 指定默认值
                propWithDefault: {
                    type: Number,
                    default: 100
                },
                // 对象或数组类型的默认值
                // 应该由工厂函数返回
                propWithObjectDefault: {
                    type: Object,
                    default: function () {
                        return { msg: 'hello' }
                    }
                },
                // 双向 prop。
                // 如果绑定类型不匹配将抛出警告.
                twoWayProp: {
                    twoWay: true
                },
                // 自定义验证函数
                greaterThanTen: {
                    validator: function (value) {
                        return value > 10
                    }
                }
            }
        })
    });
});
