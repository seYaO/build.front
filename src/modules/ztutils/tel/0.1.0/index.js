;
!function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var root = (function () {
            return this
        }).call();
        root.AddPhone = factory();
    }
}(function () {
    var AddPhone = function () {
        var self = this;
        if (!(self instanceof AddPhone)) {
            return new AddPhone();
        }
    };
    AddPhone.prototype = {
        init : function(cfg){
            var self = this;
            $.extend(self.cfg, cfg||{});

            var phone = $(self.cfg.tmpl_tri),
                panel = $(self.cfg.tmpl_cont());
            phone.css(self.cfg.style);
            $("body").append(phone);
            $("body").append(panel);

            self.telEvent();
            self.cfg.callback.call(this);
        },
        cfg : {
            tmpl_tri : '<a href="javascript:void(0);" class="tel-phone J_Phone"></a>',
            tmpl_cont : function(){
                var out = '<div class="J_TelWarp tel-warp"><div class="tel-mask"></div><div class="tel-box"><a href="tel:'+ this.tel +'" class="tel-client">拨打客服电话</a><span class="tel-close"></span></div></div>';return out;
            },
            tel : "4007-555-555",
            style : {},
            callback : function(){}
        },
        telEvent : function () {
        var telwarp = $(".J_TelWarp");
        $(".J_Phone").on("click", function () {
            telwarp.show();
        });
        $(".J_TelWarp .tel-mask,.J_TelWarp .tel-close").on("click", function () {
            telwarp.hide();
        });
    }
    };

    var addPhone = new AddPhone();
    return addPhone;
});
