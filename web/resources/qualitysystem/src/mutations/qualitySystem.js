// @name: 质量系统
// @description:
// @author: jjq
// @date: 2018/5/7
import * as C from '../constants/actions';
const state = {
    userList: [], // 在线搜索人员
    allProjectList: [], // 所有项目的列表
    isManager: '', // 是否为项目经理
    currUserPrivilege: '', // 是否为超管、QA
    // statisticCompleteStatus: '', // 生产率度量统计状态
    // kpi原始数据列表
    kpiOriginDataList: {
        requirementResponce: {
            // 需求响应及时率
            basePage: {
                pageNo: 1
            },
            result: []
        },
        requirementFinished: {
            // 需求平均完成率
            basePage: {
                pageNo: 1
            },
            result: []
        },
        videoeRquirementFinished: {
            // 大视频定制需求平均完成率
            basePage: {
                pageNo: 1
            },
            result: []
        }
    },
    homeQualityWorkOrder: {
        // 首页-质量度量
        basePage: {
            pageNo: 1
        },
        result: []
    },
    homeKpiMyProjects: {
        // 首页KPI指标--我负责的项目
        basePage: {
            pageNo: 1
        },
        result: []
    },
    homeQuestionWorOrder: {
        // 首页问题工单
        basePage: {
            pageNo: 1
        },
        result: []
    },
    kpiReachTimelyData: {
        // KPI指标达标情况-需求响应及时率
        basePage: {
            pageNo: 1
        },
        result: []
    },
    kpiReachFinishedData: {
        // KPI指标达标情况-需求平均完成率
        basePage: {
            pageNo: 1
        },
        result: []
    },
    kpiReachVideoFinishedData: {
        // KPI指标达标情况-大视频定制化需求完成率
        basePage: {
            pageNo: 1
        },
        result: []
    },
    questionOriginDataList: {
        // 问题工单原始数据
        basePage: {
            pageNo: 1
        },
        result: []
    },
    wholeScoreDataList: {
        result: {}
    },
    // 维度测试
    dimensionTestDataList: [],
    testTotalScore: '',
    // 维度运维
    dimensionOperationDataList: [],
    operationTotalScore: '',
    // 质量度量--开发维度
    dimensionDevelopDataList: [],
    developTotalScore: '', // 开发总分
    // 生产率度量-生产率录入-指标
    productivityEntryCategoryDataList: [],
    // 生产率度量-生产率录入-人力
    productivityEntryHumanDataList: [],
    // 获取生产率度量-生产率管理-数据页列表
    productivityDataPageList: {
        // 问题工单原始数据
        basePage: {
            pageNo: 1
        },
        result: []
    },
    // 获取生产率度量-生产率管理-管理页列表
    productivityManagePageList: {
        // 问题工单原始数据
        basePage: {
            pageNo: 1
        },
        result: []
    }
};
const mutations = {
    [C.IS_PROJECT_MANAGER](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.isManager = payload.result.isProjectManager;
    },
    // 在线搜索，获取人员列表
    [C.QUERY_USER_IN_MANAGERS](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.userList =
            payload.result &&
            payload.result.map(item => {
                let userName = item.user_name;
                let userId = item.user_id;
                return {
                    userName,
                    userId
                };
            });
    },
    // 在线搜索，获取项目列表
    [C.QUERY_PROJECTS_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.allProjectList = payload.result;
    },

    // 获取KPI原始数据的列表-需求响应及时率
    [C.QUERY_REQUIREMENT_RESPONSE_SOURCE_DATA](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.kpiOriginDataList.requirementResponce.result = payload.result;
        state.kpiOriginDataList.requirementResponce.basePage = payload.basePage;
    },
    // 获取KPI原始数据的列表-需求平均完成率
    [C.QUERY_REQUIREMENT_FINISHED_SOURCE_DATA](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.kpiOriginDataList.requirementFinished.result = payload.result;
        state.kpiOriginDataList.requirementFinished.basePage = payload.basePage;
    },
    // 获取KPI原始数据的列表-大视频定制需求平均完成率
    [C.QUERY_VIDEO_REQUIREMENT_FINISHED_SOURCE_DATA](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.kpiOriginDataList.videoeRquirementFinished.result = payload.result;
        state.kpiOriginDataList.videoeRquirementFinished.basePage = payload.basePage;
    },

    // 获取首页KPI指标--我负责的项目列表
    [C.QUERY_KPI_MY_PROJECTS_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.homeKpiMyProjects.result = payload.result;
        state.homeKpiMyProjects.basePage = payload.basePage;
    },
    // 获取首页质量度量两个列表，根据传参类型区分两个列表
    [C.QUERY_HOME_QUALITY_DIMENSION_DATA_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.homeQualityWorkOrder.result = payload.result;
        state.homeQualityWorkOrder.basePage = payload.basePage;
    },
    // 获取首页问题工单两个列表，根据传参类型区分两个列表
    [C.QUERY_HOME_QUESTION_WORK_ORDER_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.homeQuestionWorOrder.result = payload.result;
        state.homeQuestionWorOrder.basePage = payload.basePage;
    },
    // 获取KPI指标-达标情况的列表-需求响应及时率
    [C.QUERY_KPI_REACH_TIMELY_DATA](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.kpiReachTimelyData.result = payload.result;
        state.kpiReachTimelyData.basePage = payload.basePage;
    },
    // 获取KPI指标-达标情况的列表-需求平均完成率
    [C.QUERY_KPI_REACH_FINISHED_DATA](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.kpiReachFinishedData.result = payload.result;
        state.kpiReachFinishedData.basePage = payload.basePage;
    },
    // 获取KPI指标-达标情况的列表-大视频定制化需求完成率
    [C.QUERY_KPI_REACH_VIDEO_FINISHED_DATA](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.kpiReachVideoFinishedData.result = payload.result;
        state.kpiReachVideoFinishedData.basePage = payload.basePage;
    },
    // 获取问题工单原始数据的列表
    [C.QUERY_QUESTION_ORIGIN_DATA_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.questionOriginDataList.result = payload.result;
        state.questionOriginDataList.basePage = payload.basePage;
    },
    // 获取整体得分的数据列表
    [C.QUERY_WHOLE_SCORE_DATA_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.wholeScoreDataList.result = payload.result;
    },
    // 获取维度测试的数据列表
    [C.QUERY_DIMENSION_TEST_DATA_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.dimensionTestDataList = payload.result.data;
        state.testTotalScore = payload.result.test_total_score;
    },
    // 获取维度运维的数据列表
    [C.QUERY_DIMENSION_OPERATION_DATA_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.dimensionOperationDataList = payload.result.data;
        state.operationTotalScore = payload.result.score;
    },
    // 获取维度开发的数据列表
    [C.QUERY_DIMENSION_DEVELOP_DATA_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.dimensionDevelopDataList = payload.result.data;
        state.developTotalScore = payload.result.dev_total_score;
    },
    // 获取生产率度量-生产率录入-指标的数据列表
    [C.QUERY_PRODUCTIVITY_ENTRY_CATEGORY_DATA_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.productivityEntryCategoryDataList = payload.result;
    },
    // 获取生产率度量-生产率录入-人力的数据列表
    [C.QUERY_PRODUCTIVITY_ENTRY_HUMAN_DATA_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.productivityEntryHumanDataList = payload.result;
    },
    // 获取生产率度量-生产率管理-数据页列表
    [C.QUERY_PROJECT_STATISTIC_STATUS](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.productivityDataPageList.result = payload.result;
        state.productivityDataPageList.basePage = payload.basePage;
    },
    // 获取生产率度量-生产率管理-管理页列表
    [C.QUERY_MANAGE_PAGE_LIST](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.productivityManagePageList.result = payload.result;
        state.productivityManagePageList.basePage = payload.basePage;
    },
    // 查询生产率管理是否为超管、QA
    [C.PRODUCT_USER_PRIVILEGE](state, {
        payload,
        error
    }) {
        if (error) {
            return;
        }
        state.currUserPrivilege = payload.result;
    }
};
export default {
    state,
    mutations
};
