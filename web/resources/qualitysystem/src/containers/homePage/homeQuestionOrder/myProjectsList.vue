<!--
@name: 质量系统——首页——KPI指标
@description:
@author: jjq
@date: 2018/7/30
-->
<template>
    <div v-if="isManager">
        <div class="main-list-row clearfix">
            <div class="breadcrumbs left">
                <span class="list-title">我负责的项目({{ pageData.counts }})</span>
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
                label="排名"
                width="80"
                prop="rank" />
            <el-table-column
                :render-header="renderProjects"
                label="项目名称"
                prop="project_name">
                <template scope="scope">
                    <router-link
                        :to="{name: 'QuestionOriginData',query: {date: scope.row.date,
                                                                 project_id: scope.row.project_id }}">
                        {{ scope.row.project_name }}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                label="缺陷数"
                sortable="custom"
                width="150"
                prop="defect_count">
                <template scope="scope">
                    <span v-if="scope.row.defect_count">
                        {{ scope.row.defect_count }}
                    </span>
                    <span v-else-if="scope.row.defect_count===0">
                        {{ 0 }}
                    </span>
                    <span v-else>
                        {{ '--' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="缺陷平均遗留天数"
                width="150"
                prop="avg_solve_time">
                <template scope="scope">
                    <span v-if="scope.row.avg_solve_time">
                        {{ scope.row.avg_solve_time }}
                    </span>
                    <span v-else-if="scope.row.avg_solve_time===0">
                        {{ 0 }}
                    </span>
                    <span v-else>
                        {{ '--' }}
                    </span>
                </template>
            </el-table-column>

        </el-table>
    </div>

</template>

<script>
import { mapState } from 'vuex';
import Pager from 'common/components/Pager';
import ListMixins from '@/mixins/list';
import api from '@/utils/api';
import { PAGE_SIZE } from '@/constants/const';

export default {
    name: 'HomeQuestionList',

    components: { Pager },

    mixins: [ListMixins],
    props: {
        baseRequestParams: Object
    },

    data() {
        return {
            homeTab: '问题工单',
            requestParams: {
                type: 'mine', // 项目类型，"all"所有项目，"mine"当前登录用户负责的项目
                project_id: '', // 项目id（作为筛选字段）
                sortFields: '', // 排序字段，"defect_count"缺陷数
                sortFieldType: '', // 排序方式 "ASC"升序，"DESC"降序
                pageSize: PAGE_SIZE,
                pageNo: 1
            },
            tableList: [],
            pageData: {},
            projectList: [],
            filterItem: [] // 筛选条件数组
        };
    },
    computed: {
        ...mapState({
            isManager: ({ qualitySystem }) => qualitySystem.isManager
        })
    },
    watch: {
        baseRequestParams: {
            handler: function(newVal, oldVal) {
                this.requestParams = { ...this.requestParams, ...newVal };
                this.requestList();
            },
            deep: true
        }
    },
    beforeMount() {
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
            this.requestParams.date = '';
            this.requestParams.type = 'mine';
            this.requestParams.project_id = '';
            this.requestParams.sortFields = '';
            this.requestParams.sortFieldType = '';
        },
        // 请求列表
        requestList(pageNo) {
            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            if (this.isManager) {
                api.queryHomeQuestionWorkOrderList(this.formatParams()).then(res => {
                    this.tableList = res.result;
                    this.pageData = res.basePage;
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
        }
    }
};
</script>

<style lang="less" scoped>
</style>
