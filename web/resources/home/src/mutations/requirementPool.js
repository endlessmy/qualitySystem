// 首页待办-业务需求模块多个弹窗使用
// 不能删除
import * as C from '../constants/actions';
import {} from '../constants/const';

const state = {
    versionTree: []
};

const mutations = {
    [C.REQUIREMENT_VERSION_TREE](state, {
        payload,
        error
    }) {
        if (error) return;
        state.versionTree = payload.result;
    }
};

export default {
    state,
    mutations
};
