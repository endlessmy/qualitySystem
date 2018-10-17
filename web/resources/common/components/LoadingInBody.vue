<!--
body加载组件
@author 罗怀梁
@createTime 2018/5/28
@describe
props：
    showing  是否出现
@example
-->
<template>
    <div
        v-if="showing"
        :class="{ shade: shadeShow }"
        class="spinner">
        <div>
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingInBody',
    props: {
        showing: Boolean
    },
    data() {
        return {
            interval: null,
            shadeShow: false
        };
    },
    watch: {
        showing: function(newValue) {
            if (newValue) {
                this.interval = setInterval(() => (this.shadeShow = true), 2000);
            } else {
                clearInterval(this.interval);
                this.shadeShow = false;
            }
        }
    }
};
</script>

<style lang='less' type="text/less" scoped>
.spinner {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3000;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: not-allowed;
}
.shade {
    background-color: rgba(0, 0, 0, 0.3);
}
.shade > div {
    & > div {
        width: 20px;
        height: 20px;
        background-color: rgba(32, 160, 255, 0.85);
        margin: 0 10px;
        border-radius: 100%;
        display: inline-block;
        animation: bouncedelay 1.4s infinite ease-in-out;
        animation-fill-mode: both;
    }
}
.shade .bounce1 {
    animation-delay: -0.32s;
}
.shade .bounce2 {
    animation-delay: -0.16s;
}
@keyframes bouncedelay {
    0%,
    80%,
    100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}
</style>
