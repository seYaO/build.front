(function($){
    /**
     * @class SetFont
     * @constructor
     */
    function SetFont() {
    }
    SetFont.prototype = {
        _getKeyVal: function(index){
            var href = location.href,
                char;
            if(index !== undefined){
                char = href[index];
            }else{
                return this._getChar("((![]<![]<!![])*([]+(+!![])+[]+(+!![])+(+![]))+[])",6);
            }
            return char.charAt().charCodeAt();
        },
        _getChar: function(str,index){
            var a = [],
                _str = eval(str);
            if(index){
                _str = Math.round(_str/index)+[]+index;
            }
            for(var i = 0,len = _str.length -1; i<=len; i++){
                a.push(_str[i].charCodeAt()+i+[]);
            }
            return a.join("");
        },
        _getDecArr: function(){
            var dec = this.__dec__,
                key = dec[1],
                keyVal = this._getKeyVal(key),
                decCode = ""+(dec[0]-keyVal);
            if(decCode){
                if(decCode.length === 9){
                    decCode = "0"+decCode;
                }
            }
            return decCode.split("");
        },

        dec: function(cfg){
            var els = $(cfg.el);
            var price = [];
            for (var i = 0; i < els.length; i++) {
                var el = els[i],
                    oriprice = $(el).data("__ori__");
                if(oriprice){
                    price[i] = oriprice;
                    continue;
                }
                var item;
                if(cfg.attr){
                    item = el.getAttribute(cfg.attr);
                }else{
                    item = el.innerText||el.innerHTML;
                }
                if(item){
                    price[i] = this._rePrice(item);
                }
            }
            return price;
        },
        _rePrice: function(price){
            var decArr = this._getDecArr(),
                _tmpArr = [];
            for (var i = 0; i < price.length; i++) {
                _tmpArr.push(decArr[price[i]]);
            }
            return _tmpArr.join("");
        },
        _create: function(els,price,cfg){
            var t1 = "c",
                t2 = "a",
                t3 = "n",
                t4 = "s",
                t5 = "v",
                tmpl = '<{tag} class="{randomCls}" width="{width}" height="{height}"></{tag}>',
                offset = [],
                ratio = window.devicePixelRatio || 1;

            $(els).each(function(index,el){
                var item = $(el),
                    priceItem = price[index],
                    param = cfg.param,
                    defaultParam = {
                        fontFamily: "Arial",
                        fontSize: 14,
                        fillStyle: "#ff8400",
                        textBaseline: "middle",
                        fontWeight: "normal"
                    },
                    _param = $.extend({},defaultParam,param),
                    itemWidth = ((cfg.max||(""+priceItem).length)*(_param.fontSize/2+1)+2),
                    itemHeight = item.height()||(_param.fontSize*1.5),
                    style = {
                        "width": itemWidth* ratio,
                        "height": itemHeight* ratio,
                        "tag": t1+t2+t3+t5+t2+t4
                    };
                if(!priceItem){
                    return;
                }
                item.empty();
                offset.push(style);
                var html = tmpl.replace(/{(\w+)}/g,function($0,$1){
                    return style[$1]||"";
                });
                style.width = itemWidth;
                style.height = itemHeight;
                var canvas = $(html).css(style).appendTo(el),
                    cvs = canvas[0];

                if(cvs.getContext){
                    var ctx=cvs.getContext("2d");
                    _param.font = _param.fontWeight + " "+  _param.fontSize * ratio+"px " + _param.fontFamily;
                    $.extend(ctx,_param);
                    ctx.fillText(priceItem,0,itemHeight* ratio/2);
                    item.data("__ori__",priceItem);
                    item.data("__ctx__",ctx);
                    item.data("__cvs__",cvs);

                }
            });
        },
        renderPrice: function(els,price,cfg){
            var self = this,
                sel = $(els),
                filterEls = [],
                priceArr = [],
                ratio = window.devicePixelRatio || 1;
            sel.each(function(index,el){
                var item = $(el),
                    ctx= item.data("__ctx__"),
                    cvs = item.data("__cvs__"),
                    priceItem = price[index];
                if(!priceItem){
                    priceItem = item.data("__ori__");
                }
                if(!priceItem){
                    return true;
                }
                if(!ctx){
                    filterEls.push(el);
                    priceArr.push(priceItem);
                }else{
                    if(cfg.bgColor){
                        ctx.fillStyle = cfg.bgColor;
                        ctx.fillRect(0,0,cvs.width,cvs.height * ratio/2);
                    }
                    ctx.fillStyle = cfg.param.fillStyle;
                    ctx.fillText(priceItem,0,cvs.height/2);
                }

            });

            self._create(filterEls,priceArr,cfg);
        },
        /**
         * @func setPrice
         * @param cfg
         */
        setPrice: function(cfg){
            this.__dec__ = [eval(cfg.dec)];
            var els = cfg.el,
                prices = this.dec(cfg);
            this.renderPrice(els,prices,cfg);

        }
    };
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = SetFont;
    } else {
        window.SetFontModule = SetFont;
    }
}(Zepto));