// 支付初始化
const initPay = require('./data/initPay');

// 获取支付连接
const payUrl = {
    "code": "0000",
    "message": "操作成功",
    "data": {
        "payUrl": "",
        "jsApiParam": {
            "appId": "wx4cecc2f5c07b594a",
            "timeStamp": "1510236295",
            "nonceStr": "3215c45a57734faaaa11aecf1db33a08",
            "sign": "AE7075F76549968CFD4C75134D224581",
            "package": "prepay_id=wx20171109140455c17c1611ce0303470562"
        }
    }
}

// 现金账户支付
const payBalance = {
    "code": "0000",
    "message": "操作成功",
    "data": {
        "count": 1
    }
}

// 授权账户支付
const payCredit = {
    "code": "0000",
    "message": "操作成功",
    "data": {
        "count": 1
    }
}

// 支付成功
const paySuccess = {
    "code": "0000",
    "message": "成功",
    "data": {
        "orderPayInfo": {
            "couponAmount": 0,
            "isActivity": 0,
            "orderCode": "I10001482",
            "productName": "美亚“畅游神州”境内旅行险",
            "redPackageDeductibleAmount": 0,
            "reduceAmount": 6,
            "safeguardTime": "2017-10-27至2017-10-27",
            "totalFee": 20
        },
        "companyName": "美亚保险",
        "orderCode": "I10001482"
    }
}

module.exports = {
    initPay,
    payUrl,
    payBalance,
    payCredit,
    paySuccess,
}