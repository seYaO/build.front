(function(){
    function City(){
        var self = this;
        // factory or constructor
        if (!(self instanceof City)) {
            return new City();
        }
    }
    var Common = require("modules-touch/common/index"),
        tmpl = __inline("./views/dest.dot");
    City.prototype = {
        el: "body",
        storeKey: "cj_dest_history",
        url: Config.getInterface("destCityLocate", "wx"),
        init: function(cfg){
            var self = this;
            $.extend(self,cfg);
            self.getHistory();
            if(!self.isInit||self.isSameParam(cfg.param)){
                self.get();
                self.isInit = true;
            }
        },
        isSameParam: function(param){
            return this.param.queryType === param.queryType;
        },
        get: function(){
            var self = this,
                url = self.url+ $.param(self.param);
            Common.getData(url,function(data){
                data.history = self.history;
                self.render(data);
                self.renderSuggest(data.DepartCity);
            });
        },
        getHistory: function(){
            var self = this,
                his = localStorage.getItem(self.storeKey);
            if(!his){
                return self.history = [];
            }
            return self.history = his.split(",");
        },
        setHistory: function(cityName){
            var self = this,
                history = self.history;
            var index = history.indexOf(cityName);
            if(~index){
                history.splice(index,1);
            }
            self.history = history = [cityName].concat(history);
            localStorage.setItem(self.storeKey,history.join(","));
            var hisEl = $(".J_History");
            hisEl.find("ul").empty().append("<li>"+history.join("</li><li>")+"</li>");
            hisEl.removeClass("none");
        },
        clearHistory: function(){
            localStorage.removeItem(this.storeKey);
            this.history = [];
            var hisEl = $(".J_History");
            hisEl.find("ul").empty();
            hisEl.addClass("none");
        },
        render: function(data){
            var self = this,
                html = tmpl(data);
            $(self.el).empty().append(html);
            self.initEvent();
        },
        initEvent: function(){
            var self = this;
            $(".J_DestPage").on("click",".city-dest li",function(){
                var me = $(this),
                    cityName = me.text();
                self.setHistory(cityName);
                self.itemClick && self.itemClick.call(self,cityName,this);
            });
            $(".J_ClearHis").on("click",function(){
                self.clearHistory();
            });
        },
        renderSuggest: function(sugData){
            var self = this,
                Suggest = require("modules-touch/suggest/index"),
                sugEl = $(".J_DestPage .searchbox");
            var sug;
            sug= new Suggest({
                deal: function(data){
                    var retData = [],
                        indexData = [];
                    delete(data["热门"]);
                    for(var i in data){
                        var itemData = data[i];
                        if(itemData){
                            for(var n in itemData){
                                var _itemData = itemData[n];
                                if(_itemData){
                                    indexData.push(_itemData.PinYin);
                                    retData.push(_itemData.Name);
                                }
                            }
                        }
                    }
                    return {
                        indexData: indexData,
                        data: retData
                    };
                },
                elements: {
                    input: sugEl.find("input"),
                    wrap: sugEl,
                    close: sugEl.find(".cancel"),
                    quickdel: sugEl.find(".clear")
                },
                afterShow: function(){
                    sugEl.removeClass("search-reset");
                    $(".J_CityBox").hide();
                },
                afterCancel: function(){
                    sugEl.addClass("search-reset");
                    $(".J_CityBox").show();
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
