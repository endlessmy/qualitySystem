// @author: jjq
// @description:将项目看板模块constant文件夹下的api.js文件内容提取到该文件中，原api.js文件删除
// @date: 2018/5/15
const getApi = (url) => `${url}`;
const projectBoardService = '/ProjectBoardService/board';
const workflowService = '/ProjectBoardService/workflow';

// 项目信息列表查询
export const QUERY_PROJECT_LIST = getApi(
    `${projectBoardService}/queryProjectInfo`
);
// 项目看板提醒更新
export const NOTICE_UPDATE = getApi(`${projectBoardService}/remindUpdate`);
// 查询所有系统分类信息
export const QUERY_PROJECT_SYS_CATEGORY = getApi(
    `${projectBoardService}/queryProjectSysCategory`
);
// 查询所有大项目名称信息
export const QUERY_BIG_PROJECT_NAME = getApi(
    `${projectBoardService}/queryBigProjectName`
);
// 项目管理人员权限查询
export const GET_ADMIN_ROLE = getApi(`${projectBoardService}/isExistAdmin`);
// 分页查询项目更新列表
export const QUERY_PROJECT_APPLY_INFO = getApi(
    `${projectBoardService}/pageQueryProjectUpdate`
);

// 查询待我处理数量
export const QUERY_MYTODO_LIST = getApi(`${projectBoardService}/myTodoCount`);
// 获取项目看板更新详情
export const QUERY_UPDATE_DETAIL = getApi(
    `${projectBoardService}/queryUpdateDetails`
);

// 查询当前项目是否存在审批流程
export const QUERY_IS_EXIST_APPLY = getApi(
    `${projectBoardService}/isExistApply`
);
// 项目信息导入
export const IMPORT_BASE_INFO = getApi(`${projectBoardService}/importBaseInfo`);
// 项目信息导出
export const EXPORT_BASE_INFO = getApi(`${projectBoardService}/exportBaseInfo`);
// 获取项目看板信息详情
export const QUERY_PROJECT_DETAIL = getApi(
    `${projectBoardService}/projectDetails`
);
// 项目看板信息操作历史
export const QUERY_PROJECT_HISTORY = getApi(
    `${projectBoardService}/queryProjectHistory`
);
// 更新项目看板信息
export const UPDATE_PROJECT_DETAIL = getApi(
    `${projectBoardService}/updateProjectApplyInfo`
);
// 项目看板流程操作(通过、拒绝、无需更新)
export const PROJECT_BOARD_HANDLE_PROCESS = getApi(
    `${workflowService}/handleProcessTask`
);
// 项目看板流程撤销操作
export const PROJECT_BOARD_CANCLE_PROCESS = getApi(
    `${workflowService}/cancelProcessTask`
);
