/**
 * Created by qqli on 2017/6/25.
 */
import * as C from '../constants/actions';
import api from 'common/utils/api';
import createAction from 'common/utils/createAction';

export default {
    // 待办事项
    startLoading: createAction('startLoading'),
    endLoading: createAction('endLoading'),
    // 获取包含子版本的版本列表
    queryVersionTree: createAction(C.REQUIREMENT_VERSION_TREE, api.queryVersionTree)
};
