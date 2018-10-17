<!--
    分页组件
    2017-12-26 qqli 修改
    修复缺陷，线上问题-过滤结果有多页，处理完当前所有页缺陷时，列表显示为空
    增加可输入页码功能 2018.9.17
    缺陷ID：0124011491
-->
<template>
    <div
        v-show="showPager"
        class="pager right">
        <a
            :class="{invisible: !showPrev}"
            href="javascript:void(0)"
            class="prev"
            @click="handlePrev">
            <i class="icon-arrow"></i>
        </a>

        <span class="left-change-page">
            <span class="cur-page">{{ pageData.pageNo }}</span>
            <el-input
                ref="input"
                v-model="pageData.pageNo"
                class="input-page"
                type="text"
                @blur="changPage"
                @keyup.enter.native="changPage" />
        </span>
        <span class="total-page">/{{ pageCount }}</span>
        <a
            :class="{invisible: !showNext}"
            href="javascript:void(0)"
            class="next"
            @click="handleNext">
            <i class="icon-arrow"></i>
        </a>
    </div>
</template>

<script>
export default {
    name: 'Pager',
    props: {
        pageData: {
            type: Object,
            default: () => ({
                pageNo: 1,
                pageSize: 10,
                counts: 0
            })
        },
        requestList: Function,
        path: String
    },

    data() {
        return {};
    },

    computed: {
        showPager() {
            // 返回的当前页码大于0 则显示分页
            return this.pageData.counts > this.pageData.pageSize;
        },

        showPrev() {
            return this.pageData.pageNo !== 1;
        },

        showNext() {
            let pages = Math.ceil(this.pageData.counts / this.pageData.pageSize);
            return this.pageData.pageNo < pages;
        },
        pageCount() {
            let page = Math.ceil(this.pageData.counts / this.pageData.pageSize);
            return page;
        }
    },

    watch: {
        pageData(newVal, oldVal) {
            // 当前有一共有多少页
            let counts = this.pageData.counts;
            let pageSize = this.pageData.pageSize;
            let pages = Math.ceil(counts / pageSize);
            // 当前的查询的页码
            let pageNo = newVal.pageNo;
            let distancePage = pageNo - pages;
            // 条件
            // 1.counts 不等于0；
            // 2.差距的页面大于0小于10（避免过多请求）；
            // 3.返回的页面要>1 才会请求比1更小的页码
            // 满足以上条件，表示当前页面每页数据，自动请求上一页的数据
            if (counts !== 0 && pageNo > 1 && distancePage > 0 && distancePage < 10) {
                this.requestList(this.pageData.pageNo - 1);
            }
        }
    },

    methods: {
        removeHighLight(dir) {
            let equ = dir === 1 ? this.pageData.pageNo + 1 : this.pageData.pageNo - 1;
            let table = document.querySelector('.el-table__body');
            let trs = table.querySelectorAll('tr');
            if (Number(sessionStorage.activePageNo) !== Number(equ)) {
                for (let i = 0; i < trs.length; i++) {
                    trs[i].classList.remove('tr-viewed');
                }
            } else {
                trs[sessionStorage.activeIndex].classList.add('tr-viewed');
            }
        },
        handleNext() {
            this.requestList(this.pageData.pageNo + 1);
            this.removeHighLight(1);
            return false;
        },

        handlePrev() {
            this.requestList(this.pageData.pageNo - 1);
            this.removeHighLight();
            return false;
        },
        // 输入页码请求列表
        changPage() {
            // let pageNo = this.$refs.input.value;
            let rep = /^[1-9]\d*$/;
            // 验证只能输入正整数，输入页码不得大于总页数，否则输入框自动显示当前页
            // if (pageNo === '' || pageNo > this.pageCount || !rep.test(pageNo)) {
            //     pageNo = this.pageData.pageNo;
            // }
            if (this.pageData.pageNo === '' || !rep.test(this.pageData.pageNo)) {
                this.pageData.pageNo = 1;
            } else if (this.pageData.pageNo > this.pageCount) {
                this.pageData.pageNo = this.pageCount;
            }

            this.requestList(this.pageData.pageNo);
        }
    }
};
</script>

<style lang='less'>
@import '../layouts/css/themes/default.less';
.pager {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .prev,
    .next {
        cursor: pointer;
        .icon-arrow {
            display: inline-block;
            color: #333436;
            font-weight: normal;
            font-size: 12px;
        }

        &:hover {
            .icon-arrow {
                color: @primary-color;
            }
        }
    }

    .prev {
        padding: 5px 0px !important;
        .icon-arrow {
            transform: rotate(180deg) translateY(0px);
            -webkit-transform: rotate(180deg) translateY(-1px);
        }
    }

    .next {
        padding: 5px 0px !important;
    }

    .total-page {
        color: #777c88;
        display: inline-block;
        min-width: 35px;
    }
    // 只使用输入框的边框显示隐藏的样式，暂不删除
    // .left-change-page {
    //     display: inline-block;
    //     min-width: 35px;
    //     text-align: right;
    //     height: 50px;
    //     line-height: 50px;
    //     .input-page .el-input__inner {
    //         display: inline-block;
    //         height: 20px;
    //         width: 33px;
    //         border: 1px solid #fff;
    //         background: #fff;
    //         border-radius: 2px;
    //         cursor: pointer;
    //         outline: none;
    //         padding: 1px;
    //         text-align: right;
    //     }
    //     &:hover {
    //         .input-page .el-input__inner {
    //             border: 1px solid #777c88;
    //             text-align: center;
    //         }
    //     }
    // }
    .left-change-page {
        display: inline-block;
        min-width: 35px;
        text-align: right;
        .input-page {
            display: none;
            .el-input__inner {
                height: 20px;
                width: 33px;
                border: 1px solid #777c88;
                background: #fff;
                border-radius: 2px;
                cursor: pointer;
                outline: none;
                padding: 1px;
                display: none;
            }
        }
    }

    .left-change-page:hover {
        .cur-page {
            display: none;
        }
        .input-page {
            display: inline-block;
            .el-input__inner {
                display: inline-block;
                text-align: center;
            }
        }
    }
}
</style>
