(function(win){
    var $ = win.Zepto;

    // 上传头像dialog
    var $cutWrap;
    // 手势操作container
    var $container;
    //  容器的宽
    var cont_w = document.documentElement.clientWidth;
    // 容器的高
    var cont_h = document.documentElement.clientHeight - 60;

    // 打开cut面板，加载当前图片
    function showCut(src){
        Dialog.loading.init();

        src = src || this.src;
        // step1: 图片居中
        if(src){

            var $img = $container.find(".img-Initial");
            var img = new Image();

            img.onload = function(){
                // 初始缩放比例
                var initZoom = cont_w/img.naturalWidth;
                var imgTop = (cont_h - img.naturalHeight*initZoom)/2;

                img.style.top = imgTop + "px";

                Dialog.loading.close();

                if(!$img.length){
                    img.className = "img-Initial";
                    $container.append(img);
                }else{
                    $img.get(0).src = src;
                }
            };
            img.src = src;
        }

        $cutWrap.show();
    }

    // 获取获取设备的 pixel ratio
    function getPixelRatio(context) {
        var backingStore = context.backingStorePixelRatio ||
            context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio || 1;

        return (window.devicePixelRatio || 1) / backingStore;
    }
    function compress(img, dir) {
        var width = img.naturalWidth;
        var height = img.naturalHeight;
        var canvas = document.createElement("canvas");
        var tCanvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        var tctx = tCanvas.getContext("2d");
        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        var ratio;
        if ((ratio = width * height / 4000000)>1) {
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
        }else {
            ratio = 1;
        }
        canvas.width = width;
        canvas.height = height;
        //	铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //如果图片像素大于100万则使用瓦片绘制
        var count;
        if ((count = width * height / 1000000) > 1) {
            count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片
            //	    计算每块瓦片的宽和高
            var nw = ~~(width / count);
            var nh = ~~(height / count);
            tCanvas.width = nw;
            tCanvas.height = nh;

            var sWith = Math.floor(nw * ratio);
            var sHeight = Math.floor(nh * ratio);

            for (var i = 0; i < count; i++) {
                for (var j = 0; j < count; j++) {

                    tctx.drawImage(img, i *sWith, j *sHeight, sWith, sHeight, 0, 0, nw, nh);
                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                }
            }
        } else {
            ctx.drawImage(img, 0, 0, width, height);
        }

        var iCanvas = document.createElement("canvas");
        var ictx = iCanvas.getContext("2d");
        var degree = 0;
        switch (dir) {
            case 3:
                degree = 180;
                iCanvas.width = width;
                iCanvas.height = height;
                ictx.rotate(degree * Math.PI / 180);
                ictx.drawImage(canvas, -width, -height);
                break;
                break;
            //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
            case 6:
                degree=90;
                iCanvas.width = height;
                iCanvas.height = width;
                ictx.rotate(degree * Math.PI / 180);
                ictx.drawImage(canvas, 0, -height);
                break;
            //iphone竖屏拍摄，此时home键在上方
            case 8:
                degree=270;
                iCanvas.width = height;
                iCanvas.height = width;
                ictx.rotate(degree * Math.PI / 180);
                ictx.drawImage(canvas, -width, 0);
                break;
            default :
                iCanvas.width = width;
                iCanvas.height = height;
                ictx.drawImage(canvas, 0, 0);
                break;
        }


        //进行最小压缩
        var ndata = iCanvas.toDataURL('image/jpeg', 0.1);
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = iCanvas.width = iCanvas.height = 0;
        iCanvas = tCanvas = canvas = null;
        return ndata;
    }

    // 加载要剪切上传的图片
    function loadCutImg(src){
        Dialog.loading.init();

        var img = new Image();
        var $img = $container.find(".img-upload");

        img.onload = function(){
            var drawWidth = img.naturalWidth;
            var drawHeight = img.naturalHeight;
            alert('naturalHeight: ' + drawHeight)
            var initZoom = cont_w/drawWidth;
            var imgTop = (cont_h - drawHeight*initZoom)/2;

            img.style.top = imgTop + "px";
            img.className = "img-upload";
            img.initZoom = initZoom;

            Dialog.loading.close();

            if(!$img.length){
                $container.append(img);
            }else{
                // 加载要上传的图片
                $img.remove();
                $container.append(img);
            }
        };
        img.src = src;
    }

    // 初始化结构
    function initHtml(){

        // 头像处理
        var html = [
            '<div id="cutWrap" class="wrap-dialog cut-ready" style="display: none">',
            '<div class="cut-container" id="boxContainer">',
            '<div class="cut-box"></div>',
            '</div>',
            '<div class="btn-container">',
            '<div class="btn-cutting">',
            '<a href="javascript:void(0);" class="btn-cut J-prev">取消</a>',
            '<a href="javascript:void(0);" class="btn-cut full-r J-cut">选取</a>',
            '</div>',
            '<div class="btn-ready">',
            '<a href="javascript:void(0);" class="btn-cut J-cancel">确定</a>',
            '<a href="javascript:void(0);" class="btn-cut full-r btn-upload">',
            '更换头像',
            '<input class="cut-upload J-upload" accept="image/*" type="file" value="" capture="camera"/>',
            '</a>',
            '</div>',
            '</div>',
            '</div>'];

        $(document.body).append(html.join(""));

        $cutWrap = $("#cutWrap");
        $container =  $("#boxContainer");
    }

    // 绑定按钮事件
    function bindBtnEvent(callback){

        $cutWrap.on("click", ".J-cancel", function(){
            // 预览状态下 点击确定
            $cutWrap.hide();
            //$container.find(".img-upload").remove();

        }).on("change", ".J-upload", function(){
            // 更换头像 选择文件
            var file = this.files[0];
            //alert(JSON.stringify(file))
            if(file.type && !/image\/\w+/.test(file.type))
                return Dialog.alert("温馨提示", "请选择图片类型文件");

            Dialog.loading.init();
            // 图片的拍摄方向
            var orientation;
            // 读取图片的元信息
            EXIF.getData(file,function(){
                orientation = EXIF.getTag(this,'Orientation');
            });

            $cutWrap.removeClass("cut-ready");
            var reader = new FileReader();
            reader.onload = function(e){
                //Dialog.loading.close();

                var img = new Image;
                img.onload = function(){
                    loadCutImg(compress(img, orientation), orientation);
                };
                img.src = this.result
            };
            reader.readAsDataURL(file);

            this.value = "";

        }).on("click", ".J-prev", function(){
            // 剪裁图片状态 点击取消
            $cutWrap.addClass("cut-ready");
            $container.find(".img-upload").remove();

        }).on("click", ".J-cut", function(){
            Dialog.loading.init();

            // 用来剪切图片的画布
            var canvas = document.createElement("canvas");
            canvas.width = cont_w;
            canvas.height = cont_w;
            var ctx = canvas.getContext("2d");
            var $img = $container.find(".img-upload");
            var matrix = ($img.css("transform") || $img.css("-webkit-transform")).split(/[,\(\)]/g);
            var img = $img.get(0);
            var initZoom = img.initZoom;
            var imgH = $img.height();
            var imgW = $img.width();

            // 最终的图片与box高度差的一半
            var diffH = (imgH - cont_w)/2;
            // 最终的图片与box宽度差的一半
            var diffW = (imgW - cont_w)/2;

            var scale = Number(matrix[1]) || 1;
            // 图片的缩放比例
            var actualScale = 1/(initZoom*scale);
            // 图片的x轴偏移
            var deltaX =  Number(matrix[5]) || 0;
            // 图片的y轴偏移
            var deltaY =  Number(matrix[6]) || 0;
            // 开始剪切的 y 坐标位置
            var sy = (diffH > 0 ? diffH - deltaY : 0)*actualScale;
            // 开始剪切的x轴坐标位置
            var sx = (diffW - deltaX)*actualScale;
            // 被剪切图像的宽度
            var sWidth = cont_w*actualScale;
            // 被剪切图像的宽度
            var sHeight = sWidth;
            // 在画布上放置图像的 y 坐标位置。
            var y = diffH < 0 ? -diffH : 0;
            // 在画布上放置图像的 x 坐标位置。
            var x = 0;
            // 在画布上的高
            var canH = cont_w;
            // 在画布上的宽
            var conW = cont_w;

            var nat_w = img.naturalWidth;
            var nat_h = img.naturalHeight;

            if((sy + sWidth) >= nat_h){
                sy = Math.floor(nat_h - sWidth);
                if(sy < 0){
                    sy = 0;
                    sHeight = nat_h;
                    canH = Math.floor(conW - 2 * y);
                }
            }

            if((sx + sWidth) >= nat_w){
                sx = Math.floor(nat_w - sWidth);
            }

            //ctx.fillStyle = "#fff";
            //ctx.fillRect(0, 0, canvas.width, canvas.height);
alert(scale)
            alert('initZoom: ' + initZoom)
            alert('actualScale: ' + actualScale)
            alert('sWidth: '+sWidth)
            // 获取设备数据 - 解决高清屏图片模糊问题
            var ratio = getPixelRatio(ctx);
            ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y * ratio, conW * ratio, canH * ratio);

            // 过程中的测试代码
            //Dialog.loading.close();
            ////// 调用回调
            //callback && callback(canvas.toDataURL("image/png"));
            //return;
            // 处理剪裁之后图片数据
            var data = canvas.toDataURL('image/png')//, 0.1);
            //data = window.atob(data.split(',')[1]);
            //var ia = new Uint8Array(data.length);
            //for (var i = 0; i < data.length; i++) {
            //    ia[i] = data.charCodeAt(i);
            //}
            //var blob = new Blob([ia], {type:"image/png"});

            // 调用回调
            callback && callback(data);

            //var fd = new FormData();
            //fd.append('file',data.split(',')[1]);
            //
            //var xhr = new XMLHttpRequest();
            //xhr.onreadystatechange = function(){
            //    if(xhr.readyState==4 && xhr.status==200){
            //        var txt = xhr.responseText;
            //        //alert(txt)
            //        Dialog.loading.close();
            //        // 调用回调
            //        callback && callback(txt);
            //    }
            //};
            ////xhr.upload.onprogress = function(evt){
            ////    //侦查附件上传情况
            ////    //通过事件对象侦查
            ////    //该匿名函数表达式大概0.05-0.1秒执行一次
            ////    //evt.total; 附件总大小
            ////    var loaded = evt.loaded;
            ////    var tot = evt.total;
            ////    var per = Math.floor(100*loaded/tot);  //已经上传的百分比
            ////    console.log(per);
            ////};
            //
            //xhr.open("post","/FESS/service/crm/setImages");
            //xhr.send(fd);

            // 清除
            ctx.clearRect(0, 0, cont_w, cont_w);
            canvas = null;
        });
    }

    // 绑定图片拖动和缩放事件
    function bindTouchEvent(){

        var hammer = new Hammer($container[0]);
        hammer.get('pinch').set({ enable: true });
        hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

        var el, $el;
        //var maxScale = 2;
        hammer.on("panstart", function(ev){
            $el = $container.find(".img-upload");
            el = $el.get(0);

            if(el) {
                // 提取上次拖动的偏移量
                var transform = $el.css("transform") || $el.css("-webkit-transform");
                var matrix = transform.split(/[,\(\)]/g);
                var maxDeltaX = ($el.width() - cont_w) / 2;
                var maxDeltaY = ($el.height() - cont_w) / 2;

                el.maxDeltaY = maxDeltaY < 0 ? 0 : maxDeltaY;
                el.maxDeltaX = maxDeltaX < 0 ? 0 : maxDeltaX;
                el.deltaX = Number(matrix[5]);
                el.deltaY = Number(matrix[6]);
                el.scale = Number(matrix[1]);
            }
        }).on("panend", function(ev){
            if(el) {
                var matrix = ($el.css("transform") || $el.css("-webkit-transform")).split(/[,\(\)]/g);
                var deltaX = Number(matrix[5]);
                var deltaY = Number(matrix[6]);
                var maxDeltaX = el.maxDeltaX;
                var maxDeltaY = el.maxDeltaY;
                var scale = el.scale;

                if ((maxDeltaY - Math.abs(deltaY)) < 0) {
                    // 超出屏幕之外
                    if (deltaY < 0) {
                        // 方向向上
                        deltaY = -maxDeltaY;
                    } else if (deltaY > 0) {
                        // 方向向下
                        deltaY = maxDeltaY;
                    }
                }

                if ((maxDeltaX - Math.abs(deltaX)) < 0) {
                    // 超出屏幕之外
                    if (deltaX < 0) {
                        // 方向向左
                        deltaX = -maxDeltaX;
                    } else if (deltaX > 0) {
                        // 方向向右
                        deltaX = maxDeltaX;
                    }
                }

                matrix = "matrix(" + scale + ", 0, 0, " + scale + ", " + deltaX + ", " + deltaY + ") translateZ(0)";
                $el.css({"transform": matrix, "-webkit-transform": matrix});
            }
        }).on("panmove", function(ev){
            if(el) {
                var deltaX = el.deltaX + ev.deltaX;
                var deltaY = ev.deltaY + el.deltaY;
                var scale = el.scale;

                // 移动图片
                var matrix = "matrix(" + scale + ", 0, 0, " + scale + ", " + deltaX + ", " + deltaY + ") translateZ(0)";
                $el.css({"transform": matrix, "-webkit-transform": matrix});

            }
        }).on("pinchstart", function(){
            $el = $container.find(".img-upload");
            el = $el.get(0);

            var transform = $el.css("transform") || $el.css("-webkit-transform");
            var matrix = transform.split(/[,\(\)]/g);
            var initZoom = el.initZoom;

            el.deltaX = Number(matrix[5]);
            el.deltaY = Number(matrix[6]);
            el.scale = Number(matrix[1]);
            el.maxScale = 1/initZoom;

        }).on("pinchmove", function(ev){
            var scale = ev.scale - 1;

            scale += el.scale;

            var matrix = "matrix(" + scale + ", 0, 0, " + scale + ", " + el.deltaX + ", " + el.deltaY + ") translateZ(0)";
            $el.css({"transform": matrix, "-webkit-transform": matrix});
        }).on("pinchend", function(ev){
            var transform = $el.css("transform") || $el.css("-webkit-transform");
            var matrix = transform.split(/[,\(\)]/g);

            var scale = Number(matrix[1]);
            var maxScale = el.maxScale;

            if(scale > maxScale){
                scale = maxScale;
            }else if(scale < 1){
                scale = 1;
            }

            matrix = "matrix(" + scale + ", 0, 0, " + scale + ", " + el.deltaX + ", " + el.deltaY + ") translateZ(0)";
            $el.css({"transform": matrix, "-webkit-transform": matrix});

            // 判断是否缩小放大图片的边缘的情况
            var maxDeltaX = ($el.width() - cont_w) / 2;
            var maxDeltaY = ($el.height() - cont_w) / 2;

            var deltaX = el.deltaX;
            var deltaY = el.deltaY;

            maxDeltaY = maxDeltaY < 0 ? 0 : maxDeltaY;
            maxDeltaX = maxDeltaX < 0 ? 0 : maxDeltaX;

            if ((maxDeltaY - Math.abs(deltaY)) >= 0 && (maxDeltaX - Math.abs(deltaX)) >= 0)
                return ;

            // 缩小放大图片的边缘的情况
            if ((maxDeltaY - Math.abs(deltaY)) < 0) {
                // 超出屏幕之外
                if (deltaY < 0) {
                    // 方向向上
                    deltaY = -maxDeltaY;
                } else if (deltaY > 0) {
                    // 方向向下
                    deltaY = maxDeltaY;
                }
            }

            if ((maxDeltaX - Math.abs(deltaX)) < 0) {
                // 超出屏幕之外
                if (deltaX < 0) {
                    // 方向向左
                    deltaX = -maxDeltaX;
                } else if (deltaX > 0) {
                    // 方向向右
                    deltaX = maxDeltaX;
                }
            }

            matrix = "matrix(" + scale + ", 0, 0, " + scale + ", " + deltaX + ", " + deltaY + ") translateZ(0)";
            $el.css({"transform": matrix, "-webkit-transform": matrix});
        })
    }

    // 构造函数
    function UploadCusPic(src, callback){
        this.src = src;
        initHtml();
        bindBtnEvent(callback);
        bindTouchEvent();
    }
    UploadCusPic.prototype.show = showCut;
    UploadCusPic.prototype.hide = function(){
        $cutWrap.addClass("cut-ready");
        $container.find(".img-upload").remove();
        $cutWrap.hide();
    };

    win.UploadCusPic = UploadCusPic;

})(window);
