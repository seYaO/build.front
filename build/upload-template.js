function uploadTemplate() {
    return new Promise(function (resolve, reject) {
        // 模板部署
        var tmplEnv = NODE_ENV === 'production' ? 'prod' : 'prev'
        var task1 = loadLocalTemplateInfo()
        var task2 = fetchRemoteTemplateInfo()
        Promise.all([task1, task2]).then(function (data) {
            var local = data[0]
            var remote = data[1]
            // var putQueue = []
            // var patchQueue = []
            var queue = []
            // 替换def
            replaceDef(local, tmplEnv)
            co(function* () {
                for (let dir in local.dirs) {
                    var remoteTemplates = []
                    var folderId = ''
                    if (remote.folders[dir] == null) {
                        folderId = yield httpClient.createRemoteDirectory(dir, config.build.leonRootfolderId)
                    } else {
                        folderId = remote.folders[dir][0].id
                        let res = yield httpClient.fetchRemoteDirectory(folderId)
                        remoteTemplates = _.groupBy(JSON.parse(res.result), 'name')
                    }
                    local.dirs[dir].forEach(function (file) {
                        var template = remoteTemplates[file.name] ? remoteTemplates[file.name][0] : null
                        file.folderId = folderId
                        if (template) {
                            file.id = template.id
                            // patchQueue.push(file)
                            queue.push({
                                file: file,
                                type: 'patch'
                            })
                        } else {
                            // putQueue.push(file)
                            queue.push({
                                file: file,
                                type: 'put'
                            })
                        }
                    })
                }

                var bagpipe = new Bagpipe(1)
                // var redisConfig = buildConfig('redis')
                // var sites = Object.keys(redisConfig)
                // var remoteRedisConfig = {}
                // for (let i = 0; i < sites.length; i++) {
                //     let ret = yield httpClient.getConf({ key: sites[i] })
                //     Object.assign(remoteRedisConfig, ret ? JSON.parse(ret) : {})
                // }
                var raw = fs.readFileSync('./.hashconfig')
                var obj = JSON.parse(raw)
                queue.forEach(function (item) {
                    bagpipe.push(httpClient.uploadTemplate, item.file, item.type, tmplEnv, item.isText, function (err, data, file) {
                        if(err){
                            obj['output\\sites\\' + file.subpath] = ''
                            console.log(err)
                        }
                        if (bagpipe.queue.length === 0) {
                            updateHash()
                            resolve('模板上传成功')
                        }

                    })
                })

                function updateHash(){
                    var key = NODE_ENV === 'testing' ? 'dj_front_pc_qa' : 'dj_front_pc_prod'
                    httpClient.setConf({
                        key: key,
                        value: JSON.stringify(obj)
                    })
                }
            })
        })
    })
}