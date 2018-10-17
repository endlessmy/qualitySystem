<!--快速编辑-->
<script>
import InputQuickEdit from './inputQuickEdit';
import SelectQuickEdit from './selectQuickEdit';

const components = {
    InputQuickEdit,
    SelectQuickEdit
};
export default {
    name: 'QuicEditInline',
    functional: true,
    props: {
        basicInfo: Object,
        row: Object,
        rowKey: [Object, String],
        mapData: Array,
        configuration: Object,
        triggerFunction: Function,
        componentName: String,
        admin: Boolean,
        optionArray: Array
    },
    render: function(h, context) {
        let props = context.props;
        return h(components[props.componentName], {
            props
        });
    }
};
</script>
