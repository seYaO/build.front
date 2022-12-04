import api from '../../services/beegoapi'
import mock from '../../JSON/mock.js'

const LIST = mock.list

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showList: true,
        showChapter: false,
    },
    async onLoad(options) {
        this.setConfigComponent()

        const token = wx.getStorageSync('token')
        if (!token) {
            const user = await api.login()

            if (!user) {
                this.showModal()
                return
            }

            wx.setStorageSync('token', user.token)
        }

        // this.getApi()
        this.getMock()

    },

    showModal() {
        wx.showModal({
            title: '提示',
            content: '登录失败，是否重新登录？',
            success: (res) => {
                if (res.confirm) {
                    wx.setStorageSync('token', '')
                    this.onLoad()
                    // console.log('用户点击确定')
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    },

    async getApi() {
        //获取所有课程信息
        {
            // let list = await api.list(wx.getStorageSync('token'))

            // if (!list) {
            //     this.showModal()
            //     return
            // }

            // list.map(async (item) => {
            //     const courseID = await api.test({ token: wx.getStorageSync('token'), productId: item.productId })
            //     item.courseId = courseID
            //     const cstId = await api.detail({ token: wx.getStorageSync('token'), courseId: courseID, productId: item.productId })
            //     item.cstId = cstId
            //     item.chapterList = []
            //     item.examList = []
            // })
            // console.log('list', list)
            // setTimeout(() => {
            //     console.log(JSON.stringify(list))
            // }, 12000)
        }

        let idx = 10

        // 获取课程信息
        {
            // console.log('mock', LIST[idx])
            // const item = LIST[idx]
            // const chapter = await api.chapter({ token: wx.getStorageSync('token'), courseId: item.courseId, cstId: item.cstId })
            // console.log('chapter', chapter)
            // if (chapter) {
            //     chapter.map(async (chapter) => {
            //         chapter.children.map(async (child) => {
            //             const exerList = await await api.practiceChapter({
            //                 token: wx.getStorageSync('token'),
            //                 courseId: item.courseId,
            //                 cstId: item.cstId,

            //                 catId: child.catId,
            //                 linkName: child.linkName,
            //                 name: child.name,
            //             })
            //             child.exerList = exerList
            //         })
            //     })

            //     setTimeout(() => {
            //         console.log('chapter===================')
            //         console.log('chapter===================')
            //         console.log('chapter===================')
            //         console.log(JSON.stringify(chapter))
            //     }, 12000)
            // }

        }

        // 获取模拟考试
        {
            // console.log('mock', LIST[idx])
            // const item = LIST[idx]
            // const exam = await api.exam({ token: wx.getStorageSync('token'), courseId: item.courseId })
            // console.log('exam',exam)
            // if(exam){
            //     exam.map(async (exam)=>{
            //         const exerList = await api.mockExam({ token: wx.getStorageSync('token'), courseId: item.courseId, cstId: item.cstId,specialProjectId:exam.specialProjectId })
            //         exam.exerList = exerList
            //     })
            //     setTimeout(() => {
            //         console.log('exam===================')
            //         console.log('exam===================')
            //         console.log('exam===================')
            //         console.log(JSON.stringify(exam))
            //     }, 12000)
            // }
        }
    },

    getMock() {
        this.listComponent.init(LIST)
    },
    setConfigComponent() {
        this.listComponent = this.selectComponent('#listComponent')
        this.detailComponent = this.selectComponent('#detailComponent')
        this.exerListComponent = this.selectComponent('#exerListComponent')
    },
    bindButton(e) {
        const { chapterList, examList, type } = e.detail
        // console.log(chapterList, examList)
        this.setData({ showList: false, showChapter: true })
        this.listComponent.setShow(false)
        this.detailComponent.setShow(true)
        this.detailComponent.init({ chapterList, examList, type })

    },
    bindPop(e) {
        const { exerList } = e.detail
        this.exerListComponent.init(exerList)
        this.exerListComponent.setShowPop()
    },
    bindBack(){
        this.listComponent.setShow(true)
        this.detailComponent.setShow(false)
    }
})