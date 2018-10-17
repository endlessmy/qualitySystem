import 'es6-promise';
import 'whatwg-fetch';
import { Message } from 'element-ui';
import axios from 'axios';
import qs from 'querystring';
import md5 from 'md5';
import isEmpty from 'lodash.isempty';
import { COMMON_LOGIN_ROUTER } from 'common/constants/const';
import utils from 'common/utils/misc';

const CODE_SUCCESS = 200;
const CODE_SESSION_EXPIRE = 401;
const NO_VIEW_RECORD_PERMISSION = 424;

const METHODS = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
};

// errorTipType 登录 none 不显示错误提示， warning 警告
const request = (url, params, headers = {}, method = METHODS.GET, jsonType = true, errorTipType = 'error') => {
    // let data = {
    //     'code': 0,
    //     'remark': null,
    //     'sessionId': 'f239770d1be5797a7dee20a5d63dd641',
    //     'userId': 7297,
    //     'userName': '贾敏',
    //     'userMail': '945159358@qq.com',
    //     'userTel': '18381335964',
    //     'userCompany': '咪咕文化科技有限公司',
    //     'userDepartment': 'TSG-平台能力单元',
    //     'userDepartmentId': 1082,
    //     'userRoleId': 2,
    //     'userRole': '项目经理',
    //     'firstLogin': false,
    //     'userCompanyId': 1,
    //     'userPy': 'jiaminwx',
    //     'belongLocation': 'C',
    //     'departmentFlag': 1,
    //     'companyFlag': 1,
    //     'virtualGroupId': 10001,
    //     'virtualGroupName': 'TSG',
    //     'isAdmin': false,
    //     'userNickName': null
    // };

    // localStorage.setItem('userLoginData', JSON.stringify(data));
    let sessionId = utils.getLoginUserInfo('sessionId') || '13c6b946898a0bce7e19f887cd12387e';
    var options = {
        headers: {
            'Content-Type': jsonType ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded',
            'user-sessionid': sessionId,
            'request-sessionid': md5(url + sessionId + (params ? JSON.stringify(params) : ''))
        },
        timeout: 20000,
        method: method,
        responseType: 'json'
    };

    // && !isEmpty(params) ?为什么要判断空
    // if (method !== METHODS.GET && !isEmpty(params)) {
    if (method !== METHODS.GET) {
        // 文件上传
        if (headers === 'file') {
            delete options.headers['Content-Type'];
            delete options.timeout;
            let formData = new FormData();
            params.map(data => {
                formData.append(data.key, data.value);
            });
            options.headers['Content-Type'] = 'multipart/form-data';
            options.data = formData;
        } else {
            options.data = jsonType ? JSON.stringify(params) : qs.stringify(params);
        }
    } else if (method === METHODS.GET && !isEmpty(params)) {
        const newParams = (~url.lastIndexOf('?') ? '&' : '?') + qs.stringify(params);
        url += newParams;
    }

    url = window.config.context + url;
    url = utils.changeServiceApi(url); // 调用misc里方法修改FileService服务调用走spmsapi网关

    return axios(url, options)
        .then(checkRespStatus(errorTipType))
        .catch(error => {
            if (!error.code && !navigator.onLine) {
                // 因无网络而出错的情况
                Message.error({
                    message: '网络出错，请重试',
                    type: 'error',
                    showClose: false
                });
            }
            if (error.message && error.message.indexOf('timeout') > -1) {
                Message.error({
                    message: '请求超时，请重试',
                    type: 'error',
                    showClose: false
                });
            }
            return new Promise((resolve, reject) => {
                // 返回错误回调
                reject(error);
            });
        });
};

const checkRespStatus = errorTipType => resp => {
    if (resp.status !== 200) {
        console.log('Server error occurred');
        return window.Promise.reject('Server error occurred');
    }
    // 等价于 fetch respPromise.json().then(resp => {}); 的 resp;
    // 服务端响应的json字段
    let data = resp.data;
    return new Promise((resolve, reject) => {
        if (resp && data.code === CODE_SUCCESS) {
            resolve(data);
        } else if (resp && data.code === CODE_SESSION_EXPIRE) {
            // 页面超时，重新刷新页面
            localStorage.clear();
            if (window.location.href.indexOf('login') !== -1) return;
            window.location.href = `${COMMON_LOGIN_ROUTER}?next=${encodeURIComponent(window.location.href)}`;
        } else if (resp && data.code === NO_VIEW_RECORD_PERMISSION) {
            // 业务需求，详情之间跳转，没有权限时清空缓存的面包屑
            sessionStorage.removeItem('linkBreadStr');
            history.go(-1);
            Message.error({
                message: '您没有权限访问',
                type: 'error',
                showClose: false
            });
        } else {
            reject(data);
            if (errorTipType !== 'none' && data.remark) {
                let msgHandler = typeof Message[errorTipType] === 'function' ? Message[errorTipType] : Message.error;
                msgHandler({
                    message: data.remark,
                    type: errorTipType,
                    showClose: false
                });
            }
        }
    });
};
const post = (url, params, headers, methods = METHODS.POST, jsonType = true, errorTipType) =>
    request(url, params, headers, methods, jsonType, errorTipType);
// const post = (url, params, headers) => request(url, params, headers, METHODS.POST, true);
export const get = (url, params, headers) => request(url, params, headers, METHODS.GET, true);
export default post;
