const baiduData = require('../../services/baiduData')

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    init() { },

    // 类型
    createType() {
        const MyTableObject = new wx.BaaS.TableObject('listenType')
        const data = ['言情', '多人播', '青春']

        return false

        search((res) => {
            res.map(item => {
                let idx = data.indexOf(item.name)
                if (idx > -1) {
                    data.splice(idx, 1);
                }
            })

            let list = []
            data.map(item => {
                list.push({ name: item })
            })
            // console.log(data)

            if (list.length > 0)
                create(list)
        })

        function search(cb) {
            const query = new wx.BaaS.Query()
            MyTableObject.setQuery(query).limit(1000).offset(0).find().then(res => {
                const { meta, objects } = res.data
                // console.log(objects)
                typeof cb === 'function' && cb(objects);
            })
        }

        function create(values) {
            MyTableObject.createMany(values).then(res => {
                console.log(res.data.succeed)
            })
        }
    },

    // 作者
    createAuthor() {
        const MyTableObject = new wx.BaaS.TableObject('author')
        let data = ['']

        // return false

        search((res) => {
            res.map(item => {
                let idx = data.indexOf(item.name)
                if (idx > -1) {
                    data.splice(idx, 1);
                }
            })

            let list = []
            data.map(item => {
                list.push({ name: item })
            })
            // console.log(data)

            if (list.length > 0)
                create(list)
        })

        function search(cb) {
            const query = new wx.BaaS.Query()
            MyTableObject.setQuery(query).limit(1000).offset(0).find().then(res => {
                const { meta, objects } = res.data
                // console.log(objects)
                typeof cb === 'function' && cb(objects);
            })
        }

        function create(values) {
            MyTableObject.createMany(values).then(res => {
                console.log(res.data.succeed)
            })
        }
    },

    // 播音员
    createAnnouncer() {
        const MyTableObject = new wx.BaaS.TableObject('announcer')
        const data = []

        return false

        search((res) => {
            res.map(item => {
                let idx = data.indexOf(item.nickName)
                if (idx > -1) {
                    data.splice(idx, 1);
                }
            })

            let list = []
            data.map(item => {
                list.push({ nickName: item })
            })

            if (list.length > 0)
                create(list)
        })

        function search(cb) {
            const query = new wx.BaaS.Query()
            MyTableObject.setQuery(query).limit(1000).offset(0).find().then(res => {
                const { meta, objects } = res.data
                // console.log(objects)
                typeof cb === 'function' && cb(objects);
            })
        }

        function create(values) {
            MyTableObject.createMany(values).then(res => {
                console.log(res.data.succeed)
            })
        }
    },

    // 更新部分字段
    updateBaidu() {
        const data = ['多人播', '言情', '青春']
        const value = ''
        // const data = []
        let tableObj = {}
        // tableObj = { name: 'listenType', tit: 'name', value: 'types' }
        tableObj = { name: 'author', tit: 'name', value: 'authorId' }
        // tableObj = { name: 'announcer', tit: 'nickName', value:'announcers' }

        return false

        search((res) => {
            let _arr = [], _value = '', _obj = {}
            res.map(item => {
                if (tableObj.name == 'author') {
                    if (item.name == value) {
                        _value = item.id
                    }
                } else {
                    let idx = data.indexOf(item[tableObj.tit])
                    if (idx > -1) {
                        arr.push(item.id)
                    }
                }
            })
            // console.log(arr)

            if (tableObj.name == 'author') {
                _obj = { [tableObj.value]: _value }
            } else {
                _obj = { [tableObj.value]: _arr }
            }
            update('5d2076fd2be66d1154bc365f', _obj)
        })


        function search(cb) {
            const MyTableObject = new wx.BaaS.TableObject(tableObj.name)
            const query = new wx.BaaS.Query()
            MyTableObject.setQuery(query).limit(1000).offset(0).find().then(res => {
                const { meta, objects } = res.data
                typeof cb === 'function' && cb(objects);
            })
        }

        function update(recordId = '5d2076fd2be66d1154bc365f', values) {
            const MyTableObject = new wx.BaaS.TableObject('listenBook')
            const product = MyTableObject.getWithoutData(recordId)
            product.set(values).update().then(res => {
                console.log(res.data)
            })
        }
    },

    // 数据批量新建
    createBaidu() {
        const MyTableObject = new wx.BaaS.TableObject('listenBook')
        const data = baiduData.data.list
        let list = [], reg = /[^\/]*$/g
        data.map((item, index) => {
            const { typicalPath, shortlink, passwd } = item
            let tit = typicalPath.match(reg), title = ''
            if (tit) {
                title = tit[0]
            }

            list.push({
                created_by: index + 2,
                title,
                cloudDownload: `链接：${shortlink} 提取码：${passwd}`
            })
        })
        // console.log(list)

        return false

        MyTableObject.createMany(list).then(res => {
            console.log(res.data.succeed)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.BaaS.auth.loginWithWechat().then(user => {
            this.init()
        })
    },
})