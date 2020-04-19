// var Slidertoolbar = require("slidertoolbar/0.1.0/index");
var common = require("common/0.1.0/index");
var Login = require("login/0.1.0/index");
var Storage = require("common/0.1.0/storage");

var utitl = require("./_utility");
var comFn = require("./_comFns");
var countDown = require("./_countDown.js");
require('./_scrollspy');

var Timer = require('/modules/timer/0.2.0/pc');
require('/modules/activity/0.3.2/pc/pc');
require('/modules/ztutils/tel/0.1.1/index');
// debugger;
var Index = {};

Index.clickEvent = function(){
    $(".gotop").on("click",function(){
        $("html,body").animate({scrollTop:0});
    });

    $(".loca_but").on("click", function(){
        $(".pos_civ").addClass("hover");
    });
    $(".pos_civ .dl_pos li").on("click", function(){
        var $locaBut = $(".loca_but");
        var $this = $(this);
         $(".pos_civ").removeClass("hover");
        if(!$this.hasClass("curr")){
            $(".pos_civ .dl_pos li").removeClass("curr");
            $this.addClass("curr");
            $(".txt",$locaBut).html($this.html());
            Index.draw($this.attr("_areaid"));           
        }        
    });
};

Index.initUi = function(){
    //滚动监听
    $(window).on('scroll', function() {
        var top = $(window).scrollTop();
        if(top<550) {
            $('.sidetab').hide();
        } else {
            $('.sidetab').show();
        }
    });
    
    var obj = $.scrollspy({
        navEl : $(".sidetab"),
        contentEl: ".J_NavBox",
        currentCls: "active",
        navItemEl: "li",
        renderNav: false,
        fixedNav: function (el, sign) {
            switch (sign) {
                case 0:
                    //el.addClass("fixed");
                    break;
                case 1:
                    el.show();
                    break;
                case 2:
                    el.show();
                    break;
            }
        },
    });
};

Index.getUser = function () {
    var loginInfo = $.cookie("us"),
        userid;
    if (loginInfo) {
        userid = /userid=(\d+)/i.exec(loginInfo);
        userid = userid ? userid[1] : userid;
    }
    return userid;
};

Index.getProData = function(data) {
    // area_1004: "华东", area_1005: "华南", area_1003: "华北", area_1006: "华中", area_1099: "华西"
    var rs = {
        areaData: {
            // area_1002: {},
            area_1003: {},
            area_1004: {},
            area_1005: {},
            area_1006: {},
            area_1099: {}
        }        
    };

    var cycles = {};
    var areaData = rs.areaData;
    var _cycles = $("#HidCycleId").val();
    _cycles = _cycles.split(",");
    var cycleTypes = ["hot", "ocean", "brand"];
    var dateObj = {"2017/3/24": 7, "2017/3/25": 1, "2017/3/26": 2, "2017/3/27": 3, "2017/3/28": 4, "2017/3/29": 5, "2017/3/30": 6, "2017/3/31": 7};
    var nowTime = new Date();
    nowTime = nowTime.getFullYear() + "/" + (nowTime.getMonth() + 1) + "/" + nowTime.getDate();

    if(_cycles && _cycles[0]){
        for(var i = 0; i < _cycles.length; i++){
            if(_cycles[i]){
                cycles[_cycles[i]] = cycleTypes[i];
                // areaData["area_1002"][cycleTypes[i]] = [];
                areaData["area_1003"][cycleTypes[i]] = [];
                areaData["area_1004"][cycleTypes[i]] = [];
                areaData["area_1005"][cycleTypes[i]] = [];
                areaData["area_1006"][cycleTypes[i]] = [];
                areaData["area_1099"][cycleTypes[i]] = [];
            }
        }
    }
   
    if(_cycles && _cycles[0] && data && data[0]){
        var tempData = data;
        utitl.forEach(data, function(index, item){
            var type = cycles[item["CycleId"]];
            var areaId = item["AreaId"];
            areaId = item["AreaId"] == "1002" ? "1005" : item["AreaId"];            
            if(type == "hot") {
                var index = 0;
                if(new Date(nowTime) <= new Date("2017/3/18").getTime()){
                    index = 1;
                }else{
                    index = dateObj[nowTime] && dateObj[nowTime] || -1;
                }
                if(item["DedicatLine"] == index) {
                    areaData["area_" + areaId] && areaData["area_" + areaId][type] && areaData["area_" + areaId][type].push(item);
                }
            }else {
                areaData["area_" + areaId] && areaData["area_" + areaId][type] && areaData["area_" + areaId][type].push(item);
            }            
        });
    }
    
    // console.log(rs);
    return $.extend(true, {}, rs);
};

Index.load = function(areaId, data) {
    if (Index.dataLoading) return false;
    Index.dataLoading = true;

    var rsData = Index.getProData(data);
    Index.DATA = comFn.dataReplaceProctol(rsData);
    Index.draw(areaId, data);
};

Index.draw = function(areaId, data) {
    if(Index.DATA === undefined) {
        Index.load(areaId, data);
        return false;
    }

    var areaData = this.DATA && this.DATA.areaData && this.DATA.areaData["area_" + areaId]; 
    var hotTemplate = $("#hotTemplate").html();
    var dataTemplate = $("#dataTemplate").html();

    // console.log(areaData)

    function fn(data,label){
        var _html = '';

        utitl.forEach(data, function(index, item){
            _html += dataTemplate.format(
                Activity.tmplProAttr(item),
                Activity.setImageSize(item["ImgUrl"],"600x400"),
                label,
                item["MainTitle"]+item["SubTitle"],
                item["Preferential"]
            );
        });

        return _html;
    }

    function hotFn(data){
        var _html = '';

        utitl.forEach(data, function(index, item){
            _html += hotTemplate.format(
                Activity.setImageSize(item["ImgUrl"],"600x300"),
                (function(){
                    return item["LineType"] == 0 ? "跟团游" : "自由行";
                }()),
                item["MainTitle"]+item["SubTitle"],
                (function(){
                    var temp = '<div class="comment"><div class="c"><i></i><span>用户点评：</span></div><div class="d">{0}</div></div>'
                    // var Explosion = item["Explosion"].split("##")
                    var explosion = item["Explosion"].replace(/##/g, '<br/>');
                    var str = explosion ? temp.format(explosion) : "";
                    return str;
                }()),
                Activity.tmplProAttr(item),
                item["Preferential"],
                (function(){
                    var times = ["10", "12", "14"];
                    return times[index] + "点开抢";
                }()),
                index,
                (function(){
                    var nowTime = new Date().getTime(), toTime = new Date("2017/03/25").getTime();
                    if(nowTime < toTime) {
                        return "限时返现150元/人";
                    }
                    return "限时返现500元封顶";
                }())                
            );
        });

        return _html;
    }

    //
    if(areaData){
        // 限时返现
        var areaHotData = areaData["hot"];
        if(areaHotData && areaHotData[0]){
            $(".unit-hot").removeClass("none");
            $(".hot-pro").html(hotFn(areaHotData.slice(0,3)));
            Index.getTimes();
        }else{
            $(".unit-hot").addClass("none");
        }

        // 海外0元
        var areaOceanData = areaData["ocean"];
        if(areaOceanData && areaOceanData[0]){
            $(".unit-ocean").removeClass("none");
            $(".ocean-pro").html(fn(areaOceanData, "海外0元"));
        }else{
            $(".unit-ocean").addClass("none");
        }

        // 买赠好礼
        var areaBrandData = areaData["brand"];
        if(areaBrandData && areaBrandData[0]){
            $(".unit-brand").removeClass("none");
            $(".brand-pro").html(fn(areaBrandData, "买赠好礼"));
        }else{
            $(".unit-brand").addClass("none");
        }
    }
};

Index.getTimes = function() {
    Index.getServerTime(function(clientTime) {
        // console.log("clientTime",new Date(clientTime));
        var nowTime = new Date(clientTime);
        var nowTimeStr = nowTime.getFullYear() + "/" + (nowTime.getMonth() + 1) + "/" + nowTime.getDate();
        var startTime = Index.startTime.getTime();
        var $allAs = $(".hot-pro");

        utitl.forEach(Index.timeLimit, function(index, item) {
            if(clientTime < startTime){
                item["startFullTime"] = Index.startTimeStr + " " + item["startTime"];
                item["endFullTime"] = Index.startTimeStr + " " + item["endTime"];
            }else{
                item["startFullTime"] = nowTimeStr + " " + item["startTime"];
                item["endFullTime"] = nowTimeStr + " " + item["endTime"];
            }
        });

        for(var i = 0; i < 3; i++){
            var $hotBox = $allAs.find(".J_time_" + i);
            var $hotLink = $hotBox.find(".link");
            $hotLink.attr("href", "javascript:void(0);");
        }

        var Limit = Index.timeLimit, index = 0;
        for(var i = 0; i < 3; i++) {
            var sTime = new Date(Limit[i]["startFullTime"]).getTime();
            var eTime = new Date(Limit[i]["endFullTime"]).getTime();

            if(clientTime < sTime){
                index = i;
                break;
            }
            if(clientTime >= sTime && clientTime <= eTime) {
                index = i;
                break;
            }
        }
        if(clientTime > new Date(Limit[2]["endFullTime"]).getTime()) {
            index = 3;
        }

        
        for(var i = 0; i < 3; i++){
            var $hotBox = $allAs.find(".J_time_" + i);
            var $hotLink = $hotBox.find(".link");
            if(i == index){
                break;
            }
            $hotBox.find(".btn").html("抢购中");
            $hotLink.attr("href", $hotLink.attr("data-url"));
        }

        if(index < 3) {
            var opt = {
                index: index,
                goTime: Limit[index].goTime
            };

            var timeLimit = {
                startTime : Limit[index].startFullTime,
                endTime : Limit[index].endFullTime
            };

            Index.bindCountDown(timeLimit, opt); 
        }       
    });       
};

// 绑定一个倒计时
Index.bindCountDown = function(timeLimit, opt) {
    var _this = this,
        $allAs = $(".hot-pro"),
        $hotBox = $allAs.find(".J_time_" + opt["index"]),
        $hotLink = $hotBox.find(".link");
    if (this.timer && this.timer.destory) { //清除前一个倒计时
        this.timer.destory();
    }
    // console.log(timeLimit, opt);
    
    if (timeLimit && timeLimit.startTime && timeLimit.endTime) {
        Index.getServerTime(function(clientTime){
            // console.log(new Date(clientTime));
            if (clientTime) {
                _this.timer = countDown({
                    starTime: timeLimit.startTime,
                    endTime: timeLimit.endTime,
                    nowTime: clientTime,
                    updateFn: function(t, b) {
                        // console.log(t)
                    },
                    nobeginFn: function() {
                        // console.log("抢购未开始");
                        
                        $hotBox.removeClass("over");
                        $hotBox.find(".btn").html(opt["goTime"] + "点开抢");
                        $hotLink.attr("href", "javascript:void(0);");
                    },
                    ingFn: function() {
                        // console.log("疯狂抢购");

                        $hotBox.removeClass("over");
                        $hotBox.find(".btn").html("抢购中");
                        $hotLink.each(function() {
                            var $this = $(this);
                            $this.attr("href", $this.attr("data-url"));
                        });                                                                     
                    },
                    endFn: function() {
                        // console.log("抢购已结束");

                        $hotBox.removeClass("over");
                        $hotBox.find(".btn").html("抢购中");
                        $hotLink.each(function() {
                            var $this = $(this);
                            $this.attr("href", $this.attr("data-url"));
                        });

                        if(opt.index < 2) {
                            setTimeout(function(){
                                Index.getTimes();
                            },4000);  
                        }                                              
                    }
                });
            }
        });
    }
};

// 获取服务器时间
Index.getServerTime = function(callback) {
    var _this = this;
    var serverTimeUrl = location.protocol + "//www.ly.com/dujia/AjaxCall.aspx?Type=GetFocusValue&t="+ Math.random();
    $.ajax({
        type: "GET",
        url:serverTimeUrl,
        dataType: "jsonp",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function(data){            
            if(data && data.totalseconds){
                var retTime = new Date(data.totalseconds.replace(/\-/gi, "/")||null).getTime()
                callback.call(this,retTime);
            }else {
                callback.call(this, new Date().getTime());
            }
        },
        error: function(){
            callback.call(this, new Date().getTime());
        }
    });
};

Index.init = function(data) {
    var nowTime = new Date().getTime(), toTime = new Date("2017/03/25").getTime();
    if(nowTime < toTime) {
        // 
        $(".top2").css({"background": "url(//file.40017.cn/dujia/cn/v/dujia/images/sites/activity/pc/321/img/dest/321-top-2_fe23771.png) center no-repeat"});
        $(".top3").css({"background": "url(//file.40017.cn/dujia/cn/v/dujia/images/sites/activity/pc/321/img/dest/321-top-3_62acfd5.png) center no-repeat"});
        $(".gift-pro img").attr("src", "//file.40017.cn/dujia/cn/v/dujia/images/sites/activity/pc/321/img/dest/321-gift-1_4605308.png")
    }
    // 华东1004，华南1005，华北1003，华中1006，华西1099
    var listAreaTxt = { area_1004: "华东", area_1005: "华南", area_1003: "华北", area_1006: "华中", area_1099: "华西" };
    Index.areaId = 1004;     
    Index.startTimeStr = $("#HidStartTime").val() || "2017/03/18";
    Index.startTime = new Date(Index.startTimeStr);
    Index.timeLimit = [
        { startTime: "10:00:00", endTime: "11:59:59", startFullTime: "", endFullTime: "", goTime: "10" },
        { startTime: "12:00:00", endTime: "13:59:59", startFullTime: "", endFullTime: "", goTime: "12" },
        { startTime: "14:00:00", endTime: "23:59:59", startFullTime: "", endFullTime: "", goTime: "14" }
    ];
    Index.clickEvent();
    Index.initUi();
    Index.draw(Index.areaId, data);
};
module.exports = Index;