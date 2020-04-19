define('intellsearch/0.2.0/searchBase', ['base/0.1.0/base', "intellsearch/0.2.0/jsonDB"], function (require, exports, module) {
    var jsonDB = require("intellsearch/0.2.0/jsonDB");
    /*
     * intellisense search (搜索模块基类)
     * Created by 李岩岩 on 2016/1/14.
     * attrs:o_pobj,o_wapper,o_input,apiurl,itemNumber,dotTemplate,hasPanel
     * events:nodata,error,render
     * methods:render,getJsonp,hide  
     */

    /*
     * 搜索模块基类
     */
    var SearchBase = Base.extend({
        initialize: function (options) {
            //init super
            SearchBase.superclass.initialize.apply(this, arguments);
            //this.init(config);
            SearchBase.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            this.o_pobj = this.get("o_pobj");
            this.o_wapper = this.get("o_wapper");
            this.o_input = this.get("o_input");
            this.apiurl = this.get("apiurl");
            this.itemNumber = this.get("itemNumber");

            //初始化模块  
            var modules = self.get("modules");
            self.__modules = self.__modules || {};
            $.each(modules, function (key, item) {
                item.init.call(item);
                self.__modules[key] = item.module;
            });

        },
        ATTRS: {
            o_pobj: null,//父对象
            o_input: null,//输入框对象
            o_wapper: null,//容器
            apiurl: null,//接口地址
            dataModel: "12", //数据模式：1：ajax，2：缓存；12：ajax+缓存； 
            itemNumber: 10,//显示的条数
            dotTemplate: null,//dot模板
            hasPanel: true,//是否有显示面板
            modules: {
                jsonDB: {
                    key: 'jsonDB',
                    config: {

                    },
                    module: null,
                    init: function () {
                        var self = this;
                        self.module = new jsonDB(self.config);
                    }
                }
            }

        },
        EVENTS: {
        },
        DOCEVENT: {
        },
        METHODS: {
            render: function (data) {             
                var self = this;
                var tmpText = self.get("dotTemplate");
                if (typeof tmpText == "function") {
                    if (data == null || data.length == 0) {
                        self.trigger("nodata");
                        self.hide();
                        return;
                    }
                    self.o_wapper.html(tmpText(data));
                }
                else {
                    self.o_wapper.html(tmpText);
                }                          
                self.trigger("render");
            },
            open: function () {

            },
            show: function () {
                var self = this;
                self.o_wapper.removeClass("hidden");
                self.o_pobj.show();
            },
            hide: function () {
                this.o_wapper.empty();
                this.o_wapper.addClass("hidden");
                this.o_pobj.hide();
            },
            append: function () {

            },
            getJsonp: function (url, callback, error) {
                var self = this;
                var dataModel = self.get("dataModel");
                var data = null;                
                if (dataModel.indexOf("2") > -1) {
                    data = self.__modules.jsonDB.query(url);    
                }
                if (data!=null) {
                    callback(data);
                    return;
                }              
                $.ajax({
                    type: 'get',
                    url: url,
                    dataType: 'jsonp',
                    success: function (data) {
                        //console.log("request:" + url);
                        //monitorModule.log('url:' + url + ',success:' + JSON.stringify(data), 'success', 'pc_zhuanti_1111');
                        callback(data);
                        if (dataModel.indexOf("1") > -1) {
                            self.__modules.jsonDB.insert(url, data);
                        }
                    },
                    error: function (err) {
                        self.trigger("error", err);
                        //monitorModule.log('url:' + url + ',err:' + JSON.stringify(err), 'error', 'pc_destination');
                        if (error) {
                            error();
                        }
                       
                    }
                });
            }
        }
    });
    return SearchBase;
});

