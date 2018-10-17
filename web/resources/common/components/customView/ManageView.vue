<!--
管理视图弹框
@author shenah
@createTime 2018/4/8
 -->
<template>
    <div class="manage-view">
        <el-dialog
            v-model="isShow"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            title="管理视图"
            size="xlarge"
            @close="close">
            <!-- :row-class-name="setRowClassName" -->
            <el-table
                :data="tableLists"
                style="width: 100%;"
                max-height="340"
                empty-text="暂无数据"
                class="outer-border manage-table">
                <el-table-column
                    width="160"
                    label="视图标题"
                    class-name="td-title">
                    <template scope="scope">
                        <a
                            :title="scope.row.view_title"
                            class="title manage-title"
                            @click="routeToDetail(scope.row)">
                            {{ utilsCommon.overName(scope.row.view_title, 10) }}
                        </a>
                    </template>
                </el-table-column>
                <el-table-column
                    label="默认视图">
                    <template scope="scope">
                        <div
                            :class="setIcon('default',scope.row)"
                            class="is-select"
                            @click="handleOperte(scope.$index, scope.row, 'select')"></div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="启用">
                    <template scope="scope">
                        <el-switch
                            v-model="scope.row.view_config.enable"
                            :width="40"
                            :disabled="scope.row.view_config.is_default"
                            on-text=""
                            off-text=""
                            class="manage-view-switch"
                            @change="switChage">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    label="视图类型">
                    <template scope="scope">
                        <div>{{ VIEW_TYPE_TEXT[scope.row.view_type] }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建者"
                    prop="create_user_name">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="130">
                    <template scope="scope">
                        <span
                            class="move"
                            @click="handleOperte(scope.$index, scope.row, 'up')">
                            <i
                                v-if="scope.$index !== 0"
                                class="icon-xiangshang"></i>
                        </span>
                        <span
                            class="move"
                            @click="handleOperte(scope.$index, scope.row, 'down')">
                            <i
                                v-if="scope.$index !== tableLists.length - 1"
                                class="icon-xiangxia"></i>
                        </span>
                        <span
                            v-if="scope.row.view_config.edit_permit"
                            class="operte"
                            @click="handleOperte(scope.$index, scope.row, 'edit')">编辑</span>
                        <span
                            v-if="scope.row.view_config.delete_permit"
                            :class="{'dis-enable':scope.row.view_config.is_default}"
                            class="operte"
                            @click="handleOperte(scope.$index, scope.row, 'delete')">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <span
                slot="footer"
                class="dialog-footer">
                <el-button
                    class="mt20"
                    type="primary"
                    @click="close">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import apiCommon from 'common/utils/api';
import { VIEW_TYPE_TEXT } from 'common/constants/const';
import CommonMessage from 'common/mixins/message';
import utilsCommon from 'common/utils/misc';
export default {
    name: 'ManageView',
    mixins: [CommonMessage],
    props: {
        requestParams: Object,
        manageViewVisible: Boolean
    },
    data() {
        return {
            utilsCommon: utilsCommon,
            tableLists: [],
            VIEW_TYPE_TEXT: VIEW_TYPE_TEXT
        };
    },
    computed: {
        isShow() {
            return this.manageViewVisible;
        }
    },
    watch: {},
    mounted() {
        this.queryAllViewList();
    },
    methods: {
        queryAllViewList() {
            // 查询所有的视图
            apiCommon.queryViewList(this.requestParams).then(res => {
                this.tableLists = res.result.map((item, index) => {
                    item.view_config.view_order = index;
                    return item;
                });
            });
        },
        setIcon(type, row) {
            let defaultClass = '';
            defaultClass = `${row.view_config.is_default ? 'selected' : 'no-selected'} ${
                row.view_config.enable && !row.view_config.is_default ? 'allow' : 'not-allow'
            }`;
            return defaultClass;
        },
        // setRowClassName(row, index) {
        //     row.index = index;
        //     return `tr-row-${index}`;
        // },
        handleOperte(index, row, type) {
            if (type === 'up' || type === 'down') {
                this.handleMove(index, row, type);
            } else if (type === 'delete') {
                this.handleDelete(index, row, type);
            } else if (type === 'edit') {
                this.handleEdit(index, row, type);
            } else if (type === 'select') {
                this.handleSelect(index, row, type);
            }
        },
        handleMove(index, row, type) {
            // 移动的操作
            let temp = row.view_config.view_order;
            if (type === 'up') {
                // 证明是上移
                this.tableLists[index].view_config.view_order = this.tableLists[index - 1].view_config.view_order;
                this.tableLists[index - 1].view_config.view_order = temp;
            } else {
                // 证明是下移
                this.tableLists[index].view_config.view_order = this.tableLists[index + 1].view_config.view_order;
                this.tableLists[index + 1].view_config.view_order = temp;
            }
            this.tableLists = this.tableLists.sort(function sortNumber(a, b) {
                // 按照element_order升序排序
                return a.view_config.view_order - b.view_config.view_order;
            });
            this.updateView(this.tableLists);
        },
        updateView(list) {
            // 更新视图
            let viewConfigList = list.map(item => ({
                config_id: item.config_id,
                view_id: item.view_id,
                is_default: item.view_config.is_default,
                enable: item.view_config.enable,
                view_order: item.view_config.view_order
            }));
            // 新增service_id参数8.10刘譞
            let params = {
                service_id: this.requestParams.service_id,
                view_config_list: viewConfigList,
                project_id: this.requestParams.project_id
            };
            apiCommon.configView(params);
        },
        handleDelete(index, row) {
            // 任务组件删除操作
            if (row.view_config.is_default) {
                return;
            }
            this.confirmWarning({
                title: '删除提示',
                content: `删除操作不可逆，是否继续？`
            }).then(
                () => {
                    apiCommon
                        .deleteView({
                            view_id: row.view_id
                        })
                        .then(() => {
                            this.showSuccessMsg('删除视图成功');
                            this.queryAllViewList();
                            this.$emit('manageView', 'delete', row);
                        });
                },
                () => {}
            );
        },
        handleEdit(index, row, type) {
            // 编辑
            this.$emit('manageView', type, row);
        },
        handleSelect(index, row, type) {
            // 是否为默认
            if (!row.view_config.is_default && row.view_config.enable) {
                this.tableLists.forEach(element => {
                    element.view_config.is_default = false;
                });
                row.view_config.is_default = true;
                this.updateView(this.tableLists);
            }
        },
        switChage() {
            this.updateView(this.tableLists);
        },
        routeToDetail(row) {
            this.$emit('manageView', 'edit', row);
        },
        close() {
            this.$emit('manageView', 'close', false);
        }
    }
};
</script>
<style lang="less">
@import '../../layouts/css/themes/default.less';

@pd: 30px;
.manage-view {
    .manage-table {
        .el-table__body-wrapper {
            // border: 1px solid #ecedee !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }
        .el-table__header-wrapper {
            // border-left: 1px solid #ecedee !important;
            // border-right: 1px solid #ecedee !important;
        }
        .manage-title {
            margin-right: 0px !important;
            &:hover {
                text-decoration: underline;
            }
        }
        .no-selected {
            background: url(../../layouts/images/greyNoSelect.png) no-repeat;
        }
        .selected {
            background: url(../../layouts/images/blueSelect.png) no-repeat;
        }
        .allow {
            cursor: pointer;
        }
        .not-allow {
            cursor: not-allowed;
        }
        .is-select {
            width: 20px;
            height: 20px;
            background-size: 100%;
        }
        .move {
            width: 15px;
            display: inline-block;
        }
        .operte {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #539eff;
            padding-left: 10px;
            cursor: pointer;
            display: inline-block;
            text-align: center;
        }
        .dis-enable {
            cursor: not-allowed;
            color: #e4e8f1;
        }
    }
    .el-dialog--xlarge {
        width: 760px !important;
    }
    .el-dialog__header {
        position: relative;
        padding: 0px @pd;
        font-size: 16px;
        color: #333333;
        line-height: 50px;
        &:after {
            content: ' ';
            position: absolute;
            left: @pd;
            right: @pd;
            bottom: 0;
            height: 1px;
            background: #eee;
            z-index: 10;
        }

        .el-tag {
            padding: 0 10px;
        }
    }

    .el-dialog__close {
        font-size: 12px;
        color: #999999;
    }

    .el-dialog__body {
        padding: 24px @pd 0;
    }

    .el-dialog__footer {
        padding-left: @pd;
        padding-right: @pd;
        padding-bottom: @pd;
        .el-button {
            width: 90px;
            font-size: 14px;
        }
    }

    .el-form-item {
        margin-bottom: 20px;
    }

    //统一设置弹窗内 文本域的高度
    .el-textarea {
        textarea {
            height: 75px;
            min-height: 75px;
        }
    }

    //弹窗中的日期，统一显示100%
    .el-date-editor {
        &.el-input {
            width: 100%;
        }
    }
    //删除，提示文字
    .danger-text {
        color: @danger;
    }
}
</style>
