<!--创建项目-->
<template>
    <div class="page-wrapper">
        <div class="first-nav">
            <a
                :href="home"
                class="nav-logo">
            </a>
            <el-popover
                ref="homeHotLink"
                popper-class="hot-link-list"
                placement="bottom"
                trigger="hover"
                @show="onShowCreatePopover">
                <a
                    v-if="isOwnEmployee"
                    :href="createRequirement"
                    target="_blank"
                    @click="handleClickPopoverCreate('业务需求')">
                    业务需求
                </a>
                <a
                    :href="createDefect"
                    target="_blank"
                    @click="handleClickPopoverCreate('缺陷')">
                    缺陷
                </a>
                <a
                    :href="createTask"
                    target="_blank"
                    @click="handleClickPopoverCreate('任务')">
                    任务
                </a>
                <a
                    :href="createFeedback"
                    target="_blank"
                    @click="handleClickPopoverCreate('用户反馈')">
                    用户反馈
                </a>
            </el-popover>
            <div
                v-if="$route.name === 'ProjectList'"
                class="quick-create">
                <a
                    v-popover:homeHotLink
                    href="javascript:;">
                    <i class="icon-tianjiahuoxinjian"></i>
                    <span>新建</span>
                </a>
            </div>

            <nav-list
                :index="0"
                @updateConcern="updateConcern">
            </nav-list>
        </div>

        <div
            id="container"
            class="container">
            <div class="container-table">
                <div class="container-row">
                    <div
                        class="container-main">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
        <help></help>
        <loading-indicator :showing="isLoading"></loading-indicator>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {
    REQUIREMENT_CREATE_ROUTE,
    DEFECT_CREATE_ROUTE,
    TASK_CREATE_ROUTE,
    FEEDBACK_CREATE_ROUTE,
    COMMON_INDEX_ROUTER
} from 'common/constants/const';
import NavList from 'common/components/Nav';
import Help from 'common/components/HelpInfo';
import utils from 'common/utils/misc';
import { GA_HOME as GaHome } from 'common/utils/ga';
import LoadingIndicator from 'common/components/LoadingIndicator';
export default {
    name: 'HomeDashboard',

    components: { NavList, Help, LoadingIndicator },

    data() {
        return {};
    },

    computed: {
        ...mapState({
            isLoading: ({ project }) => project.isLoading,
            context() {
                return window.location.host.indexOf('127.0.0.1') >= 0 ? '' : '/spms';
            },
            home() {
                return COMMON_INDEX_ROUTER;
            },
            createRequirement() {
                return REQUIREMENT_CREATE_ROUTE;
            },
            createDefect() {
                return DEFECT_CREATE_ROUTE;
            },
            createTask() {
                return TASK_CREATE_ROUTE;
            },
            createFeedback() {
                return FEEDBACK_CREATE_ROUTE;
            },
            isOwnEmployee() {
                return utils.isOwnEmployee();
            }
        })
    },
    watch: {
        $route(newVal, oldVal) {
            this.init();
        }
    },
    beforeMount() {
        this.init();
    },
    mounted() {
        // 项目列表等需要设置最小宽度
        document.getElementsByTagName('body')[0].style.minWidth = '1366px';
    },
    methods: {
        init() {
            if (!(this.$route.name === 'AppMore')) {
                this.updateConcern();
            }
        },
        // 一级菜单内关注后需要同步到常用应用
        updateConcern() {
            this.queryConcernAppList({});
        },
        onShowCreatePopover() {
            GaHome.create(this);
        },
        handleClickPopoverCreate(module) {
            GaHome.createModule(this, module);
        },
        ...mapActions(['queryConcernAppList'])
    }
};
</script>

<style lang='less' scoped>
.quick-create {
    width: 99px;
    height: 50px;
    display: inline-block;
    border-left: 1px solid #424e65;
    border-right: 1px solid #424e65;
    margin-left: 40px;
    &:hover {
        background: #424e65;
    }

    > a {
        display: block;
        width: 100%;
        height: 28px;
        margin: 12px 0 0 0;
        text-align: center;
        &:hover {
            background-color: #424e65;
        }
        i {
            margin: 0 auto;
            margin-right: 5px;
            font-size: 20px;
            line-height: 20px;
        }

        > span {
            width: 29px;
            line-height: 25px;
            font-size: 14px;
            color: #ffffff;
            box-sizing: border-box;
            cursor: pointer;
        }
    }
}
.icon-tianjiahuoxinjian:before {
    font-size: 14px;
}
</style>
