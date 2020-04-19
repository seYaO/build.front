/*
 *页面数据请求格式化输出
 */
! function(window, document, $, undefined) {

    function getProData(option) {
        var opt = {
            specialId: "",
            lid: "",
            isTimeLmit: false, //是否有时间区间的获取
            nowTime: "",
            fn: function() {}
        };
        $.extend(true, opt, option);

        function fn(opt) {
            $.ajax({
                url: "/youlun/json/ttolines?specialId=" + opt.specialId + "&imgWid=420&imgHgt=272&lid=",
                // url: "/youlun/zt/321Json.html?platId=433&specialId=" + opt.specialId + "&lid=" + opt.lid,
                // url: "http://10.101.42.41:3010/js/data.json",
                success: function(data) {
                    data = data && JSON.parse(data) || null;
                    opt.fn(dataFilter(data, opt.isTimeLmit || false));
                },
                error: function() {
                    opt.fn(dataFilter(null, opt, isTimeLmit));
                }
            });
        }

        return new fn(opt);
    }

    function dataFilter(data, getTimesLimit) {
        var rs = {
            areaData: {
                area_10: {},
                area_11: {},
                area_12: {},
                area_13: {},
                area_14: {}
            },
            timeLimit: {
                startTime: "",
                endTime: ""
            },
            nowTime: "",
            dateObj: {},
            dateArr: [],
            subHeader: "",
            jumpPortal: []
        };
        var modules = {};
        var dateObj = rs.dateObj;
        var dateArr = rs.dateArr;
        var areaData = rs.areaData;
        var timeLimit = rs.timeLimit;
        var jumpPortal = rs.jumpPortal;
        var timeRegx = /^\d{4}([-\/])\d{1,2}\1\d{1,2}( \d{1,2}:\d{1,2}:\d{1,2})?$/;
        var _modules = $("#HidModuleId").val();
        _modules = _modules.split(",");
        var moduleTypes = ["hot", "buy", "wednesday", "jump"];

        if (_modules && _modules[0]) {
            for (var i = 0; i < _modules.length; i++) {
                if (_modules[i]) {
                    modules[_modules[i]] = moduleTypes[i];
                }
            }
        }
        // if(data && data.Data && data.Data["ModuleList"] && data.Data["ModuleList"][0]){
        //     rs.nowTime = data.Data["StiNowTime"].replace(/^(\d{4})-(\d{1,2})-(\d{1,2}).*$/, function(a, y, m, d) {
        //                         return parseInt(m, 10) + "." + parseInt(d, 10);
        //                     });
        //     var moduleData = data.Data["ModuleList"];
        if(data && data.Data ){
            var nowTime = new Date();
            rs.nowTime = (nowTime.getMonth() + 1) + "." + nowTime.getDate();
            var moduleData = data.Data;
            var index = 0;
            // debugger;
            for (var i = 0, len = moduleData.length; i < len; i++) {
                var type = modules[moduleData[i]["ModuleId"]];
                if (type) {
                    if(type == "hot"){
                        areaData["area_10"][type] = {};
                        areaData["area_11"][type] = {};
                        areaData["area_12"][type] = {};
                        areaData["area_13"][type] = {};
                        areaData["area_14"][type] = {};
                    }else{
                        areaData["area_10"][type] = [];
                        areaData["area_11"][type] = [];
                        areaData["area_12"][type] = [];
                        areaData["area_13"][type] = [];
                        areaData["area_14"][type] = [];
                    }
                    
                    if (moduleData[i].LineList && moduleData[i].LineList[0]) {
                        var tempData = moduleData[i].LineList;
                        for (var j = 0, jlen = tempData.length; j < jlen; j++) { // AreaList
                            var AreaList = tempData[j].AreaList;
                            if(type == "jump"){
                                var obj = {};
                                obj.url = tempData[j].StlDescription;
                                obj.img = tempData[j].StlImageUrl;
                                if(obj.url && obj.img){
                                    jumpPortal.push(obj);
                                }                                
                            }else{
                                if (AreaList && AreaList[0]) {
                                    for (var k = 0, klen = AreaList.length; k < klen; k++) {
                                        if(type == "hot"){
                                            var beginTime = tempData[j]["StlBeginTime"].replace(/^(\d{4})-(\d{1,2})-(\d{1,2}).*$/, function(a, y, m, d) {
                                                                return parseInt(m, 10) + "." + parseInt(d, 10);
                                                            });
                                            if(AreaList[k] == 10){
                                                // console.log(index)
                                                dateObj[beginTime] = index;
                                                dateArr.push(beginTime);
                                                index++;
                                            }
                                            areaData["area_" + AreaList[k]][type][beginTime] = [];
                                            areaData["area_" + AreaList[k]][type][beginTime].push(tempData[j]);
                                        }else{
                                            areaData["area_" + AreaList[k]][type] && areaData["area_" + AreaList[k]][type].push(tempData[j]);
                                        }
                                    }
                                }
                            }    

                            // var RegionList = tempData[j].RegionList;
                            // if(type == "jump"){
                            //     var obj = {};
                            //     obj.url = tempData[j].StlDescription;
                            //     obj.img = tempData[j].StlImageUrl;
                            //     if(obj.url && obj.img){
                            //         jumpPortal.push(obj);
                            //     }                                
                            // }else{
                            //     if (RegionList && RegionList[0]) {
                            //         for (var k = 0, klen = RegionList.length; k < klen; k++) {
                            //             if(type == "hot"){
                            //                 var beginTime = tempData[j]["StlBeginTime"].replace(/^(\d{4})-(\d{1,2})-(\d{1,2}).*$/, function(a, y, m, d) {
                            //                                     return parseInt(m, 10) + "." + parseInt(d, 10);
                            //                                 });
                            //                 if(RegionList[k].RegionId == 10){
                            //                     // console.log(index)
                            //                     dateObj[beginTime] = index;
                            //                     dateArr.push(beginTime);
                            //                     index++;
                            //                 }
                            //                 areaData["area_" + RegionList[k].RegionId][type][beginTime] = [];
                            //                 areaData["area_" + RegionList[k].RegionId][type][beginTime].push(tempData[j]);
                            //             }else{
                            //                 areaData["area_" + RegionList[k].RegionId][type] && areaData["area_" + RegionList[k].RegionId][type].push(tempData[j]);
                            //             }
                            //         }
                            //     }
                            // }                            
                        }
                    }
                    if (type == "jump") {
                        // jumpPortal["url"] = moduleData[i]["StmRules"];
                        // jumpPortal["img"] = moduleData[i]["StmRemark"];
                    } else {
                        
                    }
                }
            }

            var area_10 = areaData["area_10"];
            var area_11 = areaData["area_11"];
            var area_12 = areaData["area_12"];
            area_11["buy"] = area_11["buy"].concat(area_10["buy"]);
            area_12["buy"] = area_12["buy"].concat(area_10["buy"]);
        }
        // console.log(rs);
        return $.extend(true, {}, rs);
    }

    
    module.exports = getProData;

}(window, document, Zepto);
