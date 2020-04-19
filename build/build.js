require('shelljs/global')
var fis = require('fis3')
var argv = require('minimist')(process.argv)
var config = require('../config')
var patch = require('./patch')
var mediaMap = {
    production: 'prod',
    testing: 'qa',
    develop: 'dev'
}
var branch = getCurrentBranchInfo()
var NODE_ENV = env.NODE_ENV = argv.env || 'production'
var media = mediaMap[NODE_ENV] || 'prod'

rm('-rf', config.build.outPath)
// 如果是开发分支那么允许直接build不用做额外检测
// if (config.build.developBranch.test(branch.name)) {
// return fis({ media: media, clean: true })
// }

var lastestVersion = exec('npm view fis3 version', { silent: true })
if (countVersion(fis.version) < countVersion(lastestVersion)) {
    echo('Notice：fis3版本过低')
    echo('Notice：使用 `npm update fis3` 升级fis3后进行构建')
    exit()
}
function countVersion(version) {
    return version.split('.').map(function (v, i, arr) {
        return (arr.length - i) * 10 * v
    }).reduce(function (a, b) {
        return a + b
    })
}
if (!branch.status) {
    echo('Notice: 当前分支还有代码未提交,请提交后再进行操作!')
    exit()
}
var out
out = exec('git pull origin ' + branch.name, { silent: true });
echo('Notice: 正在拉取远程分支' + branch.name + '...')
out.code !== 0 && (echo(out.stderr), exit(1))
echo('Notice: 拉取成功')

out = exec('git pull origin master', { silent: true });
echo('Notice: 正在拉取远程master分支')
out.code !== 0 && (echo(out.stderr), exit(1))
echo('Notice: 拉取成功')

out = exec('git push origin ' + branch.name, { silent: true });
echo('Notice: 正在推送远程' + branch.name + '...')
out.code !== 0 && (echo(out.stderr), exit(1))
echo('Notice: 推送成功')

if (media === 'dev') {
    echo('Error: dev模式不需要使用build命名，请查看README文档');
    exit()
} else if (media === 'qa') {
    // if (config.build.testingBranch.test(branch.name)) {
    //     fis({ media: 'qa', clean: true })
    // } else {
    //     echo('Error: 当前分支不为develop分支，请切换分支后重新build');
    //     exit()
    // }
} else if (media === 'prod') {
    // if (config.build.productionBranch.test(branch.name)) {
    //     fis({ media: 'prod', clean: true })
    // } else {
    //     echo('Error: 当前分支不为production分支，请切换分支后重新构建');
    //     exit()
    // }
    // 暂时不走天梯改用狮子座
    // var uploadPath = config.build.uploadPath
    // var outPath = config.build.outPath
    // rm('-rf', uploadPath)
    // mkdir('-p', uploadPath)
    // cp('-R', outPath + '/static/cn', uploadPath)
}
var branchType = checkBranchType(branch)
echo('Notice: 正在检测分支类型...')
if (branchType === 'testing') {
    echo('Notice: 当前分支为[testing]分支')
    fis({ media: 'qa', clean: true })
    patch(NODE_ENV)
} else if (branchType === 'production') {
    echo('Notice: 当前分支为[production]分支')
    fis({ media: 'prod', clean: true })
    patch(NODE_ENV)
} else{
    echo('Error: 未匹配到分支类型')
}

function getCurrentBranchInfo() {
    var out = exec('git status -sb', { silent: true })

    if (out.code !== 0) {
        echo('Error: Git branch command failed');
        exit();
    }
    var arr = out.stdout.split('\n').filter(function(str){
        if(str.indexOf('??') === 0){
            return false
        }
        return true
    })
    return {
        name: /^##\s*([^\.]+)(?=\.{3}origin\/\1|$)/.exec(arr[0])[1],
        status: arr.length < 3 //true 已提交 false 未提交
    }
}

function checkBranchType(branch) {
    if (config.build.testingBranch.test(branch.name)) {
        return 'testing'
    }
    if (config.build.productionBranch.test(branch.name)) {
        return 'production'
    }
    return null
}