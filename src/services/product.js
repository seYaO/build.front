import request from '../utils/request'
import { APIV1 } from '../utils/config'

/**
 * 分类
 * @param {*} params 
 */
export const classify = (params) => {
    return request({
        url: `${APIV1}/productClassify`,
        method: 'get',
        data: params
    })
}

/**
 * 列表
 * @param {*} params 
 */
export const list = (params) => {
    return request({
        url: `${APIV1}/productList`,
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
        url: `${APIV1}/productDetail`,
        method: 'get',
        data: params
    })
}