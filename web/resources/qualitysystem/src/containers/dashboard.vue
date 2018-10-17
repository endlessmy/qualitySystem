<template>
    <div class="container-row">

        <second-nav />

        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>

        <router-view v-if="!$route.meta.keepAlive" />
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SecondNav from '../components/SecondNav';
import utils from 'common/utils/misc';

export default {
    name: 'QualitySystemDashboard',

    filters: {},

    components: {
        SecondNav
    },

    mixins: [],

    data() {
        return {};
    },
    computed: {
        ...mapState({
        })
    },

    watch: {
        $route(newVal, oldVal) {
            if (newVal) {
                setTimeout(this.setActive, 50);
                setTimeout(utils.onscroll, 100);
            }
        }
    },
    beforeMount() {
        this.getUsersPrivilege();
    },
    mounted() {
        utils.bindDraggableEvent();
        utils.onscroll();
    },

    methods: {
        getUsersPrivilege() {
            this.productUserPrivilege({});
        },
        ...mapActions(['productUserPrivilege'])
    }
};
</script>

<style lang='less'>
.rightContainer {
    height: 100%;
    position: relative;

    .container-main {
        display: block;
    }
}
.el-date-editor.el-input {
    &.countersign {
        width: 100%;
    }
}
.el-textarea {
    &.sign-desc {
        textarea {
            height: 100px;
        }
    }
}
</style>
