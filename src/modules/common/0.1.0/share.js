(function () {
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
            'qq':{
                "event": "shareQQ",
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
            if(!list){
                list = ["timeline","appmessage","qq"];
            }
            var defaultParam = this.defaultParam,
                allParam = this.config;
            for(var i = 0,len = list.length -1; i<=len; i++){
                var key = list[i];
                (function(k){
                    WeixinJSBridge.on('menu:share:'+k, function (argv) {
                        var paramItem = allParam[k],
                            _item = $.extend(defaultParam,paramItem.param);
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
        disable: function(list){
            document.addEventListener('WeixinJSBridgeReady', function(){
                if(!list){
                    WeixinJSBridge.call("hideOptionMenu");
                }else{
                    WeixinJSBridge.hideMenuItems({
                        menuList: list // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    });
                }
            }, false);
        }
    };
    
    window.shareModule = Share();
    shareModule.enable();
})();
