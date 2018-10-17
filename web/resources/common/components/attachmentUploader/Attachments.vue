<!--
    @author: yewence
    @time: 2018-03
-->
<template>
    <div class="attachments-container">
        <ul class="attachment-list">
            <!-- 外部用户反馈附件列表 -->
            <li
                v-for="(item,index) in extraAttachmentList"
                v-if="item.type==='1'&& getFileSuffix(item)"
                :style="itemCss"
                :key="index"
                class="list-item">
                <div class="item-container">
                    <div class="item-cell">
                        <file-image
                            :file-suffix="getFileSuffix(item)"
                            class="attachment-icon"></file-image>
                    </div>
                    <div class="item-cell">
                        <div class="row-1">
                            <span
                                :class="{'folder-pointer':pointerCursor(item)}"
                                :title="item.file_name"
                                class="name"
                                @click="extraFilePreview(item, index)"
                                @mouseenter="previewFlagCheck(item)">
                                {{ item.file_name }}
                            </span>
                            <span class="size">（{{ item.show_file_size }}）</span>
                        </div>
                        <div class="row-2">
                            <template>
                                <div class="info">
                                    <span class="time">结束录屏时间：{{ item.record_time }}</span>
                                </div>
                                <div class="action">
                                    <a
                                        :href="downloadExtraAttachment(item)"
                                        target="_blank">下载</a>
                                </div>

                            </template>
                        </div>
                    </div>
                </div>
            </li>
            <!-- 内部用户反馈附件列表 -->
            <li
                v-for="(item,index) in attachmentsList"
                :style="itemCss"
                :key="index"
                class="list-item">
                <div class="item-container">
                    <div class="item-cell">
                        <!--可根据格式来展示对应的文件格式图标-->
                        <file-image
                            :file-suffix="getFileSuffix(item)"
                            class="attachment-icon"></file-image>
                    </div>
                    <div class="item-cell">
                        <div class="row-1">
                            <span
                                :class="{'folder-pointer':pointerCursor(item) && !item.loading}"
                                :title="item.fileName"
                                class="name"
                                @click="filePreview(item, index)"
                                @mouseenter="previewFlagCheck(item)">
                                {{ item.fileName }}
                            </span>
                            <span class="size">（{{ item.fileSize }}）</span>
                        </div>
                        <div class="row-2">
                            <template v-if="item.loading">
                                <el-progress
                                    :show-text="false"
                                    :stroke-width="5"
                                    :percentage="item.progress"
                                    class="progressbar">
                                </el-progress>
                            </template>
                            <template v-else>
                                <div class="info">
                                    <span class="author">上传人: {{ item.uploaderName || item.userName||'--' }}</span>
                                    <span class="time">{{ item.createTime | timeFilter }} </span>
                                </div>
                                <div class="action">
                                    <a
                                        v-if="item.uploaderId === currentUserId || item.creatorId === currentUserId"
                                        @click="removeAttachment(item, index)">删除</a>
                                    <a
                                        :href="downloadAttachment(item)"
                                        target="_blank">下载</a>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <view-video-dialog
            v-if="showViewVideoModalVisible"
            :modal="videoNeedModal"
            :data="onlineLookParams"
            v-model="showViewVideoModalVisible"></view-video-dialog>
    </div>
</template>
<script>
import FileImage from 'common/components/FileImage';
import utils from 'common/utils/misc';
import Viewer from 'viewerjs';
import VideoMixins from 'common/mixins/video';

export default {
    name: 'Attachments',
    components: {
        FileImage
    },
    filters: {
        timeFilter(time) {
            if (typeof time === 'number') {
                time = new Date(time);
                return utils.formatDate(time);
            } else {
                return time ? time.substr(0, time.indexOf(' ')) : '';
            }
        }
    },
    mixins: [VideoMixins],
    props: {
        attachmentsList: {
            type: Array,
            default: () => []
        },
        extraAttachmentList: {
            type: Array,
            default: () => []
        },
        itemColum: {
            type: [String, Number],
            default: 3
        },
        previewService: {
            type: String,
            default: 'DocumentService'
        },
        videoNeedModal: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            onlineLookParams: {
                fileSuffix: '',
                serviceData: '',
                previewFlag: false,
                isExtraVideo: false
            },
            galleryElement: '',
            showViewVideoModalVisible: false
        };
    },
    computed: {
        itemCss() {
            let columns = Number(this.itemColum);
            if (columns === 3 && window.innerWidth < 1500) {
                columns = 2;
            }
            return {
                width: 100 / columns + '%'
            };
        },
        devUrl() {
            return __DEV__ ? 'http://39.156.1.8:28080/spmsapi' : window.config.context;
        },
        currentUserId() {
            return Number(utils.getLoginUserInfo('userId'));
        },
        imageGalley() {
            let htmls = '';
            let imageIndex = 0;
            for (var i = 0; i < this.attachmentsList.length; i++) {
                let item = this.attachmentsList[i];
                if (utils.isPic(this.getFileSuffix(item)) && item.fileId) {
                    let imgSrc =
                        this.devUrl +
                        '/DocumentService/attachment/preview/service/' +
                        this.previewService +
                        '/file/' +
                        item.fileId +
                        '?sessionId=' +
                        utils.getLoginUserInfo('sessionId');
                    htmls += `<li><img src="${imgSrc}" file-index="${i}" image-index="${imageIndex}"></li>`;
                    imageIndex++;
                }
            }
            this.galleryElement.innerHTML = htmls;
            return this.galleryElement;
        }
    },
    created() {
        this.galleryElement = document.createElement('ul');
    },
    methods: {
        pointerCursor(item) {
            return utils.goCursor(item);
        },
        // 从文件名中提取文件的后缀
        getFileSuffix(item) {
            let fileSuffix;
            // 外部用户反馈只显示视频附件
            if (!item.fileName) {
                let index = item.file_name.lastIndexOf('.');
                if (index > -1) {
                    let extrafileSuffix = item.file_name.substring(index + 1);
                    let result = extrafileSuffix.toLowerCase();
                    let isVideo =
                        result === 'mp4' || result === 'ogg' || result === 'webm' || result === 'wmv' || result === 'mkv';
                    if (isVideo) {
                        fileSuffix = extrafileSuffix;
                    }
                }
            }
            // 内部用户反馈显示所支持的所有格式文件
            if (!item.file_name) {
                let index = item.fileName.lastIndexOf('.');
                if (index > -1) {
                    fileSuffix = item.fileName.substring(index + 1);
                }
            }
            return fileSuffix;
        },
        removeAttachment(file, index) {
            const obj = {
                file,
                index
            };
            this.$emit('removeAttachment', obj);
        },
        downloadAttachment(item) {
            let link =
                item.filelink || `/DocumentService/attachment/downloadattachment/service/FuncRequireService/file/${item.fileId}`;
            const sessionId = utils.getLoginUserInfo('sessionId');
            return link ? `${window.config.context}${link}?sessionId=${sessionId}` : '';
        },
        downloadExtraAttachment(item) {
            return item.short_url ? item.short_url : '';
        },
        filePreview(item, index) {
            // 图片预览
            // 开放视频预览其他格式 'ogg' 'webm'  'wmv'  'mkv' v2.1.2新加
            const fileType = this.getFileSuffix(item);
            let result = fileType.toLowerCase();
            let isVideo = result === 'mp4' || result === 'ogg' || result === 'webm' || result === 'wmv' || result === 'mkv';
            if (utils.isPic(fileType)) {
                this.showGallery(index);
            } else if (utils.isDoc(fileType)) {
                this.showDocument(item);
            } else if (isVideo) {
                this.onlineLookParams = Object.assign(item, {
                    serviceData: this.previewService,
                    isExtraVideo: false
                });
                this.showVideo();
            }
        },
        // 外部用户视频预览
        extraFilePreview(item, index) {
            const fileType = this.getFileSuffix(item);
            let result = fileType.toLowerCase();
            let isVideo = result === 'mp4' || result === 'ogg' || result === 'webm' || result === 'wmv' || result === 'mkv';
            if (isVideo) {
                this.onlineLookParams = Object.assign(item, {
                    serviceData: this.previewService,
                    isExtraVideo: true
                });
                this.showVideo();
            }
        },
        previewFlagCheck(item, message) {
            if (item.preview_file_code || item.previewFlag || !utils.isDoc(this.getFileSuffix(item)) || item.loading) {
                return false;
            }
            this.$emit('queryPreviwFlag', {
                file: item,
                message: message
            });
        },

        showDocument(item) {
            if (item.preview_file_code || item.previewFlag) {
                const filePath = `${this.devUrl}/DocumentService/attachment/preview/service/${this.previewService}/file/${
                    item.fileId
                }/${item.fileName}?sessionId=${utils.getLoginUserInfo('sessionId')}`;
                const urlPath = `/spms/static/document/vendors/pdfjs/web/viewer.html?file=${encodeURIComponent(filePath)}`;
                window.open(urlPath);
            } else {
                this.previewFlagCheck(item, true);
            }
        },
        showGallery(index) {
            let trueIndex = this.imageGalley.querySelector('[file-index="' + index + '"]').getAttribute('image-index');
            this.galleryViewer = new Viewer(this.imageGalley, {
                hide: e => {
                    this.galleryViewer.destroy();
                },
                show: () => {
                    this.galleryViewer.index = trueIndex;
                },
                zIndex: 9999,
                rotatable: false,
                scalable: false,
                fullscreen: false
            });
            this.galleryViewer.show();
        }
    }
};
</script>
<style>
@import '../../../node_modules/viewerjs/dist/viewer.css';
</style>
<style lang="less" scoped>
.el-icon-circle-close {
    display: inline-block;
    vertical-align: middle;
    color: #ff4949;
}
.attachments-container {
    display: table;
    width: 100%;
    line-height: normal;
}

.attachment-list {
    display: inline-block;
    margin-left: -15px;
    margin-right: -15px;
}
.list-item {
    float: left;
}
.progressbar {
    max-width: 170px;
    width: 90%;
    display: inline-block;
}
.item-container {
    padding: 5px 15px;
    overflow: hidden;
    min-width: 400px;
}
.item-cell {
    display: table-cell;
    vertical-align: top;
    width: 100%;
    &:first-child {
        width: 30px;
    }
}
.row-1,
.row-2 {
    font-size: 12px;
    line-height: 12px;
    padding-left: 5px;
}
.row-1 {
    padding-bottom: 7px;
    white-space: nowrap;
}
.info,
.action,
.name,
.size,
.author,
.time {
    display: inline-block;
    vertical-align: top;
    padding-right: 5px;
}
.name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 170px;
}
.name {
    color: #333;
    line-height: 14px;
}
.size {
    font-size: 11px;
    position: relative;
    top: 2px;
}
.info {
    color: #757a86;
}
.action {
    color: #539eff;
}

.folder-pointer:hover {
    cursor: pointer;
    color: #0486fe;
    text-decoration: underline;
}
.folder-pointer {
    color: #333;
}
</style>
