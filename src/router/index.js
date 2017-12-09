import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

const routes = [
    {
        path: '/',
        name: 'Index',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/index/index'))
            }, 'index')
        }
    },
    {
        path: '/list',
        name: 'List',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/list/index'))
            }, 'list')
        }
    },
    {
        path: '/detail',
        name: 'Detail',
        component(r) {
            require.ensure([], () => {
                r(require('@/views/detail/index'))
            }, 'detail')
        }
    }
];

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: '/baoxian',
    routes
})
