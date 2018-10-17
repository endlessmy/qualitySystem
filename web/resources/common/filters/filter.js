export default {
    // 字符串截断
    limitStr(val, limit) {
        const _limit = limit || 50;
        return val ? (val.length > _limit ? val.substring(0, _limit) + '...' : val) : '';
    },
    // 格式化日期，将Date实例转换成格式化的字符串
    formatDate(date, showHours = false) {
        if (date === '' || date === undefined) return '--';
        if (typeof date === 'string') return date;
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        let extra = '';
        if (showHours) {
            // @qqli 2018-02-26
            const hours = `0${date.getHours()}`.slice(-2);
            const minutes = `0${date.getMinutes()}`.slice(-2);
            const seconds = `0${date.getSeconds()}`.slice(-2);
            extra = ` ${hours}:${minutes}:${seconds}`;
        }
        return `${year}-${month}-${day}${extra}`;
    },
    // 任务看板/业务/功能需求详情关联任务
    formatDateTime(time) {
        /**
         * @augments shenah
         * @createTime 2018/04/18
         * @reason ie不兼容2018.1.1 和2018-1-1 只兼容2018/1/1 new Date()这个方法
         */
        if (time.indexOf('.') > -1) {
            time = time.replace(/\./g, '/');
        } else if (time.indexOf('-') > -1) {
            time = time.replace(/\//g, '/');
        }
        if (time) {
            let d = new Date(time);
            let m = d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1);
            let D = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
            let h = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
            let t = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
            return d.getFullYear() + '-' + m + '-' + D + ' ' + h + ':' + t;
        } else {
            return `--`;
        }
    },
    // todo: delete 任务状态时间格式（业务/功能需求详情关联任务） 直接根据后端返回的数据做显示
    // formatDayTime: (msd) => {
    //     if (msd) {
    //         let dayTime = parseFloat(msd) / (1000 * 60 * 60);

    //         if (dayTime / 24 > 0) {
    //             if (dayTime % 24 >= 12) {
    //                 dayTime = parseInt(dayTime / 24) + 1;
    //             } else if (dayTime % 24 < 12 && dayTime % 24 > 0) {
    //                 dayTime = parseInt(dayTime / 24) + 0.5;
    //             } else {
    //                 dayTime = parseInt(dayTime / 24);
    //             }
    //         } else {
    //             if (dayTime % 24 >= 12) {
    //                 dayTime = 1;
    //             } else if (dayTime % 24 < 12 && dayTime % 24 > 0) {
    //                 dayTime = 0.5;
    //             } else {
    //                 dayTime = 0;
    //             }
    //         }

    //         return dayTime;
    //     } else {
    //         return 0;
    //     }
    // },
    // 任务状态对应文本（业务/功能需求详情关联任务）
    filterTaskStausText(id) {
        switch (id) {
            case 1:
                return '未开始';
            case 2:
                return '进行中';
            case 3:
                return '已完成';
            default:
                return '';
        }
    },
    // 用户反馈上传使用
    formatSize: function(size) {
        if (size > 1024 * 1024 * 1024 * 1024) {
            return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
        } else if (size > 1024 * 1024 * 1024) {
            return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
        } else if (size > 1024 * 1024) {
            return (size / 1024 / 1024).toFixed(2) + ' MB';
        } else if (size > 1024) {
            return (size / 1024).toFixed(2) + ' KB';
        } else {
            return size + 'B';
        }
    },
    formatDisableDate(time) {
        let d = new Date(time);
        d.setDate(d.getDate() + 30); // 获取30天后的日期
        const year = d.getFullYear();
        const month = `0${d.getMonth() + 1}`.slice(-2);
        const day = `0${d.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    },
    formatCompanyName: text => {
        if (text) {
            return text.indexOf('公司') > -1 ? text.substring(0, 4) : text;
        }
    }
};
