import * as API_USER from '../constants/service/user';
import * as API_FUNC from '../constants/service/function';
import * as API_VERSION from '../constants/service/version';
import * as API_REQUIREMENT from '../constants/service/requirement';
import * as API_DOCUMENT from '../constants/service/document';
import * as API_PUBLIC from '../constants/service/public';
import post from './fetch';
export default {
    // 查询spms系统内的用户: 首页、项目模块
    querySystemUserList: params => post(API_USER.ONLINE_USER_LIST_QUERY, params),
    // 查询所有用户列表，新表头用户筛选， 测试系统
    queryUserList: params => post(API_USER.QUERY_USER_LIST, params),
    // 查询项目内的成员
    queryProjectMemberOnline: params => post(API_USER.QUERY_PROJECT_MEMBER_ONLINE, params),
    // 查询用户所在的项目列表: 首页、项目模块
    queryUserProjectList: params => post(API_USER.QUERY_USER_PROJECT_LIST, params),
    // 查询项目详情: 多个系统
    queryProjectDetail: params => post(API_USER.QUERY_PROJECT_DETAIL, params),
    // 查询项目列表树: 首页、项目、项目看板
    queryProjectTreeList: params => post(API_USER.QUERY_PROJECT_TREE_LIST, params),
    // 查询用户在项目内的角色列表，一个用户可以是多个角色
    queryUserRoleListInProject: params => post(API_USER.PROJECT_USER_ROLE_LIST_IN_PROJECT, params),
    // 查询当前登录用户是否为项目经理、产品经理、测试经理
    queryUserIsDefaultManager: params => post(API_USER.VERIFY_USER_IS_DEFAULT_MANAGER, params),
    // 增加评论
    addComment: params => post(API_USER.ADD_COMMENT, params),
    // 删除评论
    deleteComment: params => post(API_USER.DELETE_COMMENT, params),
    // 更新用户最近使用应用的时间
    updateAppClickDate: params => post(API_USER.UPDATE_APP_CLICK_DATE, params),

    // 新建视图
    createView: params => post(API_USER.CREATE_VIEW, params),
    // 查询视图列表
    queryViewList: params => post(API_USER.QUERY_VIEW_LIST, params),
    // 配置用户视图
    configView: params => post(API_USER.CONFIG_VIEW, params),
    // 删除用户视图
    deleteView: params => post(API_USER.DELETE_VIEW, params),
    // 查询可选配置列表表头字段
    queryTableField: params => post(API_USER.QUERY_TABLE_FIELD, params),
    // 查询配置列表(包括可选字段和已选字段)
    queryViewTableField: params => post(API_USER.QUERY_VIEW_TABLE_FIELD, params),
    // 查询视图详情
    queryViewDetail: params => post(API_USER.QUERY_VIEW_DETAIL, params),
    // 用户自定义表头配置
    configUserTableField: params => post(API_USER.CONFIG_USER_TABLE_FIELD, params),
    // 视图条件选择的字段
    queryViewConfigField: params => post(API_USER.QUERY_VIEW_CONFIG_FIELD, params),
    // 编辑用户视图
    updateUserView: params => post(API_USER.UPDATE_USER_VIEW, params),

    // 查询公司部门
    queryCompany: params => post(API_REQUIREMENT.REQUIREMENT_QUERY_COMPANY, params),
    // 查询项目版本
    queryVersionTree: params => post(API_VERSION.QUERY_VERSION_TREE, params),
    // 查询字典, 帮助组件 HelInfo 使用
    queryDictionary: params => post(API_USER.QUERY_DICTIONARY, params),
    // 查询功能需求分类
    queryFuncRequireType: params => post(API_FUNC.QUERY_TYPE_TREE, params),
    // 更新tips 状态
    updateUserTips: params => post(`/${params.service}${API_PUBLIC.UPDATE_USER_TIPS}`, params.data),

    // 获取文件预览路径, 帮助组件 HelInfo 使用
    previewQuery: params => post(API_DOCUMENT.PREVIEW_QUERY, params),
    // 获取新建、编辑页面未提交的数据 缺陷、需求、用户反馈使用
    setFormCache: params => post(API_PUBLIC.SET_FORM_CACHE, params),
    // 获取新建、编辑页面未提交的数据
    getFormCache: params => post(API_PUBLIC.GET_FORM_CACHE, params),
    // 获取新建、编辑页面未提交的数据
    deleteFormCache: params => post(API_PUBLIC.DELETE_FORM_CACHE, params),
    // 获取所有SPMS项目,bycsx(v2.2.1)
    getRootProjects: params => post(API_USER.GET_ROOT_PROJECTS, params)
    // end
};
