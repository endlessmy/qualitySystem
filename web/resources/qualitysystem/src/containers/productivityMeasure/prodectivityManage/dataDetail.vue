<!--生产率度量-生产率管理-单个项目的数据详情页
@description:
    1.点击生产率管理 - 数据页 - 项目名称，可跳转至该页面
    2.该页面展示单个项目在选择时间段内的指标和人力数据的详情
    3.超级管理员有编辑权限，可快速编辑指标列表的指标值和人力列表中的自有人员数和外协人员数量，人力合计根据编辑值由前端字段计算得到,均保留以为小数
    4.该页面可以导出详情数据（包括指标列表数据和人力列表数据）
    5.两个列表均不可分页
author：jjq
date:2018/9/14-->
<template>
    <div class="container-main">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left">
                <span>生产率度量 > 生产率管理 > </span>
                <router-link :to="{path: navInfo.path , query: {date: currentDate}}">{{ navInfo.name }}</router-link>
                <i>></i>
                <span class="inline-block">{{ $route.query.project_name }}</span>
            </div>
            <div class="operate-platform">
                <direct-export-excel :url="exportUrl()"></direct-export-excel>
            </div>
        </div>

        <div
            id="mainScroll"
            class="main main-list ">
            <div class="main-wrap">
                <div class="condition-part clearfix">
                    <div class="condition-part-content">
                        <div class="line-dashed">
                            <span class="title long-title">项目名称：</span>
                            <div class="project-select">
                                <el-select
                                    v-model="currentProductId"
                                    filterable
                                    placeholder="请输入选择"
                                    @change="selectProject">
                                    <el-option
                                        v-for="item in productProjectList"
                                        :key="item.project_id"
                                        :label="item.project_name"
                                        :value="item.project_id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div>
                            <span class="title long-title">月份：</span>
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
                    </div>
                </div>
                <div class="condition-part">
                    <quota-data
                        :base-request-params="requestParams">
                    </quota-data>
                </div>
                <human-data
                    :base-request-params="requestParams">
                </human-data>
            </div>
        </div>
    </div>
</template>
<script>
import api from '@/utils/api';
import { mapActions, mapState } from 'vuex';
import ListMixins from '@/mixins/list';
import HumanData from './humanData';
import QuotaData from './quotaData';
import DirectExportExcel from 'common/components/DirectExportExcel'; // 导出
import { EXPORT_PRODUCTIVITY_DATA } from '@/constants/api';

export default {
    name: 'DataPageDetail',
    components: { HumanData, QuotaData, DirectExportExcel },
    mixins: [ListMixins],
    data() {
        return {
            currentDate: '',
            requestParams: {
                statistic_month: '', // 统计月份
                project_id: ''
            },
            filterItem: [], // 筛选条件数组
            currentProductId: '', // 项目id
            productProjectList: [], // 项目列表
            exportParams: {
                // 导出参数
                statistic_month: '' // 统计年月
            },
            // 默认显示当前月份，当前以后不可选
            navInfo: {
                path: '/qualitySystem/productivityManage/data',
                name: '数据页'
            },
            // 默认显示当前月份，当前以后不可选,2019-07以前的月份不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now() || time.getTime() < new Date('2018-07');
                }
            }
        };
    },

    computed: {
        ...mapState({})
    },
    watch: {},
    beforeMount() {
        this.getProjectList();
        this.getCurrentDate();
    },
    methods: {
        // 获取项目列表
        getProjectList() {
            api.queryProductProjectList({}).then(res => {
                this.productProjectList = res.result;
                if (this.$route.query.project_id) {
                    this.currentProductId = Number(this.$route.query.project_id);
                } else {
                    this.currentProductId = res.result[0].project_id; // 默认显示第一个项目
                }
            });
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
                that.requestParams.statistic_month = that.currentDate;
            });
        },
        changeDate(val) {
            if (val === undefined) {
                this.requestParams.statistic_month = '';
            } else {
                this.requestParams.statistic_month = val;
                this.currentDate = val;
            }
        },
        // 选择项目
        selectProject(val) {
            this.requestParams.project_id = val;
        },
        exportUrl() {
            this.exportParams.statistic_month = this.requestParams.statistic_month;
            this.productivityDataExportUrl = EXPORT_PRODUCTIVITY_DATA;
            let queryConditionTemp = JSON.parse(JSON.stringify(this.exportParams));
            let ip = window.config.context; // spms的前缀ip地址
            let productivityDataExportUrl = this.productivityDataExportUrl; // 生产率数据的导出接口
            let queryCondition = `${encodeURIComponent(JSON.stringify(queryConditionTemp))}`; // 需要传入的参数
            let sessionId = `sessionId=${window.localStorage.sessionId}`; // 需要sessionId的验证
            return `${ip}${productivityDataExportUrl}/${queryCondition}?${sessionId}`;
        },
        ...mapActions([''])
    }
};
</script>
<style lang="less" scoped>
</style>
