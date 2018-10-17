// @author：jjq
// @description：调用公共API
// @date: 2018/5/14
import post from 'common/utils/fetch';
// import * as API_USER from 'common/constants/service/user';
import * as API from '../constants/api';

export default {
    // 查询当前年、季度和月
    queryCurrentDate: params => post(API.QUERY_CURRENT_DATE, params),
    // 查询项目列表
    queryProjectsList: params => post(API.QUERY_PROJECTS_LIST, params),
    // 查询大项目列表
    queryBigProjectLsit: params => post(API.QUERY_BIG_PROJECT_LIST, params),
    // 查询当前登录用户是否为项目经理
    isProjectManager: params => post(API.IS_PROJECT_MANAGER, params),
    // 在管理员列表中查询符合检索条件的用户
    queryUserInManagers: params => post(API.QUERY_USER_IN_MANAGERS, params),
    // 查询一级项目下的版本信息列表
    queryVersionTreeInProjects: params => post(API.QUERY_VERSION_TREE_IN_PRWJECTS, params),
    // 获取KPI原始数据的列表-需求响应及时率
    queryRequirementResponseSourceData: params => post(API.QUERY_REQUIREMENT_RESPONSE_SOURCE_DATA, params),
    // 获取KPI原始数据的列表-需求平均完成率
    queryRequirementFinishedSourceData: params => post(API.QUERY_REQUIREMENT_FINISHED_SOURCE_DATA, params),
    // 获取KPI原始数据的列表-大视频定制需求平均完成率
    queryVideoRequirementFinishedSourceData: params => post(API.QUERY_VIDEO_REQUIREMENT_FINISHED_SOURCE_DATA, params),
    // 查询KPI指标达标比例
    queryKpiStatusRate: params => post(API.QUERY_KPI_STATUS_RATE, params),
    // 获取首页KPI指标--我负责的项目列表
    queryKpiMyProjectsList: params => post(API.QUERY_KPI_MY_PROJECTS_LIST, params),
    // 获取首页问题工单两个列表，根据传参类型区分两个列表
    queryHomeQuestionWorkOrderList: params => post(API.QUERY_HOME_QUESTION_WORK_ORDER_LIST, params),
    // 获取首页质量度量两个列表，根据传参类型区分两个列表
    queryHomeQualityDimensionDataList: params => post(API.QUERY_HOME_QUALITY_DIMENSION_DATA_LIST, params),
    // 获取KPI指标-达标情况的列表-需求响应及时率
    queryKpiReachTimelyData: params => post(API.QUERY_KPI_REACH_TIMELY_DATA, params),
    // 获取KPI指标-达标情况的列表-需求平均完成率
    queryKpiReachFinishedData: params => post(API.QUERY_KPI_REACH_FINISHED_DATA, params),
    // 获取KPI指标-达标情况的列表-大视频定制化需求完成率
    queryKpiReachVideoFinishedData: params => post(API.QUERY_KPI_REACH_VIDEO_FINISHED_DATA, params),
    // 获取问题工单原始数据的列表
    queryQuestionOriginDataList: params => post(API.QUERY_QUESTION_ORIGIN_DATA_LIST, params),
    // 获取整体得分的数据列表
    queryWholeScoreDataList: params => post(API.QUERY_WHOLE_SCORE_DATA_LIST, params),
    // 获取维度测试的数据列表
    queryDimensionTestDataList: params => post(API.QUERY_DIMENSION_TEST_DATA_LIST, params),
    // 获取维度运维的数据列表
    queryDimensionOperationDataList: params => post(API.QUERY_DIMENSION_OPERATION_DATA_LIST, params),
    // 获取维度开发的数据列表
    queryDimensionDevelopDataList: params => post(API.QUERY_DIMENSION_DEVELOP_DATA_LIST, params),
    // 查询指定大项目下一级项目
    queryProjectsListInBigProject: params => post(API.QUERY_PROJECTS_LIST_IN_BIGPROJECT, params),
    // 查询生产率管理-数据页项目列表
    queryProductProjectList: params => post(API.QUERY_PRODUCT_PROJECT_LIST, params),
    // 获取生产率度量-生产率录入-指标的数据列表
    queryProductivityEntryCategoryDataList: params => post(API.QUERY_PRODUCTIVITY_ENTRY_CATEGORY_DATA_LIST, params),
    // 获取生产率度量-生产率录入-人力的数据列表
    queryProductivityEntryHumanDataList: params => post(API.QUERY_PRODUCTIVITY_ENTRY_HUMAN_DATA_LIST, params),
    // 获取生产率度量-生产率管理-数据页列表
    queryProductivityDataPageList: params => post(API.QUERY_PROJECT_STATISTIC_STATUS, params),
    // 获取生产率度量-生产率管理-管理页列表
    queryProductivityManagePageList: params => post(API.QUERY_MANAGE_PAGE_LIST, params),
    // // 查询生产率度量统计完成状态
    queryCompleteStatus: params => post(API.QUERY_COMPLETE_STATUS, params),
    // 启动统计
    startStatistics: params => post(API.START_STATISTICS, params),
    // 结束统计
    endStatistics: params => post(API.END_STATISTICS, params),
    // 录入项目生产率度量指标数据
    editQuotaDataValue: params => post(API.EDIT_QUOTA_DATA_VALUE, params),
    // 录入项目生产率度量人力数据
    edithumanDataValue: params => post(API.EDIT_HUMAN_DATA_VALUE, params),
    // 生产率度量中根据用户id获取用户角色权限
    productUserPrivilege: params => post(API.PRODUCT_USER_PRIVILEGE, params),
    // 生产率管理-修改统计状态
    updateStatisticStatus: params => post(API.UPDATE_STATISTIC_STATUS, params),
    // 查询当前生产率数据统计时间区间
    queryStatisticsDate: params => post(API.QUERY_STATISTICS_DATE, params),
    // 查询查询生产率管理页时间
    queryManagePageDate: params => post(API.QUERY_MANAGE_PAGE_DATE, params),
    // 生产率度量录入页面中根据用户权限获取项目列表
    queryProductInputProjects: params => post(API.QUERY_PRODUCT_INPUT_PROJECTS, params),
    // 查询生产率度量指标类型
    queryItemType: params => post(API.QUERY_ITEM_TYPE, params),
    // 查询生产率度量人力类型
    queryStaffType: params => post(API.QUERY_STAFF_TYPE, params),
    // 渲染首页-质量度量-与我有关的大项目列表
    queryBigProjectsByManager: params => post(API.QUERY_BIG_PROJECTS_BY_MANAGER, params),
    // 获取生产率数据-项目标签列表
    queryProjectTagList: params => post(API.QUERY_PROJECT_TAG_LIST, params),
    // 根据项目标签查询项目信息列表
    queryProjectsByTag: params => post(API.QUERY_PROJECT_BY_TAG, params)

};
