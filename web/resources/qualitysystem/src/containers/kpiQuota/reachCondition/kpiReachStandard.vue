<!--
@name: 质量系统——KPI指标——达标情况页面

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
                <span>KPI指标 > 达标情况</span>
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
                                :editable="false"
                                :clearable="false"
                                :picker-options="pickerOptions"
                                popper-class="show-year"
                                type="year"
                                placeholder="请选择年"
                                @change="selectYear">
                            </el-date-picker>
                            <span
                                :class="{'selected-quarter':currentQuarter === 'Q1'}"
                                class="quarter"
                                @click="selectQuarter('Q1')">Q1</span>
                            <span
                                :class="{'selected-quarter':currentQuarter === 'Q2','disabled-quarter': quarterDisabledSecond}"
                                class="quarter"
                                @click="selectQuarter('Q2',quarterDisabledSecond)">Q2</span>
                            <span
                                :class="{'selected-quarter':currentQuarter === 'Q3','disabled-quarter': quarterDisabledThird}"
                                class="quarter"
                                @click="selectQuarter('Q3',quarterDisabledThird)">Q3</span>
                            <span
                                :class="{'selected-quarter':currentQuarter === 'Q4','disabled-quarter': quarterDisabledFourth}"
                                class="quarter"
                                @click="selectQuarter('Q4',quarterDisabledFourth)">Q4</span>
                        </div>
                        <div class="line-dashed">
                            <span class="title">指标：</span>
                            <span
                                :class="{'selected-quarter':kpiData==='response'}"
                                class="quarter"
                                @click="selectKpi('response')">需求响应及时率</span>
                            <span
                                :class="{'selected-quarter':kpiData==='finished'}"
                                class="quarter"
                                @click="selectKpi('finished')">需求平均完成率</span>
                            <span
                                :class="{'selected-quarter':kpiData==='videoFinished'}"
                                class="quarter"
                                @click="selectKpi('videoFinished')">大视频定制化需求完成率</span>
                        </div>
                        <div>
                            <span class="title">状态：</span>
                            <span
                                :class="{'selected-quarter':currentStatus==='all'}"
                                class="quarter"
                                @click="selectStatus('all')">全部</span>
                            <span
                                :class="{'selected-quarter':currentStatus==='qualified'}"
                                class="quarter"
                                @click="selectStatus('qualified')">达标</span>
                            <span
                                :class="{'selected-quarter':currentStatus==='unqualified'}"
                                class="quarter"
                                @click="selectStatus('unqualified')">未达标</span>
                        </div>
                    </div>
                </div>
                <response-timely-list
                    v-if="kpiData==='response'"
                    :kpi-data="kpiData"
                    :base-request-params="requestParams">
                </response-timely-list>
                <response-finished-list
                    v-else
                    :base-request-params="requestParams"
                    :kpi-data="kpiData">
                </response-finished-list>
            </div>
        </div>
    </div>
    <!-- <div
            class="main main-list cascade-style">
            <div class="main-wrap">
                <div class="main-list-row clearfix">
                    <div class="clearfix">
                        <div class="line-dashed">
                            <span class="title">季度：</span>
                            <el-date-picker
                                v-model="currentYear"
                                :editable="false"
                                :clearable="false"
                                :picker-options="pickerOptions"
                                popper-class="show-year"
                                type="year"
                                placeholder="请选择年"
                                @change="selectYear">
                            </el-date-picker>
                            <span
                                :class="{'selected-quarter':currentQuarter === 'Q1'}"
                                class="quarter"
                                @click="selectQuarter('Q1')">Q1</span>
                            <span
                                :class="{'selected-quarter':currentQuarter === 'Q2','disabled-quarter': quarterDisabledSecond}"
                                class="quarter"
                                @click="selectQuarter('Q2',quarterDisabledSecond)">Q2</span>
                            <span
                                :class="{'selected-quarter':currentQuarter === 'Q3','disabled-quarter': quarterDisabledThird}"
                                class="quarter"
                                @click="selectQuarter('Q3',quarterDisabledThird)">Q3</span>
                            <span
                                :class="{'selected-quarter':currentQuarter === 'Q4','disabled-quarter': quarterDisabledFourth}"
                                class="quarter"
                                @click="selectQuarter('Q4',quarterDisabledFourth)">Q4</span>
                        </div>
                        <div class="line-dashed">
                            <span class="title">指标：</span>
                            <span
                                :class="{'selected-quarter':kpiData==='response'}"
                                class="quarter"
                                @click="selectKpi('response')">需求响应及时率</span>
                            <span
                                :class="{'selected-quarter':kpiData==='finished'}"
                                class="quarter"
                                @click="selectKpi('finished')">需求平均完成率</span>
                            <span
                                :class="{'selected-quarter':kpiData==='videoFinished'}"
                                class="quarter"
                                @click="selectKpi('videoFinished')">大视频定制化需求完成率</span>
                        </div>
                        <div>
                            <span class="title">状态：</span>
                            <span
                                :class="{'selected-quarter':currentStatus==='all'}"
                                class="quarter"
                                @click="selectStatus('all')">全部</span>
                            <span
                                :class="{'selected-quarter':currentStatus==='qualified'}"
                                class="quarter"
                                @click="selectStatus('qualified')">达标</span>
                            <span
                                :class="{'selected-quarter':currentStatus==='unqualified'}"
                                class="quarter"
                                @click="selectStatus('unqualified')">未达标</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <response-timely-list
            v-if="kpiData==='response'"
            :kpi-data="kpiData"
            :base-request-params="requestParams">
        </response-timely-list>
        <response-finished-list
            v-else
            :base-request-params="requestParams"
            :kpi-data="kpiData">
        </response-finished-list>
    </div> -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Pager from 'common/components/Pager'; // 分页
import ListMixins from '@/mixins/list';
import api from '@/utils/api';
import ResponseTimelyList from './responseTimelyList';
import ResponseFinishedList from './responseFinishedList';
export default {
    name: 'KPIReachStandard',

    components: {
        Pager,
        ResponseTimelyList,
        ResponseFinishedList
    },

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
                status: 'all' // 状态
            },
            pageData: [],
            filterItem: [], // 筛选条件数组
            tableList: [],
            currentQuarter: '', // 当前季度
            kpiData: 'response', // 查询当前KPI指标情况
            currentStatus: 'all' // 默认情况下状态选择为“全部”
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
        if (this.$route.query.status) {
            this.currentStatus = this.$route.query.status;
            this.requestParams.status = this.currentStatus;
        }
        this.getCurrentDate();
    },

    methods: {
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
        // 选择指标
        selectKpi(val) {
            this.kpiData = val;
        },
        // 选择状态
        selectStatus(val) {
            this.currentStatus = val;
            this.requestParams.status = val;
        },
        ...mapActions([])
    }
};
</script>

<style lang="less" scoped>
</style>
