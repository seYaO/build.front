const { https, apiPrefix } = require('../utils/index');
const { loginType } = require('../utils/config');

/**
 * 用户信息
 * @param {*} cb 
 */
const getUserInfo = (cb) => {
    wx.login({
        success(res){
            const { code } = res;
            if(!code) return;

            wx.getUserInfo({
                success(_res){
                    const { ...other } = _res;
                    return typeof cb === 'function' && cb(null, { code, ...other });
                },
                fail(err){
                    return typeof cb === 'function' && cb(err);
                    console.log(err)
                }
            });
        }
    })
}

/**
 * 登陆信息
 * @param {*} param0 
 * @param {*} cb 
 * GET /login
 */
const login = ({ code, iv, encryptedData }, cb) => {
    let params = { code, iv, encryptedData, types: loginType };
    https({
        url: `${apiPrefix}/login`,
        data: params
    }, (err, res) => {
        typeof cb === 'function' && cb(res);
    })
}

/**
 * 发起活动列表接口
 * @param {*} param0 
 * @param {*} cb 
 * GET /open/lvyou/product/getProducts
 */
const sponsors = ({ params, header = {} }, cb) => {
    https({
        url: `${apiPrefix}/party/created/list`,
        header,
        method: 'post',
        data: params
    }, (err, res) => {
        typeof cb === 'function' && cb(res);
    });
}

/**
 * 发起活动接口
 * @param {*} param0 
 * @param {*} cb 
 * GET /part/add
 */
const sponsor = ({ params, header = {} }, cb) => {
    https({
        url: `${apiPrefix}/party/add`,
        header,
        method: 'post',
        data: params
    }, (err, res) => {
        typeof cb === 'function' && cb(res);
    });
}

/**
 * 投票
 * @param {*} param0 
 * @param {*} cb 
 * GET /part/add
 */
const participate = ({ params, header = {} }, cb) => {
    https({
        url: `${apiPrefix}/vote/add`,
        header,
        method: 'post',
        data: params
    }, (err, res) => {
        typeof cb === 'function' && cb(res);
    });
}

/**
 * 参与活动列表接口
 * @param {*} param0 
 * @param {*} cb 
 * GET /open/lvyou/product/getProducts
 */
const participates = ({ params, header = {} }, cb) => {
    https({
        url: `${apiPrefix}/party/joined/list`,
        header,
        method: 'post',
        data: params
    }, (err, res) => {
        typeof cb === 'function' && cb(res);
    });
}

/**
 * 详情页初始化数据--产品详情接口
 * @param {*} param0 
 * @param {*} cb 
 * GET /party/detail
 */
const detail = ({ params, header = {} }, cb) => {
    https({
        url: `${apiPrefix}/party/detail`,
        header,
        data: params
    }, (err, res) => {
        typeof cb === 'function' && cb(res);
    });
}


module.exports = {
    getUserInfo, // 用户信息
    login, // 登陆信息
    sponsor,
    participate,
    sponsors, // 发起活动列表
    participates, // 参与活动列表
    detail, // 详情页
}

