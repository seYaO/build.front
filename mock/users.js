// 登录
const login = {
    "code": "0000",
    "message": "成功",
    "data": {
        "token": "kjahsdf8732hkjsdf8",
    }
}

// token获取会员信息
const userInfo = {
    "code": "0000",
    "message": "成功",
    "data": {
        "acount": "13771854930",
        "isChild": "0",
        "memberId": "100004",
        "cMerberId": "2345243"
    }
}

// 是否显示图片验证码（普通登录）
const isShowCaptcha = {
    "code": "0000",
    "message": "成功",
    "data": {
        "result": false
    }
}

// 获取图片验证码
const captcha = {
    "code": "0000",
    "message": "成功",
    "data": {
        "imgCode": "IAYUD",
        "serialNo": "IG5A2A426C001FU4F52C"
    }
}

// 验证账号
const validate = {
    "code": "0000",
    "message": "成功",
    "data": null
}

// 重置登录密码
const resetLogin = {
    "code": "0000",
    "message": "成功",
    "data": null
}

// 获取会员是否设置交易密码
const isSetPayPwd = {
    "code": "0000",
    "message": "成功",
    "data": {
        "exist": true,
        "lastLoginTime": "2017-12-07 18:15:40"
    }
}

// 设置交易密码
const setPayPwd = {
    "code": "0000",
    "message": "支付密码设置成功",
    "data": null
}

// 重置交易密码
const resetPayPwd = {
    "code": "0000",
    "message": "操作成功",
    "data": null
}

// 获取短信验证码
const smsCode = {
    "code": "0000",
    "message": "操作成功",
    "data": null
}

// 异步验证短信验证码
const validateSmsCode = {
    "code": "0000",
    "message": "操作成功",
    "data": null
}

// 常用投保人
const holders = {
    "code": "0000",
    "message": "操作成功",
    "data": [
        {
            "id": 22,
            "memberId": "100770",
            "holderName": "耿玉裴更",
            "holderCredType": 1,
            "holderCredNo": "342222199108054423",
            "holderGender": "F",
            "holderBirthday": "1991-08-05",
            "holderPhone": "17751104423",
            "holderEmail": "770848406@qq.com",
            "isDefault": 1,
            "isDel": 0
        },
        {
            "id": 23,
            "memberId": "100770",
            "holderName": "护照",
            "holderCredType": 2,
            "holderCredNo": "1234567",
            "holderGender": "M",
            "holderBirthday": "1994-08-09",
            "holderPhone": "18651104423",
            "holderEmail": "56876406@qq.com",
            "isDefault": 0,
            "isDel": 0
        }
    ]
}

// 注册
const register = {
    "code":"0000",
    "message":"操作成功",
    "data":{
        "token": "kjahsdf8732hkjsdf8",
    }
}
module.exports = {
    login,
    userInfo,
    isShowCaptcha,
	captcha,
    validate,
    resetLogin,
    isSetPayPwd,
    setPayPwd,
    resetPayPwd,
    smsCode,
    validateSmsCode,
    holders,
    register
}