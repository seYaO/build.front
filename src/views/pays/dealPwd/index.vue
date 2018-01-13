<template>
<div class="deal-pwd-wrap">
    <div class="deal-pwd-cont">

        <div :class="['step1',stepIndex==0?'':'none']">
            <div class="account-line no-border">账户名 {{hidePhone(accountName)}}</div>
            <!-- <div class="account-line clearfix">
                <input v-model="graphCode" type="text" placeholder="请输入图片验证码" class="input-box">
                <div class="btn" @click="changeAuthImg">换一张</div>
                <img class="graphImg" v-if="!!captcha.code" @click="changeAuthImg" :src="'/api/v1/img?code=' + captcha.code" alt="">
            </div> -->
            <div class="account-line clearfix">
                    <input v-model="smsCode" type="text" placeholder="请输入短信验证码" class="input-box">
                    <div @click="getSmsClick" :class="['btn',!!smsTimer?'resend':'']">
                        {{!!smsTimer?`${leftSeconds}后可重发`:'获取验证码'}}
                    </div>
                </div>
            <div class="next-btn" @click="firstStepClick">下一步</div>
            <a class="call-us" href="tel:400-100-1514">无法接收验证码？请致电400-100-1514转1</a>
        </div>


        <div :class="['step2',stepIndex==1?'':'none']">
            <div class="account-line no-border">请输入{{type=='reset'?'新的':''}}交易密码</div>
            <div class="account-line clearfix">
                <input v-model="dealPwd" :type="[isPwdOpen?'text':'password']" placeholder="6-18位字母数字或符号的组合" class="input-box">
                <div @click="togglePwdOpen" :class="['eye',isPwdOpen?'open':'']"></div>
            </div>
            <div class="account-line clearfix">
                <input v-model="confirmPwd" :type="[isPwdOpen?'text':'password']"  placeholder="请重复一遍新的密码" class="input-box">
            </div>
            <div class="next-btn" @click="submitClick">提交</div>
        </div>

    </div>

</div>
</template>

<style lang="less">
@import '../../../styles/mint-common.less';
@import './style.less';
</style>

<script>
import * as dealPwdServer from '@/services/dealPwd';
import { mapState, mapMutations, mapActions } from 'vuex'
import { getLocalStore } from '@/utils/index'
import { passwordValidate } from '@/utils/validate'

export default {
    components:{},
    data(){
        return {
            type: 'set',
            codeType: 5,

            //用户的账号
            accountName: '',
            //图片验证码
            graphCode: '',
            //短信验证码
            smsCode: '',
            dealPwd: '',
            confirmPwd: '',

            //获取短信验证码的计时器
            smsTimer: null,
            //获取短信验证码剩余的秒数
            leftSeconds: -1,
            //步骤的index
            stepIndex: 0,
            //新的交易密码是否可见
            isPwdOpen: false,
            //弹框
            toast:{
                isShow: false,
                txt: ''
            },
        }
    },
    mounted(){

        const { type } = this.$route.query;
        if(type == 'reset'){
            this.type = type;
            this.codeType = 3
        }


        if(this.type == 'set'){
            document.title = '设置交易密码';
        } else if(this.type == 'reset'){
            document.title = '找回交易密码';
        }

        this.accountName = getLocalStore('acount');

    },
    methods:{
        togglePwdOpen(){
            this.isPwdOpen = !this.isPwdOpen;
        },
        async firstStepClick(){
            if(!this.smsCode){
                this.$toast('请输入短信验证码')
                return;
            }

            const res = await dealPwdServer.validateSmsCode({
                acount: this.accountName,
                //3重置交易密码5设置交易密码
                codeType: this.codeType,
                verificationCode: this.smsCode
            })

            if(!!res){
                const { code, message, data } = res;
                if(code == '0000'){
                    this.stepIndex = 1;
                } else if(code == '7000'){
                    this.$toast(`验证码错误，剩余${data.count}次`)
                } else if(code == '7001'){
                    this.$toast('验证码输入次数超过限制')
                } else {
                    this.$toast(message)
                }
            } else {
                this.$toast('网络有点问题，请稍后再试')
            }

        },
        async submitClick(){
            const { orderCode = '' } = this.$route.query;
            if(!this.dealPwd){
                this.$toast('请输入新的交易密码')
                return;
            }
            if(!this.confirmPwd){
                this.$toast('请输入确认交易密码')
                return;
            }
            if(!passwordValidate(this.dealPwd)){
                this.$toast('交易密码是6-18位字母数字或符号的组合')
                return;
            }
            if(this.dealPwd != this.confirmPwd){
                this.$toast('两次交易密码不一致')
                return;
            }

            const ajaxObj = {
                acount: this.accountName,
                pwd: this.dealPwd,
                verificationCode: this.smsCode
            }


            if(this.type == 'set'){
                const res = await dealPwdServer.setDealPwd(ajaxObj);
                const { code, message } = res
                if(code == '0000'){
                    this.$toast('恭喜您，交易密码设置成功')
                    this.$router.push({ path: `/orderPay/${orderCode}` });
                } else {
                    this.$toast(message);
                }

            } else if(this.type == 'reset'){
                const res = await dealPwdServer.resetDealPwd(ajaxObj);
                const { code, message } = res

                if(code == '0000'){
                    this.$toast('恭喜您，交易密码修改成功')
                    this.$router.push({ path: `/orderPay/${orderCode}` });
                } else {
                    this.$toast(message)
                }

            }


        },
        async getSmsClick(){
            if(!this.smsTimer){
                dealPwdServer.getSmsCode({
                    acount: this.accountName,
                    //3重置交易密码5设置交易密码
                    codeType: this.codeType,
                    imgCode: '',
                    serialNo:  ''
                })
                this.leftSeconds = 60;
                this.smsTimer = setInterval(()=>{
                    this.leftSeconds = this.leftSeconds - 1;

                    if(this.leftSeconds == -1){
                        clearInterval(this.smsTimer);
                        this.smsTimer = null
                    }
                }, 1000)
            }
        },
        //手机号码隐位
        hidePhone(phone){
            return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
        }

    }
}
</script>


