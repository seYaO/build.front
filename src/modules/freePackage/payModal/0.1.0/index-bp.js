define("payModal/0.1.0/index",["tmpl/pc/order/payModal","payModal/0.1.0/index.css"],function(require,exports,module){



    var  payModalTmpl = require("tmpl/pc/order/payModal");

    var Modal = function(cfg){
        new Modal.fn.init(cfg);
    };
    Modal.host = window.host||"";
    Modal.defcfg = {
        Mode : 0,//支付方式(Mode=0综合支付;Mode=1正常支付;Mode=2分期支付;)
            Type : null,
            CustomerSerialid : null,//客户流水id（必传）
            OrderId : null,//订单id（必传）
            TotalPrice : null,//总价
            GapPrice : null,//余款
            PrimePrice : null,//分期款
            Linker : {
            LinkName : '',
                IdentityID : '',
                Telephone : ''
        },
        JDPeriodInfo : [
        ]//京东分期
    };
    Modal.defurl = {
        iousInfo : '/dujia/AjaxHandler/DujiaAjaxInterface.aspx?action=GETPERIODPAYINFO&CustomerSerialid=',
        iouspost : '/dujia/AjaxHandler/DujiaAjaxInterface.aspx?action=GETJDPAYINFO&PayInfo=',
        gradeUrl: '/dujia/AjaxHandler/DujiaAjaxInterface.aspx?&action=AddPayTimes'
    };

    Modal.fn = Modal.prototype = {
        constructor: Modal,
        //初始化
        init : function(cfg){
            var self = this;
            Modal.defcfg = $.extend(true,Modal.defcfg,cfg);
            //正常支付时无需发异步获取数据
            if(Modal.defcfg.Mode==1){
                self.creatDom(Modal.defcfg);

                return self;
            }else{
                //异步阻止多次加载
                if(!Modal.isOpening){
                    Modal.isOpening = true;
                    $.ajax({
                        url: Modal.host+Modal.defurl.iousInfo+Modal.defcfg.CustomerSerialid,
                        dataType: "jsonp",
                        success:function(datas){
                            var status = parseInt(datas.Status, 10);
                            switch (status) {
                                case 100:
                                    Modal.defcfg = $.extend(true,Modal.defcfg,datas);
                                    self.creatDom(Modal.defcfg);
                                    Modal.isOpening = false;
                                    return self;
                                    break;
                                case 200:
                                    alert("获取京东白条信息失败");
                                    Modal.isOpening = false;
                                    break;
                                default:
                                    break;
                            }
                        }
                    })
                }
            }
        },
        //创建
        creatDom : function(cfg){
            var self = this;

            console&&console.log(cfg);

            //是否是单产品显示不同告示
            if(Modal.defcfg.Type !== 1){
                cfg.modalTmpl =self.treatyTmpl1;
            }else{
                cfg.modalTmpl =self.treatyTmpl2;
            }
            self._modalTmpl = payModalTmpl(cfg);

            //事件绑定
            self.bindEvent();
            //普通模式绑定
            self.usualEvent();
            //京东模式绑定
            self.iousEvent();
        },
        //销毁
        destroy : function(){
            $("#J_paymask").remove();
            $("#J_paymodal").remove();
        },
        //全局事件绑定
        bindEvent : function(){
            var self = this;
            //初始化事件
            $("body").append(self._modalTmpl);

            var Jscop = $("#J_mpay_box");
            Jscop.find(".switch-li").removeClass("current").eq(0).addClass("current");
            Jscop.find(".switch-cont").addClass("none").eq(0).removeClass("none");
            //tab切换
            Jscop.find(".switch-li").on("click",function(){
                var Jself = $(this),i=Jself.index();
                Jself.siblings().removeClass("current");
                Jself.addClass("current");
                Jscop.find(".switch-cont").addClass("none").eq(i).removeClass("none");
            });
            //关闭对话框
            $("#J_pay_close").on("click",function(){
                self.destroy();
            });
        },
        //普通支付验证
        usualCheck : function(){
            var self = this;
            var checkTips = {
                empty : "请输入正确分次金额！",
                less : "亲，设置金额需不小于500元",
                more : "支付金额不能大于剩余金额，请重新输入。"
            };
            var Jpay = $("#J_pay_money");

            if(/^([\u4e00-\u9fa5]+)$/g.test(Jpay.val())){
                Jpay.nextAll(".tips-pay").html(checkTips.empty);
                return false;
            }
            if(parseInt(Jpay.val())<500){
                Jpay.nextAll(".tips-pay").html(checkTips.less);
                return false;
            }
            if(parseInt(Jpay.val())>Modal.defcfg.TotalPrice){
                Jpay.nextAll(".tips-pay").html(checkTips.more);
                return false;
            }
        },
        //普通支付事件
        usualEvent : function(){
            var self = this;
            var Jscop = $("#J_mpay_box"),
                J_pay = Jscop.find(".price-pay"),
                J_put = Jscop.find(".price-put"),
                Jinput = Jscop.find("#J_pay_money");
            //按钮可用事件
            $("#mpayCheck").on("click",function(){
                if($(this)[0].checked){
                    $("#J_pay_sub").addClass("active");
                }else{
                    $("#J_pay_sub").removeClass("active");
                }
            });
            //分次付款事件
            J_pay.find("a").on("click",function(){
                J_pay.addClass("none");
                J_put.removeClass("none");
            });
            Jinput.on("focus",function(){
                var Jself = $(this);
                if (Jself.val() === Jself.attr("attr-value")) {
                    Jself.removeClass("placehold");
                    Jself.val("");
                }
            }).on("blur", function () {
                var Jself = $(this);
                if (Jself.val() === "") {
                    Jself.val(Jself.attr("attr-value"));
                    Jself.addClass("placehold");
                }
                var  value =parseInt(Jself.val());
                if (value) {
                    self.usualCheck();
                }
            });
            //
            $("#J_pay_sub").on("click",function(){
                var orderId = Modal.defcfg.OrderId,
                    payAmount = Modal.defcfg.TotalPrice,
                    param = "&orderid=" + orderId + "&payamount=" + payAmount;

                $.ajax({
                    url: Modal.host+Modal.defcfg.gradeUrl + param,
                    type: "jsonp",
                    fn: function (data) {
                        var status = parseInt(data.status, 10);
                        switch (status) {
                            case 100:
                                window.location.href = data.message;
                                break;
                            case 200:
                                alert("分次失败，请重新提交！");
                                break;
                            default:
                                break;
                        }
                    }
                });

            });
        },
        //京东白条表单提交
        iousSubmit : function(data){
            $("#jd_version").val(data.Version);
            $("#jd_charset").val(data.Charset);
            $("#jd_tradeType").val(data.TradeType);
            $("#jd_merchantCode").val(data.MerchantCode);
            $("#jd_data").val(data.Data);
            $("#jd_sign").val(data.Sign);
            //
            $("#J_jd_post")[0].submit();
        },
        //京东白条验证
        iousCheck : function(){
            var checkTips = {
                name : "请输入正确联系人姓名！",
                id : "请输入正确联系人身份证号！",
                phone : "请输入正确联系人手机号！"
            };
            var iousRep = {
                name : /^([\u4e00-\u9fa5]+|([a-z]+\s?)+)$/,
                id : /(^\d{15}$)|(^\d{17}([0-9]|\w)$)/,
                phone :/^1[0-9]{10}$/
            };
            var JmpayName = $("#mpayName"),
                JmpayIdenty = $("#mpayIdenty"),
                JmpayPhone = $("#mpayPhone");
            //

            if(!iousRep.name.test(JmpayName.val())){
                JmpayName.next(".form-tip").html(checkTips.name);
                return false;
            }
            if(!iousRep.id.test(JmpayIdenty.val())){
                JmpayIdenty.next(".form-tip").html(checkTips.id);
                return false;
            }
            if(!iousRep.phone.test(JmpayPhone.val())){
                JmpayPhone.next(".form-tip").html(checkTips.phone);
                return false;
            }
            return true;
        },
        //京东白条事件
        iousEvent : function(){
            var self = this,JmpayName = $("#mpayName");
            //
            if(JmpayName.val()!==""){
                JmpayName.attr("disabled",true);
            }

            //按钮可用事件
            $("#mpayCheck2").on("click",function(){
                if($(this)[0].checked){
                    $("#J_pay_sub2").addClass("active");
                }else{
                    $("#J_pay_sub2").removeClass("active");
                }
            });
            //
            $("#J_pay_sub2").on("click",function(){
                if(!Modal.isSubimit){
                    Modal.isSubimit =true;
                    if(self.iousCheck()){
                        //begin
                        var PayInfo = {
                            OrderId : Modal.defcfg.OrderId,
                            UserName : $("#mpayName").val(),
                            UserIdNo :  $("#mpayIdenty").val(),
                            UserPhone :  $("#mpayPhone").val(),
                            StageNum : 0,
                            Amount : Modal.defcfg.PrimePrice
                        };
                        $("#J_pay_radio").find("input").each(function(){
                            if($(this)[0].checked){
                                PayInfo.StageNum =$(this).attr("data-num");
                            }
                        });
                        $.ajax({
                            url: Modal.host+Modal.defurl.iouspost +(JSON.stringify(PayInfo)),
                            dataType: "jsonp",
                            success:function(datas){
                                Modal.isSubimit = false;
                                //
                                var status = parseInt(datas.Status, 10);
                                switch (status) {
                                    case 100:
                                        var data = datas.Data;
                                        Modal.iousSubmit(data);
                                        break;
                                    case 200:
                                        break;
                                    default:
                                        break;
                                }


                            }
                        });
                        //end
                    }else{
                        Modal.isSubimit = false;
                    }
                }
            });
        },

        //同程告知书字符串
        treatyTmpl1 : '<h2>同程旅游安全告知书</h2><h3>旅游须知&安全提示告知书</h3><div class="djbox"><dl><dt>一、出团前准备事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">根据所选旅游项目带好出行物品，选择好所带衣物，备好旅游鞋，不宜穿皮鞋旅游。带好雨具，山区旅游不宜打伞请自 备雨衣。上年纪的人带上手杖，行李包中不要放易碎的物品。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">到野生动物保护区游览，应穿中性颜色的衣服，如棕色、米色和土黄色；白色和其他鲜艳的颜色会令动物不安。同时，尽量穿长袖衣裤，以防被丛林中的蚊虫叮咬。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">某些娱乐项目只有穿长裤才适合，因此女游客不要仅带裙子，舒适轻便的鞋子、长袖衣裤都必不可少。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">准备个人用品：如旅游鞋、防晒霜、太阳帽、晴雨伞、墨镜、拖鞋、插头转换器等，有些国家的酒店不提供一次性洗漱用品，请自行准备。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">现在很多酒店属于绿色环保酒店，不提供洗漱用品，请游客自备好洗漱用品，不便之处敬请见谅。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">安排好家中相应事宜，把旅行路线，报名点联络方式，联系人等信息留给自己家人，检查是否带好了与家庭、单位和亲朋好友联系用的电话号码。</b></dd></dl><dl><dt>二、提前检查身体，自备药品</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">游客在临行前应考虑自身身体状况，必要时旅行前要征得医生同意，方可动身。如有体质较弱或者曾患病的游客必须坚持治疗，防止旧病复发。老年人往往患有多种慢性病，平时需要用药治疗者，出游时切不可遗忘服药，否则，可能导致旧病复发、病情加重或恶化。身体不适时及时通知导游或领队。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">为防止水土不服，应根据自身情况准备急救用品及常用药品，如绷带、创可贴、伤湿止痛膏、感冒药、晕车药、止泻药、消炎药、黄连素、风油精、健胃药、抗过敏药等。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">参加高原、野外、长途旅游，旅行社不建议年龄较大或有高血压、心脏病、糖尿病、身体残疾等不适宜旅游的游客参团旅游，如认为身体能够适应旅游活动，备好药品，并征得家属子女同意，如因自身原因发生意外游客自行承担责任。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">孕妇风险比较高，不建议孕妇参团旅游，不建议参加高风险项目、水下项目，如认为身体能够适应旅游活动，如出现意外，游客自行承担责任。</b></dd></dl><dl><dt>三、签订旅游合同时注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">请认真阅读《旅游合同》，仔细核对合同中旅游者信息，确认姓名和证件号码无误，如因旅游者证件号码或姓名有误，造成不能通过海关检查、不能登机或不能登乘其他交通工具的，损失将由旅游者自行承担。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">旅游出行前我社已建议游客购买旅游意外人身伤害保险。</b></dd></dl><dl><dt>四、出团注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">请您认真阅读出团通知或确保了解出团信息，在规定时间内到达指定地点集合。出团时请务必带好：</b></dd><dd><b class="treaty_no">1）</b><b class="treaty_p">自己的车票、船票、机票、火车票等；</b></dd><dd><b class="treaty_no">2）</b><b class="treaty_p">出境旅游，要带好有效护照、有效身份证、有效港澳通行证等相关证件。</b></dd><dd><b class="treaty_no">3）</b><b class="treaty_p">如因游客自身原因造成无法登机或登船及延误旅游行程所产生的一切损失由游客自行承担。登机时所有证件应与游客向我社预订机票或船票时所有提供的证件相一致，如因证件不符造成无法登机及延误旅游行程所产生的一切损失由游客自行承担。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">出外旅游携带的行李要求轻便，旅行箱、包要坚固耐用，应尽量避免携带贵重物品，行李如需托运，切勿将现金及贵重物品放在托运行李中。大件行李在办理登机手续时交航空公司托运，托运的行李一定要包装结实并上锁。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">旅游者乘坐飞机时，请认真阅读飞机上的安全手册，扣好安全带，不带危险或者易燃品，不在飞机升降期间使用手提移动电话、移动电脑等相关电子用品，不要在飞机上随意走动。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">在车厢内行走，不要将手扶在门框上，或身体伸出窗外，以免行车时或突发紧急制动造成伤害；在火车上打水不宜过满，3/4处为宜，以免烫伤。不要在车厢内吸烟，行李要保管好，夜间防止被盗；睡觉时车窗要关闭，以免受凉。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">在交通工具上禁止携带易燃易爆、管制刀具等危险物品。乘机、坐车、乘船要注意扶梯，在台阶处站稳，乘车时注意颠簸路段及司机急刹车，以免扭伤或摔伤身体。途中严禁追跑打闹，以免发生危险。勿在车辆行驶过程中任意更换座位，头、脚勿伸出窗外，上下车时请注意来车方向以免发生危险。带儿童的游客乘坐交通工具时要注意儿童的安全。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">飞机（火车、轮船）抵达目的地后，请您不要急于下飞机（火车、轮船）而遗忘物品，注意检查随身行李和物品。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">乘车时如有身体不适、晕车请提前跟导游打招呼，请将前方座位主动留给老、幼、晕车游客乘坐。腰椎不好请提前跟导游司机说明，尽量安排坐在旅游车靠前的位臵上。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">遵守旅游目的地的法令法规，过马路要走人行道，避让车辆，不闯红灯，不要跨越栏杆、护栏。</b></dd><dd><b class="treaty_no">9、</b><b class="treaty_p">搭乘快艇、漂流木筏或参加其他水上活动时，必须遵守相关的安全条例，正确使用安全设施，务必穿上救生衣，并遵照工作人员的指导。任何船只行驶时请安静坐在座椅上，勿随意走动或拍照，以免跌撞和受伤，切勿将手或脚放臵船边或栏杆上，以免夹伤或碰撞受伤。乘坐快艇游玩时严禁坐在船头前面的座位，所有旅游者请抓紧扶手，以免发生不测。海边戏水，切勿超过安全警戒线的范围；孕妇，心脏疾病患者，高龄者，幼龄者，高低血压病患者，或任何不适合剧烈运动之疾病患者等，不能参加任何水上活动或浮潜，如游客隐瞒个人疾病或坚持参加任何活动而引致意外，一切后果游客自行负责。</b></dd><dd><b class="treaty_no">10、</b><b class="treaty_p">户外活动请游客量力而行，任何情况下出现的非因我社过错导致的受伤或生命危险，及财产损失等情况，我们会尽力救助客人，但产生的费用由客人承担，同时就此我社不承担赔偿责任。参加出海游、漂流、飞机游览、登山等户外活动时，因存在一定的风险及不可预见性，手机、相机、护照、现金等随身物品请妥善管理处臵，如果自身未妥善管理处臵的，在活动中出现落水、遗失、被盗等情况、我社将不承担相应的财产损失。</b></dd><dd><b class="treaty_no">11、</b><b class="treaty_p">参加高风险活动项目，应当另行购买保险。赛车、骑马、攀岩、滑翔、探险、漂流、潜水、游泳、滑雪、滑冰、滑板、跳伞、热气球、蹦极、冲浪、近距离接触野生动物等属于高风险活动项目，不含在个人旅游意外保险的范围内，需另行购买特定险种。参与这些活动请充分了解具体的活动常识，服从教练或指导员的指挥，务必根据自身的健康状况和适应能力选择参与活动项目。</b></dd><dd><b class="treaty_no">12、</b><b class="treaty_p">海岛旅游时，请严格遵守岛上的相关规定。海岛周围浅滩看似平静，实则暗流汹涌，危险很大，切勿下水开展游泳，潜水等水上活动。切勿在非旅游区游泳。</b></dd><dd><b class="treaty_no">13、</b><b class="treaty_p">请注意选择自己能够控制风险的活动项目；特别是患有中耳炎、心血管、心脏病、哮喘病、高血压、恐高症等不宜参加剧烈或激烈活动的游客，请注意了解活动项目的具体情况，勿选择如游泳、潜水、登山、骑马、探险、赛车等于自身身体情况不相适应的活动，以免发生不测。</b></dd></dl><dl><dt>五、出入境注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">根据《中华人民共和国海关法》、《中华人名共和国海关对进出境旅客行李物品管理监督办法》、《中华人民共和国海关关于进出境旅客通关的规定》等相关的规定，进出境旅客行程行李物品必须通过设有海关的地点进境或出境，接受海关监管。旅客应按规定向海关申报。由于游客所携带物品未按照国家相关规定进行申报的，由此产生的后果由游客承担。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">游客出行前应详细了解前往目的地国家和地区海关及出入境等相关规定，不得携带违禁品、限制进出境物品及不符合携带进出前往国及地区标准的物品等进出目的地国家和地区，由此产生的后果由游客承担。</b></dd></dl><dl><dt>六、个人物品注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">贵重物品、证件、护照应随身携带，小心保管。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">出行时不携带大量现金，金银首饰等贵重物品。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">用餐及休息时，应保管好自己的物品及证件。旅行社无义务代游客保管贵重物品。切勿交至他人保管。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">以下物品请随身携带，不要放在托运行李中，以免在托运过程中丢失，这些物品包括但不限于：现金、金银、珠宝、砖石、首饰、信用卡及其他付款工具；证件、机票及其他旅行代用券；眼镜、钟表；移动通信设备和便携式电脑。</b></dd></dl><dl><dt>七、景区注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">抵达景区游览前，谨记导游交代的集合地点、时间、车号、导游或领队电话。在游览过程中，由于景点人数较多，请紧随导游，以免掉队或迷路；进入景点切勿马上自由活动，请跟随导游听讲解。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">团体旅行时不可擅自脱团，单独离团，如果要脱离团队请征得全陪、导游同意，并随身携带当地所住宿饭店地址、全陪电话及导游电话，以免发生意外。参加团队旅游，要听从领队或导游的指挥安排，不随意活动，以免发生离群、掉队、迷路等时间。要随时注意团队的去向，以免掉队。团队旅游务必遵守时间，记住汽车号码、导游、领队的姓名和手机号码以便联系。旅行期间，团友应互敬互谅，配合领队和导游工作，如有违法或者违规行为，领队和导游有权制止或采取相应措施。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">登山游览，要换上适合运动的鞋及衣裤，走山路时靠内侧行走，不要边走边观景和照相，切记“走路不看景，看景不走路”，不要在悬崖等危险地方拍照、打闹、玩耍。登山时要看好脚下道路，不要拥挤或攀爬未开发的山路。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">在河边、湖边、海边游览，不要下水游泳，不要在危险地方如礁石、水边拍照，拍照时要注意自身安全。同时不建议参加水上高风险娱乐项目，如执意参加，请在有安全保障的景区并依景区要求开展活动。开展高风险活动前，请认真阅读景区提示并遵照工作人员的知道。如有晕水、晕船者请勿游玩水上项目。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">因无法预测水下状况及不适合开展水上活动项目的天气状况，旅行社禁止游客参加游泳，潜水等水上或水下项目，如游客执意参加水上活动，发生意外，游客自行承担责任。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">草原游览中，游客如参加骑马、草地摩托、草地越野车等高风险娱乐项目，应根据自身情况并阅读景区提示，在景区指定区域内开展活动。注意自身安全，如发生意外，游客自行承担责任。酒后禁止参加高风险娱乐项目。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">旅行社安排的景区项目及费用不包括景区内的缆车，如游客可以自行选择乘坐缆车或其它高空项目时请自行与景区内的工作人员联系并付费；旅行社不参与，但一定选择有经营资质的经营者，注意安全，系好安全带。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">行程中或自由活动时，不提倡参加危险和刺激性活动项目，如攀岩、高速摩托艇、水上飞机、高速邮轮活动等项目。如执意要参加游客要听从工作人员的安排，并穿好救生衣，落实各项安全措施，切忌麻痹大意。携带儿童的游客，参加此类活动时应照顾好自己的孩子，不要让他们单独活动。身体状况不佳者请勿参加。患有心脏病、哮喘病、高血压、恐高症者切忌从事水上、高空活动。如发生意外、游客自行承担责任。</b></dd><dd><b class="treaty_no">9、</b><b class="treaty_p">开展娱乐活动时要注意景区及娱乐项目的安全提示，遵守规则，注意安全。</b></dd><dd><b class="treaty_no">10、</b><b class="treaty_p">游客在旅游行程中如出现乏力、多汗、头晕、眼花、心悸等症状时，应及时休息，不可勉强坚持。患有心血管病的老年人，更要加强自我保护。旅游中要有充足的休息和睡眠。若感到体力不支，应及时与领队、导游联系以便在第一时间得到救护和救治。</b></dd><dd><b class="treaty_no">11、</b><b class="treaty_p">不同的景点气候多变，老人体温调节功能较差，易受凉感冒，要随时增减衣服还应带上雨具。行走出汗时不要马上脱衣敞怀。昼夜温差大的地区，睡前要盖好被毯，夜里起风时要关好门窗。</b></dd><dd><b class="treaty_no">12、</b><b class="treaty_p">强化安全意识，防止意外伤害。比如：老年人腿脚不便，走路不稳，易发生伤害事故。出游时，老人最好有亲朋好友陪伴，否则，生病或发生意外，无人照顾，后患无穷。为防止老年人跌跤发生伤害，最好佐以手杖。</b></dd><dd><b class="treaty_no">13、</b><b class="treaty_p">游览过程中，由于各景点人数较多，照相或游玩一定要注意周围坏境及自身的人身财产安全，如游客带有儿童，游客作为监护人，请照看好儿童，注意儿童安全。</b></dd></dl><dl><dt>八、饮食注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">旅游中不可光顾路边无牌照摊档。切勿吃生食、生海鲜、未剥皮的水果，防止病毒性肝炎、痢疾、伤寒等肠道传染病经口进入。在外面私自食用不洁食品和海鲜引起的肠胃疾病旅行社不承担责任。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">重视饮食卫生，严防“病从口入”。对各地风味小吃、名优土特产食品应以品尝为主，一次不宜吃太多，更不能暴饮暴食，以免引起消化不良等。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">多吃新鲜蔬菜和水果，少食油腻和辛辣生冷食物，少抽烟，少喝酒，多喝开水。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">如对饮食有特殊要求，如少数民族等，请报名时告知旅行社并提前与导游说明，以便导游更好的给您安排饮食，否则导致后果由游客自行承担。</b></dd></dl><dl><dt>九、购物注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">旅行社不指定具体购物场所，购物属于您个人行为，您购买商品之后请仔细地检查商品的质量。若回国后才发现质量问题，无论是更换还是退还商品都会手续繁复。具体情况不一，能否实现更换或退还也要视具体情况而定；</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">切勿在公共场所露财，购物时勿当众清数钞票。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">购买商品时，请注意商品质量及价格，应细心鉴别商品真伪并向商店索取完整的发票和购买证明，如商品无质量问题，只是价格偏高，旅行社只能协调处理，不能负责退换，敬请注意。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">购物属于为个人行为，如果由于商店和海关无合同或机场原因（飞机晚点、银行关门、海关检查时间紧迫等）不能及时退税的，旅行社不负责办理退税业务。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">请勿轻信流动推销人员的商品推荐。由于小摊位物品真伪及质量难以保障，尽量不要在小摊位购买物品。如必须购买，请看好再与商家讨价。无意购买时，请勿向商家问价或者还价，以免发生争执。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">请勿随商品推销人员到偏僻地方购物或者取物。在热闹拥挤的场所购物或者娱乐时，应注意保管好自己的钱包、提包、贵重物品及证件。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">境外购物需谨慎，出现质量问题退换货比较麻烦，并且海关免税有一定额度，超过部分不能免税。一些物品禁止带出境或入境，建议不要购买，如购买可能禁止入境，造成损失由旅游者承担。</b></dd></dl><dl><dt>十、酒店注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">入住酒店时，请阅读安全手册，保管好房卡，房卡损坏需照价赔偿，检查房间内设施（卫浴设备、遥控器、烟缸、毛巾浴巾等）是否有损坏、减少。如发现设施有损或缺少请及时告知酒店服务人员或领队导游，以免退房时发生不必要的麻烦。染发的游客请自备一条毛巾、枕巾或是等发干了再入睡，以免染到 酒店枕头上。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">在使用房间内物品时，看清是否是免费使用，如使用非免费物品请看清标价。有的酒店的部分电视频道是收费的，请提前咨询酒店前台。请爱惜酒店物品，损坏需照价赔偿。退房时游客自行结清房间提供的饮料、食品、洗涤和长途电话费用，团费中不含该费用。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">出入酒店房间请随手关门并把门窗锁好，不要随便开门或让陌生人进入房间以免上当受骗。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">勿将衣物披在灯上或在床上吸烟。相应证件、护照、现金等应寄存在酒店保险箱内，或随身携带。切勿放在酒店房间内，寄存行李或旅行车内。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">淋浴时地面、浴缸容易打滑，一定要先把防滑垫放好以防滑倒摔伤。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">自由活动期间最好结伴而行，去什么地方最好事先与领队和导游打好招呼，并带上酒店名片以免迷路。如发生意外，一定与领队和导游联系。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">每次退房前，请检查您所携带的行李物品，特别注意您的证件和贵重物品。房间内配备的浴巾、毛巾、手巾、烟缸等物品均不可携带。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">如旅游者选择消费酒店的配套健身娱乐设施（如游泳池、健身房等），请注意使用说明及提示，如水深，禁止跳水、戏水，境外游泳池旁边一般没有救生员，建议不要下水游泳，如游泳依据自身身体状况注意安全，该活动并非旅行社安排，发生任何意外旅行社不承担责任。</b></dd><dd><b class="treaty_no">9、</b><b class="treaty_p">境外星级酒店与国内星级标准要求不一样，约定的境外星级酒店应以当地标准为准。</b></dd><dd><b class="treaty_no">10、</b><b class="treaty_p">抵达酒店后，旅游者须听从导游安排；酒店住宿以两人一室、自由组合为原则，如出现单男单女，本社将调换夫妻用房或者调整为三人房；如果旅游者特别指定单人房间，请于出行前支付单人房差额并取得本社的确认，以免出行后产生纷争。</b></dd><dd><b class="treaty_no">11、</b><b class="treaty_p">在境外酒店房间内吸烟属于违法行为，会受到高额的经济处罚或法律的制裁，请游客不要在房间内吸烟，也不要抱有侥幸心理。由于吸烟导致的任何后果均由游客自行承担。</b></dd><dd><b class="treaty_no">12、</b><b class="treaty_p">如遇紧急情况请勿慌张：发生火警时请勿搭乘电梯或者随意跳楼，应镇定判断火情，主动实行自救；若身上着火，可就地打滚，或者用重衣物压火苗；必须穿过有浓烟的走廊、通道时，用浸湿的衣物披裹身体、捂着口鼻，贴近地、顺墙爬行；大火封门无法逃出时，可采用浸湿的衣物披裹身体、被褥堵门缝或者泼水降温的方法等待救援，或者摇动色彩鲜艳的衣物呼唤救援人员。</b></dd><dd><b class="treaty_no">13、</b><b class="treaty_p">境外酒店等的服务标识与国内不同，可能没有中文，如客人不明确或看不懂，请及时向导游询问，不要臆断或乱闯。</b></dd></dl><dl><dt>十一、自行安排活动期间注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">旅游行程开始前、结束后及行程中注明的自由时间及自由活动都属自由活动，不属于旅行社安排活动内容。自由活动期间，旅行社领队、导游给予的咨询或建议仅供参考，由您自己决定的活动的内容和方式，自行承担责任。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">游客在自行安排活动期间应当遵守当地法律法规，注意人身、财产安全。游客应根据自身条件安排好自己活动，谨慎参加高危险及刺激性活动项目，妥善保管好个人财物，若由此产生的人身损害、财产损失、旅行社不承担责任。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">在自由行过程中您自愿参加的一切活动项目，请充分了解活动的内容、设备设施的性能并严格遵守活动项目的安全规定，请选择有资质的经营者，并建议您主动购买相关保险。我社对您在此过程中发生的意外不承担责任。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">未经导游或领队允许，请勿强行脱离团队自行活动，由此造成的损失，我社不承担责任；我社有权就您的强行脱团行为，追究责任。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">自行活动期间，因第三人的行为造成旅游者人身损害、财产损失，由第三人承担责任。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">境外的交通规则与国内可能不一致，请注意遵守当地的交通规则。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">国外治安比较乱，自由活动期间保护好自己的财物，贵重物品及现金不要放到旅游车上，随身携带，不要带大量现金。</b></dd></dl><dl><dt>十二、发生特别事件注意事项</dt><dd>在旅游过程中遇到自然灾害、罢工、动乱等突发的旅行社及旅游者自身不能控制的事件，遇到特别事件危机到人身、财产安全时，旅游者首先注意自身的人身、财产安全。旅行社采取安全措施时，应积极配合。</dd></dl><dl><dt>十三、特别注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">如遇国家政策性调整机、车、船票，请客人按规定补交差价。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">行程中的赠送项目或我社安排赠送给旅游者的景点或活动，如自愿放弃或因天气，不可抗力及不可归责于旅行社的因素不能安排的，旅行社有权不予退还相应费用。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">合同签订后或机票一经游客确认，旅行社已购买或预定的机票不能更改、签转、退换。如游客取消此次旅游，所产生的损失将视为旅行社的实际损失，不予退还。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">在旅行过程中如临时脱团，门票、餐费、车费、房费一律不予退还。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">行程中未标注“入内参观”的景点均为游览外观，入内参观景点均含首道门票。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">如遇部分景点节假日休息或庆典等，本社有权根据实际情况调整行程游览先后顺序，以尽可能保证游览内容；但客观因素限制确实无法安排的，本社将根据实际情况进行调整。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">如旅行社已向航空公司或相关代理机构交纳机位定金的，如取消、变更预订，航空公司或相关代理机构不予退还此项费用。因游客原因取消、变更，此项费用将计入取消、变更的实际损失费。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">是否给予签证，是否准予出入境，为有关机关的行政权力，若游客被大使馆拒签而无法出行，我社有权收取签证费及代办服务费；若游客不准入境、出境的，相关责任和费用由游客自行承担；若使馆出签后游客取消出游、我社有权收取签证费及代办服务费、机票损失费、地接损失费等已发生费用。</b></dd><dd><b class="treaty_no">9、</b><b class="treaty_p">从2006 年开始中国赴欧旅游公民穿戴、携带或购买假冒名牌物品，如服装、鞋帽、箱包、手表等相关物品进入欧盟国家，会受到欧盟当地的处罚；为减少及避免此类事件带来的不良影响及麻烦，提醒中国赴欧洲旅游的游客不要穿戴、携带或购买假冒名牌物品，否则出现的任何后果将由游客自行承担。</b></dd><dd><b class="treaty_no">10、</b><b class="treaty_p">旅游者存在下列情形之一的，旅行社有权解除合同。</b></dd><dd><b class="treaty_p">旅游者身体情况不适应旅游要求：</b></dd><dd><b class="treaty_p">（1）传染性疾病患者，如传染性肝炎、活动期肺结核、伤寒等传染病人；</b></dd><dd><b class="treaty_p">（2）心血管疾病患者，如严重高血压、心功能不全、心肌缺氧、心肌梗塞等病人；</b></dd><dd><b class="treaty_p">（3）脑血管疾病患者，如脑栓塞、脑出血、脑肿瘤等病人；</b></dd><dd><b class="treaty_p">（4）呼吸系统疾病患者，如肺气肿、肺心病等病人；</b></dd><dd><b class="treaty_p">（5）精神病患者，如癫痫及各种精神病人；</b></dd><dd><b class="treaty_p">（6）严重贫血病患者；</b></dd><dd><b class="treaty_p">（7）大中型手术的恢复期病患者；</b></dd><dd><b class="treaty_p">（8）孕妇及行动不便者；</b></dd><dd><b class="treaty_p">（9）其他不能适应本次旅游要求的身体情况。 旅游者携带危害公共安全的物品且不同意交有关部门处理的；从事违法或者违反社会公德的活动的；从事严重影响其他旅游者权益的活动的，且不听劝阻、不能制止的；法律规定的其他情形。</b></dd><dd>因上述情形解除合同的，旅行社应当扣除必要的费用后，将余款退给旅游者；给旅行社造成损失的，旅游者应当依法承担赔偿责任。 如旅游者隐瞒、谎报自身情况参团发生事故，责任自负。</dd><dd><b class="treaty_no">11、</b><b class="treaty_p">如持中华人民共和国护照的旅游者在国外参团出境游，请务必自行确认是否免签及跟团出境后团队返回时能否再次入中国境内，并保证自备手续的有效性；如因旅游者原因不能出入境的，损失由旅游者自行承担。</b></dd><dd><b class="treaty_no">12、</b><b class="treaty_p">确保身体健康：保证自身身体条件能够适应和完成旅游活动；如需随时服用药物的，请随身携带并带足用量。旅途中有不良不适的反应，及时说明。旅游者为 60 周岁以上的老人、怀有身孕的、或存在身体残疾等特殊健康情形的，须有能够同行的其他亲友陪同，并由旅游者及陪同人共同签署《游客健康申明》、《承诺书》确认，作为旅游合同附件。此类旅游者建议增加购买旅游意外保险。</b></dd><dd><b class="treaty_no">13、</b><b class="treaty_p">由于团队行程中所有住宿、用车、景点门票等均为旅行社打包整体销售，因此若旅游者因自身原因未能游览参观的则视为自动放弃权利，旅行社将无法退还费用，在行程中旅游者自愿放弃某项旅游项目的，旅行社有权不予退还相应旅游费用。</b></dd></dl><dl><dt>十四、旅游文明</dt><dd>《中国公民国内旅游文明行为公约》强调“营造文明、和谐的旅游环境，关系到每位游客的切身利益。做文明游客是我们大家的义务，请遵守以下公约”：</dd><dd><b class="treaty_no">1、</b><b class="treaty_p">维护环境卫生。不随地吐痰和口香糖，不乱扔废弃物，不在禁烟场所吸烟。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">遵守公共秩序。不喧哗吵闹，排队遵守秩序，不并行挡道，不在公共场所高声交谈。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">保护生态环境。不踩踏绿地，不摘折花木和果实，不追捉、投打、乱喂动物。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">保护文物古迹。不在文物古迹上涂刻，不攀爬触摸文物，拍照摄像遵守规定。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">爱惜公共设施。不污损客房用品，不损坏公共设施，不贪占小便宜，节约用水用电，用餐不浪费。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">尊重别人权利。不强行和外宾合影，不对着打喷嚏，不长期占用公共设施，尊重服务人员的劳动，尊重各民族宗教习惯。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">讲究以礼带人。衣着整洁得体，不在公共场所坦胸赤膊；礼让老幼病残，礼让女士；不讲粗话。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">提倡健康娱乐。抵制封建迷信活动，拒绝黄、赌、毒。</b></dd></dl></div>',
        treatyTmpl2 : '<h2>同程旅游安全告知书</h2><h3>旅游须知&安全提示告知书</h3><div class="ylbox"><dl><dt>一、出团前准备事项</dt><dd>出发前准备</dd><dd style="width:753px">A建议携带的行李（仅供参考）</dd><dd><b class="treaty_no">1、</b><b class="treaty_p">休闲装 5 套</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">正装 1 套</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">运动鞋、皮鞋、防滑拖鞋</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">遮阳帽</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">太阳眼镜</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">大容量茶杯</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">泳衣、泳帽</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">牙刷、牙膏</b></dd><dd><b class="treaty_no">9、</b><b class="treaty_p">毛巾（客舱内也将提供）</b></dd><dd><b class="treaty_no">10、</b><b class="treaty_p">沐浴露、洗发水（客舱内只提供洗发水）</b></dd><dd><b class="treaty_no">11、</b><b class="treaty_p">指甲钳</b></dd><dd><b class="treaty_no">12、</b><b class="treaty_p">创可贴</b></dd><dd><b class="treaty_no">13、</b><b class="treaty_p">常用药物 及 清凉油</b></dd><dd><b class="treaty_no">14、</b><b class="treaty_p">万能转换插座</b></dd><dd><b class="treaty_no">15、</b><b class="treaty_p">茶叶(客舱内有烧水壶，可以自己烧开水泡茶）</b></dd><dd><b class="treaty_no">16、</b><b class="treaty_p">随身小包</b></dd><dd><b class="treaty_no">17、</b><b class="treaty_p">雨具</b></dd><dd>B手机</dd><dd><b class="treaty_p">建议您向您的手机网络服务商申请开通国际漫游及国际长途功能，以便在紧急情况下使用。因韩国的网络为 3G 模式，首先确认您的手机是否可在此模式下使用。</b></dd><dd><b class="treaty_p">开通国际漫游及国际长途的方法，以中国移动公司为例：</b></dd><dd><b class="treaty_no">1、</b><b class="treaty_p">请您为手机充值至少 200 元人民币</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">拨打 10086 中国移动公司客服电话申请国际漫游及国际长途功能</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">在经过了相应的信息核对后，中国移动公司将为您开通此功能若您在韩国不需要使用 GPRS 功能，请让中国移动公司为您关闭，回国后再申请开通。</b></dd><dd>C货币兑换</dd><dd><b class="treaty_p">在整个旅游的过程中，您将可能使用到以下几种货币：</b></dd><dd><b class="treaty_no">1、</b><b class="treaty_p">美元，您可能在邮轮上或韩国的免税店消费时使用（建议酌情兑换，最好能备有个人外币信用卡）</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">韩元，您可能在韩国济州岛购买商品时使用（建议少量兑换）船上消费以美元为货币单位，韩国为当地货币。</b></dd><dd>兑换方法：</dd><dd><b class="treaty_no">1、</b><b class="treaty_p">请您携带身份证，前往各大银行兑换。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">您所需要的货币可能需要向银行预约，根据各银行的此类货币储存情况而定根据国家相关规定，年度总额分别为每人每年等值 5 万美元。</b></dd><dd>D信用卡</dd><dd><b class="treaty_p">邮轮上使用的信用卡要求：</b></dd><dd><b class="treaty_no">1、</b><b class="treaty_p">信用卡上有上有 VISA 或 MASTER 标志</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">用卡有美元账户</b></dd><dd><b class="treaty_no"></b><b class="treaty_p">韩国使用信用卡要求：</b></dd><dd><b class="treaty_p">1）信用卡上有 VISA 或 MASTER 标志</b></dd><dd><b class="treaty_p">2）信用卡有美元账户</b></dd><dd><b class="treaty_p">3）信用卡上有银联标志（部分商店可通过银联系统结算）</b></dd></dl><dl><dt>二、提前检查身体，自备药品</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">游客在临行前应考虑自身身体状况，必要时旅行前要征得医生同意，方可动身。如有体质较弱或者曾患病的游客必须坚持治疗，防止旧病复发。老年人往往患有多种慢性病，平时需要用药治疗者，出游时切不可遗忘服药，否则，可能导致旧病复发、病情加重或恶化。身体不适时及时通知导游或领队。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">为防止水土不服，应根据自身情况准备急救用品及常用药品，如绷带、创可贴、伤湿止痛膏、感冒药、晕车药、止泻药、消炎药、黄连素、风油精、健胃药、抗过敏药等。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">参加高原、野外、长途旅游，旅行社不建议年龄较大或有高血压、心脏病、糖尿病、身体残疾等不适宜旅游的游客参团旅游，如认为身体能够适应旅游活动，备好药品，并征得家属子女同意，如因自身原因发生意外游客自行承担责任。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">孕妇风险比较高，不建议孕妇参团旅游，不建议参加高风险项目、水下项目，如认为身体能够适应旅游活动，如出现意外，游客自行承担责任。</b></dd></dl><dl><dt>三、签订旅游合同时注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">请认真阅读《旅游合同》，仔细核对合同中旅游者信息，确认姓名和证件号码无误，如因旅游者证件号码或姓名有误，造成不能通过海关检查、不能登机或不能登乘其他交通工具的，损失将由旅游者自行承担。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">旅游出行前我社已建议游客购买旅游意外人身伤害保险。</b></dd></dl><dl><dt>四、出团注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">请您认真阅读出团通知或确保了解出团信息，在规定时间内到达指定地点集合。出团时请务必带好：</b></dd><dd><b class="treaty_no">1）</b><b class="treaty_p">自己的车票、船票、机票、火车票等；</b></dd><dd><b class="treaty_no">2）</b><b class="treaty_p">出境旅游，要带好有效护照、有效身份证、有效港澳通行证等相关证件。</b></dd><dd><b class="treaty_no">3）</b><b class="treaty_p">如因游客自身原因造成无法登机或登船及延误旅游行程所产生的一切损失由游客自行承担。登机时所有证件应与游客向我社预订机票或船票时所有提供的证件相一致，如因证件不符造成无法登机及延误旅游行程所产生的一切损失由游客自行承担。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">出外旅游携带的行李要求轻便，旅行箱、包要坚固耐用，应尽量避免携带贵重物品，行李如需托运，切勿将现金及贵重物品放在托运行李中。大件行李在办理登机手续时交航空公司托运，托运的行李一定要包装结实并上锁。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">旅游者乘坐飞机时，请认真阅读飞机上的安全手册，扣好安全带，不带危险或者易燃品，不在飞机升降期间使用手提移动电话、移动电脑等相关电子用品，不要在飞机上随意走动。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">在车厢内行走，不要将手扶在门框上，或身体伸出窗外，以免行车时或突发紧急制动造成伤害；在火车上打水不宜过满，3/4处为宜，以免烫伤。不要在车厢内吸烟，行李要保管好，夜间防止被盗；睡觉时车窗要关闭，以免受凉。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">在交通工具上禁止携带易燃易爆、管制刀具等危险物品。乘机、坐车、乘船要注意扶梯，在台阶处站稳，乘车时注意颠簸路段及司机急刹车，以免扭伤或摔伤身体。途中严禁追跑打闹，以免发生危险。勿在车辆行驶过程中任意更换座位，头、脚勿伸出窗外，上下车时请注意来车方向以免发生危险。带儿童的游客乘坐交通工具时要注意儿童的安全。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">飞机（火车、轮船）抵达目的地后，请您不要急于下飞机（火车、轮船）而遗忘物品，注意检查随身行李和物品。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">乘车时如有身体不适、晕车请提前跟导游打招呼，请将前方座位主动留给老、幼、晕车游客乘坐。腰椎不好请提前跟导游司机说明，尽量安排坐在旅游车靠前的位臵上。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">遵守旅游目的地的法令法规，过马路要走人行道，避让车辆，不闯红灯，不要跨越栏杆、护栏。</b></dd><dd><b class="treaty_no">9、</b><b class="treaty_p">搭乘快艇、漂流木筏或参加其他水上活动时，必须遵守相关的安全条例，正确使用安全设施，务必穿上救生衣，并遵照工作人员的指导。任何船只行驶时请安静坐在座椅上，勿随意走动或拍照，以免跌撞和受伤，切勿将手或脚放臵船边或栏杆上，以免夹伤或碰撞受伤。乘坐快艇游玩时严禁坐在船头前面的座位，所有旅游者请抓紧扶手，以免发生不测。海边戏水，切勿超过安全警戒线的范围；孕妇，心脏疾病患者，高龄者，幼龄者，高低血压病患者，或任何不适合剧烈运动之疾病患者等，不能参加任何水上活动或浮潜，如游客隐瞒个人疾病或坚持参加任何活动而引致意外，一切后果游客自行负责。</b></dd><dd><b class="treaty_no">10、</b><b class="treaty_p">户外活动请游客量力而行，任何情况下出现的非因我社过错导致的受伤或生命危险，及财产损失等情况，我们会尽力救助客人，但产生的费用由客人承担，同时就此我社不承担赔偿责任。参加出海游、漂流、飞机游览、登山等户外活动时，因存在一定的风险及不可预见性，手机、相机、护照、现金等随身物品请妥善管理处臵，如果自身未妥善管理处臵的，在活动中出现落水、遗失、被盗等情况、我社将不承担相应的财产损失。</b></dd><dd><b class="treaty_no">11、</b><b class="treaty_p">参加高风险活动项目，应当另行购买保险。赛车、骑马、攀岩、滑翔、探险、漂流、潜水、游泳、滑雪、滑冰、滑板、跳伞、热气球、蹦极、冲浪、近距离接触野生动物等属于高风险活动项目，不含在个人旅游意外保险的范围内，需另行购买特定险种。参与这些活动请充分了解具体的活动常识，服从教练或指导员的指挥，务必根据自身的健康状况和适应能力选择参与活动项目。</b></dd><dd><b class="treaty_no">12、</b><b class="treaty_p">海岛旅游时，请严格遵守岛上的相关规定。海岛周围浅滩看似平静，实则暗流汹涌，危险很大，切勿下水开展游泳，潜水等水上活动。切勿在非旅游区游泳。</b></dd><dd><b class="treaty_no">13、</b><b class="treaty_p">请注意选择自己能够控制风险的活动项目；特别是患有中耳炎、心血管、心脏病、哮喘病、高血压、恐高症等不宜参加剧烈或激烈活动的游客，请注意了解活动项目的具体情况，勿选择如游泳、潜水、登山、骑马、探险、赛车等于自身身体情况不相适应的活动，以免发生不测。</b></dd></dl><dl><dt>五、出入境注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">根据《中华人民共和国海关法》、《中华人名共和国海关对进出境旅客行李物品管理监督办法》、《中华人民共和国海关关于进出境旅客通关的规定》等相关的规定，进出境旅客行程行李物品必须通过设有海关的地点进境或出境，接受海关监管。旅客应按规定向海关申报。由于游客所携带物品未按照国家相关规定进行申报的，由此产生的后果由游客承担。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">游客出行前应详细了解前往目的地国家和地区海关及出入境等相关规定，不得携带违禁品、限制进出境物品及不符合携带进出前往国及地区标准的物品等进出目的地国家和地区，由此产生的后果由游客承担。</b></dd></dl><dl><dt>六、个人物品注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">贵重物品、证件、护照应随身携带，小心保管。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">出行时不携带大量现金，金银首饰等贵重物品。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">用餐及休息时，应保管好自己的物品及证件。旅行社无义务代游客保管贵重物品。切勿交至他人保管。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">以下物品请随身携带，不要放在托运行李中，以免在托运过程中丢失，这些物品包括但不限于：现金、金银、珠宝、砖石、首饰、信用卡及其他付款工具；证件、机票及其他旅行代用券；眼镜、钟表；移动通信设备和便携式电脑。</b></dd></dl><dl><dt>七、景区注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">抵达景区游览前，谨记导游交代的集合地点、时间、车号、导游或领队电话。在游览过程中，由于景点人数较多，请紧随导游，以免掉队或迷路；进入景点切勿马上自由活动，请跟随导游听讲解。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">团体旅行时不可擅自脱团，单独离团，如果要脱离团队请征得全陪、导游同意，并随身携带当地所住宿饭店地址、全陪电话及导游电话，以免发生意外。参加团队旅游，要听从领队或导游的指挥安排，不随意活动，以免发生离群、掉队、迷路等时间。要随时注意团队的去向，以免掉队。团队旅游务必遵守时间，记住汽车号码、导游、领队的姓名和手机号码以便联系。旅行期间，团友应互敬互谅，配合领队和导游工作，如有违法或者违规行为，领队和导游有权制止或采取相应措施。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">登山游览，要换上适合运动的鞋及衣裤，走山路时靠内侧行走，不要边走边观景和照相，切记“走路不看景，看景不走路”，不要在悬崖等危险地方拍照、打闹、玩耍。登山时要看好脚下道路，不要拥挤或攀爬未开发的山路。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">在河边、湖边、海边游览，不要下水游泳，不要在危险地方如礁石、水边拍照，拍照时要注意自身安全。同时不建议参加水上高风险娱乐项目，如执意参加，请在有安全保障的景区并依景区要求开展活动。开展高风险活动前，请认真阅读景区提示并遵照工作人员的知道。如有晕水、晕船者请勿游玩水上项目。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">因无法预测水下状况及不适合开展水上活动项目的天气状况，旅行社禁止游客参加游泳，潜水等水上或水下项目，如游客执意参加水上活动，发生意外，游客自行承担责任。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">草原游览中，游客如参加骑马、草地摩托、草地越野车等高风险娱乐项目，应根据自身情况并阅读景区提示，在景区指定区域内开展活动。注意自身安全，如发生意外，游客自行承担责任。酒后禁止参加高风险娱乐项目。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">旅行社安排的景区项目及费用不包括景区内的缆车，如游客可以自行选择乘坐缆车或其它高空项目时请自行与景区内的工作人员联系并付费；旅行社不参与，但一定选择有经营资质的经营者，注意安全，系好安全带。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">行程中或自由活动时，不提倡参加危险和刺激性活动项目，如攀岩、高速摩托艇、水上飞机、高速邮轮活动等项目。如执意要参加游客要听从工作人员的安排，并穿好救生衣，落实各项安全措施，切忌麻痹大意。携带儿童的游客，参加此类活动时应照顾好自己的孩子，不要让他们单独活动。身体状况不佳者请勿参加。患有心脏病、哮喘病、高血压、恐高症者切忌从事水上、高空活动。如发生意外、游客自行承担责任。</b></dd><dd><b class="treaty_no">9、</b><b class="treaty_p">开展娱乐活动时要注意景区及娱乐项目的安全提示，遵守规则，注意安全。</b></dd><dd><b class="treaty_no">10、</b><b class="treaty_p">游客在旅游行程中如出现乏力、多汗、头晕、眼花、心悸等症状时，应及时休息，不可勉强坚持。患有心血管病的老年人，更要加强自我保护。旅游中要有充足的休息和睡眠。若感到体力不支，应及时与领队、导游联系以便在第一时间得到救护和救治。</b></dd><dd><b class="treaty_no">11、</b><b class="treaty_p">不同的景点气候多变，老人体温调节功能较差，易受凉感冒，要随时增减衣服还应带上雨具。行走出汗时不要马上脱衣敞怀。昼夜温差大的地区，睡前要盖好被毯，夜里起风时要关好门窗。</b></dd><dd><b class="treaty_no">12、</b><b class="treaty_p">强化安全意识，防止意外伤害。比如：老年人腿脚不便，走路不稳，易发生伤害事故。出游时，老人最好有亲朋好友陪伴，否则，生病或发生意外，无人照顾，后患无穷。为防止老年人跌跤发生伤害，最好佐以手杖。</b></dd><dd><b class="treaty_no">13、</b><b class="treaty_p">游览过程中，由于各景点人数较多，照相或游玩一定要注意周围坏境及自身的人身财产安全，如游客带有儿童，游客作为监护人，请照看好儿童，注意儿童安全。</b></dd></dl><dl><dt>八、饮食注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">旅游中不可光顾路边无牌照摊档。切勿吃生食、生海鲜、未剥皮的水果，防止病毒性肝炎、痢疾、伤寒等肠道传染病经口进入。在外面私自食用不洁食品和海鲜引起的肠胃疾病旅行社不承担责任。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">重视饮食卫生，严防“病从口入”。对各地风味小吃、名优土特产食品应以品尝为主，一次不宜吃太多，更不能暴饮暴食，以免引起消化不良等。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">多吃新鲜蔬菜和水果，少食油腻和辛辣生冷食物，少抽烟，少喝酒，多喝开水。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">如对饮食有特殊要求，如少数民族等，请报名时告知旅行社并提前与导游说明，以便导游更好的给您安排饮食，否则导致后果由游客自行承担。</b></dd></dl><dl><dt>九、购物注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">旅行社不指定具体购物场所，购物属于您个人行为，您购买商品之后请仔细地检查商品的质量。若回国后才发现质量问题，无论是更换还是退还商品都会手续繁复。具体情况不一，能否实现更换或退还也要视具体情况而定；</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">切勿在公共场所露财，购物时勿当众清数钞票。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">购买商品时，请注意商品质量及价格，应细心鉴别商品真伪并向商店索取完整的发票和购买证明，如商品无质量问题，只是价格偏高，旅行社只能协调处理，不能负责退换，敬请注意。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">购物属于为个人行为，如果由于商店和海关无合同或机场原因（飞机晚点、银行关门、海关检查时间紧迫等）不能及时退税的，旅行社不负责办理退税业务。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">请勿轻信流动推销人员的商品推荐。由于小摊位物品真伪及质量难以保障，尽量不要在小摊位购买物品。如必须购买，请看好再与商家讨价。无意购买时，请勿向商家问价或者还价，以免发生争执。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">请勿随商品推销人员到偏僻地方购物或者取物。在热闹拥挤的场所购物或者娱乐时，应注意保管好自己的钱包、提包、贵重物品及证件。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">境外购物需谨慎，出现质量问题退换货比较麻烦，并且海关免税有一定额度，超过部分不能免税。一些物品禁止带出境或入境，建议不要购买，如购买可能禁止入境，造成损失由旅游者承担。</b></dd></dl><dl><dt>十、邮轮注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">邮轮旅游不同于传统旅游，是一种全新的旅游模式，客人在邮轮上享有高度的自由性和自主性，但同时也要求客人有一定的自我管理性。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">在传统旅游中，全程会有一名领队一名导游跟团，整个旅游团是不可分离的。但是邮轮旅游是完全不同的。没有全程跟团的领队和导游，也不存在出团时的团员全程要在一起活动的问题（因此如果您一起出行的伙伴没有和你分到同一个团队，请您不要着急，上船后原来的团队就完全解散了，您们还是可以组合在一起活动的）。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">因邮轮旅游的特殊性，船上活动的开放时间及安排请参阅舱房内的 TODAY 报纸，针对船上及岸上游活动领队将不再另行通知。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">登船的第一天会有救生演习，此项环节是根据全球邮轮惯例，也是出于对乘客的安全考虑。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">关于护照，必须是回团后还有 6 个月的有效期。所有的护照原件由游客本人所持，如因遗失或是忘带护照，导致无法成行等问题，由游客自行承担损失。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">持港澳台护照、外籍护照的游客，除自行做好二次进入中国边防的签证、签注外，未满21 周岁的游客需将父母双方的护照复印件或扫描件随身携带。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">勿将衣物披在灯上或在床上吸烟。相应证件、护照、现金等应寄存在保险箱内，或随身携带。切勿放在房间内，寄存行李或旅行车内。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">淋浴时地面、浴缸容易打滑，一定要先把防滑垫放好以防滑倒摔伤。</b></dd><dd><b class="treaty_no">9、</b><b class="treaty_p">每次离开房间前，请检查您的房卡是否携带；特别注意保管好房卡，以免丢失。房间内配备的浴巾、毛巾、手巾、烟缸等物品均不可携带。</b></dd><dd><b class="treaty_no">10、</b><b class="treaty_p">船上服务标识与国内不同，可能没有中文，如您不明确或看不懂，请及时向船上前台询问，不要臆断或乱闯。</b></dd></dl><dl><dt>十一、自行安排活动期间注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">旅游行程开始前、结束后及行程中注明的自由时间及自由活动都属自由活动，不属于旅行社安排活动内容。自由活动期间，旅行社领队、导游给予的咨询或建议仅供参考，由您自己决定的活动的内容和方式，自行承担责任。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">游客在自行安排活动期间应当遵守当地法律法规，注意人身、财产安全。游客应根据自身条件安排好自己活动，谨慎参加高危险及刺激性活动项目，妥善保管好个人财物，若由此产生的人身损害、财产损失、旅行社不承担责任。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">在自由行过程中您自愿参加的一切活动项目，请充分了解活动的内容、设备设施的性能并严格遵守活动项目的安全规定，请选择有资质的经营者，并建议您主动购买相关保险。我社对您在此过程中发生的意外不承担责任。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">未经导游或领队允许，请勿强行脱离团队自行活动，由此造成的损失，我社不承担责任；我社有权就您的强行脱团行为，追究责任。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">自行活动期间，因第三人的行为造成旅游者人身损害、财产损失，由第三人承担责任。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">境外的交通规则与国内可能不一致，请注意遵守当地的交通规则。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">国外治安比较乱，自由活动期间保护好自己的财物，贵重物品及现金不要放到旅游车上，随身携带，不要带大量现金。</b></dd></dl><dl><dt>十二、发生特别事件注意事项</dt><dd><b class="treaty_p">在旅游过程中遇到自然灾害、罢工、动乱等突发的旅行社及旅游者自身不能控制的事件，遇到特别事件危机到人身、财产安全时，旅游者首先注意自身的人身、财产安全。旅行社采取安全措施时，应积极配合。</b></dd></dl><dl><dt>十三、特别注意事项</dt><dd><b class="treaty_no">1、</b><b class="treaty_p">如遇国家政策性调整机、车、船票，请客人按规定补交差价。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">行程中的赠送项目或我社安排赠送给旅游者的景点或活动，如自愿放弃或因天气，不可抗力及不可归责于旅行社的因素不能安排的，旅行社有权不予退还相应费用。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">合同签订后或机票一经游客确认，旅行社已购买或预定的机票不能更改、签转、退换。如游客取消此次旅游，所产生的损失将视为旅行社的实际损失，不予退还。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">在旅行过程中如临时脱团，门票、餐费、车费、房费一律不予退还。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">行程中未标注“入内参观”的景点均为游览外观，入内参观景点均含首道门票。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">如遇部分景点节假日休息或庆典等，本社有权根据实际情况调整行程游览先后顺序，以尽可能保证游览内容；但客观因素限制确实无法安排的，本社将根据实际情况进行调整。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">如旅行社已向航空公司或相关代理机构交纳机位定金的，如取消、变更预订，航空公司或相关代理机构不予退还此项费用。因游客原因取消、变更，此项费用将计入取消、变更的实际损失费。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">是否给予签证，是否准予出入境，为有关机关的行政权力，若游客被大使馆拒签而无法出行，我社有权收取签证费及代办服务费；若游客不准入境、出境的，相关责任和费用由游客自行承担；若使馆出签后游客取消出游、我社有权收取签证费及代办服务费、机票损失费、地接损失费等已发生费用。</b></dd><dd><b class="treaty_no">9、</b><b class="treaty_p">从2006 年开始中国赴欧旅游公民穿戴、携带或购买假冒名牌物品，如服装、鞋帽、箱包、手表等相关物品进入欧盟国家，会受到欧盟当地的处罚；为减少及避免此类事件带来的不良影响及麻烦，提醒中国赴欧洲旅游的游客不要穿戴、携带或购买假冒名牌物品，否则出现的任何后果将由游客自行承担。</b></dd><dd><b class="treaty_no">10、</b><b class="treaty_p">旅游者存在下列情形之一的，旅行社有权解除合同。</b></dd><dd><b class="treaty_p">旅游者身体情况不适应旅游要求：</b></dd><dd><b class="treaty_no">（1）</b><b class="treaty_p">传染性疾病患者，如传染性肝炎、活动期肺结核、伤寒等传染病人；</b></dd><dd><b class="treaty_no">（2）</b><b class="treaty_p">心血管疾病患者，如严重高血压、心功能不全、心肌缺氧、心肌梗塞等病人；</b></dd><dd><b class="treaty_no">（3）</b><b class="treaty_p">脑血管疾病患者，如脑栓塞、脑出血、脑肿瘤等病人；</b></dd><dd><b class="treaty_no">（4）</b><b class="treaty_p">呼吸系统疾病患者，如肺气肿、肺心病等病人；</b></dd><dd><b class="treaty_no">（5）</b><b class="treaty_p">精神病患者，如癫痫及各种精神病人；</b></dd><dd><b class="treaty_no">（6）</b><b class="treaty_p">严重贫血病患者；</b></dd><dd><b class="treaty_no">（7）</b><b class="treaty_p">大中型手术的恢复期病患者；</b></dd><dd><b class="treaty_no">（8）</b><b class="treaty_p">孕妇及行动不便者；</b></dd><dd><b class="treaty_no">（9）</b><b class="treaty_p">其他不能适应本次旅游要求的身体情况。旅游者携带危害公共安全的物品且不同意交有关部门处理的；从事违法或者违反社会公德的活动的；从事严重影响其他旅游者权益的活动的，且不听劝阻、不能制止的；法律规定的其他情形。</b></dd><dd><b class="treaty_p">因上述情形解除合同的，旅行社应当扣除必要的费用后，将余款退给旅游者；给旅行社造成损失的，旅游者应当依法承担赔偿责任。如旅游者隐瞒、谎报自身情况参团发生事故，责任自负。</b></dd><dd><b class="treaty_no">11、</b><b class="treaty_p">如持中华人民共和国护照的旅游者在国外参团出境游，请务必自行确认是否免签及跟团出境后团队返回时能否再次入中国境内，并保证自备手续的有效性；如因旅游者原因不能出入境的，损失由旅游者自行承担。</b></dd><dd><b class="treaty_no">12、</b><b class="treaty_p">确保身体健康：保证自身身体条件能够适应和完成旅游活动；如需随时服用药物的，请随身携带并带足用量。旅途中有不良不适的反应，及时说明。旅游者为 60 周岁以上的老人、怀有身孕的、或存在身体残疾等特殊健康情形的，须有能够同行的其他亲友陪同，并由旅游者及陪同人共同签署《游客健康申明》、《承诺书》确认，作为旅游合同附件。此类旅游者建议增加购买旅游意外保险。</b></dd><dd><b class="treaty_no">13、</b><b class="treaty_p">由于团队行程中所有住宿、用车、景点门票等均为旅行社打包整体销售，因此若旅游者因自身原因未能游览参观的则视为自动放弃权利，旅行社将无法退还费用，在行程中旅游者自愿放弃某项旅游项目的，旅行社有权不予退还相应旅游费用。</b></dd></dl><dl><dt>十四、旅游文明</dt><dd><b class="treaty_p">《中国公民国内旅游文明行为公约》强调“营造文明、和谐的旅游环境，关系到每位游客的切身利益。做文明游客是我们大家的义务，请遵守以下公约”：</b></dd><dd><b class="treaty_no">1、</b><b class="treaty_p">维护环境卫生。不随地吐痰和口香糖，不乱扔废弃物，不在禁烟场所吸烟。</b></dd><dd><b class="treaty_no">2、</b><b class="treaty_p">遵守公共秩序。不喧哗吵闹，排队遵守秩序，不并行挡道，不在公共场所高声交谈。</b></dd><dd><b class="treaty_no">3、</b><b class="treaty_p">保护生态环境。不踩踏绿地，不摘折花木和果实，不追捉、投打、乱喂动物。</b></dd><dd><b class="treaty_no">4、</b><b class="treaty_p">保护文物古迹。不在文物古迹上涂刻，不攀爬触摸文物，拍照摄像遵守规定。</b></dd><dd><b class="treaty_no">5、</b><b class="treaty_p">爱惜公共设施。不污损客房用品，不损坏公共设施，不贪占小便宜，节约用水用电，用餐不浪费。</b></dd><dd><b class="treaty_no">6、</b><b class="treaty_p">尊重别人权利。不强行和外宾合影，不对着打喷嚏，不长期占用公共设施，尊重服务人员的劳动，尊重各民族宗教习惯。</b></dd><dd><b class="treaty_no">7、</b><b class="treaty_p">讲究以礼带人。衣着整洁得体，不在公共场所坦胸赤膊；礼让老幼病残，礼让女士；不讲粗话。</b></dd><dd><b class="treaty_no">8、</b><b class="treaty_p">提倡健康娱乐。抵制封建迷信活动，拒绝黄、赌、毒。</b></dd></dl></div>'
    };
    Modal.fn.init.prototype = Modal.fn;
    //
    module.exports =  window.payModal = Modal;
});
