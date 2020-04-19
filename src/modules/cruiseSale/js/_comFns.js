//公共通用方法
!function(win,doc,$){
	var stopPropatationOption = (function() {
        function stopPropatation(e) {
            e.stopPropagation();
        }
        var spObj = {
            "click": stopPropatation,
            "scroll": stopPropatation,
            "touchstart": stopPropatation,
            "touchmove": stopPropatation,
            "touchend": stopPropatation
        }
        return spObj;
    })();
    //滚动事件的执行方法
    var scrollEventFn = (function() {
        return {
            "touchstart": function(e) { //touchstart事件
                var touches = e.touches;
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                lastmoveY = y;
            },
            "touchmove": function(e) { //touchmove事件
                var touches = e.touches;
                var x = touches[0].clientX;
                var y = touches[0].clientY;
                if (this.scrollTop == 0 && lastmoveY < y) {
                    e.preventDefault();
                }
                if (this.clientHeight + this.scrollTop - this.scrollHeight >= -1 && lastmoveY > y) {
                    e.preventDefault();
                }
                lastmoveY = y;
            }
        }
    })();
    var isApp = ci && ci.isClient && ci.isClient() ? true : false;
	module.exports = {
		isApp : isApp,
		webpAndLazy : webpAndLazy,
		isSupportSticky : isSupportSticky(),
        // isSupportSticky : false, 
		alertFormCtrl : alertFormCtrl,
		domPosCenter : domPosCenter,
		isObject : isObject,
		dataToStr : dataToStr,
		getUrlParam : getUrlParam,
		countDown : countDown,
		stopPropatationOption : stopPropatationOption,
		scrollEventFn : scrollEventFn,
        ruleConCtrl : ruleConCtrl,
        dataReplaceProctol : dataReplaceProctol,
        bindErrorImg : bindErrorImg,
        createUrlPath : createUrlPath,
        loader : loader,
        replaceData : replaceData,
        rpPicUrlSizeToNormal : rpPicUrlSizeToNormal
	};
	// //webp+lazy
    function webpAndLazy($dom) {
        loadWebp({
            attr: 'data-nsrc',
            img: $dom,
            replace: true,
            fn: function() {
                //轮播
                $dom.lazyload({ effect: 'fadeIn' });
            }
        });
    }

    function isSupportSticky() {
        var prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
        var stickyText = '';
        for (var i = 0; i < prefixTestList.length; i++) {
            stickyText += 'position:' + prefixTestList[i] + 'sticky;';
        }
        // 创建一个dom来检查
        var div = document.createElement('div');
        var body = document.body;
        div.style.cssText = 'display:none;' + stickyText;
        body.appendChild(div);
        var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
        body.removeChild(div);
        div = null;
        return isSupport;
    }

    //弹框显示控制
    function alertFormCtrl(option) {
        var setOption = {
            showCon: $(""),
            shadowBg: $(""),
            clickBgClose: true,
            closeBut: $(""),
            closeAfterFn: function(objA, objB) {},
            showAfterFn: function(objA, objB) {},
            showBeforeFn: function(objA, objB) {}
        };
        $.extend(true, setOption, option);
        var g = setOption,
            status = 0,
            fns = {
                show: function() {
                    g.showBeforeFn(g.showCon, g.shadowBg);
                    g.shadowBg.removeClass("none");
                    g.showCon.removeClass("none");
                    g.showAfterFn(g.showCon, g.shadowBg);
                },
                close: function() {
                    g.shadowBg.addClass("none");
                    g.showCon.addClass("none");
                    g.closeAfterFn(g.showCon, g.shadowBg);
                }
            };
        g.closeBut.on("click", function() {
            fns.close();
        });
        if (g.clickBgClose === true) {
            g.shadowBg.on("click", function() {
                fns.close();
            });
        }

        return fns;
    }

    //居中
    function domPosCenter(domElem) {
        if (!domElem) return false;
        var $dom = $(domElem);
        $dom.css({
            "left": "50%",
            "top": "50%",
            "marginLeft": -$dom.width() / 2 + "px",
            "marginTop": -$dom.height() / 2 + "px"
        });
        return true;
    }

    //数据替换
    function replaceData(tempStr, objData) {
        if (!tempStr || !objData || !isObject(objData)) return "";
        tempStr = tempStr.replace(/{{(\w+?)}}/g, function(a, b) {
            return objData[b] !== undefined ? objData[b] : a;
        });
        return tempStr;
    }

    //是否是对象
    function isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    //打印数据为标签字符串
    function dataToStr(option) {
        var setOption = {
            jsonData: "",
            temp: "",
            circleFilterData: function(cirData, index) {
                return cirData;
            },
            isUseCirc: true,
            showLen: -1
        };
        $.extend(true, setOption, option);
        var str = "",
            count = 0;
        if (setOption.jsonData && setOption.temp) {
            if (setOption.isUseCirc === true) {
                for (var i = 0, len = setOption.jsonData.length; i < len; i++) {
                    // var data = setOption.jsonData[i];
                    var data = setOption.circleFilterData(setOption.jsonData[i], i);
                    if (!!data) {
                        count++;
                        str += replaceData(setOption.temp, data);
                    }
                    if (setOption.showLen !== -1 && count >= setOption.showLen) {
                        break;
                    }
                }
            } else {
                var data = setOption.jsonData;
                str = replaceData(setOption.temp, setOption.circleFilterData(data, 0));
            }
        }
        return str;
    }

    //获取url中的参数值
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }

    //倒计时通用
    function countDown(option) {
        var setOption = {
            //刷新时间间隔
            setUp: 1000,
            //时间长度
            microse: 3000,
            //更新方法
            updateFn: function(timeObj) {},
            //回调
            callBackFn: function() {}
        };
        $.extend(true, setOption, option);
        var eTime = new Date().getTime() + setOption.microse,
            destoryThisTimer = function() {
                if (interId) {
                    clearInterval(interId);
                    setOption.updateFn({
                        day: 0,
                        hour: 0,
                        minute: 0,
                        second: 0,
                        minsecond: 0,
                        microse: 0
                    });
                }
            },
            interId = setInterval(function() {
                var suT = eTime - new Date().getTime();
                if (suT <= 0) {
                    destoryThisTimer(); //clearInterval(interId);
                    suT = 0;
                    setOption.updateFn({
                        day: 0,
                        hour: 0,
                        minute: 0,
                        second: 0,
                        minsecond: 0,
                        microse: 0
                    });
                    setOption.callBackFn();
                    return false;
                }
                setOption.updateFn({
                    day: parseInt((suT / 1000 / 60 / 60 / 24), 10),
                    hour: parseInt((suT / 1000 / 60 / 60 % 24), 10),
                    minute: parseInt((suT / 1000 / 60 % 60), 10),
                    second: parseInt((suT / 1000 % 60), 10),
                    minsecond: parseInt((suT % 1000) / 100, 10),
                    microse: suT
                });
            }, setOption.setUp);
        return destoryThisTimer;
    }
    //活动规则
    function ruleConCtrl($elems){
        function ruleFns(elem){
            var $elem = $(elem),
                $txtShow = $(".tsxt_show",elem),
                $tsP = $(".ts_sp",elem),
                $arrowBut = $(".more_a",elem);//rule_con_has_more
            // console.log(elem,$tsP.height() , $tsP.height())
            $arrowBut.unbind("click.sObj");
            $elem.removeClass("rule_con_has_more");
            $txtShow.removeClass("show_more");
            $arrowBut.addClass("has_more");
            if($txtShow.height() * 1.4 < $tsP.height()){
                $elem.addClass("rule_con_has_more");
                // $arrowBut.addClass("has_more");
                // $txtShow.addClass("hide_more");
                $arrowBut.unbind("click.sObj").bind("click.sObj",function(){
                    if($arrowBut.hasClass("has_more")){
                        $arrowBut.removeClass("has_more");
                         $txtShow.addClass("show_more");
                    }else{
                        $arrowBut.addClass("has_more");
                        $txtShow.removeClass("show_more");
                       
                    }
                    // console.log($txtShow.css("font-size"))
                });
            }else{
                
                // $arrowBut.removeClass("has_more");
            }
        }
        return $elems.each(function(){
            var that = this;
            
            setTimeout(function(){
                ruleFns(that);
            },200);
        });
    }
    //替换协议头 用于json数据源的处理
    function dataReplaceProctol(data){
        if(!data) return data;
        var sstr = "";
        try{
            sstr = JSON.stringify(data) || "";
            return JSON.parse(sstr.replace(/https?:\/\//g,"//"));
        }catch(e){
            return data;
        }
    }
    //错误图片处理
    function bindErrorImg(imgElem,defaultImgSrc){
        if(!imgElem || !(typeof defaultImgSrc == "string" && defaultImgSrc)) return false;
        imgElem.onerror = function(){
            // alert(imgElem.src)
            imgElem.onerror = function(){};
            imgElem.src = defaultImgSrc;
        };
    }
    //产品地址拼接
    function createUrlPath(params){
        var opts = {
                specialId : 0,
                lineId : 0,
                lineType : 0,//0普通 1抢购 2促销（app是抢购 比较特殊
                lineDate : "",
                moduleId : 0,
                key : "",
                lid : "",
                batchId : ""
            },
            urlTemp = "",
            url = "";
        // console.error(isApp = true)
        $.extend(true,opts,params);
        if(opts.lineType == 0){//普通线路
            if(isApp){
                urlTemp = "/youlun/tours/{{lineId}}_{{specialId}}_1.html?saildate={{lineDate}}";
                url = replaceData(urlTemp,opts);
            }else{
                urlTemp = "/youlun/tours/{{lineId}}.html?topicId={{specialId}}&Key={{key}}";
                url = createUrl(replaceData(urlTemp,opts));
            }
        }else{
            urlTemp = "/youlun/Promotion2016.html?lineId={{lineId}}&specialId={{specialId}}&ModuleId={{moduleId}}&LineDate={{lineDate}}&Key={{key}}&Lid={{lid}}";
            url = createUrl(replaceData(urlTemp,opts));
        }
        // console.log(opts.lineId,opts.lineType,url)
        return url;
    }
    // function createUrlPath(params){
    //     var opts = {
    //             specialId : 0,
    //             lineId : 0,
    //             lineType : 0,//0普通 1抢购 2促销（app是抢购 比较特殊
    //             lineDate : "",
    //             moduleId : 0,
    //             key : "",
    //             lid : "",
    //             batchId : ""
    //         },
    //         urlTemp = "",
    //         url = "";
    //     // console.error(isApp = true)
    //     $.extend(true,opts,params);
    //     if(opts.lineType == 0){//普通线路
    //         if(isApp){
    //             urlTemp = "/youlun/tours/{{lineId}}_{{specialId}}_1.html?saildate={{lineDate}}";
    //             url = replaceData(urlTemp,opts);
    //         }else{
    //             urlTemp = "/youlun/tours/{{lineId}}.html?&Key={{key}}";
    //             url = createUrl(replaceData(urlTemp,opts));
    //         }
    //     }else if(opts.lineType == 2){//促销线路()
    //         if(isApp && opts.batchId){// 跳转录的促销地址 （客户端跳抢购）
    //             // app的抢购地址
    //             // //http://shouji.17u.cn/internal/h5/file/3/main.html?wvc1=1&wvc2=1#/purchInfo/98258/1000/1
    //             urlTemp = "http://shouji.17u.cn/internal/h5/file/3/main.html?wvc1=1&wvc2=1#/purchInfo/{{lineId}}/{{batchId}}/1";
    //             url = replaceData(urlTemp,opts);                                   
    //         }else{
    //             urlTemp = "/youlun/Promotion2016.html?lineId={{lineId}}&specialId={{specialId}}&ModuleId={{moduleId}}&LineDate={{lineDate}}&Key={{key}}&Lid={{lid}}";
    //             url = createUrl(replaceData(urlTemp,opts));
    //         }
    //     }else{
    //         urlTemp = "/youlun/Promotion2016.html?lineId={{lineId}}&specialId={{specialId}}&ModuleId={{moduleId}}&LineDate={{lineDate}}&Key={{key}}&Lid={{lid}}";
    //         url = createUrl(replaceData(urlTemp,opts));
    //     }
    //     // console.log(opts.lineId,opts.lineType,url)
    //     return url;
    // }

    //产品loader
    function loader(params){
        var opts = {
            elem : "",
            anTime : 60//60ms 
        };
        $.extend(true,opts,params);
        var $elem = $(opts.elem),
            $parentCon = $elem.parent(".loading_div"),
            sId = null,
            startFn = function(){
                var i = 0,
                    oldClass = "",
                    nowClass = "";
                $parentCon.removeClass("none");
                sId = setInterval(function(){
                    // console.log(i)
                    i++;
                    nowClass = "loader_an_" + i;
                    $elem.removeClass(oldClass).addClass(nowClass);
                    oldClass = nowClass;
                    if(i == 22) i = 0;
                },opts.anTime);
                return true;
            },
            endFn = function(){
                $parentCon.addClass("none");
                sId && clearInterval(sId);
                return true;
            };
        return {
            startFn : startFn,
            endFn : endFn
        };
    }
    //图片地址替换掉尺寸、、因为图片有变形的情况出现
    function rpPicUrlSizeToNormal(data){
        if(!data) return data;
        var sstr = "";
        try{
            sstr = JSON.stringify(data) || "";
            return JSON.parse(sstr.replace(/_\d+x\d+_\d+(?=\.[a-z0-9]+)/ig,""));
        }catch(e){
            return data;
        }
        // return picUrl.replace(/_\d+x\d+_\d+?(?=\.[a-z0-9]+(\?.*$|$))/i,"");
    }
}(window,document,Zepto);