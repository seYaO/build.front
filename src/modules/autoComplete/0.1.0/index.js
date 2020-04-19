/**
 * @author 刘聪(lc07631@ly.com)
 * @func AutoComplete
 * @desc 模糊匹配组件,支持jquery版本
 *
 * @example usage
 * autoComplete.init({
                showLabel: false,  true表示显示用于区分标签页的3个Tab,默认true
                checkFlag: true,   true表示不用与默认值attrvalue比较，就算相等也是可以跳转的
                searchContent: $("#txtScenicValue"),   输入input框  默认是这个
                matchContent: $("#matchContent"),    模糊匹配的容器，默认是这个
                matchUrl: $("#matchDest").val()    去匹配数据的异步地址
            });
 */
define("autoComplete/0.1.0/index",["tmpl/pc/autoComplete/index"
],function(require){
    var AutoComplete = function(){
    };
    AutoComplete.prototype = {
        pageIndex: 0,
        search : function(){
            var self = this,
                searchBox = self.searchContent,
                matchContent = self.matchContent,
                defaultVal =  searchBox.attr("attrvalue") || "",
                currentElem,
                operateElem;
            searchBox.siblings("a").on("click",function(){
                self.goSearch();
            });

            searchBox.on("focus",function(){
                if(searchBox.val() === defaultVal){
                    searchBox.val("");
                    searchBox.css("color","#333");
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
                if(e.keyCode !== 13 && e.keyCode !== 38 && e.keyCode !== 40){
                    matchContent.removeClass("jump-label");
                    matchContent.removeClass("spe-jump");
                    matchContent.attr("data-url","");
                    self.getMatchDate(searchBox.val().trim());
                }
            });


            searchBox.on("mousedown", function(){
                elemTouch = true;
            });
            searchBox.on("mouseup", function(){
                elemTouch = false;
            });


            //function goSearch(){
            //    searchVal = searchBox.val();
            //    if (/[\@\#\$%\^&\*\;\'\<\>\"]+/g.test(searchVal)) return;
            //    var checkFlag,
            //        vaildate;
            //    checkFlag= self.checkFlag === true ? true:false;
            //    vaildate = checkFlag === true ? true : searchVal !== defaultVal;
            //    if(searchVal.trim() !== "" && vaildate && (matchContent.hasClass("jump-label") || matchContent.hasClass("spe-jump"))){
            //        window.open(matchContent.attr("data-url"));
            //    } else if(searchVal.trim() !== "" && vaildate){
            //        window.open("/dujia/wanle/searchlist_" + encodeURIComponent(searchVal) +".html");
            //    }
            //}
        },

        goSearch: function(){
            var self = this,
                searchBox = self.searchContent,
                matchContent = self.matchContent,
                searchVal,
                defaultVal =  searchBox.attr("attrvalue") || "";
            searchVal = searchBox.val();
            if (/[\@\#\$%\^&\*\;\'\<\>\"]+/g.test(searchVal)) return;
            var checkFlag,
                vaildate;
            checkFlag= self.checkFlag === true ? true:false;
            vaildate = checkFlag === true ? true : searchVal !== defaultVal;
            if(searchVal.trim() !== "" && vaildate && (matchContent.hasClass("jump-label") || matchContent.hasClass("spe-jump"))){
                window.open(matchContent.attr("data-url"));
            } else if(searchVal.trim() !== "" && vaildate){
                window.open("/dujia/wanle/searchlist_" + encodeURIComponent(searchVal) +".html");
            }
        },

        getMatchDate: function(dest){
            var self = this,
                conInclude = self.matchContent,
                matchUrl = this.matchUrl || "/wanle/AjaxHelperWanle/GetSearchSelectData?NeedCount=10";
            $.ajax({
                url: matchUrl + "&Content="+encodeURIComponent(dest),
                dataType: "jsonp",
                success: function(data){

                    data.search = dest;
                    data.showLabel = self.showLabel || true;
                    var listTmpl = require("tmpl/pc/autoComplete/index");
                    conInclude.html(listTmpl(data));
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
                self.goSearch();
                //window.open("/dujia/wanle/searchlist_" + $(this).text() +".html");

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
            if(cfg.searchContent == ""){
                cfg.searchContent = $("#txtScenicValue");
            }
            if(cfg.matchContent == ""){
                cfg.matchContent =  $("#matchContent");
            }
            self = $.extend(true,self,cfg);
            self.search();
        }
    };
    return AutoComplete;
});
