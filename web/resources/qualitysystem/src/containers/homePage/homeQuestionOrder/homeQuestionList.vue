<!--
@name: 质量系统——首页——问题工单

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
            class="main main-list">
            <div
                :class="isManager ? 'authority-data' : 'not-authority-data'"
                class="main-wrap">

                <div class="condition-part clearfix">
                    <div class="condition-part-content">
                        <span class="month">月份：</span>
                        <el-date-picker
                            v-model="currentDate"
                            :clearable="false"
                            :editable="false"
                            :picker-options="pickerOptions"
                            popper-class="show-year"
                            type="month"
                            placeholder="选择月"
                            @change="changeDate">
                        </el-date-picker>
                    </div>
                </div>
                <div class="condition-part">
                    <question-work-list
                        ref="allList"
                        :base-request-params="requestParams">
                    </question-work-list>
                </div>
                <my-projects-list
                    ref="myProjectsList"
                    :base-request-params="requestParams">
                </my-projects-list>
            </div>
        </div>
    </div>
    <!-- <div
            class="main main-list cascade-style">
            <div class="main-wrap">
                <div class="main-list-row clearfix">
                    <div class="clearfix">
                        <span class="month">月份：</span>
                        <el-date-picker
                            v-model="currentDate"
                            :clearable="false"
                            :editable="false"
                            :picker-options="pickerOptions"
                            popper-class="show-year"
                            type="month"
                            placeholder="选择月"
                            @change="changeDate">
                        </el-date-picker>
                    </div>
                </div>
            </div>
        </div> -->
    <!-- <question-work-list
            ref="allList"
            :base-request-params="requestParams"></question-work-list> -->
    <!-- <my-projects-list
            ref="myProjectsList"
            :base-request-params="requestParams"></my-projects-list> -->
    <!-- </div> -->
</template>

<script>
import { mapState } from 'vuex';
import Pager from 'common/components/Pager'; // 分页
import ListMixins from '@/mixins/list'; // 公共方法
import MyProjectsList from './myProjectsList';
import QuestionWorkList from './questionWorkList';
import api from '@/utils/api';

export default {
    name: 'HomeQuestionList',

    components: { Pager, MyProjectsList, QuestionWorkList },

    mixins: [ListMixins],

    data() {
        return {
            homeTab: '问题工单',
            requestParams: {
                date: '' // 统计年月
            },
            // 默认显示当前月份，当前以后不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            }
        };
    },
    computed: {
        ...mapState({
            isManager: ({ qualitySystem }) => qualitySystem.isManager
        })
    },
    watch: {},
    beforeMount() {
        this.getCurrentDate();
    },

    methods: {
        // 获取当前时间
        getCurrentDate() {
            api.queryCurrentDate().then(res => {
                this.currentDate = res.result.date;
                this.requestParams.date = this.currentDate;
            });
        },
        // 导航切换
        changeTab(value) {
            if (value === 'KPI指标') {
                this.$router.push('/qualitySystem/homeKpi');
            } else if (value === '质量度量') {
                this.$router.push('/qualitySystem/homeQualityDimension');
            }
        },
        // 查询时间
        changeDate(val) {
            if (val === undefined) {
                this.requestParams.date = '';
            } else {
                this.requestParams.date = val;
            }
        }
    }
};
</script>

<style lang="less">
.home-kpi-title {
    font-size: 14px;
}
.main-list-row .month {
    width: 60px;
    height: 12px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    color: #666666;
    line-height: 12px;
    display: inline-block;
}
</style>
