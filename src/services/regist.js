import request from '../utils/request'
import { APIV1 } from '../utils/config'




/**
 * 验证邀请码是否有效
 * @param {*} params 
 */
export const validateInviteCode = (params) => {
    return request({
        url: `${APIV1}/invitate`,
        method: 'post',
        data: params
    })
}

/**
 * 验证账号
 * @param {*} params 
 */
export const validateAcount = (params) => {
    return request({
        url: `${APIV1}/validate`,
        method: 'post',
        data: params
    })
}


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
 * 注册提交数据
 * @param {*} params 
 */
export const registSubmit = (params) => {
    return request({
        url: `${APIV1}/register`,
        method: 'post',
        data: params
    })
}


/**
 * 获取所有的省市数据
 * @param {*} params 
 */
export const getProvinceAndCity = (params = {}) => {
    return request({
        url: `${APIV1}/city`,
        method: 'get',
        data: params
    })


}


