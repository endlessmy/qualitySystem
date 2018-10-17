<!--
    远程搜索多选
    todo: delete, 没有自研模块使用
    @dengxue
-->
<template>
    <div :class="inputWidthClass">
        <el-popover
            ref="popoverUserSelect"
            v-model="showPopover"
            popper-class="poppver-remote"
            placement="bottom"
            title=""
            width="210"
            trigger="click"
            content="">
            <slot>
                <el-select
                    v-model="selectValue"
                    :remote-method="searchRemote"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入搜索"
                    @change="changeValue"
                    @visible-change="updateSelectValue">
                    <el-option
                        v-for="item in initObj.data"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value+','+item.label">
                    </el-option>
                </el-select>
            </slot>
        </el-popover>
        <div
            v-popover:popoverUserSelect
            ref="headSelectLink"
            class="header-select-link">
            {{ selectName }}<i class="icon-pullup-down"></i>
        </div>

    </div>
</template>

<script>
import utils from 'common/utils/misc';

export default {
    name: 'RemoteMultHeadSelect',
    props: ['handChange', 'selectedVal', 'selectNameKey', 'selectName', 'initObj'],

    data() {
        return {
            selectValue: '',
            valueChanged: false,
            data: [],
            showPopover: false
        };
    },
    computed: {
        isMultiple() {
            return this.multiple === undefined;
        },
        inputWidthClass() {
            let len = this.selectName.length;
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

    mounted() {},
    methods: {
        searchRemote(para) {
            // 需要在mutations将数据处理成label,value 的键值对
            if (!utils.isEmpty(para)) {
                let paraKey = this.initObj.params;
                this.initObj.searchFn({ [paraKey]: para });
            }
        },
        changeValue(val) {
            if (val == '') {
                return (this.valueChanged = false);
            } else {
                if (this.isMultiple && val.some(item => item == 'all')) {
                    if (val[0] == 'all' && val.length > 1) {
                        // 选择'全部'后再选其他选项
                        this.selectValue.shift();
                    } else if (val[0] == 'all') {
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
                if (!this.selectValue[0] == '' || this.selectValue) {
                    value = this.selectValue;
                }
                this.handChange(value, this.selectNameKey);
                this.selectValue = this.selectValue instanceof Array ? [] : '';
            }
        }
    }
};
</script>

<style lang='less' >
.el-table .header-select-link {
    .icon-pullup-down {
        color: #98a0a9;
        font-size: 12px;
        display: inline-block;
        transform: scale(0.5);
        -webkit-transform: scale(0.5);
        margin-top: -2px;
    }
}

.poppver-remote {
    &.el-popover[x-placement^='bottom'] {
        margin-top: 0;
        padding: 0 !important;
    }
    &.el-popover {
        padding: 0;
        border: none;
        .popper__arrow {
            display: none;
        }
    }
}
</style>
