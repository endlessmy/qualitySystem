<!--
@name: 修改密码
@desc：进入页面第一次修改密码+点击右上角资料修改（现在隐藏）
@author: dengxue
@date: 2018/06/06
-->
<template>
    <div class="modify-pwd-page">
        <div
            v-if="!modifySucess"
            class="center-section modify-pwd">
            <div class="content-section">
                <div class="form-title ">修改密码</div>

                <el-form
                    ref="form"
                    :rules="rules"
                    :model="form"
                    class="pwd-form">

                    <el-form-item prop="originalPassword">
                        <el-input
                            v-model="form.originalPassword"
                            type="password"
                            placeholder="请输入原始密码">
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="newPassword">
                        <el-input
                            v-model="form.newPassword"
                            type="password"
                            placeholder="请输入新密码"
                            @focus="showRule =true"
                            @blur="showRule=false">
                        </el-input>
                        <div
                            v-show="showRule"
                            class="rule-pop">
                            <ul class="rule-list">
                                <li
                                    v-for="(item,index) in pwdRules"
                                    :key="index">
                                    <span class="before-circle"></span>
                                    {{ item.label }}
                                </li>
                            </ul>
                        </div>
                    </el-form-item>

                    <el-form-item prop="confirmPassword">
                        <el-input
                            v-model="form.confirmPassword"
                            type="password"
                            placeholder="请再次输入新密码">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            :disabled="isDisabled"
                            class="submit-btn"
                            @click="confirmSubmit">确认修改
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <set-password-success
            v-else
            :is-logined="true">
        </set-password-success>

        <div class="login-footer">Copyright © 2018 咪咕TSG成都研发事业部</div>
    </div>
</template>
<script>
import MessageMixins from 'common/mixins/message';
import api from '../../utils/api';
import HomeMixins from '../../mixins/home';
import setPasswordSuccess from './setPasswordSuccess';

export default {
    name: 'ModifyPwd',
    components: { setPasswordSuccess },
    mixins: [HomeMixins, MessageMixins],
    data() {
        let validatePwd = (rule, value, callback) => {
            this.validateNewPwd(rule, value, callback);
        };
        let validatePwdAgain = (rule, value, callback) => {
            if (value === this.form.newPassword) {
                callback();
            } else {
                callback(new Error('两次输入的密码不一致'));
            }
        };
        return {
            form: {
                originalPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rules: {
                originalPassword: [
                    {
                        required: true,
                        message: '原始密码不能为空',
                        trigger: 'change'
                    }
                ],
                newPassword: [
                    {
                        required: true,
                        message: '新密码不能为空',
                        trigger: 'change'
                    },
                    { validator: validatePwd, trigger: 'blur' }
                ],
                confirmPassword: [
                    {
                        required: true,
                        message: '再次输入新密码不能为空',
                        trigger: 'change'
                    },
                    { validator: validatePwdAgain, trigger: 'blur' }
                ]
            },
            isDisabled: false,
            modifySucess: false,
            pwdRules: [
                { label: '至少8位密码' },
                {
                    label: '由其中三类字符组合：大写字母、小写字母、数字、特殊符号'
                },
                { label: '不能出现用户名全拼' },
                { label: '不能出现3位以上重复或连续字符' }
            ],
            showRule: false
        };
    },
    methods: {
        confirmSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.isDisabled = true;
                    api
                        .modifyPwd({
                            originalPassword: this.encryptRSA(this.form.originalPassword),
                            newPassword: this.encryptRSA(this.form.newPassword),
                            confirmPassword: this.encryptRSA(this.form.confirmPassword)
                        })
                        .then(
                            res => {
                                this.isDisabled = false;
                                this.showSuccessMsg(res.remark);
                                this.modifySucess = true;
                            },
                            () => {
                                this.isDisabled = false;
                            }
                        );
                }
            });
        }
    }
};
</script>

<style lang='less' >
@import '../../layouts/css/password.less';
</style>
<style lang="less" scoped>
.modify-pwd-page {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 80px;
    background: #f3f8fb;

    .login-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80px;
        line-height: 80px;
        font-size: 12px;
        color: #757a86;
        text-align: center;
        background: #fff;
    }
}
</style>
