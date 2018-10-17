import isEmpty from 'lodash.isempty';
import _uniqby from 'lodash.uniqby';
import qs from 'querystring';
import Vue from 'vue';
import md5 from 'md5';

const GlobalView = new Vue({});
const utils = {
    changeServiceApi(url) {
        let newUrl = '';
        let oldApiServiceList = ['FileService', 'PermitService', 'DeviceService', 'Worklog', 'workorder'];
        let isOldApiService = oldApiServiceList.some((service) => url.indexOf(service) !== -1);
        if (isOldApiService) {
            newUrl = url.replace('cloudapi', 'spmsapi');
        } else {
            newUrl = url;
        }
        return newUrl;
    },

    on(type, fn) {
        GlobalView.$on(type, fn);
    },

    off(type) {
        GlobalView.$off(type);
    },

    trigger(type, args, args1, args2) {
        GlobalView.$emit(type, args, args1, args2);
    },

    getDocSize() {
        return {
            w: document.body.clientWidth,
            h: document.body.clientHeight
        };
    },

    getEventPos(e) {
        if (e.pageX || e.pageY) {
            return {
                x: e.pageX,
                y: e.pageY
            };
        }

        return {
            x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: e.clientY + document.body.scrollTop - document.body.clientTop
        };
    },

    progressRule(val) {
        /// ^\+?[1-9][0-9]*$/校验是否是正整数
        return val > 0 && val <= 100 && /^\+?[1-9][0-9]*$/.test(val);
    },

    isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },

    isEmpty(value) {
        return isEmpty(value);
    },

    trim(value) {
        return `${value}`.replace(/^\s*|\s*$/g, '');
    },

    formatLargeData(value) {
        return `${value}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },

    parseJSON(value) {
        value = `${value}`;
        try {
            value = JSON.parse(value);
        } catch (e) {
            value = eval('(' + value + ')');
        }
        return value;
    },

    // 格式化日期，将Date实例转换成格式化的字符串
    formatDate(date, showHours = false) {
        if (date === '' || date === undefined) return '';
        if (typeof date === 'string') return date;
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        let extra = '';
        if (showHours) {
            // @qqli 2018-02-26
            const hours = `0${date.getHours()}`.slice(-2);
            const minutes = `0${date.getMinutes()}`.slice(-2);
            const seconds = `0${date.getSeconds()}`.slice(-2);
            extra = ` ${hours}:${minutes}:${seconds}`;
        }
        return `${year}-${month}-${day}${extra}`;
    },

    formatDate2(d) {
        // 和formatDate返回格式不同
        let date = new Date(d);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}${month}${day}`;
    },
    /*
     yewence
     格式化选择时间，第一个开始时间，第二个结束时间
     */
    formatDateStartToEnd(start, end, showHours = true) {
        let result = [];

        function format(time, from) {
            if (!time) {
                return false;
            }
            const year = time.getFullYear();
            const month = `0${time.getMonth() + 1}`.slice(-2);
            const day = `0${time.getDate()}`.slice(-2);
            const hour = from === 'start' ? '00' : '23';
            const minute = from === 'start' ? '00' : '59';
            const second = from === 'start' ? '00' : '59';
            if (showHours) {
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            }
            return `${year}-${month}-${day}`;
        }

        result.push(format(start, 'start'));
        result.push(format(end, 'end'));
        return result;
    },
    stringify(params) {
        return qs.stringify(params);
    },

    checkVariable(context, val) {
        return new Promise((resolve, reject) => {
            if (context[val]) {
                resolve(val);
            } else {
                const timer = setInterval(() => {
                    if (context[val]) {
                        clearInterval(timer);
                        resolve(val);
                    }
                }, 100);
            }
        });
    },

    // 判断字符串是否是空的，即''或'  '
    isNull(str) {
        if (str === '') {
            return true;
        }
        let regu = '^[ ]+$';
        let re = new RegExp(regu);
        return re.test(str);
    },

    // 判断变量是否为'空'
    not_empty(val) {
        if (val === '' || val === undefined || val == null) {
            return false;
        }
        return true;
    },

    numberTransform(number) {
        if (isNaN(number)) {
            return 0;
        } else if (number === Infinity) {
            return 1;
        } else if (number === -Infinity) {
            return -1;
        } else {
            return number.toFixed(2);
        }
    },
    // 判断是正式环境或非正式环境
    isFormalEnv() {
        const hostName = window.location.hostname;
        if (hostName === 'spms.migu.cn' || hostName === '10.148.67.130' || hostName === '10.124.1.51') {
            return true;
        }
        return false;
    },

    // dashboard文件中调用，节流
    throttle(fn, context, time = 50) {
        return () => {
            clearTimeout(fn.id);
            fn.id = setTimeout(() => {
                fn.call(context);
            }, time);
        };
    },
    // dashboard文件中调用
    onscroll() {
        try {
            let mainScroll = document.querySelector('#mainScroll');
            let mainHeader = document.querySelector('#mainHeader');
            if (mainScroll && mainHeader) {
                mainScroll.onscroll = null;
                mainScroll.addEventListener(
                    'scroll',
                    utils.throttle(() => {
                        // console.log('滚动')
                        if (mainScroll.scrollTop >= 20) {
                            mainHeader.classList.add('s-shadow');
                        } else {
                            mainHeader.classList.remove('s-shadow');
                        }
                    }, null)
                );
            }
        } catch (err) {}
    },
    // 以下是文件模块的方法
    isPic(fileSuffix) {
        let reg = /(jpg|png|gif|bmp|jpeg|JPG|PNG|GIF|BMP|JPEG)/i;
        return reg.test(fileSuffix);
    },

    isDoc(fileSuffix) {
        let reg = /(doc|docx|xls|xlsx|ppt|pptx|txt|pdf|vsd|xlsm)/i;
        return reg.test(fileSuffix);
    },

    openTip(component, message) {
        component.$alert(message, '提示', {
            // confirmButtonText: '确定',
            callback: action => {
                /* component.$message({
                 type: 'info',
                 message: `action: ${ action }`
                 }); */
            }
        });
    },
    // 以下是缺陷模块
    // 根据关键子key在数组dataSet中查找值为val的元素
    // 输入参数错误或者查找失败，返回-1，否则返回元素索引
    _findIdx(dataSet, key, val) {
        if (!(dataSet instanceof Array) || typeof key !== 'string' || val === undefined) {
            return -1;
        }

        for (let i = 0; i < dataSet.length; ++i) {
            if (dataSet[i][key] === val) {
                return i;
            }
        }
        return -1;
    },

    // 以下是需求模块+项目模块+反馈模块+权限plus
    storeHistory(path) {
        localStorage.setItem('historyPath', path);
    },

    getHistory() {
        return localStorage.getItem('historyPath');
    },
    // 以下是项目看板模块

    // 控制项目的新建业务需求和业务需求模块的新建按钮的显示
    // companyFlag 1：咪咕，0：外协
    isOwnEmployee() {
        // 判断是否是外协
        // 自有员工1  外协员工0
        return utils.getLoginUserInfo('companyFlag');
    },

    // 以下是除文档模块以外的所有模块进行在线预览的操作
    // 鼠标悬浮标题是否显示手型
    // v2.1.2版本开放四个视频格式文件（mkv|ogg|webm|wmv）
    goCursor(theItem) {
        let reg = /(jpg|png|gif|bmp|jpeg|txt|pdf|doc|docx|xls|xlsx|ppt|pptx|md|mp4|wmv|mkv|webm|ogg)/i;
        let fileSuffix;
        if (!theItem.fileName) {
            let index = theItem.file_name.lastIndexOf('.');
            if (index > -1) {
                fileSuffix = theItem.file_name.substring(index + 1);
            }
        }
        if (!theItem.file_name) {
            let index = theItem.fileName.lastIndexOf('.');
            if (index > -1) {
                fileSuffix = theItem.fileName.substring(index + 1);
            }
        }
        if (fileSuffix != null) {
            fileSuffix = fileSuffix.toLowerCase();
            if (reg.test(fileSuffix)) {
                return true;
            }
        } else {
            return false;
        }
    },
    filePreView(row, component, attacheIndex, isTemplate = false) {
        if (utils.isDoc(row.fileSuffix)) {
            // 文件的预览
            // 文件预览新开窗口
            // let isFF = window.navigator.userAgent.indexOf('Firefox') !== -1;
            // let newTab = window.open(isFF ? '' : '_blank', '文件浏览');

            let fileId = row.fileId;
            let fileName = row.fileName;
            let serviceData = row.serviceData;
            let filePath = isTemplate
                ? window.location.protocol +
                '//' +
                window.location.host +
                window.config.context +
                '/DocumentService/attachment/template/preview/service/' +
                serviceData +
                '/file/' +
                fileId +
                '/' +
                fileName +
                '?sessionId=' +
                utils.getLoginUserInfo('sessionId')
                : window.location.protocol +
                '//' +
                window.location.host +
                window.config.context +
                '/DocumentService/attachment/preview/service/' +
                serviceData +
                '/file/' +
                fileId +
                '/' +
                fileName +
                '?sessionId=' +
                utils.getLoginUserInfo('sessionId');
            if (row.previewFlag) {
                // 已生成预览文件
                let path = `../document/vendors/pdfjs/web/viewer.html?file=${encodeURIComponent(filePath)}`;
                // window.open(path, '文件浏览');
                return path;
                // newTab.location.href = path;
            } else {
                // component.showWarningMsg("阅读文件正在生成，请稍后再试");
            }
        } else if (utils.isPic(row.fileSuffix)) {
            // 图片的预览
            // 取得当前行数据的index
            let imgIndex = attacheIndex;
            // 取得包含当前目录图片列表的ul标签
            let ulExist = document.getElementById('filesToBrowseImgList');
            // 取得当前目录图片列表
            // let imgList = ulExist.getElementsByTagName("img");
            let imgList = document.querySelectorAll('#filesToBrowseImgList img');
            // 打开图片浏览
            if (imgList.length && imgList.length > 0) {
                component.viewer = new component.Viewer(ulExist, {
                    hide: function() {
                        viewer.destroy();
                    },
                    shown: function() {
                        // 设置当前要显示图片的索引
                        viewer.view(document.getElementById('picToBrowse_' + imgIndex).getAttribute('attrIndex'));
                    },
                    zIndex: 9999,
                    rotatable: false,
                    scalable: false,
                    fullscreen: false
                });

                var viewer = component.viewer;
                viewer.show();
            }
        }
    },

    /* dyf add start */
    getDom(id) {
        return document.getElementById(id);
    },

    // fix ie scroll bar
    setHeight() {
        if ('ActiveXObject' in window) {
            document.querySelector('.container-main>.main').style.height = document.body.clientHeight;
        }
    },

    // 二级菜单和内容拖动改变二者宽度
    bindDraggableEvent() {
        var domContainer = utils.getDom('container');
        var domSecNav = utils.getDom('secondNav');
        var domDraggableLine = utils.getDom('draggableLine');

        if (!domDraggableLine) return;

        domDraggableLine.onmousedown = function(e) {
            var disX = (e || event).clientX;
            domDraggableLine.left = domDraggableLine.offsetLeft;

            document.onmousemove = function(e) {
                var iT = domDraggableLine.left + ((e || event).clientX - disX);
                if (iT < 160 || iT > 350) {
                    // 限制最大和最小尺寸
                    return;
                }
                e = e || window.event;
                var maxT = domContainer.clientWidth - domDraggableLine.offsetWidth;

                domDraggableLine.style.margin = 0;
                iT < 0 && (iT = 0);
                iT > maxT && (iT = maxT);
                domDraggableLine.style.left = iT - 7 + 'px';
                domSecNav.style.width = iT + 'px';
                return false;
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
                domDraggableLine.releaseCapture && domDraggableLine.releaseCapture();
            };

            domDraggableLine.setCapture && domDraggableLine.setCapture();
            return false;
        };
    },

    getLoginUserId() {
        return utils.getLoginUserInfo('userId'); // 44 createrid-11
    },

    // HTML标签转义及反转义
    HTMLEncode(html) {
        var temp = document.createElement('div');
        temp.textContent != null ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.innerHTML;
        temp = null;
        return output;
    },

    // HTML标签反转义
    HTMLDecode(text) {
        let temp = document.createElement('div');
        temp.innerHTML = text;
        let output = temp.innerText || temp.textContent || '';
        temp = null;
        return output;
    },
    scrollToInvalidFormItem() {
        let errorDomList = document.querySelectorAll('.el-form-item.is-error');
        let neededFocusDom;
        let flag = true;
        for (var i = errorDomList.length - 1; i >= 0; i--) {
            let dom = errorDomList[i].querySelector('input');
            errorDomList[i].querySelectorAll('div');
            neededFocusDom = dom || neededFocusDom;
            let nofocusElement = errorDomList[i].querySelectorAll('div.nofocus');
            if (nofocusElement.length > 0) {
                flag = false;
            } else {
                flag = true;
            }
        }
        if (neededFocusDom) {
            if (flag) {
                neededFocusDom.focus();
            }
        } else if (errorDomList[0]) {
            errorDomList[0].scrollIntoView(false);
        }
        // let inputInnerDom = neededFocusDom.querySelector(".el-input__inner") || neededFocusDom.querySelector(".w-e-text");
        // // 富文本编辑框校验获取不到 .el-input__inner, focus 会报错
        // inputInnerDom && inputInnerDom.focus();
        // errorDomList = neededFocusDom = inputInnerDom = null;
    },
    // 获取url参数key为name的值
    getQueryString(name) {
        let val = '';
        let idx = window.location.hash.indexOf('?');
        if (idx === -1) {
            return '';
        }
        let paramsArr = window.location.hash.substring(idx + 1).split('&');
        paramsArr.forEach((item, idx) => {
            if (item.indexOf(name) !== -1) {
                val = item.substr(item.indexOf('=') + 1);
            }
        });
        return val;
    },
    // 获取url参数对象
    getQueryObj() {
        let obj = {};
        let idx = window.location.hash.indexOf('?');
        if (idx === -1) {
            return obj;
        }
        let paramsArr = window.location.hash.substring(idx + 1).split('&');
        paramsArr.forEach(item => {
            let splitArr = item.split('=');
            obj[splitArr[0]] = splitArr[1];
        });
        return obj;
    },

    jsonify(obj) {
        var seen = [];
        var json = JSON.stringify(
            obj,
            function(key, value) {
                if (typeof value === 'object') {
                    if (!seen.indexOf(value)) {
                        return '__cycle__' + typeof value + '[' + key + ']';
                    }
                    seen.push(value);
                }
                return value;
            },
            4
        );
        return json;
    },
    // 同步的ajax
    ajaxSync(data, url, type = 'post', callback) {
        let xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        // 发送请求
        let parms = typeof data === 'object' ? data : {};
        xhr.setRequestHeader('user-sessionid', sessionId);
        xhr.setRequestHeader('request-sessionid', md5(url + sessionId + (params ? JSON.stringify(params) : '')));
        // url = window.config.context + url;
        xhr.open(type, url, false);
        xhr.send(JSON.stringify(parms));
        // 同步接受响应
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // 实际操作
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }
    },
    numToChinese(num) {
        const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const chnUnitChar = ['', '十', '百', '千'];
        let strIns = '';
        let chnStr = '';
        let unitPos = 0;
        let zero = true;
        let select = num;
        while (select > 0) {
            var v = select % 10;
            if (v === 0) {
                if (!zero) {
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            } else {
                zero = false;
                strIns = num >= 10 && num < 20 && unitPos === 1 ? '' : chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            select = Math.floor(select / 10);
        }
        return chnStr;
    },
    replaceSessionId(desc) {
        const oldSessionIdRegE = /\?sessionId=([a-zA-Z0-9]+)/g;
        let newDetailInfo = desc;
        if (desc && typeof desc === 'string') {
            newDetailInfo = desc.replace(oldSessionIdRegE, '?sessionId=' + (utils.getLoginUserInfo('sessionId') || 'abcd123123'));
            // return newDetailInfo;
        }

        if (typeof desc === 'string' && desc.indexOf('&lt') > -1) {
            return utils.HTMLDecode(newDetailInfo || '--');
        } else {
            return newDetailInfo;
        }
    },
    /* dyf add end */
    /* xiaoshen add start */
    /**
     * 获取中文个数
     * @param str 传入的字符串
     * @param isChange 是否把不是中文的转化为中文个数(2个别的字符相当与1个中文字符)
     */
    getChineseLength(str, isChange = false) {
        let rule = /[\u4E00-\u9FA5]/g;
        let chineseLength = str.match(rule) ? str.match(rule).length : 0;
        let noChineseLength = str.length - chineseLength;
        if (isChange) {
            chineseLength += noChineseLength / 1.5;
        }
        return chineseLength;
    },
    /**
     * 最多显示length个剩下的用...来表示
     * @param {*传入的字符串} item
     * @param {*超过多少个字显示...} length
     */
    overName(item, length) {
        if (item.length > length) {
            return item.slice(0, length) + '...';
        }
        return item;
    },
    /**
     * 获取用户登录信息
     * @param {字段} field
     */
    getLoginUserInfo(field) {
        if (!localStorage.getItem('userLoginData')) return '';
        let loginUser = JSON.parse(localStorage.getItem('userLoginData'));
        if (field) {
            return loginUser[field];
        } else {
            return loginUser;
        }
    },
    /* xiaoshen add end */
    /*
    by 罗怀梁
    将字典内容；
        [{label: "文字1", value: 01}, {label: "文字2", value: 02}]
    转换为数据map：
        {"文字1": 01, "文字2": 02}
    */
    listToMap(lists) {
        let obj = {};
        if (lists instanceof Array) {
            lists.forEach(list => {
                obj[list.label] = list.value;
            });
        }
        return obj;
    },

    // @qqli 去重并处理成label和value
    uniqSelectOption(list, fieldForLabel, fieldForValue) {
        let selectOptionList = [];
        let arr = _uniqby(list, 'userId');

        arr.map(item => {
            selectOptionList.push({
                label: item[fieldForLabel],
                value: item[fieldForValue]
            });
        });

        return selectOptionList;
    }
};
export const GlobalViews = GlobalView;
export default utils;
