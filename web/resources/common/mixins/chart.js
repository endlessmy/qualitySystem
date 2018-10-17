export default {
    // activated(){
    //  const chartInstance = this.$refs.chart;
    //  setTimeout(()=>{
    //  chartInstance && chartInstance.resize();
    //  }, 100);
    // }

    methods: {
        chartDataViewContent(opt, titleArr) {
            let axisData = []; // 坐标数据
            if (opt.xAxis) {
                axisData = opt.xAxis[0].data || opt.yAxis[0].data;
            } else {
                axisData = opt.legend[0].data;
            }
            let series = opt.series; // 折线图数据
            let tdHeads = '';
            let tdBodys = '';

            titleArr.forEach(function(item) {
                tdHeads += `<td style="padding: 0 10px">${item}</td>`; // 图表名称
            });

            // 表体
            let table = `<table border="0" style="border-collapse:collapse;line-height: 30px;font-size:12px;width:99.5%;text-align:center;cellpadding:0;">`;
            table += `<tbody ><tr style="font-size: 14px;background: #f5f7fa;line-height: 38px;border: 1px solid #f5f7fa;">${tdHeads} </tr>`;
            for (let i = 0, l = axisData.length; i < l; i++) {
                for (let j = 0; j < series.length; j++) {
                    // 组装表数据
                    if (series[j].data == null) {
                        tdBodys += `<td>---</td>`;
                    } else {
                        // 坐标图
                        if (opt.xAxis) {
                            tdBodys += `<td>${series[j].data[i]}</td>`;
                        } else {
                            tdBodys += `<td>${series[j].data[i].value}</td>`;
                        }
                    }
                }
                table += `<tr style="color: #757a86;border:1px solid #f3f3f3;">`;
                // 坐标图时
                if (opt.xAxis) {
                    table += `<td style="padding: 0 10px">${axisData[i]}</td>${tdBodys}</tr>`;
                } else {
                    table += `<td style="padding: 0 10px">${axisData[i].name}</td>${tdBodys}</tr>`;
                }

                tdBodys = '';
            }
            table += '</tbody></table>';
            return table.replace(/\<td\>undefined\<\/td\>/g, '');
        }
    }
};
