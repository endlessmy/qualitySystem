// Created by @dyf 20180301
/*
    *使用注意：
    1。在相应的新建或编辑页面mixin该js.
    2。注册弹窗组件<leave-page-dialog>.
    3。data里需包含commonFormName 值为 相应的表单名如：'createRequirementForm'
    4。新建页面data里需包含autoLoadFormCache 值为true
    5。如果需要（某些字段需要处理后才能赋值，如：富文本的值），页面的methods需包含formCacheCallback，可参考需求的新建页面。
    6。新建或编辑成功后需要调用deleteCreateMsg，并将isDoSave赋值为true。
*/
import leavePageDialog from 'common/components/leavePageDialog';
import CacheTip from 'common/components/CacheTip';
import api from 'common/utils/api';
import utils from 'common/utils/misc';

export default {
    components: {
        leavePageDialog,
        CacheTip
    },
    data() {
        return {
            showLeavePageDialog: false,
            leaveType: 1, // 1：留下， 2：离开，3：离开并暂存,
            createFormStr: '',
            toPath: this.$route.path,
            dataKey: decodeURI(window.location.pathname + window.location.hash),
            isDoSave: false,
            hasCache: false,
            originForm: '' // 原始form用以恢复表单数据
        };
    },
    beforeMount() {
        this.originForm = JSON.parse(JSON.stringify(this[this.commonFormName]));
        if (this.autoLoadFormCache) {
            this.loadFormCache();
        }
    },
    mounted() {
        this.addLoadListener();
    },

    beforeRouteLeave(to, from, next) {
        this.toPath = to.path;
        if (this.leaveType === 0) {
            this.leaveType = 1;
            next(false);
        } else if (
            this.isCreate === false ||
            this.createFormStr === JSON.stringify(this[this.commonFormName]) ||
            this.leaveType !== 1 ||
            this.isDoSave
        ) {
            next();
        } else if (from.query.entry === 'transfer') {
            this.showLeavePageDialog = false;
            next();
        } else {
            this.showLeavePage();
        }
    },
    methods: {
        showLeavePage() {
            this.showLeavePageDialog = true;
        },
        changeLeaveType(val) {
            this.leaveType = val;
            if (val === 3) {
                this.storeFormCache();
            }
            if (val === 2 || val === 3) {
                setTimeout(() => {
                    this.removeListener();
                    this.$router.push(this.toPath);
                });
            }
        },
        removeListener() {
            window.onunload = null;
            window.onbeforeunload = null;
        },
        addLoadListener() {
            if (this.isCreate === false) return;
            let _vm = this;
            window.onbeforeunload = onbeforeunloadHandler;
            function onbeforeunloadHandler(event) {
                let e = event || window.event;
                if (_vm.leaveType) {
                    const sessionId = localStorage.sessionId; // 退出登录后页面跳转不挽留
                    if (sessionId && _vm.createFormStr !== JSON.stringify(_vm[_vm.commonFormName]) && !_vm.isDoSave) {
                        _vm.storeFormCache();
                        e.returnValue = '确认离开吗？';
                        return '确认离开吗？';
                    }
                }
            }
        },

        storeFormCache() {
            if (typeof this.beforeStoreHandler === 'function') {
                // 做一些额外数据的保存，如：新建缺陷处理人名字的保存等；
                this.beforeStoreHandler();
            }
            let value = this[this.commonFormName];
            let files = value.attachment || value.attachmentList || [];
            files.forEach(item => {
                item.creatorId = localStorage.userId;
            });
            api.setFormCache({
                data_key: this.dataKey,
                data_value: JSON.stringify(value)
            });
        },
        loadFormCache() {
            return new Promise((resolve, reject) => {
                api.getFormCache({
                    data_key: this.dataKey
                })
                    .then(res => {
                        // mock数据返回数据不是JSON字符串格式，会报错，都转成字符串
                        // let result = JSON.stringify(res.result);
                        if (!utils.isEmpty(res.result)) {
                            this[this.commonFormName] = {
                                ...this[this.commonFormName],
                                ...JSON.parse(res.result)
                            };
                            this.hasCache = true;
                        }
                        // 部分数据变化会触发某些事件（如需求新建的changeRelatedProject），等表单数据稳定。
                        setTimeout(() => {
                            if (!utils.isEmpty(res.result) && typeof this.formCacheCallback === 'function') {
                                this.formCacheCallback(JSON.parse(res.result));
                            }
                            this.initFormStr();
                            resolve(res);
                        });
                    })
                    .catch(e => {
                        reject(e);
                    });
            });
        },
        deleteFormCache() {
            api.deleteFormCache({
                data_key: this.dataKey
            }).then(res => {
                this.hasCache = false;
            });
        },
        initFormStr() {
            setTimeout(() => {
                this.createFormStr = JSON.stringify(this[this.commonFormName]);
            }, 1000);
        },
        clearWithOriginForm(richText = '', initStr = '') {
            this.deleteFormCache();
            this[this.commonFormName] = this.originForm;
            if (typeof this.initRichText === 'function') {
                this.initRichText('', initStr);
            }
            if (typeof this.removeExtra === 'function') {
                this.removeExtra();
            }
            setTimeout(() => {
                this.initFormStr();
            });
        }
    }
};
