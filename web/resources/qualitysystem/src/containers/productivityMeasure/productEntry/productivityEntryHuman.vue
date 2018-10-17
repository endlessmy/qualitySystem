<!--
@name: 质量系统——生产率度量——生产率录入页

@description:
1.在质量系统——生产率度量——生产率录入页，类别为“人力”，底部展示的列表
2.只有超管、项目经理可以修改自有人员数、外协人员数（只有在统计结束之前）
@author: 孙燕
@date: 2018/9/12
-->
<template>
    <div>
        <div class="main-list-row clearfix">
            <div class="breadcrumbs left">
                <div class="breadcrumbs left">
                    <span class="list-title">人力({{ tableListLength }})</span>
                </div>
            </div>
        </div>
        <el-table
            :data="tableList"
            :row-class-name="setRowClassName"
            style="width:100%"
            empty-text="暂无数据">
            <el-table-column
                :resizable="false"
                prop="type_name"
                label="角色">
            </el-table-column>
            <el-table-column
                :resizable="false"
                prop="statistic_type_alias"
                label="统计方式">
            </el-table-column>
            <el-table-column
                :resizable="false"
                :render-header="renderTipIcon"
                prop="staff_inner_count"
                label="自有人员数">
                <template scope="scope">
                    <span v-if="scope.row.statistic_type==='01' && isManagerRole && operationRight && isEnd && !noInput">
                        <QuicEditInline
                            :row="scope.row"
                            :trigger-function="updateDataPage"
                            component-name="InputQuickEdit"
                            row-key="staff_inner_count">
                        </QuicEditInline>
                    </span>
                    <span v-else-if="scope.row.staff_inner_count">
                        {{ Number(scope.row.staff_inner_count).toFixed(1) }}
                    </span>
                    <span v-else-if="scope.row.staff_inner_count===0">
                        {{ 0.0 }}
                    </span>
                    <span v-else>{{ '--' }}</span>
                </template>
            </el-table-column>
            <el-table-column
                :render-header="renderTipIcon"
                prop="staff_foreign_count"
                label="外协人员数">
                <template scope="scope">
                    <span v-if="scope.row.statistic_type==='01' && isManagerRole && operationRight && isEnd && !noInput">
                        <QuicEditInline
                            :row="scope.row"
                            :trigger-function="updateDataPage"
                            component-name="InputQuickEdit"
                            row-key="staff_foreign_count">
                        </QuicEditInline>
                    </span>
                    <span v-else-if="scope.row.staff_foreign_count">
                        {{ Number(scope.row.staff_foreign_count).toFixed(1) }}
                    </span>
                    <span v-else-if="scope.row.staff_foreign_count===0">
                        {{ 0.0 }}
                    </span>
                    <span v-else>{{ '--' }}</span>
                </template>
            </el-table-column>
            <el-table-column
                :resizable="false"
                :render-header="renderTipIcon"
                prop="human_all"
                label="人力合计">
                <template scope="scope">
                    <span v-if="scope.row.staff_inner_count!==null && scope.row.staff_foreign_count!==null && !noInput">
                        {{ Number(Number(scope.row.staff_inner_count)+Number(scope.row.staff_foreign_count)*0.5).toFixed(1) }}
                    </span>
                    <span v-else>{{ '--' }}</span>
                </template>
            </el-table-column>
        </el-table>
        <product-modal
            v-if="productModalVisible"
            v-model="productModalVisible"
            @onClose="onClose">
        </product-modal>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import ListMixins from '@/mixins/list'; // 引入公共方法
import QuicEditInline from '@/components/QuicEditInline'; // 快速编辑
import api from '@/utils/api';
import productModal from '@/components/productDialog'; // 弹窗
export default {
    name: 'ProductivityEntryHuman',
    components: {
        QuicEditInline,
        productModal
    },
    mixins: [ListMixins],
    props: {
        baseRequestParams: Object,
        isManagerRole: Boolean,
        noInput: Boolean
    },
    data() {
        return {
            tableList: [],
            tableListLength: '', // 人力列表记录数
            isEnd: false, // 判断统计是否结束
            productModalVisible: false, // 弹窗是否可见
            operationRight: false, // 用户权限
            requestParams: {}
        };
    },
    computed: {
        ...mapState({
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
            // 只有超管和项目经理才可编辑
            this.getOperationRight(val);
        }
    },
    beforeMount() {
        this.requestParams = { ...this.requestParams, ...this.baseRequestParams };
        this.getStatus();
        this.requestList();
        this.getOperationRight(this.currentUserProvilege);
    },
    methods: {
        // 获取操作权限，只有超管和项目经理才可编辑
        getOperationRight(val) {
            for (let i = 0; i < val.length; i++) {
                if (val[i] === '4' || val[i] === '2') {
                    this.operationRight = true;
                    break;
                } else {
                    this.operationRight = false;
                }
            }
        },
        // 查询统计状态,只有统计状态未结束时才可编辑
        getStatus() {
            api.queryCompleteStatus({}).then(res => {
                if (res.result.statistic_finish_status === false) {
                    // 可编辑
                    this.isEnd = true;
                } else {
                    // 不可编辑
                    this.isEnd = false;
                }
            });
        },
        // 快速编辑
        updateDataPage(func, params) {
            let send = {
                type_id: params.row.type_id,
                project_id: params.row.project_id,
                statistic_month: params.row.statistic_month
            };
            let rowIndex = params.row.index;
            params.update.filter(item => {
                send[item.key] = item.value;
                this.tableList[rowIndex][item.key] = item.value === -1 ? '' : item.value;
            });

            // 快速编辑字段到服务器
            if (send.type_id !== '' && send.project_id !== '' && send.statistic_month !== '') {
                api.edithumanDataValue(send).then(res => {
                    this.requestList();
                });
            }
        },
        // 请求列表
        requestList() {
            if (this.noInput) {
                // 如果月份列表和项目列表同时为空，则出现弹窗，同时调下面接口
                this.productModalVisible = true;
                api.queryStaffType({}).then(res => {
                    if (res.result) {
                        this.tableList = res.result;
                        this.tableListLength = res.result.length;
                    } else {
                        this.tableListLength = 0;
                    }
                });
            } else {
                // 如果月份和项目列表同时不为空，则调下面接口
                if (this.requestParams.project_id !== '' && this.requestParams.statistic_month !== '') {
                    api.queryProductivityEntryHumanDataList(this.formatParams()).then(res => {
                        if (res.result) {
                            this.tableList = res.result;
                            this.tableListLength = res.result.length;
                        } else {
                            this.tableListLength = 0;
                        }
                    });
                }
            }
        },
        // 关闭弹窗
        onClose() {
            this.$emit('input', false);
            this.productModalVisible = false;
        },
        // 格式化请求参数
        formatParams() {
            let finalParams = JSON.parse(JSON.stringify(this.requestParams));
            for (var key in finalParams) {
                if (key === 'version_id' && finalParams[key] !== '' && finalParams[key].indexOf(',') > -1) {
                    finalParams[key] = Number(finalParams[key].split(',')[0]);
                } else if (finalParams[key] && typeof finalParams[key] === 'string' && finalParams[key].indexOf(',') > -1) {
                    finalParams[key] = finalParams[key].split(',')[0];
                }
            }
            return finalParams;
        },
        ...mapActions([''])
    }
};
</script>
<style lang="less"></style>
