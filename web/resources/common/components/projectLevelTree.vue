<!--项目层级的树状图-->
<template>
    <div class="tree-map">
        <div
            ref="tree"
            class="tree">
        </div>
        <div class="hover-btns">
            <div class="show-content">
                <div class="english-number">{{ detailObj.alias_name }}</div>
                <div class="project-description">{{ detailObj.projectdetail }}</div>
            </div>

        </div>
    </div>
</template>

<script>
import Echarts from 'echarts/lib/echarts';
/*eslint-disable */
import Tree from '../../node_modules/echarts/lib/chart/tree';
import Bar from '../../node_modules/echarts/lib/chart/bar';
import Legend from '../../node_modules/echarts/lib/component/legend';
import Tooltip from '../../node_modules/echarts/lib/component/tooltip';
import Grid from '../../node_modules/echarts/lib/component/grid';
import DataZoom from '../../node_modules/echarts/lib/component/dataZoom';
import Toolbox from '../../node_modules/echarts/lib/component/toolbox';
/* eslint-enable */
export default {
    name: 'ProjectLevel',

    filters: {},

    components: {},

    mixins: [],
    props: {
        projectTree: Array
    },

    data() {
        return {
            treeToArr: [], // 遍历树得到的数组
            dataTree: [], // 获得的树形数据
            echats: null,
            detailObj: {}, // 每个节点包含的数据
            options: {
                series: [
                    {
                        type: 'tree',
                        data: '',
                        top: '1%',
                        left: '7%',
                        bottom: '1%',
                        right: '20%',
                        symbolSize: 9, // 树节点圆圈的大小
                        itemStyle: {
                            normal: {
                                borderColor: '#539EFF'
                            }
                        },
                        label: {
                            normal: {
                                position: 'left',
                                verticalAlign: 'middle',
                                align: 'right',
                                fontSize: 14 // 树节点name的大小
                            }
                        },

                        leaves: {
                            label: {
                                normal: {
                                    position: 'right',
                                    verticalAlign: 'middle',
                                    align: 'left'
                                }
                            }
                        },

                        expandAndCollapse: false // 子树折叠和展开的交互，默认为true打开
                        //                            initialTreeDepth: -1,
                        //                            animationDuration: 550,
                        //                            animationDurationUpdate: 750
                    }
                ]
            }
        };
    },

    computed: {},

    watch: {
        projectTree: function(val, oldVal) {
            this.dataTree = this.projectTree;
            this.options.series[0].data = this.projectTree;
            console.log(this.options);
            this.echats.setOption(this.options);
            this.echats.resize({
                width: this.$el.clientWidth,
                height: this.$el.clientHeight
            });
            this.treeToArr = this.funQueryTreeNode(this.dataTree); // 遍历树节点
        }
    },
    beforeMount() {},
    mounted() {
        this.echats = Echarts.init(this.$refs.tree);

        this.setShowInfo();

        //            this.echats.on('mouseout', params => {
        //                setTimeout(function(){
        //                    let tip = document.querySelector('.hover-btns');
        //                    tip.style.width = '0px';
        //                    tip.style.height = '0px';
        //                },500)
        //            })
    },

    methods: {
        // 递归遍历树
        funQueryTreeNode(infoList) {
            let finalArr = [];
            var loopFn = function(infoList) {
                for (let i = 0; i < infoList.length; i++) {
                    let item = infoList[i];
                    finalArr.push(item);
                    if (infoList[i].children && infoList[i].children.length > 0) {
                        loopFn(infoList[i].children);
                    }
                }
            };
            loopFn(infoList);
            console.log('finalArr', finalArr);
            return finalArr;
        },
        // 树节点的浮层设置
        setShowInfo() {
            this.echats.on('mouseover', params => {
                this.detailObj = params.data;
                //                console.log('params',params);
                let x = params.event.offsetX;
                let y = params.event.offsetY;
                let tip = document.querySelector('.hover-btns');
                tip.style.display = 'block';

                let mycanvas = document.getElementsByTagName('canvas');
                let canvasWidth = mycanvas[0].width;
                let canvasHight = mycanvas[0].height;
                if (y + 124 >= canvasHight && x + 237 < canvasWidth) {
                    tip.style.top = y - 124 + 'px';
                    tip.style.left = x + 'px';
                } else if (x + 237 >= canvasWidth && y + 124 < canvasHight) {
                    tip.style.top = y + 'px';
                    tip.style.left = x - 237 + 'px';
                } else if (x + 237 >= canvasWidth && y + 124 >= canvasHight) {
                    tip.style.top = y - 124 + 'px';
                    tip.style.left = x - 237 + 'px';
                } else {
                    tip.style.top = y + 'px';
                    tip.style.left = x + 'px';
                }
            });
        }
    }
};
</script>

<style lang='less'>
/*.tree {*/
/*position: relative;*/
/*width: 100%;*/
/*!*height: 500px;*!*/
/*height: 100%;*/
/*background: #f3f3f3;*/
/*!*overflow-y: auto;*!*/
/*!*padding-top: 10px;*!*/
/*!*padding-bottom: 10px;*!*/
/*}*/
.tree {
    height: 300px;
}
.tree-map {
    position: relative;

    height: 100%;
}
.hover-btns {
    background: #ffffff;
    position: absolute;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.12);
    display: none;
    width: 237px;
    height: 124px;
}
.show-content {
    padding: 10px;
}
.english-number {
    color: #666666;
}

.project-description {
    color: #333333;
}
</style>
