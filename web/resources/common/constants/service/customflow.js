/**
 * Created by issuser on 2018/6/6.
 */
const getApi = (url) => `${url}`;

const customFlowConfigService = '/CustomflowService/config';
const customFlowWorkflowService = '/CustomflowService/apply/workflow';

// 流程配置-分页查询
export const PERMISSION_FLOW_QUERY_LIST = getApi(`${customFlowConfigService}/pageQuery`);
// 流程配置-查询子流程类型列表，没有分页
export const QUERY_SUB_FLOW_TYPE_LIST = getApi(`${customFlowConfigService}/querySubflowTypeList`);
// 流程配置-表单列表数据，研发工单plus新建选择流程
export const QUERY_FLOW_FORM_LIST = getApi(`${customFlowConfigService}/queryBizformList`);
// 流程配置-详情
export const CONFIG_FLOW_QUERY_DETAIL = getApi(`${customFlowConfigService}/detailQuery`);
// 流程配置-新增
export const CREATE_CONFIG = getApi(`${customFlowConfigService}/createConfig`);
// 流程配置-编辑
export const UPDATE_CONFIG = getApi(`${customFlowConfigService}/updateConfig`);
// 流程配置-启用/禁用
export const UPDATE_FLOW_STATUS = getApi(`${customFlowConfigService}/updateStatus`);
// 上传文件地址
export const ATTACHMENT_UPLOAD = '/CustomflowService/attachment/uploadattachment';
// 移除附件
export const REMOVE_ATTACHMENT = '/CustomflowService/attachment/deleteattachment/service';
// 查询附件已经生成预览文件
export const QUERY_PREVIEW_FLAG = '/DocumentService/attachment/preview/queryflag';
// 流程配置-列表
export const FLOW_QUERY_LIST = getApi(`${customFlowConfigService}/queryConfigList`);
// 流程配置-管理权限查询，是否显示研发权限‘全部申请’
export const FLOW_QUERY_IS_ADMIN = getApi(`${customFlowConfigService}/queryFlowAdminUser`);
// 流程配置-研发权限的业务字段配置信息查询
export const QUREY_FIELDS = getApi(`${customFlowConfigService}/basicQuery`);
// 流程配置-查询下载导出配置列表
export const QUERY_EXPORT_APPLYLIST = getApi(`${customFlowConfigService}/queryExportApplyList`);
// 流程配置-查询前端页面服务地址所需的参数
export const QUERY_FRONT_PAGE_SERVICE_URL = getApi(`${customFlowConfigService}/queryFrontPageServiceUrl`);
// 流程配置-查询所有表头可配置选项
export const QUERY_TABLE_FIELD = getApi(`${customFlowConfigService}/queryTableField`);
// 流程配置-保存表头配置项
export const UPDATE_TABLE_FIELD = getApi(`${customFlowConfigService}/updateTableField`);

// 权限-列表数据(我创建的|待我处理|全部申请|我已处理)
export const PERMISSION_QUERY_LIST = '/CustomflowService/apply/pageQuery';
// 权限申请-查询待我处理的条数
export const QUERY_TO_DO_COUNT = '/CustomflowService/apply/pageQueryCount';
// 权限申请-查询详情
export const PERMISSION_QUERY_DETAIL = '/CustomflowService/apply/queryApplyInfo';
// 权限申请-新建
export const CREATE_APPLY = '/CustomflowService/apply/createApply';
// 权限申请-编辑
export const EDIT_APPLY = '/CustomflowService/apply/editApply';
// 权限申请-更新附件（申请详情中上传附件后，调用该接口）
export const UPDATE_APPLY_ATTACH = '/CustomflowService/apply/updateApplyAttach';
// 权限申请-申请状态流转操作
export const PERMISSION_HANDLE_PROCESS = getApi(`${customFlowWorkflowService}/handleProcessTask`);
// 权限申请-批量审批申请
export const PERMISSION_BAT_HANDLE_PROCESS = getApi(`${customFlowWorkflowService}/batchApproveProcessTask`);
// 权限申请-取消申请
export const PERMISSION_CANCEL_PROCESS = getApi(`${customFlowWorkflowService}/cancelProcessTask`);
// 权限申请-转交申请
export const ASSIGN_PROCESS_TASK = getApi(`${customFlowWorkflowService}/assignProcessTask`);
