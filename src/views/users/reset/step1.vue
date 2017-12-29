<template>
<div class="reset-content">
    <div class="row">
        <input v-model="phone" @focus="errMsg = ''" @blur="getInputVal('phone')" type="tel" maxlength="11" placeholder="请输入手机号">
        <div class="clear" @click="getClear('phone')"></div>
    </div>
    <div class="row">
        <input v-model="captchaCode" @focus="errMsg = ''" @blur="getInputVal('captchaCode')" type="text" placeholder="请输入图形验证码">
        <div class="captcha" @click="getCaptcha">
            <div class="img">
                <img :src="'/api/v1/img?code=' + captcha.code" alt="">
            </div>
            <div>换一张</div>
        </div>
    </div>
    <div class="row">
        <input v-model="smsCode" @focus="errMsg = ''" @blur="getInputVal('smsCode')" type="text" placeholder="请输入短信验证码">
        <div class="sms" v-if="!smsTimerShow" @click="getSmsCode">获取验证码</div>
        <div class="sms noclick" v-if="smsTimerShow">{{smsTimer}}s后可重发</div>
    </div>
    <div class="errMsg" :class="{ hidden: !errMsg }"><i class="warn">!</i><span>{{errMsg}}</span></div>
    <div class="submit" @click="getNext">下一步</div>
    <div class="tip">无法接收验证码？请致电<a href="tel:4001001514">400-100-1514</a>转1</div>
</div>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { phoneValidate } from '@/utils/validate'
import * as user from '@/services/user'

export default {
    components: {},
    data() {
        return {
            phone: '',
            captchaCode: '',
            smsCode: '',
            errMsg: '',
            smsTimerShow: false,
            smsTimer: 60,
        }
    },
    beforeMount() {
        document.title = '找回密码'
    },
    computed: {
        ...mapState({
            captcha: state => state.user.captcha,
            acount: state => state.user.acount
        })
    },
    mounted() {
        this.phone = this.acount;
        this.getCaptcha();
    },
    methods: {
        ...mapMutations([ 'setPhone', 'setSmsCode' ]),
        ...mapActions([ 'getCaptcha' ]),

        // 清除数据
        getClear(type) {
            this[type] = '';
            this.errMsg = '';
        },

        // 验证
        getValidate(type) {
            if(!this.phone){
                this.errMsg = '请输入您的手机号';
                return false;
            }else if(!phoneValidate(this.phone)){
                this.errMsg = '手机号错误，请重新填写';
                return false;
            }

            if(!this.captchaCode){
                this.errMsg = '请输图形验证码';
                return false;
            }

            if(type !== 'sms' && !this.smsCode){
                this.errMsg = '请输入短信验证码';
                return false;
            }

            return true;
        },

        // input数据验证
        getInputVal(type) {
            let value = this[type];
            switch(type){
                case 'phone':
                    if(!value){
                        this.errMsg = '请输入您的手机号';
                    }else if(!phoneValidate(value)){
                        this.errMsg = '手机号错误，请重新填写';
                    }else{
                        this.setPhone(value)
                    }
                    break;
                case 'captchaCode':
                    if(!value){
                        this.errMsg = '请输图形验证码';
                    }
                    break;
                case 'smsCode':
                    if(!value){
                        this.errMsg = '请输入短信验证码';
                    }
                    break;
            }
        },

        // 倒计时
        smsCountDown() {
            this.smsTimerShow = true;
            let timer = setInterval(() => {
                if(this.smsTimer > 0){
                    this.smsTimer--;
                }else{
                    clearInterval(timer);
                    this.smsTimer = 60;
                    this.smsTimerShow = false;
                }
            }, 1000);
        },

        // 获取短信验证码
        async getSmsCode() {
            if(!this.getValidate('sms')) return false;
            let params = {
                acount: this.phone,
                codeType: 2,
                serialNo: this.captcha.serialNo,
                imgCode: this.captchaCode
            };
            const res = await user.smsCode(params);
            const { code, message } = res;
            if(code === '0000'){
                this.smsCountDown();
            }else{
                this.errMsg = message;
                this.getCaptcha();
            }
        },

        // 下一步
        async getNext() {
            if(!this.getValidate()) return false;

            let params = {
                acount: this.phone,
                codeType: 2,
                verificationCode: this.smsCode
            };
            this.setSmsCode(this.smsCode);
            const res = await user.validateSmsCode(params);
            const { code, message } = res;
            if(code === '0000'){
                this.$router.push({ path: '/reset/step2' });
            }else{
                this.errMsg = message;
                this.getCaptcha();
            }
        }
    }
}
</script>
