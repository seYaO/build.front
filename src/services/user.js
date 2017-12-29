import request from '../utils/request'
import { APIV1 } from '../utils/config'

/**
 * 验证码
 * @param {*} params 
 */
export const captcha = (params) => {
    return request({
        url: `${APIV1}/captcha`,
        method: 'get',
        data: params
    })
}

/**
 * 是否显示图片验证码(普通登录)
 * @param {*} params 
 */
export const isShowCaptcha = (params) => {
    return request({
        url: `${APIV1}/isShowCaptcha`,
        method: 'get',
        data: params
    })
}

/**
 * 获取短信验证码
 * @param {*} params 
 */
export const smsCode = (params) => {
    return request({
        url: `${APIV1}/smsCode`,
        method: 'post',
        data: params
    })
}

/**
 * 登录
 * @param {*} params 
 */
export const login = (params) => {
    return request({
        url: `${APIV1}/login`,
        method: 'post',
        data: params
    })
}

/**
 * 验证账号
 * @param {*} params 
 */
export const validate = (params) => {
    return request({
        url: `${APIV1}/validate`,
        method: 'post',
        data: params
    })
}

/**
 * 异步验证短信验证码
 * @param {*} params 
 */
export const validateSmsCode = (params) => {
    return request({
        url: `${APIV1}/validateSmsCode`,
        method: 'post',
        data: params
    })
}

/**
 * 重置登录密码
 * @param {*} params 
 */
export const resetLogin = (params) => {
    return request({
        url: `${APIV1}/resetLogin`,
        method: 'post',
        data: params
    })
}

/**
 * 常用投保人
 * @param {*} params 
 */
export const holders = (params) => {
    return request({
        url: `${APIV1}/holders`,
        method: 'get',
        data: params
    })
}