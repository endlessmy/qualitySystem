import Vue from 'vue';
import {sync} from 'vuex-router-sync';
import store from './store';
import router from './router';
import App from './App';
import Viewer from 'viewerjs';
import 'common/directives';

Vue.prototype.Viewer = Viewer;

sync(store, router);

new Vue({
    el: '#root',
    store, // 注入store仓库
    router,
    render: h => h(App)
});
