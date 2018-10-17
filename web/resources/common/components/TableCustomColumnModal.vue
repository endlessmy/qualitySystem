<!--
	@ywc - 12/2017
	*showModal - 控制显示窗口
	*data - 表单自定义字段数据
	*required - 必选字段属性
	*selected - 已选择字段
-->
<template>
    <modal
        :visible="isShown"
        size="xlarge"
        class="table-custom-column-modal"
        @onClosed="doClose"
        @onOpen="doOpen(selected)">
        <span slot="head">
            配置列表字段
            <span
                v-if="funcPage || showReset"
                class="reset-field"
                @click="resetField">恢复默认字段</span>
        </span>
        <div
            slot="body"
            class="content">
            <div class="left">
                <div class="title">
                    <span class="border"></span>
                    <span>备选字段</span>
                    <span
                        v-if="funcPage"
                        class="check-tip">（可勾选10个，已勾选{{ selectedItem.length }}个）</span>
                </div>
                <div class="subcontent">
                    <el-checkbox-group
                        v-model="selectedItem"
                        @change="seletedChange">
                        <div class="subtitle">
                            基本信息
                        </div>
                        <el-checkbox
                            v-for="item in data"
                            v-if="item.field_type === '01' && filterCheck(item)"
                            :label="item"
                            :key="item.field_name"
                            :disabled="requiredCheck(item)"
                            class="item">
                            {{ item.field_remark }}
                        </el-checkbox>
                        <div
                            v-if="seperatorVisibility"
                            class="seperator"></div>
                        <div
                            v-if="seperatorVisibility"
                            class="subtitle">
                            排期信息
                        </div>
                        <el-checkbox
                            v-for="item in data"
                            v-if="item.field_type === '02' && filterCheck(item)"
                            :label="item"
                            :key="item.field_name"
                            :disabled="requiredCheck(item)"
                            class="item">
                            {{ item.field_remark }}
                        </el-checkbox>

                    </el-checkbox-group>
                </div>
            </div>
            <div class="right">
                <div class="title">
                    <span class="border"></span>
                    <span>已选字段</span>
                </div>
                <div class="subcontent">
                    <div class="tip">
                        提示：可通过拖拽调整表头顺序
                    </div>
                    <ul>
                        <li
                            v-for="(item, index) in selectedItem"
                            v-if="index === 0"
                            :key="index"
                            class="normal-item">
                            <span class="left">
                                {{ item.field_remark }}
                            </span>
                        </li>
                        <draggable
                            v-model="selectedItem"
                            :options="dragOption">
                            <li
                                v-for="(item, index) in selectedItem"
                                v-if="index > 0"
                                :key="index"
                                class="normal-item draggable-item">
                                <span class="left">
                                    {{ item.field_remark }}
                                </span>
                                <span
                                    v-if="!requiredCheck(item)"
                                    class="right">
                                    <i
                                        class="icon-quxiao draggable-ignore"
                                        @click="removeItem(item)"></i>
                                </span>
                            </li>
                        </draggable>
                    </ul>
                </div>
            </div>
        </div>
        <div slot="foot">
            <el-button
                slot="foot"
                type="primary"
                @click="doClose(true)">确定</el-button>
        </div>
    </modal>
</template>

<script>
import Modal from 'common/components/Modal.vue';
import draggable from 'vuedraggable';

export default {
    name: 'TableCustomColumnModal',
    components: {
        Modal,
        draggable
    },
    props: {
        showModal: Boolean,
        data: Array,
        selected: Array,
        required: {
            type: Array,
            default: () => []
        },
        filterItens: {
            type: Array,
            default: () => []
        },
        funcPage: {
            type: Boolean,
            default: false
        },
        showReset: {
            type: Boolean,
            default: false
        },
        defaultColumnSetting: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            dragOption: {
                draggable: '.draggable-item',
                filter: '.draggable-ignore',
                ghostClass: 'draggable-ghost'
            },
            selectedItem: []
        };
    },
    computed: {
        isShown() {
            return this.showModal ? this.showModal : false;
        },
        seperatorVisibility() {
            // 检查是否有排期信息
            let result = false;
            if (this.data) {
                this.data.map(item => {
                    if (item.field_type === '02') {
                        result = true;
                    }
                });
            }

            return result;
        }
    },
    methods: {
        seletedChange(valArr) {
            // 标题包含在10个里面
            if (this.funcPage && valArr.length > 10) {
                valArr.splice(10, 1);
            }
        },
        resetField() {
            this.doOpen(this.defaultColumnSetting);
        },
        filterCheck(item) {
            return !this.filterItens.some(_item => item.field_name === _item);
        },
        requiredCheck(item) {
            // 检查必选项
            if (!this.required) {
                return false;
            }
            // return this.required.includes(item.field_name)  // 这个ie浏览器不支持会报错
            return this.required.indexOf(item.field_name) > -1;
        },
        doOpen(selected) {
            this.selectedItem = [];
            let selectedItem = [];
            // 将已选择的对象的字段同步到选择框的对象，同步勾选的对象问题
            const additem = fieldName => {
                for (var i = 0; i < this.data.length; i++) {
                    if (this.data[i].field_name === fieldName) {
                        selectedItem.push(this.data[i]);
                    }
                }
            };
            for (var i = 0; i < selected.length; i++) {
                additem(selected[i].field_name);
            }

            // for (var i = 0; i < this.selected.length; i++) {
            //     additem(this.selected[i].field_name);
            // }

            // 重新排序将标题排序为第一项
            this.selectedItem = selectedItem.filter(item => item.field_remark === '标题');

            // 继续添加其他字段
            for (let i = 0; i < selectedItem.length; i++) {
                if (selectedItem[i].field_remark !== '标题') {
                    this.selectedItem.push(selectedItem[i]);
                }
            }
        },
        doClose(save) {
            let item = save ? this.selectedItem : false;
            this.$emit('columnSettingModalClose', item);
        },
        removeItem(item) {
            this.selectedItem = this.selectedItem.filter(i => i.field_name !== item.field_name);
        }
    }
};
</script>

<style lang="less" scoped>
.content {
    display: table;
    padding-bottom: 20px;
    > .left,
    > .right {
        display: table-cell;
        float: none;
    }
    .title {
        color: #333333;
        span.border {
            width: 2px;
            height: 15px;
            margin-right: 5px;
            display: inline-block;
            background: #539eff;
            position: relative;
            top: 3px;
        }
        .check-tip {
            color: #666;
        }
    }
    .subcontent {
        margin-top: 20px;
        background: #ffffff;
        border: 1px solid #dcdfe5;
        border-radius: 2px;
        padding: 20px;
        height: 350px;
        overflow-x: auto;
        .subtitle {
            padding-bottom: 20px;
        }
    }
    .seperator {
        display: block;
        width: 100%;
        height: 1px;
        background: #f3f3f3;
        margin-bottom: 20px;
    }
    > .left {
        width: 400px;
        padding-right: 20px;
        .item {
            width: 30%;
            margin-left: 0px;
            margin-right: 10px;
            margin-bottom: 20px;
        }
    }
    > .right {
        width: 300px;
        padding-left: 20px;
        .tip {
            font-size: 12px;
            color: #666666;
            padding-bottom: 15px;
            border-bottom: 1px solid #f2f2f2;
        }
        .normal-item {
            display: table;
            width: 100%;
            font-size: 12px;
            padding: 15px 10px;
            color: #333333;
            border-bottom: 1px solid #f2f2f2;
            cursor: pointer;
            &.draggable-item:hover {
                background: #fbfbfb;
            }
        }
        .left,
        .right {
            display: table-cell;
            vertical-align: middle;
            float: none;
        }
        .right {
            text-align: right;
        }
        .icon-quxiao {
            color: #666;
            font-size: 18px;
        }
    }
    .draggable-ghost {
        color: #fff;
        background: #e6e6e6;
    }
}
</style>
<style lang="less">
.table-custom-column-modal {
    .reset-field {
        font-size: 12px;
        color: #539eff;
        padding-left: 10px;
        cursor: pointer;
    }
    .el-checkbox__label {
        font-size: 12px;
        padding-left: 3px;
    }
    .el-checkbox__inner {
        width: 14px;
        height: 14px;
    }
    .el-checkbox__inner::after {
        height: 7px;
        width: 3px;
    }
}
</style>
