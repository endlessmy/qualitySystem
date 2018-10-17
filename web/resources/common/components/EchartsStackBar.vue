<template>
    <div
        class="statistics-echarts-bar"
        style="width:100%;height:420px;">
    </div>
</template>

<script>
/*
传入数据格式
statisticsData:{
    'yAxis': ['名称'，'名称'，'名称']，// y轴数据，名称上外部计算总数后代入
    'xAxis': {
    '自定义_key_不影响':{
        name: '相对bar的名称',
        data:[1,2,3],
        color: '#F2C500'
    },
    '自定义_key_不影响':{
        name: '相对bar的名称',
        data:[1,2,3],
        color: '#87c3F6'
    },
    '自定义_key_不影响':{
        name: '相对bar的名称',
        data:[1,2,3],
        color: '#639ae3'
    },
    xMax: number // x轴最大数值
}
*/

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
    name: 'EchartsStackBar',
    props: {
        statisticsData: Object,
        number: Number, // 如果没有传这个参数证明是整数,如果传了,证明要保留几位小数,
        unit: String, // 如果没有传默认是单位是个,传入的话以传入的为准
        addedFlag: String, // 如果没有传默认是叠加的柱状，如果传了就是非叠加的柱状图
        yxaisName: String, // y坐标名字，如果没有传默认是单位，传入的话以传入的为准
        isGetSumOnLegend: Boolean // 图例上是否展示统计的总和，如果没有传默认是图例上展示数据总和，传入的话就不展示数据总和
    },
    data() {
        let _this = this;
        return {
            echats: null,
            xAxisMax: null,
            defaultOption: {
                toolbox: {
                    top: 0,
                    right: 20,
                    /* iconStyle:{
                        emphasis:{
                            color:'red',
                        }
                    }, */
                    //                     showTitle: false,
                    feature: {
                        saveAsImage: {
                            title: '保存为图片'
                        },
                        dataView: {
                            title: '数据视图',
                            show: true,
                            readOnly: true,
                            textColor: '#333',
                            buttonColor: '#539EFF',
                            buttonTextColor: '#fff',
                            optionToContent: opt => this.chartDataViewContent(opt)
                        }
                    }
                },
                grid: {
                    left: 5,
                    right: 50,
                    top: 60,
                    bottom: 25,
                    containLabel: true
                },
                backgroundColor: '#fff',
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderColor: '#00BFFF',
                    borderWidth: 1,
                    padding: 10,
                    axisPointer: {
                        type: 'line',
                        lineStyle: {
                            opacity: 0
                        }
                    },
                    extraCssText: 'display:table;box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);color:#000',
                    formatter: arr => {
                        let title = '';
                        let marker = arr.map(item => {
                            title = item.axisValueLabel;
                            let serialName = item.seriesName.split(' ')[0];
                            return `<li>${item.marker} ${serialName} ${item.data}</li>`;
                        });
                        let template = `<div style="padding-bottom:10px">${title}</div><ul>${marker
                            .join()
                            .replace(/,/g, '')}</ul>`;
                        return template;
                    }
                },
                animation: false,
                dataZoom: [
                    {
                        type: 'slider',
                        yAxisIndex: [0],
                        start: 0,
                        end: 100,
                        show: false,
                        zoomLock: true,
                        backgroundColor: 'transparent',
                        showDetail: false,
                        handleSize: '0%',
                        width: 15,
                        dataBackground: {
                            lineStyle: {
                                opacity: 0
                            },
                            areaStyle: {
                                opacity: 0
                            }
                        }
                    }
                ],
                legend: {
                    data: [],
                    itemWidth: 14,
                    itemGap: 45
                },
                xAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: { color: '#333' }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    max: val => {
                        if (this.xAxisMax === null) {
                            this.xAxisMax = val.max + val.max / 5;
                        }
                        return this.xAxisMax ? this.xAxisMax : val.max;
                    },
                    data: []
                },
                yAxis: {
                    name: this.yxaisName ? this.yxaisName : `单位(${_this.unit || '个'})`,
                    nameGap: 12,
                    type: 'category',
                    axisLabel: {
                        textStyle: {
                            color: '#6D7684'
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    data: []
                },
                series: []
            }
        };
    },
    computed: {
        chartOption() {
            this.defaultOption.yAxis.data = this.statisticsData.yAxis;
            this.defaultOption.legend.data = [];
            let series = [];
            for (let item in this.statisticsData.xAxis) {
                let dataSum = this.statisticsData.xAxis[item].data.reduce((a, b) => a + b);
                if (this.number) {
                    dataSum = dataSum.toFixed(this.number);
                }
                if (this.statisticsData.xAxis[item].haveLength) {
                    dataSum = this.number ? (dataSum / this.statisticsData.xAxis[item].haveLength).toFixed(this.number) : dataSum;
                }
                if (this.unit) {
                    dataSum += this.unit;
                } else {
                    dataSum += '个';
                }
                const obj = Object.assign(
                    {},
                    {
                        name: this.isGetSumOnLegend
                            ? this.statisticsData.xAxis[item].name
                            : this.statisticsData.xAxis[item].name + ` (${dataSum})`,
                        data: this.statisticsData.xAxis[item].data,
                        type: 'bar',
                        barMinHeight: 20,
                        barMaxWidth: 20,
                        barCategoryGap: 10,
                        stack: this.addedFlag === 'addedFlag' ? '' : '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: this.statisticsData.xAxis[item].color
                            }
                        }
                    }
                );
                series.push(obj);
                this.defaultOption.legend.data.push(`${obj.name}`);
            }
            this.defaultOption.series = series;
            this.defaultOption.dataZoom[0].show = this.statisticsData.yAxis.length > 10;
            this.defaultOption.dataZoom[0].start = 100;
            this.defaultOption.dataZoom[0].end = 100 - Math.round(10 / this.statisticsData.yAxis.length * 100);
            if (this.statisticsData.xMax) {
                this.defaultOption.xAxis.max = this.statisticsData.xMax + this.statisticsData.xMax / 5;
            }
            return this.defaultOption;
        }
    },
    watch: {
        statisticsData() {
            if (this.statisticsData.yAxis && this.statisticsData.xAxis) {
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
            // console.log('this.chartOption', this.chartOption);
            this.echats.setOption(this.chartOption);
            this.echats.resize({
                width: this.$el.clientWidth,
                height: this.$el.clientHeight
            });
        },
        chartDataViewContent(opt) {
            this.buttonStyleListen();
            let yAxisData = '';
            for (var i = opt.yAxis[0].data.length - 1; i >= 0; i--) {
                let data = '';
                for (var v = opt.series.length - 1; v >= 0; v--) {
                    data += `<td>${opt.series[v].data[i]}</td>`;
                }
                yAxisData += `<tr>
                    <td>${opt.yAxis[0].data[i]}</td>
                    ${data}
                </tr>`;
            }
            let seriesName = '';
            for (let i = opt.series.length - 1; i >= 0; i--) {
                seriesName += `<td>${opt.series[i].name}</td>`;
            }
            let table = `<table class="chart-data-view">
                            <thead>
                                <tr>
                                    <td>名称</td>
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
.statistics-echarts-bar {
    line-height: 20px;
    h4 {
        margin: 10px 0px !important;
    }
}
.chart-data-view {
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
    td:first-child {
        text-align: left;
        padding-left: 10px;
    }
}
</style>
