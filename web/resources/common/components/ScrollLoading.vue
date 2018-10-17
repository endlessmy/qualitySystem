<!--
滚动加载组件
@author 罗怀梁
@createTime 2018/5/9
@describe
props:
    animationShow：Boolean 是否需要加载动画
    showing: Boolean  加载动画开关
    page: Number  当前页码
    pages: Number  总页码数
    identity: String  滚动文档ID
    request: Function  需要触发的事件(v-on绑定)
data:
    visible  所有页面加载完毕后关闭文档（取消那50px空白高度）
@example
    HTML
    <div
        id="scroll_section"
        class="my_report_table">  ——需要滚动加载的文档
        <div
            v-for="(list, index) in tableLists"
            :key="index">
        </div>  ——文档内容
        <scroll-loading  ——组件，放于文档内容底部
            :showing="isLoading"
            :page="Number(basePage.pageNo)"
            :pages="Number(basePage.pages)"
            identity="scroll_section"
            @request="scrollRequest" />
    </div>
    CSS
    .my_report_table {  ——设置固定高度，开启滚动条属性
        height: calc(~'100vh - 234px');
        overflow-y: auto;
    }
    JS
    requestTableList() {  ——父组件的数据加载函数
        this.isLoading = true; ——开始加载动画
        Api.pageQuery().then(res => {
            this.basePage = res.basePage;
            if (this.basePage.pageNo === 1) {  ——页码为1时覆盖之前的数据
                this.tableLists = res.result;
            } else {
                this.tableLists = [...this.tableLists, ...res.result];  ——不为1时，数据添加在尾部
            }
            this.isLoading = false; ——加载完毕，停止动画
        });
    },
    scrollRequest() {  ——传入组件的函数
        this.queryParams.pageNo += 1;  ——增加页码数
        this.requestTableList();
    }
-->
<template>
    <div
        v-if="animationShow && visible"
        class="spinner">
        <div v-if="showing">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ScrollLoading',
    props: {
        animationShow: {
            type: Boolean,
            default: true
        },
        showing: Boolean,
        page: Number,
        pages: Number,
        identity: String,
        request: Function
    },
    data() {
        return {
            scrollSection: Object,
            visible: true
        };
    },
    watch: {
        page: function(val) {
            if (val === 1) {
                this.visible = true;
                this.scrollSection.addEventListener('scroll', this.scrollFun);
            }
            this.visible &&
                this.$nextTick(() => {
                    if (this.pages > this.page) {
                        if (!this.showing && this.scrollSection.clientHeight >= this.scrollSection.scrollHeight) {
                            this.$emit('request');
                        }
                    } else {
                        this.visible = false;
                    }
                });
        }
    },
    mounted() {
        this.scrollSection = document.getElementById(this.identity);
        this.scrollSection.addEventListener('scroll', this.scrollFun);
    },
    methods: {
        scrollFun() {
            if (!this.showing) {
                if (this.pages > this.page) {
                    // clientHeight 会少0.几像素导致无法加载，增加10px的提前量。
                    if (this.scrollSection.scrollTop + this.scrollSection.clientHeight + 10 >= this.scrollSection.scrollHeight) {
                        this.$emit('request');
                    }
                } else {
                    this.visible = false;
                    this.scrollSection.removeEventListener('scroll', this.scrollFun);
                }
            }
        }
    }
};
</script>

<style lang='less' scoped>
.spinner {
    text-align: center;
    width: 100%;
    padding-top: 10px;
    height: 50px;
    background: #fff;
}

.spinner > div > div {
    width: 10px;
    height: 10px;
    background-color: rgba(32, 160, 255, 0.85);
    margin: 0 4px;
    border-radius: 100%;
    display: inline-block;
    animation: bouncedelay 1.4s infinite ease-in-out;
    animation-fill-mode: both;
}

.spinner .bounce1 {
    animation-delay: -0.32s;
}

.spinner .bounce2 {
    animation-delay: -0.16s;
}

@keyframes bouncedelay {
    0%,
    80%,
    100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}
</style>
