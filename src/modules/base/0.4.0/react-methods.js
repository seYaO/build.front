/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
(function(_module) {
    if (typeof(define) != "undefined" && define.amd) {
        define(['jsextend/0.4.0/jsextend'], _module);
    } else if (typeof(define) != "undefined" && define.cmd) {
        define("base/0.4.0/react-methods", ['jsextend/0.4.0/jsextend'], function(require, exports, module) {
            return _module();
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Panel = _module();
    }

})(function() {

    var ReactModule = {
        // getDefaultProps: function() {
        //     return { __isform: true };
        // },
        // getInitialState: function() {
        //     return { data: this.props.data };
        // },
        componentWillMount: function() {
            //创建新的objtree
            var treenode = new ObjTree(this);
            this.objtree = treenode;
            if (this.props.objtree) //判断是否继承有公共树对象
            {
                //新增树节点并把自己附在父上面
                this.props.objtree.addChild(treenode);
            }

            var _data = null;
            //防止被引用指针串值
            if (this.objtree.data && typeof this.objtree.data == "object") {
                _data = $.extend({}, this.objtree.data);
            } else {
                _data = this.objtree.data;
            }
            this.setState({ data: _data });
        },
        componentWillUpdate: function() {

        },
        componentDidMount: function() {

        },
        componentWillUnmount: function() {
            if (this.objtree) {
                this.objtree.destroy()
            }
        },
        //渲染子节点
        renderChild: function() {
            var self = this;
            var dom = new Array(); {
                React.Children.forEach(this.props.children, function(v, i) {
                    if (typeof v == "object" && typeof v.type == "function") {
                        var nv = React.cloneElement(v, {
                            //把父组件的objtree赋值给每个子组件
                            objtree: self.objtree,
                            key: v.key ? v.key : self.objtree.autoKey(i)
                        });
                        dom.push(nv);
                    } else {
                        dom.push(v);
                    }
                });
            };
            //初始化childs
            if (this.props.childs) {
                this.props.childs.forEach(function(v, i) {
                    var _opt = v.opt;
                    var m = v.module.React ? v.module.React : v.module;
                    _opt.objtree = self.objtree;
                    _opt.key = _opt.key ? _opt.key : self.objtree.autoKey(i);
                    var _react = React.createElement(m, _opt);
                    dom.push(_react);
                });
            };
            return dom;
        },
        trigger: function() {
            this.objtree.trigger.apply(this.objtree, arguments);
        },
        on: function() {
            this.objtree.on.apply(this.objtree, arguments);
        },
        watch: function() {
            this.objtree.watch.apply(this.objtree, arguments);
        },
        getSel: function(sel) {
            return this.objtree.sels[sel].react;
        },
        triggerData: function(data, field, tagdata) {
            field = field || this.objtree.fieldpath;
            this.objtree.__dataTrigger(field, data, this, tagdata);
        },
        autoKey: function(i) {
            return this.objtree.autoKey(i);
        }
    };

    /*
     定义一个构造函数,可将field path 转化为数组形式,方便查找(精确)比对,之前用字符串匹配有诸多问题
     要记录该节点在全局中的位置a.b a.b.c a.c c的变化分a.b.c和a.c
     */
    var FieldPath = {
        getFullPath: function(parentfield, field) {
            var fields = new Array();
            if (parentfield) {
                fields = parentfield.split(".");
            }
            if (field) {
                fields.push(field);
            }
            return fields.join(".");
        },
        //1:完全相等 0:不等 2:t包含f ,3:f包含t
        vali: function(f, t) {
            f = f || "";
            t = t || "";
            var fa = f.split(".");
            var ta = t.split(".");
            return this.compare(fa, ta);
        },
        //isrollover:是否翻转 return 1:完全相等 0:不等 2:t包含f ,3:f包含t
        compare: function(f, t, isrollover) {
            if (f.length > t.length) {
                return this.compare(t, f, true);
            }
            for (var i = 0; i < f.length; i++) {
                if (f[i] != t[i]) {
                    return 0
                }
            }
            if (f.length == t.length) {
                return 1;
            } else {
                return isrollover ? 3 : 2;
            }
        }
    };

    //对象树
    var ObjTree = function(root) {
        var self = this;
        this.react = root;
        this.data = null;
        this.field = root.props.field ? root.props.field : "";
        this.sel = root.props.sel;
        this.domel = null; //最外层dom或者用来呈现的dom

        this.dataroot = false; //是否数据主节点,true时,子节点变化将不会传递到父节点
        if (this.sel) {
            this.sels[this.sel] = this;
        }
        this.opt = $.extend({}, root.props);
        this.__watchlist = new Array();
        this.__eventlist = new Array();

        //优先取节点配置数据
        if (root.props.data !== undefined) {
            var _data = this.getJsonValue(this.react.props.field, this.react.props.data);
            this.data = _data;
            this.dataroot = true;
        } else if (this.react.props.objtree) {
            //否则取继承数据
            this.data = this.getJsonValue(this.react.props.field, this.react.props.objtree.data);
        }

        if (this.react.props.objtree) {
            this.parent = this.react.props.objtree;
        } else {
            this.dataroot = true;
        }

        this.disabled = false;
        //取值顺序props.disable==>parent.disable
        if (this.react.props.disabled !== undefined) {
            this.disabled = this.react.props.disabled;
        } else if (this.parent) {
            this.disabled = this.parent.disabled;
        }
        // if (this.react.props.objtree) {
        //     console.log(this.react);
        // }
        //初始化自己全路径
        var pfield = this.parent ? this.parent.fieldpath : null;
        this.fields = this.dataroot ? new Array() : this.parent.fields;
        // this.fieldpath = pfield ? (pfield + (this.field ? ("." + this.field) : "")) : this.field;
        this.fieldpath = FieldPath.getFullPath(pfield, this.field);

        this.addField(this.fieldpath, this);

        this.childs = new Array();
        this.addChild = function(child) {
            // child.parent = self; //parent
            self.childs.push(child);
        };

        this.changeData = function() {};

        this.dataTrigger = function(field, value) {
            // console.log(field, value);
        }
        this.dataChange = function(field, value, items) {
            self.setData(field, value);
            //以下逻辑待定
            if (self.react.dataChange) {
                self.react.dataChange(field, value, items);
            } else {
                // self.react.setState({ data: self.data });
            }

        }
    };

    //
    ObjTree.prototype.autokey = 1;
    ObjTree.prototype.sels = {};

    //添加到所有字段到原生链中
    ObjTree.prototype.addField = function(field, objtree) {
        this.fields.push({ field: field, objtree: objtree });
    };

    //获取值
    ObjTree.prototype.getJsonValue = function(ex, data) {
        if (!ex) {
            return data;
        }
        if (data === undefined || data === null || typeof data != "object") {
            return null;
        }
        var list = ex.split(".");
        var json = data[list[0]];
        if (json === undefined || json === null) {
            return null;
        }
        list.forEach(function(v, i) {
            if (i > 0) {
                json = json[v];
            }
        });
        return json;
    };

    //设置this.data新值
    ObjTree.prototype.setData = function(field, value) {
        // console.log(field);
        if (field == "") { //整体赋值
            this.data = value;
            return;
        }
        var list = field.split(".");
        // var self=this;
        if (this.data === undefined || this.data === null || typeof this.data != "object") {
            this.data = {};
        }
        var json = this.data;
        list.forEach(function(v, i) {
            if (i == (list.length - 1)) {
                json[v] = value;
            } else {
                if (json[v] === undefined || json[v] === null || typeof json[v] != "object") {
                    json[v] = {};
                }
                json = json[v];
            }
        });
        // this.data = json;
    };

    //向上冒泡数据更改事件
    ObjTree.prototype.__dataTrigger = function(field, value, target, tag, oldvalue) {
        //console.log("row:" + field);
        var self = this;
        if (!this.dataroot) {
            // var _field = self.parent.field ? (self.parent.field + (field ? ("." + field) : "")) : field;
            this.parent.__dataTrigger(field, value, target, tag);
        } else {
            //改动前的值
            var oldvalue = this.getJsonValue(field, this.data);
            //没有__dataTrigger表示该组件为最外层组件
            //更改一个节点,所有子节点全都会发生变化
            // console.log(field);
            this.__dataChange(field, value, tag);

            //数据监听
            if (this.__watchlist) {
                this.__watchlist.map(function(v, i) {
                    if (v.key == field) {
                        v.callback.call(self, target, value, tag, oldvalue);
                    }
                });
            }
        }

        this.dataTrigger(field, value);
    };

    //向下传递数据更改
    ObjTree.prototype.__dataChange = function(field, value, tagdata) {
        var self = this;
        // if (this.fieldpath === field) {
        //     this.dataChange(value);
        // }
        // this.childs.forEach(function(v) {
        //     v.__dataChange(field, value);
        // });
        this.fields.forEach(function(v) {
            //================临时处理react组件销毁方案===========
            if (v.objtree.isDestroy) {
                return;
            }
            //======================end=====================
            if (field == "") { //触发源为最外层,更新所有值
                var nv = self.getJsonValue(v.field, value);
                v.objtree.dataChange(field, nv, tagdata);
                return;
            }
            if (v.field == "") {
                //最外层会受所有变动影响
                v.objtree.dataChange(field, value, tagdata);
                return;
            }
            var compareresult = FieldPath.vali(v.field, field);
            if (compareresult == 1) { //同字段
                v.objtree.dataChange("", value, tagdata);
            } else if (compareresult == 3) {
                //变动子集
                var nv = self.getJsonValue(v.field.substr(field.length + 1, v.field.length), value);
                // console.log("son", nv);
                v.objtree.dataChange("", nv, tagdata);
            } else if (compareresult == 2) {
                //变动父集
                v.objtree.dataChange(field, value, tagdata);
            }
        });
    };

    //监听数据变化
    ObjTree.prototype.watch = function(eventname, callback) {
        if (!eventname || !callback) {
            return;
        };
        this.__watchlist.push({
            key: eventname,
            callback: callback
        });
    };

    ObjTree.prototype.trigger = function(event) {
        var self = this;
        var _arguments = arguments;
        if (typeof _arguments[0] == "string") {
            _arguments[0] = {
                eventname: _arguments[0],
                key: self.sel
            };
        }

        if (this.__eventlist) {
            //检索本地事件池
            this.__eventlist.map(function(v, i) {
                if (v.eventname == event.eventname && (v.key == "" || v.key == event.key)) {
                    v.callback.apply(self, _arguments);
                }
            });
        }
        //向上冒泡事件
        if (this.parent) {
            this.parent.trigger.apply(this.parent, _arguments);
        }
    }
    ObjTree.prototype.on = function(eventname, key, callback) {
        if (!eventname || !key) {
            return;
        };

        if (arguments.length < 3) {
            callback = key;
            key = "";
        }

        this.__eventlist.push({
            eventname: eventname,
            key: key,
            callback: callback
        });
    };

    //自动key
    ObjTree.prototype.autoKey = function(i) {
        if (i === undefined)
            i = this.autokey++;
        return "autokey_" + i;
    }

    ObjTree.prototype.getSel = function(el) {
        return this.react.getSel(el);
    };
    //禁用
    ObjTree.prototype.disable = function() {
        this.disabled = true;
        // if(this.domel){

        // }
        if (this.childs.length > 0) {
            this.childs.map(function(v) {
                if (v.react.disable) {
                    v.react.disable();
                } else {
                    v.disable();
                };
            })
        };
    };

    //启用
    ObjTree.prototype.enable = function() {
        this.disabled = false;
        if (this.childs.length > 0) {
            this.childs.map(function(v) {
                if (v.react.enable) {
                    v.react.enable();
                } else {
                    v.enable();
                };
            })
        };
    };

    //销毁
    ObjTree.prototype.destroy = function() {
        //================临时处理react组件销毁方案===========
        this.isDestroy = true;
        //======================end=====================
        if (this.parent) {
            this.parent.childs.remove(this);
        }
    }
    return ReactModule;
});