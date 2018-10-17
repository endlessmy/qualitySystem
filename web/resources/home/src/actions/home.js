import * as C from '../constants/actions';
import Api from '../utils/api';
import createAction from 'common/utils/createAction';

export default {
    // 常用模块列表
    queryConcernAppList: createAction(C.QUERY_CONCERN_APP_LIST, Api.queryConcernAppList),
    // 是否弹出正在加载的弹出层
    isShowLoading: createAction(C.IS_SHOW_LOADING)
};
