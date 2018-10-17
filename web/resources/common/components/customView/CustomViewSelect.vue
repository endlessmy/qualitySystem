<!--
自定义视图列表下拉选
@author shenah
@createTime 2018/4/3
 -->
<template>
    <div class="custom-view">
        <div class="left-text in">当前视图</div>
        <el-select
            v-model="selectValue"
            :style="resetStyle"
            class="in"
            popper-class="custom-view-select"
            @change="changeView">
            <el-option-group
                v-for="group in optionGroups"
                :key="group.type"
                :label="group.lable"
                :class="{'list-option':group.type === 'list','opertion-option':group.type === 'opertion'}">
                <el-option
                    v-for="item in group.data"
                    :key="item.view_id"
                    :label="item.view_title"
                    :value="item.view_id">
                    <div
                        v-if="item.view_id === -3"
                        class="line">
                    </div>
                    <div
                        :title="item.view_title"
                        class="fs12">
                        {{ utilsCommon.overName(item.view_title, 10) }}
                    </div>
                </el-option>
            </el-option-group>
        </el-select>
    </div>
</template>

<script>
import utilsCommon from 'common/utils/misc';
export default {
    name: 'CustomViewSelect',
    mixins: [utilsCommon],
    props: {
        value: [Number, String],
        list: {
            type: Array
        },
        requestParams: Object,
        resetStyle: Object,
        opertionList: {
            // 操作项的值定义默认值是为后续扩展
            type: Array,
            default() {
                return [
                    {
                        view_id: -3,
                        view_title: ''
                    },
                    {
                        view_id: -1,
                        view_title: '新建视图'
                    },
                    {
                        view_id: -2,
                        view_title: '管理视图'
                    }
                ];
            }
        }
    },
    data() {
        return {
            utilsCommon: utilsCommon,
            selectValue: '', // 选择的下拉选的值
            optionGroups: [
                // 分组的数据
                {
                    type: 'list',
                    data: [],
                    lable: '列表'
                },
                {
                    type: 'opertion',
                    data: this.opertionList,
                    lable: '操作'
                }
            ],
            reduceValue: '' // 当选择操作里面的值的时候要还原上一次的值
        };
    },
    watch: {
        value(val) {
            if (val) {
                this.selectValue = val;
            }
        },
        list(val) {
            this.optionGroups[0].data = val;
            if (!this.requestParams.view_id) {
                this.reduceValue = this.selectValue = this.optionGroups[0].data.filter(
                    item => item.view_config.is_default === true
                )[0].view_id; // 选择出默认的视图
            } else {
                this.reduceValue = this.selectValue = this.requestParams.view_id;
            }
            // this.$emit('customChange', this.reduceValue);
        }
    },
    methods: {
        changeView(val) {
            // 改变下拉选的值
            if (val === -1 || val === -2) {
                this.selectValue = this.reduceValue;
                this.$emit('customChange', val);
            } else if (val === -3) {
                this.selectValue = this.reduceValue;
                return false;
            } else {
                if (this.reduceValue !== val) {
                    this.selectValue = this.reduceValue = val;
                    this.$emit('customChange', val);
                }
            }
        }
    }
};
</script>
<style lang='less'>
.custom-view-select {
    .line {
        width: 100%;
        padding-right: 8px;
        height: 1px;
        background-color: #ebeff9;
    }
    .is-vertical {
        display: none;
    }
    .el-select-dropdown__wrap {
        max-height: 500px;
        .el-select-group__title {
            display: none;
        }
    }
}
</style>
<style lang='less' scoped>
.list-option {
    width: 100%;
    max-height: 300px;
    overflow: auto;
}
.opertion-option {
    width: 100%;
    max-height: 100px;
    overflow: hidden;
    .el-select-dropdown__item {
        &:nth-child(1) {
            cursor: default;
            &:hover {
                background-color: #fff;
            }
        }
    }
}
.custom-view {
    width: 100%;
    height: 100%;
    .left-text {
        margin-right: 8px;
    }
}
.in {
    display: inline-block;
    vertical-align: middle;
}
</style>
