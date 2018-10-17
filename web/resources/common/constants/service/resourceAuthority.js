// 项目设置 - 资源权限

const getApi = (url) => `${url}`;

const gitlabService = '/ResourceAuthorityService/gitlab';
const svnService = '/ResourceAuthorityService/svn';
const jenkinsService = '/ResourceAuthorityService/jenkins';
/**
 * gitlab仓库管理
 */
// gitlab仓库列表查询
export const QUERY_GITLAB_LIST = getApi(`${gitlabService}/repository/query`);
// 添加gitlab仓库
export const ADD_GITLAB = getApi(`${gitlabService}/repository/create`);
// 编辑gitlab仓库
export const EDIT_GITLAB = getApi(`${gitlabService}/repository/update`);
// 删除gitlab仓库
export const DELETE_GITLAB = getApi(`${gitlabService}/repository/delete`);
// 项目成员gitlab权限列表
export const QUERY_GITLAB_AUTHORITY_LIST = getApi(`${gitlabService}/member/pageQuery`);
// 成员权限修改
export const UPDATE_GITLAB_ACCESS_LEVEL = getApi(`${gitlabService}/member/updateAccessLevel`);
// 修改gitlab研发工单提示
export const UPDATE_GITLAB_TIP = getApi('/ResourceAuthorityService/tips/updateUserTips');

/**
 * SVN权限管理
 */
// SVN列表查询
export const QUERY_SVN_LIST = getApi(`${svnService}/repository/query`);
// 添加SVN目录
export const ADD_SVN = getApi(`${svnService}/repository/create`);
// 编辑SVN目录
export const EDIT_SVN = getApi(`${svnService}/repository/update`);
// 删除SVN目录
export const DELETE_SVN = getApi(`${svnService}/repository/delete`);
// SVN仓库成员查询
export const QUERY_SVN_MEMBER_LIST = getApi(`${svnService}/member/query`);
// 成员SVN权限分页查询
export const QUERY_SVN_AUTHORITY_LIST = getApi(`${svnService}/member/pageQuery`);
// 成员权限修改
export const UPDATE_SVN_ACCESS_LEVEL = getApi(`${svnService}/member/updateAccessLevel`);

/**
 * JENKINS权限管理
 */
// JENKINS列表查询
export const QUERY_JENKINS_LIST = getApi(`${jenkinsService}/repository/query`);
// 添加JENKINS目录
export const ADD_JENKINS = getApi(`${jenkinsService}/repository/create`);
// 编辑JENKINS目录
export const EDIT_JENKINS = getApi(`${jenkinsService}/repository/update`);
// 删除JENKINS目录
export const DELETE_JENKINS = getApi(`${jenkinsService}/repository/delete`);
// 成员JENKINS权限分页查询
export const QUERY_JENKINS_AUTHORITY_LIST = getApi(`${jenkinsService}/member/pageQuery`);
// 成员权限修改
export const UPDATE_JENKINS_ACCESS_LEVEL = getApi(`${jenkinsService}/member/updateAccessLevel`);

// Gitlab和SVN公共接口：查询/修改用户研发工单提示

export const GET_USER_TIPS = getApi('/ResourceAuthorityService/tips/getUserTips');

export const UPDATE_USER_TIPS = getApi('/ResourceAuthorityService/tips/updateUserTips');
