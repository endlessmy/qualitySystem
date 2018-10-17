<!--搜索-->
<template>
    <div class="search-container">
        <el-input
            v-model="keyword"
            placeholder="请输入您要查找的内容"
            @keyup.enter.native="doSearch">

            <el-select
                slot="prepend"
                v-model="searchType"
                placeholder="请选择">
                <el-option
                    label="全文"
                    value="01">全文</el-option>
                <el-option
                    label="标题"
                    value="02">标题</el-option>
            </el-select>

            <el-button
                slot="append"
                @click="doSearch">搜索</el-button>
        </el-input>
    </div>
</template>

<script>
export default {
    name: 'SelectTableSearchBox',
    props: {
        query: Function,
        placeholder: String,
        value: String,
        searching: Boolean
    },
    data() {
        return {
            keyword: '',
            searchType: '01'
        };
    },
    methods: {
        doSearch() {
            this.$emit('searching');
            this.query(this.keyword, this.searchType);
        },

        onChange(value) {
            this.$emit('input', value);
        }
    }
};
</script>

<style lang="less" >
.container-main {
    .search-container {
        float: right;
        position: relative;
        width: 340px;
        margin: 8px 0 0;
        height: 34px;
        line-height: 34px;
        .el-input {
            .el-input-group__prepend {
                border: 1px solid #e5e5e5;
                border-right: 0;
                color: #333;
                font-size: 12px;
                .el-select {
                    width: 72px;
                }
            }

            .el-input__inner {
                height: 36px;
                font-size: 12px;
            }
            .el-input-group__append {
                border: 1px solid #e5e5e5;
                border-left: 0;
                button {
                    width: 48px;
                    font-size: 12px;
                    color: #333;
                }
            }
        }

        input:focus {
            border: 1px solid #539eff;
            outline: none;

            & + button {
                border: 1px solid #539eff;
                background-color: #539eff;
                color: #fff;
            }
        }
    }
}
</style>
