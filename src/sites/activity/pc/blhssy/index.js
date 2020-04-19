//切换图片
var ssyPic = {
    navli:$(".hdzqtit li"),
    img:$(".pichdzt img"),
    thisimg:"",
    changeImg:function(){
        var me= this;
        var box = $(".pichdzt");
        $(".hdzqtit li").on("click",function(){
            box.addClass("none");
            var index=$(this).index()+1;
            $(this).addClass("active").siblings().removeClass("active").parent("ul").attr("class","navhdzt"+index);
            //me.thisimg = $(this).data("img");
            $(box[$(this).index()]).removeClass("none")
        });
    }
}
//国内游资源
var gnyPro = {
    getData:function(){
        $.ajax({
            url: "//gny.ly.com/ZhuanTi/CampaignZhuanTiList?&activityId=3284&periodIds=1640",
            dataType: "jsonp",
            success: function(data){
                // var dataEle = doT.template($("#gny").text());
                // $(".main4 ul").html(dataEle(data));
                 ghyAndyl(data,$(".main4 ul"));
                
            }
        })

    }
}
//游轮资源
var ylPro = {
    data:[{"ActivityProduct":{
        "LineIdpid":"126311",
        "MainTitle":"【嘻哈集结 舞林争霸】【天海邮轮-新世纪号】2016年11月16日 上海-福冈-长崎-济州-上海 5晚6日游",
        "SubTitle":"免费选房号主题嘻哈秀",
        "LeavePortCityName":"上海",
        "AmountDirect":"",
        "PcUrl":"http://www.ly.com/youlun/tours-126311.html",
        "ImagePath":"http://pic4.40017.cn/cruises/2016/07/08/15/0Xi3dE_640x370_00.png",
        "LineProperty":1
        }
    },
    {
        "ActivityProduct":{
        "LineIdpid":"113293",
        "MainTitle":"【美国公主邮轮-蓝宝石公主号】11月28日 上海-济州-釜山-长崎-上海 5晚6日游",
        "SubTitle":"上海-福冈-长崎-济州-上海",
        "LeavePortCityName":"上海",
        "AmountDirect":"",
        "PcUrl":"http://www.ly.com/youlun/tours-113293.html",
        "ImagePath":"http://pic4.40017.cn/cruises/2016/07/08/14/zNq3U4_640x370_00.png",
        "LineProperty":1
        }
       
    },
    {
        "ActivityProduct":{
        "LineIdpid":"129855",
        "MainTitle":"【皇家加勒比-海洋量子号】2016年12月9日 上海-釜山-长崎-上海 5晚6日游",
        "SubTitle":"上海-釜山-长崎-上海",
        "LeavePortCityName":"上海",
        "AmountDirect":"",
        "PcUrl":"http://www.ly.com/youlun/tours-129855.html",
        "ImagePath":"http://pic4.40017.cn/cruises/2016/07/08/14/i3UJrp_640x370_00.png",
        "LineProperty":1
        }

    },
    {"ActivityProduct":{
        "LineIdpid":"126686",
        "MainTitle":"【歌诗达邮轮-赛琳娜号】2016年12月29日 上海-济州-仁川-上海 4晚5日游",
        "SubTitle":"上海-济州-仁川-上海",
        "LeavePortCityName":"上海",
        "AmountDirect":"",
        "PcUrl":"http://www.ly.com/youlun/tours-126686.html",
        "ImagePath":"http://pic4.40017.cn/cruises/2016/10/10/14/bGvQrc_640x370_00.jpg",
        "LineProperty":1
    }
    }],
    getData:function(){
        // var dataEle = doT.template($("#gny").text());
        //         $(".main5 ul").html(dataEle(this.data));
        //         alert(dataEle(this.data))
                 ghyAndyl(this.data,$(".main5 ul"));
    }
}
ylPro.getData();
gnyPro.getData();
ssyPic.changeImg();
function ghyAndyl(data,ele){
     
    for(var i=0; i<data.length; i++){
        var newData=data[i].ActivityProduct;
        var classsmall = "",
        produnctDiv = "",
        pname="",
        jf="",
        price="",
        divend ='';
        var LineType ="";
          if(newData.LineProperty==1||newData.LineProperty==5){
            LineType ="跟团游";
          }else if(newData.LineProperty==3){
            LineType ="自由行";
          }
        if(newData.AmountDirect){
          produnctDiv='<div class="productName">'+newData.MainTitle+'</div><div class="smallLi">';
          price='&yen;<i>'+newData.AmountDirect+'</i>人/起';
           divend ='</div>';

        }else{
            classsmall='class="smallLi"';
            pname = '<p>'+newData.MainTitle+'</p>';
             jf='<span class="favorable"><b>百旅会</b>400积分可抵800元</span>';
            price='<div class="ssyth"></div>';
        }
         var content='<li '+classsmall+'>'+produnctDiv+'<a href="'+newData.PcUrl+'" target="_blank">\
         <img src="'+newData.ImagePath+'"  class="pic" title="'+newData.MainTitle+'">\
         <div class="info">'+pname+'<div class="small">\
                            <span>'+newData.LeavePortCityName+'出发·'+LineType+'</span>\
                        </div>\
                        <div class="brief">'+newData.SubTitle+'</div>\
                        <div class="other">'+jf+'<span class="price">'+price+'<b></b>\
                            </span>\
                        </div>\
                    </div>\
                </a>'+divend+'</li>';
                ele.append(content);

    }

}


   $(window).on('scroll', function () {
    var top = $(window).scrollTop();
    if (top < 500) {
      $('.silderbar').hide();
      $(".signNav").hide();
    } else {
      $('.silderbar').show();
       $(".signNav").show();
    }
  });

  $('.silderbar>ul').scrollspy({
    topH: 0,
    pClass: ".silderbar",
    curClass: 'active',
    contentClass: '.J_NavBox',
    tabList: $(".silderbar li"),
    scrollFn: function (el, isDown) {
      switch (isDown) {
        case 0:
          /*el.hide();*/
          break;
        case 1:
          el.show();
          break;
        case 2:
          el.show();
          break;
      }
    }
  });
   $(".gotop").on("click", function () {
    $("html,body").animate({scrollTop: 0}, 500);
  });

//签到有礼
  var Index = {
      memberId:0,
      EncryptUserId:"",
      SignInstate:false,
      reg3 :/^[A-Za-z0-9]+$/i,//验证码
      reg4 :/^1[34578]\d{9}$/,//手机号码
      ele:{
          "signIcon":$(".signIcon"),
          "signBox":$(".signBox"),
          "recBox":$(".recBox"),
          "signNun":$(".signNun"),
          "signDate" :$(".signDate"),
          "signBtn":$(".signBtn"),
          "submit":$(".submit"),
          "bg":$(".bg")
      },
      dialog:{
          show:function(type,fn){
              if(type == "sign"){
                  $(".signBox").show();
                  $(".signLi").show();
                  if(typeof fn === "function"){
                      fn();
                      Index.getencryptUserId();//签到
                  }
              }else{
                  $(".recBox").show();
                  if(typeof fn === "function"){
                      fn();
                    //   Index.subtabfn();//填写领奖卡
                  }
              }
  
          }
      },
      isSubmit:true,
      isLogo:function(){
          var me =this;
          this.memberId = getMemberId();
          if(this.memberId=="0"){
              window.location.href="https://passport.ly.com/?pageurl=" + encodeURIComponent(window.location.href);
          }else{
              me.ele.signBox.removeClass("none");
              me.ele.recBox.addClass("none");
              me.ele.bg.removeClass("none");
              this.getencryptUserId();
          }
          
      },
      //获取积分签到情况
      getencryptUserId:function(){
          var me = this;
          var endDate = new Date("2016/11/30");
          var today = new Date();
          if(today > endDate){
              $(".signBtn").addClass("notSign").html("活动结束");
          }
           var param = {
                MemberId: me.memberId,
                ExActivityId: 43082,
                Platform: 1
            }
            $.ajax({
                type: 'post',
                url: window.cnhost+'/intervacation/api/SignIn/QuerySignInInfos',
                data: param,
                dataType: 'json',
                success: function (data) {
                    if(data.Code =="4000"){
                         window.SignInTimeList = data.Data.result.SignInTimeList;
                         var count = data.Data.result.SignInCount;
                          me.ele.signNun.html("已签到"+count+"天啦~");
                                         me.ele.signDate.html("");
                                            for(var i=0; i<15;i++){
                                                var classname = "snone";
                                                var num = i+1;
                                                if(i<count){
                                                    classname = "right";
                                                }
                                                var liele = '<li class="'+classname+'"><span class="icon_sign"></span><span>D-'+num+'</span></li>';
                                                me.ele.signDate.append(liele);
                                            }
                      
                         $.ajax({
                            type: 'post',
                            url: window.cnhost+'/intervacation/api/SignIn/SignIn',
                            data: param,
                            success: function(data) {
                                if (data.Code === 4000) {
                                    if (data.Data.result.Result == true) {
                                        var lastTime1 = data.Data.result.SignInTime.split("T")[0];
                                        var lastTime2 = '';
                                        if (SignInTimeList.length) {
                                            lastTime2 = SignInTimeList[SignInTimeList.length - 1].split("T")[0];
                                        }
                                        if (lastTime1 == lastTime2) {
                                            me.ele.signBtn.addClass("notSign").html("今日已签");    
                                        }
                                        
                                    } else {
                                        alert('获取信息失败');
                                    }
                                }
                            }
                        })
                    }
                }
            });
      },
      //签到成功
      singnSuc:function(){
          var me =this;
           var param = {
                    MemberId: me.memberId,
                    ActivityId: 43082,
                    Platform: 1
                }
                $.ajax({
                    type: 'POST',
                    url: window.cnhost+'/intervacation/api/SignIn/SignIn',
                    data: param,
                    success: function (data) {
                        if (data.Code === 4000) {
                            if (data.Data.result.Result == true) {
                                var count = data.Data.result.SignCount;
                                if(count==3 || count == 11){
                                    me.dialog.show("award",function(){
                                        $(".recAll").addClass("tyk");
                                    });//award表示奖品卡页面
                                }else if(count == 7){
                                    me.dialog.show("award",function(){
                                        $(".recAll").addClass("xbk");
                                        $(".xbk .addIn").removeAttr("disabled");
                                        $(".xbk .addIn").val("");
                                    });
                                }else{
                                     me.ele.signBtn.addClass("notSign").html("今日已签");
                                     me.ele.signNun.html("已签到"+count+"天啦~");
                                    me.ele.signDate.html("");
                                            for(var i=0; i<15;i++){
                                                var classname = "snone";
                                                var num=i+1;
                                                if(i<count){
                                                    classname = "right";
                                                }
                                                var liele = '<li class="'+classname+'"><span class="icon_sign"></span><span>D-'+num+'</span></li>';
                                                me.ele.signDate.append(liele);
                                            }
                                }
                               
                            } else {
                                alert('签到失败！请重新签到')
                            }
                        }
                    }
                })
      },
      //点击签到积分
      clicksignBtnFn:function(){
          var me = this;
          me.ele.signBtn.on("click",function(){
              if(!$(this).hasClass("notSign")){
                // me.ele.recBox.removeClass("none");
                // me.ele.signBox.addClass("none");
                me.singnSuc();
              }
          })

      },
      //失去焦点验证
      blurfn:function(){
          var me = this;
          $(".phoneIn").blur(function(){
               if(!me.reg4.test($(this).val())){
                  $(".phoneBox .warning").removeClass("none");
              }else{
                  $(".phoneBox .warning").addClass("none");
              }
          })
          $(".codeIn").blur(function(){
              if(!me.reg3.test($(this).val())){
                  $(".codeBox .warning").removeClass("none");
              }else{
                  $(".codeBox .warning").addClass("none");
              }
          })
      },
      //提交表单
      subtabfn:function(){
          var url = 'http://www.ly.com/dujia/AjaxHelper/ActivityHandler.ashx?Type=SAVEACTIVITYUSERINFO&ActivityUserInfo=';
              var Jname= $(".nameIn").val();
              var Jphone= $(".phoneIn").val();
              var Jaddress= $(".addIn").val();
              var Jcode= $(".codeIn").val();
              var Jcity= $(".cityIn").val();
  
              var flag=true;
  
              if(!this.reg4.test(Jphone)){
                  $(".phoneBox .warning").removeClass("none");
                  flag=false;
              }
              if (!this.reg3.test(Jcode)) {
                  $(".codeBox .warning").removeClass("none");
                  flag = false;
              }
  
              if(flag==false){
                  return false;
              }
  
              var getRefId = function(){
                  var url = location.href,
                      hasRefId = /[#\?&]refid=(\d+)/i.exec(url);
                  if(hasRefId&&hasRefId[1]){
                      return "&refid="+hasRefId[1];
                  }else{
                      return 0;
                  }
              };
  
              var param = {
                  "UActivityid": "43081",
                  "UAddress": encodeURIComponent(Jaddress),
                  "UDestinationCity": encodeURIComponent(Jcity),
                  "UMobile": Jphone,
                  "URefid": getRefId(),
                  "UReservedContent": "",
                  "UReservedContentExt": encodeURIComponent(Jname)
              };
  
              url += (JSON.stringify(param)) + "&checkCode=" + Jcode;
              if(this.isSubmit){
                  $.ajax({
                      url: url,
                      dataType: "jsonp",
                      success:function(data){
                          var code = parseInt(data.code, 10);
                          switch (code) {
                              case 4000:
                                  if(data.data.IsSuccess == true){
                                      this.isSubmit = false;
                                      $(".J_submit").removeClass("submit").addClass("subBtn");
                                      $(".J_codeImg").attr("src","http://www.ly.com/dujia/CheckCode.aspx?"+(+new Date()));
                                  }else{
                                      $(".codeBox .warning span").html(data.data.Message);
                                      $(".codeBox .warning").removeClass("none");
                                      $(".J_codeImg").attr("src","http://www.ly.com/dujia/CheckCode.aspx?"+(+new Date()));
                                  }
                                  break;
                              default:
                                  $(".codeBox .warning span").html(data.data.Message);
                                  $(".codeBox .warning").removeClass("none");
                                  break;
                          }
                      }
                  });
              }
      },
      subclickfn:function(){
          var me = this;
          this.ele.submit.on("click",function(){
              if(me.isSubmit){
                  me.SignInstate=true;
                  me.subtabfn();
              }
          })
      },
      showbox:function(){
          var me= this;
          me.ele.signIcon.on("click",function(){
              me.isLogo();
          })
      },
      close:function(e){
          var me = this;
          e.click(function(){
              me.ele.signBox.addClass("none");
              me.ele.recBox.addClass("none");
              me.ele.bg.addClass("none");
          })
      },

      init:function(){
          this.showbox();
          this.clicksignBtnFn();
          this.subclickfn();
          this.blurfn();
          this.close($(".closeBtn"));
          this.close(this.ele.bg);
      }
  }
  Index.init();
Index.createBkOne = function (data,ele){
    var hottag ='<span class="hottag"></span>',
        add = '<s></s>';
    if(data.CycleId=="4169"){
        hottag="";
        add="";
    }
     var goway="自由行";
    if(data.LineType=="0"){
        goway="跟团游";
    }
    var url = Activity.tmplProAttr(data);
    var bkStr = $('<a '+ url +' >\
                    <span class="s11tag"></span>\
                        <img src="'+ data.ImgUrl +'" alt="'+ data.MainTitle +'" title="'+ data.MainTitle +'" class="pic">\
                        <div class="info">\
                            <p>'+ data.MainTitle +'</p>\
                            <div class="small">'+hottag+ '<span class="goWhere">'+add+ data.DepartCity +'出发·'+goway+'</span>\
                            </div>\
                            <div class="brief">\
                            </div>\
                            <div class="other">\
                                <span class="favorable">\
                                    <b>百旅会</b>\
                                    '+ data.DedicatLine +'\
                                </span>\
                                <span class="price">\
                                    &yen;<i>'+ data.Preferential +'</i>起/人\
                                    <b></b>\
                                </span>\
                            </div>\
                        </div>\
                    </a>');
    var iHtml = "<i>" + data.Explosion.replace(/##/g,"</i><i>") + "</i>";
    bkStr.find(".brief").html(iHtml)
    ele.html(bkStr);
};
Index.createcgTwo= function createcgTwo(data){
    var url = Activity.tmplProAttr(data);
    var goway="自由行";
    if(data.LineType=="0"){
        goway="跟团游";
    }
    var bkStr = $('<a '+ url +' >\
                    <span class="s11tag"></span>\
                        <img src="'+ data.ImgUrl +'" alt="'+ data.MainTitle +'" title="'+ data.MainTitle +'" class="pic">\
                        <div class="info">\
                            <p>'+ data.MainTitle +'</p>\
                            <div class="small">\
                            <span class="hottag"></span>\
                                <span class="goWhere"><s></s>'+ data.DepartCity +'出发·'+goway+'</span>\
                            </div>\
                            <div class="brief">\
                            </div>\
                            <div class="other">\
                                <span class="favorable">\
                                    <b>百旅会</b>\
                                    '+ data.DedicatLine +'\
                                </span>\
                                <span class="price">\
                                    &yen;<i>'+ data.Preferential +'</i>起/人\
                                    <b></b>\
                                </span>\
                            </div>\
                        </div>\
                    </a>');
    var iHtml = "<i>" + data.Explosion.replace(/##/g,"</i><i>") + "</i>";
    bkStr.find(".brief").html(iHtml)
    $("#bkOne").html(bkStr);
}
module.exports = Index;




