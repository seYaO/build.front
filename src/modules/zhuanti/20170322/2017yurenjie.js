(function () {
	var result=is_iPad();
	//阻止默认滚动
	$("body").on('touchmove', function (event) {
		event.preventDefault();
	});
	document.addEventListener("touchstart", function (e) { }, false);

	var pageNum = 0,    //  当前第一页
		domArr = [".first_dom", ".second_dom", ".third_dom", ".fourth_dom", ".fifth_dom", ".sixth_dom",".seventh_dom",".eighth_dom",".ninth_dom",".tenth_dom",".eleventh_dom",".twelfth_dom"];
	//up
	$(".body_dom").swipeUp(function(){//向下屏
		// if(pageNum >=6 || GetCurrentStyle(document.getElementsByClassName("loading")[0],"opacity") == 1) return;
        if(pageNum >=3) return;
		$(domArr[pageNum]).animate({ top: "-100%" }, 500);
		$(domArr[pageNum + 1]).animate({ top: 0 }, 500);
		pageNum++;
		showArrow();
		setTimeout(function(){
			$(".home_img").hide();
			$('.box_'+pageNum).find(".home_img").show();
		},200)
	}).swipeDown(function(){//向上屏
			if (pageNum == 0) {
				return;
			}
			$(domArr[pageNum - 1]).animate({top:"0"},500);
			$(domArr[pageNum]).animate({top:"100%"},500);
			pageNum --;
			showArrow();
			setTimeout(function(){
				$(".home_img").hide();
				$('.box_'+pageNum).find(".home_img").show();
				cricle(".s_bottom");
			},200)
		})
	//首屏和最后一屏无上下箭头
	function showArrow(){
		if(pageNum == 6){
			$(".arrow").css({"display":"none"});
		}else{
			$(".arrow").css({"display":"block"});
		}
	}
	//是否客户端
	function isClient(){
		return/tctravel/.test(navigator.userAgent.toLowerCase())
	}
	/*答题游戏*/
	$(".first,.second .left,.second .right").each(function(index,item){
		$(item).on("click",function(){
			if($(item).hasClass("act")){
				$(item).removeClass("act");
			}else if(parseInt($(".act").length,10)<3){
				$(item).addClass("act");
				if(parseInt($(".act").length,10)>=3){
					issuccess()
				}
			}else{
				return ;
			}
		})
	})

	/*打开攻略*/
	$(".goolve_btn").on("click",function(){
		$(".goolve").openPop();
	})
	//打开弹窗
    $.fn.openPop = function () {
        $(this).removeClass('none');
		$(".close,.todoshare").on("click",function(){
			$('.bg').closePop();
		})
    }
    //关闭弹窗
    $.fn.closePop = function () {
        $('.bg').addClass('none');
    }
    $(".lose .close,.answer .close,.todoshare").on("click",function(){
    	$(".first,.left,.right").removeClass("act");
    })
	function is_iPad(){     
		var ua = navigator.userAgent.toLowerCase();     
		if(ua.match(/iPad/i)=="ipad") {   
			return true;     
		} else {     
			return false;     
		}     
	} 
	function issuccess(){
		var act=$(".act");
		var arr=[];
		for(var i=0;i<act.length;i++){
			var attr_id=$(act[i]).attr("attr-id");
			arr.push(parseInt(attr_id,10));
		}
		
		if(arr.indexOf(0)!=-1){
			$(".lose").openPop();
		}else{
			$('.answer').openPop();
		}
	}
	
	var winGift={
        bindEvent:function(argument) {
            //  提交
            var that=this;
            var $btnSub=$(".submit");
            $btnSub.on('click', function() {
                //  验证
                if(that.checkFn()) {
                    var name = $("#infoName").val(),
                    	phone = $("#infoPhone").val(),
                    	url = "/youlun/json/foolapply.html?Username="+name+"&Phonenumber="+phone+"&ActivityId=100&Remark=";
                    $.ajax({
						url: url,
						dataType: 'json',
						success: function (data) {
							that.submitBack(data);							
						},
						fail:function(){
							that.showTips("提交失败");
						}
					});
                }
            });
            $(".share").on('click',function(){
            	if(isClient()) {					
					location.href = 'http://shouji.17u.cn/internal/share/all';
				}else{
					$('.bg').closePop();
            		$('.todoshare').openPop();
				}            	
            })
        },
        //  验证方法
        checkFn: function() {
            var that = this;
            var regName = /^(.*?)+[\d~!@#$%^&*()_\-+\={}\[\];:'"\|,.<>?！￥……（）——｛｝【】；：‘“’”、《》，。、？]/;
            var regPhone = /^1[3,4,5,7,8]\d{9}$/i;
            //  姓名
            if ($('#infoName').val().trim() == '') {
                that.showTips("请输入姓名");
                return false;
            }
            if (regName.test($('#infoName').val().trim())) { 
                that.showTips("姓名错误");
                return false;
            }
            //  手机号
            if ($('#infoPhone').val().trim() == '') {
                that.showTips("请输入手机号");    
                return false;
            }
            if (!regPhone.test($('#infoPhone').val().trim())) {   
                that.showTips("手机号错误");         
                return false;
            }
            return true;
        },
        //  提交回调
        submitBack: function(data) {
            var that = this;            
            switch(data.RspCode){
				case -2:	//过期
					$('.bg').addClass('none');
					$('.game_over').openPop();
					break;
				case 0: //失败
					that.showTips("提交失败");
					break;
				case 1: //成功
					$('.bg').addClass('none');
					$('.success').openPop();
					break;
				case 2:	//重复
					$('.bg').addClass('none');
					$('.participated').openPop();
					break;
				default:
					that.showTips("提交失败");
			}
        },
        //  打开提示
        showTips: function(txt) {
            $(".tip_layer").html(txt).css("display","block");
            setTimeout(function(){$(".tip_layer").css("display","none")},1000)
        },
        //  打开弹窗方法
        openPopFn: function($dom) {
            var $pop = $('.pop');           
            $pop.removeClass('none');
            $dom.removeClass('none');
            $('body').css({'height': '100%', 'overflow-y': 'hidden'});  
        },
        //  关闭弹窗方法
        closePopFn: function() {
            var $pop = $('.pop');
            var $ch = $pop.children('.pop-contain');            
            $ch.addClass('none');
            $pop.addClass('none');
            $('body').css({'height':'auto', 'overflow-y': 'auto'});
        }
    }
    winGift.bindEvent();
})();