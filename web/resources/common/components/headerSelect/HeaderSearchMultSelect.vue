<!--搜索多选，通过输入搜索出现下拉列表，列表选项支持单选和多选-->
<!--@description:新版搜索多选表头组件，目前用于用户反馈模块的产品名称表头筛选
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
                    initObj: {
                    searchFn: this.queryProductList,
                    params: 'product_name',
                    data: this.productList
                    },
                    requestList: Function // 请求列表
                };
            }
        }
@author:jjq
@date:2018/7/12-->
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
                        v-for="item in searchMultSelectParams.initObj.data"
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
            {{ searchMultSelectParams.selectName }}<i class="icon-pullup-down"></i>
        </div>

    </div>
</template>

<script>
// import { mapActions, mapState } from 'vuex';
import utils from 'common/utils/misc';

export default {
    name: 'HeaderSearchMultSelect',
    // props: ['handChange','selectedVal','selectNameKey','selectName','initObj'],
    props: {
        searchMultSelectParams: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },

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
            let len = this.searchMultSelectParams.selectName.length;
            return 'header-select-multiple input-len-' + len;
        },
        selectedVal() {
            return this.searchMultSelectParams.selectedVal;
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
        searchRemote(para) {
            // 需要在mutations将数据处理成label,value 的键值对
            if (!utils.isEmpty(para)) {
                let paraKey = this.searchMultSelectParams.initObj.params;
                this.searchMultSelectParams.initObj.searchFn({ [paraKey]: para });
            }
        },
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
                if (!this.selectValue[0] === '' || this.selectValue) {
                    value = this.selectValue;
                }
                this.searchMultSelectParams.handChange(value, this.searchMultSelectParams);
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
