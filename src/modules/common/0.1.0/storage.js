/**
 * #本地存储
 * new Localstorage({param: param}) -->.observeStorage(key1, ['q','cat']) 注册监听的参数，key是要保存value的key值 --> .toggleItem(key, value)
 * 保存的数据是这样的
 * 'localstorage-key': {key1: {param: {q: xx, cat: xx}, observe: true|false}, key2: {...},...}
 * 每个注册了参数监控都存在param中，并且存入他们当前的值，observe表示值是否要改变，true为改变，false为不改。
 * 而数据保存的格式为
 * key1: {数据}
 *
 * 因为定义为核心模块，所以直接原型继承到KISSY中。
 * @class components.utils.Localstorage
 * @extends KISSY.Base
 * @requiers KISSY.JSON
 * @requiers KISSY.UA
 */
define("common/0.1.0/storage",["common/0.1.0/ua","common/0.1.0/json"],function(require){
    var UA = require("common/0.1.0/ua");
    require("common/0.1.0/json")

    var ie = !!(UA.ie() < 8),
        IELocalDataStore = 'IELocalDataStore',
        KEYNAME = 'localstorage-key',
        param_data = {};

    function Localstorage(config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Localstorage)) {
            return new Localstorage(config);
        }
        self.events = {};
        $.extend(self,config);
        self.initialize();
    }

    //业务逻辑，私有方法
    Localstorage.prototype = {
        param: {},
        on: function(eventType, fn){
            var self = this,
                events = self.events,
                callbacks = events[eventType];
            if (!callbacks) {
                callbacks = events[eventType] = [];
            }
            callbacks.push(fn);
            return this;
        },
        fire: function(eventType, eventObj) {
            var self = this,
                events = self.events,
                callbacks = events[eventType];
            if (callbacks) {
                $.each(callbacks, function(m) {
                    m(eventObj);
                });
            }
        },
        initialize:function () {
            var self = this;
            if (ie) {
                self._initByUserData();
            } else if (typeof localStorage !== 'undefined') {
                self._initByLocalStorage();
            }

            self._observeParam();
        },
        _observeParam: function(){
            var self = this;
            //会把所有注册的key值存到本地存储中，其中key名为KEYNAME
            var param = self._getItem(KEYNAME);
            var params = self.param;
            if(param){
                param = JSON.parse(param);
                if($.isObject(param)){
                    param_data = param;
                    self._synParam(params);
                }
            }

            //监听param参数改变时，更新监控的数据
            self.on('afterParamChange', function(e){
                if(param_data){
                    var params = e.newVal;
                    self._synParam(params);
                }
            });
        },
        _synParam: function(params){
            if(!params) return;
            var item, change = false;
            for(var k in param_data){
                item = param_data[k].param;
                for(var i in item){
                    if(params[i] === undefined) params[i] = '';
                    if(item[i] != params[i]){
                        change = true;
                    }
                }
                param_data[k] = {param: item, observe: change};
            }

        },
        _initByLocalStorage:function () {
            // for IE8+, FF 3+, Chrome 4.1+, Safari 4+, Opera 10.5+
            var self = this;
            self.oStorage = localStorage;
        },
        _initByUserData:function () {
            var self = this,
                doc = document;

            var oStorage = doc.createElement('input');
            oStorage.type = 'hidden';
            doc.body.appendChild(oStorage);
            oStorage.addBehavior('#default#userData');
            self.oStorage = oStorage;
        },
        /*
         * 添加try...catch的原因是：某些用户的IE，可能将安全级别设置得过高，或当前站点被添加至"受限站点"中(会
         * 禁用掉"安全"tab下的"持续使用用户数据"选项，从而导致userData无法使用，这里通过try...catch来避免此
         * 情况下的JS报错，下同。
         */
        _setItem:function (key, value) {
            var self = this;
            if (ie) {
                try {
                    self.oStorage.setAttribute(key, value);
                    self.oStorage.save(IELocalDataStore);
                } catch (e) {
                }
            } else {
                self.oStorage.setItem(key, value);
            }
        },
        _getItem:function (key) {
            var self = this;
            if (ie) {
                try {
                    self.oStorage.load(IELocalDataStore);
                    return self.oStorage.getAttribute(key);
                } catch (e) {
                }
            } else {
                return self.oStorage.getItem(key);
            }
        },
        _removeItem:function (key) {
            var self = this;
            if (ie) {
                try {
                    self.oStorage.removeAttribute(key);
                    self.oStorage.save(IELocalDataStore);
                } catch (e) {
                }
            } else {
                self.oStorage.removeItem(key);
            }
        }
    };
    var storage = new Localstorage();
    $.extend(storage, {
        setItem:function (key, value) {
            var _val  = value;
            if(typeof value === "object"){
                _val = JSON.stringify(value);
            }
            return this._setItem(key, _val);
        },
        getItem:function (key) {
            return this._getItem(key);
        },

        removeItem:function (key) {
            return this._removeItem(key);
        },
        observeStorage: function(key, param){
            var params = this.param,
                key_param = param_data[key],
                change = false,
                val,  newParam = {};
            if(key_param) key_param = key_param.param;
            for(var i = param.length; i--;){
                var k = param[i];
                val = params[k];
                if(val){
                    newParam[k] = val;
                }else{
                    newParam[k] = '';
                }
                if(key_param){
                    if(key_param[k] !== val){
                        change = true;
                    }
                }else{
                    change = true;
                }
            }
            if(param_data[key]) $.extend(param_data[key], {param: newParam, observe: change});
            else param_data[key] = {param: newParam, observe: change};
        },
        toggleItem: function(key, value){
            var self = this;
            if(key){
                //带有value，则要保存数据，然后返回value
                if(value){
                    var param = param_data[key];
                    //判断是否更新存储
                    if(param){
                        if(param.observe){
                            self._setItem(key, JSON.stringify(value));
                            param.observe = false;
                            self._setItem(KEYNAME, JSON.stringify(param_data));
                        }else{
                            return self._getItem(key);
                        }
                    }else{
                        return value;
                    }
                }else{//否则是读取数据
                    var param = param_data[key];
                    //判断是否更新存储
                    if(!param || (param && !param.observe)){
                        return JSON.parse(self._getItem(key));
                    }else{
                        return false;
                    }
                }
            }else{
                console.log('localstorage: 调用参数错误');
                return false;
            }
        },
        storageChange: function(key){
            if(param_data[key]){
                return param_data[key]['observe'];
            }else{
                return false;
            }
        }
    });
    return storage;
});
