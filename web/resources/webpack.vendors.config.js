const path = require('path');
const output = path.join(__dirname, '..', 'static/common/js');

module.exports = {
    path: output,
    libs: ['vue',
        'vuex',
        'vue-router',
        'vuex-router-sync',
        'whatwg-fetch',
        'es6-promise',
        'querystring',
        'jquery']
};
