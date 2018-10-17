<!--
    @name: 首页 - 更多应用
    @desc: 分类显示应用
    @author: qqli
-->
<template>
    <div class="home-wrap app-more-wrap">
        <div
            v-for="(category,index) in appCategoryList"
            :key="index"
            class="app-card">
            <div class="card-header">
                <span class="vertical-line">{{ category.name }}</span>
            </div>
            <div
                v-if="category.list.length > 0"
                class="card-body">
                <a
                    v-for="(app, index) in category.list"
                    :key="index"
                    :class="{border: setBorderClass(category.list, index)}"
                    @mouseenter="setUrlToken"
                    @click="appUrl(app, projectList)">
                    <div
                        :class="app.background"
                        class="item-left">
                        <i :class="app.icon"></i>
                    </div>
                    <div class="item-right">
                        <div class="app-name">
                            <span class="text">{{ app.remark }}</span>
                            <i
                                :class="{'icon-shoucang-active': app.interest_flag === 1}"
                                class="icon-shoucang"
                                @click.stop="toggleStar(app)">
                            </i>
                        </div>
                        <div class="app-desc">{{ app.service_desc || "--" }}</div>
                    </div>
                </a>
            </div>
        </div>

        <no-project-modal
            :data="app"
            v-model="noProjectModalVisible">
        </no-project-modal>
    </div>
</template>

<script>
import MessageMixins from 'common/mixins/message';
import AppMixins from 'common/mixins/app';
import NoProjectModal from 'common/components/NoProjectDialog';
import utils from 'common/utils/misc';
import { APP_CATEGORY_LIST } from '@/constants/const';
import apiCommon from 'common/utils/api';
import api from '@/utils/api';

export default {
    name: 'AppMore',
    components: { NoProjectModal },
    mixins: [MessageMixins, AppMixins],
    data() {
        return {
            userToken: '', // 直接跳转其他系统带的token
            projectList: [], // 跳转项目模块取第一个项目的数据评价路由（功能需求、迭代版本、任务看板...）

            appCategoryList: [], // 应用的分类
            appCategoryDatatStash: {},

            starAppCount: 0, // 已关注的应用数量

            noProjectModalVisible: false,
            app: {}
        };
    },
    mounted() {
        this.queryList();
    },
    methods: {
        queryList() {
            this.queryProjectListByUserId();
            this.queryAppList();
        },

        // 查询用户所在项目列表
        queryProjectListByUserId() {
            apiCommon
                .queryUserProjectList({
                    userId: utils.getLoginUserInfo('userId')
                })
                .then(res => {
                    this.projectList = res.projects;
                });
        },

        // 查询应用列表
        queryAppList() {
            api.queryAppServiceList({}).then(res => {
                // 重置暂存的app 分类数据
                this.resetAppStashData();
                this.starAppCount = 0;

                // 暂存应用到对应的分类中
                res.result.map((item, index) => {
                    let type = APP_CATEGORY_LIST[item.group_id - 1]['type'];
                    this.appCategoryDatatStash[type].push(item);

                    if (item.interest_flag === 1) {
                        this.starAppCount += 1;
                    }
                });

                // 组装模板数据
                let arr = [];
                APP_CATEGORY_LIST.forEach(item => {
                    let type = item.type;
                    let name = item.name;
                    arr.push({
                        name: name,
                        list: this.appCategoryDatatStash[type]
                    });
                });

                this.appCategoryList = arr;
            });
        },

        // 重置各个分类的数据
        resetAppStashData() {
            APP_CATEGORY_LIST.forEach(item => {
                let type = item.type;
                this.appCategoryDatatStash[type] = [];
            });
        },

        setBorderClass(appList, index) {
            index += 1;
            let appListLen = appList.length;
            let num = appListLen % 4; // 余数就是当前分类下没有底部边框的应用数量
            let minIndex = appListLen - (num || 4); // 需要添加border的最小索引
            return index <= minIndex;
        },

        setUrlToken() {
            api.getUserToken({
                userId: utils.getLoginUserInfo('userId'),
                singleton: true,
                sessionId: utils.getLoginUserInfo('sessionId')
            }).then(res => {
                this.userToken = res.result;
            });
        },

        // 点击关注图标，关注或取消关注该应用
        toggleStar(app) {
            // 最多能关注6个应用，interest_flag: 0 未关注，1 关注
            if (this.starAppCount > 5 && app.interest_flag === 0) {
                this.showWarningMsg('常用应用最多为6个');
                return false;
            }

            let loading = true;
            if (loading) {
                api.modifyUserFavoriteAppService({
                    service_id: app.service_id,
                    interest_flag: app.interest_flag === 0 ? 1 : 0
                }).then(
                    () => {
                        loading = false;
                        this.queryList();
                    },
                    () => {
                        loading = false;
                    }
                );
            }
        }
    }
};
</script>

<style lang="less" scoped>
.app-more-wrap {
    width: 1156px;
    padding: 30px 0 0;
    .app-card {
        width: 100%;
        min-height: 142px;
        background-color: #fff;
        margin-bottom: 20px;
        .card-header {
            width: 100%;
            height: 44px;
            line-height: 44px;
            border-bottom: 1px solid #f3f3f3;
            padding-left: 20px;
            // .label {
            //     display: inline-block;
            //     vertical-align: middle;
            // }
        }
        .card-body {
            width: 100%;
            padding: 0 30px;

            &:last-child {
                border: none;
            }

            &:after {
                content: '';
                display: table;
                clear: both;
            }

            .no-app {
                width: 100%;
                height: 34px;
                text-align: center;
                line-height: 34px;
                color: #333;
                .application-icon {
                    font-size: 20px;
                    color: #333;
                }
            }

            > a {
                position: relative;
                display: inline-block;
                width: 25%;
                height: 86px;
                cursor: pointer;

                &.border {
                    border-bottom: 1px dashed #e7e9f1;
                }

                &:hover {
                    .item-right .app-name .text {
                        color: #4e9afe;
                        text-decoration: underline;
                    }
                }
                .item-left {
                    position: absolute;
                    top: 50%;
                    margin-top: -16px;
                    left: 0;
                    width: 32px;
                    height: 32px;
                    display: inline-block;
                    vertical-align: middle;
                    i {
                        position: absolute;
                        top: -2px;
                        left: 6px;
                    }
                    .icon-devops {
                        font-size: 14px;
                        left: 5px;
                    }
                }
                .item-right {
                    position: absolute;
                    top: 50%;
                    margin-top: -27px;
                    left: 42px;
                    display: inline-block;
                    width: 160px;
                    .app-name {
                        width: 100%;
                        height: 30px;
                        font-size: 14px;
                        color: #333;
                    }
                    .app-desc {
                        width: 100%;
                        height: 30px;
                        font-size: 12px;
                        color: #666;
                    }
                }
            }
        }
        .icon-shoucang,
        .icon-shoucang-active {
            position: relative;
            top: -1px;
            font-size: 12px;
        }
        .icon-shoucang {
            color: #979797;
        }
        .icon-shoucang-active {
            color: #539eff;
        }

        i {
            color: #fff;
            font-size: 18px;
            line-height: 36px;
        }
        .crisis-bc {
            background-color: #f36b5d;
        }
        .apply-tools-bc {
            background-color: #29ab91;
        }
        .task-bc {
            background-color: #f39725;
        }
        .require-bc {
            background-color: #539eff;
        }
    }
    // .vertical-line {
    //     margin: -1px 0 0 20px;
    // }
}
</style>
