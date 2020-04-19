define('intellSearch/0.2.1/track', ['intellSearch/0.2.1/searchBase','jsondb/0.1.0/dbstorage'], function (require, exports, module) {
    var SearchBase = require("intellSearch/0.2.1/searchBase");
    var DBStorage = require('jsondb/0.1.0/dbstorage');
    var db = new DBStorage({
        dbName: "_searchItemsTrack_",
        maxSize:100,
        datedtime:86400
    });

    var track = SearchBase.extend({
        initialize: function (options) {
            //init super
            track.superclass.initialize.apply(this, arguments);
            //init
            track.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            if(self.get("autoExtend")) {
                var o_pobj = this.o_pobj,
                    $el = o_pobj;
                var o_input = this.o_input;

                var data = self.get("initdata");

                //记录用户输入与输入改变次数
                o_input.on("keyup", function (e) {
                    var ov = o_pobj.getTrackData("inputtext");
                    var changecount = o_pobj.getTrackData("changecount") || 0;
                    var v = this.value;
                    o_pobj.setTrackData("inputtext", v);
                    if (v != ov) {
                        changecount++;
                        o_pobj.setTrackData("changecount", changecount);
                    }
                    //console.log(v+'_'+ov);
                });

                //埋点1 /sbox/button
                $el.on("enter", function () {
                    var value = self.packageData("/sbox/k", options.param);
                    self.sendReport(options.param,"/sbox/k", value);
                });
                //埋点2 /sbox/ac
                $el.getModule("intellSearch").on("nodata", function (keyword) {
                    var value = self.packageData("/sbox/ac", options.param);
                    self.sendReport(options.param,"/sbox/ac", value);
                });
                //埋点3 /sbox/ac/click
                $el.getModule("intellSearch").on("itemclick", function (keyword) {
                    var value = self.packageData("/sbox/ac/click", options.param);
                    self.sendReport(options.param,"/sbox/ac/click", value);
                });

                //埋点4/sbox/k/hot
                if($el.getModule("hotcity")) {
                    $el.getModule("hotcity").on("itemClick", function (e,o) {
                        var inx = $(o).index()+1,
                            kewword = $(o).attr("data-value");
                        o_pobj.setTrackData("keyword",kewword);
                        o_pobj.setTrackData("position",inx);
                        var value = self.packageData("/sbox/k/hot", options.param);
                        self.sendReport(options.param,"/sbox/k/hot", value);
                    });
                }

                //埋点4/sbox/k/hot
                if($el.getModule("searchLabel")) {
                    $el.getModule("searchLabel").on("itemClick", function (e,o) {
                        o_pobj.setTrackData("position","");
                        o_pobj.setTrackData("keyword",$(o).text());
                        var value = self.packageData("/sbox/k/hot", options.param);
                        self.sendReport(options.param,"/sbox/k/hot", value);
                    });
                }

                //埋点5/sbox/k/history
                if($el.getModule("history")){
                    $el.getModule("history").on("itemClick", function (e,o) {
                        var inx = $(o).index()+1,
                            kewword = $(o).attr("data-value");
                        o_pobj.setTrackData("keyword",kewword);
                        o_pobj.setTrackData("hisindex",inx);
                        var value = self.packageData("/sbox/k/history", options.param);
                        self.sendReport(options.param,"/sbox/k/history", value);
                    });
                }


                //埋点6/sbox/inputAndDoNothing
                $el.on("hide", function (e) {
                    //var value = self.packageData("/sbox/inputAndDoNothing",options.param);
                    //self.sendReport(options.param,value);
                });
            }


        },
        ATTRS: {
            reqData: function (res) {

            },
            autoExtend:true,
            initdata:{}

        },
        METHODS: {
            initTrace : function() {
                var self = this;
                $(document).on("mousedown", ".J_Track,.J_track", function (e) {
                    var $el = $(this);
                    var elParents = $el.parents(".J_trackPar"),
                        lineid = elParents.attr("trackid");
                    var $lis = $(".J_trackPar");
                    var $activeLi = elParents.closest('.J_trackPar');
                    if (elParents && elParents.length) {
                        var inx = ($lis.index($activeLi)+1).toString();
                        self.triggerEvent("/detail",{pos:inx,resId:lineid});
                    }
                })
            },
            triggerEvent: function (key,params) {
                var self = this,
                    opn = $.extend(self.get("initdata"),params||{}),
                    value = self.packageData(key,opn);
                self.sendReport(opn,key,value);
            },
            getTrackData: function (key) {
                //return this.o_group.attr("search-" + key);
                //return this._data[key];
                return db.getItem("search-" + key);
            },
            setTrackData: function (key, value) {
                //this._data[key] = value;
                //this.o_group.attr("search-" + key, value);

                db.save("search-" + key, value);
            },
            guid : function(){
                var S4 = function() {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                };
                return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
            },
            /*
             * /sbox/k  搜索框关键字搜索 搜索按钮点击(或者搜索框按回车)到列表页
             * /sbox/ac  触发下拉列表提示(目前只要记结果为0的)
             * /sbox/ac/click  搜索下拉点击
             * /sbox/k/hot  热搜词点击
             * /sbox/k/history 搜索历史点击
             * /sbox/inputAndDoNothing  已输入内容未点击，返回(PC目前不需要埋)
             * /show  列表显示事件(翻页不算，翻页后重新到第一页后也不算)
             * /book  点击进预订页面
             * /detail  点击进详情(点详情链接、资源名、图片、进入详情都算)
             * /page  翻页
             * /sort 排序
             * /filter 过滤(比如选择了价格范围，星级)
             *
             * */
            packageData: function (key,option) {
                var self = this,
                    str = "";
                var obj = {};
                switch (key) {
                    case "/sbox/k":
                        obj.k = self.getTrackData("keyword")||"";
                        obj.locCId = option.locCId;
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.rc = self.getTrackData("shownum")||"";
                        obj.ab = option.ab||"";
                        break;
                    case "/sbox/ac":
                        obj.k = self.getTrackData("keyword")||"";
                        obj.locCId = option.locCId||"";
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.rc = self.getTrackData("shownum")||"";
                        obj.ab = option.ab||"";
                        break;
                    case "/sbox/ac/click":
                        obj.k = self.getTrackData("keyword")||"";
                        obj.ct = self.getTrackData("text")||"";
                        obj.pos = self.getTrackData("selectindex")||"";
                        obj.locCId = option.locCId;
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.regCId = "";
                        obj.pjId = option.pjId||"";
                        obj.jpTp = option.jpTp||"";
                        obj.resCId = "";
                        obj.ab = option.ab||"";
                        break;
                    case "/sbox/k/hot":
                        obj.k = self.getTrackData("keyword")||"";
                        obj.pos = self.getTrackData("position")||"";
                        obj.locCId = option.locCId||"";
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.jpTp = option.jpTp||"";
                        obj.ab = option.ab||"";
                        break;
                    case "/sbox/k/history":
                        obj.k = self.getTrackData("keyword")||"";
                        obj.pos = self.getTrackData("hisindex")||"";
                        obj.locCId = option.locCId||"";
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.jpTp = option.jpTp||"";
                        obj.ab = option.ab||"";
                        break;
                    case "/sbox/inputAndDoNothing":
                        obj.k = self.getTrackData("inputtext")||"";
                        obj.locCId = option.locCId||"";
                        obj.cityId = self.getTrackData("cityid")||"";
                        break;
                    case "/show":
                        if(option.isDetailShow){
                            obj.resId = option.resId;
                        }else{
                            obj.k = option.k||"";
                            obj.cityId = self.getTrackData("cityid")||"";
                            obj.rc = option.rc||"";
                            obj.locCId = option.locCId||"";
                        }
                        obj.ab = option.ab||"";
                        break;
                    case "/book":
                        obj.pos = option.pos||"";
                        obj.locCId = option.locCId||"";
                        obj.pjId = option.pjId||"";
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.resCId = option.resId||"";
                        obj.ab = option.ab||"";
                        break;
                    case "/detail":
                        obj.pos = option.pos||"";
                        obj.k = option.k||"";
                        obj.locCId = option.locCId||"";
                        obj.pjId = option.pjId||"";
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.resId = option.resId||"";
                        obj.ab = option.ab||"";
                        break;
                    case "/page":
                        obj.k =  option.k||"";
                        obj.locCId = option.locCId||"";
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.page = option.page||"";
                        obj.ab = option.ab||"";
                        break;
                    case "/sort":
                        obj.k =  option.k||"";
                        obj.locCId = option.locCId||"";
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.ab = option.ab||"";
                        break;
                    case "/filter":
                        obj.k =  option.k||"";
                        obj.locCId = option.locCId||"";
                        obj.cityId = self.getTrackData("cityid")||"";
                        obj.rc = option.rc||"";
                        obj.ab = option.ab||"";
                        break;
                    default:
                        break;
                }
                if(obj){
                    for(var o in obj){
                        if(obj[o]){
                            str += ("|*|"+o+":"+obj[o]);
                        }
                    }
                    str += "|*|";
                }
                return str;
            },
            sendReport: function (opn,key,value) {
                try{
                    _tcTraObj._tcTrackEvent(opn.pageid,opn.moduleid,key,value);
                }catch(e){
                    window.Monitor && Monitor.log(e.track| e.message,"sendtrace");
                }
            }
        }
    });
    return track;
});
