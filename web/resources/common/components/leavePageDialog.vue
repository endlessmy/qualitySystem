<template>
    <modal
        :visible="isShown"
        size="xsmall"
        @onClosed="doClose">
        <span slot="head">
            提示
        </span>
        <p
            slot="body"
            class="color666">
            <i class="icon icon-warning"></i>是否暂存已填写的信息？
        </p>
        <span
            slot="foot"
            class="dialog-footer">
            <el-button
                type="primary"
                @click="confirmHandler(3)">是</el-button>
            <el-button @click="confirmHandler(2)">否</el-button>
            <!-- <el-button @click="confirmHandler(1)">留在本页</el-button> -->
        </span>
    </modal>
</template>
<script>
import Modal from 'common/components/Modal';
export default {
    name: 'LeavePageDialog',
    components: { Modal },
    props: {
        value: Boolean
    },

    data() {
        return {
            val: null
        };
    },

    computed: {
        isShown() {
            return this.value;
        }
    },

    beforeMount() {},
    methods: {
        doClose() {
            this.removeMenuActive();
            if (!this.val) {
                this.$emit('changeLeaveType', 0);
            }
            this.val = null;
            this.$emit('input', false);
        },
        confirmHandler(val) {
            this.val = val;
            this.$emit('changeLeaveType', val);
            this.$emit('input', false);
        },
        removeMenuActive() {
            let items = document.querySelectorAll('.el-menu-item');
            try {
                let len = items.length;
                for (let i = 0; i < len; i++) {
                    if (items[i].classList.contains('is-active')) {
                        items[i].classList.remove('is-active');
                        return;
                    }
                }
            } catch (e) {}
        }
    }
};
</script>

<style lang='less' scoped>
.dialog-footer {
    margin-top: 30px;
    display: block;
}
.icon-warning {
    font-size: 24px;
    color: #f7ba2a;
    vertical-align: sub;
    margin-right: 10px;
    transform: translateY(1px);
    display: inline-block;
}
</style>
