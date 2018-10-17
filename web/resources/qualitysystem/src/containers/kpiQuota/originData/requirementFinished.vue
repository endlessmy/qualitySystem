<!--
@name: 质量系统——KPI指标——原始数据页面——需求平均完成率table和大视频定制化需求完成率

@description:在kpi指标->原始数据页面，“指标”的筛选条件为“需求平均完成率”和“大视频定制化需求完成率”时，底部展示的列表
@author: jjq
@date: 2018/8/5
-->
<template>
    <!-- <div
        id="mainScroll"
        class="main main-list table-style kpi-table">
        <div class="main-wrap"> -->
    <div>
        <div class="main-list-row clearfix">
            <div class="breadcrumbs left">
                <span class="list-title">原始数据({{ pageData.counts }})</span>
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
                label="需求编号"
                width="120"
                prop="requirement_num">
            </el-table-column>
            <el-table-column
                label="需求标题"
                prop="requirement_title">
            </el-table-column>
            <el-table-column
                label="审批通过时间"
                width="150"
                prop="approve_end_time">
                <template scope="scope">
                    <span>
                        {{ scope.row.approve_end_time||'--' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="上线时间"
                width="150"
                prop="online_time">
                <template scope="scope">
                    <span>
                        {{ scope.row.online_time||'--' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderReachStandartStatus"
                width="150"
                label="达标状态">
                <template scope="scope">
                    <span>
                        {{ REACH_STANDARD_STATUS[scope.row.status ]||'--' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                width="200"
                label="负责人">
                <template scope="scope">
                    <span>
                        {{ scope.row.manager||'--' }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <!-- </div> -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { REACH_STANDARD_STATUS, STATE_LIST, PAGE_SIZE } from '@/constants/const';
import Pager from 'common/components/Pager';
import DirectExportExcel from 'common/components/DirectExportExcel';
import ListMixins from '@/mixins/list';
import qualitySystemMixins from '@/mixins/qualitysystem';

export default {
    name: 'KPIOriginData',

    components: { Pager, DirectExportExcel },

    mixins: [ListMixins, qualitySystemMixins],
    props: {
        baseRequestParams: Object,
        kpiData: String
    },

    data() {
        return {
            requestParams: {
                // 分页查询请求参数
                pageNo: 1, // 当前页面
                pageSize: PAGE_SIZE, // 每页记录数
                sortFields: '',
                sortFieldType: '',
                status: '' // 达标状态
            },
            filterItem: [], // 筛选条件数组
            REACH_STANDARD_STATUS: REACH_STANDARD_STATUS, // 达标状态code所对应的中文名称
            stateList: STATE_LIST // 达标状态下拉选项
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
            tableListFinished: ({ qualitySystem }) => qualitySystem.kpiOriginDataList.requirementFinished.result,
            pageDataFinished: ({ qualitySystem }) => qualitySystem.kpiOriginDataList.requirementFinished.basePage,
            tableListVideo: ({ qualitySystem }) => qualitySystem.kpiOriginDataList.videoeRquirementFinished.result,
            pageDataVideo: ({ qualitySystem }) => qualitySystem.kpiOriginDataList.videoeRquirementFinished.basePage
        }),
        tableList() {
            if (this.kpiData === 'finished') {
                return this.tableListFinished;
            } else {
                return this.tableListVideo;
            }
        },
        pageData() {
            if (this.kpiData === 'finished') {
                return this.pageDataFinished;
            } else {
                return this.pageDataVideo;
            }
        }
    },
    watch: {
        baseRequestParams: {
            handler: function(newVal, oldVal) {
                this.requestParams = { ...this.requestParams, ...newVal };
                this.requestList();
            },
            deep: true
        },
        kpiData(newVal, oldVal) {
            this.clearParams();
            this.filterItem = [];
            this.requestList();
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
        if (this.$route.query.kpi) {
            this.kpiData = this.$route.query.kpi;
        }
        if (this.$route.query.year) {
            this.baseRequestParams.year = this.$route.query.year;
        }
        if (this.$route.query.quarter) {
            this.baseRequestParams.quarter = this.$route.query.quarter;
        }
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
        //             document.getElementsByClassName('kpi-table')[0].style.height = b + 20 + 'px';
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
            this.requestParams.project_id = this.baseRequestParams.project_id;
            this.requestParams.status = '';
        },
        // 请求列表
        requestList(pageNo) {
            // this.pageSizeFit('requestParams', 'pageSize', 'kpi');

            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            if (this.kpiData === 'finished') {
                if (this.requestParams.year === '' || this.requestParams.quarter === '' || this.requestParams.project_id === '') {
                    return false;
                } else {
                    this.queryRequirementFinishedSourceData(this.formatParams());
                }
            } else if (this.kpiData === 'videoFinished') {
                if (this.requestParams.year === '' || this.requestParams.quarter === '' || this.requestParams.project_id === '') {
                    return false;
                } else {
                    this.queryVideoRequirementFinishedSourceData(this.formatParams());
                }
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

        ...mapActions(['queryRequirementFinishedSourceData', 'queryVideoRequirementFinishedSourceData'])
    }
};
</script>

<style lang="less" scoped>
</style>
