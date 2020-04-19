/*
*搜索框样式
* 搜索面板、热门面板、历史记录面板
*/
var SearchPanel = Base.extend(
    {
        initialize: function (options) {
            //init super
            SearchPanel.superclass.initialize.apply(this, arguments);
            //init             
            SearchPanel.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            //var _skin = self.get("skin");
            var o_input = self.o_input = $(self.get("el"));
            var _config = this.config;
            var _html = self.get("html")().replace("{input}", '<div class="ui_search_input"></div>');
            //var 

            var o_search_gp = $("<div>", {
                "class": _skin + " ui_search_gp",
                "html": _html
            }).css({
                "background": self.get("background")
            });

            o_input.after(o_search_gp);
            var o_search_btn = o_search_gp.find(".ui_search_btn").text(self.get("searchText"));
            o_search_gp.find(".hotkeyword_gp").text(self.get("hotkeyword"));

            var zw_search_input = o_search_gp.find(".ui_search_input");
            o_input.insertAfter(zw_search_input);
            zw_search_input.remove();

            //var $el = $(self.get("el"));
            //var $main = $("<div>", { "class": "ly_search" }).insertAfter($el);

            //panels
            //controls

        },
        ATTRS: {
            el: "",
            html: function () {
                var str = '';
                str += '';
                str += '<div class="ui_search_main">';
                str += '            <div class="input_gp">{input}';
                str += '                <label class="ui_search_btn">搜索</label>';
                str += '            </div>';
                str += '            <div class="hotkeyword_gp">';
                str += '              ';
                str += '            </div>';
                str += '        </div>';
                str += '';
                return str;
            },
            searchText: '搜索',
            hotkeyword: '',
            skin: "skin1",
            templates: {
                temp1: {
                    html: '<div class="ui_search_main">'
                        + '            <div class="input_gp">{input}'
                        + '                <label class="ui_search_btn">搜索</label>'
                        + '            </div>'
                        + '            <div class="hotkeyword_gp">'
                        + '              '
                        + '            </div>'
                        + '        </div>'
                    , searchRemark: "输入中文/拼音/英文 ↑↓上下选择"
                    , searchText: '搜索'
                    , hotkeyword: '热门目的地：美国  日本 澳大利亚'
                    , defText: "以下为推荐内容"//推荐提示内容
                }
            },
            panels: {
                hotcity: {
                    key: 'hotcity',
                    html: '上海，北京，西藏',
                    dataKey: ''
                },
                history: {
                    key: 'history'
                }
            }
        }
    });