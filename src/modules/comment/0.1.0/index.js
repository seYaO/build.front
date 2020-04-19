define("comment/0.1.0/index",["pager/0.3.0/index","tmpl/pc/newdetails/commetLi","tmpl/pc/newdetails/commet","jCarousel/0.1.0/index","comment/0.1.0/index.css"],function(require){
    var Comment = function(){
    };
    Comment.prototype = {
        host: window.host||"",
        url: "/intervacation/api/Comment/GetCommentList?projectTag=chujing&dpSite=2",
        usefulUrl: "/dujia/globalscenery/AjaxForGlobalScenery.ashx?action=addVote",
        param: {
            productId: 200442,
            pageSize: 5,
            page: 1
        },
        topPageIndex: 1,
        getData: function(cfg){
            var self = this,
                isInit = cfg.isInit,
                extraUrl = cfg.extraUrl,
                param = cfg.param,
                url = self.url;
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
                dataType: "json",
                success: function(data){
                    if(data && data.Data && data.Data.CommentList){
                        if(cfg.render){
                            cfg.render.call(self,data.Data.CommentList);
                        }else{
                            self.render(data.Data.CommentList,!!extraUrl);
                        }
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
                url = self.url,
                param = $.extend({},self.param),
                totalPage = Math.ceil(total/(param.pageSize||5));
            if(totalPage > 1){
                require("pager/0.3.0/index");
                delete(param.page);
                $('#J_CometPager').page({
                    current: 1,
                    total: totalPage,
                    needFirstAndLast: true,
                    pageNoParam: "pageIndex",
                    ajaxObj:{
                        url: url+extraUrl,
                        data: param,
                        dataType: "json",
                        success: function(data){
                            self.render(data.Data.CommentList);
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
                headTmpl = require("tmpl/pc/newdetails/commet"),
                el = self.el;
            headData.isFreeTour = self.isFreeTour;
            $(el).append(headTmpl(headData));
            //绑定头部的相关组件
            $("#J_CometTab").find("a").on("click",function(e){
                var me = $(this),
                    isCurrent = me.hasClass("current"),
                    count = /\d+/.exec(me.text());
                if(isCurrent){
                    return;
                }
                me.addClass("current");
                me.siblings().removeClass("current");
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

            $(document).on("click","#cometList .comet_useful",function(){
                var el = $(this);
                if(el.hasClass("disable")) return;
                var commentId = el.attr("data-cometid"),
                    url = self.usefulUrl+"&commentId=" + commentId,
                    bEl = el.find("b"),
                    bText = bEl.text()-0;
                $.ajax({
                    url: url,
                    dataType: "text",
                    success:function(data){
                        if(data === "success"){
                            bEl.text(bText+1);
                            bEl.parent().addClass("disable");
                        }else{
                            //alert("一个用户只能评价一次!");
                            bEl.parent().addClass("disable");
                        }
                    }
                })

            });
            var totalItem = headData.TotalDpNum;
            //渲染分页
            self.renderPager({total: totalItem});
        },
        render: function(data,noScrollTop){
            if(!data|| !(data.List && data.List.length)){
                $(this.el).append('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
                $(this.el).parent().removeClass("data-outer-loading");
                $(".data-loading").remove();
                return;
            }
            var headData = data.List[0];
            if(headData){
                headData.RecommendPercent = $(".J_ManYiDu").text();
                this.renderHeaderAndPager(headData);
            }
            var bodyTmpl = require("tmpl/pc/newdetails/commetLi");
            $("#cometList").empty().append(bodyTmpl(data.List));
            //如果是分页触发,则没有head的数据,则使用滚动定位
            if(!headData&& !noScrollTop){
                var elTop = $(this.parent).offset().top;
                window.scrollTo(0,elTop);
            }
            var sliderEl = $(".J_SliderActive .J_CometSlide");
            if(sliderEl.length){
                sliderEl.carousel({
                    btnPrev: ".slider_pre",
                    btnNext: ".slider_next",
                    canvas: ".slide_ul",
                    item: "li",
                    visible: 4
                });
            }
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
                    List: []
                };
            }
            var countData = newData.Count,
                bodyData = newData.List,
                tempData = data.List,
                feedBack;
            if (bodyData && bodyData.length) {
                for (var i = 0, len = bodyData.length - 1; i <= len; i++) {
                    feedBack = bodyData[i].Comment;
                    if (feedBack.length > 110) {
                        feedBack = feedBack.substr(0, 110) + "...";
                    }
                    tempData.push(feedBack);
                }
            }
            if(countData && countData.length){
                data.Satisfaction = countData[0].Satisfaction;
            }
            data.Count = newData.Count[0].All;
            return data;
        },
        renderNoResult: function(){
            var el = $(this.el);
            el.empty().append('<p class="no-remark">同程旅游，快乐每一程，快来发表点评，与万千驴友分享您的精彩之旅吧！</p>');
        },
        renderTop: function(data,index,callback){
            var self = this;
            if(data){
                self.data = data;
            }
            //如果data 为null或者undefined,则表示接口异常
            if(data == null){
                self.getData({
                    render: function(asyncData){
                        callback && callback.call(self);
                        self.topPageIndex++;
                        var _data = self.dealTopComment(self.data,asyncData);
                        self.renderTop(_data,index);
                    },
                    param:{
                        page: self.topPageIndex
                    }
                });
                return;
            }
            if(data && ((data && !(data.List && data.List.length)) || (data.DpTotalCount === 0))){
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
        }
    };
    return Comment;
});
