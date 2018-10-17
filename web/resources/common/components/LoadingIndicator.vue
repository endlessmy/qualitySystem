<template>
    <div
        v-if="showing"
        :class="{'part-loading':partFlag}"
        class="page-loading-wrapper ">
        <div
            :class="{'part-spinner':partFlag}"
            class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingIndicator',
    props: {
        showing: {
            type: Boolean,
            default: false
        },
        // 局部loading
        partFlag: {
            default: false,
            type: Boolean
        }
    }
};
</script>

<style lang='less' scoped>
.page-loading-wrapper {
    bottom: 0;
    color: #999;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 9000;
    background-color: rgba(0, 0, 0, 0.1);
}
.part-loading {
    position: static;
}

.spinner {
    position: absolute;
    text-align: center;
    top: 95px;
    left: 0;
    width: 100%;
}
.part-spinner {
    padding-top: 10px;
    position: static;
    height: 50px;
    background: #fff;
    // bottom: 60px;
    // top: auto;
}

.spinner > div {
    width: 30px;
    height: 30px;
    background-color: rgba(31, 190, 106, 0.85);
    margin: 0 4px;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    /* Prevent first frame from flickering when animation starts */
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.spinner .bounce1 {
    animation-delay: -0.32s;
}

.spinner .bounce2 {
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
