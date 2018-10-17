<!--
@name: 质量系统——首页——KPI指标

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
                <span class="home-kpi-title">首页</span>
                <span class="divide-line"></span>
                <div style=" display: inline-block">
                    <el-radio-group
                        v-model="homeTab"
                        class="home-kpi-radio-group"
                        size="small"
                        @change="changeTab">
                        <el-radio-button label="质量度量"></el-radio-button>
                        <el-radio-button label="KPI指标"></el-radio-button>
                        <el-radio-button label="问题工单"></el-radio-button>
                    </el-radio-group>
                </div>
            </div>
        </div>

        <div
            id="mainScroll"
            class="main main-list ">
            <div
                :class="isManager ? 'authority-data' : 'not-authority-data'"
                class="main-wrap">

                <div class="condition-part clearfix">
                    <div class="condition-part-content">
                        <span class="title">季度：</span>
                        <el-date-picker
                            v-model="currentYear"
                            :clearable="false"
                            :editable="false"
                            :picker-options="pickerOptions"
                            popper-class="show-year"
                            type="year"
                            placeholder="选择年"
                            @change="selectYear">
                        </el-date-picker>
                        <span
                            :class="{'selected-quarter': currentQuarter === 'Q1'}"
                            class="quarter first-quarter"
                            @click="selectQuarter('Q1')">Q1</span>
                        <span
                            :class="{'selected-quarter': currentQuarter === 'Q2', 'disabled-quarter': quarterDisabledSecond}"
                            class="quarter"
                            @click ="selectQuarter('Q2', quarterDisabledSecond)">Q2</span>
                        <span
                            :class="{'selected-quarter': currentQuarter === 'Q3', 'disabled-quarter': quarterDisabledThird}"
                            class="quarter"
                            @click ="selectQuarter('Q3', quarterDisabledThird)">Q3</span>
                        <span
                            :class="{'selected-quarter': currentQuarter === 'Q4', 'disabled-quarter': quarterDisabledFourth}"
                            class="quarter"
                            @click ="selectQuarter('Q4',quarterDisabledFourth)">Q4</span>
                    </div>
                </div>

                <div class="chart-box">
                    <div class="chart-requirement">
                        <div class="main-list-row clearfix">
                            <div class="container-canvas-kpi clearfix">
                                <span class="chart-title-kpi">
                                    <span>需求响应及时率</span>
                                    <el-tooltip
                                        popper-class="home-kpi-tip-popper"
                                        class="item"
                                        effect="light"
                                        content="本季度新增需求工单中3个工作日内开始处理的比例"
                                        placement="top">
                                        <i class="icon-wenhao"></i>
                                    </el-tooltip>
                                </span>
                                <div class="chart-kpi">
                                    <echart-pie
                                        :chart-data="chartData.requirementResponse">
                                    </echart-pie>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chart-requirement">
                        <div class="main-list-row clearfix">
                            <div class="container-canvas-kpi clearfix">
                                <span class="chart-title-kpi">
                                    <span>需求平均完成率</span>
                                    <el-tooltip
                                        popper-class="home-kpi-tip-popper"
                                        class="item"
                                        effect="light"
                                        content="当月完成前三个月审批通过的需求中上线需求的比例"
                                        placement="top">
                                        <i class="icon-wenhao"></i>
                                    </el-tooltip>
                                </span>
                                <div class="chart-kpi">
                                    <echart-pie
                                        :chart-data="chartData.requirementFinished">
                                    </echart-pie>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class=" chart-requirement">
                        <div class="main-list-row clearfix">
                            <div class="container-canvas-kpi clearfix">
                                <span class="chart-title-kpi">
                                    <span>大视频定制化需求完成率</span>
                                    <el-tooltip
                                        popper-class="home-kpi-tip-popper"
                                        class="item"
                                        effect="light"
                                        content="当月完成前三个月审批通过的大视频相关需求工单中的上线比例"
                                        placement="top">
                                        <i class="icon-wenhao"></i>
                                    </el-tooltip>
                                </span>
                                <div class="chart-kpi">
                                    <echart-pie
                                        :chart-data="chartData.videoRequirementFinished">
                                    </echart-pie>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    v-if="isManager"
                    class="home-kpi-table">
                    <div class="main-list-row clearfix">
                        <div class="breadcrumbs left">
                            <span>我负责的项目({{ pageData.counts }})</span>
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
                            <div class="filter-item filter-clear">
                                <span
                                    v-show="filterItem.length > 1"
                                    class="clear"
                                    @click="clearAll">清除所有条件</span>
                            </div>

                        </div>
                        <Pager
                            :request-list="requestList"
                            :page-data="pageData" />
                    </div>
                    <el-table
                        :data="tableList"
                        :border="true"
                        :row-class-name="setRowClassName"
                        style="width: 100%"
                        empty-text="暂无数据"
                        @sort-change="sortChange">
                        <el-table-column
                            :render-header="renderProjects"
                            prop="project_name"
                            label="项目名称">
                        </el-table-column>
                        <el-table-column label="需求响应及时率">
                            <el-table-column
                                prop="requirement_response_rate"
                                sortable="custom"
                                label="当前百分值"
                                width="150">
                                <template scope="scope">
                                    <span v-if="scope.row.requirement_response_rate">
                                        <router-link
                                            :to="{name: 'KPIoriginData',query: {year: scope.row.year,
                                                                                quarter: scope.row.quarter,
                                                                                project_id: scope.row.project_id,
                                                                                kpi: 'response'}}">
                                            {{ scope.row.requirement_response_rate }}%
                                        </router-link>
                                    </span>
                                    <span v-else-if="scope.row.requirement_response_rate === 0">
                                        {{ 0 }}%
                                    </span>
                                    <span v-else>
                                        {{ '--' }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :render-header="renderRequirementReponseStatus"
                                label="达标状态"
                                width="150">
                                <template scope="scope">
                                    <span>
                                        {{ REACH_STANDARD_STATUS[scope.row.requirement_response_status]||'--' }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="需求平均完成率">
                            <el-table-column
                                prop="requirement_finished_rate"
                                sortable="custom"
                                label="当前百分值"
                                width="150">
                                <template scope="scope">
                                    <span v-if="scope.row.requirement_finished_rate">
                                        <router-link
                                            :to="{name: 'KPIoriginData',query: {year: scope.row.year,
                                                                                quarter: scope.row.quarter,
                                                                                project_id: scope.row.project_id,
                                                                                kpi: 'finished'}}">
                                            {{ scope.row.requirement_finished_rate }}%
                                        </router-link>
                                    </span>
                                    <span v-else-if="scope.row.requirement_finished_rate === 0">
                                        {{ 0 }}
                                    </span>
                                    <span v-else>
                                        {{ '--' }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :render-header="renderRequirementFinishedStatus"
                                label="达标状态"
                                width="150">
                                <template scope="scope">
                                    <span>
                                        {{ REACH_STANDARD_STATUS[scope.row.requirement_finished_status]||'--' }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="大视频定制化需求完成率">
                            <el-table-column
                                prop="video_requirement_finished_rate"
                                sortable="custom"
                                label="当前百分值"
                                width="150">
                                <template scope="scope">
                                    <span v-if="scope.row.video_requirement_finished_rate">
                                        <router-link
                                            :to="{name: 'KPIoriginData',query: {year: scope.row.year,
                                                                                quarter: scope.row.quarter,
                                                                                project_id: scope.row.project_id,
                                                                                kpi: 'videoFinished'}}">
                                            {{ scope.row.video_requirement_finished_rate }}%
                                        </router-link>
                                    </span>
                                    <span v-else-if="scope.row.video_requirement_finished_rate === 0">
                                        {{ 0 }}
                                    </span>
                                    <span v-else>
                                        {{ '--' }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :render-header="renderVideoFinishedStatus"
                                label="达标状态"
                                width="150">
                                <template scope="scope">
                                    <span>
                                        {{ REACH_STANDARD_STATUS[scope.row.video_requirement_finished_status]||'--' }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
    <!-- <div
            class="main main-list cascade-style">
            <div class="main-wrap">
                <div class="main-list-row clearfix">
                    <div class="clearfix">
                        <span class="title">季度：</span>
                        <el-date-picker
                            v-model="currentYear"
                            :clearable="false"
                            :editable="false"
                            :picker-options="pickerOptions"
                            popper-class="show-year"
                            type="year"
                            placeholder="选择年"
                            @change="selectYear">
                        </el-date-picker>
                        <span
                            :class="{'selected-quarter': currentQuarter === 'Q1'}"
                            class="quarter first-quarter"
                            @click="selectQuarter('Q1')">Q1</span>
                        <span
                            :class="{'selected-quarter': currentQuarter === 'Q2', 'disabled-quarter': quarterDisabledSecond}"
                            class="quarter"
                            @click ="selectQuarter('Q2', quarterDisabledSecond)">Q2</span>
                        <span
                            :class="{'selected-quarter': currentQuarter === 'Q3', 'disabled-quarter': quarterDisabledThird}"
                            class="quarter"
                            @click ="selectQuarter('Q3', quarterDisabledThird)">Q3</span>
                        <span
                            :class="{'selected-quarter': currentQuarter === 'Q4', 'disabled-quarter': quarterDisabledFourth}"
                            class="quarter"
                            @click ="selectQuarter('Q4',quarterDisabledFourth)">Q4</span>
                    </div>
                </div>
            </div>
        </div> -->

    <!-- <div class="chart-box">
            <div
                class="main main-list chart-requirement">
                <div class="main-wrap">
                    <div class="main-list-row clearfix">
                        <div
                            class="container-canvas-kpi clearfix">
                            <span class="chart-title-kpi">
                                <span>需求响应及时率</span>
                                <el-tooltip
                                    popper-class="home-kpi-tip-popper"
                                    class="item"
                                    effect="light"
                                    content="本季度新增需求工单中3个工作日内开始处理的比例"
                                    placement="top">
                                    <i class="icon-wenhao"></i>
                                </el-tooltip>
                            </span>
                            <div class="chart-kpi">
                                <echart-pie
                                    :chart-data="chartData.requirementResponse">
                                </echart-pie>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="main main-list chart-requirement">
                <div class="main-wrap">
                    <div class="main-list-row clearfix">
                        <div class="container-canvas-kpi clearfix">
                            <span class="chart-title-kpi">
                                <span>需求平均完成率</span>
                                <el-tooltip
                                    popper-class="home-kpi-tip-popper"
                                    class="item"
                                    effect="light"
                                    content="当月完成前三个月审批通过的需求中上线需求的比例"
                                    placement="top">
                                    <i class="icon-wenhao"></i>
                                </el-tooltip>
                            </span>
                            <div class="chart-kpi">
                                <echart-pie
                                    :chart-data="chartData.requirementFinished">
                                </echart-pie>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="main main-list chart-requirement">
                <div class="main-wrap">
                    <div class="main-list-row clearfix">
                        <div class="container-canvas-kpi clearfix">
                            <span class="chart-title-kpi">
                                <span>大视频定制化需求完成率</span>
                                <el-tooltip
                                    popper-class="home-kpi-tip-popper"
                                    class="item"
                                    effect="light"
                                    content="当月完成前三个月审批通过的大视频相关需求工单中的上线比例"
                                    placement="top">
                                    <i class="icon-wenhao"></i>
                                </el-tooltip>
                            </span>
                            <div class="chart-kpi">
                                <echart-pie
                                    :chart-data="chartData.videoRequirementFinished">
                                </echart-pie>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

    <!-- <div
                v-if="isManager"
                id="mainScroll"
                class="main main-list table-style home-kpi-table">
                <div class="main-wrap home-kpi-main-wrap">
                    <div class="main-list-row clearfix">
                        <div class="breadcrumbs left">
                            <span>我负责的项目({{ pageData.counts }})</span>
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
                            <div class="filter-item filter-clear">
                                <span
                                    v-show="filterItem.length > 1"
                                    class="clear"
                                    @click="clearAll">清除所有条件</span>
                            </div>

                        </div>
                        <Pager
                            :request-list="requestList"
                            :page-data="pageData" />
                    </div>
                    <el-table
                        :data="tableList"
                        :border="true"
                        :row-class-name="setRowClassName"
                        style="width: 100%"
                        empty-text="暂无数据"
                        @sort-change="sortChange">
                        <el-table-column
                            :render-header="renderProjects"
                            prop="project_name"
                            label="项目名称">
                        </el-table-column>
                        <el-table-column label="需求响应及时率">
                            <el-table-column
                                prop="requirement_response_rate"
                                sortable="custom"
                                label="当前百分值"
                                width="150">
                                <template scope="scope">
                                    <span v-if="scope.row.requirement_response_rate">
                                        <router-link
                                            :to="{name: 'KPIoriginData',query: {year: scope.row.year,
                                                                                quarter: scope.row.quarter,
                                                                                project_id: scope.row.project_id,
                                                                                kpi: 'response'}}">
                                            {{ scope.row.requirement_response_rate }}%
                                        </router-link>
                                    </span>
                                    <span v-else-if="scope.row.requirement_response_rate === 0">
                                        {{ 0 }}%
                                    </span>
                                    <span v-else>
                                        {{ '--' }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :render-header="renderRequirementReponseStatus"
                                label="达标状态"
                                width="150">
                                <template scope="scope">
                                    <span>
                                        {{ REACH_STANDARD_STATUS[scope.row.requirement_response_status]||'--' }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="需求平均完成率">
                            <el-table-column
                                prop="requirement_finished_rate"
                                sortable="custom"
                                label="当前百分值"
                                width="150">
                                <template scope="scope">
                                    <span v-if="scope.row.requirement_finished_rate">
                                        <router-link
                                            :to="{name: 'KPIoriginData',query: {year: scope.row.year,
                                                                                quarter: scope.row.quarter,
                                                                                project_id: scope.row.project_id,
                                                                                kpi: 'finished'}}">
                                            {{ scope.row.requirement_finished_rate }}%
                                        </router-link>
                                    </span>
                                    <span v-else-if="scope.row.requirement_finished_rate === 0">
                                        {{ 0 }}
                                    </span>
                                    <span v-else>
                                        {{ '--' }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :render-header="renderRequirementFinishedStatus"
                                label="达标状态"
                                width="150">
                                <template scope="scope">
                                    <span>
                                        {{ REACH_STANDARD_STATUS[scope.row.requirement_finished_status]||'--' }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="大视频定制化需求完成率">
                            <el-table-column
                                prop="video_requirement_finished_rate"
                                sortable="custom"
                                label="当前百分值"
                                width="150">
                                <template scope="scope">
                                    <span v-if="scope.row.video_requirement_finished_rate">
                                        <router-link
                                            :to="{name: 'KPIoriginData',query: {year: scope.row.year,
                                                                                quarter: scope.row.quarter,
                                                                                project_id: scope.row.project_id,
                                                                                kpi: 'videoFinished'}}">
                                            {{ scope.row.video_requirement_finished_rate }}%
                                        </router-link>
                                    </span>
                                    <span v-else-if="scope.row.video_requirement_finished_rate === 0">
                                        {{ 0 }}
                                    </span>
                                    <span v-else>
                                        {{ '--' }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                :render-header="renderVideoFinishedStatus"
                                label="达标状态"
                                width="150">
                                <template scope="scope">
                                    <span>
                                        {{ REACH_STANDARD_STATUS[scope.row.video_requirement_finished_status]||'--' }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table-column>
                    </el-table>
                </div>
            </div> -->
    <!-- </div>
</div> -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import EchartPie from '@/components/echartPie';
import api from '@/utils/api';
import ListMixins from '@/mixins/list';
import Pager from 'common/components/Pager';
import { PAGE_SIZE, REACH_STANDARD_STATUS, STATE_LIST } from '@/constants/const';

export default {
    name: 'HomeKpi',

    components: { EchartPie, Pager },

    mixins: [ListMixins],

    data() {
        return {
            homeTab: 'KPI指标',
            projectList: [],

            filterItem: [], // 筛选条件数组

            chartRequestParams: {
                year: '',
                quarter: ''
            },
            // 默认显示当前年份，当前以后不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            requestParams: {
                year: '',
                quarter: '',
                project_id: '', // 项目id
                requirement_response_status: '', // 需求响应及时率
                requirement_finished_status: '', // 需求平均完成率
                video_requirement_finished_status: '', // 大视频
                sortFields: '', // 排序字段，rate为当前及时率
                sortFieldType: '', // 排序方式，“ASC”升序，“DESC”降序
                pageNo: 1,
                pageSize: PAGE_SIZE
            },
            chartData: {
                requirementResponse: [],
                requirementFinished: [],
                videoRequirementFinished: []
            },
            REACH_STANDARD_STATUS: REACH_STANDARD_STATUS, // 达标状态code所对应的中文名称
            stateList: STATE_LIST // 达标状态下拉选项
        };
    },
    computed: {
        ...mapState({
            tableList: ({ qualitySystem }) => qualitySystem.homeKpiMyProjects.result,
            pageData: ({ qualitySystem }) => qualitySystem.homeKpiMyProjects.basePage,
            isManager: ({ qualitySystem }) => qualitySystem.isManager
        })
    },
    watch: {},
    beforeMount() {
        this.getCurrentDate();
        this.getProjectList();
    },

    methods: {
        // 获取项目列表
        getProjectList() {
            api.queryProjectsList({ type: 'mine' }).then(res => {
                this.projectList = res.result.map(item => {
                    let label = item.project_name;
                    let value = item.project_id;
                    return { label, value };
                });
            });
        },
        // 请求参数重置 && 筛选条件重置
        clearParams() {
            this.requestParams.pageNo = 1;
            this.requestParams.pageSize = PAGE_SIZE;
            this.requestParams.year = Number(this.currentYear);
            this.requestParams.quarter = this.currentQuarter;
            this.requestParams.project_id = '';
            this.requestParams.requirement_response_status = '';
            this.requestParams.requirement_finished_status = '';
            this.requestParams.video_requirement_finished_status = '';
            this.requestParams.sortFields = '';
            this.requestParams.sortFieldType = '';
        },
        // 导航切换
        changeTab(value) {
            if (value === '质量度量') {
                this.$router.push('/qualitySystem/homeQualityDimension');
            } else if (value === '问题工单') {
                this.$router.push('/qualitySystem/homeQuestionList');
            }
        },
        // 选择季度
        selectQuarter(val, disabledParams) {
            if (disabledParams) {
                return false;
            } else {
                this.currentQuarter = val;
                this.requestParams.quarter = val;
                this.chartRequestParams.quarter = val;
                this.getStatisticsData();
                this.requestList();
            }
        },
        // 选择年份
        selectYear(val) {
            this.currentYear = val;
            this.quarterDisabledControl(this.actualQuarter, this.actualYear);
            this.requestParams.year = Number(val);
            this.chartRequestParams.year = Number(val);
            this.getStatisticsData();
            this.requestList();
        },
        // 获取当前时间
        getCurrentDate() {
            api.queryCurrentDate().then(res => {
                this.currentQuarter = res.result.quarter;
                this.currentYear = res.result.date.split('-')[0];
                this.actualYear = res.result.date.split('-')[0];
                this.actualQuarter = res.result.quarter;
                this.requestParams.year = Number(this.currentYear);
                this.chartRequestParams.year = Number(this.currentYear);
                this.requestParams.quarter = this.currentQuarter;
                this.chartRequestParams.quarter = this.currentQuarter;
            });
        },
        // 请求列表
        requestList(pageNo) {
            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            if (this.isManager) {
                // 是项目经理才发请求拿列表数据
                this.queryKpiMyProjectsList(this.formatParams());
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
        getStatisticsData() {
            api.queryKpiStatusRate(this.chartRequestParams).then(res => {
                let responseData = this.fromatPieData(res.requirement_response, 'response', res.year, res.quarter);
                let finishedData = this.fromatPieData(res.requirement_finished, 'finished', res.year, res.quarter);
                let videoFinishedData = this.fromatPieData(
                    res.video_requirement_finished,
                    'videoFinished',
                    res.year,
                    res.quarter
                );
                this.chartData.requirementResponse = responseData;

                this.chartData.requirementFinished = finishedData;
                this.chartData.videoRequirementFinished = videoFinishedData;
            });
        },
        fromatPieData(arr, type, currentYear, currentQuarter) {
            for (let i = 0; i < arr.length; i++) {
                let itemStyle = {
                    normal: {
                        label: {
                            show: true,
                            position: 'inner',
                            formatter: function(params) {
                                return params.data.value + '%';
                            },
                            color: '#fff',
                            fontSize: 14
                        },
                        labelLine: {
                            show: false
                        }
                    }
                };
                if (arr[i].value === 0) {
                    itemStyle.normal.label.show = false;
                } else if (arr[i].value === 100) {
                    itemStyle.normal.label.show = true;
                    itemStyle.normal.label.position = 'center';
                } else {
                    itemStyle.normal.label.show = true;
                }
                let kpi = type;
                this.$set(arr[i], 'itemStyle', itemStyle);
                this.$set(arr[i], 'kpi', kpi);
                this.$set(arr[i], 'currentYear', currentYear);
                this.$set(arr[i], 'currentQuarter', currentQuarter);
            }
            return arr;
        },

        ...mapActions(['queryKpiMyProjectsList'])
    }
};
</script>
<style lang="less" scoped>
.chart-box {
    display: flex;
    margin-left: -20px;
    background: rgb(233, 237, 241);
}
.chart-requirement {
    flex: 1;
    height: auto;
    display: inline-block;
    padding: 0px 0px 20px 20px;
}

.home-kpi-title {
    font-size: 14px;
    color: #333;
}
.chart-kpi {
    width: 100%;
    height: 236px;
}
</style>

<style lang='less'>
.home-kpi-radio-group .el-radio-button--small .el-radio-button__inner {
    font-size: 12px;
    color: #666;
    border-radius: 0px;
}
.home-kpi-radio-group .el-radio-button--small.is-active .el-radio-button__inner {
    color: #fff;
    background-color: #539eff;
}
// .home-kpi-table {
//     height: auto !important;
// }
.home-kpi-table .el-table th > .cell,
.home-kpi-table .el-table tr {
    text-align: center;
}
.home-kpi-table .el-table .el-table__body tr td:nth-child(n + 2) {
    text-indent: -10px;
}
</style>
