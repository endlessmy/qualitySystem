<!--
    @name: 首页 - 我创建的列表
    @desc: -
    @author: qqli
-->
<template>
    <div class="todo-box mycreated-box">
        <div class="label">
            <span class="vertical-line">我创建的</span>
            <i
                :class="{'icon-shouhui-unexpand': !tabExpand}"
                class="icon icon-shouhui"
                @click="toggleTab">
            </i>
            <transition name="fade">
                <i
                    v-if="todoLoading && hideTab"
                    class="el-icon-loading">
                </i>
            </transition>
        </div>
        <div
            v-show="tabExpand"
            :class="{hide: hideTab}"
            class="tab-box">
            <div class="empty-todo">暂无我创建的事项</div>
        </div>
        <div
            v-show="tabExpand"
            :class="{hide: !hideTab}"
            class="tab-box">
            <ul class="clearfix tab-nav">
                <li
                    v-for="(item,index) in mycreated"
                    :key="item"
                    :class="{hide: item.counts < 1}"
                    class="nav">
                    <a
                        :class="{active: activeIndex === index}"
                        href="javascript:;"
                        @click="changeTab(item.module, index)">
                        {{ item.text }}（{{ item.counts }}）
                    </a>
                </li>
            </ul>
            <div class="tab-con">
                <div
                    v-for="(item, index) in mycreated"
                    :key="item"
                    :class="{active: (activeIndex == index && item.counts > 0)}"
                    class="item">
                    <requirement
                        v-if="item.module == moduleMap.REQUIREMENT && item.counts > 0"
                        ref="requirement">
                    </requirement>
                    <defect
                        v-if="item.module == moduleMap.DEFECT && item.counts > 0"
                        ref="defect">
                    </defect>
                    <task
                        v-if="item.module == moduleMap.TASK && item.counts > 0"
                        ref="task">
                    </task>
                    <countersign
                        v-if="item.module == moduleMap.COUNTERSIGN && item.counts > 0"
                        ref="countersign">
                    </countersign>
                    <feedback
                        v-if="item.module == moduleMap.FEEDBACK && item.counts > 0"
                        ref="feedback">
                    </feedback>
                    <projectboard
                        v-if="item.module == moduleMap.PROJECTBOARD && item.counts > 0"
                        ref="projectboard">
                    </projectboard>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { COMMON_INDEX_ROUTER } from 'common/constants/const';
import { MODULE_MAP } from '@/constants/const';
const Requirement = () => import('../../../requirement/src/components/MycreatedLazy');
const Defect = () => import('../../../defect/src/components/MycreatedLazy');
const Task = () => import('../../../task/src/components/MycreatedLazy');
const Countersign = () => import('../../../countersign/src/components/MycreatedLazy');
const Feedback = () => import('../../../feedback/src/components/MycreatedLazy');
const Projectboard = () => import('../../../projectsboard/src/components/MycreatedLazy');

export default {
    name: 'MycreatedList',
    components: {
        Requirement,
        Defect,
        Task,
        Countersign,
        Feedback,
        Projectboard
    },
    props: {
        todos: Array,
        mycreated: Array
    },
    data() {
        return {
            tabExpand: true,
            activeIndex: 0, // 与数组中的index索引值保持一致
            initTab: false,
            moduleMap: MODULE_MAP
        };
    },
    computed: {
        ...mapState({
            todoLoading: ({ mycreated }) => mycreated.mycreatedLoading
        }),
        hideTab() {
            let counts = 0;
            this.mycreated.map(item => {
                if (item.counts > 0) {
                    counts = counts + 1;
                }
            });
            return counts > 0;
        }
    },
    watch: {
        mycreated: {
            handler: function(nVal, oVal) {
                this.initActive();
            },
            deep: true,
            immediate: true
        },
        $route(nRoute, oRoute) {
            if (nRoute.query.category === 'mycreated') {
                let nqc = nRoute.query.c; // c: counts
                this.$emit('updateCounts', 'mycreated', this.activeIndex, nqc);
            }
        }
    },
    methods: {
        toggleTab() {
            this.tabExpand = !this.tabExpand;
        },
        initActive() {
            let data = this.mycreated;
            if (data[this.activeIndex].counts === 0) {
                this.initTab = false;
                // 重置路由
                // 避免初始路由与待办组件内进行操作后跳转的路由相同而导致待办组件内无法监听路由的变化
                location.href = COMMON_INDEX_ROUTER;
            }

            if (this.initTab === false) {
                for (let t = 0; t < data.length - 1; t++) {
                    if (data[t].counts > 0) {
                        this.activeIndex = t;
                        this.initTab = true;
                        break;
                    }
                }
            }
        },
        changeTab(module, i) {
            this.activeIndex = i;
        }
    }
};
</script>

<style lang="less" scoped>
</style>
