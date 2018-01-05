import request from '@/utils/request'
import * as order from '@/services/order'

export default {
    state: {
        navs: [
            { code: '', name: '全部', curr: true },
            { code: '1', name: '待支付', curr: false },
            { code: '2', name: '已支付', curr: false },
            { code: '3', name: '已关闭', curr: false }
        ],
        insureTypes: [
            { name: '个人投保', dec: '默认投保人为被保人员清单中第一个成年人', type: 'person', index: 1 },
            { name: '企业投保', dec: '企业作为投保方,后续可开企业抬头发票', type: 'enterprise', index: 2 }, // 企业
            { name: '指定投保人', dec: '', type: 'appoint', index: 0 }
        ],
        insureMethods: [
            { name: '一单一人', dec: '一张保单一个被保人', type: 'single', index: 0 }, // 个单
            { name: '一单多人', dec: '一张保单多个被保人，只能开一张发票', type: 'mass', index: 1 } // 团单
        ],
    },
    getters: {
        doneOrderCurr: state => index => {
            return state.navs.map((item, i) => {
                item['curr'] = i === index ? true : false;
                return item;
            });
        }
    },
    mutations: {},
    actions: {}
}