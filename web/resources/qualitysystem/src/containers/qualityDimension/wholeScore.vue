<!--
@name: 质量系统——质量度量——整体得分

@description:
@author: 孙燕
@date: 2018/7/30
-->
<template>
    <div class="container-main">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left">
                <span>质量度量 > 整体得分</span>
            </div>
            <div class="operate-platform">
                <direct-export-excel :url="exportUrl()"></direct-export-excel>
            </div>
        </div>
        <div
            class="main main-list cascade-style">
            <div class="main-wrap">
                <div class="main-list-row clearfix">
                    <div class="clearfix">
                        <div class="line-dashed">
                            <span class="title long-title">季度：</span>
                            <el-date-picker
                                v-model="currentYear"
                                :clearable="false"
                                :editable="false"
                                :picker-options="pickerOptions"
                                popper-class="show-year"
                                type="year"
                                placeholder="请选择年"
                                @change="selectYear">
                            </el-date-picker>
                            <span
                                :class="{'selected-quarter': currentQuarter === 'Q1','disabled-quarter': quarterDisabledOne}"
                                class="quarter"
                                @click="selectQuarter('Q1',quarterDisabledOne)">Q1</span>
                            <span
                                :class="{'selected-quarter': currentQuarter === 'Q2','disabled-quarter': quarterDisabledSecond}"
                                class="quarter"
                                @click ="selectQuarter('Q2',quarterDisabledSecond)">Q2</span>
                            <span
                                :class="{'selected-quarter': currentQuarter === 'Q3','disabled-quarter': quarterDisabledThird}"
                                class="quarter"
                                @click ="selectQuarter('Q3',quarterDisabledThird)">Q3</span>
                            <span
                                :class="{'selected-quarter': currentQuarter === 'Q4','disabled-quarter': quarterDisabledFourth}"
                                class="quarter"
                                @click ="selectQuarter('Q4',quarterDisabledFourth)">Q4</span>
                            <el-tooltip
                                popper-class="home-kpi-tip-popper"
                                class="item"
                                effect="light"
                                content="目前只能查询2018年Q3季度之后的数据"
                                placement="top">
                                <i class="icon-wenhao"></i>
                            </el-tooltip>
                        </div>
                        <div>
                            <span class="title long-title">大项目名称：</span>
                            <div class="project-select">
                                <el-select
                                    v-model="currentBigProjectId"
                                    filterable
                                    placeholder="请输入选择"
                                    @change="selectBigProject">
                                    <el-option
                                        v-for="item in bigProjectList"
                                        :key="item.big_project_id"
                                        :label="item.big_project_name"
                                        :value="item.big_project_id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            id="mainScroll"
            class="main main-list table-style whole-score-table">
            <div class="main-wrap">
                <div class="main-list-row clearfix nospace">
                    <div class="line-solid">
                        <div class="score-image-position"><span class="whole-score-icon-image"></span></div>
                        {{ currentQuarter }}季度{{ currentBigProjectName }}的整体得分：
                        <span
                            v-if="wholeScore"
                            class="quarter-whole-score">
                            {{ Number(wholeScore).toFixed(2) }}
                        </span>
                        <span
                            v-else-if="wholeScore===0"
                            class="quarter-whole-score">
                            {{ Number(0).toFixed(2) }}
                        </span>
                        <span
                            v-else
                            class="quarter-whole-score">{{ '--' }}</span>
                        <el-tooltip
                            popper-class="home-kpi-tip-popper"
                            class="item"
                            effect="light"
                            content="当前季度各个子系统的平均分"
                            placement="top">
                            <i class="icon-wenhao"></i>
                        </el-tooltip>
                    </div>
                    <div class="breadcrumbs left">
                        <span class="list-title">整体得分</span>
                        <span
                            v-show="filterItem.length > 0"
                            class="filter-keys">>
                        </span>
                    </div>
                    <div class="filter-list ml5 left">
                        <div
                            v-for="(item, i) in filterItem"
                            :key="item.value"
                            class="filter-item">
                            <span class="text">
                                {{ item.label }} : {{ item.value }}
                            </span>
                            <span
                                class="remove"
                                @click="removeFilterLabel(i, item, removeFilterParams)"><i class="icon-delete-big" /></span>
                        </div>
                    </div>
                </div>
                <div class="new-table">
                    <table>
                        <colgroup>
                            <col width="250">
                            <col width="150">
                            <col width="150">
                            <col width="150">
                            <col width="150">
                            <col width="150">
                            <col width="17">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>
                                    <div class="whole-score-pro-name"><HeaderLocalSelector :multi-select-params="multiSelectParams"></HeaderLocalSelector></div>
                                </th>
                                <th>月份</th>
                                <th>月度总分
                                    <el-tooltip
                                        popper-class="home-kpi-tip-popper"
                                        class="item"
                                        effect="light"
                                        content="开发得分*40%+测试得分*30%+运维得分*30%"
                                        placement="top">
                                        <i class="icon-wenhao"></i>
                                    </el-tooltip>
                                </th>
                                <th>开发得分</th>
                                <th>测试得分</th>
                                <th>运维得分</th>
                            </tr>
                        </thead>
                    </table>
                    <div class="new-table-body">
                        <div
                            v-if="tableListLength === 0 || tableListLength===''"
                            class="el-table">
                            <div

                                class="el-table__empty-block">
                                <span class="el-table__empty-text">暂无数据</span>
                            </div>
                        </div>
                        <table v-else>
                            <colgroup>
                                <col width="250">
                                <col width="150">
                                <col width="150">
                                <col width="150">
                                <col width="150">
                                <col width="150">
                            </colgroup>

                            <tbody
                                v-for="(item,index) in tableList"
                                :key="index">
                                <tr class="sep-row"></tr>
                                <tr
                                    v-for="(tempObj,i) in item"
                                    v-if="i !== item.length -1"
                                    :key="i">
                                    <td>{{ tempObj.project_name }}</td>
                                    <td>{{ tempObj.month }}</td>
                                    <td class="space_month">
                                        <span v-if="tempObj.month_score">
                                            {{ Number(tempObj.month_score).toFixed(2) }}
                                        </span>
                                        <span v-else-if="tempObj.month_score===0">
                                            {{ Number(0).toFixed(2) }}
                                        </span>
                                        <span v-else>
                                            {{ '--' }}
                                        </span>
                                    </td>
                                    <td class="space">
                                        <a :href="setRouter('develop',tempObj)">
                                            <span v-if="tempObj.develop_score">
                                                {{ Number(tempObj.develop_score).toFixed(2) }}
                                            </span>
                                            <span v-else-if="tempObj.develop_score===0">
                                                {{ Number(0).toFixed(2) }}
                                            </span>
                                            <span v-else>
                                                {{ '--' }}
                                            </span>
                                        </a>
                                    </td>
                                    <td class="space">
                                        <a :href="setRouter('test',tempObj)">
                                            <span v-if="tempObj.test_score">
                                                {{ Number(tempObj.test_score).toFixed(2) }}
                                            </span>
                                            <span v-else-if="tempObj.test_score===0">
                                                {{ Number(0).toFixed(2) }}
                                            </span>
                                            <span v-else>
                                                {{ '--' }}
                                            </span>
                                        </a>
                                    </td>
                                    <td class="space">
                                        <a :href="setRouter('operation',tempObj)">
                                            <span v-if="tempObj.operation_score">
                                                {{ Number(tempObj.operation_score).toFixed(2) }}
                                            </span>
                                            <span v-else-if="tempObj.operation_score===0">
                                                {{ Number(0).toFixed(2) }}
                                            </span>
                                            <span v-else>
                                                {{ '--' }}
                                            </span>
                                        </a>
                                    </td>
                                </tr>
                                <tr class="quarter-sum">
                                    <td class="sum-title">{{ item[item.length - 1].project_name.slice(0,4) }}</td>
                                    <td>{{ item[item.length-1].month || '--' }}</td>
                                    <td class="space_month">
                                        <span v-if="item[item.length-1].month_score">
                                            {{ Number(item[item.length-1].month_score).toFixed(2) }}
                                        </span>
                                        <span v-else-if="item[item.length-1].month_score===0">
                                            {{ Number(0).toFixed(2) }}
                                        </span>
                                        <span v-else>
                                            {{ '--' }}
                                        </span>
                                    </td>
                                    <td class="space">
                                        <a :href="setRouter('develop',item[item.length-1])">
                                            <span v-if="item[item.length-1].develop_score">
                                                {{ Number(item[item.length-1].develop_score).toFixed(2) }}
                                                <el-tooltip
                                                    popper-class="home-kpi-tip-popper"
                                                    class="item"
                                                    effect="light"
                                                    placement="top">
                                                    <div
                                                        slot="content"
                                                        class="line-space">
                                                        当前季度所有版本开发得分的平均分
                                                    </div>
                                                    <i class="icon-wenhao"></i>
                                                </el-tooltip>
                                            </span>
                                            <span v-else-if="item[item.length-1].develop_score===0">
                                                {{ Number(0).toFixed(2) }}
                                                <el-tooltip
                                                    popper-class="home-kpi-tip-popper"
                                                    class="item"
                                                    effect="light"
                                                    placement="top">
                                                    <div
                                                        slot="content"
                                                        class="line-space">
                                                        当前季度所有版本开发得分的平均分
                                                    </div>
                                                    <i class="icon-wenhao"></i>
                                                </el-tooltip>
                                            </span>
                                            <span v-else>
                                                {{ '--' }}
                                            </span>
                                        </a>
                                    </td>
                                    <td class="space">
                                        <a :href="setRouter('test',item[item.length-1])">
                                            <span v-if="item[item.length-1].test_score">
                                                {{ Number(item[item.length-1].test_score).toFixed(2) }}
                                                <el-tooltip
                                                    popper-class="home-kpi-tip-popper"
                                                    class="item"
                                                    effect="light"
                                                    placement="top">
                                                    <div
                                                        slot="content"
                                                        class="line-space">
                                                        当前季度所有版本测试得分的平均分
                                                    </div>
                                                    <i class="icon-wenhao"></i>
                                                </el-tooltip>
                                            </span>
                                            <span v-else-if="item[item.length-1].test_score===0">
                                                {{ Number(0).toFixed(2) }}
                                                <el-tooltip
                                                    popper-class="home-kpi-tip-popper"
                                                    class="item"
                                                    effect="light"
                                                    placement="top">
                                                    <div
                                                        slot="content"
                                                        class="line-space">
                                                        当前季度所有版本测试得分的平均分
                                                    </div>
                                                    <i class="icon-wenhao"></i>
                                                </el-tooltip>
                                            </span>
                                            <span v-else>
                                                {{ '--' }}
                                            </span>
                                        </a>
                                    </td>
                                    <td class="space">
                                        <a :href="setRouter('operation',item[item.length-1])">
                                            <span v-if="item[item.length-1].operation_score">
                                                {{ Number(item[item.length-1].operation_score).toFixed(2) }}
                                                <el-tooltip
                                                    popper-class="home-kpi-tip-popper"
                                                    class="item"
                                                    effect="light"
                                                    placement="top">
                                                    <div
                                                        slot="content"
                                                        class="line-space">
                                                        当前季度所有版本运维得分的平均分
                                                    </div>
                                                    <i class="icon-wenhao"></i>
                                                </el-tooltip>
                                            </span>
                                            <span
                                                v-else-if="item[item.length-1].operation_score===0"
                                                :render-header="renderTipIcon"
                                                prop="wholeOperationTip">
                                                {{ Number(0).toFixed(2) }}
                                                <el-tooltip
                                                    popper-class="home-kpi-tip-popper"
                                                    class="item"
                                                    effect="light"
                                                    placement="top">
                                                    <div
                                                        slot="content"
                                                        class="line-space">
                                                        当前季度所有版本运维得分的平均分
                                                    </div>
                                                    <i class="icon-wenhao"></i>
                                                </el-tooltip>
                                            </span>
                                            <span v-else>
                                                {{ '--' }}
                                            </span>
                                        </a>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ListMixins from '@/mixins/list'; // 公共方法
import api from '@/utils/api';
import { mapActions, mapState } from 'vuex';
import DirectExportExcel from 'common/components/DirectExportExcel';
import { EXOPRT_OVERALL_SCORE } from '@/constants/api';

export default {
    name: 'WholeScore',
    components: { DirectExportExcel },
    mixins: [ListMixins],
    data() {
        let that = this;
        return {
            chooseAbleYear: '2018', // 只显示2018年
            // 默认显示当前年份，当前以后不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < new Date(that.chooseAbleYear);
                }
            },
            requestParams: {
                year: '',
                quarter: '',
                big_project_id: '', // 大项目id
                project_id: '' // 项目表头搜索id
            },
            currentBigProjectId: '', // 当前大项目id
            currentBigProjectName: '', // 当前大项目名称
            bigProjectList: [], // 项目列表
            tableList: [], // 列表数据
            wholeScore: '', // 整体得分
            tableListLength: '', // 整体得分列表数据记录条数
            tableCount: '', // 绘制的表格数
            filterItem: [], // 筛选数组
            projectList: [],
            quarterDisabledOne: false, // 2018年Q1不可选
            multiSelectParams: {
                handChange: this.onHeaderChange,
                selectNameKey: 'project_id',
                selectName: '项目名称',
                options: [],
                requestList: this.requestList,
                isMultiple: false
            },
            wholeScoreDataExportUrl: EXOPRT_OVERALL_SCORE, // 导出整体得分数据链接
            exportParams: {
                // 导出参数
                year: '',
                quarter: ''
            },
            fn: () => {
                this.computeWholeScoreHeight(this.tableListLength);
            }
        };
    },
    computed: {
        ...mapState({})
    },
    watch: {
        projectList(val) {
            this.multiSelectParams.options = val;
        },
        tableList(val) {
            if (val.length !== 0) {
                let tempCount = val.length;
                this.computeWholeScoreHeight(tempCount);
            }
        }
    },
    beforeMount() {
        this.getBigProjectList(); // 获取大项目列表
        this.getCurrentDate();
    },
    mounted() {
        window.addEventListener('resize', this.fn);
        this.computeWholeScoreHeight(this.tableListLength);
    },
    destroyed() {
        window.removeEventListener('resize', this.fn);
    },

    methods: {
        computeWholeScoreHeight(tempCount) {
            if (tempCount) {
                let a = this.getListDivHeight('wholeScore') - 101 - 46; // 当前页面可放下的表体内容的高度
                let b = tempCount * 10 + tempCount * 4 * 55; // 实际表体内容的高度
                if (b > a) {
                    document.getElementsByClassName('new-table-body')[0].style.height = a + 160 + 'px';
                }
                document.getElementsByClassName('whole-score-table')[0].style.height =
                    this.getListDivHeight('wholeScore') + 170 + 'px';
            } else {
                document.getElementsByClassName('new-table-body')[0].style.height =
                    this.getListDivHeight('wholeScore') - 101 - 46 + 'px';
                document.getElementsByClassName('whole-score-table')[0].style.height = this.getListDivHeight('wholeScore') + 'px';
            }
        },
        // 获取大项目下的一级项目列表
        getProjectListInBig(val) {
            api.queryProjectsListInBigProject({ big_project_id: val }).then(res => {
                this.projectList = res.result.map(item => {
                    let label = item.project_name;
                    let value = item.project_id;
                    return { label, value };
                });
            });
        },

        setRouter(dimension, tempData) {
            // 设置路由跳转的参数
            let tempObj = {
                currentDimension: dimension,
                projectId: tempData.project_id,
                startDate: '',
                endDate: ''
            };
            if (tempData.project_name.indexOf('季度总分') > -1) {
                if (this.currentQuarter === 'Q1') {
                    tempObj.startDate = this.currentYear + '-01';
                    tempObj.endDate = this.currentYear + '-03';
                } else if (this.currentQuarter === 'Q2') {
                    tempObj.startDate = this.currentYear + '-04';
                    tempObj.endDate = this.currentYear + '-06';
                } else if (this.currentQuarter === 'Q3') {
                    tempObj.startDate = this.currentYear + '-07';
                    tempObj.endDate = this.currentYear + '-09';
                } else if (this.currentQuarter === 'Q4') {
                    tempObj.startDate = this.currentYear + '-10';
                    tempObj.endDate = this.currentYear + '-12';
                }
            } else {
                tempObj.startDate = tempData.month;
                tempObj.endDate = tempData.month;
            }
            let path = `#/qualitySystem/everyDimensionScore?currentDimension=${tempObj.currentDimension}&projectId=${
                tempObj.projectId
            }&startDate=${tempObj.startDate}&endDate=${tempObj.endDate}`;
            return path;
        },
        // 获取大项目列表
        getBigProjectList() {
            api.queryBigProjectLsit({}).then(res => {
                this.bigProjectList = res.result;
                if (this.$route.query.bigProjectId) {
                    this.currentBigProjectId = Number(this.$route.query.bigProjectId);
                    this.currentBigProjectName = this.getProjectNameById(this.currentBigProjectId);
                } else {
                    this.currentBigProjectId = res.result[0].big_project_id; // 默认显示第一个项目
                    this.currentBigProjectName = res.result[0].big_project_name;
                }
            });
        },
        // 根据大项目ID获取大项目名称
        getProjectNameById(val) {
            for (let i = 0; i < this.bigProjectList.length; i++) {
                if (val === this.bigProjectList[i].big_project_id) {
                    this.currentBigProjectName = this.bigProjectList[i].big_project_name;
                    break;
                } else {
                    continue;
                }
            }
        },
        // 获取当前时间
        getCurrentDate() {
            api.queryCurrentDate().then(res => {
                this.actualYear = res.result.date.split('-')[0];
                this.actualQuarter = res.result.quarter;
                if (this.$route.query.quarter || this.$route.query.year) {
                    this.currentQuarter = String(this.$route.query.quarter);
                    this.currentYear = String(this.$route.query.year);
                } else {
                    this.currentQuarter = res.result.quarter;
                    this.currentYear = res.result.date.split('-')[0];
                }
                this.requestParams.year = Number(this.currentYear);
                this.requestParams.quarter = this.currentQuarter;
            });
        },
        // 选择年份
        selectYear(val) {
            if (val === undefined) {
                this.requestParams.year = '';
            } else {
                this.currentYear = val;
                this.requestParams.year = Number(val);
                this.thisquarterDisabledControl(this.actualQuarter, this.actualYear);
            }
            this.requestList();
        },
        // 选择季度
        selectQuarter(val, disabledParams) {
            if (disabledParams) {
                return false;
            } else {
                this.currentQuarter = val;
                this.requestParams.quarter = val;
            }
            this.requestList();
        },
        // 获取大项目列表
        selectBigProject(val) {
            this.requestParams.big_project_id = val;
            this.getProjectListInBig(val);
            this.getProjectNameById(val);
            this.requestList();
        },
        // 年份及季度的限制（只能选2018年Q3之后）
        thisquarterDisabledControl(quarterVal, yearVal) {
            let actualQuarterNumber = Number(quarterVal.substring(1, 2)); // 实际的季度
            if (this.currentYear === '2018') {
                this.quarterDisabledOne = true;
                this.quarterDisabledSecond = true;
                if (actualQuarterNumber < 4) {
                    this.quarterDisabledFourth = true;
                }
                if (actualQuarterNumber < 3) {
                    this.quarterDisabledThird = true;
                }
            }
        },
        // 请求列表
        requestList(pageNo) {
            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            if (this.requestParams.year === '' || this.requestParams.quarter === '' || this.requestParams.big_project_id === '') {
                return false;
            } else {
                api.queryWholeScoreDataList(this.formatParams()).then(res => {
                    this.tableList = res.result.data;
                    this.wholeScore = res.result.quarter_score;
                    this.tableCount = res.result.data.length;
                    this.tableListLength = res.result.data.length * 4;
                    // this.renderTable();
                });
            }
        },
        // 格式化请求参数
        formatParams() {
            let finalParams = JSON.parse(JSON.stringify(this.requestParams));
            for (var key in finalParams) {
                if (finalParams[key] && typeof finalParams[key] === 'string' && finalParams[key].indexOf(',') > -1) {
                    finalParams[key] = finalParams[key].split(',')[0];
                }
            }
            return finalParams;
        },
        // 导出
        exportUrl() {
            this.exportParams.year = this.requestParams.year;
            this.exportParams.quarter = this.currentQuarter;
            let queryConditionTemp = JSON.parse(JSON.stringify(this.exportParams));
            let ip = window.config.context; // spms的前缀ip地址
            let wholeScoreDataExportUrl = this.wholeScoreDataExportUrl; // 原始数据导出的接口
            let queryCondition = `${encodeURIComponent(JSON.stringify(queryConditionTemp))}`; // 需要传入的参数
            let sessionId = `sessionId=${window.localStorage.sessionId}`; // 需要sessionId的验证
            return `${ip}${wholeScoreDataExportUrl}/${queryCondition}?${sessionId}`;
        },
        ...mapActions(['queryWholeScoreDataList'])
    }
};
</script>
<style lang="less">
.whole-score-pro-name .select-user .header-select-link .icon-pullup-down {
    display: inline-block;
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    color: #ccc;
}

.new-table {
    .new-table-body {
        height: auto;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .sep-row {
        height: 10px;
    }
    .quarter-sum {
        background-color: #f6f7fb;
    }
    .link-score {
        vertical-align: middle;
    }
    .sum-title {
        color: #333;
    }
    .sum-score-tooltip {
        color: #333;
        cursor: default;
    }
    .tooltip-box {
        display: block;
        line-height: 1.6;
        background-color: #fff;
        border: 1px solid #666;
        font-size: 12px;
        border-radius: 5px;
        overflow: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        thead {
            height: 46px;
            line-height: 46px;
            background: rgba(246, 247, 251, 1);
            font-size: 14px;
            font-family: PingFangSC-Regular;
            color: #333;
            text-align: left;
            tr {
                th {
                    padding-left: 20px;
                    text-align: left;
                }
            }
        }
        tbody {
            // height: 400px;
            overflow: auto;
            tr {
                height: 46px;
                line-height: 46px;
                background: #fff;
                border: 1px solid #ebeff9;
                font-size: 12px;
                color: #757a86;
                td {
                    padding-left: 20px;
                    text-align: left;
                }
                &:hover {
                    background-color: #f6f7fb;
                }
            }
        }
    }
}
.nospace {
    padding: 0 !important;
}
.nospace .line-solid,
.nospace .breadcrumbs {
    padding-left: 20px;
}
.space {
    text-indent: 7px;
}
.space_month {
    text-indent: 3px;
}
.line-space {
    line-height: 20px;
}
</style>
