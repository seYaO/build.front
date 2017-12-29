import Vue from 'vue'
import Router from 'vue-router'

const routes = [
    {
        path: '/test',
        name: 'Test',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/test'))
            }, 'test')
        }
    },
    // 登录
    {
        path: '/login',
        name: 'Login',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/users/login/index'))
            }, 'login')
        }
    },
    // 登录密码重置--- start ----------------------
    {
        path: '/reset/step1',
        name: 'ResetStep1',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/users/reset/step1'))
            }, 'resetstep1')
        }
    },
    {
        path: '/reset/step2',
        name: 'ResetStep2',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/users/reset/step2'))
            }, 'resetstep2')
        }
    },
    // 登录密码重置--- end ----------------------
    // -----------------------------------------
    // 首页（产品列表）
    {
        path: '/',
        name: 'ProductList',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/products/list/index'))
            }, 'productList')
        }
    },
    // 产品详情
    {
        path: '/product/detail/:id',
        name: 'ProductDetail',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/products/detail/index'))
            }, 'productDetail')
        }
    },
    // 保险须知
    {
        path: '/product/instruction',
        name: 'Instruction',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/others/instruction/index'))
            }, 'instruction')
        }
    },
    // 保险条款
    {
        path: '/product/clause',
        name: 'Clause',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/others/clause/index'))
            }, 'clause')
        }
    },
    // 理赔流程
    {
        path: '/product/claims',
        name: 'Claims',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/others/claims/index'))
            }, 'claims')
        }
    },
    // 客户告知书
    {
        path: '/product/inform',
        name: 'Inform',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/others/inform/index'))
            }, 'inform')
        }
    },
    // 下单页
    {
        path: '/order/fillin',
        name: 'OrderFill',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/orders/fillIn/index'))
            }, 'orderFill')
        }
    },
    // 订单列表
    {
        path: '/order/list',
        name: 'OrderList',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/orders/list/index'))
            }, 'orderList')
        }
    },
    // 订单详情
    {
        path: '/order/detail/:id',
        name: 'OrderDetail',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/orders/detail/index'))
            }, 'orderDetail')
        }
    },
    // 注册页
    {
        path: '/register',
        name: 'regist',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/users/regist/index'))
            }, 'regist')
        }
    },
    // 交易密码
    {
        path: '/dealPwd',
        name: 'dealPwd',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/pays/dealPwd/index'))
            }, 'dealPwd')
        }
    },
    // 支付/收银台
    {
        path: '/pay/:id',
        name: 'Pay',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/pays/pay/index'))
            }, 'pay')
        }
    },
    //支付成功页
    {
        path: '/pay/success/:id',
        name: 'paySuccess',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/pays/success/index'))
            }, 'paySuccess')
        }
    }
];

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/',
    routes
})
