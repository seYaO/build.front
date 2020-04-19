/**
 * @author 翟倩倩(zqq10861@ly.com)
 * @module
 * @exports
 * @desc
 */
(function(_module) {
    if (typeof(define) != "undefined" && define.amd) {
        define(['base/0.1.0/module', "css!uplodify/0.3.1/h5upload.css"], function(Module) {
            return _module(Module);
        });
    } else if (typeof(define) != "undefined" && define.cmd) {
        define("uplodify/0.3.1/h5upload", ['base/0.1.0/module', "uplodify/0.3.1/h5upload.css"], function(require, exports, module) {
            var Module = require('base/0.1.0/module');
            return _module(Module);
        });
    } else {
        window.modules = window.modules || {};
        window.modules.Uploader = _module();
    }
})(function(Module) {
    var iframeCount = 0;
    /*
     * Demo
     *
     */
    var Uplodify = Module.extend({
        initialize: function(options) {
            //init super
            Uplodify.superclass.initialize.apply(this, arguments);
            //init
            Uplodify.prototype.init.apply(this, arguments);
        },
        init: function(options) {
            var self = this;

            var op = $.extend({}, self.attr);
            if (!op.trigger) {
                var _id = self.fn.uuid();
                var btn = $('<button type="button" style="display:none;"  id="' + _id + '"></button>');
                $("body").append(btn);
                op.trigger = "#" + _id;
            }

            if (self.attr.showFileList) {
                self.files = [];
                var dom = '<div class="fileList"><ul></ul></div>';
                // $(self.attr.trigger).parent().append(dom);
                self.__fileContainer = $(dom).appendTo($(self.attr.trigger).parent());
                self.__fileContainer.on("click", '.delete-file', function(e) {
                    var $obj = $(e.target).parent();
                    $obj.remove();
                    var key= $obj.attr("key")
                    self.trigger("item.delete",key);
                    self.files.map(function(file,i){
                        if(file.id==key){
                            self.files.removeAt(i);
                        }
                    });
                })
            }
            op.max_file_size = self.__sizeFormat(self.attr.maxSize);
            op.upload = this;
            //op.accept = self.__typeFormat(self.attr.filter);
            var o_trigger = $(op.trigger);
            if (o_trigger.length > 1) { //批量处理
                $.each(o_trigger, function(i, v) {
                    var _opt = $.extend({}, op);
                    _opt.trigger = this;
                    var uploader = new Uploader(_opt);
                    self.__initTrigger(uploader);
                });
            } else {
                self.uploader = new Uploader(op);
                self.__initTrigger(self.uploader);
            }
            this.on("success", function(e, response) {
                if (self.__onceUpload) {
                    self.__onceUpload(response);
                }
            });
            //uploader.change(function (file) {
            //    self.trigger("change", file);
            //});
        },
        ATTRS: {
            trigger: null, //此项可为空,为空时,通过调用open触发选择文件
            name: null,
            action: null,
            maxSize: "2mb",
            accept: null,
            data: null,
            filter: null, //支持文件格式 "image/gif,image.jpg"
            uploadAfter: false, //选择文件后，先不上传，最后触发方法才上传
            multiple: true, //多文件上传
            hideDeleteBtn: false,
            alert: function(message) {
                alert(message);
                //$(this.uploader.form).find("[type=file]").val('');
            },
            beforeUpload: function() {
                return true;
            },
            beforeClick: function(key) {
                return true;
            },
            showFileList: true
        },
        METHODS: {
            open: function(res) {
                var self = this;
                self.uploader.settings.action = self.attr.action;
                $(this.uploader.form).find("[type=file]").click();
                if (res) {
                    self.__onceUpload = function(response) {
                        res(response, self.uploader._files);
                        self.__onceUpload = null;
                    }
                }

            },
            getAllFileInfo: function(obj) {
                var self = this;
                var info = [];
                if(obj){
                    var $obj = $(obj).parent().find(".fileList ul li");
                }else{
                    var $obj = $(self.attr.trigger).parent().find(".fileList ul li");
                }
                for (var i = 0; i < $obj.length; i++) {
                    info.push({
                        key: $obj.eq(i).attr("key"),
                        src: $obj.eq(i).find(".file-name").attr("href"),
                        name: $obj.eq(i).find(".file-name").text()
                    })
                }
                return info;
            },
            showAllFile: function(data,obj) {
                var self = this;
                var list = "";
                data.map(function(item) {
                    self.files.push(item);
                    var type = self.getFileType(item.name);
                    if(self.attr.hideDeleteBtn){
                        list += '<li key="' + item.id + '"><i class="file-icon file-' + type + '"></i><a href="' + item.src + '" class="file-name" ' + (item.src == '#' ? '' : ' target="_blank"') + '>' + item.name + '</a></li>';
                    }else{
                        list += '<li key="' + item.id + '"><i class="file-icon file-' + type + '"></i><a href="' + item.src + '" class="file-name" ' + (item.src == '#' ? '' : ' target="_blank"') + '>' + item.name + '</a><a href="javascript:void(0)" class="delete-file">删除</a></li>';
                    }
                })
                if(obj){
                    $(obj).parent().find(".fileList ul").append(list);
                }else{
                    $(self.attr.trigger).parent().find(".fileList ul").append(list);
                }
            },
            getFileType: function(name) {
                var image = ["jpg", "JPG", "png", "PNG", "gif", "GIF"];
                var word = ["doc", "docx"];
                var excel = ["xls", "xlsx"];
                var ppt = ["ppt", "pptx"];
                var type = name.substring(name.lastIndexOf(".") + 1);
                if ($.inArray(type, image) >= 0) {
                    type = "image";
                } else if ($.inArray(type, word) >= 0) {
                    type = "word";
                } else if ($.inArray(type, excel) >= 0) {
                    type = "excel";
                } else if ($.inArray(type, ppt) >= 0) {
                    type = "ppt";
                } else {
                    type = "other";
                }
                return type;
            },
            uploadFile: function() {
                var self = this;
                if (self.attr.filter) {
                    for (var i = 0; i < self.files.length; i++) {
                        var filetype = self.files[i].name.split('.').last(); //self._files[i].type
                        if (self.attr.filter.indexOf(filetype) < 0) {
                            alert("上传文件格式只支持" + self.attr.filter);
                            this.value = "";
                            return;
                        }
                    }
                }


                if (self.attr.max_file_size) {
                    for (var i = 0; i < self.files.length; i++) {
                        if (self._files[i].size > self.attr.max_file_size) {
                            alert("文件大小不能超过" + self.attr.maxSize);
                            this.value = "";
                            return;
                        }
                    }
                }

                // build a FormData
                var form = new FormData();
                // use FormData to upload
                if (self.files.length) {
                    self.files.map(function(file, i) {
                        form.append(i, file);
                    })
                    //form.append('images',self.files);
                    $.ajax({
                        url: self.attr.action,
                        type: 'post',
                        //dataType: "html",
                        processData: false,
                        contentType: false,
                        data: form,
                        // xhr: optionXhr,
                        context: this,
                        success: self.uploader.settings.success,
                        error: self.uploader.settings.error
                    });
                }
            }
        },
        __initTrigger: function(obj) {
            var self = this;
            obj.success(function(response) {
                self.trigger("success", response, obj._files, obj.__berth);
            });
            obj.error(function(file) {
                self.trigger("error", file, obj.__berth);
            });

            //$(op.trigger).click(function () {
            //    console.log(1);
            //})

            $(obj.form).on('click', '[type=file]', function(e) {
                if (self.attr.beforeClick) {
                    return self.attr.beforeClick($(this).attr('data-key'), obj.__berth, obj);
                }
                return true;
            });
        },
        __sizeFormat: function(str) {
            if (/kb/i.test(str)) {
                return str.replace(/kb/i, '') * 1024;
            } else if (/mb/i.test(str)) {
                return str.replace(/mb/i, '') * 1024 * 1024;
            } else if (/gb/i.test(str)) {
                return str.replace(/gb/i, '') * 1024 * 1024;
            } else if (/tb/i.test(str)) {
                return str.replace(/tb/i, '') * 1024 * 1024;
            } else {
                return str;
            }
        },
        __typeFormat: function(str) {
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
        this.__berth = $trigger[0];
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
    Uploader.prototype.setup = function() {
        this.form = $(
            '<form method="post" enctype="multipart/form-data"' +
            'target="" action="' + this.settings.action + '" />'
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
    Uploader.prototype.bind = function() {
        var self = this;
        var $trigger = $(self.settings.trigger);
        $trigger.mouseenter(function() {
            var $obj = $(this);
            self.__berth = this;
            self.form.css({
                top: $obj.offset().top,
                left: $obj.offset().left,
                width: $obj.outerWidth(),
                height: $obj.outerHeight()
            });
        });
        self.bindInput();
    };

    Uploader.prototype.bindInput = function() {
        var self = this;
        self.input.change(function(e) {
            if (self.settings.uploadAfter) {
                // console.log(self);
                var files = [];
                Array.prototype.slice.call(this.files).map(function(file, i) {
                    var uuid = self.settings.upload.fn.uuid();
                    file.id = uuid;
                    file.src = "#";
                    files.push(file);
                });
                if(self.settings.upload.attr.showFileList){
                    self.settings.upload.showAllFile(files);
                }
                self.settings.beforeUpload && self.settings.beforeUpload(this.files)
                self.input.val('');
                return;
            }
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
                        this.value = "";
                        return;
                    }
                }
            }


            if (self.settings.max_file_size) {
                for (var i = 0; i < self._files.length; i++) {
                    if (self._files[i].size > self.settings.max_file_size) {
                        self.settings.alert("文件大小不能超过" + self.settings.maxSize);
                        this.value = "";
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
    Uploader.prototype.submit = function() {
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
                optionXhr = function() {
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', function(event) {
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
                //dataType: "html",
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
            self.form.attr('action', self.settings.action);

            $('body').append(self.iframe);
            self.iframe.one('load', function() {
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

    Uploader.prototype.refreshInput = function() {
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
    Uploader.prototype.change = function(callback) {
        if (!callback) {
            return this;
        }
        this.settings.change = callback;
        return this;
    };

    // handle when upload success
    Uploader.prototype.success = function(callback) {
        var me = this;
        this.settings.success = function(response) {
            me.refreshInput();
            if (callback) {
                callback(response);
            }
            //me.input.value = "";
        };

        return this;
    };

    // handle when upload success
    Uploader.prototype.error = function(callback) {
        var me = this;
        this.settings.error = function(response) {
            if (callback) {
                me.refreshInput();
                callback(response);
            }
        };
        return this;
    };

    // enable
    Uploader.prototype.enable = function() {
        this.input.prop('disabled', false);
        this.input.css('cursor', 'pointer');
    };

    // disable
    Uploader.prototype.disable = function() {
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

        var inputs = [],
            i;
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
        var unescape = function(s) {
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
        $trigger.each(function(i, item) {
            options.trigger = item;
            uploaders.push(new Uploader(options));
        });
        this._uploaders = uploaders;
    }
    MultipleUploader.prototype.submit = function() {
        $.each(this._uploaders, function(i, item) {
            item.submit();
        });
        return this;
    };
    MultipleUploader.prototype.change = function(callback) {
        $.each(this._uploaders, function(i, item) {
            item.change(callback);
        });
        return this;
    };
    MultipleUploader.prototype.success = function(callback) {
        $.each(this._uploaders, function(i, item) {
            item.success(callback);
        });
        return this;
    };
    MultipleUploader.prototype.error = function(callback) {
        $.each(this._uploaders, function(i, item) {
            item.error(callback);
        });
        return this;
    };
    MultipleUploader.prototype.enable = function() {
        $.each(this._uploaders, function(i, item) {
            item.enable();
        });
        return this;
    };
    MultipleUploader.prototype.disable = function() {
        $.each(this._uploaders, function(i, item) {
            item.disable();
        });
        return this;
    };
    MultipleUploader.Uploader = Uploader;

    //module.exports = MultipleUploader;
    return Uplodify;
});