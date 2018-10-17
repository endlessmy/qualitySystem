// @author: dengxue
// @date: 04/05/2018
const user = `/UserService/user`;
// 查询用户信息（版本概览查询项目测试经理）
export const QUERY_USER_BY_PRO_AND_ROLE = `${user}/queryUserByProAndRole`;
// 查询全部表头字段及用户自定义的表头字段
export const QUERY_VIEW_TABLE_FIELD = '/UserService/view/queryViewTableField';
// 用户自定义列表表头字段接口
export const CONFIG_USER_TABLE_FIELD = '/UserService/view/configUserTableField';
// 新建视图
export const CREATE_VIEW = '/UserService/view/createView';
// 查询视图列表
export const QUERY_VIEW_LIST = '/UserService/view/queryAll';
// 配置用户视图
export const CONFIG_VIEW = '/UserService/view/configView';
// 删除用户视图
export const DELETE_VIEW = '/UserService/view/deleteView';
// 编辑用户视图
export const UPDATE_USER_VIEW = '/UserService/view/updateView';
// 视图条件选择的字段
export const QUERY_VIEW_CONFIG_FIELD = '/UserService/view/queryViewConfigField';
// 查询视图详情
export const QUERY_VIEW_DETAIL = '/UserService/view/queryDetail';

// 退出
export const USER_LOGOUT = '/UserService/user/logout';
// 根据一次性token登录
export const LOGIN_BY_SINGLE_USE_TOKEN = '/UserService/user/v1/loginBySingleUseToken';
// 获取token
export const GET_USER_TOKEN = '/UserService/user/v1/getSingleUseToken';
// 登陆时获取动态码
export const GET_DYNAMIC_CODE = '/UserService/user/randomcode';
// 动态码登陆
export const LOGIN_WITH_DYNAMIC_CODE = '/UserService/user/smslogin';
// 登录接口（替换之前的jquery的ajax）
export const SPMS_LOGIN = '/UserService/user/v2/authentication';
// 根据token登录
export const LOGIN_BY_USER_TOKEN = '/UserService/user/v1/loginByUserToken';

// 忘记密码 && 修改密码
// 获取验证码
export const GET_AUTHCODE = '/UserService/user/getAuthCode';
// 校验验证码
export const CHECK_AUTHCODE = '/UserService/user/checkAuthCode';
// 重置登录密码
export const RESET_PWD = '/UserService/user/resetPwd';
// 修改密码
export const MODIFY_PWD = '/UserService/user/modifyPwd';
// 重置密码
export const RESET_PASSWORD = '/UserService/user/modify';

// 查询系统字典
export const QUERY_DICTIONARY = '/UserService/dictionary/queryViewDictionary';
// 根据用户习惯给项目排序
export const UPDATE_USER_PROJECT = '/UserService/user/updateUserProjectByHabit';
// 查询应用系统列表
export const QUERY_APP_SERVICE_LIST = '/UserService/user/queryAppServiceList';
// 收藏应用
export const MODIFY_USER_FAVORITE_APP_SERVICE = '/UserService/user/modifyUserFavoriteAppService';
// 在线搜索咪咕员工
export const ONLINE_USER_LIST_QUERY = '/UserService/user/pageQuery';
// 根据用户名来查询用户列表
export const QUERY_USER_LIST = '/UserService/user/queryuserlistbyname';
// 查询项目组内成员
export const QUERY_PROJECT_MEMBER_ONLINE = '/UserService/user/queryUserListInProject';
// 增加评论
export const ADD_COMMENT = '/UserService/user/addComment';
// 删除评论
export const DELETE_COMMENT = '/UserService/user/deleteComment';
// 查询可选配置列表表头字段
export const QUERY_TABLE_FIELD = '/UserService/user/queryTableField';

// 查询关注的应用系统列表，默认9条
export const QUERY_CONCERN_APP_LIST = '/UserService/appService/queryUserConcernedList';
// 更新用户最近使用应用的时间
export const UPDATE_APP_CLICK_DATE = '/UserService/appService/updateDate';

// 新建项目
export const CREATE_PROJECT = '/UserService/project/createproject';
// 查询用户的id的查询项目列表（我的项目列表）
export const QUERY_USER_PROJECT_LIST = '/UserService/project/v1/getProjectsByUserId';
// 查询定制化项目列表（大视频定制化项目）
export const QUERY_CUSTOM_PROJECT_LIST = '/UserService/project/queryCustomProjects';
// 查询项目详情
export const QUERY_PROJECT_DETAIL = '/UserService/project/queryprojectdetail';
// 查询项目列表树
export const QUERY_PROJECT_TREE_LIST = '/UserService/project/queryProjectTreeList';
// 获取根项目列表
export const GET_ROOT_PROJECTS = '/UserService/project/queryForPaging';
// 查询一级项目
export const QUERY_FIRST_PROJECT = '/UserService/project/queryOfficialProjects';
// 查询角色列表
export const QUERY_ROLE_LIST = '/UserService/role/queryRoleList';
// 查询用户在项目的角色列表
export const PROJECT_USER_ROLE_LIST_IN_PROJECT = '/UserService/role/queryUserRoleInProject';
// 查询所有项目经理列表 周报模块
export const QUERY_ALL_PROJECT_LEADER = '/UserService/project/queryWeeklyReportLeader';
// 将业务需求拆分成功能需求，查询项目列表
export const QUERY_PROJECT_LIST_FOR_SPLIT_FUNC = '/UserService/project/getListForSplitFunc';
// 根据用户获取项目；文档模块使用 还需再优化
export const USER_QUERY_PROJECT = '/UserService/project/queryProjectListInUser';
// 根据用户获取项目；查询项目，用于新建、统计缺陷 还需再优化
export const GET_PUBLIC_PROJECTS = '/UserService/project/getPublicProjects';

// 查询当前登录用户是否为项目经理、产品经理、测试经理角色, 包含其他经理角色传参数
export const VERIFY_USER_IS_DEFAULT_MANAGER = '/UserService/userproject/verifyUserIsDefaultManager';
// 检查当前用户是否是项目经理
export const CHECK_PROJECT_MANAGER = '/UserService/userproject/verifyUserIsProjectManager';
// 验证当前用户是否在项目中
export const VERIFY_USER_IN_PROJECT = '/UserService/userproject/verifyUserInProject';

// 所属公司列表：新建项目时
export const QUERY_COMPANY_LIST = '/UserService/company/queryCompanyList';

// 所有模块的todo count
export const ALL_TODO_COUNT = '/UserService/userCount/queryUserTodo';
// 所有模块的‘我创建的’ count
export const ALL_MYCREATED_COUNT = '/UserService/userCount/myCreateCount';

// 应用管理页面,列表数据查询
export const QUERY_APP_LIST = '/UserService/systemUrlManagement/querySysemUrl';
// 应用管理页面,删除
export const DELETE_APP = '/UserService/systemUrlManagement/deleteSysemUrl';
// 应用管理页面,新建
export const CREATE_APP = '/UserService/systemUrlManagement/createSysemUrl';
// 应用管理页面,编辑
export const EDIT_APP = '/UserService/systemUrlManagement/updateSysemUrl';

// 获取包含子版本的版本列表
// export const REQUIREMENT_VERSION_TREE = '/VersionService/version/queryVersionTree';

// 查询所有部门
export const QUERY_DEPARTMENT_LIST = '/UserService/department/getGroupList';
// 查询虚拟组
export const QUERY_FICTITIOUS_LIST = '/UserService/department/getDepartmentGroupRelation';
// 新增版本，使用地方：流程 '已解决'，可创建版本
export const PROJECT_INSERT_VERSION = '/UserService/project/insertprojectversion';
