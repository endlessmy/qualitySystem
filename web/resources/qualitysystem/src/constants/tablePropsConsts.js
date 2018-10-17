/**
 * @name: 可变表头表格的配置
 * @description: 用于配置可变表格的表头
 * @author: lxb
 * @date: 20181012
 */
export const RANK_TABLE_ALL_PROPS = [
    // element-ui v-for会将第一列放在最后，因此多定义一列不显示^-^! 2.0.5已修复该问题
    {
        baseConfig: {
            resizable: false,
            width: 1
        }
    },
    {
        baseConfig: {
            resizable: false,
            label: '项目名称',
            prop: 'project_name',
            renderHeaderName: 'renderProjects'
        }
    },
    {
        baseConfig: {
            resizable: false,
            label: '月份',
            prop: 'month'
        }
    },
    {
        baseConfig: {
            resizable: false,
            label: '总分',
            prop: 'score_total',
            sortable: 'custom'
        }
    },
    {
        baseConfig: {
            resizable: false,
            label: '开发得分',
            prop: 'develop_score',
            sortable: 'custom'
        }
    },
    {
        baseConfig: {
            resizable: false,
            label: '测试得分',
            prop: 'test_score',
            sortable: 'custom'
        }
    },
    {
        baseConfig: {
            resizable: false,
            label: '运维得分',
            prop: 'operation_score',
            sortable: 'custom'
        }
    },
    {
        baseConfig: {
            resizable: false,
            label: '系统使用得分',
            prop: 'sysCall_score',
            sortable: 'custom'
        }
    }
];
export const RANK_TABLE_DEV_PROPS = [
    // element-ui v-for会将第一列放在最后，因此多定义一列不显示^-^!
    {
        baseConfig: {
            resizable: false,
            width: 1
        }
    },
    {
        baseConfig: {
            resizable: false
        },
        children: [
            {
                baseConfig: {
                    resizable: false,
                    label: '项目名称',
                    prop: 'project_name',
                    renderHeaderName: 'renderProjects',
                    align: 'center'
                }
            },
            {
                baseConfig: {
                    resizable: false,
                    label: '月份',
                    prop: 'month',
                    align: 'center'
                }
            },
            {
                baseConfig: {
                    resizable: false,
                    label: '总分',
                    prop: 'score_total',
                    sortable: 'custom',
                    align: 'center'
                }
            }
        ]
    },
    {
        baseConfig: {
            resizable: false,
            label: '新增修改代码量',
            align: 'center'
        },
        children: [
            {
                baseConfig: {
                    resizable: false,
                    label: '数量',
                    prop: 'increased_modified_code_count',
                    sortable: 'custom',
                    align: 'center'
                }
            },
            {
                baseConfig: {
                    resizable: false,
                    label: '得分',
                    prop: 'increased_modified_code_score',
                    sortable: 'custom',
                    align: 'center'
                }
            }
        ]
    },
    {
        baseConfig: {
            resizable: false,
            label: '需求工单数',
            align: 'center'
        },
        children: [
            {
                baseConfig: {
                    resizable: false,
                    label: '数量',
                    prop: 'requirement_work_order_count',
                    sortable: 'custom',
                    align: 'center'
                }
            },
            {
                baseConfig: {
                    resizable: false,
                    label: '得分',
                    prop: 'requirement_work_order_score',
                    sortable: 'custom',
                    align: 'center'
                }
            }
        ]
    }
];
