/* Object that contains our utility functions.
 * Attached to the window object which acts as the global namespace.
 */
window.utils = {};
/**
 * Keeps track of the current mouse position, relative to an element.
 * @param {HTMLElement} element
 * @return {object} Contains properties: x, y, event
 */
window.utils.captureMouse = function (element) {
    let mouse = { x: 0, y: 0, event: null },
        body_scrollLeft = document.body.scrollLeft,
        element_scrollLeft = document.documentElement.scrollLeft,
        body_scrollTop = document.body.scrollTop,
        element_scrollTop = document.documentElement.scrollTop,
        offsetLeft = element.offsetLeft,
        offsetTop = element.offsetTop;

    element.addEventListener('mousemove', function (event) {
        let x, y;

        if (event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + body_scrollLeft + element_scrollLeft;
            y = event.clientY + body_scrollTop + element_scrollTop;
        }
        x -= offsetLeft;
        y -= offsetTop;

        mouse.x = x;
        mouse.y = y;
        mouse.event = event;
    }, false);

    return mouse;
};

/**
 * Keeps track of the current (first) touch position, relative to an element.
 * @param {HTMLElement} element
 * @return {object} Contains properties: x, y, isPressed, event
 */
window.utils.captureTouch = function (element) {
    let touch = { x: null, y: null, isPressed: false, event: null },
        body_scrollLeft = document.body.scrollLeft,
        element_scrollLeft = document.documentElement.scrollLeft,
        body_scrollTop = document.body.scrollTop,
        element_scrollTop = document.documentElement.scrollTop,
        offsetLeft = element.offsetLeft,
        offsetTop = element.offsetTop;

    element.addEventListener('touchstart', function (event) {
        touch.isPressed = true;
        touch.event = event;
    }, false);

    element.addEventListener('touchend', function (event) {
        touch.isPressed = false;
        touch.x = null;
        touch.y = null;
        touch.event = event;
    }, false);

    element.addEventListener('touchmove', function (event) {
        let x, y,
            touch_event = event.touches[0]; //first touch

        if (touch_event.pageX || touch_event.pageY) {
            x = touch_event.pageX;
            y = touch_event.pageY;
        } else {
            x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
            y = touch_event.clientY + body_scrollTop + element_scrollTop;
        }
        x -= offsetLeft;
        y -= offsetTop;

        touch.x = x;
        touch.y = y;
        touch.event = event;
    }, false);

    return touch;
};

/**
 * Returns a color in the format: '#RRGGBB', or as a hex number if specified.
 * @param {number|string} color
 * @param {boolean=}      toNumber=false  Return color as a hex number.
 * @return {string|number}
 */
window.utils.parseColor = function (color, toNumber) {
    if (toNumber === true) {
        if (typeof color === 'number') {
            return (color | 0); //chop off decimal
        }
        if (typeof color === 'string' && color[0] === '#') {
            color = color.slice(1);
        }
        return window.parseInt(color, 16);
    } else {
        if (typeof color === 'number') {
            color = '#' + ('00000' + (color | 0).toString(16)).substr(-6); //pad
        }
        return color;
    }
};

/**
 * Converts a color to the RGB string format: 'rgb(r,g,b)' or 'rgba(r,g,b,a)'
 * @param {number|string} color
 * @param {number}        alpha
 * @return {string}
 */
window.utils.colorToRGB = function (color, alpha) {
    //number in octal format or string prefixed with #
    if (typeof color === 'string' && color[0] === '#') {
        color = window.parseInt(color.slice(1), 16);
    }
    alpha = (alpha === undefined) ? 1 : alpha;
    //parse hex values
    let r = color >> 16 & 0xff,
        g = color >> 8 & 0xff,
        b = color & 0xff,
        a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
    //only use 'rgba' if needed
    if (a === 1) {
        return "rgb(" + r + "," + g + "," + b + ")";
    } else {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    }
};

/**
 * Determine if a rectangle contains the coordinates (x,y) within it's boundaries.
 * @param {object}  rect  Object with properties: x, y, width, height.
 * @param {number}  x     Coordinate position x.
 * @param {number}  y     Coordinate position y.
 * @return {boolean}
 */
window.utils.containsPoint = function (rect, x, y) {
    return !(x < rect.x ||
        x > rect.x + rect.width ||
        y < rect.y ||
        y > rect.y + rect.height);
};

/**
 * Determine if two rectangles overlap.
 * @param {object}  rectA Object with properties: x, y, width, height.
 * @param {object}  rectB Object with properties: x, y, width, height.
 * @return {boolean}
 */
window.utils.intersects = function (rectA, rectB) {
    return !(rectA.x + rectA.width < rectB.x ||
        rectB.x + rectB.width < rectA.x ||
        rectA.y + rectA.height < rectB.y ||
        rectB.y + rectB.height < rectA.y);
};


/**
 * 字符串去前后的空格
 * @param {*} val
 */
window.utils.trim = function (val) {
    return !!val && val.replace(/^\s+|\s+$/gm, '')
}

/**
 * 图片裁剪
 */
window.utils.setImageSize = function (url, size, type) {
    type = type || '00'
    if (!url) {
        return null;
    }
    if (url.indexOf("http:") != -1 && url.indexOf("file.wanchengly.com") == -1) {
        url = url.replace("http:", "https:")
    }
    var defaultSize = "_600x300_00";
    if (size && size.indexOf("_") === -1) {
        size = "_" + size + "_" + type;
    }
    var reg = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]/;
    var regSize = /_[0-9]{2,3}x[0-9]{2,3}_[0-9]?[0-9]$/;
    if (reg.test(url) && regSize.test(size)) {
        return url.replace(reg, size);
    }

    if (reg.test(url)) {
        return url;
    }

    if (url.indexOf("upload.17u.com") > -1 || url.indexOf("file.40017.cn") > -1 || url.indexOf("file.wanchengly.com") > -1) {
        return url;
    } else if (!reg.test(url)) {
        return url.replace(/\.\w+$/, function ($0) {
            return (size || defaultSize) + $0;
        });
    }
}

/**
 * url截参数
 */
window.utils.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}

/**
 * 拷贝
 */
window.utils.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 读取cookie
 */
window.utils.getCookie = function (name) {
    if (document.cookie.length > 0) {
        //先查询cookie是否为空，为空就return ""
        var c_start = document.cookie.indexOf(name + "="); //通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1
        if (c_start != -1) {
            c_start = c_start + name.length + 1; //最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
            var c_end = document.cookie.indexOf(";", c_start); //其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end)); //通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
        }
    }
    return "";
}

/**
 * 设置cookie
 */
window.utils.setCookie = function (name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie =
        name +
        "=" +
        escape(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
}

/**
 * tcapp
 */
window.utils.TongChengInfo = function (funBack) {
    window._tc_bridge_user.get_device_info({
        param: {
            shareKey: "",
            abId: "",
            abIds: ["key1", "key2"]
        },
        callback: function (data) {
            try {
                var rspObj = JSON.parse(data.CBData);
            } catch (error) { }
            var obj = {};
            obj.isTc = /tctravel/i.test(navigator.userAgent);
            obj.cid = rspObj && rspObj.locationInfo.cityId || '';
            obj.memberId = rspObj && rspObj.memberInfo.memberId || '';
            obj.unionId = rspObj && rspObj.memberInfo.unionId || '';
            obj.userName = rspObj && rspObj.memberInfo.userName || '';
            obj.headImg = rspObj && rspObj.memberInfo.headImg || '';
            funBack(obj)
        }
    })
}

/**
 * 取随机数
 * @param {*} minNum 
 * @param {*} maxNum 
 */
window.utils.randomNum = function (minNum, maxNum) {
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}

/**
 * 保存临时图片
 * @param {*} imgUrl 
 */
window.utils.tempFilePaths = function (imgUrl) {
    return new Promise((reslove, reject) => {
        let imgData = new Image();
        imgData.crossOrigin = "anonymous";
        imgData.onload = () => {
            reslove(imgData);
        }
        imgData.src = imgUrl;
    });
}

/**
 * 验证码
 */
window.utils.validate = {
    mobile: function (value) {
        let reg = /^1\d{10}$/
        return reg.test(value);
    }
}