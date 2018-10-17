<template>
    <div class="nav-right-wrap">
        <el-popover
            ref="popover-applist"
            v-model="showAppPopover"
            placement="bottom"
            popper-class="popover-applist"
            trigger="hover"
            @show="setUrlToken(true)"
            @hide="closeAppPopover">
            <ul class="nav-list">
                <div class="nav-list-warp">
                    <li
                        v-for="app in appTypes.nineApp"
                        :key="app">
                        <span
                            class="menu-group"
                            @click="appUrl(app, projectList, afterGoApp)">
                            <a
                                :class="app.background"
                                class="menu-icon">
                                <i :class="app.icon"></i>
                            </a>
                            <a class="menu-text">{{ app.remark }}</a>
                        </span>
                        <a
                            href="javascript:;"
                            class="menu-shoucang"
                            @click="addOrRemoveStar(app)">
                            <i :class="starClass(app)"></i>
                        </a>
                    </li>
                </div>
                <a
                    :href="appMoreHref"
                    class="nav-list-more"
                    target="_blank"
                    @click="clickViewMoreApp">
                    查看全部应用
                </a>
            </ul>
        </el-popover>
        <a
            v-popover:popover-applist
            v-if="!isHideAppPopover"
            class="nav-menu app-manage-wrap">
            <i class="icon icon-yingyong"></i>
            <a
                :href="appMoreHref"
                class="label"
                style="color:#fff;"
                target="_blank"
                @click="clickViewMoreApp">
                应用
            </a>
        </a>

        <el-popover
            ref="user-search"
            popper-class="popover-userlist"
            placement="bottom"
            trigger="click"
            @show="onShowSearchUserPopover">
            <div class="content-warpper">
                <el-input
                    v-model="userSearchKey"
                    placeholder="输入姓名、邮箱等查找人员"
                    icon="search"
                    @change="searchUser">
                </el-input>
            </div>
            <div class="search-result">
                <div
                    v-if="userSearchList.length > 0"
                    class="title">
                    搜索结果
                </div>
                <div
                    v-if="userSearchKey && !userSearchLoading && userSearchList.length === 0"
                    class="title">
                    没有找到相应人员
                </div>
                <div
                    v-if="userSearchList.length > 0"
                    class="result">
                    <ul>
                        <li
                            v-for="(item, key) in userSearchList"
                            :key="key">
                            <el-popover
                                placement="left"
                                trigger="hover"
                                popper-class="user-detail-card">
                                <div
                                    v-if="item.companyName"
                                    class="detail-info">
                                    {{ item.companyName }}
                                </div>
                                <div class="detail-info">
                                    <span>姓名</span>{{ item.username || '--' }}
                                </div>
                                <div class="detail-info">
                                    <span>帐号</span>{{ item.username_py || '--' }}
                                </div>
                                <div class="detail-info">
                                    <span>部门</span>{{ item.departmentName || '--' }}
                                </div>
                                <div class="detail-info">
                                    <span>电话</span>{{ item.tel || '--' }}
                                </div>
                                <div class="detail-info">
                                    <span>邮箱</span>{{ item.email || '--' }}
                                </div>
                                <div
                                    slot="reference"
                                    class="user-list-item">
                                    <user-list :user="item"></user-list>
                                </div>
                            </el-popover>
                        </li>
                    </ul>
                </div>
            </div>
        </el-popover>
        <a
            v-popover:user-search
            class="nav-menu app-user-search"
            title="人员查找">
            <i class="icon icon-renyuanchazhao"></i>
        </a>

        <el-popover
            ref="popover-about-user"
            :visible-arrow="false"
            v-model="showLoginData"
            placement="bottom"
            popper-class="popover-about-user"
            trigger="click"
            @show="onShowAboutUser"
            @hide="onHideAboutUser">
            <div class="about-user">
                <div class="name-line">
                    <h2 class="name">
                        {{ user.name }}<span v-if="user.nickName">({{ user.nickName }})</span>
                    </h2>
                    <!-- <a
                        :href="modifyPwdHref"
                        class="modify-pwd"
                        @click = "modifyPwd">修改密码</a> -->
                </div>
                <div
                    v-for="item in user.list"
                    :key="item.value"
                    class="list">
                    <span class="label">{{ item.label }}</span>：{{ item.value }}
                </div>
                <div
                    class="logout"
                    @click="logout">退出登录</div>
            </div>
        </el-popover>
        <a
            v-popover:popover-about-user
            class="nav-menu app-user-info"
            href="javascript:;">
            <span
                :class="{'popver-show' :aboutUserPopoverDisplay}"
                class="label">{{ user.name }}<i class="icon-pullup-down"></i></span>
        </a>

        <no-project-modal
            :data="app"
            v-model="noProjectModalVisible">
        </no-project-modal>
    </div>
</template>

<script>
import apiHome from '../../home/src/utils/api';
import api from 'common/utils/api';
import { COMMON_LOGIN_ROUTER } from '../constants/const';
import UserList from 'common/components/UserList';
import MessageMixins from 'common/mixins/message';
import AppMixins from 'common/mixins/app';
import NoProjectModal from 'common/components/NoProjectDialog';
import { GA_FIRST_NAV as GaFirstNav } from 'common/utils/ga';
import utils from 'common/utils/misc';
export default {
    name: 'NavList',
    components: { UserList, NoProjectModal },
    mixins: [MessageMixins, AppMixins],
    props: {
        index: Number
    },
    data() {
        return {
            user: {}, // 存储用户信息
            showLoginData: false,
            showAppPopover: false,
            userToken: '', // 用户的token
            userSearchKey: '',
            userSearchList: [],
            userSearchLoading: false,
            isHideAppPopover: false, // 是否显示'应用'菜单
            moreLists: [], // 应用的分类
            staredLength: 0,
            appTypes: {
                nineApp: [], // 应用前九个应用
                thirdPartyApp: [], // 第三方应用(改成其他)
                business: [], // 业务类
                research: [] // 研发类
            },
            aboutUserPopoverDisplay: false,
            projectList: [],
            noProjectModalVisible: false,
            app: {}
        };
    },
    computed: {
        appMoreHref() {
            if (__DEV__) {
                return 'http://localhost:4004/#/home/appMore';
            } else {
                return '/spms/static/home/index.html#/home/appMore';
            }
        },
        modifyPwdHref() {
            if (__DEV__) {
                return 'http://localhost:4004/#/home/modifyPassword';
            } else {
                return '/spms/static/home/index.html#/home/modifyPassword';
            }
        }
    },
    watch: {
        $route(val, oldVal) {
            if (val.path.indexOf('appMore') > 0) {
                this.isHideAppPopover = true;
            } else {
                this.isHideAppPopover = false;
            }
        }
    },

    beforeMount() {
        if (!localStorage.userLoginData) return false;
        let user = utils.getLoginUserInfo();
        if (user) {
            this.user = {
                name: user.userName,
                nickName: user.userNickName,
                list: [
                    { label: '账号', value: user.userPy || '--' },
                    { label: '公司', value: user.userCompany || '--' },
                    { label: '部门', value: user.userDepartment || '--' },
                    { label: '邮箱', value: user.userMail || '--' },
                    { label: '电话', value: user.userTel || '--' }
                ]
            };
        }
    },

    mounted() {
        this.queryProjectListByUserId().then(res => {
            if (this.$route.fullPath.indexOf('appMore') > 0) {
                this.isHideAppPopover = true;
            } else {
                this.queryConcernAppListFunc();
            }
            // 初始化token
            this.setUrlToken(false);
        });
    },
    methods: {
        modifyPwd() {
            // 关掉信息pop
            this.showLoginData = false;
        },
        // 查询用户所在项目列表
        queryProjectListByUserId() {
            return api
                .queryUserProjectList({
                    userId: utils.getLoginUserInfo('userId')
                })
                .then(res => {
                    this.projectList = res.projects;
                });
        },
        // 查询应用列表
        queryConcernAppListFunc() {
            // 没有用action是因为在别的模块如果没有这个action就会报错
            apiHome.queryConcernAppList({}).then(res => {
                this.staredLength = 0;
                this.appTypes.nineApp = res.result;
                res.result.map(item => {
                    if (item.interest_flag === 1) this.staredLength += 1;
                });
            });
        },

        // 点击app 跳转后执行的函数
        afterGoApp() {
            this.closeAppPopover();
        },

        clickViewMoreApp() {
            GaFirstNav.app(this, '查看更多');
            this.closeAppPopover();
        },
        // 显示与收藏的class的返回
        starClass(app) {
            return app.interest_flag === 1 ? 'icon-shoucang-active' : 'icon-shoucang';
        },
        onShowSearchUserPopover() {
            GaFirstNav.searchUser(this);
        },

        searchUser(_keyword) {
            if (!_keyword) {
                this.userSearchList = [];
                return false;
            }
            this.userSearchLoading = true;
            api.querySystemUserList({ keyword: _keyword }).then(res => {
                this.userSearchList = res.result;
                this.userSearchLoading = false;
            });
        },
        setUrlToken(flag) {
            if (this.isHideAppPopover) {
                this.closeAppPopover();
            }
            apiHome
                .getUserToken({
                    userId: utils.getLoginUserInfo('userId'),
                    singleton: true,
                    sessionId: utils.getLoginUserInfo('sessionId')
                })
                .then(res => {
                    this.userToken = res.result;
                });
        },
        onShowAboutUser() {
            this.aboutUserPopoverDisplay = true;
        },
        onHideAboutUser() {
            this.aboutUserPopoverDisplay = false;
        },
        logout() {
            apiHome.userLogout().then(res => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = COMMON_LOGIN_ROUTER;
            });
        },
        addOrRemoveStar(app) {
            let questCompleted = true;
            // interest_flag 1: 关注, 0: 未关注
            if (this.staredLength > 5 && app.interest_flag === 0) {
                this.showWarningMsg('常用应用最多为6个');
            } else {
                if (questCompleted) {
                    questCompleted = false;
                    apiHome
                        .modifyUserFavoriteAppService({
                            service_id: app.service_id,
                            interest_flag: app.interest_flag ? 0 : 1
                        })
                        .then(
                            () => {
                                questCompleted = true;
                                this.queryConcernAppListFunc();
                                this.$emit('updateConcern');
                            },
                            () => {
                                questCompleted = true;
                            }
                        );
                }
            }
        },
        closeAppPopover() {
            this.showAppPopover = false;
        }
    }
};
</script>

<style lang="less" scoped>
.el-loading-mask {
    z-index: 100;
}
.nav-right-wrap {
    float: right;
    height: 100%;
    display: table;
    .system-setting {
        float: left;
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        color: #fff;
        box-sizing: border-box;
        i {
            display: inline-block;
            margin: 0 10px 0 0;
        }
        &:hover,
        &.active {
            background: #424e65;
        }
    }
    .logout {
        float: left;
        height: 50px;
        box-shadow: -1px 0 0 0 #424e65;
        box-sizing: border-box;
        padding-left: 20px;
        padding-right: 20px;
        line-height: 50px;
        img {
            width: 18px;
            height: auto;
            vertical-align: middle;
            margin-right: 6px;
        }
        &:hover {
            background: #424e65;
        }
        .user-name {
            vertical-align: middle;
            color: #fff;
        }
    }
}

.nav-menu {
    position: relative;
    background: #334054;
    box-shadow: -1px 0 0 0 #424e65;
    padding-left: 20px;
    padding-right: 20px;
    height: 100%;
    display: table-cell;
    vertical-align: middle;
    color: #fff;
    &:hover {
        background: #424e65;
    }
    .icon,
    .label {
        display: inline-block;
        vertical-align: middle;
    }
    .icon {
        margin-top: 3px;
    }
    .label {
        position: relative;
        top: 2px;
    }
}
.app-user-info {
    [class^='icon-'] {
        font-size: 12px;
        display: inline-block;
        transform: scale(0.5);
        transition: all 0.2s;
    }
    .popver-show {
        [class^='icon-'] {
            transform: scale(0.5) rotate(180deg);
        }
    }
}
</style>

<style lang="less">
.el-popover.popover-about-user {
    width: 260px;
    padding: 0;
    margin-top: 5px !important;
    .about-user {
        color: #333;
        font-size: 14px;
        .name-line {
            position: relative;
            padding-left: 20px;
            margin-top: 26px;
            margin-bottom: 9px;
            font-size: 14px;
            h2 {
                display: inline-block;
                font-size: 14px;
            }
            .modify-pwd {
                position: absolute;
                right: 16px;
                color: #666;
                cursor: pointer;
            }
        }

        .list {
            margin: 9px 0;
            padding-left: 20px;
            .label {
                color: #666;
            }
        }

        .logout {
            margin-top: 26px;
            padding: 11px 0;
            text-align: center;
            background: #f6f7fb;
            cursor: pointer;
        }
    }
}
</style>

<style lang="less">
.popover-userlist {
    z-index: 2011 !important;
    padding: 0px !important;
    width: 329px;
    overflow-y: auto;
    background: #ffffff;
    border: 1px solid #dcdfe5;
    box-shadow: 0 4px 8px 0 #e8e8e8;
    margin-top: 5px !important;
    margin-left: 329/2px + 40px;
    overflow: hidden;
    .content-warpper {
        padding: 8px 10px;
    }
    .search-result {
        .title {
            padding: 12px 10px;
            font-size: 12px;
            color: #666;
            line-height: 12px;
        }
    }
    ul > li {
        font-size: 14px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #48576a;
        line-height: 1.5;
        box-sizing: border-box;
        cursor: pointer;
        .user-list-item {
            position: relative;
            padding: 8px 10px;
            display: table;
            width: 100%;
        }
        &:hover {
            background: #e5f1ff;
        }
        .description {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;
            top: 2px;
        }
    }
}
.user-detail-card {
    min-width: 284px;
    padding: 20px 30px !important;
    z-index: 2011 !important;
    font-size: 14px !important;
    background: #ffffff;
    border: 1px solid #dcdfe5;
    box-shadow: 0 4px 8px 0 #e8e8e8;
    .detail-info {
        padding: 10px 0px;
        span {
            padding-right: 35px;
            color: #999999;
        }
    }
}
</style>
