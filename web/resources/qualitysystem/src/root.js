import Vue from 'vue';
import store from './store';
import router from './router';
import { sync } from 'vuex-router-sync';
import App from './App';
import 'common/directives';

sync(store, router);
new Vue({
    el: '#root',
    store, // 注入store仓库
    router,
    render: h => h(App)
});
// test
