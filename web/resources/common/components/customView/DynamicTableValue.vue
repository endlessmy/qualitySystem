<!--
动态表格里面的动态值
@author shenah
@createTime 2018/4/10
 -->
<template>
    <div class="dynamic-table-value">
        <el-form
            v-if="showInputText"
            :ref="'valueForm' + nowIndex"
            :model="row.valueForm"
            :rules="row.valueRules"
            class="table-vue-form mt14">
            <el-form-item prop="selectValue">
                <el-input
                    v-if="showInputText"
                    :disabled="isDisabled"
                    :maxlength="parseInt(row.nowSelectData.field_limit)"
                    v-model.trim="row.valueForm.selectValue"
                    class="table-vue-form-input"
                    placeholder="请输入"
                    @change="changeValue(...arguments, row)"></el-input>
            </el-form-item>
        </el-form>
        <el-form
            v-else-if="showInputNum"
            :ref="'valueForm' + nowIndex"
            :model="row.valueForm"
            :rules="row.valueRules"
            class="table-vue-form mt14">
            <el-form-item prop="selectValue">
                <el-input
                    :disabled="isDisabled"
                    v-model="row.valueForm.selectValue"
                    class="table-vue-form-input"
                    placeholder="请输入"
                    @change="changeValue(...arguments, row)"></el-input>
            </el-form-item>
        </el-form>
        <!-- 单选和多选 -->
        <el-form
            v-else-if="showSelect"
            :ref="'valueForm'+ nowIndex"
            :model="row.valueForm"
            :rules="row.valueRules"
            class="table-vue-form mt14">
            <el-form-item prop="selectValue">
                <el-select
                    :disabled="isDisabled"
                    v-model="row.valueForm.selectValue"
                    :multiple="row.multiple"
                    :filterable="row.remote"
                    :remote="row.remote"
                    :remote-method="searchUsers"
                    class="table-vue-form-select"
                    clearable
                    @change="changeValue(...arguments, row)">
                    <el-option
                        v-for="item in row.valueList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value+','+item.label">
                        <user-list
                            v-if="row.nowSelectData.field_category === '02'"
                            :user="item"></user-list>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-form
            v-else-if="showDate"
            :ref="'valueForm'+ nowIndex"
            :model="row.valueForm"
            :rules="row.valueRules"
            class="table-vue-form mt14">
            <el-form-item prop="selectValue">
                <!-- 时间的控件 -->
                <el-date-picker
                    :disabled="isDisabled"
                    v-model="row.valueForm.selectValue"
                    :type="row.dateType"
                    class="table-vue-form-select"
                    placeholder="请选择日期"
                    @change="changeValue(...arguments, row)">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <el-form
            v-else-if="showMore"
            :ref="'valueForm'+ nowIndex"
            :model="row.valueForm"
            :rules="row.valueRules"
            class="table-vue-form mt14">
            <el-form-item
                prop="selectValue"
                class="twoInput">
                <el-input
                    :disabled="isDisabled"
                    v-model="row.valueForm.selectValue"
                    class="table-vue-form-input"
                    placeholder="请输入"
                    @change="changeValue(...arguments, row,'')"></el-input>
            </el-form-item>
            <el-form-item
                v-if="row.conditionTypecodeForm.action_code === '10'"
                prop="selectValue2"
                class="twoInput">
                <el-input
                    :disabled="isDisabled"
                    v-model="row.valueForm.selectValue2"
                    class="table-vue-form-input"
                    placeholder="请输入"
                    @change="changeValue(...arguments, row,2)"></el-input>
            </el-form-item>
            <el-form-item
                v-if="row.conditionTypecodeForm.action_code === '18' || row.conditionTypecodeForm.action_code === '17' "
                prop="selectValue2"
                class="twoInput">
                <el-select
                    :disabled="isDisabled"
                    v-model="row.valueForm.selectValue2"
                    :filterable="row.remote2"
                    :multiple="row.multiple2"
                    :remote="row.remote2"
                    :remote-method="searchUsers"
                    class="table-vue-form-select"
                    clearable
                    @change="changeValue(...arguments, row, 2)">
                    <el-option
                        v-for="item in row.valueList2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value+','+item.label">
                        <user-list
                            v-if="row.nowSelectData.field_category === '02'"
                            :user="item"></user-list>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import apiCommon from 'common/utils/api';
import mixCommon from 'common/mixins/common';
import UserList from 'common/components/UserList';
import commonUtils from 'common/utils/misc';
export default {
    name: 'DynamicTableValue',
    components: {
        UserList
    },
    mixins: [mixCommon],
    props: {
        row: Object,
        paramsObj: Object,
        nowIndex: Number,
        type: String,
        manageData: Object,
        tableLists: Array,
        deleteTablesLists: Array
    },
    data() {
        return {
            showInputText: false, // 单纯的文本框
            showInputNum: false, // 数字文本框
            showSelect: false, // 单独的下拉选
            showDate: false, // 时间控件
            showMore: false // 更多的选项
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
    watch: {},
    mounted() {
        this.judgeValueType(this.row);
    },
    methods: {
        judgeValueType(row) {
            if (row.nowSelectData.field_category === '01') {
                // 文本
                row.valueRules.selectValue[0].validator = function(rule, value, callback) {
                    if (row.nowSelectData.field_remark === '编号') {
                        let rep = /^[0-9]\d*$/;
                        if (rep.test(value)) {
                            if (value.length > row.nowSelectData.field_limit) {
                                return callback(new Error(`请输入${row.nowSelectData.field_limit}数字`));
                            }
                            return callback();
                        } else {
                            return callback(new Error(`请输入正整数`));
                        }
                    } else {
                        if (value === null || value.length < 1) {
                            return callback(new Error('请输入值'));
                        } else if (value.length > row.nowSelectData.field_limit) {
                            return callback(new Error(`请输入${row.nowSelectData.field_limit}字符`));
                        } else {
                            return callback();
                        }
                    }
                };
                return (this.showInputText = true);
            }
            if (row.nowSelectData.field_category === '02') {
                // 人员
                row.remote = true;
            } else {
                row.remote = false;
            }
            if (row.nowSelectData.field_category === '03' || row.nowSelectData.field_category === '02') {
                // 枚举
                row.valueRules.selectValue[0].trigger = 'change';
                row.valueRules.selectValue[0].validator = function(rule, value, callback) {
                    if (value === null || value.length === 0) {
                        return callback(new Error('请选择值'));
                    } else {
                        return callback();
                    }
                };
                if (row.action_code === '07' || row.action_code === '08') {
                    // 是与不是(证明是单选)
                    row.multiple = false;
                    return (this.showSelect = true);
                }
                if (row.action_code === '05' || row.action_code === '06') {
                    // 属于与不属于(证明是多选)
                    row.multiple = true;
                    return (this.showSelect = true);
                }
            }
            if (row.nowSelectData.field_category === '04') {
                // 数值编码
                if (row.action_code === '10') {
                    // 证明是之间
                    this.checkNumber(row, '', 'more');
                    this.checkNumber(row, 2, 'more');
                    return (this.showMore = true);
                } else {
                    this.checkNumber(row, '');
                    return (this.showInputNum = true);
                }
            }
            if (row.nowSelectData.field_category === '05') {
                // 日期编码
                if (row.action_code === '17' || row.action_code === '18') {
                    row.multiple2 = false;
                    row.remote2 = false;
                    row.valueRules.selectValue[0].validator = function(rule, value, callback) {
                        let rep = /^[0-9]\d*$/;
                        if (rep.test(value)) {
                            return callback();
                        } else {
                            return callback(new Error(`请输入正整数`));
                        }
                    };
                    row.valueRules.selectValue2[0].trigger = 'change';
                    row.valueRules.selectValue2[0].validator = function(rule, value, callback) {
                        if (value === null || value.length === 0) {
                            return callback(new Error('请选择值'));
                        } else {
                            return callback();
                        }
                    };
                    return (this.showMore = true);
                } else {
                    if (row.action_code === '10') {
                        // 证明是之间的
                        row.dateType = 'daterange';
                    } else {
                        row.dateType = 'date';
                    }

                    row.valueRules.selectValue[0].trigger = 'change';
                    row.valueRules.selectValue[0].validator = function(rule, value, callback) {
                        if (!value || (value instanceof Array && !value[0])) {
                            return callback(new Error('请选择值'));
                        } else {
                            return callback();
                        }
                    };
                    return (this.showDate = true);
                }
            }
            return false;
        },
        checkNumber(row, index, type) {
            row.valueRules[`selectValue${index}`][0].validator = function(rule, value, callback) {
                if (row.nowSelectData.field_remark === '预估工作量' || row.nowSelectData.field_remark === '实际工作量') {
                    let rep = /^(([0-9]+)|([0-9]+\.[0-9]{1,2}))$/; // 验证工作量
                    if (!rep.test(value)) {
                        return callback(new Error('0.01-10000数字'));
                    } else {
                        if (type === 'more') {
                            if (index === '') {
                                // 证明是第一个
                                if (
                                    row.valueForm.selectValue2 === null ||
                                    row.valueForm.selectValue2 === '' ||
                                    parseFloat(value) < parseFloat(row.valueForm.selectValue2)
                                ) {
                                    return callback();
                                } else {
                                    return callback(new Error('必须小于后一个数'));
                                }
                            } else if (index === 2) {
                                if (
                                    row.valueForm.selectValue === null ||
                                    row.valueForm.selectValue === '' ||
                                    parseFloat(value) > parseFloat(row.valueForm.selectValue)
                                ) {
                                    return callback();
                                } else {
                                    return callback(new Error('必须大于前一个数'));
                                }
                            }
                        } else {
                            if (value > 10000 || value <= 0) {
                                return callback(new Error('0.01-10000数字'));
                            }
                        }
                        return callback();
                    }
                } else {
                    let rep = /^[0-9]\d*$/;
                    if (rep.test(value)) {
                        if (type === 'more') {
                            if (index === '') {
                                // 证明是第一个
                                if (
                                    row.valueForm.selectValue2 === null ||
                                    row.valueForm.selectValue2 === '' ||
                                    parseInt(value) < parseInt(row.valueForm.selectValue2)
                                ) {
                                    return callback();
                                } else {
                                    return callback(new Error('必须小于后一个数'));
                                }
                            } else if (index === 2) {
                                if (
                                    row.valueForm.selectValue === null ||
                                    row.valueForm.selectValue === '' ||
                                    parseInt(value) > parseInt(row.valueForm.selectValue)
                                ) {
                                    return callback();
                                } else {
                                    return callback(new Error('必须大于前一个数'));
                                }
                            }
                        }
                        return callback();
                    } else {
                        if (row.nowSelectData.field_limit) {
                            return callback(new Error(`请输入${row.nowSelectData.field_limit}数字`));
                        } else {
                            return callback(new Error(`请输入正整数`));
                        }
                    }
                }
            };
        },
        changeValue(val, row, index) {
            if (!val || val.length === 0) return;
            if (this.tableLists.length !== this.deleteTablesLists.length) {
                return;
            }
            if (row.nowSelectData.field_category === '01') {
                row.condition_value = [val];
            } else if (row.nowSelectData.field_category === '04') {
                if (row.action_code === '10') {
                    if (index === '') {
                        row.condition_value[0] = val;
                    } else {
                        row.condition_value[1] = val;
                    }
                } else {
                    row.condition_value = [val];
                }
            } else if (row.nowSelectData.field_category === '02' || row.nowSelectData.field_category === '03') {
                if (val instanceof Array) {
                    row.condition_value = [];
                    val.forEach(element => {
                        row.condition_value.push({
                            value_id: element.split(',')[0],
                            value_name: element.split(',')[1]
                        });
                    });
                } else {
                    row.condition_value = [
                        {
                            value_id: val.split(',')[0],
                            value_name: val.split(',')[1]
                        }
                    ];
                }
            } else if (row.nowSelectData.field_category === '05') {
                if (row.action_code === '10') {
                    row.condition_value = [
                        commonUtils.formatDate(row.valueForm.selectValue[0]),
                        commonUtils.formatDate(row.valueForm.selectValue[1])
                    ];
                } else if (row.action_code === '17' || row.action_code === '18') {
                    if (index === '') {
                        row.condition_value[1] = val;
                    } else {
                        row.condition_value[0] = val.split(',')[0];
                    }
                } else {
                    row.condition_value = [val];
                }
            }
        },
        searchUsers(keyword) {
            // 查询人员
            if (keyword.indexOf(',') > -1) {
                return (this.row.valueList = []);
            }
            if (this.row.nowSelectData.field_remark === '开发人员') {
                // 查询的是项目内的成员
                let params = {
                    keyword,
                    project_id: this.paramsObj.project_id
                };
                apiCommon.queryProjectMemberOnline(params).then(res => {
                    this.row.valueList = res.result.map(item => {
                        item.value = item.userId;
                        item.label = item.userName;
                        return item;
                    });
                });
            } else {
                // 查询的是所有成员
                apiCommon.queryUserList({ username: keyword }).then(res => {
                    this.row.valueList = res.users.map(item => {
                        item.value = item.userId;
                        item.label = item.userName;
                        return item;
                    });
                });
            }
        }
    }
};
</script>
<style lang='less'>
.dynamic-table {
    .table-vue-form {
        min-height: 50px;
        .el-form-item {
            margin-bottom: 0px !important;
            .el-form-item__error {
                padding-top: 2px !important;
            }
        }
        .table-vue-form-select .el-input__inner {
            min-height: 26px !important;
        }
        .table-vue-form-input .el-input__inner {
            min-height: 26px !important;
        }
    }
}
</style>
<style lang='less' scoped>
.twoInput {
    width: 90px;
    display: inline-block;
}
.mt14 {
    margin-top: 14px;
}
</style>
