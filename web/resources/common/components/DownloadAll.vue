<!--
    详情附件全部下载
    modified by hj 2018/09/17
    @desc：应用范围：业务需求/缺陷管理/功能需求/用户反馈/任务管理/研发工单plus
        params:{
            moduleTitle:'所属模块名称',
            title:'所属详情名称',
            attachmentList:'附件下载内容',
            isAttachSuccess:'是否上传成功标识（防止用户在没上传成功时点击一键下载按钮）'
        }
-->
<template>
    <span class="download-all">
        <i class="icon-xiazai"></i>
        <a
            :href="downloadAll()"
            class="mr10"
            target="_blank">
            一键下载
        </a>
    </span>
</template>

<script>
import MessageMixins from 'common/mixins/message';
import { DOWNLOAD_ALL_DELIVERABLE } from 'common/constants/service/version';
import utils from 'common/utils/misc';
export default {
    name: 'DownloadAll',
    mixins: [MessageMixins],
    props: {
        params: Object
    },
    data() {
        return {};
    },
    methods: {
        downloadAll() {
            if (!this.params.attachmentList || !this.params.isAttachSuccess) return;
            let link = this.params.attachmentList.map(item => ({
                fileCode: item.fileCode.indexOf('.')
                    ? item.fileCode.split('.').map(item => encodeURIComponent(item))
                    : [encodeURIComponent(item.fileCode)],
                fileName: item.fileName.indexOf('.')
                    ? item.fileName.split('.').map(item => encodeURIComponent(item))
                    : [encodeURIComponent(item.fileName)]
            }));
            let date = utils.formatDate2(new Date());
            let name = `${this.params.moduleTitle}-${this.params.title}-附件下载-${date}`;
            let zipName = name.indexOf('.') ? name.split('.') : [name];
            // 需要将交付件列表里面的fileCode和fileName根据小点进行转化成数组才能够供后台解析，再将里面的字符串进行url转码
            let params = encodeURIComponent(JSON.stringify({ fileList: link, zipName: zipName }));
            let sessionId = utils.getLoginUserInfo('sessionId');
            return `${window.config.context}${DOWNLOAD_ALL_DELIVERABLE}/${params}?sessionId=${sessionId}`;
        }
    }
};
</script>
