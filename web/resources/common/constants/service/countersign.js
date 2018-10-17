/**
 * @name 文件会签url
 * @author shenah
 * @dete 2018/05/16
 */
const getApi = (url) => `${url}`;

const CounterWorkflowService = '/CountersignService/workflow';
const CounterSignService = '/CountersignService/sign';
const CounterSignAttachmentService = '/CountersignService/attachment';

// 新建会签
export const CREATE_COUNTERSIGN = getApi(`${CounterSignService}/create`);
// 编辑会签
export const UPDATE_COUNTERSIGN = getApi(`${CounterSignService}/update`);
// 获取会签详情
export const QUERY_COUNTERSIGN_DETAIL = getApi(`${CounterSignService}/queryDetail`);
// 会签文件上传
export const UPLOAD_COUNTERSIGN_ATTACH = getApi(`${CounterSignService}/uploadAttach`);
// 删除会签文件
export const REMOVE_ATTACHMENT = getApi(`${CounterSignAttachmentService}/deleteattachment`);
// 获取会签文件列表
export const QUERY_COUNTERSIGN_LISTS = getApi(`${CounterSignService}/pageQuery`);
// 获取会签人
export const QUERY_SIGNER = getApi(`${CounterSignService}/querySignUserList`);
// 编辑会签人列表
export const UPDATE_COUNTERSIGN_USER_LIST = getApi(`${CounterSignService}/updateSignUserList`);
// 编辑知会人列表
export const UPDATE_CC_USER_LIST = getApi(`${CounterSignService}/updateCCUserList`);
// 查询知会人列表
export const QUERY_SIGN_CC_LIST = getApi(`${CounterSignService}/querySignCCList`);
// 查询会签待我处理总数
export const MY_TODO_COUNTERSIGN_COUNTS = getApi(`${CounterSignService}/myTodoCount`);
// 删除会签人
export const DELETE_SIGN_USER = getApi(`${CounterSignService}/deleteSignUser`);
// 我可关联的会签列表
export const QUERY_MY_RELATED_COUNTERSIGN = getApi(`${CounterSignService}/queryMyRelatedCountersign`);
// 会签流程操作
export const COUNTERSIGN_HANDLE_PROCESS = getApi(`${CounterWorkflowService}/handleProcessTask`);
// 会签撤销操作
export const COUNTERSIGN_CANCEL_PROCESS = getApi(`${CounterWorkflowService}/cancelProcessTask`);
