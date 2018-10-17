
<!--
    @name: 首页 - 新建项目
    @desc: 项目只有一个父项目
        项目的父项目和子项目不能相同
        提交-后台校验所选的子项目是否已有父项目
        父项目和子项目搜索的是所有项目，一个接口
    @author: qqli
-->
<template>
    <div class="home-wrap home-wrap-auto">
        <div class="main-header clearfix">
            <div class="breadcrumbs left">
                <span class="new-project">新建项目</span>
            </div>
        </div>

        <div class="main main-project">
            <el-form
                ref="createForm"
                :model="createForm"
                :rules="rules"
                label-width="120px"
                class="create-form">
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="项目名："
                            prop="projectName">
                            <el-input
                                :maxlength="50"
                                v-model.trim="createForm.projectName"
                                placeholder="50个字符以内">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item
                            label="项目详情："
                            prop="projectDetail">
                            <el-input
                                :maxlength="500"
                                v-model.trim="createForm.projectDetail"
                                type="textarea"
                                class="large"
                                placeholder="500个字符以内">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="所属公司："
                            prop="belongCompany">
                            <el-select
                                v-model="createForm.belongCompany"
                                poper-class="dropdown-wrapper"
                                filterable
                                placeholder="请选择所属公司"
                                @visible-change="searchCompany"
                                @change="changeBelongCompany">
                                <el-option
                                    v-for="item in companyList"
                                    :key="item.company_id"
                                    :label="item.company_name"
                                    :value="item.company_name + ',' + item.company_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row v-if="firstProjectName">
                    <el-col :span="12">
                        <el-form-item
                            label="所属一级项目：">
                            <span style="margin-left: 10px;">{{ firstProjectName }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="父项目：">
                            <el-select
                                ref="parentProjectId"
                                v-model="createForm.parentId"
                                :remote-method="searchProject"
                                clearable
                                filterable
                                remote
                                placeholder="请输入关键词"
                                @change="changeParentProject">
                                <el-option
                                    v-for="project in projectList"
                                    :key="project.pid"
                                    :label="project.name"
                                    :value="project.pid">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item
                            label="子项目：">
                            <el-select
                                v-removeSearchQuery
                                v-model="subProjectIds"
                                :remote-method="searchProject"
                                multiple
                                filterable
                                remote
                                placeholder="请输入关键词">
                                <el-option
                                    v-for="project in projectList"
                                    :key="project.pid"
                                    :label="project.name"
                                    :value="project.pid">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row class="member-row">
                    <el-col :span="12">
                        <el-form-item label="项目人员：">
                            <el-select
                                v-model="projectMember.userId"
                                :remote-method="searchUserList"
                                popper-class="dropdown-wrapper"
                                clearable
                                filterable
                                remote
                                placeholder="请输入搜索">
                                <el-option
                                    v-for="item in userList"
                                    :key="item.userId"
                                    :label="item.userName"
                                    :value="item.userId">
                                    <user-list :user="item"></user-list>
                                </el-option>
                            </el-select><el-select
                                v-model="projectMember.userRoleId"
                                popper-class="dropdown-wrapper"
                                clearable
                                filterable
                                placeholder="请选择角色">
                                <el-option
                                    v-for="item in roleList"
                                    :key="item.roleId"
                                    :label="item.roleName"
                                    :value="item.roleId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button
                            :class="{active: projectMember.userId && projectMember.userRoleId}"
                            class="add-button"
                            type="primary"
                            @click="addProjectMember()">
                            添加
                        </el-button>
                    </el-col>
                </el-row>

                <!-- 成员列表 -->
                <el-row class="member-row">
                    <el-col
                        v-show="createForm.uproject.length > 0"
                        :span="12">
                        <div class="dividerwroper">
                            <div class="member-input-group">
                                <div class="divider"></div>
                            </div>
                        </div>
                        <el-form-item class="member-selected-box">
                            <div
                                v-for="(user, index) in createForm.uproject"
                                :key="user.userId"
                                class="member-list">
                                <div class="member-item">
                                    <div class="left">
                                        <i class="icon-user"></i>
                                        <span class="name">{{ user.userName }}</span>
                                    </div>
                                    <div class="right">
                                        <span class="role">{{ user.memberRole }}</span>
                                        <i
                                            class="icon-del"
                                            @click="deleteProjectMember(index)">
                                        </i>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item class="submit-btn">
                            <el-button
                                :disabled="disabledSubmit"
                                type="primary"
                                @click="submitForm()">
                                提交
                            </el-button>
                            <el-button @click="exitForm()">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
import _findIndex from 'lodash.findindex';
import MessageMixins from 'common/mixins/message';
import utils from 'common/utils/misc';
import UserList from 'common/components/UserList';
import apiCommon from 'common/utils/api';
import api from '@/utils/api';

export default {
    name: 'ProjectCreate',

    components: {
        UserList
    },

    mixins: [MessageMixins],

    data() {
        let companyNameValidator = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(rule.message));
            } else {
                callback();
            }
        };

        return {
            createForm: {
                projectName: '',
                projectDetail: '',
                belongCompany: '',
                company_name: '',
                company_id: '',
                uproject: [], // 项目中成员列表
                parentId: '', // 父项目ID
                parentName: '', // 父项目名称
                subProjectIds: [] // 子项目ID数组
            },
            companyList: [], // 所属公司列表

            firstProjectName: '', // 所属一级项目的名称

            projectList: [], // 父项目和子项目列表
            subProjectIds: [], // 子项目的model

            userList: [], // 人员列表（咪咕+外协）
            roleList: [], // 角色列表

            projectMember: {
                userId: '',
                userName: '',
                userRoleId: '',
                memberRole: ''
            },

            disabledSubmit: false,
            rules: {
                projectName: [{ required: true, message: '请输入项目名', trigger: 'blur' }],
                projectDetail: [{ message: '500个字符以内', trigger: 'blur' }],
                belongCompany: [
                    {
                        required: true,
                        validator: companyNameValidator,
                        message: '请选择所属公司',
                        trigger: 'change'
                    }
                ]
            }
        };
    },

    beforeMount() {
        // 查询成员角色列表
        this.queryRole();

        // 当前登录用户默认是项目经理
        let defaultMember = {
            userName: utils.getLoginUserInfo('userName'),
            userId: utils.getLoginUserInfo('userId'),
            memberRole: utils.getLoginUserInfo('userRole'),
            userRoleId: 2 // 项目经理角色
        };
        this.addMember(defaultMember, this.createForm.uproject, 'userId');
    },

    methods: {
        // 查询成员角色列表
        queryRole() {
            api.queryRoleList().then(res => {
                this.roleList = res.roles;
            });
        },

        // 搜索所属公司
        searchCompany(keyword) {
            if (!keyword) {
                return;
            }
            api.queryCompanyList({
                cflag: 1 // 公司标志（1-公司，0-外协）
            }).then(res => {
                this.companyList = res.result;
            });
        },

        // 选择所属公司
        changeBelongCompany() {
            if (this.createForm.belongCompany) {
                let arr = this.createForm.belongCompany.split(',');
                this.createForm.company_name = arr[0];
                this.createForm.company_id = arr[1];
            }
        },

        // 搜索父项目、子项目
        searchProject(keyword) {
            if (!keyword) {
                return false;
            }
            api.getRootProjects({ name: keyword }).then(res => {
                this.projectList = res.result;
                if (this.projectList.length > 0 && this.createForm.parentId) {
                    this.projectList.filter(p => p.pid !== this.createForm.parentId);
                }
            });
        },

        // 选择父项目
        changeParentProject(pid) {
            if (this.subProjectIds.length > 0) {
                this.subProjectIds = this.subProjectIds.filter(id => id !== this.createForm.parentId);
            }

            // 清空选择时 pid 为空
            if (pid === '') {
                this.firstProjectName = '';
            } else {
                api.queryFirstProject({ pid: pid }).then(res => {
                    if (res.result.length > 0) {
                        this.firstProjectName = res.result[0].name;
                    } else {
                        this.firstProjectName = '';
                    }
                });
            }
        },

        // 在线搜索咪咕员工
        searchUserList(keyword) {
            if (!utils.isEmpty(keyword)) {
                apiCommon.querySystemUserList({ keyword: keyword }).then(res => {
                    this.userList = res.result;
                    if (this.userList.length) {
                        this.userList = this.userList.map(item => {
                            item = Object.assign(item, {
                                userId: item.uid,
                                userName: item.username,
                                userMail: item.email
                            });
                            return item;
                        });
                    }
                });
            }
        },

        // 添加项目成员，当用户点击'添加'按钮
        addProjectMember() {
            let user = this.projectMember;

            if (!user.userId || !user.userRoleId) {
                this.showWarningMsg('请选择人员或角色');
                return;
            }

            user.userName = this.getUserName(user.userId); // 确定人员名字
            user.memberRole = this.getRoleName(user.userRoleId); // 确定角色名字
            let addMemberResult = this.addMember({ ...user }, this.createForm.uproject, 'userId', 'userRoleId');

            if (!addMemberResult) {
                this.showWarningMsg(`成员${user.userName}已添加过`);
            }
        },

        // 获取选择的成员的姓名
        getUserName(userId) {
            let idx = _findIndex(this.userList, item => item.userId === userId);
            return idx !== -1 ? this.userList[idx].userName : '';
        },

        // 获取选择的角色的名称
        getRoleName(roleId) {
            let idx = _findIndex(this.roleList, item => item.roleId === roleId);
            return idx !== -1 ? this.roleList[idx].roleName : '';
        },

        // 添加选择的用户到项目人员中
        // member: obj 需要添加到人员列表的信息
        // uproject: [] 项目人员列表
        addMember(member, uproject, ...key) {
            let conflict = false;
            let count = 0;

            for (let item of uproject) {
                conflict = false;
                count = 0;
                for (let k of key) {
                    if (item[k] !== member[k]) {
                        break;
                    }
                    ++count;
                    conflict = count === key.length;
                }

                // member 和 uproject中的元素冲突，不添加
                if (conflict) {
                    return false;
                }
            }
            uproject.unshift(member);
            return true;
        },

        // 删除项目成员
        deleteProjectMember(index) {
            let list = this.createForm.uproject;
            let currentMember = list[index];

            if (currentMember.userId === utils.getLoginUserInfo('userId') && currentMember.userRoleId === 2) {
                this.showWarningMsg('项目默认成员不可删除');
                return;
            }

            list.splice(index, 1);
        },

        beforeSubmit() {
            if (this.createForm.parentId) {
                this.createForm['parentName'] = this.$refs.parentProjectId.selectedLabel;
            }
            if (this.subProjectIds.length > 0) {
                this.createForm['subProjectIds'] = this.subProjectIds;
            }
        },

        // 提交新建的项目
        submitForm() {
            this.$refs.createForm.validate(valid => {
                if (valid) {
                    this.beforeSubmit();
                    api.createProject(this.createForm).then(
                        res => {
                            this.disabledSubmit = false;
                            this.showSuccessMsg('新建项目成功');
                            this.goBack();
                        },
                        () => {
                            this.disabledSubmit = false;
                        }
                    );
                }
            });
        },

        // 退出新建项目
        exitForm() {
            this.confirmWarning({
                title: '提示',
                content: '您确实要放弃新建项目吗？'
            })
                .then(() => {
                    this.goBack();
                })
                .catch(e => {
                    console.log('e', e);
                });
        },

        // 回到项目列表页面
        goBack() {
            this.$router.push({ name: 'ProjectList' });
        }
    }
};
</script>

<style lang="less" scoped>
.home-wrap-auto {
    .main-project {
        padding-top: 0;
        background: #fff;
    }

    .el-row:last-child {
        .el-form-item {
            margin-bottom: 0;
        }
    }
}

.add-button {
    background: #f2f2f2;
    border: 1px solid #cacaca;
    color: #555;
    height: 34px;
    width: 60px;
    font-size: 14px;
    margin-left: 10px;

    &.active {
        background: #539eff;
        color: #fff;
        border: none;
    }
}
.member-row {
    .dividerwroper {
        margin-left: 120px;
        padding-bottom: 20px;
    }
    .divider {
        border-bottom: 1px solid #cacaca;
        position: relative;
        opacity: 0.5;
        margin-bottom: 16px;
        top: 8px;
        &:before {
            content: '项目成员列表';
            top: -9px;
            left: 46px;
            font-size: 12px;
            position: absolute;
            background: #fff;
            width: 80px;
            text-align: center;
        }
    }
    .member-selected-box {
        padding-top: 20px;
    }
    .member-list {
        display: inline-block;
        padding-right: 20px;
        padding-bottom: 10px;

        .member-item {
            display: block;
            padding: 8px 10px;
            background: #fafafa;
            border-radius: 4px;

            &:hover {
                .right {
                    .role {
                        right: 0px;
                        transition: right 0.15s;
                    }
                    .icon-del {
                        opacity: 1;
                        visibility: visible;
                        transition: opacity 0.3s;
                    }
                }
            }
            .left {
                padding-right: 30px;
            }
            .right {
                text-align: right;
            }
            .left,
            .right {
                float: none;
                display: inline-block;
                vertical-align: middle;
                * {
                    display: inline-block;
                    vertical-align: middle;
                }
                .name,
                .role {
                    position: relative;
                    top: 1px;
                }
                .role {
                    font-size: 12px;
                    right: -15px;
                    transition: right 0.15s;
                }
            }
            .icon-user {
                color: #c0bdbd;
                font-size: 24px !important;
            }
            .icon-del {
                color: #539eff;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s;
                cursor: pointer;
            }
        }
    }
}
</style>
<style lang="less">
.member-row {
    .el-select {
        width: 48%;

        &:last-child {
            margin-left: 4%;
        }
    }
}
</style>
