import Vue from 'vue'
import Router from 'vue-router'
import componentRoutes from './component'

import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

let routes = [
    {
        path: '/',
        name: 'HelloWorld',
        component(r) {
            require.ensure([], () => {
                r(require('@/components/HelloWorld'))
            }, 'HelloWorld')
        }
    }
]

routes = routes.concat(componentRoutes)

export default new Router({
    mode: 'history',
    routes,
})
