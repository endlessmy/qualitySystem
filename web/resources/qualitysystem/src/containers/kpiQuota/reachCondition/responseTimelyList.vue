<!--
@name: 质量系统——KPI指标——达标情况页面-需求响应及时率

@description:在kpi指标->达标情况页面，“指标”的筛选条件为“需求平均完成率”和“大视频定制化需求完成率”时，底部展示的列表
@author: 孙燕
@date: 2018/8/4
-->
<template>
    <div>
        <!-- <div
            id="mainScroll"
            class="main main-list table-style kpi-table">
            <div class="main-wrap"> -->
        <div class="main-list-row clearfix">
            <div class="breadcrumbs left">
                <span class="list-title">达标情况({{ pageData.counts }})</span>
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
            :row-class-name="setRowClassName"
            style="width: 100%"
            empty-text="暂无数据"
            @sort-change="sortChange">
            <el-table-column
                :render-header="renderProjects"
                prop="project_name"
                label="项目名称">
                <template scope="scope">
                    <router-link
                        :to="{path:'kpiOriginData',
                              query:{year:scope.row.year,
                                     quarter:scope.row.quarter,
                                     project_id:scope.row.project_id,
                                     kpi:kpiData}}">
                        {{ scope.row.project_name }}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                prop="requirement_count"
                width="100"
                label="总工单数">
                <template scope="scope">
                    <span v-if="scope.row.requirement_count">
                        {{ scope.row.requirement_count }}
                    </span>
                    <span v-else-if="scope.row.requirement_count===0">
                        {{ 0 }}
                    </span>
                    <span v-else>
                        {{ '--' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="responsed_count"
                width="150"
                label="及时处理工单数">
                <template scope="scope">
                    <span v-if="scope.row.responsed_count">
                        {{ scope.row.responsed_count }}
                    </span>
                    <span v-else-if="scope.row.responsed_count===0">
                        {{ 0 }}
                    </span>
                    <span v-else>
                        {{ '--' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="rate"
                width="120"
                sortable="custom"
                label="当前及时率">
                <template scope="scope">
                    <span v-if="scope.row.rate">
                        {{ scope.row.rate }}%
                    </span>
                    <span v-else-if="scope.row.rate===0">
                        {{ 0 }}%
                    </span>
                    <span v-else>
                        {{ '--' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="standard_rate"
                width="120"
                label="考核标准">
                <template scope="scope">
                    <span v-if="scope.row.standard_rate">
                        {{ scope.row.standard_rate }}%
                    </span>
                    <span v-else-if="scope.row.standard_rate===0">
                        {{ 0 }}%
                    </span>
                    <span v-else>
                        {{ '--' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="statusVisible"
                prop="status"
                width="150"
                label="达标状态">
                <template scope="scope">
                    <span>
                        {{ REACH_STANDARD_STATUS[scope.row.status ]||'--' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderApprover"
                prop="manager_name"
                width="200"
                label="负责人">
                <template scope="scope">
                    <span>
                        {{ scope.row.manager_name||'--' }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <!-- </div> -->
        <!-- </div> -->
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Pager from 'common/components/Pager';
import ListMixins from '@/mixins/list';
import qualitySystemMixins from '@/mixins/qualitysystem';

import api from '@/utils/api';
import { REACH_STANDARD_STATUS, PAGE_SIZE } from '@/constants/const';

export default {
    name: 'KPIReachStandardTimely',

    components: { Pager },

    mixins: [ListMixins, qualitySystemMixins],

    props: {
        baseRequestParams: {
            type: Object,
            required: true
        },
        kpiData: String
    },

    data() {
        return {
            requestParams: {
                project_id: '',
                user_id: '',
                sortFields: '', // 排序字段，rate为当前及时率
                sortFieldType: '', // 排序方式，“ASC”升序，“DESC”降序
                pageSize: PAGE_SIZE,
                pageNo: 1
            },
            projectList: [],
            filterItem: [], // 筛选数组
            statusVisible: true,
            REACH_STANDARD_STATUS: REACH_STANDARD_STATUS // 达标状态code所对应的中文名称
            // fn: () => {
            //     this.computeHeightByEmpty('kpi', 'kpi-table', 50);
            //     if (this.tableList.length) {
            //         this.computeHeigt(this.tableList.length);
            //     }
            // }
        };
    },
    computed: {
        ...mapState({
            tableList: ({ qualitySystem }) => qualitySystem.kpiReachTimelyData.result,
            pageData: ({ qualitySystem }) => qualitySystem.kpiReachTimelyData.basePage,
            // 用于负责人表头筛选
            userList: ({ qualitySystem }) => qualitySystem.userList
        }),
        checkstatus() {
            return this.requestParams.status;
        },
        checkKpi() {
            return this.kpiData;
        }
    },
    watch: {
        baseRequestParams: {
            handler: function(newValue, oldValue) {
                this.requestParams = { ...this.requestParams, ...newValue };
                this.requestList();
            },
            deep: true
        }
        // tableList(val) {
        //     if (val.length !== 0) {
        //         let tempCount = val.length;
        //         this.computeHeigt(tempCount);
        //     }
        // }
    },
    beforeMount() {
        this.requestParams = { ...this.requestParams, ...this.baseRequestParams };
        this.getProjectList();
        this.requestList();
    },

    mounted() {
        // window.addEventListener('resize', this.fn);
        // this.computeHeightByEmpty('kpi', 'kpi-table', 50);
    },
    destroyed() {
        // window.removeEventListener('resize', this.fn);
    },
    methods: {
        // computeHeigt(tempCount) {
        //     if (tempCount) {
        //         let a = this.getListDivHeight('kpi');
        //         let b = tempCount * 55 + 46 + 50;
        //         if (b > a) {
        //             document.getElementsByClassName('kpi-table')[0].style.height = b + 'px';
        //         } else {
        //             document.getElementsByClassName('kpi-table')[0].style.height = this.getListDivHeight('kpi') + 'px';
        //         }
        //     }
        // },
        // 请求参数重置 && 筛选条件重置
        clearParams() {
            this.requestParams.pageNo = 1;
            this.requestParams.pageSize = PAGE_SIZE;
            this.requestParams.year = this.baseRequestParams.year;
            this.requestParams.quarter = this.baseRequestParams.quarter;
            this.requestParams.project_id = '';
            this.requestParams.user_id = '';
            this.requestParams.status = this.baseRequestParams.status;
            this.requestParams.sortFields = '';
            this.requestParams.sortFieldType = '';
        },
        // 获取项目列表
        getProjectList() {
            api.queryProjectsList({ type: 'all' }).then(res => {
                this.projectList = res.result.map(item => {
                    let label = item.project_name;
                    let value = item.project_id;
                    return { label, value };
                });
            });
        },
        // 请求列表
        requestList(pageNo) {
            // this.pageSizeFit('requestParams', 'pageSize', 'kpi');

            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            if (this.checkstatus === 'all') {
                this.statusVisible = true;
            } else if (this.checkstatus === 'qualified' || this.checkstatus === 'unqualified') {
                this.statusVisible = false;
            }
            if (this.requestParams.status === '' || this.requestParams.year === '' || this.requestParams.quarter === '') {
                return false;
            } else {
                this.queryKpiReachTimelyData(this.formatParams());
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
        ...mapActions(['queryKpiReachTimelyData'])
    }
};
</script>

<style lang="less" scoped>
.table-style .el-table th.el-table_1_column_1 {
    text-indent: 30px;
}
</style>
