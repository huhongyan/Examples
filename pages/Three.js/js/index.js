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

            //声明了一个几何体geometry
            //几何体里面有一个vertices变量，可以用来存放点。
            var geometry = new THREE.Geometry();

            /*
             Color：线条的颜色，用16进制来表示，默认的颜色是白色。

             Linewidth：线条的宽度，默认时候1个单位宽度。

             Linecap：线条两端的外观，默认是圆角端点，当线条较粗的时候才看得出效果，如果线条很细，那么你几乎看不出效果了。

             Linejoin：两个线条的连接点处的外观，默认是“round”，表示圆角。

             VertexColors：定义线条材质是否使用顶点颜色，这是一个boolean值。意思是，线条各部分的颜色会根据顶点的颜色来进行插值。

             Fog：定义材质的颜色是否受全局雾效的影响。
             */
            //vertexColors: THREE.VertexColors  线条的颜色会根据顶点来计算
            //定义一种线条的材质
            var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors});
            var color1 = new THREE.Color( 0x444444 ), color2 = new THREE.Color( 0xFF0000 );

            //设置几何体的颜色的两个顶点
            geometry.vertices.push(p1);
            geometry.vertices.push(p2);
            /*
             geometry中colors表示顶点的颜色，
             必须材质中vertexColors等于THREE.VertexColors 时，颜色才有效，
             如果vertexColors等于THREE.NoColors时，颜色就没有效果了。
             那么就会去取材质中color的值
            */
            geometry.colors.push( color1, color2 );

            //定义线条
            line = new THREE.Line( geometry, material, THREE.LinePieces );

            //将这条线加入到场景中
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
