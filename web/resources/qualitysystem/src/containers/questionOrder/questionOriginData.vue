<!--
@name: 质量系统——问题工单——原始数据

@description:
@author: jjq
@date: 2018/7/30
-->
<template>
    <div class="container-main">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left">
                <span>问题工单 > 原始数据</span>
            </div>
            <div class="operate-platform">
                <direct-export-excel :url="exportUrl()"></direct-export-excel>
            </div>
        </div>
        <!-- <div
            class="main main-list cascade-style">
            <div class="main-wrap">
                <div class="main-list-row clearfix">
                    <div class="clearfix">
                        <div class="line-dashed">
                            <span class="title">月份：</span>
                            <el-date-picker
                                v-model="currentDate"
                                :clearable="false"
                                :editable="false"
                                :picker-options="pickerOptions"
                                popper-class="show-year"
                                type="month"
                                placeholder="选择月"
                                @change="changeDate">
                            </el-date-picker>
                        </div>
                        <div>
                            <span class="title">项目：</span>
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
                    </div>
                </div>
            </div>
        </div> -->

        <div
            id="mainScroll"
            class="main main-list">
            <div class="main-wrap">
                <div class="condition-part clearfix">
                    <div class="condition-part-content">
                        <div class="line-dashed">
                            <span class="title">月份：</span>
                            <el-date-picker
                                v-model="currentDate"
                                :clearable="false"
                                :editable="false"
                                :picker-options="pickerOptions"
                                popper-class="show-year"
                                type="month"
                                placeholder="选择月"
                                @change="changeDate">
                            </el-date-picker>
                        </div>
                        <div>
                            <span class="title">项目：</span>
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
                    </div>
                </div>

                <div class="main-list-row clearfix">
                    <div class="breadcrumbs left">
                        <span class="list-title">原始数据({{ pageData.counts }})</span>
                    </div>
                    <Pager
                        :request-list="requestList"
                        :page-data="pageData" />
                </div>
                <el-table
                    :data="tableList"
                    :row-class-name="setRowClassName"
                    style="width:100%"
                    empty-text="暂无数据"
                    @sort-change="sortChange">
                    <el-table-column
                        width="120"
                        prop="defect_num"
                        label="缺陷编号">
                        <template scope="scope">
                            <span>
                                {{ scope.row.defect_num||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="defect_title"
                        label="缺陷标题">
                        <template scope="scope">
                            <span>
                                {{ scope.row.defect_title||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="200"
                        prop="create_time"
                        label="创建时间">
                        <template scope="scope">
                            <span>
                                {{ scope.row.create_time||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="solve_time"
                        width="200"
                        sortable="custom"
                        label="遗留天数">
                        <template scope="scope">
                            <span v-if="scope.row.solve_time">
                                {{ scope.row.solve_time }}
                            </span>
                            <span v-else-if="scope.row.solve_time===0">
                                {{ 0 }}
                            </span>
                            <span v-else>
                                {{ '--' }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="defect_handler_name"
                        width="200"
                        label="处理人">
                        <template scope="scope">
                            <span>
                                {{ scope.row.defect_handler_name||'--' }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Pager from 'common/components/Pager'; // 分页
import DirectExportExcel from 'common/components/DirectExportExcel'; // 导出
import { PAGE_SIZE } from '@/constants/const';
import api from '@/utils/api';
import ListMixins from '@/mixins/list'; // 公共方法
import qualitySystemMixins from '@/mixins/qualitysystem';

import { EXPORT_QUESTION_SOURCE_DATA_URL } from '@/constants/api';

export default {
    name: 'QuestionOriginData',

    components: {
        Pager,
        DirectExportExcel
    },

    mixins: [ListMixins, qualitySystemMixins],

    data() {
        return {
            // 默认显示当前月份，当前以后不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            requestParams: {
                // 分页查询请求参数
                date: '', // 月份
                project_id: '',
                pageNo: 1, // 当前页面
                pageSize: PAGE_SIZE, // 每页记录数
                sortFields: '', // 排序字段,"solve_time"遗留天数
                sortFieldType: '' // 排序方式 ,"ASC"升序，"DESC"降序
            },
            filterItem: [], // 筛选条件数组
            questionSourceDataExportUrl: '', // 导出问题工单原始数据列表链接
            exportParams: {
                // 导出参数
                date: '',
                project_id: ''
            },
            projectList: [] // 项目列表
            // fn: () => {
            //     this.computeHeightByEmpty('questionOrigin', 'question-soure-table', 50);
            //     if (this.tableList.length) {
            //         this.computeHeigt(this.tableList.length);
            //     }
            // }
        };
    },
    computed: {
        ...mapState({
            tableList: ({ qualitySystem }) => qualitySystem.questionOriginDataList.result,
            pageData: ({ qualitySystem }) => qualitySystem.questionOriginDataList.basePage
        })
    },
    watch: {
        // tableList(val) {
        //     if (val.length !== 0) {
        //         let tempCount = val.length;
        //         this.computeHeigt(tempCount);
        //     }
        // }
    },
    beforeMount() {
        this.getProjectList();
        this.getCurrentDate();
    },
    mounted() {
        // window.addEventListener('resize', this.fn);
        // this.computeHeightByEmpty('questionOrigin', 'question-soure-table', 50);
    },
    destroyed() {
        // window.removeEventListener('resize', this.fn);
    },
    methods: {
        // computeHeigt(tempCount) {
        //     if (tempCount) {
        //         let a = this.getListDivHeight('questionOrigin');
        //         let b = tempCount * 55 + 46 + 50;
        //         if (b > a) {
        //             document.getElementsByClassName('question-soure-table')[0].style.height = b + 'px';
        //         } else {
        //             document.getElementsByClassName('question-soure-table')[0].style.height =
        //                 this.getListDivHeight('questionOrigin') + 'px';
        //         }
        //     }
        // },
        // 获取项目列表
        getProjectList() {
            let params = {
                type: 'all',
                project_name: ''
            };
            api.queryProjectsList(params).then(res => {
                this.projectList = res.result;
                if (this.$route.query.project_id) {
                    this.currentProjectId = Number(this.$route.query.project_id);
                } else {
                    this.currentProjectId = res.result[0].project_id; // 默认显示第一个项目
                }
            });
        },
        // 导出
        exportUrl() {
            this.exportParams.date = this.requestParams.date;
            this.exportParams.project_id = this.currentProjectId;
            this.questionSourceDataExportUrl = EXPORT_QUESTION_SOURCE_DATA_URL;
            let queryConditionTemp = JSON.parse(JSON.stringify(this.exportParams));

            let ip = window.config.context; // spms的前缀ip地址
            let questionSourceDataExportUrl = this.questionSourceDataExportUrl; // 原始数据导出的接口
            let queryCondition = `${encodeURIComponent(JSON.stringify(queryConditionTemp))}`; // 需要传入的参数
            let sessionId = `sessionId=${window.localStorage.sessionId}`; // 需要sessionId的验证
            return `${ip}${questionSourceDataExportUrl}/${queryCondition}?${sessionId}`;
        },
        // 获取当前时间
        getCurrentDate() {
            let that = this;
            api.queryCurrentDate().then(res => {
                if (this.$route.query.date) {
                    that.currentDate = String(this.$route.query.date);
                } else {
                    that.currentDate = res.result.date;
                }
                that.requestParams.date = that.currentDate;
            });
        },
        // 请求列表
        requestList(pageNo) {
            // this.pageSizeFit('requestParams', 'pageSize', 'questionOrigin');
            if (pageNo) {
                this.requestParams.pageNo = pageNo;
            }
            if (this.requestParams.date === '' || this.requestParams.project_id === '') {
                return false;
            } else {
                this.queryQuestionOriginDataList(this.formatParams());
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
        // 选择月份
        changeDate(val) {
            if (val === undefined) {
                this.requestParams.date = '';
            } else {
                this.requestParams.date = val;
                this.currentDate = val;
            }
            this.requestList();
        },
        // 选择项目
        selectProject(val) {
            this.requestParams.project_id = val;
            this.requestList();
        },
        ...mapActions(['queryQuestionOriginDataList'])
    }
};
</script>

<style lang="less" scoped>
</style>
