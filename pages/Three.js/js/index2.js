"use strict";
require([
     "../../../requirejs_config"
], function(){
    require(["Threejs"], function(THREE){

        var renderer;
        var width;
        var height;

        function initThree() {
            width = document.getElementById('canvas-frame').clientWidth;
            height = document.getElementById('canvas-frame').clientHeight;
            renderer = new THREE.WebGLRenderer({
                antialias : true
            });
            renderer.setSize(width, height);
            document.getElementById('canvas-frame').appendChild(renderer.domElement);
            renderer.setClearColor(0xFFFFFF, 1.0);
        }

        var camera;
        function initCamera() {
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
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
            light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
            light.position.set(100, 100, 200);
            scene.add(light);
        }

        function initObject() {

            //定义两个点
            var p1 = new THREE.Vector3( -500, 0, 0 );
            var p2 = new THREE.Vector3(  500, 0, 0 );

            //声明了一个几何体geometry
            //几何体里面有一个vertices变量，可以用来存放点。
            var geometry = new THREE.Geometry();


            //设置几何体的颜色的两个顶点
            geometry.vertices.push(p1);
            geometry.vertices.push(p2);

            for ( var i = 0; i <= 20; i ++ ) {

                //定义线条
                var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2}));
                line.position.y = ( i * 50 ) - 500;

                //将这条线加入到场景中
                scene.add(line);

                line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2}));
                line.position.x = ( i * 50 ) - 500;
                //围绕y轴旋转90度  --- 这里可以理解成是从z轴的方向看平面上的线旋转 --- 以z轴为中心轴旋转
                line.rotation.z = 90 * Math.PI / 180;
                scene.add( line );
            }
        }
        function render()
        {
            renderer.clear();
            renderer.render(scene, camera);
            //requestAnimationFrame(render);
        }


        function threeStart() {
            initThree();
            initCamera();
            initScene();
            initLight();
            initObject();
            render();
        }

        threeStart();

    });
});
