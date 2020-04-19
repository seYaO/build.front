// 生成图片
;
! function($, window, document, undefined) {
    var thisObj = thisObj || {};
    $.extend(thisObj, {
        resource: {
            "ewmImg": { name: "二维码", url: "//file.40017.cn/youlun/m/img/zt/20170215h5/erweima.png?v=10" },
            "bgImg": { name: "背景", url: "//file.40017.cn/youlun/m/img/zt/20170215h5/bg.jpg" },
            "headImg": { name: "头像" },
            "textImg": { name: "text" }
        },
        init: function() {
            this.userAgent();
            // 判断环境，为浏览器时
            if (this.isSet == 0) {
                $(".complete-btn .btn").remove();
            }
            var canvas = document.createElement("canvas");
            canvas.width = 487;
            canvas.height = 605;
            var context = canvas.getContext("2d");
            $.extend(this, {
                canvas: canvas,
                context: context
            })
            this.bindEvent();
        },
        bindEvent: function() {
            var canvasHolder = document.getElementById("canvasHolder");
            var _this = this;
            this.opts = this.opts || {};
            this.opts.vipName = $("#VipName").val() || "";
            this.opts.infoName = $("#infoName").val() || $("#ToName").val() || "";
            this.loadImg();
            _this.loadBasce64(function() {
                _this.loadResource(function() {
                    _this.play.call(_this);
                    var pngImg = _this.convertCanvasToImage.call(_this, _this.canvas);
                    canvasHolder.appendChild(pngImg);

                    // canvasHolder.appendChild(_this.canvas);
                });
            });
        },
        loadImg: function() {
            var count = 2,
                obj = this.resource;            
            obj["textImg"]["url"] = document.getElementById("textImg").src;
            obj["headImg"]["url"] = document.getElementById("headImg").src;
            
        },
        loadResource: function(callback) {
            var count = 0,
                obj = this.resource;
            for (var item in obj) {
                if (obj.hasOwnProperty(item)) {
                    count++;
                }
            }
            for (var item in obj) {
                if (obj.hasOwnProperty(item)) {
                    obj[item]["image"] = new Image();
                    obj[item]["image"].src = obj[item]["base64"];
                    // alert(obj[item]["image"].src);
                    obj[item]["image"].onload = function() {
                        count--;
                        if (count <= 0) {
                            if (callback && $.isFunction(callback)) {
                                callback.call();
                            }
                        }
                    }
                }
            }
        },
        loadBasce64: function(callback) {
            var _this = this,
                count = 0,
                obj = this.resource;
            for (var item in obj) {
                if (obj.hasOwnProperty(item)) {
                    count++;
                }
            }

            for (var item in obj) {
                if (obj.hasOwnProperty(item)) {
                    var img = new Image();
                    img.crossOrigin = '';
                    img.src = obj[item]["url"];

                    (function(_item, _img) {
                        img.onload = function() {
                            count--;
                            obj[_item]["base64"] = _this.getBase64Image(_img);
                            if (count <= 0) {
                                if (callback && $.isFunction(callback)) {
                                    callback.call();
                                }
                            }
                        }
                    }(item, img));
                }
            }
        },
        play: function() {
            this.context.drawImage(this.resource["bgImg"]["image"], 0, 0);
            //
            this.context.font = "normal 30px FangSong";
            this.context.fillStyle = "#3c1b0e";
            var name = this.opts.vipName;
            //自己的名字
            this.context.fillText(name.slice(0, 7) + "..", 220, 65);
            this.context.fillText("的三行情书", 220, 103);
            //Ta的名字
            var toName = this.opts.infoName;
            this.context.fillText(toName.slice(0, 8), 132, 194);

            this.context.drawImage(this.resource["textImg"]["image"], 0, 212);

            if (this.resource["ewmImg"]["image"] && this.isSet != 1) {
                this.context.drawImage(this.resource["ewmImg"]["image"], 160, 432);
            }

            this.createCircleClip.call(this, this.context);
            this.context.drawImage(this.resource["headImg"]["image"], 110, 30, 84, 84);
        },
        convertCanvasToImage: function(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image;
        },
        createCircleClip: function(context) {
            context.beginPath();
            context.arc(152, 72, 42, 0, Math.PI * 2, false);
            context.closePath();
            context.clip();
        },
        getBase64Image: function(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataURL = canvas.toDataURL("image/png");
            canvas = null;
            return dataURL;
        },
        userAgent: function() {
            var useragent = navigator.userAgent;
            if (useragent.indexOf('iPad') > 0) {
                $(".complete-image").addClass("pad");
            }
        }
    });

    function convertData(isConvert, isApp, isWeChat) {
        thisObj.isSet = thisObj.isSet || 0; // -1:detail页面 0:浏览器 1:app 2:微信
        if (isApp == 1) {
            thisObj.isSet = 1;
        }
        if (isWeChat == 1) {
            thisObj.isSet = 2;
        }
        if (isConvert == false) {
            thisObj.isSet = -1;
        }
        thisObj.init();
    }

    module.exports = convertData;
}(Zepto, window, document);
