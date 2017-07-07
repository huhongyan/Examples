/**
 * Created by huhy on 2017/6/26.
 *
 * 即时聊天页面的js
 * 由于时间关系，加上目前只有一个聊天界面，故构造界面dom并未提出来
 */
;(function(root, factory) {
    root.CreactRIM = factory(root.Zepto, root.RongIMClient, root.SelectLocationPoi);
})(this, function($, RongIMClient, SelectLocationPoi) {

    var WEEKS = ['日', '一', '二', '三', '四', '五', '六'];

    var $msgWrap = $('#msgWrap'),                   // 信息展示区域
        $chatWrap = $('#chatWrap'),                 // 聊天面板
        $sendMedia = $chatWrap.find('.J-voice'),    // 发送语音按钮
        groupId,                                    // 群组id
        groupName,                                  // 群组名称
        user,                                       // 用户信息
        client,                                     // RongIMClient 实例 在链接成功之后获得
        timeStamp,                                  // 最后一条消息的时间戳
        $loading,
        listloading,                                // 上拉插件实例
        HistoryDate;                                // 历史消息时间

    /**
     * 实现即时聊天的主方法
     */
    function creactRIM(url, _groupId, _groupName) {
        if(!_groupId) throw new Error('订单ID为必传项');

        $loading = $.showLoading('获取配置...');

        // 由使用者传入 暂定使用orderId
        groupId = _groupId;
        groupName = _groupName;

        // 初始化微信配置
        // 而后连接IM
        initData(url, function (appKey, token, groupId, groupName) {
            // 初始化融云IM
            RongIMClient.init(appKey);

            // emoji
            RongIMLib.RongIMEmoji.init();

            // 音频
            RongIMLib.RongIMVoice.init();

            // 连接状态监听器
            RongIMClient.setConnectionStatusListener({
                onChanged: function (status) {
                    switch (status) {
                        //链接成功
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            console.log('链接成功');
                            break;
                        //正在链接
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            console.log('正在链接');
                            $loading = $.showLoading('正在链接...');
                            break;
                        //重新链接
                        case RongIMLib.ConnectionStatus.DISCONNECTED:
                            console.log('断开连接');
                            $.showWarning('断开连接');
                            break;
                        //其他设备登录
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            console.log('其他设备登录');
                            $.showWarning('其他设备登录');
                            break;
                        //网络不可用
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            console.log('网络不可用');
                            $.showWarning('网络不可用');
                            window.location.reload();
                            break;
                    }
                }
            });

            // 消息监听器
            RongIMClient.setOnReceiveMessageListener({
                // 接收到的消息
                onReceived: function (message) {
                    // 先判断是否是这个组的消息
                    if(message.targetId !== groupId) return;

                    // 展示接收消息时间
                    showTimeStamp(message.receivedTime);

                    // 判断消息类型
                    switch(message.messageType){
                        case RongIMClient.MessageType.TextMessage:
                            showTxtMsg(message.content.user, message.content.content);
                            break;
                        case RongIMClient.MessageType.VoiceMessage:
                            showVoiceMsg(message.content.user, message.content.content, message.content.duration);
                            break;
                        case RongIMClient.MessageType.LocationMessage:
                            var content = message.content;
                            showLocation(content.user, {
                                address: content.poi,
                                point: {
                                    lat: content.latitude,
                                    lng: content.longitude
                                },
                                title: content.content
                            });
                            break;
                        default:
                        // 自定义消息
                        // do something...
                    }
                }
            });

            // 连接融云服务器。
            RongIMClient.connect(token, {
                onSuccess: function(userId) {
                    console.log("Login successfully." + userId);

                    client = RongIMClient.getInstance();

                    // 拉取历史信息
                    HistoryDate = initDate();
                    listloading = new Listloading('#listloading', {
                        pullDrefreshtxt: '<i class="icon-down"></i>加载往前一小时信息',
                        Realtimetxt: '松开加载往前一小时信息',
                        pullDownAction : function(cb){
                            HistoryDate.setHours(HistoryDate.getHours() - 1);
                            cb(getHistoryMsg(HistoryDate.format('yyyyMMddhh')));
                        },
                        iscrollOptions: {
                            scrollbars: false
                        }
                    });
                    listloading.iscroll.on('scrollMove', function () {
                        $chatWrap.find('.J-txt').blur()
                    });

                    client.joinGroup(groupId, groupName, {
                        onSuccess: function() {
                            // 加入群成功。
                            console.log('加入群成功');
                            $loading.fadeOut();
                            // 链接成功之后 绑定事件
                            bindEvent();
                        },
                        onError: function(error) {
                            // error => 加入群失败错误码。
                            $.showWarning('加入群聊失败：' + error);
                        }
                    });
                },
                onTokenIncorrect: function() {
                    console.log('token无效');
                    $.showWarning('token无效');
                },
                onError:function(errorCode){
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                            info = '不可接受的协议版本';
                            break;
                        case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                            info = 'appkey不正确';
                            break;
                        case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                            info = '服务器不可用';
                            break;
                    }
                    console.log(info);
                    $.showWarning(info);
                }
            });
        });
    }

    /**
     * 初始化 获取当前整数小时
     * @returns {Date}
     */
    function initDate() {
        var d = new Date,
            m = d.getMinutes();

        if(m > 0){
            d.setHours(d.getHours() + 1);
            // 暂时不考虑秒数的影响
        }

        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);

        return d
    }

    /**
     * 配置微信
     * @param config
     */
    function wxConfig(config) {
        // 微信配置
        wx.config({
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: [
                // 开始录音
                'startRecord',
                // 停止录音
                'stopRecord',
                // 监听录音自动停止接口
                'onVoiceRecordEnd',
                // 上传录音
                'uploadVoice',
                // 播放语音
                'playVoice',
                // 暂停播放
                'pauseVoice',
                // 停止播放
                'stopVoice',
                // 监听语音播放完毕
                'onVoicePlayEnd',
                // 隐藏菜单
                'hideAllNonBaseMenuItem'
            ]
        });

        wx.ready(function(){
            // 隐藏所有非基础按钮接口
            wx.hideAllNonBaseMenuItem();
            // 监听录音自动停止接口
            wx.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候
                // 直接发送音频
                complete: function (res) {
                    var localId = res.localId;
                    $sendMedia.text('按住 说话');
                    uploadVoice(localId, 60);
                }
            });

            // 监听语音播放完毕接口
            wx.onVoicePlayEnd({
                success: function (res) {
                    $('#localId_' + res.localId).data('isStart', false)
                }
            });
        });
    }

    /**
     * 初始化需要的数据
     * @param url
     * @param connect   回调
     */
    function initData(url, connect) {
        $.when(
            // 微信配置
            $.ajax({
                type: 'post',
                url: interfaces.getWxConfig,
                data: {
                    'url': location.href.split('#')[0]
                },
                dataType: 'json'
            }),
            // 业务数据 获取token, group, user
            $.ajax({
                type: 'post',
                url: url,
                headers: {
                    token: localStorage.getItem('tip')
                },
                data: {
                    orderId: groupId
                },
                dataType: 'json'
            })
        ).done(function(resp1, resp2){
            var business = resp2[0],
                config = resp1[0];

            if (business.status != 200 && business.status != 1) {
                $loading.fadeOut();
                return $.showWarning(business.tip || business.message || '未知错误')
            } else {
                // 由于后端司机端和乘客端的不同 ，做个兼容
                var data = business.values || business.data;

                if(!data || !data.token){
                    $loading.fadeOut();
                    return $.showWarning('获取IM用户token失败！')
                }

                // 根据获取的token连接im
                user = {
                    userId: data.userId,
                    userName: data.userName || localStorage.getItem('nick'),
                    userHeadUrl: data.userHeadUrl
                };

                // 调用链接回调
                connect(data.appKey, data.token, groupId, groupName);
            }

            // 微信配置
            if(config) wxConfig(config);
            else $.showWarning('获取微信配置数据错误！');

        }).fail(function (xhr, errorType, error) {
            alert(errorType + ': ' + error)
        });
    }

    /**
     * 向服务器请求历史消息
     * @param date
     */
    function getHistoryMsg(date) {

    }

    /**
     * 链接成功时候，绑定页面事件
     */
    function bindEvent() {
        bindSendVoiceEvent();
        bindVoiceEvent();
        bindTxtEvent();
        bindTabEvent();
        bindLocationEvent();
    }

    /**
     * 初始化发送语音提示
     */
    function initVoiceTip() {
        return $('<div class="im-voice-toast" style="display: none"><div class="voice-mask-transparent"></div><div class="voice-toast"><i class="toast-icon_toast icon-record-start"></i><div class="toast-content">手指上滑，取消发送</div> <div class="toast-content cancel-cnt">松开手指，取消发送</div></div></div>').appendTo('body')
    }

    /**
     * 绑定发送语音按钮事件
     */
    function bindSendVoiceEvent() {
        var clientX, clientY,
            offset = $chatWrap.offset(),
            height = offset.height,
            width = offset.width,
            left = offset.left,
            top = offset.top,
            time,
            $toast = initVoiceTip();

        $sendMedia.on("touchstart", function(ev){
            var touch = ev.targetTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;

            $sendMedia.text('松开 结束');
            $toast.fadeIn(100);

            wx.startRecord();

            time = new Date;

        }).on("touchmove", function(ev){
            event.preventDefault();
            var touch = ev.targetTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;

            if(top + height < clientY ||  clientY < top - 50 || left + width < clientX || clientX < left ) {
                $sendMedia.text('松开 取消');
                $toast.addClass('im-cancel')
            } else {
                $sendMedia.text('松开 结束');
                $toast.removeClass('im-cancel')
            }

        }).on("touchend", function(){
            $sendMedia.text('按住 说话');
            $toast.fadeOut(100);
            wx.stopRecord({
                success: function (res) {
                    var localId = res.localId;

                    if(top + height < clientY ||  clientY < top - 50 || left + width < clientX || clientX < left ) return;

                    var duration = Math.ceil(((new Date) - time)/1000);
                    uploadVoice(localId, duration <= 60 ? duration : 60);
                }
            });
        });
    }

    /**
     * 绑定语音相关事件
     */
    function bindVoiceEvent() {
        $msgWrap.on('click', '.msg-voice.msg-mine .msg-item-cnt', function () {
            // 本地使用微信播放语音

            var $self = $(this),
                id = $self.data('id'),
                isStart = $self.data('isStart');

            if(!isStart){
                // 播放语音接口
                wx.playVoice({
                    localId: id
                });

                $self.data('isStart', true)
            }else {
                // 停止播放接口
                wx.stopVoice({
                    localId: id
                });

                $self.data('isStart', false)
            }
        }).on('click', '.msg-voice:not(.msg-mine) .msg-item-cnt', function () {
            //接收到的语音使用IM播放接口

            var $self = $(this),
                duration = $self.data('duration'),
                audioFile = $self.data('audioFile'),
                isStart = $self.data('isStart');

            if(!isStart) {

                //预加载 + 播放
                RongIMLib.RongIMVoice.preLoaded(audioFile, function () {
                    // 播放声音
                    RongIMLib.RongIMVoice.play(audioFile, duration);
                    setTimeout(function () {
                        $self.data('isStart', false)
                    }, duration * 1000)
                });

                $self.data('isStart', true)
            }else {
                //停止播放
                RongIMLib.RongIMVoice.stop(audioFile);

                $self.data('isStart', false)
            }
        })
    }

    /**
     * 绑定切换语音/文字 tab按钮的事件
     */
    function bindTabEvent() {
        var $tab = $chatWrap.find('.J-tab'),
            $msg = $chatWrap.find('.J-txt');

        $tab.click(function () {
            if($chatWrap.hasClass('chat-txt')){
                // 切换成文字方式
                $chatWrap.removeClass('chat-txt').addClass('chat-voice');
                $msg.focus();
            }else {
                // 切换成语音方式
                $chatWrap.removeClass('chat-voice').addClass('chat-txt');
                $msg.blur();
            }
        })
    }

    /**
     * 绑定发送文字按钮事件
     */
    function bindTxtEvent() {
        var $msg = $chatWrap.find('.J-txt'),
            $submit = $chatWrap.find('.J-submit'),
            interval;

        $submit.click(function () {

            var txt = $msg.val();
            if(!txt) return;

            // 特殊字符处理
            txt = txt.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
                function($0){
                    var c = $0.charCodeAt(0), r = ["&#"];
                    c = (c == 0x20) ? 0xA0 : c;
                    r.push(c); r.push(";");
                    return r.join("");
                });

            // 展示发送消息时间
            showTimeStamp();

            // 文字消息实体
            var msg = new RongIMLib.TextMessage({content: RongIMLib.RongIMEmoji.emojiToSymbol(txt), extra: '附加消息', user: user}),
                $p = showTxtMsg(user, txt, true);

            $msg.val('');
            sendMessage($p, msg)
        });

        $msg.focus(function () {
            interval = setInterval(function() {
                document.body.scrollTop = document.body.scrollHeight
            }, 100)
        });

        $msg.blur(function () {
            clearInterval(interval)
        });

    }

    /**
     * 绑定发送位置按钮事件
     */
    function bindLocationEvent() {
        var $location = $chatWrap.find('.J-location'),
            location = new SelectLocationPoi({
                cityList: [{cityId: 3, cityName: '广州'}],
                defCity: {cityId: 3, cityName: '广州'},
                btnTxt: '发送',
                callback: function (location) {
                    if(!location) return;

                    // 展示发送消息时间
                    showTimeStamp();

                    // 本地展示位置信息
                    var $show = showLocation(user, location, true);

                    // 发送位置信息
                    sendMessage($show, new RongIMLib.LocationMessage({
                        "content": location.title,
                        "latitude": location.point.lat,
                        "longitude": location.point.lng,
                        "poi": location.address,
                        "extra":"位置信息",
                        "user": user
                    }))
                }
            });

        $location.click(function () {
            location.show()
        })
    }

    /**
     * 上传语音到微信服务器
     * @param localId
     * @param duration
     */
    function uploadVoice(localId, duration) {
        // 1.本地上传至微信
        wx.uploadVoice({
            localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
                var serverId = res.serverId; // 返回音频的服务器端ID

                showTimeStamp();
                // 2.本地利用微信接口展示回放
                var $show = showLocalVoice(localId, duration);
                // 3.由后台去下载，处理，传给IM，再发送消息推送给其他用户
                notifyServer(serverId, $show)
            }
        });
    }

    /**
     * 通知服务端去处理语音信息
     * @param media_id  微信服务端的音频id
     * @param $show     本地回显的dom的zepto对象
     */
    function notifyServer(media_id, $show) {
        // TODO 后台接口还未有
        console.log('media_id: ' + media_id)

        $loading = $.showLoading('消息发送中...');

        setTimeout(function () {
            // 重新计算列表上下拉高度
            listloading.refresh();

            // 将最新信息移动到底部
            var offset = listloading.iscroll.maxScrollY;
            listloading.iscroll.scrollTo(0, offset, 300, IScroll.utils.ease.quadratic);

        }, 300);

        $loading.fadeOut();
    }

    /**
     * 发送信息
     * @param $show  本地回显的dom的zepto对象
     * @param msg    消息实例
     */
    function sendMessage($show, msg) {
        $loading = $.showLoading('消息发送中...');

        setTimeout(function () {
            // 重新计算列表上下拉高度
            listloading.refresh();

            // 将最新信息移动到底部
            var offset = listloading.iscroll.maxScrollY;
            listloading.iscroll.scrollTo(0, offset, 300, IScroll.utils.ease.quadratic);

        }, 300);

        // 发送群组消息
        client.sendMessage(RongIMLib.ConversationType.GROUP, groupId, msg, {
                // 发送消息成功
                onSuccess: function (message) {
                    //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                    console.log("Send successfully");
                    $loading.fadeOut();
                },
                onError: function (errorCode,message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default :
                            info = x;
                            break;
                    }
                    console.log('发送失败:' + info);
                    $loading.fadeOut();
                    $.showWarning('发送失败: ' + info);
                    // 如果发送失败，给回显的结构一个error样式
                    $show.addClass('error')
                }
            }
        );
    }

    /**
     * 显示文字信息
     * @param user          消息来源
     * @param content       文字消息
     * @param isOwn         是否是自身(不传默认false)
     * @returns {zepto}     返回回显文字的dom的zepto对象
     */
    function showTxtMsg(user, content, isOwn) {
        return $('<div class="msg-item msg-txt' + (isOwn ? ' msg-mine' : '') + '"><div class="item-user">' + user.userName + '</div><div class="item-cnt">' +
            '<p class="msg-item-cnt">' + RongIMLib.RongIMEmoji.symbolToHTML(content) +'</p></div></div>').appendTo($msgWrap);
    }

    /**
     * 显示语音信息
     * @param user          消息来源
     * @param content       声音base64码。
     * @param duration      语音时长
     */
    function showVoiceMsg(user, content, duration) {
         var $wrap = $('<div class="msg-item msg-voice msg-mine"><div class="item-user">' + user.userName + '</div>' +
            '<div class="item-cnt">' +
            '<div class="msg-item-cnt" data-duration="'+ duration +'"><span class="fc-gray">'+ duration +'\'\'</span></div>' +
            '</div></div>').appendTo($msgWrap);

        $wrap.find('.msg-item-cnt').data('audioFile', content);
        return $wrap
    }

    /**
     * 本地回显语音信息
     * @param localId       本地音频id
     * @param duration      音频时长
     * @returns {zepto}     返回回显音频的dom的zepto对象
     */
    function showLocalVoice(localId, duration) {
        return $('<div class="msg-item msg-voice msg-mine"><div class="item-user">' + user.userName + '</div>' +
            '<div class="item-cnt">' +
            '<div class="msg-item-cnt" data-id="'+ localId +'" id="localId_'+ localId +'" style="width: '+ (50 + 2 * duration) + 'px;"><span class="fc-gray">'+ duration +'\'\'</span></div>' +
            '</div></div>').appendTo($msgWrap);
    }

    /**
     *  显示位置信息
     * @param location      位置信息
     * @param user          user信息
     * @param isOwn         是否是自身(不传默认false)
     * @returns {zepto}     返回回显位置的dom的zepto对象
     */
    function showLocation(user, location, isOwn) {
        return $('<div class="msg-item msg-location' + (isOwn ? ' msg-mine' : '') + '"><div class="item-user">' + user.userName + '</div><div class="item-cnt">' +
            '<a href="http://api.map.baidu.com/marker?location='+ [location.point.lat, location.point.lng].join(',') +'&title='+ location.title +'&content='+ (location.address || location.title)+'&output=html" class="msg-item-cnt">' +
            '<p class="location-txt">'+ location.title +'</p>' +
            '<p class="location-txt fc-gray">'+ location.address +'</p>' +
            '<div class="location-map" style="background: url(http://api.map.baidu.com/staticimage/v2?ak=k3sWNiZay0io4BEPXUehWFy4y2BBMHH0&mcode=666666&center='+[location.point.lng, location.point.lat].join(',')+'&dpiType=ph&width=400&height=160&zoom=16) no-repeat center/contain;"></div></a>' +
            '</div></div>').appendTo($msgWrap);
    }

    /**
     * 显示发送/接收消息的时间
     * @param time 时间 未传则取当前时间
     */
    function showTimeStamp(time) {
        if(time){
            time = new Date(time)
        }else {
            time = new Date
        }

        if(!timeStamp || (time - timeStamp)/1000 > 120) {
            var today = new Date,
                dateStr = "";

            // 设置today到凌晨0点
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);

            if(time < today){
                // 今天之前
                var interval = Math.ceil((today - time)/1000/3600/24);

                if(interval == 1){
                    dateStr = "昨天 "
                }else {
                    dateStr = '星期' + WEEKS[time.getDay()] + " "
                }
            }

            dateStr += time.format("h:mm");

            // 显示时间
            $msgWrap.append('<p class="msg-item msg-time"><span class="time-cnt">'+ dateStr +'</span></p>')
        }

        timeStamp = time;
    }

    return creactRIM;
});
