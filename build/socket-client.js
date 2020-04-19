var fs = require('fs')
var client = require('socket.io-client')
var ss = require('socket.io-stream')

var Client = function (ip) {
    this.socketIp = ip
}

Client.prototype.connect = function () {
    this.socket = client.connect(this.socketIp)
    return this
}
Client.prototype.disconnect = function () {
    this.socket.close()
    return this
}
Client.prototype.send = function (filename, callback) {
    var stream = ss.createStream()
    var socket = this.socket
    var self = this

    ss(socket).emit('file', stream, { name: filename })
    fs.createReadStream(filename).pipe(stream)
    ss(socket).on('data', function (data) {
        callback && callback.call(self, data)
    })
}

module.exports = function(ip){
  return new Client(ip)
}