
// 获取每个页面的 config.json 配置

let fs = require('fs');
let path = require('path');
let glob = require('glob');

function getPath() {
    let entries = [];

    let files = glob.sync('./src/sites/**/config.json');
    let reg = /\/pages\/(.*?)\/(.*?).ftl?$/;

    files.forEach(file => {   
        let fileBuffer = fs.readFileSync(file);
        if(fileBuffer){
            let data = fileBuffer.toString();
            data = data && JSON.parse(data) || {};
            entries.push(data);
        }
    });

    return entries;
}


module.exports = getPath();