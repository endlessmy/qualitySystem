<!--
@name: 首页设置密码成功
@author: dengxue
@date: 2018/06/06
-->
<template>
    <div class="set-pwd-success center-section">
        <div class="sucess-msg">
            <div :class="(isLogined ? 'ok-circle-login' : 'ok-circle')">
                <i class="icon icon-shangchuanchenggong"></i>
            </div>
            <div class="ok-text">密码设置成功！</div>
            <div class="ok-then">{{ countDown }}s后，自动跳转到{{ hrefPage }}</div>
            <div :class="(isLogined ? 'to-index' : 'to-login')">
                <span @click="jumpTo">马上去{{ isLogined ? '首页' : '登录' }}
                    <span class="pl4">>></span>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SetPwdSucess',
    props: {
        isLogined: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            countDown: 3
        };
    },
    computed: {
        hrefPage() {
            return this.isLogined ? '首页' : '登录页面';
        }
    },
    mounted() {
        this.countTimer();
    },
    methods: {
        countTimer() {
            let timer = setInterval(() => {
                this.countDown--;
                if (this.countDown <= 0) {
                    clearInterval(timer);
                    this.jumpTo();
                }
            }, 1000);
        },
        jumpTo() {
            let routerName = this.isLogined ? 'ProjectList' : 'Login';
            this.$router.push({ name: routerName });
        }
    }
};
</script>
