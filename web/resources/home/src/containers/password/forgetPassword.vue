<!--
@name: 首页忘记密码
@author: dengxue
@date: 2018/06/06
-->
<template>
    <div class="center-section forget-pwd ">
        <router-link
            :to="{name: 'Login'}"
            class="back-bread">
            <i class="icon icon-arrow"></i>
            <span>返回登录</span>
        </router-link>

        <div class="content-section">
            <div class ="form-title ">忘记密码</div>
            <div class="form-tip fs12">
                仅支持合作方账号，咪咕用户找回密码请前往
                <a
                    target="_blank"
                    href="https://oa.migu.cn/MGOACore/mgoacore/login/Reset-Password.jsp">OA系统</a>
            </div>
            <el-form
                ref="form"
                :model="form"
                :rules="rules"
                class="pwd-form">

                <el-form-item prop="tel">
                    <el-input
                        v-model="form.tel"
                        type="text"
                        placeholder="请输入手机号">
                    </el-input>
                </el-form-item>

                <el-form-item
                    prop="authcode"
                    class="code-item">
                    <el-input
                        v-model="form.authcode"
                        type="text"
                        placeholder="请输入验证码">
                    </el-input>
                    <span
                        v-if="canGetCode"
                        class="get-code cursor"
                        @click="getAuthcodeFn">
                        <span class="des">获取验证码</span>
                    </span>
                    <span
                        v-else
                        class="get-code">
                        <span class="timer">重新获取({{ countDown }}s)</span>
                    </span>
                </el-form-item>

                <el-form-item>
                    <el-button
                        :disabled="isDisabled"
                        class="submit-btn"
                        @click="findPwd">找回密码
                    </el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
import MessageMixins from 'common/mixins/message';
import api from '../../utils/api';

export default {
    name: 'ForgetPassword',
    mixins: [MessageMixins],
    data() {
        var validateTelChange = (rule, value, callback) => {
            // 以1开头
            let reg = /^1\d{10}$/;

            // change时小于11位不校验
            if (value.length < 11 || reg.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的手机号'));
            }
        };
        var validateTelBlur = (rule, value, callback) => {
            let reg = /^1\d{10}$/;
            if (reg.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的手机号'));
            }
        };
        return {
            form: {
                tel: '',
                authcode: ''
            },
            canGetCode: true,
            countDown: 60,
            isDisabled: false,
            rules: {
                tel: [
                    {
                        required: true,
                        message: '手机号码不能为空',
                        trigger: 'change'
                    },
                    { validator: validateTelChange, trigger: 'change' },
                    { validator: validateTelBlur, trigger: 'blur' }
                ],
                authcode: [
                    {
                        required: true,
                        message: '验证码不能为空',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    mounted() {
        if (this.$route.query.phone) {
            this.form.tel = this.$route.query.phone;
        }
    },
    methods: {
        getAuthcodeFn() {
            this.$refs.form.validateField('tel', msg => {
                if (!msg) {
                    api.getAuthCode({ tel: this.form.tel }).then(
                        res => {
                            this.canGetCode = false;
                            this.coutTimer();
                        },
                        err => {
                            console.log(err);
                        }
                    );
                }
            });
        },
        coutTimer() {
            var timer = setInterval(() => {
                this.countDown--;
                if (this.countDown <= 0) {
                    clearInterval(timer);
                    this.canGetCode = true;
                    this.countDown = 60;
                }
            }, 1000);
        },

        findPwd() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.isDisabled = true;
                    api.checkAuthCode(this.form).then(
                        res => {
                            this.isDisabled = false;
                            let str = JSON.stringify(res.result);
                            window.localStorage.setItem('userLoginData', str);
                            this.$router.push({ name: 'SetNewPwd' });
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
