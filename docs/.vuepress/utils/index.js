// 侧边栏配置
const genSidebarConfig = (title, children = ['']) => {
    return [
        {
            title,
            collapsable: false,
            children
        }
    ]
}

module.exports = {
    genSidebarConfig
}