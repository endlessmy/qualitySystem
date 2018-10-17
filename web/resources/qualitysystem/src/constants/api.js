const getApi = url => `${url}`;

export const CODE_SUCCESS = 200;
export const CODE_SESSION_EXPIRE = 401;
export const NO_VIEW_RECORD_PERMISSION = 424;

let kpiService = '/QualityService/kpi';
let defectQualityService = '/QualityService/defect';
let commonService = '/QualityService/common';
let measureService = '/QualityService/qualityMeasure';
let productService = '/QualityService/productRate';

// 获取KPI原始数据的列表-需求响应及时率
export const QUERY_REQUIREMENT_RESPONSE_SOURCE_DATA = getApi(`${kpiService}/queryRequirementResponseSourceData`);
// 获取KPI原始数据的列表-需求平均完成率
export const QUERY_REQUIREMENT_FINISHED_SOURCE_DATA = getApi(`${kpiService}/queryRequirementFinishedSourceData`);
// 获取KPI原始数据的列表-大视频定制需求平均完成率
export const QUERY_VIDEO_REQUIREMENT_FINISHED_SOURCE_DATA = getApi(`${kpiService}/queryVideoRequirementFinishedSourceData`);
// 查询当前年、季度和月
export const QUERY_CURRENT_DATE = getApi(`${commonService}/queryCurrentDate`);
// 查询当前登录用户是否为项目经理
export const IS_PROJECT_MANAGER = getApi(`${commonService}/checkLoginUserIsProjectManager`);
// 查询项目列表
export const QUERY_PROJECTS_LIST = getApi(`${commonService}/queryProjects`);
// 查询大项目列表
export const QUERY_BIG_PROJECT_LIST = getApi(`${commonService}/queryBigProjects`);
// 在管理员列表中查询符合检索条件的用户
export const QUERY_USER_IN_MANAGERS = getApi(`${commonService}/queryManagers`);
// 查询一级项目下的版本信息列表
export const QUERY_VERSION_TREE_IN_PRWJECTS = getApi(`${commonService}/queryVersionListUnderOneLevelProject`);
// 导出需求响应及时率原始数据
export const EXPORT_KPI_RESPONSE_URL = getApi(`${kpiService}/exportRequirementResponseSourceData`);
// 导出需求平均完成率原始数据
export const EXPORT_KPI_FINISHED_URL = getApi(`${kpiService}/exportRequirementFinishedSourceData`);
// 导出大视频定制化需求完成率原始数据
export const EXPORT_KPI_VIDEO_FINISHED_URL = getApi(`${kpiService}/exportVideoRequirementFinishedSourceData`);
// 导出问题工单原始数据
export const EXPORT_QUESTION_SOURCE_DATA_URL = getApi(`${defectQualityService}/exportDefectWorkOrderSourceData`);
// 查询KPI指标达标比例
export const QUERY_KPI_STATUS_RATE = getApi(`${kpiService}/queryKpiStatusRate`);
// 获取首页KPI指标--我负责的项目列表
export const QUERY_KPI_MY_PROJECTS_LIST = getApi(`${kpiService}/queryMyProjectsRates`);
// 获取首页问题工单两个列表，根据传参类型区分两个列表
export const QUERY_HOME_QUESTION_WORK_ORDER_LIST = getApi(`${defectQualityService}/queryDefectWorkOrder`);
// 获取首页质量度量两个列表，根据传参类型区分两个列表
export const QUERY_HOME_QUALITY_DIMENSION_DATA_LIST = getApi(`${measureService}/queryOverallScoreRank`);
// 获取KPI指标-达标情况的列表-需求响应及时率
export const QUERY_KPI_REACH_TIMELY_DATA = getApi(`${kpiService}/queryRequirementResponseReachStandard`);
// 获取KPI指标-达标情况的列表-需求平均完成率
export const QUERY_KPI_REACH_FINISHED_DATA = getApi(`${kpiService}/queryRequirementFinishedReachStandard`);
// 获取KPI指标-达标情况的列表-大视频定制化需求完成率
export const QUERY_KPI_REACH_VIDEO_FINISHED_DATA = getApi(`${kpiService}/queryVideoRequirementFinishedReachStandard`);
// 获取问题工单原始数据的列表
export const QUERY_QUESTION_ORIGIN_DATA_LIST = getApi(`${defectQualityService}/queryDefectWorkOrderSourceData`);
// 获取整体得分的数据列表
export const QUERY_WHOLE_SCORE_DATA_LIST = getApi(`${measureService}/queryOverallScore`);
// 获取维度测试的数据列表
export const QUERY_DIMENSION_TEST_DATA_LIST = getApi(`${measureService}/queryTestScore4QualityMeasure`);
// 获取维度运维的数据列表
export const QUERY_DIMENSION_OPERATION_DATA_LIST = getApi(`${measureService}/queryOperationQualityMeasurement`);
// 获取维度开发的数据列表
export const QUERY_DIMENSION_DEVELOP_DATA_LIST = getApi(`${measureService}/queryDevScore4QualityMeasure`);
// 查询指定大项目下一级项目
export const QUERY_PROJECTS_LIST_IN_BIGPROJECT = getApi(`${commonService}/queryProjectsByBigProjectId`);
// 导出质量度量整体得分数据
export const EXOPRT_OVERALL_SCORE = getApi(`${measureService}/exportOverallScore`);
// 导出维度运维数据列表
export const EXPORT_OPERATION_SCORE = getApi(`${measureService}/exportOperationQualityMeasure`);
// 导出维度开发数据列表
export const EXPORT_DEVELOP_SCORE = getApi(`${measureService}/exportQualityMeasureDevData`);
// 导出维度测试数据列表
export const EXPORT_TEST_SCORE = getApi(`${measureService}/exportQualityMeasureTestData`);
// 获取生产率度量-生产率录入-指标的数据列表
export const QUERY_PRODUCTIVITY_ENTRY_CATEGORY_DATA_LIST = getApi(`${productService}/queryProjectStatisticItems`);
// 获取生产率度量-生产率录入-人力的数据列表
export const QUERY_PRODUCTIVITY_ENTRY_HUMAN_DATA_LIST = getApi(`${productService}/queryProjectStaffInfo`);
// 获取生产率度量-生产率管理-数据页列表
export const QUERY_PROJECT_STATISTIC_STATUS = getApi(`${productService}/queryProjectStatisticStatus`);
// 获取生产率度量-生产率管理-管理页列表
export const QUERY_MANAGE_PAGE_LIST = getApi(`${productService}/queryEnterPanelInfo`);
// 启动统计
export const START_STATISTICS = getApi(`${productService}/startStatistics`);
// 结束统计
export const END_STATISTICS = getApi(`${productService}/closeStatistics`);
// 查询生产率管理 - 数据页的项目列表
export const QUERY_PRODUCT_PROJECT_LIST = getApi(`${productService}/queryProductionRateManageProjects`);
// // 查询生产率度量统计完成状态
export const QUERY_COMPLETE_STATUS = getApi(`${productService}/queryStatisticCompleteStatus`);
// 录入项目生产率度量指标数据
export const EDIT_QUOTA_DATA_VALUE = getApi(`${productService}/inputProjectStatisticItems`);
// 录入项目生产率度量人力数据
export const EDIT_HUMAN_DATA_VALUE = getApi(`${productService}/inputProjectStaffInfo`);
// 生产率度量中根据用户id获取用户角色权限
export const PRODUCT_USER_PRIVILEGE = getApi(`${productService}/queryCurrUserPrivilege`);
// 生产率管理-修改统计状态
export const UPDATE_STATISTIC_STATUS = getApi(`${productService}/updateStatisticStatus`);
// 导出生产率度量数据信息
export const EXPORT_PRODUCTIVITY_DATA = getApi(`${productService}/exportStatisticsData`);
// 查询当前生产率数据统计时间区间
export const QUERY_STATISTICS_DATE = getApi(`${productService}/queryStatisticsDate`);
// 查询查询生产率管理页时间
export const QUERY_MANAGE_PAGE_DATE = getApi(`${productService}/queryEnterPanelDate`);
// 生产率度量录入页面中根据用户权限获取项目列表
export const QUERY_PRODUCT_INPUT_PROJECTS = getApi(`${productService}/queryProductionRateInputProjects`);
// 查询生产率度量指标类型
export const QUERY_ITEM_TYPE = getApi(`${productService}/queryItemType`);
// 查询生产率度量人力类型
export const QUERY_STAFF_TYPE = getApi(`${productService}/queryStaffType`);
// 渲染首页-质量度量-与我有关的大项目列表
export const QUERY_BIG_PROJECTS_BY_MANAGER = getApi(`${commonService}/queryBigProjectsByManager`);
// 获取生产率数据-项目标签列表
export const QUERY_PROJECT_TAG_LIST = getApi(`${commonService}/queryTagEntrustPartyDevelopMode`);
// 根据项目标签查询项目信息列表
export const QUERY_PROJECT_BY_TAG = getApi(`${commonService}/queryProjectsByTag`);
