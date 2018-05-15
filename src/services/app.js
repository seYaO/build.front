import { request, config } from 'utils'

const { api, apiPrefix } = config

export async function login(params) {
    return request({
        url: `${apiPrefix}/user/login`,
        method: 'post',
        data: params,
    })
}

export async function logout(params) {
    return request({
        url: `${apiPrefix}/user/logout`,
        method: 'get',
        data: params,
    })
}

export async function menus(params) {
    return request({
        url: `${apiPrefix}/menus`,
        method: 'get',
        data: params,
    })
}

export async function query(params) {
    return request({
        url: `${apiPrefix}/account/getUserAuth`,
        method: 'get',
        data: params,
    })
}