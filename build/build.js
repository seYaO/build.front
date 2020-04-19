require('shelljs/global')
var fs = require('fs')
var config = require('../config')
var utils = require('./utils')
var log = utils.log
var gulp = require('gulp')
// var gulpCli = utils.requireGlobal('gulp-cli')

build(function(err){
  if(err){
    return log(err)
  }
  require('./deploy')()
})

function build(cb) {
  var branch = getCurrentBranchInfo()
  var branchType = checkBranchType(branch)
  if (!branch.status) {
    log('当前分支还有代码未提交,请提交后再进行操作!')
    exit()
  }
  var out
  out = exec('git pull origin ' + branch.name, { silent: true });
  log('正在拉取远程分支' + branch.name + '...')
  out.code !== 0 && (log(out.stderr), exit())
  log('拉取成功')
  out = exec('git push origin ' + branch.name, { silent: true });
  log('正在推送远程' + branch.name + '...')
  out.code !== 0 && (echo(out.stderr), exit())
  log('推送成功')

  log('正在检测分支类型...')
  if (branchType === 'testing') {
    env.NODE_ENV = 'testing'
    env._TMPL_ENV = 'testing'
    log('当前分支为线上测试分支')
    exec('npm run qa', function(err){
      cb(err)
    })
  } else if (branchType === 'production') {
    env.NODE_ENV = 'production'
    env._TMPL_ENV = 'production'
    log('当前分支为上线分支')
    exec('npm run prod', function(err){
      cb(err)
    })
  } else if (branchType === 'offlinetesting') {
    env.NODE_ENV = 'testing'
    env._TMPL_ENV = 'offlinetesting'
    log('当前分支为线下测试分支')
    exec('npm run qa', function(err){
      cb(err)
    })
  } else {
    log('Error: 未匹配到分支类型')
    cb(new Error('未匹配到分支类型'))
  }
}

function getCurrentBranchInfo() {
  var out = exec('git status -sb', { silent: true })

  if (out.code !== 0) {
    echo('Error: Git branch command failed');
    exit();
  }
  var arr = out.stdout.split('\n')
  return {
    name: /^##\s*([^\.]+)(?=\.{3}origin\/\1|$)/.exec(arr[0])[1],
    status: arr.length < 3 //true 已提交 false 未提交
  }
}

function checkBranchType(branch) {
  if (config.envMap.offlineTest.test(branch.name)) {
    return 'offlinetesting'
  }
  if (config.envMap.onlineTest.test(branch.name)) {
    return 'testing'
  }
  if (config.envMap.online.test(branch.name)) {
    return 'production'
  }
  return null
}