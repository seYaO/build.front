define("jquery/comment/0.2.0/index",["jquery/tmpl/pc/comment/commetLi","jquery/tmpl/pc/comment/commetBody",
    "jquery/pager/0.2.1/index","jquery/jCarousel/0.1.0/index","jquery/comment/0.2.0/comment.css"
],function(require){
    var Comment = function(){
    };
    Comment.prototype = {
        host: window.host||"",
        url: "/dujia/AjaxHelper/ToursHandler.ashx?action=GETCOMMENTINFO",
        usefulUrl: "/dujia/globalscenery/AjaxForGlobalScenery.ashx?action=addVote",
        param: {
            lineId: 200442,
            pageSize: 5,
            pageIndex: 1
        },
        topPageIndex: 0,
        getData: function(cfg){
            var self = this,
                isInit = cfg.isInit,
                extraUrl = cfg.extraUrl,
                param = cfg.param,
                url = self.host+self.url;
            if(isInit){
                url += "&isShowTotal=1";
            }
            if(extraUrl){
                url+="&"+extraUrl;
            }
            var _param = $.extend({},self.param,param);

            $.ajax({
                url: url,
                data: _param,
                dataType: "jsonp",
                success: function(data){
                    if(cfg.render){
                        cfg.render.call(self,data)
                    }else{
                        self.render(data,!!extraUrl);
                    }
                },
                error: function(){
                    self.render();
                }
            });
        },
        renderPager: function(cfg){
            var self = this,
                total = cfg.total,
                extraUrl = cfg.extraUrl? "&"+cfg.extraUrl:"",
                url = self.host+self.url,
                param = $.extend({},self.param),
                totalPage = Math.ceil(total/(param.pageSize||5));
            if(totalPage > 1){
                require("pager/0.2.1/index");
                delete(param.pageIndex);
                $('#J_CometPager').page({
                    current: 1,
                    total: totalPage,
                    needFirstAndLast: true,
                    pageNoParam: "pageIndex",
                    ajaxObj:{
                        url: url+extraUrl,
                        data: param,
                        dataType: "jsonp",
                        success: function(data){
                            self.render(data);
                        }
                    },
                    initLoad: false
                });
            }else{
                $("#J_CometPager").empty();
            }
        },
        renderHeaderAndPager: function(headData){
            var self = this,
                headTmpl = require("tmpl/pc/comment/commetBody"),
                el = self.el;
            headData.isFreeTour = self.isFreeTour;
            $(el).append(headTmpl(headData));
            //绑定头部的相关组件
            $("#J_CometTab").find("span").on("click",function(e){
                var me = $(this),
                    count = /\d+/.exec(me.text());
                if(me.find("input").length > 0){
                    $("#comet_tab_checkbox").prop("checked",true);
                }else{
                    $("#comet_tab_checkbox").prop("checked",false);
                }
                var param = $.extend({},self.param),
                    paramStr = me.attr("data-param");
                delete(param.typeId);
                if(param.isImage){
                    delete(param.isImage);
                }
                self.getData({
                    extraUrl: paramStr,
                    param: param,
                    render: function(data){
                        self.render(data);
                        self.renderPager({
                            total: count && count[0],
                            extraUrl: paramStr
                        });
                    }
                });
            });
            $("#J_CometTab").find("input").on("click",function(e){
                var isChecked = $(this).prop("checked");
                if(!isChecked){
                    e.preventDefault();
                }
            });

            $("#filter-sort").find("a").on("click",function(){
                $("[name='commfil']").prop("checked",false);
                $("#radio1").prop("checked",true);
                var _this = $(this),
                    param = $.extend({},self.param),
                    paramStr = _this.attr("data-param");
                delete(param.typeId);
                self.getData({
                    extraUrl: paramStr,
                    param: param,
                    render: function(data){
                        self.render(data);
                        self.renderPager({
                            total: data.CommentSummary.TotalCount,
                            extraUrl: paramStr
                        });
                    }
                });


            });


            $(document).on("click",".comm-content .comet_useful",function(e){
                var el = $($(e.target).parents(".comm-useful")).find(".comet_useful");
                if(el.hasClass("disables")) return;
                var commentId = el.attr("data-cometid"),
                    url = self.usefulUrl+"&commentId=" + commentId,
                    bEl = el.find("b"),
                    bText = bEl.text()-0;
                $.ajax({
                    url: url,
                    dataType: "text",
                    success: function (data) {
                        if (data === "success") {
                            bEl.text(bText + 1);
                            bEl.parent().addClass("disables");
                        } else {
                            //alert("一个用户只能评价一次!");
                            bEl.parent().addClass("disables");
                        }
                    }
                })

            });
            var totalItem = headData.TotalCount;
            //渲染分页
            self.renderPager({total: totalItem});
        },
        render: function(data,noScrollTop){
            if(!data||data.CommentSummary.length === 0){
                $(this.el).append('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
                $(this.el).parent().removeClass("data-outer-loading");
                $(".data-loading").remove();
                return;
            }
            if ($(".comment-moudle").length < 1) {
                var headData = data.CommentSummary;
                if (headData) {
                    //headData.RecommendPercent = $(".J_ManYiDu").text();
                    this.renderHeaderAndPager(headData);
                }
            }

            var bodyTmpl = require("tmpl/pc/comment/commetLi");
            $(".comm-content ul").empty().append(bodyTmpl(data.CommentList));
            this.showBigImg();
            this.foldAndUnfold();

            //如果是分页触发,则没有head的数据,则使用滚动定位
            if(!headData&& !noScrollTop){
                if (this && this.parent) {
                    var elTop = $(this.parent).offset().top;
                    window.scrollTo(0, elTop);
                }
            }
            //var sliderEl = $(".J_SliderActive .J_CometSlide");
            //if(sliderEl.length){
            //    sliderEl.carousel({
            //        btnPrev: ".slider_pre",
            //        btnNext: ".slider_next",
            //        canvas: ".slide_ul",
            //        item: "li",
            //        visible: 4
            //    });
            //}
            if(this.callback){
                this.callback.call(this);
            }
        },
        initTop: function(cfg){
            var self = this;
            if(cfg){
                $.extend(self,cfg);
            }
            self.index = 0;
            self.renderTop(cfg.data,self.index);
        },
        next: function(){
            this.renderTop(false,++this.index);
        },
        prev: function(){
            this.renderTop(false,--this.index);
        },
        dealTopComment: function(data,newData){
            if(!data){
                data = {
                    DpContent: []
                };
            }
            var bodyData = newData.CommentList,
                tempData = data.DpContent,
                feedBack;
            for(var i = 0, len = bodyData.length -1; i<=len; i++){
                feedBack = bodyData[i].FeedBack;
                if(feedBack.length > 123){
                    feedBack = feedBack.substr(0,120)+"...";
                }
                tempData.push(feedBack);
            }
            data.DpTotalCount = newData.CommentSummary.GoodNum;
            return data;
        },
        renderNoResult: function(){
            var el = $(this.el);
            el.empty().append('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
        },
        renderTop: function(data,index){
            var self = this;
            if(data){
                self.data = data;
            }
            //如果data 为null或者undefined,则表示接口异常
            if(data == null){
                self.getData({
                    render: function(asyncData){
                        self.topPageIndex++;
                        var _data = self.dealTopComment(data,asyncData);
                        self.renderTop(_data,index);
                    },
                    param:{
                        pageIndex: self.topPageIndex
                    }
                });
                return;
            }
            if( data &&
                (   (data && data.CommentList.length === 0)||
                    (data.DpTotalCount === 0)
                )
            ){
                self.renderNoResult();
                return;
            }
            //如果data为false,则为点击上一条/下一条
            var localData = data||this.data;
            self.callback && self.callback.call(self,localData,index);
        },
        init: function(cfg){
            var self = this;
            self = $.extend(true,self,cfg);
            self.getData({
                isInit: true
            });
        },

        //显示大图
        showBigImg : function () {
            var self = this;
            $(".comm-img img").on("mouseover", function () {
                if($("#imgShow").length === 0){
                    $("body").append("<div class='comm_cut none' id='imgShow'><div class='comm_mian'></div></div>");
                }
                var L = $(this),
                    H = L.height(),
                    offtop = L.offset().top + (H ? H : 0),
                    imgurl = L.attr("src"),
                    offleft = L.offset().left;
                if($(document).scrollTop() + $(window).height() - offtop < 280){
                    offtop = L.offset().top - 280;
                }
                $("#imgShow .comm_mian").html('<img src="' + imgurl + '" />');
                $("#imgShow").css({ "top": offtop + "px", "left": offleft + "px" });
                $("#imgShow").removeClass("none");

            }).on("mouseout", function () {
                $("#imgShow").addClass("none");
            });


        },

        //收起和展开
        foldAndUnfold: function(){
            $(".J_tan").on("click",function(){
                var _self = $(this),
                    _parent = _self.parent();
                if(_self.hasClass("shou")){
                    var allContent = _parent.attr("data-shou");
                    _self.removeClass("shou").addClass("zhan");
                    _self.html("展开全部<i></i>");
                    _parent.css("padding-bottom","0");
                    _parent.find("span").html(allContent);
                } else {
                    var subContent = _parent.attr("data-zhan");
                    _self.removeClass("zhan").addClass("shou");
                    _self.html("收起<i></i>");
                    _parent.css("padding-bottom","20px");
                    _parent.find("span").html(subContent);
                }
            });
        }
    };
    return Comment;
});
