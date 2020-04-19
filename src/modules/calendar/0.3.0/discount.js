define("calendar/0.3.0/discount",["./calDiscount.dot"],function(require,exports,module){
    var calDiscountTmpl = require("./calDiscount.dot"),
        $ = jQuery;
    var inst;
    var Discount = function(){
        if(!inst){
            inst = this;
        }
        return inst;
    };
    Discount.prototype = {
        __data: {},
        ak: "",
        lineid: "",
        url: "/dujia/AjaxFinalTours.aspx?type=GetCalendarPreferential",
        host: window.host||"",
        init: function(cfg, host){
            var self = this,
                cal = cfg.calendar,
                calData = cfg.calData,
                wrapper = cfg.wrapper;
            if (host) {
                self.host = host;
            }
            self.isGetting = false;
            self.calInst = cal;
            $.extend(self,cfg);
            wrapper.find("td").each(function(i,n) {
                var item = $(n),
                    isInvalid = item.hasClass("invalid-day"),
                    hasIconDiscount = item.find(".icon-discount").length > 0;
                if (!hasIconDiscount||isInvalid) {
                    return;
                }
                item.hover(function (e) {
                    var el = item;
                    if (self.isGetting) {
                        return;
                    }
                    self.isGetting = true;
                    self.triggerEnter(e,el,calData,function(data){
                        self.isGetting = false;
                        self.renderDiscountTip(data,calData,el);
                    });
                },function (e) {
                    self.isGetting = false;
                    self.mouseMockEvent(e, function () {
                        $(".J_DiscountTip").css({display:"none"});
                    })

                })
            })
        },
        triggerEnter: function(e,el,calData,callback){
            var self = this,
                priceEl = el.find(".dataprice"),
                price,date,nowMonth;
            if(priceEl.length === 0){
                return;
            }
            price = priceEl.html().replace(/[^\d]+/g,"");
            if(!price){
                return;
            }
            nowMonth = self.calInst.getNowMonth();
            var _year = nowMonth.getFullYear(),
                _month = nowMonth.getMonth() + 1,
                _date = el.attr("data-date");
            if($(el[0]).hasClass('previous-monthDay')){
              _month = nowMonth.getMonth();
            }else if($(el[0]).hasClass('next-monthDay')){
              _month = nowMonth.getMonth() + 2;
            };
            date = nowMonth.getFullYear() + "-" + (_month) + "-" + el.attr("data-date");
            self.isGetting = true;
            self.mouseMockEvent(e||el, function (el) {
                if (self.__data[date]) {
                    callback && callback.call(self,self.__data[date],el);
                    return;
                }


                var date1 = _year + "-" + _month + "-" + _date,
                        elemData = {},
                        index = 0,
                        calDataLen = calData.PriceList.length;
                    for(var i = 0; i < calDataLen; i++){
                        var date2 = new Date(calData.PriceList[i].Date),
                        diffDate = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
                        if(date1 == diffDate){
                            index = i;
                            break;
                        }
                    }
                    elemData = calData.PriceList[index].Preferential;
                    var _data = {
                        OriginPrice: price || "",
                        list: calData.PriceList[index].Preferential
                    };
                    self.__data[date] = _data;
                    callback && callback.call(self,_data,el);

            })
        },
        renderDiscountTip: function(data,calData,relatedEl){
            var self = this,
                sel = ".J_DiscountTip";
            if(!(data.list && data.list.length)){
                return;
            }
            var tmpl = calDiscountTmpl(data),
                rEl = $(relatedEl),
                rElWidth = rEl.width(),
                relOffset = rEl.offset(),
                el = $(sel);
            if(el.length > 0){
                el.remove();
            }
            $("body").append(tmpl);
            var _sel = $(sel),
                _relatedEl = relatedEl;
            _sel.css({
                top: relOffset.top+30,
                left: relOffset.left+rElWidth-8-23
            });
            _sel.hover(function(){},function(e){
                var el = _relatedEl,
                    relatedEl = e.relatedTarget|| ((e.type === "mouseover") ? e.toElement : e.fromElement);
                if($.contains(el,relatedEl)){
                    return;
                }else{
                    var parent;
                    if(
                        relatedEl.tagName.toLowerCase() === "td" &&
                        (!$(relatedEl).hasClass("invalid-day"))
                    ){
                        parent = relatedEl;
                    }else if(
                        relatedEl.parentNode.tagName.toLowerCase() === "td" &&
                        (!$(relatedEl.parentNode).hasClass("invalid-day"))
                    ){
                        parent = relatedEl.parentNode;
                    }
                    if(parent){
                        self.triggerEnter(null,$(parent),calData,function(data,el){
                            self.renderDiscountTip(data,calData,el);
                        });
                        return;
                    }
                }
                self.mouseMockEvent(e,function(){
                    _sel.css({display:"none"});
                },true);
            });
        },
        mouseMockEvent: function(e,callback,isFromTip){
            var self = this;
            //如果e为节点,则直接回调
            if(!e.type){
                callback && callback.call(self.calInst,e);
                return;
            }
            var a = e.currentTarget|| e.srcElement,
                b = e.relatedTarget|| ((e.type === "mouseover") ? e.toElement : e.fromElement),
                tipEl = $(".J_DiscountTip")[0];
            if(!isFromTip){
                if(tipEl && ($.contains(tipEl,b) ||b==tipEl)){
                    return;
                }
            }
            if(!$.contains(a, b)){
                if(self.mockEventT){
                    window.clearTimeout(self.mockEventT);
                }
                var delay = e.type === "mouseover"?100:0;
                self.mockEventT = window.setTimeout(function(){
                    callback && callback.call(self.calInst,a);
                },delay);

            }
        }
    };
    module.exports = Discount;
});
