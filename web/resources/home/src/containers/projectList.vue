<!--
    @name: 首页 - 项目列表
    @desc: 包含 '我的项目'、'待办事项'、'我创建的'、'常用应用'
        项目经理有新建项目的权限，显示新建按钮
        我的项目：自定义项目（大视频的红海行动）+ 我参与的项目
        常用应用：首先展示已收藏的应用，不满6个展示默认的应用
        我的项目没有时，横向全部显示常用应用
    @author: qqli
-->
<template>
    <!-- @click="showSearchBox = false" -->
    <div class="home-wrap">
        <div class="clearfix">
            <div
                v-if="!noProject"
                class="project-list clearfix">

                <div class="title-wrap clearfix">
                    <span class="vertical-line">我的项目</span>
                    <!-- <i
                        v-if="!showSearchBox"
                        class="icon-search right cursor"
                        @click.stop="showSearchBox = !showSearchBox">
                    </i> -->

                    <div class="right search-wrap">
                        <!-- v-else -->
                        <!-- @click.stop="" -->
                        <!-- @click.stop="" 不能删除 -->
                        <i
                            class="icon-search search-title search-position"
                            @click.stop="queryProjectListByKeyword()">
                        </i>
                        <el-input
                            ref="searchInput"
                            v-model.trim="projectKeyword"
                            class="search-input right"
                            placeholder="支持项目名称、别名关键字搜索">
                            <!-- @keyup.enter.native="queryProjectListByKeyword()" -->
                        </el-input>
                        <i
                            v-show="projectKeyword.length > 0"
                            class="icon-delete search-title del-position"
                            @click.stop="deleteQueryProject()">
                        </i>
                    </div>
                </div>
                <div class="project-list-content">
                    <ul class="clearfix">
                        <li
                            v-if="isProjectManager"
                            class="item create-project">
                            <router-link :to="{name: 'ProjectCreate'}">
                                <span class="add"><i class="icon icon-add"></i></span>
                                <span class="add-name">新建项目</span>
                            </router-link>
                        </li>
                        <li
                            v-for="item in displayProjectList"
                            :key="item.pid"
                            class="item">
                            <div
                                class="inner-div"
                                @click="goToDetail(item)">
                                <span
                                    v-if="!item.custom_type"
                                    class="logo">
                                    {{ item.name | formatProjectName }}
                                </span>
                                <span
                                    v-else
                                    class="logo operationredsea">
                                </span>
                                <span
                                    :class="{'alias-none': item.aliasName == null || item.aliasName == '', operationredsea: !!item.custom_type}"
                                    class="name">
                                    <a
                                        :class="{'title-small': ((item.projBoardId !== null && item.projBoardId !== -1) || item.qualityAnalysisFlag === 1)}"
                                        :title="!item.custom_type ? item.name : '红海行动'"
                                        href="javascript:;"
                                        class="title">
                                        <span v-if="!item.custom_type">{{ item.name | HTMLDecode }}</span>
                                        <span v-else>红海行动</span>
                                    </a>
                                    <span
                                        v-if="!item.custom_type"
                                        class="title-icon">
                                        <i
                                            v-if="item.projBoardId !== null && item.projBoardId !== -1"
                                            class="icon-yiji"
                                            title="一级项目">
                                        </i>
                                        <i
                                            v-if="item.qualityAnalysisFlag === 1"
                                            class="icon-zhiliang"
                                            title="质量分析依据项目">
                                        </i>
                                    </span>
                                </span>
                                <span
                                    :title="item.aliasName == null ? '': item.aliasName"
                                    class="alias-name">
                                    {{ item.aliasName == null ? '' : item.aliasName | HTMLDecode }}
                                </span>
                            </div>
                            <span
                                v-if="!item.custom_type"
                                class="fenzhi"
                                @click="showProjectTree(item)">
                                <i class="icon-fenzhi"></i>
                            </span>
                        </li>
                    </ul>
                    <p class="view-more-project">
                        <a
                            v-if="filterProjectList.length > defaultDisplayProjectCount"
                            href="javascript:;"
                            @click="toggleProject">
                            {{ moreText }}
                            <i
                                :class="{'up': displayProjectList.length > defaultDisplayProjectCount}"
                                class="icon icon-arrow">
                            </i>
                        </a>
                    </p>
                </div>
            </div>

            <div
                :class="{'app-list': !noProject, 'app-list-spread': noProject}"
                @mouseenter="setUrlToken">
                <p class="title-wrap">
                    <span class="vertical-line">常用应用</span>
                </p>
                <ul class="clearfix">
                    <li
                        v-for="app in commonAppList"
                        v-if="commonAppList.length > 0"
                        :key="app.service_id"
                        class="item cursor">
                        <a
                            target="_blank"
                            @click="appUrl(app, filterProjectList)">
                            <p
                                :class="app.background"
                                class="prj-icon menu-icon">
                                <i :class="app.icon"></i>
                            </p>
                            <p class="text color-gray">{{ app.remark }}</p>
                        </a>
                    </li>

                    <li
                        v-if="commonAppList.length === 0"
                        class="app-empty">
                        <p><i class="icon-yingyong"></i></p>
                        <h4>没有常用应用</h4>
                        <p class="noneP">收藏应用方法：点击上方导航栏的“应用”； 鼠标指向应用名称；单击应用图标右上角的五角星图标</p>
                    </li>
                </ul>
            </div>
        </div>

        <dynamic></dynamic>

        <project-level-tree-modal
            :project-tree = "projectListTree"
            :click-pro-id="clickProjectId"
            :click-pro-name="clickProjectName"
            :edit-right="editProjectRight"
            v-model="projectLevelTreeModalVisible">
        </project-level-tree-modal>

        <no-project-modal
            :data="app"
            v-model="noProjectModalVisible">
        </no-project-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { COMMON_INDEX_ROUTER, PROJECT_MODULE_ROUTER, REDSEA_MODULE_ROUTER } from 'common/constants/const';
import NoProjectModal from 'common/components/NoProjectDialog';
import ProjectLevelTreeModal from '@/components/ProjectLevelTreeDialog';
import MessageMixins from 'common/mixins/message';
import AppMixins from 'common/mixins/app';
import utils from 'common/utils/misc';
import Dynamic from '@/components/Dynamic';
import filters from '@/filters/filter';
import apiCommon from 'common/utils/api';
import api from '@/utils/api';
import _debounce from 'lodash.debounce';

export default {
    name: 'ProjectList',

    components: { ProjectLevelTreeModal, Dynamic, NoProjectModal },

    filters: filters,

    mixins: [MessageMixins, AppMixins],

    data() {
        return {
            projectListAll: [], // 我参与全部的项目
            filterProjectList: [], // 搜索到的所有项目
            displayProjectList: [], // 显示我参与的显目（5个，点击更多全部显示）
            defaultDisplayProjectCount: 5, // 首页 ‘我的项目’ 默认展示项目数量
            moreText: '查看全部项目',
            projectKeyword: '', // 根据关键字查询项目
            // showSearchBox: false, // 判断搜索框是否显示

            userToken: '', // 用户的token

            noProjectModalVisible: false,
            app: {},

            projectLevelTreeModalVisible: false,
            editProjectRight: false,
            clickProjectId: 0,
            clickProjectName: '',
            projectListTree: []
        };
    },

    computed: {
        ...mapState({
            commonAppList: ({ project }) => project.appTypes.commonAppList
        }),
        isProjectManager() {
            let userRoleName = utils.getLoginUserInfo('userRole');
            this.defaultDisplayProjectCount = userRoleName === '项目经理' ? 5 : 6;
            return userRoleName === '项目经理';
        },
        noProject() {
            return !this.isProjectManager && this.displayProjectList.length === 0;
        }
    },
    beforeMount() {
        // 重置路由
        // 避免初始路由与待办组件内进行操作后跳转的路由相同而导致待办组件内无法监听路由的变化
        location.href = COMMON_INDEX_ROUTER;
        this.queryProjectList();
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.searchInput.$el
                .querySelector('input')
                .addEventListener('keyup', _debounce(this.queryProjectListByKeyword, 500));
        });
    },
    methods: {
        queryProjectList() {
            Promise.all([this.queryUserProject(), this.queryCustomProject()])
                .then(res => {
                    this.filterProjectList = this.projectListAll = [...res[1], ...res[0]];
                    this.displayProjectList = this.filterProjectList.slice(0, this.defaultDisplayProjectCount);
                })
                .catch(res => {});
        },

        queryUserProject() {
            return new Promise((resolve, reject) => {
                var params = {
                    userId: utils.getLoginUserInfo('userId')
                };
                // 查询用户所在项目列表
                apiCommon
                    .queryUserProjectList(params)
                    .then(res => {
                        resolve(res.projects);
                    })
                    .catch(res => {
                        reject(res);
                    });
            });
        },
        queryCustomProject() {
            return new Promise((resolve, reject) => {
                // 查询自定义的项目列表，1：大视频
                api.queryCustomProjectList({
                    custom_type: '1'
                })
                    .then(res => {
                        resolve(res.result);
                    })
                    .catch(res => {
                        reject(res);
                    });
            });
        },

        toggleProject() {
            if (
                this.displayProjectList.length < this.defaultDisplayProjectCount + 1 &&
                this.filterProjectList.length > this.defaultDisplayProjectCount
            ) {
                this.displayProjectList = this.filterProjectList;
                this.moreText = '收起更多项目';
            } else {
                this.displayProjectList = this.filterProjectList.slice(0, this.defaultDisplayProjectCount);
                this.moreText = '查看全部项目';
            }
        },

        goToDetail(item) {
            // custom_type: 0默认一般项目,1大视频定制化项目
            if (item.custom_type === 1) {
                location.href = `${REDSEA_MODULE_ROUTER}/${item.pid}/taskList/-1`;
            }

            // 跳转到概览。版本传0，会请求最新版本将其替换
            api.updateUserProject({ project_id: item.pid }).then(res => {
                location.href = `${PROJECT_MODULE_ROUTER}/${item.pid}/${item.name}/versionDetail/0/V0/versionOverview`;
            });
        },

        // 根据项目名称查询
        queryName(qName, keyword) {
            for (let j = 0; j < qName.length; j++) {
                // 如果匹配起始字符,开始查找
                if (qName.charAt(j) === keyword.charAt(0)) {
                    if (qName.substring(j).substring(0, keyword.length) === keyword) {
                        // 如果从j开始的字符与str匹配，那ok
                        return true;
                    }
                }
            }
            return false;
        },

        // 根据项目别名查询
        queryAliasName(qAlias, keyword) {
            if (qAlias == null) return false;
            for (let j = 0; j < qAlias.length; j++) {
                // 如果匹配起始字符,开始查找
                if (qAlias.charAt(j) === keyword.charAt(0)) {
                    // 如果从j开始的字符与str匹配，那ok
                    if (qAlias.substring(j).substring(0, keyword.length) === keyword) {
                        return true;
                    }
                }
            }
            return false;
        },

        // 根据用户输入的关键字匹配项目列表
        queryProjectListByKeyword() {
            let keyword = this.projectKeyword.toLowerCase();
            let qName;
            let qAlias;
            let arr = [];
            for (let i = 0; i < this.projectListAll.length; i++) {
                qName = this.projectListAll[i].name;
                qAlias = this.projectListAll[i].aliasName;
                qName = qName.toLowerCase();
                if (qAlias) {
                    qAlias = qAlias.toLowerCase();
                }
                if (this.queryName(qName, keyword) || this.queryAliasName(qAlias, keyword)) {
                    arr.push(this.projectListAll[i]);
                }
            }
            if (arr.length > 0) {
                this.displayProjectList = arr;
                this.filterProjectList = arr;
                this.moreText = '收起更多项目';
            } else if (keyword.length === 0) {
                this.filterProjectList = this.projectListAll;
                this.displayProjectList = this.filterProjectList.slice(0, this.defaultDisplayProjectCount);
                this.moreText = '查看全部项目';
            } else {
                this.showWarningMsg('未找到匹配项目');
            }
        },

        // 清楚搜索匹配项目
        deleteQueryProject() {
            this.filterProjectList = this.projectListAll;
            this.displayProjectList = this.filterProjectList.slice(0, this.defaultDisplayProjectCount);
            this.moreText = '查看全部项目';
            this.projectKeyword = '';
        },

        // 展示项目树
        showProjectTree(item) {
            this.clickProjectId = item.pid;
            this.clickProjectName = item.name;
            this.projectLevelTreeModalVisible = true;
            apiCommon.queryProjectTreeList({ id: item.pid, type: '2' }).then(res => {
                this.projectListTree = res.result;
            });
            // 查询是否有编辑权限，显示或隐藏项目树弹窗内的编辑文字按钮
            apiCommon.queryProjectDetail({ projectId: item.pid }).then(res => {
                this.editProjectRight = res.projectInfo.editRight;
            });
        },

        setUrlToken() {
            api.getUserToken({
                userId: utils.getLoginUserInfo('userId'),
                singleton: true,
                sessionId: utils.getLoginUserInfo('sessionId')
            }).then(res => {
                this.userToken = res.result;
            });
        }
    }
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
    transition-delay: 300ms;
}
.fade-leave-active {
    transition-delay: 0ms;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
