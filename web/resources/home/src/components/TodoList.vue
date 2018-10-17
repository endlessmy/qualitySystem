<!--
    @name: 首页 - 待办事项列表
    @desc: -
    @author: qqli
-->
<template>
    <div class="todo-box">
        <div class="label">
            <span class="vertical-line">待办事项</span>
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
            <div class="empty-todo">恭喜，您已处理完成所有待办！</div>
        </div>
        <div
            v-show="tabExpand"
            :class="{hide: !hideTab}"
            class="tab-box">
            <ul class="clearfix tab-nav">
                <li
                    v-for="(item,index) in todo"
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
                    v-for="(item, index) in todo"
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
                    <permission
                        v-if="item.module == moduleMap.DEVELOP_WORK_ORDER && item.counts > 0"
                        biz-id="1">
                    </permission>
                    <permission
                        v-if="item.module == moduleMap.BUSINESS_WORK_ORDER && item.counts > 0"
                        biz-id="2">
                    </permission>
                    <device v-if="item.module == moduleMap.DEVICE && item.counts > 0"></device>
                    <work-order v-if="item.module == moduleMap.WORKORDER && item.counts > 0"></work-order>
                    <function v-if="item.module == moduleMap.FUNCTION && item.counts > 0"></function>
                    <countersign
                        v-if="item.module == moduleMap.COUNTERSIGN && item.counts > 0"
                        ref="countersign">
                    </countersign>
                    <feedback
                        v-if="item.module == moduleMap.FEEDBACK && item.counts > 0"
                        ref="feedback">
                    </feedback>
                    <permission-plus
                        v-if="item.module == moduleMap.DEVELOPMENT_PERMISSION && item.counts > 0"
                        module-id="01">
                    </permission-plus>
                    <permission-plus
                        v-if="item.module == moduleMap.BUSINESS_PERMISSION && item.counts > 0"
                        module-id="02">
                    </permission-plus>
                    <budget-apply v-if="item.module == moduleMap.BUDGET_APPLY && item.counts > 0"></budget-apply>
                    <projectboard
                        v-if="item.module == moduleMap.PROJECTBOARD && item.counts > 0"
                        ref="projectboard">
                    </projectboard>
                    <outsource v-if="item.module == moduleMap.OUTSOURCE && item.counts > 0"></outsource>
                    <task-board v-if="item.module == moduleMap.TASK_BOARD && item.counts > 0"></task-board>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { COMMON_INDEX_ROUTER } from 'common/constants/const';
import { MODULE_MAP } from '@/constants/const';
const Requirement = () => import('../../../requirement/src/components/OngoingLazy');
const Defect = () => import('../../../defect/src/components/OngoingLazy');
const Task = () => import('../../../task/src/components/OngoingLazy');
const Permission = () => import('../../../permission/src/components/dealComponentLazy');
const Device = () => import('../../../device/src/components/dealComponentLazy');
const workOrder = () => import('../../../workorder/src/components/OngoingLazy'); // 安管工单
const Function = () => import('../../../project/src/components/functionRequirement/OngoingLazy');
const Countersign = () => import('../../../countersign/src/components/OngoingLazy');
const Feedback = () => import('../../../feedback/src/components/OngoingLazy');
const PermissionPlus = () => import('../../../permissionplus/src/components/OngoingLazy'); // 权限Plus（研发&业务）
const BudgetApply = () => import('../../../budgetApply/src/components/OngoingLazy'); // 预算申报
const Projectboard = () => import('../../../projectsboard/src/components/OngoingLazy');
const Outsource = () => import('../../../outsource/src/components/OngoingLazy'); // 外协管理
const TaskBoard = () => import('../../../project/src/components/taskBoard/OngoingLazy'); // 任务看板

export default {
    name: 'TodoList',

    components: {
        Requirement,
        Defect,
        Task,
        Permission,
        Device,
        workOrder,
        Function,
        Countersign,
        Feedback,
        PermissionPlus,
        BudgetApply,
        Projectboard,
        Outsource,
        TaskBoard
    },

    props: {
        todo: Array,
        mycreateds: Array
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
            todoLoading: ({ todo }) => todo.todoLoading
        }),
        hideTab() {
            let counts = 0;
            this.todo.map(item => {
                if (item.counts > 0) {
                    counts = counts + 1;
                }
            });
            return counts > 0;
        }
    },
    watch: {
        todo: {
            handler: function(nVal, oVal) {
                this.initActive();
            },
            deep: true,
            immediate: true
        },
        $route(nRoute, oRoute) {
            if (nRoute.query.category === 'todo') {
                let nqc = nRoute.query.c; // c: counts
                this.$emit('updateCounts', 'todo', this.activeIndex, nqc);
            }
        }
    },
    methods: {
        toggleTab() {
            this.tabExpand = !this.tabExpand;
        },
        initActive() {
            let data = this.todo;
            if (data[this.activeIndex].counts === 0) {
                this.initTab = false;
                // 重置路由
                // 避免初始路由与待办组件内进行操作后跳转的路由相同而导致待办组件内无法监听路由的变化
                location.href = COMMON_INDEX_ROUTER;
            }

            if (this.initTab === false) {
                for (let t = 0; t < data.length; t++) {
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
