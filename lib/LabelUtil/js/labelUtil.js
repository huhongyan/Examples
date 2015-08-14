
;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define([
        "jquery",
        "./lib/artDialog.js",
        "/Examples/lib/LabelUtil/templates/templates.amd.js",
        "bootstrap",
        "handlebars_ext",
        "require-css!bower_components/bootstrap/dist/css/bootstrap.min.css",
        "require-css!Font-Awesome",
        "require-css!lib/LabelUtil/css/label-util.css"
        ],factory);
} else if (typeof exports === 'object') {
    module.exports = factory();
} else {
    root.NProgress = factory();
}

})(this, function($, artDialog, templates) {
    "use strict";
    var LabelUtil = function(options) {
        var selector = options && options.selector;
        var html = options && options.html;
        var labelType = options && options.labelType;
        var saveCallback = options && options.saveCallback;
        var paperSize = options && options.paperSize || "102X152";

                //dialog的宽
                var vw = window.innerWidth - 50;
                //dialog的高
                var vh = window.innerHeight - 100;
                //标签默认宽度
                var minW = 200;
                //标签默认高度
                var minH = 150;
                //默认字号
                var minFS = 12;
                //默认top
                var minTop = 10;
                //默认left
                var minLeft = 10;
                //字段面板宽度
                var dcW = 240;
                //类型
                var labelTypes = {
                    '1': 'product',
                    'product': '1',
                    '11': 'container',
                    'container': '11',
                    '10': 'ucc',
                    'ucc': '10',
                    '12': 'upc',
                    'upc': '12'
                };
                labelType = labelType||labelTypes['product'];
                var labelNameURL = '/Example/lib/LabelUtil/test.json';
                //整个面板
                var $container = $('<div class="util-container"></div>').outerWidth(vw).outerHeight(vh).html(templates.labelUtil({'labelType': labelTypes[labelType], 'paperSize': paperSize}));
                //字段面板
                var $dataContainer = $container.find('.J-data-container');
                // //填充标签面板内容
                // if(html){
                //     $container.find('.J-label-container').html(html);
                // }
                //编辑标签的面板
                var $labelContainer = $container.find('.label-container');
                //setting面板
                var $settingContainer = $container.find('.J-setting-container');
                //鼠标变成可拖动图标的定时器
                var mouseTimer;
                //记录当前正被拖动的标签元素
                var $curElem;
                //记录当前正被横向拖动改变宽度的标签元素
                var $stretchHorizontal;
                //记录当前正被纵向拖动改变宽度的标签元素
                var $stretchVertical;
                //记录当前正被角拉伸的标签元素
                var $stretchEl;
                //四个方向 -- 常量
                var UP_LEFT = 1;
                var UP_RIGHT = 2;
                var DOWN_LEFT = 3;
                var DOWN_RIGHT = 4;
                //键盘keyCode常量
                var KEY_DELETE = 46;
                var KEY_D = 68;
                var KEY_UP = 38;
                var KEY_DOWN = 40;
                var KEY_LEFT = 37;
                var KEY_RIGHT = 39;
                var KEY_ENTER = 13;

                //打印机名字 -- 默认
                var printName = 'LabelPrinter';

                //工具面板里的文本域
                var $width = $container.find('input[name="width"]');
                var $height = $container.find('input[name="height"]');
                var $fontSize = $container.find('input[name="fontSize"]');
                var $top = $container.find('input[name="top"]');
                var $left = $container.find('input[name="left"]');
                var fontWeight = $container.find('input[name="fontWeight"]').get(0);
                var fontStyle = $container.find('input[name="fontStyle"]').get(0);
                var textDecoration = $container.find('input[name="textDecoration"]').get(0);

                //setting面板里的文本域
                var $lineWeight = $settingContainer.find('input[name="lineWeight"]');
                var $fontFamily = $settingContainer.find('select[name="fontFamily"]');
                var $letterSpacing = $settingContainer.find('input[name="letterSpacing"]');
                var $lineHeight = $settingContainer.find('input[name="lineHeight"]');
                var $src = $settingContainer.find('input[name="src"]');
                var $description = $settingContainer.find('input[name="description"]');
                var $setting_width = $settingContainer.find('input[name="width"]');
                var $setting_height = $settingContainer.find('input[name="height"]');
                var $type = $settingContainer.find('select[name="type"]');

                //字体操作面板
                var $font = $container.find('li.cgcz');

                //右键菜单面板
                var $contextmenu;

                //键盘事件不作用于标签面板的标记
                var isOperable = true;

                //初始化页面
                function initHTML(){
                    var contentH = vh - $container.find('.navbar').outerHeight();
                    $labelContainer.parent().outerWidth(vw - dcW).outerHeight(contentH);
                    $dataContainer.outerWidth(dcW).outerHeight(contentH).parent().outerHeight(contentH);
                    
                    initData(labelType);
                }

                //初始化数据
                function initData(type){
                    var contentH = vh - $container.find('.navbar').outerHeight();
                    var $btnContainer = $dataContainer.find('.content>.active').removeClass('active').end().find('.type-'+ labelTypes[type]).addClass('active');
                    $container.find('.label-type').find('.active').removeClass('active').end().find('.J-type-' + labelTypes[type]).addClass('active');
                    if(labelTypes[type] == 'container'){
                        $dataContainer.find('.content').outerHeight(contentH - 155).end().find('>select').show();
                    }else{
                        $dataContainer.find('.content').outerHeight(contentH - 125).end().find('>select').hide();
                    }
                    
                    if($btnContainer.find('button:first-child').length){
                        return ;
                    }

                    $btnContainer.html('The data loading...');

                    $.ajax({
                        url : labelNameURL,
                        data: {
                            'type': type,
                            'search': 'zwf'
                        },
                        success: function(resp){
                            $btnContainer.html(templates.dataBtn({'list': resp}));
                        },
                        error:function(e){
                            console.error(e);
                            $btnContainer.html('The request data error.');
                        }
                    })
                }

                //绑定事件操作
                function bindEvents(){

                    //工具栏事件
                    $container.find('.navbar').on('click', '.J-toRight', function(){
                        //点击让数据标签列表展示在右侧
                        
                    }).on('click', '.J-pSize', function(e){
                        //选择面板类型
                        var $target = $(e.currentTarget);

                        if($target.hasClass('active')){
                            return;
                        }

                        $target.parents('.paper-size:eq(0)').find('.active').removeClass('active')
                        $target.parent().addClass('active');

                        $labelContainer.css({
                            'height': $target.data('height'),
                            'width': $target.data('width')
                        }).trigger('click');

                    }).on('click', '.J-add-img', function(){
                        //添加图片
                        new artDialog({
                            icon: 'question',
                            fixed: true,
                            lock: true,
                            opacity: .1,
                            title:'Add Image',
                            skin: 'prompt',
                            content: [
                            '<p>Please enter the image addresses.</p>',
                            '<input class="form-control" autofocus="autofocus" placeholder="" style="width:18em;padding:6px 4px" />',
                            ].join(''),
                            button: [
                            {
                                name: 'Save',
                                callback: function () {
                                    clearSelected();
                                    $labelContainer.append(handleForm($(templates.img({
                                        'src': this.DOM.content.find('input')[0].value,
                                        'description': 'img'
                                    }))));
                                },
                                focus: true
                            }, {
                                name: 'Cancel'
                            }
                            ],
                            close: function(){
                                isOperable = true;
                            }
                        });

isOperable = false;

}).on('click', '.J-add-text', function(){
    clearSelected();
                        //点击添加文本框
                        var $text = $(templates.textField());
                        $labelContainer.append(handleForm($text));
                        $text.find('.form-control').focus();

                    }).on('click', '.J-rectangle', function(e){ 
                        clearSelected();
                        //点击添加矩形
                        var $rectangle = $(templates.orthogon());
                        $labelContainer.append(handleForm($rectangle));

                        if(e.currentTarget.className.indexOf('filled') != -1){
                            $rectangle.css('background-Color', '#000');
                        }

                    }).on('click', '.J-vertical', function(){
                        clearSelected();

                        //点击添加竖线
                        $labelContainer.append(handleForm($(templates.line()).addClass('vertical'), {'width': 2}));
                    }).on('click', '.J-horizontal', function(){
                        clearSelected();

                        //点击添加横线
                        $labelContainer.append(handleForm($(templates.line()).addClass('horizontal'), {'height': 2}));
                    }).on('click', '.nav-wz i', function(e){
                        //点击工具栏上的位置移动按钮

                        var className = e.currentTarget.className;

                        if(className.indexOf('right') != -1){
                            moveElemOneStep('right');
                        }else if(className.indexOf('left') != -1){
                            moveElemOneStep('left');
                        }else if(className.indexOf('up') != -1){
                            moveElemOneStep('up');
                        }else if(className.indexOf('down') != -1){
                            moveElemOneStep('down');
                        }

                        return false;
                    }).on('change', 'input[type="number"]', function(e){
                        //改变工具栏上属性值
                        changeNumber(e);
                    }).on('click', '.cgcz input', function(e){
                        //点击工具栏上的字体样式
                        changeFont(e);
                    }).on('click', '.J-type', function(e){
                        //切换label type
                        var $target = $(e.currentTarget);

                        if($target.hasClass('active')){
                            return;
                        }

                        $target.parents('.label-type:eq(0)').find('.active').removeClass('active');

                        initData(labelTypes[$target.parent().addClass('active').end().data('type')]);
                    });


                    //鼠标移动和弹起事件绑定到编辑面板的父元素上
                    $labelContainer.parent().on('mousemove', function(e){
                        // clearTimeout(mouseTimer);

                        if($curElem){

                            //复制元素并拖动新元素 按下ctrl并拖动鼠标
                            if(e.ctrlKey && !$curElem.isNew){
                                cloneElem(undefined, e);
                            }

                            //移动元素
                            moveElem(e);
                        }

                        if($stretchHorizontal){
                            //水平改变元素宽度
                            editHorizontal(e);
                        }

                        if($stretchVertical){
                            //纵向改变元素高度
                            editVertical(e);
                        }

                        if($stretchEl){
                            //角拉伸改变元素
                            stretchElem(e);
                        }

                        return false;
                    }).on('mouseup', function(e){
                        clearTimeout(mouseTimer);
                        // var $target = $(e.currentTarget);

                        $container.css('cursor', 'auto');

                        if($curElem){
                            if($curElem.isNew){
                                $curElem.isNew = false;
                                var $clone = $curElem;
                                setTimeout(function(){
                                    $clone.addClass('selected').find('.form-control').focus();
                                }, 1);
                            }
                            $curElem.find('.form-control').css('cursor', 'auto');
                        }

                        //取消当前dom元素的被按住状态
                        $curElem = undefined;
                        $stretchHorizontal = undefined;
                        $stretchVertical = undefined;
                        $stretchEl = undefined;

                        return false;
                    }).on('click', function(){
                        $labelContainer.trigger('click');
                        return false;
                    }).on('contextmenu', function(e){
                        //点击右键
                        if(!$labelContainer.hasClass('selected')){
                            clearSelected();
                            callbackForPro($labelContainer.addClass('selected'), true);
                        }
                        
                        showContextmenu(e, true);

                        return false;
                    });

                    //在面板之外的其他地方弹起了鼠标
                    $(window).on('mouseup', function(){
                        $labelContainer.trigger('mouseup');
                    }).on('keydown', function(e){

                        //非操作标签面板的情况下
                        if(!isOperable){
                            return;
                        }

                        //按下了ctrl+d 或者Delete键 删除
                        if(e.ctrlKey && e.keyCode == KEY_D || e.keyCode == KEY_DELETE && !e.shiftKey){
                            delElem();

                            return false;
                        }

                        //按下了ctrl+↑
                        if(e.ctrlKey && e.keyCode == KEY_UP){
                            editZIndex('up');
                            return false;
                        }

                        //按下了ctrl+↓
                        if(e.ctrlKey && e.keyCode == KEY_DOWN){
                            editZIndex('down');
                            return false;
                        }

                        //只按了↑ -- 向上移动元素
                        if(e.keyCode == KEY_UP && !e.ctrlKey){
                            var $el = getSelectedEl();
                            if($el.find('.form-control').length){
                                return;
                            }
                            moveElemOneStep('up', $el);
                            return false;
                        }

                        //只按了↓ -- 向上移动元素
                        if(e.keyCode == KEY_DOWN && !e.ctrlKey){
                            var $el = getSelectedEl();
                            if($el.find('.form-control').length){
                                return;
                            }
                            moveElemOneStep('down', $el);
                            return false;
                        }

                        //只按了→ -- 向上移动元素
                        if(e.keyCode == KEY_RIGHT && !e.ctrlKey){
                            var $el = getSelectedEl();
                            if($el.find('.form-control').length){
                                return;
                            }
                            moveElemOneStep('right', $el);
                            return false;
                        }

                        //只按了← -- 向上移动元素
                        if(e.keyCode == KEY_LEFT && !e.ctrlKey){
                            var $el = getSelectedEl();
                            if($el.find('.form-control').length){
                                return;
                            }
                            moveElemOneStep('left', $el);
                            return false;
                        }
                    });

                    //标签编辑面板里的事件
                    $labelContainer.on('click', function(e){
                        $container.find('.dropdown.open').removeClass('open');
                        //点击标签面板

                        clearSelected();
                        $labelContainer.addClass('selected');
                        callbackForPro($labelContainer, true);

                        return false;
                    }).on('contextmenu', function(e){
                        //点击右键
                        var $target = $(e.currentTarget);

                        if(!$target.hasClass('selected')){
                            clearSelected();
                            callbackForPro($target.addClass('selected'), true);
                        }

                        showContextmenu(e, true);

                        return false;
                    }).on('click', '>div', function(e){
                        $container.find('.dropdown.open').removeClass('open');
                        //点击添加进来的元素
                        var $target = $(e.currentTarget);
                        
                        if(!$target.hasClass('selected')){

                            clearSelected();
                            callbackForPro($target.addClass('selected'), true);

                            if($target.hasClass('label1')){
                                $target.find('.form-control').focus();
                            }
                        }else{
                            if($target.hasClass('label1')){
                                $target.find('.form-control').focus();
                            }
                        }
                        return false;

                    }).on('blur', '>.label1>.form-control', function(e){
                        //失去焦点时，转换value
                        var $target = $(e.currentTarget);
                        $target.text($target.val());

                    }).on('contextmenu', '>div', function(e){
                        //点击右键
                        var $target = $(e.currentTarget);

                        if(!$target.hasClass('selected')){
                            clearSelected();
                            callbackForPro($target.addClass('selected'), true);
                        }

                        showContextmenu(e);

                        return false;
                    }).on('mousedown', '>div', function(e){
                        //当前的dom对象
                        $curElem = $(e.currentTarget);

                        mouseTimer = setTimeout(function(){
                            $container.css('cursor', 'move');
                        }, 200);

                        //在元素上按下鼠标
                        $curElem.data('coordinate', {
                            'x': e.pageX,
                            'y': e.pageY
                        });

                        return false;
                    }).on('mousedown', '>.label1>.form-control', function(e){
                        //当前的dom对象
                        var $target = $(e.currentTarget);
                        $curElem = $target.parent();

                        mouseTimer = setTimeout(function(){
                            $container.css('cursor', 'move');
                            $target.css('cursor', 'move');
                        }, 200);

                        //在元素上按下鼠标
                        $curElem.data('coordinate', {
                            'x': e.pageX,
                            'y': e.pageY
                        });

                        return false;
                    }).on('mousedown', '>div>i.horizontal, >div.horizontal>i.stretch', function(e){

                        $stretchHorizontal = $(e.currentTarget).parent();

                        var className = e.currentTarget.className;

                        $stretchHorizontal.data('coordinate', {
                            'x': e.pageX,
                            'direction': className.indexOf('left') != -1 ? 'left' : 'right',
                            'width': parseFloat($stretchHorizontal.css('width')),
                            'left': parseFloat($stretchHorizontal.css('left'))
                        });

                        //改变鼠标状态
                        $container.css('cursor', 'e-resize');

                        return false;
                    }).on('mousedown', '>div>i.vertical, >div.vertical>i.stretch', function(e){

                        $stretchVertical = $(e.currentTarget).parent();

                        var className = e.currentTarget.className;

                        $stretchVertical.data('coordinate', {
                            'y': e.pageY,
                            'direction': (className.indexOf('up') != -1 ||  className.indexOf('left') != -1) ? 'up' : 'down',
                            'height': parseFloat($stretchVertical.css('height')),
                            'top': parseFloat($stretchVertical.css('top'))
                        });

                        //改变鼠标状态
                        $container.css('cursor', 'n-resize');

                        return false;
                    }).on('mousedown', '>div>i.stretch-corner', function(e){

                        var $target = $(e.currentTarget);

                        $stretchEl = $target.parent();

                        var className = e.currentTarget.className;
                        var direction = undefined;

                        if(className.indexOf('up-left') != -1){
                            direction = UP_LEFT;
                        }else if(className.indexOf('up-right') != -1){
                            direction = UP_RIGHT;
                        }else if(className.indexOf('down-left') != -1){
                            direction = DOWN_LEFT;
                        }else{
                            direction = DOWN_RIGHT;
                        }

                        $stretchEl.data('coordinate', {
                            'y': e.pageY,
                            'x': e.pageX,
                            'direction': direction,
                            'height': parseFloat($stretchEl.css('height')),
                            'width': parseFloat($stretchEl.css('width')),
                            'top': parseFloat($stretchEl.css('top')),
                            'left': parseFloat($stretchEl.css('left'))
                        });

                        //改变鼠标状态
                        $container.css('cursor', $target.css('cursor'));

                        return false;
                    });


                    //字段面板事件绑定
                    $dataContainer.on('click', '.draggable .J-data', function(e){
                        clearSelected();

                        var $target = $(e.currentTarget).parents('.content:eq(0)');
                        if($target.hasClass('label1')){
                            //添加label
                            $labelContainer.append(handleForm($(templates.label({'name': '{' + $(e.currentTarget).data('name') + '}'}))));
                        }else if($target.hasClass('barcode')){
                            $labelContainer.append(handleForm($(templates.barCode({
                                'name': '$' + $(e.currentTarget).data('name') + '$',
                                'type': 'CODE39',
                                'height': 20,
                                'width': 1
                            }))));
                        }

                    }).on('click', '.nav>li>a', function(e){
                        var $li = $(e.currentTarget).parent();
                        if($li.hasClass('active')){
                            return;
                        }

                        var $content = $dataContainer.find('.un-draggable');
                        if($content.length){
                            $content.addClass('warn');
                            setTimeout(function(){
                                $content.removeClass('warn');
                            }, 550)
                            return;
                        }

                        var $parent = $li.parent();
                        var $content = $parent.parent().find('.content');

                        //类型
                        if($li.hasClass('barcode')){
                            $content.removeClass('label1').addClass('barcode');
                        }else if($li.hasClass('label1')){
                            $content.removeClass('barcode').addClass('label1');
                        }

                        $parent.find('.active').removeClass('active');
                        $content.addClass('transition');
                        $li.addClass('active');

                        setTimeout(function(){
                            $content.removeClass('transition');
                        }, 1050)
                    }).on('click', '.J-del-field', function(e){
                        //切换至删除field面板
                        var $content = $dataContainer.find('.draggable');
                        if(!$content.length){
                            return;
                        }

                        $content.removeClass('draggable').addClass('un-draggable').scrollTop(0);

                    }).on('click', '.J-add-field', function(e){
                        //添加field
                        var $btnContainer = $dataContainer.find('.content>.active')
                        var type;
                        if(!$btnContainer.length){
                            return;
                        }

                        var $content = $dataContainer.find('.un-draggable');
                        if($content.length){
                            $content.addClass('warn');
                            setTimeout(function(){
                                $content.removeClass('warn');
                            }, 550)
                            return;
                        }

                        if($btnContainer.hasClass('type-product')){
                            type = labelTypes['product'];
                        }else if($btnContainer.hasClass('type-container')){
                            type = labelTypes['container'];
                        }else if($btnContainer.hasClass('type-ucc')){
                            type = labelTypes['ucc'];
                        }

                        new artDialog({
                            icon: 'question',
                            fixed: true,
                            lock: true,
                            opacity: .1,
                            title: 'Add Field',
                            content: [
                            '<p>Please enter the field name.</p>',
                            '<input class="form-control" autofocus="autofocus" placeholder="" style="width:18em;padding:6px 4px" />',
                            ].join(''),
                            init: function(){
                                var dialog = this;
                                this.DOM.content.find('input').off().on('keydown', function(e){
                                    if(e.keyCode !== KEY_ENTER)
                                        return;

                                    dialog.DOM.buttons.find('.aui_state_highlight').trigger('click');
                                }).focus();
                            },
                            button: [
                            {
                                name: 'Ok',
                                callback: function () {
                                    var dislog = this;
                                    var name = this.DOM.content.find('input')[0].value;

                                    if(!name){
                                        this.DOM.content.find('input')[0].focus();
                                        return;
                                    }else{
                                        name = name.toUpperCase();
                                    }

                                    $.ajax({
                                        url : labelNameURL,
                                        type: 'POST',
                                        data: {
                                            'add': 'add_placeholder',
                                            'type': type,
                                            'content': name
                                        },
                                        success: function(resp){
                                            // console.log(resp);
                                            $btnContainer.append(templates.dataBtn({'list': [{
                                                'placeholder_id': resp.id,
                                                'content': name
                                            }]}));
                                            dislog.close();
                                        },
                                        error:function(e){
                                            console.error(e);
                                            new artDialog({
                                                icon: 'error',
                                                fixed: true,
                                                lock: true,
                                                opacity: .1,
                                                title: 'Error',
                                                content: '<p>Add ' + name + ' failed.</p>',
                                                button: [{
                                                    name: 'Close'
                                                }]
                                            });
                                        }
                                    })

return false;
},
focus: true
}, {
    name: 'Cancel'
}
]
});
}).on('click', '.un-draggable b', function(e){
                        //删除field
                        var $btn = $(e.currentTarget);

                        new artDialog({
                            icon: 'warning',
                            fixed: true,
                            lock: true,
                            opacity: .1,
                            title: 'Delete ' + $btn.data('name'),
                            content: '<p>Sure you want to delete ' + $btn.data('name') + '</p>',
                            button: [
                            {
                                name: 'Ok',
                                callback: function () {
                                    var dialog = this;

                                    $.ajax({
                                        url : labelNameURL + '?det=det_placeholder&placeholder_id=' + $btn.data('id'),
                                        type: 'DELETE',
                                        success: function(resp){
                                            // 删除成功
                                            $btn.parent().remove();
                                            dialog.close();
                                        },
                                        error:function(e){
                                            console.error(e);
                                            new artDialog({
                                                icon: 'error',
                                                fixed: true,
                                                lock: true,
                                                opacity: .1,
                                                title: 'Error',
                                                content: '<p>Delete ' + $btn.data('name') + ' failed.</p>',
                                                button: [{
                                                    name: 'Close'
                                                }]
                                            });
                                        }
                                    });
return false;
},
focus: true
}, {
    name: 'Cancel'
}
]
});
}).on('click', '.un-draggable .btn-warning', function(){
                        //取消删除状态，切换至正常面板
                        var $content = $dataContainer.find('.un-draggable');
                        if(!$content.length){
                            return;
                        }

                        $content.removeClass('un-draggable').addClass('draggable').scrollTop(0);;
                    });

                    //setting 面板事件绑定
                    $settingContainer.on('change', '.form-control', function(e){
                        var $selectEl = getSelectedEl();
                        if(!$selectEl){
                            return;
                        }

                        if($selectEl.hasClass('line')){

                            if($selectEl.hasClass('vertical')){
                                //竖线
                                var val = parseFloat($lineWeight.val());
                                if(!val){
                                    $lineWeight.val('');
                                    return;
                                }
                                $selectEl.css('width', val);
                            }else if($selectEl.hasClass('horizontal')){
                                //横线
                                var val = parseFloat($lineWeight.val());
                                if(!val){
                                    $lineWeight.val('');
                                    return;
                                }
                                $selectEl.css('height', val);
                            }

                        }else if($selectEl.hasClass('label1')){

                            $selectEl.css('font-family', $fontFamily.val());
                            var letterSpacing = parseFloat($letterSpacing.val());
                            var lineHeight = parseFloat($lineHeight.val());
                            var $text = $selectEl.find('textarea');
                            letterSpacing ? $selectEl.css('letter-spacing', letterSpacing) : $letterSpacing.val(parseFloat($selectEl.css('letter-spacing')));
                            $text.length && letterSpacing ? $text.css('letter-spacing', letterSpacing) : undefined;  
                            lineHeight ? $selectEl.css('line-height', lineHeight + 'px') : $lineHeight.val(parseFloat($selectEl.css('line-height')));
                            $text.length && lineHeight ? $text.css('line-height', lineHeight + 'px') : undefined;  

                        }else if($selectEl.hasClass('barcode')){
                            var $img = $selectEl.find('img');
                            var img = $img.get(0);

                            var height = parseFloat($setting_height.val());
                            var width = parseFloat($setting_width.val());
                            var type = $type.val();

                            height ? $img.data('height', height) : $setting_height.val(parseFloat($img.data('height')));
                            width ? $img.data('width', width) : $setting_width.val(parseFloat($img.data('width')));
                            $img.data('type', type);

                            height && width && (img.src = "/barbecue/barcode?data="+ img.alt+"&width="+width+"&height="+height+"&type=" + type);

                        }else if($selectEl.hasClass('img')){

                            var img = $selectEl.find('img')[0];
                            img.src = $src.val();
                            img.alt = $description.val();

                        }else if($selectEl.hasClass('orthogon')){
                            var lineWeight = parseFloat($lineWeight.val());
                            lineWeight ? $selectEl.css('border-width', lineWeight) : $lineWeight.val(parseFloat($selectEl.css('border-width')));
                        }

                    });

}

                /*
                *   取消标签选中状态
                */
                function clearSelected(){
                    $container.find('.selected').removeClass('selected').find('.form-control').blur();
                }

                /*
                *   获取当前选中状态的标签
                */
                function getSelectedEl(){
                    var $el = $labelContainer.find('>.selected');

                    return $el.length ? $el : undefined;
                }

                /*
                *   清空工具面板上对字体的设置
                *   用于在操作线条的情况下
                */
                function clearFontSetting($el){
                    $container.find('input[name="textAlign"]').get(0).checked = false;
                    fontWeight.checked = false;
                    fontStyle.checked = false;
                    textDecoration.checked = false;
                    $font.addClass('disable');
                    $fontSize.val('').get(0).disabled = true;
                    
                    if($el.hasClass("horizontal")){
                        //横线
                        $height.get(0).disabled = true;
                        $width.get(0).disabled = false;
                    }

                    if($el.hasClass("vertical")){
                        //竖线
                        $width.get(0).disabled = true;
                        $height.get(0).disabled = false;
                    }

                    $top.get(0).disabled = false;
                    $left.get(0).disabled = false;
                }

                /*
                *   重置工具面板上对字体禁用的设置
                */
                function resetFontSetting(){
                    $font.removeClass('disable');
                    $fontSize.get(0).disabled = false;
                    $height.get(0).disabled = false;
                    $width.get(0).disabled = false;
                    $top.get(0).disabled = false;
                    $left.get(0).disabled = false;
                }

                /*
                *   将标签的属性回填到工具面板
                */
                function callbackForPro($el, isSel){
                    $width.val(parseFloat($el.css('width')));
                    $height.val(parseFloat($el.css('height')));
                    $top.val(parseFloat($el.css('top')));
                    $left.val(parseFloat($el.css('left')));

                    if(!$el.hasClass('line') && !$el.hasClass('orthogon')){
                        $fontSize.val(parseFloat($el.css('font-size')));
                    }

                    if(isSel){
                        //是选中操作，不是移动操作

                        //选中的是line
                        if($el.hasClass('line') || $el.hasClass('orthogon')){
                            clearFontSetting($el);
                            return;
                        }

                        //重置工具面板上字体操作
                        resetFontSetting();

                        //选中的是编辑面板
                        if($el.hasClass('label-container')){
                            $top.get(0).disabled = true;
                            $left.get(0).disabled = true;
                        }

                        $container.find('input[value="'+ $el.css('text-align') +'"]').get(0).checked = true;

                        if($el.css('font-weight') == 'bold' || $el.css('font-weight') == '700' ){
                            fontWeight.checked = true;
                        }else{
                            fontWeight.checked = false;
                        }

                        if($el.css('font-style') == 'italic' ){
                            fontStyle.checked = true;
                        }else{
                            fontStyle.checked = false;
                        }

                        if($el.css('text-decoration') == 'underline' ){
                            textDecoration.checked = true;
                        }else{
                            textDecoration.checked = false;
                        }
                    }
                }

                /*
                *   参数处理
                *   @params $el 标签
                *           opts 元素的高和宽
                */
                function handleForm($el, opts){

                    var width = opts && opts.width;
                    var height = opts && opts.height;

                    $el.css({
                        'width': width ? width + 'px' : minW + 'px',
                        'height': height ? height + 'px' : minH + 'px',
                        'top': minTop + 'px',
                        'left': minLeft + 'px'
                    });

                    if(!width){
                        $width.val(minW);
                    }else{
                        $width.val(width);
                    }

                    if(!height){
                        $height.val(minH);
                    }else{
                        $height.val(height);
                    }

                    $top.val(minTop);
                    $left.val(minLeft);

                    //添加的如果是line
                    if($el.hasClass('line') || $el.hasClass('orthogon')){
                        clearFontSetting($el);
                        return $el;
                    }

                    resetFontSetting();

                    // var fontSize = $fontSize.val();
                    var fontweight = fontWeight.checked;
                    var fontstyle = fontStyle.checked;
                    var textdecoration = textDecoration.checked;
                    var textAlign = $container.find('input[name="textAlign"]:checked').val();

                    $el.css({
                        // 'font-size': fontSize ? fontSize + 'px' : minFS + 'px',
                        'font-size': minFS + 'px',
                        'font-weight': fontweight ? 'bold' : 'normal',
                        'font-style': fontstyle ? 'italic' : 'normal',
                        'text-decoration': textdecoration ? 'underline' : 'initial',
                        'text-align': textAlign ? textAlign : 'left'
                    });

                    // if(!fontSize){
                        $fontSize.val(minFS);
                    // }

                    if(!textAlign){
                        $container.find('input[value="left"]').get(0).checked = true;
                    }
                    return $el;
                }

                /*
                *   移动标签(只向上/下/左/右移动一个像素)
                */
                function moveElemOneStep(direction, $el){
                    if(!$el){
                        $el = getSelectedEl();
                    }
                    if(!$el){
                        return;
                    }

                    var top = parseFloat($top.val()) || 0;
                    var left = parseFloat($left.val()) || 0;

                    switch(direction){
                        case 'left':
                        $el.css('left', (left - 1) + 'px');
                        $left.val(left - 1);
                        break;
                        case 'right':
                        $el.css('left', (left + 1) + 'px');
                        $left.val(left + 1);
                        break;
                        case 'up':
                        $el.css('top', (top - 1) + 'px');
                        $top.val(top - 1);
                        break;
                        case 'down':
                        $el.css('top', (top + 1) + 'px');
                        $top.val(top + 1);
                        break;
                    }
                }

                /*
                *   移动标签
                */
                function moveElem(e){

                    if(!$curElem.hasClass('selected')){
                        clearSelected();
                        $curElem.addClass('selected');
                    }

                    var coordinate = $curElem.data('coordinate');

                    $curElem.css({
                        'top': (parseFloat($curElem.css('top')) + e.pageY - coordinate.y) + 'px',
                        'left': (parseFloat($curElem.css('left')) + e.pageX - coordinate.x) + 'px'
                    });

                    $curElem.data('coordinate', {
                        'x': e.pageX,
                        'y': e.pageY
                    });

                    callbackForPro($curElem);
                }

                /*
                *   横向拖动改变标签宽度
                */
                function editHorizontal(e){
                    var coordinate = $stretchHorizontal.data('coordinate');

                    switch(coordinate.direction){
                        case 'left':
                        var endWidth = parseFloat($stretchHorizontal.css('width')) - e.pageX + coordinate.x;

                        if(endWidth >= 4){
                            $stretchHorizontal.css({
                                'width': endWidth + 'px',
                                'left': (parseFloat($stretchHorizontal.css('left')) + e.pageX - coordinate.x) + 'px'
                            });
                        }else{
                            $stretchHorizontal.css({
                                'width': endWidth + 'px',
                                'left': (coordinate.left + coordinate.width) + 'px'
                            });

                            //重置移动方向
                            coordinate.direction = 'right';
                            coordinate.left = coordinate.left + coordinate.width;
                        }

                        break;
                        case 'right':

                        var endWidth = parseFloat($stretchHorizontal.css('width')) + e.pageX - coordinate.x;

                        if(endWidth >= 4){
                            $stretchHorizontal.css({
                                'width': endWidth + 'px'
                            });
                        }else{
                            $stretchHorizontal.css({
                                'width': endWidth + 'px',
                                'left': (coordinate.left + endWidth) + 'px'
                            });

                            //重置移动方向
                            coordinate.direction = 'left';
                            coordinate.width = 0;
                        }

                        break;
                    }

                    //重置坐标
                    coordinate.x = e.pageX;

                    callbackForPro($stretchHorizontal);
                }

                /*
                *   纵向拖动改变标签高度
                */
                function editVertical(e){
                    var coordinate = $stretchVertical.data('coordinate');

                    switch(coordinate.direction){
                        case 'up':
                        var endHeight = parseFloat($stretchVertical.css('height')) - e.pageY + coordinate.y;

                        if(endHeight >= 4){
                            $stretchVertical.css({
                                'height': endHeight + 'px',
                                'top': (parseFloat($stretchVertical.css('top')) + e.pageY - coordinate.y) + 'px'
                            });
                        }else{
                            $stretchVertical.css({
                                'height': endHeight + 'px',
                                'top': (coordinate.top + coordinate.height) + 'px'
                            });

                            //重置移动方向
                            coordinate.direction = 'down';
                            coordinate.top = coordinate.top + coordinate.height;
                        }

                        break;
                        case 'down':

                        var endHeight = parseFloat($stretchVertical.css('height')) + e.pageY - coordinate.y;

                        if(endHeight >= 4){
                            $stretchVertical.css({
                                'height': endHeight + 'px'
                            });
                        }else{
                            $stretchVertical.css({
                                'height': endHeight + 'px',
                                'top': (coordinate.top + endHeight) + 'px'
                            });

                            //重置移动方向
                            coordinate.direction = 'up';
                            coordinate.height = 0;
                        }

                        break;
                    }

                    //重置坐标
                    coordinate.y = e.pageY;

                    callbackForPro($stretchVertical);
                }

                /*
                *   角拉伸改变标签高宽
                */
                function stretchElem(e){
                    var coordinate = $stretchEl.data('coordinate');

                    switch(coordinate.direction){
                        case UP_LEFT:
                        var endHeight = parseFloat($stretchEl.css('height')) - e.pageY + coordinate.y;
                        var endWidth = parseFloat($stretchEl.css('width')) - e.pageX + coordinate.x;

                        if(endHeight >= 4){
                            $stretchEl.css({
                                'height': endHeight + 'px',
                                'top': (parseFloat($stretchEl.css('top')) + e.pageY - coordinate.y) + 'px'
                            });

                            if(endWidth >= 4){
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (parseFloat($stretchEl.css('left')) + e.pageX - coordinate.x) + 'px'
                                });
                            }else{
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (coordinate.left + coordinate.width) + 'px'
                                });

                                //重置移动方向
                                coordinate.direction = UP_RIGHT;
                                coordinate.left = coordinate.left + coordinate.width;
                            }

                        }else{
                            $stretchEl.css({
                                'height': endHeight + 'px',
                                'top': (coordinate.top + coordinate.height) + 'px'
                            });

                            coordinate.top = coordinate.top + coordinate.height;

                            if(endWidth >= 4){
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (parseFloat($stretchEl.css('left')) + e.pageX - coordinate.x) + 'px'
                                });
                                //重置移动方向
                                coordinate.direction = DOWN_LEFT;
                            }else{
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (coordinate.left + coordinate.width) + 'px'
                                });

                                //重置移动方向
                                coordinate.direction = DOWN_RIGHT;
                                coordinate.left = coordinate.left + coordinate.width;
                            }
                        }

                        break;
                        case UP_RIGHT:
                        var endHeight = parseFloat($stretchEl.css('height')) - e.pageY + coordinate.y;
                        var endWidth = parseFloat($stretchEl.css('width')) + e.pageX - coordinate.x;

                        if(endHeight >= 4){
                            $stretchEl.css({
                                'height': endHeight + 'px',
                                'top': (parseFloat($stretchEl.css('top')) + e.pageY - coordinate.y) + 'px'
                            });

                            if(endWidth >= 4){
                                $stretchEl.css({
                                    'width': endWidth + 'px'
                                });
                            }else{
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (coordinate.left + endWidth) + 'px'
                                });

                                //重置移动方向
                                coordinate.direction = UP_LEFT;
                                coordinate.width = 0;
                            }

                        }else{
                            $stretchEl.css({
                                'height': endHeight + 'px',
                                'top': (coordinate.top + coordinate.height) + 'px'
                            });

                            if(endWidth >= 4){
                                $stretchEl.css({
                                    'width': endWidth + 'px'
                                });
                                //重置移动方向
                                coordinate.direction = DOWN_RIGHT;
                            }else{
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (coordinate.left + endWidth) + 'px'
                                });

                                //重置移动方向
                                coordinate.direction = DOWN_LEFT;
                                coordinate.width = 0;
                            }
                            coordinate.top = coordinate.top + coordinate.height;
                        }

                        break;
                        case DOWN_LEFT:
                        var endHeight = parseFloat($stretchEl.css('height')) + e.pageY - coordinate.y;
                        var endWidth = parseFloat($stretchEl.css('width')) - e.pageX + coordinate.x;

                        if(endHeight >= 4){
                            $stretchEl.css({
                                'height': endHeight + 'px'
                            });
                            if(endWidth >= 4){
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (parseFloat($stretchEl.css('left')) + e.pageX - coordinate.x) + 'px'
                                });
                            }else{
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (coordinate.left + coordinate.width) + 'px'
                                });

                                //重置移动方向
                                coordinate.direction = DOWN_RIGHT;
                                coordinate.left = coordinate.left + coordinate.width;
                            }
                        }else{
                            $stretchEl.css({
                                'height': endHeight + 'px',
                                'top': (coordinate.top + endHeight) + 'px'
                            });
                            if(endWidth >= 4){
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (parseFloat($stretchEl.css('left')) + e.pageX - coordinate.x) + 'px'
                                });
                                //重置移动方向
                                coordinate.direction = UP_LEFT;
                            }else{
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (coordinate.left + coordinate.width) + 'px'
                                });

                                //重置移动方向
                                coordinate.direction = UP_RIGHT;
                                coordinate.left = coordinate.left + coordinate.width;
                            }
                            coordinate.height = 0;
                        }

                        break;
                        case DOWN_RIGHT:
                        var endHeight = parseFloat($stretchEl.css('height')) + e.pageY - coordinate.y;
                        var endWidth = parseFloat($stretchEl.css('width')) + e.pageX - coordinate.x;
                        if(endHeight >= 4){
                            $stretchEl.css({
                                'height': endHeight + 'px'
                            });

                            if(endWidth >= 4){
                                $stretchEl.css({
                                    'width': endWidth + 'px'
                                });
                            }else{
                                $stretchEl.css({
                                    'width': endWidth + 'px',
                                    'left': (coordinate.left + endWidth) + 'px'
                                });

                                //重置移动方向
                                coordinate.direction = DOWN_LEFT;
                                coordinate.width = 0;
                            }
                        }else{
                            $stretchEl.css({
                                'height': endHeight + 'px',
                                'top': (coordinate.top + endHeight) + 'px'
                            });

                            if(endWidth >= 4){
                                $stretchEl.css({
                                    'width': endWidth + 'px'
                                });
                                //重置移动方向
                                coordinate.direction = UP_RIGHT;
                            }else{
                                $.css({
                                    'width': endWidth + 'px',
                                    'left': (coordinate.left + endWidth) + 'px'
                                });

                                //重置移动方向
                                coordinate.direction = UP_LEFT;
                                coordinate.width = 0;
                            }
                            
                            coordinate.height = 0;
                        }

                        break;
                    }

                    //重置坐标
                    coordinate.y = e.pageY;
                    coordinate.x = e.pageX;

                    callbackForPro($stretchEl);
                }

                /*
                *   删除选中的元素
                */
                function delElem(){
                    var $selectEl = getSelectedEl();
                    if(!$selectEl){
                        return;
                    }
                    $selectEl.remove();
                    $labelContainer.trigger('click');

                    $contextmenu && $contextmenu.blur();
                }

                /*
                *   改变工具面板(setting)中的数值
                */
                function changeNumber(e){
                    var $el = getSelectedEl();

                    if(!$el){
                        //如果选中的是面板
                        if($labelContainer.hasClass('selected')){
                            switch(e.currentTarget.name){
                                case 'width':
                                $labelContainer.css('width', e.currentTarget.value + 'px');
                                break;
                                case 'height':
                                $labelContainer.css('height', e.currentTarget.value + 'px');
                                break;
                                case 'fontSize':
                                $labelContainer.css('font-size', e.currentTarget.value + 'px');
                                break;
                            }
                        }

                        return false;
                    }

                    switch(e.currentTarget.name){
                        case 'width':
                        $el.css('width', e.currentTarget.value + 'px');
                        break;
                        case 'height':
                        $el.css('height', e.currentTarget.value + 'px');
                        break;
                        case 'top':
                        $el.css('top', e.currentTarget.value + 'px');
                        break;
                        case 'left':
                        $el.css('left', e.currentTarget.value + 'px');
                        break;
                        case 'fontSize':
                        $el.css('font-size', e.currentTarget.value + 'px');
                        $el.find('.form-control').css('font-size', e.currentTarget.value + 'px');
                        break;
                    }
                }

                /*
                *   改变工具面板(setting)中对字体等的操作
                */
                function changeFont(e){
                    var $el = getSelectedEl();
                    var btnElem = e.currentTarget;

                    if(!$el){
                        if(!$labelContainer.hasClass('selected')){
                            return;
                        }
                        $el = $labelContainer;
                    }

                    switch(btnElem.name){
                        case 'fontWeight':
                        $el.css('font-weight', btnElem.checked ? btnElem.value : 'normal');
                        $el.find('.form-control').css('font-weight', btnElem.checked ? btnElem.value : 'normal');
                        break;
                        case 'fontStyle':
                        $el.css('font-style', btnElem.checked ? btnElem.value : 'normal');
                        break;
                        case 'textDecoration':
                        $el.css('text-decoration', btnElem.checked ? btnElem.value : 'initial');
                        $el.find('.form-control').css('text-decoration', btnElem.checked ? btnElem.value : 'initial');
                        break;   
                        case 'textAlign':
                        $el.css('text-align', btnElem.value);
                        $el.find('.form-control').css('text-align', btnElem.value);
                        break;                     
                    }
                }

                /*
                *   复制元素
                */
                function cloneElem($el, e){
                    if(e){
                        //拖动复制元素的情况
                        if($curElem.hasClass('label1')){
                            var text = $curElem.find('.form-control').css('cursor', 'auto').val();
                        }
                        $curElem = $curElem.removeClass('selected').clone().appendTo($labelContainer).addClass('selected');
                        $curElem.find('.form-control').focus();
                        text && $curElem.find('.form-control').css('cursor', 'move').text(text);

                        $curElem.isNew = true;
                        $curElem.data('coordinate', {
                            'x': e.pageX,
                            'y': e.pageY
                        });
                    }else{
                        //直接复制元素
                        if($el.hasClass('label1')){
                            var text = $el.find('.form-control').val();
                        }
                        $el = $el.removeClass('selected').clone().appendTo($labelContainer).addClass('selected');
                        $el.find('.form-control').focus();
                        text && $el.find('.form-control').text(text);
                    }
                }

                /*
                *   改变元素的层级
                */
                function editZIndex(direction){
                    var $selectEl = getSelectedEl();
                    if(!$selectEl){
                        return;
                    }

                    var zIndex = parseInt($selectEl.css('z-index'));

                    if(direction == 'up'){
                        $selectEl.css('z-index',  zIndex ? zIndex + 1 : 1);
                    }else if(direction == 'down'){
                        $selectEl.css('z-index', zIndex ? zIndex - 1 : 0);
                    }

                    $contextmenu && $contextmenu.blur();
                }

                /*
                *   设置setting面板属性
                */
                function settingContainer(){
                    var $selectEl = getSelectedEl();
                    if(!$selectEl){
                        return;
                    }

                    //类型
                    var className;
                    if($selectEl.hasClass('line')){
                        className = 'line';

                        //填值
                        if($selectEl.hasClass('vertical')){
                            //竖线
                            $lineWeight.val(parseFloat($selectEl.css('width')));
                        }else if($selectEl.hasClass('horizontal')){
                            //横线
                            $lineWeight.val(parseFloat($selectEl.css('height')));
                        }

                    }else if($selectEl.hasClass('label1')){
                        className = 'font';

                        //填值
                        $fontFamily.val($selectEl.css('font-family'));
                        $letterSpacing.val(parseFloat($selectEl.css('letter-spacing')));
                        $lineHeight.val(parseFloat($selectEl.css('line-height')));

                    }else if($selectEl.hasClass('barcode')){
                        className = 'barcode';
                        var img = $selectEl.find('img');

                        $setting_height.val(parseFloat(img.data('height')));
                        $setting_width.val(parseFloat(img.data('width')));
                        $type.val(img.data('type') || '');

                    }else if($selectEl.hasClass('img')){
                        className = 'img';

                        //填值
                        var img = $selectEl.find('img')[0];
                        $src.val(img.src);
                        $description.val(img.alt);

                    }else if($selectEl.hasClass('orthogon')){
                        className = 'orthogon';

                        $lineWeight.val(parseFloat($selectEl.css('border-width')));
                    }

                    $settingContainer.addClass(className);
                }

                /*
                *   展开右键菜单
                */
                function showContextmenu(e, isContainer){
                    if(!$contextmenu){
                        $contextmenu = $(templates.contextmenu({
                            'isContainer': isContainer
                        })).appendTo($labelContainer.parent()).blur(function(){
                            $contextmenu.hide();
                        }).on('click', '.J-copy', function(){
                            var $selectEl = getSelectedEl();
                            if(!$selectEl){
                                return;
                            }
                            //复制元素
                            cloneElem($selectEl);
                            $contextmenu.hide();

                            return false;
                        }).on('click', '.J-setting', function(){
                            //设置面板
                            settingContainer();
                            new artDialog({
                                title:"Label Setting",
                                lock: true,
                                focus: false,
                                width: 400,
                                height: 200,
                                opacity:0.3,
                                padding: 0,
                                content: $settingContainer.css({
                                    'z-index': 9,
                                    'opacity': 1
                                }).get(0),
                                button: [{ name: 'Close' }],
                                close: function(){
                                    $settingContainer.css({
                                        'z-index': -9999,
                                        'opacity': 0
                                    }).get(0).className = 'J-setting-container';
                                    isOperable = true;
                                }
                            });
isOperable = false;
$contextmenu.hide();
return false;
}).on('click', '.J-del', function(){
                            //删除
                            delElem();
                        }).on('click', '.J-up', function(){
                            //将元素置于上一层
                            editZIndex('up');

                            return false;
                        }).on('click', '.J-down', function(){
                            //将元素置于下一层
                            editZIndex('down');

                            return false;
                        });
                    }else{
                        if(isContainer){
                            $contextmenu.find('.show').removeClass('show').addClass('hide');
                        }else{
                            $contextmenu.find('.hide').removeClass('hide').addClass('show');
                        }
                    }
                    var $labelP = $labelContainer.parent();
                    var elem = $labelP.get(0);
                    var position = $labelP.position();
                    var offset = $container.offset();
                    var top = e.pageY - position.top - offset.top + elem.scrollTop;
                    var left = e.pageX - position.left - offset.left + elem.scrollLeft;
                    var menuH = $contextmenu.outerHeight();
                    var menuW = $contextmenu.outerWidth();
                    //判断右键菜单的位置，处理在底部和右边距位置的情况
                    if($labelP.outerHeight() + elem.scrollTop - top < menuH){
                        top -= menuH - 10;
                    }

                    if($labelP.outerWidth() + elem.scrollLeft - left < 200){
                        left -= menuW - 10;
                    }

                    $contextmenu.css({
                        'top': top,
                        'left': left
                    }).show().focus();
                }

                //对外接口
                this.setLabelType = function(type){
                    labelType = type;
                    $container.find('.label-type').find('.active')
                    .removeClass('active').end().find('.J-type-' + labelTypes[type]).addClass('active');
                };

                this.bindElem = function(options){

                    $(options.selector).on(options.eventName || 'click', function(e){

                        new artDialog({
                            title:"Label Util",
                            lock: true,
                            focus: false,
                            width: vw,
                            height: vh,
                            opacity:0.3,
                            skin: 'label-util',
                            padding: 0,
                            content: $container.get(0),
                            close: function(){
                                $dataContainer.find('.content').removeClass('un-draggable').addClass('draggable');
                                $dataContainer.find('.J-label-name').val('');
                            },
                            init: function(){
                                $dataContainer.find('.J-label-name').val(options.labelName || '');
                                if(options.labelType == labelTypes['container']){
                                    $dataContainer.find('select').val(options.type);
                                }
                                options.labelType && (labelType = options.labelType);
                                
                                var html = options.html || '';
                                if(html){
                                    var $temp = $(html);
                                    $labelContainer.html($temp.html());
                                    $labelContainer.attr('style', $temp.attr('style'));
                                }else{
                                    $labelContainer.html(html);
                                }
                                var pSize = options.paperSize || paperSize;
                                $container.find('.J-size-' + pSize + '>a').trigger('click');
                            },
                            button: [
                            {
                                name: 'Save',
                                callback: function () {
                                    $labelContainer.trigger('click');
                                    var label_name = $dataContainer.find('.J-label-name').val();
                                    if(!label_name){
                                        $dataContainer.find('.J-label-name').focus();
                                        return false;
                                    }
                                    var dialog = this;
                                    var html = $labelContainer.removeClass('selected').parent().html();
                                    var label_type = $container.find('.label-type .active>a').data('type');

                                    if(options.saveCallback){
                                        options.saveCallback(dialog, {
                                            lable_content: html,
                                            lable_height: parseInt($height.val()),
                                            lable_width: parseInt($width.val()),
                                            lable_type: $container.find('.paper-size .active').data('papersize'),
                                            lable_template_type: labelTypes[label_type],
                                            type: label_type == 'container' ? $dataContainer.find('select').val() : undefined,
                                            lable_name: label_name,
                                            print_name: printName
                                        });
                                    }
                                    return false;
                                },
                                focus: true
                            }, {
                                name: 'Preview',
                                className: 'btn-preview',
                                callback: function () {
                                    clearSelected();

                                    var $target = $labelContainer.parent();
                                    $target.find('.form-control').each(function(i, el){
                                        var $el = $(el);
                                        $el.text($el.val());
                                    });

                                //打印预览
                                //// visionariPrinter.PRINT_INIT(printName);
                                //visionariPrinter.SET_PRINT_STYLE("FontName", "Verdana");
                                //// visionariPrinter.SET_PRINT_PAGESIZE(1, 0, 0, "Letter");
                                //visionariPrinter.ADD_PRINT_HTM(0, 0, "100%", "100%", $labelContainer.parent().html());
                                //visionariPrinter.SET_PRINT_COPIES(1);
                                //visionariPrinter.PREVIEW();

                                return false;
                            }
                        }, {
                            name: 'Reset',
                            className: 'btn-reset',
                            callback: function(){
                                // if(html){
                                //     $labelContainer.html(html);
                                // }
                                var html = options.html || '';
                                // $labelContainer.html(html);
                                if(html){
                                    var $temp = $(html);
                                    $labelContainer.html($temp.html());
                                    $labelContainer.attr('style', $temp.attr('style'));
                                }else{
                                    $labelContainer.html(html);
                                }
                                return false;
                            }
                        }, {
                            name: 'Cancel'
                        }
                        ]
                    });
initHTML();

$labelContainer.trigger('click');
});


}


                //执行
                bindEvents();

                //绑定事件
                selector && this.bindElem({'selector': selector, 'html': html, 'saveCallback': saveCallback});

                return this;
            };

            return LabelUtil;
        });
