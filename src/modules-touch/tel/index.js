/**
 * @author 韩建邦(已离职)
 * @class  商务通
 * @exports Tel
 * @description
 * 商务通模块
 */
(function($) {
    /**
     * @var options
     * @type {{mask: boolean, width: string, height: string, scrollMove: boolean, url: string, desc: string, memberid: string, telnum: string, lineproperty: string, getProperty: Function}}
     */
    var options = {
        mask: true,
        width: '100%',
        height: 'auto',
        scrollMove: true,
        url: "//livechat.ly.com/out/guest/touch?p=",
        desc: '',
        memberid: '',
        lineproperty: '自助',
        lineid:'',
        getProperty: function() {
            if (this.lineproperty === "自助") {
                this.url = this.url + "2&c=2" ;
            } else {
                this.url = this.url + "7";
            }
            this.url=this.url+"&lineid="+this.lineid;
        }
    };
    /**
     * @class Tel
     * @var tpl
     * @desc 商务通模板
     * @type {{mask: string, wrap: string}}
     */
    var tpl = {
        mask: '<div class="ui-share-bg"></div>',
        wrap: '<div class="ui-share">' +
        '<a class="close-btn" onclick="_tcTraObj._tcTrackEvent(\'tcdujia_zhongye\',\'gj_cancel\',\'取消\',\'\')" title="取消" ><div class="share-cancel"></div></a>' +
        '<div style="clear:both;"></div>' +
        '<div class="ui-share-c">' +
        '<div class="share-open-con">' +
        '<ul>{telStr}</ul>' +
        '</div></div></div>'

    };

    /**
     *
     * @param param
     * @constructor Tel
     */
    function Tel(param) {
        this._options = this._options || {};
        $.extend(this._options, options);
        $.extend(this._options, param);
        this._options.memberid = telLogInit();
        this._options.getProperty();
        this.init();
    }
    Tel.prototype.init = function() {
        // body...
        var self = this,
            opts = self._options;

        var status = self.checkstatus();
        opts._container = $(document.body);
        if (0 === status) {
            opts._mask = $(".ui-share-bg");
            opts._wrap = $(".ui-share");
        } else {
            var telStr;
            //if(opts.isHot === "6" || self.isSpecialActId()){
            //    telStr = '<li class="share-share" onclick="_tcTraObj._tcTrackEvent(\'tcdujia_zhongye\',\'gj_service\',\'在线客服\',\'\')">在线客服</li>';
            if(self.isGloryActId()){
                telStr =  '<li class="share-share">产品编号：<strong>' + opts.lineid + '</strong></li>' +
                        '<li class="pro-num">为了节约您的时间，请告知客服产品编号</li>' +
                    '<li class="share-collect" onclick="_tcTraObj._tcTrackEvent(\'tcdujia_zhongye\',\'gj_telephone\',\'电话咨询\',\'\')">电话咨询：0513-85121996</li>';
            }else{
                telStr =  '<li class="share-share">产品编号：<strong>' + opts.lineid + '</strong></li>' +
                        '<li class="pro-num">为了节约您的时间，请告知客服产品编号</li>' +
                    '<li class="share-collect" onclick="_tcTraObj._tcTrackEvent(\'tcdujia_zhongye\',\'gj_telephone\',\'电话咨询\',\'\')">电话咨询：{telnum}</li>';
            }
            tpl.wrap = tpl.wrap.replace("{telStr}",telStr);
            tpl.wrap = tpl.wrap.replace(/{(\w+)}/g, function($0,$1){
                return opts[$1];
            });

            opts._mask = opts.mask ? $(tpl.mask).appendTo(opts._container) : null;
            opts._wrap = $(tpl.wrap).appendTo(opts._container);
        }
        this.show(function(){
            self.bottomEvent(status);
        });
        self.initEvent();

    };
    Tel.prototype.show = function(callback){
        var self = this,
            opts = self._options;
        opts._mask.css({
            display: "block",
            opacity: 0.7
        });
        opts._wrap.animate({
            display: "block",
            visibility: "visible",
            height: opts.height,
            bottom: 0
        }, 200, 'ease',callback);
    };
    Tel.prototype.isSpecialActId = function(){
        var self  = this;
        if(self.specialActId){
           return self.idIsSpecial;
        }
        var actId = $("#activityid").val(),
            periodId = $("#periodId").val();
        if(actId === "1026" && periodId === "1128"||
            actId === "1045" && periodId === "1121"
        ){
            self.idIsSpecial = true;
        }
        return self.idIsSpecial;
    };
    Tel.prototype.isGloryActId = function(){
        var self  = this;
        if(self.specialActId){
           return self.idIsSpecial;
        }
        var actId = $("#activityid").val();
        if(actId === "1355"
        ){
            self.idIsGlory = true;
        }
        return self.idIsGlory;
    };

    Tel.prototype.close = function() {
        var self = this._options,
            status = this.checkstatus();
        if (status === 1) {
            self._mask.fadeOut("400");
            self._wrap.animate({
                display: "block",
                visibility: "hidden",
                height: self.height,
                bottom: "-260px"
            }, 200, 'ease');
            this.bottomEvent(status);
        }
    };
    Tel.prototype.checkstatus = function() {
        //var _opts = this._options;
        var mask = $(".ui-share-bg")[0],
            wrap = $(".ui-share")[0];
        if (!mask && !wrap) {
            //不存在
            return -1;
        } else if ($(mask).css("display") === "none" && $(wrap).css("visibility") === "hidden") {
            //存在但是都被隐藏
            return 0;
        } else if ($(mask).css("display") === "block" && $(wrap).css("visibility") === "visible") {
            return 1;
        }
    };
    Tel.prototype.bottomEvent = function(ex) {
        var elem = $(".ctrl-box-wrap");
        if (elem[0]) {
            if (elem.css("display") === "block" && (ex === -1 || ex === 0)) {
                elem.css("display", "none");
            } else {
                elem.css("display", "block");
            }
        }
    };
    Tel.prototype.initEvent = function() {
        var me = this;
        $(document).on("click", ".share-open-con li", function() {
            var self = $(this);
            // console.log(self.index())
            if (self.hasClass("share-collect")) {
                //跳转
                window.location.href = "tel:" + me._options.telnum;
            }
            //else {
            //    window.location.href = me._options.url + "&memberid=" +
            //        me._options.memberid;
            //}
        });
        //取消的事件
        $(".close-btn").on("click", function() {

            me.close();
        });

    };

    function telLogInit() {
        //初始化会员ID
        var auserid = /userid=([^&$]*)/.exec(!$.cookie("cnUser") ? "userid=0" : $.cookie("cnUser"));
        if(auserid){
            return auserid[1];
        }else{
            return null;
        }
    }
    module.exports = Tel;
})(Zepto);

