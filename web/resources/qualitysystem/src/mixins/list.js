/**
 * @description:将列表的公共方法整理到此文件中
 * @author: jjq
 * @date：2018/8/1
 */
import {
    FILTER_LABEL,
    HEADER_NAME,
    HEADER_NAME_DEV
} from '../constants/const';

import HeaderSelectUser from 'common/components/headerSelect/HeaderSelectUser';
import HeaderMultSelect from 'common/components/headerSelect/HeaderMultSelect';
import HeaderLocalSelector from 'common/components/headerSelect/HeaderLocalSelector';
import HeaderVersionSelect from 'common/components/headerSelect/HeaderVersionSelect';
import HeaderTip from '../components/headerTip';
import HeaderFilterMixins from 'common/mixins/headerFilter';
import api from '../utils/api';

export default {
    components: {
        HeaderMultSelect,
        HeaderSelectUser,
        HeaderLocalSelector,
        HeaderVersionSelect,
        HeaderTip
    },
    mixins: [HeaderFilterMixins],
    data() {
        return {
            removeFilterParams: {
                service: 'QualityService',
                requestList: this.requestList
            },
            currentYear: '',
            currentQuarter: '',
            currentDate: '',
            actualYear: '', // 实际的年，而非用户可以选择改变的年
            actualQuarter: '', // 实际的季度
            recoverFlag: false, // 是否复原实际年与季度的标志
            currentProjectId: '',
            quarterDisabledOne: false, // 控制季度是否置灰与可选
            quarterDisabledSecond: false, // 控制季度是否置灰与可选
            quarterDisabledThird: false, // 控制季度是否置灰与可选
            quarterDisabledFourth: false // 控制季度是否置灰与可选
        };
    },
    computed: {},
    watch: {
        recoverFlag(newVal) {
            if (newVal) {
                this.quarterDisabledControl(this.actualQuarter, this.actualYear);
                this.recoverFlag = false;
            }
        }
    },
    methods: {
        quarterDisabledControl(quarterVal, yearVal) {
            let actualYearNumber = Number(yearVal); // 实际的年
            let actualQuarterNumber = Number(quarterVal.substring(1, 2)); // 实际的季度
            let tempNumber = Number(this.currentQuarter.substring(1, 2)); // 当前选择的季度
            let tempYear = Number(this.currentYear); // 当前选择的年

            if (tempYear < actualYearNumber) {
                // 小于实际年的情况，则四个季度均可选
                this.quarterDisabledFourth = false;
                this.quarterDisabledThird = false;
                this.quarterDisabledSecond = false;
            } else {
                // 选择的年与实际年相同的情况，根据实际季度控制以后季度是否可选
                if (tempNumber > actualQuarterNumber) {
                    // 若选择的季度大于实际的季度，则回到实际年实际季度的情况
                    this.currentQuarter = 'Q' + actualQuarterNumber;
                    this.requestParams.quarter = this.currentQuarter;
                    if (this.chartRequestParams) {
                        this.chartRequestParams.quarter = this.currentQuarter;
                    }
                    this.recoverFlag = true;
                } else {
                    // 若选择的季度小于等于实际季度
                    if (actualQuarterNumber < 4) {
                        this.quarterDisabledFourth = true;
                    }
                    if (actualQuarterNumber < 3) {
                        this.quarterDisabledThird = true;
                    }
                    if (actualQuarterNumber < 2) {
                        this.quarterDisabledSecond = true;
                    }
                }
            }
        },

        // 排序
        sortChange(obj) {
            if (obj.order !== null && obj.prop !== null) {
                // descending 降序， ascending 升序
                obj.order === 'descending' ? this.requestParams.sortFieldType = 'DESC' : this.requestParams.sortFieldType = 'ASC';
                this.requestParams.pageNo = 1;
                this.requestParams.sortFields = obj.prop; // 排序的字段
            } else {
                this.requestParams.sortFieldType = '';
                this.requestParams.sortFields = '';
            }
            this.requestList();
        },

        // 设置每一个tr的class name
        setRowClassName(row, index) {
            row.index = index;
            return `tr-row-${index}`;
        },
        // 表头名字与提示的渲染
        renderTipIcon(h, {
            column,
            $index
        }) {
            let tempObj = {
                headerName: column.label,
                headerTip: HEADER_NAME[column.property],
                headerProperty: column.property
            };
            return h(HeaderTip, {
                props: {
                    tipParams: tempObj
                }
            });
        },
        // 表头名字与提示的渲染——维度开发
        renderTipIconDev(h, {
            column,
            $index
        }) {
            let tempObj = {
                headerName: column.label,
                headerTip: HEADER_NAME_DEV[column.property],
                headerProperty: column.property
            };
            return h(HeaderTip, {
                props: {
                    tipParams: tempObj
                }
            });
        },
        // 表头筛选负责人
        renderApprover(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectNameKey: 'user_id',
                selectName: '负责人',
                options: '',
                requestList: this.requestList
            };
            return h(HeaderSelectUser, {
                props: {
                    selectUserParams: tempObj,
                    apiFun: api.queryUserInManagers,
                    userKey: 'user_name',
                    userId: 'user_id',
                    userName: 'user_name'
                },
                key: 'user_id'
            });
        },

        // 渲染项目名称
        renderProjects(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectNameKey: 'project_id',
                selectName: '项目名称',
                options: this.projectList,
                requestList: this.requestList,
                isMultiple: false
            };
            return h(HeaderLocalSelector, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'project_id'
            });
        },
        // 渲染大项目名称
        renderBigProjects(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectNameKey: 'big_project_id',
                selectName: '大项目名称',
                options: this.bigProjectList,
                requestList: this.requestList,
                isMultiple: false
            };
            return h(HeaderLocalSelector, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'big_project_id'
            });
        },
        // 渲染达标状态表头下拉
        renderReachStandartStatus(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.status,
                selectNameKey: 'status',
                options: this.stateList,
                selectName: FILTER_LABEL['status'],
                requestList: this.requestList,
                multiple: false // 是否是多选
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'status'
            });
        },
        // 渲染需求响应及时率达标状态表头下拉
        renderRequirementReponseStatus(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.requirement_response_status,
                selectNameKey: 'requirement_response_status',
                options: this.stateList,
                selectName: FILTER_LABEL['status'],
                selectFilterName: FILTER_LABEL['requirement_response_status'],
                requestList: this.requestList,
                multiple: false
            }; // 是否是多选
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: ''
            });
        },
        // 渲染需求平均完成率达标状态表头下拉
        renderRequirementFinishedStatus(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.requirement_finished_status,
                selectNameKey: 'requirement_finished_status',
                options: this.stateList,
                selectName: FILTER_LABEL['status'],
                selectFilterName: FILTER_LABEL['requirement_finished_status'],
                requestList: this.requestList,
                multiple: false
            }; // 是否是多选
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'requirement_response_status'
            });
        },
        // 渲染需求平均完成率达标状态表头下拉
        renderVideoFinishedStatus(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.video_requirement_finished_status,
                selectNameKey: 'video_requirement_finished_status',
                options: this.stateList,
                selectName: FILTER_LABEL['status'],
                selectFilterName: FILTER_LABEL['video_requirement_finished_status'],
                requestList: this.requestList,
                multiple: false
            }; // 是否是多选
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'requirement_response_status'
            });
        },
        // 渲染维度测试版本号
        renderVersions(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectNameKey: 'version_id',
                selectName: '版本',
                options: this.versionList,
                requestList: this.requestList,
                isMultiple: false
            };
            return h(HeaderLocalSelector, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'version_id'
            });
        },
        // 渲染维度测试版本状态
        renderVersionStatus(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.version_state_name,
                selectNameKey: 'version_state_code',
                options: this.versionOrderList,
                selectName: FILTER_LABEL['version_status'],
                requestList: this.requestList,
                multiple: false // 是否是多选
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'version_status'
            });
        },
        // 渲染版本表头筛选（质量度量--开发维度与测试维度）
        renderVersion(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectNameKey: 'version_id',
                selectName: '版本',
                project_id: this.requestParams.project_id,
                isTree: true,
                requestList: this.requestList
            };
            return h(HeaderVersionSelect, {
                props: {
                    treeSelectParams: tempObj,
                    apiFun: api.queryVersionTreeInProjects
                },
                key: 'version_id'
            });
        },
        getScoreTd(iconId, tooltipBoxId, htmlString) {
            let tableFooter = document.getElementsByTagName('table')[2];
            let rowTd = tableFooter.rows[0].cells[0];
            if (rowTd.className !== 'gutter') {
                rowTd.innerHTML = '总分';
                let scoreIconTd = document.createElement('i');
                scoreIconTd.setAttribute('class', 'icon-wenhao sum-score');
                scoreIconTd.setAttribute('id', iconId);
                rowTd.appendChild(scoreIconTd);
                let tipIcon = document.getElementById(iconId);
                let _this = this;
                tipIcon.onmouseenter = () => {
                    if (document.getElementById(tooltipBoxId) === null) {
                        let tooltipBox = _this.createTooltip(tipIcon, tooltipBoxId, htmlString);
                        let bodyTemp = document.getElementsByTagName('body')[0];
                        bodyTemp.appendChild(tooltipBox);
                    } else {
                        let tooltipBox = document.getElementById(tooltipBoxId);
                        let rectObject = tipIcon.getBoundingClientRect();
                        let left = rectObject.left - 55;
                        let top = rectObject.top - 45;
                        tooltipBox.style.left = left + 'px';
                        tooltipBox.style.top = top + 'px';
                        document.getElementById(tooltipBoxId).style.display = 'block';
                    }
                };
                tipIcon.onmouseleave = () => {
                    setTimeout(() => {
                        document.getElementById(tooltipBoxId).style.display = 'none';
                    }, 300);
                };
            }
        },
        // 获取table部分的外层div的高度
        getListDivHeight(type) {
            let winHeight = window.innerHeight;
            let mHeight = 0;
            if (type === 'dimension') {
                // 各维度页面
                mHeight = winHeight - 313;
            } else if (type === 'wholeScore') {
                // 整体得分页面
                mHeight = winHeight - 262;
            } else if (type === 'questionOrigin') {
                // 问题工单原始数据页面
                mHeight = winHeight - 261;
            } else if (type === 'kpi') {
                // kpi原始数据页面
                mHeight = winHeight - 314;
            }

            return mHeight;
        },
        // 首次进入页面时，根据窗口大小显示列表数量
        // pageSizeFit(para1, para2, winFlag) {
        //     var mHeight = 0;
        //     let winHeight = window.innerHeight;
        //     if (winFlag === 'questionOrigin') {
        //         mHeight = winHeight - 357; // 236为:一级菜单+面包屑+内容区域上下padding+‘全部列表’+th(的高度)
        //     } else if (winFlag === 'kpi') {
        //         mHeight = winHeight - 420;
        //     }
        //     if (mHeight > 364) {
        //         // 页面min-height为600，减去以上高度
        //         let ua = navigator.userAgent;
        //         let ie = ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1 || ua.indexOf('MSIE ') !== -1;
        //         if (ie) {
        //             mHeight = mHeight - 10;
        //         }
        //         this[para1][para2] = Math.floor(mHeight / 47); // 每条数据高度47
        //     } else {
        //         this[para1][para2] = 8;
        //     }
        // },

        // 移除所有的条件
        clearAll() {
            this.filterItem = [];
            this.clearParams();
            this.requestList();
        },
        // 渲染生产率管理-录入状态
        renderEntryStatus(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.input_status_alias,
                selectNameKey: 'input_status',
                options: this.entryOrderList,
                selectName: '状态',
                requestList: this.requestList,
                multiple: false // 是否多选
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'input_status'
            });
        },
        // 渲染生产率管理-是否纳入统计
        renderIsEntry(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.is_statistic_alias,
                selectNameKey: 'is_statistic',
                options: this.isEntryOrderList,
                selectName: '是否纳入统计',
                requestList: this.requestList,
                multiple: false // 是否多选
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'is_statistic'
            });
        },
        // 渲染生产率管理-邮件发送状态
        renderMailStatus(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.is_send_mail_success_alias,
                selectNameKey: 'is_send_mail_success',
                options: this.mailSendStatus,
                selectName: '邮件发送状态',
                requestList: this.requestList,
                multiple: false // 是否多选
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'is_send_mail_success'
            });
        },
        // 渲染生产率管理-软件应用范围
        renderSoftwareRange(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.applied_range_alias,
                selectNameKey: 'applied_range',
                options: this.softwareRangeList,
                selectName: '软件应用范围',
                requestList: this.requestList,
                multiple: false // 是否多选
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'applied_range'
            });
        },
        // 渲染生产率管理-软件开发形式
        renderSoftwareDevelop(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.develop_mode_alias,
                selectNameKey: 'develop_mode',
                options: this.softwareDevelopList,
                selectName: '软件开发形式',
                requestList: this.requestList,
                multiple: false // 是否多选
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'develop_mode'
            });
        },
        // 渲染生产率管理-委托方
        renderEntrust(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.entrust_party_alias,
                selectNameKey: 'entrust_party',
                options: this.entrustList,
                selectName: '委托方',
                requestList: this.requestList,
                multiple: false // 是否多选
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'entrust_party'
            });
        },
        // 渲染生产率管理-数据页-统计状态
        renderStatisticStatus(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectedVal: this.requestParams.statistic_status_alias,
                selectNameKey: 'statistic_status',
                options: this.statisticStatusList,
                selectName: '统计状态',
                requestList: this.requestList,
                multiple: false
            };
            return h(HeaderMultSelect, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'statistic_status'
            });
        },
        // 渲染首页-质量度量-与我有关的大项目列表
        renderBigProjectsByManager(h, obj) {
            let tempObj = {
                handChange: this.onHeaderChange,
                selectNameKey: 'big_project_id',
                selectName: '大项目名称',
                options: this.bigProjectList,
                requestList: this.requestList,
                isMultiple: false
            };
            return h(HeaderLocalSelector, {
                props: {
                    multiSelectParams: tempObj
                },
                key: 'big_project_id'
            });
        }
    }
};
