const version = '/VersionService/version';
const statistics = '/VersionService/statistics';
const reihum = '/VersionService/reihum';
const attachment = '/DocumentService/attachment';
const fileManage = '/DocumentService/fileManage';

// 2.2.2
// 查询流水线执行历史纪录
export const QUERY_DEVOPS_EXECUTE_HISTORY = `${reihum}/queryDevOpsExecuteHistoryList`;

// 2.2.0
// 分页查询版本提测轮次
export const TEST_TABLE_LIST = `${reihum}/pageQuery`;

// 查询版本提测轮次总数
export const REIHUM_COUNT = `${reihum}/reihumCount`;

// 查询提测交付件
export const QUERY_DELIVERABLE = `${reihum}/queryReihumAttachmentList`;

// 处理提测流程
export const VERSION_HANDLE_PROCESS = `${reihum}/workflow/handleProcessTask`;

// 测试持续集成流水线
export const TEST_JENKINS = `${reihum}/testJenkins`;

// 新增版本提测轮次
export const CREATE_CYCLE = `${reihum}/createCycle`;

// 编辑版本提测轮次
export const UPDATE_CYCLE = `${reihum}/updateCycle`;

// 查询版本轮次详情
export const REIHUM_DETAIL = `${reihum}/reihumDetail`;

// 查询退回详情
export const QUERY_REFUSE_REASON = `${reihum}/queryRefuseReason`;

// 查询代码库
export const QUERY_REPERTORY = '/VersionService/integration/queryRepertory';

// 查询提测轮次的代码仓库与分支
export const QUERY_REPOSITORY_AND_BRANCH = `${reihum}/queryRepositoryAndBranch`;

// 查询提测业务需求
export const QUERY_REQUIRE = `${reihum}/queryRequire`;

// 查询提测功能需求
export const QUERY_FUNC_REQUIRE = `${reihum}/queryFuncrequire`;

// 查询提测缺陷
export const QUERY_DEFECT = `${reihum}/queryDefect`;

// 查询持续集成流水线任务
export const QUERY_JENKINS_JOB = `${reihum}/queryJenkinsJob`;

// 查询静态代码检查问题
export const QUERY_CODE_CHECK_BUG = `${reihum}/queryCodeCheckBug`;

// 测试报告回调保存
export const SAVE_TEST_REPORT = `${reihum}/saveTestReport`;

// 测试报告删除回调接口
export const DELETE_TEST_REPORT = `${reihum}/deleteTestReport`;

// 上传提测交付件
export const VERSION_REIHUM = `${attachment}/uploadattachment/version_reihum`;

// 交付件删除
export const DELETE_DELIVERABLE = `${attachment}/deleteattachment/service/version_reihum`;

// 上传测试报告
export const VERSION_SERVICE = `${attachment}/uploadattachment/versionservice`;

// 测试报告附件查询接口
export const QUERY_VERSION_SERVICE = `${attachment}/queryattachment/service/versionservice`;

// 测试报告附件删除接口
export const DELETE_VERSION_SERVICE = `${attachment}/deleteattachment/service/versionservice`;

// 全部交付件下载接口
export const DOWNLOAD_ALL_DELIVERABLE = `${fileManage}/zipDownload`;

// 2.1.0
// 获取包含子版本的版本列表
export const QUERY_VERSION_TREE = `${version}/queryVersionTree`;

// 基于年的版本信息列表分页查询
export const QUERY_VERSION_BY_YEAR = `${version}/queryVersionByYear`;

// 版本甘特图信息查询
export const QUERY_VERSION_GANTT_CHART = `${version}/queryVersionGanttChart`;

// 版本信息列表分页查询
export const QUERY_VERSION_LIST = `${version}/queryVersionInfoList`;

// 查询所有阶段
export const QUERY_PROCESS = `${version}/queryProcess`;

// 修改阶段
export const CHANGE_PROCESS = `${version}/changeProcess`;

// 修改版本阶段时间
export const SET_PROCESS_DATE = `${version}/setProcessDate`;

// 自定义阶段
export const CUSTOM_PROCESS = `${version}/customProcess`;

// 新建根版本
export const VERSION_CREATE_ROOT = `${version}/createRootVersion`;

// 新建子版本
export const VERSION_CREATE_SUB = `${version}/createSubVersion`;

// 删除版本
export const DEL_VERSION = `${version}/deleteVersion`;

// 查询版本详情
export const QUERY_VERSION_DETAIL = `${version}/queryDetail`;

// 更新版本
export const VERSION_UPDATE = `${version}/updateVersion`;

// 获取子版本号
export const VERSION_QUERY_SUB_NUM = `${version}/buildSonVersionNum`;

// 查询版本年份
export const QUERY_VERSION_YEAR = `${version}/queryVersionYear`;

// 查询距离现在最近的版本
export const QUERY_CURRENT_VERSION = `${statistics}/queryCurrentVersion`;

// 项目概览基本信息
export const QUERY_PROJECT_OVERVIEW = `${statistics}/queryVersionOverview`;

// 成员任务情况
export const QUERY_MEMBER_DATA = `${statistics}/queryUserWorkInfo`;

// 项目看板中累计上线版本统计
export const QUERY_VERSION_COUNT = `${statistics}/queryVersionCount`;

// 项目看板中统计版本列表
export const COUNT_FOR_PROJECT_BOARD = `${statistics}/countForProjectBoard`;
