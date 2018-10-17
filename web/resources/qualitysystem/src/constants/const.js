/**
 * 常量对应表
 */
// @author: jjq
// @date: 2018/7/25

export const PAGE_SIZE = 10;

// 合法文件类型
export const VALID_FILE_TYPE = ['.docx', '.pdf', '.xlsx', '.xls'];
// 达标状态
export const REACH_STANDARD_STATUS = {
    qualified: '达标',
    unqualified: '未达标'
};

// 过滤选项对应的名称
export const FILTER_LABEL = {
    status: '达标状态',
    version_status: '状态',
    requirement_response_status: '需求响应及时率达标状态',
    requirement_finished_status: '需求平均完成率达标状态',
    video_requirement_finished_status: '大视频定制化需求完成率'
};
// 过滤选项对应的下拉列表的数据key值
export const FILTER_VALUE = {
    status: 'stateList',
    project_id: 'projectList',
    user_id: 'userList'
};
export const VERSION_FILTER_VALUE = {
    status: 'versionOrderList',
    project_id: 'projectList'
};
export const ENTRY_FILTER_VALUE = {
    status: 'entryOrderList',
    project_id: 'projectList'
};
// 达标状态
export const STATE_LIST = [
    {
        label: '达标',
        value: 'qualified'
    },
    {
        label: '未达标',
        value: 'unqualified'
    }
];

// 维度测试版本状态
export const VERSION_STATUS = {
    not_started: '未开始',
    underway: '进行中',
    finished: '完成'
};
export const VERSION_LIST = [
    {
        label: '未开始',
        value: '01'
    },
    {
        label: '进行中',
        value: '02'
    },
    {
        label: '完成',
        value: '03'
    }
];

// 生产率管理页-录入状态
export const ENTRY_STATUS = {
    wait_entry: '待录入',
    finished_entry: '已录入'
};
export const ENTRY_LIST = [
    {
        label: '待录入',
        value: '01'
    },
    {
        label: '已录入',
        value: '02'
    }
];

// 生产率管理页-是否纳入统计
export const IS_ENTRY = {
    entry_count: '是',
    disabled_entry: '否'
};
export const IS_ENTRY_LIST = [
    {
        label: '是',
        value: '01'
    },
    {
        label: '否',
        value: '02'
    }
];

// 渲染生产率管理-邮件发送状态
export const MAIL_STATUS = {
    mail_success: '成功',
    mail_failed: '失败',
    mail_sending: '发送中'
};
export const MAIL_STATUS_LIST = [
    {
        label: '失败',
        value: '00'
    },
    {
        label: '成功',
        value: '01'
    },
    {
        label: '发送中',
        value: '02'
    }
];

// 渲染生产率管理-软件应用范围
export const SOFTWARE_RANGE = {
    for_inside: '咪咕内部项目',
    for_outside: '对外'
};
export const SOFTWARE_RANGE_LIST = [
    {
        label: '对内',
        value: '1'
    },
    {
        label: '对外',
        value: '2'
    }
];
// 渲染生产率管理-软件开发形式
export const SOFTWARE_DEVELOP = {
    self: '自研',
    entrust: '委托',
    self_entrust: '自研+委托',
    manpower: '人力支撑',
    self_manpower: '自研+人力支撑'
};
export const SOFTWARE_DEVELOP_LIST = [
    {
        label: '自研',
        value: '1'
    },
    {
        label: '委托',
        value: '2'
    },
    {
        label: '自研+委托',
        value: '3'
    },
    {
        label: '人力支撑',
        value: '4'
    },
    {
        label: '自研+人力支撑',
        value: '5'
    }
];

// 渲染生产率管理-委托方
export const ENTRUST = {
    su_yan: '苏研',
    hang_yan: '杭研',
    zhuo_wang: '卓望',
    ya_xin: '亚信',
    yu_heng: '煜衡',
    hua_wei: '华为',
    wang_da: '网达',
    qing_dao: '青岛海信',
    ke_da: '科大讯飞',
    dong_xin: '东信北邮'
};
export const ENTRUST_LIST = [
    {
        label: '苏研',
        value: '10'
    },
    {
        label: '杭研',
        value: '11'
    },
    {
        label: '卓望',
        value: '12'
    },
    {
        label: '亚信',
        value: '13'
    },
    {
        label: '煜衡',
        value: '14'
    },
    {
        label: '华为',
        value: '15'
    },
    {
        label: '网达',
        value: '16'
    },
    {
        label: '青岛海信',
        value: '17'
    },
    {
        label: '科大讯飞',
        value: '18'
    },
    {
        label: '东信北邮',
        value: '19'
    }
];

// 渲染生产率管理-数据页-统计状态
export const COUNT_STATUS = {
    no_statistic: '未统计',
    finished: '已完成',
    no_finished: '未完成'
};
export const COUNT_STATUS_LIST = [
    {
        label: '未统计',
        value: '00'
    },
    {
        label: '未完成',
        value: '01'
    },
    {
        label: '已完成',
        value: '02'
    }
];
// 表头名字与提示内容对应
export const HEADER_NAME = {
    ressing_test_not_passed_score: '满分100分，回归不通过一次扣10分',
    month_score: '( 程序变更部署得分+告警得分+故障得分+故障解决率得分+故障解决平均时长得分 ) /5',
    deploy_score: '满分100分，失败一次扣50分',
    trouble_solved_score: '解决率得分=解决率*100',
    version_score: '( 发布遗留缺陷得分+回归不通过得分) / 2',
    static_check_problem_density: '当前静态问题数 / (当前版本总代码量/1000)',
    static_check_increased_problem_denstiy: '当前新增静态检查问题数/(当前版本新增代码量/1000)',
    test_failure_score: '满分100分，每提测失败一次扣50分',
    staff_inner_count: '实际投入自有人员数，如果一个人同时投入多个项目，按照本月在此项目上投入的占比来算，如：0.3',
    staff_foreign_count: '实际投入外协人员数，如果一个人同时投入多个项目，按照本月在此项目上投入的占比来算，如：0.3',
    human_all: '自有人员数 + 外协人员数 * 0.5'
};
// 表头名字与提示内容对应——维度开发
export const HEADER_NAME_DEV = {
    version_score: ' (静态检查得分+提测失败得分)/2'
};
