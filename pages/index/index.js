import api from '../../services/beegoapi'
import mock from '../../JSON/mock.js'

const LIST = mock.list
let CourseDetail = null
LIST.map(item => {
    if (item.courseDetail && item.productId == 24884128) {
        CourseDetail = item.courseDetail
    }
})

Page({

    /**
     * 页面的初始数据
     */
    data: {
    },
    async onLoad(options) {
        const token = wx.getStorageSync('token')
        if (!token) {
            const user = await api.login()

            if (!user) {
                this.showModal()
                return
            }

            wx.setStorageSync('token', user.token)
        }

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

    async getList(list) {
        list.map(async (item) => {
            const courseID = await api.test({ token: wx.getStorageSync('token'), productId: item.productId })
            item.courseId = courseID
            const cstId = await api.detail({ token: wx.getStorageSync('token'), courseId: courseID, productId: item.productId })
            item.cstId = cstId
            // console.log('detail',detail)
        })
        console.log('list', list)
        setTimeout(() => {
            console.log(JSON.stringify(list))
        }, 12000)
    },

    async getDetail(productId) {
        const detail = await api.detail({ token: wx.getStorageSync('token'), courseId: '34-06090', productId })
        if (detail.code == 200 && detail.data) {
            // console.log('detail',detail.data)

            // 章节练习
            // this.getChapter('10393')

            // 模拟考试

            // 课程资料

            // 每日一练

            // 答题闯关
        }
    },

    async getChapter(cstId) {
        const chapter = await api.chapter({ token: wx.getStorageSync('token'), courseId: '34-06090', cstId })
        // console.log('chapter', chapter)
        if (chapter.code == 200 && chapter.data) {
            const practiceChapter = chapter.data.practiceChapter
            // console.log('practiceChapter', practiceChapter)
            practiceChapter.map(item => {
                let obj = item

                item.children.map(async (child) => {
                    const exerList = await this.getPractice(child)
                    child.exerList = exerList
                    // return child
                })

                // return item
            })

            setTimeout(() => {
                console.log(JSON.stringify(practiceChapter))
            }, 12000)


        }
    },

    async getPractice(child) {
        const practice = await api.practiceChapter({
            token: wx.getStorageSync('token'),
            courseId: '34-06090',
            catId: child.catId,
            cstId: child.cstId,
            linkName: child.linkName,
            name: child.name,
        })
        if (practice.code && practice.data) {
            // console.log('practice',practice.data.exerList)
            return practice.data.exerList
        }

    }
})