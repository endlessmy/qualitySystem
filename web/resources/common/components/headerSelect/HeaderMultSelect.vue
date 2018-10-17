<!--表头状态的下拉框等类型，支持单选\多选-->
<!--@description:新版多选表头组件，目前暂时用于需求模块和缺陷模块看效果
传入参数要求：
        multiSelectParams: {
            type: Object,
            default: function() {
                return {
                    handChange: Function, // 选择后触发的事件
                    selectedVal: String, // 选择的数据
                    selectNameKey: String, // 表头的key值
                    options: Array, // 表头下拉选项
                    selectName: String, // 表头名字
                    multiple: Boolean, // 是否是多选
                    requestList: Function // 请求列表
                };
            }
        }
@author:jjq
@date:2018/6/26-->
<template>
    <div :class="inputWidthClass">
        <div
            ref="headSelectLink"
            class="header-select-link">
            {{ multiSelectParams.selectName }}<i class="icon-pullup-down"></i>
        </div>
        <el-select
            ref="popoverSlotMultiSelect"
            v-model="selectValue"
            :multiple="isMultiple"
            class="select"
            popper-class="header-popper-select"
            @change="changeValue"
            @visible-change="updateSelectValue">
            <el-option
                v-if="isAllShow"
                value="all">全部</el-option>
            <el-option
                v-for="item in multiSelectParams.options"
                v-if="isMultiple&&item.label"
                :key="item.value"
                :label="item.label"
                :value="item.value+','+item.label">
            </el-option>
            <el-option
                v-for="item in multiSelectParams.options"
                v-if="!isMultiple&&item.label"
                :key="item.value+'02'"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: 'HeaderMultSelect',
    props: {
        multiSelectParams: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },

    data() {
        return {
            selectValue: '',
            valueChanged: false
        };
    },

    computed: {
        selectedVal() {
            return this.multiSelectParams.selectedVal;
        },
        isMultiple() {
            return this.multiSelectParams.multiple === undefined;
        },
        isAllShow() {
            return this.multiSelectParams.allShow === undefined;
        },
        inputWidthClass() {
            let len = this.multiSelectParams.selectName.length;
            return 'header-select-multiple input-len-' + len;
        }
    },

    watch: {
        selectedVal(newVal, oldVal) {
            if (!newVal) {
                this.selectValue = [];
            }
        }
    },

    methods: {
        changeValue(val) {
            if (val.length === 0) {
                return (this.valueChanged = false);
            } else {
                if (this.isMultiple && val.some(item => item === 'all')) {
                    if (val[0] === 'all' && val.length > 1) {
                        // 选择'全部'后再选其他选项
                        this.selectValue.shift();
                    } else if (val[0] === 'all') {
                    } else {
                        // 选择其他选项后再选'全部'
                        this.selectValue = ['all'];
                    }
                }
                this.valueChanged = true;
            }
        },
        updateSelectValue(showSelect) {
            if (this.valueChanged && !showSelect) {
                // 值发生过改变并且下拉框隐藏
                this.valueChanged = false;
                let value;
                if (!this.selectValue[0] === '' || this.selectValue || this.selectValue === 0) {
                    value = this.selectValue;
                }
                this.multiSelectParams.handChange(value, this.multiSelectParams);
                this.selectValue = this.selectValue instanceof Array ? [] : '';
            }
        }
    }
};
</script>

<style lang='less' scoped>
.icon-pullup-down {
    color: #98a0a9;
    font-size: 12px;
    display: inline-block;
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    margin-top: -2px;
}
</style>
