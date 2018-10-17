<!-- 生产率度量 - 数据查询 - 项目组间排名 -->
<!--
@description:
@author: 姜继琦
@date: 2018/10/9
-->
<template>
    <div class="container-main">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left">
                <span>生产率度量 > 数据查询 > 项目组间排名</span>
            </div>
        </div>
        <div
            id="mainScroll"
            class="main main-list">
            <div class="main-wrap">
                <div class="condition-part clearfix">
                    <div class="condition-part-content">
                        <div class="line-dashed">
                            <el-row>
                                <el-col
                                    :span="12">
                                    <span class="title long-title">查询时间：</span>
                                    <div class="product-select">
                                        <div class="time-select">
                                            <el-date-picker
                                                v-model="currentDateBegin"
                                                :editable="false"
                                                :clearable="false"
                                                :picker-options="pickerOptions"
                                                type="month"
                                                popper-class="show-year"
                                                @change="selectDateBegin">
                                            </el-date-picker>
                                        </div>
                                        --
                                        <div class="time-select">
                                            <el-date-picker
                                                v-model="currentDateEnd"
                                                :editable="false"
                                                :clearable="false"
                                                :picker-options="pickerOptions"
                                                type="month"
                                                popper-class="show-year"
                                                @change="selectDateEnd">
                                            </el-date-picker>
                                        </div>

                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="line-dashed">
                            <el-row>
                                <el-col :span="12">
                                    <span class="title long-title">项目标签：</span>
                                    <div class="project-select product-select">
                                        <el-select
                                            v-model="currentProjectTag"
                                            filterable
                                            @change="selectProjectTag">
                                            <el-option
                                                v-for="item in projectTagList"
                                                :key="item.tag_code"
                                                :label="item.tag_name"
                                                :value="item.tag_code"></el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <span class="title long-title">项目名称：</span>
                                    <div class="project-select product-select">
                                        <el-select
                                            v-model="currentProjectId"
                                            filterable
                                            multiple
                                            placeholder="请选择"
                                            @change="selectProject">
                                            <el-option
                                                v-for="item in projectList"
                                                :key="item.project_id"
                                                :label="item.project_name"
                                                :value="item.project_id">
                                            </el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <div>
                            <el-row>
                                <el-col :span="12">
                                    <span class="title long-title">人力统计：</span>
                                    <span
                                        :class="{'selected-quarter':currentStatistics==='divideRole'}"
                                        class="quarter"
                                        @click="selectStatistic('divideRole')">
                                        分角色
                                    </span>
                                    <span
                                        :class="{'selected-quarter':currentStatistics==='projectWhole'}"
                                        class="quarter"
                                        @click="selectStatistic('projectWhole')">
                                        项目整体
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="title long-title">查询维度：</span>
                                    <span
                                        :class="{'selected-quarter':currentDimension==='all'}"
                                        class="quarter"
                                        @click="selectDimension('all')">
                                        全部
                                    </span>
                                    <span
                                        :class="{'selected-quarter':currentDimension==='develop'}"
                                        class="quarter"
                                        @click="selectDimension('develop')">
                                        开发
                                    </span>
                                    <span
                                        :class="{'selected-quarter':currentDimension==='test'}"
                                        class="quarter"
                                        @click="selectDimension('test')">
                                        测试
                                    </span>
                                    <span
                                        :class="{'selected-quarter':currentDimension==='operation'}"
                                        class="quarter"
                                        @click="selectDimension('operation')">
                                        运维
                                    </span>
                                    <span
                                        v-show="isSystemUse"
                                        :class="{'selected-quarter':currentDimension==='systemUse'}"
                                        class="quarter"
                                        @click="selectDimension('systemUse')">
                                        系统使用
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>

                <div class="main-list-row clearfix">
                    <echart-bar-multi
                        :chart-data="chartData"
                        class="chart">
                    </echart-bar-multi>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import ListMixins from '@/mixins/list'; // 公共方法
import api from '@/utils/api';
import EchartBarMulti from '@/components/echartBarMulti'; // 柱状图
import MessageMixins from 'common/mixins/message'; // 查询时间提示

export default {
    name: 'ProductivityEntry',

    components: {
        EchartBarMulti
    },
    mixins: [ListMixins, MessageMixins],
    data() {
        let that = this;
        return {
            chartData: {
                // 横坐标值
                xAxisData: ['项目1', '项目2', '项目3', '项目4', '项目5', '项目6'],
                // 1月的值
                seriesDataA: [320, 332, 201, 334, 290, 23],
                // 2月的值
                seriesDataB: [120, 10, 301, 67, 390, 234],
                // 3月的值
                seriesDataC: [20, 32, 77, 29, 88, 56],
                // 部门均值
                seriesDataAverage: [100, 100, 100, 100, 100, 100],
                // 图例的值
                statisticLegend: ['1月', '2月', '3月', '部门均值']

            },
            currentDateBegin: '', // 开始时间
            currentDateEnd: '', // 结束时间
            saveBeginDate: '', // 输入框中保存的时间
            saveEndDate: '', // 输入框中保存的时间
            sevenMonth: '2018-07', // 开始时间只能选2018年7月以后
            currentStatistics: 'divideRole', // 当期人力统计
            currentDimension: 'all', // 当前维度
            currentProjectTag: '', // 项目标签
            currentProjectId: ['全部'], // 项目名称，默认显示全部
            projectList: [], // 项目名称列表
            projectTagList: [], // 项目标签列表
            isSystemUse: false, // 维度中的系统使用是否可见
            // 默认显示当前月，当前以后不可选，2018-7以前不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < new Date(that.sevenMonth);
                }
            }
        };
    },
    computed: {
        ...mapState({})
    },
    watch: {},
    beforeMount() {
        this.getCurrentDate();
        this.getProjectList();
        this.getProjectTagList();
    },
    methods: {
        // 字符串截断
        limitStr(val, limit) {
            const _limit = limit || 15;
            return val ? (val.length > _limit ? val.substring(0, _limit) + '...' : val) : '';
        },
        // 获取当前时间
        getCurrentDate() {
            api.queryCurrentDate().then(res => {
                this.currentDateBegin = res.result.date;
                this.currentDateEnd = res.result.date;
            });
        },
        // 获取项目列表
        getProjectList() { },
        // 获取项目标签列表
        getProjectTagList() {
            api.queryProjectTagList({}).then(res => {
                this.projectTagList = res.result;
                this.currentProjectTag = '全部';
            });
        },
        // 选择项目标签
        selectProjectTag(val) {
            this.currentProjectTag = val;
            api.queryProjectsByTag({ tag_code: this.currentProjectTag }).then(res => {
                this.projectList = res.result;
            });
        },
        // 选择项目
        selectProject(val) {
            let allProjectList = this.currentProjectId;
            allProjectList = val;
            // 去掉全部
            for (let i = 0; i < allProjectList.length; i++) {
                if (String(allProjectList[i]).indexOf('全部') !== -1) {
                    allProjectList.splice(i, 1);
                    break;
                }
            }
            // if (allProjectList.length === 0) {
            //     allProjectList[0] = '全部';
            //     console.log(allProjectList.length);
            // }
        },
        // 查询开始时间
        selectDateBegin(val) {
            let dateBegin = String(val);
            let dateEnd = String(this.currentDateEnd);
            // 拆分年月
            dateBegin = dateBegin.split('-');
            dateEnd = dateEnd.split('-');
            // 得到月数
            dateBegin = parseInt(dateBegin[0] * 12 + parseInt(dateBegin[1]));
            dateEnd = parseInt(dateEnd[0] * 12 + parseInt(dateEnd[1]));
            // 月份差值
            let monthSpan = Math.abs(dateEnd - dateBegin);
            if (new Date(val).getTime() > new Date(this.currentDateEnd).getTime()) {
                this.showWarningMsg('开始时间不能大于结束时间');
                this.currentDateBegin = this.saveBeginDate;
                return false;
            } else if (monthSpan > 5) {
                this.showWarningMsg('最大时间跨度为6个月');
                this.currentDateBegin = this.saveBeginDate;
                return false;
            } else {
                this.currentDateBegin = val;
                this.saveBeginDate = val;
            }
        },
        // 查询结束时间
        selectDateEnd(val) {
            let dateBegin = String(this.currentDateBegin);
            let dateEnd = String(val);
            // 拆分年月
            dateBegin = dateBegin.split('-');
            dateEnd = dateEnd.split('-');
            // 得到月数
            dateBegin = parseInt(dateBegin[0] * 12 + parseInt(dateBegin[1]));
            dateEnd = parseInt(dateEnd[0] * 12 + parseInt(dateEnd[1]));
            // 月份差值
            let monthSpan = Math.abs(dateEnd - dateBegin);
            if (new Date(val).getTime() < new Date(this.currentDateBegin)) {
                this.showWarningMsg('开始时间不能大于结束时间');
                this.currentDateEnd = this.saveEndDate;
                return false;
            } else if (monthSpan > 5) {
                this.showWarningMsg('最大时间跨度为6个月');
                this.currentDateEnd = this.saveEndDate;
                return false;
            } else if (this.isEnd === false) {
                this.showWarningMsg('当前选择月已结束统计');
                this.currentDateEnd = this.saveEndDate;
                return false;
            } else {
                this.currentDateEnd = val;
                this.saveEndDate = val;
            }
        },
        // 选择人力统计
        selectStatistic(val) {
            this.currentStatistics = val;
            if (this.currentStatistics === 'divideRole') {
                this.isSystemUse = false;
                this.currentDimension = 'all';
            } else {
                this.isSystemUse = true;
            }
        },
        // 选择维度
        selectDimension(val) {
            this.currentDimension = val;
        },
        // 根据当前维度获取不同维度柱状图

        // 请求参数重置 && 筛选条件重置
        clearParams() {
            this.requestParams.pageNo = 1;
            this.requestParams.pageSize = PAGE_SIZE;
        },

        // 将得分接口的数据转换成echarts柱状图需要的渲染形式

        // 导出
        exportUrl() { },
        // 格式化请求参数
        formatParams(params) {
            let finalParams = JSON.parse(JSON.stringify(params));
            for (var key in finalParams) {
                if (finalParams[key] && typeof finalParams[key] === 'string' && finalParams[key].indexOf(',') > -1) {
                    finalParams[key] = finalParams[key].split(',')[0];
                }
            }
            return finalParams;
        },
        ...mapActions([])
    }
};
</script>
<style lang="less" scoped>
.number-echart {
    width: 100%;
    height: 600px;
    margin-top: 20px;
    padding: 0 20px;
}
</style>
