(function (_module) {
    if (typeof (define) != "undefined" && define.amd) {
        define(['base/0.1.0/module'], function (Module) {
            return _module(Module);
        });
    }
    else if (typeof (define) != "undefined" && define.cmd) {
        define("uplodify/0.1.0/h5upload", ['base/0.1.0/module'], function (require, exports, module) {
            var Module = require('base/0.1.0/module');
            return _module(Module);
        });
    }
    else {
        window.modules = window.modules || {};
        window.modules.Uploader = _module();
    }
})(function (Module) {
    var iframeCount = 0;
    /*
    * Demo
    * 
    */
    var Uplodify = Module.extend({
        initialize: function (options) {
            //init super
            Uplodify.superclass.initialize.apply(this, arguments);
            //init             
            Uplodify.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            var op = $.extend({}, self.attr);
            op.max_file_size = self.__sizeFormat(self.attr.maxSize);
            //op.accept = self.__typeFormat(self.attr.filter);

            self.uploader = new Uploader(op);
            self.uploader.success(function (response) {
                self.trigger("success", response);
            });
            self.uploader.error(function (file) {
                self.trigger("error", file);
            });


            $(self.uploader.form).on('click', '[type=file]', function (e) {
                if (self.attr.beforeClick) {
                    return self.attr.beforeClick($(this).attr('data-key'));
                }
                return true;
            });
            //uploader.change(function (file) {
            //    self.trigger("change", file);
            //});
        },
        ATTRS: {
            trigger: null,
            name: null,
            action: null,
            maxSize: "2mb",
            accept: null,
            data: null,
            filter: null,//支持文件格式 "image/gif,image.jpg" 
            multiple: true, //多文件上传   
            alert: function (message) {
                alert(message);
            },
            beforeUpload: function () {
                return true;
            },
            beforeClick: function (key) {
                return true;
            }
        },
        METHODS: {

        },
        __sizeFormat: function (str) {
            if (/kb/i.test(str)) {
                return str.replace(/kb/i, '') * 1024;
            }
            else if (/mb/i.test(str)) {
                return str.replace(/mb/i, '') * 1024 * 1024;
            }
            else if (/gb/i.test(str)) {
                return str.replace(/gb/i, '') * 1024 * 1024;
            }
            else if (/tb/i.test(str)) {
                return str.replace(/tb/i, '') * 1024 * 1024;
            }
            else {
                return str;
            }
        },
        __typeFormat: function (str) {
            if (!str) {
                return;
            }
            var strs = str.split(/\s|,/);
            var nstrs = new Array();
            for (var i = 0; i < strs.length; i++) {
                var nstr = ""
                switch (strs[i]) {
                    case "jpg":
                        nstr = 'image/jpeg';
                        break;
                    case "jpeg":
                        nstr = 'image/jpeg';
                        break;
                    case "gif":
                        nstr = 'image/gif';
                        break;
                    case "png":
                        nstr = 'image/png';
                        break;
                    case "png":
                        nstr = 'image/png';
                        break;
                    case "doc":
                        nstr = 'application/msword';
                        break;
                    case "docx":
                        nstr = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                        break;
                    case "xls":
                        nstr = 'application/vnd.ms-excel';
                        break;
                    case "xlxs":
                        nstr = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        break;
                    default:
                        nstr = strs[i];
                        break;
                }
                nstrs.push(nstr);
            }
            return nstrs.join(',');
        }

    });

    function Uploader(options) {
        if (!(this instanceof Uploader)) {
            return new Uploader(options);
        }
        if (isString(options)) {
            options = { trigger: options };
        }

        var settings = {
            trigger: null,
            name: null,
            action: null,
            data: null,
            accept: null,
            change: null,
            error: null,
            multiple: true,
            success: null
        };
        if (options) {
            $.extend(settings, options);
        }
        var $trigger = $(settings.trigger);

        settings.action = settings.action || $trigger.data('action') || '/upload';
        settings.name = settings.name || $trigger.attr('name') || $trigger.data('name') || 'file';
        settings.data = settings.data || parse($trigger.data('data'));
        settings.accept = settings.accept || $trigger.data('accept');
        settings.success = settings.success || $trigger.data('success');
        this.settings = settings;

        this.setup();
        this.bind();
    }

    // initialize
    // create input, form, iframe
    Uploader.prototype.setup = function () {
        this.form = $(
          '<form method="post" enctype="multipart/form-data"'
          + 'target="" action="' + this.settings.action + '" />'
        );

        this.iframe = newIframe();
        this.form.attr('target', this.iframe.attr('name'));

        var data = this.settings.data;
        this.form.append(createInputs(data));
        if (window.FormData) {
            this.form.append(createInputs({ '_uploader_': 'formdata' }));
        } else {
            this.form.append(createInputs({ '_uploader_': 'iframe' }));
        }

        var input = document.createElement('input');
        input.type = 'file';
        input.name = this.settings.name;

        if (this.settings.accept) {
            input.accept = this.settings.accept;
        }
        if (this.settings.multiple) {
            input.multiple = true;
            input.setAttribute('multiple', 'multiple');
        }
        this.input = $(input);

        var $trigger = $(this.settings.trigger);
        this.input.attr('hidefocus', true).css({
            position: 'absolute',
            top: 0,
            right: 0,
            opacity: 0,
            outline: 0,
            cursor: 'pointer',
            height: $trigger.outerHeight(),
            fontSize: Math.max(64, $trigger.outerHeight() * 5)
        });

        input.setAttribute("data-key", $trigger.attr("data-key"));
        this.form.append(this.input);
        this.form.css({
            position: 'absolute',
            top: $trigger.offset().top,
            left: $trigger.offset().left,
            overflow: 'hidden',
            width: $trigger.outerWidth(),
            height: $trigger.outerHeight(),
            zIndex: findzIndex($trigger) + 10
        }).appendTo('body');
        return this;
    };

    // bind events
    Uploader.prototype.bind = function () {
        var self = this;
        var $trigger = $(self.settings.trigger);
        $trigger.mouseenter(function () {
            self.form.css({
                top: $trigger.offset().top,
                left: $trigger.offset().left,
                width: $trigger.outerWidth(),
                height: $trigger.outerHeight()
            });
        });
        self.bindInput();
    };

    Uploader.prototype.bindInput = function () {
        var self = this;
        self.input.change(function (e) {
            if (self.settings.beforeUpload && !self.settings.beforeUpload(this.files)) {
                return;
            }
            // ie9 don't support FileList Object
            // http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
            self._files = this.files || [{
                name: e.target.value
            }];
            if (self.settings.filter) {
                for (var i = 0; i < self._files.length; i++) {
                    var filetype = self._files[i].name.split('.').last(); //self._files[i].type
                    if (self.settings.filter.indexOf(filetype) < 0) {
                        self.settings.alert("上传文件格式只支持" + self.settings.filter);
                        return;
                    }
                }
            }


            if (self.settings.max_file_size) {
                for (var i = 0; i < self._files.length; i++) {
                    if (self._files[i].size > self.settings.max_file_size) {
                        self.settings.alert("文件大小不能超过" + self.settings.maxSize);
                        return;
                    }
                }
            }


            var file = self.input.val();
            if (self.settings.change) {
                self.settings.change.call(self, self._files);
            } else if (file) {
                return self.submit();
            }
        });
    };



    // handle submit event
    // prepare for submiting form
    Uploader.prototype.submit = function () {
        var self = this;
        if (window.FormData && self._files) {
            // build a FormData
            var form = new FormData(self.form.get(0));
            // use FormData to upload
            form.append(self.settings.name, self._files);

            var optionXhr;
            if (self.settings.progress) {
                // fix the progress target file
                var files = self._files;
                optionXhr = function () {
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', function (event) {
                            var percent = 0;
                            var position = event.loaded || event.position; /*event.position is deprecated*/
                            var total = event.total;
                            if (event.lengthComputable) {
                                percent = Math.ceil(position / total * 100);
                            }
                            self.settings.progress(event, position, total, percent, files);
                        }, false);
                    }
                    return xhr;
                };
            }
            $.ajax({
                url: self.settings.action,
                type: 'post',
                processData: false,
                contentType: false,
                data: form,
                xhr: optionXhr,
                context: this,
                success: self.settings.success,
                error: self.settings.error
            });
            return this;
        } else {
            // iframe upload
            self.iframe = newIframe();
            self.form.attr('target', self.iframe.attr('name'));
            $('body').append(self.iframe);
            self.iframe.one('load', function () {
                // https://github.com/blueimp/jQuery-File-Upload/blob/9.5.6/js/jquery.iframe-transport.js#L102
                // Fix for IE endless progress bar activity bug
                // (happens on form submits to iframe targets):
                $('<iframe src="javascript:false;"></iframe>')
                  .appendTo(self.form)
                  .remove();
                var response;
                try {
                    response = $(this).contents().find("body").html();
                } catch (e) {
                    response = "cross-domain";
                }
                $(this).remove();
                if (!response) {
                    if (self.settings.error) {
                        self.settings.error(self.input.val());
                    }
                } else {
                    if (self.settings.success) {
                        self.settings.success(response);
                    }
                }
            });
            self.form.submit();
        }
        return this;
    };

    Uploader.prototype.refreshInput = function () {
        //replace the input element, or the same file can not to be uploaded
        var newInput = this.input.clone();
        this.input.before(newInput);
        this.input.off('change');
        this.input.remove();
        this.input = newInput;
        this.bindInput();
    };

    // handle change event
    // when value in file input changed
    Uploader.prototype.change = function (callback) {
        if (!callback) {
            return this;
        }
        this.settings.change = callback;
        return this;
    };

    // handle when upload success
    Uploader.prototype.success = function (callback) {
        var me = this;
        this.settings.success = function (response) {
            me.refreshInput();
            if (callback) {
                callback(response);
            }
            //me.input.value = "";
        };

        return this;
    };

    // handle when upload success
    Uploader.prototype.error = function (callback) {
        var me = this;
        this.settings.error = function (response) {
            if (callback) {
                me.refreshInput();
                callback(response);
            }
        };
        return this;
    };

    // enable
    Uploader.prototype.enable = function () {
        this.input.prop('disabled', false);
        this.input.css('cursor', 'pointer');
    };

    // disable
    Uploader.prototype.disable = function () {
        this.input.prop('disabled', true);
        this.input.css('cursor', 'not-allowed');
    };

    // Helpers
    // -------------

    function isString(val) {
        return Object.prototype.toString.call(val) === '[object String]';
    }

    function createInputs(data) {
        if (!data) return [];

        var inputs = [], i;
        for (var name in data) {
            i = document.createElement('input');
            i.type = 'hidden';
            i.name = name;
            i.value = data[name];
            inputs.push(i);
        }
        return inputs;
    }

    function parse(str) {
        if (!str) return {};
        var ret = {};

        var pairs = str.split('&');
        var unescape = function (s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        };

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            var key = unescape(pair[0]);
            var val = unescape(pair[1]);
            ret[key] = val;
        }

        return ret;
    }

    function findzIndex($node) {
        var parents = $node.parentsUntil('body');
        var zIndex = 0;
        for (var i = 0; i < parents.length; i++) {
            var item = parents.eq(i);
            if (item.css('position') !== 'static') {
                zIndex = parseInt(item.css('zIndex'), 10) || zIndex;
            }
        }
        return zIndex;
    }

    function newIframe() {
        var iframeName = 'iframe-uploader-' + iframeCount;
        var iframe = $('<iframe name="' + iframeName + '" />').hide();
        iframeCount += 1;
        return iframe;
    }

    function MultipleUploader(options) {
        if (!(this instanceof MultipleUploader)) {
            return new MultipleUploader(options);
        }

        if (isString(options)) {
            options = { trigger: options };
        }
        var $trigger = $(options.trigger);

        var uploaders = [];
        $trigger.each(function (i, item) {
            options.trigger = item;
            uploaders.push(new Uploader(options));
        });
        this._uploaders = uploaders;
    }
    MultipleUploader.prototype.submit = function () {
        $.each(this._uploaders, function (i, item) {
            item.submit();
        });
        return this;
    };
    MultipleUploader.prototype.change = function (callback) {
        $.each(this._uploaders, function (i, item) {
            item.change(callback);
        });
        return this;
    };
    MultipleUploader.prototype.success = function (callback) {
        $.each(this._uploaders, function (i, item) {
            item.success(callback);
        });
        return this;
    };
    MultipleUploader.prototype.error = function (callback) {
        $.each(this._uploaders, function (i, item) {
            item.error(callback);
        });
        return this;
    };
    MultipleUploader.prototype.enable = function () {
        $.each(this._uploaders, function (i, item) {
            item.enable();
        });
        return this;
    };
    MultipleUploader.prototype.disable = function () {
        $.each(this._uploaders, function (i, item) {
            item.disable();
        });
        return this;
    };
    MultipleUploader.Uploader = Uploader;

    //module.exports = MultipleUploader;
    return Uplodify;
});

