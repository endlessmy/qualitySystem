<!--
@name: 公共导出组件
@description:默认全部选中
已使用模块：缺陷、功能需求、业务需求、任务看板、项目看板
-->
<template>
    <div class="excel-propover el-btn out-excel-btn">
        <el-popover
            ref="popover"
            v-model="visibility"
            placement="bottom"
            width="200"
            trigger="click">
            <div class="excel-propover-footer">
                <el-checkbox
                    v-model="allCheck"
                    class="all-check"
                    @change="changeAllCheck">
                    <span style="font-size:12px;">全选</span>
                </el-checkbox>
                <a
                    :href="donwloadUrl"
                    :class="{'is-disabled':checkedData.length === 0}">点击导出</a>
            </div>
            <el-checkbox-group
                v-model="checkedData"
                class="excel-propover-form">
                <el-checkbox
                    v-for="item in checkboxes"
                    :label="item.value"
                    :key="item.value"
                    name="type"
                    @change="handleCheck">
                    <span style="font-size:12px">{{ item.label }}</span>
                </el-checkbox>
            </el-checkbox-group>
        </el-popover>
        <!--点击交互-->
        <span
            v-popover:popover
            class="p10">
            <i
                title="导出"
                class="icon-daochu"></i>
            <span v-if="iconTitle">{{ iconTitle }}</span>
        </span>

    </div>
</template>

<script>
import utils from 'common/utils/misc';

export default {
    name: 'ExcelPropover',
    props: {
        module: String, // 模块名,如'defect'
        params: [Array, Object], // 一般是对象，{max: -1,requestParams: this.requestParams},
        checkboxes: Array, // 支持导出的字段，label，value的格式，[{label: '编号',value: 'taskId' }]
        urlPrefix: String, // 如/FuncrequireService/require/exportExcel
        allCheckDefault: {
            // 是否默认勾选所有数据
            type: Boolean,
            default: true
        },
        iconTitle: {
            // 显示在icon后的文字
            type: String,
            default: ''
        }
    },
    data() {
        return {
            visibility: false,
            allCheck: false,
            checkedData: []
        };
    },
    computed: {
        paramsUrl() {
            let resultUrl = '';
            // todo: 传参的方式改为跟业务需求一样
            if (this.module === 'projectsboard') {
                let param1 = this.params && this.params.length ? this.params.map(p => p.project_id).join('-') : 'none';
                let param2 = this.checkedData && this.checkedData.length ? this.checkedData.join('-') : 'none';
                resultUrl = `/${encodeURIComponent(param1)}/${encodeURIComponent(param2)}`;
            } else {
                // pageQuery传递的参数
                let param1 = Object.assign({}, this.params.requestParams);
                param1.pageNo = 1;
                param1.pageSize = this.params.max;
                param1 = JSON.stringify(param1);
                // 勾选的导出字段
                let param2 = JSON.stringify(this.checkedData);
                resultUrl = `/${encodeURIComponent(param1)}/${encodeURIComponent(param2)}`;
            }
            return resultUrl;
        },
        donwloadUrl() {
            if (this.checkedData.length === 0) {
                return null;
            }

            let sessionId = utils.getLoginUserInfo('sessionId');
            let context = window.config.context;
            return context + this.urlPrefix + this.paramsUrl + `?sessionId=${sessionId}`;
        }
    },
    mounted() {
        // 默认勾选所有数据
        if (this.allCheckDefault) {
            this.allCheck = true;
            this.checkedData = this.checkboxes.map(t => t.value);
        }
    },
    methods: {
        changeAllCheck() {
            if (this.allCheck) {
                this.checkedData = this.checkboxes.map(t => t.value);
            } else {
                this.checkedData = [];
            }
        },
        handleCheck() {
            this.allCheck = this.checkedData.length === this.checkboxes.length;
        }
    }
};
</script>

<style lang="less" scoped>
.excel-propover {
    position: relative;
}
.excel-propover-form {
    width: 100%;
    padding: 10px 0 0;
    max-height: 380px;
    overflow-y: auto;
    .el-checkbox {
        height: 24px;
        line-height: 24px;
        margin: 0 20px 0 10px;
        display: block;
    }
}
.excel-propover-footer {
    margin: 0 20px 0 10px;
    height: 28px;
    line-height: 24px;
    border-bottom: 1px solid #ebeff9;
    .all-check {
        float: left;
        margin: 0 30px 0 0px;
    }
    .is-disabled {
        color: #bfcbd9;
        cursor: not-allowed;
    }
}
</style>
