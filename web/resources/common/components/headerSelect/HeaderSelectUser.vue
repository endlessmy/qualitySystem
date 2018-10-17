<!--
@description:新版表头筛选人，包括创建人和当前处理人，目前暂时用于需求模块和缺陷模块看效果
传入参数的要求：
        selectUserParams: {
            type: Object,
            default: function() {
                return {
                    handChange: Function, // 选择人后触发的方法
                    selectNameKey: String, // 表头的Key值
                    selectName: String, // 表头名字
                    valueIsArr: Boolean, // userId是否为数组
                    options: Array, // 表头下拉选项，不需要外部传入
                    requestList: Function // 回调方法,
                    triggerEvent: String // 回调事件， 事件的名称
                };
            }
        },
        apiFun: {
            type: Function,
            default: api.queryUserList // 默认方法，获取所有人员列表
        },
        apiParams: { // 其他的参数
            type: Object,
            default: function() {
                return {};
            }
        },
        userKey: { // 搜索框内容作为参数时的key
            type: String,
            default: 'username'
        }，
        userId: { // api返回的人员列表里的“id”的key值，如“userId、userID、uId、user_id”
            type: String,
            default: 'userId'
        },
        userName: { // 人员列表“name”的key值，当不为默认值时，需要传入来转换为标准样式
            type: String,
            default: 'userName'
        }
@author:jjq
@date:2018/6/22
@修改者：罗怀梁 2018.8.2
-->
<template>
    <div class="select-user">
        <el-popover
            ref="popoverUserSelect"
            v-model="showPopover"
            popper-class="header-popper-user"
            placement="bottom-start"
            title=""
            width="210"
            trigger="click"
            content="">
            <slot>
                <el-select
                    v-if="showPopover"
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
                        :key="item.userId"
                        :label="item.userName"
                        :value="item.userId"
                        @click.native="emitToFather(item.userName,item.userId)">
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
            {{ userParams.selectName }}
            <i class="icon-pullup-down"></i>
        </div>
    </div>
</template>

<script>
import utils, { GlobalViews } from 'common/utils/misc';
import UserList from 'common/components/UserList';
import api from 'common/utils/api';

export default {
    name: 'SelectUser',
    components: { UserList },
    props: {
        selectUserParams: {
            type: Object,
            default: function() {
                return {};
            }
        },
        apiFun: {
            type: Function,
            default: api.queryUserList
        },
        apiParams: {
            type: Object,
            default: function() {
                return {};
            }
        },
        userKey: {
            type: String,
            default: 'username'
        },
        userId: {
            type: String,
            default: 'userId'
        },
        userName: {
            type: String,
            default: 'userName'
        }
    },
    data() {
        return {
            // 搜索到的处理人列表
            userList: [],
            processUser: '',
            isTriggerChange: false,
            showPopover: false,
            userParams: this.selectUserParams
        };
    },

    methods: {
        // select选择人时触发
        updateProcessUser(item) {
            this.isTriggerChange = true;
            if (typeof item === 'undefined') {
                item = this.processUser;
                this.userParams.options = this.formatUserList(this.userList);
            }
            if (this.userParams.valueIsArr) {
                item = [item];
            }
            this.userParams.handChange(item, this.userParams);
            this.showPopover = false;

            // 解决问题：选择一次后，再次展开下拉，点击输入框，输入框消失，下拉框没有消失
            // document.querySelector('.popover-slot-select').style.display = 'none';
        },

        // 搜索处理人
        // 输入值发生变化时调用
        searchProcessUsers(query) {
            if (!utils.isEmpty(query)) {
                let allParams = { [this.userKey]: query, ...this.apiParams };
                this.apiFun(allParams).then(res => {
                    let userList = res.users || res.result;
                    this.userList = userList.map(list => {
                        let newList = { ...list };
                        newList.userId = list[this.userId];
                        newList.userName = list[this.userName];
                        return newList;
                    });
                    this.userParams.options = this.formatUserList(this.userList);
                });
            }
        },

        // 格式化人员列表数据
        formatUserList(dataList) {
            let newArr = [];
            newArr =
                dataList &&
                dataList.map(item => ({
                    value: item.userId,
                    label: item.userName,
                    key: this.userParams.selectNameKey
                }));
            return newArr;
        },

        // 解决同名选择不触发updateProcessUser()
        sameName() {
            if (!arguments[0] && !this.isTriggerChange && this.processUser) {
                this.updateProcessUser();
            }
            this.isTriggerChange = false;
        },
        // 解决缺陷先在表头搜索创建人，再打开高级弹框，创建人只显示id问题
        emitToFather(userName, userId) {
            let _event = this.selectUserParams.triggerEvent;
            if (_event) {
                let tempObj = {
                    userName: userName,
                    userId: userId
                };
                GlobalViews.$emit(_event, tempObj);
            }
        }
    }
};
</script>

<style lang='less'>
@import '../../layouts/css/themes/default.less';

.column-user {
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
