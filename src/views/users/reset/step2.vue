<template>
<div class="reset-content">
    <div class="text">
       请输入新的密码
    </div>
    <div class="row">
        <input v-model="pwd" @focus="errMsg = ''" @blur="getInputVal('pwd')" ref="pwd" type="password" placeholder="6-18位字母数字或符号的组合">
        <div :class="{ 'eye-close': !eyeShow, 'eye-open': eyeShow }" @click="eyeShow = !eyeShow"></div>
    </div>
    <div class="row">
        <input v-model="password" @focus="errMsg = ''" @blur="getInputVal('password')" ref="password" type="password" placeholder="请重复一遍新密码">
    </div>
    <div class="errMsg" :class="{ hidden: !errMsg }"><i class="warn">!</i><span>{{errMsg}}</span></div>
    <div class="submit" @click="getSubmit">提交新密码</div>
    <alert :open="alertShow" @on-confirm="changeHandler" @on-close="alertShow = false">{{alertText}}</alert>
</div>
</template>

<style lang="less">
@import './style.less';
</style>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { Alert, Confirm, Prompt } from '@/components'
import { passwordValidate } from '@/utils/validate'
import * as user from '@/services/user'

export default {
    components: {
        Alert,
        Confirm
    },
    data() {
        return {
            alertShow: false,
            alertText: '',
            checked: false,
            pwd: '',
            password: '',
            eyeShow: '',
            errMsg: '',
        }
    },
    beforeMount() {
        document.title = '找回密码'
    },
    computed: {
        ...mapState({
            acount: state => state.user.acount,
            smsTxt: state => state.user.smsCode
        })
    },
    mounted() {},
    methods: {
        // 验证
        getValidate() {
            if(!this.pwd){
                this.errMsg = '请填写密码';
                return false;
            }

            if(!passwordValidate(this.pwd)){
                this.errMsg = '您的密码安全等级太弱，请设置6-18位字母数字或符号的组合';
                return false;
            }

            if(this.pwd !== this.password){
                this.errMsg = '您两次输入的密码不一致';
                return false;
            }

            return true;
        },

        // input数据验证
        getInputVal(type) {
            let value = this[type];
            switch(type){
                case 'pwd':
                    if(!value){
                        this.errMsg = '请填写密码';
                    }else if(!passwordValidate(value)){
                        this.errMsg = '您的密码安全等级太弱，请设置6-18位字母数字或符号的组合';
                    }
                    break;
                case 'password':
                    if(this.pwd !== this.password){
                        this.errMsg = '您两次输入的密码不一致';
                    }
                    break;
            }
        },
        changeHandler() {
            this.alertShow = false;
            this.$router.push({ path: '/login' });
        },
        async getSubmit() {
            if(!this.getValidate()) return false;

            let params = {
                acount: this.acount,
                newpwd: this.pwd,
                verificationCode: this.smsTxt
            };
            const res = await user.resetLogin(params);
            const { code, message, data } = res;
            if(code === '0000'){
                this.alertShow = true;
                this.alertText = '恭喜您，密码修改成功';
            }else if(code === '7000'){
                this.errMsg = `短信验证码错误，您还可以输入${data.count}次`;
            }else{
                this.errMsg = message;
            }
        }
    },
    watch: {
        eyeShow(val, oldVal) {
            if(val) {
                this.$refs.pwd.type = 'text'
                this.$refs.password.type = 'text'
            }else{
                this.$refs.pwd.type = 'password'
                this.$refs.password.type = 'password'
            }
        }
    }
}
</script>
