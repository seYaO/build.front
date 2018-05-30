import { request, config } from 'utils'

const { apiPrefix } = config

export async function login(params) {
    return request({
        url: `${apiPrefix}/account/getUserAuth`,
        method: 'post',
        data: params,
    })
}

export async function logout(params) {
    return request({
        url: `${apiPrefix}/account/getUserAuth`,
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
