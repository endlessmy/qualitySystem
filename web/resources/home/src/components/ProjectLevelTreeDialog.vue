<!--
    @name: 首页 - 项目列表
    @desc: 查看项目层级的树状图
    @author: dx
-->
<template>
    <modal
        :visible="isShown"
        size="xlarge"
        @onClosed="doClose('modal')">
        <span
            slot="head"
            class="tree-title">
            项目关系树
            <span
                class="go-setting"
                @click="goProTree">
                前往设置
            </span>
        </span>
        <div
            slot="body"
            class="tree-map">
            <div
                ref="tree"
                class="tree">
            </div>
        </div>
    </modal>
</template>

<script>
import Echarts from 'echarts/lib/echarts';
/*eslint-disable */
import Tree from 'echarts/lib/chart/tree';
import Bar from 'echarts/lib/chart/bar';
import Legend from 'echarts/lib/component/legend';
import Tooltip from 'echarts/lib/component/tooltip';
import Grid from 'echarts/lib/component/grid';
import DataZoom from 'echarts/lib/component/dataZoom';
import Toolbox from 'echarts/lib/component/toolbox';
/* eslint-enable */
import { PROJECT_MODULE_ROUTER } from 'common/constants/const';
import MessageMixins from 'common/mixins/message';
import Modal from 'common/components/Modal';
import utils from 'common/utils/misc';
import api from '@/utils/api';

export default {
    name: 'ProjectLevel',

    components: { Modal },

    mixins: [MessageMixins],

    props: {
        projectTree: Array,
        clickProId: Number,
        clickProName: String,
        value: Boolean,
        editRight: Boolean
    },

    data() {
        return {
            dataTree: [], // 获得的树形数据
            echats: null,
            options: {
                tooltip: { // 悬浮时显示项目层级
                    trigger: 'item',
                    triggerOn: 'mousemove',
                    formatter: this.handleHover
                },
                series: [
                    {
                        type: 'tree',
                        data: '',
                        top: '1%',
                        left: '230',
                        bottom: '3%',
                        right: '230',
                        symbolSize: 14, // 树节点圆圈的大小
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
                                fontSize: 12, // 树节点name的大小
                                color: '#333',
                                formatter: this.handleLabel
                            },
                            emphasis: {
                                show: true
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
                    }
                ]
            }
        };
    },

    computed: {
        isShown() {
            return this.value;
        }
    },

    watch: {
        projectTree(renew, old) {
            this.$nextTick(() => {
                this.echats = Echarts.init(this.$refs.tree);
                this.dataTree = this.getNodeColor(renew);
                this.options.series[0].data = this.dataTree;
                this.echats.setOption(this.options);
                this.echats.resize({
                    width: 700,
                    height: 300,
                    silent: true
                });
                this.setShowInfo();
            });
        }
    },

    methods: {
        // 跳转到项目设置
        goProTree() {
            api.updateUserProject({ project_id: this.clickProId }).then(res => {
                location.href = `${PROJECT_MODULE_ROUTER}/${this.clickProId}/${this.clickProName}/projectDetail/projectLevelSetting`;
            });
        },

        // 处理label过长，保留15位
        handleLabel(params) {
            let handledLabel = utils.overName(params.data.name, 15);
            return handledLabel;
        },

        // 处理tooltip
        handleHover(params) {
            return params.data.name;
        },

        // 递归遍历树，处理数据
        getNodeColor(infoList) {
            let _self = this;
            var loopFn = function(infoList) {
                for (let i = 0; i < infoList.length; i++) {
                    let item = infoList[i];
                    let itemStyle = {
                        normal: {
                            borderColor: ''
                        },
                        emphasis: {
                            // hover到节点时候的颜色
                            color: ''
                        }
                    };
                    let label = {
                        normal: {
                            color: '',
                            borderColor: ''
                        }
                    };

                    // 当前项目
                    if (item.pid === _self.clickProId) {
                        itemStyle.normal.borderColor = '#539EFF'; // 节点的颜色
                        label.normal.color = '#539EFF'; // label文字的颜色
                    } else {
                        itemStyle.normal.borderColor = '#999';
                        label.normal.color = '#666';
                    }

                    // 我的项目，可以点击
                    if (parseInt(item.project_type) === 1) {
                        itemStyle.normal.borderColor = '#539EFF';
                    }

                    item.itemStyle = itemStyle;
                    item.label = label;
                    if (infoList[i].children && infoList[i].children.length > 0) {
                        loopFn(infoList[i].children);
                    }
                }
            };
            loopFn(infoList);
            let newTree = infoList;
            return newTree;
        },

        // 我的项目的树节点的点击事件
        setShowInfo() {
            this.echats.on('click', params => {
                let isMyProject = parseInt(params.data.project_type) === 1;
                if (isMyProject) {
                    let item = params.data;

                    // 更新用户最新访问的项目
                    api.updateUserProject({ project_id: item.pid }).then(res => {
                        location.href = `${PROJECT_MODULE_ROUTER}/${item.pid}/${item.name}/function/list`;
                    });
                }
            });
        },

        onSave() {
            this.$emit('input', false);
            this.$emit('onSave');
        },

        doClose() {
            this.$emit('input', false);
            // 关闭时清除实例，否则数据仅部分刷新
            this.echats.clear();
        }
    }
};
</script>

<style lang='less' scoped>
.go-setting {
    color: #539eff;
    font-size: 12px;
    padding-left: 6px;
    cursor: pointer;
}
.tree-map {
    position: relative;
    height: 100%;
    width: 700px;
    background: #f8f8f8;
    min-height: 175px;
}
.tree {
    div {
        overflow: auto !important;
    }
}
</style>
