<!--
@name: 输入框类型的快速编辑
应用场景：指标值录入、自有人员数录入、外协人员数录入
@description: 展示或快速编辑
@author: jjq
@date: 2018/9/17
-->
<template>
    <div class="action-area">
        <div
            v-if="!editMode"
            class="mode">
            <span>
                <span
                    v-if="title !== 0 "
                    class="text">
                    {{ title || '--' }}
                </span>
                <span
                    v-if="title === 0 "
                    class="text">{{ title }}
                </span>
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
            <span class="quick-add-row">
                <div class="itens">
                    <el-tooltip
                        :class="{'is-error': inputErro.show}"
                        :content="inputErro.message"
                        :manual="true"
                        :value="inputErro.show && focus"
                        popper-class="quick-add-erro-message"
                        effect="light"
                        placement="top-start">
                        <el-input
                            v-model="quataData"
                            placeholder="请输入"
                            @keyup.enter.native="mouseDownCheck"
                            @focus="onFocus"
                            @blur="onBlur"
                            @change="onChange">
                        </el-input>
                    </el-tooltip>
                </div>
            </span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'FuncReqDate',
    props: {
        row: {
            type: Object,
            default: () => {}
        },
        rowKey: {
            type: [String, Object],
            default: () => {}
        },
        rowIdKey: {
            type: String,
            default: ''
        },
        triggerFunction: Function
    },
    data() {
        return {
            quataData: '', // 指标值
            focus: false,
            preventBlur: false,
            inputErro: {
                // 判断输入信息是否符合要求
                show: false,
                message: ''
            },
            editMode: false // 是否可以编辑
        };
    },
    computed: {
        title() {
            if (this.row[this.rowKey] !== null && this.rowKey !== 'item_data') {
                return this.rowKey && this.row ? Number(this.row[this.rowKey]).toFixed(1) : '';
            } else {
                return this.rowKey && this.row ? this.row[this.rowKey] : '';
            }
        }
    },
    mounted() {
        this.$el.parentNode.parentNode.classList.add('col-editable-inline');
    },
    methods: {
        toggleEditMode() {
            this.editMode = true;
            this.$el.click();
            this.$nextTick(() => {
                this.quataData = this.title;
                this.focus = true;
                this.$el.querySelector('input').focus();
            });
        },
        onChange(val) {
            this.valid(val);
        },
        onFocus(evt) {
            document.addEventListener('mousedown', this.mouseDownCheck, false);
        },
        onBlur(evt) {
            if (this.inputErro.show === false) {
                this.editMode = false;
                this.focus = false;
                this.inputErro.message = '';

                if (this.quataData !== this.title) {
                    this.send();
                }
            }

            document.removeEventListener('mousedown', this.mouseDownCheck, false);
        },
        valid(val) {
            let originalVal = val.toString();
            let numberVal = Number(val).toString();
            let validNumber = originalVal === numberVal;
            if (val === '') {
                this.inputErro.show = false;
            } else {
                if (this.rowKey === 'item_data') {
                    let reg = /^\d+$/g;
                    // 指标值的范围为[0,100000000]的整数
                    if (validNumber && reg.test(val) && val <= 100000000 && val >= 0) {
                        this.inputErro.show = false;
                    } else {
                        this.inputErro.show = true;
                        this.inputErro.message = '0-100000000之间的整数';
                    }
                } else {
                    // 人力的范围为[0,10000]，保留一位小数
                    let reg = /^\d+(\.\d{1})?$/g;
                    if (reg.test(val) && val <= 1000 && val >= 0) {
                        this.inputErro.show = false;
                    } else {
                        this.inputErro.show = true;
                        this.inputErro.message = '0-1000之间，最多保留一位小数';
                    }
                }
            }
        },
        mouseDownCheck(evt) {
            if (this.$el.querySelector('input')) {
                this.valid(this.quataData || '');
            } else {
                this.editMode = false;
            }
        },
        send() {
            let param = {
                update: [
                    {
                        key: this.rowKey,
                        value: this.quataData || -1
                    }
                ],
                row: this.row
            };
            if (param.update[0].value !== -1) {
                this.triggerFunction('updateDataPage', param);
            }
        }
    }
};
</script>
<style lang="less" scoped>
</style>
