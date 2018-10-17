import * as C from '../constants/actions';

const state = {
    appTypes: {
        commonAppList: [] // 常用应用 6个
    },
    distributComponents: [],
    isLoading: false,
    userList: [],
    projectDetail: {}
};

const mutations = {
    // 是否显示加载的弹出框
    [C.IS_SHOW_LOADING](state, { payload, error }) {
        if (error) return;
        state.isLoading = payload;
    },
    // 应用
    [C.QUERY_CONCERN_APP_LIST](state, { payload, error }) {
        if (error) {
            return;
        }
        state.appTypes.commonAppList = payload.result.slice(0, 6);
    }
};

export default {
    state,
    mutations
};
