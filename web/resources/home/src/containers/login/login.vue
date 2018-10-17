<template>
    <div class="login-container">
        <div class="login-header">
            <a
                ref="logo"
                href="javascript:void(0)"
                class="logo">
                <img src="../../layouts/images/login/logo.png">
            </a>
        </div>
        <div
            ref="loginBody"
            class="login-body clearfix">
            <div class="body-bg"></div>
            <div
                :style="bannerTinyStyle"
                class="banner-tiny"></div>
            <div
                ref="loginBox"
                class="login-box clearfix">

                <div
                    :style="bannerStyle"
                    class="banner"></div>

                <div
                    ref="formWrap"
                    class="form-wrap">

                    <div class="nav clearfix">
                        <h3>{{ activeLoginText }}</h3>
                        <div
                            :class="{'icon-captcha': showPasswordDialog, 'icon-password': !showPasswordDialog}"
                            class="icon"
                            @click="toggleLogin">
                        </div>
                        <div class="tip">{{ activeTipText }}</div>
                    </div>

                    <el-form
                        v-show="showPasswordDialog"
                        :model="form">
                        <div class="info">咪咕员工可直接使用OA账号登录</div>
                        <div class="input-item">
                            <input
                                v-model="form.username"
                                :class="{'input-error': showError}"
                                type="text"
                                placeholder="OA账号 / 手机号"
                                autofocus
                                @focus="focusInput"
                                @change="changeUserName">
                        </div>
                        <div class="input-item pb0">
                            <input
                                v-model="form.password"
                                :class="{'input-error': showError}"
                                type="password"
                                placeholder="密码"
                                autocomplete="off"
                                @keyup.enter="userLogin"
                                @focus="focusInput"
                                @keydown="pwdHandleKeydown"
                                @click="pwdHandleKeydown">
                            <!-- click 和 keydown事件都需要，各个浏览器表现不一致 -->

                            <div class="error-wrap">
                                <div
                                    v-show="isCapital"
                                    class="capital">
                                    大写锁定已开启
                                </div>

                                <div
                                    v-show="showError"
                                    class="form-error-tip">
                                    {{ errorTipText }}
                                </div>
                            </div>
                            <div class="forget-text clearfix">
                                <router-link :to="{name: 'ForgetPwd', query: { phone: form.username }}">
                                    忘记密码?
                                </router-link>
                            </div>
                        </div>

                        <div class="submit-cont">
                            <input
                                class="btn-submit"
                                type="button"
                                value="登   录"
                                @click="userLogin">
                        </div>

                        <div class="line"></div>

                        <div class="tip">
                            <span class="bold">系统登录及其他问题请联系：</span>
                            <p>邮箱：spms.support@migu.cn</p>
                            <P>电话：025-68739802 转 6</p>
                        </div>
                    </el-form>

                    <el-form
                        v-show="!showPasswordDialog"
                        :model="codeForm">

                        <div class="info">忘记密码可使用短信登录</div>

                        <div class="input-item">
                            <input
                                v-model="codeForm.phone"
                                type="text"
                                placeholder="手机号"
                                autofocus>
                        </div>

                        <div
                            v-show="showPhoneError"
                            class="form-error-tip phone-error">
                            手机号输入有误
                        </div>

                        <div class="input-item pb0">
                            <input
                                ref="dynamicCodeInput"
                                v-model="codeForm.random_code"
                                type="input"
                                placeholder="验证码"
                                autocomplete="off"
                                @keyup.enter="codeLogin">

                            <a
                                :class="{'sending':isSended}"
                                :disabled="disabledGetCode"
                                href="javascript:;"
                                class="btn-code"
                                @click="getDynamicCode">
                                {{ codeBtnText }}
                            </a>
                        </div>
                        <p
                            v-if="isSended"
                            class="sended-tip">
                            验证码已发送至手机{{ codeForm.phone }}，五分钟内有效
                        </p>
                        <div class="error-wrap">
                            <div
                                v-show="showError"
                                class="form-error-tip">
                                {{ errorTipText }}
                            </div>
                        </div>

                        <div class="submit-cont">
                            <input
                                class="btn-submit"
                                type="button"
                                value="登   录"
                                @click="codeLogin">
                        </div>
                        <div class="line"></div>
                        <div class="tip">
                            <span class="bold">系统登录及其他问题请联系：</span>
                            <p>邮箱：spms.support@migu.cn</p>
                            <P>电话：025-68739802 转 6</P>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>

        <div class="login-footer">Copyright © 2018 咪咕TSG成都研发事业部</div>
    </div>
</template>

<script>
import { GA_LOGIN as GaLogin } from 'common/utils/ga';
import { LOADING_OPTION } from 'common/constants/const';
import MessageMixins from 'common/mixins/message';
import utils from 'common/utils/misc';
import _debounce from 'lodash.debounce';
import COOKIE from './dependencies/cookieJS';
import api from '../../utils/api';
import HomeMixins from '../../mixins/home';

export default {
    name: 'Login',

    mixins: [MessageMixins, HomeMixins],

    data() {
        return {
            bannerStyle: {}, // 主题大图的样式
            bannerTinyStyle: {}, // 主题小图的样式

            passwordLoginText: '密码登录',
            codeLoginText: '短信登录',
            activeLoginText: '',
            activeTipText: '',
            showPasswordDialog: true,
            loading: '',
            isCapital: false, // 是否是大写

            // 密码登录
            form: {
                username: '',
                password: ''
            },
            passwordErrorTipText: '帐号不存在或者密码错误',
            codeErrorTipText: '验证码错误或已过期',
            errorTipText: '',
            showError: false,

            // 验证码登录
            codeForm: {
                phone: '',
                random_code: ''
            },
            codeBtnText: '获取验证码',
            isSended: false,
            showPhoneError: false, // 手机号是否有误
            disabledGetCode: false
        };
    },

    beforeMount() {
        this.init();
        this.initCodeTime(60);
    },

    mounted() {
        // 设置背景图片尺寸
        this.setSize();
        // 绑定事件
        this.bindEvent();
    },

    methods: {
        init() {
            // 登录页和修改密码页面不需要设置最小宽度
            document.getElementsByTagName('body')[0].style.minWidth = 'none';

            // 检查是否已经登录
            this.checkIsLogin();

            // 获取token，有值，则使用token自动登录，否则，用户自行登录
            // 使用场景：每日邮件提醒，30分钟内免登录
            this.tokenLogin();
            // 从其他系统（CTMP）跳转过来，需解析token并登陆获取用户信息。
            this.thirdSysLogin();

            this.activeLoginText = this.passwordLoginText;
            this.activeTipText = this.codeLoginText;
            this.errorTipText = this.passwordErrorTipText;

            var sessionVal = sessionStorage.getItem('inputUserVal');
            if (sessionVal) {
                this.form.username = sessionVal;
            }

            // this.showPasswordDialog = !this.showPasswordDialog;
            // this.errorTips = !this.showPasswordDialog ? '验证码错误或已过期' : '帐号不存在或者密码错误';
            // this.$nextTick(() => {
            //     this.setFormWrapMarin();
            // });
        },

        // 判断是否已经登录过
        checkIsLogin() {
            let self = this;
            if (utils.getLoginUserInfo()) {
                let nextHref = self.getSearchParam('next');
                if (nextHref) {
                    window.location.href = decodeURIComponent(nextHref);
                } else {
                    this.$router.push({ name: 'ProjectList' });
                }
            }
        },

        // 用户名改变时，存储到session storage
        changeUserName() {
            sessionStorage.setItem('inputUserVal', this.form.username);
        },

        // 根据用户交互，是否显示密码大小写提示
        pwdHandleKeydown(e) {
            if (e.getModifierState) {
                this.isCapital = e.getModifierState('CapsLock');
            }
        },

        // 虽然3s后错误提示自动消失，若在期间focus密码输入框，大写提示会与错误提示重复
        focusInput() {
            this.showError = false;
        },

        // 设置图片尺寸
        setSize() {
            console.log('ddd');
            let loginBody = this.$refs.loginBody;
            // if (!loginBody) {
            //     return false;
            // }
            let loginBodyH = loginBody.offsetHeight;
            let loginBodyW = loginBody.offsetWidth;
            let contanierW = parseInt(loginBodyW * 1180 / 1440);
            let headerLeft = parseInt((loginBodyW - contanierW) / 2);
            this.$refs.logo.style.paddingLeft = `${headerLeft}px`;
            // 设计稿宽度：1440， 内容宽度1180
            // 去掉头部和脚部的高度：710，主题图上外边距：99
            // 主题图的 宽度：629，高度：530
            // 主题小图的 宽度 242，高度：220
            // 主题图与登录框之间的间距 212
            // 登录框的宽度 350

            let mt = parseInt(99 / 710 * loginBodyH * 0.6);
            let h = loginBodyH - mt * 2;
            let w = 629 / 530 * h;

            let bannerRight = parseInt(loginBodyW * 212 / 1440);
            this.$refs.loginBox.style.width = `${parseInt(w + bannerRight + 350)}px`;

            // 设置主题大图的样式
            this.bannerStyle = {
                width: `${parseInt(w)}px`,
                height: `${parseInt(h)}px`,
                'margin-top': `${mt}px`,
                'margin-right': `${bannerRight}px`
            };

            // 设置主题小图的样式
            let tinyW = loginBodyH * 220 / 710;
            let tinyH = 220 * tinyW / 242;

            this.bannerTinyStyle = {
                width: `${parseInt(tinyW)}px`,
                height: `${parseInt(tinyH)}px`
            };

            // 设置登录框垂直居中
            this.setFormWrapMarin(loginBodyH);
        },

        setFormWrapMarin(bodyH) {
            if (!bodyH) {
                bodyH = this.$refs.loginBody.offsetHeight;
            }

            let formH = this.$refs.formWrap.offsetHeight;
            this.$refs.formWrap.style.marginTop = `${(bodyH - formH) / 2}px`;
        },

        bindEvent() {
            window.onresize = _debounce(this.setSize, 100);
        },

        // 密码登录和短信登录切换
        toggleLogin() {
            if (this.showPasswordDialog) {
                this.activeLoginText = this.passwordLoginText;
                this.activeTipText = this.codeLoginText;
            } else {
                this.activeLoginText = this.codeLoginText;
                this.activeTipText = this.passwordLoginText;
            }
            this.showPasswordDialog = !this.showPasswordDialog;
            this.errorTipText = this.showPasswordDialog ? this.passwordErrorTipText : this.codeErrorTipText;
            this.$nextTick(() => {
                this.setFormWrapMarin();
            });
        },

        // 获取token，有值，则使用token自动登录，否则，用户自行登录
        // 使用场景：每日邮件提醒，30分钟内免登录
        tokenLogin() {
            var nextUrl = this.getSearchParam('next');
            if (!nextUrl) {
                return;
            }

            var nextUrlSearch = nextUrl.substring(nextUrl.indexOf('?') + 1);
            var paramsArr = nextUrlSearch.split('&');
            var paramsObj = {};

            for (var i = 0; i < paramsArr.length; i++) {
                paramsObj[paramsArr[i].split('=')[0]] = paramsArr[i].split('=')[1];
            }

            if (paramsObj['token']) {
                var cmd = {
                    body: {
                        userToken: paramsObj['token']
                    }
                };
                this.loginRequest(cmd, 'loginByUserToken');
            }
        },

        // 从其他系统（CTMP）跳转过来，需解析token并登陆获取用户信息。
        thirdSysLogin() {
            let nextUrl = this.getSearchParam('next');
            let paramsObj = this.parseUrlparams(nextUrl);
            let singleToken = paramsObj.singleUseToken;
            if (singleToken) {
                var cmd = {
                    body: {
                        singleUseToken: singleToken
                    }
                };
                this.loginRequest(cmd, 'loginBySingleUseToken');
            }
        },

        getSearchParam(key) {
            const reg = new RegExp('(?:&?)' + key + '=([^&]*)(?:&?)', 'g');
            let results = [];
            let tempArray;
            let hashString = window.location.hash;
            let i = hashString && hashString.indexOf('?');
            let searchString = hashString.substring(i);

            while ((tempArray = reg.exec(searchString))) {
                results = results.concat(decodeURIComponent(tempArray[1]));
            }
            return results.length > 1 ? results : results[0];
        },

        // url 参数解析
        parseUrlparams(url) {
            let searchStr = url ? url.split('?')[1] : window.location.search;
            let searchArr = searchStr ? searchStr.split('&') : [];
            let paramsObj = {};
            searchArr.forEach(item => {
                let key = item.split('=')[0];
                let value = item.split('=')[1];
                paramsObj[key] = value;
            });
            return paramsObj;
        },

        // 登录请求
        loginRequest(cmd, type) {
            var self = this;
            self.loading = this.$loading(LOADING_OPTION);
            api[type](cmd.body)
                .then(res => {
                    self.loading.close();
                    self.loginSuccess(res);
                })
                .catch(res => {
                    self.loading.close();
                    if (res.code === 402) {
                        this.addErrorTip();
                    }
                    /* 后台返回的操作码
                     200=成功
                     401=未登陆
                     402=用户输入账户与密码有误
                     403=无操作权限
                     404=未找到文档
                     405=未找到项目
                     406=未找到项目组
                     407=未找到数据
                     408=查询数据为空
                     409=请求参数错误
                     410=请求失败
                     500=服务器错误
                     411=修改密码失败
                     */
                });
        },

        loginSuccess(cmdRet) {
            GaLogin.login(this);
            let result = cmdRet.result || cmdRet;
            window.localStorage.sessionId = result.sessionId;
            window.sessionStorage.loginName = result.userName;
            window.sessionStorage.loginRole = result.userRole;
            window.sessionStorage.userId = result.userId;
            window.sessionStorage.userCompany = result.userCompany;
            window.sessionStorage.userCompanyId = result.userCompanyId;

            window.sessionStorage.sessionId = result.sessionId;
            window.localStorage.loginName = result.userName;
            window.localStorage.loginRole = result.userRole;
            window.localStorage.userId = result.userId;
            window.localStorage.userCompany = result.userCompany;
            window.localStorage.userCompanyId = result.userCompanyId;
            window.localStorage.userDepartmentId = result.userDepartmentId;

            window.localStorage.setItem('userLoginData', JSON.stringify(result));

            if (result.firstLogin) {
                this.$router.push({ name: 'ModifyPassword' });
                return;
            }

            // 如果 next 字段有带地址，直接跳到指定的地址
            var nextHref = this.getSearchParam('next');
            let reg = /migu\.cn|39\.156\.1\.8|10\.148\.67\.130|10\.148\.67\.131/;
            if (nextHref && reg.test(nextHref)) {
                window.location.href = decodeURIComponent(nextHref);
            } else {
                this.$router.push({ name: 'ProjectList' });
            }
        },

        // 点击登陆按钮触发登陆事件，跳转到首页或修改密码页面
        userLogin() {
            if (this.form.username === '' || this.form.password === '') {
                this.addErrorTip();
                return false;
            }

            var cmd = {};
            var data = {
                type: '0',
                username: this.form.username,
                password: this.encryptRSA(this.form.password)
            };
            cmd['body'] = data;
            this.loginRequest(cmd, 'spmsLogin');
        },

        // 检验用户是否漏输邮箱或密码
        checkEmailAndPwd() {
            if (this.form.username === '' || this.form.username === '') {
                this.addErrorTip();
                return false;
            }
            return true;
        },

        addErrorTip() {
            this.isCapital = false;
            this.showError = true;
            setTimeout(() => {
                this.showError = false;
            }, 3000);
            COOKIE.deleteCookie('md5timeCode');
        },

        // 场景：正在倒计时刷新页面后，倒计时仍然显示
        initCodeTime(time) {
            let codeTime = window.localStorage.getItem('codeTime');
            let phone = window.localStorage.getItem('phone');
            this.codeForm.phone = phone;
            if (!codeTime) {
                return false;
            }
            let currentTime = Date.parse(new Date());
            let pastSeconds = (currentTime - codeTime) / 1000;
            if (pastSeconds < time) {
                this.isSended = true;
                this.codeTimer(time - pastSeconds);
            } else {
                localStorage.removeItem('codeTime');
                this.isSended = false;
            }
        },

        // 获取验证码后倒计时
        codeTimer(seconds) {
            this.codeBtnText = `${seconds}秒`;
            let timer;
            if (seconds === 0) {
                clearTimeout(timer);
                this.codeBtnText = '获取验证码';
                this.isSended = false;
            } else {
                timer = setTimeout(() => {
                    this.codeTimer(--seconds);
                }, 1000);
            }
        },

        // 获取手机动态码
        getDynamicCode() {
            let reg = /^1\d{10}$/;
            if (!reg.test(this.codeForm.phone)) {
                this.showPhoneError = true;
                let st = setTimeout(() => {
                    clearTimeout(st);
                    this.showPhoneError = false;
                }, 2000);
            } else {
                this.disabledGetCode = true;
                this.$refs.dynamicCodeInput.focus();
                if (this.isSended) {
                    return;
                }
                api
                    .getDynamicCode({ phone: this.codeForm.phone })
                    .then(res => {
                        this.disabledGetCode = false;
                        this.isSended = true;
                        this.codeTimer(60);
                        let codeTime = Date.parse(new Date());
                        localStorage.setItem('codeTime', codeTime);
                        localStorage.setItem('phone', this.codeForm.phone);
                    })
                    .catch(res => {
                        this.disabledGetCode = false;
                    });
            }
        },

        codeLogin() {
            if (this.codeForm.phone === '' || this.codeForm.random_code === '') {
                this.addErrorTip();
                return false;
            }

            this.loading = this.$loading(LOADING_OPTION);

            api
                .loginWithDynamicCode(this.codeForm)
                .then(res => {
                    this.loading.close();
                    this.loginSuccess(res);
                })
                .catch(() => {
                    this.loading.close();
                    this.addErrorTip();
                });
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../layouts/css/login.less';
</style>
