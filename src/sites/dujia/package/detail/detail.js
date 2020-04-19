define('dujia/package/detail/index', ['common/0.1.0/index', 'scrollspy/0.3.0/index', 'dialog/0.1.0/index', 'googleMap/0.2.0/index', 'dialog/0.2.0/dialog', 'freePackage/visa/0.2.0/index', 'comment/0.3.0/index', 'slidertoolbar/0.1.0/index', 'freePackage/packaged/0.1.0/index', 'datepicker/0.2.1/datepicker', 'datepicker/0.2.0/calendar-group', 'dujia/package/detail/routerdetail', 'dujia/package/detail/fee', 'dujia/package/detail/tourknow', 'dujia/package/detail/warningsafe', 'dujia/package/detail/flyandhoteldetail', 'dujia/package/detail/insurancedetail', 'dujia/package/detail/morehotel', 'dujia/package/detail/pricebox', 'dujia/package/detail/nearshop', 'dujia/package/detail/shoppro', 'dujia/package/detail/shopcity', 'dujia/package/detail/findshop', 'dujia/package/detail/visa', 'dujia/package/detail/roomdetail', 'dujia/package/detail/additionprice', 'dujia/package/detail/preferential', 'timer/0.1.0/index', 'login/0.1.0/index'], function(require, exports, module) {

  var Group = {};
  var current_request;
  var Common = require("common/0.1.0/index"),
      Monitor = window.Monitor,
      scrollspy = require("scrollspy/0.3.0/index"),
      dialog = require("dialog/0.1.0/index"),
      googleMap = require("googleMap/0.2.0/index"),
      newdialog = require("dialog/0.2.0/dialog"),
      visa = require("freePackage/visa/0.2.0/index"),
      Comments = require("comment/0.3.0/index"),
      Slidertoolbar = require("slidertoolbar/0.1.0/index"),
      Packaged = require("freePackage/packaged/0.1.0/index");
      DatePicker = require("datepicker/0.2.1/datepicker");

  var GroupCalendar = require("datepicker/0.2.0/calendar-group");
  var citytimer = null;
  var $dialog = new newdialog({
      skin: 'default',
      template: {
          modal: {
              html: '<div class="dialog_modal_gp">' +
              '<div class="dialog_modal_content" data-dialog-content></div>' +
              '</div>'
          }
      }
  });
  var $dialog1 = new newdialog({ skin: 'J_fullMessage' });
  var maxNum = 9,
      fKey;
  Group = {
      lineId: $("#lineId").val(),
      param: {
          "LineId": parseInt($("#lineId").val()),
          "IsDefault": 1,
          "LineDate": "",
          "Adult": 2,
          "Child": 0,
          "ChildAges": [],
          "Flight": [
              {
                  "DepartCode": "",
                  "ArriveCode": "",
                  "DepartDate": "",
                  "ReturnDate": "",
                  "IsDirect": 1,
                  "FlightNos": ["1524"],
                  "IsRoundTrip": 1
              }
          ],
          "Hotel": {
              "RoomCount": "1",
              "Hotels": [{
                  "StartDate": "",
                  "Nights": "3",
                  "CityId": "3187",
                  "Index": "1",
                  "Rooms": [{
                      "HotelId": "12230",
                      "RoomId": "0",
                      "RateCode": "",
                      "RoomCount": "1",
                      "SupplierId": "4",
                      "IsDirect": "0"
                  }]
              }]
          },
          "Insurance": {
              "AccidentCode": "",
              "CancleCode": ""
          }
      },
      tmplParam: {
          "Adult": 2,
          "Child": 0,
          "ChildAges": [],
          "RoomCount": 1
      },
      postData: {
          "LineId": 364264,
          "LineDate": "2016-08-17",
          "Adult": 2,
          "Child": 1,
          "ChildAges": [],
          "RoomCount": 1,
          "FlightIndex": 1,
          "Flights": [],
          "Hotels": [],
          "AccidentCode": "",
          "CancelCode": "",
          "AdditionProducts":[],
          "EndUrl": ''
      },
      visaParam: {
          CountryId: 2946,
          VisaTypeId: 301,
          Regions: [{
              Id: 515,
              Name: "上海"
          }, {
              Id: 532,
              Name: "北京"
          }, {
              Id: 533,
              Name: "广州"
          }]
      },
      travelData: {},
      CalendarData: [],
      hotelParam: {
          "LineId": $("#lineId").val(),
          "LineDate": "2016-04-03",
          "Adult": 2,
          "Child": 0,
          "ChildAges": [],
          "IsConditions": 1,
          "Hotels": [{
              "DestId": 20606,
              "HotelId": 5742,
              "RoomId": 24831,
              "StartDate": "2016-04-03",
              "Nights": 1,
              "IsDirect": 1,
              "RoomCount": 0,
              "Index": 1
          }]
      },
      priceParam: {
          "TotalPrice": 0,
          "DefaultAcc": "",
          "DefaultAccPrice": "",
          "DefaultCan": "",
          "DefaultCanPrice": 0
      },
      additionParam:[],
      tmpl: {
          routeDetail: require("dujia/package/detail/routerdetail"),
          fee: require("dujia/package/detail/fee"),
          tourKnow: require("dujia/package/detail/tourknow"),
          warningSafe: require("dujia/package/detail/warningsafe"),
          flyHotel: require("dujia/package/detail/flyandhoteldetail"),
          insuranceDetail: require("dujia/package/detail/insurancedetail"),
          moreHotel: require("dujia/package/detail/morehotel"),
          priceBox: require("dujia/package/detail/pricebox"),
          nearshop: require("dujia/package/detail/nearshop"),
          shopPro: require("dujia/package/detail/shoppro"),
          shopCity: require("dujia/package/detail/shopcity"),
          findShop: require("dujia/package/detail/findshop"),
          visa: require("dujia/package/detail/visa"),
          roomDetail: require("dujia/package/detail/roomdetail"),
          addPrice:require("dujia/package/detail/additionprice"),
          tmplPreferential: require("dujia/package/detail/preferential")
      },
      content: {
          flightAndHotel: ".result-info"
      },
      init: function (cfg) {
          var self = this;
            self._init(cfg);
      },
      _init: function (cfg) {
          this.isErrorCct();
          this.overTime();
          this.tmplDeal();
          this.initPackedCalendar();
          //this.initPeriod();
          this.cityEv();
          this.initEv();
          this.initMultiInfo();
          this.initShop();
          this.getServerNumber(cfg);
          this.initRouteDetail();
          this.initScrollSpy();
          this.bookingEve();
          this.initslider();
          //this.mainEve();
          //降价通知
          $.extend(cfg, {
              ele: '.inform',
              getPrice: function () {
                  return $(".declare-box").find(".declare-price.price").find("strong").text();
              },
              getLineID: function () {
                  return $("#lineId").val();
              }
          });
          //泛打包
          this.initTip();
          this.setSelHelpPack();
          this.visaMoreEve();
          this.mapEvent();
      },
      //右侧通栏部分
      getUser: function () {
          var loginInfo = $.cookie("us"),
              userid;
          if (loginInfo) {
              userid = /userid=(\d+)/i.exec(loginInfo);
              userid = userid ? userid[1] : userid;
          }
          return userid;
      },
      initslider: function(){
          var self = this;
          var userid = self.getUser();
          var slider = new Slidertoolbar({
              header: {
                  icon: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/09/27/17/BEhKbt.jpg"></a>',
                  tooltips: '<a target="_blank" href="//www.ly.com/dujia/zhuanti/temaihui.html"><img src="//pic4.40017.cn/line/admin/2016/11/01/10/UL8ID0.jpg"></a>'
              },
              topMenu: [{
                  icon: '<a href="http://member.ly.com/"><div class="ico c-1"></div></a>',
                  tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
                  arrow: false
              }, {
                  icon: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><div class="ico c-3"></div></a>',
                  tooltips: '<a href="http://member.ly.com/Member/MyFavorites.aspx"><span class="ico-title">我的收藏<i></i></span></a>',
                  arrow: false
              }, {
                  icon: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><div class="ico c-4"></div></a>',
                  tooltips: '<a target="_blank" href="http://www.sojump.com/jq/8104130.aspx"><span class="ico-title">意见反馈<i></i></span></a>',
                  arrow: false
              }, {
                  icon: '<a class="ico c-2"></a>',
                  tooltips: '<a><span class="ico-title"><b class="J_tel">4007-777-777</b><i></i></span></a>',
                  arrow: false
              }, {
                  icon: '<a target="_blank" href="http://livechat.ly.com/out/guest?p=7&lineid='+ self.lineId +'"><div class="ico c-5"></div></a>',
                  tooltips: '<a target="_blank" href="http://livechat.ly.com/out/guest?p=7&lineid='+ self.lineId +'"><span class="ico-title">在线客服<i></i></span></a>',
                  arrow: false
              }],
              bottomMenu: [{
                  icon: '<a target="_blank" href="//www.ly.com/dujia/schedule.html"><div class="ico c-6"></div></a>',
                  tooltips: '<a target="_blank" href="//www.ly.com/dujia/schedule.html"><span class="ico-title">旅游定制<i></i></span></a>',
                  arrow: false
              }, {
                  icon: '<a><div class="ico c-7"></div></a>',
                  tooltips: '<a><span class="ico-title"><img src="//img1.40017.cn/cn/v/2015/index2016/wx-gzh.png"><i></i></span></a>',
                  tooltipCls: 'chujing-code',
                  arrow: false
              }, {
                  icon: '<a><div class="ico c-8"></div></a>',
                  tooltips: '<a><span class="ico-title"><img src="//img1.40017.cn/cn/v/2015/index2016/app-download.png"><i></i></span></a>',
                  tooltipCls: 'app-code',
                  arrow: false
              }],
              toTop: true,
              skin:'skin2'
          });
          if (userid) {
              slider.resetMenu({
                  icon: '<a href="http://member.ly.com/"><div class="ico c-1-1"></div></a>',
                  tooltips: '<a href="http://member.ly.com/"><span class="ico-title">我的同程<i></i></span></a>',
                  arrow: false
              }, 'top', 0);
          }
      },
      //cct参数错误
      isErrorCct: function () {
          var isErrorCct = $("#isErrorCct").val();
          var cctParam = $("#cctParam").val();
          if (isErrorCct && isErrorCct == 1) {
              var content = '<div class="error-warning1 fixed-warn1"><div class="data-loading"><div class="isErrorCct"><p>错误的方式，请返回后台下单系统重新查询操作！</p></div></div></div>';
              var config = {
                  content: content,
                  width: 500,
                  title: '',
                  quickClose: false,
                  zIndex: 100000
              };
              $dialog.modal(config);
              return;
          }
          if (cctParam && !$.cookie("cctDialog")) {
              var config = {
                  width: '350px',
                  height: '180px',
                  content: '<div class="order-pop-content">'
                  + '<i></i><ul>'
                  + '<li class="order-pop-desc" id="J_orderTipDesc"><span>新下单流程，正常核算销售业绩！</span></li>'
                  + '</ul>'
                  + '</div>'
              };
              $dialog1.modal(config);
              $.cookie("cctDialog", '1', { expires: 100000, path: '/' });
          }
      },
      //定时
      overTime: function () {
          var self = this;
          citytimer = setTimeout(function () {
              var config = {
                  content: '<div class="passTime fixed-warn1"><div class="data-loading"><div class="bg"><span>抱歉，当前资源已过期，请重新查询</span><div class="research J_research">重新查询</div></div></div></div>',
                  width: 350,
                  height: 180,
                  title: '',
                  quickClose: false,
                  zIndex: 100000
              };
              $dialog.modal(config);
              $(document).on("click", ".J_research", function () {
                  var cctParam = $("#cctParam").val();
                  if (cctParam) {
                      var thisCctParam = cctParam;
                      $("#fromCctParam").val(thisCctParam);
                  }
                  var url = window.location.href;
                  $("#hotelForm").attr('action', url);
                  $("#hotelForm").submit();
              });
          }, 1000 * 60 * 10);
      },
      //处理放弃按钮的临时参数
      tmplDeal: function () {
          var self = this;
          if (product.isvalid == 1) {
              self.postData.Adult = self.tmplParam.Adult = parseInt(product.Data.Adult);
              self.postData.Child = self.tmplParam.Child = parseInt(product.Data.Child);
              self.postData.ChildAges = self.tmplParam.ChildAges = product.Data.ChildAges;
              self.postData.RoomCount = self.tmplParam.RoomCount = parseInt(product.Data.RoomCount);
          } else {
              self.postData.Adult = self.tmplParam.Adult = 2;
              self.postData.Child = self.tmplParam.Child = 0;
              self.postData.ChildAges = self.tmplParam.ChildAges = [];
              self.postData.RoomCount = self.tmplParam.RoomCount = 1;
          }
      },
      //初始化泛打包价格日历
      initPackedCalendar: function () {
          var self = this,
              tmpl = self.tmpl,
              LowestArr = [],
              initdate, param_cal, selday, localArr;
          var advanceDay = $("#advanceDay").val();
          var url = "/intervacation/api/PDynamicPackageProductDetail/GetCalendar?lineId=" + self.lineId + "&advanceDay=" + advanceDay;
          $.ajax({
              url: url,
              dataType: "json",
              beforeSend: function () {
                  $(".cc-calendar").html("<div class='data-loading'><div class='bg'></div><span>请稍候，正在为您查询中</span></div>");
              },
              success: function (data) {
                  if (data.Code == 4000) {
                      if (data.Data) {
                          //$(".packed-info").css("background-color","#eceff2");
                          CalendarData = data.Data;
                          var _datepicker = new GroupCalendar({
                              wrapper: ".cc-calendar",
                              skin: "price",
                              monthCount: 2,
                              fillAcrossDate: false,
                              allowCancel: false,
                              slide: true,
                              minDate: new Date(),
                              maxDate: (new Date()).addMonth(6),
                              formatData: function (item) { //{day,date,value,enable}
                                  for (var i = 0; i < data.Data.length; i++) {
                                      var v = data.Data[i],
                                          dateprice;
                                      param_cal = encodeURIComponent(JSON.stringify(v));
                                      if (v.IsLowest == 1) {
                                          LowestArr.push(v.Date);
                                      }
                                      if ((new Date(v.Date)).format('yyyyMMdd') == (new Date(item.date)).format('yyyyMMdd')) {
                                          if (v.Price == 0) {
                                              dateprice = "实时计价";
                                          } else {
                                              dateprice = '¥' + v.Price;
                                          }
                                          if (v.IsLowest == 1) {
                                              item.value = '<div param_cal=' + param_cal + ' class="cal-sbox IsLowest">' + '<i></i>' + item.day + '<div class="cal-price">' + dateprice + '</div></div>';
                                          } else {
                                              item.value = '<div param_cal=' + param_cal + '  class="cal-sbox">' + item.day + '<div class="cal-price">' + dateprice + '</div></div>';
                                          }
                                          item.enable = true;
                                          break;
                                      } else {
                                          item.enable = false;
                                      }
                                  };
                                  return item;
                              },
                              getValues: function () {
                                  return this.__values;
                              }
                          });
                          _datepicker.open();
                          var html = '<div class="cc-person">' + '<div class="calendar-date">已选择出发日期<span class="J_date" data-date="2016-04-20">2016年04月20日</span></div>' + '<dl>' + '<dt>成人</dt>' + '<dd>' + '<div class="num-item adultItem">' + '<input class="input-num" readonly="readonly" type="text" min="1" value="2" num="2" price-type="adult" id="adult"><i></i><div class="adultNumBox none"><ul></ul></div>' + '</div>' + '</dd>' + '</dl>' + '<dl>' + '<dt>儿童</dt>' + '<dd>' + '<div class="num-item childItem">' + '<input class="input-num" readonly="readonly" type="text" min="0" value="0" num="0" price-type="child" id="child1"><i></i><div class="childNumBox none"><ul></ul></div>' + '<div class="childOld-box none">' + '<div class="title-childOld">入住时儿童年龄</div>' + '<div class="box-childyear">' + '</div>' + '<span class="childyear-submit">确定</span>' + '</div>' + '</div>' + '<i class="child-info" data-content="<div><p>1、儿童年龄统一为周岁。</p><p>2、国际机票儿童票年龄范围为2~12岁。</p><p>3、国际机票婴儿票年龄范围在0~2岁，婴儿票会在您提交订单后由工作人员为您处理。</p><p>4、儿童入住需遵循国际酒店儿童政策。</p><p>5、为了您能够顺利入住酒店，请填写准确的儿童年龄。</p><div>"></i>' + '</dd>' + '</dl>' + '<dl>' + '<dt>房间数</dt>' + '<dd>' + '<div class="num-item roomItem">' + '<input class="input-num" readonly="readonly" type="text" min="0" value="1" num="1" price-type="room" id="room"><i></i><div class="roomNumBox none"><ul></ul></div></div>' + '<i class="child-info" data-content="同程根据您的房间数及出游人信息匹配符合的房型，且房间数在后续不支持更改，请您在查询前确认房间数。"></i>' + '</dd>' + '</dl>' + '<div class="btn-div"><div class="sureOr none"><span class="J_giveup">放弃</span><span class="J_packed btn-orange">确认修改</span></div><div class="calTotalPrice"><div class="calPrice"><div class="txt_tczj">套餐总价</div><div class="txt_allPrice">¥<em>---</em></div></div><div class="J_next disable">努力加载中...</div></div></div>' + '</div>';
                          $(".calendar-checked").append(html);
                          self.countEv();
                          _datepicker.on("dayselect", function (o, d, date, vs, obj) {
                              var newdate = (new Date(date)).format('yyyy年MM月dd日');
                              $(".J_date").html(newdate);
                              $(".J_date").attr('data-date', date);
                              self.choiceCalendar(date);
                              var room = parseInt($("#room").val());
                              self.param.Hotel.RoomCount = room;
                              self.param.IsDefault = 1;
                              if (current_request) {
                                  current_request.abort();
                              }
                              $(".txt_allPrice em").html("---");
                              $(".J_next,.J_OrderBtn").removeClass('J_booking').addClass('disable').html("努力加载中...");
                              $(".calTotalPrice").removeClass('none');
                              $(".sureOr").addClass('none');
                              self.mainInit();
                              //统计代码
                              var thisw = 1,
                                  haslow = 0;
                              if ($(obj).context.cellIndex == 0) {
                                  thisw = 7;
                              } else {
                                  thisw = $(obj).context.cellIndex;
                              }
                              if ($(obj).find('.cal-sbox').hasClass('IsLowest')) {
                                  haslow = 1;
                              } else {
                                  haslow = 0;
                              }
                              var thisval = date + "_" + thisw + "_" + haslow + "_" + self.param.LineId;
                              Stat.traceEl($(obj), thisval)
                          });
                          _datepicker.on("show", function () {

                          });
                          if (product && product.isvalid == 1 && product.Data.LineDate) {
                              initdate = [product.Data.LineDate];
                          } else {
                              if (LowestArr.length) {
                                  initdate = [LowestArr[0]];
                              } else if (CalendarData.length && CalendarData.length > 0) {
                                  initdate = [CalendarData[0].Date];
                              } else {
                                  return;
                              }
                          };
                          self.param.LineDate = initdate[0];
                          _datepicker.setValues(initdate);
                          _datepicker.setMonth(_datepicker.stringToDate(initdate[0]).getMonth() + 1, _datepicker.stringToDate(initdate[0]).getFullYear());
                          selday = _datepicker.getValues()[0];
                          selday1 = (new Date(selday)).format('yyyy年MM月dd日');
                          $(".J_date").html(selday1);
                          $(".J_date").attr('data-date', selday);
                          if (product && product.isvalid == 1 && product.Data.LineDate) {
                              var localArr = product.Data;
                              self.param.LineId = localArr.LineId;
                              self.param.Adult = localArr.Adult;
                              self.param.Child = localArr.Child;
                              self.param.ChildAges = localArr.ChildAges;
                              self.param.IsDefault = 0;
                              $("#adult").val(localArr.Adult);
                              $("#adult").attr("num", localArr.Adult);
                              $("#child1").val(localArr.Child);
                              $("#child1").attr("num", localArr.Child);
                              $("#room").val(localArr.RoomCount);
                              $("#room").attr("num", localArr.RoomCount);
                              self.backInit();
                          } else {
                              self.choiceCalendar(selday);
                              self.mainInit();
                          }
                          if ($("#child1").val() == 0) {
                              $("#child1").siblings(".btn-sub").addClass("disable");
                          }
                          if ($("#adult").val() == 1) {
                              $("#adult").siblings(".btn-sub").addClass("disable");
                          }
                          $(".J_packed").removeClass("btn-gray").addClass("btn-orange");
                          self.packEve();
                          if (data.Data.length == 0) {
                              var html = '<div class="error-warning"><i></i>抱歉，您所查询的日期库存不足，请刷新或更换线路重新搜索。</div>';
                              $(".cc-calendar").empty().html(html);
                              $(".cal-warn").empty();
                          }
                      } else {
                          var html = '<div class="error-warning"><i></i>抱歉，您所查询的日期库存不足，请刷新或更换线路重新搜索。</div>';
                          $(".cc-calendar").empty().html(html);
                          $(".cal-warn").empty();
                      }
                  } else {
                      var html = '<div class="error-warning"><i></i>抱歉，您所查询的日期库存不足，请刷新或更换线路重新搜索。</div>';
                      $(".cc-calendar").empty().html(html);
                      $(".cal-warn").empty();
                  }

              }
          });
      },
      dealCalData: function (date) {
          for (var i = 0; i < CalendarData.length; i++) {
              if ((new Date(CalendarData[i].Date)).format('yyyyMMdd') == (new Date(date)).format('yyyyMMdd')) {
                  return CalendarData[i];
              }
          }
      },
      //选择价格日历
      choiceCalendar: function (date) {
          var self = this;
          var param_cal;
          param_cal = self.dealCalData(date)
          //param_cal = JSON.parse(decodeURIComponent(param_cal));
          self.param.LineDate = param_cal.Date;
          if (param_cal.Flight == null) {
              self.param.Flight = null;
          } else {
              self.param.Flight = param_cal.Flight;
          }
          self.param.Hotel = param_cal.Hotel;
      },
      /**
       * @desc 获取倒计时所必须要的参数
       * @returns {string}
       */
      getTimerParam: function () {
          //获取url里selltype的值,传入true,表示不区分大小写
          var selltype = Common.getParamFromUrl("selltype", true);
          //由于ak的值里需要区分大小写,不传true
          var ak = Common.getParamFromUrl("ak");
          if (selltype !== "4") {
              //当selltype和ak都有值时才去返回倒计时的param
              if (selltype && ak) {
                  return "&selltype=" + selltype + "&ak=" + ak;
              }
          }
          if (ak) return "&ak=" + ak;
      },
      /**
       * @desc 初始化400电话,优惠信息,收藏数据,倒计时,获取ouid
       *///获取电话号码
      getServerNumber: function () {
          var url = "/intervacation/api/Telephone/GetTelephone";
          $.ajax({
              url: url,
              dataType: "json",
              success: function (data) {
                  if (data.Code == 4000 && data.Data) {
                      $(".J_tel").html(data.Data.telephone);
                  }
              },
              error: function () {
                  Monitor.log("获取服务器号码失败" + url, "getServerNumber");
              }
          });
      },
      initMultiInfo: function () {
          var self = this;
          // self.getMultiData(function(data) {
          //     self.initPretialInfo.call(self, data);
          //     self.initTelInfo.call(self, data);

          //     self.initTip();
          // });
          //
          self.getOuidInfo();
      },
      initTelInfo: function (data) {
          var self = this;
          $(".J_Tel").html(data.Telephone);
          var countdownWrap = $(".J_CountDown");
          if (countdownWrap.length && data.TimeSpan) {
              var countdownTip = '2亿补贴，重金打造，出境大特惠。超高品质出游，超低价格特卖，限时特价，爆款秒杀，更多超值线路尽在同程出境特卖。';
              countdownWrap.append('<span class="J_CountDownText"></span><span class="icons-ask J_Tips" data-content="' + countdownTip + '"></span>');
              var timeSpan = data.TimeSpan,
                  dateArr;
              if (timeSpan.type === "4") {
                  dateArr = ["2015-01-01", "2015-02-02"];
              } else {
                  var start = timeSpan.stime,
                      end = timeSpan.etime;
                  if (timeSpan.tolsecondStart) {
                      start = (+new Date()) + (timeSpan.tolsecondStart - 0);
                  }
                  if (timeSpan.tolsecondEnd) {
                      end = (+new Date()) + (timeSpan.tolsecondEnd - 0);
                  }
                  dateArr = [start, end];
              }
              var countdownEl = $(".J_CountDownText");
              self.initTimer(countdownEl, dateArr);
          }
      },
      initPretialInfo: function (data) {
          var self = this;
          var prentStr = '<div><span class="f-left">可享优惠：</span>',
              datas = data.Preferential,
              redPriTips = '',
              itemArr = [],
              arrData = [];

          var i, len, j, item, tips, arrRules, lenContent, strTemp, html;
          for (i = 0, len = datas.length; i < len; i++) {
              if (datas[i].PreferentialType === 1) {
                  item = datas[i];
                  tips = '<div><strong>{CONTENT}</strong><hr />{RULES}</div>'
                      .replace(/\{CONTENT\}/, item.IconName);
                  arrRules = [];
                  lenContent = item.IconContent.PrefernentialString.length;

                  strTemp = '';
                  for (j = 0; j < lenContent; j++) {
                      strTemp = item.IconContent.PrefernentialString[j] + '<br />';
                      if (lenContent > 2) {
                          strTemp = j + '. ' + strTemp;
                      }
                      arrRules.push(strTemp);
                      arrRules[0] = arrRules[0].replace("0. ", "");
                  }

                  redPriTips += tips.replace('{RULES}', arrRules.join(''));
              } else {
                  arrData.push(datas[i]);
              }
          }

          for (i = 0, len = arrData.length; i < len; i++) {
              if (i === 4) {
                  break;
              }
              item = arrData[i];
              if (item.MarkId === 21) {
                  html = '<div class="preferential"><span class="icon J_Tips_async zdh_icon" style="background-color: #fef8e8; color: #ff6535;" data-content="{TIPS}" data-skin="icontips">{CONTENT}</span></div>';

              } else {
                  html = '<div class="preferential"><span class="icon J_Tips_async" style="background-color: #fef8e8; color: #ff6535;" data-content="{TIPS}" data-skin="icontips">{CONTENT}</span></div>';
              }
              tips = '<div><strong>{CONTENT}</strong><hr />{RULES}</div>'
                  .replace(/\{CONTENT\}/, item.IconName);
              arrRules = [];
              lenContent = item.IconContent.PrefernentialString.length;

              strTemp = '';
              for (j = 0; j < lenContent; j++) {
                  strTemp = item.IconContent.PrefernentialString[j] + '<br />';
                  if (lenContent > 2) {
                      strTemp = j + '. ' + strTemp;
                  }
                  arrRules.push(strTemp);
                  arrRules[0] = arrRules[0].replace("0. ", "");
              }

              html = html.replace(/\{COLOR\}/g, item.IconColor)
                  .replace('{CONTENT}', item.IconName.slice(0, 4))
                  .replace('{TIPS}', tips)
                  .replace('{RULES}', arrRules.join(''));
              itemArr.push(html);
          }
          if (itemArr.length > 0) {
              //京东外显 youhuiTopOthers
              prentStr = prentStr + itemArr.join("") + self.youhuiTopComment() + "</div>";
              $(".J_YouHuiTop").empty().append(prentStr);
          } else {
              prentStr = prentStr + self.youhuiTopComment() + "</div>";
              $(".J_YouHuiTop").empty().append(prentStr);
          }
          $('.red_pri').attr({
              "data-skin": "icontips",
              "data-content": redPriTips
          })
          //self.initTip();
          //self.initTip($(".J_YouHuiTop").find('.J_Tips_async'));
      },
      //点评返现规则外显
      youhuiTopComment: function () {
          var tmpl = {
              shtml: '<div class="preferential"><span class="icon J_Tips_async" style="background-color: #fef8e8; color: #ff6535;" data-content="{TIPS}" data-skin="icontips">{CONTENT}</span></div>',
              stips: '<div>{RULES}</div>'
          },
              data = {
                  CONTENT: '点评返现',
                  RULES: '1.点评审核通过后，我们将给您返点评奖金作为奖励，如果您的点评足够细致、有特色，将有机会被评为精华点评。<br />' +
                  '2.点评成功后，您将获得15-50元不等的点评奖金。<br /><span style=\'color: #ff7800\'>3.被评为精华点评，奖金是原点评奖金的2倍哦！</span><br />4.点评奖金可在“我的财富——奖金账户”中查看，点评奖金满200元可提现。'
              };
          tmpl.stips = tmpl.stips.replace(/{(\w+)}/g, function ($0, $1) {
              return data[$1];
          });
          tmpl.shtml = tmpl.shtml.replace(/\{CONTENT\}/, data.CONTENT);
          tmpl.shtml = tmpl.shtml.replace(/\{TIPS\}/, tmpl.stips);

          return tmpl.shtml;
      },
      /**
       * 获取URL上的ouid存入cookie
       */
      getOuidInfo: function () {
          var url = location.href,
              ouid = "",
              hasouid = /(?:^|&|\?)ouid=([^&]*)(?:&|$)/i.exec(url);
          if (hasouid && hasouid[1]) {
              ouid = hasouid[1];
          }
          $.cookie("ouid", ouid, {
              path: '/dujia'
          });
      },
      hasChildSave: function () {
          var self = this;
          if (product && product.isvalid == 1) {
              var localArr = product.Data;
              if (localArr.ChildAges && localArr.ChildAges.length) {
                  return localArr.ChildAges;
              } else {
                  return false;
              }
          } else {
              return false;
          }
      },
      renderAdultHtml: function () {
          var self = this;
          var num = self.calculatePeopleNum(),
              childNum = num.childNum,
              jq_adult = $("#adult");
          var adultNum = parseInt(jq_adult.attr("num"));
          var newAdult = 10 - childNum,
              html = "";
          if (newAdult > 0) {
              for (var i = 1; i < newAdult; i++) {
                  html += '<li>' + i + '</li>';
              }
              $(".adultNumBox ul").html(html);
          }
          self.numsEve();
      },
      renderChildHtml: function () {
          var self = this;
          var num = self.calculatePeopleNum(),
              childNum = num.childNum,
              jq_adult = $("#adult");
          var adultNum = parseInt(jq_adult.attr("num"));
          var newChild = 2 * adultNum + 1,
              html = "";
          if (newChild + adultNum > 10) {
              newChild = 10 - adultNum;
          }
          if (newChild > 0) {
              for (var i = 0; i < newChild; i++) {
                  html += '<li>' + i + '</li>';
              }
              $(".childNumBox ul").html(html);
          }
          self.numsEve();
      },
      renderRoomHtml: function () {
          var self = this,
              jq_adult = $("#adult"),
              adultNum = parseInt(jq_adult.attr("num")),
              html = "";
          for (var i = 1; i < adultNum + 1; i++) {
              html += '<li>' + i + '</li>';
          }
          $(".roomNumBox ul").html(html);
          self.numsEve();
      },
      numsEve: function () {
          var self = this,
              num = self.calculatePeopleNum(),
              childNum = num.childNum;
          $(".roomNumBox li").click(function (e) {
              e.stopPropagation();
              var _self = $(this);
              var newsum = _self.html();
              $("#room").html(newsum).val(newsum).attr('num', newsum);
              $(".roomNumBox").slideUp(200);
              $(".calTotalPrice").addClass('none');
              $(".sureOr").removeClass('none');
          });
          $(".adultNumBox li").click(function (e) {
              e.stopPropagation();
              var _self = $(this);
              var newsum = _self.html();
              $("#adult").html(newsum).val(newsum).attr('num', newsum);
              $(".adultNumBox").slideUp(200);
              $(".calTotalPrice").addClass('none');
              $(".sureOr").removeClass('none');
              if (newsum * 2 < childNum) {
                  $("#child1").val("0").attr("num", 0);
              }
              self.defRoomCount();
          });
          $(".childNumBox li").click(function () {
              var _self = $(this);
              var newsum = parseInt(_self.html()),
                  allhtml = "";
              if (!$("#child1").hasClass('hasrenderAge')) {
                  self.renderAgeHtml();
              }
              $("#child1").html(newsum).val(newsum).attr('num', newsum);
              $(".childNumBox").slideUp(200);
              $(".calTotalPrice").addClass('none');
              $(".sureOr").removeClass('none');
              $("#child1").addClass('hasrenderAge');
              if (newsum != 0) {
                  $(".childOld-box").removeClass('none');
              }
              if (!$(".item-childOld").length) {
                  for (var i = 0; i < newsum; i++) {
                      var sunnum = i + 1;
                      var thishtml = '<div class="item-childOld">' + '<em>儿童' + sunnum + '</em>' + '<em class="drop-child" data-year="0">&lt;1岁</em>' + '<ul class="choice-childy none">' + '<li data-year="0">&lt;1岁</li>' + '<li data-year="1">1岁</li>' + '<li data-year="2">2岁</li>' + '<li data-year="3">3岁</li>' + '<li data-year="4">4岁</li>' + '<li data-year="5">5岁</li>' + '<li data-year="6">6岁</li>' + '<li data-year="7">7岁</li>' + '<li data-year="8">8岁</li>' + '<li data-year="9">9岁</li>' + '<li data-year="10">10岁</li>' + '<li data-year="11">11岁</li>' + '<li data-year="12">12岁</li>' + '<li data-year="13">13岁</li>' + '<li data-year="14">14岁</li>' + '<li data-year="15">15岁</li>' + '<li data-year="16">16岁</li>' + '<li data-year="17">17岁</li>' + '</ul>' + '</div>';
                      allhtml += thishtml;
                  }
                  $(".box-childyear").html(allhtml);
              } else {
                  var lastChildNum = $(".item-childOld").length;
                  var chasum = newsum - lastChildNum;
                  if (chasum < 0) { //后来选的小于原来的人数
                      var absChaSum = Math.abs(chasum);
                      for (var i = 0; i < absChaSum; i++) {
                          $(".item-childOld:last-child").remove();
                      }
                  } else if (chasum > 0) { //后来选的大于原来的人数
                      var allHtml = "";
                      for (var i = 0; i < chasum; i++) {
                          var j = lastChildNum + i + 1;
                          var thishtml = '<div class="item-childOld">' + '<em>儿童' + j + '</em>' + '<em class="drop-child" data-year="0">&lt;1岁</em>' + '<ul class="choice-childy none">' + '<li data-year="0">&lt;1岁</li>' + '<li data-year="1">1岁</li>' + '<li data-year="2">2岁</li>' + '<li data-year="3">3岁</li>' + '<li data-year="4">4岁</li>' + '<li data-year="5">5岁</li>' + '<li data-year="6">6岁</li>' + '<li data-year="7">7岁</li>' + '<li data-year="8">8岁</li>' + '<li data-year="9">9岁</li>' + '<li data-year="10">10岁</li>' + '<li data-year="11">11岁</li>' + '<li data-year="12">12岁</li>' + '<li data-year="13">13岁</li>' + '<li data-year="14">14岁</li>' + '<li data-year="15">15岁</li>' + '<li data-year="16">16岁</li>' + '<li data-year="17">17岁</li>' + '</ul>' + '</div>';
                          allHtml += thishtml;
                      }
                      $(".box-childyear").append(allHtml);
                  }
              }
          });
      },
      renderAgeHtml: function () {
          var self = this,
              ChildAges;
          var ChildAges = self.hasChildSave(),
              allhtml = "";
          if ($(".box-childyear").html() == "") {
              if (ChildAges) {
                  for (var i = 0; i < ChildAges.length; i++) {
                      var childnums = i + 1,
                          selectChildVal;
                      if (ChildAges[i] == 0) {
                          selectChildVal = "&lt;1岁";
                      } else {
                          selectChildVal = ChildAges[i] + "岁";
                      }
                      var thishtml = '<div class="item-childOld">' + '<em>儿童' + childnums + '</em>' + '<em class="drop-child" data-year="' + ChildAges[i] + '">' + selectChildVal + '</em>' + '<ul class="choice-childy none">' + '<li data-year="0">&lt;1岁</li>' + '<li data-year="1">1岁</li>' + '<li data-year="2">2岁</li>' + '<li data-year="3">3岁</li>' + '<li data-year="4">4岁</li>' + '<li data-year="5">5岁</li>' + '<li data-year="6">6岁</li>' + '<li data-year="7">7岁</li>' + '<li data-year="8">8岁</li>' + '<li data-year="9">9岁</li>' + '<li data-year="10">10岁</li>' + '<li data-year="11">11岁</li>' + '<li data-year="12">12岁</li>' + '<li data-year="13">13岁</li>' + '<li data-year="14">14岁</li>' + '<li data-year="15">15岁</li>' + '<li data-year="16">16岁</li>' + '<li data-year="17">17岁</li>' + '</ul>' + '</div>';
                      allhtml += thishtml;
                  }
                  $(".box-childyear").empty();
                  $(".box-childyear").append(allhtml);
              }
          }
      },
      //地图点击事件
      mapEvent: function () {
          $(document).on("click", ".J_hotel-mapInfo", function () {
              var self = $(this);
              var latPoint = self.data("lat"),
                  lngPoint = self.data("lng"),
                  name = self.data("name");
              var cfg = {};
              cfg.center = latPoint + "," + lngPoint;
              cfg.name = name;
              mapDia();
              googleMap.init(cfg);
              $(".mapBox").removeClass("none");
          });
          $(document).on("click", ".mapBox-title i", function () {
              $(".maoBox-bg").addClass("none");
              $(".mapBox").removeClass("mapBox-fixed").addClass("none");
              $(".mapBox #map").empty();
              $("#map").html("<div class='data-loading'><div class='bg'></div><span>请稍候，正在为您查询中</span></div>");
          });
          function mapDia() {
              $(".maoBox-bg").removeClass("none");
              $(".mapBox").addClass("mapBox-fixed");
          }
      },
      ageEve: function () {
          var self = this;
          $(document).on("click", ".drop-child", function () {
              var _self = $(this);
              _self.siblings('.choice-childy').stop().slideToggle(200);
              //失去焦点隐藏
              $(document).bind('click', function () {
                  self.__docClick.call(self, arguments.callee);
              });
              self.__stopPropagation();
          });
          $(document).on("click", ".choice-childy li", function () {
              var _self = $(this);
              $(".calTotalPrice").addClass('none');
              $(".sureOr").removeClass('none');
              _self.parent().siblings('.drop-child').html(_self.html()).attr('data-year', _self.attr("data-year"));
              _self.parent().slideUp(200);
          });
          $(".childyear-submit").click(function () {
              $(".childOld-box").addClass('none');
              self.defRoomCount();
          });
          $("#child1").click(function () {
              var _self = $(this);
              if (_self.attr("num") != 0) {
                  self.renderAgeHtml();
                  $(".childOld-box").removeClass('none');
                  $("#child1").removeClass('hasrenderAge');
              }
          });
      },
      countEv: function () {
          var self = this;
          $(".roomItem").click(function () {
              var _this = $(this);
              self.renderRoomHtml();
              $(".roomNumBox").slideToggle(200);
              //失去焦点隐藏
              $(document).bind('click', function () {
                  self.__docClick.call(self, arguments.callee);
              });
              self.__stopPropagation();
          });
          $(".adultItem").click(function () {
              var _this = $(this);
              self.renderAdultHtml();
              $(".adultNumBox").slideToggle(200);
              //失去焦点隐藏
              $(document).bind('click', function () {
                  self.__docClick.call(self, arguments.callee);
              });
              self.__stopPropagation();
          });
          $(".childItem i").click(function () {
              var _this = $(this);
              self.renderChildHtml();
              $(".childOld-box").addClass('none');
              $(".childNumBox").slideToggle(200);
              //失去焦点隐藏
              $(document).bind('click', function () {
                  self.__docClick.call(self, arguments.callee);
              });
              self.__stopPropagation();
          });
          $(document).on("click", ".J_giveup", function () {
              var _this = $(this);
              var localArr = self.tmplParam;
              $(".box-childyear").empty();
              if (localArr) {
                  $("#adult").val(localArr.Adult);
                  $("#adult").attr("num", localArr.Adult);
                  $("#child1").val(localArr.Child);
                  $("#child1").attr("num", localArr.Child);
                  $("#room").val(localArr.RoomCount);
                  $("#room").attr("num", localArr.RoomCount);
              }
              $(".sureOr").addClass('none');
              $(".calTotalPrice").removeClass('none');
              $(".childOld-box").addClass('none');
          });
          self.ageEve();
      },
      //计算默认房间数
      defRoomCount: function () {
          var self = this;
          var num = self.calculatePeopleNum(),
              childNum = num.childNum,
              jq_adult = $("#adult"),
              roomcount;
          var adultNum = parseInt(jq_adult.attr("num"));
          if (childNum == 0) {
              roomcount = Math.ceil(adultNum / 2);
          } else {
              if (adultNum > childNum) {
                  roomcount = Math.ceil(adultNum / 2);
              } else {
                  roomcount = adultNum;
              }
          }
          $("#room").html(roomcount).val(roomcount).attr('num', roomcount);
          $(".sureOr").removeClass('none');
          $(".calTotalPrice").addClass('none');
      },
      //点击文档其他地方隐藏面板
      __docClick: function (obj) {
          $('.adultNumBox,.childNumBox,.roomNumBox,.other_num').hide();
          $(".J_selectCity").addClass('none');
          $(".summary .line-pro .city .txt i").removeClass('cityup');
          $(document).unbind('click', obj);
      },
      __stopPropagation: function (e) {
          var e = this.__getEvent();
          if (window.event) {
              //e.returnValue=false;//阻止自身行为
              e.cancelBubble = true; //阻止冒泡
          } else if (e && e.preventDefault) {
              //e.preventDefault();//阻止自身行为
              e.stopPropagation(); //阻止冒泡
          }
      },
      //得到事件
      __getEvent: function () {
          if (window.event) {
              return window.event;
          }
          var func = this.__getEvent.caller;
          while (func != null) {
              var arg0 = func.arguments[0];
              if (arg0) {
                  if ((arg0.constructor == Event || arg0.constructor == MouseEvent || arg0.constructor == KeyboardEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                      return arg0;
                  }
              }
              func = func.caller;
          }
          return null;
      },
      /**
       * @desc 初始化倒计时
       * @param el
       * @param dateArr
       */
      initTimer: function (el, dateArr) {
          var bookEl = $(".J_OrderBtn");
          var href = bookEl.attr("href");
          var cfg = [{
              "tmpl": '<span>距离开始时间：</span><span>{days}天{hour}小时{minute}分{second}秒</span>',
              callback: function () {
                  bookEl.html("即将开始").attr("href", "javascript:void(0)");
              }
          }, {
              "tmpl": '<span>抢购结束倒计时：</span><span>{days}天{hour}小时{minute}分{second}秒</span>',
              callback: function () {
                  bookEl.html("立即预订").attr("href", href);
              }
          }, {
              "tmpl": "",
              callback: function () {
                  el.addClass("none");
                  $(".J_CountDown").addClass("none");
                  bookEl.addClass("Endtime").html("已售完").attr("href", "javacript:void(0)");
              }
          }];
          var Timer = require("timer/0.1.0/index");
          Timer.init({
              el: el,
              date: dateArr,
              cfg: cfg
          })
      },
      /**
       * @desc 初始化登录组件
       * @param callback
       */
      initLogin: function (callback) {
          var self = this,
              Login = require("login/0.1.0/index");
          var login = new Login({
              loginSuccess: function () {
                  callback.call(self);
              },
              unReload: true
          });
      },
      isLogin: function () {
          var cnUser = $.cookie("us");
          return (/userid=\d+/.exec(cnUser));
      },
      /**
       * @desc 检查是否登录,并执行登录后回调
       * @param callback 登录后的操作逻辑
       */
      checkLogin: function (callback) {
          if (!this.isLogin()) {
              this.initLogin(callback);
          } else {
              callback && callback.call(this);
          }
      },
      /**
       * @desc 给所有的J_Tips绑定tip提示功能
       * @example
       * <div class="J_Tips" data-content='<p>test</p>'></div>
       * //默认的对齐位置为 左侧,底部
       */
      initTip: function ($elem) {
          //console.log(1);
          //单击触发
          $dialog.tooltip({
              width: 300,
              zIndex: 100,
              content: function (obj) {
                  var text = $(obj).attr('data-content');
                  return text;
              }, //内容,支持html,function
              delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
              triggerEle: '.child-info', //触发元素选择器
              triggerType: 'hover', //hover|click
              triggerAlign: 'bottom' //显示位置支持top,left,bottom,right
          });
          $dialog.tooltip({
              content: function (obj) {
                  var text = $(obj).attr('data-content');
                  return text;
              }, //内容,支持html,function
              delay: 0, //延时隐藏时间，>0：鼠标离开后指定时间内隐藏，0：鼠标离开后立即隐藏,<0:不隐藏
              onhide: function () { //隐藏后触发事件

              },
              triggerEle: '.J_Tips,.J_Tips_async', //触发元素选择器
              triggerType: 'hover', //hover|click
              triggerAlign: 'bottom', //显示位置支持top,left,bottom,right
              wrapper: "body" //外容器,默认为document
          });
      },
      /**
       * @desc 初始化滚动导航功能
       */
      initScrollSpy: function () {
          var self = this;
          $("#conlist .content-nav-inner").scrollspy({
              pClass: "#conlist",
              curClass: "on",
              contentClass: ".J_NavBox",
              topH: 47,
              renderNav: function (sid, stxt, el, index) {
                  if (!index) {
                      return '<a class="on J_trace" trace=' + stxt + ' href="#' + sid + '"><span>' + stxt + '</span></a>';
                  } else {
                      return '<a class="J_trace" trace=' + stxt + ' href="#' + sid + '"><span>' + stxt + '</span></a>';
                  }

              },
              arrFn: {
                  "lineInfo": function () {
                      if (!$("#scrollSptPlaceholder").size()) {
                          var pEl = this.parentdiv;
                          var height = pEl.outerHeight(true);
                          $('<div id="scrollSpyPlaceholder" style="height: ' + height + 'px;display:none;"></div>').insertAfter(pEl);
                      }
                  },
                  "travelTips": function () { },
                  "CommentContent": function (el, parent) {
                      var comment = new Comments({
                          mainTitle: $("#hidTitle").val() || "",
                          isTheme: !!$("#isTheme").val(),
                      });
                      var productType = 0,
                          local = parseInt($("#LineProperty").val(), 10),
                          str = parseInt($("#prop").val(), 10);
                      if (str === 1) {
                          if (local === 1) {
                              productType = 1;
                          } else {
                              productType = 13;
                          }
                      } else if (str === 3) {
                          productType = 3;
                      }
                      comment.initMain({
                          el: el,
                          parent: parent,
                          mainParam: {
                              productId: $("#lineId").val(),
                              productType: productType
                          },
                          isFreeTour: true,
                          callback: function () {
                              $(".data-loading").remove();
                          }
                      });
                  },
              }
          });
      },
      initDayScroll: function () {
          $("#conlist1 .con-itemlist").scrollspy({
              curClass: "on",
              contentClass: ".travel-day",
              topH: 100,
              renderNav: function (sid, stxt, el, index) {
                  if (!index) {
                      return '<a class="on" href="#' + sid + '"><span>' + stxt + '</span></a>';
                  } else {
                      return '<a href="#' + sid + '"><span>' + stxt + '</span></a>';
                  }

              },
              scrollFn: function (navEl, isDown) {
                  switch (isDown) {
                      case 0:
                      case 2:
                          navEl.css({
                              position: "static",
                              display: "none"
                          });
                          break;
                      case 1:
                          var topHeight = navEl.height() + 90;
                          var nextDomH = $("#feeInfo").offset().top;
                          var scrollTop = $(document).scrollTop();
                          if(nextDomH - scrollTop < topHeight){
                              navEl.css({
                                  position: "fixed",
                                  display: "none"
                              });
                          }else{
                              navEl.css({
                                  position: "fixed",
                                  display: "block"
                              });
                          }
                          break;
                  }
              },
              arrFn: {}
          });
      },
      getExtraParam: function (ret) {
          var akVal = Common.getParamFromUrl("ak"),
              sellTypeVal = Common.getParamFromUrl("selltype", true);
          if (akVal) {
              ret.order += "&ak=" + akVal;
              ret.ajax += "&ak=" + akVal;
              if (sellTypeVal) {
                  ret.order += "&selltype=" + sellTypeVal;
              }
          }
          //如果是预售的话,则会有这个节点
          var extraUrlEl = document.getElementById("J_ExtraUrlParam");
          if (extraUrlEl) {
              ret.order += "&" + extraUrlEl.value;
          }
      },
      cityEv: function () {
          var self = this;
          $(".summary .line-pro .city .txt").click(function () {
              if ($(".summary .line-pro .city .txt i")) {
                  var _self = $(this).find('i');
                  if (_self.hasClass('cityup')) {
                      _self.removeClass('cityup');
                      $(".J_selectCity").addClass('none');
                  } else {
                      _self.addClass('cityup');
                      $(".J_selectCity").removeClass('none');
                      //失去焦点隐藏
                      $(document).bind('click', function () {
                          self.__docClick.call(self, arguments.callee);
                      });
                      self.__stopPropagation();
                  }
              }
          });
      },
      initEv: function () {
          $(".carousel img").on("mouseover", function () {
              $(".J_mainPic").attr("src", $(this).attr("data-img"));
          });
          $(".J_carouselWrap").on("mouseenter", function () {

              $(this).find(".left").addClass("active");

          }).on("mouseleave", function () {

              $(this).find(".left").removeClass("active");

          });
          //航班酒店折叠
          var len = $(".flight-txt p").length;
          if (len > 2) {
              $(".declare-hid .toggle").show();
          } else {
              $(".declare-hid .toggle").hide();
          }
          $(".J_toggle").click(function () {
              if ($(this).hasClass("fold")) {
                  $(".flight-hotel").animate({
                      height: "100px"
                  });
                  $(this).removeClass("fold");
              } else {
                  var height = $(".fh-content").height();
                  $(".flight-hotel").animate({
                      height: height + "px"
                  });
                  $(this).addClass("fold");
              }
          });
          $(".J_tmore").click(function () {
              var self = $(this);
              if (self.hasClass('fold')) {
                  self.removeClass('fold');
                  self.html("展开全部信息<b></b>");
                  $(self.parent().prev(".content-text")).css('max-height', '186px');
              } else {
                  self.html("收起全部信息<b></b>");
                  self.addClass('fold');
                  $(self.parent().prev(".content-text")).css('max-height', '3000px');
              }
          });
          var jq_prompt = $(".prompt"),
              jq_safety = $(".safety"),
              jq_prompt_height = jq_prompt.height(),
              jq_safety_height = jq_safety.height();
          jq_prompt.attr("maxHeight", jq_prompt_height); //重要提醒
          jq_safety.attr("maxHeight", jq_safety_height); //安全须知
          $(".btn-fold").click(function () {
              var jq_content = $(this).prev(".ni-content"),
                  jq_Tips = $(this).parent(".tips"),
                  maxHeight = jq_content.attr("maxHeight");
              if ($(this).hasClass("packUp")) {
                  jq_content.animate({
                      "height": maxHeight + "px"
                  });
                  $(this).removeClass("packUp").addClass("unfold").html("收起");
              } else {
                  jq_content.animate({
                      "height": "100px"
                  });
                  $(this).removeClass("unfold").addClass("packUp").html("展开");
              }
          });
          $(".info-tab li").click(function () {
              var self = $(this);
              var index = self.index();
              if (self.hasClass('info-active')) {
                  return;
              }
              $(".info-tab li").removeClass('info-active');
              self.addClass('info-active');
              if (index == 0) {
                  $(".shop-box").addClass('none');
                  $(".online-box").removeClass('none');
              } else {
                  $(".shop-box").removeClass('none');
                  $(".online-box").addClass('none');
              }
          });
      },
      //酒店级别hover效果
      hoverHotelLevel: function () {

          $(document).on('mouseover', ".level", function () {
              var con = '<div class="assess assess-tip">行业网站评定为：<span style="color:#f60">' + $(this).data('name') + '</span><b><i></i></b></div>';
              var levelTop = $(this).offset().top;
              var nameTop = $(this).siblings('.hotelName').offset().top || 0;
              var nameHeight = $(this).siblings('.hotelName').height() || 0;
              if (levelTop > (nameTop + 16)) {
                  con = '<div class="assess_right assess-tip">行业网站评定为：<span style="color:#f60">' + $(this).data('name') + '</span></div>';
                  $(this).after(con);
              } else {
                  $(this).append(con);
                  $(this).find('.assess').css('left', ($(this).siblings('.hotelName').width() - ($(this).find('.assess').width() - $(this).width()) / 2) + 'px');
              }
          });
          $(document).on('mouseout', '.level', function () {
              $('.assess-tip').remove();
          });

      },
      //机加酒自助打包
      setSelHelpPack: function () {
          var packaged = new Packaged();

          packaged.init();
      },
      getNewData: function (cfg) {
          var self = this,
              url = cfg.url,
              noresultHtml = cfg.noresultHtml,
              loadDiv = cfg.loadDiv,
              param = cfg.param;
          var _param = $.extend({}, param);
          $.ajax({
              url: url,
              data: _param,
              dataType: "json",
              beforeSend: function () {
                  $(loadDiv).html("<div class='data-loading'><div class='bg'></div><span>努力加载中，请稍等...</span></div>");
              },
              success: function (data) {
                  var hotel, str;
                  var hotelArr = [];
                  if (data) {
                      //data = (cfg.deal && cfg.deal.call(self,data));
                      if (cfg.render) {
                          cfg.render.call(self, data);
                      }
                  } else {
                      if (noresultHtml) {
                          $(loadDiv).html(noresultHtml);
                      }
                  }
              },
              error: function () { }
          });
      },
      initRouteDetail: function () {
          var self = this,
              url = "/intervacation/api/PDynamicPackageProductDetail/GetLineDetail?id=" + $("#lineId").val();
          $.ajax({
              url: url,
              type: 'get',
              dataType: 'json',
              success: function (data) {
                  var tmpl = self.tmpl,
                      html1, html2, html3, html4, html5;
                  if(data.Data){
                      html1 = tmpl["routeDetail"](data);
                      $("#routeInfo").empty().append(html1);
                      html2 = tmpl["fee"](data);
                      $(".fee-box").empty().append(html2);
                      html3 = tmpl["tourKnow"](data);
                      $(".J_tourKnow").empty().append(html3);
                      html4 = tmpl["warningSafe"](data);
                      $(".J_warnInfo").empty().append(html4);
                      self.initEv();
                      if (data.Code == 4000) {
                          if (data.Data.TourGuideDays.length) {
                              self.initDayScroll();
                          }
                          if (data.Data.Visa != null) {
                              self.visaParam.CountryId = data.Data.Visa.CountryId;
                              self.visaParam.VisaTypeId = data.Data.Visa.VisaTypeId;
                              self.visaParam.Regions = data.Data.Visa.Regions;
                              self.initvisa(data.Data.Visa.CountryId, data.Data.Visa.Regions[0], data.Data.Visa.VisaTypeId);
                          }
                      }
                  }

              }
          });
      },
      initvisa: function (CountryId, Regions, VisaTypeId) {
          var self = this;
          var url = "/intervacation/api/PDynamicPackageProductDetail/GetVisaMaterial?countryId=" + CountryId + "&regionId=" + Regions.Id + "&visatype=" + VisaTypeId;
          $.ajax({
              url: url,
              type: 'get',
              dataType: 'json',
              success: function (data) {
                  if (data.Code == 4000) {
                      data.Data.Regions = self.visaParam.Regions;
                      var tmpl = self.tmpl,
                          html;
                      html = tmpl["visa"](data);
                      $(".visa-content").empty().append(html);
                      $(".visa-detail a").attr("target", "_blank");
                      self.visaEve();
                  } else {
                      $("#visaInfo").empty();
                      if (!$(".J_tourKnow").html()) {
                          $(".title-warnInfo").addClass('none');
                      }
                  }
              }
          });
      },
      visaMoreEve: function () {
          var self = this;
          $(document).on("click", ".morevisa", function () {
              $(".moreVisaBox").removeClass('none');
          });
          $(document).on("click", ".moreVisaBox li", function () {
              var _this = $(this),
                  Regions = {};
              Regions.Id = _this.attr("data-id");
              $(".morevisa em").html(_this.html());
              self.initvisa(self.visaParam.CountryId, Regions, self.visaParam.VisaTypeId);
              $(".moreVisaBox").addClass('none');
          });
      },
      visaEve: function () {
          $(".visa-item .nav-tab li").click(function () {
              var _this = $(this);
              var index = _this.index();
              $(".visa-item .nav-tab li").removeClass('current');
              _this.addClass('current');
              $(".visa-details").addClass('none');
              $(".visa-details").eq(index).removeClass('none');
          });
      },
      initShop: function () {
          var self = this;
          var tmpl = this.tmpl;
          var cityId = $("#cityId").val();
          var url = '/intervacation/api/PDynamicPackageProductDetail/GetStores?cityId=' + cityId;
          $.ajax({
              url: url,
              type: 'get',
              dataType: 'json',
              success: function (data) {
                  var html;
                  html = tmpl["nearshop"](data);
                  $(".J_shopbox").empty().html(html);
                  self.shopEve();
              }
          });
      },
      shopEve: function () {
          var self = this;
          $(".send-pro").click(function () {
              var type = 0;
              $(".send-pro-ul").empty();
              self.renderShopPro(type);
              $(".send-pro-ul").removeClass('none');
          });
          $(".send-city").click(function () {
              var type = 1;
              var data_id = $(".send-pro").attr("data-id");
              $(".send-city-ul").empty();
              self.renderShopPro(type, data_id);
              $(".send-city-ul").removeClass('none');
          });
          $(".search_shop").click(function () {
              var data_id = $(".send-city").attr("data-id");
              self.renderShopCity(data_id);
          });
          $(".city-box i").click(function () {
              $(".city-box").addClass('none');
          });
          $(".J_moreCity").click(function () {
              $(".city-box").removeClass('none');
          });
          // $(document).on("click",function(){
          //     $(".J_send_ul").addClass("none");
          // });
      },
      renderShopPro: function (type, cfg) {
          var self = this,
              tmpl;
          tmpl = self.tmpl;
          var url = "/intervacation/api/PDynamicPackageProductDetail/GetStoreCitys";
          $.ajax({
              url: url,
              type: 'get',
              dataType: 'json',
              success: function (data) {
                  var html;
                  if (type == 0) {
                      html = tmpl["shopPro"](data);
                      $(".send-pro-ul").html(html);
                  } else if (type == 1) {
                      if (data.Data) {
                          data.Data.proid = cfg;
                          html = tmpl["shopCity"](data);
                          $(".send-city-ul").html(html);
                      }
                  }
                  self.choiceShopCity();
              }
          });
      },
      renderShopCity: function (cfg) {
          var self = this,
              tmpl;
          tmpl = this.tmpl;
          var url = "/intervacation/api/PDynamicPackageProductDetail/GetStores?cityId=" + cfg;
          $.ajax({
              url: url,
              type: 'get',
              dataType: 'json',
              success: function (data) {
                  var html;
                  html = tmpl["findShop"](data);
                  $(".shop-details").empty().html(html);
              }
          });
      },
      choiceShopCity: function () {
          var self = this;
          $(".J_send_ul li").click(function () {
              var _this = $(this);
              var thisIndex = _this.parent().index();
              var $selectspan = $(".J_send_span").eq(thisIndex - 3);
              $selectspan.html(_this.html());
              var data_id = _this.attr("data-id");
              $selectspan.attr("data-id", data_id)
              $(".J_send_ul").addClass('none');
              if (_this.parent().hasClass('send-pro-ul')) {
                  $(".send-city").html("请选择市");
                  $(".send-city").attr('data-id', '');;
              }
          });
      },
      renderList: function (data, type) {
          var self = this,
              context = $(self.content[type]),
              tmpl = self.tmpl,
              html = tmpl[type](data);
          context.empty().append(html);
      },
      calculatePeopleNum: function () {
          var totalNum = 0,
              childNum = 0;
          $(".input-num").each(function () {
              var _this = $(this);
              if (_this.attr("price-type") == "child") {
                  childNum += parseInt(_this.attr("num"));
              }
              totalNum += parseInt(_this.attr("num"));
          });
          return {
              totalNum: totalNum,
              childNum: childNum,
              adult: $("#adult").val(), //成人
              child: $("#child1").val() //儿童占床
          };
      },
      //机票酒店保险初始化
      mainInit: function () {
          var self = this;
          var _param = self.param;
          var calendarParam = JSON.parse(decodeURIComponent($('.dj-calendar').find(".select").find(".cal-sbox").attr("param_cal")));
          if (calendarParam) {
              _param.Flight = calendarParam.Flight || '';
              _param.Hotel = calendarParam.Hotel || '';
              _param.Hotel.RoomCount = $("#room").val();
              _param.Insurance = { "AccidentCode": "", "CancleCode": "" };
              _param.Days = $("#hidDays").val()||"";  //天数

          }
          var cctParam = $("#cctParam").val();
          if (cctParam) {
              _param.Platment = 8;
          }

          // var url = "//10.100.156.179:8082/intervacation/api/PDynamicPackageProductDetail/PostDynamicSaleProduct";
          var url = "/intervacation/api/PDynamicPackageProductDetail/PostDynamicSaleProduct";
          var beforeTime = +new Date;
          $(".J_insuranceBox").empty();
          current_request = Common.ajax({
              url: url,
              type: 'post',
              data: "param=" + encodeURIComponent(JSON.stringify(_param)),
              dataType: 'json',
              timeout: 30000,
              beforeSend: function () {
                  $(".product-box").html("<div class='data-loading'><div class='bg'></div><span>请稍候，正在为您查询中</span></div>");
              },
              success: function (data) {
                  if (data.Data && data.Code == 4000 && data.Data.Tip == 'Success') {
                      self.dataInit(data, 0);
                  } else {
                      var html = '<div class="error-warning"><i></i>来晚啦，该日期已被订光，请更换日期重新搜索</div>';
                      $(".product-box").html(html);
                      $(".J_next").html("已订完");
                      $(".J_OrderBtn").html("已订完");
                      $(".J_next,.J_OrderBtn").removeClass('J_booking').addClass('disable');
                  }
              },
              error: function () {
                  var html = '<div class="error-warning"><i></i>来晚啦，该日期已被订光，请更换日期重新搜索</div>';
                  $(".product-box").html(html);
                  $(".J_next").html("已订完");
                  $(".J_OrderBtn").html("已订完");
                  $(".J_next,.J_OrderBtn").removeClass('J_booking').addClass('disable');
              }
          });
      },
      backInit: function () {
          var self = this;
          if (product.Data.SelectFlights && product.Data.SelectFlights.length) {
              product.Data.Flights = product.Data.SelectFlights;
              product.Data.SelectFlights = null;
          }
          self.dataInit(product, 1);
      },
      dataInit: function (data, isback) {
          var self = this;
          var totalNum = parseInt(self.param.Adult) + parseInt(self.param.Child);
          data.Data.totalNum = totalNum;
          data.Data.LineId = self.param.LineId;
          var siglePrice, hotelPrice = 0,
              Nights = 0,
              roomNum = 0,
              roomNums = 0,
              allPrice = 0,
              sumPrice = 0;
          //计算初始化默认选中酒店的总价
          if (data.Data.Hotels) {
              self.postData.Hotels = data.Data.Hotels;
              var Hotels = [];
              for (var i = 0; i < data.Data.Hotels.length; i++) {
                  var Ahotel = {};
                  Ahotel.CityId = data.Data.Hotels[i].CityId;
                  Ahotel.StartDate = data.Data.Hotels[i].CheckInTime;
                  Ahotel.Nights = data.Data.Hotels[i].Nights;
                  for (var j = 0; j < data.Data.Hotels[i].Rooms.length; j++) {
                      Nights += data.Data.Hotels[i].Nights;
                      if (data.Data.Hotels[i].Rooms[j].IsSelected == 1) {
                          Ahotel.Rooms = [];
                          for (var k = 0; k < data.Data.Hotels[i].Rooms[j].Rates.length; k++) {
                              var Aroom = {};
                              if (data.Data.Hotels[i].Rooms[j].Rates[k].IsSelected == 1) {
                                  Aroom.HotelId = data.Data.Hotels[i].HotelId;
                                  Aroom.IsDirect = data.Data.Hotels[i].IsDirect;
                                  Aroom.RoomId = data.Data.Hotels[i].Rooms[j].Rates[k].RoomId;
                                  Aroom.RateCode = data.Data.Hotels[i].Rooms[j].Rates[k].RateCode;
                                  Aroom.RoomCount = roomNum = data.Data.Hotels[i].Rooms[j].Rates[k].RoomCount;
                                  siglePrice = roomNum * parseInt(data.Data.Hotels[i].Rooms[j].Rates[k].Price);
                                  roomNums += roomNum;
                                  hotelPrice += siglePrice;
                              }
                              Ahotel.Rooms.push(Aroom);
                          }
                      }
                  }
                  Hotels.push(Ahotel);
              }
              self.param.Hotel.Hotels = Hotels;
          }
          if (data.Data.Flights) {
              for (var i = 0; i < data.Data.Flights.length; i++) {
                  allPrice += parseInt(data.Data.Flights[i].Cabins[0].TotalPrice);
              }
              allPrice = hotelPrice + allPrice;
              self.priceParam.TotalPrice = allPrice;
              data.Data.TotalPrice = allPrice;
              var DefaultIndex, DefaultAcc, DefaultAccPrice, DefaultCan, DefaultCanPrice, valueKey;
              //初始化时的保险
              var oldAccidents = [],
                  oldCancles = [];
              if (isback == 1) {
                  var insrueUrl = "/intervacation/api/PDynamicPackageProductDetail/GetInsurances?lineId=" + product.Data.LineId + "&lineDate=" + product.Data.LineDate + "&accidentCode=" + product.Data.AccidentCode;
                  $.ajax({
                      url: insrueUrl,
                      type: 'GET',
                      dataType: 'json'
                  }).then(function (data1) {
                      oldAccidents = data1.Data.Accidents || [];
                      oldCancles = data1.Data.Cancles || [];
                      data.Data.Insurance = {};
                      data.Data.Insurance.Accidents = oldAccidents;
                      data.Data.Insurance.Cancles = oldCancles;
                      self.finalDeal({
                          data: data,
                          allPrice: allPrice,
                          roomNums: roomNums,
                          Nights: Nights,
                          hotelPrice: hotelPrice,
                          totalNum: totalNum,
                          isback: isback
                      });
                  });
              } else {
                  self.finalDeal({
                      data: data,
                      allPrice: allPrice,
                      roomNums: roomNums,
                      Nights: Nights,
                      hotelPrice: hotelPrice,
                      totalNum: totalNum
                  });
              }
          }
      },
      finalDeal: function (cfg) {
          var self = this;
          var data = {};
          data.Data = cfg.data.Data;
          if (data.Data.Insurance != null && data.Data.Insurance.Accidents.length) {
              self.dealInsuranceData(cfg.data, cfg.allPrice);
              DefaultAccPrice = self.priceParam.DefaultAccPrice;
              DefaultCanPrice = self.priceParam.DefaultCanPrice;
              data.Data.DefaultCan = self.priceParam.DefaultCan;
              data.Data.DefaultAcc = self.priceParam.DefaultAcc;
              if (cfg.isback == 1) {
                  data.Data.isback = cfg.isback;
                  if (data.Data.AccidentCode) {
                      data.Data.DefaultAccPrice = self.priceParam.DefaultAccPrice;
                  } else {
                      DefaultAccPrice = 0;
                  }
                  if (data.Data.CancelCode) {
                      data.Data.DefaultCanPrice = self.priceParam.DefaultCanPrice;
                  } else {
                      DefaultCanPrice = 0;
                  }
              } else {
                  data.Data.DefaultAccPrice = self.priceParam.DefaultAccPrice;
                  data.Data.DefaultCanPrice = self.priceParam.DefaultCanPrice;
              }
              var sumPrice = cfg.allPrice + parseInt(cfg.totalNum) * (DefaultAccPrice + DefaultCanPrice);
              data.Data.sumPrice = sumPrice;
              data.Data.AdditionProducts = cfg.data.Data.AdditionProducts;

          } else {
              sumPrice = cfg.allPrice;
              data.Data.sumPrice = sumPrice;
          }
          self.initInsurance(data);   //保险和单品模板中判断了是否显示

          data.Data.roomNum = cfg.roomNums;
          data.Data.Nights = cfg.Nights;
          data.Data.hotelPrice = cfg.hotelPrice;
          data.Data.Adult = self.param.Adult;
          data.Data.childNum = self.param.Child;
          data.Data.DepartDate = data.Data.Flights[0].Flight.StartDate;
          data.Data.ReturnDate = data.Data.Flights[data.Data.Flights.length - 1].Flight.StartDate;
          data.flyParam = {};
          data.flyParam.Flights = data.Data.Flights;
          data.flyParam.Hotels = data.Data.Hotels;
          data.flyParam.LineDate = data.Data.DepartDate;
          data.flyParam.Adult = data.Data.Adult;
          data.flyParam.Child = data.Data.childNum;
          data.flyParam.RoomCount = $(".roomItem input").val();
          data.flyParam.FlightIndex = 0;
          data.flyParam.EndUrl = window.location.href;
          data.flyParam.ChildAges = self.param.ChildAges;
          data.flyParam.AdditionProducts = data.Data.AdditionProducts;   //sbu

          var lineId = $("#lineId").val();
          data.flyParam.LineId = parseInt(lineId) || "";
          var tmpl = self.tmpl,
              html1, html2;
          html1 = tmpl["flyHotel"](data);
          $(".product-box").empty().append(html1);
          $(".calTotalPrice").removeClass('none');
          $(".sureOr").addClass('none');
          $(".J_OrderBtn").addClass('J_booking').removeClass('disable').html("<span></span> 立即预订&gt;&gt;");
          $(".reserve-btn span").html("¥" + sumPrice);
          $(".txt_allPrice em").html(sumPrice);
          $(".J_next").removeClass('disable').addClass('J_booking').html("下一步<em>填写订单</em>");
          self.mainEve();
          if (data.Data) {
              self.priceScroll();
          }
          self.travelData = data;
          self.seleceHotel();
      },
      seleceHotel: function () {
          var self = this,
              tmpl = self.tmpl,
              html,
              num = self.calculatePeopleNum(),
              adult = num.adult,
              child = num.child,
              childNum = num.childNum,
              totalNum = num.totalNum;
          $(".btn-choice-flight").click(function () {
              var _this = $(this);
              var hotelSum = 0,
                  hotelPrice = 0,
                  signleSum = 0,
                  siglePrice = 0,
                  roomPrice = 0,
                  allPrice = 0;
              if (_this.hasClass('has-choice-hotel')) {
                  return;
              }
              self.postData = JSON.parse(decodeURIComponent($(".btn-hotel").attr("data-flyParam")));
              var $selectli = _this.parent().parent().parent().parent().parent();
              $selectli.parents(".box-hotel").find('.has-choice-hotel').removeClass('has-choice-hotel');
              _this.addClass('has-choice-hotel');
              _this.html("已 选<i></i>");
              var index = _this.parents(".box-hotel").attr("param-index");
              index = parseInt(index);
              var RoomParam = $selectli.attr("data-RoomParam");
              self.postData.LineId = parseInt(self.lineId);
              self.postData.LineDate = self.param.LineDate;
              RoomParam = JSON.parse(decodeURIComponent(RoomParam));
              RoomParam.IsSelected = 1;
              RoomParam.Rates[0].IsSelected = 1;
              RoomParam.Rates[0].DifferencePrice = 0;
              self.postData.Hotels[index].Rooms = [];
              self.postData.Hotels[index].Rooms.push(RoomParam);
              var cancelObj = $(".Cancles-list").find(".others-check.radio_checked");
              var accObj = $(".Accidents-list").find(".others-check.radio_checked");
              if (accObj && accObj.length>0) {
                  for (var i = 0; i < accObj.length; i++) {
                      if ($(accObj).eq(i).hasClass("radio_checked")) {
                          self.postData.AccidentCode = $(accObj).eq(i).parent().attr("data-id");
                          break;
                      } else {
                          self.postData.AccidentCode = "";
                      }
                  }
              }
              if (cancelObj && cancelObj.length>0) {
                  self.postData.CancelCode = $(".Cancles-list").find(".other-content").attr("data-id");
              } else {
                  self.postData.CancelCode = "";
              }
              var cctParam = $("#cctParam").val();
              if (cctParam) {
                  var thisCctParam = cctParam;
                  $("#fromCctParam").val(thisCctParam);
                  self.postData.Platment = 8;
              }
              var url = window.location.href;
              var thisparam = encodeURIComponent(JSON.stringify(self.postData));
              $("#hotelForm").attr('action', url);
              $("#productParam").val(thisparam);
              $("#hotelForm").submit();
              //统计埋点
              var oldhotel = "",
                  newhotel = "",
                  addprice = "",
                  hotelname = "",
                  newsta = "";
              oldhotel = $selectli.parent().parent().find('.t-hotelName').first().html();
              newhotel = $selectli.parent().prev(".t-hotelName").html();
              addprice = $selectli.find('.hotel-diffPri .fp-fee-add').html();
              hotelname = $selectli.parent().parent().parent().parent().find('.hotel-title em').html();
              newsta = hotelname + "_" + oldhotel + "_" + newhotel + "_" + addprice + "_" + self.param.LineId;
              Stat.traceEl(_this, newsta);
          });
          $(".name-room").click(function () {
              var _this = $(this),
                  tmpl = self.tmpl,
                  html = "";
              var $li = _this.parent().parent().parent().parent(),
                  $hotel = $li.parent().parent().parent().parent();
              $(".boxH1").addClass('none');
              if (!_this.hasClass('haschlick')) {
                  _this.addClass('haschlick');
                  if ($hotel.attr("data-isdirect") == 0) {
                      var _html1 = '<div class="boxH1"><div class="data-loading"><i class="btn-closeCheckIn"></i><div class="bg"></div><span>请稍候，正在为您查询中</span></div></div>';
                      $li.append(_html1);
                      var _url = {
                          "LineId": self.param.LineId,
                          "HotelId": $hotel.attr("data-hotelid"),
                          "RoomId": $li.attr("data-roomid"),
                          "RateCode": $li.attr("data-ratecode"),
                          "SupplierId": $li.attr("data-supplierid"),
                          "StartDate": $hotel.attr("data-startdate"),
                          "Nights": $hotel.attr("data-nights"),
                          "Adult": self.param.Adult,
                          "ChildAges": self.param.ChildAges,
                          "RoomCount": $li.attr("data-roomcount")
                      };
                      var cctParam = $("#cctParam").val();
                      if (cctParam) {
                          _url.Platment = 8;
                      }
                      var url = "/intervacation/api/PDynamicPackageHotel/GetHotelRateDetail?param=" + encodeURIComponent(JSON.stringify(_url));
                      $.ajax({
                          url: url,
                          type: 'get',
                          dataType: 'json',
                          success: function (data) {
                              html = tmpl["roomDetail"](data);
                              $li.find('.boxH1').html(html);
                              $li.find('.CheckIn-box-title span').html(_this.attr("data-name"));
                              $(".carousel-spot").carousel({
                                  visible: 1,
                                  auto: false,
                                  btnPrev: ".prev",
                                  btnNext: ".next"
                              });
                          }
                      });
                  } else {
                      var html1 = '<div class="boxH1">' + '<div class="CheckIn-box CheckIn-sbox">' + '<div class="CheckIn-box-title"> <span class="nohotel-title"></span> <i class="btn-closeCheckIn"></i> </div>' + '<div class="content-checkIn clearfix">' + '<div class="noroom"><i></i><span>很抱歉，暂无该房型信息</span></div>' + '</div></div></div>';
                      $li.append(html1);
                      $li.find('.CheckIn-box-title span').html(_this.attr("data-name"));
                  }
              } else {
                  $li.find('.boxH1').removeClass('none');
              }
          });
          $(".roomSelect").change(function () {
              var _this = $(this),
                  defaultSum, singlePrice, diffPrice, chajia, newprice, priceHtml;
              var $selectLi = _this.parent().parent().parent().parent().parent().parent();
              var hotelSum = 0,
                  hotelPrice = 0,
                  signleSum = 0,
                  siglePrice = 0,
                  roomPrice = 0,
                  allPrice = 0;
              signleSum = _this.val();
              defaultSum = $selectLi.attr("data-defnum");
              singlePrice = $selectLi.attr("data-price");
              diffPrice = $selectLi.attr("data-difpri");
              chajia = (parseInt(signleSum) - parseInt(defaultSum)) * parseInt(singlePrice);
              newprice = chajia + parseInt(diffPrice);
              if (newprice > 0) {
                  priceHtml = "差价：+ ¥" + Math.abs(newprice).toString();
              } else if (newprice == 0) {
                  priceHtml = "差价：¥" + Math.abs(newprice).toString();
              } else {
                  priceHtml = "差价：- ¥" + Math.abs(newprice).toString();
              }
              _this.parent().parent().siblings(".hotel-diffPri").find('.fp-fee-add').html(priceHtml);
              if ($selectLi.hasClass('hotel-has-select')) {
                  var data = self.travelData;
                  $(".has-choice-hotel").each(function (i, elem) {
                      var signleSum = $(elem).parent().siblings('.hotelSum').find('.roomSelect').val();
                      siglePrice = $(elem).parent().parent().parent().parent().parent().attr("data-price");
                      roomPrice = parseInt(signleSum) * parseInt(siglePrice);
                      hotelSum += parseInt(signleSum);
                      hotelPrice += roomPrice;
                  });
                  data.Data.roomNum = hotelSum;
                  allPrice = hotelPrice + parseInt(data.Data.Flight.TotalPrice);
                  if (data.Data.Insurance.Accidents.length) {
                      self.dealInsuranceData(data, allPrice);
                      DefaultAccPrice = self.priceParam.DefaultAccPrice;
                      DefaultCanPrice = self.priceParam.DefaultCanPrice;
                      sumPrice = allPrice + parseInt(totalNum) * (DefaultAccPrice + DefaultCanPrice);
                      data.Data.sumPrice = sumPrice;
                      data.Data.TotalPrice = allPrice;
                      data.Data.DefaultAcc = self.priceParam.DefaultAcc;
                      data.Data.DefaultAccPrice = self.priceParam.DefaultAccPrice;
                      data.Data.DefaultCan = self.priceParam.DefaultCan;
                      data.Data.DefaultCanPrice = self.priceParam.DefaultCanPrice;
                      self.initInsurance(data);
                  } else {
                      sumPrice = allPrice;
                      data.Data.sumPrice = sumPrice;
                      data.Data.TotalPrice = allPrice;
                  }
                  self.priceParam.TotalPrice = allPrice;
                  var $selectli = _this.parent().parent().parent().parent().parent();
                  var index = _this.parent().parent().parent().parent().parent().parent().parent().parent().parent().attr("param-index");
                  index = parseInt(index);
                  var signleSum = _this.val();
                  self.param.Hotel.Hotels[index].RoomCount = signleSum;
                  html = tmpl["priceBox"](data);
                  $(".price-box").empty().html(html);
                  $(".reserve-btn span").html("¥" + sumPrice);
                  $(".txt_allPrice em").html(sumPrice);
                  self.bookingEve();
              }
          });
      },
      initInsurance: function (data) {
          var self = this;
          var tmpl = self.tmpl,
              html1;
          html1 = tmpl["insuranceDetail"](data);
          $(".J_insuranceBox").empty().append(html1);
          self.insuranceEvent();
          self.additionEvent(); //sub产品点击事件
      },
      dealInsuranceData: function (data, allPrice) {
          var self = this,
              DefaultIndex, valueKey = 0;
          var allPrice = allPrice / data.Data.totalNum;
          if (data.Data.Insurance) {
              for (var i = 0; i < data.Data.Insurance.Accidents.length; i++) {
                  if (data.Data.Insurance.Accidents[i].IsSelected == 1) {
                      DefaultIndex = i;
                      break;
                  }
              }
              if (DefaultIndex) {
                  self.priceParam.DefaultAcc = data.Data.Insurance.Accidents[DefaultIndex].Name;
                  self.priceParam.DefaultAccPrice = data.Data.Insurance.Accidents[DefaultIndex].Price;
                  self.postData.AccidentCode = self.param.Insurance.AccidentCode = data.Data.Insurance.Accidents[DefaultIndex].Id;
              } else {
                  self.priceParam.DefaultAcc = data.Data.Insurance.Accidents[0].Name;
                  self.priceParam.DefaultAccPrice = data.Data.Insurance.Accidents[0].Price;
                  self.postData.AccidentCode = self.param.Insurance.AccidentCode = data.Data.Insurance.Accidents[0].Id;
              }
              var canLength = data.Data.Insurance.Cancles.length;
              if (data.Data.Insurance.Cancles && canLength > 0) {
                  for (var j = 0; j < canLength; j++) {
                      minValue = data.Data.Insurance.Cancles[j].MinValue - 1;
                      maxValue = data.Data.Insurance.Cancles[j].MaxValue + 1;
                      if (allPrice > minValue && allPrice < maxValue) {
                          valueKey = j;
                          break;
                      }
                  }
                  if (allPrice > data.Data.Insurance.Cancles[canLength - 1].MaxValue) {
                      valueKey = canLength - 1;
                  }
                  self.priceParam.DefaultCan = data.Data.Insurance.Cancles[valueKey].Insurance.Name;
                  self.priceParam.DefaultCanPrice = data.Data.Insurance.Cancles[valueKey].Insurance.Price;
                  self.param.Insurance.CancleCode = data.Data.Insurance.Cancles[valueKey].Insurance.Id;
              } else {
                  self.priceParam.DefaultCan = "";
                  self.priceParam.DefaultCanPrice = 0;
                  self.param.Insurance.CancleCode = "";
              }
          }
      },
      insuranceEvent: function () {
          var _self = this;
          // 更多意外险
          $(".Accidents-list .more-others").click(function () {
              var self = $(this);
              if (self.hasClass('shou')) {
                  self.removeClass('shou');
                  self.html("更多意外险<i></i>");
                  $(".Accidents-list").prepend($(".Accidents-list .others-check.radio_checked").parent());
                  $(self.parent().find(".other-content")).eq(1).addClass('none');
              } else {
                  self.html("收起<i></i>");
                  self.addClass('shou');
                  $(self.parent().find(".other-content")).eq(1).removeClass('none');
              }
          });
          $(".Accidents-list .others-check").click(function () {
              var _this = $(this),
                  price, id, totalprice, sum;
              if(_this.hasClass("radio_checked")){
                  _this.parents(".others-list").find('.others-check').removeClass("radio_checked");
                  _this.removeClass("radio_checked");
              }else{
                  _this.parents(".others-list").find('.others-check').removeClass("radio_checked");
                  _this.addClass("radio_checked");
              }

              var domList = _this.parents(".others-list").find('.others-check.radio_checked');
              if(domList.length>0){
                  $(".J_Accidents").parent("dl").show();
                  _self.postData.AccidentCode = _self.param.Insurance.AccidentCode = _this.parent().attr('data-id');
                  $(".J_Accidents .Lbox").html(_this.parent().attr('data-name'));
                  price = "¥" + _this.parent().attr('data-single');
                  $(".J_Accidents .Rbox em").html(price);
                  $(".J_Accidents .Rbox i").html(_this.parent().attr('data-num'));
                  $(".J_Accidents").removeClass('none');
                  totalprice = _self.priceParam.TotalPrice;
              }else{
                  $(".J_Accidents").addClass('none');
                  if ($(".J_Accidents").hasClass("none") && $(".J_Cancles").hasClass("none")) {
                      $(".J_Accidents").parent("dl").hide();
                  }
                  _self.postData.AccidentCode = _self.param.Insurance.AccidentCode = "";
              }
              _self.calprice();
          });
          $(".Cancles-list .others-check").click(function () {
              var _this = $(this),
                  price, id, totalprice, sum;
              if(_this.hasClass("radio_checked")){
                  _this.parents(".others-list").find('.others-check').removeClass("radio_checked");
                  _this.removeClass("radio_checked");
              }else{
                  _this.parents(".others-list").find('.others-check').removeClass("radio_checked");
                  _this.addClass("radio_checked");
              }
              var domList = _this.parents(".others-list").find('.others-check.radio_checked');
              if(domList.length>0){
                  $(".J_Accidents").parent("dl").show();
                  _self.param.Insurance.CancleCode = _this.parent().attr('data-id');

                  $(".J_Cancles .Lbox").html(_this.parent().attr('data-name'));
                  price = "¥" + _this.parent().attr('data-single');
                  $(".J_Cancles .Rbox em").html(price);
                  $(".J_Cancles .Rbox i").html(_this.parent().attr('data-num'));
                  $(".J_Cancles").removeClass('none');
              }else{
                  $(".J_Cancles").addClass('none');
                  if ($(".J_Accidents").hasClass("none") && $(".J_Cancles").hasClass("none")) {
                      $(".J_Accidents").parent("dl").hide();
                  } else {
                      $(".J_Accidents").parent("dl").show();
                  }
                  _self.param.Insurance.CancleCode = "";
              }
              _self.calprice();
          })
      },
      /*****   新增SBU附加产品  *****/
      additionEvent:function(){
          var self = this;
          $(".select_other").click(function (e) {
              var _this = $(this);
              _this.find(".other_num").slideToggle(200);
              $(document).bind('click', function () {
                  self.__docClick.call(self, arguments.callee);
              });
              self.__stopPropagation();
          });
          $(".Addition-list .more-others").click(function () {
              var _this = $(this);
              if (_this.hasClass('shou')) {
                  _this.removeClass('shou');
                  _this.html(_this.attr("data-name") +"<i></i>");
                  $(".Accidents-list").prepend($(".Accidents-list .others-check.radio_checked").parent());
                  $(_this.parent().find(".other-content:not(.other-content:first)")).addClass('none');
              } else {
                  _this.html("收起<i></i>");
                  _this.addClass('shou');
                  $(_this.parent().find(".other-content:not(.other-content:first)")).removeClass('none');

              }
              self.priceScroll();

          });
          $(".cal-date .J_other_num li").click(function (e) {
              e.stopPropagation();
              var _this = $(this),
                  newsum = $.trim(_this.html()),
                  single = parseInt(_this.attr("data-value")),
                  id = parseInt(_this.attr("data-id")),
                  inputSingle = _this.parents(".select_other").find(".J_ui_select").attr("data-value");

              _this.parents(".select_other").find(".J_ui_select").val(newsum);
              _this.parents(".cal-date").next(".tc-other-price").html("¥"+single);

              _this.parents(".add_content").attr({
                  "data-single":single,
                  "data-date": newsum
              });
              // 如果价格改变，则重新计算
              if(_this.parents(".add_content").find(".select_num").val()!="0" && inputSingle!= single){
                  self.calprice();
              }
              _this.parent(".other_num").slideUp(200);
          });
          // 数量点击
          $(".num-others .J_other_num li").on("click",function(e){
              e.stopPropagation();
              var _this = $(this),
                  newsum = $.trim(_this.html()),
                  parents = _this.parents(".add_content"),
                  input = parents.find(".others-check"),
                  calBox = parents.find(".cal-date .select_other");
              if(calBox&&calBox.length<1){   //没有日历框
                  if($.trim(_this.text())!="0"){
                      input.addClass("radio_checked");
                  }else{
                      input.removeClass("radio_checked");
                  }
                  _this.parents(".select_other").find(".J_ui_select").val(newsum);
                  _this.parents(".add_content").attr(
                      "data-num",parseInt(newsum)
                  );
                  _this.parent(".other_num").slideUp(200);
              }else{
                  if(parents.find(".cal-date .select_date") && $.trim(parents.find(".cal-date .select_date").val())!=""){
                      if($.trim(_this.text())!="0"){
                          input.addClass("radio_checked");
                      }else{
                          input.removeClass("radio_checked");
                      }
                      _this.parents(".select_other").find(".J_ui_select").val(newsum);
                      _this.parents(".add_content").attr("data-num",parseInt(newsum));
                      _this.parent(".other_num").slideUp(200);
                  }else{
                      calBox.addClass("active");
                      setTimeout(function(){
                          calBox.removeClass("active");
                      },2000);
                      _this.parent(".other_num").slideUp(200);
                      return;
                  }
              }
              self.calprice();
              self.priceScroll();
          });
      },
      /*****   新增SBU附加产品  *****/
      calprice: function () {
          var self = this,
              tmpl = self.tmpl,
              totalPrice = 0,
              sumPrice = 0,
              siglePrice = 0,
              siglesum = 0,
              price = 0,
              allPrice = 0,
              AdditionProducts = [];
          // 注：SBU产品计算价格,获取所有产品，参数合并到改变机酒的post参数中
          // 重新渲染，渲染选中数据
          $(".Addition-list").each(function (i, elem) {
              var _this = $(this),
                  lists = {},
                  child = _this.find(".others-check");
              lists.Category =  _this.attr("data-value");
              lists.Products = [];
              $(child).each(function (i, elem) {
                  var elem = $(this);
                  var parent = $(elem).parents(".add_content"),
                      addBook = {
                          Book:{
                              Date: parent.attr("data-date") ||"",
                              Count: parseInt(parent.attr("data-num"))||0,
                              Price: parseInt(parent.attr("data-single"))||0
                          },
                          Name: parent.attr("data-name"),
                          IsSelected: 0
                      };
                    if(elem.hasClass("radio_checked") && parseInt(parent.attr("data-num"))!=0){  //是否选中
                        addBook.IsSelected =1;
                    }
                  lists.Products.push(addBook);
              });
              AdditionProducts.push(lists);
          });

          // SBU产品参数
          var addParam = {
                  AdditionProducts: AdditionProducts
              },
              Param = JSON.parse(decodeURIComponent($(".btn-flight").attr("data-flyParam")));
          $.extend(true,Param,addParam);

          var bookParam = encodeURIComponent(JSON.stringify(Param));
          // 重置参数，机酒改变时post数据
          $(".btn-hotel").attr("data-flyparam",bookParam);
          $(".btn-flight").attr("data-flyparam",bookParam);

          $(".others-check.radio_checked").each(function (i, elem) {
              siglePrice = parseInt($(elem).parent().attr("data-single"));
              siglesum = parseInt($(elem).parent().attr("data-num"));
              price = siglePrice * siglesum;
              allPrice += price;
          });
          var html1 = tmpl["addPrice"](AdditionProducts);
          $(".J_addPrice").empty().html(html1);

          totalPrice = self.priceParam.TotalPrice + allPrice;
          $(".total-pr .Rbox em").html(totalPrice);
          $(".reserve-btn span").html("¥" + totalPrice);
          $(".txt_allPrice em").html(totalPrice);
      },
      priceScroll: function (type) {
          var posTopOrigin = $('.flight-box').offset().top + 60;
          var botHeight = $(".J_routeDetail").offset().top - $('.price-box').height() - 160;

          $(window).on('scroll', function () {
              if (posTopOrigin < $(window).scrollTop() && $(window).scrollTop() < botHeight) {
                  $('.price-box').addClass('priceFixed');
                  $('.price-box').removeAttr("style");
              } else {
                  $('.price-box').removeClass('priceFixed');
                  $('.price-box').css('right', '28px');
              }
          });
      },
      packEve: function () {
          var _self = this;
          $(".J_packed").click(function () {
              var num = _self.calculatePeopleNum(),
                  adult = num.adult,
                  child = num.child,
                  childNum = num.child;
              var _param = _self.param;
              var room = parseInt($("#room").val());
              var data_date = $(".J_date").attr('data-date');
              _self.postData.RoomCount = _self.param.Hotel.RoomCount = _self.tmplParam.RoomCount = parseInt(room);
              _self.postData.Adult = _self.param.Adult = _self.tmplParam.Adult = parseInt(adult);
              _self.postData.Child = _self.param.Child = _self.tmplParam.Child = parseInt(child);
              _self.param.IsDefault = 1;
              var ageList = [];
              if (_self.param.Child != 0) {
                  _self.renderAgeHtml();
                  $(".drop-child").each(function () {
                      var _this = $(this);
                      var childage = _this.attr("data-year");
                      ageList.push(childage);
                  });
              }
              _self.postData.ChildAges = _self.param.ChildAges = _self.tmplParam.ChildAges = ageList;
              $(".txt_allPrice em").html("---");
              $(".J_next,.J_OrderBtn").removeClass('J_booking').addClass('disable').html("努力加载中...");
              $(".calTotalPrice").removeClass('none');
              $(".sureOr").addClass('none');
              if (_self.param.Hotel.Hotels.length) {
                  for (var i = 0; i < _self.param.Hotel.Hotels.length; i++) {
                      _self.param.Hotel.Hotels[i].Rooms[0].RoomId = '';
                      _self.param.Hotel.Hotels[i].Rooms[0].RateCode = '';
                  }
              }
              _self.mainInit();
          });
      },
      mainEve: function () {
          var _self = this;
          var isrun = false;
          $(document).on('click', ".btn-closeCheckIn", function () {
              $(".boxH1").addClass('none');
          });
          $(".J_more").click(function () {
              var self = $(this);
              if (self.hasClass('fold')) {
                  self.removeClass('fold');
                  self.html("展开全部房型<b></b>");
                  if (self.parent().prev(".box-hotel").find('.roomType-box').height() > 400) {
                      var thisHeight = self.parent().prev(".box-hotel").offset().top - 120;
                      $("body").scrollTop(thisHeight);
                  }
                  self.parent().prev(".box-hotel").find('.hotelbox1').removeClass('none');
                  self.parent().prev(".box-hotel").find('.hotelbox2').addClass('none');
                  _self.priceScroll();
                  //self.parent().prev(".box-hotel").css('height', '192px');
              } else {
                  if (!self.hasClass('hasClick')) {
                      // _self.hotelParam.ChildAges = _self.param.ChildAges;
                      var _url, newurl = {};
                      //newurl = $.extend({}, _self.hotelParam);
                      var node = self.parent().prev(".box-hotel").find('.hotelbox1 .hotel-has-select');
                      var postHotelData = self.attr("data-hotelParam");
                      postHotelData = JSON.parse(decodeURIComponent(postHotelData));
                      newurl = {
                          "LineId": parseInt(_self.param.LineId),
                          "LineDate": node.attr('data-startdate'),
                          "Adult": _self.param.Adult,
                          "ChildAges": _self.param.ChildAges,
                          "RoomCount": _self.param.Hotel.RoomCount,
                          "Hotel": postHotelData
                      };
                      var cctParam = $("#cctParam").val();
                      if (cctParam) {
                          newurl.Platment = 8;
                      }
                      var url = "/intervacation/api/PDynamicPackageHotel/PostHotelRooms";
                      if (!isrun) {
                          isrun = true;
                          self.html("加载中<i></i>");
                          $.ajax({
                              url: url,
                              type: 'post',
                              data: 'param=' + encodeURIComponent(JSON.stringify(newurl)),
                              dataType: 'json',
                              success: function (data) {
                                  if (data.Data) {
                                      var tmpl = _self.tmpl,
                                          html;
                                      html = tmpl["moreHotel"](data);
                                      self.parent().prev(".box-hotel").find('.hotelbox1').addClass('none');
                                      self.parent().prev(".box-hotel").find('.hotelbox2').html(html);
                                  } else {
                                      self.parent().prev(".box-hotel").find('.hotelbox1').addClass('none');
                                      var box1Html = self.parent().prev(".box-hotel").find('.hotelbox1').html();
                                      var box2Html = box1Html + '<div class="nomoreRoom">没有更多房型啦</div>';
                                      self.parent().prev(".box-hotel").find('.hotelbox2').append(box2Html);
                                  }
                                  self.html("收起全部房型<b></b>");
                                  self.addClass('fold').addClass('hasClick');
                                  self.parent().prev(".box-hotel").css('height', 'auto');
                                  var data1 = _self.travelData;
                                  _self.seleceHotel(data1);
                                  _self.priceScroll();
                              },
                              complete: function () {
                                  isrun = false;
                              }
                          });
                      }

                  } else {
                      self.html("收起全部房型<b></b>");
                      self.addClass('fold').addClass('hasClick');
                      self.parent().prev(".box-hotel").find('.hotelbox1').addClass('none');
                      self.parent().prev(".box-hotel").find('.hotelbox2').removeClass('none');
                      _self.priceScroll();
                  }
              }
          });
          $(".btn-hotel").click(function () {
              var self = $(this);
              var url = "/dujia/travel/selectHotel.html?id=" + parseInt(_self.lineId);
              var hotelIndex = self.parents(".box-hotel").attr("param-index");
              _self.postData = JSON.parse(decodeURIComponent(self.attr("data-flyParam")));
              _self.postData.HotelIndex = hotelIndex;
              var cctParam = $("#cctParam").val();
              var cancelObj = $(".Cancles-list").find(".others-check.radio_checked");
              var accObj = $(".Accidents-list").find(".others-check.radio_checked");
              if (accObj && accObj.length>0) {
                  for (var i = 0; i < accObj.length; i++) {
                      if ($(accObj).eq(i).hasClass("radio_checked")) {
                          _self.postData.AccidentCode = $(accObj).eq(i).parent().attr("data-id");
                          break;
                      } else {
                          _self.postData.AccidentCode = "";
                      }
                  }
              }
              if (cancelObj && cancelObj.length>0) {
                  _self.postData.CancelCode = $(".Cancles-list").find(".other-content").attr("data-id");
              } else {
                  _self.postData.CancelCode = "";
              }
              if (cctParam) {
                  var thisCctParam = cctParam;
                  $("#fromCctParam").val(thisCctParam);
                  _self.postData.Platment = 8;
              }
              var thisparam = encodeURIComponent(JSON.stringify(_self.postData));
              $("#hotelForm").attr('action', url);
              $("#productParam").val(thisparam);
              $("#hotelForm").submit();
              //location.href = url;
          });
          $(".btn-flight").click(function () {
              var self = $(this);
              var url = "/dujia/travel/selectFlight.html?id=" + _self.lineId;
              _self.postData = JSON.parse(decodeURIComponent(self.attr("data-flyParam")));
              var cctParam = $("#cctParam").val();
              var cancelObj = $(".Cancles-list").find(".others-check.radio_checked");
              var accObj = $(".Accidents-list").find(".others-check.radio_checked");
              if (accObj && accObj.length>0) {
                  for (var i = 0; i < accObj.length; i++) {
                      if ($(accObj).eq(i).hasClass("radio_checked")) {
                          _self.postData.AccidentCode = $(accObj).eq(i).parent().attr("data-id");
                          break;
                      } else {
                          _self.postData.AccidentCode = "";
                      }
                  }
              }
              if (cancelObj && cancelObj.length>0) {
                  _self.postData.CancelCode = $(".Cancles-list").find(".other-content").attr("data-id");
              } else {
                  _self.postData.CancelCode = "";
              }
              if (cctParam) {
                  var thisCctParam = cctParam;
                  $("#fromCctParam").val(thisCctParam);
                  _self.postData.Platment = 8;
              }
              var thisparam = encodeURIComponent(JSON.stringify(_self.postData));
              $("#hotelForm").attr('action', url);
              $("#productParam").val(thisparam);
              $("#hotelForm").submit();
          });
      },
      bookingEve: function () {
          var _self = this;
          $(document).on('click', ".J_booking", function () {
              clearTimeout(citytimer);
              _self.overTime();
              var content = '<div class="error-warning1 fixed-warn1"><div class="data-loading"><div class="bg"></div><span>请稍候，正在为您查询中</span></div></div>';
              var config = {
                  content: content,
                  width: 500,
                  title: '',
                  quickClose: false,
                  zIndex: 100000
              };
              $dialog.modal(config);
              window.dialog = $dialog;
              var yanjia_param = {},
                  self = $(this),
                  flightParam, siglefly, flyParam = [],AdditionPost=[],
                  siglehotel, hotelParam = [];
              var bookParam = JSON.parse(decodeURIComponent($(".btn-flight").attr("data-flyParam")));
              yanjia_param.LineId = _self.lineId;
              yanjia_param.LineDate = _self.param.LineDate;
              yanjia_param.Adult = _self.param.Adult;
              //yanjia_param.Child = _self.param.Child;
              yanjia_param.ChildAges = _self.param.ChildAges;
              $(".J_booking").html("正在跳转中...");
              yanjia_param.Flights = bookParam.Flights;
              yanjia_param.Hotels = bookParam.Hotels;
              // sbu验价参数
              yanjia_param.AdditionProducts = [];
              yanjia_param.Days = parseInt($("#hidDays").val()) || 0;
              var cancelObj = $(".Cancles-list").find(".others-check.radio_checked");
              var accObj = $(".Accidents-list").find(".others-check.radio_checked");
              if (accObj && accObj.length>0) {
                  for (var i = 0; i < accObj.length; i++) {
                      if ($(accObj).eq(i).hasClass("radio_checked")) {
                          yanjia_param.AccidentInsurance = $(accObj).eq(i).parent().attr("data-id");
                          break;
                      } else {
                          yanjia_param.AccidentInsurance = "";
                      }
                  }
              }
              if (cancelObj && cancelObj.length>0) {
                  yanjia_param.CancleInsurance = $(".Cancles-list").find(".other-content").attr("data-id");
              } else {
                  yanjia_param.CancleInsurance = "";
              }
              $(".Addition-list").each(function (i, elem) {
                    var _this = $(this),
                        child = _this.find(".others-check.radio_checked");
                    $(child).each(function (i, elem) {
                        var elem = $(this);
                        var parent = $(elem).parents(".add_content"),
                            addBook = {
                                Book:{
                                    Date: parent.attr("data-date") ||"",
                                    Count: parseInt(parent.attr("data-num"))||0,
                                    Price: parseInt(parent.attr("data-single"))||0
                                },
                                Name: parent.attr("data-name"),
                                IsSelected: 1
                            };
                        var listParam = {};
                        listParam = JSON.parse(decodeURIComponent(parent.attr("data-param")));
                        $.extend(true,listParam,addBook);
                        AdditionPost.push(listParam);
                    });
                    yanjia_param.AdditionProducts = AdditionPost;
            });
              //国际机票下临时单
              // var url = "//10.100.156.179:8082/intervacation/api/PDynamicPackageFlight/PostFlightTempOrder";
              var url = "/intervacation/api/PDynamicPackageFlight/PostFlightTempOrder";
              var thisparam = encodeURIComponent(JSON.stringify(bookParam.Flights));
              $.ajax({
                  url: url,
                  type: 'post',
                  data: "param=" + thisparam,
                  dataType: 'json',
                  success: function (data) {
                      if (data.Data.IsSuccess == true) {
                          _self.checkPrice(yanjia_param);
                      } else {
                          var content = '<div class="error-warning fixed-warn"><i></i>' + '机票资源不足，换个机票试试吧' + '<span data-dialog-hide>关闭</span></div>';
                          var config = {
                              content: content,
                              width: 500,
                              title: '',
                              quickClose: true
                          };
                          $dialog.modal(config);
                          window.dialog = $dialog;
                          var thisHeight = $(".J_booking").offset().top - 350;
                          $(".ui_dialog_gp").css('top', thisHeight);
                          $(".J_booking").html("立即预订");
                      }
                  }
              });
              //统计代码
              if (self.hasClass('J_next')) {
                  var newsta = _self.param.Adult + "_" + _self.param.Child + "_" + _self.param.Hotel.RoomCount + "_" + $(".txt_allPrice em").html() + "_" + _self.param.LineId;
                  Stat.traceEl(self, newsta);
              } else {
                  Stat.traceEl(self, _self.param.LineId);
              }
          });
      },
      //验价
      checkPrice: function (param) {

          var self = this,
              beforeTime = +new Date;
          var url = "/intervacation/api/PDynamicPackageOrder/PostVerifyPriceResult";
          var thisparam = encodeURIComponent(JSON.stringify(param));
          Common.ajax({
              url: url,
              type: 'post',
              dataType: 'json',
              data: "param=" + thisparam,
              timeout: 30000,
              success: function (data) {
                  if (data.Data.IsSuccess == true) {
                      var lastTime = (+new Date) - beforeTime;
                      var parser = document.createElement('a');
                      parser.href = url;
                      $("#bookingParam").val(data.Data.Param);
                      var cctParam = $("#cctParam").val();
                      if (cctParam) {
                          var thisCctParam = cctParam;
                          $("#bookingCctParam").val(thisCctParam);
                      }
                      // 提交数据
                      $("#bookingForm").submit();
                      Monitor.stat && Monitor.stat("ajaxTime", {
                          "time": lastTime,
                          "url": url.split("?")[0],
                          "path": "_dujia_dynamicpackageajax_pricecheck.ashx"
                      });
                  } else {
                      if(data.Data.FailHotels && data.Data.FailHotels.length > 0){
                          var content = '<div class="error-warning fixed-warn"><i></i>' + '<span class="warningText">来晚了，您选择的<em>' + data.Data.FailHotels[0].CheckInDate + '</em>入住的酒店<em>' + data.Data.FailHotels[0].Name + '</em>已订光，请更换酒店重新预订</span>' + '<span data-dialog-hide class="cleseHotel">关闭</span></div>';
                      }else if(data.Data.FailAdditionProducts && data.Data.FailAdditionProducts.length>0){  //优先提示酒店信息，酒店验证通过，提示单品信息
                          var tipStr = "",
                              dataTip = data.Data.FailAdditionProducts;
                          for(i=0; i<dataTip.length; i++){
                              if(i==dataTip.length-1){
                                  tipStr +=  dataTip[i].Name;
                              }else{
                                  tipStr +=  dataTip[i].Name + "、";
                              }
                          }
                          var content = '<div class="error-warning fixed-warn"><i></i>' +
                          '<span class="warningText">很抱歉，<em>' +  tipStr  + '</em>库存不足，请重新选择~</span>' +
                          '<span data-dialog-hide class="cleseHotel">关闭</span></div>';
                      }else {
                          var content = '<div class="error-warning fixed-warn"><i></i>' + data.Data.Message + '<span data-dialog-hide>关闭</span></div>';
                      }

                      var config = {
                          content: content,
                          width: 500,
                          title: '',
                          quickClose: true
                      };
                      $dialog.modal(config);
                      window.dialog = $dialog;
                      var thisHeight = $(".J_booking").offset().top - 350;
                      $(".ui_dialog_gp").css('top', thisHeight);
                      $(".J_booking").html("立即预订");
                  }
              },
              error: function () {
                  var content = '<div class="error-warning fixed-warn"><i></i>出错啦，刷新下试试吧！<span data-dialog-hide>关闭</span></div>';
                  var config = {
                      content: content,
                      width: 500,
                      title: '',
                      quickClose: true
                  };
                  $dialog.modal(config);
                  window.dialog = $dialog;
                  var thisHeight = $(".J_booking").offset().top - 350;
                  $(".ui_dialog_gp").css('top', thisHeight);
                  $(".J_booking").html("立即预订");
              }
          });
      }
  };
  module.exports = Group;

});
