<!--
    产品经理：张宿东
    用途：避免直接操作数据库，避免新增应用service冲突等
    描述：暂时没有使用，做了前端代码优化，但后端接口有些问题，有需求再对应修改
    创建/编辑应用
-->
<template>
    <div class="home-wrap home-wrap-auto app-manage-warp">
        <div
            id="mainHeader"
            class="main-header clearfix ">
            <div class="breadcrumbs left">
                <span>{{ isCreate ? "新建" : "编辑" }}应用</span>
            </div>
            <i
                class="close icon-add right"
                @click="exitEditForm()">
            </i>
        </div>
        <div
            id="mainScroll"
            class="main">
            <div class="main-wrap no-padding">
                <div class="content-header-title">
                    <i class="line"></i>{{ isCreate ? "新建" : "编辑" }}应用
                </div>

                <el-form
                    ref="createForm"
                    :model="requestParams"
                    :rules="rules"
                    label-width="130px"
                    class="create-form">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="应用名称："
                                prop="remark"
                                autofocus="true">
                                <el-input
                                    v-model.trim="requestParams.remark"
                                    placeholder="应用名称须8个字符以内">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="应用URL："
                                prop="url"
                                autofocus="true">
                                <el-input
                                    v-model.trim="requestParams.url"
                                    placeholder="请输入应用URL">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="应用图标："
                                prop="icon"
                                autofocus="true">
                                <el-input
                                    v-model.trim="requestParams.icon"
                                    placeholder="请输入应用的icon">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="应用背景色："
                                prop="background">
                                <el-select
                                    v-model="requestParams.background"
                                    poper-class="dropdown-wrapper"
                                    filterable
                                    placeholder="请选择应用的背景色">
                                    <el-option
                                        v-for="item in backgroundColor"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                        <span
                                            :class="item.value"
                                            class="bd-color">
                                        </span>
                                        <span>{{ item.label }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="可见范围："
                                prop="authority_type">
                                <el-select
                                    v-model="requestParams.authority_type"
                                    poper-class="dropdown-wrapper"
                                    filterable
                                    placeholder="请选择可见范围">
                                    <el-option
                                        v-for="item in authorityTypes"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item
                                label="应用类型："
                                prop="group_id">
                                <el-select
                                    v-model="requestParams.group_id"
                                    poper-class="dropdown-wrapper"
                                    filterable
                                    placeholder="请选择应用类型">
                                    <el-option
                                        v-for="item in groupTypes"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item
                        class="submit-btn">
                        <el-button
                            :disabled="disabledSubmit"
                            type="primary"
                            @click="submitForm('createForm')">
                            提交
                        </el-button>
                        <el-button @click="exitEditForm">
                            取消
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import MessageMixins from 'common/mixins/message';
import { APP_TYPE_LIST, VISIBLE_RANGE_LIST, BACKGROUND_COLOR_LIST } from '@/constants/const';
import api from '@/utils/api';

export default {
    name: 'AppCreateOrEdit',

    mixins: [MessageMixins],

    data() {
        var validatorFn = (rule, value, callback) => {
            if (typeof value === 'string' && value === '') {
                callback(new Error(rule.message));
            } else if (typeof value === 'number' && value === -1) {
                callback(new Error(rule.message));
            } else if (value == null) {
                callback(new Error(rule.message));
            } else {
                callback();
            }
        };

        return {
            isCreate: this.$route.name === 'AppCreate',
            disabledSubmit: false,

            requestParams: {
                remark: '', // 应用名称
                url: '', // 应用url
                icon: '', // 图标
                authority_type: '', // 可见范围
                group_id: '', // 应用类型
                background: '', // 背景色
                app_flag: '1', // 是否是应用服务1(是),0(否)
                enabled: '1' // 是否激活,1激活(可用),0未激活(禁用)
            },

            stashAppForReset: {}, // 用于重置表单的数据结构，结构和requestParams相同

            groupTypes: APP_TYPE_LIST,
            authorityTypes: VISIBLE_RANGE_LIST,
            backgroundColor: BACKGROUND_COLOR_LIST,

            rules: {
                remark: [
                    {
                        required: true,
                        message: '请输入应用名称',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 8,
                        message: '不超过8个字符',
                        trigger: 'blur'
                    }
                ],
                url: [
                    {
                        required: true,
                        message: '请输入应用URL',
                        trigger: 'blur'
                    }
                ],
                icon: [
                    {
                        required: true,
                        message: '请输入应用icon',
                        trigger: 'blur'
                    }
                ],
                background: [
                    {
                        validator: validatorFn,
                        required: true,
                        message: '请选择图标背景色',
                        trigger: 'change'
                    }
                ],
                authority_type: [
                    {
                        validator: validatorFn,
                        required: true,
                        message: '请选择可见范围',
                        trigger: 'change'
                    }
                ],
                group_id: [
                    {
                        validator: validatorFn,
                        required: true,
                        message: '请选择应用类型',
                        trigger: 'change'
                    }
                ]
            }
        };
    },

    watch: {
        $route(newVal, oldVal) {
            // 从编辑页回到新建
            if (newVal.name !== 'AppEdit' && oldVal.name === 'AppEdit') {
                this.requestParams = {...this.stashAppForReset};
                this.isCreate = true;
            }
        }
    },

    beforeMount() {
        // 保存this.requestParams,方便重置回初始值
        this.stashAppForReset = { ...this.requestParams };
    },

    mounted() {
        // 编辑的情况加载已有字段
        if (!this.isCreate) {
            let serviceId = this.$route.params.serviceId;
            this.requestParams.service_id = parseInt(serviceId);

            api.queryAppList({
                service_id: parseInt(serviceId)
            }).then(res => {
                this.requestParams = res.result[0];
            });
        }
    },

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.disabledSubmit = true;
                    let params = this.requestParams;

                    if (this.isCreate) {
                        api.createApp(params).then(
                            res => {
                                this.disabledSubmit = false;
                                this.showSuccessMsg('新建应用成功！');
                                this.requestParams = {...this.stashAppForReset};
                                this.$router.push({name: 'AppList'});
                            },
                            () => {
                                this.disabledSubmit = false;
                            }
                        );
                    } else {
                        api.editApp(params).then(
                            res => {
                                this.disabledSubmit = false;
                                this.showSuccessMsg('更新应用成功！');
                                this.requestParams = {...this.stashAppForReset};
                                this.$router.push({name: 'AppList'});
                            },
                            () => {
                                this.disabledSubmit = false;
                            }
                        );
                    }
                }
            });
        },

        // 退出表单编辑
        exitEditForm() {
            const operation = this.isCreate ? '新建' : '编辑';
            this.$confirm(`您确实要放弃${operation}应用吗？`, '提示', {
                confirmButtonText: '放弃',
                confirmButtonClass: 'confirm',
                cancelButtonText: '不放弃',
                type: 'warning'
            })
                .then(() => {
                    this.$router.push({name: 'AppList'});
                })
                .catch(e => {
                    console.log('e', e);
                });
        }
    }
};
</script>
