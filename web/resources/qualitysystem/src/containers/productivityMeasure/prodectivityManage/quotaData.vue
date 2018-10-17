<!--
@name: 生产率度量 - 生产率管理 - 数据页 - 数据详情（指标数据列表）
@description:
1.可快速编辑录入指标值
2.超级管理员有编辑权限
3.录入数据类型只能为整数
@author: 姜继琦
@date: 2018/9/14
-->
<template>
    <div>
        <div class="main-list-row clearfix">
            <div class="breadcrumbs left">
                <span class="list-title">指标({{ tableList.length }})</span>
            </div>
        </div>
        <el-table
            :data="tableList"
            :row-class-name="setRowClassName"
            style="width: 100%"
            empty-text="暂无数据">
            <el-table-column
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
                prop="item_statistic_type_alias"
                width="100"
                label="统计方式">
            </el-table-column>
            <el-table-column
                prop="item_source_type_alias"
                width="150"
                label="获取渠道">
            </el-table-column>
            <el-table-column
                prop="item_data"
                width="300"
                label="指标值">
                <template scope="scope">
                    <QuicEditInline
                        v-if="operationRight"
                        :row="scope.row"
                        :trigger-function="updateDataPage"
                        component-name="InputQuickEdit"
                        row-key="item_data">
                    </QuicEditInline>
                    <span v-else>{{ scope.row.item_data || '--' }} </span>
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
    name: 'QuotaData',

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
            tableList: ({ qualitySystem }) => qualitySystem.productivityEntryCategoryDataList,
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
        // 指标值录入提交方法
        updateDataPage(func, params) {
            let send = {
                project_id: params.row.project_id,
                statistic_month: this.baseRequestParams.statistic_month,
                item_id: params.row.item_id
            };
            let rowIndex = params.row.index;
            params.update.filter(item => {
                send[item.key] = Number(item.value);
                this.tableList[rowIndex][item.key] = item.value === -1 ? '' : item.value;
            });

            // 快速编辑字段到服务器
            api.editQuotaDataValue(send).then(res => {
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
                this.queryProductivityEntryCategoryDataList(this.formatParams());
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
        ...mapActions(['queryProductivityEntryCategoryDataList'])
    }
};
</script>

<style lang="less" scoped>
.line-space {
    line-height: 20px;
}
</style>
