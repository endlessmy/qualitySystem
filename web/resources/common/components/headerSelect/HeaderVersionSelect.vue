<!--@description:新版树形结构的表头筛选，包括期望解决版本、
计划上线版本，目前暂时用于需求模块和缺陷模块看效果
传入参数的要求：
        treeSelectParams: {
            type: Object,
            default: function() {
                return {
                    handChange: Function, // 选择版本后触发的方法
                    selectNameKey: String, // 表头的Key值
                    selectName: String, // 表头名字
                    project_id: String, // 用于查询版本列表
                    isTree: Boolean, // 是否是树形的标志
                    requestList: Function // 请求列表方法
                };
            }
        },
        apiFun: {
            type: Function,
            default: api.queryVersionTree // 默认方法，
        },
        addNoVersion: { // 是否增加无版本选项
            type: Boolean,
            default: false
        }
@author:jjq
@date:2018/6/26-->
<template>
    <div class="header-select-tree">
        <div
            ref="headSelectLink"
            class="header-select-link">
            {{ treeSelectParams.selectName }}<i class="icon-pullup-down"></i>
        </div>
        <slot>
            <version-select
                :options="projectVersionList"
                :project-id="treeSelectParams.project_id"
                :type="1"
                v-model="hopeSolveVersionId"
                :need-version-name="true"
                @change="updateVersion">
            </version-select>
        </slot>

    </div>
</template>

<script>
import UserList from 'common/components/UserList';
import VersionSelect from 'common/components/VersionSelect';
import api from 'common/utils/api';

export default {
    name: 'HeaderVersionSelect',

    components: {
        UserList,
        VersionSelect
    },
    props: {
        treeSelectParams: {
            type: Object,
            default: function() {
                return {};
            }
        },
        apiFun: {
            type: Function,
            default: api.queryVersionTree
        },
        addNoVersion: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // 项目的版本
            projectVersionList: [],
            // showPopover: false,
            hopeSolveVersionId: '',
            requestLoading: false
        };
    },
    computed: {
        project_id() {
            return this.treeSelectParams.project_id;
        }
    },
    watch: {
        project_id(val) {
            if (val) {
                this.initVersionList();
            }
        }
    },
    beforeMount() {
        if (this.treeSelectParams.project_id) {
            this.initVersionList();
        }
    },
    methods: {
        updateVersion(item) {
            this.treeSelectParams.handChange(this.hopeSolveVersionId, this.treeSelectParams);
        },
        initVersionList() {
            let data = {
                project_id: this.treeSelectParams.project_id,
                keyword: ''
            };
            if (!this.requestLoading) {
                this.requestLoading = true;
                this.apiFun(data).then(
                    res => {
                        this.requestLoading = false;
                        this.projectVersionList = res.result;
                        if (this.addNoVersion) {
                            this.projectVersionList.unshift({
                                version_id: -1,
                                version_num: '无版本'
                            });
                        }
                    },
                    () => {
                        this.requestLoading = false;
                    }
                );
            }
        }
    }
};
</script>

<style lang='less'>
@import '../../layouts/css/themes/default.less';

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
</style>
