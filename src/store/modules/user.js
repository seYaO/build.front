import request from '@/utils/request'
import * as user from '@/services/user'

const state = {
    // 验证码信息
    captcha: {
        svg: '',
        code: '',
        serialNo: '',
        show: false
    },
    acount: '',
    smsCode: ''
}

const getters = {}

const mutations = {
    setCaptcha(state, payload) {
        const { svg = state.captcha.svg, serialNo = state.captcha.serialNo, show = state.captcha.show, code = state.captcha.code } = payload;
        state.captcha = { svg, serialNo, show, code };
    },
    setPhone(state, payload) {
        state.acount = payload;
    },
    setSmsCode(state, payload) {
        state.smsCode = payload;
    }
}

const actions = {
    /**
     * 是否显示图形验证码
     * @param {*} param0 
     * @param {*} param1 
     */
    async showCaptcha({ commit, state }, { acount = '' }) {
        const res = await user.isShowCaptcha({ acount });
        const { code, data: { result = false } } = res;
        commit({ type: 'setCaptcha', show: result });
    },
    /**
     * 获取图形验证码
     * @param {*} param0 
     * @param {*} payload 
     */
    async getCaptcha({ commit, state }) {
        const res = await user.captcha();
        const { svg, serialNo, code } = res;
        commit({ type: 'setCaptcha', svg, serialNo, code });
    },
}

export default { state, getters, mutations, actions }