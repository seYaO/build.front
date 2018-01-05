<template>
<div class="pay" v-if="data">
    <div class="top">
        <div class="tit">支付剩余时间</div>
        <div class="time">
            <span>{{timer.num5}}</span><span>{{timer.num6}}</span>
            <em>:</em>
            <span>{{timer.num1}}</span><span>{{timer.num2}}</span>
            <em>:</em>
            <span>{{timer.num3}}</span><span>{{timer.num4}}</span>
        </div>
    </div>
    <div class="info">
        <ul v-if="data.orderPayInfo">
            <li v-if="actualPayFee"><span>应付总额：</span>&yen;{{actualPayFee}}</li>
            <li><span>保障期限：</span>{{data.orderPayInfo.safeguardTime}}</li>
            <li><span>产品名称：</span>{{data.orderPayInfo.productName}}</li>
        </ul>
    </div>
    <section v-if="redPacketList && redPacketList.length > 0" @click="goToRedPage">
        <cell>
            <div slot="title">红包抵扣</div>
            <div slot="value" class="red">{{selectedPacketStr}}</div>
        </cell>
    </section>
    <section>
        <div class="pay-line">
            <div class="pay-row" @click="payType = isCashEnough ? 1 : payType">
                <div class="pay-name"><i class="cash-icon"></i><span>现金账户</span></div>
                <div class="pay-val" v-if="data.userAmount">可用余额<span class="red">&yen;{{data.userAmount.cashMoney}}</span></div>
                <div class="check " :class="{ 'check-show': isCashEnough && payType === 1, 'check-unable': !isCashEnough, 'check-hide': isCashEnough && payType !== 1 }"></div>
            </div>
        </div>
        <div class="pay-line">
            <div class="rowLine"></div>
            <div class="pay-row" @click="payType = 2">
                <div class="pay-name"><i class="weixin-icon"></i><span>微信支付</span></div>
                <div class="pay-val"></div>
                <div class="check" :class="{ 'check-show': payType === 2, 'check-hide': payType !== 2 }"></div>
            </div>
        </div>
        <div class="pay-line" v-if="!isShowWeChart">
            <div class="rowLine"></div>
            <div class="pay-row" @click="payType = 3">
                <div class="pay-name"><i class="aliPay-icon"></i><span>支付宝支付</span></div>
                <div class="pay-val"></div>
                <div class="check" :class="{ 'check-show': payType === 3, 'check-hide': payType !== 3 }"></div>
            </div>
        </div>
    </section>
    <div class="con">
        <x-button type="primary" @on-click="insureBtnClick">立即支付<span >&yen;{{actualPayFee}}</span></x-button>
    </div>
    <remote-js src="http://pv.sohu.com/cityjson"></remote-js>
    <!-- alert -->
    <alert :open="alertShow" @on-confirm="alertShow = false">{{alertText}}</alert>
    <!-- confirm -->
    <confirm :open="confirmShow" :cancelText="'取消'" :confirmText="confirmTxt" @on-close="confirmShow = false" @on-confirm="confirmHandler">{{confirmText}}</confirm>
    <!-- prompt -->
    <prompt v-model="promptValue" :open="promptShow" :disabled="promptDisable" :cancel-text="cancelPromptTxt" :confirm-text="confirmPromptTxt" title="请输入交易密码" :input="{placeholder:'请输入交易密码',type:'password'}" :errMsgShow="true" :errMsg="promptErrMsg" @on-close="cancelPromptHandler" @on-confirm="confirmPromptHandler"></prompt>
    <!-- popup -->
    <popup direction="right" :full="true" :open="isShowPopup" @on-close="isShowPopup = false">
        <div class="pay-redpackage">
            <div class="red-no-use" @click="chooseRed('noUse')">不使用红包<i class="red-choose-icon" :class="{'red-choosed':ifChooseNoUseRed}"></i></div>
            <div class="red-can-use-number">有<span class="red-color">{{redpackageNumber}}</span>个红包可用</div>
            <div class="red-can-use" v-for="(item,i) in redPacketList" :key="i">
                <div class="can-use-money red-color"><i>&yen;</i>{{item.amount}}</div>
                <div class="can-use-info">
                    <div>新人红包，满&yen;{{item.smallAmount}}可用</div>
                    <!-- <div class="limitTime">{{item.expiryTime}}到期 <span class="red-rule" @click="showRedRule(i)">红包规则 <i class="arrow"></i><i class="arrow rule-arrow"></i></span></div> -->
                    <div class="limitTime">{{item.expiryTime}}到期 <span class="red-rule" @click="showRedRule(i)">红包规则 <i class="red-rule-arrow"></i></span></div>                    
                    
                </div>
                <div class="can-click" @click="chooseRed(i)">
                    <i class="red-choose-icon" :class="{'red-choosed':item.isChoose}"></i>
                </div>
            </div>
        </div>
    </popup>
    <!-- 红包规则 -->
    <div class="vux-popup-mask2" v-if="isShowRulePopup" @touchmove.prevent @click="isShowRulePopup = false"></div>
    <div class="redPacket-rule" v-if="isShowRulePopup" >
        <div class="fix-title">
            <div class="tit">
                红包规则
                <div class="tit-close" @click="isShowRulePopup = false"><i></i></div>
            </div>
        </div>
        <div class="rule-list">
            <div class="rule-row" v-for="(rule,index) in redPacketList[choseIndex].remarkArr" :key="index">{{rule}}</div>
        </div>
    </div>
</div>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { Cell, XButton, Alert, Confirm, Popup, Prompt } from '@/components'
import * as pay from '@/services/pay'
import * as discount from '@/services/discount'
import { isWeChart } from '@/utils/validate'
import { setLocalStore, getLocalStore, getOpenId,getPrice } from '@/utils'

export default {
    components: {
        Cell,
        XButton,
        Alert,
        Confirm,
        Popup,
        Prompt,
        'remote-js': {
            render(createElement) {
            return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});
            },
            props: {
                src: { type: String, required: true },
            },
        }
    },
    data() {
        return {
            data: null,
            isShowPopup: false,
            alertShow: false,
            alertText: '',
            confirmShow: false,
            confirmTxt: '',
            confirmText: '',
            promptShow: false,
            cancelPromptTxt: '取消',
            confirmPromptTxt: '确认',
            promptValue: '',
            promptDisable: false,
            promptErrMsg: '',
            actualPayFee: 0,
            timer: {
                timeLeft: 0,
                num1: 0,
                num2: 0,
                num3: 0,
                num4: 0,
                num5: 0,
                num6: 0,
            },
            isCashEnough: true, //现金是否充足
            payType: 0, // 支付类型 1.现金 2、微信 3、支付宝
            redPacketList: null, // 红包列表
            selectedPacketStr: null, // 选择的红包
            openId: '', // 微信
            ifChooseNoUseRed:false, //是否选择不使用红包
            choseIndex:0, //选择的第几个规则
            isShowRulePopup:false, //是否展示红包规则弹框
            originFee:0, //不使用红包时候的价格
            couponNo:'', //红包批次号
            ifCanGoToRedPage:true, //是否可以去红包页面
            isShowWeChart: isWeChart()
        }
    },
    beforeMount() {
        document.title = '收银台'
    },
    mounted() {
        this.initData();
        const openId = getLocalStore('openId');
        const { code = '' } = this.$route.query;
        !openId && setLocalStore('openId', code);

        if(openId){
            this.openId = openId;
        }

        if(!openId && isWeChart() && !code){
            location.href = getOpenId();
        }
    },
    computed: {
        redpackageNumber(){
            if(this.redPacketList){
                return this.redPacketList.length;
            }
        }
    },
    methods: {
        // 初始化
        async initData() {
            const { id = '' } = this.$route.params;
            const res = await pay.init({ orderCode: id });
            const { code,  data } = res;
            if(code === '0000') {
                this.data = data;
                this.countDown(data.countDown);
                this.getRedPacket(data.productCode);
                const { reduceAmount = 0, totalFee = 0 ,isActivity} = data.orderPayInfo || {};
                if(isActivity == 5){
                    this.bindReadPacket(); //查看该支付是否有绑定的红包
                }
                const { cashMoney = 0 } = data.userAmount || {};
                this.originFee = totalFee - reduceAmount;
                this.actualPayFee = getPrice(this.originFee);
                if(this.originFee > cashMoney) {
                    this.isCashEnough = false;
                }else{
                    this.payType = 1;
                }
            }else if(code === '1001'){
                location.href = '/login';
            }
        },

        // 获取可用红包
        async getRedPacket(productCode) {
            const { id = '' } = this.$route.params;
            const res = await discount.getReadPacket({ orderCode: id, productCode });
            const { code,  data } = res;
            if(code === '0000'){
                for(let i=0;i<data.length;i++){
                    data[i].expiryTime = new Date(data[i].expiryTime).format('yyyy.MM.dd');
                    data[i].isShowRedRule = false;
                    data[i].isChoose = false;
                    let item = data[i].remarks.split('||');
                    let temp = [];
                    for(let j=0;j<item.length;j++){
                        temp.push(item[j])
                    }
                    data[i].remarkArr = temp;
                }
                this.redPacketList = data;
                this.selectedPacketStr = `${data.length}个可用`;
            }else if(code === '1001'){
                location.href = '/login';
            }
        },

        //是否可以去红包页面
        goToRedPage(){
            if(this.ifCanGoToRedPage){
                this.isShowPopup = true;
            }
        },
        //选择红包
        chooseRed(index){
            if(index == "noUse"){
                this.ifChooseNoUseRed = true;
                this.couponNo = "";
                this.selectedPacketStr = "不使用";
                this.actualPayFee = getPrice(this.originFee);
                for(let i=0;i<this.redPacketList.length;i++){
                    this.redPacketList[i].isChoose = false;
                }
            }else{
                for(let i=0;i<this.redPacketList.length;i++){
                    this.redPacketList[i].isChoose = false;
                    this.ifChooseNoUseRed = false;
                }
                this.redPacketList[index].isChoose = true;
                this.selectedPacketStr = `￥${this.redPacketList[index].amount}`;
                let tempFee = this.originFee -this.redPacketList[index].amount;
                if(tempFee < 0){
                    tempFee = 0;
                }
                this.actualPayFee = getPrice(tempFee) ;
                this.couponNo = this.redPacketList[index].serialCode;
            }
            this.isShowPopup = false;
        },

        //展开红包规则
        showRedRule(index){
            this.isShowRulePopup = true;
            this.choseIndex = index;
        },
        // 获取订单已绑定红包
        async bindReadPacket() {
            const { id = '' } = this.$route.params;
            const res = await discount.bindReadPacket({ orderCode: id });
            const { code,  data } = res;
            if(code === '0000'){
                this.selectedPacketStr = `￥${data.amount}`;
                let tempFee = this.originFee - data.amount;
                if(tempFee < 0){
                    tempFee = 0;
                }
                this.actualPayFee = getPrice(tempFee) ;
                this.couponNo = data.serialCode;
                this.ifCanGoToRedPage = false;
            }else if(code === '1001'){
                location.href = '/login';
            }
        },

        // 倒计时
        countDown(time) {
            time = Number(time);
            let _this = this;
            let timer = setInterval(function() {
                let timeLeft = time - 1
                time = timeLeft
                if(timeLeft < 0){
                    //倒计时结束时的一些操作
                    clearInterval(timer)
                }
                _this.timer.num4 = Math.floor(timeLeft%60%10) < 0 ? 0 : Math.floor(timeLeft%60%10)
                _this.timer.num3 = Math.floor(timeLeft%60/10) < 0 ? 0 : Math.floor(timeLeft%60/10)
                _this.timer.num2 = Math.floor(timeLeft/60%60%10) < 0 ? 0 : Math.floor(timeLeft/60%60%10)
                _this.timer.num1 = Math.floor(timeLeft/60%60/10) < 0 ? 0 : Math.floor(timeLeft/60%60/10)
                _this.timer.num6 = Math.floor(timeLeft/60/60%10) < 0 ? 0 : Math.floor(timeLeft/60/60%10)
                _this.timer.num5 = Math.floor(timeLeft/60/60/10) < 0 ? 0 : Math.floor(timeLeft/60/60/10)
            }, 1000);
        },

        cancelPromptHandler() {
            if(this.cancelPromptTxt !== '忘记密码'){
                this.promptShow = false;
                return;
            }
            const { id = '' } = this.$route.params;
            this.$router.push({ path: `/dealPwd`, query: { type: 'reset', orderCode: id } });
        },

        //
        confirmHandler() {
            const { id = '' } = this.$route.params;
            if(this.confirmTxt === '去设置'){
                this.$router.push({ path: `/dealPwd`, query: { type: 'set', orderCode: id } });
            }
        },

        //
        confirmPromptHandler(value) {
            const { id = '' } = this.$route.params;
            if(this.confirmPromptTxt == '确认'){
                if(!value){
                    this.promptErrMsg = '请输入交易密码';
                    return false;
                }
                this.promptValue = value;
                this.cashPay();
            }else if(this.confirmPromptTxt === '找回密码'){
                this.$router.push({ path: `/dealPwd`, query: { type: 'reset', orderCode: id } });
            }else if(this.confirmPromptTxt === '重新输入'){
                this.confirmPromptTxt = '确认'
                this.cancelPromptTxt = '取消'
                this.promptErrMsg = '';
            }
        },

        // 支付
        insureBtnClick() {
            if(!this.payType){
                this.alertShow = true;
                this.alertText = '请选择支付方式';
                return false;
            }
            let payProduct = 0; // 支付编号 支付宝支付：1006, 微信支付：1111, jsApi:  1008

            switch(this.payType){
                case 1:
                    if(this.actualPayFee){
                        if(this.data.dealPwd === 1){
                            this.promptShow = true;
                            this.confirmPromptTxt = '确认';
                        }else{
                            this.confirmShow = true;
                            this.confirmTxt = '去设置';
                            this.confirmText = '交易密码未设置，请先设置密码';
                        }
                    }else{
                        this.cashPay();
                    }
                    return false;
                    break;
                case 2:
                    payProduct = 1111;
                    break;
                case 3:
                    payProduct = 1006;
                    break;
            }
            this.getPayUrl(payProduct);
        },

        // 现金支付
        async cashPay() {
            const { id = '' } = this.$route.params;
            let dealPassword = this.promptValue;
            const res = await pay.balance({ orderCode: id, dealPassword, couponNo: this.couponNo });
            const { code,  data } = res;
            if(code === '0000') {
                this.$router.push({ path: `/pay/success/${id}` });
            }else if(code === '1000'){
                this.promptErrMsg = '余额不足';
            }else if(code === '1001'){
                location.href = '/login';
            }else if(code === '1004'){
                //不需要支付
                this.$router.push({ path: `/pay/success/${id}` });
            }else if(code === '2000'){
                this.promptErrMsg = '支付失败';
            }else if(code === '3000'){
                this.confirmPromptTxt = '重新输入';
                this.cancelPromptTxt = '忘记密码';
                this.promptErrMsg = `交易密码错误，您还可以输入${data.count}次`;
            }else if(code === '4000'){
                this.promptErrMsg = '订单号为空';
            }else if(code === '5000'){
                this.confirmPromptTxt = '找回密码';
                this.cancelPromptTxt = '取消';
                this.promptErrMsg = '交易密码输入次数超过限制';
            }
        },

        //获取支付连接地址
        async getPayUrl(payProduct) {
            const { id = '' } = this.$route.params;
            const _this = this;
            let params = { orderCode: id, payProduct, couponNo:this.couponNo, openId: this.openId, clientIP: returnCitySN["cip"] };
            if(this.openId){
                payProduct = 1108;
                Object.assign(params, { payProduct });
            }

            const res = await pay.url(params);
            const { code,  data } = res;
            if(code === '0000'){
                const { JsApiParam } = data;
                if(!JsApiParam){
                    let { payUrl } = data;
                    if(this.payType === 2){
                        // payUrl = `${payUrl}&redirect_url=`
                    }
                    location.href = payUrl;
                    return false;
                }
                // ----------
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId": JsApiParam.appId,     //公众号名称，由商户传入
                        "timeStamp": JsApiParam.timeStamp,         //时间戳，自1970年以来的秒数
                        "nonceStr": JsApiParam.nonceStr, //随机串
                        "package": JsApiParam.package,
                        "signType":"MD5",         //微信签名方式：
                        "paySign": JsApiParam.sign //微信签名
                    },
                    function(res){
                        // _this.loading = false;
                        // isloading = false;
                        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                        if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                            //订单金额为0，无需支付，直接跳转成功页
                            _this.$router.push({ path: `/pay/success/${id}` });
                            // _this.$router.push({
                            //     name: 'paySuccess',
                            //     params: {
                            //         orderCode: _this.$route.params.orderCode
                            //     }
                            // })
                        }
                    }
                );
            }else if(code === '1001'){
                location.href = '/login';
            }else if(code === '1004'){
                // 订单金额为0，无需支付，直接跳转成功页
                _this.$router.push({ path: `/pay/success/${id}` });
            }
        }
    }
}
</script>
