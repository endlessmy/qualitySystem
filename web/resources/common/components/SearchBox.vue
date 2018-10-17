<!--搜索-->
<template>
    <div class="search-box">
        <input
            ref="input"
            :placeholder="placeholder"
            type="text"
            class="border"
            @change="onChange($event.target.value)"
            @keyup.enter="doSearch">

        <button @click="doSearch">搜索</button>
    </div>
</template>

<script>
export default {
    name: 'SearchBox',
    components: {},
    props: {
        query: Function,
        placeholder: String,
        value: String,
        searching: Boolean
    },
    data() {
        return {
            keyword: ''
        };
    },
    computed: {},
    methods: {
        doSearch() {
            this.$emit('searching');
            this.query(this.keyword);
        },
        onChange(value) {
            // value = value.replace(/(^\s*)/g, '');
            // if (value === '') return;
            this.keyword = value;
        }
    }
};
</script>

<style lang="less">
</style>
