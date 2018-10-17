<template>
    <div class="page-wrapper">
        <div class="first-nav">
            <a
                :href="home"
                class="nav-logo" />
            <h3 class="module-title">质量系统</h3>
            <nav-list :index="2" />
        </div>

        <div
            id="container"
            class="container">
            <div class="container-table">
                <router-view />
            </div>
        </div>
        <!-- <help /> -->
    </div>
</template>

<script>
import Vue from 'vue';
import Element from 'element-ui';
import { mapState, mapActions } from 'vuex';
// import LoadingIndicator from 'common/components/LoadingIndicator';
import NavList from 'common/components/Nav';
// import Help from 'common/components/HelpInfo';

Vue.use(Element);

export default {
    name: 'Root',
    components: {
        // LoadingIndicator,
        NavList
    },

    data() {
        return {};
    },
    computed: mapState({
        context() {
            return window.location.host.indexOf('127.0.0.1') >= 0 ? '' : '/spms';
        },

        home() {
            return __DEV__ ? 'http://localhost:4004/' : `${this.context}/static/home/index.html`;
        }
    }),
    beforeMount() {
        this.isProjectManager();
        this.queryProjectsList({type: 'all'});
    },

    methods: {
        ...mapActions(['isProjectManager', 'queryProjectsList'])
    }
};
</script>

<style lang="less">
@import './layouts/css/page.less';
</style>
