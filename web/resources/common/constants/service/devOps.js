const devops = '/DevopsService/devops';

// 2.2.2
// 查询流水线配置数量
export const QUERY_PIPELINE_COUNT = `${devops}/queryPipelineCount`;

// 流水线构建日志查询
export const GET_BUILDING_LOG = `${devops}/getBuildingLog`;

// 查询列表步骤报告链接
export const QUERY_LOG_URL = `${devops}/queryLogUrl`;

// 查询流水线是否正在执行
export const QUERY_EXECUTEING_PIPELINE = `${devops}/queryExecutingPipeline`;

// 流水线手动执行
export const MANUA_EXECUTE = `${devops}/manualExecute`;

// 流水线执行统计数据查询
export const QUERY_DEVOPS_EXECUTE_STATISTIC_DATA = `${devops}/queryPipelineExecuteStatisticData`;

// 流水线执行记录列表查询
export const QUERY_DEVOPS_EXECUTE_LIST = `${devops}/queryPipelineExecuteList`;

// 流水线列表查询
export const QUERY_PIPELINE_LIST = `${devops}/queryPipelineList`;

// 流水线删除
export const DELETE_PIPELINE = `${devops}/deletePipeline`;

// 编辑流水线
export const UPDATE_PIPELINE = `${devops}/updatePipeline`;

// 最近的执行流水线查询
export const QUERY_LATEST_PIPELINE = `${devops}/queryLatestPipeline`;

// 流水线保存
export const SAVE_PIPELINE = `${devops}/savePipeline`;

// 流水线试构建
export const TRY_BUILDING = `${devops}/trybuilding`;

// 查询仓库分支
export const QUERY_BRANCH = `${devops}/queryBranch`;

// 查询详情
export const QUERY_PIPELINE_DETAIL = `${devops}/queryPipelineDetail`;

// 获取构建日志
export const GET_TRYBUILDING_LOG = `${devops}/getBuildingLog`;
