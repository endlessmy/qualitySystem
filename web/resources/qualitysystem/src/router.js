// @name: 质量系统-路由
// @author：jjq
// @date: 2018/7/25
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueAnalytics from 'vue-analytics';
import Utils from 'common/utils/misc';

const Dashboard = () =>
    import('./containers/dashboard');
// 首页
const HomeKpi = () =>
    import('./containers/homePage/homeKpi');
const HomeQualityDimension = () =>
    import('./containers/homePage/homeQualityDimension/homeQualityDimension');
const HomeQuestionList = () =>
    import('./containers/homePage/homeQuestionOrder/homeQuestionList');
// KPI指标
const KPIoriginData = () =>
    import('./containers/kpiQuota/originData/kpiOriginData');
const KPIreachStandard = () =>
    import('./containers//kpiQuota/reachCondition/kpiReachStandard');
// 问题工单原始数据
const QuestionOriginData = () =>
    import('./containers/questionOrder/questionOriginData');
// 质量度量
const WholeScore = () =>
    import('./containers/qualityDimension/wholeScore');
const EveryDimensionScore = () =>
    import('./containers/qualityDimension/everyDimension/everyDimensionScore');
// 生产率度量
const ProductivityEntry = () =>
    import('./containers/productivityMeasure/productEntry/productivityEntry');
const ProductivityManagePage = () =>
    import('./containers/productivityMeasure/prodectivityManage/managePage');
const ProductivityDataPage = () =>
    import('./containers/productivityMeasure/prodectivityManage/dataPage');
const ProductivityDataDetail = () =>
    import('./containers/productivityMeasure/prodectivityManage/dataDetail');
const ProductivityDataQuery = () =>
    import('./containers/productivityMeasure/dataQuery/rankForProjects');

// const ProductivityManage = () => import('./containers/productivityManage.vue');

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [{
        path: '/qualitySystem',
        name: 'Dashboard',
        component: Dashboard,
        redirect: '/qualitySystem/homeQualityDimension',
        children: [{
            path: 'homeQualityDimension',
            component: HomeQualityDimension,
            name: 'HomeQualityDimension'
        },
        {
            path: 'homeKpi',
            component: HomeKpi,
            name: 'HomeKpi'
        },
        {
            path: 'homeQuestionList',
            component: HomeQuestionList,
            name: 'HomeQuestionList'
        },
        {
            path: 'kpiOriginData',
            component: KPIoriginData,
            name: 'KPIoriginData'
        },
        {
            path: 'kpiReachStandard',
            component: KPIreachStandard,
            name: 'KPIreachStandard'
        },
        {
            path: 'questionOriginData',
            component: QuestionOriginData,
            name: 'QuestionOriginData'
        },
        {
            path: 'wholeScore',
            component: WholeScore,
            name: 'WholeScore'
        },
        {
            path: 'everyDimensionScore',
            component: EveryDimensionScore,
            name: 'EveryDimensionScore'
        },
        {
            path: 'productivityEntry',
            component: ProductivityEntry,
            name: 'ProductivityEntry'
        },
        {
            path: 'productivityManage/manage',
            component: ProductivityManagePage,
            name: 'ProductivityManagePage'
        },
        {
            path: 'productivityManage/data',
            component: ProductivityDataPage,
            name: 'ProductivityDataPage'
            // meta: {
            //     keepAlive: true
            // }
        },
        {
            path: 'productivityManage/data/detail',
            component: ProductivityDataDetail,
            name: 'ProductivityDataDetail'
        },
        {
            path: 'productivityMeasure/dataQuery/rankForProjects',
            component: ProductivityDataQuery,
            name: ProductivityDataQuery
        }
        ]
    },
    {
        path: '/',
        redirect: '/qualitySystem/homeQualityDimension'
    }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        next('/qualitySystem/homeQualityDimension');
    } else {
        next();
    }
});

Vue.use(VueAnalytics, {
    id: Utils.isFormalEnv() ? 'UA-110866843-1' : 'UA-X',
    router: router
});

export default router;
