<!--
新建编辑自定义视图
只能编辑自己创建的视图，经理也不能编辑其他经理创建的项目视图，不会显示编辑按钮
系统默认的视图不可编辑，不会显示编辑按钮
点击视图的标题可查看信息，系统默认视图不展示视图条件，其他经理创建的项目视图禁用视图条件
v2.2.1 修改接口 @qqli
@author shenah
@createTime 2018/4/9
 -->
<template>
    <modal
        :visible="isShown"
        :size="'xlarge'"
        @onClosed="doClose"
        @onOpen="onOpen">
        <span slot="head">{{ title }}</span>
        <div slot="body">
            <div class="view-dialog">
                <el-form
                    ref="ruleForm"
                    :model="ruleForm"
                    :rules="rules"
                    label-width="110px">

                    <el-form-item
                        label="标题: "
                        prop="view_title">
                        <el-input
                            :disabled="isDisabled"
                            v-model.trim="ruleForm.view_title"
                            placeholder="标题不超过50个字符">
                        </el-input>
                    </el-form-item>

                    <el-form-item
                        v-if="!isSystemView"
                        label="视图条件: "
                        prop="view_condition_relation"
                        class="view-condition">
                        <div class="condition-wrap-radion">
                            <span class="mr20">条件间关系: </span>
                            <el-radio-group
                                :disabled="isDisabled"
                                v-model="ruleForm.view_condition_relation"
                                class="view-condition-radio">
                                <el-radio label="01">与</el-radio>
                                <el-radio label="02">或</el-radio>
                            </el-radio-group>
                        </div>
                        <dynamic-table
                            ref="dynamicTable"
                            :type="type"
                            :params-obj="paramsObj"
                            :detail-obj="detailObj"
                            :manage-data="data">
                        </dynamic-table>
                    </el-form-item>

                    <el-form-item
                        label="设置显示字段: "
                        style="margin-top:-12px;">
                        <custom-header
                            ref="customHeader"
                            :data="data"
                            :params-obj="paramsObj">
                        </custom-header>
                        <div
                            v-if="isShowProjectView"
                            class="mt10">
                            <el-checkbox v-model="ruleForm.view_type"></el-checkbox>
                            <span class="ml10 fs12">配置为项目视图,项目所有成员可见(视图保存后,可在功能需求列表页当前视图中查看)</span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <span slot="foot">
            <el-button
                :disabled="disabledSubmit"
                type="primary"
                @click="doSave">
                提交
            </el-button>
        </span>
    </modal>
</template>

<script>
import utils from 'common/utils/misc';
import apiCommon from 'common/utils/api';
import Modal from 'common/components/Modal';
import MessageMixins from 'common/mixins/message';
import DynamicTable from 'common/components/customView/DynamicTable';
import CustomHeader from 'common/components/customView/CustomHeader';
export default {
    name: 'CreateOrEditView',
    components: { Modal, DynamicTable, CustomHeader },

    mixins: [MessageMixins],
    props: {
        value: Boolean,
        data: {
            type: Object
        },
        paramsObj: {
            type: Object
        }
    },
    data() {
        return {
            disabledSubmit: false,
            isShowProjectView: false,
            type: 'create', // 判断是新建还是编辑
            title: '新建视图',
            ruleForm: {
                view_title: '',
                view_condition_relation: '01',
                view_type: false,
                errorArray: []
            },
            rules: {
                view_title: [
                    { required: true, message: '请输入标题', trigger: 'blur' },
                    { min: 1, max: 50, message: '标题不超过50个字符', trigger: 'blur' }
                ],
                view_condition_relation: [{ required: true, trigger: 'blur' }]
            },
            detailObj: {} // 详情对象
        };
    },
    computed: {
        isShown() {
            return this.value;
        },
        isDisabled() {
            // 根据权限是否禁用
            return this.data.view_config && !this.data.view_config.edit_permit;
        },
        isSystemView() {
            if (
                this.data.view_type === '03' ||
                this.data.view_type === '04' ||
                this.data.view_type === '05' ||
                this.data.view_type === '06' ||
                this.data.view_type === '07'
            ) {
                return true;
            } else {
                return false;
            }
        }
    },
    mounted() {
        this.judgeCreateOrEdit();
        this.queryProjectRoles();
    },
    methods: {
        onOpen() {},
        queryProjectRoles() {
            let params = {
                pid: this.paramsObj.project_id
            };
            apiCommon.queryUserIsDefaultManager(params).then(res => {
                let c1 = this.type === 'edit' && this.data.create_user_id === parseInt(utils.getLoginUserInfo('userId'));
                let c2 = this.type === 'create';
                if (res.result && (c1 || c2)) {
                    this.isShowProjectView = true;
                } else {
                    this.isShowProjectView = false;
                }
            });
        },
        judgeCreateOrEdit() {
            // 判断是新建还是编辑
            if (JSON.stringify(this.data) === '{}') {
                // 证明是新建
                this.type = 'create';
                this.title = '新建视图';
            } else {
                // 编辑
                this.type = 'edit';
                this.title = '编辑视图';
                this.queryDetail();
            }
        },
        queryDetail() {
            // 查询详情
            apiCommon.queryViewDetail({ view_id: this.data.view_id }).then(res => {
                this.detailObj = res.result;
                this.ruleForm.view_title = this.detailObj.view_title;
                this.ruleForm.view_condition_relation = this.detailObj.view_condition_relation;
                this.ruleForm.view_type = this.detailObj.view_type === '01';
            });
        },
        createOrEditView() {
            // 新建视图
            let viewConditionList = this.$refs.dynamicTable.tableLists.map((item, index) => ({
                field_id: item.fieldForm.field_id,
                action_code: item.action_code,
                condition_value: JSON.stringify(item.condition_value)
            }));
            let viewFieldList = this.$refs.customHeader.selectedFieldsLists.map(item => ({
                field_id: item.field_id
            }));
            let param = {
                service_id: this.type === 'create' ? this.paramsObj.service_id : undefined,
                project_id: this.type === 'create' ? this.paramsObj.project_id : undefined,
                view_id: this.type === 'create' ? undefined : this.data.view_id,
                view_title: this.ruleForm.view_title,
                view_type: this.ruleForm.view_type ? '01' : '02',
                view_condition_relation: this.ruleForm.view_condition_relation,
                view_condition_list: viewConditionList,
                view_field_list: viewFieldList
            };
            this.disabledSubmit = true;
            if (this.type === 'create') {
                return apiCommon.createView(param).then(
                    res => {
                        this.showSuccessMsg('新建视图成功');
                        this.disabledSubmit = false;
                    },
                    res => {
                        this.disabledSubmit = false;
                    }
                );
            } else {
                return apiCommon.updateUserView(param).then(
                    res => {
                        this.showSuccessMsg('更新视图成功');
                        this.disabledSubmit = false;
                    },
                    res => {
                        this.disabledSubmit = false;
                    }
                );
            }
        },
        doSave() {
            if (this.type === 'edit') {
                if (this.isSystemView || !this.data.view_config.edit_permit) {
                    let viewFieldList = this.$refs.customHeader.selectedFieldsLists.map(item => item.field_id);
                    let param = {
                        service_id: this.paramsObj.service_id,
                        header_type: '07',
                        view_id: this.data.view_id,
                        field_id_list: viewFieldList
                    };
                    this.disabledSubmit = true;
                    return apiCommon.configUserTableField(param).then(
                        res => {
                            this.showSuccessMsg('更新视图成功');
                            this.$emit('input', false);
                            this.$emit('onSave', this.type);
                            this.disabledSubmit = false;
                        },
                        res => {
                            this.disabledSubmit = false;
                        }
                    );
                }
            }
            this.errorArray = [];
            this.judgeFrom(this.$refs['ruleForm']);
            this.$refs.dynamicTable.tableLists.forEach((element, index) => {
                let fieldForm = this.$refs.dynamicTable.$refs[`fieldForm${index}`];
                let conditionTypecodeForm = this.$refs.dynamicTable.$refs[`conditionTypecodeForm${index}`];
                let valueForm = null;
                if (this.$refs.dynamicTable.$refs[`dynamicTableValue${index}`]) {
                    valueForm = this.$refs.dynamicTable.$refs[`dynamicTableValue${index}`].$refs[`valueForm${index}`];
                }
                if (fieldForm) {
                    this.judgeFrom(fieldForm);
                }
                if (conditionTypecodeForm) {
                    this.judgeFrom(conditionTypecodeForm);
                }
                if (valueForm) {
                    this.judgeFrom(valueForm);
                }
            });
            let flag = this.errorArray.every(item => item === true);
            if (flag) {
                this.createOrEditView().then(res => {
                    this.$emit('input', false);
                    this.$emit('onSave', this.type);
                });
            }
        },
        judgeFrom(form) {
            // 判断所有的表格
            form.validate(valid => {
                if (valid) {
                    return this.errorArray.push(true);
                } else {
                    return this.errorArray.push(false);
                }
            });
        },
        doClose() {
            this.$emit('input', false);
            this.$emit('onClose');
        }
    }
};
</script>

<style lang="less">
.view-dialog {
    max-height: 750px;
    overflow-y: auto;
    overflow-x: hidden;
    color: #333;
    .view-condition {
        color: #333;
        .condition-wrap-radion {
            height: 36px;
            line-height: 36px;
            .view-condition-radio {
                .el-radio__label {
                    color: #333;
                }
            }
        }
    }
}
</style>
