<!--
@name: 首页忘记密码公共部分
@author: dengxue
@date: 2018/06/06
-->
<template>
    <div class="login-container">
        <div class="login-header">
            <a
                href="javascript:void(0)"
                class="logo">
                <img
                    src="../layouts/images/login/logo.png"
                    @click="$router.push('/login')">
            </a>
        </div>
        <div
            ref="loginBody"
            class="login-body">
            <router-view></router-view>
            <span
                :style="bannerStyle"
                class="banner-tiny">
            </span>
        </div>
        <div class="login-footer">Copyright © 2018 咪咕TSG成都研发事业部</div>
    </div>
</template>
<script>
import _debounce from 'lodash.debounce';

export default {
    name: 'LoginDashboard',
    data() {
        return {
            bannerStyle: {}
        };
    },
    mounted() {
        // 登录页和修改密码页面不需要设置最小宽度
        document.getElementsByTagName('body')[0].style.minWidth = 'none';

        this.setSize();

        window.onresize = _debounce(this.setSize, 100);
    },

    methods: {
        setSize() {
            let loginBodyH = this.$refs.loginBody.offsetHeight;
            // 设计稿宽度：1440， 内容宽度1180
            // 去掉头部和脚部的高度：710，主题图上外边距：99
            // 主题小图的 宽度 242，高度：220

            let tinyW = loginBodyH * 220 / 710;
            let tinyH = 220 * tinyW / 242;

            // 设置主题小图的样式
            this.bannerStyle = {
                width: `${parseInt(tinyW)}px`,
                height: `${parseInt(tinyH)}px`
            };
        }
    }
};
</script>

<style lang="less" >
@import '../layouts/css/login.less';
@import '../layouts/css/password.less';
</style>
