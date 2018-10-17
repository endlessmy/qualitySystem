<!--
功能需求分类下拉层级的组件(后台返回的是所有数据自己前台需要组装一次)
@author:shenah
@updateTime:2018/3/20
@reason:玉衡原来的接口/FunctionRequirementService/requireType/getTypeTree
        spms现在的接口FuncrequireService/funcRequireType/queryList
-->
<template>
    <div class="modules">
        <el-cascader
            v-setCascaderPopperPos:moduleCascaderPopper
            :options="moduleLists"
            v-model="selectedModule"
            :disabled="moduleAble"
            clearable
            popper-class="header-popper-module"
            change-on-select
            style="width: 100%;!important;"
            class="cascaderInput"
            @change="handleChange">
        </el-cascader>
    </div>
</template>
<script>
export default {
    props: ['lists', 'moduleAble', 'selectMous', 'value', 'needVersionName', 'popperClass'],
    data() {
        return {
            moduleLists: [], // 所属模块的列表(处理过的),
            selectedModule: [], // 已经选择的模块
            changedBycustomer: false
        };
    },
    watch: {
        value(val) {
            if (val === '') {
                this.selectedModule = [];
            } else if (typeof this.value === 'number' && !this.changedBycustomer) {
                this.selectedModule = this.initModuleValue(val, this.lists);
            }
            this.changedBycustomer = false;
        },
        lists: function(val, oldVal) {
            if (this.lists.length === 0) {
                this.moduleLists = this.lists;
                return;
            }
            this.moduleLists = this.handleReturnDatas(val, -1); // 处理传过来的数据
            this.selectedModule = this.initModuleValue(this.value, val);
        },

        moduleAble: function(val, oldVal) {
            this.moduleAble = val;
        },

        selectMous(newVal, oldVal) {
            this.selectedModule = newVal;
        }
    },
    mounted() {
        if (this.lists.length != 0) {
            this.moduleLists = this.handleReturnDatas(this.lists, -1); // 处理传过来的数据
        }
    },
    methods: {
        // 初始模块的值(默认值)
        initModuleValue(moduleId, moduleList, arr = []) {
            moduleList.forEach(item => {
                if (item.func_require_type_id === moduleId) {
                    arr.unshift(item.func_require_type_id);
                    if (typeof item.func_require_type_pid === 'number') {
                        this.initModuleValue(item.func_require_type_pid, moduleList, arr);
                    }
                }
            });
            return arr;
        },
        handleReturnDatas(data, pid) {
            // 处理后台返回来的数据
            let result = [];
            let temp;
            for (let i = 0; i < data.length; i++) {
                if (data[i].func_require_type_pid == pid) {
                    let obj;
                    if (this.needVersionName) {
                        obj = {
                            value: data[i].func_require_type_id + ',' + data[i].func_require_type_name,
                            label: data[i].func_require_type_name
                        };
                    } else {
                        obj = {
                            value: data[i].func_require_type_id,
                            label: data[i].func_require_type_name
                        };
                    }
                    temp = this.handleReturnDatas(data, data[i].func_require_type_id);
                    if (temp.length > 0) {
                        obj.children = temp;
                    }
                    result.push(obj);
                }
            }
            return result;
        },
        handleChange(value) {
            this.changedBycustomer = true;
            this.$emit('moduleChange', value[value.length - 1]);
            this.$emit('input', value[value.length - 1]);
        }
    }
};
</script>
<style lang='less'>
.el-cascader-menus {
    &.cascader-s {
        .el-cascader-menu__item {
            font-size: 12px;
        }
    }
}
</style>

<style lang='less' scoped>
.modules {
    width: 100%;
    height: 100%;
}
.cascaderInput {
    width: 100%;
}
</style>
