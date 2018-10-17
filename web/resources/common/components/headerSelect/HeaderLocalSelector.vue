<!--
    @author: qqli
    @time: 2018-06-06
    @desc: 用于表头筛选，
        下拉框数据来源于父组件传入，可输入匹配；
        可用于label、value类型的数据选择；
    @使用情况: 项目设置-gitlab权限表头筛选姓名和账号,业务需求和缺陷管理表头筛选关联项目
    传入参数要求:
        moduleSelectParams: {
            type: Object,
            default: function() {
                return {
                    handChange: Function, // 选择模块后触发的方法
                    selectedVal: String, // 选择的数据
                    selectNameKey: String, // 表头的Key值
                    selectName: String, // 表头名字
                    options: Array, // 表头下拉选项
                    multiple: Boolean, // 是否多选,默认false
                    requestList: Function // 请求列表方法
                };
            }
        }
-->
<template>
    <div class="select-user">
        <el-popover
            ref="popoverUserSelect"
            v-model="showPopover"
            popper-class="header-popper-user"
            placement="bottom-start"
            width="180"
            trigger="click"
            @show="displayPopver">
            <slot>
                <el-select
                    ref="popoverSlotSelect"
                    v-model="processUser"
                    :multiple="multiSelectParams.multiple"
                    class="select"
                    placeholder="请输入搜索"
                    filterable
                    popper-class="popover-slot-select"
                    @change="updateProcessUser"
                    @visible-change="visibleChange">
                    <el-option
                        v-for="item in multiSelectParams.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </slot>
        </el-popover>
        <div
            v-popover:popoverUserSelect
            ref="headSelectLink"
            class="header-select-link">
            {{ multiSelectParams.selectName }}
            <i class="icon-pullup-down"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HeaderLocalSelector',
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
            processUser: '',
            isTriggerChange: false,
            showPopover: false
        };
    },

    methods: {
        displayPopver() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.$refs.popoverUserSelect.$refs.popper.querySelector('input').focus();
                });
            });
        },
        // select选择人时触发
        updateProcessUser(item) {
            this.isTriggerChange = true;
            if (typeof item === 'undefined') {
                item = this.processUser;
            }
            if (this.multiSelectParams.multiple) {
                item = [item];
            }
            this.multiSelectParams.handChange(item, this.multiSelectParams);
            this.showPopover = false;
        },

        // 解决同名选择不触发updateProcessUser()
        visibleChange() {
            // 下拉框展开 arguments[0] 为 true，收起 为 false
            if (!arguments[0] && !this.isTriggerChange && this.processUser) {
                this.updateProcessUser();
            }
            this.isTriggerChange = false;
        }
    }
};
</script>

<style lang='less'>
@import '../../layouts/css/themes/default.less';

.column-user {
    .cell {
        position: relative;
    }
    .select-user {
        position: relative;
    }

    .select {
        position: absolute;
        left: 0;
        top: 10px;
    }
}

.el-table .header-select-link {
    display: inline-block;
    cursor: pointer;

    .icon-pullup-down {
        color: @text-color15;
        font-size: 12px;
        display: inline-block;
        transform: scale(0.5);
        margin-top: -2px;
    }
}

.el-select-dropdown.popover-slot-select {
    &[x-placement^='bottom'] {
        margin-top: 0;
        border-top: 0;
    }
    &[x-placement^='top'] {
        border-top: 1px;
        border-bottom: 0;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.12), 0 -2px 6px rgba(0, 0, 0, 0.04);
    }
}
</style>
