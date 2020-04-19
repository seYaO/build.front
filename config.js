var _ = require('./build/utils')

module.exports = {
  build: {
    root: './src'
  },
  development: {
    publicPath: function(ext){
      if(_.isCSSLike(ext)){
        return '/css/'
      }
      if(_.isJSLike(ext)){
        return '/js/'
      }
      if(_.isIMGLike(ext)){
        return '/img/'
      }
      return '/'
    }
  },
  testing: {
    publicPath: function(ext){
      if(_.isCSSLike(ext)){
        return '//f.1024.team/css/'
      }
      if(_.isJSLike(ext)){
        return '//f.1024.team/js/'
      }
      if(_.isIMGLike(ext)){
        return '//f.1024.team/img/'
      }
      return '//f.1024.team/'
    }
  },
  production: {
    publicPath: function(ext){
      if(_.isCSSLike(ext)){
        return '//file.40017.cn/youlun/css/'
      }
      if(_.isJSLike(ext)){
        return '//file.40017.cn/youlun/js/'
      }
      if(_.isIMGLike(ext)){
        return '//file.40017.cn/youlun/img/'
      }
      return '//file.40017.cn/youlun/'
    }
  },
  socket: 'http://10.14.86.134:8877',
  pId: '57b5529aeb710abdd9720499', //57aacb25eb710abdd971c1d6', 
  namespace: 'ylyx_m',
  bucket: 'youlun',
  leon: {
    // 上传静态文件
    uploadfileAddress: 'http://leonidapi.17usoft.com/v1/leonid/static/uploadfile',
    // 获取模板目录
    fetchDirectoryAddress: '/v1/leonid/tpl/tplfolder',
    // 创建模板目录
    createDirectoryAddress: '/v1/leonid/tpl/tplfolder',
    // 新增模板
    putTemplateAddress: '/v1/leonid/tpl/tpldata',
    // 更新模板
    patchTemplateAddress: '/v1/leonid/tpl/tpldata'
  },
  envMap: {
    // 线下测试
    offlineTest: /^develop$/,
    // 线上测试
    onlineTest: /^build$/,
    // 线上正式
    online: /^release$/
  }
}