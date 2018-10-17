let jobTask = '/JobService/jobTask';
export const MODULE_PATH = __DEV__ ? 'http://localhost:4005/' : '/spms/static/project/index.html';
// 面板列表查询
export const PAGE_QUERY = `${jobTask}/queryJobBoardList`;
// 任务列表数量查询
export const PAGE_QUERY_COUNT = `${jobTask}/queryJobNumber`;
// 版本规划批量更新任务的迭代版本
export const BATCH_UPDATE_VERSION = `${jobTask}/batchUpdateVersion`;
// 新建看板任务
export const NEW_BOARD_TASK = '/JobService/jobTask/saveJobTask';
// 通过需求获取任务列表
export const QUERY_TASK_FROM_REQUIREMENT = '/JobService/jobTask/getTaskInfoByRequire';
// 获取提交历史
export const QUERY_SUBMIT_HISTORY = '/JobService/TaskOperationController/getOperationListByTaskId';
