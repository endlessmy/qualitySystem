<!--
    @name: 首页 - 应用管理列表
    @desc: 包含新建应用按钮、应用列表展示（关键字搜索/表头筛选/编辑/删除）
        系统管理员才有权限
    @author: qqli
-->
<template>
    <div class="home-wrap home-wrap-auto app-manage-warp">
        <div
            id="mainHeader"
            class="main-header clearfix">
            <div class="breadcrumbs left ">
                <span>应用接入配置</span>
            </div>

            <div class="operate-platform">
                <el-button
                    class="mr10"
                    size="small"
                    type="primary"
                    @click="createApp">
                    <i class="icon-add fs12"></i>
                    新建
                </el-button>

                <search-box
                    v-model.trim="requestParams.key_word"
                    :query="keywordQueryList"
                    placeholder="支持应用名称关键词搜索">
                </search-box>
            </div>
        </div>

        <div
            id="mainScroll"
            class="main main-list">
            <div class="main-wrap">
                <div class="main-list-row clearfix">
                    <div class="breadcrumbs left">
                        <span>应用列表({{ tableList.length }}) </span>&nbsp;&nbsp;
                        <span v-show="filterItem.length > 0">></span>
                    </div>
                    <div class="filter-list ml5 left">
                        <div
                            v-for="(item, i) in filterItem"
                            :key="item"
                            class="filter-item">
                            <span class="text">
                                {{ item.label }} : {{ item.value }}
                            </span>
                            <span
                                class="remove"
                                @click="removeFilterLabel(i, item, removeFilterParams)">
                                <i class="icon-delete-big"></i>
                            </span>
                        </div>
                        <div class="filter-item filter-clear">
                            <span
                                v-show="filterItem.length > 1"
                                class="clear"
                                @click="clearAll">
                                清除所有条件
                            </span>
                        </div>
                    </div>
                </div>

                <el-table
                    :data="tableList"
                    style="width: 100%"
                    empty-text="暂无数据">

                    <el-table-column
                        label="应用名称"
                        width="120"
                        class-name="td-first">
                        <template scope="scope">
                            <span>{{ scope.row.remark }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="应用URL"
                        prop="url">
                    </el-table-column>

                    <el-table-column
                        label="应用图标"
                        width="150">
                        <template scope="scope">
                            <span>
                                <i
                                    :class="scope.row.icon"
                                    class="app-icon">
                                </i>
                            </span>
                            <span>{{ scope.row.icon }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="图标背景色"
                        width="150">
                        <template scope="scope">
                            <div>
                                <span
                                    :class="scope.row.background"
                                    class="bd-color">
                                </span>
                                <span>{{ scope.row.background }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column
                        :render-header="renderType"
                        label="应用类型"
                        width="120">
                        <template scope="scope">
                            <span v-if="scope.row.group_id == 1">业务类</span>
                            <span v-if="scope.row.group_id == 2">研发类</span>
                            <span v-if="scope.row.group_id == 3">其他</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        :render-header="renderVisibleRange"
                        label="可见范围"
                        width="120">
                        <template scope="scope">
                            <span v-if="scope.row.authority_type == 0">所有用户</span>
                            <span v-if="scope.row.authority_type == 1">咪咕用户</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="操作"
                        width="120">
                        <template scope="scope">
                            <span
                                class="operation"
                                @click="editApp(scope.row)">
                                编辑
                            </span>
                            <span
                                class="operation"
                                @click="deleteApp(scope.row)">
                                删除
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import _findIndex from 'lodash.findindex';
import SearchBox from 'common/components/SearchBox';
import MessageMixins from 'common/mixins/message';
import utils from 'common/utils/misc';
import HeaderMultSelect from 'common/components/headerSelect/HeaderMultSelect';
import HeaderFilterMixins from 'common/mixins/headerFilter';
import { FILTER_LABEL, APP_TYPE_LIST, VISIBLE_RANGE_LIST } from '@/constants/const';
import api from '@/utils/api';

export default {
    name: 'AppList',

    components: { SearchBox, HeaderMultSelect },

    mixins: [MessageMixins, HeaderFilterMixins],

    data() {
        return {
            requestParams: {
                key_word: '', // 关键词，用于搜索框搜索
                remark: '', // 应用名
                url: '', // 地址
                group_id: '', // 类型
                icon: '', // 图标
                background: '', // 背景颜色
                authority_type: '' // 可见范围（0-所有用户，1-咪咕员工）
            },
            tableList: [],
            filterItem: [],
            removeFilterParams: { service: 'AppManage', requestList: this.requestList }
        };
    },

    beforeMount() {
        const isAdmin = utils.getLoginUserInfo('isAdmin');
        if (isAdmin) {
            this.requestList();
        } else {
            this.$router.push({name: 'ProjectList'}); // 跳转到首页
        }
    },

    methods: {
        requestList() {
            return api.queryAppList(this.requestParams).then(res => {
                this.tableList = res.result;
            });
        },
        // 关键词查询
        keywordQueryList(keyword) {
            this.requestParams.key_word = keyword;
            let filterItemIndex = _findIndex(this.filterItem, o => o.key === 'key_word');
            if (keyword.length > 0 || filterItemIndex > -1) {
                if (filterItemIndex > -1) {
                    this.filterItem.splice(filterItemIndex);
                }
                if (keyword.length > 0) {
                    let obj = {};
                    obj.label = '关键字';
                    obj.value = keyword;
                    obj.key = 'key_word';
                    this.filterItem.push(obj);
                }

                this.requestList();
            }
        },
        // 清除所有筛选
        clearAll() {
            this.filterItem = [];
            this.resetParams();
            this.requestList();
        },

        // 请求参数重置 && 筛选条件重置
        resetParams() {
            this.requestParams = {
                key_word: '',
                remark: '', // 应用名
                url: '', // 地址
                group_id: '', // 类型
                icon: '', // 图标
                background: '', // 背景颜色
                authority_type: '' // 可见范围（0-所有用户，1-咪咕员工）
            };
        },

        // 渲染应用类型
        renderType(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.group_id,
                selectNameKey: 'group_id',
                options: APP_TYPE_LIST,
                selectName: FILTER_LABEL['group_id'],
                multiple: false,
                requestList: this.requestList
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'group_id'
            });
        },

        // 渲染应用可见范围
        renderVisibleRange(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.authority_type,
                selectNameKey: 'authority_type',
                options: VISIBLE_RANGE_LIST,
                selectName: FILTER_LABEL['authority_type'],
                multiple: false,
                allShow: false,
                requestList: this.requestList
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'authority_type'
            });
        },

        createApp() {
            this.$router.push({name: 'AppCreate'});
        },

        editApp(item) {
            this.$router.push({
                name: 'AppEdit',
                params: {
                    serviceId: item.service_id
                }
            });
        },

        deleteApp(item) {
            this.confirmWarning({
                title: '删除',
                content: `删除"${item.remark}"应用，是否继续？`
            }).then(() => {
                api.deleteApp({
                    service_id: item.service_id
                }).then(res => {
                    this.showSuccessMsg('删除应用成功！');
                    this.requestList();
                    api.queryAppServiceList({
                        service_id: item.service_id
                    });
                });
            }).catch(() => {
            });
        }
    }
};
</script>

<style lang="less" scoped>
.home-wrap-auto {
    width: 80%;
}
.operation {
    padding-right: 10px;
    color: #0486fe;
    cursor: pointer;

    &:last-child {
        padding-right: 0;
    }
}

.app-icon {
    color: #757a86;
    cursor: default;
}
</style>
