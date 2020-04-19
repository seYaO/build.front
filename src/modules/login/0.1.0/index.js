define("login/0.1.0/index",["login/0.1.0/index.css"],function(){
    var inst,$ = jQuery;
    var Login = function(param) {
        if(!inst){
            inst = this;
            $.extend(inst.config, param);
            inst.init();
        }else{
            inst.open();
        }
    };
    Login.prototype = {
        config: {
            className: 'mLogin_iframe',
            width: 293,
            height: 293,
            loginSuccess: function(){}
        },
        currentDomain: document.domain,
        init: function(){
            var self = this;
            window.loginSuccess = function(){
                self.success.call(self);
            };
            self.setDomain(self.getDomain());
            self.build();
            self.open();
        },
        open: function(){
            $('.login_bg_bag, .mLogin_iframe').css({display: "block"});
        },
        close: function(){
            $('.mLogin_iframe, .login_bg_bag').css({display: "none"});
        },
        build: function(){
            var self = this,
                config = self.config;
            if (!$(".mLogin_iframe").length) {
                $('body').append('<div class="mLogin_iframe">' +
                    '<div class="login_top">' +
                    '<a href="javascript:;" class="mLogin_close"></a>' +
                    '</div>' +
                    '<div class="login_iframe_content">' +
                    '<iframe frameborder="no" scrolling="no" src="https://passport.ly.com/login/loginmodule"></iframe>' +
                    '</div>' +
                    '</div>').append('<div class="login_bg_bag"></div>');
            }
            $('.mLogin_iframe .mLogin_close, .mLogin_iframe .login_top a').on('click', function() {
                if (config.onClose) {
                    if (config.onClose() === true) {
                        return;
                    }
                }
                self.close();
            });
            $('.login_bg_bag').on('click', function() {
                if (config.maskClose) {
                    self.close();
                }
            });
        },
        getDomain: function(){
            var match = location.hostname.match(/\.[^\.]*\.(com|cn|net)$/);
            if (match) {
                return match[0].substring(1); // 不带点
            } else {
                return location.hostname;
            }
        },
        setDomain: function(domain){
            try {
                document.domain = domain;
            } catch (e) {}
        },
        success: function () {
            var self = this,
                config = self.config;
            if (config.loginSuccess) {
                config.loginSuccess();
            }
            self.setDomain(self.currentDomain);
            self.close();
            if(!config.unReload) {
                window.location.reload();
            } else {
                $('.mLogin_iframe iframe').remove();
                $('.mLogin_iframe .login_iframe_content').html('<iframe frameborder="no" scrolling="no" src="https://passport.ly.com/login/loginmodule"></iframe>');
            }
        }
    };
    return Login;
});
