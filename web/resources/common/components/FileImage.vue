// 新建|编辑|详情页面附件使用
<template>
    <div
        :class="wrapClass()"
        class="img-wapper">
        <span :class="[theBg,theCommon]"></span>
    </div>
</template>
<script>
export default {
    name: 'ImgWapper',
    props: {
        fileSuffix: {
            type: String
        },
        type: {
            type: String,
            default() {
                return '';
            }
        }
    },
    data() {
        return {
            imgClass: '',
            theBg: '',
            theCommon: 'theCommon'
        };
    },
    watch: {
        fileSuffix(renew, old) {
            this.addSrc(this.fileSuffix);
        }
    },
    mounted() {
        this.addSrc(this.fileSuffix);
    },
    methods: {
        wrapClass() {
            if (this.type === 'document') {
                return 'document-file';
            } else {
                return '';
            }
        },
        addSrc(fileSuffix) {
            if (fileSuffix == null) {
                this.theBg = 'fileBg';
            } else {
                fileSuffix = fileSuffix.toLowerCase();
                switch (fileSuffix) {
                    case 'doc':
                    case 'docx':
                        this.theBg = 'wordBg';
                        break;
                    case 'vsd':
                        this.theBg = 'vsdBg';
                        break;
                    case 'xls':
                    case 'xlsx':
                    case 'xlsm':
                        this.theBg = 'xlsBg';
                        break;
                    case 'ppt':
                    case 'pptx':
                        this.theBg = 'pptBg';
                        break;
                    case 'zip':
                    case 'tar':
                    case 'gz':
                    case 'war':
                    case 'rar':
                    case 'jar':
                        this.theBg = 'zipBg';
                        break;
                    case 'jpg':
                    case 'png':
                    case 'gif':
                    case 'bmp':
                    case 'jpeg':
                        this.theBg = 'jpgBg';
                        break;
                    case 'mp4':
                    case 'wmv':
                    case 'mkv':
                    case 'webm':
                    case 'ogg':
                        this.theBg = 'mp4Bg'; // v2.1.2版本开放四个视频格式文件（wmv|mkv|webm|ogg）
                        break;
                    case 'eml':
                    case 'msg':
                        this.theBg = 'emailBg';
                        break;
                    case 'txt':
                        this.theBg = 'txtBg';
                        break;
                    case 'pdf':
                        this.theBg = 'pdfBg';
                        break;
                    case 'log':
                        this.theBg = 'logBg';
                        break;
                    case 'md':
                        this.theBg = 'markdownBg';
                        break;
                    default:
                        this.theBg = 'fileBg';
                        break;
                }
            }
        }
    }
};
</script>
<style lang="less" scoped>
.document-file {
    padding-top: 8px;
    padding-right: 6px;
}
.img-wapper {
    .theCommon {
        background-size: 24px 30px;
        background-position: 50% 0;
        background-repeat: no-repeat;
        width: 30px;
        height: 30px;
        display: inline-block;
    }

    .wordBg {
        background-image: url(../../common/layouts/images/document/word@2x.png);
    }
    .vsdBg {
        background-image: url(../../common/layouts/images/document/vsd.png);
    }
    .xlsBg {
        background-image: url(../../common/layouts/images/document/xls.png);
    }
    .pptBg {
        background-image: url(../../common/layouts/images/document/ppt@2x.png);
    }
    .zipBg {
        background-image: url(../../common/layouts/images/document/yasuobao.png);
    }
    .mp4Bg {
        background-image: url(../../common/layouts/images/document/mp4.png);
    }
    .txtBg {
        background-image: url(../../common/layouts/images/document/txt.png);
    }
    .pdfBg {
        background-image: url(../../common/layouts/images/document/pdf.png);
    }
    .logBg {
        background-image: url(../../common/layouts/images/document/log.png);
    }
    .emailBg {
        background-size: 24px 16px;
        background-image: url(../../common/layouts/images/document/email.png);
    }
    .fileBg {
        background-size: 24px 21px;
        background-image: url(../../common/layouts/images/document/wenjianjia.png);
    }
    .jpgBg {
        background-size: 24px 24px;
        background-image: url(../../common/layouts/images/document/tupian.png);
    }
    .markdownBg {
        background-size: 24px 24px;
        background-image: url(../../common/layouts/images/document/markdown.png);
    }
    .mhtBg {
        background-size: 24px 24px;
        background-image: url(../../common/layouts/images/document/mht.png);
    }
}
</style>
