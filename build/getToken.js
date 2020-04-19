var fs = require('fs')
var utils = require('./utils')
var Promise = require('promise')
var inquirer = require('inquirer')

function getUsernameAndPassword(tmplEnv, callback) {
  var msg = tmplEnv === 'testing' ? '输入线上狮子座用户名' : '输入线下狮子座用户名'
  var msg2 = tmplEnv === 'testing' ? '输入线上狮子座密码' : '输入线下狮子座密码'
  inquirer.prompt([
    {
      type: 'input',
      message: msg,
      name: 'username',
      validate: function (answer) {
        if (answer.length < 1) {
          return '用户名不能为空!';
        }
        return true;
      }
    },
    {
      type: 'password',
      message: msg2,
      name: 'password',
      validate: function (answer) {
        if (answer.length < 1) {
          return '密码不能为空!';
        }
        return true;
      }
    }
  ]).then(function (answers) {
    callback(answers)
  });
}

function tryReadConfig(confpath) {
  var config = {}
  try {
    config = JSON.parse(fs.readFileSync(confpath))
  } catch (e) { }
  return config
}

function tryWriteToken(confpath, token, tmplEnv) {
  var config = tryReadConfig(confpath)
  config[tmplEnv] = {"token": token}
  fs.writeFileSync(confpath, JSON.stringify(config))
}

function makeToken(username, password) {
  return utils.md5(username + password, 0)
}

module.exports = function (tmplEnv) {
  var confpath = './.config'
  var config = tryReadConfig(confpath)
  var token = config[tmplEnv] ? config[tmplEnv].token : ''

  return new Promise(function (resolve, reject) {
    if (!token) {
      getUsernameAndPassword(tmplEnv, function (answers) {
        var token = makeToken(answers.username, answers.password)
        tryWriteToken(confpath, token, tmplEnv)
        resolve(token)
      })
    } else {
      resolve(token)
    }
  })
}