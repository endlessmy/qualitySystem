// const getApi = (url) => `${window.config.context}${url}`;
export const MODULE_PATH = __DEV__ ? 'http://localhost:2000/' : '/spms/static/task/index.html';

const getApi = url => `${url}`;

const taskService = '/TaskService';

// 查询任务分页列表
export const QUERY_ASSIGN_LIST = getApi(`${taskService}/task/mycreatlist`);
export const QUERY_ONGOING_LIST = getApi(`${taskService}/task/mytodolist`);
export const QUERY_DONE_LIST = getApi(`${taskService}/task/myhisotrylist`);
export const QUERY_NOTICE_LIST = getApi(`${taskService}/task/mycclist`);

// 创建任务
export const TASK_CREATE = getApi(`${taskService}/task/create`);

// 更新任务
export const TASK_UPDATED = getApi(`${taskService}/task/update`);

// 附件上传
export const ATTACHMENT_UPLOAD = getApi(`${taskService}/task/uploadAttach`);

// 附件删除
export const ATTACHMENT_REMOVE = getApi(`${taskService}/task/deleteattachment`);

// 查看任务详情
export const TASK_DETAIL_QUERY = getApi(`${taskService}/task/querydetail`);

// 增加评论
export const TASK_COMMENT_ADDED = getApi(`${taskService}/taskcomment/create`);

// 扭转流程接口
export const TASK_STATUS_UPDATED = getApi(`${taskService}/task/handletask`);

// 统计消息
export const TASK_QUERY_TODO_MSG = getApi(`${taskService}/task/mytodolistcount`);

export const UPDATE_ATTACH = getApi(`${taskService}/task/updateAttach`);
// 附件已经生成预览文件查询
export const PREVIEW_QUERY_FLAG = getApi('/DocumentService/attachment/preview/queryflag');
