import api from '../../services/beegoapi'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        users: null
    },

    async onLoad(options) {
        const user = await api.login()
        if (user.code == 200 && user.data) {
            const { token, users } = user.data
            this.setData({ token, users })
            this.token = token
            this.users = users

            api.list(this.token)

            this.getDetail(24884128)



        }
    },

    async getDetail(productId) {
        const detail = await api.detail({ token: this.token, courseId: this.users.lastCourseId, productId })
        if (detail.code == 200 && detail.data) {
            // console.log('detail',detail.data)
            this.getChapter('10393')
        }
    },

    async getChapter(cstId) {
        const chapter = await api.chapter({ token: this.token, courseId: this.users.lastCourseId, cstId })
        // console.log('chapter', chapter)
        if (chapter.code == 200 && chapter.data) {
            const practiceChapter = chapter.data.practiceChapter
            console.log('practiceChapter', practiceChapter)
            practiceChapter.map(item => {
                let obj = {
                    linkName: item.linkName,
                    title: item.name,
                    children: []
                }

                item.children.map(child => {
                    api.practiceChapter({
                        token: this.token,
                        courseId: this.users.lastCourseId,
                        catId: child.catId,
                        cstId: child.cstId,
                        linkName: child.linkName,
                        name: child.name,
                    })
                })
            })
        }

        // api.practiceChapter({
        //     token: this.token,
        //     "catId": "280126",
        //     "courseId": "34-06090",
        //     "linkName": "第1章  人事测评概论>1.1 人事测评的含义及其基本范畴",
        //     "name": "1.1 人事测评的含义及其基本范畴",
        //     "cstId": "10393",
        //     "scoringMethod": "1",
        //     "lastPosition": "0"
        // })
    }
})