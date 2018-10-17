/**
 * Created by qqli on 2017/6/25.
 */

const state = {
    todoLoading: false
};

const mutations = {
    startLoading(state) {
        state.todoLoading = true;
    },
    endLoading(state) {
        state.todoLoading = false;
    }
};

export default {
    state,
    mutations
};
