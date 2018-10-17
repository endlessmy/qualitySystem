// Created by @qqli 20180121
// video mixin
import ViewVideoDialog from 'common/components/ViewVideoJsDialog';

export default {
    components: {
        ViewVideoDialog
    },
    data() {
        return {
            showViewVideoModalVisible: false
        };
    },
    methods: {
        showVideo() {
            this.showViewVideoModalVisible = true;
        }
    }
};
