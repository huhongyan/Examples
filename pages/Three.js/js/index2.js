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

            //����������
            var p1 = new THREE.Vector3( -500, 0, 0 );
            var p2 = new THREE.Vector3(  500, 0, 0 );

            //������һ��������geometry
            //������������һ��vertices����������������ŵ㡣
            var geometry = new THREE.Geometry();


            //���ü��������ɫ����������
            geometry.vertices.push(p1);
            geometry.vertices.push(p2);

            for ( var i = 0; i <= 20; i ++ ) {

                //��������
                var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2}));
                line.position.y = ( i * 50 ) - 500;

                //�������߼��뵽������
                scene.add(line);

                line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2}));
                line.position.x = ( i * 50 ) - 500;
                //Χ��y����ת90��  --- ������������Ǵ�z��ķ���ƽ���ϵ�����ת --- ��z��Ϊ��������ת
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
