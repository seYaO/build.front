/**
 * Created by wj12961 on 2016/1/6.
 */
define("departure/0.1.0/index", ["departure/0.1.0/cityInfoLists", "departure/0.1.0/index.css"], function (require, exports, module) {
    require("departure/0.1.0/cityInfoLists");
    require("departure/0.1.0/index.css");
    var cityInfo = {}, $ = jQuery;
    var Departure = function (param) {
        $.extend(this.config, param||{});
    };
    Departure.prototype = {
        config: {
            className: '',
            eventType:'hover',    //eventType 位hover:鼠标移上去 显示列表城市，其他为点击显示列表城市
            type: 0,
            cityId:226,
            cityName:'苏州',
            success: function () {
            }
        },
        init: function () {
            var self = this;
            var str = '<b id="city_select" class="city_b" data-scid='+self.config.cityId+' ><strong>'+self.config.cityName+'</strong>&nbsp;出发<div class="line"><i></i></div></b><div id="popleave" class="none"  test=""> <div class="leavecity"></div></div>';
            $(self.config.className).html(str);

            var gStartingDataAsync = self.startCities();

            self.createStartCity('.leavecity', gStartingDataAsync, self.config.type ,function(){
                self.tabSel();
                if(self.config.eventType==="hover") {
                    self.hover();
                }else
                {
                    self.clickEvent();
                }
                self.selectCity();
            });
        },
        //标题tab切换
        tabSel: function () {

            $(".sub-scity-tips li").on('click', function (e) {
                e.stopPropagation();
                var _this = $(this);
                _this.addClass('cur').siblings('li').removeClass('cur');
                $('.scity-tips-main').eq(_this.index()).removeClass('none').siblings('div').addClass('none');
            });
        },
        grouping: function (str, scity) {
            var cityArry = [];
            for (var i = 0; i < scity.length; i++) {
                for (var j = 0; j < str.length; j++) {
                    if (scity[i].FirstLetter === str[j]) {
                        cityArry.push({'citytitle': str[j], 'citybody': scity[i].MatchCitys});
                    }
                }

            }

            return cityArry;
        },
        createStartCity: function (dom, asyncData, type ,callback) {
            var self = this;
            asyncData.then(function(data){

                data = self.processData(data);

                var html = '<div class="sub-scity-tips"><ul class="clearfix">', isFor = 0;

                if (type) {
                    var wUrl = window.location.href.split('dujiatag');
                    wUrl = wUrl[1].replace(/\/\w*\//, '');
                }

                for (var k = 0; k < data.length; k++) {
                    k ? html += '<li>' + data[k].desc + '</li>' : html += '<li class="cur">' + data[k].desc + '</li>';
                }
                html += '</ul>';

                for (var kk = 0; kk < data.length; kk++) {

                    kk ? html += '<div class="scity-tips-main none">' : html += '<div class="scity-tips-main">';

                    for (var j = 0; j < data[kk].cities.length; j++) {
                        html += '<dl class="clearfix">';
                        if (data[kk].cities[j].citytitle) {
                            html += '<dt>' + data[kk].cities[j].citytitle + '</dt>';
                        }
                        html += '<dd>';
                        for (var jj = 0; jj < data[kk].cities[j].citybody.length; jj++) {

                            if (data[kk].cities[j].citytitle) {
                                for (var ii = 0; ii < cityInfo.hotStartList.length; ii++) {
                                    if (cityInfo.hotStartList[ii].Name === data[kk].cities[j].citybody[jj].Name) {

                                        if (type) {
                                            html += '<a class="subcur" href="/dujiatag/' + data[kk].cities[j].citybody[jj].Pinyin + '/' + wUrl + '" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + '</a>';
                                        } else {
                                            html += '<a class="subcur" href="javascript:void(0);" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + '</a>';
                                        }
                                        isFor = 0;
                                        break;
                                    }
                                }

                                if (isFor) {
                                    if (type) {
                                        html += '<a href="/dujiatag/' + data[kk].cities[j].citybody[jj].Pinyin + '/' + wUrl + '" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + '</a>';
                                    } else {
                                        html += '<a href="javascript:void(0);" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + '</a>';
                                    }
                                }

                                isFor = 1;

                            } else {
                                if (type) {
                                    html += '<a class="mbot5" href="/dujiatag/' + data[kk].cities[j].citybody[jj].Pinyin + '/' + wUrl + '" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + '</a>';
                                } else {
                                    html += '<a class="mbot5" href="javascript:void(0);" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + '</a>';
                                }
                            }


                        }

                        html += '</dd></dl>';
                    }

                    html += '</div>';

                }

                html += '</div>';

                $(dom).html(html);

                callback && callback();
            });
        },
        clickEvent:function(){
            var doc = $(document),
                panel = $(this.config.className),
                tips = panel.find(".sub-scity-tips");
            panel.on("click",function(e){
                if(!$.contains(tips[0],e.target)) {
                    $("#popleave").toggle();
                    $(".city_b").toggleClass("city_b_hover");
                }
            });
            //tips.on("click",function(e){
            //    e.stopPropagation();
            //});
            doc.on("click",function(e){
                if(!$.contains(panel[0],e.target)){
                    $("#popleave").hide();
                    $(".city_b").removeClass("city_b_hover");
                }
            });

        },
        hover: function () {
            var self = this;

            $(self.config.className).hover(function () {
                self.show();
            }, function () {
                self.hide();
            });
        },
        show: function () {
            $('.city_b').addClass("city_b_hover");
            $('#popleave').show();
        },
        hide: function () {
            $('.city_b').removeClass("city_b_hover");
            $('#popleave').hide();
        },
        selectCity: function () {
            var self = this;
            $('.scity-tips-main a').on('click', function (e) {
                e.stopPropagation();
                var cityid = $(this).attr('cityid'),
                    cityname = $(this).text();
                $('#city_select').attr('data-scid', cityid).find('strong').html(cityname);

                self.hide();
                self.success();
            });
        },
        success: function () {
            var self = this;
            if (self.config.success) {
                self.config.success.call(self);
            }
        },
        /**
         * 出发地数据源
         * @param config
         */
        startCities: function () {
            var url = "http://www.ly.com/dujia/AjaxActivity.aspx?type=QueryIndexTotalCity";
            var param = {
                "lineType": "0,1"
            };
            var obj,self=this;
            return $.ajax(url, {
                data : param,
                dataType: "jsonp"
            });

        },
        processData: function(data){
            var self = this;
            cityInfo.hotStartList = data.group.start.hot;
            cityInfo.startList = data.group.start.common;
            return [
                {
                    "desc": "热门",
                    "cities": [
                        {"citytitle": '', "citybody": cityInfo.hotStartList}
                    ]
                }, {
                    "desc": "ABCDEF",
                    "cities": self.grouping('ABCDEF', cityInfo.startList)

                }, {
                    "desc": "GHJKLM",
                    "cities": self.grouping('GHJKLM', cityInfo.startList)
                }, {
                    "desc": "NPQRS",
                    "cities": self.grouping('NPQRS', cityInfo.startList)
                }, {
                    "desc": "TWXYZ",
                    "cities": self.grouping('TWXYZ', cityInfo.startList)
                }
            ];
        }
    };
    return Departure;
});
