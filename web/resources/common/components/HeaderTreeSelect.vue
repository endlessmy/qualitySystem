<template>
    <div class="header-select-tree">
        <div
            ref="headSelectLink"
            class="header-select-link">
            {{ selectName }}<i class="icon-pullup-down"></i>
        </div>
        <slot>
            <version-select
                :options="projectVersionList"
                :project-id="project_id"
                :type="1"
                v-model="hope_solve_version_id"
                :need-version-name="true"
                @change="updateVersion">
            </version-select>
        </slot>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import utils from 'common/utils/misc';
// import MessageMixins from '../mixins/message.js';
import UserList from 'common/components/UserList';
import VersionSelect from 'common/components/VersionSelect';

export default {
    name: 'HeaderTreeSelect',

    components: {
        UserList,
        VersionSelect
    },
    props: ['handChange', 'selectNameKey', 'project_id', 'selectName'],
    data() {
        return {
            // 项目的版本
            projectVersionList: [],
            showPopover: false,
            hope_solve_version_id: '',
            requestLoading: false
        };
    },
    watch: {
        project_id(val) {
            if (val) {
                this.initVersionList();
            }
        }
    },
    beforeMount() {
        this.requestLoading = true;
        if (this.project_id) {
            this.initVersionList();
        }
    },
    methods: {
        updateVersion(item) {
            this.handChange(this.hope_solve_version_id, this.selectNameKey, true);
            // this.showPopover=false;
        },
        initVersionList() {
            let data = {
                project_id: this.project_id,
                keyword: ''
            };
            if (this.requestLoading) {
                this.queryVersionTree(data).then(res => {
                    this.requestLoading = false;
                    this.projectVersionList = res.result;
                });
            }
        },
        ...mapActions(['queryVersionTree'])
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
