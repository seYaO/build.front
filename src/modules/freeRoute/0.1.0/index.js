define("freeRoute/0.1.0/index",["common/0.1.0/index","tmpl/pc/newdetails/freeRoute","tmpl/pc/newdetails/fashionShopping",
    "tmpl/pc/newdetails/sceneryInfo","tmpl/pc/newdetails/funFood","tmpl/pc/newdetails/transportation","tmpl/pc/newdetails/EcommendedTravel"],function(require){
    var common = require("common/0.1.0/index");
    var freeRoute = {
        url: "/dujia/AjaxHelper/ToursHandler.ashx?action=GetTravelResourceDetail",
        el: "#J_travelDetail",
        host: window.host || "",
        sort: ["sceneryIntroduction","fashionNowShopping","funFood","transportation","EcommendedTravel"],
        param: {
            lineId: ""
        },
        tmpl: {
            freeRoute: require("tmpl/pc/newdetails/freeRoute"),
            fashionNowShopping: require("tmpl/pc/newdetails/fashionShopping"),
            sceneryIntroduction: require("tmpl/pc/newdetails/sceneryInfo"),
            funFood: require("tmpl/pc/newdetails/funFood"),
            transportation: require("tmpl/pc/newdetails/transportation"),
            EcommendedTravel: require("tmpl/pc/newdetails/EcommendedTravel")
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
        getData: function(callback){
            var self = this;
            $.ajax({
                url: self.host+ self.url,
                data: self.param,
                dataType: "jsonp",
                success: function(data){
                    self.dealData(data);
                    callback.call(self,data);
                }
            })
        }
    };
    return freeRoute;
});
