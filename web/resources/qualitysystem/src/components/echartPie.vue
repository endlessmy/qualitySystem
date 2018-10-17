<!--饼图组件：用于首页KPI指标的展示-->
<template>
    <div
        ref="chart"
        class="statistics-echarts-pie">
    </div>
</template>

<script>
import Echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/grid';
import chartMixins from 'common/mixins/chart';

export default {
    name: 'EchartsPie',
    props: {
        chartData: Array
    },
    mixin: [chartMixins],
    data() {
        return {
            echartObj: null,
            options: {
                backgroundColor: '#fff',
                legend: {
                    orient: 'horizontal',
                    selectedMode: false,
                    x: 'right',
                    itemWidth: 12,
                    itemHeight: 12,
                    textStyle: {
                        color: 'rgba(0, 0, 0, 1)'
                    },
                    data: [{ name: '达标项目', icon: 'circle' }, { name: '未达标项目', icon: 'circle' }]
                },
                color: ['#539EFF', '#ED7177'],
                series: [
                    {
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: null
                    }
                ]
            }
        };
    },
    watch: {
        chartData: {
            handler(val, oldVal) {
                this.echartObj.clear();
                this.renderChart();
            },
            deep: true
        }
    },
    mounted() {
        this.echartObj = Echarts.init(this.$refs.chart);
        this.renderChart();
        let timer = 0;
        window.addEventListener('resize', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.echartObj && this.echartObj.resize();
            }, 200);
        });
    },
    methods: {
        dataInit() {
            this.options.series[0].data = this.chartData.length === 0 ? null : this.chartData;
        },
        renderChart() {
            this.dataInit();
            if (this.options.series[0].data !== null) {
                this.echartObj.setOption(this.options);
                this.echartObj.on('click', this.clickPie);
                this.resize();
            }
        },
        resize() {
            this.echartObj && this.echartObj.resize();
        },
        clickPie(params) {
            let dataObj = params.data;
            let currentStatus = '';
            if (dataObj.name === '达标项目') {
                currentStatus = 'qualified';
            } else {
                currentStatus = 'unqualified';
            }
            let path = `/qualitySystem/kpiReachStandard?year=${dataObj.currentYear}&quarter=${dataObj.currentQuarter}&kpi=${
                dataObj.kpi
            }&status=${currentStatus}`;
            this.$router.push(path);
        }
    }
};
</script>

<style lang="less">
.statistics-echarts-pie {
    width: 100%;
    height: 100%;
}
</style>
