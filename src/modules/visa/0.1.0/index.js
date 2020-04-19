define("visa/0.1.0/index", ["visa/0.1.0/index.css"], function (require, exports, module) {
        module.exports = function () {
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
                    url: (window.host||"") + visaUrl,
                    data: param,
                    dataType: "jsonp",
                    success: function (data) {
                        if ($.trim(data) != "") {
                            var visaExp = new RegExp(/id="visaName">([^<]+)/g);
                            var dataExec = visaExp.exec(data);
                            dataTitle = dataExec ? dataExec[1] : "&nbsp;";
                            data = data.replace(dataTitle, "");
                            parent.find(".visa-details").html(data);
                        }
                    }
                });
            });
            visaType.each(function(i,n){
                $(n).find("li").first().click();
            })
        };
});
