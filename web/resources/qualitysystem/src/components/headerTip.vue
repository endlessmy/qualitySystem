<!--
@name: 质量系统 - 包含提示信息的表头名称组件
@description:

@author: jjq
@date:
-->
<template>
    <div>
        {{ tipParams.headerName }}
        <el-tooltip
            popper-class="home-kpi-tip-popper"
            class="item"
            effect="light"
            placement="top">

            <span
                v-if="tipParams.headerProperty === 'defect_density_score'"
                slot="content">
                暂不记分
                <!-- 缺陷密度得分：<br> -->
                <!-- ii. t每增加0~10%扣10分直到扣到0分为止>
                其中，
                t=(缺陷密度-范围上线)/范围上线
                范围上线=7个/kloc -->
            </span>
            <span
                v-else-if="tipParams.headerProperty === 'release_leave_defect_score'"
                slot="content">
                致命缺陷：出现一个得0分<br>
                严重缺陷：出现一个得0分<br>
                一般缺陷：&le;5个不扣分，>5个的部分出现一个扣10分<br>
                提示和建议缺陷：&le;10不扣分，>10的部分出现一个扣1分</span>
            <span
                v-else-if="tipParams.headerProperty === 'business_alarm_score'"
                slot="content">告警得分：<br>
                t=(告警率-基线值)/基线值<br>
                i. t&le;0-->100分<br>
                ii. t每增加0~1%扣1分直到扣到0分为止<br>
                其中，<br>
                告警率=业务告警数/业务监控指标数<br>
                基线值：3(个/监控项)<br>
            <span class="special-text">注：若业务监控指标数为0，则得分为0</span></span>
            <span
                v-else-if="tipParams.headerProperty === 'trouble_score'"
                slot="content">故障得分：<br>
                i. 故障率=0 -->100分<br>
                ii. 故障率每增加0~1%扣1分，直到扣到0分<br>
                其中，<br>
                故障率=业务故障工单数/业务监控指标数<br>
            <span class="special-text">注：若业务监控指标数为0，则得分为0</span></span>
            <span
                v-else-if="tipParams.headerProperty === 'trouble_avg_solved_time_score'"
                slot="content">
                解决平均时长得分=100 - (故障解决时长-24) / 24*5<br>
                注：解决平均时长&lt;24h --> 100分</span>
            <!--开发提示-->
            <span
                v-else-if="tipParams.headerProperty === 'static_check_score'"
                slot="content">
                1.若有父版本：静态检查得分=总体检查问题得分*30%+新增修改问题得分*70%<br>
                2.若无父版本：静态检查得分=总体检查问题得分：<br>
                其中，<br>
                1)总体问题密度=当前静态问题数/(当前版本总代码量/1000);<br>
                &nbsp;&nbsp;&nbsp;总体检查问题得分：<br>
                &nbsp;&nbsp;&nbsp;i.总体问题密度=0(个/Kloc) -->100分<br>
                &nbsp;&nbsp;&nbsp;ii.总体问题密度每增加0~1(个/Kloc) -->扣5分,直到扣到0分<br>
                2)新增问题密度=当前新增静态检查问题数/(当前版本新增代码量/1000);<br>
                &nbsp;&nbsp;&nbsp;新增修改问题得分：<br>
                &nbsp;&nbsp;&nbsp;i.新增问题密度=0(个/Kloc) -->100分<br>
                &nbsp;&nbsp;&nbsp;ii.新增问题密度每增加0~1(个/Kloc) -->扣5分,直到扣到0分</span>
            <span
                v-else-if="tipParams.headerProperty === 'ut_score'"
                slot="content">
                UT得分= UT测试通过率得分*UT代码覆盖率得分*0.2<br>
                其中：<br>
                1)UT通过率得分：按实际通过率算，如实际通过率为98%，则得0.98分。<br>
                2)UT覆盖率得分：<br>
                &nbsp;&nbsp;&nbsp;i.UT代码覆盖率 0~10% --> 10分<br>
                &nbsp;&nbsp;&nbsp;ii.UT代码覆盖率 10~20% --> 20分<br>
                &nbsp;&nbsp;&nbsp;iii.UT代码覆盖率每增加10%就加10分，直到加到100分<br>
                注：UT作为附加分，总分为20分，所以UT得分最后*0.2</span>
            <span
                v-else-if="tipParams.headerProperty === 'wholeOperationTip'"
                slot="content">
                运维得分平均分<br>
                注：未统计到的得分不算入平均分</span>
            <span
                v-else
                slot="content">{{ tipParams.headerTip }}</span>
            <i class="icon-wenhao"></i>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'HeaderTip',
    mixins: [],
    props: {
        tipParams: {
            type: Object,
            default: function() {
                return {};
            }
        },
        developScore: String,
        developScorel: String
    },

    data() {
        return {};
    },

    computed: {},

    watch: {},

    beforeMount() {},
    mounted() {},

    methods: {}
};
</script>
<style lang="less" scoped>
span {
    line-height: 20px;
}
.special-text {
    color: red;
}
</style>
