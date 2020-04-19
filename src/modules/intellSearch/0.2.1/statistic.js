define('intellsearch/0.2.1/statistic', ['base/0.1.0/base' ,'jsondb/0.1.0/dbstorage'], function (require, exports, module) {
    /*
     * 统计组件
     * Created by smm07975 on 2016/4/20
     */
    var Statistic = Base.extend({
        initialize: function (options) {
            //init super
            Statistic.superclass.initialize.apply(this, arguments);
            //init
            Statistic.prototype.init.apply(this, arguments);
        },
        init: function (options) {
            var self = this;
        },
        ATTRS: {

        },
        METHODS: {


        }



    });

    return Statistic;
});

