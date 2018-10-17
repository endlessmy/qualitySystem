import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAnalytics from 'vue-analytics';
import Utils from 'common/utils/misc';

import Dashboard from './containers/dashboard';
import ProjectList from './containers/projectList';
import ProjectCreate from './containers/projectCreate';

import Login from './containers/login/login';
import LoginDashboard from './containers/loginDashboard';
import ForgetPwd from './containers/password/forgetPassword';
import SetNewPwd from './containers/password/setNewPassword';
import SetPwdSuccess from './containers/password/setPasswordSuccess';
import ModifyPassword from './containers/password/modifyPassword';

import AppMore from './containers/appMore';
import AppList from './containers/appList';
import AppCreateOrEdit from './containers/appCreateOrEdit';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/login',
            component: Login,
            name: 'Login'
        },
        {
            path: '/loginDashboard/',
            component: LoginDashboard,
            children: [
                {
                    path: 'forgetPwd',
                    component: ForgetPwd,
                    name: 'ForgetPwd'
                },
                {
                    path: 'setNewPwd',
                    component: SetNewPwd,
                    name: 'SetNewPwd'
                },
                {
                    path: 'setPwdSuccess',
                    component: SetPwdSuccess,
                    name: 'SetPwdSuccess'
                }
            ]
        },
        {
            path: '/home/',
            component: Dashboard,
            children: [
                {
                    path: 'projectCreate',
                    component: ProjectCreate,
                    name: 'ProjectCreate'
                },
                {
                    path: 'projectList',
                    component: ProjectList,
                    name: 'ProjectList'
                },
                {
                    path: 'appMore',
                    component: AppMore,
                    name: 'AppMore'
                },
                {
                    path: 'modifyPassword',
                    component: ModifyPassword,
                    name: 'ModifyPassword'
                },
                {
                    path: 'appList',
                    component: AppList,
                    name: 'AppList'
                },
                {
                    path: 'appCreate',
                    component: AppCreateOrEdit,
                    name: 'AppCreate'
                },
                {
                    path: 'appEdit/:serviceId',
                    component: AppCreateOrEdit,
                    name: 'AppEdit'
                }
            ]
        },
        { path: '/', redirect: '/login' }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        next('/login');
    } else {
        next();
    }
});

Vue.use(VueAnalytics, {
    id: Utils.isFormalEnv() ? 'UA-110866843-1' : 'UA-X',
    router: router
});

export default router;
