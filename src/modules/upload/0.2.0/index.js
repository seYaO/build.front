(function(){
    var Upload = function(cfg){
        var self = this;
        plupload.extend(Upload.prototype,cfg);
        self.init();
    };
    Upload.prototype = {
        previewEl: null,
        afterPreview: function(){},
        size: [300,300],
        max: 10,
        url: "upload.html",
        max_file_size: "1000kb",
        extensions: "jpg,gif,png,jpeg,bmp",
        init: function(){
            var self = this,
                loader = self.loader = new plupload.Uploader({ //实例化一个plupload上传对象
                browse_button : self.previewEl,
                url : self.url,
                max_file_size: self.max_file_size,
                //todo 这个图片要发布后需要注意路径
                silverlight_xap_url : 'Moxie.xap',
                flash_swf_url : 'http://www.ly.com/intervacation/public/img/Moxie.swf',
                runtimes: "html5,flash,html4",
                filters: {
                    mime_types : [ //只允许上传图片文件
                        { extensions : self.extensions }
                    ]
                }
            });
            plupload.addI18n({
                "File size error.":"文件大小不能超过"+self.max_file_size
            });
            loader.init(); //初始化
            self._initEvent();
        },
        _initEvent: function(){
            //绑定文件添加进队列事件
            var self = this;
            self.loader.bind('FilesAdded',function(uploader,files){
                var isOver = false;
                while(uploader.files.length > self.max){
                    uploader.splice(uploader.files.length-1,1);
                    files.pop();
                    isOver = true;
                }
                if(isOver){
                    self.overFunc && self.overFunc.call(self,self.max);
                }
                for(var i = 0, len = files.length; i<len; i++){
                    !function(i){
                        var _file = files[i];
                        self._preview(_file,function(imgsrc){
                            self.afterPreview && self.afterPreview.call(self,imgsrc,_file);
                        })
                    }(i);
                }
            });
            self.loader.bind("FileUploaded",function(uploader,file,responseObject){
                if(self.uploadedFunc){
                    self.uploadedFunc.call(uploader,file,responseObject);
                        $(".J_upload").show();
                        $(".J_upload_mark").show();
                }else{
                    console.log(responseObject);
                }
            });
            self.loader.bind("UploadComplete",function(uploader,file){
                if(self.uploadCompleteFunc){
                    $(".J_upload").hide();
                    $(".J_upload_mark").hide();
                    self.uploadCompleteFunc.call(uploader,file);
                }else{
                    console.log(file);
                }
            });
            self.loader.bind("Error",function(uploader,errObj){
                if(self.errorFunc){
                    self.errorFunc.call(uploader,errObj);
                }else{
                    alert(errObj.message);
                }
            });
        },
        /**
         * @desc 移除上传组件里的文件流
         * @param file
         * @returns {*}
         */
        remove: function(file){
            return this.loader.removeFile(file);
        },
        _preview: function(file,callback){
            var self = this;
            if(!file || !/image\//.test(file.type)) return; //确保文件是图片
            if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
                var fr = new mOxie.FileReader();
                fr.onload = function(){
                    callback(fr.result);
                    fr.destroy();
                    fr = null;
                };
                fr.readAsDataURL(file.getSource());
            }else{
                var preloader = new mOxie.Image();
                preloader.onload = function() {
                    preloader.downsize.apply(this,self.size);//先压缩一下要预览的图片,宽300，高300
                    var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                    callback && callback(imgsrc); //callback传入的参数为预览图片的url
                    preloader.destroy();
                    preloader = null;
                };
                preloader.load( file.getSource() );
            }
        },
        /**
         * @desc 调用上传
         */
        upload: function(){
            this.loader.start();
        }
    };
    window.uploadModule = Upload;

}());
