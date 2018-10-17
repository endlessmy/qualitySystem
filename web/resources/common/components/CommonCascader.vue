<!--
    通用联动下拉
    @autor dengyingfeng 2018/04/03

-->
<template>
    <el-cascader
        v-setCascaderPopperPos:commonPopper
        :options="formatOptionsInit"
        v-model="selectedOptions"
        :disabled="disabled"
        :clearable="clearable"
        :filterable="filterable"
        popper-class="commonPopper"
        change-on-select
        @change="changeSelected"></el-cascader>
</template>

<script>
export default {
    name: 'CommonCascader',
    components: {},
    props: {
        options: Array,
        projectId: [Number, String],
        value: [Number, String],
        disabled: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        filterable: {
            type: Boolean,
            default: false
        },
        descObj: {
            type: Object,
            default: {
                valueKey: 'version_id',
                labelKey: 'version_num',
                parentKey: 'parent_version_id'
            }
        },
        type: {
            type: Number,
            default: 1
        },
        needGetLabel: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
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
        value(val, oldVal) {
            if (val === '') {
                this.selectedOptions = [];
            } else if (typeof this.value === 'number' && !this.changedBycustomer) {
                this.selectedOptions = this.initValue(val, this.options);
            }
            this.changedBycustomer = false;
        },
        options(val) {
            this.selectedOptions = this.initValue(this.value, val);
        }
    },
    mounted() {
        if (typeof this.value === 'number' || typeof this.value === 'string') {
            this.selectedOptions = this.initValue(this.value, this.options);
        }
    },
    methods: {
        changeSelected() {
            this.changedBycustomer = true;
            const curValue = this.selectedOptions[this.selectedOptions.length - 1];
            const isLeaf = this.checkIsLeaf(curValue, this.options);
            const label = this.getLabel(curValue, this.options);
            this.$emit('input', curValue);
            this.$emit('change', this.selectedOptions, isLeaf, label);
        },
        checkIsLeaf(value, list, flag = false) {
            list.forEach(item => {
                if (item[this.descObj.valueKey] === value) {
                    flag = !item.children;
                }
            });
            return flag;
        },
        getLabel(value, list, flag = '') {
            list.forEach(item => {
                if (item[this.descObj.valueKey] === value) {
                    flag = item[this.descObj.labelKey];
                }
            });
            return flag;
        },
        // 初始化值(默认值)
        initValue(value, list, arr = []) {
            list.forEach(item => {
                if (item[this.descObj.valueKey] === value) {
                    arr.unshift(item[this.descObj.valueKey]);
                    if (typeof item[this.descObj.parentKey] === 'number') {
                        this.initValue(item[this.descObj.parentKey], list, arr);
                    }
                }
            });
            return arr;
        },
        formatOptions(opt) {
            var opt = opt || [];
            let arr = [];
            const vKey = this.descObj.valueKey;
            const lKey = this.descObj.labelKey;
            const pkey = this.descObj.parentKey;
            opt.map(item => {
                let value;
                let obj;
                if (this.type === 2) {
                    value = item[lKey];
                } else if (this.type === 1) {
                    value = item[vKey];
                }
                if (this.needGetLabel) {
                    obj = {
                        value: value + ',' + item[lKey],
                        label: item[lKey]
                    };
                } else {
                    obj = {
                        value: value,
                        label: item[lKey]
                    };
                }
                obj[pkey] = item[pkey];
                obj[vKey] = item[vKey];
                arr.push(obj);
            });
            return (arr = this.getTree(arr));
        },
        getTree(arr) {
            const vKey = this.descObj.valueKey;
            const pkey = this.descObj.parentKey;
            const initArr = JSON.parse(JSON.stringify(arr));
            function setChildren(list, selectedVal, data) {
                !!list &&
                    list.map((item, index) => {
                        if (item[vKey] === selectedVal) {
                            let childArr = item.children || [];
                            childArr.push(data);
                            item.children = childArr;
                        } else {
                            if (item.children) {
                                setChildren(item.children, selectedVal, data);
                            }
                        }
                    });
            }
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i][pkey] === 'number') {
                    let hasParent = false;
                    hasParent = initArr.some(item => item[vKey] === arr[i][pkey]);
                    if (!hasParent) {
                        continue;
                    }
                    let child = arr.splice(i, 1);
                    i--;
                    setChildren(arr, child[0][pkey], child[0]);
                }
            }
            return arr;
        }
    }
};
</script>

<style lang="less">
</style>
