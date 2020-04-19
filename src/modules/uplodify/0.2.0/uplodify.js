var fileUpload = function (wrapper, options) {

    var $obj = $(wrapper);
    var objid = wrapper.replace("#", "");
    this.upload = function () {
        $(wrapper).uploadifyUpload(wrapper);
    }
    if (options == undefined) {
        return this;
    }


    $obj.hide();
    //外层div
    var gpdiv = $("<div />", {
        style: 'width: 100px; height: auto; display: block; text-align: center; line-height: 30px; color: #fff;position:relative;float:left;'
    });
    $obj.before(gpdiv);
    $obj.appendTo(gpdiv);
    var btndiv = '<div style="position: absolute; z-index: 1;top:0;left:0; width: 100%; height: 30px; line-height: 30px; text-align: center; background-color: #69B94F;">上传</div>';
    var querydiv = '<div id="fileQueue' + objid + '" style="display:none;color:black;z-index: 100;position: absolute;top: 35px;"></div>';
    $obj.after(btndiv);
    if (options.showProgress == undefined || options.showProgress) {
        $obj.after(querydiv);
    }

    var fileDesc, filter, filesize, onComplete, onAllComplete;
    var _linkType = "";
    var auto = true;
    var multi = true;
    var maxfiles = 999;
    var onQueueFull;

    if (options.fileDesc != undefined && options.fileDesc != null) {
        fileDesc = options.fileDesc;
    }
    if (options.filter != undefined && options.filter != null) {
        filter = options.filter;
    }
    if (options.fileSize != undefined && options.fileSize != null) {
        filesize = options.fileSize;
    }
    if (options.linkType != undefined && options.linkType != null) {
        _linkType = options.linkType;
    }
    if (options.auto != undefined && options.auto != null) {
        auto = options.auto;
    }
    if (options.multi != undefined && options.multi != null) {
        multi = options.multi;
    }
    if (options.maxfiles != undefined && options.maxfiles != null) {
        maxfiles = options.maxfiles;
    }
    //if (options.fileDesc != undefined && options.fileDesc != null) {
    //    fileDesc = options.fileDesc;
    //}
    if (options.onComplete == undefined || options.onComplete == null) {
        onComplete = function (event, ID, fileObj, response, data) {
            //response 为SR返回内容
            //此处可对上传结果进行处理
            //var filepath = '/ShowImg/' + response;//此处为SR接口 上传返回结果
            //$("#imglist").append('<img src="' + filepath + '" style="width:150px;height:150px;float:left;" />');
        }
    }
    else {
        onComplete = options.onComplete
    }
    if (options.onAllComplete == undefined || options.onAllComplete == null) {
        onAllComplete = function (event, uploadObj) {
            //所有文件上传结束后做的事
            //$("#fileQueue").hide();
            $("#fileQueue" + objid).html('');
            $("#fileQueue" + objid).hide();
            $obj[0].value = "";
        }
    }
    else {
        onAllComplete = options.onAllComplete;
    }

    if (options.onQueueFull == undefined || options.onQueueFull == null) {
        onQueueFull = function (num) {
            alert("超过最大数量:" + num);
        }
    }
    else {
        onAllComplete = options.onAllComplete;
    }

    $obj.uploadify({
        'buttonCursor': 'hand',
        //'buttonImg': '/lib/plugins/uplodify/jquery.uploadify-v2.1.0/upload.jpg',//按钮文件
        'fileDesc': fileDesc,
        'fileExt': filter,
        'uploader': '/lib/plugins/uplodify/jquery.uploadify-v2.1.0/uploadify.swf',//重要文件上传核心
        'script': '/api/csweb/FileUpload/', //此处为SR上传文件接口
        'cancelImg': '/lib/plugins/uplodify/jquery.uploadify-v2.1.0/cancel.png',//取消按钮文件
        'folder': 'UploadFile',
        'queueID': 'fileQueue' + objid,
        'hideButton': true,
        'wmode': 'transparent',//很重要，辅助解决swf加载图片过慢的问题
        'buttonText': ' ',
        'auto': auto,
        'multi': multi,
        'queueSizeLimit': maxfiles,
        'onSelect': function (event, ID, fileObj) {
            $("#fileQueue" + objid).show();
        },
        'onComplete': onComplete,
        'onAllComplete': onAllComplete,
        'onInit': function () {
            setTimeout(function () {
                $obj.next().css({ "position": "relative", "z-index": 3 });
            }, 1000);

        }
        , 'onCancel': function (file) {
            //alert('The file ' + file.name + ' was cancelled.');
            //var str = $("#fileQueue .uploadifyQueueItem");               
        }
        , 'onClearQueue': function (queueItemCount) {
        }
        , 'onProgress': function (event, ID, fileObj) {
            //此处在文件选中后上传之前对上传线程进行处理，如终止线程
            if (fileObj.size > filesize) {
                alertObj('当前选择的文件超过限定的大小' + (filesize / 1024 / 1024) + 'm，请重新选择文件！', 'warning');
                $obj.uploadifyCancel(ID);
                //$obj.uploadifyClearQueue();
                //$("#uploadify" + ID).remove();
                //$("#fileQueue").show();
            }
            else if (filter.indexOf(fileObj.type) < 0) {
                alertObj('文件格式不支持！', 'warning');
                $obj.uploadifyCancel(ID);
                //$obj.uploadifyClearQueue();
                //$("#uploadify" + ID).remove();
                //$("#fileQueue").html('');
                //$("#fileQueue").show();
            }
            else {

            }
            $("#fileQueue" + objid).show();
        }
        , 'onQueueFull': function () {
            onQueueFull(maxfiles);
        }
    });
    return this;
}