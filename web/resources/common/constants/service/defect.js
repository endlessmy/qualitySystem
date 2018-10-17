// @author: 邓英锋
// @date: 25/05/2018
// modify：lzh

const getApi = url => `${url}`;

export const MODULE_PATH = __DEV__ ? 'http:// localhost:4000/' : '/spms/static/defect/index.html';

let DefectService = '/DefectService/defect';
let DefectFlow = '/DefectService/workflow';

// 2.1.0
// 缺陷分页查询
export const DEFECT_QUERY_LIST = getApi(`${DefectService}/pageQuery`);

// 缺陷记录总数查询
export const PAGE_QUERY_COUNT = getApi(`${DefectService}/queryCount`);

// 版本规划批量修改缺陷的期望解决版本
export const BATCH_UPDATE_VERSION = getApi(`${DefectService}/batchUpdateHopeSolveVersion`);

// old
// 缺陷导出
export const DEFECT_EXPORT_EXCEL = getApi(`${DefectService}/exportExcel`);

// 查询审批
export const QUERY_APPROVAL = getApi(`${DefectService}/queryApproveUserList`);

// 新建缺陷
export const CREATE_DEFECT = getApi(`${DefectService}/create`);

// 更新缺陷
export const UPDATE_DEFECT = getApi(`${DefectService}/update`);

// by @qqli 20180119 v1.8.10.1
// 查询所有缺陷列表, 拒绝选重复时查询缺陷单号
export const DEFECT_QUERY_ALL_LIST = getApi(`${DefectService}/queryAllDefect`);

// 我已处理列表
export const DEFECT_DONE_QUERY_LIST = getApi(`${DefectService}/processedQuery`);

// 详情页/编辑 查询缺陷详情
export const DEFECT_QUERY_DETAIL = getApi(`${DefectService}/queryDetail`);

// 增加评论
export const DEFECT_ADD_COMMENT = getApi(`${DefectService}/addComment`);

// 状态流转 -- 一般流程
export const DEFECT_UPDATE_STATUS = getApi(`${DefectFlow}/handleProcess`);
// 状态流转 -- 转交
export const DEFECT_TRANSMIT_STATUS = getApi(`${DefectFlow}/assigneeDefect`);
// 状态流转 -- 关闭
export const DEFECT_CLOSE_STATUS = getApi(`${DefectFlow}/closeDefect`);

// 统计查询
export const DEFECT_STATISTICS = getApi(`${DefectService}/queryStatistics`);

// 附件上传
export const ATTACHMENT_UPLOAD = getApi(`${DefectService}/uploadAttach`);

// 附件删除
export const ATTACHMENT_REMOVE = getApi('/DefectService/attachment/deleteattachment');

// 获取带我处理的数量
export const MY_TO_DO_COUNT = getApi(`${DefectService}/mytodocount`);

// 缺陷统计的导出
export const DEFECT_STATISTICS_EXPORT = getApi(`${DefectService}/statisticsExportExcel`);

// 查询缺陷分析的问题根因和解决方案
export const QUERY_DEFECT_ANALYSIS = getApi(`${DefectService}/queryQuestionSolveScheme`);

// 项目看板详情中统计累计解决现网缺陷数量
export const COUNT_FOR_PROJECT_BOARD = getApi('/DefectService/statistics/countForProjectBoard');

// 缺陷批量导入
export const BACH_IMPORT_DEFECT = getApi(`${DefectService}/batchImport/excel`);

// 缺陷批量导入模板下载
export const DEFECT_IMPORT_TEMPLATE = getApi(`${DefectService}/batchImport/downloadImportTemplate/`);

// 查看缺陷批量导入结果
export const DEFECT_IMPORT_RESULT_EXPORT = getApi(`${DefectService}/batchImport/downloadImportFailedFile/`);

// 转交缺陷给其他项目
export const REASSIGN_DEFECT = getApi(`${DefectService}/reassign`);
// 查询测试系统测试用例详情，用于测试系统跳转新建项目内缺陷
export const TEST_CASE_DETAIL = '/TestCaseService/case/queryDetail';
