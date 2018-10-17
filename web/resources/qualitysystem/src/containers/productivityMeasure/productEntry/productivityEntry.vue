<!--
@name: 质量系统——生产率度量——生产率录入页

@description:
1.只有超管、项目经理、QA可进入生产率录入页面
@author: 孙燕
@date: 2018/9/12
-->
<template>
    <div class="container-main">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left">
                <span>生产率度量 > 生产率录入</span>
            </div>
        </div>
        <div
            id="mainScroll"
            class="main main-list">
            <div class="main-wrap">
                <div class="condition-part clearfix">
                    <div class="condition-part-content">
                        <div class="line-dashed">
                            <span class="title long-title">月份：</span>
                            <el-date-picker
                                ref="datePicker"
                                v-model="currentDate"
                                :clearable="false"
                                :editable="false"
                                :picker-options="pickerOptions"
                                popper-class="show-year"
                                placeholder="选择月"
                                type="month"
                                @change="changeDate"></el-date-picker>
                        </div>
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
                                        :value="item.project_id+','+item.quality_role_type">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div>
                            <span class="title long-title">类别：</span>
                            <span
                                :class="{'selected-quarter':currentCategory==='category'}"
                                class="quarter"
                                @click="selectCategory('category')">
                                指标
                            </span>
                            <span
                                :class="{'selected-quarter':currentCategory==='human'}"
                                class="quarter"
                                @click="selectCategory('human')">
                                人力
                            </span>
                        </div>
                    </div>
                </div>
                <productivity-entry-category
                    v-if="currentCategory==='category'"
                    :no-input = "noDataInput"
                    :base-request-params="baseRequestParams"
                    :is-manager-role="isManagerRole">
                </productivity-entry-category>
                <productivity-entry-human
                    v-else
                    :no-input = "noDataInput"
                    :base-request-params="baseRequestParams"
                    :is-manager-role="isManagerRole">
                </productivity-entry-human>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import api from '@/utils/api';
import ListMixins from '@/mixins/list';
import ProductivityEntryCategory from './productivityEntryCategory';
import ProductivityEntryHuman from './productivityEntryHuman';
export default {
    name: 'ProductivityEntry',
    components: {
        ProductivityEntryCategory,
        ProductivityEntryHuman
    },
    mixins: [ListMixins],
    data() {
        return {
            baseRequestParams: {
                statistic_month: '', // 统计月份
                project_id: ''
            },
            currentProductId: '', // 项目id
            productProjectList: [], // 项目列表
            currentCategory: 'category', // 当前类别
            selectDateAbled: [], // 可选择的日期
            currentRole: '', // 当前项目角色
            isManagerRole: false, // 判断项目角色（超管和项目经理）
            noDataInput: false // 是否可录入数据的标识
        };
    },
    computed: {
        ...mapState({}),
        // 只可选择后台返回的月份，默认显示后台返回的第一个月份
        pickerOptions() {
            return {
                disabledDate: time => {
                    let selectFlag = true;
                    for (let i = 0; i < this.selectDateAbled.length; i++) {
                        let temp = true;
                        if (
                            time.getFullYear() !== new Date(this.selectDateAbled[i]).getFullYear() ||
                            time.getMonth() !== new Date(this.selectDateAbled[i]).getMonth()
                        ) {
                            temp = true;
                        } else {
                            temp = false;
                        }
                        selectFlag = selectFlag && temp;
                    }
                    return selectFlag;
                }
            };
        }
    },
    watch: {
        // 监听月份和项目名称列表长度，传给子组件，用来判断调不同的接口
        selectDateAbled(val) {
            if (val && val.length === 0 && this.productProjectList.length === 0) {
                this.noDataInput = true;
            } else {
                this.noDataInput = false;
            }
        }
    },
    beforeMount() {
        this.getProductProjectList();
        this.getInputAbledDate();
    },
    methods: {
        // 获取可以选择的录入时间数组
        getInputAbledDate() {
            api.queryStatisticsDate({}).then(res => {
                this.selectDateAbled = res.result;
                if (this.$route.query.date) {
                    this.currentDate = String(this.$route.query.date);
                    this.baseRequestParams.statistic_month = String(this.$route.query.date);
                } else {
                    if (res.result && res.result.length !== 0) {
                        this.currentDate = res.result[0];
                        this.baseRequestParams.statistic_month = res.result[0];
                    } else if (res.result && res.result.length === 0) {
                        this.currentDate = '';
                        this.baseRequestParams.statistic_month = undefined;
                    }
                }
            });
        },
        // 获取项目列表
        getProductProjectList() {
            api.queryProductInputProjects().then(res => {
                this.productProjectList = res.result;
                if (this.$route.query.project_id) {
                    this.baseRequestParams.project_id = Number(this.$route.query.project_id);
                    this.currentProductId = Number(this.$route.query.project_id) + ',' + '2';
                } else {
                    if (res.result && res.result.length !== 0) {
                        this.currentProductId = res.result[0].project_id + ',' + res.result[0].quality_role_type; // 默认显示第一个项目
                        this.baseRequestParams.project_id = res.result[0].project_id;
                    } else if (res.result && res.result.length === 0) {
                        this.currentProductId = '';
                        this.baseRequestParams.project_id = undefined;
                    }
                }
            });
        },
        // 选择月份
        changeDate(val) {
            this.baseRequestParams.statistic_month = val;
            this.currentDate = val;
        },
        // 选择项目，只有项目经理和超管可编辑
        selectProject(val) {
            this.baseRequestParams.project_id = Number(val.split(',')[0]);
            this.currentRole = val.split(',')[1];
            if (this.currentRole === '2' || this.currentRole === '4') {
                this.isManagerRole = true;
            } else {
                this.isManagerRole = false;
            }
        },
        // 选择类别
        selectCategory(val) {
            this.currentCategory = val;
        },
        ...mapActions([])
    }
};
</script>
<style lang="less"></style>
