<!--
    @author: yewence
    @time: 2018-03
-->
<template>
    <div>
        <uploader
            v-if="uploadUrl"
            ref="uploader"
            :valid-file-type="validFileType"
            :multiple="multiple"
            :upload-url="uploadUrl"
            :attachments-list="allAttachments"
            :tip-obj="tipObj"
            @onAdd="onAdd"
            @onProgress="onProgress"
            @onUploaded="onUploaded"
            @onError="onError">
        </uploader>
        <attachments
            :video-need-modal="videoNeedModal"
            :preview-service="previewService"
            :item-colum="itemColum"
            :attachments-list="allAttachments"
            :extra-attachment-list="allExtraAttachments"
            @queryPreviwFlag="_queryPreviwFlag"
            @removeAttachment="_removeAttachment">
        </attachments>
    </div>
</template>
<script>
import Uploader from './Uploader';
import Attachments from './Attachments';
import MessageMixins from 'common/mixins/message';

export default {
    name: 'AttachmentsUploader',
    components: {
        Uploader,
        Attachments
    },
    mixins: [MessageMixins],

    props: {
        // fileUploaded: Function,
        attachmentsApi: {
            type: Object,
            required: true
        },
        validFileType: {
            type: Array,
            default() {
                return [];
            }
        },
        multiple: Boolean,
        uploadUrl: {
            type: String,
            default: ''
        },
        attachmentsList: {
            type: Array,
            default() {
                return [];
            }
        },
        extraAttachmentList: {
            type: Array,
            default: () => []
        },
        tipObj: {
            type: Object,
            default() {
                return {
                    flag: false,
                    message: '只能上传docx，pdf，xlsx，xls文件'
                };
            }
        },
        itemColum: [String, Number],
        videoNeedModal: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            allAttachments: [],
            allExtraAttachments: []
        };
    },
    computed: {
        previewService() {
            return this.attachmentsApi.previewService || '';
        },
        removeAttachment() {
            return this.attachmentsApi.removeAttachment || '';
        },
        queryPreviwFlag() {
            return this.attachmentsApi.queryPreviwFlag || '';
        },
        fileUploaded() {
            return this.attachmentsApi.fileUploaded || '';
        }
    },
    watch: {
        attachmentsList(val) {
            this.allAttachments = val || [];
        },
        extraAttachmentList(val) {
            this.allExtraAttachments = val || [];
        }
    },
    mounted() {
        this.allAttachments = this.attachmentsList ? this.attachmentsList : [];
        this.allExtraAttachments = this.extraAttachmentList ? this.extraAttachmentList : [];
    },
    methods: {
        onAdd(file) {
            this.$emit('attachSuccess', false);
            this.allAttachments.push(file);
        },
        onProgress(file) {
            let _file = this.findFileInList(file);
            _file.progress = file.progress;
        },
        onUploaded(file) {
            let _file = this.findFileInList(file);
            _file = Object.assign(_file, file);
            _file.loading = false;
            this.$emit('attachSuccess', true);
            if (this.fileUploaded) {
                this.fileUploaded(_file);
            }
        },
        onError(err) {
            this.showErrorMsg(err || '上传出错');
        },
        uploadingCheck() {
            let uploading = this.allAttachments.some(item => item.loading === true);

            return uploading;
        },
        findFileInList(file) {
            let _file = this.allAttachments.filter(item => item.fileName === file.fileName);

            // _file 存在同名的情况
            return _file ? _file[_file.length - 1] : file;
        },
        _queryPreviwFlag({ file, message }) {
            let param = {
                service: this.previewService,
                file_id: file.fileId
            };
            this.queryPreviwFlag(param).then(res => {
                if (res.preview_flag) {
                    file.previewFlag = res.preview_flag;
                } else {
                    if (message) {
                        this.showInfoMsg(file.fileName + '正在生成预览，请稍后尝试。');
                    }
                }
            });
        },
        _removeAttachment({ file, index }) {
            this.confirmWarning({
                title: '提示',
                content: `删除“${file.fileName}”文件，是否继续？`
            }).then(
                () => {
                    this.removeAttachment(file).then(
                        () => {
                            this.allAttachments.splice(index, 1);
                        },
                        () => {
                            this.showErrorMsg('删除失败');
                        }
                    );
                },
                () => {
                    // cancel remove from confirmation
                }
            );
        }
    }
};
</script>
