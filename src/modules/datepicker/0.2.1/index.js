define("datePicker/0.2.1/index", ["datePicker/0.2.1/datePicker", "datePicker/0.2.1/tmpl/calendar4price", "datePicker/0.2.1/theme/price.css"], function (require) {
    var DatePicker = require("datePicker/0.2.1/datePicker"),
        calendarTmpl = require("./tmpl/calendar4price.dot"),
        jsonDB = require("intellsearch/0.1.0/jsonDB");

    /*
     * 日历控件
     * dom数据标签属性:data-btn-premonth,data-btn-nextmonth
     * events:itemselect
     */
    var PriceCalendar = DatePicker.extend({
        initialize: function (config) {
            PriceCalendar.superclass.initialize.apply(this, arguments);
            this.init(config);
            PriceCalendar.prototype.init.apply(this, arguments);
        },
        init: function (conf) {          
        },
        ATTRS: {
            "skin": "price",
            "calendarTmpl": calendarTmpl
        },
        EVENTS: {
           
        },
        DOCEVENTS: {
        },
        METHODS: {           
        },
        __selectDate:function () {
    
        },
        __nowDate: new Date(),
        __dateFormat: function (str,formarstr) {
                    
        }
        
    });
    return PriceCalendar;
});
