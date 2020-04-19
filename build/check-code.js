var fis = require('fis')
module.exports = function () {
    var fileContent = file.getContent();
    fileContent = fileContent.replace(/url\((\\?['"]?)([^)]+?)\1\)|<link[^>]+href=(\\?['"]?)([^'"]+)\3|\ssrc=(\\?['"]?)([^'"]+)\5/g, function ($0, $_1, $1, $_2, $2, $_3, $3) {
        var value = $1 || $2 || $3,
            filePath = file.dirname + "/" + value,
            localFilePath = fis.util.realpath(filePath);
        if (!localFilePath) {
            if (filePath.indexOf("http") > -1) {
                return $0;
            } else {
                if (file.realpath.indexOf("#") === -1 &&
                    file.realpath.indexOf(":") === -1
                ) {
                    fis.log.warning(_file.realpath.bold.red + "存在问题:");
                    fis.log.warning($2.bold.red + "不存在!");
                }
            }
            return $0;
        }
        var url = "";
        return $0.replace(value, url);
    });
    file.setContent(fileContent);
    var dangerConf = fis.get("dangerReg");
    //if (file.ext === ".js")
    var _fileContent = file.minContent || file.getContent(),
        dangerExclude = dangerConf.exclude,
        dangerMatch = _fileContent.match(dangerConf.reg);
    if (dangerMatch) {
        var flag = true;
        var fullFileName = file.fullname;
        if (dangerExclude) {
            dangerExclude.forEach(function (n, i) {
                if (fullFileName.indexOf(n) > -1) {
                    flag = false;
                    return;
                }
            })
        }
        if (!flag) {
            return;
        }
        if (fullFileName.indexOf("html") > -1) {
            return;
        } else {
            fis.log.notice(fullFileName + "包含危险字段:" + (dangerMatch.join(",")).red);
            fis.log.notice('打包出现问题,中断!');
            process.exit();
        }
    }
}