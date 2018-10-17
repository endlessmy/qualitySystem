/**
 * @name 文档系统Url
 * @author shenah
 * @dete 2018/06/7
 */
const getApi = url => `${url}`;
// 文档管理服务
const documentSercive = '/DocumentService/fileManage';
// 文件服务
const documentAttachmentSercive = '/DocumentService/attachment';
// 预览文件查询
export const PREVIEW_QUERY_FLAG = getApi(`${documentAttachmentSercive}/preview/queryflag`);
// 上传url
export const ATTACHMENT_UPLOAD = getApi(`${documentSercive}/uploadFile`);
// 文件权限查询
export const QUERY_FILE_RIGHT = getApi(`${documentSercive}/queryPermissionFlag`);
// 管理文件权限查询(人,组,项目成员)
export const MANGE_FILE_RIGHT = getApi(`${documentSercive}/permissionManage`);
// 文件权限分页查询
export const PAGE_QUERY_NOW_RIGHT = getApi(`${documentSercive}/pageQueryPermission`);
// 查看文件属性
export const QUERY_FILE_PROP = getApi(`${documentSercive}/queryFileProperties`);
// 查看文件详情
export const QUERY_FILE_DETAIL = getApi(`${documentSercive}/queryFileDetail`);
// 获取包含子文件夹的文件夹列表
export const RELEVANT_ALL_FOLDER_QUERY = getApi(`${documentSercive}/queryfolder`);
// 合并用户权限
export const QUERY_PERMISSION_SET = getApi(`${documentSercive}/queryPermissionSet`);
// 重命名
export const RENAME = getApi(`${documentSercive}/rename`);
// 删除文件
export const DELETE_FILE = getApi(`${documentSercive}/delete`);
// 永久删除文件
export const PERMANENT_DELETE_FILE = getApi(`${documentSercive}/deleteFileForever`);
// 永久删除文件夹
export const PERMANENT_DELETE_FOLDER = getApi(`${documentSercive}/deleteFolderForever`);
// 校验该目录下是否已存在同名文件
export const CHECK_UNIQUE_FILE_NAME = getApi(`${documentSercive}/checkFileNameBeforeRecover`);
// 文件恢复
export const FILE_RECOVER = getApi(`${documentSercive}/recover`);
// 清空回收站
export const CLEAR_RECYCLE_FILES = getApi(`${documentSercive}/cleanRecycleBin`);
// 文件移动
export const FILE_REMOVE = getApi(`${documentSercive}/remove`);
// 查询列表
export const DOC_QUERY_LIST = getApi(`${documentSercive}/pageQuery`);
// 新建文件夹
export const CREAT_FOLDER = getApi(`${documentSercive}/createFolder`);
// 下载文件
export const DOC_DOWNLOAD = getApi(`${documentSercive}/download`);
// 获取文件路径
export const PREVIEW_QUERY = getApi(`${documentSercive}/preview/query`);
// 查看继承权限
export const QUERY_PAGE_INHERIT_PERMISSION = getApi(`${documentSercive}/pageQueryInheritPermission`);
// 保存markdown文件
export const SAVE_MARKDOWN = getApi(`${documentSercive}/markdown/save`);
// 查询markdown的详情
export const QUERY_MARKDOWN_DETAIL = getApi(`${documentSercive}/markdown/query`);
// 分享在线文档的短链接
export const SHARE_MARKDOWN_SHORT_LINK = getApi(`${documentSercive}/markdown/share`);
// 分享在线文档的长链接
export const SHARE_MARKDOWN_LONG_LINK = getApi(`${documentSercive}/markdown/queryurl`);
// 上传markdown图片的接口
export const UPLOAD_MARKDOWN_IMG = getApi(`${documentSercive}/markdown/uploadimage`);
// 点赞
export const ONLINE_FILE_LIKE = getApi(`${documentSercive}/markdown/like`);
