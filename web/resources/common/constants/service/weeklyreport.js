const getApi = url => `${url}`;
// 我的周报服务的前缀
const minWeeklyreportService = '/WeeklyreportService/mine';
// 员工周报服务的前缀
const employeeWeeklyreportService = '/WeeklyreportService/employee';
// 用户权限周报服务的前缀
const authorityWeeklyreportService = '/WeeklyreportService/authority';

/**
 * 我的周报相关的地址
 */
// 保存草稿
export const SAVE_DRAFT = getApi(`${minWeeklyreportService}/saveDraft`);
// 提交周报
export const SUMMIT_REPORT = getApi(`${minWeeklyreportService}/submitReport`);
// 分页查询我的周报信息
export const PAGE_QUERY = getApi(`${minWeeklyreportService}/pageQuery`);
// 本周休假或撤销休假
export const SUBMIT_VACATION = getApi(`${minWeeklyreportService}/submitVacation`);
// 查询已提交的对象
export const QUERY_SUBMIT_USER = getApi(`${minWeeklyreportService}/querySubmitUser`);
// 查询可导入功能需求列表
export const QUERY_FUNCREQUIRE_LIST_FOR_IMPORT = getApi(`/FuncrequireService/require/queryFuncrequireListForImport`);
// 查询可导入的任务列表
export const QUERY_JOB_LIST_FOR_IMPORT = getApi(`/JobService/jobTask/queryJobListForImport`);
// 查询周报明细
export const QUERY_DETAIL = getApi(`${minWeeklyreportService}/queryDetail`);
// 修改已提交过的周报（仅修改内容）
export const UPDATE_CONTENT = getApi(`${minWeeklyreportService}/updateContent`);

/**
 * 员工周报相关的地址
 */

// 查询关注用户列表
export const QUERY_FOCUS_LIST = getApi(`${employeeWeeklyreportService}/queryFocusList`);
// 项目成员
export const QUERY_PROJECT_MEMBER_LIST = getApi(`${employeeWeeklyreportService}/queryProjectMemberList`);
// 项目经理确认项目成员
export const CONFIRM_STAFF = getApi(`${employeeWeeklyreportService}/confirmStaff`);
// 关注或者取消关注员工周报
export const IS_FOCUS = getApi(`${employeeWeeklyreportService}/focus`);
// 查询未提交周报人员
export const QUERY_UNSUBMIT_USER_LIST = getApi(`${employeeWeeklyreportService}/unSubmitUserList`);
// 员工周报导出
export const EXPORT_WEEKLY_REPORT = getApi(`${employeeWeeklyreportService}/exportWeeklyReport`);
// 查询周报回复
export const QUERY_REPLY = getApi(`${employeeWeeklyreportService}/queryReply`);
// 周报统计
export const STATISTICS = getApi(`${employeeWeeklyreportService}/statistics`);
// 查询周报周期列表
export const WORK_RANGE_LIST = getApi(`${employeeWeeklyreportService}/workRangeList`);
// 周报批量回复
export const BATCH_REPLY_WEEKLY_REPORT = getApi(`${employeeWeeklyreportService}/batchReplyWeeklyReport`);
// 周报回复
export const REPLY_WEEKLY_REPORT = getApi(`${employeeWeeklyreportService}/replyWeeklyReport`);
// 查询个人周报详情
export const PERSON_REPORT = getApi(`${employeeWeeklyreportService}/personReport`);
// 查询已提交周报的关注人员列表
export const QUERY_SUBMIT_FOCUS_LIST = getApi(`${employeeWeeklyreportService}/querySubmitFocusList`);
// 查询已提交周报的未关注人员列表
export const QUERY_UNFOCUS_LIST = getApi(`${employeeWeeklyreportService}/queryUnfocusList`);
// 分页查询员工周报信息
export const USER_PAGE_QUERY = getApi(`${employeeWeeklyreportService}/pageQuery`);

/**
 * 周报用户权限相关的地址
 */

// 查询用户登录的权限
export const QUERY_USER_AUTHORITY = getApi(`${authorityWeeklyreportService}/queryUserAuthoritys`);
// 一次性确认接口
export const CONFIRM_USER_GUIDE = getApi(`${authorityWeeklyreportService}/confirmUserGuide`);
