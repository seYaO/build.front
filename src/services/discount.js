import request from '../utils/request'
import { APIV1 } from '../utils/config'

/**
 * 获取可用红包
 * @param {*} params 
 */
export const getReadPacket = (params) => {
    return request({
        url: `${APIV1}/getReadPacket`,
        method: 'get',
        data: params
    })
}

/**
 * 获取订单已绑定红包
 * @param {*} params 
 */
export const bindReadPacket = (params) => {
    return request({
        url: `${APIV1}/bindReadPacket`,
        method: 'get',
        data: params
    })
}