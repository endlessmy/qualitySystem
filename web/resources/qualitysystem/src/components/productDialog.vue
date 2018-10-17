
<!--
@name:质量系统——生产率度量——生产率录入页弹窗
@description:页面加载时如果当前没有可录入的数据时，显示弹窗
@author:孙燕
@date:2018/9/24
-->
<template>
    <div>
        <modal
            :visible="isShowDialog"
            :show-close = "false"
            class="tip-dialog"
            @onClosed="doClose">
            <span slot="head">提示</span>
            <div
                slot="body">
                <div>暂无需要录入的数据 </div>
            </div>

            <div slot="foot">
                <el-button
                    type="primary"
                    @click="doClose">
                    确定
                </el-button>
            </div>
        </modal>
    </div>
</template>
<script>
import Modal from 'common/components/Modal';

export default {
    name: 'ProductDialog',
    components: { Modal },
    props: {
        value: Boolean
    },

    data() {
        return {};
    },
    computed: {
        isShowDialog() {
            if (this.value) {
                return this.value;
            }
        }
    },
    methods: {
        doClose() {
            this.$emit('input', false);
            this.$emit('onClose');
        }
    }
};
</script>
<style lang="less">
</style>
