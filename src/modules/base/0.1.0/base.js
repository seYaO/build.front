(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define([], function (a, jsondb, c) {
            return _module();
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("base/0.1.0/base", [], function (require, exports, module) {
            return window.Base = _module();
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Base = _module();
    }

})(function(){
    var Base;
    /*
     CusEvent
     */
    var CustEvent = Class.extend({
        initialize: function(target,type,eventArgs){
            $.extend(this,{
                type: type,
                target: target,
                timeStamp: new Date() - 0
            },eventArgs);
        },
        isDefaultPrevented: false,
        preventDefault: function(){
            this.isDefaultPrevented = true;
        }
    });
    /*
     events
     */
    var eventSplitter = /\s+/;
    var events = {};
    /*
     @param event{string}
     @param handler{function}
     @param context{object}
     */
    events.on = function(event,handler,context){
        var _cache = this._cache || (this._cache = {});
        if(!handler){
            return this;
        }
        var type,names;
        names = event.split(eventSplitter);
        while(type = names.shift()){
            (_cache[type] || (_cache[type] = [])).push({
                type: type,
                handler: handler,
                context: context
            });
        }
        return this;
    };
    /*
     @param event{string}
     @param handler{function}
     */
    events.off = function(event,handler){
        var _cache = this._cache || {};
        //移除所有事件
        if(!event){
            delete this._cache;
            return this;
        }
        var type,names,handlers;
        names = event.split(eventSplitter);
        while(type = names.shift()){
            handlers = _cache[type] || [];
            if(handler && $.isFunction(handler)){
                for(var i=0;i<handlers.length;i++){
                    if(handlers[i].handler === handler){
                        handlers.splice(i,1);
                    }
                }
            }else{
                delete _cache[type];
            }
        }
        return this;
    };
    /*
     @param name{string}
     */
    events.trigger = function(name){
        var _cache = this._cache || {};
        var names,type,event,handlers,
              i = 0,
              result;
        names = name.split(eventSplitter);
        while(type = names.shift()){
            event = new CustEvent(this,type);
            handlers = _cache[type] || [];
            for(;i<handlers.length;i++){
                var handlerObj = handlers[i];
                var context = handlerObj.context || this;
                var data = Array.prototype.slice.call(arguments,1);

                data.unshift(event);
                result = handlerObj.handler.apply(context,data);
                if(result === false){
                    event.preventDefault();
                }
                if(event.isDefaultPrevented){
                    break;
                }
            }
        }
        return result;
    };
    /*
     @param event{string}
     @param handler{function}
     @param context{object}
     */
    events.once = function(event,handler,context){
        var self = this;
        var originHandler = handler;
        handler = function(){
            originHandler.call(this);
            self.off(event,handler);
        };
        this.on(event,handler,context);
        return this;
    };

    events.fire = events.trigger;

    /*
     attribute
     */
    var attributes = {};
    var attrSpecialKeys = ["value","getter","setter","mergeOnInit"],
          attrInvalidValue = {};
    /*
     @param name{string|object}
     @param value{*}
     @param option{object}
     option.silent{boolean} 是否触发name:change事件
     option.overwrite{boolean} 是否覆盖默认合并
     option.data 额外的数据
     @return {boolean} 是否设置成功
     eg. `this.set("name","foo")` `this.set({"name": "foo"})` `this.set("name.name1","foo")`
     */
    attributes.set = function(name,value,option){
        var all = this.ATTRS || (this.ATTRS = {});
        var status = true;    // true代表成功,false代表失败
        var self = this;
        var attrs = {};

        if(typeof name === 'string') {
            attrs[name] = value;
        }else {
            attrs = name;
            option = value;
        }

        option = option || {};

        $.each(attrs, function(name, val) {
            var path = name.split('.');
            var attrName = path[0];
            var isSubAttr = path.length > 1;
            var prevVal = all[attrName];

            // 若没有该属性，set返回false
            if(!prevVal) {
                status = false;
                return;
            }

            // 设置子属性，如set('a.b.c')
            if(isSubAttr) {
                // 获得a.b，如果a.b为undefined，或者不是plain object。则set失败
                var subAttr = getProperty(prevVal.value, path.slice(1, -1).join('.'));
                if(subAttr == undefined || !$.isPlainObject(subAttr)) {
                    status = false;
                    return;
                }

                var newValue = $.extend({}, prevVal.value);
                subAttr = getProperty(newValue, path.slice(1, -1).join('.'));
                subAttr[path[path.length - 1]] = val;
                val = newValue;
            }


            // 若有定义setter，调用setter
            if(prevVal.setter) {
                val = prevVal.setter.call(self, val, name, option.data);
                // setter中检测val无效，则返回false
                if(val == attrInvalidValue) {
                    status = false;
                    return;
                }
            }

            if(!option.overwrite) {
                val = ($.extend(true, {}, prevVal, {value: val})).value;
            }

            prevVal = prevVal.value;
            all[attrName].value = val;
            if(!option.silent) {
                self.trigger(attrName + ':change', [self.get(attrName), prevVal, name, option.data]);
                self.trigger('*:change', [self.get(attrName), prevVal, name, option.data]);
            }
        });

        return status;
    };
    /*
     @param name{string}
     */
    attributes.get = function(name){
        var self = this;
        var All = self.ATTRS;
        var attrs = {};
        // name为空，则返回全部属性
        if(!name) {
            $.each(All, function(name, attr) {
                attrs[name] = self.get(name);
            });
            return attrs;
        }else {
            var path = name.split('.');

            if(!All || !All.hasOwnProperty(path[0])) return;

            var attr = All[path[0]];
            var val = attr.value;
            if(attr.getter) {
                val = attr.getter.call(self, val, name);
            }

            // 根据path返回
            val = getProperty(val, path.slice(1).join('.'));
            return val == attrInvalidValue ? undefined : val;
        }
    };
    /*
     @private
     */
    attributes.__initATTRS__ =  function(config){
        var self = this,protoChain,
              tmpAttrs = {},
              i = 0,
              normalizeAttrs;
        protoChain = getProtoChain(self);
        //调整覆盖顺序by 李岩-------------------------
        //for(;i<protoChain.length;i++){
        //    normalizeAttrs = normalizeAttr(protoChain[i].ATTRS || {});
        //    $.each(normalizeAttrs,function(name,attr){
        //        if(attr.mergeOnInit){
        //            tmpAttrs[name] = $.extend(true, {}, tmpAttrs[name], attr);
        //        }else{
        //            tmpAttrs[name] = attr;
        //        }
        //    });
        //}
        for (i = protoChain.length - 1; i >= 0; i--) {
            normalizeAttrs = normalizeAttr(protoChain[i].ATTRS || {});
            $.each(normalizeAttrs, function (name, attr) {
                if (attr.mergeOnInit) {
                    tmpAttrs[name] = $.extend(true, {}, tmpAttrs[name], attr);
                } else {
                    tmpAttrs[name] = attr;
                }
            });
        }
        //----------------------end-------------------
        config = config || {};
        tmpAttrs = $.extend(true,{},tmpAttrs,normalizeAttr(config));
        self.ATTRS = tmpAttrs;

        $.each(config,function(name,attr){
            if(tmpAttrs[name].setter) {
                self.set(name, attr, {silent: true});
            }
        });
    };
    function normalizeAttr(attrs){
        var newAttrs = {};
        $.each(attrs,function(name,attr){
            if(!$.isPlainObject(attr) || !hasProperty(attr,attrSpecialKeys)){
                attr = {value: attr};
            }
            newAttrs[name] = attr;
        });
        return newAttrs;
    }
    function hasProperty(obj,props){
        var result = false;
        $.each(props, function(index, val) {
            if(obj.hasOwnProperty(val)){
                result = true;
                return false;
            }
        });
        return result;
    }
    function getSubproperty(obj, path) {
        var subAttr = obj;
        var i, len;
        for(i = 0, len = path.length; i < len - 1 && $.isPlainObject(subAttr); i++) {
            subAttr = subAttr[path[i]];
        }
        if(len === 0) {
            return obj;
        } else if(i === len - 1 && $.isPlainObject(subAttr) && subAttr.hasOwnProperty(path[len - 1])) {
            return subAttr[path[len - 1]];
        } else {
            return attrInvalidValue;
        }
    }
    function getProperty(obj, prop) {
        var keys = prop ? prop.split(".") : [];
        var ret = obj;

        for(var i = 0, len = keys.length; i < len; i++) {
            if(ret == undefined) {
                return;
            }
            ret = ret[keys[i]];
        }

        return ret;
    }
    /*
     aspects
     */
    var methodSplitter = /\s+/;
    var aspects = {};
    /*
     @param method{string}
     @param callback{function}
     @param context{object}
     @paran once{number}
     */
    aspects.before = function(method,callback,context,once){
        if(context === 1){
            context = void 0;
            once = 1;
        }
        weaver.call(this,"before",method,callback,context,once);
    };
    aspects.after = function(method,callback,context,once){
        if(context === 1){
            context = void 0;
            once = 1;
        }
        weaver.call(this,"after",method,callback,context,once);
    };
    function weaver(when,name,callback,context,once){
        var i = 0,names,method,
              type = once === 1 ? "once" : "on";
        for(names = name.split(methodSplitter);i<names.length;i++){
            method = this[names[i]];
            if(method && $.isFunction(method)){
                if(!method._isAspected){
                    _decorator.call(this,names[i]);
                }
                this[type](names[i] + ":" + when,callback,context)
            }
        }
    }
    function _decorator(name){
        var method = this[name],result;
        this[name] = function(){
            if(this.trigger(name + ":before") === false){
                return;
            }
            result = method.call(this,arguments);
            this.trigger(name + ":after");
            return result;
        };
        this[name]._isAspected = true;
    }

    Base = Class.extend($.extend({
        initialize: function(conf){
            this.__initATTRS__(conf);
            this.__initMETHODS__();
            this.__initEVENTS__();
            this.__debug__();
        },
        destroy: function(){
            destroy(this);
        },
        __initEVENTS__: function(){
            var self = this;
            var protoChain = getProtoChain(self);
            var proto,events = {},docEvents = {};
            while (proto = protoChain.pop()) {
                $.extend(true,events,proto.EVENTS);
                $.extend(true,docEvents,proto.DOCEVENTS);
            }
            triggerEvent(events,1);
            triggerEvent(docEvents,2);
            function triggerEvent(events,type){
                var context;
                switch(type){
                    case 1: context = self.get("el") || document;break;
                    case 2: context = document;break;
                }
                for(var el in events){
                    var action = events[el] || {};
                    for(var event in action){
                        (function(action,event){
                            var $el = el === "" ? $(context) : $(el,context);
                            $el.on(event,function(){
                                return self[action[event]].apply(self,arguments);
                            });
                        })(action,event);
                    }
                }
            }
        },
        __initMETHODS__: function(){
            var protoChain = getProtoChain(this);
            var proto;
            while (proto = protoChain.pop()) {
                $.extend(this,proto.METHODS);
            }
        },
        __debug__: function(){
            var self = this;
            if(this._debug){
                for(var name in this){
                    if(this.hasOwnProperty(name) && name !== "initialize" && typeof  this[name] === "function"){
                        var originalMethod = this[name];
                        this[name] = (function(originalMethod,name){
                            return function(){
                                var time,diff, result, color;
                                time = new Date();
                                result = originalMethod.apply(self,arguments);
                                self._debug[name] = diff = new Date() - time;
                                color = diff >= 100 ? "red" : "green";
                                console.log("%s cost %c %dms",name,"color:"+color,diff);
                                return result;
                            };
                        })(originalMethod,name);
                    }
                }
            }
        }
    },attributes,events,aspects));

    function destroy(obj){
        obj.off();
        for(var i in obj){
            if(obj.hasOwnProperty(i)){
                delete obj[i];
            }
        }
        obj.destroy = $.noop;
    }
    //获取原型链
    function getProtoChain(obj){
        var protoChain = [];
        for(var proto = obj.constructor.prototype;!$.isEmptyObject(proto);proto = proto.constructor.superclass){
            protoChain.push(proto);
        }
        return protoChain;
    }

    //this.Base = Base;
    return Base;
})

/* Class Version 1.0.2 */
// Inspired by base2 and Prototype
;(function(){
    var initializing = false;

    // The base Class implementation (does nothing)
    var Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            prototype[name] = prop[name];
        }

        // The dummy class constructor
        function SubClass() {
            // All construction is actually done in the initialize method
            if ( !initializing && this.initialize ){
                //profile initialize
                if(/(\?|&)debug(&|$)/i.test(location.href)){
                    var time,diff,_debug;
                    var originalInitialize = this.initialize;
                    if(!this._debug){
                        _debug = this._debug = {};
                    }
                    this.initialize = function(){
                        time = new Date();
                        originalInitialize.apply(this,arguments);
                        diff = _debug.initialize =  new Date() - time;
                        console.log("%s cost %c%dms", "#initialize","font-weight: bold",diff);
                    };
                }
                this.initialize.apply(this, arguments);
            }
        }

        SubClass.superclass = _super;

        // Populate our constructed prototype object
        SubClass.prototype = prototype;

        // Enforce the constructor to be what we expect
        SubClass.prototype.constructor = SubClass;

        // And make this class extendable
        SubClass.extend = arguments.callee;

        return SubClass;
    };
    this.Class = Class;
})()
;(function(root,factory){
    if(typeof exports === 'object'){
        define("base/0.1.0/base",factory);
    }else{
        root.Base = factory();
    }
});
