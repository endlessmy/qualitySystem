import * as API from 'common/constants/service/user';
import * as API_TODO from '../constants/apiTodo';
import post from 'common/utils/fetch';

const METHODS = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
};

export default {
    // 退出
    userLogout: params => post(API.USER_LOGOUT, params),
    // 根据一次性token登陆
    loginBySingleUseToken: params => post(API.LOGIN_BY_SINGLE_USE_TOKEN, params, METHODS.POST, true, 'warning'),
    // 获取用户token
    getUserToken: params => post(API.GET_USER_TOKEN, params),
    // 登陆获取动态码
    getDynamicCode: params => post(API.GET_DYNAMIC_CODE, params),
    // 动态码登陆
    loginWithDynamicCode: params => post(API.LOGIN_WITH_DYNAMIC_CODE, params, {}, METHODS.POST, true, 'none'),
    // 登录接口（替换之前的jquery的ajax）
    spmsLogin: params => post(API.SPMS_LOGIN, params, {}, METHODS.POST, true, 'none'),
    // 根据token登录
    loginByUserToken: params => post(API.LOGIN_BY_USER_TOKEN, params, {}, METHODS.POST, true, 'warning'),

    // 获取验证码
    getAuthCode: params => post(API.GET_AUTHCODE, params),
    // 校验验证码
    checkAuthCode: params => post(API.CHECK_AUTHCODE, params),
    // 重置登录密码
    resetingPwd: params => post(API.RESET_PWD, params),
    // 修改密码
    modifyPwd: params => post(API.MODIFY_PWD, params),
    // resetPassword
    resetPassword: params => post(API.RESET_PASSWORD, params),

    // 根据用户习惯更新项目排序
    updateUserProject: params => post(API.UPDATE_USER_PROJECT, params),
    // 查询应用模块列表
    queryAppServiceList: params => post(API.QUERY_APP_SERVICE_LIST, params),
    // 查询应用模块列表 具体排序是关注排序在前,再按最近操作在前,再按应用编号升序(默认查询9条)
    queryConcernAppList: params => post(API.QUERY_CONCERN_APP_LIST, params),
    // 收藏应用
    modifyUserFavoriteAppService: params => post(API.MODIFY_USER_FAVORITE_APP_SERVICE, params),

    // 新建项目
    createProject: params => post(API.CREATE_PROJECT, params),
    // 查询大视频定制化项目
    queryCustomProjectList: params => post(API.QUERY_CUSTOM_PROJECT_LIST, params),
    // 获取根项目列表
    getRootProjects: params => post(API.GET_ROOT_PROJECTS, params),
    // 查询一级项目
    queryFirstProject: params => post(API.QUERY_FIRST_PROJECT, params),
    // 查询角色列表
    queryRoleList: params => post(API.QUERY_ROLE_LIST, params),
    // 新建项目时，搜索所属公司
    queryCompanyList: params => post(API.QUERY_COMPANY_LIST, params),

    // 首页待办事项总数
    allTodoCount: params => post(API.ALL_TODO_COUNT, params),
    // 首页待办-预算申报待办列表查询
    budgetApplyQueryTodoList: params => post(API_TODO.BUDGET_APPLY_QUERY_TODO_LIST, params, true, METHODS.GET, false),
    // 工单详情
    queryTodoOrderDeatil: params => post(API_TODO.QUERY_TODO_ORDER_DEATIL, params),
    // 首页我创建的总数
    allMycreatedCount: params => post(API.ALL_MYCREATED_COUNT, params),

    // 应用管理页面，列表数据查询
    queryAppList: params => post(API.QUERY_APP_LIST, params),
    // 应用管理页面，新建应用
    createApp: params => post(API.CREATE_APP, params),
    // 应用管理页面，编辑应用
    editApp: params => post(API.EDIT_APP, params),
    // 应用管理页面，删除应用
    deleteApp: params => post(API.DELETE_APP, params)
};
