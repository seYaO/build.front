define("freeRoute/0.2.0/index",["common/0.1.0/index","./views/freeRoute.dot","./views/fashionShopping.dot",
    "./views/sceneryInfo.dot","./views/funFood.dot","./views/transportation.dot",
    "./views/EcommendedTravel.dot","./views/recommendRoute.dot"],function(require){
    var common = require("common/0.1.0/index");
    var freeRoute = {
        url: "/intervacation/api/TravelResourceDetail/GetTravelResourceDetail",
        el: "#J_travelDetail",
        host: window.host || "",
        sort: ["sceneryIntroduction","fashionNowShopping","funFood","transportation","EcommendedTravel"],
        param: {
            siteType: "0",
            lineId: ""
        },
        tmpl: {
            freeRoute: require("./views/freeRoute.dot"),
            fashionNowShopping: require("./views/fashionShopping.dot"),
            sceneryIntroduction: require("./views/sceneryInfo.dot"),
            funFood: require("./views/funFood.dot"),
            transportation: require("./views/transportation.dot"),
            EcommendedTravel: require("./views/EcommendedTravel.dot")
        },
        init: function(cfg){
            var self = this;
            $.extend(self,cfg);
            self.getData(function(data){
                var context = $(self.el),
                    tmpl = self.tmpl,
                    html = tmpl.freeRoute(data),
                    sortList = self.sort;
                context.empty().append(html);
                for(var i = 0, len = sortList.length -1; i<=len; i++){
                    var key = sortList[i];
                    if(data[key]&& data[key].length){
                        context.append(tmpl[key](data));
                    }
                }
                context.find(".route-item li").eq(0).addClass("current");
                context.find(".route-part").eq(0).removeClass("none");
                cfg.callback && cfg.callback.call(self,context);
            },function(data){
                var _tmpl = require("./views/recommendRoute.dot"),
                    context = $(self.el);
                var html = _tmpl(data);
                context.html(html);
                cfg.callback && cfg.callback.call(self,context);
            });
        },
        dealData: function(data){
            var recomTravel = data.EcommendedTravel;
            if(!(recomTravel && recomTravel.length)){
                return data;
            }
            for(var i = 0,len = recomTravel.length -1; i<=len; i++){
                var item = recomTravel[i];
                item.PassCity = item.PassCity.replace(/\${(\w+)}/g,function($0,$1){
                    return '<span class="icons-'+$1+'"></span>';
                });
            }
        },
        getData: function(callback,callback1){
            var self = this;
            $.ajax({
                url: self.host+ self.url,
                data: self.param,
                dataType: "jsonp",
                success: function(data){
                    if(data.Code == 4000){
                        if(data.Data && data.Data.travelResource){
                            var datas = data.Data.travelResource;
                            if(datas.LineDestinationPlayDetail && datas.LineDestinationPlayDetail.PlayDaysInfoList 
                            && datas.LineDestinationPlayDetail.PlayDaysInfoList.length!=0){
                                callback1.call(self,datas);
                            }else{
                                self.dealData(datas);
                                callback.call(self,datas);
                            } 
                        }
                    }else{
                        $(self.el).html("<p class='no-message'>暂时没有相关行程信息提供，具体信息请咨询客服人员！</p>");
                    }
                }
            })
        }
    };
    return freeRoute;
});