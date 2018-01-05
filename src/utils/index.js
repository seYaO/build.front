// 删除左右两端的空格
String.prototype.trim = function() {
    return this.replace(/^\s*|\s*$/g, '');
}

// 删除左边的空格
String.prototype.ltrim = function() {
    return this.replace(/^\s*/g, '');
}

// 删除右边的空格
String.prototype.ltrim = function() {
    return this.replace(/\s*$/g, '');
}

// 删除所有的空格
String.prototype.alltrim = function() {
    return this.replace(/\s/ig, '');
}

if (!Date.now) {
    Date.now = function () {
        return (new Date()).getTime();
    }
}

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 * demo:
 * @param {*} fmt 
 */
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
}

/**
 * 日期后推
 * @param {类型} interval 
 * @param {*} number 
 */
Date.prototype.subtract = function (interval, number) {
    interval = (interval || '').replace(/\s+/ig, '');
    number = Number(number);

    switch (interval) {
        case 'years':
            this.setFullYear(this.getFullYear() - number);
            break;
        case 'quarters':
            this.setMonth(this.getMonth() - number * 3);
            break;
        case 'months':
            this.setMonth(this.getMonth() - number);
            break;
        case 'weeks':
            this.setDate(this.getDate() - number * 7);
            break;
        case 'days':
            this.setDate(this.getDate() - number);
            break;
        case 'hours':
            this.setHours(this.getHours() - number);
            break;
        case 'minutes':
            this.setMinutes(this.getMinutes() - number);
            break;
        case 'seconds':
            this.setSeconds(this.getSeconds() - number);
            break;
        case 'milliseconds':
            this.setMilliseconds(this.getMilliseconds() - number);
            break;
    }

    return this;
}

/**
 * 日期后推
 * @param {类型} interval 
 * @param {*} number 
 */
Date.prototype.add = function (interval, number) {
    interval = (interval || '').replace(/\s+/ig, '');
    number = Number(number);

    switch (interval) {
        case 'years':
            this.setFullYear(this.getFullYear() + number);
            break;
        case 'quarters':
            this.setMonth(this.getMonth() + number * 3);
            break;
        case 'months':
            this.setMonth(this.getMonth() + number);
            break;
        case 'weeks':
            this.setDate(this.getDate() + number * 7);
            break;
        case 'days':
            this.setDate(this.getDate() + number);
            break;
        case 'hours':
            this.setHours(this.getHours() + number);
            break;
        case 'minutes':
            this.setMinutes(this.getMinutes() + number);
            break;
        case 'seconds':
            this.setSeconds(this.getSeconds() + number);
            break;
        case 'milliseconds':
            this.setMilliseconds(this.getMilliseconds() + number);
            break;
    }

    return this;
}

/**
 * 判断日期是否在两个日期之间,包括两个日期
 * @param {1990-12-12} startDate 
 * @param {1990-12-12} endDate 
 */
Date.prototype.isBetween = function (startDate, endDate) {
    startDate = startDate.replace(/-/g, '/');
    endDate = endDate.replace(/-/g, '/');
    let time = this.getTime();
    let startTime = new Date(startDate).getTime();
    let endTime = new Date(endDate).getTime();
    if (time >= startTime && time <= endTime) {
        return true;
    }
    return false;
}

/**
 * 根据出生日期字符串得到出生天数
 */
Date.prototype.days = function () {
    let nowTime = Date.now();
    return parseInt((nowTime - this.getTime()) / 1000 / 3600 / 24);
}

/**
 * 根据出生日期字符串得到周岁
 * @param {起保时间，为空时显示当前时间} startDate 
 */
Date.prototype.age = function (startDate) {
    let year = this.getFullYear();
    let month = this.getMonth() + 1;
    let date = this.getDate();
    let now = startDate ? new Date(startDate.replace(/-/g, '/')) : new Date();
    let nowYear = now.getFullYear();
    let nowMonth = now.getMonth() + 1;
    let nowDate = now.getDate();
    let age = nowYear - year;
    if (nowMonth > month) {
        return age;
    }
    if (nowMonth === month) {
        if (nowDate >= date) {
            return age;
        } else {
            return age - 1;
        }
    }
    if (nowMonth < month) {
        return age - 1;
    }
}


function typeDeepOf(obj) {
    if(typeof obj !== 'object') return typeof obj;
    return Object.prototype.toString.apply(obj).slice(8, -1).toLowerCase();
}

// 数组去重
Array.prototype.unique = function () {
    let arr = [], // 临时数组
        hash = {}; // hash表
    for (var i = 0; this.length; i++) {
        if (!hash[this[i]]) { // 如果hash表中没有当前项
            hash[this[i]] = true; // 存入hash表
            arr.push(this[i]);
        }
    }

    return arr;
}

// 深拷贝
export const clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 时间类型转换
 */
export const timeTypes = {
    'Y': 'years',
    'A': 'years',
    'D': 'days',
    'M': 'months',
}

/**
 * 计算日期范围
 * @param {最小的类型} minageUtil 
 * @param {最小的number} minage 
 * @param {最大的类型} maxageUtil 
 * @param {最大的number} maxage 
 * @param {起保时间，为空时显示当前时间} selectDate 
 * return { startDate, endDate }
 */
export const dateRange = (minageUtil, minage, maxageUtil, maxage, selectDate) => {
    let startDate, endDate;
    minage = Number(minage);
    maxage = Number(maxage);
    minageUtil = minageUtil.toUpperCase();
    maxageUtil = maxageUtil.toUpperCase();
    let nowMax = selectDate ? new Date(selectDate.replace(/-/g, '/')) : new Date();
    let nowMin = selectDate ? new Date(selectDate.replace(/-/g, '/')) : new Date();

    if (maxageUtil === 'Y') {
        startDate = nowMax.subtract('years', maxage + 1).add('days', 1);
    } else if (maxageUtil === 'D') {
        startDate = nowMax.subtract('days', maxage).add('days', 1);
    } else if (maxageUtil === 'M') {
        startDate = nowMax.subtract('months', maxage);
    }

    if (minageUtil === 'Y') {
        endDate = nowMin.subtract('years', minage);
    } else if (minageUtil === 'D') {
        if (minage === 0) {
            endDate = nowMin;
        } else {
            endDate = nowMin.subtract('days', minage).add('days', 1);
        }
    } else if (minageUtil === 'M') {
        endDate = nowMin.subtract('months', minage);
    }
    startDate = startDate ? startDate.format('yyyy-MM-dd') : null;
    endDate = endDate ? endDate.format('yyyy-MM-dd') : null;
    return { startDate, endDate }
}

/**
 * 根据身份证获取性别和出生日期
 * @param {身份证} idCard 
 */
export const idCardInfo = (idCard) => {
    let birthday, gender, genderNumber;
    idCard = idCard.alltrim();
    if (idCard.length === 15) {
        genderNumber = parseInt(idCard.substr(14, 1));
        birthday = idCard.substring(6, 12);
        birthday = `19${birthday}`;
    } else {
        genderNumber = parseInt(idCard.substr(16, 1));
        birthday = idCard.substring(6, 14);
    }

    birthday = birthday.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    if (genderNumber % 2 === 0) {
        gender = 'F';
    } else {
        gender = 'M';
    }

    return {
        birthday,
        gender,
        age: new Date(birthday.replace(/-/g, '/')).age()
    }
}

/**
 * 价格处理
 * @param {价格} price 
 */
export const getPrice = (price) => {
    price = price.toFixed(2);
    price = price.replace(/(\d*)(\.)(\d*)/, (a, b, c, d) => {
        if (d === '00') {
            return b;
        } else {
            if (/\d0/.test(d)) {
                d = d[0];
            }
            return `${b}.${d}`;
        }
    })
    return Number(price);
}

/**
 * 获取微信openId
 * @param {*} url 
 */
export const getOpenId = () => {
    let _url = encodeURIComponent(location.href);
    _url = encodeURIComponent(`http://wx.17u.cn/chexian/wx/alb/api/wxAlbCallBack?redirect=${_url}`);
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4cecc2f5c07b594a&redirect_uri=${_url}&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect`;
}

/**
 * 存储localStorage
 * @param {*} name 
 * @param {*} content 
 */
export const setLocalStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 * @param {*} name 
 */
export const getLocalStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 * @param {*} name 
 */
export const removeLocalStore = name => {
    if (!name) return;
	window.localStorage.removeItem(name);
}

// Session
/**
 * 存储sessionStorage
 * @param {*} name
 * @param {*} content 
 */
export const setSessionStore = (name, content) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 * @param {*} name 
 */
export const getSessionStore = name => {
    if (!name) return;
    let content = window.sessionStorage.getItem(name);
    return content ? JSON.parse(content) : null;
}

/**
 * 删除sessionStorage
 * @param {*} name 
 */
export const removeSessionStore = name => {
    if (!name) return;
	window.sessionStorage.removeItem(name);
}

const loadImage = (file) => {
    return new Promise((resolve, reject) => {
        let imgFile = new FileReader();
        imgFile.readAsDataURL(file);
        imgFile.onload = (e) => {
            const { result } = e.target;
            let image = new Image();
            image.src = result;
            image.onload = () => resolve(image)
        };
    });
}

/**
 * getBase64
 * @param {*} file
 */
export const getBase64 = (file) => {
    let fileType = file.type;
    return loadImage(file).then(image => {
        let canvas = document.createElement('canvas');
        let scale = 1;
        if(image.width > 1000 || image.height > 1000){
            if(image.width > image.height){
                scale = 1000 / image.width;
            }else{
                scale = 1000 / image.height;
            }
        }
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        let newImgData = canvas.toDataURL(fileType, 0.7);

        return newImgData.replace(/data:.*;base64,/, '');
    })
}

/**
 * getBase64
 * @param {*} file
 * @param {*} multiple
 */
export const getImg = async function(file, multiple) {
    let imgList = [];
    if(multiple){
        let files = file.files;
        for(let i = 0; i < files.length; i++){
            let img = await getBase64(files[i]);
            imgList.push(img);
        }
    }else{
        let img = await getBase64(file.files[0]);
        imgList.push(img);
    }
    return imgList;
}