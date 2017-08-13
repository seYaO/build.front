/**
 * @author 王莉(wl09720@ly.com)
 * @module git 检测
 * @exports
 * @desc git 检测
 */

require('shelljs/global');
let config = require('../config');
let gutil = require('gulp-util');
let log = gutil.log;


let obj = {
    // git pull push code
    build(callback) {
        let branch = obj.getCurrentBranchInfo();

        if (!branch.status) {
            log('当前分支还有代码未提交，请提交后再进行操作');
            exit();
        }

        let out;
        out = exec(`git pull origin ${branch.name}`, {
            silent: true
        });
        log(`正在拉取远程分支${branch.name}...`);
        if (out.code !== 0) {
            log(out.stderr);
            exit();
        }
        log('拉取成功');

        out = exec(`git push origin ${branch.name}`, {
            silent: true
        });
        log(`正在推送远程${branch.name}...`);
        if (out.code !== 0) {
            echo(out.stderr);
            exit();
        }
        log('推送成功');

        log('正在检测分支类型...');
        env.NODE_ENV = 'production';
        env._TMPL_ENV = 'production';
        exec('npm run prod', err => {
            callback(err);
        });
    },
    // 检测代码是否已提交
    getCurrentBranchInfo() {
        let out = exec('git status -sb', {
            silent: true
        });

        if (out.code !== 0) {
            echo('Error: Git branch command failed');
            exit();
        }

        let arr = out.stdout.split('\n');

        return {
            name: /^##\s*([^\.]+)(?=\.{3}origin\/\1|$)/.exec(arr[0])[1],
            status: arr.length < 3 //true 已提交 false 未提交
        }
    }
}


obj.build(err => {
    if (err) {
        return log(err);
    }
    require('./upload-static-file')();
});