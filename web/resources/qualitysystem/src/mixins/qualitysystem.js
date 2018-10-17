/**
 * @description:
 *
 * @author: jjq
 * @date: 2018/7/30
 */
export default {
    methods: {
        setNavItem(obj) {
            window.localStorage.setItem('qualityServiceNavPath', JSON.stringify(obj));
        },
        getNavItem(obj) {
            const str = window.localStorage.getItem('qualityServiceNavPath');
            if (str) {
                return JSON.parse(str);
            }
            // return { name: '待我处理', path: '/qualitySystem/homeQualityDimension' };
        },

        checkAvailDate(date) {
            const nowTime = +new Date();
            const selectedTime = +date;
            return nowTime - selectedTime > 24 * 60 * 60 * 1000;
        },
        // table无数据时，计算无数据时的table的高度和外层div的高度,textHeight为表上方的文本高度，如“全部列表（55）”
        computeHeightByEmpty(pageName, pageClass, textHeight) {
            // if (document.getElementsByClassName('el-table__empty-block')[0]) {
            // 出现暂无数据的时候作特殊处理
            let listDivHeight = this.getListDivHeight(pageName) - textHeight;
            if (listDivHeight < 300) {
                this.tableHeight = '';
                document.getElementsByClassName(pageClass)[0].style.height = listDivHeight + 300 + 'px';
            } else {
                this.tableHeight = '';
                document.getElementsByClassName(pageClass)[0].style.height = this.getListDivHeight(pageName) + 'px';
            }
            // }
        }
    }
};
