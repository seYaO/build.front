(function(){
    function LocalData(){
    }
    LocalData.prototype = {
        data: {},
        init: function(sug,requestData){
            var data = sug.config.deal.call(this,requestData);
            this.data = $.extend({},data);
        },
        request: function(kw,callback){
            var t= this,
                localData = t.data,
                indexData = localData.indexData,
                data = localData.data;
            var keyArr = t.parse.call(this,kw,indexData);
            if(!keyArr.length){
                keyArr = t.parse.call(this,kw,data);
            }
            var valArr = [];
            for(var i = 0, kLen = keyArr.length-1; i<=kLen;i++){
                valArr.push(data[keyArr[i]]);
            }
            callback.call(this,kw,valArr);
        },
        parse: function(inputVal, data){
            var ret = [],
                count = 0;
            if (!inputVal) {
                return data;
            }
            $.each(data, function (i,d) {
                if (d.indexOf(inputVal) !== -1) {
                    ret.push(i);
                }
                count++;
            });
            return ret;
        }
    };
    module.exports = LocalData;
}());
