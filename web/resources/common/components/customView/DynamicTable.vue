<!--
动态表格
@author shenah
@createTime 2018/4/10
 -->
<template>
    <div class="dynamic-table">
        <!-- :row-class-name="setRowClassName" -->
        <el-table
            ref="tableBorder"
            :data="tableLists"
            :row-key="setKey"
            border
            style="width: 100%"
            empty-text="暂无数据">
            <el-table-column
                label="字段">
                <template scope="scope">
                    <el-form
                        v-if="scope.row"
                        :ref="'fieldForm'+scope.$index"
                        :model="scope.row.fieldForm"
                        :rules="scope.row.fieldRules"
                        class="table-form mt14">
                        <el-form-item prop="field_id">
                            <el-select
                                :disabled="isDisabled"
                                v-model.number="scope.row.fieldForm.field_id"
                                placeholder="请选择字段"
                                class="table-form-select"
                                @change="fieldChage(...arguments,scope.row)">
                                <el-option
                                    v-for="item in scope.row.fieldList"
                                    :key="item.field_id"
                                    :label="item.field_remark"
                                    :value="item.field_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="条件动作">
                <template scope="scope">
                    <el-form
                        v-if="scope.row && scope.row.conditeList.length > 0"
                        :ref="'conditionTypecodeForm'+scope.$index"
                        :model="scope.row.conditionTypecodeForm"
                        :rules="scope.row.conditionTypecodeRules"
                        class="table-form mt14">
                        <el-form-item prop="action_code">
                            <el-select
                                :disabled="isDisabled"
                                v-model="scope.row.conditionTypecodeForm.action_code"
                                placeholder="请选择动作"
                                class="table-form-select"
                                @change="conditionChage(...arguments,scope.row)">
                                <el-option
                                    v-for="item in scope.row.conditeList"
                                    :key="item.action_code"
                                    :label="item.action_remark"
                                    :value="item.action_code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="值"
                width="220">
                <template scope="scope">
                    <div v-if="scope.row && scope.row.conditionTypecodeForm.action_code !=='' && scope.row.conditionTypecodeForm.action_code !=='03' && scope.row.conditionTypecodeForm.action_code !=='04' && scope.row.conditionTypecodeForm.action_code !=='09'">
                        <DynamicTableValue
                            v-if="scope.row.updateRender"
                            :table-lists="tableLists"
                            :delete-tables-lists="deleteTablesLists"
                            :ref="'dynamicTableValue'+scope.$index"
                            :type="type"
                            :manage-data="manageData"
                            :now-index="scope.$index"
                            :params-obj="paramsObj"
                            :row="scope.row">
                        </DynamicTableValue>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="80">
                <template scope="scope">
                    <div
                        v-if="tableLists.length > 1 && !isDisabled"
                        class="opertion-button"
                        @click="deleteOneData(scope.$index)">删除</div>
                </template>
            </el-table-column>
        </el-table>
        <div
            v-if="!isDisabled"
            class="add-view opertion-button"
            @click="addOneData()">
            <i
                style="margin-right:6px;"
                class="icon-add"></i>
            <span>添加视图条件</span>
        </div>
    </div>
</template>

<script>
import apiCommon from 'common/utils/api';
import CommonMixins from 'common/mixins/common';
import DynamicTableValue from 'common/components/customView/DynamicTableValue';
import { REQUIRE_STATE, REQUIRE_TYPE, TIME_DYNAMIC } from 'common/constants/const';
export default {
    name: 'DynamicTable',
    components: {
        DynamicTableValue
    },
    mixins: [CommonMixins],
    props: {
        type: String,
        paramsObj: Object,
        detailObj: Object,
        manageData: Object
    },
    data() {
        return {
            tableLists: [],
            fieldList: [], // 查询可配置的字段
            requireStateList: REQUIRE_STATE, // 业务需求状态
            requireTypeList: REQUIRE_TYPE, // 业务需求类型
            requireCompanyList: [], // 需求部门
            versionList: [], // 当前项目的所有版本
            funcRequireLevel: [], // 功能需求的优先级
            funcRequireStatus: [], // 功能需求的状态
            funcRequireModule: [], // 功能需求模块(也就是功能需求分类),
            timeDynamicList: TIME_DYNAMIC, // 时间动态取值的
            deleteTablesLists: [] // 当前删除的lists
        };
    },
    computed: {
        isDisabled() {
            // 根据权限是否禁用
            if (this.type === 'create') {
                return false;
            } else {
                return !(this.manageData.view_config && this.manageData.view_config.edit_permit);
            }
        }
    },
    watch: {
        detailObj(val) {
            if (val.view_id) {
                Promise.all([
                    this.queryfieldList(),
                    this.queryrequireCompany(),
                    this.queryVersion(),
                    this.queryServiceDictionary(),
                    this.queryFuncRequireModule()
                ]).then(() => {
                    this.tableLists = this.detailObj.view_condition_list.map(item => {
                        let obj = this.templateObj();
                        obj.fieldList = this.fieldList;
                        obj.nowSelectData = item;
                        obj.fieldForm.field_id = item.field_id;
                        obj.action_code = item.action_code;
                        obj.conditionTypecodeForm.action_code = item.action_code;
                        item.condition_value = eval('(' + item.condition_value + ')');
                        obj.condition_value = item.condition_value;
                        this.getConditionList(item, obj);
                        obj.conditeList = this.fieldList.filter(one => one.field_id === item.field_id)[0].condition_action_list;
                        if (item.action_code === '05' || item.action_code === '06') {
                            obj.multiple = true;
                        }
                        if (item.field_category === '02') {
                            obj.remote = true;
                            obj.valueList = item.condition_value.map(item => ({
                                label: item.value_name,
                                value: item.value_id,
                                userName: item.value_name
                            }));
                        }
                        if (item.field_category === '01') {
                            // 文本
                            obj.valueForm.selectValue = item.condition_value[0];
                        } else if (item.field_category === '04') {
                            if (item.action_code === '10') {
                                obj.valueForm.selectValue = item.condition_value[0];
                                obj.valueForm.selectValue2 = item.condition_value[1];
                            } else {
                                obj.valueForm.selectValue = item.condition_value[0];
                            }
                        } else if (item.field_category === '02' || item.field_category === '03') {
                            // 人员
                            if (item.action_code === '05' || item.action_code === '06') {
                                // 证明是多选
                                obj.valueForm.selectValue = item.condition_value.map(
                                    item => `${item.value_id},${item.value_name}`
                                );
                            } else if (item.action_code === '03' || item.action_code === '04') {
                                // 为空与不为空
                                obj.valueForm.selectValue = null;
                            } else if (item.action_code === '09') {
                                // 当前用户
                            } else {
                                obj.valueForm.selectValue = `${item.condition_value[0].value_id},${
                                    item.condition_value[0].value_name
                                }`;
                            }
                        } else if (item.field_category === '05') {
                            // 日期编码
                            if (item.action_code === '10') {
                                obj.dateType = 'daterange';
                                let timeFrame = [new Date(item.condition_value[0]), new Date(item.condition_value[1])];
                                obj.valueForm.selectValue = timeFrame;
                            } else if (item.action_code === '17' || item.action_code === '18') {
                                obj.valueForm.selectValue = item.condition_value[1];
                                let label = this.timeDynamicList.filter(one => one.value === item.condition_value[0])[0].label;
                                obj.valueForm.selectValue2 = `${item.condition_value[0]},${label}`;
                            } else {
                                obj.dateType = 'date';
                                obj.valueForm.selectValue = item.condition_value[0];
                            }
                        }
                        return obj;
                    });
                    this.deleteTablesLists = this.tableLists;
                });
            }
        }
    },
    mounted() {
        this.fixSafariTableLine();

        Promise.all([
            this.queryfieldList(),
            this.queryrequireCompany(),
            this.queryVersion(),
            this.queryServiceDictionary(),
            this.queryFuncRequireModule()
        ]).then(() => {
            if (this.type === 'create') {
                this.tableLists = [this.templateObj()];
                this.deleteTablesLists = this.tableLists;
            } else {
            }
        });
    },
    methods: {
        templateObj() {
            return {
                noChage: 'key',
                fieldList: this.fieldList, // 字段列表(最先有)
                conditeList: [], // 条件列表(当选择字段列表后才有)
                valueList: [], // 值的列表(当选择条件列表后才有)
                valueList2: [], // 值的列表
                nowSelectData: {}, // 当前选择的字段的数据
                action_code: null, // 条件编码
                condition_value: [], // 至少是json数组(用于传给后台的参数)
                multiple: false, // 用与判断是否单选还是多选默认单选
                multiple2: false,
                remote: false, // 用于判断是否调用远程搜索
                remote2: false,
                dateType: 'date', // 用于判断时间选择器用于哪种形式
                updateRender: true,
                fieldForm: {
                    field_id: null
                },
                fieldRules: {
                    field_id: [
                        {
                            required: true,
                            validator: function(rule, value, callback) {
                                if (value === null || (value && value.length === 0)) {
                                    return callback(new Error('请选择字段'));
                                } else {
                                    return callback();
                                }
                            },
                            trigger: 'change'
                        }
                    ]
                },
                conditionTypecodeForm: {
                    action_code: null
                },
                conditionTypecodeRules: {
                    action_code: [
                        {
                            required: true,
                            validator: function(rule, value, callback) {
                                if (value === null || value.length === 0) {
                                    return callback(new Error('请选择条件动作'));
                                } else {
                                    return callback();
                                }
                            },
                            trigger: 'change'
                        }
                    ]
                },
                valueForm: {
                    selectValue: null,
                    selectValue2: null
                },
                valueRules: {
                    selectValue: [{ required: true, validator: '', trigger: 'blur' }],
                    selectValue2: [{ required: true, validator: '', trigger: 'blur' }]
                }
            };
        },
        queryUsers(keyword, row) {
            // 查询人员
            if (row.field_remark === '开发人员') {
                // 查询的是项目内的成员
                let params = {
                    keyword,
                    project_id: this.paramsObj.project_id
                };
                apiCommon.queryProjectMemberOnline(params).then(res => {
                    row.valueList = res.result.map(item => {
                        item.value = item.userId;
                        item.label = item.userName;
                        return item;
                    });
                });
            } else {
                // 查询的是所有成员
                apiCommon.queryUserList({ keyword }).then(res => {
                    row.valueList = res.users.map(item => {
                        item.value = item.userId;
                        item.label = item.userName;
                        return item;
                    });
                });
            }
        },
        queryFuncRequireModule() {
            // 查询功能需求分类(模块)
            apiCommon
                .queryFuncRequireType({
                    project_id: this.paramsObj.project_id
                })
                .then(res => {
                    this.funcRequireModule = res.result.map(item => {
                        item.value = item.func_require_type_id;
                        item.label = item.func_require_type_name;
                        return item;
                    });
                });
        },
        queryrequireCompany() {
            // 查询需求部门
            apiCommon.queryCompany().then(res => {
                this.requireCompanyList = res.result.map(item => {
                    item.value = item.group_id;
                    item.label = item.group_name;
                    return item;
                });
            });
        },
        queryVersion() {
            // 查询项目版本
            apiCommon
                .queryVersionTree({
                    keyword: '',
                    project_id: this.paramsObj.project_id
                })
                .then(res => {
                    this.versionList = res.result.map(item => {
                        item.value = item.version_id;
                        item.label = item.version_num;
                        return item;
                    });
                });
        },
        queryServiceDictionary() {
            // 查询模块的字典
            apiCommon
                .queryDictionary({
                    service_id: this.paramsObj.service_id
                })
                .then(res => {
                    this.funcRequireLevel = res.result.require_level;
                    this.funcRequireStatus = res.result.status;
                });
        },
        queryfieldList() {
            // 查询可配的字段
            let serviceId = this.paramsObj.service_id;
            return apiCommon.queryViewConfigField({ service_id: serviceId }).then(res => {
                this.fieldList = res.result;
            });
        },
        fieldChage(val, row) {
            // 改变选择字段的时候
            if (!val || val.length === 0) return;
            if (this.tableLists.length !== this.deleteTablesLists.length) {
                return;
            }
            // 这里为了筛选出当前选择字段的条件动作的list
            let onedata = this.fieldList.filter(item => item.field_id === val)[0];
            row.nowSelectData = onedata;
            row.conditeList = onedata.condition_action_list;
            row.valueList = []; // 清空值的列表
            this.getConditionList(onedata, row);
            // 清空条件与值
            row.conditionTypecodeForm.action_code = '';
            row.condition_value = [];
            row.conditionTypecodeForm.selectValue = null;
        },
        getConditionList(onedata, row) {
            // 获取条件的值
            if (this.paramsObj.service_id === 30) {
                // 证明是功能需求
                if (onedata.field_remark === '状态') {
                    row.valueList = this.funcRequireStatus;
                } else if (onedata.field_remark === '需求分类') {
                    row.valueList = this.funcRequireModule;
                } else if (onedata.field_remark === '优先级') {
                    row.valueList = this.funcRequireLevel;
                } else if (onedata.field_remark === '迭代版本') {
                    row.valueList = this.versionList;
                } else if (onedata.field_remark.indexOf('时间') > -1) {
                    row.valueList2 = this.timeDynamicList;
                }
            } else if (this.paramsObj.service_id === 4) {
                // 证明是业务需求
                if (onedata.field_remark === '状态') {
                    row.valueList = this.requireStateList;
                } else if (onedata.field_remark === '需求类型') {
                    row.valueList = this.requireTypeList;
                } else if (onedata.field_remark === '需求部门') {
                    row.valueList = this.requireCompanyList;
                } else if (onedata.field_remark === '计划上线版本' || onedata.field_name === '期望解决版本') {
                    row.valueList = this.versionList;
                } else if (onedata.field_remark.indexOf('时间') > -1) {
                    row.valueList2 = this.timeDynamicList;
                }
            }
        },
        conditionChage(val, row) {
            // 条件动作的选择
            if (this.tableLists.length !== this.deleteTablesLists.length) {
                return;
            }
            row.condition_value = [];
            row.action_code = val;
            if (val === '05' || val === '06') {
                row.valueForm.selectValue = [];
                row.valueForm.selectValue2 = [];
            } else {
                row.valueForm.selectValue = null;
                row.valueForm.selectValue2 = null;
            }
            // 为了让组件重新渲染start
            row.updateRender = false;
            setTimeout(() => {
                row.updateRender = true;
            }, 10);
            // 为了让组件重新渲染end
        },
        // // 设置每一个tr的class name
        // setRowClassName(row, index) {
        //     row.index = index;
        //     return `tr-row-${index}`;
        // },
        deleteOneData(index) {
            // 删除一条数据
            this.deleteTablesLists = this.tableLists.map(item => item);
            this.tableLists.forEach(row => {
                row.updateRender = false;
                setTimeout(() => {
                    row.updateRender = true;
                }, 0);
            });
            this.tableLists.splice(index, 1);
            this.$nextTick(() => {
                this.deleteTablesLists = this.tableLists;
            });
        },
        addOneData() {
            // 添加一条数据
            this.tableLists.push(this.templateObj());
            this.deleteTablesLists = this.tableLists;
        },
        setKey(row) {
            return row.noChage;
        }
    }
};
</script>
<style lang='less'>
.dynamic-table .el-table__header-wrapper tr div {
    color: #333 !important;
}
.dynamic-table .el-table_1_column_1 {
    border-left: 1px solid #dfe6ec !important;
}
.dynamic-table .el-table__body-wrapper tr > td:first-child {
    // border-left: 1px solid #dfe6ec !important;
}
.dynamic-table {
    .table-form {
        min-height: 50px;
        .el-form-item {
            margin-bottom: 0px !important;
            .el-form-item__error {
                padding-top: 2px !important;
            }
        }
        .table-form-select .el-input__inner {
            min-height: 26px !important;
        }
    }
}
</style>
<style lang='less' scoped>
.dynamic-table {
    .opertion-button {
        line-height: 30px;
        font-size: 12px;
        color: #539eff;
        cursor: pointer;
    }
    .add-view {
        width: 100px;
    }
}
.mt14 {
    margin-top: 14px;
}
</style>
