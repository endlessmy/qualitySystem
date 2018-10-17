<!--
@name: 生产率度量 - 生产率管理 - 数据页 - 数据详情（人力数据列表）
@description:
1.超级管理员任何时候都有快速编辑权限
2.人力数据的录入最多保留一位小数
3.人力合计由录入的自有人员数和外协人员数按照计算公式得出，且保留一位小数
@author: 姜继琦
@date: 2018/9/14
-->
<template>
    <div>
        <div class="main-list-row clearfix">
            <div class="breadcrumbs left">
                <span class="list-title">人力({{ tableList.length }})</span>
            </div>
        </div>
        <el-table
            :data="tableList"
            :row-class-name="setRowClassName"
            style="width: 100%"
            empty-text="暂无数据">
            <el-table-column
                prop="type_name"
                label="角色">
            </el-table-column>
            <el-table-column
                prop="statistic_type_alias"
                width="150"
                label="统计方式">
            </el-table-column>
            <el-table-column
                :render-header="renderTipIcon"
                prop="staff_inner_count"
                width="150"
                label="自有人员数">
                <template scope="scope">
                    <QuicEditInline
                        v-if="operationRight"
                        :row="scope.row"
                        :trigger-function="updateDataPage"
                        component-name="InputQuickEdit"
                        row-key="staff_inner_count">
                    </QuicEditInline>
                    <span v-else>{{ Number(scope.row.staff_inner_count).toFixed(1) || '--' }} </span>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderTipIcon"
                prop="staff_foreign_count"
                width="150"
                label="外协人员数">
                <template scope="scope">
                    <QuicEditInline
                        v-if="operationRight"
                        :row="scope.row"
                        :trigger-function="updateDataPage"
                        component-name="InputQuickEdit"
                        row-key="staff_foreign_count">
                    </QuicEditInline>
                    <span v-else>{{ Number(scope.row.staff_foreign_count).toFixed(1) || '--' }} </span>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderTipIcon"
                prop="human_all"
                width="150"
                label="人力合计">
                <template scope="scope">
                    <span v-if="scope.row.staff_inner_count !== null && scope.row.staff_foreign_count !== null">
                        {{ Number(Number(scope.row.staff_inner_count)+Number(scope.row.staff_foreign_count)*0.5).toFixed(1) }}
                    </span>
                    <span v-else>{{ '--' }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ListMixins from '@/mixins/list';
import QuicEditInline from '@/components/QuicEditInline'; // 快速编辑
import api from '@/utils/api';

export default {
    name: 'HumanData',
    components: { QuicEditInline },
    mixins: [ListMixins],
    props: {
        baseRequestParams: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            requestParams: {},
            operationRight: '' // 超级管理员才有操作权限
        };
    },
    computed: {
        ...mapState({
            tableList: ({ qualitySystem }) => qualitySystem.productivityEntryHumanDataList,
            currentUserProvilege: ({ qualitySystem }) => qualitySystem.currUserPrivilege
        })
    },
    watch: {
        baseRequestParams: {
            handler: function(newValue, oldValue) {
                this.requestParams = { ...this.requestParams, ...newValue };
                this.requestList();
            },
            deep: true
        },
        currentUserProvilege(val) {
            // 超级管理员才有操作权限
            this.getOperationRight(val);
        }
    },
    beforeMount() {
        this.requestParams = { ...this.requestParams, ...this.baseRequestParams };
        this.requestList();
        this.getOperationRight(this.currentUserProvilege);
    },

    methods: {
        // 获取操作权限，只有超级管理员才能进行启动统计、结束统计、失败重发的操作
        getOperationRight(val) {
            for (let i = 0; i < val.length; i++) {
                if (val[i] === '4') {
                    this.operationRight = true;
                    break;
                } else {
                    this.operationRight = false;
                }
            }
        },
        // 人力数据快速编辑的提交
        updateDataPage(func, params) {
            let send = {
                project_id: params.row.project_id,
                statistic_month: this.baseRequestParams.statistic_month,
                type_id: params.row.type_id
            };
            let rowIndex = params.row.index;
            params.update.filter(item => {
                send[item.key] = Number(item.value);
                this.tableList[rowIndex][item.key] = item.value === -1 ? '' : item.value;
            });

            // 快速编辑字段到服务器
            api.edithumanDataValue(send).then(res => {
                this.requestList();
            });
        },
        // 请求列表
        requestList(pageNo) {
            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            if (this.requestParams.project_id === '' || this.requestParams.statistic_month === '') {
                return false;
            } else {
                this.queryProductivityEntryHumanDataList(this.formatParams());
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
        ...mapActions(['queryProductivityEntryHumanDataList'])
    }
};
</script>

<style lang="less" scoped>
</style>
