define('intellsearch/0.2.0/track', ['intellsearch/0.2.0/searchBase'], function (require, exports, module) {
    var SearchBase = require("intellsearch/0.2.0/searchBase");

    /*
      * 热门城市    
      */
    var track = SearchBase.extend({
        initialize: function (options) {
            //init super
            track.superclass.initialize.apply(this, arguments);
            //init             
            track.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
            var o_pobj = this.o_pobj;
            var o_input = this.o_input;
         
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


            ////埋点1 /sbox/button
            //$el.on("submit enter", function () {
            //    var selcount = $el.getModule("intellSearch").getDataCount();
            //});
            ////埋点2 /sbox/ac
            //$el.getModule("intellSearch").on("nodata", function (keyword) {
            //    //debugger;
            //});
            ////埋点3 /sbox/ac
            //$el.getModule("intellSearch").on("itemselect", function (keyword) {
            //    //debugger;
            //});

            ////埋点4/sbox/ac
            //$el.getModule("hotcity").on("itemClick", function (e) {
            //    var text = $(this).text();
            //    //debugger
            //});

            ////埋点5/sbox/ac
            //$el.getModule("history").on("itemClick", function (e) {
            //    var text = $(this).text();
            //    //debugger
            //});

            ////埋点6/sbox/ac
            //$el.on("hide", function (e) {
            //    //debugger
            //});


        },
        ATTRS: {
            reqData: function (res) {

            }
        },
        METHODS: {
            show: function () {              
            },
            getData: function (key) {
                //switch (key) {
                //    case "/sbox/k": break;
                //    case "/sbox/ac": break;
                //    case "/sbox/ac/click": break;
                //    case "/sbox/k": break;
                //    case "/sbox/k": break;
                //    case "/sbox/k": break;
                //    default:
                //        break;                      
                //}
                switch (key) {
                    case "keyword": break;
                    case "/sbox/ac": break;
                    case "/sbox/ac/click": break;
                    case "/sbox/k": break;
                    case "/sbox/k": break;
                    case "/sbox/k": break;
                    default:
                        break;                      
                }
            }
        }
    });
    return track;
});
