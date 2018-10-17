/**
 * Created by qqli on 2017/6/25.
 */
const state = {
    mycreatedLoading: false
};

const mutations = {
    mycreatedStartLoading(state) {
        state.mycreatedLoading = true;
    },
    mycreatedEndLoading(state) {
        state.mycreatedLoading = false;
    }
};

export default {
    state,
    mutations
};
