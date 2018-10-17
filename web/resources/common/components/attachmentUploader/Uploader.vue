<!--
    @author: yewence
    @time: 2018-03
-->

<template>
    <el-upload
        ref="upload"
        :action="formatUrl"
        :auto-upload="true"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-progress="progressHandle"
        :headers="reqHeaders"
        :multiple="multiple"
        class="attachments-uploader">
        <span class="primary">
            <i class="icon-attachment mr5"></i>
            <span>添加附件</span>
        </span>
        <div
            v-if="tipObj.flag"
            slot="tip"
            class="el-upload__tip">{{ tipObj.message }}</div>
    </el-upload>
</template>

<script>
import md5 from 'md5';
import MessageMixins from 'common/mixins/message';
export default {
    name: 'FileUploader',

    mixins: [MessageMixins],

    props: {
        validFileType: Array,
        multiple: Boolean,
        uploadUrl: String,
        attachmentsList: Array,
        tipObj: Object
    },
    data() {
        return {
            fileList: []
        };
    },

    computed: {
        reqHeaders() {
            return {
                'user-sessionid': window.localStorage.sessionId,
                'request-sessionid': md5(
                    this.formatUrl + window.localStorage.sessionId + (this.uploadParams ? JSON.stringify(this.uploadParams) : '')
                )
            };
        },
        formatUrl() {
            return window.config.context + this.uploadUrl;
        }
    },
    beforeMount() {},

    mounted() {},
    methods: {
        beforeUpload(file) {
            // 验证允许上传文件后缀
            const fileTypeValidater = this.validFileType.some(t => {
                let regex = new RegExp(`${t}$`, 'g');
                return regex.test(file.name.toLowerCase());
            });
            if (!fileTypeValidater) {
                this.showWarningBox('文件类型只能是：' + this.validFileType.join('，'));
                return false;
            }

            // 文件大小限制验证
            if (file.size > 104857600) {
                this.showWarningBox('附件大小不能超过100M');
                return false;
            }

            // 已有文件名重名验证 todo: 暂时注释
            const duplicateFile =
                this.attachmentsList && this.attachmentsList.length
                    ? this.attachmentsList.some(_file => file.name === _file.fileName)
                    : false;
            if (duplicateFile) {
                this.showWarningMsg('已经存在同名文件');
                return false;
            }

            // 文件通过验证->准备上传
            const obj = {
                loading: true,
                progress: 0,
                fileName: file.name,
                fileCode: '',
                fileSize: this.formatSize(file.size),
                createTime: new Date().toLocaleString().replace(/\//gi, '-')
            };
            this.$emit('onAdd', obj);
            return true;
        },
        progressHandle(event, file) {
            const obj = {
                progress: event.percent,
                fileName: file.name
            };
            this.$emit('onProgress', obj);
        },
        // 附件上传成功后
        handleSuccess(res, file) {
            if (res.code === 200) {
                this.$emit('onUploaded', res);
            } else {
                this.$emit('onError', res);
                this.showErrorMsg(res.remark || '上传出错');
            }
        },
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
        handleError(err, file) {
            this.$emit('onError', err);
        }
    }
};
</script>

<style lang="less">
.el-upload-list {
    display: none;
}
.el-upload__tip {
    margin-top: -10px !important;
}
</style>
