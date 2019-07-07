const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        creatingBookName: 'test', // 绑定添加书目的提交按钮点击事件，向服务器发送数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('load')
    },
})