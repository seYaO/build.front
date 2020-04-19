var Index = {};
var obj = {
    'FeeMin':1,
    'FeeMax':499
};
require('modules/slider/0.2.0/index');
var Departure = require('modules/departure/0.3.0/index');
var DepartureEnd = require('modules/departure/0.3.1/index');
var PickCal = require("calendar/0.2.0/index");
var ProjectId = "";

/**
 * 初始化功能
 * 
 */
Index.init = function(){
    //幻灯片
    $(".cus-infosItem-right").PicCarousel({
        "posterWidth":720,	//幻灯片第一帧的宽度
		"posterHeight":435, //幻灯片第一张的高度
        "scale":0.7,		//记录显示比例关系
    });
    this.tabFunc();
    this.formFunc();
    this.saveList();
}

/**
 * 头部tab切换，量身定制广告的跑马灯
 * 
 */
Index.tabFunc = function(){
    $('.cus-topTab li').on('click',function(){
        var $self = $(this);
        var $tabs = $('.cus-topTab li');
        var $content = $('.cus-infosItem');
        if(!$self.find('p').hasClass('cur')){
            $tabs.find('p').removeClass('cur');
            $self.find('p').addClass('cur');
            $content.addClass('none');
            $($content[$self.index()]).removeClass('none');
        }
    });
    var count = $($('.cus-autoInfo ul li')[0]).height();
    function autoScroll(){
        setTimeout(function(){
            var dom = $($('.cus-autoInfo ul li')[0]).clone();
            $($('.cus-autoInfo ul li')[0]).remove();
            $('.cus-autoInfo ul').animate({'bottom':count+'px'});
            $('.cus-autoInfo ul').append(dom);
            autoScroll();
        },5000)    
    }
    autoScroll();
}

/**
 * 表单处理事件
 * 
 */
Index.formFunc = function(){

    //出发地
    new Departure({
        className:".J_startCity",
        eventType:'click',
        success:function(param){
            var dom = param.parent;
            dom.find('input').val(param.cityname);
            dom.find('input').attr('data-cityId',param.cityid);
            Index.renderList(param.cityname,dom.parents('li').index());
        }
    }).init();

    //目的地
    new DepartureEnd({
        className:".J_endCity",
        eventType:'click',
        success:function(param){
            var dom = param.parent;
            ProjectId = $('#endPopleave .leavecity .sub-scity-tips .clearfix li.cur').attr('projectid');
            dom.find('input').val(param.cityname);
            dom.find('input').attr('data-cityId',param.cityid);
            Index.renderList(param.cityname,dom.parents('li').index());
        }
    }).init();

    //渲染加载时间组件
    var cal = new $.Calendar({
        skin: "white",
        width: 1000
    });
    var _currentDate = new Date();
    $('.J_cusTime').on('click',function(){
        var text,index;
        index = $(this).parents('li').index();
        cal.pick({
            elem: this,
            startDate: _currentDate,
            endDate: '',
            mode: "rangeFrom",
            offset: {
                left: ''
            },
            currentDate: '',
            fn: function (year, month, day, td) {
                text = year+"-"+month+"-"+day;
                Index.renderList(text,index);
                obj.StartDate = text;
            }
        });
    });

    //头部tab切换
    $('.J_cusType .cus-select').on('click',function(){
        var $self = $(this);
        var $content = $('.J_cusType .cus-select');
        var text,index;
        if(!$self.hasClass('cur')){
            $content.removeClass('cur');
            $self.addClass('cur');
            text = $self.text();
            index = $self.parents('li').index();
            Index.renderList(text,index);
            obj.DemandType = $self.attr('data-id');
            if($self.attr('data-id') == 2){
                $('.TeamOrCompanyName').removeClass('none').val('');
                $('.teamOrCompanyName').removeClass('none');
                $('.teamOrCompanyName span').text('');
                $('.teamOrCompanyName em').removeClass('check_valid');
                $('.J_TeamOrCompanyName').val('');
                $('.TeamOrCompanyName').addClass('cus-formLi');
            }else{
                $('.TeamOrCompanyName').addClass('none').val('');
                $('.teamOrCompanyName').addClass('none');
                $('.teamOrCompanyName span').text('');
                $('.teamOrCompanyName em').removeClass('check_valid');
                $('.J_TeamOrCompanyName').val('');
                $('.TeamOrCompanyName').removeClass('cus-formLi');
            }
        }
    })

    //数量减
    $('.J_minCount').on('click',function(){
        var $self = $(this);
        var value = parseInt($self.siblings('input').val());
        var text,index;
        if($self.hasClass('disCount')){
            return;
        }
        value--;
        if(value == $self.siblings('input').attr('data-id')){
            $self.addClass('disCount');
        }
        $self.siblings('input').val(value);
        if($self.hasClass('J_num')){
            text = parseInt($('.J_adult').val())+parseInt($('.J_child').val());
            index = $self.parents('li').index();
            Index.renderList(text,index);
        }else{
            index = $self.parents('li').index();
            Index.renderList(value,index);
        }
    });

    //数量加
    $('.J_maxCount').on('click',function(){
        var $self = $(this);
        var value = parseInt($self.siblings('input').val());
        if($self.hasClass('disCount')){
            return;
        }
        value++;
        if(value != $self.siblings('input').attr('data-id')){
            $self.siblings('.J_minCount').removeClass('disCount');
        }
        $self.siblings('input').val(value);
        if($self.hasClass('J_num')){
            text = parseInt($('.J_adult').val())+parseInt($('.J_child').val());
            index = $self.parents('li').index();
            Index.renderList(text,index);
        }else{
            index = $self.parents('li').index();
            Index.renderList(value,index);
        }
    });

    //人均消费选择
    $('.J_cusCost .cus-select').on('click',function(){
        var $self = $(this);
        var $content = $('.J_cusCost .cus-select');
        var text,index;
        if(!$self.hasClass('cur')){
            $content.removeClass('cur');
            $self.addClass('cur');
            text = $self.text();
            index = $self.parents('li').index();
            Index.renderList(text,index);
            obj.FeeMin = $self.attr('data-min');
            obj.FeeMax = $self.attr('data-max');
        }
    });

    //监听目的地城市输入
    // $(".J_cusEnd").on('keyup',function(){
    //     var $self = $(this);
    //     var index = $self.parents('li').index();
    //     var text = $self.val();
    //     ProjectId = $(this).attr('projectid');
    //     Index.renderList(text,index);
    // });

    //监听联系人、联系电话、企业名称输入
    $('.J_cuskeyup').on('keyup',function(){
        var $self = $(this);
        var index = $self.parents('li').index();
        var text = $self.val();
        Index.renderList(text,index);
    });

    //头部按钮
    $('.cus-topBtn a').on('click',function(){
        var $self = $(this);
        var id = $self.attr('data-id');
         $('.J_cusType .cus-select').removeClass('cur');
        if(id == 1){
            $($('.J_cusType .cus-select')[0]).addClass('cur');
            $('.TeamOrCompanyName').addClass('none').val('');
            $('.teamOrCompanyName').addClass('none');
            $('.teamOrCompanyName span').text('');
            $('.J_TeamOrCompanyName').val('');
        }else{
            $($('.J_cusType .cus-select')[1]).addClass('cur');
            $('.TeamOrCompanyName').removeClass('none').val('');
            $('.teamOrCompanyName').removeClass('none');
            $('.teamOrCompanyName span').text('');
            $('.J_TeamOrCompanyName').val('');
        }
    });

    //关闭弹框
    $('.cus-dialog-close,.cus-dialog-btn').on('click',function(){
        $('.cus-mask').hide();
        $('.cus-dialog').hide();
        window.location.reload();
    });

    //监听滚动
    var tabHeight = $(".cus-topTab").height();
    var minHeight = $(".cus-topTab").offset().top - tabHeight;
    var maxHeight = minHeight + $(".cus-content").height() - tabHeight;      
     $(window).scroll(function(){
         var scrollHeight = $(window).scrollTop();
         if (scrollHeight > minHeight) {
            if(scrollHeight < maxHeight){
                $(".J_topTab").addClass("current");
            }else {
                $(".J_topTab").removeClass("current");
            }
        }
        else{
            $(".J_topTab").removeClass("current");
        }
     });      
}

/**
 * 渲染右侧表单
 * 
 * @param {any} text 文案内容 
 * @param {any} index 渲染节点
 */
Index.renderList = function(text,index){
    var $content = $('.J_formList li');
    if(text){
        if(index == 8 && !Index.checkPhone(text)){
            $($content[index]).find('span').siblings('em').removeClass('check_valid');
        }else{
            $($content[index]).find('span').siblings('em').addClass('check_valid');
        } 
    }
    else{
         $($content[index]).find('span').siblings('em').removeClass('check_valid');
    }
    
    $($content[index]).find('span').text(text);
}

/**
 * 验证手机号码
 * 
 * @param {any} num 手机号码 
 * @returns 
 */
Index.checkPhone = function(num){
    return /^1[3,4,5,7,8][0-9]{9}$/.test(parseInt(num));
}

/**
 * 验证清单有效性
 * 
 * @returns 
 */
Index.checkList = function(){
    var $content = $('.J_formList span');
    var $Rcontent = $('.cus-formLeft-main .cus-formLi');
    var $tags = $('.J_formList em');
    var tag = true;
    for(var i = 0;i<$content.length;i++){
        if($($content[i]).text() == '' && !$($content[i]).parents('li').hasClass('check_phone') && !$($content[i]).parents('li').hasClass('none')){
            $($Rcontent[i]).find('.cus-Cinput').show();
            $($Rcontent[i]).find('input').addClass('cus-empty');
            // $($content[i]).siblings('em').removeClass('check_valid');
            tag = false;
        }else{
            if($($content[i]).hasClass('check_phone')){
                if(Index.checkPhone($($content[i]).text())){
                    // $($content[i]).siblings('em').addClass('check_valid');
                    $($Rcontent[i]).find('.cus-Cinput').hide();
                    $($Rcontent[i]).find('input').removeClass('cus-empty');
                }else{
                    $($Rcontent[i]).find('.cus-Cinput').show();
                    $($Rcontent[i]).find('input').addClass('cus-empty');
                    // $($content[i]).siblings('em').removeClass('check_valid');
                    tag = false;
                }
            }else{
                // $($content[i]).siblings('em').addClass('check_valid');
                $($Rcontent[i]).find('.cus-Cinput').hide();
                $($Rcontent[i]).find('input').removeClass('cus-empty');
            }
        }
    }
    return tag
}

/**
 * 保存清单内容
 * 
 */
Index.saveList = function(){
    $('.J_cusSave').on('click',function(){
        var $self = $(this);
        if(!Index.checkList()){
            return;
        }
        if($self.hasClass('cus-loading')){
            return;
        }
        obj.PlayDays = $('.J_PlayDays').val();
        obj.AdultNum = $('.J_adult').val();
        obj.ChildNum = $('.J_child').val();
        obj.CustomerName = $('.J_CustomerName').val();
        obj.CustomerMobile = $('.J_CustomerMobile').val();
        obj.TeamOrCompanyName = $('.J_TeamOrCompanyName').val();
        obj.StartCity = $('.J_cusStart').val();
        obj.DestinationCity = $('.J_cusEnd').val();
        obj.StartCityId = $('.J_cusStart').attr('data-cityid');
        obj.DestinationCityId  = $('.J_cusEnd').attr('data-cityid');
        obj.FromPlatment = 1025;
        obj.ProjectId = ProjectId;
        $self.addClass('cus-loading');
        $self.text('保存中..');
        $.ajax({
            url:'/intervacation/ajax/custom/savelist',
            type:'post',
            data:obj,
            success:function(data){
                if(data.Code == 4000 && data.Data.IsRepeat == 0){
                    $('.cus-mask').show();
                    $('.J_sucTip').show();
                }
                else if(data.Code == 4000 && data.Data.IsRepeat == 1){
                    $('.cus-mask').show();
                    $('.J_sucTip i').removeClass("icon-suc").addClass("icon-wram");
                    $('.J_suc').hide();
                    $('.J_repeat').show();
                    $('.J_sucTip').show();
                }
                else{
                    $('.cus-mask').show();
                    $('.J_wramTip').show();
                }
                $self.removeClass('cus-loading');
                $self.text('提交');
            }
        })
    })
}

module.exports = Index;