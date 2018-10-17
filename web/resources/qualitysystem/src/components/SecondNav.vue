<!--
@name: 质量系统 - 二级菜单
@description:
    1.二级菜单主要包括KPI指标和问题工单两个部分
@author: jjq
@date:
-->
<template>
    <div
        id="secondNav"
        class="second-nav quality-system-second-nav">
        <el-menu
            ref="menu"
            :default-active="$route.path"
            :router="true"
            class="menu"
            @select="selectMenu">
            <div>
                <el-menu-item
                    :class="{'is-active': isActive('homeQualityDimension,homeKpi,homeQuestionList')}"
                    index="/qualitySystem/homeQualityDimension">
                    <span><i class="icon-home"></i>{{ NAV_MAPPING['/qualitySystem/homeQualityDimension'] }}</span>
                </el-menu-item>
            </div>
            <el-submenu
                index="1">
                <template slot="title">
                    <span class="title-txt"><i class="icon-zhiliang2" />质量度量</span>
                </template>
                <el-menu-item index="/qualitySystem/wholeScore">
                    <span>{{ NAV_MAPPING['/qualitySystem/wholeScore'] }}</span>
                </el-menu-item>
                <el-menu-item index="/qualitySystem/everyDimensionScore">
                    <span>{{ NAV_MAPPING['/qualitySystem/everyDimensionScore'] }}</span>
                </el-menu-item>
            </el-submenu>
            <el-submenu
                index="2">
                <template slot="title">
                    <span class="title-txt"><i class="icon-shengchangduliang" />生产率度量</span>
                </template>

                <el-submenu
                    v-show="isCommonRole"
                    index="2-1">
                    <template
                        slot="title">
                        <div class="third-title-nav">
                            <i class="el-icon-caret-bottom" />
                            <span class="second-title-txt">生产率数据</span>
                        </div>
                    </template>
                    <el-menu-item
                        index="/qualitySystem/productivityMeasure/dataQuery/rankForProjects">
                        <span class="third-title">{{ NAV_MAPPING['/qualitySystem/productivityMeasure/dataQuery/rankForProjects'] }}</span>
                    </el-menu-item>

                </el-submenu>

                <el-submenu
                    v-show="isManagePage"
                    index="2-2">
                    <template
                        slot="title">
                        <div class="third-title-nav">
                            <i class="el-icon-caret-bottom" />
                            <span class="second-title-txt">生产率管理</span>
                        </div>
                    </template>
                    <el-menu-item index="/qualitySystem/productivityManage/manage">
                        <span class="third-title">{{ NAV_MAPPING['/qualitySystem/productivityManage/manage'] }}</span>
                    </el-menu-item>
                    <el-menu-item
                        :class="{'is-active': isActive('data,detail')}"
                        index="/qualitySystem/productivityManage/data">
                        <span class="third-title">{{ NAV_MAPPING['/qualitySystem/productivityManage/data'] }}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item
                    v-show="isEntryManager"
                    index="/qualitySystem/productivityEntry">
                    <span class="second-title-nav">{{ NAV_MAPPING['/qualitySystem/productivityEntry'] }}</span>
                </el-menu-item>
            </el-submenu>
            <el-submenu
                index="3">
                <template slot="title">
                    <span class="title-txt"><i class="icon-kpi-zhiliang" />KPI指标</span>
                </template>
                <el-menu-item index="/qualitySystem/kpiReachStandard">
                    <span>{{ NAV_MAPPING['/qualitySystem/kpiReachStandard'] }}</span>
                </el-menu-item>
                <el-menu-item index="/qualitySystem/kpiOriginData">
                    <span>{{ NAV_MAPPING['/qualitySystem/kpiOriginData'] }}</span>
                </el-menu-item>
            </el-submenu>
            <el-submenu
                index="4">
                <template slot="title">
                    <span class="title-txt"> <i class="icon-wentigogndan" />问题工单</span>
                </template>
                <el-menu-item index="/qualitySystem/questionOriginData">
                    <span>{{ NAV_MAPPING['/qualitySystem/questionOriginData'] }}</span>
                </el-menu-item>
            </el-submenu>

        </el-menu>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import QualitySystemMixins from '../mixins/qualitysystem';
// import api from '../utils/api';
export default {
    name: 'QualitySystemSecondNav',

    mixins: [QualitySystemMixins],

    data() {
        return {
            NAV_MAPPING: {
                '/qualitySystem/homeQualityDimension': '首页',
                '/qualitySystem/homeKpi': 'KPI指标',
                '/qualitySystem/kpiOriginData': '原始数据',
                '/qualitySystem/kpiReachStandard': '达标情况',
                '/qualitySystem/questionOriginData': '原始数据',
                '/qualitySystem/wholeScore': '整体得分',
                '/qualitySystem/everyDimensionScore': '各维度得分',
                '/qualitySystem/dataQuery': '数据查询',
                '/qualitySystem/productivityEntry': '生产率录入',
                '/qualitySystem/productivityManage/manage': '管理页',
                '/qualitySystem/productivityManage/data': '数据页',
                '/qualitySystem/productivityMeasure/dataQuery/rankForProjects': '项目组间排名'
            },
            // currUserPrivilege: false,
            isEntryManager: false,
            isManagePage: false,
            isCommonRole: false
        };
    },

    computed: {
        ...mapState({
            currentUserPrivilege: ({ qualitySystem }) => qualitySystem.currUserPrivilege
        }),
        defaultActive() {
            // 当前激活菜单的 index
            const router = this.$route;
            let path = router.path;
            return path;
        },
        // openedKeys() {
        //     // 当前打开的sub-menu的key数组
        //     let val = ['1', '2', '3', '4', '5'];
        //     return val;
        // },
        activeName() {
            var path = this.$route.path;
            return /[^/]+$/.exec(path)[0];
        }
    },

    watch: {
        currentUserPrivilege(val) {
            this.getUsersPrivilege();
        }
    },

    beforeMount() {
        this.getUsersPrivilege();
    },

    methods: {
        getUsersPrivilege() {
            for (let i = 0; i < this.currentUserPrivilege.length; i++) {
                // 超管、QA可进生产率管理
                if (this.currentUserPrivilege[i] === '4' || this.currentUserPrivilege[i] === '3') {
                    this.isManagePage = true;
                }
                // 超管、QA、项目经理可进生产率录入
                if (this.currentUserPrivilege[i] !== '1') {
                    this.isEntryManager = true;
                    this.isCommonRole = true;
                } else if (this.currentUserPrivilege[i] === '1') {
                    // 普通用户只能进生产率数据
                    this.isCommonRole = true;
                    this.isEntryManager = false;
                    this.isManagePage = false;
                }
            }
        },
        selectMenu(index) {
            let indexArr = index.split('/');
            let newIndex = `/${indexArr[1]}/${indexArr[2]}`;
            const navObj = { name: this.NAV_MAPPING[newIndex], path: index };
            navObj && this.setNavItem(navObj);
        },
        isActive(str) {
            return str.indexOf(this.activeName) > -1;
        },
        ...mapActions([''])
    }
};
</script>
<style lang="less" scoped>
.quality-system-second-nav {
    .icon-home,
    .icon-zhiliang2,
    .icon-shengchangduliang,
    .icon-kpi-zhiliang,
    .icon-wentigogndan {
        padding-right: 10px;
        font-size: 14px;
        width: 14px;
        height: 14px;
    }
    .second-title-txt {
        font-size: 12px;
        padding-left: 4px;
    }
    .third-title {
        padding-left: 19px;
    }
    .third-title-nav {
        padding-left: 4px;
    }
}
.quality-system-second-nav .el-submenu .el-menu-item {
    padding-left: 44px !important;
}
.quality-system-second-nav .title-txt {
    padding-left: 0px;
}
// .second-title-nav {
//     padding-left: 20px;
// }
</style>
