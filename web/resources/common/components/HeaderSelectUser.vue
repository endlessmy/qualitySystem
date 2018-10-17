<template>
    <div class="select-user">
        <el-popover
            ref="popoverUserSelect"
            v-model="showPopover"
            popper-class="header-popper-user"
            placement="bottom"
            title=""
            width="210"
            trigger="click"
            content="">
            <slot>
                <el-select
                    ref="popoverSlotSelect"
                    v-model="processUser"
                    :remote-method="searchProcessUsers"
                    class="select"
                    placeholder="请输入搜索"
                    filterable
                    remote
                    popper-class="popover-slot-select"
                    @change="updateProcessUser"
                    @visible-change="sameName">
                    <el-option
                        v-for="item in userList"
                        :key="item.userId || item.uid"
                        :label="item.userName || item.username"
                        :value="item.userId || item.uid">
                        <user-list
                            :user="item"
                            size="small"></user-list>
                    </el-option>
                </el-select>
            </slot>
        </el-popover>
        <div
            v-popover:popoverUserSelect
            ref="headSelectLink"
            class="header-select-link">
            {{ selectName }}
            <i class="icon-pullup-down"></i>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import utils from 'common/utils/misc';
import UserList from 'common/components/UserList';

export default {
    name: 'SelectUser',
    components: { UserList },
    props: {
        handChange: Function,
        selectNameKey: String,
        selectName: String,
        valueIsArr: Boolean,
        isChangeAction: Boolean,
        projectId: String,
        feedFlag: {
            // 反馈专用
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            // 搜索到的处理人列表
            userList: [],
            processUser: '',
            isTriggerChange: false,
            showPopover: false
        };
    },

    methods: {
        // select选择人时触发
        updateProcessUser(item) {
            this.isTriggerChange = true;
            if (typeof item === 'undefined') {
                item = this.processUser;
            }
            if (this.valueIsArr) {
                item = [item];
            }
            this.handChange(item, this.selectNameKey);
            this.showPopover = false;
        },

        // 调用接口
        searchUsers(query) {
            if (this.isChangeAction) {
                return this.queryProjectMemberOnline({
                    projectId: this.projectId,
                    keyword: query
                });
            } else if (this.feedFlag) {
                // 用户反馈模块导入了文档的action,会调用文档的，重置回反馈的
                return this.$store.dispatch('queryUserListByName', {
                    username: query
                });
            } else {
                return this.queryUserList({ username: query });
            }
        },

        // 搜索处理人
        // 输入值发生变化时调用
        searchProcessUsers(query) {
            if (!utils.isEmpty(query)) {
                let self = this;
                this.searchUsers(query).then(res => {
                    self.userList = res.users || res.result || [];
                });
            }
        },

        // 解决同名选择不触发updateProcessUser()
        sameName() {
            if (!arguments[0] && !this.isTriggerChange && this.processUser) {
                this.updateProcessUser();
            }
            this.isTriggerChange = false;
        },

        ...mapActions(['queryUserList', 'queryProjectMemberOnline'])
    }
};
</script>

<style lang='less'>
@import '../layouts/css/themes/default.less';

.column-user {
    .cell {
        position: relative;
    }
    .select-user {
        position: relative;
    }

    .select {
        position: absolute;
        left: 0;
        top: 10px;
    }
}

.el-table .header-select-link {
    display: inline-block;
    cursor: pointer;

    .icon-pullup-down {
        color: @text-color15;
        font-size: 12px;
        display: inline-block;
        transform: scale(0.5);
        margin-top: -2px;
    }
}

.el-select-dropdown.popover-slot-select {
    margin-top: 0;
    border-top: 0;
}
</style>
