/**
 * Created by issuser on 2017/7/11.
 * 暂时还不能删除
 * 安管工单改造出问题
 */
import * as C from '../constants/actions';

const state = {
    // 工单详情内容
    detailData: {}
};
const mutations = {
    // 加载工单详情内容
    [C.QUERY_ALL_ORDER_DEATIL](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.detailData = payload.data;
    }
};
export default {
    state,
    mutations
};
