/**
 * @author 公共组件
 * @class Dialog
 * @exports Dialog
 * @description 弹窗模块
 * @example
 * //加载dialog模块
 * require("common/dialog/index");
 * var dialog = $.dialog({
 *     mask: true,
 *     width: 300,
 *     title: "title",
 *     content: "content"
 * })
 * //这种是获取.content的内容放到dialog里
 * var dialog = $.dialog({
 *     container: ".content"
 * });
 * //
 * var dialog = $.dialog({
 *     buttons: {
 *          '立即绑定': function(){
 *             this.close();
 *          },
 *          '以后再说':function(){
 *             this.close();
 *          }
 *     },
 *     content:'<p>尊敬的51返利用户，为确保正常获取返利，请绑定同程账号。</p>'
 * });
 **/
(function( $ ) {
    var $doc = $( document ),
        $el,    // 当前按下的元素
        timer;    // 考虑到滚动操作时不能高亮，所以用到了100ms延时

    // 负责移除className.
    function dismiss() {
        var cls = $el.attr( 'hl-cls' );
        clearTimeout( timer );
        $el.removeClass( cls ).removeAttr( 'hl-cls' );
        $el = null;
        $doc.off( 'touchend touchmove touchcancel', dismiss );
    }

    /**
     * @func highlight
     * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class.
     * 当不传入className是，此操作将解除事件绑定。
     *
     * 此方法支持传入selector, 此方式将用到事件代理，允许dom后加载。
     * @grammar  highlight(className, selector )   ⇒ self
     * @grammar  highlight(className )   ⇒ self
     * @grammar  highlight()   ⇒ self
     * @example
     * var div = $('div');
     * div.highlight('div-hover');
     *
     * $('a').highlight();// 把所有a的自带的高亮效果去掉。
     */
    $.fn.highlight = function( className, selector ) {
        return this.each(function() {
            var $this = $( this );

            $this.css( '-webkit-tap-highlight-color', 'rgba(255,255,255,0)')
                    .off( 'touchstart.hl' );

            className && $this.on( 'touchstart.hl', function( e ) {
                var match;

                $el = selector ? (match = $( e.target ).closest( selector,
                        this )) && match.length && match : $this;

                // selctor可能找不到元素。
                if ( $el ) {
                    $el.attr( 'hl-cls', className );
                    timer = setTimeout( function() {
                        $el.addClass( className );
                    }, 100 );
                    $doc.on( 'touchend touchmove touchcancel', dismiss );
                }
            } );
        });
    };
})( Zepto );
/**
 * @import highlight.js
 */
(function($) {
    var tpl = {
        close: '<a class="close" title="关闭"></a>',
        mask: '<div class="ui-mask_old"></div>',
        title: '<div class="ui-dialog-title"></div>',
        wrap: '<div class="ui-dialog_old">'+
            '<div class="ui-dialog-content"></div>BTNSTRING</div> '
    };

    /**
     * @desc 弹出框组件
     *
     * @param {dom | zepto | selector} [el] 用来初始化对话框的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Dialog:options)
     * @grammar $( el ).dialog( options ) => zepto
     * @grammar new gmu.Dialog( el, options ) => instance
     */

    var options = {
        /**
         * @class Dialog
         * @property {Boolean} [autoOpen=false] 初始化后是否自动弹出
         */
        autoOpen: false,
        /**
         * @property {Array} [buttons=null] 弹出框上的按钮
         */
        buttons: null,
        /**
         * @property {Boolean} [closeBtn=false] 是否显示关闭按钮
         */
        closeBtn: false,
        /**
         * @property {Boolean} [mask=true] 是否有遮罩层
         */
        mask: true,
        /**
         * @property {Number} [width=300] 弹出框宽度
         */
        width: 300,
        /**
         * @property {Number|String} [height='auto'] 弹出框高度
         */
        height: 'auto',
        /**
         * @property {String} [title=null] 弹出框标题
         */
        title: null,
        /**
         * @property {String} [content=null] 弹出框内容
         */
        content: null,
        /**
         * @property {class} [class=null] 为弹出层最外层添加的类名
         */
        className: null,
        /**
         * @property {Boolean} [scrollMove=true] 是否禁用掉scroll，在弹出的时候
         */
        scrollMove: true,
        /**
         * @property {Element} [container=null] 弹出框容器
         */
        container: null,
        /**
         * @property {Function} [maskClick=null] 在遮罩上点击时触发的事件
         */
        maskClick: null,
        beforeOpen: null,
        afterOpen : null,
        beforeClose : null,
        afterClose : null,
        style:null,
        closeTime:2000
    };

    function Dialog(param){
        this._options = this._options || {};
        $.extend(this._options,options);
        $.extend(this._options,param);
        this.init();
        // return this;
    }


    /**
     * 获取最外层的节点
     * @method getWrap
     * @return {Element} 最外层的节点
     */
    Dialog.prototype.getWrap = function(){
        return this._options._wrap;
    };

    Dialog.prototype.init = function(){
        var me = this, opts = me._options, btns,
            i= 0, eventHand = $.proxy(eventHandler, me), vars = {};

        opts._container = $(opts.container || document.body);
        (opts._cIsBody = opts._container.is('body')) || opts._container.addClass('ui-dialog-container');
        vars.btns = btns= [];
        opts.buttons && $.each(opts.buttons, function(key){
            btns.push({
                index: ++i,
                text: key,
                key: key
            });
        });
        opts._mask = opts.mask ? $(tpl.mask).appendTo(opts._container) : null;
        var btnStr = '';
        if(btns[0]){
            btnStr = '<div class="ui-dialog-btns">';
            for(var n = 0,len = btns.length;n < len;n++){
                var item = btns[n];
                btnStr += '<a class="ui-btn ui-btn-'+ n +'" data-key="'+ item.key +'">'+ item.text +'</a>';
            }
            btnStr += '</div>';
        }
        if(!opts._wrap && opts.content){
            opts._wrap = $(tpl.wrap.replace("BTNSTRING",btnStr)).appendTo(opts._container);
            opts._content = $('.ui-dialog-content', opts._wrap);
            opts._title = $(tpl.title);
            opts._close = opts.closeBtn && $(tpl.close).highlight('close-hover').on("click",function(){
                me.close();
            });

            if(opts.title){me.title(opts.title);}
            me.content(opts.content);
            btns.length && $('.ui-dialog-btns .ui-btn', opts._wrap).highlight('ui-state-hover');
            opts._wrap.css({
                width: opts.width,
                height: opts.height
            }).addClass(opts.className);
        }
        //bind events绑定事件
        $(window).on('orientationchange', eventHand);
        opts._wrap&&opts._wrap.on('click', eventHand);
        opts._mask && opts._mask.on('click', eventHand);
        opts.autoOpen && me.open();

    };

    function eventHandler (e){
        var me = this, match, wrap, opts = me._options, fn;
        switch(e.type){
            case 'orientationchange':
                this.refresh();
                break;
            /*case 'touchmove':
                opts.scrollMove && e.preventDefault();
                break;*/
            case 'click':
                if(opts._mask && ($.contains(opts._mask[0], e.target) || opts._mask[0] === e.target )){
                    return  typeof opts.maskClick === 'function' && opts.maskClick();
                }
                wrap = opts._wrap.get(0);
                if( (match = $(e.target).closest('.close', wrap)) && match.length ){
                    me.close();
                } else if( (match = $(e.target).closest('.ui-dialog-btns .ui-btn', wrap)) && match.length ) {
                    fn = opts.buttons[match.attr('data-key')];
                    fn && fn.apply(me, arguments);
                }
        }
    }

    Dialog.prototype.calculate = function(){
        var me = this, opts = me._options, size, _win, root = document.body,
            ret = {}, isBody = opts._cIsBody, round = Math.round;

        opts.mask && (ret.mask = isBody ? {
            width:  '100%',
            //height: Math.max(root.scrollHeight, root.clientHeight)-1//不减1的话uc浏览器再旋转的时候不触发resize.奇葩！
            height: Math.max(root.scrollHeight, root.clientHeight)//不减1的话uc浏览器再旋转的时候不触发resize.奇葩！
        }:{
            width: '100%',
            height: '100%'
        });
        if(!opts._wrap) {return ret;}
        size = opts._wrap.offset();
        _win = $(window);
        ret.wrap = {
            //left: '50%',
            //marginLeft: -round(size.width/2) +'px',
            //top: isBody?round(_win.height() / 2) + window.pageYOffset:'50%',
            //marginTop: -round(size.height/2) +'px'
        };
        return ret;
    };

    /**
     * 用来更新弹出框位置和mask大小。如父容器大小发生变化时，可能弹出框位置不对，可以外部调用refresh来修正。
     * @method refresh
     * @return {self} 返回本身
     */
    Dialog.prototype.refresh =  function(){
        var me = this, opts = me._options, ret, action;
        if(opts._isOpen) {

            action = function(){
                ret = me.calculate();
                ret.mask && opts._mask.css(ret.mask);
                opts._wrap&&opts._wrap.css(ret.wrap);
            };

            //如果有键盘在，需要多加延时
            if($.os && $.os.ios &&
                document.activeElement &&
                /input|textarea|select/i.test(document.activeElement.tagName)){

                document.body.scrollLeft = 0;
                //$.later(action, 200);//do it later in 200ms.
                setTimeout(action, 200);

            } else {
                action();//do it now
            }
        }
        return me;
    };

    /**

     * @return {self} 返回本身
     */
    Dialog.prototype.open = function(contents){
        var needOpen, opts = this._options,me = this;
        if(opts._isOpen){
            return;
        }
        if(contents){
            me.content(contents);
        }
        opts._isOpen = true;
        if(opts.style === 'tip'){
            if(opts.mask){
            	opts._mask.addClass("ui-dialog-tran-03");
            }

           opts._wrap.addClass("ui-dialog-black");
            var warp_ = me.getWrap();
            setTimeout(function(){
                opts.mask && opts._mask.animate( {opacity: 0 }, 1000, 'ease-out',function(){
                    opts._mask.css({opacity:''});
                });
                warp_.animate({
                    opacity: 0
                    }, 1000, 'ease-out',function(){
                        // debugger;
                        warp_.css("opacity","1");
                        me.close();

                    });
                // me.close();
            },opts.closeTime);
        }
        typeof opts.beforeOpen === "function" && (needOpen = opts.beforeOpen());
        if(needOpen){
            return this;
        }

        opts._wrap&&opts._wrap.css('display', 'block');
        opts._mask && opts._mask.css('display', 'block');

        this.refresh();

        $(document).on('touchmove', $.proxy(eventHandler, this));
        typeof opts.afterOpen === "function" && opts.afterOpen();
    };

    /**
     * 关闭弹出框
     * closebg  传入 true表示不关闭背景
     * @method close
     * @return {self} 返回本身
     */
    Dialog.prototype.close = function(closebg){
        var opts = this._options;
        if(opts.style === 'tip'){
        	if(opts.mask){
            	opts._mask.removeClass("ui-dialog-tran-03");
            }
            // else{
            // 	// opts._mask.removeClass("ui-dialog-tran");
            // }
            // opts.mask && opts._mask.removeClass("ui-dialog-tran");
        }
        typeof opts.beforeClose === "function" && opts.beforeClose();
        opts._isOpen = false;
        opts._wrap&&opts._wrap.css('display', 'none');
        if(!closebg){
            opts._mask && opts._mask.css('display', 'none');
        }else{
            return this;
        }
        $(document).off('touchmove', this.eventHandler);
        typeof opts.afterClose === "function" && opts.afterClose(this);
        return this;
    };

    /**
     * 设置或者获取弹出框标题。value接受带html标签字符串
     * @method title
     * @param {String} [value] 弹出框标题
     * @return {self} 返回本身
     */
    Dialog.prototype.title = function(value) {
        var opts = this._options, setter = value !== undefined;
        if(setter){
            value = (opts.title = value) ? '<h3>'+value+'</h3>' : value;
            opts._title.html(value)[value?'prependTo':'remove'](opts._wrap);
            opts._close && opts._close.prependTo(opts.title? opts._title : opts._wrap);
        }
        return setter ? this : opts.title;
    };

    /**
     * 设置或者获取弹出框内容。value接受带html标签字符串和zepto对象。
     * @method content
     * @param {String|Element} [val] 弹出框内容
     * @return {self} 返回本身
     */
    Dialog.prototype.content = function(val) {
        var opts = this._options, setter = val!==undefined;
        setter && opts._content.empty().append(opts.content = val);
        return setter ? this: opts.content;
    };

    /**
     * @desc 销毁组件。
     * @name destroy
     */
    Dialog.prototype.destroy = function(){
        var opts = this._options, _eventHander = this.eventHandler;
        $(window).off('orientationchange', _eventHander);
        $(document).off('touchmove', _eventHander);
        opts._wrap.off('click', _eventHander).remove();
        opts._mask && opts._mask.off('click', _eventHander).remove();
        opts._close && opts._close.highlight();
        return this;
    };


    $.dialogold = function (param) {
       return new Dialog(param);
    };
})(Zepto);

(function($){

    var tip1,tip2;

    function createTip(contents,mask){
        var option = {autoOpen: true,closeBtn: false,style:'tip',mask:mask,closeTime:1000,content:contents};
        return $.dialog(option);
    }

    function tip(contents,mask){
        if(mask){
            if(typeof tip2  === "object"){
                tip2.open(contents);
            }else{
                tip2 = createTip(contents,true);
            }
            // tip2 = typeof tip2  === "object" ? tip2 : function (contents){
            //     var option = {autoOpen: false,closeBtn: false,style:'tip',mask:true,closeTime:2000,content:contents}
            //     return $.Dialog(option);
            // }();
            // tip2.open(contents);
        }else{
            if(typeof tip1  === "object"){
                tip1.open(contents);
            }else{
                tip1 = createTip(contents,false);
            }
        }
    }
    $.tip = tip;
})(Zepto);
