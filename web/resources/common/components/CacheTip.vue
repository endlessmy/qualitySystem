<template>
    <div class="cache-tip">
        该页面已自动填写暂存的信息，清空表单信息请点击“<a
            href="javascript:;"
            @click="clearWithOriginForm(richText,initStr)">全部清除</a>”。
    </div>
</template>
<script>
export default{
    name: 'CacheTip',
    props: {
        clearWithOriginForm: Function,
        richText: {
            type: String,
            default: ''
        },
        initStr: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang='less' scoped>
.cache-tip{
    height: 34px;
    margin-bottom: 20px;
    line-height: 34px;
    padding-left: 8px;
    background: #D3E6FF;
    border: 1px solid #539eff;
    border-radius: 2px;
    font-size: 12px;
    color: #0F2440;
    a{
        color:#D0021B;
    }
}
</style>
