/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module 订单列表
 * @exports
 * @desc
 */

/* global Config */
var plat_value="0";

(function($){
    var Index = {},
        Common = require("../common/common"),
        tmplList = __inline("./views/orderlist.dot");
    var Config = require("../common/config");

    // 状态信息
    Index.defaultCfg = {
        PageIndex: 1,
        PageSize: 10
    };
    Index.status = {
        isLoading:false,
        isLoadAll:false,
        timer: null  // 条件筛选延时加载
    };
    Index.init = function(cfg){
        Index._cfg = $.extend({}, Index.defaultCfg, cfg);
        Index.initEvent();
        // Index.judgeListEmpty();
        // Index.judgeListLoadAll();
        Common.init("crmorderlist");
        // var share = require("utils/share/index");
        // share.disable();
    };

    // var remote = "http://10.1.56.29:8087/dujia/AjaxHelper/GetOrderInfoListForCRM?JobNumber=12870&QueryContent=张晶&QueryType=0";

    Index.initEvent = function(){
        $(window).on("scroll.loadData",function(e){
            // console.log('loadData')
            // if(Index.status.isLoadAll) return;
            if (Index.status.isLoadAll === true) {
                $(".J_allover").show();
                setTimeout(function () {
                    $(".J_allover").hide();
                }, 1000);
                return;
            }
            if($(window).scrollTop() + $(window).height() >= ($(document).height()-5)){
                if(!Index.status.isLoading){
                    Index.addMore();
                }
            }
            e.stopPropagation();
        }).trigger('scroll');

        //下拉框
        $(".js-switch").on("click",function(){
            $(".type-list").hide();
            $(this).parent().find(".type-list").show();
        });

        /*  筛选订单类型  */
        var $typeList = $('.search #type-list');
        var $ptList = $('.search #pt-list');
        var $typeSelected = $('#type-selected');
        var $ptSelected = $('#pt-selected');

        $typeList.on('click', function () {
            $typeList.hide();
        });
        $ptList.on('click', function () {
            $ptList.hide();
        });

        $typeList.on('click', 'li', function (e) {
            var self = $(this),
                type = self.data('type'),
                type_txt = self.text(),
                type_value = self.data('value'),
                types = self.parent().find('li');

            if (type === $typeSelected.data('type')) {
                $typeList.hide();
                return;
            }

            types.removeClass('selected');
            self.addClass('selected');


            $typeSelected.data('type', type);
            $typeSelected.data('value', type_value);
            $typeSelected.text(type_txt);
            $typeList.hide();

            Index._cfg.QueryType = type_value;
            Index._cfg.PageIndex = 1;
            $('.J_pro-list').empty();
            Index.addMore();
        });
        //全部平台筛选
        $ptList.on('click', 'li', function (e) {
            var self = $(this),
                type = self.data('type'),
                plat_txt = self.text(),
                plats = self.parent().find('li');
            plat_value = self.data('value');


            if (type === $ptSelected.data('type')) {
                $ptList.hide();
                return;
            }

            plats.removeClass('selected');
            self.addClass('selected');


            $ptSelected.data('type', type);
            $ptSelected.data('value', plat_value);
            $ptSelected.text(plat_txt);
            $ptList.hide();

            //Index._cfg.Platment = plat_value;
            Index._cfg.PageIndex = 1;
            $('.J_pro-list').empty();
            Index.addMore();
        });


        $('.search #type-selected').on('click', function (e) {
            $typeList.show();
        });
        $('.search #pt-selected').on('click', function (e) {
            $ptList.show();
        });

        /*  手机号及人名筛选  */
        $('#filter-input').on('change', function (e) {
            var self = $(this);

            if (!!Index.status.timer) {
                Index.status.timer = clearTimeout(Index.status.timer);
            }

            Index.status.timer = setTimeout(function () {
                var filterV = $.trim(self.val());

                Index._cfg.QueryContent = filterV;
                Index._cfg.PageIndex = 1;
                $('.J_pro-list').empty();
                Index.addMore();
            }, 1000);
        });
    };


    /**
     * @private
     * @func addMore
     * @desc 加载数据，滚动添加更多订单
     */
    Index.addMore = function(){

        Index.status.isLoading = true;
        $(".J_loading").show();

        // var url = Config.getInterface("orderList")+"PageIndex="+Index._cfg.PageIndex+"&PageSize="+Index._cfg.PageSize;

        //添加Platment参数，获得平台来源
        var url = Index.getUrl() + "&Platment=" + plat_value;
        //console.log(url);

        Index._cfg.PageIndex++;
        Common.getData(url,function(data){

            data = data.Data;

            if (data === null && Index.status.isLoadAll === false && $(".pro-info").length === 0) {
                $('.J_empty-tip').show();
                $(".J_loading").hide();
                Index.status.isLoading = false;
                return;
            }

            if (data === null) {
                Index.status.isLoading = false;
                Index.status.isLoadAll = true;
                $(".J_loading").hide();
                $(".J_allover").show();
                setTimeout(function () {
                    $(".J_allover").hide();
                }, 1000);
                return;
            }

            data.Platment = plat_value;
            Common.render({
                key:"orderlist",
                data: data,
                context: ".pro-list",
                tmpl:tmplList,
                overwrite:false,
                callback: function(){
                    $(".J_loading").hide();
                    Index.status.isLoading = false;
                    $('.J_empty-tip').hide();
                }
            })
            if(data.TotalCount < Index._cfg.PageSize){
                Index.status.isLoadAll = true;
            }
        }, true);
    }

    /**
     * 接口参数配置
     **/
    Index.getUrl = function () {
        var url = Config.getInterface("orderlist");
        var params = "";
        var param = Index._cfg;
        for(var prop in param) {
            params += '&' + prop + '=' + param[prop];
        }
        params = params.slice(1);

        return url + params;
    };
    /**
     * @private
     * @func judgeListEmpty
     * @desc 判断列表页是否为空
     */
    Index.judgeListEmpty =function(){
        if($(".J_pro-list .pro-info").length <= 0){
            $(".J_empty-tip").show();
        }
    }

    /**
     * @private
     * @func judgeListLoadAll
     * @desc 判断列表页是否加载完成
     */
    Index.judgeListLoadAll =function(){
        if($(".pro-list .pro-info").length < 10){
            Index.status.isLoadAll = true;
        }
    }
    module.exports = Index;
})(Zepto)

