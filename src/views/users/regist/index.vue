<template>
    <div class="registWrap">

        <div class="regist-cont">

            <img class="topImg" src="../../../images/regist-top.jpg" alt="">

            <div :class="['infos', accountType==0?'enter':'person']">

                <div class="info-line clearfix">
                    <div class="label">邀&nbsp;&nbsp;请&nbsp;&nbsp;码：</div>
                    <template v-if="isFixInviteCode">
                        <div class="fixInviteCode">{{inviteCode}}</div>
                    </template>
                    <template v-else>
                        <input v-model="inviteCode" @focusout="inviteCodeFocusout" type="text" placeholder="请填写邀请码" class="inputBox">
                    </template>
                </div>

                <div class="info-line clearfix">
                    <div class="label">账户类型：</div>
                    <div @click="changeAccountType(0)" :class="['regist-check-box', accountType==0?'regist-selected':'']">
                        企业
                    </div>
                    <div @click="changeAccountType(1)" :class="['regist-check-box', accountType==1?'regist-selected':'']">
                        个人
                    </div>
                </div>

                <div class="info-line clearfix">
                    <div class="label">账户名称：</div>
                    <input v-model="accountName" type="text" placeholder="请输入手机号(作为登录用户名)" class="inputBox">
                </div>

                <div class="info-line clearfix">
                    <div class="label">图&nbsp;&nbsp;形&nbsp;&nbsp;码：</div>
                    <input v-model="graphCode" type="text" placeholder="请输入图形验证码" class="inputBox small">
                    <img v-if="!!captcha.code" @click="changeGraphCode" class="graphCode" :src="'/api/v1/img?code=' + captcha.code" alt="" >
                </div>

                <div class="info-line clearfix">
                    <div class="label">验&nbsp;&nbsp;证&nbsp;&nbsp;码：</div>
                    <input v-model="authCode" type="text" placeholder="请输入验证码" class="inputBox small">
                    <div @click="getSmsCode" :class="['getAuthCode',!!smsTimer?'resend':'']">
                        {{!!smsTimer?`${leftSeconds}后可重发`:'获取验证码'}}
                    </div>
                </div>

                <div class="info-line clearfix">
                    <div class="label">登录密码：</div>
                    <input v-model="loginPwd" type="password" placeholder="请输入密码" class="inputBox">
                </div>

                <div class="info-line clearfix">
                    <div class="label">确认密码：</div>
                    <input v-model="confirmPwd" type="password" placeholder="请再次输入密码" class="inputBox">
                </div>

                <div class="info-line clearfix company-only">
                    <div class="label">公司名称：</div>
                    <input v-model="companyName" type="text" placeholder="请填写公司名称" class="inputBox">
                </div>

                <div class="info-line clearfix">
                    <div class="label">联&nbsp;&nbsp;系&nbsp;&nbsp;人：</div>
                    <input v-model="linkMan" type="text" placeholder="请填写真实的姓名" class="inputBox">
                </div>

                <div class="info-line clearfix" @click="showDistrict">
                    <div class="label">所在地区：</div>
                    <input v-model="region"  type="text" placeholder="请选择所在的区域" readonly class="inputBox dropDown">
                    <i class="district-arrow"></i>
                </div>

                <div class="info-line clearfix company-only">
                    <div class="label">详细地址：</div>
                    <input v-model="detailSite" type="text" placeholder="请输入详细地址" class="inputBox">
                </div>
            </div>

            <div class="submitBtn" @click="submitNow"></div>
        </div>
        <div :class="['toast-wrap',toast.isShow?'':'none']" @touchmove.prevent></div>
        <Toast
        :duration="1000"
        align="center"
        :open="toast.isShow"
        @on-close="toggleToastShow"
        @touchmove.prevent
        >{{toast.txt}}</Toast>
        <popup-picker
            :open="areaShow"
            :pickers="areaList"
            @on-pickerchange="changeAreaPickHandler"
            @on-change="confirmAreaHandler"
            @on-close="toggleAreaOpen"
        />
        <alert :open="alertShow" @on-confirm="gotoLogin">
            <div class="tit">{{alertTitle}}</div>
            <div>{{alertText}}</div>
        </alert>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Toast, PopupPicker, Alert } from '@/components';
import * as registService from '@/services/regist';

import { phoneValidate,passwordValidate20 } from '@/utils/validate';

 export default {
    components:{
        Toast,
        PopupPicker,
        Alert
    },
    data(){
        return {
            alertShow: false,
            alertTitle: '您的资料提交成功',
            alertText: '我们将在2个工作日内完成审核并短信通知结果！',
            inviteCode: '', //邀请码
            accountName: '',//账户名称
            graphCode: '',//图形码
            authCode: '',//验证码
            loginPwd: '',//登录密码
            confirmPwd: '',//确认密码
            companyName: '',//公司名称
            linkMan: '',//联系人
            region: '',//所在区域
            detailSite: '',//详细地址

            //是否固定邀请码，从url上获取
            isFixInviteCode: false,
            //账号类型 0：企业 1：个人
            accountType: 0,
            //获取短信验证码的计时器
            smsTimer: null,
            //获取短信验证码剩余的秒数
            leftSeconds: -1,
            //提交按钮是否正在提交
            isSubmit: false,
            //弹框
            toast:{
                isShow: false,
                txt: ''
            },
            //选择的省份index
            proIndex: -1,
            //选择的城市index
            cityIndex: -1,

            //异步获取的省市数组
            provinceCityData: [],
            //是否显示省市框
            areaShow: false,
            areaList: [],
            isShowConfirm: false,
        }
    },
    beforeMount() {
        document.title = '注册'
    },
    computed: {
        ...mapState({
            captcha: state => state.user.captcha,
        })
    },
    mounted(){
        const { inviteCode } = this.$route.query;
        this.getCaptcha();

        if(!!inviteCode){
            this.inviteCode = inviteCode;
            this.isFixInviteCode = true;
        }
        this.initProvinceCity();
    },
    methods:{
        ...mapActions([ 'getCaptcha' ]),
        toggleAreaOpen(){
            this.areaShow = !this.areaShow;
        },
        //确认所在区域
        confirmAreaHandler(val){

            this.proIndex = parseInt(val[0].value);
            this.cityIndex = parseInt(val[1].value)

            let provinceName = this.provinceCityData[this.proIndex].text,
                cityName = this.provinceCityData[this.proIndex].children[this.cityIndex].text;

            this.region = `${provinceName},${cityName}`;

            this.toggleAreaOpen();
        },
        //选择所在的区域，如果更换省份，对应更换城市数组
        changeAreaPickHandler(val, index){
            console.log(val, index);
            let selectIndex = parseInt(val);
            if(index == 0){

                let cityArr = [];
                this.provinceCityData[selectIndex].children.map((cityElem, cityIndex) => {
                    cityArr.push({
                        value: cityIndex+'',
                        label: cityElem.text
                    })
                })

                this.areaList[1] = {
                    value: cityArr[0].value,
                    options: cityArr
                }

            }
        },

        //初始化省市数据
        async initProvinceCity(){
            const res = await registService.getProvinceAndCity();
            const provinceCityData = res.data;
            this.provinceCityData = provinceCityData;

            let provinceArr = [],
                cityArr = []


            // for(let proindex in provinceCityData){
            //     let proElem = provinceCityData[proindex];
            //     provinceArr.push({
            //         value: proindex+'',
            //         label: proElem.text
            //     })
            // }

            provinceCityData.map((proElem, proindex)=>{
                provinceArr.push({
                    value: proindex+'',
                    label: proElem.text
                })
            })

            provinceCityData[0].children.map((cityElem, cityIndex)=>{
                cityArr.push({
                    value: cityIndex+'',
                    label: cityElem.text
                })
            })

            console.log(provinceArr)

            this.areaList = [{
                value: provinceArr[0].value,
                options: provinceArr
            },{
                value: cityArr[0].value,
                options: cityArr
            }]

        },
        //邀请码失去焦点
        async inviteCodeFocusout(){

            console.log('out',this.inviteCode)

            const res = await registService.validateInviteCode({
                invitateCode: this.inviteCode
            });

            const { code } = res;
            if(!!code && code != '0000'){
                this.showToast('该邀请码无效')
            }

        },

        //显示提示框
        showToast(toastStr = ''){
            this.toast.txt = toastStr;
            this.toggleToastShow();
        },
        toggleToastShow(){
            this.toast.isShow = !this.toast.isShow;
        },
        //获取短信验证码
        async getSmsCode(){

            if(!this.smsTimer){

                if(!this.accountName){
                    this.showToast('请输入您的账户名称');
                    return;
                }
                if(!phoneValidate(this.accountName)){
                    this.showToast('您的账户名称编辑错误');
                    return;
                }
                if(!this.graphCode){
                    this.showToast('请输入图形验证码');
                    return;
                }

                // const res = await registService.validateAcount({
                //     acount: this.accountName,
                //     imgCode: this.graphCode,
                //     serialNo:  this.captcha.serialNo
                // })

                // const { code, message } = res;

                // if(code == '0000'){
                    const smsRes = await registService.getSmsCode({
                        acount: this.accountName,
                        codeType: 0,
                        imgCode: this.graphCode,
                        serialNo:  this.captcha.serialNo
                    })

                    if(smsRes.code == '0000'){
                        this.leftSeconds = 60;
                        this.smsTimer = setInterval(()=>{
                            this.leftSeconds = this.leftSeconds - 1;
                            if(this.leftSeconds == -1){
                                clearInterval(this.smsTimer);
                                this.smsTimer = null
                            }
                        }, 1000)
                    } else {
                        this.showToast(smsRes.message)
                        this.getCaptcha();
                    }

                // } else {
                //     this.showToast(message)
                // }

            }
        },
        //更换图形验证码
        changeGraphCode(){
            this.getCaptcha();
        },
        //切换账户类型
        changeAccountType(type){
            this.accountType = type;
        },
        //显示所在区域的选择框
        showDistrict(ev){
            ev.currentTarget.blur();
            this.toggleAreaOpen();
        },
        //立即注册
        async submitNow(){

            //正在提交则return
            if(this.isSubmit){
                return;
            }

            if(!this.inviteCode){
                this.showToast('请输入您的邀请码')
                return;
            }


            if(!this.accountName){
                this.showToast('请输入您的账户名称')
                return;
            }
            if(!phoneValidate(this.accountName)){
                this.showToast('请输入正确的账户名称')
                return;
            }


            if(!this.authCode){
                this.showToast('请输入您的短信验证码')
                return;
            }


            if(!this.loginPwd){
                this.showToast('请输入您的登录密码')
                return;
            }
            if(!passwordValidate20(this.loginPwd)){
                this.showToast('密码长度6-20位，至少包含英文，数字和符号的两种')
                return;
            }
            if(!this.confirmPwd){
                this.showToast('请输入您的确认密码')
                return;
            }
            if(this.loginPwd != this.confirmPwd){
                this.showToast('两次输入的密码不一致')
                return;
            }


            if(!this.companyName && this.accountType == 0){
                this.showToast('请输入您的公司名称')
                return;
            }

            if(!this.linkMan){
                this.showToast('请输入您的联系人姓名')
                return;
            }

            if(this.proIndex == -1 || this.cityIndex == -1){
                this.showToast('请选择所在区域')
                return;
            }

            let provinceName = this.provinceCityData[this.proIndex].text,
                cityName = this.provinceCityData[this.proIndex].children[this.cityIndex].text;


            this.isSubmit = true;

            const res = await registService.registSubmit({
                invitateCode: this.inviteCode,
                acount: this.accountName,
                smsCode: this.authCode,
                password: this.loginPwd,
                company: this.companyName,
                province: provinceName,
                city: cityName,
                address: this.detailSite,
                contact: this.linkMan,
                mobilePhone: this.accountName,
                sex: '',
                registerPlat: 'M',
                userType: this.accountType
            })
            this.isSubmit = false;
            const { code, message, data } = res;
            if(res){
                if(code == '0000'){
                    this.alertShow = true;
                } else if(code == '7000'){
                    this.showToast(`验证码错误，剩余${data.count}次`)
                } else if(code == '7001'){
                    this.showToast('验证码输入次数超过限制')
                } else {
                    this.changeGraphCode();
                    this.showToast(message)
                }
            } else {
                this.showToast('网络有点问题，请稍后再试')
            }

        },
        //去登录页
        gotoLogin(){
            this.alertShow = false;
            location.href = '/login';
        }
    }
 }
</script>
<style lang="less">

@import './style.less';

</style>
