function test(time){
    var date = new Date();
    var nowTime = new Date().getTime();
    var first = `${date.getFullYear()}/${date.getMonth() + 1}/${data.getDate()} ${time}`
    var firstTime = new Date(first).getTime();
    var num = nowTime - firstTime;
    num = num/1000/60/60;
    return num;
}

module.exports = {
    // 登录类型-境外
    loginType: 'JWLYX',
    apiPrefix: 'https://wx.17u.cn/wechatapplet' // 发布
}