var smsCheck = {
    cfg : {
        checkUrl : "http://www.ly.com/dujia/AjaxHelper/MessageValidHandler.ashx?action=CodeMessageResult&mobile=",
        timer : 90,
        deadCls : "disabled",
        startTmpl : "获取验证码",
        loopTmpl : "重新获取{num}s",
        endTmpl : "重发验证码",
        loopCb : null,
        endCb :null
    },
    countdown : function(num,callback){
        var self = this,
            args = arguments;
        self.timer  = setTimeout(function(){
            var ret = callback.call(self,--num);
            if(ret !== true){
                self.countdown.apply(self,args);
            }
        },1000);
    },
    sendsmail : function (phone){
        var img = new Image(),
            id = "__img__" + Math.random();
        window[id] = img;
        img.onload = img.onerror = function () {
            window[id] = null;
        };
        img.src = this.cfg.checkUrl + phone;
        img = null;
    },
    /*公共方法*/
    send : function(cfg){ /*{el:,phone:;}必传*/
        var self = this;
        $.extend(self.cfg, cfg||{});

        var _cfg = self.cfg;
        if(!self.isSending){
            self.isSending = true;
            _cfg.el.addClass(_cfg.deadCls);

            self.sendsmail(_cfg.phone);
            self.countdown(_cfg.timer,function(num){
                if(num === 0){
                    _cfg.el.text(_cfg.endTmpl);
                    self.isSending = false;
                    _cfg.el.removeClass(_cfg.deadCls);
                    return true;
                }
                _cfg.el.text(_cfg.loopTmpl.replace(/\{num\}/g,num));
            });
        }
    },
    timerOut : function(){
        var self = this,
            _cfg = self.cfg;
        if(self.timer){
            self.isSending = false;
            clearTimeout(self.timer);
            _cfg.el.removeClass(_cfg.deadCls);
            _cfg.el.html(_cfg.startTmpl);
        }
    },
};
var verifyCheck = {
    checkStrLen: function (str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            len += /[^\x00-\xff]/g.test(str[i]) ? 1 : 0.25;
        }
        return len;
    },
    verify: function (el,type,sign,signstr) {
        if (el.length < 1) {
            return false;
        }
        if (!type) {
            return false;
        }
        var ret = true,
            field = el.val(),
            tipEl = el.siblings('.form-tip');

        switch (type) {
            case "phone" :
                ret = /^1[0-9]{10}$/.test(field);
                break;
            case "code" :
                ret = field === '' ? false : true;
                break;
            case "cardId":
                ret = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/.test(field);
                break;
            case "username":
                ret = this.checkStrLen(field) > 5 ? false : true;
                break;
        }
        if (!ret || sign) {
            tipEl.html((signstr||tipEl.attr("data-err")));
        }
        return ret;
    }
};
