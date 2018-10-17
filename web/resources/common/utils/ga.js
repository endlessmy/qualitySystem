
export const GA_LOGIN = {
    login(component) {
        component.$ga.event({
            eventCategory: 'Login',
            eventAction: 'login',
            eventLabel: '用户登录',
            eventValue: null
        });
    }
};
export const GA_FIRST_NAV = {
    searchUser(component) {
        component.$ga.event({
            eventCategory: 'FirstNavSearchUser',
            eventAction: 'open',
            eventLabel: '点击一级菜单人员查找',
            eventValue: null
        });
    },
    app(component, module) {
        component.$ga.event({
            eventCategory: `FirstNavClickApp`,
            eventAction: 'click',
            eventLabel: `点击首页一级菜单应用-${module}`,
            eventValue: null
        });
    }
};

export const GA_HOME = {
    create(component) {
        component.$ga.event({
            eventCategory: 'HomeCreateOpen',
            eventAction: 'open',
            eventLabel: '打开首页新建',
            eventValue: null
        });
    },
    createModule(component, module) {
        component.$ga.event({
            eventCategory: `HomeCreate`,
            eventAction: 'click',
            eventLabel: `点击首页新建-${module}`,
            eventValue: null
        });
    },
    todoLink(component, module) {
        component.$ga.event({
            eventCategory: 'HomeTodoLink',
            eventAction: 'click',
            eventLabel: `点击首页待我处理上链接-${module}`,
            eventValue: null
        });
    },
    todoOpetate(component, module) {
        component.$ga.event({
            eventCategory: 'HomeTodoOperate',
            eventAction: 'click',
            eventLabel: `点击首页待我处理上操作按钮-${module}`,
            eventValue: null
        });
    },
    commonUseApp(component, module, id) {
        component.$ga.event({
            eventCategory: 'HomeCommonUserApp',
            eventAction: 'click',
            eventLabel: `点击首页常用应用-${module}`,
            eventValue: id
        });
    },
    appMore(component, module, id) {
        component.$ga.event({
            eventCategory: 'HomeAppMore',
            eventAction: 'click',
            eventLabel: `点击首页应用更多应用-${module}`,
            eventValue: id
        });
    }
};
