/**
 * @ym10862 changed
 * @des 由于city.js组件中的如果加id时，搜索历史有问题，所以复制一个城市定位组件，themeCity
 * @使用页面：touch主题游出发地，touch站首页出发地
 */
(function(){
    function City(){
        var self = this;
        // factory or constructor
        if (!(self instanceof City)) {
            return new City();
        }
    }
    var Common = require("modules-touch/common/index"),
        IScroll = require("modules-touch/utils/iscroll/index"),
        iScroll,
        loc = require("modules-touch/utils/location/index");
    tmpl = require("./views/dep.dot");
    City.prototype = {
        el: "body",
        storeKey: "theme_dep_history",
        startCityKey:"start_City",
        defaultData:{},
        init: function(cfg){
            var self = this;
            $.extend(self,cfg);
            if(!self.isInited){
                self.getHistory();
                self.get();
                self.isInited = true;
            }else{
                self.show();
            }

        },

        show: function(){
            $(this.el).show();
        },
        get: function(){
            var self = this,
                url = "//wx.17u.cn/ivacation/ajaxhelper/GetDepartCityList";
            Common.getData(url,function(data){
                data.navH = ($(window).height()-60*2);
                //获取页面同步的城市和id，保证页面显示城市和点击出发地当前城市一致
                //data.now = loc.getLocalLoc()||loc.defaultCity;
                data.nowId = self.cfg.cityIdPre;
                data.now = self.cfg.cityNamePre;
                data.history = self.history;
                self.render(data);
                self.renderSuggest(data.DepartCity);
            });
        },
        getHistory: function(){
            var self = this,
                his = JSON.parse(localStorage.getItem(self.storeKey));
            if(!his){
                return self.history = {};
            }
            return self.history = his;
        },
        setHistory: function(cityName,cityEnName,DepartCityId){
            var self = this,
                history = self.history;
            if (!history.cityName) {
                history.cityName = [];
                history.cityEnName = [];
                history.DepartCityId = [];
            }
            var index = history.cityName.indexOf(cityName),
                enIndex = history.cityEnName.indexOf(cityEnName),
                idIndex = history.DepartCityId.indexOf(DepartCityId);
            if(~index){
                history.cityName.splice(index,1);
            }
            if(~enIndex){
                history.cityEnName.splice(index,1);
            }
            if(~idIndex){
                history.DepartCityId.splice(index,1);
            }
            self.history.cityName = history.cityName = [cityName].concat(history.cityName);
            self.history.cityEnName = history.cityEnName = [cityEnName].concat(history.cityEnName);
            self.history.DepartCityId = history.DepartCityId = [DepartCityId].concat(history.DepartCityId);
            localStorage.setItem(self.storeKey,JSON.stringify(history));
            var hisEl = $(".J_DepHistory");
            var len = Math.min(history.cityName.length - 1, 5),
                hisArr = [],hisHtml;
            for (var i = 0; i <= len; i++) {
                hisHtml = "<li class='needsclick' data-id='"+history.DepartCityId[i]+"' data-name='"+history.cityName[i]+"' data-en='"+history.cityEnName[i]+"'>"+history.cityName[i]+"</li>";
                hisArr.push(hisHtml);
            }
            hisEl.find("ul").empty().append(hisArr.toString().replace(/,/g,""));
            hisEl.removeClass("none");
        },
        render: function(data){
            var self = this,
                html = tmpl(data);
            $(self.el).append(html);
            self.initEvent();
        },
        clearHistory: function(){
            localStorage.removeItem(this.storeKey);
            this.history = {};
            var hisEl = $(".J_DepHistory");
            hisEl.find("ul").empty();
            hisEl.addClass("none");
        },
        scrollToElement: function(el){
            if(Common.isIOS){
                iScroll.scrollToElement(el,300);
            }else{
                document.body.scrollTop =  $(el).offset().top;
            }
        },
        initEvent: function(){
            var self = this;
            if(Common.isIOS){
                $(".dep-outer").addClass("is-ios");
                $(".J_DepPage").height($(window).height());
                iScroll = new IScroll($(".J_DepPage")[0],{mouseWheel:false,disableMouse:false,click: true});
            }

            var cityNav = $(".J_CityNav"),
                lastTop = 0,
                timeoutT;
            //cityNav.css("top","auto");
            document.addEventListener("touchstart", function(){}, true);
            cityNav.on("touchstart","li",function(g){
                var me = $(this);
                me.addClass("nav-active").siblings().removeClass("nav-active");
            }).on("touchend","li", function() {
                var me = $(this);
                cityNav.removeAttr("style");
                //me.removeClass("nav-active");
                var key = me.attr("data-key");
                if(timeoutT){
                    window.clearTimeout(timeoutT);
                }
                timeoutT = window.setTimeout(function(){
                    self.scrollToElement($(".city-key-"+key)[0]);
                },200);

            });
            $(".J_CityWrapper li").on("click", function () {
                var cityName = $(this).attr("data-name"),
                    cityid = $(this).attr("data-id"),
                    cityEnName = $(this).attr("data-en");
                if(cityName){
                    self.setHistory(cityName,cityEnName,cityid),
                    self.itemClick && self.itemClick.call(self,cityName,cityid,this);
                }
            });
            $(".J_DepPage").on("click", ".J_DepHistory li, .sug-list div", function () {
                var cityName = $(this).text(),
                    cityid = $(this).attr("data-id"),
                    cityEnName = $(this).attr("data-en");
                if(cityName){
                    self.setHistory(cityName,cityEnName,cityid);
                    self.itemClick && self.itemClick.call(self,cityName,cityid,this);
                }
            });
            $(".J_DepClearHis").on("click",function(){
                self.clearHistory();
            });
        },
        renderSuggest: function(sugData){
            var self = this,
                Suggest = require("modules-touch/newsuggest/index"),
                sugEl = $(".J_DepPage .searchbox");
            var sug;
            sug= new Suggest({
                deal: function(data){
                    var retData = [],
                        idData = [],
                        indexData = [];
                    delete(data.Hot);
                    for(var i in data){
                        var itemData = data[i];
                        if(itemData){
                            for(var n in itemData){
                                var _itemData = itemData[n];
                                if(_itemData){
                                    indexData.push(_itemData.PinYin);
                                    retData.push(_itemData.Name);
                                    idData.push(_itemData.DepartCityId);
                                }
                            }
                        }
                    }
                    return {
                        indexData: indexData,
                        data: retData,
                        idData:idData
                    };
                },
                elements: {
                    input: sugEl.find("input"),
                    wrap: sugEl,
                    quickdel: sugEl.find(".clear"),
                    close: sugEl.find(".cancel")
                },
                showQuickDel: true,
                afterShow: function(){
                    sugEl.removeClass("search-reset");
                    $(".J_CityBox").hide();
                    $(".J_CityNav").hide();
                },
                afterCancel: function(){
                    sugEl.addClass("search-reset");
                    $(".J_CityBox").show();
                    $(".J_CityNav").show();
                },
                itemClick: function(el){
                    sug.hide(true);
                    self.itemClick.call(self,el.attr("data-item"));
                },
                localStorageKey: self.storeKey,
                requestData: sugData
            });
        }
    };
    module.exports = City();
}());
