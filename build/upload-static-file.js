var path = require('path')
var glob = require('glob')
var Bagpipe = require('bagpipe')

function uploadStaticFile(env, callback) {
  var staticFilePath = path.join(__dirname, '../dest/min')
  var staticZipFilePath = path.join(__dirname, '../dest/', new Date().getTime() + '.zip')
  if (env === 'testing') {
    _.zipDir(staticFilePath, staticZipFilePath, function (data) {
      socketClient.connect().send(data.path, function (data) {
        if (data.data === true) {
          this.disconnect()
          callback(null)
        } else {
          callback(new Error('uploaded error'))
        }
      })
    })
  } else if (env === 'production') {
    glob("../dest/min/**", { nodir: true }, function (er, files) {
      var bagpipe = new Bagpipe(100)
      var total = files.length
      var remain = total
      var failed = []
      // spinner.text = `Uploading static files for ${NODE_ENV}... Total: ${total} Remain: ${remain}`
      files.forEach(function (file) {
        bagpipe.push(httpClient.uploadFile, file, function (err, data) {
          remain--;
          if (err || data.code !== 0) {
            failed.push(err.toString())
          }
          // spinner.text = `Uploading static files for ${NODE_ENV}... Total: ${total} Remain: ${remain}`

          if (!remain) {
            // spinner.text = `Uploading static files for ${NODE_ENV}... Total: ${total} Remain: ${remain}\n  ${failed.join('\n  ')}`
            // spinner.succeed()
          }
          if (bagpipe.queue.length === 0) {
            resolve('模板上传成功')
          }
        })
      })
    }
}