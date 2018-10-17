// @author： lizihao
// @date: 2018/05/25
// @desc:
//      封装各模块通过获取url的query参数作为查询条件
export default {
    methods: {
        // 获取url的query参数，作为查询条件,适用场景：质量系统跳转项目管理-缺陷模块，项目概览跳缺陷管理,需求
        initFilterParams() {
            let routeQuery = this.$route.query.queryParams;
            if (routeQuery) {
                let queryParams = JSON.parse(this.$route.query.queryParams);
                let tempTimeRange = []; // 暂存时间范围
                for (let j = 0; j < queryParams.length; j++) {
                    let item = queryParams[j];
                    this.requestParams[item.field] = item.value;
                    let obj = {};
                    if (item.name instanceof Array) {
                        obj = { label: item.label, value: item.name.join(','), key: item.field };
                        this.filterItem.push(obj);
                    } else if (item.field === 'defect_create_start_time' || item.field === 'defect_create_end_time') {
                        tempTimeRange.push(item);
                    } else {
                        obj = { label: item.label, value: item.name, key: item.field };
                        this.filterItem.push(obj);
                    }
                }
                // 当有查询时间时执行，拼接开始、结束时间
                let filtItem = {};
                if (tempTimeRange.length > 0) {
                    filtItem = {
                        label: tempTimeRange[0].label,
                        value: `${tempTimeRange[0].name}|${tempTimeRange[1].name}`,
                        key: tempTimeRange[0].field
                    };
                    this.filterItem.push(filtItem);
                }
            }
        }
    }
};
