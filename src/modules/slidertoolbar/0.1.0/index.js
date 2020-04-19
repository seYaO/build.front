/**
 * @desc 右侧滑动工具栏
 * @opt {object}
 */
define("slidertoolbar/0.1.0/index", ["base/0.1.0/module", "./views/main.dot"], function (require, exports, module) {
    var Module = require("base/0.1.0/module");
    var Tmpl = require("./views/main.dot");

    var Slider = Module.extend({
        initialize: function (options) {
            //init super
            Slider.superclass.initialize.apply(this, arguments);
            //init
            Slider.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var o_wrapper=this.o_wrapper = $(Tmpl(this.attr));
            o_wrapper.appendTo("body");
            var all = document.createElement("script");
            all.type = 'text/javascript';
            all.src = "//www.ly.com/udc/static/js/preview.js";
            var st = document.getElementsByTagName("script")[0];
            st.parentNode.insertBefore(all, st);
            o_wrapper.on("mouseover", "li", function () {
                var $li = $(this);
                $li.addClass("avtive");
            });
            o_wrapper.on("mouseout", "li", function () {
                $(this).removeClass("avtive");
            });

            $(window).scroll(function () {
                if ($(window).scrollTop() > 30) {
                    $(".module-slider-totop").css("visibility", "visible");
                }
                else {
                    $(".module-slider-totop").css("visibility", "hidden");
                }
            });

            o_wrapper.on('click', ".module-slider-totop", function () {
                $(window).scrollTop(0);
            });
        },
        ATTRS: {
            topMenu: [],
            bottomMenu: [],
            toTop: true,
            skin:'default'
        },
        METHODS: {
            render: function () {

            },
            addMenu: function (conf, type, index) {
                var wrapper;
                if (type == "top") {
                    wrapper = this.o_wrapper.find(".module-slider-top ul");
                }
                else {
                    wrapper = this.o_wrapper.find(".module-slider-bottom ul");
                }
                var html = '<li>' + this.getTmpl(conf) + '</li>';
                var t = wrapper.find('li');
                if (index == undefined || t.length <= index) {
                    wrapper.append(html);
                }
                else {
                    t.eq(index).before(html);
                }
            },
            resetMenu: function (conf, type, index) {
                var wrapper;
                if (type == "top") {
                    wrapper = this.o_wrapper.find(".module-slider-top ul");
                }
                else {
                    wrapper = this.o_wrapper.find(".module-slider-bottom ul");
                }
                var html = this.getTmpl(conf);
                wrapper.find('li').eq(index).html(html);
            },
            getTmpl: function (conf) {
                //<div class="tooltip_gp {{=tooltip_gp_class}}">
                var tooltip_gp_class = conf.arrow ? 'arrow' : '';
                tooltip_gp_class += ' '+(conf.tooltipCls || '');
                var html = '';
                html += '<div class="content">';
                html += conf.icon || '';
                html += '<div class="tooltip_gp ' + tooltip_gp_class + '">';
                html += conf.tooltips || '';
                html += ' </div>';
                if (conf.arrow) {
                    html += '<i></i>';
                }
                html += ' </div>';
                html += '';
                return html;
            }
        }
    });

    return Slider;

});

