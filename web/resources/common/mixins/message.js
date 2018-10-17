export default {
    methods: {
        /* 所有确认弹窗都能调用该方法，通过传入title和content的值来改变内容---by jjq
         增加可以设置customClass（自定义类名）；
         type，confirmButtonClass从固定值修改为默认值——by 罗怀梁 2019.06.01 */
        confirmWarning({
            title = '删除提示',
            content = '',
            confirmButtonText = '确定',
            cancelButtonText = '取消',
            showConfirmButton = true,
            showCancelButton = true,
            customClass = 'custom-message-box',
            type = 'warning',
            confirmButtonClass = 'el-button--danger confirm'
        }) {
            return this.$confirm(content, title, {
                showConfirmButton,
                showCancelButton,
                confirmButtonText,
                cancelButtonText,
                customClass,
                type,
                confirmButtonClass
            });
        },

        showErrorMsg(message) {
            this.$message({
                message: message,
                type: 'error'
            });
        },

        showWarningMsg(message, onClose) {
            this.$message({
                message: message,
                onClose: onClose,
                type: 'warning'
            });
        },

        showWarningBox(message) {
            this.$alert(message, {
                confirmButtonText: '确定',
                title: '警告',
                closeOnClickModal: true,
                type: 'warning'
            });
        },

        showSuccessMsg(msg) {
            this.$message({
                message: msg,
                type: 'success'
            });
        },
        showInfoMsg(msg) {
            this.$message({
                message: msg,
                type: 'info'
            });
        }
    }
};
