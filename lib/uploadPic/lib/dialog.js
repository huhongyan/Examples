/**
 * Created by Huhy on 2016/1/29.
 */
(function (win) {

    function alertFun(title, txt,callback){

        var $dialog = $("#dialogAlert");

        if(!$dialog.length) {
            var html = [
                '<div id="dialogAlert" class="wrap-dialog" style="display: block">',
                '<div class="error-panel text-center">',
                '<div class="panel-title">',
                '<p class="fs-14 J-title">' + title + '</p>',
                '<p class="fs-18 color-gray J-txt" style="padding: .06rem .12rem;">' + txt + '</p>',
                '</div><div class="panel-btn"><button type="button" class="btn-error color-blue">确 定</button></div></div></div>'
            ];
            $dialog = $(html.join("")).appendTo("body");
            $dialog.on("click", ".btn-error", function(){
                callback && callback();
                $dialog.hide();
            });
        }else{
            $dialog.find(".J-title").text(title);
            $dialog.find(".J-txt").html(txt);
            $dialog.off().on("click", ".btn-error", function () {
                callback && callback();
                $dialog.hide();
            });
        }
        $dialog.show()
    }

    function infoFun(title, txt, btn){
        var $dialog = $("#dialogAlert");

        if(!$dialog.length) {
            var html = [
                '<div class="wrap-dialog" style="display: block">',
                '<div class="pwd-panel">',
                '<div class="panel-title">',
                '<p class="fs-18 fw-bold J-title">' + title + '</p>',
                '<button class="btn-close">close</button>'+
                '</div><div class="pwd-hr"></div>'+
                '<div class="panel-cont"><p class="fc-gray fs-16 J-txt" style="line-height: 1.6;text-align: justify;">' + txt + '</p></div>',
                '</div></div>'
            ];

            $dialog = $(html.join("")).appendTo("body");

            $dialog.on("click", ".btn-close", function(){
                $dialog.off("click", ".btn-close").hide();
            });
        }else{
            $dialog.find(".J-title").text(title);
            $dialog.find(".J-txt").html(txt);
        }
        $dialog.show()
    }

    function loading(){
        var html = [
            '<div class="wrap-dialog J-dialog-loading" style="background-color: rgba(0, 0, 0, 0.1);">',
            '<span class="loading-wrap" style="position: absolute; top: 50%; margin-top: -29px;left: 50%;margin-left: -29px;">',
            '<span class="loading loading_1"></span>',
            '<span class="loading loading_2"></span>',
            '<span class="loading loading_3"></span>',
            '<span class="loading loading_4"></span>',
            '<span class="loading loading_5"></span>',
            '<span class="loading loading_6"></span>',
            '<span class="loading loading_7"></span>',
            '<span class="loading loading_8"></span>',
            '</span>',
            '</div>'
        ];
        var $dialog = $(html.join(""));

        return {
            init: function(){
                var _$dialog = $("body").find(".J-dialog-loading");
                if(_$dialog.length != 0){
                    _$dialog.show();
                    $dialog = _$dialog;
                }else {
                    $dialog.show().appendTo("body");
                }
            },
            close: function(){
                $dialog.hide();
            }
        };
    }

    win.Dialog = win.Dialog || {};
    win.Dialog.alert = alertFun;
    win.Dialog.info = infoFun;
    win.Dialog.loading = loading();

})(window);