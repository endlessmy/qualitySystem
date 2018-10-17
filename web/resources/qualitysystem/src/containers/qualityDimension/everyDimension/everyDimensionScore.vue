<!--
@name: 质量系统——质量度量——各维度得分页面

@description:质量度量
@author:孙燕
@date: 2018/7/30
-->
<template>
    <div class="container-main">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left">
                <span>质量度量 > 各维度得分</span>
            </div>
            <div class="operate-platform">
                <direct-export-excel :url="exportUrl()"></direct-export-excel>
            </div>
        </div>
        <div class="main main-list cascade-style">
            <div class="main-wrap">
                <div class="main-list-row clearfix">
                    <div class="clearfix">
                        <div class="line-dashed">
                            <span class="title long-title">查询时间：</span>
                            <el-date-picker
                                v-model="currentDateBegin"
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
                                :clearable="false"
                                :editable="false"
                                :picker-options="pickerOptions"
                                popper-class="show-year"
                                type="month"
                                placeholder="结束时间"
                                @change="selectDateEnd">
                            </el-date-picker>
                            <el-tooltip
                                popper-class="home-kpi-tip-popper"
                                class="item"
                                effect="light"
                                content="目前只能查询2018年7月之后的数据"
                                placement="top">
                                <i class="icon-wenhao"></i>
                            </el-tooltip>
                        </div>
                        <div class="line-dashed">
                            <span class="title long-title">项目名称：</span>
                            <div class="project-select">
                                <el-select
                                    v-model="currentProjectId"
                                    filterable
                                    placeholder="请输入选择"
                                    @change="selectProject">
                                    <el-option
                                        v-for="item in projectList"
                                        :key="item.project_id"
                                        :label="item.project_name"
                                        :value="item.project_id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div>
                            <span class="title long-title">查询维度：</span>
                            <span
                                :class="{'selected-quarter':currentDimension==='develop'}"
                                class="quarter"
                                @click="selectDimension('develop')">开发</span>
                            <span
                                :class="{'selected-quarter':currentDimension==='test'}"
                                class="quarter"
                                @click="selectDimension('test')">测试</span>
                            <span
                                :class="{'selected-quarter':currentDimension==='operation'}"
                                class="quarter"
                                @click="selectDimension('operation')">运维</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <develop-list
            v-if="currentDimension==='develop'"
            :base-request-params="baseRequestParams"
            :project-name="currentProjectName"
            :current-dimension="currentDimension"></develop-list>
        <test-list
            v-else-if="currentDimension==='test'"
            :base-request-params="baseRequestParams"
            :project-name="currentProjectName"
            :current-dimension="currentDimension"></test-list>
        <operation-list
            v-else
            :base-request-params="baseRequestParams"
            :project-name="currentProjectName"
            :current-dimension="currentDimension">
        </operation-list>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import api from '@/utils/api';
import ListMixins from '@/mixins/list'; // 公共方法
import DirectExportExcel from 'common/components/DirectExportExcel'; // 导出
import DevelopList from './developList';
import TestList from './testList';
import OperationList from './operationList';
import MessageMixins from 'common/mixins/message'; // 查询时间提示信息
import { EXPORT_OPERATION_SCORE, EXPORT_DEVELOP_SCORE, EXPORT_TEST_SCORE } from '@/constants/api';
export default {
    name: 'EveryDimensionScore',
    components: {
        DevelopList,
        TestList,
        OperationList,
        DirectExportExcel
    },
    mixins: [ListMixins, MessageMixins],
    data() {
        let that = this;
        return {
            baseRequestParams: {
                start_date: '', // 开始时间
                end_date: '', // 结束时间
                project_id: '' // 项目id
            },
            projectList: [], // 项目列表
            currentDimension: 'develop', // 默认维度
            currentProjectName: '', // 当前项目名称
            currentProjectId: '',
            saveBeginDate: '', // 输入框中保存的时间
            saveEndDate: '', // 输入框中保存的时间
            currentDateBegin: '', // 开始时间
            currentDateEnd: '', // 结束时间
            dimensionDataExportUrl: '', // 导出维度运维数据链接
            exportParams: {
                start_date: '', // 导出参数
                end_date: ''
            },
            sevenMonth: '2018-07',
            // 默认显示当前年份，当前以后不可选，且2018年7月之前不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < new Date(that.sevenMonth);
                }
            }
        };
    },
    computed: {
        ...mapState({})
    },
    beforeMount() {
        if (this.$route.query.currentDimension) {
            this.currentDimension = this.$route.query.currentDimension;
        }
        this.getProjectList();
        this.getCurrentDate();
    },
    methods: {
        // 获取项目列表
        getProjectList() {
            let params = {
                type: 'all',
                project_name: ''
            };
            api.queryProjectsList(params).then(res => {
                this.projectList = res.result;
                if (this.$route.query.projectId) {
                    this.currentProjectId = Number(this.$route.query.projectId);
                    this.baseRequestParams.project_id = Number(this.$route.query.projectId);
                } else {
                    this.currentProjectId = res.result[0].project_id; // 默认显示第一个项目
                    this.baseRequestParams.project_id = res.result[0].project_id;
                    this.currentProjectName = res.result[0].project_name;
                }
            });
        },
        // 选择项目
        selectProject(val) {
            this.baseRequestParams.project_id = Number(val);
            for (let i = 0; i < this.projectList.length; i++) {
                if (val === this.projectList[i].project_id) {
                    this.currentProjectName = this.projectList[i].project_name;
                    break;
                } else {
                    continue;
                }
            }
        },
        // 获取当前时间
        getCurrentDate() {
            api.queryCurrentDate().then(res => {
                if (this.$route.query.startDate || this.$route.query.endDate) {
                    this.currentDateBegin = String(this.$route.query.startDate);
                    this.currentDateEnd = String(this.$route.query.endDate);
                } else {
                    this.currentDateBegin = res.result.date;
                    this.currentDateEnd = res.result.date;
                }
                this.baseRequestParams.start_date = this.currentDateBegin;
                this.baseRequestParams.end_date = this.currentDateEnd;
            });
        },
        // 查询开始时间
        selectDateBegin(val) {
            if (new Date(val).getTime() > new Date(this.currentDateEnd).getTime()) {
                this.showWarningMsg('开始时间不能大于结束时间');
                this.currentDateBegin = this.saveBeginDate;
                return false;
            } else {
                this.currentDateBegin = val;
                this.saveBeginDate = val;
                this.baseRequestParams.start_date = val;
            }
        },
        // 查询结束时间
        selectDateEnd(val) {
            if (new Date(this.currentDateBegin).getTime() > new Date(val).getTime()) {
                this.showWarningMsg('开始时间不能大于结束时间');
                this.currentDateEnd = this.saveEndDate;
                return false;
            } else {
                this.currentDateEnd = val;
                this.saveEndDate = val;
                this.baseRequestParams.end_date = val;
            }
        },
        // 查询维度
        selectDimension(val) {
            this.currentDimension = val;
        },
        // 导出
        exportUrl() {
            this.exportParams.start_date = this.baseRequestParams.start_date;
            this.exportParams.end_date = this.baseRequestParams.end_date;
            let queryConditionTemp = JSON.parse(JSON.stringify(this.exportParams));
            let ip = window.config.context; // spms的前缀ip地址
            if (this.currentDimension === 'develop') {
                this.dimensionDataExportUrl = EXPORT_DEVELOP_SCORE;
            } else if (this.currentDimension === 'test') {
                this.dimensionDataExportUrl = EXPORT_TEST_SCORE;
            } else {
                this.dimensionDataExportUrl = EXPORT_OPERATION_SCORE;
            }
            let dimensionDataExportUrl = this.dimensionDataExportUrl;
            let queryCondition = `${encodeURIComponent(JSON.stringify(queryConditionTemp))}`; // 需要传入的参数
            let sessionId = `sessionId=${window.localStorage.sessionId}`; // 需要sessionId的验证
            return `${ip}${dimensionDataExportUrl}/${queryCondition}?${sessionId}`;
        },
        ...mapActions([])
    }
};
</script>
<style lang="less">
</style>
