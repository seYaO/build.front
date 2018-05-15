const { config } = require('./common')

const { apiPrefix } = config

let database = [
    {
        id: '1',
        bpid: '1',
        icon: 'dashboard',
        name: 'Dashboard',
    },
    {
        id: '11',
        mpid: '-1',
        bpid: '1',
        name: '分析页',
        route: '/dashboard/analysis',
    },
    {
        id: '12',
        mpid: '-1',
        bpid: '1',
        name: '监控页',
        route: '/dashboard/monitor',
    },
    {
        id: '13',
        mpid: '-1',
        bpid: '1',
        name: '工作台',
        route: '/dashboard/workplace',
    },
    {
        id: '2',
        bpid: '1',
        name: 'form',
        icon: 'form',
    },
    {
        id: '21',
        bpid: '2',
        mpid: '2',
        name: '基础表单',
        route: '/form/basic',
    },
    {
        id: '22',
        bpid: '2',
        mpid: '2',
        name: '分步表单',
        route: '/form/step',
    },
    {
        id: '23',
        bpid: '2',
        mpid: '2',
        name: '高级表单',
        route: '/form/advanced',
    },
    {
        id: '3',
        bpid: '1',
        name: 'list',
        icon: 'list',
    },
    {
        id: '31',
        bpid: '3',
        mpid: '3',
        name: '查询表格',
        route: '/list/table',
    },
    {
        id: '32',
        bpid: '3',
        mpid: '3',
        name: '标准列表',
        route: '/list/basic',
    },
    {
        id: '33',
        bpid: '3',
        mpid: '3',
        name: '卡片列表',
        route: '/list/card',
    },
    {
        id: '34',
        bpid: '3',
        mpid: '3',
        name: '搜索列表',
        route: '/list/search',
    },
    {
        id: '341',
        bpid: '34',
        mpid: '34',
        name: '搜索列表（文章）',
        route: '/list/search/articles',
    },
    {
        id: '342',
        bpid: '34',
        mpid: '34',
        name: '搜索列表（项目）',
        route: '/list/search/projects',
    },
    {
        id: '343',
        bpid: '34',
        mpid: '34',
        name: '搜索列表（应用）',
        route: '/list/search/applications',
    },
    {
        id: '4',
        bpid: '1',
        name: 'profile',
        icon: 'profile',
    },
    {
        id: '41',
        bpid: '4',
        mpid: '4',
        name: '基础详情页',
        route: '/profile/basic',
    },
    {
        id: '42',
        bpid: '4',
        mpid: '4',
        name: '高级详情页',
        route: '/profile/advanced',
    },
    {
        id: '5',
        bpid: '1',
        name: 'result',
        icon: 'check-circle-o',
    },
    {
        id: '51',
        bpid: '5',
        mpid: '5',
        name: '成功',
        route: '/result/success',
    },
    {
        id: '52',
        bpid: '5',
        mpid: '5',
        name: '失败',
        route: '/result/fail',
    },
    {
        id: '6',
        bpid: '1',
        name: 'exception',
        icon: 'warning',
    },
    {
        id: '61',
        bpid: '6',
        mpid: '6',
        name: '403',
        route: '/exception/403',
    },
    {
        id: '62',
        bpid: '6',
        mpid: '6',
        name: '404',
        route: '/exception/404',
    },
    {
        id: '63',
        bpid: '6',
        mpid: '6',
        name: '500',
        route: '/exception/500',
    },
    {
        id: '64',
        bpid: '6',
        mpid: '-1',
        name: '触发异常',
        route: '/exception/trigger',
    },
]

module.exports = {

    [`GET ${apiPrefix}/menus`](req, res) {
        res.status(200).json(database)
    },
}