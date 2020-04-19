define("customtrip/0.1.0/index",["placeholder/0.1.0/index"],function(require,exports,module){
    var $ = jQuery,
        $lyDes = $("#lyDes"),
        $win = $(window);
    //右侧按钮滚动显示
    if($lyDes.length === 0){
        return;
    }
    $lyDes[0].style.display = $win.scrollTop() > 150 ? "block" : "none";
    $win.on("scroll",function(){
        $lyDes[0].style.display = $win.scrollTop() > 150 ? "block" : "none";
    });
    var CustomTrip = {};

    CustomTrip.init = function(){
        require("placeholder/0.1.0/index");
        CustomTrip.render();
        var $btn = $("#submitSuggestion"),
            $rebtn = $("#reSubmitSuggestion");
        //出游人数
        $(".combo-range-box").each(function(){
            var
                $ipt = $("input",this),
                $plus = $ipt.siblings(".plus"),
                $minus = $ipt.siblings(".minus"),
                min = +$ipt.attr("min"),
                max = +$ipt.attr("max"),
                step = +$ipt.attr("step") || 1,
                val = $ipt.val();
            val <= min && $minus.addClass("disabled");
            val >= max && $plus.addClass("disabled");
            $(".minus",this).on("click",function(e){
                e.preventDefault();
                var $this = $(this);
                if($this.hasClass("disabled")){return;}
                val--;
                val <= min ? $minus.addClass("disabled") : $minus.removeClass("disabled");
                val >= max ? $plus.addClass("disabled") : $plus.removeClass("disabled");
                $ipt.val(val)
            });
            $(".plus",this).on("click",function(e){
                fish.preventDefault(e);
                var $this = $(this);
                if($this.hasClass("disabled")){return;}
                val++;
                val <= min ? $minus.addClass("disabled") : $minus.removeClass("disabled");
                val >= max ? $plus.addClass("disabled") : $plus.removeClass("disabled");
                $ipt.val(val)
            });
        });
        //todo 增加日历组件
        //出游日期选择
        fish.require("Calendar", function() {
            var aD = new fish.Calendar({skin: "green",monthNum: 1}),
                ax = fish.parseTime(new Date(), {days: 58});
            $("#depatureTime").on("focus", function(aE) {
                aD.pick({elem: this,startDate: new Date(),endDate: ax,mode: "rangeFrom",fn: function(aF, aG, aH) {
                    aq(aD)
                }})
            });
            $("#returnTime").on("focus", function(aE) {
                aD.pick({elem: this,startDate: fish.parseTime($("#depatureTime").val(), {days: 1}),endDate: fish.parseTime(ax, {days: 1}),mode: "rangeTo",fn: function(aF, aG, aH) {

                }})
            });
            window._cal = aD;
        });
        function aq(aD) {
            var returnInput = $("#returnTime"),
                depatureInput = $("#depatureTime");
            returnInput.val(fish.parseTime(depatureInput.val(), {days: 1}));
            setButtonStatus();
            aD.pick({elem: returnInput,startDate: fish.parseTime(depatureInput.val(), {days: 1}),mode: "rangeTo",endDate: fish.parseTime(new Date(), {days: 59}),fn: function(aE, aF, aG) {
                setButtonStatus()
            }});
        };
        //设置按钮状态
        setButtonStatus();
        $btn.on("click",function(e){
            e.preventDefault();
            if($btn.hasClass("disabled")){return;}
            if(valid()){
                submitForm(function(data){
                    var status = data && data.status === "100" ? "success" : "failure";
                    pop(status);
                });
            }
        });
        this.desInitEv();
        $rebtn.on("click",function(e){
            e.preventDefault();
            fish.mPop.close();
            openSuggestion();
        })
        //textarea超出72个字母隐藏
        $("#remark").on("keyup",function(){
            var val = $(this).val();
            val = fish.trim(val);
            if(val.length > 72){
                $(this).val(val.substring(0,72))
            }
        });
        //提交表单
        function submitForm(callback){
            var remark,startDate,endDate,adult,child,older,name,phone,lineProperty,data,personNum,url;
            url = $("#hidRequireUrl").val();
            remark = $("#remark").val();
            startDate = $("input[name=startDate]").val();
            endDate = $("input[name=endDate]").val();
            adult = $("input[name=adult]").val()-0;
            child = $("input[name=child]").val()-0;
            older = $("input[name=older]").val()-0;
            name = $("input[name=username]").val();
            phone = $("input[name=phone]").val();
            lineProperty = $("#prop").val();
            personNum = adult + child + older;
            data = { "remark": remark,
                "startDate": startDate,
                "endDate": endDate,
                "customerName": name,
                "customerMobile": phone,
                "lineProperty": lineProperty,
                "personNum": personNum,
                "childNum": child,
                "adultNum": adult,
                "oldPeopleNum": older
            };
            jQuery.ajax({
                url: url,
                data: data,
                dataType: "jsonp",
                success: function(data){
                    callback.call(this,data)
                },
                error: function(data){
                    callback.call(this,data)
                }
            })
        }

        //设置按钮状态
        function setButtonStatus(){
            var $btn = $("#submitSuggestion"),
                $ipts = $("input,textarea",$(".suggestion-from")),
                isClickable = false;
            $btn.addClass("disabled");
            isClickable && $btn.removeClass("disabled");
            $ipts.each(function(){
                isClickable = CustomTrip.checkForm();
                isClickable ? $btn.removeClass("disabled") : $btn.addClass("disabled");
            });
        }
        //验证
        function valid(){
            var $ipts = $("input,textarea",$(".suggestion-from")),
                ret = true;
            $ipts.each(function(){
                var $this = $(this),
                    $err,val,type;
                this.type !== "password" && (val = fish.trim($this.val()));
                $err = $this.siblings(".error-msg");
                !$err.length && ($err = $(this.parentNode).siblings(".error-msg"));
                type = this.name;
                if(type === "username"){
                    if(!/^[^\x00-\xff]+$/.test(val)){
                        $this.addClass("form-error");
                        $err[0].style.display = "block";
                        ret = false;
                    }
                }
                if(type === "phone"){
                    if(!fish.valida.phone(val)){
                        $this.addClass("form-error");
                        $err[0].style.display = "block";
                        ret = false;
                    }
                }
                $this.on("focus",function(){
                    $this.removeClass("form-error");
                    $err.css("display: none");
                });
                $this.on("blur",function(){
                    this.type !== "password" && (val = fish.trim($this.val()));
                    if(type === "username"){
                        if(!/^[^\x00-\xff]+$/.test(val)){
                            $this.addClass("form-error");
                            $err[0].style.display = "block";
                            ret = false;
                        }
                    }else if(type === "phone"){
                        if(!fish.valida.phone(val)){
                            $this.addClass("form-error");
                            $err[0].style.display = "block";
                            ret = false;
                        }
                    }else{
                        $this.removeClass("form-error");
                        $err.css("display: none");
                    }
                })
            });
            return ret;
        }
        //弹出框
        function pop(status){
            var id,content;
            id = status === "success" ? "submitSuccess" : "submitFailure";
            content = $("#" + id);
            fish.mPop({
                title: "&nbsp;",
                content: content,
                className: "mpop"
            })
        }
    };

    $lyDes.on("click",function(){
        if(CustomTrip.isInit){
            openSuggestion();
            return;
        }
        CustomTrip.init();
        openSuggestion();
    })
    //弹出表单
    function openSuggestion(){
        fish.mPop({
            title: "",
            content: $("#suggestionPopBox"),
            beforeClose: function(){
                window._cal.hide();
            }
        })
    }
    //检查表单字段是否全填写
    CustomTrip.checkForm = function(){
        var $ipts = $("input,textarea",$(".suggestion-from")),
            isInputSupported = "placeholder" in document.createElement('input'),
            isClickable = true;
        $ipts.each(function(){
            var $this = $(this),val,placeVal;
            placeVal = $this.attr("placeholder");
            this.type !== "password" && (val = fish.trim($this.val()));
            if(isInputSupported && !val){
                return isClickable = false
            }else if(val === placeVal || !val){
                return isClickable = false
            }
        });
        return isClickable
    };
    CustomTrip.desInitEv = function(){
        var $ipts = $("input,textarea",$(".suggestion-from")),
            $btn = $("#submitSuggestion"),
            isClickable = false;
        //输入框注册事件
        $ipts.each(function(){
            $(this).on("blur",function(){
                isClickable = CustomTrip.checkForm();
                isClickable ? $btn.removeClass("disabled") : $btn.addClass("disabled");
            });
        });
        //注册弹出框关闭事件
        $(".pop-box .close").on("click",function(e){
            e.preventDefault();
            fish.mPop.close();
        });
        $("input[type=text],textarea").placeholder();
        $(".pop-box").on("click",function(e){
            var target = e.target || e.srcElement;
            if(target === fish.dom("#depatureTime") || target === fish.dom("#returnTime")){
                return;
            }
            window._cal.hide();
        });
    }
    CustomTrip.render = function(){
        if(this.isRendered){
            return;
        }
        var tmpl = '<div class="pop-box" id="suggestionPopBox" style="display: none">'+
        '<h3 class="pop-box-title">填写您对本线路的意见和需求，同程专员会为您量身定制行程</h3>'+
        '<a class="close" href="javascript:void(0)" title="关闭"></a>'+
        '<div class="pop-box-content">'+
        '<div class="suggestion-from">'+
        '<div class="list">'+
        '<span class="legend">意见收集</span>'+
        '<textarea class="ui-textarea" name="remark" id="remark" pattern=".*{0,72}" cols="30" rows="10" placeholder="请填写意见" maxlength="72"></textarea>'+
        '<span class="error-msg" role="alert">请告诉我们您的宝贵意见</span>'+
        '</div>'+
        '<div class="list">'+
        '<span class="legend">出发日期</span>'+
        '<div class="span">'+
        '<span class="ui-input-wrap">'+
        '<input class="ui-input ui-input-has-icon" name="startDate" id="depatureTime" maxlength="10" readonly type="text" placeholder="最早出发日期"/>'+
        '<em><i class="icon-date"></i></em>'+
        '</span>'+
        '<span class="error-msg"><i class="icon-warn"></i>请输入出发日期</span>'+
        '</div>'+
        '<div class="span">'+
        '<span class="ui-input-wrap">'+
        '<input class="ui-input ui-input-has-icon" name="endDate" id="returnTime" maxlength="10" readonly type="text" placeholder="最晚出发日期"/>'+
        '<em><i class="icon-date"></i></em>'+
        '</span>'+
        '<span class="error-msg"><i class="icon-warn"></i>请输入出发日期</span>'+
        '</div>'+
        '</div>'+
        '<div class="list">'+
        '<span class="legend">出游人数</span>'+
        '<label>成人&nbsp;&nbsp;<span class="combo-range-box">'+
        '<a class="minus" href=""><i class="icon-reduce"></i></a>' +
        '<input class="ui-input-number" name="adult" maxlength="2" readonly type="text" value="2" min="1" max="10" step="1"/>' +
        '<a class="plus" href=""><i class="icon-add"></i></a>'+
        '</span>'+
        '</label>'+
        '<label>儿童&nbsp;&nbsp;<span class="combo-range-box">'+
        '<a class="minus" href=""><i class="icon-reduce"></i></a>' +
        '<input class="ui-input-number" name="child" maxlength="2" readonly type="text" value="0" min="0" max="10" step="1"/>' +
        '<a class="plus" href=""><i class="icon-add"></i></a>'+
        '</span></label>'+
        '<label>老人&nbsp;&nbsp;<span class="combo-range-box">'+
        '<a class="minus" href=""><i class="icon-reduce"></i></a>' +
        '<input class="ui-input-number" name="older" maxlength="2" readonly type="text" value="0" min="0" max="10" step="1"/>' +
        '<a class="plus" href=""><i class="icon-add"></i></a>'+
        '</span></label>'+
        '</div>'+
        '<div class="list">'+
        '<span class="legend">联系方式</span>'+
        '<div class="span">'+
        '<input class="ui-input" maxlength="5" pattern="[^\x00-\xff]+" name="username" type="text" placeholder="请输入中文姓名"/>'+
        '<span class="error-msg"><i class="icon-warn"></i>请输入您的中文姓名</span>'+
        '</div>'+
        '<div class="span">'+
        '<input class="ui-input" maxlength="20" name="phone" type="text" placeholder="请输入手机号"/>'+
        '<span class="error-msg"><i class="icon-warn"></i>请输入正确的联系方式</span>'+
        '</div>'+
        '</div>'+
        '<div class="list">'+
        '<a class="ui-button ui-button-lorange disabled" id="submitSuggestion" href="">' +
        '<span class="ui-button-text">提交</span></a>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="pop-box pop-box-alert" id="submitSuccess" style="display: none">'+
        '<div class="pop-box-content">'+
        '<div class="success-box">'+
        '<img src="//img1.40017.cn/cn/v/2015/details/success.jpg" alt=""/>'+
        '<p><strong>意见反馈提交成功！</strong></p>'+
        '<p>一对一客服将在工作日的第一时间联系您。</p>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="pop-box pop-box-alert" id="submitFailure" style="display: none">'+
        '<div class="pop-box-content">'+
        '<div class="failure-box">'+
        '<img src="//img1.40017.cn/cn/v/2015/details//failure.jpg" alt=""/>'+
        '<p><strong>意见反馈提交失败！</strong></p>'+
        '<p>请重新填写，提交成功后，一对一客服 <br/>'+
        '将在工作日的第一时间联系您。</p>'+
        '<p><a class="ui-button ui-button-lorange" href="" id="reSubmitSuggestion">' +
        '<span class="ui-button-text">重新提交</span>' +
        '</a></p>'+
        '</div>'+
        '</div>'+
        '</div>';
        $("body").append(tmpl);
    };
    module.exports = CustomTrip;
});
