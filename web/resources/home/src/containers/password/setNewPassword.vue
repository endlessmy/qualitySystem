<!--
@name: 首页设置新密码
@author: dengxue
@date: 2018/06/06
-->
<template>
    <div class=" set-new-pwd center-section">
        <div
            class="back-bread"
            @click="$router.push('/login')">
            <i class="icon icon-arrow"></i>
            <span>返回登录</span>
        </div>
        <div class="content-section">
            <div class ="form-title ">设置新密码</div>
            <!-- <div class="form-tip fs14">SPMS密码修改后，OA密码会同步更改</div> -->
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                class="pwd-form">

                <el-form-item prop="newPassword">
                    <el-input
                        id="newPwd"
                        v-model="form.newPassword"
                        type="password"
                        placeholder="新密码"
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

                <el-form-item
                    prop="confirmPassword"
                    class="code-item">
                    <el-input
                        id="againPwd"
                        v-model.trim="form.confirmPassword"
                        type="password"
                        placeholder="确认新密码">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button
                        :disabled="isDisabled"
                        class="submit-btn"
                        @click="submitPwd">
                        确认修改
                    </el-button>
                </el-form-item>

            </el-form>
            <!-- <div class="pwd-rule">
                <span class="rule-key">密码设置规则：</span>
                <span class="rule-value">至少设置8位密码，
                必须由大写字母、小写字母、数字与特殊符号等4类中3类混合、随机组成；
                不能出现用户名的全拼；不能3位以上的重复或连续字母、数字、特殊字符
                </span>
            </div> -->
        </div>
    </div>
</template>
<script>
import api from '../../utils/api';
import HomeMixins from '../../mixins/home';

export default {
    name: 'SetNewPwd',
    mixins: [HomeMixins],
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
                newPassword: '',
                confirmPassword: ''
            },
            isDisabled: false,
            rules: {
                newPassword: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'change'
                    },
                    {
                        validator: validatePwd,
                        trigger: 'blur'
                    }
                ],
                confirmPassword: [
                    {
                        required: true,
                        message: '密码不能为空',
                        trigger: 'change'
                    },
                    {
                        validator: validatePwdAgain,
                        trigger: 'blur'
                    }
                ]
            },
            pwdRules: [
                { label: '至少8位密码' },
                { label: '由其中三类字符组合：大写字母、小写字母、数字、特殊符号' },
                { label: '不能出现用户名全拼' },
                { label: '不能出现3位以上重复或连续字符' }
            ],
            showRule: false
        };
    },
    methods: {
        submitPwd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.isDisabled = true;
                    var encryptedPwd = this.encryptRSA(this.form.newPassword);
                    var encryptedPwdAgain = this.encryptRSA(this.form.confirmPassword);
                    let formData = {
                        newPassword: encryptedPwd,
                        confirmPassword: encryptedPwdAgain
                    };
                    api.resetingPwd(formData).then(
                        res => {
                            this.isDisabled = false;
                            localStorage.clear();
                            this.$router.push({ name: 'SetPwdSuccess' });
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
