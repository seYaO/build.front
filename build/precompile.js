var fs = require('fs')
var path = require('path')

// module.exports = function (aries) {
//   aries.precompile = function precompile(tempstr, options, cb) {
//     var compileFinish = false
//     if (!tempstr) {
//       return cb(null, "")
//     }
//     var tempStrList = [tempstr]
//     var ctx = {}
//     aries.scanInclude(tempStrList, 0, ctx, function (err, strList, noInclude, includeIds, includeFiles, incMapStr) {
//       //避免回调2次
//       if (compileFinish) return;
//       if (err) {
//         compileFinish = true
//         err = aries.prettyStackFunc(err, incMapStr);
//         return cb(err);
//       }
//       //如果仅仅返回includeIds
//       if (cb.isIncludes) {
//         return cb(null, includeIds, includeFiles)
//       }
//     }, options);
//   }

//   aries.scanInclude = function scanInclude(tempStrList, count, ctx, cb, options) {
//     //符号用
//     var templateSymbol = [];
//     var symbolPos = -1;
//     var isPairing = false;
//     var tmpS, tmpE;

//     //如果没有就创建数组
//     if (typeof cb.includeFiles == "undefined") {
//       cb.includeFiles = [];
//     }

//     if (typeof cb.includeIds == "undefined") {
//       cb.includeIds = [];
//     }

//     if (typeof cb.incMapStr == "undefined") {
//       cb.incMapStr = {};
//     }


//     //大于5次的嵌套就出错，防止死循环嵌套
//     count++;
//     if (count > 5) {
//       var err = new Error(util.format("[ariestp] scanInclude include count lt 5 times"));
//       return cb(err);
//     }

//     //字符串长度
//     var len = tempStrList[0].length;
//     for (var i = 0; i < len; i++) {
//       if (tempStrList[0][i] === '<' && tempStrList[0][i + 1] === '%') {
//         if (isPairing === true) {
//           var err = new Error(util.format("[ariestp] template str scan error, not pair <% at template char %s, str copy:", i, tempStrList[0].slice(tmpS, i + 2)));
//           return cb(err);
//         }
//         tmpS = i;
//         templateSymbol.push({
//           s: i,
//           e: -1,
//         })
//         symbolPos = templateSymbol.length - 1;
//         isPairing = true
//       } else if (tempStrList[0][i] === '%' && tempStrList[0][i + 1] === '>') {
//         if (isPairing !== true) {
//           var err = new Error(util.format("[ariestp] template str scan error, not pair %> at template char %s, str copy:", i, tempStrList[0].slice(tmpE, i + 2)));
//           return cb(err);
//         }
//         tmpE = i + 2;
//         templateSymbol[symbolPos]['e'] = tmpE;
//         isPairing = false;
//         symbolPos = -1;
//       }
//     }

//     //所有 <% xxxx %> 的匹配，存入临时数组
//     var len = templateSymbol.length;
//     var includeList = [];
//     var includeReg = /^<%\s+include\s(.+)\s+%>$/;
//     var includeIdReg = /^<%\s+includeId\s(.+)\s+%>$/;
//     var renderReg = /^<%[=|-](.+)%>$/;
//     var hasFh = /^<%(.+);(\s*?)%>$/;

//     var needSemicolon = false;
//     var include = 0;
//     for (var i = 0; i < len; i++) {
//       var includeMatchStr = tempStrList[0].slice(templateSymbol[i]['s'], templateSymbol[i]['e']);
//       var matchList = includeMatchStr.match(includeReg);

//       //如果include文件
//       if (matchList && matchList[0] && matchList[1]) {
//         includeList.push({
//           's': templateSymbol[i]['s'],
//           'e': templateSymbol[i]['e'],
//           'type': 1,//1 表示include文件
//           'val': matchList[1],
//         })

//         cb.includeFiles.push(matchList[1].split("?")[0]);
//         //cb.incMapStr['file_'+matchList[1].split("?")[0]] = "";

//         include++;
//         continue;
//       }

//       // //如果includeid id
//       // var matchListId = includeMatchStr.match(includeIdReg);
//       // if (matchListId && matchListId[0] && matchListId[1]) {
//       //   includeList.push({
//       //     's': templateSymbol[i]['s'],
//       //     'e': templateSymbol[i]['e'],
//       //     'type': 2,//1 表示include文件
//       //     'val': matchListId[1],
//       //   })
//       //   //将includeId存入cb的includeIds数组
//       //   cb.includeIds.push(matchListId[1].split("?")[0]);
//       //   //cb.incMapStr['id_'+matchListId[1].split("?")[0]]= "";

//       //   include++;
//       //   continue;
//       // }

//       // if (!(renderReg.test(includeMatchStr)) && !(hasFh.test(includeMatchStr))) {
//       //   includeMatchStr = includeMatchStr.slice(0, -2) + ';' + includeMatchStr.slice(-2);
//       //   includeList.push({
//       //     's': templateSymbol[i]['s'],
//       //     'e': templateSymbol[i]['e'],
//       //     'type': 3,//表示正常的<% %>对，非include
//       //     'val': includeMatchStr,
//       //   })
//       // }

//     }

//     // 如果模版不包含 include 或者 includeId
//     if(includeList.length === 0){
//     	var notHaveInclude = false
//     	return cb(null, tempStrList, notHaveInclude);
//     }
//     if (include === 0) {
//       var notHaveInclude = false
//       aries.assemble(tempStrList, includeList, notHaveInclude, ctx, cb);
//       // return cb(null, tempStrList, notHaveInclude);
//     } else {
//       aries.replaceIncludeStr(tempStrList, includeList, count, ctx, cb, options);
//     }

//   }

//   aries.replaceIncludeStr = function replaceIncludeStr(tempStrList, includeList, count, ctx, cb, options) {
//     var asyncWorker = [];
//     var _includeList = includeList.filter(function (item) {
//       return item.type === 1
//     })
//     includeList.forEach(function (incItem) {
//       var okCallback = true
//       var dealFunc = function (callback) {

//         if (incItem.type == 1) {

//           //去解析include的内容
//           var tmpList = aries.splitIncludeParam(incItem.val);
//           if (tmpList[2]) {
//             return callback(tmpList[2])
//           }

//           aries.getTemplateFromFile(tmpList[0], function (err, tempstr) {
//             if (err) return callback(err);
//             incItem.template = tmpList[1] + tempstr.toString();

//             cb.incMapStr['file_' + incItem.val] = tempstr.toString();

//             //tempStrList[0] = tempStrList[0].slice(0, incItem['s']) + tempstr + tempStrList[0].slice(incItem['e']);
//             okCallback && callback();
//             okCallback = false
//             return
//           }, options)
//         } else if (incItem.type == 2) {

//           // if (!te.includeId) {
//           //   okCallback && callback(new Error("[ariestp] not defined opt.includeId can't use includeId in template!"));
//           //   okCallback = false
//           //   return
//           // } else {

//           // }
//         }
//         else { //type == 3
//           incItem.template = incItem.val;
//           okCallback && callback();
//           okCallback = false
//           return
//         }
//       }
//       asyncWorker.push(dealFunc);
//     });

//     //异步并发
//     async.parallel(asyncWorker, function (err) {
//       if (err) {
//         return cb(err);
//       }
//       //重新做检查，看是否有include
//       var len = includeList.length;
//       for (var i = len - 1; i >= 0; i--) {

//         tempStrList[0] = tempStrList[0].slice(0, includeList[i]["s"]) + includeList[i]["template"] + tempStrList[0].slice(includeList[i]["e"]);
//       }
//       aries.scanInclude(tempStrList, count, ctx, cb);
//     })
//   }

//   aries.assemble = function assemble(tempStrList, includeList, notHaveInclude, ctx, cb) {

//     var len = includeList.length;
//     for (var i = len - 1; i >= 0; i--) {
//       tempStrList[0] = tempStrList[0].slice(0, includeList[i]["s"]) + includeList[i]["val"] + tempStrList[0].slice(includeList[i]["e"]);
//     }

//     cb(null, tempStrList, notHaveInclude, cb.includeIds, cb.includeFiles, cb.incMapStr);
//   }

//   aries.getTemplateFromFile = function getTemplateFromFile(filename, cb, options) {
//     //是否是绝对路径
//     if (filename.charAt(0) === '/' || /^[a-zA-Z]:$/.test(filename.slice(0, 2))) {
//       filename = filename;
//     } else {
//       filename = path.join(options.path, filename);
//     }

//     fs.readFile(filename, function (err, tempstr) {
//       if (err) return cb(err);
//       return cb(null, tempstr)
//     });
//   }
// }



module.exports = function(aries){
 aries.precompile = function(str, options, cb){
   var includeReg = /<%\s+include\s+([^\s]+)\s+%>/g
  //  var includes = str.match(includeReg)
   var views = options.path
   
   var ret = str.replace(includeReg, function(matched, name){
     return fs.readFileSync(path.join(views, name))
   })
   ret = ret.replace(includeReg, function(matched, name){
     return fs.readFileSync(path.join(views, name))
   })
   cb(null, ret)
 } 
}