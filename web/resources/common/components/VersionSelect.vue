<!--
版本选择联动下拉
修改人：罗怀梁 2018.7.23
修改内容：增加“show-all-levels”属性，整理props为对象模式
-->
<template>
    <el-cascader
        v-setCascaderPopperPos:versionPopper
        :options="formatOptionsInit"
        v-model="selectedOptions"
        :disabled="moduleAble||disabled"
        :clearable="clearable"
        :filterable="filterable"
        :show-all-levels="showAll"
        popper-class="header-popper-version"
        change-on-select
        @change="changeSelected"></el-cascader>
</template>

<script>
export default {
    name: 'VersionSelect',
    components: {},
    props: {
        options: Array,
        projectId: [String, Number],
        type: Number,
        needVersionName: Boolean,
        selected: null,
        value: [Number, String, Array],
        moduleAble: Boolean,
        disabled: Boolean,
        clearable: {
            type: Boolean,
            default: true
        },
        filterable: {
            type: Boolean,
            default: true
        },
        showAll: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            keyword: '',
            queryVersionPramas: {
                project_id: this.projectId,
                pageSize: 100,
                pageNo: 1,
                query_type: '02'
            },
            selectedOptions: [],
            changedBycustomer: false
        };
    },
    computed: {
        formatOptionsInit() {
            return this.formatOptions(this.options);
        }
    },
    watch: {
        projectId(val) {
            this.queryVersionPramas.project_id = val;
        },
        value(val, oldVal) {
            if (!val) {
                this.selectedOptions = [''];
            } else if (typeof this.value === 'number' && !this.changedBycustomer) {
                this.selectedOptions = this.initVersionValue(val, this.options);
            }
            this.changedBycustomer = false;
        },
        options(val) {
            this.selectedOptions = this.initVersionValue(this.value, val);
        }
    },
    mounted() {
        if (typeof this.value === 'number' || typeof this.value === 'string') {
            this.selectedOptions = this.initVersionValue(this.value, this.options);
        }
    },
    methods: {
        changeSelected(val) {
            this.changedBycustomer = true;
            this.$emit('input', this.selectedOptions[this.selectedOptions.length - 1]);
            this.$emit('change', this.selectedOptions);
        },
        // 初始化版本的值(默认值)
        initVersionValue(versionId, versionList, arr = []) {
            versionList.forEach(item => {
                if (item.version_id == versionId) {
                    arr.unshift(item.version_id);
                    if (typeof item.parent_version_id === 'number') {
                        this.initVersionValue(item.parent_version_id, versionList, arr);
                    }
                }
            });
            return arr;
        },
        formatOptions(opt) {
            var opt = opt || [];
            let arr = [];
            opt.map(item => {
                let value;
                let obj;
                if (this.type == 2) {
                    value = item.version_num;
                } else if (this.type == 1) {
                    value = item.version_id;
                }
                if (this.needVersionName) {
                    obj = {
                        value: value + ',' + item.version_num,
                        label: item.version_num
                    };
                } else {
                    obj = {
                        value: value,
                        label: item.version_num
                    };
                }
                obj.parent_version_id = item.parent_version_id;
                obj.version_id = item.version_id;
                arr.push(obj);
            });
            return (arr = this.getTree(arr));
        },
        getTree(arr) {
            function setChildren(versionList, selectedId, data) {
                !!versionList &&
                    versionList.map((item, index) => {
                        if (item.version_id == selectedId) {
                            let childArr = item.children || [];
                            childArr.push(data);
                            item.children = childArr;
                        } else {
                            if (item.children) {
                                setChildren(item.children, selectedId, data);
                            }
                        }
                    });
            }
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i].parent_version_id === 'number') {
                    let childVersion = arr.splice(i, 1);
                    i--;
                    setChildren(arr, childVersion[0].parent_version_id, childVersion[0]);
                }
            }
            return arr;
        }
    }
};
</script>

<style lang="less">
</style>
