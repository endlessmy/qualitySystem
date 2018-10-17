<!--
@name: 质量系统 - 组间排名表
应用场景：组间排名明细
@description: 用于动态的表格

@author: lxb
@date: 20181012
-->
<template>
    <el-table
        :border="showBorder"
        :data="tableList"
        style="width: 100%"
        empty-text="暂无数据"
        @sort-change="sortChange">
        <template v-for="item in columnPropsList">
            <custom-table-column
                :key="item.baseConfig.prop"
                :column-props="item">
            </custom-table-column>
        </template>
    </el-table>
</template>
<script>
import CustomTableColumn from '@/components/CustomTableColumn';
export default {
    name: 'CustomTable',
    components: { CustomTableColumn },
    props: {
        // 表格数据
        tableList: {
            type: Array,
            default: () => []
        },
        // 表头配置项
        columnPropsList: {
            type: Array,
            default: () => []
        },
        showBorder: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        sortChange(obj) {
            this.$emit('sortChange', obj);
        }
    }
};
</script>
