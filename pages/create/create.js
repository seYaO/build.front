const baiduData = require('../../services/baiduData')

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    init() { },

    // 听书数据批量新建
    createBaidu() {
        let MyTableObject = new wx.BaaS.TableObject('listenBook')
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