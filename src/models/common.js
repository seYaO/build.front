import modelExtend from 'dva-model-extend'
import * as app from 'services/app'

const model = {
    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        },

        // 显示弹框
        showModal(state, { payload }) {
            return { ...state, ...payload, modalVisible: true }
        },

        // 隐藏弹框
        hideModal(state) {
            return { ...state, modalVisible: false }
        },
    },
}

const pageModel = modelExtend(model, {

    state: {
        list: [],
        pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            current: 1,
            total: 0,
            pageSize: 10,
        },
    },

    // 异步 - 接收数据
    effects: {

    },

    // 同步 - 处理数据
    reducers: {
        querySuccess(state, { payload }) {
            const { list, pagination } = payload
            return {
                ...state,
                list,
                pagination: {
                    ...state.pagination,
                    ...pagination,
                },
            }
        },
    },

})


module.exports = {
    model,
    pageModel,
}
