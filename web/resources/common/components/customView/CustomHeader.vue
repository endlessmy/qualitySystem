<!--
自定义表头
@author shenah
@createTime 2018/4/11
 -->
<template>
    <div class="custom-header">
        <div class="custom-header-item">
            <div class="title">
                <span class="shuxian"></span>
                <span class="ml10">可选字段</span>
                <span class="title-tip">（可勾选10个，已勾选{{ selectedFieldsLists.length }}个）</span>
            </div>
            <div class="fields">
                <div
                    v-for="(item, index) in allFieldsLists"
                    :key="index"
                    class="field-wrap">
                    <div class="field">
                        <span>{{ item.field_remark }}</span>
                        <div
                            v-if="item.field_remark !== '标题'"
                            class="selectCommon">
                            <i
                                :class="setIconClass(item)"
                                @click="selectOpete(item)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="custom-header-item">
            <div class="title">
                <span class="shuxian"></span>
                <span class="ml10">当前选定的字段</span>
            </div>
            <div class="fields">
                <div class="field-wrap">
                    <div
                        v-for="(item, index) in selectedFieldsLists"
                        v-if="index === 0"
                        :key="index"
                        class="field">
                        <span>{{ item.field_remark }}</span>
                    </div>
                </div>
                <draggable
                    v-model="selectedFieldsLists"
                    :options="dragOption">
                    <div
                        v-for="(item, index) in selectedFieldsLists"
                        :class="{'now-select':nowIndex === index }"
                        v-if="index > 0"
                        :key="index"
                        class="field-wrap
                        draggable-item"
                        @click="selectOne(item,index)">
                        <div class="field">
                            <span>{{ item.field_remark }}</span>
                            <div class="selectCommon">
                                <i
                                    class="icon-quxiao draggable-ignore"
                                    style="cursor:pointer;"
                                    @click.stop="removeItem(item, index)"></i>
                            </div>
                        </div>
                    </div>
                </draggable>
            </div>
        </div>
        <div class="custom-button">
            <div
                :class="{'no-allowed':(isAllowed || isUpFlag)}"
                class="button-common"
                @click="move('up')">
                <i class="icon-xiangshang"></i>
            </div>
            <div
                :class="{'no-allowed':(isAllowed || isDownFlag)}"
                class="button-common"
                @click="move('down')">
                <i class="icon-xiangxia"></i>
            </div>
        </div>
    </div>
</template>

<script>
import ApiCommon from 'common/utils/api';
import CommonMessage from 'common/mixins/message';
import draggable from 'vuedraggable';
export default {
    name: 'CustomHeader',
    components: { draggable },

    mixins: [CommonMessage],
    props: {
        data: Object,
        paramsObj: Object
    },
    data() {
        return {
            dragOption: {
                draggable: '.draggable-item',
                filter: '.draggable-ignore',
                ghostClass: 'draggable-ghost'
            },
            allFieldsLists: [], // 显示的可选字段
            selectedFieldsLists: [], // 显示已选字段
            row: {}, // 当前选中的
            nowIndex: 0 // 当前选中时候的页面
        };
    },
    computed: {
        isAllowed() {
            return !(this.nowIndex !== 0 && this.selectedFieldsLists.length > 2);
        },
        isUpFlag() {
            return this.nowIndex === 1;
        },
        isDownFlag() {
            return this.nowIndex === this.selectedFieldsLists.length - 1;
        }
    },
    watch: {},
    mounted() {
        this.queryFields();
    },
    methods: {
        setIconClass(row) {
            // 设置选中与未选中
            return row.isSelected ? 'icon-xuanzhong xuanzhong' : 'icon-weixuanzhong weixuanzhong';
        },
        queryFields() {
            // 查询显示字段
            /**
             * 1:在功能需求中
             *   view_id 没有的话就可以不传
             *   header_type 可以不传
             * 2:在业务需求中
             *   view_id 没有的话就可以不传
             *   header_type
             *   当在业务需求(项目中的时候)新建视图 header_type传07
             *   如果在相应的视图比如,我创建的就传02
             */
            let params = {
                view_id: this.data.view_id,
                service_id: this.paramsObj.service_id,
                header_type: this.paramsObj.header_type
            };
            ApiCommon.queryViewTableField(params).then(res => {
                this.selectedFieldsLists = res.result.user_config_field_list.map(item => {
                    item.isSelected = true; // 是否勾选的标识
                    return item;
                });
                this.allFieldsLists = res.result.service_field_list.map(item => {
                    item.isSelected = false; // 是否勾选的标识
                    for (let i = 0; i < this.selectedFieldsLists.length; i++) {
                        let onedata = this.selectedFieldsLists[i];
                        if (item.field_id === onedata.field_id) {
                            item.isSelected = true;
                            break;
                        }
                    }
                    return item;
                });
            });
        },
        selectOpete(row) {
            // 选择还是不选中的操作
            if (row.isSelected) {
                // 证明要取消选中
                row.isSelected = false;
                this.selectedFieldsLists = this.selectedFieldsLists.filter(
                    item =>
                        // 筛选出不是和这个匹配的数组
                        item.field_id !== row.field_id
                );
            } else {
                // 证明要即将选中
                if (this.selectedFieldsLists.length >= 10) {
                    return;
                }
                row.isSelected = true;
                this.selectedFieldsLists.push(row);
            }
        },
        removeItem(row, index) {
            // 移除某一行的已选字段
            this.allFieldsLists.forEach(element => {
                if (element.field_id === row.field_id) {
                    element.isSelected = false;
                }
            });
            this.nowIndex = 0;
            this.selectedFieldsLists = this.selectedFieldsLists.filter((item, index) => row.field_id !== item.field_id);
        },
        move(type) {
            // 点击按钮移动顺序
            if (this.isAllowed) {
                return;
            }
            if (type === 'up') {
                // 点击的是向上
                if (this.isUpFlag) {
                    return;
                }
                this.chageData(this.selectedFieldsLists, this.nowIndex, this.nowIndex - 1);
                this.nowIndex = this.nowIndex - 1;
            } else {
                // 点击的是向下
                if (this.isDownFlag) {
                    return;
                }
                this.chageData(this.selectedFieldsLists, this.nowIndex, this.nowIndex + 1);
                this.nowIndex = this.nowIndex + 1;
            }
        },
        chageData(arr, index1, index2) {
            // 交换数据
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },
        selectOne(onedata, index) {
            // 选中一个
            this.row = onedata;
            this.nowIndex = index;
        }
    }
};
</script>

<style lang="less">
.custom-header {
    position: relative;
    width: 100%;
    height: 100%;
    .no-allowed {
        cursor: not-allowed !important;
        &:hover {
            background-color: #f7f7f7 !important;
        }
    }
    .custom-button {
        position: absolute;
        top: 50%;
        margin-top: -28px;
        right: 0px;
        display: inline-block;
        vertical-align: middle;
        .button-common {
            width: 26px;
            height: 26px;
            background-color: #f7f7f7;
            border: 1px solid #dcdfe5;
            text-align: center;
            line-height: 26px;
            cursor: pointer;
            color: #666;
            &:nth-child(2) {
                margin-top: 30px;
            }
            &:hover {
                background-color: #fff;
            }
        }
    }
    .custom-header-item {
        display: inline-block;
        vertical-align: top;
        width: 250px;
        font-size: 0;
        .title {
            position: relative;
            font-size: 14px;
            color: #333;
            .title-tip {
                font-size: 12px;
                color: #666;
            }
            .shuxian {
                position: absolute;
                top: 12px;
                display: inline-block;
                width: 3px;
                background-color: #5393ff;
                height: 12px;
                vertical-align: middle;
            }
        }
        .draggable-ghost {
            color: #fff;
            background: #e6e6e6;
        }
        .now-select {
            background: #fbfbfb;
        }
        .fields {
            margin-top: 8px;
            height: 310px;
            border: 1px solid #dcdfe5;
            border-radius: 2px;
            overflow-x: hidden;
            overflow-y: auto;
            .field-wrap {
                padding: 0 20px;
                &.draggable-item:hover {
                    background: #fbfbfb;
                    cursor: pointer;
                }
                .field {
                    position: relative;
                    font-size: 12px;
                    color: #333;
                    width: 100%;
                    height: 44px;
                    line-height: 44px;
                    border-bottom: 1px solid #f2f2f2;
                }
            }
            .selectCommon {
                position: absolute;
                display: inline-block;
                right: 0;
                top: 2px;
                font-size: 16px;
                .xuanzhong {
                    color: #539eff;
                    cursor: pointer;
                }
                .weixuanzhong {
                    color: #d8d8d8;
                    cursor: pointer;
                }
            }
        }
        &:nth-child(1) {
            margin-right: 30px;
        }
    }
}
</style>
