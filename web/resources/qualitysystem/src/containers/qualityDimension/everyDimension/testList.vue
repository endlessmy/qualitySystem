<!--
@name: 质量系统——质量度量——各维度得分页

@description:在质量系统——质量度量——各维度得分页，查询维度为“测试”时，底部展示的列表
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
                        {{ projectName }}的测试总分：
                        <span
                            v-if="testTotalScore"
                            class="quarter-whole-score">
                            {{ Number(testTotalScore).toFixed(2) }}
                        </span>
                        <span
                            v-else-if="testTotalScore===0"
                            class="quarter-whole-score">
                            {{ Number(0).toFixed(2) }}
                        </span>
                        <span
                            v-else
                            class="quarter-whole-score">{{ '--' }}</span>
                    </div>
                    <div class="breadcrumbs left">
                        <span class="list-title">测试得分({{ tableListLength }})</span>
                        <span
                            v-show="filterItem.length >0"
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
                            :render-header="renderVersion"
                            prop="version_num"
                            width=""
                            label="版本">
                            <template scope="scope">
                                <span>
                                    {{ scope.row.version_num||'--' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            prop="date"
                            width=""
                            label="上线时间">
                            <template scope="scope">
                                <span>
                                    {{ scope.row.date||'--' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            :render-header="renderVersionStatus"
                            prop="version_state_name"
                            width=""
                            label="状态">
                            <template scope="scope">
                                <span>
                                    {{ scope.row.version_state_name||'--' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :resizable="false"
                            :render-header="renderTipIcon"
                            prop="version_score"
                            width=""
                            label="版本总分">
                            <template scope="scope">
                                <span v-if="scope.row.version_score">
                                    {{ Number(scope.row.version_score).toFixed(2) }}
                                </span>
                                <span v-else-if="scope.row.version_score===0">
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
                        label="缺陷密度">
                        <el-table-column
                            :resizable="false"
                            prop="defect_density"
                            width=""
                            label="密度(个/kloc)">
                            <template scope="scope">
                                <el-popover
                                    ref="popover-defect"
                                    placement="right"
                                    width="200"
                                    trigger="click">
                                    <span v-if="scope.row.defect_density||scope.row.defect_density===0">
                                        缺陷总数/(新增代码量/1000)
                                        ={{ scope.row.version_defect_total_count }}/({{ scope.row.version_code_total_count }}/1000)={{ Number(scope.row.defect_density).toFixed(2) }}
                                    </span>
                                    <span v-else>
                                        暂无数据
                                    </span>
                                </el-popover>
                                <a
                                    v-popover:popover-defect
                                    href="javascript:;">
                                    <span v-if="scope.row.defect_density">
                                        {{ Number(scope.row.defect_density).toFixed(2) }}
                                    </span>
                                    <span v-else-if="scope.row.defect_density===0">
                                        {{ Number(0).toFixed(2) }}
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
                            prop="defect_density_score"
                            width=""
                            label="得分">
                            <template scope="scope">
                                <span v-if="scope.row.defect_density_score">
                                    {{ parseInt(scope.row.defect_density_score) }}
                                </span>
                                <span v-else-if="scope.row.defect_density_score===0">
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
                        label="发布遗留缺陷">
                        <el-table-column
                            prop="release_leave_defect_count"
                            width=""
                            label="数量">
                            <template scope="scope">
                                <span v-if="scope.row.release_leave_defect_count">
                                    {{ parseInt(scope.row.release_leave_defect_count) }}
                                </span>
                                <span v-else-if="scope.row.release_leave_defect_count===0">
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
                            prop="release_leave_defect_score"
                            width=""
                            label="得分">
                            <template scope="scope">
                                <span v-if="scope.row.release_leave_defect_score">
                                    {{ parseInt(scope.row.release_leave_defect_score) }}
                                </span>
                                <span v-else-if="scope.row.release_leave_defect_score===0">
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
                        label="缺陷回归不通过">
                        <el-table-column
                            prop="ressing_test_not_passed_count"
                            width=""
                            label="次数">
                            <template scope="scope">
                                <span v-if="scope.row.ressing_test_not_passed_count">
                                    {{ parseInt(scope.row.ressing_test_not_passed_count) }}
                                </span>
                                <span v-else-if="scope.row.ressing_test_not_passed_count===0">
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
                            prop="ressing_test_not_passed_score"
                            width=""
                            label="得分">
                            <template scope="scope">
                                <span v-if="scope.row.ressing_test_not_passed_score">
                                    {{ parseInt(scope.row.ressing_test_not_passed_score) }}
                                </span>
                                <span v-else-if="scope.row.ressing_test_not_passed_score===0">
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
import { VERSION_STATUS, VERSION_LIST } from '@/constants/const';
export default {
    name: 'TestList',
    mixins: [ListMixins, qualitySystemMixins],
    props: {
        baseRequestParams: Object,
        projectName: String
    },
    data() {
        return {
            requestParams: {
                version_id: '', // 版本id
                version_state_code: '' // 版本状态码
            },
            versionList: [], // 版本列表
            VERSION_STATUS: VERSION_STATUS, // 版本状态code所对应的中文名称
            versionOrderList: VERSION_LIST, // 版本状态下拉选项
            filterItem: [], // 筛选条件数组
            tableHeight: '', // 表格高度
            tableListLength: '', // 测试得分列表记录数
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
        type() {
            return this.projectName;
        },
        ...mapState({
            tableList: ({ qualitySystem }) => qualitySystem.dimensionTestDataList,
            testTotalScore: ({ qualitySystem }) => qualitySystem.testTotalScore
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
                let tempCount = val.length; // 列表数据的条数
                this.computeHeigt(tempCount);
            } else {
                this.computeHeightByEmpty('dimension', 'dimension-table', 101);
                // this.tableHeight = 300 + 46 + 61;
                // document.getElementsByClassName('dimension-table')[0].style.height = this.tableHeight + 101 + 'px';
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
                let a = this.getListDivHeight('dimension') - 101; // 外层的高度
                let tableHeadHeight = document.getElementsByTagName('thead')[0].clientHeight;
                let b = tempCount * 46 + 46 + tableHeadHeight; // 表头+表体+表尾的高度
                if (b > a) {
                    this.tableHeight = a;
                } else {
                    this.tableHeight = '';
                }
                if ((a - 153) / 46 < 4) {
                    // 小屏上至少展示3条数据，计算页面上展示的条数
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
        // 请求参数重置 && 筛选条件重置
        clearParams() {
            this.requestParams.start_date = this.baseRequestParams.start_date;
            this.requestParams.end_date = this.baseRequestParams.end_date;
            this.requestParams.project_id = this.baseRequestParams.project_id;
            this.requestParams.version_id = '';
            this.requestParams.version_state_code = '';
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
                this.queryDimensionTestDataList(this.formatParams()).then(res => {
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
                } else if (index === 1) {
                    sums[index] = '--';
                } else if (index === 2) {
                    sums[index] = '--';
                } else if (index === 4) {
                    sums[index] = '--';
                } else if (index === 6) {
                    sums[index] = '--';
                } else if (index === 8) {
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
            this.getScoreTd('lastLineScoreTest', 'tooltipBoxScoreTest', '各版本得分的平均分');
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
        ...mapActions(['queryDimensionTestDataList'])
    }
};
</script>
<style>
.test-table .el-table th > .cell {
    text-align: center;
}
.dimension-table .el-table tr {
    text-align: center;
}
</style>
