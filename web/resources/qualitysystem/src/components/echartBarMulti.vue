<!--多个柱子的柱状图组件：用于生产率度量 - 项目组间排名 - 维度为全部和系统使用的情况-->
<template>
    <div
        ref="chart">
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
import 'echarts/lib/component/dataZoom';
import chartMixins from 'common/mixins/chart';

export default {
    name: 'EchartsBar',
    mixins: [chartMixins],
    props: {
        chartData: Object
    },
    data() {
        return {
            echartObj: null,
            backgroundColor: '#fff', // echarts背景色
            options: {
                // 柱状图颜色
                color: ['#5793f3', '#d14a61', '#675bba', '#003366', '#006699', '#4cabce'],
                // 提示框组件
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    bottom: '30%'
                },
                // 图例组件
                legend: {
                    data: []
                },
                // 工具栏
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true // 保存为图片
                        }
                    }
                },
                // 区域缩放
                dataZoom: [
                    {
                        id: 'dataZoomX',
                        type: 'slider', // 滚动条型区域缩放
                        xAxisIndex: [0],
                        filterMode: 'filter',
                        startValue: 0, // 起始值，设置的值为索引值
                        endValue: 3 // 结束值

                    }
                ],
                // x轴
                xAxis: [
                    {
                        type: 'category', // 坐标轴类型
                        name: '项目', // 横坐标名字
                        boundaryGap: true,
                        axisTick: {
                            show: false // 是否显示坐标轴刻度
                        },
                        data: []
                    }
                ],
                // y轴
                yAxis: [
                    {
                        type: 'value',
                        name: '得分'
                    }
                ],
                // 列表数据
                series: [
                    {
                        name: '1月',
                        type: 'bar',
                        barGap: 0, // 柱子之间的间距
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        data: []
                    },
                    {
                        name: '2月',
                        type: 'bar',
                        barGap: 0, // 柱子之间的间距
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        data: []
                    },
                    {
                        name: '3月',
                        type: 'bar',
                        barGap: 0, // 柱子之间的间距
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        data: []
                    },
                    {
                        name: '部门均值',
                        type: 'line',
                        data: []
                    }
                ]
            }
        };
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
            this.options.xAxis[0].data = this.chartData.xAxisData.length === 0 ? null : this.chartData.xAxisData;
            this.options.series[0].data = this.chartData.seriesDataA.length === 0 ? null : this.chartData.seriesDataA;
            this.options.series[1].data = this.chartData.seriesDataB.length === 0 ? null : this.chartData.seriesDataB;
            this.options.series[2].data = this.chartData.seriesDataC.length === 0 ? null : this.chartData.seriesDataC;
            this.options.series[3].data = this.chartData.seriesDataAverage.length === 0 ? null : this.chartData.seriesDataAverage;
            this.options.legend.data = this.chartData.statisticLegend.length === 0 ? null : this.chartData.statisticLegend;
        },
        renderChart() {
            this.dataInit();
            if (this.options.series[0].data !== null) {
                this.echartObj.setOption(this.options);
                this.resize();
            }
        },
        resize() {
            this.echartObj && this.echartObj.resize();
        }
    }
};
</script>

<style lang="less">
.chart {
    width: 100%;
    height: 500px;
    border-radius: 4px;
    margin-bottom: 20px;
    margin-top: 20px;
    padding: 0 20px;
}
</style>
