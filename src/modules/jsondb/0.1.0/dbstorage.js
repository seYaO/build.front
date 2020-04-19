(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['base/0.1.0/base', 'common/0.1.0/storage','jsextend/0.1.0/jsextend'], function (a, storage) {
            return _module(storage);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("jsondb/0.1.0/dbstorage", ['base/0.1.0/base', 'common/0.1.0/storage','jsextend/0.1.0/jsextend'], function (require, exports, module) {
            var storage = require("common/0.1.0/storage");
            require('jsextend/0.1.0/jsextend')
            require('base/0.1.0/base')
            return _module(storage);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.JsonDB = _module();
    }
})(function (storage) {
    /*
    * 数据缓存
    * json memory database 
    */
    var DBStorage = Base.extend({
        initialize: function (options) {
            //init super
            DBStorage.superclass.initialize.apply(this, arguments);
            //init             
            DBStorage.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this,
               name = self.get('dbName');
               //user = self.get('user');

            self.storageKey = 'dbstorage_' + name;
            self._getStorage();
        },
        ATTRS: {
            maxSize: 5,
            datedtime: 60 * 60 * 24,//过期时间,默认一天
            dbName: '',//数据库名称          
            storageType: 'flashStorage'
        },
        METHODS: {
            checkFlash: function (callback) {
                this.storage.read(callback);
            },
            /**
      * 保存某关键字key的一条结果value
      * @param key
      * @param value
      * @return {*}
      */
            save: function (key, value) {
                //if (value == null || value == "") {
                //    return;
                //}
                var _read = this.storage.read(),
                    dataLen;
                if (_read) {
                    dataLen = _read.length;
                }

                var result = this._save(key, value);
                var _len = this.storage.save();
                var maxSize = this.get('maxSize') * 1;
                if (dataLen > maxSize) {
                    this.datalist = this.datalist.slice(0, 5);
                    this.trigger("add_before", _len, dataLen);
                    _len = this.storage.save();
                    this.trigger("add_after", _len, dataLen);
                }
                /*hasHistory=true;*/
                return result;
            },
            getItem:function (key) {
                var _read = this.storage.read();
                if (_read && _read.length > 0) {
                    for (var i = 0; i < _read.length; i++) {
                        if (_read[i].key == key) {
                            return _read[i].value;
                        }
                    }
                }              
                return null;
            },
            /**
             * 根据查询字符串查找对应的条目
             * @param q
             * @return {*}
             */
            query: function (q) {
                return this._query(q);
            },
            /**
             * 删除条目
             * @param value
             *
             */
            deleteItem: function (value) {
                var list = this._getDatalist();
                var dataLen = list.length;
                this._deleteItemByValue(list, encodeURI(value));
                var _len = this.storage.save();
                if (dataLen > 300) {
                    this.datalist = this.datalist.slice(0, dataLen - 10);
                    _len = this.storage.save();
                    this.trigger("delete", _len, dataLen);
                    //S.log("delete", _len, dataLen);
                }              
            },
            /**
             * 清理几天前的数据
             * @param {Number} day
             */
            clearByDay: function (day) {
                var time = this._now() - day * 24 * 3600 * 1000;
                this._cleanBefore(time);
                this.storage.save();
            },
            /**
             * 是否还有历史记录
             */
            hasHistory: function () {
                if (this._getDatalist().length > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            /*
             * 析构函数
             */
            destructor: function () {
                this.datalist = null;
                prefix = null;
            },
            /*
             * q:count default 10
             * q:sort 目前提供time排序 default time desc
             */
            read: function (q) {
                return this._read(q);
            },          
            clearData: function () {
                this._clearAll();            
            }
        },    
        _setKey: function (config) {
            var self = this,
                name = config.name || self.get("dbName"),
                tab = config.tab || self.get("tab"),
                user = config.user || self.get("user");
            if (tab === "item") tab = "baobei";
            self.storageKey = 'dbstorage_' + name;
            self.set("tab", tab);
            self.set("name", name);
            self.set("user", user);
            this.datalist = null;
        },
        _save: function (key, value) {
            if (key.match(/<>'"/))
                return;
            var list = this._getDatalist(),
                encodeKey = encodeURI(key),
                newItem = {
                    key: encodeKey,
                    value: value,
                    time: this._now()
                };
            this._deleteItemByValue(list, encodeKey);//有重复的key便去重
            list.unshift(newItem);
        },
        _deleteItemByValue: function (list, value) {
            var targetItem = null,
                oldKey;

            for (var i = 0; i < list.length; i++) {
                oldKey = list[i]['key'];

                if (oldKey == value) {
                    targetItem = list.splice(i, 1);
                    i--;
                }
            }
        },
        /**
         * 根据查询字符串匹配出相应的记录,如果不传则放回所有
         * @param {String} q 查询字符串
         * @return {Array} 排序方式是，越新的记录越搞前
         * @private
         */
        _query: function (q) {
            var list = this._getDatalist(),
                resultList = [],
                key, val;

            if (!q) {
                return this._distinctByValue(list);
            }
            q = encodeURI(q);
            $.each(list, function (dataItem, index) {
                key = dataItem['key'],
                    val = dataItem['value'];

                if (key.indexOf(q) === 0 || val.indexOf(q) === 0) {
                    resultList.push(dataItem);
                }
            });
            return this._distinctByValue(resultList);
        },
        /*
        * q:count default 10
        * q:sort 目前提供time排序 default time desc
        */
        _read: function (q) {
            var query = {
                count: 10,
                sort: "time desc"
            };
            $.extend(query, q);
            var list = this._getDatalist();
            var resultList = [], item;
            var maxcount = (query.count < list.length) ? query.count : list.length;
            for (var i = 0; i < maxcount; i++) {
                item = list[i];                
                var _k = decodeURI(item["key"]);
                var _v = item["value"];
                if (typeof _v == 'string') {
                    _v = decodeURI(_v);
                }
                resultList.push({ "key": _k, "value": _v });
            }
            //return this._distinctByValue(resultList);
            return resultList;
        },
        /**
         * 根据value做去重
         * @param list
         * @private
         */
        //去重
        _distinctByValue: function (list) {
            var resultList = [], item;
            for (var i = 0, listLength = list.length; i < listLength; i++) {
                item = list[i];
                if (item['value'].match(/%3C|%3E|[<>'"]/g)) continue;
                !this._hasItemOfValue(resultList, item['value']) && resultList.push(item);
            }
            return resultList;
        },
        _hasItemOfValue: function (list, value) {
            var result = false;
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i]['value'] === value) {
                    result = true;
                }
            }
            return result;
        },
        /**
         * 清理某个时间点之前的数据,由于业务特性，需要删除的往往应该比不需要删除的少，这里从尾部开始比较
         * @param {Number} time 基于毫秒速的字符串 例子：1362034594259
         *
         */
        _cleanBefore: function (time) {
            var list = this._getDatalist(),
                item, delFlag = 0;

            for (var i = list.length - 1; i >= 0; i--) {
                item = list[i];
                if (item["time"] > time) {
                    delFlag = i + 1;
                    break;
                }
            }

            list.length = delFlag;
        },
        _getDatalist: function () {
            //if(!datalist){
            this.datalist = this.storage.read() || [];
            //}
            return this.datalist;
        },

        _getStorage: function () {
            var storageType = this.get('storageType');
            switch (storageType) {
                case 'flashStorage': this.storage = this._initFlashStorage(); break;
                default: this.storage = false;
            }
        },
        _initFlashStorage: function () {
            var self = this;
            return {
                save: function () {
                    //return new Storage().save(self.storageKey, JSON.stringify(datalist));
                    return storage.setItem(self.storageKey, JSON.stringify(self.datalist));
                },
                read: function (callback) {
                    //var data = new Storage().read(self.storageKey, callback);
                    var data = storage.getItem(self.storageKey);
                    if (data) {
                        var json = JSON.parse(data);                        
                        return self._clearDatedTime(json);
                    } else {
                        return undefined;
                    }
                }
            }
        },
        //清理过期数据
        _clearDatedTime: function (jsondata) {         
            var datedtime = this.get("datedtime") * 1000;
            var nowtime = this._now();
            var maxtime = nowtime - datedtime;//
            for (var i = jsondata.length - 1; i >= 0 ; i--) {
                var time = jsondata[i].time;
                if (time < maxtime) {
                    jsondata.removeAt(i);
                }
            }
            return jsondata;
        },
        _now: function () {
            return Date.parse(new Date());
        },
        _clearAll: function () {
            this.datalist = null;
            this.storage.save();
        }
    });

    return DBStorage;
});