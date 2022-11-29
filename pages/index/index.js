import api from '../../services/beegoapi'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        users: null
    },
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1ODY5NzMwIiwidWdpZCI6MSwiZXhwIjoxNjcwMzE0OTIxLCJ1c2VySWQiOjU4Njk3MzAsImlhdCI6MTY2OTcxMDEyMX0.0X56HisDStB8_XQq1hRSOxw5VE-Og3ev1eGJ1pRUJwem1f7LuqP7F1Z8dAFO1kcRHCsZSALm6X0JdT-58SOGdQ',
    users: {
        "district": null,
        "adminId": 47232,
        "token": null,
        "lastLoginTime": "2022-11-29 16:20:54",
        "userSetUp": null,
        "verifyStatus": 1,
        "isUpdateUserName": null,
        "num": 1,
        "tgIds": "",
        "lastCourseId": "34-06090",
        "lastUmcId": null,
        "unsubscribe": 0,
        "probationary": 0,
        "mobileLoginCheck": null,
        "wxMiniOpenId": null,
        "wxNickName": null,
        "follow": 0,
        "lastUpdatePasswordTime": "2022-11-23T07:26:22.000+00:00",
        "passwordErrorCount": 0,
        "isAes": 0,
        "aesPassword": null,
        "realStatus": 0,
        "realOff": 0,
        "faceToken": null,
        "productRealOff": 0,
        "productId": "24881383,24881477,24881535,24881557,24884037,24884128,24884132,24884133,24884134,24884135,24884183",
        "type": 22127,
        "state": 0,
        "valid": true,
        "parentId": 0,
        "userId": 5869730,
        "agencyId": 9772,
        "isValid": true,
        "nickName": "lily",
        "pic": "",
        "mobile": "13140982991",
        "userName": "LH13140982991",
        "ugid": 1,
        "mdomain": "szlhpx.beeeeego.com",
        "password": "053c4314eb93716073b03d00d4583ddd",
        "associated": false,
        "regFrom": 13,
        "remark": null,
        "registerTime": "2022-11-23T07:26:23.000+00:00",
        "sign": "",
        "qq": "",
        "email": "",
        "openId": null,
        "province": "江苏省",
        "city": "苏州市",
        "sex": "女",
        "realName": "王莉",
        "ticketNo": "",
        "integration": 0,
        "weChat": "",
        "born": "",
        "stuNo": "",
        "machine": "",
        "verifyCode": "",
        "verifyTimes": 0,
        "verifyTime": "2022-11-29 16:20:55",
        "sign2": "",
        "signChg": false,
        "timeOut": 0,
        "isAssociated": false,
        "isSignChg": false
    },

    async onLoad(options) {
        // const user = await api.login()
        // if (user.code == 200 && user.data) {
        //     const { token, users } = user.data
        //     this.setData({ token, users })
        //     this.token = token
        //     this.users = users

        //     api.list(this.token)

        //     this.getDetail(24884128)



        // }


        api.list(this.token)

        this.getDetail(24884128)
    },

    async getDetail(productId) {
        const detail = await api.detail({ token: this.token, courseId: '34-06090', productId })
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
        const chapter = await api.chapter({ token: this.token, courseId: '34-06090', cstId })
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
            },12000)


        }
    },

    async getPractice(child) {
        const practice = await api.practiceChapter({
            token: this.token,
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