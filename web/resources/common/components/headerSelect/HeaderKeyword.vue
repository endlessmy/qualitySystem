<!--
@name:表头名称模糊搜索
@author: shenah
@date: 2018/6/27
-->
<template>
    <div class="select-user">
        <el-popover
            ref="rightNameKeywords"
            popper-class="poppver-name-keyword"
            placement="bottom"
            width="180"
            trigger="click">
            <slot>
                <input
                    v-model="keyword"
                    placeholder="请输入搜索"
                    @blur="change"
                    @keyup.enter="change">
            </slot>
        </el-popover>
        <span :class="{ml10:classFlag}">{{ selectName }}</span>
        <div
            v-popover:rightNameKeywords
            ref="headSelectLink"
            class="header-select-link">
            <i class="icon-pullup-down"></i>
        </div>
    </div>
</template>
<script>
export default {
    name: 'HeaderKeyword',
    props: {
        handChange: Function,
        selectNameKey: String,
        selectName: String,
        classFlag: true
    },
    data() {
        return {
            keyword: '' // 关键字搜素
        };
    },
    methods: {
        change() {
            if (this.keyword !== '') {
                this.handChange(this.keyword, this.selectNameKey, this.selectName);
            }
            this.keyword = '';
            this.$refs.headSelectLink.click(); // 关闭
        }
    }
};
</script>
<style lang='less'>
.poppver-name-keyword {
    &.el-popover[x-placement^='bottom'] {
        margin-top: 0;
    }
    &.el-popover {
        padding: 0 !important;
        border: none;

        .popper__arrow {
            display: none;
        }
    }
    input {
        font-size: 14px;
        width: 200px;
        height: 34px;
        border: 1px solid #e5e5e5;
        padding-left: 10px;
        color: #333;
        &:focus {
            outline: none;
            border: 1px solid #539eff;
        }
    }
    input::-webkit-input-placeholder {
        color: #939393 !important;
        font-size: 12px;
    }
}
.select-user {
    .header-select-link {
        display: inline-block;
        cursor: pointer;
        .icon-pullup-down {
            color: #98a0a9;
            font-size: 12px;
            display: inline-block;
            transform: scale(0.5);
            margin-top: -2px;
        }
    }
}
</style>
