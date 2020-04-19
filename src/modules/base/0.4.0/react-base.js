/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
(function(_module) {
    if (typeof(define) != "undefined" && define.amd) {
        define([], _module);
    } else if (typeof(define) != "undefined" && define.cmd) {
        define("base/0.4.0/react-base", [], function(require, exports, module) {
            return _module();
        });
    } else {
        window.modules = _module;
    }
})
(function() {
    var initializing = false;
    // The base Class implementation (does nothing)
    var Class = function() {};
    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        // The dummy class constructor
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            prototype[name] = prop[name];
        }

        function SubClass(opt) {
            // Object.assign(_prop, prop);
            if (!initializing) {
                //属性继承
                this.attr = $.extend(_super.attr, this.ATTRS, opt);

                $.extend(this, this.METHODS);

                this.ReactMethods = $.extend({}, _super.ReactMethods, this.ReactMethods);

                //初始化
                if (_super.init) {
                    _super.init.call(this, this.attr);
                }
                if (this.init) {
                    this.init.call(this, this.attr);
                }
            }
        }

        SubClass.prototype = prototype;
        SubClass.extend = arguments.callee;
        return SubClass;
    };
    return Class;
});