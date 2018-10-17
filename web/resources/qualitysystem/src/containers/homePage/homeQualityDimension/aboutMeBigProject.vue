<!--
@name: 质量系统——质量度量页

@description:在质量度量页，与我有关的大项目列表
@author: jjq
@date: 2018/8/5
-->
<template>
    <div v-if="isManager">
        <div class="main-list-row clearfix">
            <div class="breadcrumbs left">
                <span class="list-title">与我相关的大项目({{ pageData.counts }})</span>
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
            </div>
            <Pager
                :request-list="requestList"
                :page-data="pageData" />
        </div>
        <el-table
            :data="tableList"
            style="width:100%"
            empty-text="暂无数据"
            @sort-change="sortChange">
            <el-table-column
                label="排名"
                prop="rank">
                <template scope="scope">
                    <span v-if= "scope.row.rank === -1">
                        <el-popover
                            ref="popover-defect"
                            placement="right"
                            width="200"
                            trigger="click"
                            content="当前季度不存在上线版本，不统计得分">
                        </el-popover>
                        <a
                            v-popover:popover-defect
                            href="javascript:;">
                            {{ '--' }}
                        </a>
                    </span>
                    <span v-else>
                        {{ scope.row.rank }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderBigProjectsByManager"
                label="大项目名称"
                prop="big_project_name">
            </el-table-column>
            <el-table-column
                label="整体得分"
                sortable="custom"
                prop="overall_score">
                <template scope="scope">
                    <span v-if="scope.row.overall_score === -1">
                        <el-popover
                            ref="popover-defect"
                            placement="right"
                            width="200"
                            trigger="click"
                            content="当前季度不存在上线版本，不统计得分">
                        </el-popover>
                        <a
                            v-popover:popover-defect
                            href="javascript:;">
                            {{ '--' }}
                        </a>
                    </span>
                    <span v-else>
                        {{ Number(scope.row.overall_score).toFixed(2) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template scope="scope">
                    <router-link
                        :to="{path:'wholeScore',query:{year:baseRequestParams.year,bigProjectId:scope.row.big_project_id,
                                                       quarter:baseRequestParams.quarter}}">
                        查看详情
                    </router-link>
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
    name: 'WholeScoreList',
    components: {
        Pager,
        PAGE_SIZE
    },
    mixins: [ListMixins],
    props: {
        baseRequestParams: Object
    },
    data() {
        return {
            homeTab: '质量度量',
            tableList: [],
            requestParams: {
                type: 'mine', // 项目类型，"all"所有大项目，"mine"当前登录用户相关的大项目
                big_project_id: '', // 大项目id（作为筛选字段）
                sortFields: '', // 排序字段，rate为当前及时率
                sortFieldType: '', // 排序方式，“ASC”升序，“DESC”降序
                pageNo: 1,
                pageSize: PAGE_SIZE
            },
            pageData: {},
            bigProjectList: [], // 大项目列表
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
                this.requestParams = {
                    ...this.requestParams,
                    ...newVal
                };
                this.requestList();
            },
            deep: true
        }
    },
    beforeMount() {
        this.getBigProjectList();
    },
    methods: {
        // 获取与我有关的大项目列表
        getBigProjectList() {
            api.queryBigProjectsByManager({}).then(res => {
                this.bigProjectList = res.result.map(item => {
                    // debugger;
                    let label = item.big_project_name;
                    let value = item.big_project_id;
                    return { label, value };
                });
            });
        },
        // 请求列表
        requestList(pageNo) {
            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            if (this.isManager) {
                if (this.requestParams.year === '' || this.requestParams.quarter === '' || this.requestParams.type === '') {
                    return false;
                } else {
                    api.queryHomeQualityDimensionDataList(this.formatParams()).then(res => {
                        this.tableList = res.result;
                        this.pageData = res.basePage;
                    });
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
        }
    }
};
</script>
<style>
</style>
