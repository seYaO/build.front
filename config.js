module.exports = {
    build: {
        // 命名空间 影响上传路径,狮子座模板名称
        namespace: 'dujia',
        // 输出目录
        outPath: 'output/',
        // 页面根路径
        pageRoot: 'sites/',
        // 工作目录
        workspaceRoot: 'src/',
        // 天梯上传目录
        uploadPath: 'build_artifacts/build/',
        // 模块模式
        moduleMode: 'commonjs',
        // 模块路径
        modulePath: ['sites', 'utils', 'modules','modules-lite', 'modules-touch'],
        // develop分支
        developBranch: /^(?!daily\/)/,
        // testing分支
        testingBranch: /^develop$/,
        // production分支
        productionBranch: /^daily\/\w+/,
        // 危险字段
        // rDangerField: /url\((\\?['"]?)([^)]+?)\1\)|<link[^>]+href=(\\?['"]?)([^'"]+)\3|\ssrc=(\\?['"]?)([^'"]+)\5/g,
        // 狮子座桶号
        bucket: 'dujia',
        // 狮子座根文件夹id
        leonRootfolderId: '57a9a09b0a23ea2c52a73242'
    },
    dev: {
        // 服务端口
        port: '5006',
        // 同步数据请求的host头
        //  webApiHost: 'http://www.ly.com',
        webApiHost: 'http://10.101.40.57:3000',
        // webApiHost: 'http://10.101.40.59:1992',
        // webApiHost: 'http://cmsapi.t.17usoft.com',
        //webApiHost: 'http://10.101.40.69:3000',
        // webApiHost: 'http://10.101.40.74:3000',
        //webApiHost: 'http://10.101.40.57:3002',
        // socket地址
        socketIp: 'http://10.14.86.134:8877',
        // redis地址
        redis: ['http://10.14.86.134:3001/intervacation/redis']
    },
    prod: {
        // webApiHost: 'http://10.101.42.78:99/',
        webApiHost: 'http://cmsapi.t.17usoft.com',
        redis: ['http://10.14.86.134:3001/intervacation/redis']
    },
    leon: {
        username: '09798',
        password: '123456abc',
        // 上传静态文件
        uploadfileAddress: 'http://leonidapi.17usoft.com/v1/leonid/static/uploadfile',
        // 获取模板目录
        fetchDirectoryAddress: 'http://leonidapi.17usoft.com/v1/leonid/tpl/tplfolder',
        // 创建模板目录
        createDirectoryAddress: 'http://leonidapi.17usoft.com/v1/leonid/tpl/tplfolder',
        // 新增模板
        putTemplateAddress: 'http://leonidapi.17usoft.com/v1/leonid/tpl/tpldata',
        // 更新模板
        patchTemplateAddress: 'http://leonidapi.17usoft.com/v1/leonid/tpl/tpldata'
    }
}