define('intellsearch/0.2.0/jsonDB', ['base/0.1.0/base'], function (require, exports, module) {
    /*
     * 数据缓存
     * json memory database 
     */
    var JsonDB = Base.extend({
        initialize: function (options) {
            //init super
            JsonDB.superclass.initialize.apply(this, arguments);
            //init             
            JsonDB.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            this._jsonDB = new Array();
        },
        ATTRS: {
            maxSize: 5,
            modal: 1//匹配模式，1:整体模糊匹配 2：单词模糊匹配（未实现）
        },
        METHODS: {
            insert: function (keyword, data) {
                //新增数据
                var _maxsize = this.get("maxSize");
                if (this._jsonDB.length >= _maxsize) {
                    this._jsonDB.shift();
                }
                this._jsonDB.push({ "keyword": keyword, "data": data });

            },
            query: function (keyword) {
                var self = this;
                var hasdata = false;
                if (!keyword) {
                    return;
                }
                for (var i = 0; i < self._jsonDB.length; i++) {
                    var v = self._jsonDB[i];
                    if (v.keyword.indexOf(keyword) > -1) {
                        return v.data;
                    }
                }
                return null;
            }
        }
    });

    return JsonDB;
});
