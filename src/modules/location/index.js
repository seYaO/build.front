(function(){
    require('/modules/config.js');
    function Location(){
        var self = this;
        // factory or constructor
        if (!(self instanceof Location)) {
            return new Location();
        }
    }
    Location.prototype = {
        url: Config.getInterface("gps", "wx")+"longitude={longitude}&latitude={latitude}",
        timeout: 5000,
        expire: 3600*1000,
        defaultCity: "上海",
        tmpl: require("./views/tip.dot"),
        callback: {
            success: function(cityName,isShowTip){

            },
            failure: function(cityName){

            }
        },
        getByAjax: function(){
            var self = this,
                url = "//m.ly.com/ajax/GetCityByIp.ashx";
            self.getData(url,function(data){
                var city = data.CityName.replace("市", "");
                if(city){
                    self.callback.success.call(self,city);
                }else{
                    self.callback.failure.call(self,self.defaultCity);
                }
            });
        },
        timer: function(){
            var self = this,callback = self.callback;
            self.__start__ = +new Date();
            return window.setTimeout(function(){
                self.isTimeout = true;
                callback.failure&&callback.failure.call(self,self.defaultCity);
            },self.timeout);
        },
        getByBaidu: function(){
            var self = this,callback = self.callback;
            self.__start__ = +new Date();
            var timeoutT = self.timer();
            navigator.geolocation.getCurrentPosition(function(position){
                if(+new Date() - self.__start__ < self.timeout){
                    window.clearTimeout(timeoutT);
                }
                var url = self.url.replace(/{(\w+)}/g,function($0,$1){
                    return position.coords[$1];
                });
                self.getData(url,function(data,status){
                    if(status === "success"){
                        self.afterData&&self.afterData.apply(self,arguments);
                    }else{
                        if(self.isTimeout){
                            return;
                        }
                        callback.failure&&callback.failure.call(self,self.defaultCity);
                    }
                },true);
            },function(error){
                if(self.isTimeout){
                    return;
                }
                window.clearTimeout(timeoutT);
                callback.failure&&callback.failure.call(self,self.defaultCity,error.message);
            });
        },
        getLocalLoc: function(){
            return window.localStorage && localStorage.localAddress;
        },
        setLocalLoc: function(cityName){
            localStorage.localAddress = cityName;
        },
        get: function(cfg){
            var self = this,callback = self.callback;
            $.extend(self,cfg);
            if(!navigator.geolocation) {
                callback.failure && callback.failure.call(self,self.defaultCity,"不支持定位");
                return;
            }
            var localCity = self.getLocalLoc();
            if(localCity){
                callback.success && callback.success.call(self,localCity,false);
                return;
            }
            self.getByBaidu.call(self);
        },
        renderTip: function(cityName){
            var self = this,
                data = {
                now: cityName,
                last: "上海"
            };
            var html = this.tmpl(data);
            $("body").append(html);
            var tipBox = $("#J_AddressTip");
            tipBox.on("click",".J_CancelBtn",function(){
                tipBox.hide();
                self.setLocalLoc($(this).attr("data-address"));
            });
            tipBox.on("click",".J_ConfirmBtn",function(){
                tipBox.hide();
                self.setLocalLoc($(this).attr("data-address"));
                location.reload();
            });
        },
        afterData: function(data){
            //获取百度地图api返回的数据
            var self = this,
                city = data.result.addressComponent.city,
                callback = self.callback;
            //注意这里city是包含市这个后缀的,需要手动替换掉
            var _city = city.replace("市","");
            if(_city){
                self.renderTip(_city);
                //callback && callback.success.call(self,_city,true);
            }else{
                if(!self.isTimeout){
                    callback && callback.failure.call(self,self.defaultCity,"无法获取到城市");
                }
            }
        },
        getData: function(url,callback){
            $.ajax({
                url: url,
                dataType: "jsonp",
                success: callback
            })
        }
    };
    module.exports = Location();
}());
