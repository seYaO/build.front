/**
 * Created by hk08688 on 2015/5/28.
 */
//顶部广告
(function($) {
    function addTopShow() {
        var topHeader,
            imgUrl,
            imgHref,
            imgDate,
            imgHeader;
        imgHeader = topHeader = $("#J_HeaderNav");
        if(topHeader.length <= 0){
            return;
        }
        var isNarrowFlag = isNarrow(),
            wideImgUrl = imgHeader.attr("data-imgurl"),
            narrowImgUrl = imgHeader.attr("data-imgurl-narrow");
        if(isNarrowFlag){
            imgUrl = narrowImgUrl || wideImgUrl;
        }else{
            imgUrl = wideImgUrl || narrowImgUrl;
        }
        imgHref = imgHeader.attr("data-href");
        imgDate = imgHeader.attr("data-date");
        var dateFlag;
        if(imgDate){
            imgDate = imgDate.replace(/\-/gi, "/");
            dateFlag = (new Date()).getTime() < (new Date(imgDate)).getTime();
        }else{
            dateFlag = true;
        }
        if (dateFlag) {
            topHeader.append(
                '<div id="headerSlider" class="headerSlider" style="height: 100px;margin-bottom: 15px;"><div class="sliderConDiv"><a target="_blank" rel="nofollow" href="' +
                imgHref.replace('http:','') +
                '" class="small" id="sliderConA1"><img style="height:100px; width: 100%;" class="sliderImg1" src="' +
                imgUrl.replace('http:','') + '"></a>  </div> </div>')

        }
    }

    /**
     * @desc 检查屏幕是否是窄屏
     * @returns {boolean}
     */
    function isNarrow(){
        return $("body").hasClass("w990");
    }
    addTopShow();
})(jQuery);
