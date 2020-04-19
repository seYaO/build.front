require('/modules/activity/0.3.4/touch/touch');

;(function () {
    function Share(){
        var self = this;
        if (!(self instanceof Share)) {
            return new Share();
        }
    }
    Share.prototype = {
        el:{
            img: document.getElementsByName("tcshareimg")[0],
            url: document.getElementsByName("tcshareurl")[0],
            title: document.getElementsByName("tcsharetext")[0],
            desc: document.getElementsByName("tcDesc")[0]
        },
        defaultParam: {
            "img_url": "{img}",
            "img_width": "120",
            "img_height": "120",
            "title": "{title}"
        },
        config:{
            'timeline':{
                "event": "shareTimeline",
                param:{
                    "link": "{url}",
                    "desc": "{desc}"
                }
            },
            'appmessage':{
                "event": "sendAppMessage",
                param:{
                    "link": "{url}",
                    "desc": "{desc}"
                }
            },
            'weibo':{
                "event": "shareWeibo",
                param:{
                    "content": "{desc}",
                    "url": "{url}",
                    "desc": "{title}"
                }
            }
        },
        enable: function(list){
            var self = this;
            document.addEventListener('WeixinJSBridgeReady', function(){
                self._enable(list);
            }, false);
        },
        _enable: function(list){
            var self = this;
            WeixinJSBridge.call("showOptionMenu");
            if(!list){
                list = ["timeline","appmessage","weibo"];
            }
            var defaultParam = this.defaultParam,
                allParam = this.config;
            for(var i = 0,len = list.length -1; i<=len; i++){
                var key = list[i];
                (function(k){
                    var paramItem = allParam[k],
                        _item = $.extend(defaultParam,paramItem.param);
                    for(var n in _item){
                        if(typeof _item[n] === "string"){
                            _item[n] = _item[n].replace(/{(\w+)}/g,function($0,$1){
                                return self.el[$1].value;
                            });
                        }
                    }
                    WeixinJSBridge.on('menu:share:'+k, function (argv) {
                        for(var n in _item){
                            if(typeof _item[n] === "string"){
                                _item[n] = _item[n].replace(/{(\w+)}/g,function($0,$1){
                                    return self.el[$1].value||$1;
                                });
                            }
                        }
                        WeixinJSBridge.invoke(paramItem.event,_item,function(res){
                            shareAfterEvent && shareAfterEvent.call(this,res);
                        });
                    });
                })(key);

            }
        },
        disable: function(){
            document.addEventListener('WeixinJSBridgeReady', function(){
                WeixinJSBridge.call("hideOptionMenu");
            }, false);
        }
    };
    var share  = new Share();
    share.disable();
})();
module.exports = {
    init: function(cfg) {
        var defaultCfg = {
            el: ".J_prolist",
            filter: true,
            IsSellOut: 0,
            beforeRender: function(data) {
                return data;
            }
        };
        var thisCfg = $.extend(defaultCfg, cfg);
        Activity.init(thisCfg);
    }
}
