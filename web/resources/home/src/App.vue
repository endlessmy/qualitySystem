<template>
    <router-view></router-view>
</template>

<script>
import Vue from 'vue';
import Element from 'element-ui';

Vue.use(Element);

export default {
    name: 'Root',
    components: {},
    data() {
        return {};
    },
    computed: {}
};
</script>

<style lang="less">
@import './layouts/css/page.less';
</style>
