<!--
@name: 表单动态渲染
@description: 方法组件，用于渲染element ui的table表格结合自定义渲染
@author: ywc
@date: 19/03/2018
-->

<script>
export default {
    name: 'DynamicTable',
    functional: true,
    props: {
        tableData: {
            type: Array,
            default: () => []
        },
        visibleColumns: {
            type: Array,
            default: () => []
        },
        colComponentRender: Function
    },
    render: function(h, context) {
        const that = context.props;
        const columns = renderCustomColumns(h, that.colComponentRender, that.visibleColumns);
        return h(
            'el-table',
            {
                attrs: {
                    data: that.tableData
                },
                on: {
                    'sort-change': context.parent.sortChange,
                    'selection-change': context.parent.selectionChange
                },
                directives: [
                    {
                        name: 'borderTableResize'
                    }
                ]
            },
            columns
        );
    }
};

function renderCustomColumns(h, colRender, cols) {
    let data = [];
    for (let i = 0; i < cols.length; i++) {
        let item = cols[i];
        let customClass = [];
        if (item.field_remark === '标题') {
            customClass.push('td-title', 'td-fixed');
        } else if (item.sortable) {
            customClass.push('td-mouse-pointer');
        }
        let col = h('el-table-column', {
            attrs: {
                width: !item.width ? 180 : item.width === 'auto' ? '' : item.width,
                minWidth: item.field_remark === '标题' ? 360 : 100,
                className: customClass.join(' ')
            },
            props: {
                sortable: item.sortable,
                renderHeader: () => colRender(item)
            },
            scopedSlots: {
                default: props => colRender(item, props.row)
            }
        });
        data.push(col);
    }
    return data;
}
</script>
