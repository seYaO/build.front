define("linefeature/0.1.0/index",["lazyload/0.1.0/index","linefeature/0.1.0/index.css"],function(require,exports,module){
    /**
     * @desc 特色线路的渲染脚本
     * @example
     * //需要引入linefeature.css和linefeature.js两个脚本
     *
     * //将data的数据渲染后,插入到xxx容器里
     * Feature.init(data,".xxx");
     */
    var Feature;
    require("lazyload/0.1.0/index");
    (function($){
        /* global initTemp */
        var tpl;
        function initTemp(){
            if(tpl) {
                return tpl;
            }
            tpl = {};
            tpl.mod1 = function anonymous(it) {
var out='';var arr1=it.ParamList;if(arr1){var value,i1=-1,l1=arr1.length-1;while(i1<l1){value=arr1[i1+=1];out+='<div class="puzzle puzzle1 '+(it.moduleStyle)+'"> ';if(fish.trim(value.Title)){out+=' <div class="title-wrap"> <span class="title">'+(value.Title)+'</span> <span class="bg-title"></span> </div> ';}out+=' <span class="img-wrap '+(it.HeightLimitFlag?"auto-height":"")+'"> <img data-img-src="'+(value.PicUrl)+'"> </span></div>';} } return out;
            };
            tpl.mod2 = function anonymous(it) {
                var out='';var list = it.ParamList;if(list&&list.length>1){out+='<div class="puzzle puzzle2 '+(it.moduleStyle)+' clearfix"> ';for(var i =0;i<=1;i++){out+=' <div class="inner '+(i===1?"last":"")+'"> <div class="img-wrap"> ';var picUrl = list[i].PicUrl;if(picUrl.indexOf("pic3.40017")>-1||picUrl.indexOf("pic2.40017")>-1)picUrl=picUrl.replace(/\.\w+$/,function($0){return "_450x250_00"+$0});out+=' <img data-img-src="'+(picUrl)+'"> </div> <div class="title-wrap"> <span class="title">'+(list[i].Title)+'</span> <p class="desc">'+(list[i].Content)+'</p> </div> </div> ';}out+='</div>';}return out;
            };
            tpl.mod3 = function anonymous(it) {
                var out='';var list = it.ParamList;if(list&&list.length>2){out+='<div class="puzzle puzzle3 '+(it.moduleStyle)+'"> <ul class="clearfix"> ';for(var i =0;i<=2;i++){out+=' <li> <div> ';var picUrl = list[i].PicUrl;if(picUrl.indexOf("pic3.40017")>-1||picUrl.indexOf("pic2.40017")>-1)picUrl=picUrl.replace(/\.\w+$/,function($0){return "_600x400_00"+$0});out+=' <img data-img-src="'+(picUrl)+'"> </div> </li> ';}out+=' </ul></div>';}return out;
            };
            tpl.mod4 = function anonymous(it) {
                var out='';var list = it.ParamList[0];out+='<div class="puzzle puzzle4 '+(it.moduleStyle)+' clearfix"> <div class="inner"> <div class="img-wrap"> ';var picUrl = list.PicUrl;if(picUrl.indexOf("pic3.40017")>-1||picUrl.indexOf("pic2.40017")>-1)picUrl=picUrl.replace(/\.\w+$/,function($0){return "_640x360_00"+$0});out+=' <img data-img-src="'+(picUrl)+'"> </div> <div class="title-wrap"> <span class="title">'+(list.Title||"默认标题")+'</span> <p class="desc">'+(list.Content||"默认内容")+'</p> </div> </div></div>';return out;
            };
            tpl.mod5 = function anonymous(it) {
                var out='';var list = it.ParamList[0];out+=' <div class="puzzle puzzle5 '+(it.moduleStyle)+' clearfix"> <div class="inner"> <div class="img-wrap"> ';var picUrl = list.PicUrl;if(picUrl.indexOf("pic3.40017")>-1||picUrl.indexOf("pic2.40017")>-1)picUrl=picUrl.replace(/\.\w+$/,function($0){return "_640x360_00"+$0});out+=' <img data-img-src="'+(picUrl)+'"> </div> <div class="title-wrap"> <span class="title">'+(list.Title||"默认标题")+'</span> <p class="desc">'+(list.Content||"默认内容")+'</p> </div> </div> </div>';return out;
            };
            tpl.mod6 = function anonymous(it) {
                var out='';if(it.ParamList.length > 2){out+='<div class="puzzle puzzle6 '+(it.moduleStyle||"")+' clearfix"> ';var param = it.ParamList;out+=' <div class="inner"> <div class="title-wrap"> <span class="title">'+(param[0].Title||"默认标题")+'</span> <p class="desc">'+(param[0].Content||"默认内容")+'</p> </div> <div class="img-wrap clearfix"> <div class="small-img"> ';for(var i =0;i<=1;i++){out+=' <span> ';var picUrl = param[i].PicUrl;if(picUrl.indexOf("pic3.40017")>-1||picUrl.indexOf("pic2.40017")>-1)picUrl=picUrl.replace(/\.\w+$/,function($0){return "_450x250_00"+$0});out+=' <img data-img-src="'+(picUrl)+'"> </span> ';}out+=' </div> <div class="big-img"> ';var picUrl = param[2].PicUrl;if(picUrl.indexOf("pic3.40017")>-1||picUrl.indexOf("pic2.40017")>-1)picUrl=picUrl.replace(/\.\w+$/,function($0){return "_640x360_00"+$0});out+=' <img data-img-src="'+(picUrl)+'"> </div> </div> </div></div>';}return out;
            };
            tpl.mod7 = function anonymous(it) {
                var out='<div class="puzzle puzzle7 '+(it.moduleStyle)+'"> <div class="inner"> <ul class="clearfix"> ';var list = it.ParamList;out+=' ';for(var i =0;i<=3;i++){out+=' <li> ';var picUrl = list[i].PicUrl;if(picUrl.indexOf("pic3.40017")>-1||picUrl.indexOf("pic2.40017")>-1)picUrl=picUrl.replace(/\.\w+$/,function($0){return "_450x250_00"+$0});out+=' <img data-img-src="'+(picUrl)+'" /> </li> ';}out+=' <li class="img-preview"> </li> ';for(var i =4;i<=7;i++){out+=' <li> ';var picUrl = list[i].PicUrl;if(picUrl.indexOf("pic3.40017")>-1||picUrl.indexOf("pic2.40017")>-1)picUrl=picUrl.replace(/\.\w+$/,function($0){return "_450x250_00"+$0});out+=' <img data-img-src="'+(picUrl)+'" /> </li> ';}out+=' </ul> </div></div>';return out;
            };
            tpl.mod8 = function anonymous(it) {
                var out='';var list = it.ParamList[0];out+='<div class="puzzle puzzle8 '+(it.moduleStyle)+'"> <div class="title-wrap"> <span class="title">'+(list.Title||"默认标题")+'</span> <p class="desc">'+(list.Content||"默认内容")+'</p> </div></div>';return out;
            };
            return tpl;
        };
        Feature = {
            tmpl: initTemp(),
            templateStyle: [
                "normal",
                "europe",
                "spring"
            ],
            getTemplateStyle: function(data){
                var templateStyle = this.getUrlParam("__style__");
                return templateStyle || data.TemplateStyleType||1;
            },
            getUrlParam: function(key){
                var locationUrl = location.href,
                    regX = new RegExp(key+"=([^&]+)"),
                    matchArr = regX.exec(locationUrl);
                if(matchArr && matchArr[1]){
                    return matchArr[1];
                }
            },
            get: function(data){
                //todo
                var htmlArr = [],moduleIndex = this.getTemplateStyle(data),
                    list = data.ModuleIdList;
                for(var i = 0,len = list.length-1;i<=len;i++){
                    var item = list[i],
                        index = item.ModuleId;
                    if(moduleIndex){
                        item.moduleStyle = this.templateStyle[moduleIndex-1];
                    }else{
                        item.moduleStyle = "";
                    }
                    this.dealData(item);
                    htmlArr.push(this.renderItem(item,index));
                }
                return htmlArr.join("");
            },
            dealData: function(data){
                var content,
                    list = data.ParamList;
                for(var i = 0, len = list.length -1; i<=len; i++){
                    content = list[i].Content;
                    if(content){
                        list[i].Content = content.replace(/\n/g,"<br/>");
                    }
                }
            },
            renderItem: function(item,index){
                var _tmpl = this.tmpl["mod"+index];
                return _tmpl(item);
            },
            /**
             * @func init
             * @desc 渲染特色线路的模板
             * @param {object} data 填充使用的数据
             * @param {string} [context=".characteristic"] 容器的选择器
             * @param {function} callback 回调
             */
            init: function(data,context,callback){
                var cont = $(context||".characteristic");
                if(cont.length < 0){
                    return false;
                }
                var _html = this.get(data);
                cont.html(_html);
                $("img",cont).lazyload({"data_attribute": "img-src", preSpace: 500});
                callback && callback.call(this);
            }
        };
        module.exports = Feature;
    }(jQuery));
});