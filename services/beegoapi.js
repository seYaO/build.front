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
                if (res.data && res.data.code == 200 && res.data.data) {
                    resolve(res.data.data)
                    const info = res.data.data
                } else {
                    resolve(null)
                }
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
                if (res.data && res.data.code == 200 && res.data.data) {
                    // resolve(res.data.data)
                    const info = res.data.data
                    let list = []
                    info.list.map(item => {
                        list.push({
                            productId: item.productId,
                            name: item.name,
                            coverImages: item.coverImages,
                            agencyId: item.agencyId,
                        })
                    })
                    // console.log(JSON.stringify(list))
                    resolve(list)
                } else {
                    resolve(null)
                }
            }
        })
    })
}
const test = (params) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://beegoapi.beeeeego.com/mobile/course/list`,
            data: {
                productId: params.productId,
                pageNum: 1,
                pageSize: 20,
            },
            method: 'POST',
            header: {
                token: params.token
            },
            success(res) {
                if (res.data && res.data.code == 200 && res.data.data) {
                    // resolve(res.data.data.rows)
                    const info = res.data.data.rows[0].courseID
                    resolve(info)
                } else {
                    resolve(null)
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
                if (res.data && res.data.code == 200 && res.data.data) {
                    // resolve(res.data.data)
                    const info = res.data.data.cstId
                    resolve(res.data.data.cstId)
                    console.log(info, 'info')
                } else {
                    resolve(null)
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
                if (res.data && res.data.code == 200 && res.data.data) {
                    // resolve(res.data.data)
                    const info = res.data.data
                    let list = []
                    info.practiceChapter.map(item => {
                        let obj = {
                            courseId: params.courseId,
                            cstId: params.cstId,
                            "id": item.id,
                            "parentId": item.parentId,
                            catId: item.catId,
                            name: item.name,
                            linkName: item.linkName,
                            children: []
                        }
                        item.children.map(child => {
                            obj.children.push({
                                cstId: params.cstId,
                                catId: child.catId,
                                "id": child.id,
                                "parentId": child.parentId,
                                "name": child.name,
                                "linkName": child.linkName,

                                // title: child.title,
                                // "a": child.a,
                                // "b": child.b,
                                // "c": child.c,
                                // "d": child.d,
                                // "e": child.e,
                                // "f": child.f,
                                // "g": child.g,
                                // "h": child.h,
                                // "rightKey": child.rightKey,
                                // "keyType": child.keyType,
                                // "analyze": child.analyze, // 简述答案
                                // "matRef": child.matRef,
                                // "exerType": child.exerType,
                                // "source": child.source,
                                // "rightKeyList": child.rightKeyList,
                            })
                        })
                        list.push(obj)
                    })
                    // console.log('list', list)
                    resolve(list)
                } else {
                    resolve(null)
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
                if (res.data && res.data.data) {
                    const info = res.data.data
                    let list = []
                    info.exerList.map(item => {
                        let obj = {
                            title: item.title,
                            "a": item.a,
                            "b": item.b,
                            "c": item.c,
                            "d": item.d,
                            "e": item.e,
                            "f": item.f,
                            "g": item.g,
                            "h": item.h,
                            "rightKey": item.rightKey,
                            "keyType": item.keyType,
                            "analyze": item.analyze, // 简述答案
                            "matRef": item.matRef,
                            "exerType": item.exerType,
                            "source": item.source,
                            "rightKeyList": item.rightKeyList,
                        }
                        list.push(obj)
                    })
                    // console.log('list', list)
                    resolve(list)
                } else {
                    resolve(null)
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
                if (res.data && res.data.code == 200 && res.data.data) {
                    // resolve(res.data.data)
                    const info = res.data.data
                    let list = []
                    info.simExams.map(item => {
                        let obj = {
                            "examName": item.examName,
                            "specialProjectId": item.specialProjectId,
                            "projectName": item.projectName,
                            "zone": item.zone,
                            "simType": item.simType,
                        }
                        list.push(obj)
                    })
                    resolve(list)
                } else {
                    resolve(null)
                }
            }
        })
    })
}

// 模拟考试1
const mockExam = (params) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://beegoapi.beeeeego.com/mobile/mockExam/getMockExam?specialProjectId=${params.specialProjectId}&cstId=${params.cstId}&courseId=${params.courseId}&isRedo=1&simRecordType=2`,
            method: 'GET',
            header: {
                token: params.token
            },
            success(res) {
                if (res.data && res.data.code == 200 && res.data.data) {
                    // resolve(res.data.data)
                    const info = res.data.data
                    let list = []
                    info.exerList.map(item => {
                        let obj = {
                            "source": item.source,
                            "keyType": item.keyType,
                            "exerType": item.exerType,
                            "title": item.title,
                            "analyze": item.analyze,
                            "rightKey": item.rightKey,
                            "a": item.a,
                            "b": item.b,
                            "c": item.c,
                            "d": item.d,
                            "e": item.e,
                            "f": item.f,
                            "g": item.g,
                            "h": item.h,
                        }
                        list.push(obj)
                    })
                    resolve(list)
                } else {
                    resolve(null)
                }
            }
        })
    })
}

// mock数据
const mockList=()=>{
    return new Promise((resolve, reject) => {
        wx.request({
            url: `https://seyao.github.io/mock.json`,
            method: 'GET',
            success(res) {
                resolve(res.data)
            }
        })
    })
}

module.exports = {
    login,
    test,
    list,
    detail,
    chapter,
    practiceChapter,
    exam,
    mockExam,
    mockList
}