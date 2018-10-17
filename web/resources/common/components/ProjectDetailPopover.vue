<!--
选择项目

@author： lizihao
@date: 2018/07/16
@desc:
    模拟下拉选择框，展示项目列表，输入搜索等
    使用场景：新建缺陷和业务需求
-->
<template>
    <div class="project-detail-popover">
        <el-popover
            ref="search"
            :width="width"
            :visible-arrow="false"
            :disabled="disabled"
            popper-class="popover-projectlist"
            placement="bottom"
            trigger="click">
            <div
                v-if="projectList.length === 0"
                class="title">
                暂无数据
            </div>
            <div
                v-if="projectList.length > 0"
                class="result">
                <ul>
                    <li
                        v-for="(item, key) in searchedProject"
                        :key="key"
                        @click="selectedOption(item)">
                        <el-popover
                            placement="right"
                            trigger="hover"
                            popper-class="project-detail-card">
                            <div class="detail-box">
                                <div
                                    v-if="item.projectdetail"
                                    class="detail-info">
                                    <span>项目详情:</span>
                                    <div class="project-detail">
                                        {{ item.projectdetail }}
                                    </div>
                                </div>
                                <div
                                    v-if="item.projectMemberList.length!==0"
                                    class="detail-info">
                                    <span>项目经理:</span>
                                    <div class="project-detail">
                                        <span
                                            v-for="(person,index) in item.projectMemberList"
                                            :key="index"
                                            class="project-detail">
                                            {{ person.userName }}<span v-show="index<item.projectMemberList.length-1">、</span>
                                        </span>
                                    </div>
                                </div>
                                <div
                                    v-if="item.company_name"
                                    class="detail-info">
                                    <span>所属公司:</span>
                                    <div class="project-detail">{{ item.company_name }}</div>
                                </div>
                            </div>
                            <div
                                slot="reference"
                                class="detail-info">
                                {{ item.name || '--' }}
                            </div>
                        </el-popover>
                    </li>
                </ul>
            </div>
        </el-popover>
        <div class="content-warpper">
            <el-input
                v-popover:search
                v-model="projectSearchKey"
                :disabled="disabled"
                placeholder="支持项目名称搜索"
                icon="el-icon-circle-close"
                @change="searchProject(projectSearchKey)">
            </el-input>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import api from '../utils/api';
export default {
    name: 'ProjectDetailPopover',
    props: [
        'requirementprop', // 从业务需求过来的标识
        'disabled',
        'projectList',
        'defaultData' // 如果保存了表单数据，再次进入新建页面时传过来的项目id
    ],
    data() {
        return {
            projectSearchKey: '',
            width: '',
            searchedProject: []
        };
    },
    computed: {
        ...mapState({
            relevantAllProjects: ({ requirementPool, defect }) => {
                const module = requirementPool || defect;
                return module.projectListForCreate || module.relevantProjectList;
            }
        })
    },
    watch: {
        // 清除暂存的数据，所选关联项目也要清除 业务需求新建清除
        defaultData(val) {
            if (!val && this.requirementprop) {
                this.projectSearchKey = '';
            }
        }
    },
    mounted() {
        this.searchedProject = this.projectList; // 第一次进入页面使用create.vue传过来的项目列表
        setTimeout(() => {
            this.setWidth();
            if (this.defaultData && this.defaultData !== '') {
                api.queryProjectDetail({ projectId: this.defaultData }).then(res => {
                    this.projectSearchKey = res.projectInfo.projectName;
                });
            }
        }, 1000);
    },
    beforeUpdate() {
        // 动态设置组件宽度
        this.setWidth();
    },
    methods: {
        searchProject(keywords) {
            this.$refs.search.showPopper = true;
            // 获取查询列表数据
            let qName;
            let returnvalue = [];
            if (keywords === '') {
                this.searchedProject = this.relevantAllProjects.slice(0, 50); // 关键字清空后从state中获取前50条
            } else {
                keywords = keywords.toLowerCase();
                for (let i = 0; i < this.relevantAllProjects.length; i++) {
                    qName = this.relevantAllProjects[i].name;
                    qName = qName.toLowerCase();
                    if (this.queryName(qName, keywords)) {
                        returnvalue.push(this.relevantAllProjects[i]);
                    }
                }
                this.searchedProject = returnvalue;
            }
        },
        // 根据项目名称查询
        queryName(qName, keywords) {
            for (let j = 0; j < qName.length; j++) {
                // 如果匹配起始字符,开始查找
                if (qName.charAt(j) === keywords.charAt(0)) {
                    if (qName.substring(j).substring(0, keywords.length) === keywords) {
                        // 如果从j开始的字符与str匹配，那ok
                        return true;
                    }
                }
            }
            return false;
        },
        selectedOption(item) {
            this.projectSearchKey = item.name;
            document.querySelector('.popover-projectlist').style.display = 'none';
            this.$emit('selectedOption', item);
        },
        setWidth() {
            this.width = document.querySelector('.project-detail-popover').clientWidth;
        }
    }
};
</script>
<style lang="less" scoped>
.popover-projectlist {
    .title {
        color: #bfcbd9;
        background-color: #fff;
        cursor: not-allowed;
        font-size: 14px;
        padding: 8px 30px 8px 10px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #48576a;
        height: 36px;
        line-height: 1.5;
        box-sizing: border-box;
    }
    .result {
        ul {
            li {
                height: 34px;
                font-size: 14px;
                position: relative;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #48576a;
                line-height: 1.5;
                box-sizing: border-box;
                cursor: pointer;
                line-height: 34px;
                position: relative;
                padding: 0 10px;
                display: table;
                width: 100%;
                &:hover {
                    background-color: #e5f1ff;
                }
            }
        }
    }
}
</style>
