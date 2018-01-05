<template>
<div class="login">
    <div class="top">
        <img src="../../../images/login-top.png" alt="">
    </div>
    <div class="content">
        <ul class="tab">
            <li :class="{ curr: loginType === 0 }" @click="loginType = 0">普通登录</li>
            <li :class="{ curr: loginType === 1 }" @click="loginType = 1">验证码登录</li>
        </ul>
        <div class="intro" v-if="loginType === 0">
            <div class="row">
                <input v-model="generalPhone" @focus="errMsg = ''" @blur="getInputVal('phone', 'generalPhone')" type="tel" maxlength="11" placeholder="请输入手机号">
                <div class="clear" @click="getClear('generalPhone')"></div>
            </div>
            <div class="row">
                <input v-model="password" @focus="errMsg = ''" @blur="getInputVal('password', 'password')" ref="password" type="password" placeholder="请输入密码">
                <div :class="{ 'eye-close': !eyeShow, 'eye-open': eyeShow }" @click="eyeShow = !eyeShow"></div>
            </div>
            <div class="row" v-if="captcha.show">
                <input v-model="generalCaptcha" @focus="errMsg = ''" @blur="getInputVal('captcha', 'generalCaptcha')" type="text" placeholder="请输入图形验证码">
                <div class="captcha" @click="getCaptcha">
                    <div class="img">
                        <img :src="'/api/v1/img?code=' + captcha.code" alt="">
                    </div>
                    <div>换一张</div>
                </div>
            </div>
        </div>
        <div class="intro" v-if="loginType === 1">
            <div class="row">
                <input v-model="securityPhone" @focus="errMsg = ''" @blur="getInputVal('securityPhone')" type="text" maxlength="11" placeholder="请输入手机号">
                <div class="clear" @click="getClear('securityPhone')"></div>
            </div>
            <div class="row">
                <input v-model="securityCaptcha" @focus="errMsg = ''" @blur="getInputVal('captcha', 'securityCaptcha')" type="text" placeholder="请输入图形验证码">
                <div class="captcha" @click="getCaptcha">
                    <div class="img">
                        <img :src="'/api/v1/img?code=' + captcha.code" alt="">
                    </div>
                    <div>换一张</div>
                </div>
            </div>
            <div class="row">
                <input v-model="smsCode" @focus="errMsg = ''" @blur="getInputVal('sms', 'smsCode')" type="text" placeholder="请输入验证码">
                <div class="sms" v-if="!smsTimerShow" @click="getSmsCode">获取验证码</div>
                <div class="sms noclick" v-if="smsTimerShow">{{smsTimer}}s后可重发</div>
            </div>
        </div>
        <div class="info">
            <div class="remember" v-if="false" :class="{ curr: rememberShow }" @click="rememberShow = !rememberShow"><i></i><span>记住账号密码</span></div>
            <div>
                <div class="errMsg" :class="{ hidden: !errMsg }"><i class="warn">!</i><span>{{errMsg}}</span></div>
            </div>
            <div class="forget" @click="getForget">忘记密码</div>
        </div>

        <div class="btn">
            <div class="submit" @click="getSubmit">登录</div>
            <div class="regist" @click="getRegist"><span>快速注册</span></div>
        </div>
    </div>
</div>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { phoneValidate, isWeChart } from '@/utils/validate'
import * as user from '@/services/user'
import { setLocalStore, getLocalStore, getOpenId } from '@/utils'
import { wxsharecnt } from '@/utils/sharecnt';

export default {
    components: {},
    data() {
        return {
            errMsg: '',
            eyeShow: false, // 密码是否显示
            loginType: 0, // 0: 普通登录, 1: 快捷登录
            // 普通登录信息
            generalPhone: '',
            password: '',
            generalCaptcha: '',
            // 快捷登录信息
            securityPhone: '',
            securityCaptcha: '',
            smsCode: '',
            smsTimerShow: false,
            smsTimer: 60,
            rememberShow: false,
        }
    },
    beforeMount() {
        document.title = '登录'
    },
    computed: {
        ...mapState({
            captcha: state => state.user.captcha
        })
    },
    mounted() {
        wxsharecnt({
            shareImg:'',
            shareTitle:'',
            shareUrl : '',
            shareDesc : ''
        });

        this.getCaptcha();

        const openId = getLocalStore('openId');
        const { code = '' } = this.$route.query;
        !openId && setLocalStore('openId', code);

        if(!openId && isWeChart() && !code){
            location.href = getOpenId();
        }
    },
    methods: {
        ...mapMutations([ 'setPhone' ]),
        ...mapActions([ 'showCaptcha', 'getCaptcha' ]),

        // 清除数据
        getClear(type) {
            this[type] = '';
            this.errMsg = '';
        },

        getForget() {
            this.$router.push({ path: '/reset/step1' });
        },

        // 验证
        getValidate(type) {
            let phone, password, captcha, smsCode, loginType = this.loginType, captchaShow = true;
            switch(loginType){
                case 0:
                    phone = this.generalPhone;
                    password = this.password;
                    captcha = this.generalCaptcha;
                    captchaShow = this.captcha.show;
                    break;
                case 1:
                    phone = this.securityPhone;
                    captcha = this.securityCaptcha;
                    smsCode = this.smsCode;
                    break;
            }

            if(!phone){
                this.errMsg = '请输入您的手机号';
                return false;
            }else if(!phoneValidate(phone)){
                this.errMsg = '手机号错误，请重新填写';
                return false;
            }

            if(loginType === 0 && type !== 'sms') {
                if(!password){
                    this.errMsg = '请输入密码';
                    return false;
                }
            }

            if(captchaShow && !captcha){
                this.errMsg = '请输图形验证码';
                return false;
            }

            if(loginType === 1 && type !== 'sms') {
                if(!smsCode){
                    this.errMsg = '请输入验证码';
                    return false;
                }
            }

            return true;
        },

        // input数据验证
        getInputVal(type, obj) {
            let value = this[obj];
            switch(type){
                case 'phone':
                    if(!value){
                        this.errMsg = '请输入您的手机号';
                    }else if(!phoneValidate(value)){
                        this.errMsg = '手机号错误，请重新填写';
                    }else{
                        this.setPhone(value)
                        if(obj === 'generalPhone'){
                            this.showCaptcha({ acount: this.generalPhone })
                        }
                    }
                    break;
                case 'password':
                    if(!value){
                        this.errMsg = '请输入密码';
                    }
                    break;
                case 'captcha':
                    if(!value){
                        this.errMsg = '请输图形验证码';
                    }
                    break;
                case 'sms':
                    if(!value){
                        this.errMsg = '请输入验证码';
                    }
                    break;
            }
        },

        // 获取短信验证码
        async getSmsCode() {
            if(!this.getValidate('sms')) return false;
            let params = {
                acount: this.securityPhone,
                codeType: 4,
                serialNo: this.captcha.serialNo,
                imgCode: this.securityCaptcha
            };
            const res = await user.smsCode(params);
            const { code, message } = res;
            if(code === '0000'){
                this.smsCountDown();
            }else if(code === '1001'){
                location.href = '/login';
            }else{
                this.errMsg = message;
                this.getCaptcha();
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

        getRegist() {
            location.href = '/register';
        },

        // 提交
        async getSubmit() {
            if(!this.getValidate()) return false;

            let loginType = this.loginType;
            let params = { client: 1, loginType, isRememberMe: this.rememberShow };
            if(loginType === 0){
                Object.assign(params, {
                    acount: this.generalPhone,
                    password: this.password,
                });
                if(this.captcha.show){
                    Object.assign(params, {
                        serialNo: this.captcha.serialNo,
                        imgCode: this.generalCaptcha
                    });
                }
            }else{
                Object.assign(params, {
                    acount: this.securityPhone,
                    smsCode: this.smsCode
                });
            }

            const res = await user.login(params);
            const { code, message, data } = res;
            if(code === '0000'){
                setLocalStore('acount', params.acount);
                location.href = '/'
                // this.$router.push({ path: '/' });
            }else if(code === '3004'){
                this.errMsg = message;
                this.showCaptcha({ acount: this.generalPhone });
                this.getCaptcha();
            }else if(code === '7000'){
                this.errMsg = `短信验证码错误，您还可以输入${data.count}次`;
                this.getCaptcha();
            }else if(code === '3014'){
                this.errMsg = `密码输错超过限定次数，请60分钟后重试，或重置密码后登录`;
                this.getCaptcha();
            }else{
                this.errMsg = message;
                this.getCaptcha();
            }
        }
    },
    watch: {
        eyeShow(val, oldVal) {
            if(val) {
                this.$refs.password.type = 'text'
            }else{
                this.$refs.password.type = 'password'
            }
        }
    }
}
</script>



