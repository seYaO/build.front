/**
 * Created by lc07631 on 2015/7/9.
 * 点评公共部分（包括自由行，跟团新老版，国际景区详情页，单产品详情页）
 */
define("commentdetail", ["tmpl/pc/sinProduct/commetLi"], function (require, exports, module) {
    //require("scrollSpy011");
    var comListTmpl = require("tmpl/pc/sinProduct/commetLi");
    var Comments = {
        init: function () {

            //评论模块初始化
            //Comments.sinComet.init();
            Comments.showBigImg();
            Comments.foldAndUnfold();
        },

        //显示大图
        showBigImg : function () {
            $(".comm-img img").on("mouseover", function () {
                if($("#imgShow").length === 0){
                    $("body").append("<div class='comm_cut none' id='imgShow'><div class='comm_mian'></div></div>");
                }
                var L = $(this),
                    H = L.height(),
                    offtop = L.offset().top + (H ? H : 0),
                    imgurl = Comments.setImageSize(L.attr("src"),"640x360"),
                    offleft = L.offset().left;
                $("#imgShow .comm_mian").html('<img src="' + imgurl + '" />');
                $("#imgShow").css({ "top": offtop, "left": offleft });
                $("#imgShow").removeClass("none");

            }).on("mouseout", function () {
                $("#imgShow").addClass("none");
            });


        },

        setImageSize: function (url, size) {
            if (!url) {
                return null;
            }
            var defaultSize = "_600x300_00";
            var reg = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]/;
            var regSize = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]$/;
            if (reg.test(url) && regSize.test(size)) {
                return url.replace(reg, size);
            }

            if (reg.test(url)) {
                return url;
            }

            if (url.indexOf("upload.17u.com") > -1) {
                return url;
            } else if (!reg.test(url)) {
                return url.replace(/\.\w+$/,function($0){
                    return (size || defaultSize)+$0;
                });
            }
        },

        //收起和展开
        foldAndUnfold: function(){
            $(".J_tan").on("click",function(){
                var _self = $(this),
                    _parent = _self.parent();
                if(_self.hasClass("shou")){
                    var allContent = _parent.attr("data-zhan");
                    _self.removeClass("shou").addClass("zhan");
                    _self.html("展开全部<i></i>");
                    _parent.css("padding-bottom","20px");
                    _parent.children("span").html(allContent);
                } else {
                    var subContent = _parent.attr("data-shou");
                    _self.removeClass("zhan").addClass("shou");
                    _self.html("收起<i></i>");
                    _parent.css("padding-bottom","0px");
                    _parent.children("span").html(subContent);
                }
            });
        },

        //点评翻页
        sinComet:{
            typeCate: "0",//评价分类
            //sortCate: "0",//排序分类
            //tagCate: "0",//标签分类
            //isImg: "0", //是否显示图片
            //评论主干创建
            creatBones: function () {
                fish.one("#J_cometList").html("<div class='ly_loading'><span>请稍候,用户点评正在加载中...</span></div>");
            },
            //评论项创建
            creatComList: function (data) {
                fish.one("#J_cometList").html(comListTmpl(data));
            },
            paging:function(){
                fish.one("#J_cometList").html("<div class='ly_loading'><span>请稍候,用户点评正在加载中...</span></div>");
                var cData = "&isSingle=1&dpType=" + this.typeCate;
                var cLine = fish.one("#resourceId").val();
                fish.require("mPage", function() {
                    fish.one("#J_cometPage").mPage({
                        //
                        url: "/dujia/AjaxHelper/SingleProductHandler.ashx?action=GETDPLIST&resourceId="+ cLine + cData,
                        ajaxType: "jsonp",
                        args: {
                            pageNO: "index"
                        },
                        callback: function (data, num) {
                            if (data) {//有数据
                                var totalPage = fish.one("#J_cometType .on_bg").attr("data-value");
                                var _pagenum = Math.ceil(totalPage/5);
                                this.build(_pagenum);
                                Comments.sinComet.creatComList(data);
                                //IE8渲染触发
                                var paging = fish.one("#J_cometPage").children(".bag_page");
                                if(paging.length !==0){
                                    fish.one("#J_cometPage").css("display:block");
                                }
                            }
                            if (!data) {//无数据
                                fish.one("#J_cometList").html("<p class='no_comet'>暂时还没有用户评论噢</p>");
                                fish.one("#J_cometPage").html(" ");
                            }
                        }
                    });
                });
            },
            //评论切换初始
            eventsInit: function () {
                var FsortCate = fish.one("#J_cometType span");
                FsortCate.addClass("on_bg");
                this.typeCate = FsortCate.attr("comtid");
                //
                this.paging();
            },
            eventsBind: function () {
                //排序切换
                fish.all("#J_cometType span").on("click", function () {
                    Comments.sinComet.typeCate = fish.one(this).attr("comtid");
                    fish.one(this).addClass("on_bg").sibling(true).removeClass("on_bg");
                    Comments.sinComet.paging();
                });
            },
            init: function () {
                this.creatBones();
                this.eventsInit();
                this.eventsBind();
            }

        }

    };

    module.exports = Comments;
});
