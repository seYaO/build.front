define("freePackage/visa/0.2.0/index", ["freePackage/visa/0.2.0/index.css"], function (require, exports, module) {
        module.exports = function (host) {
            var visaType = $(".visa-item"),
                visaTypeSpan = $(".visa-item li"),
                visaUrl = $(".visa-content").attr("attr-url");
            visaTypeSpan.on('click', function () {
                var _this = $(this),
                    parent = _this.parents(".visa-item"),
                    continentId = parent.attr("continent-id"),
                    countryId = parent.attr("country-id"),
                    visaTypeId = parent.attr("visa-id"),
                    regionId = parent.attr("region-id"),
                    PersonnelTypeId = _this.attr("person-id"),
                    strHtml = "",
                    param;

                _this.addClass("current").siblings().removeClass("current");
                param = {
                    continentId: continentId,
                    countryId: countryId,
                    visaTypeId: visaTypeId,
                    regionId: regionId,
                    PersonnelTypeId: PersonnelTypeId
                };
                if (ajaxAbort) ajaxAbort.abort();
                var ajaxAbort= $.ajax({
                    url: window.host + visaUrl,
                    data: param,
                    dataType: "jsonp",
                    success: function (data) {
                        if (data) {
                            parent.find(".visa-details").html(data.content);
                        }
                    }
                });
            });
            visaType.each(function(i,n){
                $(n).find("li").first().click();
            })
        };
});
