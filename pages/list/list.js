import Toast from '../../lib/toast/toast'
import util from '../../utils/index'

let limit = 10 // 每页显示几条数据
let offset = 0 // 页码
let page = 1 //总页数

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrl: 'https://cloud-minapp-28547.cloud.ifanrusercontent.com/1hjHz464JJyX0dBe.jpeg',
        list: null,
    },

    getList({ refresh = false }) {
        let { list } = this.data
        const MyTableObject = new wx.BaaS.TableObject('listenBook')
        const query = new wx.BaaS.Query()
        MyTableObject.setQuery(query).limit(limit).offset(offset).find().then(res => {
            const { meta, objects } = res.data
            page = Math.floor(meta.total_count / limit)
            this.setData({ list: refresh ? [...objects] : list.concat([...objects]), })
            if (refresh) {
                wx.stopPullDownRefresh()
            }
        })
    },

    // 复制内容
    getClipboard(e) {
        const { value } = e.currentTarget.dataset
        wx.setClipboardData({
            data: value,
            success(res) {
                wx.hideToast()
                Toast('内容已复制,打开百度网盘');
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList({ refresh: true })
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
    onPullDownRefresh() {
        console.log('页面相关事件处理函数--监听用户下拉动作')
        offset = 0
        this.getList({ refresh: true })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log('页面上拉触底事件的处理函数')
        if (offset < page) {
            offset++
            this.getList({})
        }
    },
})