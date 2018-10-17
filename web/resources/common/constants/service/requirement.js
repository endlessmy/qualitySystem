// @author: jjq
// @description:业务需求模块api
// @date: 2018/6/5

let requirement = '/RequireService/requirement';
let userConfig = '/RequireService/userConfig';
let attachment = '/RequireService/attachment';

// 2.1.0
// 需求列表分页查询
export const REQUIREMENT_QUERY_LIST = `${requirement}/pageQuery`;

// 需求记录总数查询
export const QUERY_REQUIREMENT_MSG = `${requirement}/queryCount`;

// 版本规划批量修改业务需求计划上线版本
export const BATCH_UPDATE_VERSION = `${requirement}/batchUpdatePlannedOnlineVersion`;

// old
export const MODULE_PATH = __DEV__ ? 'http://localhost:4006/' : '/spms/static/requirement/index.html';

// 项目看板详情中统计累计支持业务需求数量
export const COUNT_FOR_PROJECT_BOARD = '/RequireService/statistics/countForProjectBoard';

// 展开查询对应的功能需求
export const QUERY_FUNCLIST_BY_REQUIRE = '/FuncrequireService/require/getListByBusinessRequireId';

// 转为功能需求（新建）
export const TURN_TO_FUN = '/FunctionRequirementService/require/create';

// 查询开关打开情况
export const QUERY_FUNCREQUIRE_FLAG = `${userConfig}/showFuncrequireFlag`;

// 用户设置开关
export const UPDATE_FUNCREQUIRE_FLAG = `${userConfig}/updateFuncrequireFlag`;

// 附件删除
export const REQUIREMENT_DELETE_ATTACH = `${attachment}/deleteattachment/service`;

// 查询附件
export const QUERY_ATTACHMENT = `${attachment}/template/queryList`;

// 附件上传
export const REQUIREMENT_UPLOAD_ATTACH = `${requirement}/uploadAttach`;

// 更新附件
export const REQUIREMENT_UPDATE_AFTER_ADD_ATTACH = `${requirement}/updateAttach`;

// 业务需求视图列表
export const QUERY_REQUIRE_BY_VIEW = `${requirement}/pageQueryByView`;

// 导出需求列表
export const REQUIREMENT_EXPORT_EXCEL = `${requirement}/requireExportExcel`;

// 获取公司列表
export const REQUIREMENT_QUERY_COMPANY = `${requirement}/queryCompanyAndSpecialDep`;

// 获取'我已处理'分页列表
export const REQUIREMENT_QUERY_LIST_FOR_DONE = `${requirement}/processedQuery`;

// 创建需求
export const REQUIREMENT_CREATE = `${requirement}/createRequirement`;

// 编辑需求
export const REQUIREMENT_EDIT = `${requirement}/updateRequirement`;

// 详情查询
export const REQUIREMENT_QUERY_DETAIL = `${requirement}/queryDetail`;

// 增加评论
export const REQUIREMENT_ADD_COMMENT = `${requirement}/addcomment`;

// 流程操作
export const REQUIREMENT_OPERATE = `${requirement}/procesRequire`;

// 某公司的优先级查询
export const REQUIREMENT_QUERY_PRIORITY = `${requirement}/queryRequirePriority`;

// 修改优先级
export const REQUIREMENT_UPDATE_PRIORITY = `${requirement}/updateRequirePriority`;

// 需求池统计数量
export const REQUIREMENT_STATISTICS_NUM = `${requirement}/queryStatisticDataList`;

// 需求工作量统计
export const REQUIREMENT_WORKLOAD_STATISTICS = `${requirement}/queryWorkload`;

// 更新排期
export const REQUIREMENT_SET_SCHEDULE = `${requirement}/updateScheduleRequire`;

// 需求开发
export const UPDATE_SCHEDULE_REQUIRE_IN_DEVELOP = `${requirement}/updateScheduleRequireInDevelop`;

// 复制需求，提交接口
export const REQUIREMENT_COPY = `${requirement}/copyRequirement`;

// 关联需求，提交接口
export const REQUIREMENT_LINK = `${requirement}/linkRequirement`;

// 查询需求审批人
export const QUERY_REQUIREMENT_APPROVER = `${requirement}/queryFirstApproveUserList`;

// 查询部门需求数量(创建/被拒绝+待完善
export const QUERY_DEP_REQUIREMENT_AMOUNT = `${requirement}/queryNumberDepStatistics`;

// 需求评分
export const RATE_REQUIREMENT = `${requirement}/scoreRequirement`;

// 需求更新排期或实际工作量
export const UPDATE_SCHEDULE_REQUIRE_INTO_DB = `${requirement}/updateScheduleRequireIntoDB`;

// 关联会签
export const OPERATE_REQUIRE_AND_SIGN = `${requirement}/operateRequireAndSign`;

// 获取代办数量
export const MY_TO_DO_COUNT = `${requirement}/mytodocount`;

// 查询生命周期统计
export const QUERY_DEMAND_LIFE_CYCLE = `${requirement}/queryLifePeriodStatistics`;

// 部门需求审批时间统计
export const REQUIREMENT_STATISTICS_TIME_DEPARTMENT = `${requirement}/queryApproveStatistics`;

// 需求生命周期统计导出
export const DEMAND_LIFE_CYCLE_EXPORT = `${requirement}/lifePeriodExportExcel`;

// 部门需求审批时间统计导出
export const DEPARTMENT_DEMAND_TIME_EXPORT = `${requirement}/approveStatisticsExportExcel`;

// 项目需求数量统计导出
export const PROJECT_DEMAND_QUANTITY_EXPORT = `${requirement}/statisticDataExportExcel`;

// 部门需求数量统计导出
export const DEPARTMENT_DEMAND_QUANTITY_EXPORT = `${requirement}/numberDepStatisticsExportExcel`;
