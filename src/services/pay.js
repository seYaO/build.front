import request from '../utils/request'
import { APIV1 } from '../utils/config'

/**
 * 支付初始化
 * @param {*} params 
 */
export const init = (params) => {
    return request({
        url: `${APIV1}/payInit`,
        method: 'get',
        data: params
    })
}

/**
 * 获取支付连接
 * @param {*} params 
 */
export const url = (params) => {
    return request({
        url: `${APIV1}/payUrl`,
        method: 'post',
        data: params
    })
}

/**
 * 现金账户支付
 * @param {*} params 
 */
export const balance = (params) => {
    return request({
        url: `${APIV1}/payBalance`,
        method: 'post',
        data: params
    })
}

/**
 * 授权账户支付
 * @param {*} params 
 */
export const credit = (params) => {
    return request({
        url: `${APIV1}/payCredit`,
        method: 'post',
        data: params
    })
}

/**
 * 支付成功
 * @param {*} params 
 */
export const success = (params) => {
    return request({
        url: `${APIV1}/paySuccess`,
        method: 'get',
        data: params
    })
}