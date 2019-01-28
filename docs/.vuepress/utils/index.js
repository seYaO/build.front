// 侧边栏配置
const genSidebarConfig = (values = [], collapsable = false) => {
    let arr = []
    values.map(item => {
        const { title, children } = item
        arr.push({ title, collapsable, children });
    })
    return arr;
}

module.exports = {
    genSidebarConfig
}