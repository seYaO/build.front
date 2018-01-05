import request from '@/utils/request'
import * as product from '@/services/product'

export default {
    state: {
        classifys: [],
        list: [],
        totalPage: 0
    },
    getters: {
        doneProductCurr: state => index => {
            return state.classifys.map((item, i) => {
                item['curr'] = i === index ? true : false;
                return item;
            });
        }
    },
    mutations: {
        setNavBar(state, { classifys }) {
            state.classifys = classifys
        }
    },
    actions: {
        /**
         * 获取分类
         * @param {*} param0 
         * @param {*} payload 
         */
        async getClassify({ commit, state }) {
            let classifys = state.classifys;
            if(classifys.length) return
            const res = await product.classify();
            const { code, data } = res;
            commit({ type: 'setNavBar', classifys: data })
        }
    }
}