<!--
@name: 质量系统——首页——质量度量

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
                <div style="display:inline-block">
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
            class="main main-list">
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
                            :class="{'selected-quarter': currentQuarter === 'Q1','disabled-quarter': quarterDisabledOne}"
                            class="quarter first-quarter"
                            @click="selectQuarter('Q1',quarterDisabledOne)">Q1</span>
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
                        <el-tooltip
                            popper-class="home-kpi-tip-popper"
                            class="item"
                            effect="light"
                            content="目前只能查询2018年Q3季度之后的数据"
                            placement="top">
                            <i class="icon-wenhao"></i>
                        </el-tooltip>
                    </div>
                </div>
                <div class="condition-part">
                    <whole-score-list
                        ref="homeWholeScoreList"
                        :base-request-params="requestParams">
                    </whole-score-list>
                </div>
                <about-me-big-project
                    ref="aboutMeList"
                    :base-request-params="requestParams">
                </about-me-big-project>
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
                            :class="{'selected-quarter': currentQuarter === 'Q1','disabled-quarter': quarterDisabledOne}"
                            class="quarter first-quarter"
                            @click="selectQuarter('Q1',quarterDisabledOne)">Q1</span>
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
                        <el-tooltip
                            popper-class="home-kpi-tip-popper"
                            class="item"
                            effect="light"
                            content="目前只能查询2018年Q3季度之后的数据"
                            placement="top">
                            <i class="icon-wenhao"></i>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div> -->
    <!-- <whole-score-list
            ref="homeWholeScoreList"
            :base-request-params="requestParams">
        </whole-score-list>
        <about-me-big-project
            ref="aboutMeList"
            :base-request-params="requestParams">
        </about-me-big-project> -->
    <!-- </div> -->
</template>
<script>
import { mapState } from 'vuex';
import ListMixins from '@/mixins/list'; // 公共方法
import Pager from 'common/components/Pager'; // 分页
import api from '@/utils/api';
import AboutMeBigProject from './aboutMeBigProject';
import WholeScoreList from './wholeScoreList';
export default {
    name: 'HomeQualityDimension',
    components: {
        AboutMeBigProject,
        WholeScoreList,
        Pager
    },
    mixins: [ListMixins],
    data() {
        let that = this;
        return {
            homeTab: '质量度量',
            requestParams: {
                year: '',
                quarter: ''
            },
            chooseAbleYear: '2018',
            // 默认显示当前年份,当前以后不可选，且2018之前不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < new Date(that.chooseAbleYear);
                }
            }
        };
    },
    computed: {
        ...mapState({
            isManager: ({ qualitySystem }) => qualitySystem.isManager
        })
    },
    beforeMount() {
        this.getCurrentDate();
    },
    methods: {
        // 导航切换
        changeTab(value) {
            if (value === 'KPI指标') {
                this.$router.push('/qualitySystem/homeKpi');
            } else if (value === '问题工单') {
                this.$router.push('/qualitySystem/homeQuestionList');
            }
        },
        // 获取当前时间
        getCurrentDate() {
            api.queryCurrentDate().then(res => {
                this.currentQuarter = res.result.quarter;
                this.currentYear = res.result.date.split('-')[0];
                this.actualYear = res.result.date.split('-')[0];
                this.actualQuarter = res.result.quarter;
                this.requestParams.year = Number(this.currentYear);
                this.requestParams.quarter = this.currentQuarter;
            });
        },
        // 选择年份
        selectYear(val) {
            this.currentYear = val;
            this.thisquarterDisabledControl(this.actualQuarter, this.actualYear);
            this.requestParams.year = Number(val);
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
        // 年份和季度限制（2018年7月之前不可选）
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
        }
    }
};
</script>
