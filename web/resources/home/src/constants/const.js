/**
 * Created by qqli on 2017/2/25.
 */
// TSG department_id
export const TSG_DP_LIST = [1044, 1045, 1046, 1082, 1117, 1003];

// BSG department_id
export const BSG_DP_LIST = [1025, 1026, 1038, 1039, 1040, 1041, 1042, 1043, 1084, 1085, 1138, 1139, 1140, 1141, 1142, 1143];

// ISG department_id
export const ISG_DP_LIST = [1024, 1037, 1053, 1079, 1081, 1083, 1132, 1133, 1134, 1135, 1136, 1137];

// 审批设置消息提示
export const TIPS = {
    REQUIRE_B: '更新后的审批流程仅适应以后新建的需求。当前正在审批的需求按原有审批人继续审批',
    REQUIRE_T: '更新审批流程对正在进行审批的需求有影响，正在审批的需求需重新审批，确认保存？',
    DEFECT: '此次修改仅对新创建缺陷流程有影响。',
    DEFECT_CHILD: '该流程为可选项，每个部门可以指定一名审批人审批该项目的缺陷。',
    REQUIRE_CHILD:
        '每个部门可以指定一名或多名审批人审批该项目的需求。若设置超过两名时，用户提交需求时需选择其中一位为部门审批人。'
};
// 使用：待办事项 & 我创建的
export const MODULE_MAP = {
    REQUIREMENT: 'requirement',
    DEFECT: 'defect',
    TASK: 'task',
    TASK_BOARD: 'taskBoard',
    BUSINESS_WORK_ORDER: 'businessWorkOrder',
    DEVELOP_WORK_ORDER: 'developWorkOrder',
    DEVICE: 'device',
    WORKORDER: 'workOrder',
    FUNCTION: 'function',
    COUNTERSIGN: 'countersign',
    FEEDBACK: 'feedback',
    DEVELOPMENT_PERMISSION: 'developmentPermission',
    BUSINESS_PERMISSION: 'businessPermission',
    BUDGET_APPLY: 'budgetApply',
    PROJECTBOARD: 'projectboard',
    OUTSOURCE: 'outsource'
}; // 业务工单 // 研发工单 // 项目的功能需求 // 文件会签 // 用户反馈 // 研发工单plus // 业务工单plus // 年度申报 // 项目看板 // 外协管理

// 应用管理列表页，过滤选项对应的名称
export const FILTER_LABEL = {
    authority_type: '可见范围',
    group_id: '应用类型'
};

// 全部应用中分类所代表的类型例如
export const APP_CATEGORY_LIST = [
    {
        name: '项目管理',
        type: 'projectManage'
    },
    {
        name: '事项在线',
        type: 'matterOnline'
    },
    {
        name: '工单定制',
        type: 'formCustomized'
    },
    {
        name: '常用工具',
        type: 'commonTools'
    },
    {
        name: '研发周边',
        type: 'researchPeriphery'
    },
    {
        name: '审计纪检',
        type: 'auditInspect'
    }
];

// 应该图标背景色
export const BACKGROUND_COLOR_LIST = [
    {
        value: 'crisis-bc',
        label: '危机类'
    },
    {
        value: 'apply-tools-bc',
        label: '应用工具'
    },
    {
        value: 'task-bc',
        label: '任务类'
    },
    {
        value: 'require-bc',
        label: '需求类'
    }
];

// 应用类型
export const APP_TYPE_LIST = [
    {
        value: '1',
        label: '业务类'
    },
    {
        value: '2',
        label: '研发类'
    }
];

// 应用可见范围
export const VISIBLE_RANGE_LIST = [
    {
        value: '0',
        label: '所有用户'
    },
    {
        value: '1',
        label: '咪咕用户'
    }
];
