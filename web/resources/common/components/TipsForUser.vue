<!--
    @author: dengyingfeng;
    @decs:
        用法：1.全局注册此组建，（App.vue中注册）。
            2. 调用组件（可参考，project/components/functionRequirement/thirdNavTpe>>> 14 lines）。
            3. 需传入参数：desc,用来描述当前tip属于哪个功能模块（list: 列表页，add: 新建编辑
            firt_nav: 一级导航，second_nav: 二级导航，thrid_nav: 三级导航）和当前tip的order。
            如：desc：{
                type 'third_nav',
                order: 1
            }
            4. 参数：service，指定调用更新可见状态，url的服务。（点击'我知道了'）
    @date: 2018/05/10
 -->

<template>
    <div class="tips-user">
        <template v-if="show">
            <el-popover
                ref="tips"
                :placement="placement"
                trigger="focus">
                <div class="tip-content color666">
                    <p class="mb15">提示：{{ tipsData.content }}</p>
                    <div class="clearfix fs12">
                        <a
                            href="javascript:;"
                            class="right know"
                            @click="iKnow">{{ tipsData.btn_text }}
                        </a>
                    </div>
                </div>
            </el-popover>
            <span
                v-popover:tips
                @click="clickHandler">
                <slot>
                </slot>
            </span>
        </template>
        <slot
            v-else
            ref="tips">
        </slot>
    </div>
</template>
<script>
import Api from 'common/utils/api';
import { mapState } from 'vuex';
export default {
    name: 'TipsForUser',
    props: {
        placement: {
            default: 'right',
            type: String
        },
        service: String,
        desc: Object,
        zIndex: String,
        disabled: Boolean
    },
    data() {
        return {};
    },
    computed: {
        ...mapState({
            userTips: ({ functionReq }) => functionReq.userTips,
            isFuncAdmin: ({ functionReq }) => functionReq.isFuncAdmin
        }),
        show() {
            let showList = [];
            if (this.userTips && this.userTips.length) {
                showList = this.userTips.filter(item => item.display === 0).sort((a, b) => a.order_no - b.order_no);
            }
            // let showList = this.userTips.filter(item => item.display === 0).sort((a, b) => a.order_no - b.order_no);
            if (this.disabled || !showList[0] || !this.isFuncAdmin) {
                return false;
            }
            return showList[0].order_no === this.desc.order;
        },
        tipsData() {
            let arr = this.userTips.filter(item => item.type === this.desc.type && item.order_no === this.desc.order);
            return arr[0];
        }
    },
    watch: {
        show(val) {
            if (val) {
                this.$nextTick(() => {
                    this.open();
                });
            }
        }
    },
    mounted() {
        if (this.show) {
            this.open();
        }
    },
    methods: {
        open() {
            this.$refs.tips.showPopper = true;
            this.$refs.tips.$on('show', () => {
                if (this.zIndex) {
                    this.$refs.tips.popperElm.style.zIndex = this.zIndex;
                }
            });
        },
        close() {
            this.$refs.tips.showPopper = false;
        },
        clickHandler(e) {
            if (!this.show) {
                this.close();
            } else {
                this.open();
            }
        },
        iKnow() {
            const params = {
                service: this.service,
                data: {
                    tips_id: this.tipsData.tips_id,
                    display: 1
                }
            };
            Api.updateUserTips(params).then(res => {
                this.changeState();
                this.close();
            });
        },
        changeState() {
            this.tipsData.display = 1;
        }
    }
};
</script>
<style lang="less" scoped>
.mb15 {
    margin-bottom: 15px;
}
.tip-content {
    min-width: 160px;
    .know {
        color: #539eff;
        transform: translateY(2px);
    }
}
</style>
