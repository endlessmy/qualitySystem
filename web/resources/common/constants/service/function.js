// @author: 邓英锋
// @date: 25/05/2018

const getApi = url => `${url}`;

let require = '/FuncrequireService/require';

// 2.1.0
// 功能需求分页查询
export const QUERY_PROJECT_FUNCTIONS = getApi(`${require}/pageQuery`);

// 功能需求分页查询数量
export const PAGE_QUERY_COUNT = getApi(`${require}/pageQueryCount`);

// 版本规划批量修改功能需求
export const BATCH_UPDATE_VERSION = getApi(`${require}/batchUpdateIterativeVersionId`);

// old
// 批量修改功能需求
export const BATCH_UPDATE = getApi(`${require}/batchUpdate`);

// 查询模块分类
export const QUERY_TYPE_TREE = getApi('/FuncrequireService/funcRequireType/queryList');
// 新增分类
export const ADD_FUNCREQUIRE_TYPE = getApi('/FuncrequireService/funcRequireType/add');
// 编辑分类
export const UPDATE_FUNCREQUIRE_TYPE = getApi('/FuncrequireService/funcRequireType/update');
// 删除分类
export const DELETE_FUNCREQUIRE_TYPE = getApi('/FuncrequireService/funcRequireType/delete');

// 查询该项目下的功能需求
export const QUERY_PROJECT_FUNCTION = getApi(`/FunctionRequirementService/requirement/allRequireByPage`);

// 查询功能需求详情
export const QUERY_FUNCTION_DETAILS = getApi(`${require}/queryDetail`);

// 项目看板中统计累计已完成功能需求数量
export const QUERY_FUNC_REQUIRE_COUNT = getApi('/FuncrequireService/statistics/queryfuncRequireCount');

// 功能需求批量导入
export const BACH_IMPORT_FUNC_REQUIREMENT = getApi('/FuncrequireService/requireImport/batchImport');
// 功能需求导入模板下载
export const FUNC_IMPORT_TEMPLATE = getApi('/FuncrequireService/requireImport/downloadImportTemplate/');
// 查看功能需求导入结果
export const FUNC_IMPORT_RESULT_EXPORT = getApi('/FuncrequireService/requireImport/exportImportDetailExcel/');
