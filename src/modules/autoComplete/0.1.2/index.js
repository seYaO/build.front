/**
 * @author 刘聪(lc07631@ly.com)
 * @func AutoComplete
 * @desc 模糊匹配组件,支持jquery版本
 * @version  0.1.1
 * 0.1.1比0.1.0新增埋点
 *
 * @example usage
 * autoComplete.init({
                showLabel: false,  true表示显示用于区分标签页的3个Tab,默认true
                checkFlag: true,   true表示不用与默认值attrvalue比较，就算相等也是可以跳转的
                searchContent: $("#txtScenicValue"),   输入input框  默认是这个
                matchContent: $("#matchContent"),    模糊匹配的容器，默认是这个
                matchUrl: $("#matchDest").val()    去匹配数据的异步地址
                pageLabel: "/lineWanle/homepage"   匹配页面
                HotSearch: $(".HotSearch"),       热搜词
                searchLabel: $(".searchLabel")   热门标签
            });
 * @pageLabel说明：
 * /lineWanle/homepage		玩乐首页
 * /lineWanle/menpiao/homepage		门票首页
 * /lineWanle/menpiao/list		海外门票列表页
 * /lineWanle/dangdi/list		当地玩乐列表页
 * /lineWanle/wifi/list		通讯wifi列表页
 * /lineWanle/list		搜索列表页


 */
define("autoComplete/0.1.2/index",["../index.dot"]["../hotsearch.dot"],function(require){
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
                operateElem,
                hotSearch = $(".HotSearch"),
                searchLabel = $(".searchLabel");
            searchBox.siblings("a").on("click",function(){
                self.goSearch();
            });

            searchBox.on("focus",function(){
                if(searchBox.val() === defaultVal){
                    searchBox.val("");
                    searchBox.css("color","#333");                    
                    hotSearch.removeClass("none");
                    self.SecrchHistory();
                    searchLabel.addClass("none");
                }
            });

            String.prototype.trim = function()
            {
                return this.replace(/(^\s*)|(\s*$)/g, "");
            };

            searchBox.on("blur",function(){
                if(searchBox.val().trim().length === 0){
                    searchBox.val(defaultVal);
                    searchBox.css("color","#999");
                    searchLabel.removeClass("none");
                }
                setTimeout(function(){
                    if(!elemTouch){
                        matchContent.addClass("none");                        
                        elemTouch = false;
                    }
                }, 100);
            });

            searchBox.on("keyup",function(e){
                var matchChildContent = matchContent.children();
                currentElem = matchContent.find(".current");
                if(e.keyCode === 13){
                    self.goSearch();
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

                    if(searchBox.val().trim().length === 0){
                       
                        setTimeout(function(){
                            matchContent.addClass("none");
                            hotSearch.removeClass("none");
                            self.SecrchHistory();
                        },500)
                        
                    } else {
                        AutoComplete.lastTime = +new Date();
                        AutoComplete.serBox = searchBox.val().trim();
                        setTimeout(function(){
                            var nowTime = +new Date();
                            if(!(AutoComplete.lastTime) || nowTime - AutoComplete.lastTime > 450){
                                matchContent.removeClass("jump-label");
                                matchContent.removeClass("spe-jump");
                                matchContent.attr("data-url","");
                                var zhuan = (AutoComplete.serBox).replace(",","，");
                                self.getMatchDate(zhuan);
                            }
                        },500);
                    }
                }
            });

            searchBox.on("mousedown", function(){
                elemTouch = true;
            });
            searchBox.on("mouseup", function(){
                elemTouch = false;
            });
        },

        SecrchHistory: function(){
            var strHistory = localStorage.getItem(pageType);
                historyDom = $(".searchHistory"),
                hisList = historyDom.find(".g_list");
                hisList.html("");              
            if(strHistory != undefined){
                var historyList = JSON.parse(strHistory.split(","));
                for(var i=0;i<historyList.length;i++){
                    var dest = historyList[i],
                        strOnClick = '_tcTraObj._tcTrackEvent("search", "'+pageLabel+'", "/sbox/k/history",  "|*|k:'+dest+'|*|pos:'+(i+1)+'|*|jpTp:1|*|")',
                        sHtml = "<a href='/dujia/wanle/searchlist_"+dest+".html' target='_blank' class='g_item' onclick ='"+strOnClick+"'>"+dest+"</a>";             
                    hisList.append(sHtml);
                }                
            }
            if(hisList.find("a").length == 0){
                historyDom.addClass("none");
            } else {
                historyDom.removeClass("none");
            }
        },

        GetEleBind: function(){
             $(document).click(function(e) { // 在页面任意位置点击而触发此事件  e.target表示被点击的目标
                var curEle = $(e.target);
                if( curEle.attr("id")=="txtScenicValue"|| curEle.parents(".HotSearch").length > 0){
                    return;
                }else{
                    var hotSearch = $(".HotSearch");
                    hotSearch.addClass("none");
                }
            })
        },

        //@param 为了区分不同地方加不同的埋点
        goSearch: function(param){
            var self = this,
                searchBox = self.searchContent,
                matchContent = self.matchContent,
                type = self.type,
                searchVal,
                defaultVal =  searchBox.attr("attrvalue") || "";            
            searchVal = searchBox.val();
            if (/[\@\#\$%\^&\*\;\'\<\>\"]+/g.test(searchVal) && !matchContent.attr("data-url").length) return;

            if (searchVal.indexOf(':')>-1) {
                window.location.href="//www.ly.com/404.aspx";
                return false;
            }

            var checkFlag,
                vaildate;            
            checkFlag= self.checkFlag === true ? true:false;
            vaildate = checkFlag === true ? true : searchVal !== defaultVal;

            var index = param && param.index ? param.index : 1,
                curElem = param && param.curElem ? param.curElem : "",
                searchVal = curElem ? curElem.attr("data-content") : searchVal;

            if(searchVal.trim() !== "" && vaildate && (matchContent.hasClass("jump-label") || matchContent.hasClass("spe-jump"))){
                if(index != 1){
                    if(AutoComplete.dataTotal == undefined){
                        AutoComplete.dataTotal = 0;
                    }
                    _tcTraObj._tcTrackEvent('search', ''+pageLabel+'', '/sbox/k', '|*|k:'+searchVal.trim()+'|*|rc:'+AutoComplete.dataTotal+'|*|');
                }
                self.seveStorage(searchVal);

                window.open(matchContent.attr("data-url"));
            } else if(searchVal.trim() !== "" && vaildate){
                if(index != 1){
                    if(AutoComplete.dataTotal == undefined){
                        AutoComplete.dataTotal = 0;
                    }
                    _tcTraObj._tcTrackEvent('search', ''+pageLabel+'', '/sbox/k', '|*|k:'+searchVal.trim()+'|*|rc:'+AutoComplete.dataTotal+'|*|');
                }
                self.seveStorage(searchVal);
                
                window.open("/dujia/wanle/searchlist_" + encodeURIComponent(searchVal.replace(",","，")) +".html");
            }            
        },        
        seveStorage: function(searchVal){
            var strSearch = localStorage.getItem(pageType),
                array = JSON.parse(strSearch) ? JSON.parse(strSearch) : new Array(),
                isExist = $.inArray(searchVal,array);
            if(isExist == -1){
                array.unshift(searchVal);
            } else {
                array.splice($.inArray(searchVal, array), 1);
                array.unshift(searchVal);
            }
            localStorage.setItem(pageType, JSON.stringify(array));
        },

        getMatchDate: function(dest){
            var self = this,
                conInclude = self.matchContent,
                hotSearchElem = self.hotSearch,
                matchUrl = this.matchUrl || "/wanle/AjaxHelperWanle/GetSearchSelectData?NeedCount=10&ChannelId=1";
            $.ajax({
                url: matchUrl + "&Content="+encodeURIComponent(dest),
                dataType: "jsonp",
                success: function(data){
                    if(data.TotalCount === 0){
                        conInclude.addClass("none");
                        hotSearchElem.addClass("none");
                        _tcTraObj._tcTrackEvent('search', ''+pageLabel+'', '/sbox/ac', '|*|k:'+dest+'|*|rc:0|*|');
                        return;
                    }
                    AutoComplete.dataTotal = data.TotalCount;
                    data.search = dest;
                    data.showLabel = self.showLabel || true;
                    data.pageLabel = pageLabel;
                    var listTmpl = require("../index.dot");
                    conInclude.html(listTmpl(data));
                    if(!data.Result.length){
                        conInclude.addClass("none");
                        return;
                    }
                    hotSearchElem.addClass("none");
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
                var obj={};
                obj.index = 1;
                obj.curElem = $(this);
                self.goSearch(obj);
                $("#matchContent").addClass("none");
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
                searchBox = this.searchContent,
                elemParent = elem.parent();
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
                pageType = cfg.pagetype;
                pageLabel = cfg.pageLabel;
            if(cfg.searchContent == ""){
                cfg.searchContent = $("#txtScenicValue");
            }
            if(cfg.matchContent == ""){
                cfg.matchContent =  $("#matchContent");
            }
            self = $.extend(true,self,cfg);
            self.SecrchHistory();
            self.search();
            self.GetEleBind();
        }
    };
    return AutoComplete;
});
