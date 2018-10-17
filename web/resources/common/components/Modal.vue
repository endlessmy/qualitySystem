<!--公共的modal modal-->

<!--
element-ui dialog slot
title, Dialog 标题区的内容
footer, Dialog 按钮操作区的内容
—, Dialog 的内容
-->

<!--
modal slot
head, modal 标题区的内容&ndash;&gt;
body, modal 的内容
foot, modal 按钮操作区的内容
-->
<template>
    <el-dialog
        :custom-class="customClass"
        v-model="isShown"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="closeOnPressEscape"
        :size="size"
        :modal="modal"
        :show-close="showClose"
        :class="{'el-dialog--xxlarge': size === 'xxlarge','el-dialog--xlarge': size === 'xlarge','el-dialog--large':size ==='large', 'el-dialog--xsmall':size ==='xsmall'}"
        @close="close"
        @open="open">

        <span slot="title">
            <slot name="head"></slot>
        </span>

        <slot name="body"></slot>

        <span slot="footer">
            <slot name="foot"></slot>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'Dialog',
    props: {
        visible: Boolean,
        title: String,
        onClosed: Function,
        onOpen: Function,
        size: {
            default: 'small',
            type: String
        },
        closeOnPressEscape: {
            default: true,
            type: Boolean
        },
        customClass: {
            default: 'custom-dialog',
            type: String
        },
        showClose: {
            default: true,
            type: Boolean
        },
        modal: { default: true }
    },

    data() {
        return {};
    },

    computed: {
        isShown() {
            return this.visible;
        }
    },

    mounted() {},

    methods: {
        close() {
            this.$emit('onClosed');
        },
        open() {
            this.$emit('onOpen');
        }
    }
};
</script>

<style lang="less">
@import '../layouts/css/themes/default.less';

@pd: 30px;

.custom-dialog {
    &.el-dialog--xsmall {
        width: 470px;
    }
    &.el-dialog--small {
        width: 570px;
    }
    &.el-dialog--large {
        width: 670px;
    }
    &.el-dialog--xlarge {
        width: 760px;
    }
    &.el-dialog--xxlarge {
        width: 870px;
    }
    .el-dialog__header {
        position: relative;
        padding: 0px @pd;
        font-size: 16px;
        color: #333333;
        line-height: 50px;
        &:after {
            content: ' ';
            position: absolute;
            left: @pd;
            right: @pd;
            bottom: 0;
            height: 1px;
            background: #eee;
            z-index: 10;
        }

        .el-tag {
            padding: 0 10px;
        }
    }

    .el-dialog__close {
        font-size: 12px;
        color: #999999;
    }

    .el-dialog__body {
        padding: 24px @pd 0;
    }

    .el-dialog__footer {
        padding-left: @pd;
        padding-right: @pd;
        padding-bottom: @pd;
        .el-button {
            width: 80px;
            font-size: 14px;
        }
    }

    .el-form-item {
        margin-bottom: 20px;
    }

    //统一设置弹窗内 文本域的高度
    .el-textarea {
        textarea {
            height: 75px;
            min-height: 75px;
        }
    }

    //弹窗中的日期，统一显示100%
    .el-date-editor {
        &.el-input {
            width: 100%;
        }
    }

    //任务的头部会显示数据的标题
    &.task-dialog {
        .el-dialog__header {
            overflow: hidden;
            > span {
                width: 494px;
                display: block;
                float: left;
            }
        }
    }
    //限制宽度，超过显示...
    .head-long {
        display: block;
        width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    //删除，提示文字
    .danger-text {
        color: @danger;
    }
}
</style>
