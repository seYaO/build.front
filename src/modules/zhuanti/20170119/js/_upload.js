;
! function($, window, document, undefined) {
    var thisObj = thisObj || {};
    $.extend(thisObj, {
        init: function() {
            this.bindEvent();
            this.upLoadImg();
        },
        bindEvent: function() {
            var _this = this;
            var $btn = $(".info-btn .btn");
            $btn.on("click", function() {
                if (_this.checkFn()) {
                    var jq = jQuery.noConflict();
                    if (!$btn.hasClass('subing')) {
                        $btn.addClass('subing');
                        var $form = jq('#applyForm');
                        var options = {
                            url: $form.attr("action"),
                            type: "post",
                            success: function(data) {
                                _this.submitBack(data);
                            }
                        };
                        //  提交
                        $form.ajaxSubmit(options);
                    }
                }
            });
        },
        //  提交回调
        submitBack: function(data) {
            var _this = this;
            var $btn = $(".info-btn .btn");
            if (data.RspCode == 1) {
                _this.actionHelp.messageBox('上传成功！', true);
                setTimeout(function() {
                    location.href = '/zhuanti/peiban';
                    // location.href= 'youlun/zhuanti/peiban';
                }, 3000);
            } else {
                _this.actionHelp.messageBox('上传失败！');
                $btn.removeClass('subing');
            }
        },
        //  验证方法
        checkFn: function() {
            var _this = this;
            var regName = /^(.*?)+[\d~!@#$%^&*()_\-+\={}\[\];:'"\|,.<>?！￥……（）——｛｝【】；：‘“’”、《》，。、？]/;
            var regMob = /^1[3,4,5,7,8]\d{9}$/i;

            //  姓名          
            if ($('#infoName').val().trim() == '' || regName.test($('#infoName').val().trim())) {
                _this.actionHelp.messageBox('请输入正确的姓名！');
                return false;
            }
            //  手机号            
            if ($('#infoPhone').val().trim() == '' || !regMob.test($('#infoPhone').val().trim())) {
                _this.actionHelp.messageBox('请输入正确的手机号！');
                return false;
            }
            //  地址
            // if ($('#infoAddress').val().trim() == '') {
            //     _this.showTips('请输入正确的地址！');
            //     return false;
            // }
            //  备注
            if ($('#infoComment').val().trim() == '') {
                _this.actionHelp.messageBox('请填写新年想对父母说的话!');
                return false;
            }
            //  照片
            if ($('.img .photo')[0].src == '' || !$('.img .addImg')[0].value) {
                _this.actionHelp.messageBox('请上传照片！');
                return false;
            }
            return true;
        },
        upLoadImg: function() {
            var _this = this;
            var allName = "";
            $(".addImg")[0].onchange = function(e) {
                if (this.files.length > 0) {
                    var file = this.files[0];
                    showImg(file, $(this).parents(".img")[0]);
                }
            };

            function showImg(file, parent) {
                //
                var dom = $(".photo", parent)[0];
                var add = $(".addImg", parent)[0];
                ////  图片名称
                //alertFn(JSON.stringify(file));
                //if (file.name && allName.indexOf(file.name) > -1) {
                //    alertFn("相同的图片不能重复上传！");
                //    return;
                //}
                allName += file.name;
                //  图片格式验证
                if (!/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/.test(file.name)) {
                    add.value = '';
                    dom.src = '';
                    $(dom).css({ "display": "none" }).addClass("hasImg").attr("_name", '');
                    $(".des-txt", parent).css({ "opacity": 1 });
                    _this.actionHelp.messageBox('仅支持jpg，jpeg，png，gif格式的图片！');
                    return;
                }
                //  图片大小
                if (file.size > 5 * 1024 * 1024) {
                    _this.actionHelp.messageBox("图片大小不能超过5M！");
                    return;
                }
                var reader = new FileReader();
                // 读文件
                reader.onload = function(event) {
                    //alert(event.target.result);
                    dom.src = event.target.result;
                    $(dom).css({ "display": "block" }).removeClass("hasImg").attr("_name", file.name);
                };
                reader.readAsDataURL(file);
                //  图片加载完后
                // $(".des-txt", parent).css({ "opacity": 0 });
            }
        },
        // 弹框
        actionHelp: {
            popShow: function(elem) {
                $('#pop-bg').removeClass('none');
                $(elem).removeClass('none');
                $("html").css({ "height": "100%", "overflow-y": "hidden" });
            },
            popHide: function(elem) {
                $('#pop-bg').addClass('none');
                $(elem).addClass('none');
                $("html").css({ "height": "auto", "overflow-y": "auto" });
            },
            messageBox: function(msg, flg) {
                flg = flg || false;
                if (!document.getElementById('tip_layer')) {
                    var tipl = document.createElement('div');
                    tipl.id = 'tip_layer';
                    tipl.className = 'tip_layer';
                    document.body.appendChild(tipl);
                }
                var lv = document.getElementById('tip_layer');
                lv.innerHTML = msg;
                lv.style.display = "block";
                var lw = lv.offsetWidth / 2,
                    lh = (lv.offsetHeight / 2);
                lv.style.marginLeft = "-" + lw + "px";
                lv.style.marginTop = "-" + lh + "px";
                if (!flg) {
                    setTimeout(function() {
                        lv.style.display = "none";
                        lv.innerHTML = "";
                    }, 3000);
                }
                $("body").css({
                    "width": "",
                    "height": "",
                    "overflow": "",
                    "position": "",
                    "padding-bottom": 55
                })
            }
        }
    });
    $(document).ready(function() {
        thisObj.init();
    });
}(Zepto, window, document);
