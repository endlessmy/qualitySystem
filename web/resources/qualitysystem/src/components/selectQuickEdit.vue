<!--
@name: 选择类型的快速编辑
应用场景：是否纳入统计的快速编辑
@description: 展示或编辑
@author: jjq
@date: 2018/9/18
-->
<template>
    <div class="action-area">
        <div
            v-if="!editMode"
            class="mode">
            <span class="seletct-text">
                {{ title || '--' }}
            </span>
            <span
                v-if="true"
                class="icon"
                @click.stop="toggleEditMode">
                <i class="icon-edit2"></i>
            </span>
        </div>
        <div
            v-else
            class="mode">
            <el-select
                v-model="selectedValue"
                @change="triggerChange">
                <el-option
                    v-for="item in optionArray"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
    name: 'FuncReqLevel',
    props: {
        optionArray: {
            type: Array,
            default: () => []
        },
        row: {
            type: Object,
            default: () => {}
        },
        rowKey: {
            type: [String, Object],
            default: () => {}
        },
        projectId: {
            type: String,
            default: ''
        },

        mapData: Array,
        triggerFunction: Function
    },
    data() {
        return {
            editMode: false,
            selectedValue: ''
        };
    },
    computed: {
        title() {
            if (this.rowKey && this.row) {
                let data = this.row[this.rowKey];
                let item = this.optionArray.filter(item => {
                    if (item.value === data) return item;
                });

                return item.length > 0 ? item[0].label : '';
            }
            return '';
        },
        ...mapState({})
    },

    mounted() {
        this.$el.parentNode.parentNode.classList.add('col-editable-inline');
    },
    methods: {
        toggleEditMode() {
            this.editMode = true;
            this.$el.click();
            this.selectedValue = this.row[this.rowKey];
            document.addEventListener('click', this.exitEdit, false);
            this.$nextTick(() => {
                this.$el.querySelector('input').focus();
            });
        },
        exitEdit(evt) {
            const findNodes = (node, level) => {
                let nodes = [];
                let _level = 0;
                function addNode(_node) {
                    nodes.push(_node);
                    _level++;
                    if (level > _level && _node.parentNode) {
                        addNode(_node.parentNode);
                    }
                }
                addNode(node);
                return nodes;
            };
            let nodes = findNodes(evt.target, 3);
            if (nodes.indexOf(this.$el.querySelector('input')) === -1) {
                this.editMode = false;
                document.removeEventListener('click', this.exitEdit, false);
            }
        },
        triggerChange(val) {
            this.editMode = false;
            let param = {
                update: [
                    {
                        key: this.rowKey,
                        value: this.selectedValue
                    }
                ],
                row: this.row
            };
            this.triggerFunction('updateDataPage', param);
            document.removeEventListener('click', this.exitEdit, false);
        }
    }
};
</script>
<style lang="less" scoped>
</style>
