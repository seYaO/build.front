(function() {
    var ABtest = function(conf){
        this.key = conf.key||this.key;
        this.bts = conf.bts || this.bts;
    },_guid,conf = window.T_ABConfig||{};
    ABtest.prototype = {
        key: "AB_CJ",
        //默认设置60天有效期
        expires: 60,
        secure: false,
        bts: function(index){return index <=50},
        cookie: function(key,value,options){
            if (typeof value != 'undefined') { // name and value given, set cookie
                var date = new Date();
                options = options||{};
                date.setTime(date.getTime() + ((options.expires||this.expires) * 24 * 60 * 60 * 1000));
                var expires = '; expires=' + date.toUTCString();
                var path = options.path ? '; path=' + options.path : '';
                var _d = new RegExp("[^\\.]+\\.(com|cn|net|org)$", "i").exec(location.host);
                var _domain = options.domain||_d&&_d[0];
                var domain = _domain ? '; domain=' + _domain : '';
                var secure = (options.secure||this.secure) ? '; secure' : '';
                document.cookie = [key, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else { // only name given, get cookie
                var ret, m;
                if (key) {
                    if ((m = document.cookie.match(
                            new RegExp('(?:^| )' + key + '(?:(?:=([^;]*))|;|$)')))) {
                        ret = m[1] ? decodeURIComponent(m[1]) : '';
                    }
                }
                return ret;
            }
        },
        path: function(){
           return location.href.split("?")[0];
        },
        guid: function(){
            var self = this,key = self.key;
            if(_guid) return _guid;
            var cookieStr = self.cookie(key);
            if(cookieStr){
                _guid = cookieStr.split("#")[0];
                var type = cookieStr.split("#")[1];
                if(!type){
                    type = self.cookie(key+"_type");
                    if(type){
                        self.cookie(key,_guid+"#"+type,{
                            path: "/"
                        });
                    }
                }
                self._type = type;
                if(_guid) return _guid;
            }
            _guid = Math.round(Math.random() * 2147483647);
            self.cookie(key,_guid,{
                path: "/"
            });
            return _guid;
        },
        /**
         *  @desc 将用户分为100份
         */
        getBucket: function(){
            var self = this,
                guid = self.guid();
            return self.getTestBucket()||guid % 100 +1;
        },
        /**
         * 如果url里包含了alg_bts,则优先显示用户输入的桶号
         * @returns {*}
         */
        getTestBucket: function(){
            var locSearch = location.search,
                btsArr = locSearch.match(/bts=(\d+)/);
            if(btsArr && btsArr[1]){
                return btsArr[1] - 0;
            }
        },
        init: function(){
            var self = this;
            self.guid();
            var index = self._type || ( 1 + (self.bts).call(self,self.getBucket())),
                jumpConf;
            if(!conf.version){
                if(index){
                    var htmlEl = document.getElementsByTagName("html")[0] ,
                        pageid = htmlEl.getAttribute("trace");
                    htmlEl.setAttribute("trace",pageid+index);
                }
                return;
            }
            if(index){
                jumpConf = {
                    index: [3-index],
                    url: conf.version[2-index].url
                };
                window.console && console.log("当前桶号:"+self.getBucket());
                var toUrl = conf.version[index-1].url;
                //如果目标地址和当前域名是一致的
                if( toUrl.indexOf(location.host)>-1
                    //并且目标地址跟当前地址不同,则跳转
                    && (!new RegExp(toUrl+"$","i").test(self.path()))
                ){
                    location.replace(toUrl+location.search);
                    return;
                }
                self.toggle(jumpConf);
            }
        },
        toggle: function(jumpConf){
            var self = this,
                btnEl = conf.el;
            if(!btnEl) return;
            window.onload = function(){
                $(document).on("click",btnEl,function(e){
                    self.cookie(self.key,self.guid()+"#"+jumpConf["index"],{
                        "path": "/"
                    });
                    e.preventDefault();
                    location.href = jumpConf.url+location.search;
                });
            };
        }
    };
    var abTest = new ABtest(conf);
    abTest.init();
})();
