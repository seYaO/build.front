import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
import { arrayToTree, queryArray } from 'utils'
import pathToRegexp from 'path-to-regexp'

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
    if (typeof icon === 'string' && icon.indexOf('http') === 0) {
        return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
    }
    if (typeof icon === 'string') {
        return <Icon type={icon} />;
    }
    return icon;
};
// conversion Path
// 转化路径
const conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
        return path;
    } else {
        return `/${path || ''}`.replace(/\/+/g, '/');
    }
}

class Menus extends PureComponent {
    constructor(props) {
        super(props);
    }

    /**
     * 判断是否是http链接.返回 Link 或 a
     * Judge whether it is http link.return a or Link
     * @memberof SiderMenu
     */
    getMenuItemPath = item => {
        const { isMobile, location, onCollapse } = this.props;
        const itemPath = conversionPath(item.route);
        const icon = getIcon(item.icon);
        const { target, name } = item;
        // Is it a http link
        if (/^https?:\/\//.test(itemPath)) {
            return (
                <a href={itemPath} target={target}>
                    {icon}
                    <span>{name}</span>
                </a>
            );
        }
        return (
            <Link to={itemPath} target={target} replace={itemPath === location.pathname} onClick={isMobile ? () => onCollapse(true) : undefined}>
                {icon}
                <span>{name}</span>
            </Link>
        );
    };

    /**
     * 递归生成菜单
     */
    getMenus = (menuTreeN, siderFoldN) => {
        return menuTreeN.map(item => {
            if (item.children) {
                if (item.mpid) {
                    levelMap[item.id] = item.mpid
                }
                return (
                    <Menu.SubMenu
                        key={item.id}
                        title={
                            <span>
                                {getIcon(item.icon)}
                                {(!siderFoldN || !menuTree.includes(item)) && item.name}
                            </span>
                        }
                    >
                        {this.getMenus(item.children, siderFoldN)}
                    </Menu.SubMenu>
                )
            }
            return (
                <Menu.Item key={item.id}>
                    <Link to={item.route || '#'} style={siderFoldN ? { width: 10 } : {}}>
                        {getIcon(item.icon)}
                        {item.name}
                    </Link>
                </Menu.Item>
            )
        })
    }

    render() {
        const { siderFold, darkTheme = true, navOpenKeys, changeOpenKeys, menu, location, } = this.props;

        // 生成树状
        const menuTree = arrayToTree(menu.filter(_ => _.mpid !== '-1'), 'id', 'mpid')
        const levelMap = {}

        const menuItems = this.getMenus(menuTree, siderFold)

        // 保持选中
        const getAncestorKeys = (key) => {
            let map = {}
            const getParent = (index) => {
                const result = [String(levelMap[index])]
                if (levelMap[result[0]]) {
                    result.unshift(getParent(result[0])[0])
                }
                return result
            }
            for (let index in levelMap) {
                if ({}.hasOwnProperty.call(levelMap, index)) {
                    map[index] = getParent(index)
                }
            }
            return map[key] || []
        }

        const onOpenChange = (openKeys) => {
            const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key))
            const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key))
            let nextOpenKeys = []
            if (latestOpenKey) {
                nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
            }
            if (latestCloseKey) {
                nextOpenKeys = getAncestorKeys(latestCloseKey)
            }
            changeOpenKeys(nextOpenKeys)
        }

        let menuProps = !siderFold ? {
            onOpenChange,
            openKeys: navOpenKeys,
        } : {}

        // 寻找选中路由
        let currentMenu
        let defaultSelectedKeys
        for (let item of menu) {
            if (item.route && pathToRegexp(item.route).exec(location.pathname)) {
                currentMenu = item
                break
            }
        }
        const getPathArray = (array, current, pid, id) => {
            let result = [String(current[id])]
            const getPath = (item) => {
                if (item && item[pid]) {
                    result.unshift(String(item[pid]))
                    getPath(queryArray(array, item[pid], id))
                }
            }
            getPath(current)
            return result
        }
        if (currentMenu) {
            defaultSelectedKeys = getPathArray(menu, currentMenu, 'mpid', 'id')
        }

        if (!defaultSelectedKeys) {
            defaultSelectedKeys = ['1']
        }

        return (
            <Menu
                {...menuProps}
                key="Menu"
                mode="inline"
                theme="dark"
                selectedKeys={defaultSelectedKeys}
            >
                {menuItems}
            </Menu>
        )
    }
}

Menus.propTypes = {
    menu: PropTypes.array,
    siderFold: PropTypes.bool,
    darkTheme: PropTypes.bool,
    navOpenKeys: PropTypes.array,
    changeOpenKeys: PropTypes.func,
    location: PropTypes.object,
}

export default Menus
