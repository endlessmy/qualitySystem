<template>
    <div class="statistics-echarts-pie">
    </div>
</template>

<script>
import Echarts from 'echarts/lib/echarts';
/*eslint-disable */
import bar from 'echarts/lib/chart/bar';
import lengend from 'echarts/lib/component/legend';
import tooltip from 'echarts/lib/component/tooltip';
import grid from 'echarts/lib/component/grid';
import dataZoom from 'echarts/lib/component/dataZoom';
import toolbox from 'echarts/lib/component/toolbox';
/* eslint-enable */
export default {
    name: 'EchartsStackPie',
    props: {
        statisticsData: Object,
        tableTitle: Array,
        isShowExecl: Boolean,
        unit: String // 单位的显示
    },
    data() {
        let _this = this;
        return {
            echats: null,
            options: {
                backgroundColor: '#fff',
                legend: {
                    top: '15px',
                    selectedMode: false,
                    data: [],
                    textStyle: {
                        color: 'rgba(0, 0, 0, 1)'
                    },
                    itemGap: 40,
                    itemWidth: 14
                },
                toolbox: {
                    top: 0,
                    right: 20,
                    /* iconStyle:{
                            emphasis:{
                                color:'red',
                            }
                        }, */
                    showTitle: true,
                    feature: {
                        saveAsImage: {
                            title: '保存为图片'
                        },
                        dataView: {
                            readOnly: true,
                            show: true,
                            textColor: '#333',
                            buttonColor: '#539EFF',
                            buttonTextColor: '#fff',
                            optionToContent: function(opt) {
                                return _this.chartDataViewContent(opt, _this.tableTitle);
                            }
                        }
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)'
                },
                series: [
                    {
                        stillShowZeroSum: true,
                        type: 'pie',
                        radius: ['0%', '50%'],
                        itemStyle: {
                            normal: {
                                opacity: 1
                            }
                        },
                        label: {
                            normal: {
                                formatter: function(params) {
                                    return params.value + _this.unit + '(' + params.percent + '%)' + '\n' + params.name;
                                },
                                textStyle: {
                                    color: 'rgba(0, 0, 0, 1)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(0, 0, 0, 1)'
                                },
                                length: 30,
                                length2: 60
                            }
                        },
                        data: []
                    }
                ]
            }
        };
    },
    computed: {
        chartOption() {
            if (this.statisticsData.legend) {
                this.options.legend.data = this.statisticsData.legend.data;
                this.options.series[0].data = this.statisticsData.series[0].data;
            }
            return this.options;
        }
    },
    watch: {
        statisticsData(val, oldVal) {
            if (val != {}) {
                this.show();
            }
        }
    },
    mounted() {
        this.echats = Echarts.init(this.$el);
    },
    methods: {
        show() {
            // 如果视图窗口是打开状态，关闭视图
            if (this.$el.childNodes.length === 3) {
                this.$el.lastChild.lastChild.lastChild.click();
            }
            this.echats.setOption(this.chartOption);
            this.echats.resize({
                width: this.$el.clientWidth,
                height: this.$el.clientHeight
            });
        },
        chartDataViewContent(opt, tableTitle) {
            this.buttonStyleListen();
            let yAxisData = '';
            let seriesName = '';
            for (var i = 0; i < tableTitle.length; i++) {
                let onedata = tableTitle[i];
                seriesName += `<td>${onedata}</td>`;
            }
            for (let i = 0; i < opt.series[0].data.length; i++) {
                let onedata = opt.series[0].data[i];
                yAxisData += `<tr><td>${onedata.name}</td><td>${onedata.value}</td></tr>`;
            }
            let table = '';
            table += `<table class="chart-data-view-pie">
                            <thead>
                                <tr>
                                    ${seriesName}
                                </tr>
                            </thead>
                            <tbody>
                                   ${yAxisData}
                            </tbody>
                        </table>`;
            return table;
        },
        buttonStyleListen: function() {
            // 监控情况
            let intervalRunning = false;
            // 监控查找元素
            const start = setInterval(() => {
                intervalRunning = true;
                if (this.$el.childNodes.length === 3) {
                    changeButtonStyle(this.$el.lastChild.lastChild.lastChild);
                    clearInterval(start);
                    intervalRunning = false;
                }
            }, 50);
            // 5s后取消监控以防问题
            setTimeout(function() {
                if (intervalRunning) {
                    clearInterval(start);
                }
            }, 5000);
            // 改变元素样式
            function changeButtonStyle(elm) {
                elm.style.padding = '2px 10px';
                elm.style.marginRight = '10px';
            }
        }
    }
};
</script>

<style lang="less">
.statistics-echarts-pie {
    position: relative;
    width: 100%;
    height: 100%;
    h4 {
        height: 30px;
        margin: 0px !important;
        text-align: left;
        font-size: 16px;
    }
    .chart-data-view-pie {
        border-collapse: collapse;
        line-height: 30px;
        font-size: 12px;
        width: 100%;
        text-align: center;
        cellpadding: 0;
        thead > tr {
            font-size: 14px;
            background: #f5f7fa;
            line-height: 38px;
            border: 1px solid #f5f7fa;
        }
        tbody > tr {
            color: #757a86;
            border: 1px solid #f3f3f3;
        }
    }
}
</style>
