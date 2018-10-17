<!--
@name: 质量系统 - 组间排名表格列
应用场景：组间排名明细
@description: 用于动态的表格的表头（可递归表头）
element-ui 问题 目前只能使用到二级表头 更新到新版element-ui后可直接递归组件 不需要v-esle
@author: lxb
@date: 20181012
-->
<template>
    <el-table-column v-bind="columnProps.baseConfig">
        <template
            v-for="item in columnProps.children">
            <custom-table-column
                v-if="item.children && item.children.length"
                :key="item.baseConfig.prop"
                :column-props="item">
                <slot
                    v-if="item.slot"
                    :name="item.slot">
                </slot>
            </custom-table-column>
            <el-table-column
                v-else
                :key="item.baseConfig.prop"
                v-bind="item.baseConfig">
                <slot
                    v-if="item.slot"
                    :name="item.slot">
                </slot>
            </el-table-column>
        </template>
    </el-table-column>
</template>
<script>
export default {
    name: 'CustomTableColumn',
    props: {
        columnProps: {
            type: Object,
            default: () => {}
        }
    }
};
</script>
