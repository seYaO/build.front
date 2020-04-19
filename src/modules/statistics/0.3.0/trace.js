(function(){
    var trace ={
        init: function(){
            var self = this;
            window.setInterval(function(){
                self.getTraceData();
            },2000);
            self.addTraceCheckStyle();
            //绑定公共头部的点击数据
            var commonBox = $("#menuNav");
            //if(commonBox && commonBox.length){
            //    commonBox
            //}
        },
        getParam: function(a, b) {
            for (var c, d, e = a.split("&"), f = b ? void 0 : {}, g = 0,h = e.length;  h > g; g++)
                if (c = e[g])
                    if (c = c.split("="), d = c.shift(), b) {
                        if (b === d) return c.join("=")
                    } else f[d] = c.join("=");
            return f
        },
        getParamFromUrl: function(str) {
            return this.getParam(window.location.search.replace('?', ''), str);
        },
        getTraceData: function(){
            var self = this;
            if(self.traceData){
                self.renderTraceData(self.traceData);
                return;
            }
            if(self.isGettingData){
                console.log("获取不到点击统计数据!");
                return;
            }
            var now = new Date();
            var fromDate = self.getParamFromUrl("from")
                    ||  self.getFormatTime(now.getFullYear(),now.getMonth(),now.getDate()-7),
                toDate = self.getParamFromUrl("to")
                    ||self.getFormatTime(now.getFullYear(),now.getMonth(),now.getDate());
            self.isGettingData = true;
            $.ajax({
                dataType: "jsonp",
                url: "http://10.14.84.206:3000/stat?page="+self.getTraceId()+"&fromdate="+fromDate+"&todate="+toDate,
                success: function(data){
                    data = data||{data:[]};
                    data.fromdate = fromDate;
                    data.todate = toDate;
                    self.traceData = data;
                    self.renderTraceData(data);
                }
            });
        },
        getTraceId: function(){
            var self = this;
            return self.traceId||(self.traceId = ($("html").attr("trace")));
        },
        addTraceCheckStyle: function(){
            var link = document.createElement("style");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.innerHTML =
                'a[trace],.J_trace[trace]{'
                + 'position: relative;'
                + 'display: inline-block;'
                + '}'
                + 'a[trace]:before,.J_trace[trace]:before{'
                + 'content: "";'
                + 'display: block;'
                + 'position: absolute;'
                + 'width: 100%;'
                + 'height: 100%;'
                + 'border: 1px solid red;'
                + 'top: 0;'
                + 'left: 0;'
                + 'opacity: 0.7;'
                + 'background: black;'
                + 'pointer-events: none;'
                +'z-index: 1;'
                + '}'
                + 'a[trace]:after,.J_trace[trace]:after{'
                + 'content: ""attr(trace-value)"";'
                + 'display: block;'
                + 'position: absolute;'
                + 'width: 100%;'
                + 'height: 100%;'
                + 'top: 0;'
                + 'left: 0;'
                + 'color: red;'
                + 'font-size: 16px;'
                + 'pointer-events: none;'
                +'visibility: visible;'
                +'z-index: 1;'
                +'}'
                +'div[trace]{'
                +'position: relative;'
                +'}'
                +'div[trace]:before{'
                +'content: "";'
                +'display: block;'
                +'position: absolute;'
                +'width: 100%;'
                +'height: 100%;'
                +'border: 1px solid red;'
                +'top: 0;'
                +'left: 0;'
                +'pointer-events: none;'
                +'}'
                +'div[trace]:after{'
                +'content: ""attr(trace-value)"";'
                +'display: block;'
                +'position: absolute;'
                +'width: auto;'
                +'height: 29px;'
                +'line-height: 29px;'
                +'border: 1px solid red;'
                +'border-bottom: none 0;'
                +'background: white;'
                +'top: -29px;'
                +'left: 10px;'
                +'padding: 0 3px;'
                +'color: red;'
                +'font-size: 16px;'
                +'visibility: visible;'
                +'pointer-events: none;'
                +'z-index: 10000000000;'
                +'}'
                +'html[trace]:before{'
                +'content:""attr(trace-value)"";'
                +'position:absolute;'
                +'font-size: 16px;'
                +'background: white;'
                +'border: 1px solid red;'
                +'z-index: 11111111111111;'
                +'right:0;'
                +'}'
                +'a.absolute[trace],div.absolute[trace],.J_trace.absolute[trace]{'
                +'position:absolute;'
                +'}'
                +'a.fixed[trace],div.fixed[trace],.J_trace.fixed[trace]{'
                +'position:fixed;'
                +'}'
                +'div#header[trace]:after {'
                +'top: 88px;'
                +'}';
            document.getElementsByTagName("head")[0].appendChild(link);
        },
        renderTraceData: function(allData){
            var self = this,
                data = allData.data;
            allData.clickCent = Math.round(allData.click/allData.pv*10000)/100;
            var traceEl = $("[trace]"),
                traceValEl = $("[trace-value]");
            if(self.traceNum){
                if(self.traceNum >= traceEl.length || self.traceValueNum >= traceValEl.length){
                    return;
                }
            }
            var bodyTmpl = "从{fromdate}到{todate},当前页面pv:{pv},有效点击:{click},点击率为:{clickCent}%";
            var bodyVal = bodyTmpl.replace(/{(\w+)}/g,function($0,$1){
                return allData[$1]||"暂无";
            });
            $("html").attr({
                "trace-value": bodyVal,
                "trace-loaded": true
            });
            traceEl.each(function(i,n){
                if(!n.getAttribute("trace-loaded")){
                    var traceVal = n.getAttribute("trace")||"";
                    n.setAttribute("trace",traceVal.toLowerCase().replace(/^j_/g,""));
                    n.setAttribute("trace-loaded",true);
                }
            });
            for(var i = 0,len = data.length -1; i<=len;i++){
                var factItem = data[i],
                    term = factItem.term.replace(/^j_/i,"");
                var factEl;
                //如果是经过处理的单复杂度的trace
                if(term.indexOf("___")>-1){
                    var termArr = term.split("___");
                    factEl = $('[trace='+termArr[0]+']').find('[trace='+termArr[1]+']');
                }else{
                    factEl = $('[trace='+term+']');
                }

                if(factEl.length){
                    var traceVal  = (factEl.attr("trace-value")||0)-0;
                    if(traceVal + factItem.count-0 > 10000){
                        window.console && window.console.log(traceVal,factItem.count-0);
                    }
                    factEl.attr("trace-value",factItem.count-0+traceVal);
                }
            }
            self.traceNum = traceEl.length;
            self.traceValueNum = traceValEl.length;
        },
        getFormatTime: function(year,month,date){
            var d = new Date(year,month,date);
            year = d.getFullYear();
            month = (d.getMonth()+1);
            date = d.getDate();

            if(month < 10){
                month = "0"+month;
            }
            if(date < 10){
                date = "0"+ date;
            }
            return year+"-"+month+"-"+date;
        }
    };
    trace.init();
}());
