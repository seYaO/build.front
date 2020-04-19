define('intellsearch/0.1.0/hotcity', ['intellsearch/0.1.0/searchBase', 'intellSearch/0.1.0/tmpl/hotcity'], function (require, exports, module) {
    var SearchBase = require("intellsearch/0.1.0/searchBase");
        hotcityTmpl = require('intellSearch/0.1.0/tmpl/hotcity');

    /*
      * 热门城市    
      */
    var hotcity = SearchBase.extend({
        initialize: function (options) {
            //init super
            hotcity.superclass.initialize.apply(this, arguments);
            //init             
            hotcity.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            var pobj = options.o_pobj;
            var o_wapper = options.o_wapper;
            var o_input = options.o_input;

            pobj.on("nodata", function () {
                self.reqData();
            });
            pobj.on("hasdata", function () {
                self.hide();
            });

            //事件
            o_wapper.on("click", "[hotcity-item]", function (e) {              
                self.trigger("itemClick",this);
                //self.get("itemClick").call(this, e);
                //var self = this;
                //self.o_pobj.hide();
                //var v = $(this).attr("data-value");
                //self.o_pobj.setKeyWord(v);
                //self.o_pobj.trigger("search");
            });

        },
        ATTRS: {           
            dotTemplate: hotcityTmpl,//dot模板
            itemNumber: 5,//显示的条数
            reqData: function (res) {
                var self = this;
                var url = this.apiurl;                
                if (self._data) {
                    res(self._data);
                    return;
                }
                //去重
                var fn_vali = function (city, list) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].city == city) {
                            return false;
                        }
                    }
                    return true;
                };
                this.getJsonp(url,function (data) {
                    if (data!=null) {
                        var gd = data['group']['dest']['hot'];
                        var fd = data['free']['dest']['hot'];
                        var _data = new Array();                       
                        var maxnum = self.itemNumber;

                        for (var i = 0; i < ((gd.length > maxnum / 2) ? maxnum / 2 : gd.length) ; i++) {
                            var _ary = gd[i].split("|");
                            var _city = _ary[0];
                            var _visa = _ary[1];
                            _data.push({ city: _city, visa: _visa });
                        }
                      
                        for (var i = 0; (i < fd.length) && (_data.length < maxnum) ; i++) {
                            var _ary = fd[i].split("|");
                            var _city = _ary[0];
                            var _visa = _ary[1];
                            if (fn_vali(_city, _data)) {
                                _data.push({ city: _city, visa: _visa });                             
                            }
                        }
                        self._data = _data;
                        res(_data);
                    }
                  
                });
            },
            itemClick: function (e) {
                //var self = this;           
                //self.o_pobj.hide();
                //var v = $(this).attr("data-value");
                //self.o_pobj.setKeyWord(v);
                //self.o_pobj.trigger("search");
            }
        },
        METHODS: {
            reqData:function () {
                var self = this;
                var reqData = this.get("reqData");
                if (typeof reqData === "function") {
                    reqData.call(self, function (data) {
                        self.render(data);                     
                    });
                }
                self.show();
            }
        }
    });
    return hotcity;
});
