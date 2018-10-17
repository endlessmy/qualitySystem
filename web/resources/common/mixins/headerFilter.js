// @desc:表头筛选
//      封装各个模块表头筛选时调用的onHeaderChange方法
// @author：jjq
// @date：2018/6/25
import _findIndex from 'lodash.findindex';

export default {
    methods: {
        onHeaderChange(val, data) {
            // 项目看板特殊处理---start
            let ifBigProjectCheckedFirst = _findIndex(this.filterItem, o => o.key === 'big_project_code');
            if (data.selectNameKey === 'sys_category_code' && ifBigProjectCheckedFirst !== -1) {
                // 如果先选择了大项目，再选系统分类表头筛选，应该过滤掉大项目的筛选条件
                this.filterItem.splice(ifBigProjectCheckedFirst, 1);
                this.requestParams.big_project_code = '';
            }
            if (data.selectNameKey === 'sys_category_code' && val.toString() !== 'all') {
                // 如果选择了系统分类表头筛选，应根据所选系统分类ID查大项目名称，获得新的this.bigProjectNameList
                this.$nextTick(function() {
                    this.queryBigProjectName({
                        sys_category_code: val
                    });
                });
            }
            // 项目看板特殊处理---end

            // 在过滤列表中的索引，没有则返回-1
            // 研发权限plus，自定义表头筛选，所属项目，传入的key是数组
            let filterItemIndex = _findIndex(this.filterItem, o => {
                if (data.selectNameKey instanceof Array && data.selectNameKey.length === 2) {
                    return o.key === data.selectNameKey[1];
                } else {
                    return o.key === data.selectNameKey;
                }
            });
            let finalVal = []; // 多选表头需要在请求数据前重置value
            if (!data.isTree && (!val || val.toString() === 'all')) {
                // 选择全部是，删除列表数据
                if (filterItemIndex !== -1) {
                    this.filterItem.splice(filterItemIndex, 1);
                } else {
                    return;
                }
            } else {
                let newObj = {};
                if (data.isTree) {
                    // 版本, 模块
                    newObj = {
                        label: data.selectFilterName || data.selectName,
                        value: val.toString().indexOf(',') >= 0 ? val.split(',')[1] : val,
                        key: data.selectNameKey
                    };
                    // 处理模块仅传递了id的情况
                    if (val.toString().indexOf(',') >= 0) {
                        newObj.value = val.split(',')[1];
                    } else {
                        let valueIndex = _findIndex(data.moduleList, o => o.func_require_type_id === val);
                        newObj.value = data.moduleList[valueIndex].func_require_type_name;
                    }
                } else {
                    let arrObj = data.options;
                    newObj = {
                        label: data.selectFilterName || data.selectName,
                        value: '',
                        key: data.selectNameKey instanceof Array && data.selectNameKey.length === 2 ? data.selectNameKey[1] : data.selectNameKey
                    };
                    // 表头多选
                    if (val instanceof Array) {
                        val.forEach((item, index) => {
                            if (item !== '' && typeof item === 'string') {
                                let value = item.split(',')[0];
                                let label = item.split(',')[1];
                                // finalVal.push(value * 1);//需求模块这样写的，缺陷模块报错
                                finalVal.push(value); // 缺陷模块这样写的，需求模块正确
                                newObj.value !== '' ? (newObj.value += ' , ' + label) : (newObj.value = label);
                            }
                            if (typeof item === 'number') {
                                let objIndex = _findIndex(arrObj, o => o.value === item);
                                newObj.value = arrObj[objIndex].label;
                                finalVal.push(item);
                            }
                        });
                    } else {
                        let objIndex = _findIndex(arrObj, o => o.value === val);
                        newObj.value = arrObj[objIndex].label;
                    }
                }
                filterItemIndex === -1 ? this.filterItem.push(newObj) : this.filterItem.splice(filterItemIndex, 1, newObj); // 删除数据, 并插入新数据
            }
            // 研发权限plus，自定义表头筛选，所属项目，传入的key是数组
            if (data.selectNameKey instanceof Array && data.selectNameKey.length === 2) {
                this.requestParams[data.selectNameKey[0]][data.selectNameKey[1]] = val;
            } else {
                this.requestParams[data.selectNameKey] = val instanceof Array ? finalVal : val === 'all' ? '' : val;
            }
            this.requestParams.pageNo = 1;
            // 格式化请求参数
            let finalParams = JSON.parse(JSON.stringify(this.requestParams));
            for (var key in finalParams) {
                if (finalParams[key] && typeof finalParams[key] === 'string' && finalParams[key].indexOf(',') > -1) {
                    finalParams[key] = finalParams[key].split(',')[0];
                }
            }
            // 请求列表
            data.requestList(1, finalParams);
        },
        // 移除表头删选的条件
        removeFilterLabel(index, item, data) {
            // 删除 filter 筛选项
            this.filterItem.splice(index, 1);
            try {
                let selectObj = document.getElementById(`tableHeaderSelect${item.key}`);
                selectObj.options[0].selected = true;
            } catch (err) {}
            this.requestParams.pageNo = 1;
            // 获取列表数据
            if (data.service === 'Defect') {
                if (item.key === 'createTime') {
                    this.$refs.screenDialog.createTime = [];
                    this.requestParams.defect_create_start_time = '';
                    this.requestParams.defect_create_end_time = '';
                } else if (item.key === 'defect_priority_list') {
                    this.requestParams[item.key] = [];
                } else {
                    this.requestParams[item.key] = undefined;
                }
                data.requestList(1, this.formatParams());
            } else if (data.service === 'Requirement') {
                this[item.key] = [];

                if (item.key === 'create_time_range') {
                    this.$refs.screen.create_time_range = [];
                    this.requestParams.createEndTime = '';
                    this.requestParams.createStartTime = '';
                } else if (item.key === 'require_joint_debug_time_range') {
                    this.requestParams.debugStartTime = '';
                    this.requestParams.debugEndTime = '';
                    this.$refs.screen.require_joint_debug_time_range = [];
                } else if (item.key === 'hope_time_range') {
                    this.requestParams.hopeStartTime = '';
                    this.requestParams.hopeEndTime = '';
                    this.$refs.screen.hope_time_range = [];
                } else if (item.key === 'planned_completion_time_range') {
                    this.requestParams.onlineStartTime = '';
                    this.requestParams.onlineEndTime = '';
                    this.$refs.screen.planned_completion_time_range = [];
                } else if (item.key === 'approve_time_range') {
                    this.requestParams.approve_start_time = '';
                    this.requestParams.approve_end_time = '';
                    this.$refs.screen.approve_time_range = [];
                } else {
                    this.requestParams[item.key] = undefined;
                }
                // 格式化请求参数
                let finalParams = JSON.parse(JSON.stringify(this.requestParams));
                for (var key in finalParams) {
                    if (finalParams[key] && typeof finalParams[key] === 'string' && finalParams[key].indexOf(',') > -1) {
                        finalParams[key] = finalParams[key].split(',')[0];
                    }
                }
                data.requestList(finalParams);
            } else if (data.service === 'version') {
                // 迭代版本-列表视图
                if (item.key === 'keyword') {
                    this.requestParams.keyword = '';
                    this.requestParams.query_type = '01';
                    this.$emit('remove');
                } else if (item.key === 'version_manager_id') {
                    this.requestParams[item.key] = undefined;
                } else if (item.key === 'query_version_state_list') {
                    this.requestParams[item.key] = [];
                }
                data.requestList(1, this.requestParams);
            } else if (data.service === 'Feedback') {
                if (item.key === 'creatTime') {
                    this.$refs.screenDialog.creatTime = [];
                    this.requestParams.start_create_time = '';
                    this.requestParams.end_create_time = '';
                } else if (
                    item.key === 'current_processor_id' ||
                    item.key === 'creator_id' ||
                    item.key === 'handler_id' ||
                    item.key === 'caller_company_id' ||
                    item.key === 'handler_group_id' ||
                    item.key === 'keyword'
                ) {
                    this.requestParams[item.key] = '';
                } else {
                    this.requestParams[item.key] = [];
                }
                data.requestList();
            } else if (data.service === 'Countersign') {
                this.requestParams[item.key] = undefined;
                data.requestList();
            } else if (data.service === 'Customflow') {
                if (item.key === 'keyword') {
                    this.requestParams[item.key] = '';
                } else {
                    this.requestParams[item.key] = [];
                }
                data.requestList();
            } else if (data.service === 'Task') {
                let reflect = {
                    matchingcontent: true,
                    processorid: true,
                    createrid: true
                };
                if (reflect[item.key]) {
                    this.requestParams[item.key] = '';
                } else {
                    this.requestParams[item.key] = [];
                }
                data.requestList();
            } else if (data.service === 'Document') {
                if (item.key === 'file_creator_id') {
                    this.requestParams.file_creator_id = '';
                } else if (item.key === 'keyword') {
                    this.requestParams.keyword = '';
                    this.fileKeyword = '';
                    this.expandShow = false;
                } else {
                    this.requestParams[item.key] = undefined;
                }
                data.requestList();
            } else if (data.service === 'ProjectsBoard') {
                if (item.key === 'sys_category_code') {
                    this.activeIndex = '';
                    this.bigActive = '';
                    this.filterItem.splice(index, 1);
                    this.requestParams.big_project_code = undefined;
                } else if (item.key === 'big_project_code') {
                    this.bigActive = '';
                }
                this.requestParams[item.key] = undefined;
                data.requestList();
            } else if (data.service === 'QualityService') {
                this.requestParams[item.key] = '';
                data.requestList();
            } else if (data.service === 'permissionplus' && item.key.indexOf('field') !== -1) {
                delete this.requestParams.bizfield_condition[item.key];
                data.requestList();
            } else {
                this.requestParams[item.key] = '';
                data.requestList();
            }
        }
    }
};
