const qs = require('qs')
const { config, queryArray, NOTFOUND, Mock } = require('./common')

const { apiPrefix } = config

const EnumRoleType = {
    ADMIN: 'admin',
    DEFAULT: 'guest',
    DEVELOPER: 'developer',
}

const userPermission = {
    DEFAULT: {
        visit: ['1', '2', '21', '7', '5', '51', '52', '53'],
        role: EnumRoleType.DEFAULT,
    },
    ADMIN: {
        role: EnumRoleType.ADMIN,
    },
    DEVELOPER: {
        role: EnumRoleType.DEVELOPER,
    },
}

const adminUsers = [{
        id: 0,
        username: 'admin',
        password: 'admin',
        permissions: userPermission.ADMIN,
        departName: '管理员组',
        dptId: '123456',
        email: 'admin@ly.com',
        gender: '0',
        jobNumber: 'admin',
        name: '管理员',
        userId: '123456',
    },
    {
        id: 1,
        username: 'guest',
        password: 'guest',
        permissions: userPermission.DEFAULT,
        departName: '保险前端开发组',
        dptId: '12535',
        email: 'wl09720@ly.com',
        gender: '0',
        jobNumber: '09720',
        name: '王莉',
        userId: '12783',
    },
    {
        id: 2,
        username: 'test',
        password: '123456',
        permissions: userPermission.DEVELOPER,
        departName: 'test组',
        dptId: '123456',
        email: 'test@ly.com',
        gender: '0',
        jobNumber: 'test',
        name: 'test',
        userId: '123456',
    },
]

let database = [{
        id: '1',
        icon: 'home',
        name: '首页',
        route: '/dashboard',
    },
    {
        id: '2',
        bpid: '1',
        name: '付款审核',
        icon: 'appstore-o',
    },
    {
        id: '3',
        bpid: '1',
        name: '纠错单',
        icon: 'appstore-o',
    },
    {
        id: '31',
        bpid: '3',
        mpid: '3',
        name: '生成纠错单',
        route: '/correction/generate',
    },
    {
        id: '32',
        bpid: '3',
        mpid: '3',
        name: '纠错单列表',
        route: '/correction/list',
    },
    {
        id: '321',
        bpid: '32',
        mpid: '-1',
        name: '纠错单详情',
        route: '/correction/detail/:id',
    },
    {
        id: '3211',
        bpid: '321',
        mpid: '-1',
        name: '上传数据',
        route: '/correction/upload/:id',
    },
    {
        id: '3212',
        bpid: '321',
        mpid: '-1',
        name: '产品投保明细',
        route: '/correction/productInsurance/:id',
    },
    {
        id: '33',
        bpid: '3',
        mpid: '3',
        name: '保单同步日志',
        route: '/correction/log',
    },
    {
        id: '4',
        bpid: '1',
        name: '供应商对账',
        icon: 'appstore-o',
    },
    {
        id: '41',
        bpid: '4',
        mpid: '4',
        name: '总账单列表',
        route: '/supplierBill/total',
    },
    {
        id: '411',
        bpid: '41',
        mpid: '-1',
        name: '总账单',
        route: '/supplierBill/total/:id',
    },
    {
        id: '4111',
        bpid: '411',
        mpid: '-1',
        name: '结算产品',
        route: '/supplierBill/total/product/:id',
    },
    {
        id: '41111',
        bpid: '4111',
        mpid: '-1',
        name: '产品投保明细',
        route: '/supplierBill/total/productInsurance/:id',
    },
    {
        id: '42',
        bpid: '4',
        mpid: '4',
        name: '子账单列表',
        route: '/supplierBill/child',
    },
    {
        id: '5',
        bpid: '1',
        name: '分销对账',
        icon: 'appstore-o',
    },
    {
        id: '6',
        bpid: '1',
        name: '供应商管理',
        icon: 'appstore-o',
    },
    {
        id: '61',
        bpid: '6',
        mpid: '6',
        name: '结算信息列表',
        route: '/supplier/settlement',
    },
    {
        id: '611',
        bpid: '61',
        mpid: '-1',
        name: '查看结算信息',
        route: '/supplier/settlement/:id',
    },
    {
        id: '7',
        bpid: '1',
        name: '渠道管理',
        icon: 'appstore-o',
    },
    {
        id: '71',
        bpid: '7',
        mpid: '7',
        name: '渠道列表',
        route: '/channel/list',
    },
    {
        id: '72',
        bpid: '7',
        mpid: '7',
        name: '渠道结算信息列表',
        route: '/channel/settlement',
    },
    {
        id: '721',
        bpid: '72',
        mpid: '-1',
        name: '查看渠道结算信息',
        route: '/channel/settlement/:id',
    },
    {
        id: '8',
        bpid: '1',
        name: '审批管理',
        icon: 'appstore-o',
    },
    {
        id: '9',
        bpid: '1',
        name: '结算公司账号',
        icon: 'appstore-o',
    },
    {
        id: '91',
        bpid: '9',
        mpid: '9',
        name: '保险项目账号',
        route: '/account/insurance',
    },
]

module.exports = {

    [`POST ${apiPrefix}/user/login`](req, res) {
        const { username, password } = req.body
        const user = adminUsers.filter(item => item.username === username)

        if (user.length > 0 && user[0].password === password) {
            const now = new Date()
            now.setDate(now.getDate() + 1)
            res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
                maxAge: 900000,
                httpOnly: true,
            })
            res.json({ success: true, message: 'Ok' })
        } else {
            res.status(400).end()
        }
    },

    [`GET ${apiPrefix}/user/logout`](req, res) {
        res.clearCookie('token')
        res.status(200).end()
    },

    [`GET ${apiPrefix}/account/getUserAuth`](req, res) {
        res.cookie('access_token', '08621C75936C6AC630A16AEAFA29BA72', { maxAge: 900000, httpOnly: true,})
        res.cookie('JSESSIONID', '537b98f376c7f0809e07c48767248d84', { maxAge: 900000, httpOnly: true, path: '/settlement'})

        let response = {}
        const user = {}
        const token = {}
        token.id = 0
        response.success = true;

        if (response.success) {
            const userItem = adminUsers.filter(_ => _.id === token.id)
            let menu = database;
            
            if (userItem.length > 0) {
                user.username = userItem[0].username
                user.id = userItem[0].id

                user.dptId = userItem[0].dptId
                user.departName = userItem[0].departName
                user.email = userItem[0].email
                user.gender = userItem[0].gender
                user.jobNumber = userItem[0].jobNumber
                user.name = userItem[0].name
                user.userId = userItem[0].userId

                let permissions = userItem[0].permissions
                if(permissions.role === EnumRoleType.ADMIN || permissions.role === EnumRoleType.DEVELOPER){
                    // permissions.visit = database.map(item => item.id);
                }else{
                    menu = database.filter(item => {
                        const cases = [
                            permissions.visit.includes(item.id),
                            item.mpid ? permissions.visit.includes(item.mpid) || item.mpid === '-1' : true,
                            item.bpid ? permissions.visit.includes(item.bpid) : true,
                        ]
                        return cases.every(_ => _)
                    })
                }
            }

            response = {
                ...user,
                menuList: menu,
            }
        }
        
        res.json(response)
    },


}
