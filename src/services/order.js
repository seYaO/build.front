import request from '../utils/request'
import { APIV1 } from '../utils/config'

/**
 * 初始化
 * @param {*} params 
 */
export const init = (params) => {
    return request({
        url: `${APIV1}/orderInit`,
        method: 'get',
        data: params
    })
}

/**
 * 获取企业投保人信息
 * @param {*} params 
 */
export const enterprise = (params) => {
    return request({
        url: `${APIV1}/enterprise`,
        method: 'get',
        data: params
    })
}

/**
 * 下单
 * @param {*} params 
 */
export const add = (params) => {
    return request({
        url: `${APIV1}/orderAdd`,
        method: 'post',
        data: params
    })
}

/**
 * 列表
 * @param {*} params 
 */
export const list = (params) => {
    return request({
        url: `${APIV1}/orderList`,
        method: 'get',
        data: params
    })
}

/**
 * 详情
 * @param {*} params 
 */
export const detail = (params) => {
    return request({
        url: `${APIV1}/orderDetail`,
        method: 'get',
        data: params
    })
}

/**
 * 取消订单
 * @param {*} params 
 */
export const cancel = (params) => {
    return request({
        url: `${APIV1}/orderCancel`,
        method: 'get',
        data: params
    })
}

/**
 * 撤单
 * @param {*} params 
 */
export const refund = (params) => {
    return request({
        url: `${APIV1}/orderRefund`,
        method: 'get',
        data: params
    })
}

/**
 * 撤销前弹框展示
 * @param {*} params 
 */
export const refundPopup = (params) => {
    return request({
        url: `${APIV1}/orderRefundPopup`,
        method: 'get',
        data: params
    })
}

/**
 * 重投
 * @param {*} params 
 */
export const afresh = (params) => {
    return request({
        url: `${APIV1}/orderAfresh`,
        method: 'get',
        data: params
    })
}