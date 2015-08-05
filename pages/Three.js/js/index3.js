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
            // ��stats�Ľ����Ӧ���Ͻ�
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            document.body.appendChild( stats.domElement );
            //setInterval( function () {
            //    stats.begin();
            //    // ���ÿһ֡�Ĵ���
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
            //������
            //light = new THREE.AmbientLight( 0xff0000 );

            //���Դ
            light = new THREE.AmbientLight(0x00FF00);//new THREE.PointLight(0x00FF00, 0.5, 0);
            light.position.set(0, 150, 500);
            scene.add(light);
        }

        var mesh;
        function initObject() {

            //����һ��ԲͲ
            var geometry = new THREE.CylinderGeometry( 100,150,400);
            //����һ����˿����
            var material = new THREE.MeshLambertMaterial( { color:0xFFFFFF} );
            //����һ����˿
            mesh = new THREE.Mesh( geometry,material);
            mesh.position.x = 0;

            scene.add(mesh);
        }

        function initTween()
        {
            //��������Tween.js
            new TWEEN.Tween( mesh.position)
                //�������õĶ��󣬺���ɶ�����ʱ��
                .to( { x: -400 }, 5000 )
                // ѭ��������Infinity ��ʾ�����
                .repeat(0)
                //��ʼ����
                .start();
        }

        function render()
        {
            //�������x�������ƶ�
            //camera.position.x =camera.position.x +1;

            //��ԲͲ�ε���˿��x�������ƶ�
            //mesh.position.x-=1;

            //��Ⱦ
            renderer.render(scene, camera);
            //ѭ��
            requestAnimationFrame(render);

            //����֡��
            stats.update();
            //���¶���
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
