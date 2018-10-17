<!--@description:新版模块表头组件，项目下的缺陷的模块表头筛选，
目前暂时用于需求模块和缺陷模块看效果
传入参数要求：
        moduleSelectParams: {
            type: Object,
            default: function() {
                return {
                    moduleList: Array, // 表头下拉选项
                    handChange: Function, // 选择模块后触发的方法
                    selectedVal: String, // 选择的数据
                    selectNameKey: String, // 表头的Key值
                    selectName: String, // 表头名字
                    needVersionName: Boolean, // 是否需要递归的标志
                    isTree: Boolean, // 是否是树形的标志
                    requestList: Function // 请求列表方法
                };
            }
        }
@author:jjq
@date:2018/6/27-->
<template>
    <div class="header-select-tree">
        <div
            ref="headSelectLink"
            class="header-select-link">
            {{ moduleSelectParams.selectName }}<i class="icon-pullup-down"></i>
        </div>
        <slot>
            <module-cascader
                :lists="moduleSelectParams.moduleList"
                v-model="selectedValue"
                :need-version-name="moduleSelectParams.needVersionName"
                @moduleChange="moduleChange">
            </module-cascader>
        </slot>

    </div>
</template>

<script>
import ModuleCascader from 'common/components/ModuleCascader';

export default {
    name: 'HeaderModuleSelect',
    components: {
        ModuleCascader
    },
    props: {
        moduleSelectParams: {
            type: Object,
            default: function() {
                return {};
            }
        }
    },
    data() {
        return {
            showPopover: false,
            selectedValue: ''
        };
    },
    computed: {},
    methods: {
        moduleChange(value) {
            this.moduleSelectParams.handChange(value, this.moduleSelectParams);
        }
    }
};
</script>

<style lang='less'>
@import '../../layouts/css/themes/default.less';

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
</style>
