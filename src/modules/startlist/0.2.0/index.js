/** 
 * @des 跟团和自由行顶部城市切换
 * @date 2012-09-12
 * */ 
require("modules/startlist/0.2.0/vpublic").init();
var StartList = {};
StartList = {
    init: function(type){
        var self = this;
        var gStartingData = [{
                desc: "热门",
                cities: [{
                    citytitle: "",
                    citybody: eval(cityInfo.hotStartList)
                }]
            }, {
                desc: "ABCDEF",
                cities: self.grouping("ABCDEF", eval(cityInfo.startList))
            }, {
                desc: "GHJKLM",
                cities: self.grouping("GHJKLM", eval(cityInfo.startList))
            }, {
                desc: "NPQRS",
                cities: self.grouping("NPQRS", eval(cityInfo.startList))
            }, {
                desc: "TWXYZ",
                cities: self.grouping("TWXYZ", eval(cityInfo.startList))
            }];
        self.creatStartCity(".leavecity", gStartingData, type);
        self.tabSel();
    },
    tabSel:function(){
        $.extend({
            index: function() {
                var self = this[0];
                var parNode = self.parentNode,
                    ret = 0;
                if (parNode && parNode.nodeType === 1) {
                    var childs = parNode.children;
                    for (var i = 0, len = childs.length; i < len; i++) {
                        if (self === childs[i]) {
                            ret = i;
                            break;
                        }
                    }
                }
                return ret;
            },
            eq: function(index) {
                return $(this.get(index));
            },
            get: function(index) {
                return index == null ? this.toArray() : index < 0 ? this.slice(index)[0] : this[index];
            },
            toArray: function() {
                return $.toArray(this, 0);
            }
        });
        $(".sub-scity-tips li").on("click", function(e) {
            var _this = $(this);
            _this.addClass("cur").siblings("li").removeClass("cur");
            $(".scity-tips-main").eq(_this.index()).removeClass("none").siblings("div").addClass("none");
        })
    },
    grouping:function(str, scity){
        var cityArry = [];
        for (var i = 0; i < scity.length; i++) {
            for (var j = 0; j < str.length; j++) {
                if (scity[i].FirstLetter === str[j]) {
                    cityArry.push({
                        citytitle: str[j],
                        citybody: scity[i].MatchCitys
                    })
                }
            }
        }
        return cityArry;
    },
    creatStartCity:function(dom, data, type){
        var html = '<div class="sub-scity-tips"><ul class="clearfix">',
            isFor = 0;
        if (type) {
            var wUrl = window.location.href.split("dujiatag");
            wUrl = wUrl[1].replace(/\/\w*\//, "");
        }
        for (var k = 0; k < data.length; k++) {
            k ? html += "<li>" + data[k].desc + "</li>" : html += '<li class="cur">' + data[k].desc + "</li>"
        }
        html += "</ul>";
        for (var kk = 0; kk < data.length; kk++) {
            kk ? html += '<div class="scity-tips-main scity-en-show none">' : html += '<div class="scity-tips-main">';
            for (var j = 0; j < data[kk].cities.length; j++) {
                html += '<dl class="clearfix">';
                if (data[kk].cities[j].citytitle) {
                    html += "<dt>" + data[kk].cities[j].citytitle + "</dt>";
                }
                html += "<dd>";
                for (var jj = 0; jj < data[kk].cities[j].citybody.length; jj++) {
                    if (data[kk].cities[j].citytitle) {
                        for (var ii = 0; ii < cityInfo.hotStartList.length; ii++) {
                            if (cityInfo.hotStartList[ii].Name === data[kk].cities[j].citybody[jj].Name) {
                                if (type) {
                                    html += '<a class="subcur" href="/dujiatag/' + data[kk].cities[j].citybody[jj].Pinyin + "/" + wUrl + '" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + "</a>";
                                } else {
                                    html += '<a class="subcur" href="javascript:void(0);" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + "</a>";
                                }
                                isFor = 0;
                                break;
                            }
                        }
                        if (isFor) {
                            if (type) {
                                html += '<a href="/dujiatag/' + data[kk].cities[j].citybody[jj].Pinyin + "/" + wUrl + '" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + "</a>";
                            } else {
                                html += '<a href="javascript:void(0);" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + "</a>";
                            }
                        }
                        isFor = 1;
                    } else {
                        if (type) {
                            html += '<a class="mbot5" href="/dujiatag/' + data[kk].cities[j].citybody[jj].Pinyin + "/" + wUrl + '" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + "</a>";
                        } else {
                            html += '<a class="mbot5" href="javascript:void(0);" cityid="' + data[kk].cities[j].citybody[jj].Id + '" citypy="' + data[kk].cities[j].citybody[jj].Pinyin + '" title="' + data[kk].cities[j].citybody[jj].Name + '">' + data[kk].cities[j].citybody[jj].Name + "</a>";
                        }
                    }
                }
                html += "</dd></dl>";
            }
            html += "</div>";
        }
        html += "</div>";
        $(dom).html(html);
    }
};
module.exports = StartList;
