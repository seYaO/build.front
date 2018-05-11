import { routerRedux } from 'dva/router'
import config from 'config'
import { EnumRoleType } from 'enums'
import { query, logout } from 'services/app'
import queryString from 'query-string'

const { prefix } = config

export default {
    namespace: 'app',
    state: {
        // 用户信息
        user: {},
        // 菜单列表
        menu: [
            {
                id: 1,
                icon: 'home',
                name: '首页',
                router: '/dashboard',
            },
        ],
        menuPopoverVisible: false,
        siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
        darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
        isNavbar: document.body.clientWidth < 769,
        navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
        locationPathname: '',
        locationQuery: {},
    },

    // 订阅 - 监听数据
    subscriptions: {
        // subscriptions: {}
        // ({ dispatch, history }, done) => unlistenFunction

        setupHistory({ dispatch, history }) {
            history.listen((location) => {
                dispatch({
                    type: 'updateState',
                    payload: {
                        locationPathname: location.pathname,
                        locationQuery: queryString.parse(location.search),
                    },
                })
            })
        },

        setup({ dispatch }) {
            dispatch({ type: 'query' })
            let tid
            window.onresize = () => {
                clearTimeout(tid)
                tid = setTimeout(() => {
                    dispatch({ type: 'changeNavbar' })
                }, 300)
            }
        },

    },

    // 异步 - 接收数据
    effects: {
        // effects: {} 
        // *(action, effects) => void 或者 [*(action, effects) => void, { type }]
        // 例如 *query({ payload = {} }, { call, put, select }) => {}
        // call 用于调用异步逻辑，支持promise
        // put 用于触发action
        // select 用于从state里获取数据

        // 判断是否登录
        // 用户登录信息河菜单数据
        * query({ payload, }, { call, put, select }) {
            const { success, message, statusCode, menuList = [], ...other } = yield call(query, payload)
            const { locationPathname } = yield select(_ => _.app)

            if (success && other) {
                let menu = menuList
                yield put({
                    type: 'updateState',
                    payload: {
                        user: other,
                        menu,
                    },
                })
                if (location.pathname === '/login') {
                    yield put(routerRedux.push({
                        pathname: '/dashboard',
                    }))
                }
            } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
                yield put(routerRedux.push({
                    pathname: '/login',
                    search: queryString.stringify({
                        from: locationPathname,
                    }),
                }))
            }
        },

        // 退出
        * logout({ payload, }, { call, put }) {
            const data = yield call(logout, queryString.parse(payload))
            if (data.success) {
                yield put({ type: 'query' })
            } else {
                throw (data)
            }
        },

        * changeNavbar(action, { put, select }) {
            const { app } = yield (select(_ => _))
            const isNavbar = document.body.clientWidth < 769
            if (isNavbar !== app.isNavbar) {
                yield put({ type: 'handleNavbar', payload: isNavbar })
            }
        },

    },

    // 同步 - 处理数据
    reducers: {
        // reducers: {} 
        // (state, action) => state

        // 更新state
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },

        // 放大/缩小 - 菜单栏
        switchSider(state) {
            window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
            return {
                ...state,
                siderFold: !state.siderFold,
            }
        },

        // 主题切换
        switchTheme(state) {
            window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
            return {
                ...state,
                darkTheme: !state.darkTheme,
            }
        },

        switchMenuPopver(state) {
            return {
                ...state,
                menuPopoverVisible: !state.menuPopoverVisible,
            }
        },

        // 显示/隐藏 - 菜单栏
        handleNavbar(state, { payload }) {
            return {
                ...state,
                isNavbar: payload,
            }
        },

        handleNavOpenKeys(state, { payload: navOpenKeys }) {
            return {
                ...state,
                ...navOpenKeys,
            }
        },
    },
}