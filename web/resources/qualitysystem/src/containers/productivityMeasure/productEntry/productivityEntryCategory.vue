<!--
@name: 质量系统——生产率度量——生产率录入页

@description:
1.在质量系统——生产率度量——生产率录入页，类别为“指标”，底部展示的列表
2.只有超管、项目经理可以修改指标值（只有在统计结束之前）
@author: 孙燕
@date: 2018/9/12
-->
<template>
    <div>
        <div class="main-list-row clearfix">
            <div class="breadcrumbs left">
                <div class="breadcrumbs left">
                    <span class="list-title">指标({{ tableListLength }})</span>
                </div>
            </div>
        </div>
        <el-table
            :data="tableList"
            :row-class-name="setRowClassName"
            style="width:100%;"
            empty-text="暂无数据">
            <el-table-column
                :resizable="false"
                prop="item_name"
                label="指标">
                <template
                    :render-header="renderTipIcon"
                    scope="scope">
                    {{ scope.row.item_name }}
                    <el-tooltip
                        popper-class="home-kpi-tip-popper"
                        class="item"
                        effect="light"
                        placement="top">
                        <div
                            v-if="scope.row.item_name==='接口调用量'"
                            slot="content"
                            class="line-space">
                            该月内后台接口被外部系统调用的次数之和（包括本系统前台及公司内外部其他业务系统）<br>注：内部接口的相互调用不算
                        </div>
                        <div
                            v-else-if="scope.row.item_name==='月度活跃用户数'"
                            slot="content"
                            class="line-space">
                            该月内访客之和<br>注：去除重复用户
                        </div>
                        <div
                            v-else-if="scope.row.item_name==='创建测试用例数'"
                            slot="content"
                            class="line-space">
                            本月内测试人员创建的手工测试用例个数+本月内测试人员创建的自动化用例数个数*3<br>注：仅算新增
                        </div>
                        <div
                            v-else-if="scope.row.item_name==='执行测试用例数'"
                            slot="content"
                            class="line-space">
                            该月内测试人员执行的手工用例数（不统计自动化用例执行次数）<br>注：1条用例多次的按多次统计
                        </div>
                        <div
                            v-else-if="scope.row.item_name==='提交缺陷数'"
                            slot="content"
                            class="line-space">
                            该月内测试提交的缺陷工单数量（已取消的缺陷工单不算）
                        </div>
                        <div
                            v-else-if="scope.row.item_name==='新增修改代码量'"
                            slot="content"
                            class="line-space">
                            该月内新增和修改代码量<br>注：不包含注释空行
                        </div>
                        <div
                            v-else-if="scope.row.item_name==='需求工单数'"
                            slot="content"
                            class="line-space">
                            该月内已上线的业务需求数量<br>注：数量需按照需求大小进行系数换算，其中，<br>
                            1-5人天：小需求 系数*1<br>
                            6-10人天：中需求 系数*2<br>
                            11-30人天：大需求 系统*3<br>
                            30天以上：超大需求 系数*5<br>
                            若没有填写实际工作量，则系数*1
                        </div>
                        <div
                            v-else-if="scope.row.item_name==='服务器数量'"
                            slot="content"
                            class="line-space">
                            某月某项目组维护的服务器数量
                        </div>
                        <div
                            v-else-if="scope.row.item_name==='上线版本数'"
                            slot="content"
                            class="line-space">
                            该月内上线的版本数量
                        </div>
                        <i class="icon-wenhao"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                :resizable="false"
                prop="item_statistic_type_alias"
                label="统计方式">
            </el-table-column>
            <el-table-column
                :resizable="false"
                prop="item_source_type_alias"
                label="获取渠道">
            </el-table-column>
            <el-table-column
                :resizable="false"
                prop="item_data"
                label="指标值">
                <template scope="scope">
                    <span v-if="scope.row.item_statistic_type==='01' && isManagerRole && operationRight && isEnd && !noInput ">
                        <quic-edit-inline
                            :row="scope.row"
                            :trigger-function="updateDataPage"
                            component-name="InputQuickEdit"
                            row-key="item_data">
                        </quic-edit-inline>
                    </span>
                    <span
                        v-else>
                        <span v-if="scope.row.item_data !== 0">{{ scope.row.item_data||'--' }}</span>
                        <span v-else>{{ scope.row.item_data }}</span>
                    </span>
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
    name: 'ProductivityEntryCategory',
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
            tableListLength: '', // 指标列表记录数
            isEnd: false, // 判断统计状态是否结束
            tableList: [],
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
                item_id: params.row.item_id,
                project_id: params.row.project_id,
                statistic_month: params.row.statistic_month
            };
            let rowIndex = params.row.index;
            params.update.filter(item => {
                send[item.key] = item.value;
                this.tableList[rowIndex][item.key] = item.value === -1 ? '' : item.value;
            });

            // 快速编辑字段到服务器
            if (send.item_id !== '' && send.project_id !== '' && send.statistic_month !== '') {
                api.editQuotaDataValue(send).then(res => {
                    this.requestList();
                });
            }
        },
        // 请求列表
        requestList() {
            if (this.noInput) {
                // 如果月份列表和项目列表同时为空，则出现弹窗，同时调下面接口
                this.productModalVisible = true;
                api.queryItemType({}).then(res => {
                    if (res.result && res.result.length !== 0) {
                        this.tableList = res.result;
                        this.tableListLength = res.result.length;
                    } else {
                        this.tableListLength = 0;
                    }
                });
            } else {
                // 如果月份和项目列表同时不为空，则调下面接口
                if (this.requestParams.project_id !== '' && this.requestParams.statistic_month !== '') {
                    api.queryProductivityEntryCategoryDataList(this.formatParams()).then(res => {
                        if (res.result && res.result.length !== 0) {
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
<style lang="less" scoped>
.line-space {
    line-height: 20px;
}
</style>
