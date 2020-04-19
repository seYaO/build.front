/*
 *页面数据请求格式化输出
 */
! function(window, document, $, undefined) {

    function getProData(option) {
        var opt = {
            specialId: "",
            lid: "",
            isTimeLmit: false, //是否有时间区间的获取
            fn: function() {}
        };
        $.extend(true, opt, option);

        function fn(opt) {
            $.ajax({
                url: "/youlun/json/ttolines?specialId=" + opt.specialId + "&imgWid=420&imgHgt=272&lid=" + opt.lid,
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

    function dataModule(data, getTimesLimit) {
        if (data) {
            if (data.Data && data.Data[0]) {}
        }
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
            subHeader: "",
            jumpPortal: {
                url: "",
                img: ""
            }
        };
        var modules = {};
        var areaData = rs.areaData;
        var timeLimit = rs.timeLimit;
        var jumpPortal = rs.jumpPortal;
        var timeRegx = /^\d{4}([-\/])\d{1,2}\1\d{1,2}( \d{1,2}:\d{1,2}:\d{1,2})?$/;
        var _modules = $("#HidModuleId").val();
        _modules = _modules.split(",");
        var moduleTypes = ["hot", "shopping", "luxury", "adventure", "jump"];

        if (_modules && _modules[0]) {
            for (var i = 0; i < _modules.length; i++) {
                if (_modules[i]) {
                    modules[_modules[i]] = moduleTypes[i];
                }
            }
        }

        if (data) {
            if (data.Data && data.Data[0]) {
                var moduleData = data.Data;
                for (var i = 0, len = moduleData.length; i < len; i++) {
                    var type = modules[moduleData[i]["ModuleId"]];
                    if (type) {
                        if (type == "jump") {
                            jumpPortal["url"] = moduleData[i]["StmRules"];
                            jumpPortal["img"] = moduleData[i]["StmRemark"];
                        } else {
                            areaData["area_10"][type] = [];
                            areaData["area_11"][type] = [];
                            areaData["area_12"][type] = [];
                            areaData["area_13"][type] = [];
                            areaData["area_14"][type] = [];
                            if (moduleData[i].LineList && moduleData[i].LineList[0]) {
                                var tempData = moduleData[i].LineList;
                                for (var j = 0, jlen = tempData.length; j < jlen; j++) {
                                    var AreaList = tempData[j].AreaList;
                                    if (AreaList && AreaList[0]) {
                                        for (var k = 0, klen = AreaList.length; k < klen; k++) {
                                            areaData["area_" + AreaList[k]][type] && areaData["area_" + AreaList[k]][type].push(tempData[j]);
                                        }
                                    } else {
                                        // areaData["area_10"][type].push(tempData[j]);
                                        // areaData["area_11"][type].push(tempData[j]);
                                        // areaData["area_12"][type].push(tempData[j]);
                                        // areaData["area_13"][type].push(tempData[j]);
                                        // areaData["area_14"][type].push(tempData[j]);
                                    }
                                }
                            }
                        }
                    }
                }

                var area_10 = areaData["area_10"];
                var area_13 = areaData["area_13"];
                var area_14 = areaData["area_14"];
                area_13["hot"] = area_13["hot"][0] ? area_13["hot"] : area_10["hot"];
                area_13["shopping"] = area_13["shopping"][0] ? area_13["shopping"] : area_10["shopping"];
                area_13["luxury"] = area_13["luxury"][0] ? area_13["luxury"] : area_10["luxury"];
                area_13["adventure"] = area_13["adventure"][0] ? area_13["adventure"] : area_10["adventure"];

                area_14["hot"] = area_14["hot"][0] ? area_14["hot"] : area_10["hot"];
                area_14["shopping"] = area_14["shopping"][0] ? area_14["shopping"] : area_10["shopping"];
                area_14["luxury"] = area_14["luxury"][0] ? area_14["luxury"] : area_10["luxury"];
                area_14["adventure"] = area_14["adventure"][0] ? area_14["adventure"] : area_10["adventure"];
            }
        }

        return $.extend(true, {}, rs);
    }

    module.exports = getProData;

}(window, document, Zepto);
