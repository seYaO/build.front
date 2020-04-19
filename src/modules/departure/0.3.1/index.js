/**
 * Created by gdy37773 on 2017/3/9.
 */
var dataCity = require("modules/departure/0.3.1/cityInfoLists");
var cityInfo = {}, $ = jQuery;
var strTmpl = '<div id="endPopleave" class="popleave none"  test=""> <div class="leavecity"></div></div>';
var DepartureEnd = function (param) {
    $.extend(this.config, param||{});
};


DepartureEnd.prototype = {
    config: {
        className: '',
        eventType:'click',    //eventType 位hover:鼠标移上去 显示列表城市，其他为点击显示列表城市
        type: 0,
        cityId:226,
        cityName:'苏州',
        initRender:function(){},
        success: function () {
        }
    },
    init: function () {
        var self = this ,str = '';
        str = strTmpl.replace('{cityId}',self.config.cityId);
        $(self.config.className).append(str);

        // var gStartingDataAsync = self.startCities();

        self.createStartCity('.J_endCity .leavecity', self.config.type ,function(){
            //self.renderInitCity(self.config);
            self.tabSel();
            if(self.config.eventType==="hover") {
                self.hover();
            }else
            {
                self.clickEvent();
            }
            self.selectCity();
            self.config.initRender();
        });
    },
    //标题tab切换
    tabSel: function () {

        $(".sub-scity-tips li").on('click', function (e) {
            e.stopPropagation();
            var _this = $(this);
            _this.addClass('cur').siblings('li').removeClass('cur');
            _this.parents('.leavecity').find('.scity-tips-main').eq(_this.index()).removeClass('none').siblings('div').addClass('none');
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
    createStartCity: function (dom, type ,callback) {
        var self = this;
        // asyncData.then(function(data){

            data = self.processData();

            var html = '<div class="sub-scity-tips"><ul class="clearfix">', isFor = 0;

            if (type) {
                var wUrl = window.location.href.split('dujiatag');
                wUrl = wUrl[1].replace(/\/\w*\//, '');
            }

            for (var k = 0; k < data.length; k++) {
                k ? html += '<li ProjectId="' + data[k].ProjectId + '">' + data[k].desc + '</li>' : html += '<li class="cur" ProjectId="' + data[k].ProjectId + '">' + data[k].desc + '</li>';
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
        // });
    },
    renderInitCity:function(param){
        var str = '',self = this;
        var cityBox = $('.J_endCity');
        if(param.cityName){
            str = $(self.config.className).html().replace(/{(\w+)}/g,param.cityName);
            $(self.config.className).append(str);
        }else{
            var cityId = $(".scity-tips-main dd a");
            cityId.map(function(index,item){
                if($(item).attr('cityid') == param.cityId){
                    str = $(self.config.className).html().replace(/{(\w+)}/g,$(item).text());
                    $(self.config.className).append(str);
                }
            })
        }
        if(cityBox && cityBox.hasClass('none')){
            cityBox.removeClass('none');
        }
    },
    clickEvent:function(){
        var doc = $(document),
            panel = $(this.config.className),
            tips = panel.find(".sub-scity-tips");
        panel.find('input').on("click",function(e){
            if(!$.contains(tips[0],e.target)) {
                $(e.target).parents('.J_endCity').find(".leavecity").addClass("leavecity-enter");
                $(e.target).parents('.J_endCity').find("#endPopleave").toggle();
            }
        });
        panel.on("mouseleave",function(e){
            if(!$.contains(tips[0],e.target)) {
                $(e.target).parents('.J_endCity').find(".leavecity").removeClass("leavecity-enter");
                $(e.target).parents('.J_endCity').find("#endPopleave").hide();
            }
        });
        //tips.on("click",function(e){
        //    e.stopPropagation();
        //});
        doc.on("click",function(e){
            if(!$.contains(panel[0],e.target)){
                $(e.target).find("#endPopleave").hide();
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
        $('#endPopleave').show();
    },
    hide: function () {
        $('#endPopleave').hide();
    },
    selectCity: function () {
        var self = this,
            param = {};
        $('.scity-tips-main a').on('click', function (e) {
            e.stopPropagation();
            var cityid = $(this).attr('cityid'),
                cityname = $(this).text();
            param.cityid = cityid;
            param.cityname = cityname;
            param.parent = $(this).parents('.J_endCity');
            $(".leavecity").removeClass("leavecity-enter");
            self.hide();
            self.success(param);
        });
    },
    success: function (param) {
        var self = this;
        if (self.config.success) {
            self.config.success.call(self,param);
        }
    },
    processData: function(){
        var endCityInfo = dataCity;
        return [
            {
                "desc":  endCityInfo.endList[0].CityInfo,
                "ProjectId": endCityInfo.endList[0].ProjectId,
                "cities": [
                    {"citytitle": '', "citybody": endCityInfo.endList[0].MatchCitys}
                ]
            }, {
                "desc":  endCityInfo.endList[1].CityInfo,
                "ProjectId": endCityInfo.endList[1].ProjectId,
                "cities":  [
                    {"citytitle": '', "citybody": endCityInfo.endList[1].MatchCitys}
                ]

            }, {
                "desc":  endCityInfo.endList[2].CityInfo,
                "ProjectId": endCityInfo.endList[2].ProjectId,
                "cities":  [
                    {"citytitle": '', "citybody": endCityInfo.endList[2].MatchCitys}
                ]
            }
        ];
    }
};
return DepartureEnd;