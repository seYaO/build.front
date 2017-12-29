import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

import user from './modules/user'
import product from './modules/product'
import order from './modules/order'

Vue.use(Vuex)

export default new Vuex.Store({
    // state,
    // getters,
    // actions,
    // mutations,
    modules: {
        user,
        product,
        order
    }
})