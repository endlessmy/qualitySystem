/**
 * Created by qqli on 2017/6/29.
 */
export const HOME_TODO_PAGE_SIZE = 5;

export const COMMON_LOGIN_ROUTER = __DEV__
    ? 'http://localhost:4004/#/login'
    : '/spms/static/home/index.html#/login';

// 使用：首页待办和我创建的组件引用
export const COMMON_INDEX_ROUTER = __DEV__
    ? 'http://localhost:4004/#/home/projectList'
    : '/spms/static/home/index.html#/home/projectList';

// 项目模块路由
export const PROJECT_MODULE_ROUTER = __DEV__
    ? 'http://localhost:4005/#/project'
    : '/spms/static/project/index.html#/project';

// 研发权限plus，英文代号申请
export const PERMISSIONPLUS_APPLY_CODE_ROUTER = __DEV__
    ? 'http://localhost:4003/#/permission/01/request-project-code'
    : '/spms/static/permissionplus/index.html#/permission/01/request-project-code';

// 研发权限plus，新建申请
export const PERMISSIONPLUS_CREATE_APPLY_ROUTER = __DEV__
    ? 'http://localhost:4003/#/permission/01/create'
    : '/spms/static/permissionplus/index.html#/permission/01/create';

// 新建缺陷
export const DEFECT_CREATE_ROUTE = __DEV__
    ? 'http://localhost:4000/#/defect/create'
    : '/spms/static/defect/index.html#/defect/create';

// 缺陷管理详情路由
export const DEFECT_DETAIL_ROUTE = __DEV__
    ? 'http://localhost:4000/#/defect/detail'
    : '/spms/static/defect/index.html#/defect/detail';

// 业务需求新建路由：列表跳转需求池转提
export const REQUIREMENT_CREATE_ROUTE = __DEV__
    ? 'http://localhost:4006/#/requirement/create'
    : '/spms/static/requirement/index.html#/requirement/create';

// 业务需求详情路由
export const REQUIREMENT_DETAIL_ROUTE = __DEV__
    ? 'http://localhost:4000/#/requirement/detail'
    : '/spms/static/requirement/index.html#/requirement/detail';

// 新建任务
export const TASK_CREATE_ROUTE = __DEV__
    ? 'http://localhost:2000/#/task/create'
    : '/spms/static/task/index.html#/task/create';

// 新建反馈
export const FEEDBACK_CREATE_ROUTE = __DEV__
    ? 'http://localhost:4001/#/feedback/create'
    : '/spms/static/feedback/index.html#/feedback/create';

// 项目看板默认路由
export const PROJECTBOARD_MODULE_ROUTER = __DEV__
    ? 'http://localhost:5000/'
    : '/spms/static/projectsboard/index.html';

// 红海行动默认路由
export const REDSEA_MODULE_ROUTER = __DEV__
    ? 'http://localhost:4007/#/operationredsea'
    : '/spms/static/operationredsea/index.html#/operationredsea';

// Element-ui 加载配置项
export const LOADING_OPTION = {
    text: '正在努力加载中...',
    lock: true
};

// 富文本编辑器默认显示内容
export const EDITOR_INIT_STRING = '';

// 时间选择组件使用
export const SHORTCUTS = [{
    text: '最近一周',
    onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
    }
},
{
    text: '最近一个月',
    onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
    }
},
{
    text: '最近三个月',
    onClick(picker) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
    }
}
];
// 管理视图视图类型对应的中文值
export const VIEW_TYPE_TEXT = {
    '01': '项目视图',
    '02': '个人视图',
    '03': '系统视图',
    '04': '系统视图',
    '05': '系统视图',
    '06': '系统视图',
    '07': '系统视图'
};
// 业务需求状态
export const REQUIRE_STATE = [
    // 状态对应表
    {
        label: '待审批',
        value: 2 // 测试说将待业务部门审批改成待审批
    },
    {
        label: '待排期',
        value: 4
    },
    {
        label: '开发中',
        value: 5
    },
    {
        label: '上线',
        value: 6
    },
    {
        label: '待完善',
        value: 8
    },
    {
        label: '拒绝',
        value: 9
    },
    {
        label: '关闭',
        value: 10
    },
    {
        label: '已排期',
        value: 11
    }
];
// 业务需求类型
export const REQUIRE_TYPE = [{
    label: '业务需求',
    value: '01'
},
{
    label: '技术需求',
    value: '02'
}
];
// 时间的动态取值问题
export const TIME_DYNAMIC = [{
    label: '天',
    value: '01'
},
{
    label: '周',
    value: '02'
},
{
    label: '月',
    value: '03'
}
];

// 合法文件类型(反馈模块、缺陷模块、文档模块、红海行动、权限plus、需求模块、任务管理)
export const VALID_FILE_TYPE = [
    '.doc',
    '.docx',
    '.txt',
    '.pdf',
    '.xlsx',
    '.xls',
    '.ppt',
    '.pptx',
    '.log',
    '.md',
    '.xlsm',
    '.vsd',
    '.xml',
    '.zip',
    '.tar',
    '.gz',
    '.jar',
    '.jpg',
    '.pdf',
    '.png',
    '.gif',
    '.war',
    '.rar',
    '.wmv',
    '.mkv',
    '.eml',
    '.jpeg',
    '.msg',
    '.bmp',
    '.mht',
    '.conf',
    '.mp4',
    '.webm',
    '.ogg'
];
