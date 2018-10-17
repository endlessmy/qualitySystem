<!--
@name: 质量系统——质量度量——各维度得分页

@description:在质量系统——质量度量——各维度得分页，查询维度为“运维”时，底部展示的列表
@author: 孙燕
@date: 2018/8/15
-->
<template>
    <div>
        <div
            id="mainScroll"
            class="main main-list table-style test-table dimension-table">
            <div class="main-wrap">
                <div class="main-list-row clearfix nopadding">
                    <div class="line-solid">
                        <div class="score-image-position"><span class="whole-score-icon-image"></span></div>
                        {{ baseRequestParams.start_date }}至{{ baseRequestParams.end_date }}
                        {{ projectName }}的运维总分：
                        <span
                            v-if="operationTotalScore"
                            class="quarter-whole-score">
                            {{ Number(operationTotalScore).toFixed(2) }}
                        </span>
                        <span
                            v-else-if="operationTotalScore===0"
                            class="quarter-whole-score">
                            {{ Number(0).toFixed(2) }}
                        </span>
                        <span
                            v-else
                            class="quarter-whole-score">{{ '--' }}</span>
                    </div>
                    <div class="breadcrumbs left">
                        <span class="list-title">运维得分({{ tableListLength }})</span>
                    </div>
                </div>
                <el-table
                    :data="tableList"
                    :border="true"
                    :row-class-name="setRowClassName"
                    :summary-method="getSummaries"
                    :height="tableHeight"
                    show-summary
                    style="width:100%"
                    empty-text="暂无数据">
                    <el-table-column
                        :resizable="false"
                        label="版本信息">
                        <el-table-column
                            :resizable="false"
                            prop="date"
                            width=""
                            label="月份">
                            <template scope="scope">
                                <span>
                                    {{ scope.row.date||'--' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            :render-header="renderTipIcon"
                            prop="month_score"
                            label="月度总分">
                            <template scope="scope">
                                <span v-if="scope.row.month_score">
                                    {{ Number(scope.row.month_score).toFixed(2) }}
                                </span>
                                <span v-else-if="scope.row.month_score===0">
                                    {{ Number(0).toFixed(2) }}
                                </span>
                                <span v-else>
                                    {{ '--' }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        label="程序变更部署">
                        <el-table-column
                            :resizable="false"
                            prop="deploy_failed_count"
                            width=""
                            label="失败次数">
                            <template scope="scope">
                                <span v-if="scope.row.deploy_failed_count">
                                    {{ scope.row.deploy_failed_count }}
                                </span>
                                <span v-else-if="scope.row.deploy_failed_count===0">
                                    {{ 0 }}
                                </span>
                                <span v-else>
                                    {{ '--' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            :render-header="renderTipIcon"
                            prop="deploy_score"
                            width=""
                            label="得分">
                            <template scope="scope">
                                <span v-if="scope.row.deploy_score">
                                    {{ parseInt(scope.row.deploy_score) }}
                                </span>
                                <span v-else-if="scope.row.deploy_score===0">
                                    {{ 0 }}
                                </span>
                                <span v-else>
                                    {{ '--' }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        label="告警">
                        <el-table-column
                            :resizable="false"
                            prop="business_alarm_rate"
                            width=""
                            label="告警率(个/监控项)">
                            <template scope="scope">
                                <el-popover
                                    ref="popover-defect"
                                    placement="right"
                                    width="200"
                                    trigger="click">
                                    <span v-if="scope.row.business_alarm_rate||scope.row.business_alarm_rate===0">
                                        业务告警数/业务监控指标数
                                        ={{ scope.row.business_alarm_count }}/{{ scope.row.business_monitor_count }}={{ Number(scope.row.business_alarm_rate).toFixed(4) }}
                                    </span>
                                    <span v-else>
                                        暂无数据
                                    </span>
                                </el-popover>
                                <a
                                    v-popover:popover-defect
                                    href="javascript:;">
                                    <span v-if="scope.row.business_alarm_rate">
                                        {{ Number(scope.row.business_alarm_rate).toFixed(4) }}
                                    </span>
                                    <span v-else-if="scope.row.business_alarm_rate===0">
                                        {{ Number(0).toFixed(4) }}
                                    </span>
                                    <span v-else>
                                        {{ '--' }}
                                    </span>
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            :render-header="renderTipIcon"
                            prop="business_alarm_score"
                            width=""
                            label="得分">
                            <template scope="scope">
                                <span v-if="scope.row.business_alarm_score">
                                    {{ parseInt(scope.row.business_alarm_score) }}
                                </span>
                                <span v-else-if="scope.row.business_alarm_score===0">
                                    {{ 0 }}
                                </span>
                                <span v-else>
                                    {{ '--' }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        label="故障">
                        <el-table-column
                            :resizable="false"
                            prop="trouble_rate"
                            width=""
                            label="故障率">
                            <template scope="scope">
                                <el-popover
                                    ref="popover-defect1"
                                    placement="right"
                                    width="200"
                                    trigger="click">
                                    <span v-if="scope.row.trouble_rate||scope.row.trouble_rate===0">
                                        业务故障工单数/业务监控指标数
                                        ={{ scope.row.trouble_count }}/{{ scope.row.business_monitor_count }}={{ getTroubleRate(scope.row.trouble_rate) }}%
                                    </span>
                                    <span v-else>
                                        暂无数据
                                    </span>
                                </el-popover>
                                <a
                                    v-popover:popover-defect1
                                    href="javascript:;">
                                    <span v-if="scope.row.trouble_rate">
                                        {{ getTroubleRate(scope.row.trouble_rate) }}%
                                    </span>
                                    <span v-else-if="scope.row.trouble_rate===0">
                                        {{ Number(0).toFixed(4) }}%
                                    </span>
                                    <span v-else>
                                        {{ '--' }}
                                    </span>
                                </a>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            :render-header="renderTipIcon"
                            prop="trouble_score"
                            width=""
                            label="得分">
                            <template scope="scope">
                                <span v-if="scope.row.trouble_score">
                                    {{ parseInt(scope.row.trouble_score) }}
                                </span>
                                <span v-else-if="scope.row.trouble_score===0">
                                    {{ 0 }}
                                </span>
                                <span v-else>
                                    {{ '--' }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column
                        :resizable="false"
                        label="故障解决">
                        <el-table-column
                            :resizable="false"
                            prop="trouble_solved_rate"
                            width=""
                            label="解决率">
                            <template scope="scope">
                                <span v-if="scope.row.trouble_solved_rate">
                                    {{ parseInt(scope.row.trouble_solved_rate) }}%
                                </span>
                                <span v-else-if="scope.row.trouble_solved_rate===0">
                                    {{ 0 }}%
                                </span>
                                <span v-else>
                                    {{ '--' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            :render-header="renderTipIcon"
                            prop="trouble_solved_score"
                            width=""
                            label="解决率得分">
                            <template scope="scope">
                                <span v-if="scope.row.trouble_solved_score">
                                    {{ parseInt(scope.row.trouble_solved_score) }}
                                </span>
                                <span v-else-if="scope.row.trouble_solved_score===0">
                                    {{ 0 }}
                                </span>
                                <span v-else>
                                    {{ '--' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            prop="trouble_avg_solved_time"
                            width=""
                            label="解决平均时长(h)">
                            <template scope="scope">
                                <span v-if="scope.row.trouble_avg_solved_time">
                                    {{ Number(scope.row.trouble_avg_solved_time).toFixed(2) }}
                                </span>
                                <span v-else-if="scope.row.trouble_avg_solved_time===0">
                                    {{ Number(0).toFixed(2) }}
                                </span>
                                <span v-else>
                                    {{ '--' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            :render-header="renderTipIcon"
                            prop="trouble_avg_solved_time_score"
                            width=""
                            label="解决平均时长得分">
                            <template scope="scope">
                                <span v-if="scope.row.trouble_avg_solved_time_score">
                                    {{ parseInt(scope.row.trouble_avg_solved_time_score) }}
                                </span>
                                <span v-else-if="scope.row.trouble_avg_solved_time_score===0">
                                    {{ 0 }}
                                </span>
                                <span v-else>
                                    {{ '--' }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import ListMixins from '@/mixins/list'; // 公共方法
import qualitySystemMixins from '@/mixins/qualitysystem';
export default {
    name: 'OperationList',
    mixins: [ListMixins, qualitySystemMixins],
    props: {
        baseRequestParams: Object,
        projectName: String
    },
    data() {
        return {
            requestParams: {},
            tableHeight: '',
            tableListLength: '', // 测试运维表格列表数
            fn: () => {
                // 用于window监听resize的方法
                this.computeHeightByEmpty('dimension', 'dimension-table', 101);
                if (this.tableListLength) {
                    this.computeHeigt(this.tableListLength);
                }
            }
        };
    },
    computed: {
        ...mapState({
            tableList: ({ qualitySystem }) => qualitySystem.dimensionOperationDataList,
            operationTotalScore: ({ qualitySystem }) => qualitySystem.operationTotalScore
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
        tableList(val) {
            if (val && val.length !== 0) {
                let tempCount = val.length;
                this.computeHeigt(tempCount);
            } else {
                this.computeHeightByEmpty('dimension', 'dimension-table', 101);
            }
        }
    },
    beforeMount() {
        this.requestParams = { ...this.requestParams, ...this.baseRequestParams };
        this.requestList();
    },
    mounted() {
        window.addEventListener('resize', this.fn);
        this.computeHeightByEmpty('dimension', 'dimension-table', 101);
    },
    destroyed() {
        window.removeEventListener('resize', this.fn);
    },
    methods: {
        // table有数据时通过计算设置table的高度和外层div的高度
        computeHeigt(tempCount) {
            if (tempCount) {
                let a = this.getListDivHeight('dimension') - 101;
                let tableHeadHeight = document.getElementsByTagName('thead')[0].clientHeight;
                let b = tempCount * 46 + 46 + tableHeadHeight; // 内容高度+合计高度+表头高度
                if (b > a) {
                    this.tableHeight = a;
                } else {
                    this.tableHeight = '';
                }
                if ((a - 153) / 46 < 4) {
                    // 页面上展示的条数
                    if (tempCount <= 8) {
                        let d = tempCount * 46 + 46 + tableHeadHeight; // 表体+表头+表尾的高度
                        this.tableHeight = d;
                        document.getElementsByClassName('dimension-table')[0].style.height = this.tableHeight + 110 + 'px';
                    } else {
                        this.tableHeight = 8 * 46 + 46 + tableHeadHeight;
                        document.getElementsByClassName('dimension-table')[0].style.height = this.tableHeight + 110 + 'px';
                    }
                } else {
                    document.getElementsByClassName('dimension-table')[0].style.height =
                        this.getListDivHeight('dimension') + 'px';
                }
            }
        },
        // 请求列表
        requestList() {
            if (
                this.requestParams.start_date === '' ||
                this.requestParams.end_date === '' ||
                this.requestParams.project_id === ''
            ) {
                return false;
            } else {
                this.queryDimensionOperationDataList(this.formatParams()).then(res => {
                    if (res.result.data) {
                        this.tableListLength = res.result.data.length;
                    } else {
                        this.tableListLength = 0;
                    }
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
        },
        // 各维度页面总分计算行的方法
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总分';
                } else if (index === 2) {
                    sums[index] = '--';
                } else if (index === 4) {
                    sums[index] = '--';
                } else if (index === 6) {
                    sums[index] = '--';
                } else if (index === 8) {
                    sums[index] = '--';
                } else if (index === 10) {
                    sums[index] = '--';
                } else {
                    const values = [];
                    for (let i = 0; i < data.length; i++) {
                        if (data[i][column.property] === null) {
                            values.push(data[i][column.property]);
                        } else {
                            values.push(Number(data[i][column.property]));
                        }
                    }
                    // const values = data.map(item => Number(item[column.property]));
                    let count = 0;
                    let every = 0;
                    let emptyCount = '';
                    let validDataCount = 0;
                    // 求和
                    for (let i = 0; i < values.length; i++) {
                        if (values[i] === null || values[i] === undefined) {
                            emptyCount -= 1;
                        } else {
                            validDataCount += 1;
                        }
                        count += values[i];
                    }
                    // 平均
                    if (validDataCount !== 0) {
                        every = count / validDataCount;
                    }
                    every = every.toFixed(2);
                    let emptyNumber = -1 * data.length;
                    if (emptyCount === emptyNumber) {
                        sums[index] = '--';
                    } else {
                        sums[index] = every;
                    }
                }
            });
            this.getScoreTd('lastLineScoreOperation', 'tooltipBoxScoreOperation', '各月份得分的平均分');

            return sums;
        },
        // 总分后加tip
        createTooltip(tipIcon, tooltipBoxId, htmlString) {
            let tooltipBox = document.createElement('div');
            tooltipBox.className = 'tooltip-box';
            tooltipBox.id = tooltipBoxId;
            tooltipBox.innerHTML = htmlString;
            tooltipBox.style.width = 'auto';
            tooltipBox.style.height = 'auto';
            tooltipBox.style.position = 'absolute';
            tooltipBox.style.display = 'block';
            let rectObject = tipIcon.getBoundingClientRect();
            let left = rectObject.left - 55;
            let top = rectObject.top - 45;
            tooltipBox.style.left = left + 'px';
            tooltipBox.style.top = top + 'px';
            let arrowTip = document.createElement('div');
            arrowTip.setAttribute('class', 'popper-arrow-tip-develop');
            tooltipBox.appendChild(arrowTip);

            return tooltipBox;
        },
        // 取四位小数点
        getTroubleRate(num) {
            return num.toFixed(4);
        },
        ...mapActions(['queryDimensionOperationDataList'])
    }
};
</script>
<style lang="less">
.test-table .el-table th > .cell,
.test-table .el-table tr {
    text-align: center;
}
</style>
