/**
 * Created by qqli on 2017/9/1.
 */
import utils from 'common/utils/misc';

export default {
    methods: {
        // 首次进入页面时，根据窗口大小显示列表数量
        pageSizeFit(para1, para2, winFlag = true) {
            var mHeight = 0;
            if (winFlag) {
                // 可以在beforeMount里调用
                let winHeight = window.innerHeight;
                mHeight = winHeight - 236; // 236为:一级菜单+面包屑+内容区域上下padding+‘全部列表’+th(的高度)
            } else {
                // 二级菜单数据多，产生滚动条时调用
                let secondNav = document.querySelector('.second-nav');
                mHeight = secondNav.clientHeight - 186; // 236-一级菜单
            }
            if (mHeight > 364) {
                // 页面min-height为600，减去以上高度
                let ua = navigator.userAgent;
                let ie = ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1 || ua.indexOf('MSIE ') !== -1;
                if (ie) {
                    mHeight = mHeight - 10;
                }
                this[para1][para2] = Math.floor(mHeight / 47); // 每条数据高度47
            } else {
                this[para1][para2] = 8;
            }
        },
        // 富文本框编辑数据初始化,des为参数描述参数名 by dengxue
        initRichText(str, inItStr) {
            let paramsDesc = str || inItStr;
            let commonDesc = '';
            if (paramsDesc) {
                if (paramsDesc && paramsDesc.indexOf('<') === 0) {
                    commonDesc = paramsDesc || '';
                } else {
                    commonDesc = utils.HTMLDecode(paramsDesc || '');
                }
                const oldSessionIdRegE = /\?sessionId=([0-9a-zA-Z]*?)([&|"|'])/gi;
                if (commonDesc) {
                    commonDesc = commonDesc.replace(oldSessionIdRegE, function(word, $1, $2) {
                        return '?sessionId=' + window.localStorage.sessionId + $2;
                    });
                }
            }
            this.editorInstance.txt.html(commonDesc);
        },
        getLoginUserName() {
            return utils.getLoginUserInfo('userName');
        },
        getLoginUserId() {
            return utils.getLoginUserInfo('userId');
        },
        // @qqli 2018-05-17 校验表单的某个字段,目前校验编辑器
        validFormProp(propName, formName) {
            this.$refs[formName].validateField(
                propName,
                errorMsg => errorMsg // errorMsg 通过校验时为'',否则为配置的errorMsg
            );
        },
        // taskform及分配任务使用
        // 有时分秒的时间插件，点击截止时间选框外关闭弹窗时将时间更新
        dateTimePanelNone() {
            if (this.$refs.datePicker.picker) {
                this.$refs.datePicker.picker.confirm();
            }
        },
        // 设置默认截止时间为当天18:00,setTime为数组[18,0,0]
        getNowTime(formName, propName, setTime) {
            let date = new Date();
            let hour = 18;
            let minute = 0;
            let sec = 0;
            if (setTime && setTime.length === 3) {
                hour = setTime[0];
                minute = setTime[1];
                sec = setTime[2];
            }
            date.setHours(hour);
            date.setMinutes(minute);
            date.setSeconds(sec);
            this[formName][propName] = date;
        },
        // safari 表格竖线不对齐
        fixSafariTableLine() {
            this.$nextTick(() => {
                if (!/Chrome/g.test(navigator.userAgent) && /Safari/g.test(navigator.userAgent)) {
                    this.$refs.tableBorder.$el.querySelector('th.gutter').style.display = 'none';
                }
            });
        }
    }
};
