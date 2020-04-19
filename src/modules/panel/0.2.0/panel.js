(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['base/0.1.0/base', "jsondb/0.1.0/jsondb", "jsextend/0.1.0/jsextend"], function (a, jsondb, c) {
            return _module(jsondb);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("panel/0.2.0/panel", ['base/0.1.0/base', "jsondb/0.1.0/jsondb", "jsextend/0.1.0/jsextend"], function (require, exports, module) {
            var jsondb = require("jsondb/0.1.0/jsondb");
            require('base/0.1.0/base')
            require("jsextend/0.1.0/jsextend")
            return _module(jsondb);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function (jsonDB) {
    /*
    * intellisense search (模板类组件基类)
    * Created by 李岩岩 on 2016/1/29.
    * attrs:o_pobj,o_wrapper,o_input,apiurl,itemNumber,dotTemplate,hasPanel
    * events:nodata,error,render
    * methods:render,getJsonp,hide  
    */

    /*
     * 搜索模块基类
     */
    var Panel = Base.extend({
        initialize: function (options) {
            //init super
            Panel.superclass.initialize.apply(this, arguments);
            //this.init(config);
            Panel.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            var attr = self.attr = {};
            $.each(self.ATTRS, function (k, v) {
                attr[k] = v.value;
            });

            this.o_pobj = this.get("o_pobj");
            this.o_wrapper = this.get("o_wrapper");
            this.o_input = this.get("o_input");
            if (!this.o_wrapper && attr.wrapper) {
                this.o_wrapper = $(attr.wrapper);
            }

            this.option = this.option || {};
            //renderType渲染方式
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
            o_wrapper: null,//当前对象容器
            wrapper: null,
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
            /*
             * 渲染内容区填充内容或者渲染dot模板
             */
            render: function (data, res) {

                var self = this;
                var tmpText = self.get("dotTemplate");
                if (typeof tmpText == "function") {
                    if (data == null || data.length == 0) {
                        self.trigger("nodata");
                        self.hide();
                        return;
                    }
                    self.o_wrapper.html(tmpText(data));
                }
                else {
                    self.o_wrapper.html(tmpText);
                }
                self.trigger("render");
                if (res) {
                    res();
                }
            },
            /*
             * 渲染+显示
             */
            open: function (option) {
                var self = this;
                var _option = $.extend(self.attr, option);
                this.render(_option, function () {
                    self.show(_option);
                });
            },
            /*
             * 只显示
             */
            show: function (option) {
                var self = this;
                self.o_wrapper.show();
                self.__initLocation(option);
                self.o_wrapper.css("visibility", "visible");               
                self.trigger("show");
                //self.o_pobj.show();
            },
            /*
             * 只隐藏
             */
            hide: function () {
                var self = this;
                self.o_wrapper.hide();
                self.o_wrapper.css("visibility", "hidden");
                self.trigger("hide");
            },
            /*
             * 隐藏并销毁
             */
            close: function () {
                this.o_wrapper.empty();
            },
            getJsonp: function (url, callback, error) {
                var self = this;
                var dataModel = self.get("dataModel");
                var data = null;
                if (dataModel.indexOf("2") > -1) {
                    data = self.__modules.jsonDB.query(url);
                }
                if (data != null) {
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
        },
        //初始化显示位置
        __initLocation: function (option) {

        }
    });
    return Panel;
});
