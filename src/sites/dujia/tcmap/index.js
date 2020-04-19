var map = require("modules/gaodeMap/0.1.0/index");
var data = require('./data');
var index = {
    init:function(){
        map.init('map',data);
    }
}
module.exports = index;