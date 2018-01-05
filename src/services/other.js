import request from '../utils/request'
import { APIV1 } from '../utils/config'

/**
 * 机场
 * @param {*} params 
 */
export const airport = (params) => {
    return request({
        url: `${APIV1}/airport`,
        method: 'get',
        data: params
    })
}

/**
 * 邮箱
 * @param {*} params 
 */
export const email = (params) => {
    return request({
        url: `${APIV1}/getEmail`,
        method: 'post',
        data: params
    })
}

/**
 * ocr
 * @param {*} params 
 */
export const ocr = (params) => {
    return request({
        url: `${APIV1}/ocr`,
        method: 'post',
        data: params
    })
}

/**
 * ocr批量识别身份证
 * @param {*} params 
 */
export const ocrIdCard = (params) => {
    return request({
        url: `${APIV1}/ocrIdCard`,
        method: 'post',
        data: params
    })
}

/**
 * ocr批量识别护照
 * @param {*} params 
 */
export const ocrPassport = (params) => {
    return request({
        url: `${APIV1}/ocrPassport`,
        method: 'post',
        data: params
    })
}