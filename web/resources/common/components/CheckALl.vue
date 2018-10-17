<!--
复选框全选组件
@author 罗怀梁
@createTime 2018/5/9
@describe
    allLabelName: String,  全部选择的名字
    lists: Array  所有复选框的名字，也是返回的内容
    acquire; Function  父组件获取数据的方法
@example
    HTML
    <CheckAll
        :lists="focusLabels"
        all-label-name="关注人员"
        @acquire="handelChange" />
-->
<template>
    <div>
        <el-checkbox
            :indeterminate="isIndeterminate"
            :label="allLabelName"
            v-model="checkAll"
            class="all"
            @change="handleCheckAllChange" />
        <el-checkbox-group
            v-model="checked"
            @change="handleCheckedChange">
            <el-checkbox
                v-for="label in lists"
                :label="label"
                :key="label"
                class="other" />
        </el-checkbox-group>
    </div>
</template>

<script>
export default {
    name: 'CheckAll',
    props: {
        allLabelName: String,
        lists: Array,
        acquire: Function
    },
    data() {
        return {
            checkAll: false,
            checked: [],
            isIndeterminate: false
        };
    },
    methods: {
        handleCheckAllChange(event) {
            this.checked = event.target.checked ? this.lists : [];
            this.isIndeterminate = false;
            this.$emit('acquire', this.checked);
        },
        handleCheckedChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.lists.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.lists.length;
            this.$emit('acquire', value);
        }
    }
};
</script>
<style lang='less' type='text/less' scoped>
.el-checkbox {
    height: 16px;
    line-height: 16px;
    width: 125px;
    margin-left: 0 !important;
    margin-bottom: 20px;
}
.all.el-checkbox {
    color: #333 !important;
}
.other.el-checkbox {
    color: #666 !important;
}
</style>
