import request from '../utils/request'
import { APIV1 } from '../utils/config'

/**
 * 获取短信验证码
 * @param {*} params 
 */
export const getSmsCode = (params) => {
    return request({
        url: `${APIV1}/smsCode`,
        method: 'post',
        data: params
    })
}

/**
 * 异步校验短信验证码
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
 * 设置交易密码
 * @param {*} params 
 */
export const setDealPwd = (params) => {
    return request({
        url: `${APIV1}/setPayPwd`,
        method: 'post',
        data: params
    })
}

/**
 * 重置交易密码
 * @param {*} params 
 */
export const resetDealPwd = (params) => {
    return request({
        url: `${APIV1}/resetPayPwd`,
        method: 'post',
        data: params
    })
}

