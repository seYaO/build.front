
/**
 * 字符串去前后的空格
 * @param {*} val 
 */
const trim = (val) => {
    return !!val && val.replace(/^\s+|\s+$/gm, '')
}

const typeDeepOf = (obj) => {
    if (typeof obj !== 'object') return typeof obj;
    return Object.prototype.toString.apply(obj).slice(8, -1).toLowerCase();
}

/**
 * 数组去重
 * @param {*} array 
 */
const unique = (array) => {
    if (typeDeepOf(array) !== 'array' || array.length === 0) return array;
    let result = [], obj = {};
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        if (!obj[item]) {
            result.push(item);
            obj[item] = 1;
        }
    }
    return result;
}

var slice = [].slice, class2type = {}, toString = class2type.toString;
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function (name, i) {
    class2type["[object " + name + "]"] = name.toLowerCase()
})

function type(obj) {
    return obj == null ? String(obj) :
        class2type[toString.call(obj)] || "object"
}

function isFunction(value) {
    return type(value) == "function"
}

function isObject(obj) {
    return type(obj) == "object"
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype
}
var isArray = Array.isArray ||
    function (object) {
        return object instanceof Array
    }

//对象合并
function extend(target) {
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
        deep = target
        target = args.shift()
    }

    args.forEach(function (arg) {
        extended(target, arg, deep)
    })
    return target
}

//
function extended(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                target[key] = {}

            if (isArray(source[key]) && !isArray(target[key]))
                target[key] = []
            extend(deep, target[key], source[key])
        } else if (source[key] !== undefined) target[key] = source[key]
    }
}

//判断是否为空字符串
function isNotEmptyString(str) {
    return typeof str === "string" && str !== "";
}


/**
 * 格式化时间
 * @param date Date 时间
 * @param format 格式化 "yyyy-MM-dd hh:mm:ss www"=format
 * @returns {string} 格式化后字符串
 */
function format(date, format) {
    if (typeof date == 'string') {
        date = this.parseDate(date)
    }
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };

    var w = [
        ['日', '一', '二', '三', '四', '五', '六'],
        ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    ];


    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    if (/(w+)/.test(format)) {
        format = format.replace(RegExp.$1, w[RegExp.$1.length - 1][date.getDay()]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

function parseDate(date) {
    return new Date(Date.parse(date.replace(/-/g, "/")));
}

/**
 * 小数位数处理
 * @param {*} price 
 */
const getDecimal = (value, number) => {
    value = Number(value)
    value = value.toFixed(number);
    value = value.replace(/(\d*)(\.)(\d*)/, (a, b, c, d) => {
        if (d === '00') {
            return b;
        } else {
            if (/\d0/.test(d)) {
                d = d[0];
            }
            return `${b}.${d}`;
        }
    })
    return Number(value);
}


module.exports = {
    extend,
    isNotEmptyString,
    format,
    parseDate,
    trim,
    unique,
    isFunction,
    isObject,
    isArray,
    getDecimal,
}