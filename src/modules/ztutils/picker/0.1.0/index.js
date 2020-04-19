/**********************/
(function($) {
    "use strict";
    ['width', 'height'].forEach(function(dimension) {
        var  Dimension = dimension.replace(/./, function(m) {
            return m[0].toUpperCase();
        });
        $.fn['outer' + Dimension] = function(margin) {
            var elem = this;
            if (elem) {
                var size = elem[dimension]();
                var sides = {
                    'width': ['left', 'right'],
                    'height': ['top', 'bottom']
                };
                sides[dimension].forEach(function(side) {
                    if (margin) size += parseInt(elem.css('margin-' + side), 10);
                });
                return size;
            } else {
                return null;
            }
        };
    });
    //support
    $.support = (function() {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();
    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };
    $.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }

        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }

        return curTransform || 0;
    };
    $.requestAnimationFrame = function (callback) {
        if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
        else {
            return window.setTimeout(callback, 1000 / 60);
        }
    };
    $.cancelAnimationFrame = function (id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
        else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
        else {
            return window.clearTimeout(id);
        }
    };
    $.fn.transitionEnd = function(callback) {
        var events = ['webkitTransitionEnd', 'transitionend'],
            i, dom = this;

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };
    $.fn.dataset = function() {
        var el = this[0];
        if (el) {
            var dataset = {};
            if (el.dataset) {

                for (var dataKey in el.dataset) { // jshint ignore:line
                    dataset[dataKey] = el.dataset[dataKey];
                }
            } else {
                for (var i = 0; i < el.attributes.length; i++) {
                    var attr = el.attributes[i];
                    if (/^data-/.test(attr.name)) {
                        dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
                    }
                }
            }
            for (var key in dataset) {
                if (dataset[key] === 'false') dataset[key] = false;
                else if (dataset[key] === 'true') dataset[key] = true;
                else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
            }
            return dataset;
        } else return undefined;
    };
    $.fn.data = function(key, value) {
        if (typeof key === 'undefined') {
            return $(this).dataset();
        }
        if (typeof value === 'undefined') {
            // Get value
            if (this[0] && this[0].getAttribute) {
                var dataKey = this[0].getAttribute('data-' + key);

                if (dataKey) {
                    return dataKey;
                } else if (this[0].smElementDataStorage && (key in this[0].smElementDataStorage)) {


                    return this[0].smElementDataStorage[key];

                } else {
                    return undefined;
                }
            } else return undefined;

        } else {
            // Set value
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                if (!el.smElementDataStorage) el.smElementDataStorage = {};
                el.smElementDataStorage[key] = value;
            }
            return this;
        }
    };
    $.fn.animationEnd = function(callback) {
        var events = ['webkitAnimationEnd', 'animationend'],
            i, dom = this;

        function fireCallBack(e) {
            callback(e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };
    $.fn.transition = function(duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };
    $.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
    };
    $.fn.prevAll = function (selector) {
        var prevEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.previousElementSibling) {
            var prev = el.previousElementSibling;
            if (selector) {
                if($(prev).is(selector)) prevEls.push(prev);
            }
            else prevEls.push(prev);
            el = prev;
        }
        return $(prevEls);
    };
    $.fn.nextAll = function (selector) {
        var nextEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.nextElementSibling) {
            var next = el.nextElementSibling;
            if (selector) {
                if($(next).is(selector)) nextEls.push(next);
            }
            else nextEls.push(next);
            el = next;
        }
        return $(nextEls);
    };

    //重置zepto的show方法，防止有些人引用的版本中 show 方法操作 opacity 属性影响动画执行
    $.fn.show = function(){
        var elementDisplay = {};
        function defaultDisplay(nodeName) {
            var element, display;
            if (!elementDisplay[nodeName]) {
                element = document.createElement(nodeName);
                document.body.appendChild(element);
                display = getComputedStyle(element, '').getPropertyValue("display");
                element.parentNode.removeChild(element);
                display === "none" && (display = "block");
                elementDisplay[nodeName] = display;
            }
            return elementDisplay[nodeName];
        }

        return this.each(function(){
            this.style.display === "none" && (this.style.display = '');
            if (getComputedStyle(this, '').getPropertyValue("display") === "none");
            this.style.display = defaultDisplay(this.nodeName);
        });
    };
})(Zepto);
/**********************/
"use strict";
var device = {};
var ua = navigator.userAgent;
var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;
// Android
if (android) {
    device.os = 'android';
    device.osVersion = android[2];
    device.android = true;
    device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
}
if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
}
// iOS
if (iphone && !ipod) {
    device.osVersion = iphone[2].replace(/_/g, '.');
    device.iphone = true;
}
if (ipad) {
    device.osVersion = ipad[2].replace(/_/g, '.');
    device.ipad = true;
}
if (ipod) {
    device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    device.iphone = true;
}
// iOS 8+ changed UA
if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
    if (device.osVersion.split('.')[0] === '10') {
        device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
    }
}
// Webview
device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);
// Minimal UI
if (device.os && device.os === 'ios') {
    var osVersionArr = device.osVersion.split('.');
    device.minimalUi = !device.webView &&
        (ipod || iphone) &&
        (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
        $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
}
// Check for status bar and fullscreen app mode
var windowWidth = $(window).width();
var windowHeight = $(window).height();
device.statusBar = false;
if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
    device.statusBar = true;
}
else {
    device.statusBar = false;
}
// Classes
var classNames = [];
// Pixel Ratio
device.pixelRatio = window.devicePixelRatio || 1;
classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
if (device.pixelRatio >= 2) {
    classNames.push('retina');
}
// OS classes
if (device.os) {
    classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
    if (device.os === 'ios') {
        var major = parseInt(device.osVersion.split('.')[0], 10);
        for (var i = major - 1; i >= 6; i--) {
            classNames.push('ios-gt-' + i);
        }
    }

}
// Status bar classes
if (device.statusBar) {
    classNames.push('with-statusbar-overlay');
}
else {
    $('html').removeClass('with-statusbar-overlay');
}
// Add html classes
if (classNames.length > 0) $('html').addClass(classNames.join(' '));
// keng..
device.isWeixin = /MicroMessenger/i.test(ua);
$.device = device;
/**********************/
"use strict";
var _modalTemplateTempDiv = document.createElement('div');
$.modalStack = [];
$.modalStackClearQueue = function () {
    if ($.modalStack.length) {
        ($.modalStack.shift())();
    }
};
$.modal = function (params) {
    params = params || {};
    var modalHTML = '';
    var buttonsHTML = '';
    if (params.buttons && params.buttons.length > 0) {
        for (var i = 0; i < params.buttons.length; i++) {
            buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
        }
    }
    var extraClass = params.extraClass || '';
    var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
    var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
    var afterTextHTML = params.afterText ? params.afterText : '';
    var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
    var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
    modalHTML = '<div class="modal ' + extraClass + ' ' + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';

    _modalTemplateTempDiv.innerHTML = modalHTML;

    var modal = $(_modalTemplateTempDiv).children();

    $(defaults.modalContainer).append(modal[0]);

    // Add events on buttons
    modal.find('.modal-button').each(function (index, el) {
        $(el).on('click', function (e) {
            if (params.buttons[index].close !== false) $.closeModal(modal);
            if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
            if (params.onClick) params.onClick(modal, index);
        });
    });
    $.openModal(modal);
    return modal[0];
};
$.alert = function (text, title, callbackOk) {
    if (typeof title === 'function') {
        callbackOk = arguments[1];
        title = undefined;
    }
    return $.modal({
        text: text || '',
        title: typeof title === 'undefined' ? defaults.modalTitle : title,
        buttons: [ {text: defaults.modalButtonOk, bold: true, onClick: callbackOk} ]
    });
};
$.confirm = function (text, title, callbackOk, callbackCancel) {
    if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
    }
    return $.modal({
        text: text || '',
        extraClass: 'modal-confirm',
        title: typeof title === 'undefined' ? defaults.modalTitle : title,
        buttons: [
            {text: defaults.modalButtonCancel, onClick: callbackCancel},
            {text: defaults.modalButtonOk, bold: true, onClick: callbackOk}
        ]
    });
};
$.prompt = function (text, title, callbackOk, callbackCancel) {
    if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
    }
    return $.modal({
        text: text || '',
        title: typeof title === 'undefined' ? defaults.modalTitle : title,
        afterText: '<input type="text" class="modal-text-input">',
        buttons: [
            {
                text: defaults.modalButtonCancel
            },
            {
                text: defaults.modalButtonOk,
                bold: true
            }
        ],
        onClick: function (modal, index) {
            if (index === 0 && callbackCancel) callbackCancel($(modal).find('.modal-text-input').val());
            if (index === 1 && callbackOk) callbackOk($(modal).find('.modal-text-input').val());
        }
    });
};
$.modalLogin = function (text, title, callbackOk, callbackCancel) {
    if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
    }
    return $.modal({
        text: text || '',
        title: typeof title === 'undefined' ? defaults.modalTitle : title,
        afterText: '<input type="text" name="modal-username" placeholder="' + defaults.modalUsernamePlaceholder + '" class="modal-text-input modal-text-input-double"><input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input modal-text-input-double">',
        buttons: [
            {
                text: defaults.modalButtonCancel
            },
            {
                text: defaults.modalButtonOk,
                bold: true
            }
        ],
        onClick: function (modal, index) {
            var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
            var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
            if (index === 0 && callbackCancel) callbackCancel(username, password);
            if (index === 1 && callbackOk) callbackOk(username, password);
        }
    });
};
$.modalPassword = function (text, title, callbackOk, callbackCancel) {
    if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
    }
    return $.modal({
        text: text || '',
        title: typeof title === 'undefined' ? defaults.modalTitle : title,
        afterText: '<input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input">',
        buttons: [
            {
                text: defaults.modalButtonCancel
            },
            {
                text: defaults.modalButtonOk,
                bold: true
            }
        ],
        onClick: function (modal, index) {
            var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
            if (index === 0 && callbackCancel) callbackCancel(password);
            if (index === 1 && callbackOk) callbackOk(password);
        }
    });
};
$.showPreloader = function (title) {
    $.hidePreloader();
    $.showPreloader.preloaderModal = $.modal({
        title: title || defaults.modalPreloaderTitle,
        extraClass: 'modal-preloader',
        text: '<div class="preloader"></div>'
    });

    return $.showPreloader.preloaderModal;
};
$.hidePreloader = function () {
    $.closeModal($.showPreloader.preloaderModal);
};
$.showIndicator = function () {
    if ($('.preloader-indicator-modal')[0]) return;
    $(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
};
$.hideIndicator = function () {
    $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
};
// Action Sheet
$.actions = function (params) {
    var modal, groupSelector, buttonSelector;
    params = params || [];

    if (params.length > 0 && !$.isArray(params[0])) {
        params = [params];
    }
    var modalHTML;
    var buttonsHTML = '';
    for (var i = 0; i < params.length; i++) {
        for (var j = 0; j < params[i].length; j++) {
            if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
            var button = params[i][j];
            var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
            if (button.bold) buttonClass += ' actions-modal-button-bold';
            if (button.color) buttonClass += ' color-' + button.color;
            if (button.bg) buttonClass += ' bg-' + button.bg;
            if (button.disabled) buttonClass += ' disabled';
            buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
            if (j === params[i].length - 1) buttonsHTML += '</div>';
        }
    }
    modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
    _modalTemplateTempDiv.innerHTML = modalHTML;
    modal = $(_modalTemplateTempDiv).children();
    $(defaults.modalContainer).append(modal[0]);
    groupSelector = '.actions-modal-group';
    buttonSelector = '.actions-modal-button';

    var groups = modal.find(groupSelector);
    groups.each(function (index, el) {
        var groupIndex = index;
        $(el).children().each(function (index, el) {
            var buttonIndex = index;
            var buttonParams = params[groupIndex][buttonIndex];
            var clickTarget;
            if ($(el).is(buttonSelector)) clickTarget = $(el);
            // if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

            if (clickTarget) {
                clickTarget.on('click', function (e) {
                    if (buttonParams.close !== false) $.closeModal(modal);
                    if (buttonParams.onClick) buttonParams.onClick(modal, e);
                });
            }
        });
    });
    $.openModal(modal);
    return modal[0];
};
$.popup = function (modal, removeOnClose) {
    if (typeof removeOnClose === 'undefined') removeOnClose = true;
    if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
        var _modal = document.createElement('div');
        _modal.innerHTML = modal.trim();
        if (_modal.childNodes.length > 0) {
            modal = _modal.childNodes[0];
            if (removeOnClose) modal.classList.add('remove-on-close');
            $(defaults.modalContainer).append(modal);
        }
        else return false; //nothing found
    }
    modal = $(modal);
    if (modal.length === 0) return false;
    modal.show();
    modal.find(".content").scroller("refresh");
    if (modal.find('.' + defaults.viewClass).length > 0) {
        $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
    }
    $.openModal(modal);

    return modal[0];
};
$.pickerModal = function (pickerModal, removeOnClose) {
    if (typeof removeOnClose === 'undefined') removeOnClose = true;
    if (typeof pickerModal === 'string' && pickerModal.indexOf('<') >= 0) {
        pickerModal = $(pickerModal);
        if (pickerModal.length > 0) {
            if (removeOnClose) pickerModal.addClass('remove-on-close');
            $(defaults.modalContainer).append(pickerModal[0]);
        }
        else return false; //nothing found
    }
    pickerModal = $(pickerModal);
    if (pickerModal.length === 0) return false;
    pickerModal.show();
    $.openModal(pickerModal);
    return pickerModal[0];
};
$.loginScreen = function (modal) {
    if (!modal) modal = '.login-screen';
    modal = $(modal);
    if (modal.length === 0) return false;
    modal.show();
    if (modal.find('.' + defaults.viewClass).length > 0) {
        $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
    }
    $.openModal(modal);
    return modal[0];
};
//显示一个消息，会在2秒钟后自动消失
$.toast = function(msg, duration, extraclass) {
    var $toast = $('<div class="modal toast ' + (extraclass || '') + '">' + msg + '</div>').appendTo(document.body);
    $.openModal($toast, function(){
        setTimeout(function() {
            $.closeModal($toast);
        }, duration || 2000);
    });
};
$.openModal = function (modal, cb) {
    modal = $(modal);
    var isModal = modal.hasClass('modal'),
        isNotToast = !modal.hasClass('toast');
    if ($('.modal.modal-in:not(.modal-out)').length && defaults.modalStack && isModal && isNotToast) {
        $.modalStack.push(function () {
            $.openModal(modal, cb);
        });
        return;
    }
    var isPopup = modal.hasClass('popup');
    var isLoginScreen = modal.hasClass('login-screen');
    var isPickerModal = modal.hasClass('picker-modal');
    var isToast = modal.hasClass('toast');
    if (isModal) {
        modal.show();
        modal.css({
            marginTop: - Math.round(modal.outerHeight() / 2) + 'px'
        });
    }
    if (isToast) {
        modal.css({
            marginLeft: - Math.round(modal.outerWidth() / 2 / 1.185) + 'px' //1.185 是初始化时候的放大效果
        });
    }

    var overlay;
    //if (!isLoginScreen && !isPickerModal && !isToast) {
    if (!isLoginScreen && !isToast) {
        if ($('.modal-overlay').length === 0 && !isPopup) {
            $(defaults.modalContainer).append('<div class="modal-overlay"></div>');
        }
        if ($('.popup-overlay').length === 0 && isPopup) {
            $(defaults.modalContainer).append('<div class="popup-overlay"></div>');
        }
        overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
    }

    //Make sure that styles are applied, trigger relayout;
    var clientLeft = modal[0].clientLeft;

    // Trugger open event
    modal.trigger('open');

    // Picker modal body class
    if (isPickerModal) {
        $(defaults.modalContainer).addClass('with-picker-modal');
    }

    // Classes for transition in
    if (!isLoginScreen && !isToast) overlay.addClass('modal-overlay-visible');
    modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
        if (modal.hasClass('modal-out')) modal.trigger('closed');
        else modal.trigger('opened');
    });
    // excute callback
    if (typeof cb === 'function') {
        cb.call(this);
    }
    return true;
};
$.closeModal = function (modal) {
    modal = $(modal || '.modal-in');
    if (typeof modal !== 'undefined' && modal.length === 0) {
        return;
    }
    var isModal = modal.hasClass('modal'),
        isPopup = modal.hasClass('popup'),
        isToast = modal.hasClass('toast'),
        isLoginScreen = modal.hasClass('login-screen'),
        isPickerModal = modal.hasClass('picker-modal'),
        removeOnClose = modal.hasClass('remove-on-close'),
        overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
    if (isPopup){
        if (modal.length === $('.popup.modal-in').length) {
            overlay.removeClass('modal-overlay-visible');
        }
    }
    else if (!isToast) {
        overlay.removeClass('modal-overlay-visible');
    }

    modal.trigger('close');

    // Picker modal body class
    if (isPickerModal) {
        $(defaults.modalContainer).removeClass('with-picker-modal');
        $(defaults.modalContainer).addClass('picker-modal-closing');
    }
    modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
        if (modal.hasClass('modal-out')) modal.trigger('closed');
        else modal.trigger('opened');

        if (isPickerModal) {
            $(defaults.modalContainer).removeClass('picker-modal-closing');
        }
        if (isPopup || isLoginScreen || isPickerModal) {
            modal.removeClass('modal-out').hide();
            if (removeOnClose && modal.length > 0) {
                modal.remove();
            }
        }
        else {
            modal.remove();
        }
    });
    if (isModal &&  defaults.modalStack ) {
        $.modalStackClearQueue();
    }

    return true;
};
function handleClicks(e) {
    /*jshint validthis:true */
    var clicked = $(this);
    var url = clicked.attr('href');


    //Collect Clicked data- attributes
    var clickedData = clicked.dataset();

    // Popup
    var popup;
    if (clicked.hasClass('open-popup')) {
        if (clickedData.popup) {
            popup = clickedData.popup;
        }
        else popup = '.popup';
        $.popup(popup);
    }
    if (clicked.hasClass('close-popup')) {
        if (clickedData.popup) {
            popup = clickedData.popup;
        }
        else popup = '.popup.modal-in';
        $.closeModal(popup);
    }

    // Close Modal
    if (clicked.hasClass('modal-overlay')) {
        if ($('.modal.modal-in').length > 0 && defaults.modalCloseByOutside)
            $.closeModal('.modal.modal-in');
        if ($('.actions-modal.modal-in').length > 0 && defaults.actionsCloseByOutside)
            $.closeModal('.actions-modal.modal-in');

    }
    if (clicked.hasClass('popup-overlay')) {
        if ($('.popup.modal-in').length > 0 && defaults.popupCloseByOutside)
            $.closeModal('.popup.modal-in');
    }




}
$(document).on('click', ' .modal-overlay, .popup-overlay, .close-popup, .open-popup, .close-picker', handleClicks);
var defaults =  $.modal.prototype.defaults  = {
    modalStack: true,
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    modalPreloaderTitle: '加载中',
    modalContainer : document.body
};
/**********************/
"use strict";
var Picker = function (params) {
    var p = this;
    var defaults = {
        updateValuesOnMomentum: false,
        updateValuesOnTouchmove: true,
        rotateEffect: false,
        momentumRatio: 7,
        freeMode: false,
        // Common settings
        scrollToInput: true,
        inputReadOnly: true,
        toolbar: true,
        toolbarCloseText: '确定',
        toolbarTemplate: '<header class="options">\
                <a href="javascript:void(0);" class="left-button close-picker J_cancel">取消</a>\
                <a href="javascript:void(0);" class="right-button J_submit">确定</a>\
                <h1 class="title">请选择</h1>\
                </header>',
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }
    p.params = params;
    p.cols = [];
    p.initialized = false;

    // Inline flag
    p.inline = p.params.container ? true : false;

    // 3D Transforms origin bug, only on safari
    var originBug = $.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !$.device.android;

    // Value
    p.setValue = function (arrValues, transition) {
        var valueIndex = 0;
        for (var i = 0; i < p.cols.length; i++) {
            if (p.cols[i] && !p.cols[i].divider) {
                p.cols[i].setValue(arrValues[valueIndex], transition);
                valueIndex++;
            }
        }
    };
    p.updateValue = function (force) {
        var newValue = [];
        var newDisplayValue = [];
        for (var i = 0; i < p.cols.length; i++) {
            if (!p.cols[i].divider) {
                newValue.push(p.cols[i].value);
                newDisplayValue.push(p.cols[i].displayValue);
            }
        }
        if (newValue.indexOf(undefined) >= 0) {
            return;
        }
        p.value = newValue;
        p.displayValue = newDisplayValue;
        //if (p.params.onChange && (p.params.updateValuesOnMomentum || p.params.updateValuesOnTouchmove)) {
        if (p.params.onChange) {
            p.params.onChange(p, p.value, p.displayValue);
        }
        if (p.input && p.input.length > 0 && force) {
            //if(p.params.updateValuesOnMomentum || p.params.updateValuesOnTouchmove){
            $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
            //}
            $(p.input).trigger('change');
        }
    };
    // Columns Handlers
    p.initPickerCol = function (colElement, updateItems) {
        var colContainer = $(colElement);
        var colIndex = colContainer.index();
        var col = p.cols[colIndex];
        if (col.divider) return;
        col.container = colContainer;
        col.wrapper = col.container.find('.picker-items-col-wrapper');
        col.items = col.wrapper.find('.picker-item');

        var i, j;
        var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
        col.replaceValues = function (values, displayValues) {
            col.destroyEvents();
            col.values = values;
            col.displayValues = displayValues;
            var newItemsHTML = p.columnHTML(col, true);
            col.wrapper.html(newItemsHTML);
            col.items = col.wrapper.find('.picker-item');
            col.calcSize();
            col.setValue(col.values[0], 0, true);
            col.initEvents();
        };
        col.calcSize = function () {
            if (p.params.rotateEffect) {
                col.container.removeClass('picker-items-col-absolute');
                if (!col.width) col.container.css({width:''});
            }
            var colWidth, colHeight;
            colWidth = 0;
            colHeight = col.container[0].offsetHeight;
            wrapperHeight = col.wrapper[0].offsetHeight;
            itemHeight = col.items[0].offsetHeight;
            itemsHeight = itemHeight * col.items.length;
            minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
            maxTranslate = colHeight / 2 - itemHeight / 2;
            if (col.width) {
                colWidth = col.width;
                if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                col.container.css({width: colWidth});
            }
            if (p.params.rotateEffect) {
                if (!col.width) {
                    col.items.each(function () {
                        var item = $(this);
                        item.css({width:'auto'});
                        colWidth = Math.max(colWidth, item[0].offsetWidth);
                        item.css({width:''});
                    });
                    col.container.css({width: (colWidth + 2) + 'px'});
                }
                col.container.addClass('picker-items-col-absolute');
            }
        };
        col.calcSize();

        col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


        var activeIndex = 0;
        var animationFrameId;

        // Set Value Function
        col.setValue = function (newValue, transition, valueCallbacks) {
            if (typeof transition === 'undefined') transition = '';
            var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
            if(typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                return;
            }
            var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
            // Update wrapper
            col.wrapper.transition(transition);
            col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');

            // Watch items
            if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex ) {
                $.cancelAnimationFrame(animationFrameId);
                col.wrapper.transitionEnd(function(){
                    $.cancelAnimationFrame(animationFrameId);
                });
                updateDuringScroll();
            }

            // Update items
            col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
        };

        col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
            if (typeof translate === 'undefined') {
                translate = $.getTranslate(col.wrapper[0], 'y');
            }
            if(typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate)/itemHeight);
            if (activeIndex < 0) activeIndex = 0;
            if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
            var previousActiveIndex = col.activeIndex;
            col.activeIndex = activeIndex;
            /*
             col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');
             col.items.transition(transition);
             var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
             var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
             var nextItems = selectedItem.nextAll().addClass('picker-after-selected');
             */
            //去掉 .picker-after-selected, .picker-before-selected 以提高性能
            col.wrapper.find('.picker-selected').removeClass('picker-selected');
            if (p.params.rotateEffect) {
                col.items.transition(transition);
            }
            var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

            if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                // Update values
                col.value = selectedItem.attr('data-picker-value');
                col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                // On change callback
                if (previousActiveIndex !== activeIndex) {
                    if (col.onChange) {
                        col.onChange(p, col.value, col.displayValue);
                    }
                    p.updateValue();
                }
            }

            // Set 3D rotate effect
            if (!p.params.rotateEffect) {
                return;
            }
            var percentage = (translate - (Math.floor((translate - maxTranslate)/itemHeight) * itemHeight + maxTranslate)) / itemHeight;

            col.items.each(function () {
                var item = $(this);
                var itemOffsetTop = item.index() * itemHeight;
                var translateOffset = maxTranslate - translate;
                var itemOffset = itemOffsetTop - translateOffset;
                var percentage = itemOffset / itemHeight;

                var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                var angle = (-18*percentage);
                if (angle > 180) angle = 180;
                if (angle < -180) angle = -180;
                // Far class
                if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
                else item.removeClass('picker-item-far');
                // Set transform
                item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
            });
        };

        function updateDuringScroll() {
            animationFrameId = $.requestAnimationFrame(function () {
                col.updateItems(undefined, undefined, 0);
                updateDuringScroll();
            });
        }

        // Update items on init
        if (updateItems) col.updateItems(0, maxTranslate, 0);

        var allowItemClick = true;
        var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
        function handleTouchStart (e) {
            if (isMoved || isTouched) return;
            e.preventDefault();
            isTouched = true;
            touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = (new Date()).getTime();

            allowItemClick = true;
            startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
        }
        function handleTouchMove (e) {
            if (!isTouched) return;
            e.preventDefault();
            allowItemClick = false;
            touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (!isMoved) {
                // First move
                $.cancelAnimationFrame(animationFrameId);
                isMoved = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                col.wrapper.transition(0);
            }
            e.preventDefault();

            var diff = touchCurrentY - touchStartY;
            currentTranslate = startTranslate + diff;
            returnTo = undefined;

            // Normalize translate
            if (currentTranslate < minTranslate) {
                currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                returnTo = 'min';
            }
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                returnTo = 'max';
            }
            // Transform wrapper
            col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

            // Update items
            col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

            // Calc velocity
            velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
            velocityTime = (new Date()).getTime();
            prevTranslate = currentTranslate;
        }
        function handleTouchEnd (e) {
            if (!isTouched || !isMoved) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;
            col.wrapper.transition('');
            if (returnTo) {
                if (returnTo === 'min') {
                    col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                }
                else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
            }
            touchEndTime = new Date().getTime();
            var velocity, newTranslate;
            if (touchEndTime - touchStartTime > 300) {
                newTranslate = currentTranslate;
            }
            else {
                velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
            }

            newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

            // Active Index
            var activeIndex = -Math.floor((newTranslate - maxTranslate)/itemHeight);

            // Normalize translate
            if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

            // Transform wrapper
            col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate,10)) + 'px,0)');

            // Update items
            col.updateItems(activeIndex, newTranslate, '', true);

            // Watch items
            if (p.params.updateValuesOnMomentum) {
                updateDuringScroll();
                col.wrapper.transitionEnd(function(){
                    $.cancelAnimationFrame(animationFrameId);
                });
            }

            // Allow click
            setTimeout(function () {
                allowItemClick = true;
            }, 100);
        }

        function handleClick(e) {
            if (!allowItemClick) return;
            $.cancelAnimationFrame(animationFrameId);
            /*jshint validthis:true */
            var value = $(this).attr('data-picker-value');
            col.setValue(value);
        }

        col.initEvents = function (detach) {
            var method = detach ? 'off' : 'on';
            col.container[method]($.touchEvents.start, handleTouchStart);
            col.container[method]($.touchEvents.move, handleTouchMove);
            col.container[method]($.touchEvents.end, handleTouchEnd);
            col.items[method]('click', handleClick);
        };
        col.destroyEvents = function () {
            col.initEvents(true);
        };

        col.container[0].f7DestroyPickerCol = function () {
            col.destroyEvents();
        };

        col.initEvents();

    };
    p.destroyPickerCol = function (colContainer) {
        colContainer = $(colContainer);
        if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
    };
    // Resize cols
    function resizeCols() {
        if (!p.opened) return;
        for (var i = 0; i < p.cols.length; i++) {
            if (!p.cols[i].divider) {
                p.cols[i].calcSize();
                p.cols[i].setValue(p.cols[i].value, 0, false);
            }
        }
    }
    $(window).on('resize', resizeCols);

    // HTML Layout
    p.columnHTML = function (col, onlyItems) {
        var columnItemsHTML = '';
        var columnHTML = '';
        if (col.divider) {
            columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
        }
        else {
            for (var j = 0; j < col.values.length; j++) {
                columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
            }

            columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
        }
        return onlyItems ? columnItemsHTML : columnHTML;
    };
    p.layout = function () {
        var pickerHTML = '';
        var pickerClass = '';
        var i;
        p.cols = [];
        var colsHTML = '';
        for (i = 0; i < p.params.cols.length; i++) {
            var col = p.params.cols[i];
            colsHTML += p.columnHTML(p.params.cols[i]);
            p.cols.push(col);
        }
        pickerClass = 'picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
        pickerHTML =
            '<div class="' + (pickerClass) + '">' +
            (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '') +
            '<div class="picker-modal-inner picker-items">' +
            colsHTML +
            '<div class="picker-center-highlight"></div>' +
            '</div>' +
            '</div>';

        p.pickerHTML = pickerHTML;
    };

    // Input Events
    function openOnInput(e) {
        e.preventDefault();
        // 安卓微信webviewreadonly的input依然弹出软键盘问题修复
        if ($.device.isWeixin && $.device.android && p.params.inputReadOnly) {
            /*jshint validthis:true */
            this.focus();
            this.blur();
        }
        if (p.opened) return;
        p.open();

        //events
        p.container.on("click",".J_submit",function(){
            p.updateValue(true);
            p.close();
        });

        if (p.params.scrollToInput) {
            var pageContent = p.input.parents('.content');
            if (pageContent.length === 0) return;

            var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                newPaddingBottom;
            var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
            if (inputTop > pageHeight) {
                var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                if (scrollTop + pageHeight > pageScrollHeight) {
                    newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                    if (pageHeight === pageScrollHeight) {
                        newPaddingBottom = p.container.height();
                    }
                    pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                }
                pageContent.scrollTop(scrollTop, 300);
            }
        }

    }
    function closeOnHTMLClick(e) {
        if (p.input && p.input.length > 0) {
            if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
        }
        else {
            if ($(e.target).parents('.picker-modal').length === 0) p.close();
        }
    }

    if (p.params.input) {
        p.input = $(p.params.input);
        if (p.input.length > 0) {
            if (p.params.inputReadOnly) p.input.prop('readOnly', true);
            if (!p.inline) {
                p.input.on('click', openOnInput);
            }
        }
    }

    if (!p.inline) $('html').on('click', closeOnHTMLClick);

    // Open
    function onPickerClose() {
        p.opened = false;
        if (p.input && p.input.length > 0) p.input.parents('.content').css({'padding-bottom': ''});
        if (p.params.onClose) p.params.onClose(p);

        // Destroy events
        p.container.find('.picker-items-col').each(function () {
            p.destroyPickerCol(this);
        });
    }

    p.opened = false;
    p.open = function () {
        if (!p.opened) {

            // Layout
            p.layout();

            // Append
            if (p.inline) {
                p.container = $(p.pickerHTML);
                p.container.addClass('picker-modal-inline');
                $(p.params.container).append(p.container);
            }
            else {
                p.container = $($.pickerModal(p.pickerHTML));
                $(p.container)
                    .on('close', function () {
                        onPickerClose();
                    });
            }

            // Store picker instance
            p.container[0].f7Picker = p;

            // Init Events
            p.container.find('.picker-items-col').each(function () {
                var updateItems = true;
                if ((!p.initialized && p.params.value) || (p.initialized && p.value)) updateItems = false;
                p.initPickerCol(this, updateItems);
            });

            // Set value
            if (!p.initialized) {
                if (p.params.value) {
                    p.setValue(p.params.value, 0);
                }
            }
            else {
                if (p.value) p.setValue(p.value, 0);
            }
        }

        // Set flag
        p.opened = true;
        p.initialized = true;

        if (p.params.onOpen) p.params.onOpen(p);
    };

    // Close
    p.close = function () {
        if (!p.opened || p.inline) return;
        $.closeModal(p.container);
        return;
    };

    // Destroy
    p.destroy = function () {
        p.close();
        if (p.params.input && p.input.length > 0) {
            p.input.off('click', openOnInput);
        }
        $('html').off('click', closeOnHTMLClick);
        $(window).off('resize', resizeCols);
    };

    if (p.inline) {
        p.open();
    }

    return p;
};
$(document).on("click", ".close-picker", function() {
    var pickerToClose = $('.picker-modal.modal-in');
    $.closeModal(pickerToClose);
});

$(document).on('touchmove', ".picker-modal, .modal-overlay", function(e) {
    e.preventDefault();
});
$.fn.picker = function(params) {
    var args = arguments;
    return this.each(function() {
        if(!this) return;
        var $this = $(this);

        var picker = $this.data("picker");
        if(!picker) {
            var p = $.extend({
                input: this,
                value: $this.val() ? $this.val().split(' ') : ''
            }, params);
            picker = new Picker(p);
            $this.data("picker", picker);
        }
        if(typeof params === typeof "a") {
            picker[params].apply(picker, Array.prototype.slice.call(args, 1));
        }
    });
};
