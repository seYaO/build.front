/**
 * Created by fx6698 on 2016/7/29.
 */
/* global Config */
/* global require */
(function($){
    var tpl={};
    tpl.result = require("./ajaxdot/result.dot");
    var Common = require("/modules-lite/common/index"),
        tmplList= tpl;
    var City = {
        storeKey: "dep_history",
        //url: url,
        /**
         * @func init
         * @param key {string} 城市选择面板的类型,有package和travel两种,对应跟团和自助游
         * @param clickEvent {function} 选择城市后触发的事件
         * @desc 城市选择模块的初始化方法
         */
        init: function(key,clickEvent){
            var self = $(this);
            Common.init();
            City.arrCity("package");
            travelType = key;
            City.initCommonEvent(clickEvent);
            City.history_link();              //历史跳转
        },

        /**
         * @protected
         * @func arrCity
         * @desc 到达城市
         * @param [key=package] {string} 线路类型,有package和traval两种
         */
        arrCity: function(key,clickEvent){
            //var beginCity=localStorage.getItem("begincity");
            //debugger;
            if(!key) {
                key = "package";
            }
            if(!City.isArrCity) {
                City.isArrCity = [];
            }
            if(City.isArrCity[key]) {
                return;
            }
            City.isArrCity[key] = true;
            //var url = Config.getInterface("packageDest");
            City.getHistory();
            var wrap = $(".c-list .city-box").find(".c-infro")[0];
            City.srearchResult(clickEvent);
            City.searchEvent(clickEvent);
           
        },
        // 确认搜索地址的类型
        typeLink:function(){
            if(travelType == "package"){
                return 1;
            }else {
                return false;
            }
        },

        cutData : function(data){
            if(data){
                var strData = data.allCity.Children.ChildLinkGroup.LinkList.LabelItemName;
                if(strData.length>4){
                    strData=strData.substring(0,4)+"...";
                }
            }

        },
        /**
         * @func srearchEvent
         * @desc 搜索事件
         * @param [key=package] {string} 线路类型,有package和traval两种
         */
        srearchResult:  function(clickEvent){
            var search = $("#searchR"),               //搜索框
                resultPage = $("#resultPage"),        // 搜索结果
                hotPart = $("#hotCity"),
                hisT = $("#history");
            // 清除搜索框值
            $(document).on("click",".s_box .btu_clear",function() {
                var self = $(this);
                search.val("");
                self.removeClass("clear_search");
                resultPage.addClass("none");
                hotPart.removeClass("none");
                City.srearchHidden();
            });
            // 清除搜索历史
            $(document).on("click",".J_clear",function(){
                localStorage.removeItem(City.storeKey);
                City.history = {};
                var hisDom = $("#history"),
                    clearDom = $(".h_box");
                clearDom.find("ul").empty();
                hisDom.addClass("none");
            });
            //搜索历史点击
            if($(".J_his ul li").length > 0){
                $(document).on("click",".J_his ul li",function(){
                    var self = this,
                        cfg = self.getAttribute("data-en");
                    //City.followingEvent("",$(self).text());
                    clickEvent&&clickEvent.call(self,cfg);
                });
            }
            //搜索框点击事件
            $(document).on("input click","#searchR",function(){
                City.getHistory();
                var keyword = $(this).val().trim(); // 搜索框值格式化
                if(keyword != ""){
                    //$("#searchR").addClass("active");
                    $(".s_box .btu_clear").addClass("clear_search");
                    resultPage.removeClass("none");
                    hotPart.addClass("none");
                    hisT.addClass("none");
                    var url ="//www.ly.com/wanle/api/WanleProduct/GetSearchSelectData?NeedCount=6&ChannelId=501&Content="+keyword;
                    Common.getData(url,function(data){
                        //var data = City.handlerData(data.Result);
                        data.search = keyword;
                        Common.render({
                            key: "result",
                            data: data,
                            //data:data.Result,
                            context: ".J_search",
                            tmpl: tmplList,
                            overwrite: true,
                            callback: function(){

                                //搜索关键词高亮
                                //$(".l_des .needsclick span").each(function (){
                                //    var elem = $(this),
                                //        str = elem.text();
                                //    var reg =  new RegExp("("+ keyword +")","g");
                                //    var reghtml = str.replace(reg,'<em>$1</em>');
                                //    elem.html(reghtml);
                                //});

                                $(".needsclick").eq(0).addClass("fistCity");


                                $('.needsclick[typeId = "11"]').eq(0).before(
                                    "<div class='needsclick special_has'>含有“<span>"+keyword+"</span>”的相关产品</div>"
                                );

                                City.history_link();
                            }

                        });
                        $(".fx .needsclick").on("click",function(){
                            if($(this).index() != 0){
                                var getId = $(this).attr("link_id"),
                                    linkPlace = $(this).find("span").html();
                                if((!$(this).hasClass("fistCity")) && $(this).attr("typeId") == 5){
                                    window.location.href = "http://wx.17u.cn/localfun/"+linkPlace+".html?sourceId=1";
                                }else if((!$(this).hasClass("fistCity")) && $(this).attr("typeId") == 1){
                                    window.location.href = "http://wx.17u.cn/localfun/"+linkPlace+".html?sourceId=1";
                                }else if((!$(this).hasClass("fistCity")) && $(this).attr("typeId") == 11){
                                    window.location.href ="http://wx.17u.cn/localfun/wanle/"+getId+".html";
                                }
                            }

                        });
                    });

                }
                if(keyword == ""){
                    $(".s_box .btu_clear").removeClass("clear_search");
                    resultPage.addClass("none");
                    hotPart.removeClass("none");
                    City.srearchHidden();
                }
            });
        },

        srearchHidden: function(){
            if($(".h_list ul li").length > 0){
                $("#history").removeClass("none");
            }
        },


        /**
         * @func getHistory
         * @desc 记录搜索历史
         */
        getHistory: function(){
            var self = this,
                hisDom = $(".J_his"),
                historyVal = JSON.parse(localStorage.getItem(self.storeKey));
            if(!historyVal){
                self.history = {};
            }else{
                self.history = historyVal;
                City.printHistory(hisDom,self.history.cityName);
                $("#history").removeClass("none");
            }
        },
        setHistory: function(cityName){
            var self = this,
                history = self.history,
                hisDom = $(".J_his");
            if (!history.cityName) {
                history.cityName = [];
            }
            var index = history.cityName.indexOf(cityName);
            if(~index){
                history.cityName.splice(index,1);
            }
            history.cityName = [cityName].concat(history.cityName);
            if(localStorage){
                localStorage.setItem(self.storeKey,JSON.stringify(history));
                City.printHistory(hisDom,history.cityName);
            }

            //hisDom.removeClass("none");
        },
        printHistory : function(dom,cityName){
            var len = Math.min(cityName.length - 1, 7),
                hisArr = [],
                hisHtml = "";
            for (var i = 0; i <= len; i++) {
                if(cityName[i].indexOf("@@@")>-1){
                    str = cityName[i].split("@@@");
                    hisHtml = "<li class='needsclick' l_id='"+str[1]+"' data-en='"+str[0]+"'><i></i>"+str[0]+"</li>";
                }else{
                    hisHtml = "<li class='needsclick' data-en='"+cityName[i]+"'><i></i>"+cityName[i]+"</li>";
                }
                hisArr.push(hisHtml);
            }
            dom.find("ul").empty().append(hisArr.toString().replace(/,/g,""));
            if($(dom).find("li").length < 0){
                $("#history").addClass("none");
            }
            City.history_link();
        },
        /**
         * @desc搜索结果列表点击事件和搜索历史
         */
        searchEvent: function(clickEvent){
            //搜索框点击
            $(document).on("click","#search",function(){
                var cityN = $("#searchR").val().trim();
                if(!cityN){
                    return false;
                }
                if(cityN){
                    City.setHistory(cityN);
                }
                window.location.href= "http://wx.17u.cn/localfun/"+cityN+".html?sourceId=1" ;
            });
        },

        /**
         * @private
         * @func initCommonEvent
         * @desc 城市选择,绑定通用的事件
         * @param clickEvent {function} 选择城市后触发的事件
         */
        initCommonEvent: function(clickEvent){
            $(document).on("click",".J_search .J_line .needsclick",function(){
                var self = this,
                    cfg = {
                        c_id: self.getAttribute("link_id"),
                        en: self.getAttribute("data-en"),
                        cn: self.textContent.trim()
                    },
                    cityN = $(this).attr("data-en")+"@@@"+cfg.c_id;
                if(cityN){
                    City.setHistory(cityN);
                }
                //City.followingEvent("",$(self).text());
                clickEvent&&clickEvent.call(self,cfg);

            });

            $(document).on("click",".hot_words ul li",function(){
                var self = this,
                    cfg = {
                        c_id: self.getAttribute("link_id"),
                        en: self.getAttribute("data-en"),
                        cn: self.textContent.trim()
                    },
                    cityN = $(this).attr("data-en")+"@@@"+cfg.c_id;
                if(cityN){
                    City.setHistory(cityN);
                }
                clickEvent&&clickEvent.call(self,cfg);
                window.location.href = "http://wx.17u.cn/localfun/wanle/"+cfg.c_id+".html";
            });


            $(document).on("click","#search",function(){
                var value = $(".city-search input").val().trim();
                if(value === ""){
                    return;
                }
                //var reg =  new RegExp("([^(\d{3}|\d{4}|\d{5})$])","g");

                //City.followingEvent(value,"");
                clickEvent&&clickEvent.call(this,{cn: value});


            });
        },
        //历史记录跳转
        history_link:function(){
            $(".his_all ul li").on("click",function(){
                var hasId = $(this).attr("l_id");
                var linkPlace = $(this).attr("data-en");
                if(hasId == ""){
                    window.location.href = "http://wx.17u.cn/localfun/"+linkPlace+".html?singleTypeId=6&sourceId=1";
                }else{
                    window.location.href ="http://wx.17u.cn/localfun/wanle/"+hasId+".html";
                }
            });
        },

    
    };

    module.exports = City;
})(Zepto);
