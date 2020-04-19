module.exports = [{
    address: '/demo',
    method: 'get',
    template: 'demo/demo.html',
    title: 'demo',
    example: []
}, {
    address: '/panoDemo/panoDemo',
    method: 'get',
    template: 'panoDemo/panoDemo.html',
    title: '全景demo',
    example: []
}, {
    address: '/panoTemplate/panoTemplate',
    method: 'get',
    template: 'panoTemplate/panoTemplate.html',
    title: '全景模板',
    example: []
}, {
    address: "/cruisesale", //|food|shopping|wanle
    method: 'get',
    template: 'cruiseSale/cruiseSale.html',
    title: 'M站特卖页面',
    example: ["/cruisesale"]
}, {
    address: /CruiseSearchList|cruise-line-(.*).html/,
    method: 'get',
    template: 'cruiseSearchList/cruiseSearchList.html',
    title: 'M站列表页',
    example: ["/CruiseSearchList", "/cruise-line-3-0-0-0-0-0-0-0-205-1.html", "/cruise-line-3-0-0-2-0-0-0-162-0-1.html", "/cruise-line-0-0-0-0-0-0-0-0-0-1.html?lid=74", "cruise-line-0-34-2-0-0-4001-6000-0-0-2.html?lid=76"]
}, {
    address: '/zhuanti/wzxts.html',
    method: 'get',
    template: 'zhuanti/20170309/index.html',
    title: '情人节特别定制',
    example: []
}, {
    address: '/zhuanti/2017yurenjie.html',
    method: 'get',
    template: 'zhuanti/20170322/index.html',
    title: '愚人节',
    example: []
}]
