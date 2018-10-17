<template>
    <div
        :style="exportStyle"
        class="direct-export"
        title="导出excel">
        <a
            :href="url"
            class="export-a">
            <i
                v-if="isShowIcon"
                class="icon-daochu1"
                style="font-size: 14px"></i>
            <span
                v-else
                class="text">导出</span>
        </a>
    </div>
</template>
<script>
export default {
    name: '',
    components: {},
    mixins: [],
    props: {
        url: {
            type: String
        },
        exportStyle: {
            type: Object,
            default() {
                return {
                    width: '34px'
                };
            }
        },
        isShowIcon: {
            type: Boolean,
            default() {
                return true;
            }
        }
    },
    data() {
        return {};
    },
    computed: {},
    watch: {},
    mounted() {},
    methods: {}
};
</script>
<style lang="less" scoped>
.direct-export {
    width: 34px;
    display: inline-block;
    cursor: pointer;
    height: 34px;
    line-height: 34px;
    position: relative;
    border: 1px solid #ddd;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    background-color: #f7f7f7;
    &:hover {
        background-color: #fff;
    }
    .export-a {
        width: 100%;
        height: 100%;
        color: #666;
        display: inline-block;
        .text {
            font-size: 13px;
            color: #888;
        }
    }
}
</style>
