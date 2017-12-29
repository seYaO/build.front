require('es6-promise').polyfill()
import lodash from 'lodash'
import axios from 'axios'

/**
 * 
 * @param {url 请求后台的地址} options 
 * @param {method 请求方式 'get' 'post' 'delete' 'push'} options 
 * @param {data 请求后台需要携带的参数} options 
 * @param {fetchType 请求类型，判断是否跨域请求 'CORS' 'YQL' 'JSONP'} options 
 * 
 */
const fetch = options => {
    let { url, method = 'get', data, fetchType } = options
    method = method.toLowerCase()

    // lodash 是一款 js 工具库，作用是进行深度克隆，最多克隆四层
    const cloneData = lodash.cloneDeep(data)
    
    switch (method) {
        case 'get':
            return axios.get(url, { params: cloneData });
        case 'delete':
            return axios.delete(url, { data: cloneData });
        case 'post':
            return axios.post(url, cloneData);
        case 'put':
            return axios.put(url, cloneData);
        case 'patch':
            return axios.patch(url, cloneData);
        default:
            return axios(options);
    }
}

/**
 * 主要功能：封装 fetch 函数
 */
export default async(options) => {
    return fetch(options).then(res => {
        return res.data;
    }).catch(err => {
        console.log(err)
        const { response } = err;
        let status, msg, otherData = {};
        if(response){
            const { data, statusText } = response;
            otherData = data;
            status = response.status;
            msg = data.message || statusText;
        }else{
            status = 600;
            msg = 'Network Error';
        }

        return {
            status,
            message: msg,
            otherData
        }
    });
}