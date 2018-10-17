// @author: jjq
// @description:调用公共的createAction
// @date: 2018/7/25
import * as C from '../constants/actions';
import api from '../utils/api';
import createAction from 'common/utils/createAction';

export default {
    // 查询当前登录用户是否为项目经理
    isProjectManager: createAction(C.IS_PROJECT_MANAGER, api.isProjectManager),
    // 获取在线人员
    queryUserInManagers: createAction(C.QUERY_USER_IN_MANAGERS, api.queryUserInManagers),
    // 获取项目列表
    queryProjectsList: createAction(C.QUERY_PROJECTS_LIST, api.queryProjectsList),
    // 获取KPI原始数据的列表-需求响应及时率
    queryRequirementResponseSourceData: createAction(
        C.QUERY_REQUIREMENT_RESPONSE_SOURCE_DATA,
        api.queryRequirementResponseSourceData
    ),
    // 获取KPI原始数据的列表-需求平均完成率
    queryRequirementFinishedSourceData: createAction(
        C.QUERY_REQUIREMENT_FINISHED_SOURCE_DATA,
        api.queryRequirementFinishedSourceData
    ),
    // 获取KPI原始数据的列表-大视频定制需求平均完成率
    queryVideoRequirementFinishedSourceData: createAction(
        C.QUERY_VIDEO_REQUIREMENT_FINISHED_SOURCE_DATA,
        api.queryVideoRequirementFinishedSourceData
    ),
    // 获取首页KPI指标--我负责的项目列表
    queryKpiMyProjectsList: createAction(C.QUERY_KPI_MY_PROJECTS_LIST, api.queryKpiMyProjectsList),
    // 获取首页问题工单两个列表，根据传参类型区分两个列表
    queryHomeQualityDimensionDataList: createAction(
        C.QUERY_HOME_QUALITY_DIMENSION_DATA_LIST,
        api.queryHomeQualityDimensionDataList
    ),
    // 获取首页问题工单两个列表，根据传参类型区分两个列表
    queryHomeQuestionWorkOrderList: createAction(C.QUERY_HOME_QUESTION_WORK_ORDER_LIST, api.queryHomeQuestionWorkOrderList),
    // 获取KPI指标-达标情况的列表-需求响应及时率
    queryKpiReachTimelyData: createAction(C.QUERY_KPI_REACH_TIMELY_DATA, api.queryKpiReachTimelyData),
    // 获取KPI指标-达标情况的列表-需求平均完成率
    queryKpiReachFinishedData: createAction(C.QUERY_KPI_REACH_FINISHED_DATA, api.queryKpiReachFinishedData),
    // 获取KPI指标-达标情况的列表-大视频定制化需求完成率
    queryKpiReachVideoFinishedData: createAction(C.QUERY_KPI_REACH_VIDEO_FINISHED_DATA, api.queryKpiReachVideoFinishedData),
    // 获取问题工单原始数据的列表
    queryQuestionOriginDataList: createAction(C.QUERY_QUESTION_ORIGIN_DATA_LIST, api.queryQuestionOriginDataList),
    // 获取整体得分的数据列表
    queryWholeScoreDataList: createAction(C.QUERY_WHOLE_SCORE_DATA_LIST, api.queryWholeScoreDataList),
    // 获取维度测试的数据列表
    queryDimensionTestDataList: createAction(C.QUERY_DIMENSION_TEST_DATA_LIST, api.queryDimensionTestDataList),
    // 获取维度运维的数据列表
    queryDimensionOperationDataList: createAction(C.QUERY_DIMENSION_OPERATION_DATA_LIST, api.queryDimensionOperationDataList),
    // 获取维度开发的数据列表
    queryDimensionDevelopDataList: createAction(C.QUERY_DIMENSION_DEVELOP_DATA_LIST, api.queryDimensionDevelopDataList),
    // 获取生产率度量-生产率录入-指标的数据列表
    queryProductivityEntryCategoryDataList: createAction(
        C.QUERY_PRODUCTIVITY_ENTRY_CATEGORY_DATA_LIST,
        api.queryProductivityEntryCategoryDataList
    ),
    // 获取生产率度量-生产率录入-人力的数据列表
    queryProductivityEntryHumanDataList: createAction(
        C.QUERY_PRODUCTIVITY_ENTRY_HUMAN_DATA_LIST,
        api.queryProductivityEntryHumanDataList
    ),
    // 获取生产率度量-生产率管理-数据页列表
    queryProductivityDataPageList: createAction(C.QUERY_PROJECT_STATISTIC_STATUS, api.queryProductivityDataPageList),
    // 获取生产率度量-生产率管理-管理页列表
    queryProductivityManagePageList: createAction(C.QUERY_MANAGE_PAGE_LIST, api.queryProductivityManagePageList),
    // 查询生产率管理是否为超管、QA
    productUserPrivilege: createAction(C.PRODUCT_USER_PRIVILEGE, api.productUserPrivilege),
    // 查询生产率度量指标类型
    queryItemType: createAction(C.QUERY_ITEM_TYPE, api.queryItemType),
    // 查询生产率度量人力类型
    queryStaffType: createAction(C.QUERY_STAFF_TYPE, api.queryStaffType)
};
