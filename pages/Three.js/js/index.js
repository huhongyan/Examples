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
            camera.position.y = 1000;
            camera.position.z = 0;
            camera.up.x = 0;
            camera.up.y = 0;
            camera.up.z = 1;
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

        var line;
        function initObject(p1, p2) {

            //������һ��������geometry
            //������������һ��vertices����������������ŵ㡣
            var geometry = new THREE.Geometry();

            /*
             Color����������ɫ����16��������ʾ��Ĭ�ϵ���ɫ�ǰ�ɫ��

             Linewidth�������Ŀ�ȣ�Ĭ��ʱ��1����λ��ȡ�

             Linecap���������˵���ۣ�Ĭ����Բ�Ƕ˵㣬�������ϴֵ�ʱ��ſ��ó�Ч�������������ϸ����ô�㼸��������Ч���ˡ�

             Linejoin���������������ӵ㴦����ۣ�Ĭ���ǡ�round������ʾԲ�ǡ�

             VertexColors���������������Ƿ�ʹ�ö�����ɫ������һ��booleanֵ����˼�ǣ����������ֵ���ɫ����ݶ������ɫ�����в�ֵ��

             Fog��������ʵ���ɫ�Ƿ���ȫ����Ч��Ӱ�졣
             */
            //vertexColors: THREE.VertexColors  ��������ɫ����ݶ���������
            //����һ�������Ĳ���
            var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors});
            var color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );

            //���ü��������ɫ����������
            geometry.vertices.push(p1);
            geometry.vertices.push(p2);
            /*
             geometry��colors��ʾ�������ɫ��
             ���������vertexColors����THREE.VertexColors ʱ����ɫ����Ч��
             ���vertexColors����THREE.NoColorsʱ����ɫ��û��Ч���ˡ�
             ��ô�ͻ�ȥȡ������color��ֵ
            */
            geometry.colors.push( color1, color2 );

            //��������
            line = new THREE.Line( geometry, material, THREE.LinePieces );

            //�������߼��뵽������
            scene.add(line);
        }
        function render()
        {
            //p1.x == -100 ? p1.xp = 1 : p1.x == 100 ? p1.xp = 0 : p1.xp = p1.xp;
            //p1.xp ? p1.x++ : p1.x--;
            //p1.y++ ;
            //p1.z == -100 ? p1.zp = 1 : p1.z == 100 ? p1.zp = 0 : p1.zp = p1.zp;
            //p1.zp ? p1.z++ : p1.z--;

            //p2.x == -100 ? p2.xp = 1 : p2.x == 100 ? p2.xp = 0 : p2.xp = p2.xp;
            //p2.xp ? p2.x++ : p2.x--;

            //p2.z == -100 ? p2.zp = 1 : p2.z == 100 ? p2.zp = 0 : p2.zp = p2.zp;
            //p2.zp ? p2.z++ : p2.z--;
            //p2.y--;


            //p1.x += 1;
            //p1.xp = 1
            //p1.y -= 1;
            //p1.z += 1;
            //p2.x -= 1;
            //p2.y += 1;
            //p2.z -= 1;

            //if(line.position.x){
                if(line.position.xp){
                    line.position.x += 1;
                }else{
                    line.position.x -= 1
                }
                if(line.position.x >= 360){
                    line.position.xp = 0;
                }else if(line.position.x <= -360){
                    line.position.xp = 1;
                }
            //}else{
            //    line.position.x = 1
            //}


            line.rotation.y = line.position.x * Math.PI / 180;

            //initObject(p1, p2);


            renderer.clear();
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        var p1 = new THREE.Vector3( -100, 0, 100 );
        var p2 = new THREE.Vector3(  100, 0, -100 );
        function threeStart() {
            initThree();
            initCamera();
            initScene();
            initLight();
            initObject(p1, p2);
            render();
        }

        threeStart();

    });
});
