// @author: dengxue
// @date: 04/05/2018
import utils from 'common/utils/misc';
const feedbackService = '/FeedbackService/feedback';
const workflowService = '/FeedbackService/workflow';

// 待我处理数量
export const TODO_COUNT = `${feedbackService}/pageQueryCount`;
// 获取反馈详情
export const QUERY_FEEDBACK_DETAIL = `${feedbackService}/queryFeedbackInfo`;
// 增加评论
export const FEEDBACK_ADD_COMMENT = `${feedbackService}/commentFeedback`;
// 列表数据（不包含我已处理）
export const FEEDBACK_QUERY_LIST = `${feedbackService}/pageQuery`;
// 我已处理列表
export const DONE_QUERY_LIST = `${feedbackService}/hisPageQuery`;
// 热线电话记录列表
export const HOT_LINE_LIST = '/FeedbackService/hotlineCall/pageQuery';
// 查询热线问题记录详情
export const QUERY_QUESTION_DETAIL = '/FeedbackService/hotlineCall/queryDetail';
// 热线记录问题编辑
export const HOT_LINE_EDIT = '/FeedbackService/hotlineCall/update';
// 来电公司列表
export const CALLER_COMPANY_LIST = '/FeedbackService/hotlineCall/queryCallerCompany';
// 受理项目组列表
export const HANDLER_GROUP_LIST = '/FeedbackService/hotlineCall/queryHandlerGroup';
// 用户反馈统计
export const QUERY_FEEDBACK_STATISTICS = `${feedbackService}/queryFeedbackStatistics`;
// 产品列表
export const QUERY_PRODUCT_LIST = `${feedbackService}/queryProductList`;
// 创建反馈
export const CREATE_FEEDBACK = `${feedbackService}/createFeedback`;
// 更新反馈
export const EDIT_FEEDBACK = `${feedbackService}/editFeedback`;
// 更新附件
export const UPDATE_ATTACH = `${feedbackService}/updateFeedbackAttach`;
// 上传文件地址
export const ATTACHMENT_UPLOAD = `${feedbackService}/uploadAttach`;
// 附件删除
export const FEEDBACK_DELETE_ATTACH = '/FeedbackService/attachment/deleteattachment';
// 文件导出
export const EXPORT_EXCEL = `${feedbackService}/exportExcel`;
// 富文本上传图片的url
// export const UPLOAD_IMAGE_URL = window.config.context + '/FeedbackService/feedback/uploadPic?sessionId=' + window.localStorage.sessionId;
export const UPLOAD_IMAGE_URL = window.config.context + '/FeedbackService/feedback/uploadPic?sessionId=' + utils.getLoginUserInfo('sessionId');

// 系统设置
// 查询是否为系统接口人或者审批人
export const QUERY_IS_SYSTEM_CONTACT = `${feedbackService}/queryIsSystemContact`;
// 接口人和审批人查询
export const QUERY_CONFIGURATION = `${feedbackService}/queryConfiguration`;
// 保存系统接口人审批人
export const CREATE_CONFIGURATION = `${feedbackService}/createConfiguration`;
// 设置阳光项目
export const CHANGE_SUN_PROJECT = `${feedbackService}/addProductGroup`;
// 查询阳光项目
export const QUERY_SUN_PROJECT = `${feedbackService}/queryProductGroup`;
// 校验是否是阳光计划产品
export const CHECK_SUNSHINE_PEODUCT = `${feedbackService}/checkSunshineProduct`;
// 系统设置 end

// 用户反馈流程操作(通过、拒绝等等)
export const FEEDBACK_HANDLE_PROCESS = `${workflowService}/handleProcessTask`;
// 状态流转 -- 转交
export const FEEDBACK_TRANSMIT_STATUS = `${workflowService}/assigneeProcessTask`;
// 批量转交
export const FEEDBACK_NUMBERS_TRANSMIT_STATUS = `${workflowService}/assigneeBatchProcessTask`;
// 取消操作
export const FEEDBACK_CANCEL_STATUS = `${workflowService}/cancelProcessTask`;
