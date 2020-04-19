// 
;
! function($, window, document, undefined) {
    var utitl = require("../../../../utils/cruise.utility.js");
    var thisObj = thisObj || {};
    $.extend(thisObj, {
        init: function() {
            this.opts = this.opts || {};
            this.opts.sid = $("#HidSepecialId").val();
            this.opts.mids = $("#HidModuleId").val().split(",");
            this.opts.isApp = 0;
            this.areaCity = [{ "cityId": "321", "cityName": "上海" }, { "cityId": "80,91", "cityName": "广东" }, { "cityId": "343", "cityName": "天津" }];
            this.opts.cityId = $(".area-intro .txt").attr("attr-city-id");
            this.bindEvent();
        },
        bindEvent: function() {
            var _this = this,
                data;
            data = this.isAppData;
            if (!data) {
                this.isApp();
                return false;
            }
            this.opts.isApp = data.isApp;
            this.draw();
            $(".area-intro").on("click", function() {
                if ($(this).hasClass("curr")) {
                    $(this).removeClass("curr");
                } else {
                    $(this).addClass("curr");
                }
            });
            $(".area-box .list span").on("click", function(e) {
                e.stopPropagation();
                var cityId = $(this).attr("attr-city-id");
                _this.opts.cityId = cityId;
                $(".area-intro").removeClass("curr");
                dropDownBox(this);
                _this.draw();
            });

            function dropDownBox(elem) {
                var list = $(".area-box .list span");
                var cityId = $(elem).attr("attr-city-id");
                $(".area-intro .txt").html($(elem).html()).attr("attr-city-id", cityId);
                var areaList = [];
                for (var i = 0; i < _this.areaCity.length; i++) {
                    if (_this.areaCity[i].cityId != cityId) {
                        areaList.push(_this.areaCity[i]);
                    }
                }
                list.each(function(index) {
                    $(this).html(areaList[index].cityName + '出发').attr("attr-city-id", areaList[index].cityId);
                });
            }
        },
        draw: function() {
            var _this = this,
                elem, data;
            data = this.getCache(this.opts.cityId);
            if (!data) {
                this.load();
                return false;
            }
            var dataTemp = $("#dataTemplate").html(),
                linkTemp = $("#linkTemplate").html(),
                dataStr = '',
                seeStr = '',
                linkStr = '';
            utitl.forEach(data, function(index, item) {
                if (item['ModuleId'] == _this.opts.mids[0]) { // "多久没有陪伴父母？"
                    var list = item['moduleList'];
                    if (list && list[0]) {
                        utitl.forEach(list, function(_index, _item) {
                            var line = _item['LineList'];
                            if (_item['ModuleImageUrl'] && line && line[0]) {
                                dataStr += '<img src="{0}" alt="" class="big-img"><div class="data-line">'.format(_item['ModuleImageUrl']);
                                utitl.forEach(line, function(__index, __item) {
                                    dataStr += datas(__item);
                                });
                                dataStr += '</div>';
                            }
                        });
                    }
                }
                if (item['ModuleId'] == _this.opts.mids[1]) { // "你要的旅行 我陪你完成"
                    var list = item['moduleList'];
                    if (list && list[0]) {
                        utitl.forEach(list, function(_index, _item) {
                            var line = _item['LineList'];
                            if (_item['ModuleImageUrl'] && line && line[0]) {
                                seeStr += '<img src="{0}" alt="" class="big-img"><div class="data-line">'.format(_item['ModuleImageUrl']);
                                utitl.forEach(line, function(__index, __item) {
                                    seeStr += datas(__item);
                                });
                                seeStr += '</div>';
                            }
                        });
                    }
                }
                if (item['ModuleId'] == _this.opts.mids[2]) { // "你陪我长大 我伴你变老"
                    var list = item['moduleList'];
                    if (list && list[0]) {
                        var line = list[0]['LineList'];
                        utitl.forEach(line, function(_index, _item) {
                            linkStr += linkTemp.format(
                                (function() {
                                    var _str = '',
                                        _temp = 'href="/youlun/tours/{0}.html?saildate={1}&Key={2}"';
                                    if (_item['OtherSite']) {
                                        _str = _temp.format((function() {
                                            var __str = '';
                                            if (_this.opts.isApp == 0) {
                                                __str = _item['LineId'];
                                            } else {
                                                __str = _item['LineId'] + '_' + _this.opts.sid + '_1';
                                            }
                                            return __str;
                                        }()), _item['LineDate'], _item['Key']);
                                    }
                                    return _str;
                                }()),
                                _item['Pic'],
                                _item['Price'],
                                (function() {
                                    var date = new Date(_item['LineDate']);
                                    date = (date.getMonth() + 1) + '月' + date.getDate() + '日';
                                    return _item['CiName'] + ' ' + date;
                                }()),
                                (function() {
                                    var day, night;
                                    day = _item['Day'] ? _item['Day'] + '日' : '';
                                    night = _item['Night'] ? _item['Night'] + '晚' : '';
                                    return _item['StlViaPort'] + ' ' + night + day;
                                }()),
                                (function() {
                                    return _item['OtherSite'] ? '' : '<div class="in-soldOut"></div>';
                                }())
                            );
                        });
                    }
                }
            });
            $(".unit-go").html(dataStr);
            $(".unit-see").html(seeStr);
            if (linkStr) {
                linkStr = '<div class="in-data clearfix">{0}</div><div class="in-more"><a href="{1}" class="link">查看更多</a></div>'.format(
                    linkStr,
                    (function() {
                        var _str = '';
                        if (_this.opts.isApp == 0) {
                            _str = '//m.ly.com/youlun/cruise-line-3-9-0-0-0-0-0-0-0-1.html';
                        } else {
                            _str = '//shouji.17u.cn/internal/h5/file/3/main.html?wvc1=1&wvc2=1&wvc3=1#/calendar/3/0/0/0';
                        }
                        return _str;
                    }())
                );
            }
            $(".unit-in").html(linkStr);
            _this.loadWebp($(".content"));

            function datas(item) {
                var _str = '';
                _str = dataTemp.format(
                    (function() {
                        var _str = '',
                            _temp = 'href="/youlun/tours/{0}.html?saildate={1}&Key={2}"';
                        if (item['OtherSite']) {
                            _str = _temp.format((function() {
                                var __str = '';
                                if (_this.opts.isApp == 0) {
                                    __str = item['LineId'];
                                } else {
                                    __str = item['LineId'] + '_' + _this.opts.sid + '_1';
                                }
                                return __str;
                            }()), item['LineDate'], item['Key']);
                        }
                        return _str;
                    }()),
                    item['Pic'],
                    item['Price'],
                    (function() {
                        var date = new Date(item['LineDate']);
                        date = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
                        return date + ' ' + item['StlViaPort'];
                    }()),
                    (function() {
                        var Recommand = item['Recommand'];
                        var _str = '';
                        if (Recommand && Recommand[0]) {
                            utitl.forEach(Recommand.slice(0, 3), function(_index, _item) {
                                _str += '<span>{0}</span>'.format(_item.slice(0, 4));
                            });
                        }
                        return _str;
                    }()),
                    (function() {
                        return item['OtherSite'] ? '' : '<div class="data-soldOut"></div>';
                    }())
                );
                return _str;
            }
        },
        load: function() {
            var _this = this;
            if (this.ajaxObj) this.ajaxObj.abort();
            this.ajaxObj = $.ajax({
                type: "post",
                url: "/youlun/zhuanti/CruiseSpringFestivalJson2017",
                data: "cityId=" + _this.opts.cityId,
                dataType: "json",
                success: function(data) {
                    if (data) {
                        _this.DATA = _this.DATA || {};
                        _this.DATA[_this.opts.cityId] = data;
                        _this.draw();
                    }
                }
            });
        },
        isApp: function() {
            var _this = this;
            $.ajax({
                type: "post",
                url: "/youlun/isApp",
                dataType: "json",
                success: function(data) {
                    if (data) {
                        _this.isAppData = _this.isAppData || {};
                        _this.isAppData = data;
                        _this.bindEvent();
                    }
                }
            });
        },
        getCache: function(type) {
            var data = this.DATA;
            if (!(data && data[type])) return null;
            return data[type];
        },
        loadWebp: function(elem) {
            loadWebp({
                attr: 'data-nsrc',
                img: $(".nsrc-img", elem),
                replace: true,
                fn: function() {
                    $(".nsrc-img", elem).lazyload({ effect: 'fadeIn' });
                }
            })
        }
    });

    $(document).ready(function() {
        thisObj.init();
    });
}(Zepto, window, document);
