/*
*页面数据请求格式化输出
*/
!function(win,doc,$,undefined){
	function getProData(option){
		var opt = {
			moduleId : "",
			lid : "",
			isTimeLmit : false,//是否有时间区间的获取
			fn : function(){}
		};
		$.extend(true,opt,option)
		function fn(opt){
			$.ajax({
				url : "/youlun/cruisejson/CruisesaleJson?moduleId=" + opt.moduleId + "&Lid=" + opt.lid,
				success : function(data){
					opt.fn(dataFilter(data,opt.isTimeLmit || false));
				},
				error : function(){
					opt.fn(dataFilter(null,opt.isTimeLmit));
				}
			});
		}
		return new fn(opt);
	}
	function dataFilter(data,getTimeLimit){
		var rs = {
			areaData : {
				area_10 : [],
				area_11 : [],
				area_12 : [],
				area_13 : [],
				area_14 : []
			},
			timeLimit : {
				startTime : "",
				endTime : ""
			},
			subHeader : ""
		},
		areaData = rs.areaData,
		timeLimit = rs.timeLimit,
		timeRegx = /^\d{4}([-\/])\d{1,2}\1\d{1,2}( \d{1,2}:\d{1,2}:\d{1,2})?$/;
		if(data){
			if(data.SaleDetailList && data.SaleDetailList.length){
				var tempData = data.SaleDetailList;
				for(var i = 0 ,len = tempData.length ; i < len ; i++){
					var LineRegionInfo = tempData[i].LineRegionInfo || [];
					if(LineRegionInfo && LineRegionInfo.length){
						for(var j = 0 ,slen = LineRegionInfo.length ; j < slen ; j++){
							areaData["area_" + LineRegionInfo[j].RegionId] && areaData["area_" + LineRegionInfo[j].RegionId].push(tempData[i]);
						}
					}else{
						areaData["area_10"].push(tempData[i]);
						areaData["area_11"].push(tempData[i]);
						areaData["area_12"].push(tempData[i]);
						areaData["area_13"].push(tempData[i]);
						areaData["area_14"].push(tempData[i]);
					}
				}
			}
			//获取时间区间
			if(getTimeLimit && data.ModuleRemarkList && data.ModuleRemarkList.length){
				var startTime = "",
					endTime = "",
					ModuleRemarkList = data.ModuleRemarkList || [];
				for(var m = 0 ,mLen = ModuleRemarkList.length ; m < mLen ; m++){
					if(typeof ModuleRemarkList[m].Item1 == "string" &&  ModuleRemarkList[m].Item1.toLocaleLowerCase() == "starttime"){
						startTime = $.trim(ModuleRemarkList[m].Item2 || "");
					}else if(typeof ModuleRemarkList[m].Item1 == "string" &&  ModuleRemarkList[m].Item1.toLocaleLowerCase() == "endtime"){
						endTime = $.trim(ModuleRemarkList[m].Item2 || "");
					}
				}
				if(startTime && timeRegx.test(startTime) && endTime && timeRegx.test(endTime)){
					timeLimit.startTime = startTime;
					timeLimit.endTime = endTime;
				}
			}
			//副标题
			if(data.StmRemark && typeof data.StmRemark == "string"){
				rs.subHeader = $.trim(data.StmRemark || "");
			}
			
		}
		return $.extend(true,{},rs);
	}
	module.exports = getProData;
}(window,document,Zepto);