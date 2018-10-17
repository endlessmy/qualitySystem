<!--生产率度量-生产率管理-数据页
@description：
1.可点击项目名称跳转至单个项目的数据详情页面
2.项目名称、统计状态可表头筛选
3.日期只可选择‘2018-07’以后、当前月以前的月份
author：jjq
date:2018/9/13-->
<template>
    <div class="container-main">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left">
                <span>生产率度量 > 生产率管理 > 数据页</span>
            </div>
        </div>

        <div
            id="mainScroll"
            class="main main-list ">
            <div class="main-wrap">
                <div class="condition-part clearfix">
                    <div class="condition-part-content">
                        <span class="title">月份：</span>
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

                <div class="main-list-row clearfix">
                    <div class="breadcrumbs left">
                        <span class="list-title">数据页({{ pageData.counts }})</span>
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
                        :page-data="pageData">
                    </Pager>
                </div>
                <el-table
                    :data="tableList"
                    :row-class-name="setRowClassName"
                    style="width: 100%"
                    empty-text="暂无数据"
                    @sort-change="sortChange">

                    <el-table-column
                        :render-header="renderProjects"
                        label="项目名称"
                        prop="project_name">
                        <template scope="scope">
                            <router-link
                                :to="{name: 'ProductivityDataDetail',query: {date: scope.row.statistic_month,project_name:scope.row.project_name,
                                                                             project_id: scope.row.project_id }}">
                                {{ scope.row.project_name }}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="统计月份"
                        width="300"
                        prop="avg_solve_time">
                        <template scope="scope">
                            <span>
                                {{ scope.row.statistic_month || '--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :render-header="renderStatisticStatus"
                        width="150"
                        label="统计状态">
                        <template scope="scope">
                            <span>
                                {{ scope.row.statistic_status_alias || '--' }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/utils/api';
import { mapActions, mapState } from 'vuex';
import Pager from 'common/components/Pager'; // 分页
import ListMixins from '@/mixins/list';
import { PAGE_SIZE, COUNT_STATUS, COUNT_STATUS_LIST } from '@/constants/const';
export default {
    name: 'ProductivityManageDataPage',
    components: { Pager },
    mixins: [ListMixins],
    data() {
        return {
            currentDate: '',
            requestParams: {
                statistic_month: '', // 统计年月
                pageSize: PAGE_SIZE,
                pageNo: 1,
                project_id: '',
                statistic_status: ''
            },
            filterItem: [], // 筛选条件数组
            projectList: [], // 项目列表
            countStatus: COUNT_STATUS, // 统计状态
            statisticStatusList: COUNT_STATUS_LIST, // 统计状态,00未统计,01未完成，02已完成
            // 默认显示当前月份，当前以后不可选,2019-07以前的月份不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < new Date('2018-07');
                }
            }
        };
    },

    computed: {
        ...mapState({
            tableList: ({ qualitySystem }) => qualitySystem.productivityDataPageList.result,
            pageData: ({ qualitySystem }) => qualitySystem.productivityDataPageList.basePage
        })
    },
    watch: {},
    beforeMount() {
        this.getProductProjectList();
        this.getCurrentDate();
    },
    // activated() {
    //     this.getCurrentDate();
    //     this.requestList();
    // },
    methods: {
        // 获取项目列表
        getProductProjectList() {
            api.queryProductProjectList({}).then(res => {
                this.projectList = res.result.map(item => {
                    let label = item.project_name;
                    let value = item.project_id;
                    return { label, value };
                });
            });
        },
        // 请求参数重置 && 筛选条件重置
        clearParams() {
            this.requestParams.project_id = '';
            this.requestParams.statistic_status = '';
        },
        // 请求列表
        requestList(pageNo) {
            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            this.queryProductivityDataPageList(this.formatParams());
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
        // 获取当前时间
        getCurrentDate() {
            api.queryCurrentDate().then(res => {
                if (this.$route.query.date) {
                    this.currentDate = String(this.$route.query.date);
                } else {
                    this.currentDate = res.result.date;
                }
                this.requestParams.statistic_month = this.currentDate;
            });
        },
        changeDate(val) {
            if (val === undefined) {
                this.requestParams.statistic_month = '';
            } else {
                this.requestParams.statistic_month = val;
                this.currentDate = val;
                this.requestList();
            }
        },
        ...mapActions(['queryProductivityDataPageList'])
    }
};
</script>
<style lang="less" scoped>
</style>
