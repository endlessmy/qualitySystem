<!--生产率度量-生产率管理-管理页面
@description:如果已经统计过，则默认起始时间为上次统计结束时间的后一个月，否则起始时间为‘2018-07’
author：jjq
date:2018/9/13-->
<template>
    <div class="container-main">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left">
                <span>生产率度量 > 生产率管理 > 管理页</span>
            </div>
        </div>

        <div
            id="mainScroll"
            class="main main-list ">
            <div class="main-wrap">
                <div class="condition-part clearfix">
                    <div class="condition-part-content">
                        <div class="line-dashed">
                            <span class="title long-title">统计时间：</span>
                            <el-date-picker
                                v-model="currentDateBegin"
                                :disabled="dateDisabled"
                                :clearable="false"
                                :editable="false"
                                :picker-options="pickerOptions"
                                popper-class="show-year"
                                type="month"
                                placeholder="开始时间"
                                @change="selectDateBegin">
                            </el-date-picker>
                            --
                            <el-date-picker
                                v-model="currentDateEnd"
                                :disabled="dateDisabled"
                                :clearable="false"
                                :editable="false"
                                :picker-options="pickerOptions"
                                popper-class="show-year"
                                type="month"
                                placeholder="结束时间"
                                @change="selectDateEnd">
                            </el-date-picker>
                        </div>
                        <div
                            v-if="operationRight"
                            class="detail">
                            <div class="detail-operate detail-btns">
                                <el-button
                                    :disabled="startButtonDisabled"
                                    type="primary"
                                    @click="startStatistic">
                                    <span>启动统计</span>
                                </el-button>
                                <el-button

                                    :disabled="endButtonDisabled"
                                    type="primary"
                                    @click="endStatistic">
                                    <span>结束统计</span>
                                </el-button>
                                <el-button
                                    :disabled="sendButtonDisabled"
                                    type="danger"
                                    @click="reSendEmail">
                                    <span>失败重发</span>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="main-list-row clearfix">
                    <div class="breadcrumbs left">
                        <span class="list-title">管理页({{ pageData.counts }})</span>
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
                        min-width="200"
                        label="项目名称"
                        prop="project_name">
                    </el-table-column>
                    <el-table-column
                        :render-header="renderEntryStatus"
                        label="状态"
                        width="100"
                        prop="input_status_alias">
                        <template scope="scope">
                            <span>
                                {{ scope.row.input_status_alias||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="150"
                        label="收件人">
                        <template scope="scope">
                            <span>
                                {{ scope.row.mail_acceptor_names||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :render-header="renderIsEntry"
                        prop="is_statistic"
                        width="150"
                        label="是否纳入统计">
                        <template scope="scope">
                            <QuicEditInline
                                v-if="operationRight && !quickEditDisabled"
                                :option-array="isEntryOrderList"
                                :row="scope.row"
                                :trigger-function="updateDataPage"
                                component-name="SelectQuickEdit"
                                row-key="is_statistic">
                            </QuicEditInline>
                            <span v-else>{{ scope.row.is_statistic_alias || '--' }} </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :render-header="renderMailStatus"
                        width="150"
                        label="邮件发送状态">
                        <template scope="scope">
                            <span>
                                {{ scope.row.is_send_mail_success_alias||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :render-header="renderSoftwareRange"
                        width="150"
                        label="软件应用范围">
                        <template scope="scope">
                            <span>
                                {{ scope.row.applied_range_alias||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :render-header="renderSoftwareDevelop"
                        width="150"
                        label="软件开发形式">
                        <template scope="scope">
                            <span>
                                {{ scope.row.develop_mode_alias||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :render-header="renderEntrust"
                        width="100"
                        label="委托方">
                        <template scope="scope">
                            <span>
                                {{ scope.row.entrust_party_alias||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </div>
    </div>
</template>
<script>
import MessageMixins from 'common/mixins/message';
import api from '@/utils/api';
import { mapActions, mapState } from 'vuex';
import Pager from 'common/components/Pager'; // 分页
import ListMixins from '@/mixins/list';
import {
    PAGE_SIZE,
    ENTRY_STATUS,
    ENTRY_LIST,
    IS_ENTRY,
    IS_ENTRY_LIST,
    MAIL_STATUS,
    MAIL_STATUS_LIST,
    SOFTWARE_RANGE,
    SOFTWARE_RANGE_LIST,
    SOFTWARE_DEVELOP,
    SOFTWARE_DEVELOP_LIST,
    ENTRUST,
    ENTRUST_LIST
} from '@/constants/const';
import QuicEditInline from '@/components/QuicEditInline';
export default {
    name: 'ProductivityManage',
    components: { Pager, QuicEditInline },
    mixins: [ListMixins, MessageMixins],
    data() {
        return {
            startButtonDisabled: true, // 启动统计按钮禁用
            endButtonDisabled: true, // 结束统计按钮禁用
            sendButtonDisabled: true, // 失败重发按钮禁用
            operationRight: '', // 超级管理员才有操作权限

            currentDateBegin: '', // 开始时间
            currentDateEnd: '', // 结束时间
            requestParams: {
                pageSize: PAGE_SIZE,
                pageNo: 1
            },
            entrySataus: ENTRY_STATUS, // 录入状态
            entryOrderList: ENTRY_LIST, // 录入状态：01 待录入 02已录入
            isEntry: IS_ENTRY, // 是否纳入统计
            isEntryOrderList: IS_ENTRY_LIST, // 是否纳入统计（01：是，02：否）
            mailStatus: MAIL_STATUS, // 邮件发送状态
            mailSendStatus: MAIL_STATUS_LIST, // 邮件发送状态：00失败，01成功，02正在发送
            softwareRange: SOFTWARE_RANGE, // 软件应用范围
            softwareRangeList: SOFTWARE_RANGE_LIST, // 软件应用范围:1对内,2对外
            softwareDevelop: SOFTWARE_DEVELOP, // 软件开发形式
            softwareDevelopList: SOFTWARE_DEVELOP_LIST, // 软件开发形式:1自研，2委托，3自研+委托，4人力支撑，5自研+人力支撑
            entrust: ENTRUST, // 委托方
            entrustList: ENTRUST_LIST, // 委托方：10苏研,11杭研,12卓望,13亚信,14煜衡,15华为,16网达,17青岛海信,18科大讯飞,19东信北邮
            filterItem: [], // 筛选条件数组
            projectList: [],
            selectDateCopyBegin: '', // 开始时间的备份
            selectDateCopyEnd: '', // 结束时间的备份
            // 默认显示当前年份，当前以后不可选，且2018年7月之前不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < new Date('2018-07');
                }
            }
        };
    },
    computed: {
        ...mapState({
            tableList: ({ qualitySystem }) => qualitySystem.productivityManagePageList.result.data,
            pageData: ({ qualitySystem }) => qualitySystem.productivityManagePageList.basePage,
            managePageData: ({ qualitySystem }) => qualitySystem.productivityManagePageList.result,
            currentUserProvilege: ({ qualitySystem }) => qualitySystem.currUserPrivilege
        }),
        // 纳入统计是否可快速编辑
        quickEditDisabled() {
            return this.startButtonDisabled;
        },
        // 时间是否可以选择
        dateDisabled() {
            return !this.endButtonDisabled;
        }
    },
    watch: {
        currentUserProvilege(val) {
            // 超级管理员才有操作权限
            this.getOperationRight(val);
        },
        managePageData: {
            handler: function(newVal, oldVal) {
                this.startButtonDisabled = !newVal.statistic_finish_status;
                this.endButtonDisabled = newVal.statistic_finish_status;
                if (!newVal.statistic_finish_status) {
                    if (newVal.has_mail_failed === '00') {
                        this.sendButtonDisabled = true;
                    } else {
                        this.sendButtonDisabled = false;
                    }
                }
            },
            deep: true
        }
    },
    beforeMount() {
        this.getOperationRight(this.currentUserProvilege);
        this.getProductProjectList();
        this.getCurrentDate();
        this.requestList();
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

        // 启动统计
        startStatistic() {
            // 点击启动统计按钮后，该按钮置灰
            // 启动统计成功后，结束统计按钮可点击，日期不可选择
            this.confirmWarning({
                title: '提示',
                content: `即将启动统计，是否继续？`,
                type: 'info',
                confirmButtonClass: 'el-button--info confirm'
            }).then(
                () => {
                    let params = {
                        start_month: this.currentDateBegin,
                        end_month: this.currentDateEnd,
                        opt_type: '00'
                    };
                    api
                        .startStatistics(params)
                        .then(res => {
                            this.startButtonDisabled = true;
                            this.getCurrentDate();
                            this.endButtonDisabled = false;
                            this.requestList();
                            // 3s后重新请求列表获取最新的邮件状态
                            setTimeout(() => {
                                this.requestList();
                            }, 3000);
                        })
                        .catch(res => { });
                },
                () => {
                    // cancel remove from confirmation
                }
            );
        },
        // 结束统计
        endStatistic() {
            // 点击结束统计按钮后，该按钮置灰
            // 结束统计成功后，启动统计按钮可点击，日期可选择
            this.confirmWarning({
                title: '提示',
                content: `结束统计后，已启动统计的项目将不可录入数据，是否继续？`
            }).then(
                () => {
                    this.endButtonDisabled = true;
                    this.sendButtonDisabled = true;
                    api.endStatistics({}).then(res => {
                        this.getCurrentDate();
                        this.startButtonDisabled = false;
                        this.requestList();
                    });
                },
                () => {
                    // cancel remove from confirmation
                }
            );
        },
        // 邮件发送失败后重发邮件
        reSendEmail() {
            this.confirmWarning({
                title: '提示',
                content: `当前有邮件发送失败，是否重发？`
            }).then(
                () => {
                    this.sendButtonDisabled = true;
                    let params = {
                        start_month: this.currentDateBegin,
                        end_month: this.currentDateEnd,
                        opt_type: '01'
                    };
                    api.startStatistics(params).then(res => {
                        this.getCurrentDate();
                        this.endButtonDisabled = false;
                        this.requestList();
                        // 3s后重新请求列表获取最新的邮件状态
                        setTimeout(() => {
                            this.requestList();
                        }, 3000);
                    });
                },
                () => {
                    // cancel remove from confirmation
                }
            );
        },
        // 快速编辑的回调
        updateDataPage(func, params) {
            let send = {
                project_id: params.row.project_id
            };
            let rowIndex = params.row.index;
            params.update.filter(item => {
                send[item.key] = item.value;
                this.tableList[rowIndex][item.key] = item.value === -1 ? '' : item.value;
            });

            // 快速编辑字段到服务器
            api.updateStatisticStatus(send).then(res => {
                this.requestList();
            });
        },

        // 获取项目列表
        getProductProjectList() {
            api.queryProductProjectList().then(res => {
                this.projectList = res.result.map(item => {
                    let label = item.project_name;
                    let value = item.project_id;
                    return { label, value };
                });
            });
        },
        // 请求列表
        requestList(pageNo) {
            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            this.queryProductivityManagePageList(this.formatParams());
        },
        // 请求参数重置 && 筛选条件重置
        clearParams() {
            this.requestParams.pageNo = 1;
            this.requestParams.pageSize = PAGE_SIZE;
            this.requestParams.input_status = '';
            this.requestParams.is_statistic = '';
            this.requestParams.is_send_mail_success = '';
            this.requestParams.applied_range = '';
            this.requestParams.develop_mode = '';
            this.requestParams.entrust_party = '';
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
            api.queryManagePageDate({}).then(res => {
                this.currentDateBegin = res.result.start_month;
                this.currentDateEnd = res.result.end_month;
            });
        },
        // 查询开始时间
        selectDateBegin(val) {
            if (new Date(val).getTime() > new Date(this.currentDateEnd).getTime()) {
                this.showWarningMsg('开始时间不能大于结束时间');
                this.currentDateBegin = this.selectDateCopyBegin;
                return false;
            } else {
                this.currentDateBegin = val;
                this.selectDateCopyBegin = val;
            }
        },
        // 查询结束时间
        selectDateEnd(val) {
            if (new Date(this.currentDateBegin).getTime() > new Date(val).getTime()) {
                this.showWarningMsg('开始时间不能大于结束时间');
                this.currentDateEnd = this.selectDateCopyEnd;
                return false;
            } else {
                this.currentDateEnd = val;
                this.selectDateCopyEnd = val;
            }
        },

        ...mapActions(['queryProductivityManagePageList'])
    }
};
</script>
<style lang="less" scoped>
.detail .detail-operate {
    margin-top: 0px;
    font-size: 12px;
}
</style>
