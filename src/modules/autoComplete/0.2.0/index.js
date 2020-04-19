/**
 * @author 刘聪(lc07631@ly.com)
 * @func AutoComplete
 * @desc 模糊匹配组件,支持jquery版本
 * @version  0.2.0
 * 0.2.0比0.1.1新增兼容多个搜索框
 *
 * @example usage
 * autoComplete.init({
                showLabel: false,  true表示显示用于区分标签页的3个Tab,默认true
                checkFlag: true,   true表示不用与默认值attrvalue比较，就算相等也是可以跳转的
                searchContent: $(".J_txtScenicValue"),   输入input框  默认是这个
                matchContent: $(".J_matchContent"),    模糊匹配的容器，默认是这个
                matchUrl: $("#matchDest").val()    去匹配数据的异步地址
                pageLabel: "/lineWanle/homepage"   匹配页面
            });
 * @pageLabel说明：
 * /lineWanle/homepage		玩乐首页
 * /lineWanle/menpiao/homepage		门票首页
 * /lineWanle/menpiao/list		海外门票列表页
 * /lineWanle/dangdi/list		当地玩乐列表页
 * /lineWanle/wifi/list		通讯wifi列表页
 * /lineWanle/list		搜索列表页


 */
define("autoComplete/0.2.0/index",["tmpl/pc/autoComplete/0.2.0/index"
],function(require){
    var AutoComplete = function(){
    };
    AutoComplete.prototype = {
        pageIndex: 0,
        dataTotal: 0,
        search : function(){
            var self = this,
                searchBox = self.searchContent,
                matchContent = self.matchContent,
                defaultVal =  searchBox.attr("attrvalue") || "",
                currentElem,
                operateElem;
            searchBox.siblings("a").on("click",function(){
                self.goSearch(0,$(this).siblings("input"));
            });

            searchBox.on("focus",function(){
                var _this = $(this);
                if(_this.val() === defaultVal){
                    _this.val("");
                    _this.css("color","#333");
                }
            });

            String.prototype.trim = function()
            {
                return this.replace(/(^\s*)|(\s*$)/g, "");
            };

            searchBox.on("blur",function(){
                var _this = $(this);
                if(_this.val().trim().length === 0){
                    _this.val(defaultVal);
                    _this.css("color","#999");
                }
                setTimeout(function(){
                    if(!elemTouch){
                        _this.siblings("ul").addClass("none");
                        elemTouch = false;
                    }
                }, 100);
            });

            searchBox.on("keyup",function(e){
                var matchChildContent = matchContent.children(),
                    _this = $(e.target);
                matchContent = _this.siblings("ul");
                currentElem = matchContent.find(".current");

                if(e.keyCode === 13){
                    self.goSearch(0,_this);
                }else if(e.keyCode === 38 && (!matchContent.hasClass("none"))){
                    operateElem = currentElem.prev();
                    if(!operateElem.length){
                        operateElem = matchChildContent.last();
                    }
                    self.selectedLi(operateElem);
                }else if(e.keyCode === 40 && (!matchContent.hasClass("none"))){
                    operateElem = currentElem.next();
                    if(!operateElem.length){
                        operateElem = matchChildContent.first();
                    }
                    self.selectedLi(operateElem);
                }
                if(e.keyCode !== 13 && e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 17){
                    AutoComplete.lastTime = +new Date();
                    AutoComplete.serBox = searchBox.val().trim();
                    setTimeout(function(){
                        var nowTime = +new Date();
                        if(!(AutoComplete.lastTime) || nowTime - AutoComplete.lastTime > 450){
                            matchContent.removeClass("jump-label");
                            matchContent.removeClass("spe-jump");
                            matchContent.attr("data-url","");
                            self.getMatchDate(_this.val(),_this);

                        }
                    },500);

                }
            });


            searchBox.on("mousedown", function(){
                elemTouch = true;
            });
            searchBox.on("mouseup", function(){
                elemTouch = false;
            });
        },

        //@param 为了区分不同地方加不同的埋点
        goSearch: function(param,elem){
            var self = this,
                searchBox = self.searchContent,
                matchContent,
                searchVal,
                defaultVal =  searchBox.attr("attrvalue") || "";
            searchVal = elem ? elem.val():searchBox.val();
            matchContent = elem ? elem.siblings("ul"):self.matchContent;
            if (/[\@\#\$%\^&\*\;\'\<\>\"]+/g.test(searchVal) && !matchContent.attr("data-url").length) return;

            if (searchVal.indexOf(':')>-1) {
                window.location.href="http://www.ly.com/404.aspx";
                return false;
            };

            var checkFlag,
                vaildate;
            checkFlag= self.checkFlag === true ? true:false;
            vaildate = checkFlag === true ? true : searchVal !== defaultVal;
            if(searchVal.trim() !== "" && vaildate && (matchContent.hasClass("jump-label") || matchContent.hasClass("spe-jump"))){
                if(param != 1){
                    _tcTraObj._tcTrackEvent('search', ''+self.pageLabel+'', '/sbox/k', '|*|k:'+searchVal.trim()+'|*|rc:'+AutoComplete.dataTotal+'|*|');
                }
                window.open(matchContent.attr("data-url"));
            } else if(searchVal.trim() !== "" && vaildate){
                if(param != 1){
                    _tcTraObj._tcTrackEvent('search', ''+self.pageLabel+'', '/sbox/k', '|*|k:'+searchVal.trim()+'|*|rc:'+AutoComplete.dataTotal+'|*|');
                }
                window.open("/dujia/wanle/searchlist_" + encodeURIComponent(searchVal) +".html");
            }
        },

        getMatchDate: function(dest,params){
            var self = this,
                //conInclude = self.matchContent,
                conInclude = params.siblings("ul"),
                matchUrl = this.matchUrl || "/wanle/AjaxHelperWanle/GetSearchSelectData?NeedCount=10&ChannelId=1";
            $.ajax({
                url: matchUrl + "&Content="+encodeURIComponent(dest),
                dataType: "jsonp",
                success: function(data){
                    if(data.TotalCount === 0){
                        conInclude.addClass("none");
                        _tcTraObj._tcTrackEvent('search', ''+self.pageLabel+'', '/sbox/ac', '|*|k:'+dest+'|*|rc:0|*|');
                        return;
                    }
                    AutoComplete.dataTotal = data.TotalCount;
                    data.search = dest;
                    data.showLabel = self.showLabel || true;
                    data.pageLabel = self.pageLabel;
                    var listTmpl = require("tmpl/pc/autoComplete/0.2.0/index");
                    conInclude.html(listTmpl(data));
                    //params.siblings("ul").html(listTmpl(data));
                    if(!data.Result.length){
                        conInclude.addClass("none");
                        return;
                    }

                    conInclude.removeClass("none");
                    self.afterMatch(self);

                },
                error: function(){
                    conInclude.addClass("none");
                    conInclude.html("");
                }
            });
        },

        afterMatch: function(param){
            var self = param,
                elem = self.matchContent.children();
            elem.mouseover(function(){
                self.selectedLi($(this));

            });

            elem.on("click",function(){
                self.goSearch(1);
                $("J_matchContent").addClass("none");
                //self.matchContent.addClass("none");
            });
            elem.on("mousedown", function(){
                elemTouch = true;
            });
            elem.on("mouseup", function(){
                elemTouch = false;
            });


        },

        selectedLi: function(self){
            var _this = this,
                elem = _this.matchContent.children(),
                //searchBox = this.searchContent,
                searchBox = self.parent().siblings("input"),
                elemParent = self.parent();
            searchBox.val(self.text());
            elem.removeClass("current");
            self.addClass("current");
            searchBox.css("color","#333");
            if(self.hasClass("jump-label")){
                elemParent.removeClass("spe-jump");
                elemParent.addClass("jump-label");
                elemParent.attr("data-url",self.attr("data-url"));
            } else if(self.hasClass("spe-jump")){
                elemParent.removeClass("jump-label");
                elemParent.addClass("spe-jump");
                elemParent.attr("data-url",self.attr("data-url"));
            } else {
                elemParent.removeClass("jump-label");
                elemParent.removeClass("spe-jump");
                elemParent.attr("data-url","");
            }
        },

        init: function(cfg){
            var self = this;
            if(cfg.searchContent == ""){
                cfg.searchContent = $("J_txtScenicValue");
            }
            if(cfg.matchContent == ""){
                cfg.matchContent =  $("J_matchContent");
            }
            self = $.extend(true,self,cfg);
            self.search();
        }
    };
    return AutoComplete;
});
