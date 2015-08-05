"use strict";
require([
     "../../../requirejs_config"
], function(){
    require(["Threejs", "Statsjs", "Tweenjs"], function(THREE, Stats, TWEEN){

        var renderer;
        var width;
        var height;
        var stats;

        function initThree() {
            width = document.getElementById('canvas-frame').clientWidth;
            height = document.getElementById('canvas-frame').clientHeight;
            renderer = new THREE.WebGLRenderer({
                antialias : true
            });
            renderer.setSize(width, height);
            document.getElementById('canvas-frame').appendChild(renderer.domElement);
            renderer.setClearColor(0xFFFFFF, 1.0);

            stats = new Stats();
            //stats.setMode(0); // 0: fps, 1: ms
            // 将stats的界面对应左上角
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            document.body.appendChild( stats.domElement );
            //setInterval( function () {
            //    stats.begin();
            //    // 你的每一帧的代码
            //    stats.end();
            //}, 1000 / 60 );
        }

        var camera;
        function initCamera() {
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
            //camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 1000 )
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 1000;
            camera.up.x = 0;
            camera.up.y = 1;
            camera.up.z = 0;
            camera.lookAt({
                x : 0,
                y : 0,
                z : 0
            });
        }

        var scene;
        function initScene() {
            scene = new THREE.Scene();
        }

        var light;
        function initLight() {
            //环境光
            //light = new THREE.AmbientLight( 0xff0000 );

            //点光源
            light = new THREE.AmbientLight(0x00FF00);//new THREE.PointLight(0x00FF00, 0.5, 0);
            light.position.set(0, 150, 500);
            scene.add(light);
        }

        var mesh;
        function initObject() {

            //定义一个圆筒
            var geometry = new THREE.CylinderGeometry( 100,150,400);
            //定义一个网丝材质
            var material = new THREE.MeshLambertMaterial( { color:0xFFFFFF} );
            //定义一个网丝
            mesh = new THREE.Mesh( geometry,material);
            mesh.position.x = 0;

            scene.add(mesh);
        }

        function initTween()
        {
            //动画引擎Tween.js
            new TWEEN.Tween( mesh.position)
                //动画作用的对象，和完成动画的时间
                .to( { x: -400 }, 5000 )
                // 循环次数，Infinity 表示无穷次
                .repeat(0)
                //开始动画
                .start();
        }

        function render()
        {
            //让相机在x轴向右移动
            //camera.position.x =camera.position.x +1;

            //让圆筒形的网丝在x轴向左移动
            //mesh.position.x-=1;

            //渲染
            renderer.render(scene, camera);
            //循环
            requestAnimationFrame(render);

            //更新帧数
            stats.update();
            //更新动画
            TWEEN.update();
        }

        function threeStart() {
            initThree();
            initCamera();
            initScene();
            initLight();
            initObject();
            initTween();
            render();
        }

        threeStart();

    });
});
