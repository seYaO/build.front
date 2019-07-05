const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        creatingBookName: 'test', // 绑定添加书目的提交按钮点击事件，向服务器发送数据
    },
    initData() {
        let Chord = new wx.BaaS.TableObject('bookshelf')
        let query = new wx.BaaS.Query()
        Chord.setQuery(query).find().then(res => {
            console.log(res)
        })
    },
    // https://doc.minapp.com/js-sdk/schema/create-record.html
    createBook(e) {
        let bookName = this.data.creatingBookName // 缓存在 data 对象中的输入框输入的书名
        let Books = new wx.BaaS.TableObject('bookshelf') // 实例化对应 tableName 的数据表对象
        let book = Books.create() // 创建一条记录
        book.set({ bookName }).save().then(res => {
            console.log(res)
        }, err => { })
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
        // wx.BaaS.auth.loginWithWechat().then(user => {
        //     // 登录成功
        //     console.log(user)
        //     this.createBook()
        // }, err => {
        //     // 登录失败
        // })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})