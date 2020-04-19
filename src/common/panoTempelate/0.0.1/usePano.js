/**
 * 新世纪号接入全景
 * Create by zk39023 on 2016/12/13
 * 初始需求：1、首页大图优先显示全景，并在图片右上角显示“720全景”标签
 * 邮轮介绍栏目中图片添加“720全景”标签
 * 如果浏览器不支持canvas标签则不显示标签和全景
 */

;
(function(R, F, window, document, undefined) {
    define('view', [], function() {
        //判断浏览器是否支持canvas标签
        function isIE() { //ie?
            if (!!window.ActiveXObject || "ActiveXObject" in window) return true;
            else return false;
        }
        if (isIE()) return false;
        var canvas = document.createElement('canvas');
        if (!canvas.getContext('2d')) return false;

        var ViewObj = function(ele, options) {
            var that = this;
            this.ele = F.one(ele);
            this.defaults = {
                tag: true,
                iframe: true,
                imgUrl: ''
            };
            F.lang.extend(that.defaults, options);
            this.imgUrl = this.ele.attr('data-imgurl');
        };
        ViewObj.prototype = {
            init: function() {
                //初始化
                var that = this,
                    $ele = that.ele;

                if (that.defaults.iframe) {
                    that.addIframe();
                }
                if (that.defaults.tag) {
                    that.addTag();
                }
            },
            addTag: function() {
                //添加tag标签
                var that = this,
                    $ele = that.ele;
                var tag = document.createElement('div');
                tag.className = 'view720Tag';
                tag.appendChild(document.createTextNode('720°全景观看'));
                $ele[0].appendChild(tag);
                that.tagEle = F.one(tag);
                that.bindEvent();
            },
            addIframe: function() {
                //如果需要在页面中嵌入全景，需要使用框架
                var that = this,
                    $ele = that.ele;
                var iframeStr = document.createElement('iframe');
                iframeStr.className = 'view720InsetIframe';
                iframeStr.src = 'http://www.ly.com/youlun/zhuanti/pano?imgUrl=' + encodeURIComponent(that.imgUrl);
                iframeStr.scrolling = 'no';
                iframeStr.frameBorder = 0;
                $ele[0].appendChild(iframeStr);
            },
            addDialog: function() {
                //添加浮层；
                var that = this,
                    $ele = that.ele;
                var dialog = that.dialog = document.createElement('div');
                dialog.className = 'view720Dialog none';
                document.body.appendChild(dialog);
                that.dialog = F.one(dialog);
                //添加全景框架
                var dialogIframe = that.dialogIframe = document.createElement('iframe');
                dialogIframe.className = 'view720Iframe';
                dialogIframe.scrolling = 'no';
                dialogIframe.frameBorder = 0;
                dialogIframe.src = 'http://www.ly.com/youlun/zhuanti/pano?imgUrl=' + encodeURIComponent(that.imgUrl);
                dialog.appendChild(dialogIframe);
                that.dialogIframe = F.one(dialogIframe);
                //添加关闭按钮
                var dialogCloseBtn = that.dialogCloseBtn = document.createElement('div');
                dialogCloseBtn.appendChild(document.createElement('i'));
                dialogCloseBtn.className = 'dialogCloseBtn dialog-close-btn';
                dialog.appendChild(dialogCloseBtn);
                F.one(dialogCloseBtn).on('click', function(e) {
                    e.stopPropagation();
                    F.one(dialog).addClass('none');
                });
                F.one(dialogIframe).on('click', function(e) {
                    e.stopPropagation();
                });
                F.one(dialog).on('click', function(e) {
                    F.one(this).addClass('none');
                });
            },
            bindEvent: function() {
                //添加绑定事件
                var that = this,
                    $ele = that.ele,
                    $tag = that.tagEle;
                $tag.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!fish.one('.view720Dialog').length) {
                        that.addDialog();
                    } else {
                        that.dialog = fish.one('.view720Dialog')[0];
                        that.dialogIframe = fish.one('.view720Iframe', fish.one('.view720Dialog'))[0];
                        that.dialogCloseBtn = fish.one('.dialogCloseBtn', fish.one('.view720Dialog'))[0];
                    }
                    that.dialogIframe.src = 'http://www.ly.com/youlun/zhuanti/pano?imgUrl=' + encodeURIComponent(that.imgUrl);
                    F.one(that.dialog).removeClass('none');
                });
            }
        };
        var View = function(ele, options) {
            var view = new ViewObj(ele, options);
            return view.init();
        };
        return View;

    });
})(requirejs, fish, window, window.document);
