<!--
    @name: 首页 - 项目列表
    @desc: 待办和我创建的组件根据数据动态显示在上或下方
    @author: qqli
-->
<template>
    <div>
        <div
            ref="currentView1"
            :is="currentView1"
            :todo="todo"
            :mycreated="mycreated"
            @updateCounts="updateCounts">
        </div>

        <div
            ref="currentView2"
            :is="currentView2"
            :todo="todo"
            :mycreated="mycreated"
            @updateCounts="updateCounts">
        </div>
    </div>
</template>

<script>
import TodoList from '@/components/TodoList';
import MycreatedList from '@/components/MycreatedList';
import { TODO } from '@/constants/constTodo';
import { MYCREATED } from '@/constants/constMycreated';
import api from '@/utils/api';

export default {
    name: 'Dynamic',
    components: { TodoList, MycreatedList },
    data() {
        return {
            // 动态组件
            // “待办”和“我创建的”事项分别是两栏
            // 如果其中一个为空，另一个不为空，则不为空的事项放上面，为空的放下面；
            // 两个都为空或两个都不为空时，待办事项放上面，我创建的事项放下面；
            // 待办和我创建的事项默认展开，可收起，收起后仅显示事项名。
            currentView1: '',
            currentView2: '',
            todo: TODO,
            mycreated: MYCREATED,
            updateStateComponent: '',
            activeIndex: ''
        };
    },
    beforeMount() {
        this.queryAllCount();
    },
    methods: {
        updateCounts(category, activeIndex, counts) {
            // 操作待我处理和我创建的数据会互相受到影响，需要重新获取
            // 我创建的暂时有6个
            this.updateStateComponent = category;
            this.activeIndex = activeIndex;
            if ([0, 1, 2, 8, 9, 13].indexOf(activeIndex) !== -1) {
                this.queryAllCount(true);
            } else {
                if (category === 'todo') this.queryAllTodoCount(true);
                if (category === 'mycreated') this.queryAllMycreatedCount(true);
            }
        },
        queryAllTodoCount(dynamicComponent = false) {
            return new Promise((resolve, reject) => {
                api.allTodoCount().then(
                    res => {
                        let result = res.result;
                        result.map((item, i) => {
                            this.$set(this.todo[i], 'counts', item.counts);
                        });
                        if (dynamicComponent) {
                            this.dynamicComponent();
                        }
                        resolve(res);
                    },
                    res => {
                        reject(res);
                    }
                );
            });
        },
        queryAllMycreatedCount(dynamicComponent = false) {
            return new Promise((resolve, reject) => {
                api.allMycreatedCount().then(
                    res => {
                        let result = res.result;
                        result.map((item, i) => {
                            this.$set(this.mycreated[i], 'counts', item.counts);
                        });
                        if (dynamicComponent) {
                            this.dynamicComponent();
                        }
                        resolve(res);
                    },
                    () => {
                        reject(res);
                    }
                );
            });
        },
        queryAllCount(isUpdateComponent = false) {
            Promise.all([this.queryAllTodoCount(), this.queryAllMycreatedCount()]).then(([p1, p2]) => {
                this.dynamicComponent(isUpdateComponent);
            });
        },
        dynamicComponent(isUpdateComponent) {
            let allTodoIsEmpty = this.checkCountIsEmpty(this.todo);
            let allMycreatedIsEmpty = this.checkCountIsEmpty(this.mycreated);
            if (allMycreatedIsEmpty || (!allTodoIsEmpty && !allMycreatedIsEmpty)) {
                this.currentView1 = TodoList;
                this.currentView2 = MycreatedList;
            } else if (!allMycreatedIsEmpty && allTodoIsEmpty) {
                this.currentView1 = MycreatedList;
                this.currentView2 = TodoList;
            }

            if (isUpdateComponent) {
                let moduleName = '';
                if (this.updateStateComponent === 'todo') {
                    moduleName = this.todo[this.activeIndex].module;
                    if (this.currentView1 === TodoList) {
                        let component = this.$refs.currentView2.$refs[moduleName][0];
                        component && component.getPageList();
                    } else {
                        let component = this.$refs.currentView1.$refs[moduleName][0];
                        component && component.getPageList();
                    }
                } else {
                    moduleName = this.mycreated[this.activeIndex].module;
                    if (this.currentView1 === TodoList) {
                        let component = this.$refs.currentView1.$refs[moduleName][0];
                        component && component.getPageList();
                    } else {
                        let component = this.$refs.currentView2.$refs[moduleName][0];
                        component && component.getPageList();
                    }
                }
            }
        },
        checkCountIsEmpty(data) {
            let count = 0;
            data.map((item, i) => {
                if (item.counts < 1) {
                    // counts 等于 0，-1, > 0的整数
                    count = count + 1;
                }
            });
            return count === data.length;
        }
    }
};
</script>

<style lang="less" scoped>
.todo-box {
    .el-icon-loading {
        position: relative;
        left: 5px;
    }
}
</style>
