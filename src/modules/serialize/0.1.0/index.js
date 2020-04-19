/**
 * Created by sty09798 on 2015/2/11.
 * var rule = {
 * //id 为需要动态更新的元素 this.name为 name等于name的表单元素
 *  "id": function(){
 *      this.name
 *  }
 * }
 * $.serialize(document.getElementsByTagName("fomr")[0],rule)
 */
define("serialize",[],function(require,exports,module){
    return function($){
            function isNum(value) {
                return typeof value === "number" && !isNaN(value);
            }

            $.serialize = function () {
                var args = Array.prototype.slice.call(arguments,0),
                      form = args[0],
                      rule = args[1],
                      fns = args.slice(2);
                if (!rule) {
                    return;
                }
                form = $(form);
                // 序列化对象 - 本质是个表单name值存储器，作用是：动态表单中即使某些元素删除，也能无需额外配置，正常使用
                var oSerialize = fns.length ? {} : form.data("serialize") || {};
                var oCal = {};
                // 序列化对象所有的值重置
                $.each(oSerialize, function (name) {
                    oSerialize[name] = null;
                });
                // 序列化对象的重新赋值以及存储
                form.find("input,select,textarea,button").each(function () {
                    var val, name = this.name, type = this.type;
                    if (name) {
                        val = $(this).val(); //undefined || val
                        // 单选框与复选框组name值一致，特殊处理
                        if (/radio|checkbox/.test(type)) {
                            if (this.checked && !this.disabled) {
                                oSerialize[name] = isNum(val - 0) ? val - 0 : val;
                            }
                        } else {
                            // 下面这些情况val值需要当作null处理
                            // 1. 没有值
                            // 2. disabled禁用
                            if (!val || this.disabled) {
                                oSerialize[name] = null;
                            }else{
                                oSerialize[name] = isNum(val - 0) ? val - 0 : val;
                            }
                        }
                    }
                });
                // 存储
                form.data("serialize", oSerialize);
                // 合并
                oCal = $.extend({}, oSerialize);
                $.each(fns,function(){
                    if($.isFunction(this)){
                        $.extend(rule,this.call(oCal));
                    }
                });

                // 第一次遍历，主要作用是赋值
                $.each(rule, function (id, fun) {
                    oCal[id] = $.isFunction(fun) ? fun.call(oCal) : fun;
                });

                // 第二次遍历，最终计算、DOM元素显示计算值
                // 两次遍历可以实现规则无序，以及双重计算效果（直接计算以及利用之前的计算结果）
                $.each(rule, function (id, fun) {
                    var elem = /^\W|\[|\:/.test(id) ? $(id) : $("#" + id),
                          value = oCal[id] ? oCal[id] : ($.isFunction(fun) ? fun.call(oCal) : fun || null) ;
                    // 再次取值
                    !oCal[id] && (oCal[id] = value);
                    if (isNum(value)) {
                        //保留2位小数
                        value = String(Math.round(value * 100) / 100).replace(/\.00/, "");
                    }
                    if (elem.length) {
                        elem.each(function () {
                            if (/^input|textarea|button|select$/i.test(this.tagName)) {
                                $(this).val(value);
                            } else {
                                $(this).html(value);
                            }
                        });
                    }
                });
                return oSerialize;
            };
    };
});

