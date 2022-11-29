import regeneratorRuntime from '../utils/regenerator-runtime'
const beegoapi = 'https://beegoapi.beeeeego.com/mobile'

// 登录
const login = () => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://beegoapi.beeeeego.com/mobile/user/login?username=LH13140982991&password=053c4314eb93716073b03d00d4583ddd&platForm=3&agencyId=9772`,
            method: 'GET',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                resolve(res.data)
            }
        })
    })
}

// 课程列表
const list = (token = '') => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://beegoapi.beeeeego.com/mobile/product/getUserProductList?courseName=&pageNum=1&pageSize=20`,
            method: 'GET',
            header: { token },
            success(res) {
                // console.log(res.data)
                if (res.data && res.data.data && res.data.data.list) {
                    // console.log('list', res.data.data.list)
                }
            }
        })
    })
}

// 课程详情
const detail = (params) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://beegoapi.beeeeego.com/mobile/course/courseDetail?courseId=${params.courseId}&productId=${params.productId}`,
            method: 'GET',
            header: {
                token: params.token
            },
            success(res) {
                resolve(res.data)
                if (res.data && res.data.data) {
                    // console.log('courseInformationList', res.data.data.courseInformationList)
                }
            }
        })
    })
}

// 章节练习
const chapter = (params) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://beegoapi.beeeeego.com/mobile/course/chapter`,
            data: {
                courseId: params.courseId,
                cstId: params.cstId
            },
            method: 'POST',
            header: {
                token: params.token
            },
            success(res) {
                resolve(res.data)
                if (res.data && res.data.data) {
                    // console.log('chapter', res.data.data)
                }
            }
        })
    })
}

// 每小节练习题
const practiceChapter = (params) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://beegoapi.beeeeego.com/mobile/course/practice`,
            data: {
                "isRedo": 1,
                "scoringMethod": "1",
                "lastPosition": "0",
                courseId: params.courseId,
                cstId: params.cstId,
                catId: params.catId,
                linkName: params.linkName,
                name: params.name,
            },
            method: 'POST',
            header: {
                token: params.token
            },
            success(res) {
                resolve(res.data)
                if (res.data && res.data.data) {
                    // console.log('practice', res.data.data)
                }
            }
        })
    })
}

// 模拟考试
const exam = (params) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://beegoapi.beeeeego.com/mobile/mockExam/getCourseOtherDate?courseId=${params.courseId}`,
            method: 'GET',
            header: {
                token: params.token
            },
            success(res) {
                resolve(res.data)
                if (res.data && res.data.data) {
                    // console.log('courseInformationList', res.data.data.courseInformationList)
                }
            }
        })
    })
}

// 模拟考试1
const mockExam = (params) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://beegoapi.beeeeego.com/mobile/mockExam/getMockExam?specialProjectId=130012&cstId=10393&courseId=34-06090&isRedo=1&simRecordType=2`,
            method: 'GET',
            header: {
                token: params.token
            },
            success(res) {
                resolve(res.data)
                if (res.data && res.data.data) {
                    // console.log('courseInformationList', res.data.data.courseInformationList)
                }
            }
        })
    })
}

module.exports = {
    login,
    list,
    detail,
    chapter,
    practiceChapter,
    exam,
    mockExam
}