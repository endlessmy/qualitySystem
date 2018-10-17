<!--
@name: 质量系统——KPI指标——原始数据页面

@description:
@author: jjq
@date: 2018/7/30
-->
<template>
    <div class="container-main">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left">
                <span>KPI指标 > 原始数据</span>
            </div>
            <div class="operate-platform">
                <direct-export-excel :url="exportUrl()"></direct-export-excel>
            </div>
        </div>

        <div
            id="mainScroll"
            class="main main-list ">
            <div class="main-wrap">
                <div class="condition-part clearfix">
                    <div class="condition-part-content">
                        <div class="line-dashed">
                            <span class="title">季度：</span>
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
                                :class="{'selected-quarter': currentQuarter === 'Q1'}"
                                class="quarter"
                                @click="selectQuarter('Q1')">Q1</span>
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
                        </div>
                        <div class="line-dashed">
                            <span class="title">项目：</span>
                            <div class="project-select">
                                <el-select
                                    v-model="currentProjectId"
                                    filterable
                                    placeholder="请输入选择"
                                    @change="selectProject">
                                    <el-option
                                        v-for="item in projectList"
                                        :key="item.project_id"
                                        :label="item.project_name"
                                        :value="item.project_id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div>
                            <span class="title">指标：</span>
                            <span
                                :class="{'selected-quarter': kpiData === 'response'}"
                                class="quarter"
                                @click="selectKpi('response')">需求响应及时率</span>
                            <span
                                :class="{'selected-quarter': kpiData === 'finished'}"
                                class="quarter"
                                @click ="selectKpi('finished')">需求平均完成率</span>
                            <span
                                :class="{'selected-quarter': kpiData === 'videoFinished'}"
                                class="quarter"
                                @click ="selectKpi('videoFinished')">大视频定制化需求完成率</span>
                        </div>
                    </div>
                </div>
                <requirement-response
                    v-if="kpiData === 'response'"
                    :base-request-params="requestParams">
                </requirement-response>
                <requirement-finished
                    v-else
                    :base-request-params="requestParams"
                    :kpi-data="kpiData">
                </requirement-finished>
                <!-- <div class="main-list-row clearfix">
                    <div class="clearfix">
                        <div class="line-dashed">
                            <span class="title">季度：</span>
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
                                :class="{'selected-quarter': currentQuarter === 'Q1'}"
                                class="quarter"
                                @click="selectQuarter('Q1')">Q1</span>
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
                        </div>
                        <div class="line-dashed">
                            <span class="title">项目：</span>
                            <div class="project-select">
                                <el-select
                                    v-model="currentProjectId"
                                    filterable
                                    placeholder="请输入选择"
                                    @change="selectProject">
                                    <el-option
                                        v-for="item in projectList"
                                        :key="item.project_id"
                                        :label="item.project_name"
                                        :value="item.project_id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div>
                            <span class="title">指标：</span>
                            <span
                                :class="{'selected-quarter': kpiData === 'response'}"
                                class="quarter"
                                @click="selectKpi('response')">需求响应及时率</span>
                            <span
                                :class="{'selected-quarter': kpiData === 'finished'}"
                                class="quarter"
                                @click ="selectKpi('finished')">需求平均完成率</span>
                            <span
                                :class="{'selected-quarter': kpiData === 'videoFinished'}"
                                class="quarter"
                                @click ="selectKpi('videoFinished')">大视频定制化需求完成率</span>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        <!-- <requirement-response
            v-if="kpiData === 'response'"
            :base-request-params="requestParams">
        </requirement-response>
        <requirement-finished
            v-else
            :base-request-params="requestParams"
            :kpi-data="kpiData">
        </requirement-finished> -->
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import DirectExportExcel from 'common/components/DirectExportExcel';
import { EXPORT_KPI_RESPONSE_URL, EXPORT_KPI_FINISHED_URL, EXPORT_KPI_VIDEO_FINISHED_URL } from '@/constants/api';
import RequirementResponse from './requirementResponse';
import RequirementFinished from './requirementFinished';

import ListMixins from '@/mixins/list';
import api from '@/utils/api';

export default {
    name: 'KPIOriginData',

    components: { DirectExportExcel, RequirementResponse, RequirementFinished },

    mixins: [ListMixins],

    data() {
        return {
            // 默认显示当前年份，当前以后不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            requestParams: {
                year: '',
                quarter: '',
                project_id: ''
            },
            kpiData: 'response', // 记录当前所选的kpi指标查询条件
            kpiOriginDataExportUrl: '', // 导出KPI原始数据链接
            exportParams: {
                // 导出参数
                year: '',
                quarter: ''
            },
            projectList: [], // 项目列表
            filterItem: [] // 筛选条件数组
        };
    },
    computed: {
        ...mapState({})
    },
    watch: {},
    beforeMount() {
        if (this.$route.query.kpi) {
            this.kpiData = this.$route.query.kpi;
        }
        this.getProjectList();
        this.getCurrentDate();
    },

    methods: {
        // 获取项目列表
        getProjectList() {
            let params = {
                type: 'all',
                project_name: ''
            };
            api.queryProjectsList(params).then(res => {
                this.projectList = res.result;
                if (this.$route.query.project_id) {
                    this.currentProjectId = Number(this.$route.query.project_id);
                } else {
                    this.currentProjectId = res.result[0].project_id; // 默认显示第一个项目
                }
            });
        },
        // 导出
        exportUrl() {
            this.exportParams.year = this.requestParams.year;
            this.exportParams.quarter = this.currentQuarter;
            if (this.kpiData === 'response') {
                this.kpiOriginDataExportUrl = EXPORT_KPI_RESPONSE_URL;
            } else if (this.kpiData === 'finished') {
                this.kpiOriginDataExportUrl = EXPORT_KPI_FINISHED_URL;
            } else if (this.kpiData === 'videoFinished') {
                this.kpiOriginDataExportUrl = EXPORT_KPI_VIDEO_FINISHED_URL;
            }
            let queryConditionTemp = JSON.parse(JSON.stringify(this.exportParams));

            let ip = window.config.context; // spms的前缀ip地址
            let kpiOriginDataExportUrl = this.kpiOriginDataExportUrl; // 原始数据导出的接口
            let queryCondition = `${encodeURIComponent(JSON.stringify(queryConditionTemp))}`; // 需要传入的参数
            let sessionId = `sessionId=${window.localStorage.sessionId}`; // 需要sessionId的验证
            return `${ip}${kpiOriginDataExportUrl}/${queryCondition}?${sessionId}`;
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
                this.quarterDisabledControl(this.actualQuarter, this.actualYear);
            }
        },
        // 选择季度
        selectQuarter(val, disabledParams) {
            if (disabledParams) {
                return false;
            } else {
                this.currentQuarter = val;
                this.requestParams.quarter = val;
            }
        },
        // 选择项目
        selectProject(val) {
            this.requestParams.project_id = val;
        },
        // 选择指标
        selectKpi(val) {
            this.kpiData = val;
        },

        ...mapActions([''])
    }
};
</script>

<style lang="less" scoped>
</style>
