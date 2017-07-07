/**
 * Created by user on 2017/6/27.
 *
 * 地图选择位置的poi点
 */
;(function(root, factory) {
    root.SelectLocationPoi = factory(root.Zepto, root.BMap);
})(this, function($, BMap) {
    'use strict';

    // 全局方法 地址列表模板
    var renderList = template.compile('<% for(var i = 0; i < list.length; i++){ %><div class="sel-cell<% if(i === index){ %> selected<% } %>" data-index="<%= i %>"><p><%= list[i].title %></p><small class="fc-gray"><%= list[i].address %>&nbsp;</small></div><% } %>');

    /**
     * 构造函数
     * @param options
     * @constructor
     */
    function SelectLocationPoi(options) {
        var $location = $('<div class="main-wrap sel-addr sel_location" style="display: none"></div>').appendTo(document.body),
            $selAddr = $('<div class="sel-addr" style="display: none"></div>').appendTo(document.body);

        this._defCity = options.defCity;
        this._cityList = options.cityList;
        this._btnTxt = options.btnTxt || '确定';
        this._callback = options.callback;
        // 当前城市信息
        this._curCity = {};
        // 选择地址页面
        this._$location = $location;
        // 搜索地址页面
        this._$selAddr = $selAddr;
        // 搜索地址输入框
        this._$queryAddr = null;
        // 切换城市select
        this._$selCity = null;
        // 可选的位置列表
        this._poisList = options.poisList || null;
        // 可选位置列表wrap
        this._$poisListWrap = null;
        // 搜索的位置列表
        this._list = null;
        // 搜索的位置的wrap
        this._$listWrap = null;
        // 选中的位置
        this._location = null;
        // 定位到的位置
        this._point = null;
        this._map = null;

        this._init();
    }

    var p = SelectLocationPoi.prototype;
    p.constructor = SelectLocationPoi;

    /**
     * 初始化界面
     * @private
     */
    p._init =  function () {
        // 初始化位置页面
        this._initLocationHtml();
        // 初始化搜索页面
        this._initAddrHtml();
        // 绑定页面事件
        this._bindEvent();
        // 初始加载完页面手动触发hashchange事件
        if(window.location.hash) (this._hashchange())();
    };

    /**
     * 绑定事件
     * @private
     */
    p._bindEvent = function () {
        // 绑定hashchange 事件
        window.addEventListener('hashchange', this._hashchange());

        // 选择位置的页面的事件
        bindLocationEvent(this);

        // 搜索地址页面的事件
        bindSelAddrEvent(this)
    };

    /**
     * 定位
     * @private
     */
    p._geolocation = function () {
        var geolocation = new BMap.Geolocation(),
            $loading = $.showLoading('定位中...'),
            curCity = this._curCity,
            cityList = this._cityList,
            _self = this;

        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var point = r.point;

                // 记录定位到的位置
                _self._point = point;

                // 解析地址
                getLocation(point, _self, function (adrComp) {

                    // 当前城市信息
                    curCity.cityName = adrComp.city;
                    for (var i = 0, curCityName = curCity.cityName, len = cityList.length; i < len; i++) {
                        var city = cityList[i];
                        if (curCityName.indexOf(city.cityName) !== -1) {
                            curCity = _self._curCity = city;
                            break;
                        }
                    }
                    // 切换城市选中当前城市
                    _self._$selCity.val(curCity.cityId);

                    // 在地图上标记
                    _self._markPosition();

                    $loading.fadeOut();
                })
            }else {
                // 定位位置的pois
                _self._poisList = [];

                // 定位失败的时候，默认为是广州
                curCity = _self._curCity = _self._defCity;

                // 切换城市选中当前城市
                _self._$selCity.val(curCity.cityId);

                // 在地图上标记
                _self._markPosition();

                $loading.fadeOut();
            }
        },{enableHighAccuracy: true})
    };

    /**
     * hashchange事件回调
     * @returns {Function}
     * @private
     */
    p._hashchange = function () {
        var $location = this._$location,
            $selAddr = this._$selAddr,
            $queryAddr = this._$queryAddr,
            _self = this;

        return function () {
            var cityName = _self._curCity.cityName;
            switch (window.location.hash){
                case '#SEL_LOCATION':
                    // 没有当前城市信息，则定位
                    if(!cityName) _self._geolocation();

                    $location.show();
                    $selAddr.hide();
                    $queryAddr.val('').blur();

                    // 有定位信息，则直接在地图上标点
                    if(cityName) _self._markPosition(true);
                    break;
                case '#SEL_ADDR':
                    if(!cityName) _self._geolocation();
                    $selAddr.show();
                    $location.hide();
                    break;
                default:
                    $queryAddr.val('').blur();
                    $location.hide();
                    $selAddr.hide();
            }
        }
    };

    /**
     * 初始化城市/地址选择页面
     */
    p._initAddrHtml = function () {
        var cityList = this._cityList,
            $selAddr = this._$selAddr;

        this._$listWrap = $selAddr.append('<header class="search-wrap"><select class="sel-city J-selCity">'
                + template.render('<% for(var i = 0; i < list.length; i++){ %><option value="<%= list[i].cityId %>"><%= list[i].cityName %></option><% } %>', {list: cityList})
                + '</select><input class="search-txt J-queryAddr" placeholder="搜索地址"></header><div class="sel-cells"></div>').find('.sel-cells');

        this._$queryAddr = $selAddr.find('.J-queryAddr');
        this._$selCity = $selAddr.find('.J-selCity');
    };

    /**
     * 初始化选择位置页面
     * @private
     */
    p._initLocationHtml = function () {
        this._$poisListWrap = this._$location.append('<header class="search-wrap"><button type="button" class="btn btn-search">搜索地址</button><button type="button" class="btn btn-send">' + this._btnTxt + '</button></header><div class="sel-map J-BMap"></div><button type="button" class="btn btn-origin">回到定位点</button><div class="cell-wrap"><div class="sel-cells"></div></div>').find('.sel-cells');
    };

    /**
     * 在地图上标记位置
     * @param reset   是否重新初始化地图
     * @private
     */
    p._markPosition = function (reset) {
        var $el = this._$location.find('.J-BMap'),
            map = this._map,
            location = this._location,
            point = this._point,
            curCity = this._curCity;

        // 给予reset来控制重新初始化地图
        // 是由于切换会location页面时，由于之前元素不可见等原因，地图展示会不准确
        if(!map || reset) {
            // 先解绑原地图的事件
            removeMapEvent(map);

            // 初始化地图对象
            map = this._map = new BMap.Map($el[0], {enableMapClick: false});

            // 对新地图对象绑定事件
            bindMapEvent(map, this);

            // 标记定位位置
            var marker = new BMap.Marker(point, {
                icon: new BMap.Icon('../static/image/myself.png', new BMap.Size(32, 32))
            });
            map.addOverlay(marker);

            if(location){
                map.centerAndZoom(location.point, 16);
            }else if(point){
                map.centerAndZoom(point, 16);
            }else {
                map.centerAndZoom(curCity.cityName);
            }

        }else if(location){
            map.panTo(location.point);
        }
    };

    /**
     * 填充列表数据
     * @param $list 列表dom的zepto对象
     * @param list  列表数据
     * @param index 列表选中的行
     */
    function fillList($list, list, index) {
        if(list && list.length){
            $list.empty().append(renderList({list: list, index: index || 0}));
        }
    }

    /**
     * location页面事件绑定
     * @param root
     */
    function bindLocationEvent(root) {
        var $poisListWrap = root._$poisListWrap,
            callback = root._callback;

        root._$location.on('click', '.btn-search', function () {
            // 跳转到搜索地址页面
            window.location.hash = '#SEL_ADDR'
        }).on('click', '.btn-send', function () {
            // 确定选择地址
            window.history.back();
            callback && callback(root._location);
        }).on('click', '.sel-cell:not(.selected)', function () {
            var $self = $(this),
                index = $self.data('index'),
                // _poisList不提出去，因为页面切换的时候会动态改变
                location = root._poisList[index];

            $poisListWrap.find('.selected').removeClass('selected');
            $self.addClass('selected');

            // 改变选中的位置
            root._location = location;

            // 改变地图中心点
            // 不提出去，是因为此时map对象对动态改变
            root._map.panTo(location.point)
        }).on('click', '.btn-origin', function () {
            // 重新定位，并回到源点
            root._geolocation();
        });
    }

    /**
     * sel_addr页面事件绑定
     * @param root
     */
    function bindSelAddrEvent(root) {
        var $queryAddr = root._$queryAddr,
            $listWrap = root._$listWrap,
            searchList = root._list;

        root._$selAddr.on('input', '.J-queryAddr', function () {
            var txt = $queryAddr.val().trim(),
                curCity = root._curCity;

            if (!txt) return;

            var local = new BMap.LocalSearch(curCity.cityName, {
                onSearchComplete: function (r) {
                    if (r) {
                        var number = r.getCurrentNumPois(),
                            list = [];
                        for (var i = 0; i < number; i++) {
                            list.push(r.getPoi(i))
                        }

                        // 记录搜索的列表数据
                        searchList = root._list = list;

                        // 填充列表
                        fillList($listWrap, list);
                    }
                }
            });

            local.search(txt.trim(), {forceLocal: true})
        }).on('click', '.sel-cell', function () {
            var $self = $(this),
                index = $self.data('index'),
                point = searchList[index].point;

            // 获取选中地址周边pois
            getLocation(point, root, function () {

                // 回到location页面，hashchange事件回调会改变地图中心点
                window.history.back();
            });
        }).on('change', '.J-selCity', function () {
            var $selCity = root._$selCity,
                cityId = $selCity.val();

            root._curCity = {
                cityId: cityId,
                cityName: $selCity.find('option[value="'+ cityId +'"]').text()
            }
        });
    }

    /**
     * 绑定map事件
     * @param map
     * @param root
     */
    function bindMapEvent(map, root) {
        if(!map) return;

        map.addEventListener('dragend', callback);
        map.addEventListener('zoomend', callback);

        function callback() {
            var center = map.getCenter();
            getLocation(center, root, function () {

                // 在地图上标记
                root._markPosition();
            })
        }
    }

    /**
     * map事件解绑
     * 用于重新初始化地图之前，对原地图对象的事件解绑
     * @param map
     */
    function removeMapEvent(map) {
        if(!map) return;

        map.removeEventListener('dragend');
        map.removeEventListener('zoomend')
    }

    /**
     * 根据point获取位置信息
     * @param point
     * @param root
     * @param callback
     */
    function getLocation(point, root, callback) {
        var geoc = new BMap.Geocoder();
        geoc.getLocation(point, function(rs){
            // 地址信息
            var adrComp = rs.addressComponents,
                // 周围pois
                pois = rs.surroundingPois || [],
                // 详细地址
                address = rs.address,
                temp = {};

            // 构造定位到的位置点
            temp.title = adrComp.district + adrComp.street + adrComp.streetNumber;
            temp.address = address;
            temp.point = point;

            // 将定位到的点，作为第一个poi点
            pois.unshift(temp);

            // 1. 改变记录定位位置的pois
            root._poisList = pois;

            // 2. 改变选中的位置
            root._location = temp;

            // 3. 填充列表
            fillList(root._$poisListWrap, pois);

            // 4. 执行回调函数
            callback && callback(adrComp, pois);
        });
    }

    /**
     * 对外开放接口
     * 展示选位置页面
     */
    p.show = function (callback) {
        window.location.hash = '#SEL_LOCATION';
        callback && callback()
    };

    return SelectLocationPoi;
});
