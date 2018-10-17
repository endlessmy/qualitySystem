<template>
    <div class="header-select-tree">
        <div
            ref="headSelectLink"
            class="header-select-link">
            {{ selectName }}<i class="icon-pullup-down"></i>
        </div>
        <slot>
            <module-cascader
                :lists="moduleList"
                v-model="selectedValue"
                :need-version-name="needVersionName"
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
    // selectedVal v-model没用???
    props: ['moduleList', 'handChange', 'selectedVal', 'selectNameKey', 'selectName', 'needVersionName'],
    data() {
        return {
            showPopover: false,
            selectedValue: ''
        };
    },
    computed: {},
    methods: {
        moduleChange(value) {
            this.handChange(value, this.selectNameKey, true);
        }
    }
};
</script>

<style lang='less'>
@import '../layouts/css/themes/default.less';

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
    margin-top: 0;
    border-top: 0;
}
</style>
