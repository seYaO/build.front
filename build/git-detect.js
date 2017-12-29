/**
 * 检测git分支
 */

'use strict'

require('shelljs/global')

// 可以提交的分支
const branchArr = ['master','develop', 'release']

function getBranchInfo() {
    let out = exec('git status -sb', {
        silent: true
    });

    let result = out.stdout.split('\n');
    result.pop();

    let branchName = result[0];

    let endIndex = branchName.indexOf('...')

    return {
        name: endIndex === -1 ? branchName.substring(3) : branchName.substring(3, endIndex),
        // 是否已经全部提交 | true: 全部提交, false: 没有全部提交
        hasSubmit: result.length == 1
    }
}

module.exports = () => {
    const branchInfo = getBranchInfo();
    let isBranchTrue = branchArr.indexOf(branchInfo.name) != -1;

    if(!isBranchTrue){
        console.log(`请切换到${branchArr.join('、')}分支`);
        exit();
    }

    if(!branchInfo.hasSubmit){
        console.log(`当前分支还有代码未提交`)
        exit();
    }

    let pullout = exec(`git pull origin ${branchInfo.name}`, {
        silent: true
    });

    if(pullout.code !== 0){
        console.log('拉取失败')
        exit();
    }

    let pushout = exec(`git push origin ${branchInfo.name}`, {
        silent: true
    });

    if(pushout.code !== 0){
        console.log('推送失败')
        exit();
    }
}