const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        creatingBookName: 'test', // 绑定添加书目的提交按钮点击事件，向服务器发送数据
    },
    initData() {
        let Chord = new wx.BaaS.TableObject('listenType')
        let query = new wx.BaaS.Query()
        Chord.setQuery(query).find().then(res => {
            console.log(res)
        })
    },
    // https://doc.minapp.com/js-sdk/schema/create-record.html
    createBook(e) {
        let name = this.data.creatingBookName // 缓存在 data 对象中的输入框输入的书名
        let Books = new wx.BaaS.TableObject('listenType') // 实例化对应 tableName 的数据表对象
        let book = Books.create() // 创建一条记录
        book.set({ name }).save().then(res => {
            console.log(res)
        }, err => { })
    },

    createMany() {
        let MyTableObject = new wx.BaaS.TableObject('listenType')
        const records = [
            {
                name: 'apple',
            }, {
                name: 'banana',
            }
        ]
        MyTableObject.createMany(records).then(res => {
            console.log(res)
        }, err => {
            //err 为 HError 对象
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('load')
        // this.createBook()
        // this.initData()
        // wx.BaaS.auth.anonymousLogin().then(user => {
        //     console.log(user)
        //     this.createBook()
        // }).catch(err => {
        //     // HError
        // })

        // 微信用户登录小程序
        wx.BaaS.auth.loginWithWechat().then(user => {
            // 登录成功
            console.log(user)
            // this.createBook()
            this.createMany()
        }, err => {
            // 登录失败
        })
    },
})