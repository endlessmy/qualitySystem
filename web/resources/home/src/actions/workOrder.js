/**
 * Created by issuser on 2017/7/11.
 */
import * as C from '../constants/actions';
import createAction from 'common/utils/createAction';
import Api from '../utils/api';

export default {
    // 查询工单详情，根据返回结果判断工单所处的状态及可以执行的操作
    queryTodoOrderDeatil: createAction(C.QUERY_ALL_ORDER_DEATIL, Api.queryTodoOrderDeatil)
};
