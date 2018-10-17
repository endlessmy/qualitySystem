<template>
    <div class="help-info">
        <el-popover
            ref="helpBlock"
            :visible-arrow="false"
            trigger="click"
            placement="left-end"
            @show="onShowHelpBlock">
            <div class="popover-help-info">
                <span
                    class="icon-close"
                    @click="close">
                    <i class="el-icon-close"></i>
                </span>
                <ul class="popover-container">
                    <li>
                        <div class="block-wrapper">
                            <div class="item">
                                <span class="icon-3"></span>
                            </div>
                            <div class="item">
                                <span class="title">微信客服</span>
                            </div>
                        </div>
                        <div class="weixin-block">
                            <span class="weixin-code"></span>
                            <span>扫码进群</span>
                        </div>
                    </li>
                    <li>
                        <div class="block-wrapper">
                            <div class="item">
                                <span class="icon-5"></span>
                            </div>
                            <div class="item">
                                <span class="title">电话客服</span>
                                <span
                                    class="subtitle"
                                    style="color:#FF8D09;">
                                    025-68739802 转 6
                                </span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="block-wrapper">
                            <div class="item">
                                <span class="icon-4"></span>
                            </div>
                            <div class="item">
                                <span class="title">支持邮箱</span>
                                <span class="subtitle">
                                    <a
                                        href="mailto:spms.support@migu.cn"
                                        style="font-size:14px">spms.support@migu.cn</a>
                                </span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="block-wrapper">
                            <div class="item">
                                <span class="icon-2"></span>
                            </div>
                            <div class="item">
                                <span
                                    class="title"
                                    style="cursor:pointer"
                                    @click="openUserGuide('preview')">帮助文档</span>
                                <span
                                    class="subtitle"
                                    style="cursor:pointer"
                                    @click="openUserGuide('preview')">
                                    帮助你快速了解系统，<span
                                        style="color:#0486fe;"
                                        @click.stop="openUserGuide('download')">点击下载</span>
                                </span>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </el-popover>
        <div
            v-popover:helpBlock
            class="container-outer-wrapper">
            <div class="container">
                <div class="center-block">
                    <span class="vertical-block">
                        <span class="icon-1"></span>
                    </span>
                    <span class="vertical-block">在</span>
                    <span class="vertical-block">线</span>
                    <span class="vertical-block">客</span>
                    <span class="vertical-block">服</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from 'common/utils/misc';
import api from 'common/utils/api';

export default {
    name: 'HelpInfo',

    data() {
        return {
            helpDocument: '',
            fileToken: ''
        };
    },
    mounted() {
        this.queryHelpInfomation();
    },
    methods: {
        onShowHelpBlock() {
            this.$ga.event({
                eventCategory: 'RightButtomHelpInfoBlock',
                eventAction: 'open',
                eventLabel: '打开在线客服帮助',
                eventValue: null
            });
        },
        close() {
            this.$refs.helpBlock.showPopper = false;
        },
        queryHelpInfomation() {
            api.queryDictionary({ service_id: '13' }).then(res => {
                this.helpDocument = res.result.help_document_id ? res.result.help_document_id[0] : '';
                if (this.helpDocument) {
                    this.getPreviewToken();
                }
            });
        },
        getPreviewToken() {
            api.previewQuery({ file_id: this.helpDocument.value }).then(res => {
                if (res.token) {
                    this.fileToken = res.token;
                }
            });
        },
        openUserGuide(openType) {
            if (this.helpDocument) {
                let fileId = this.helpDocument.value;
                let fileName = this.helpDocument.label;

                let filePath =
                    window.config.context +
                    '/DocumentService/fileManage/preview/' +
                    fileId +
                    '/' +
                    fileName +
                    '?sessionId=' +
                    utils.getLoginUserInfo('sessionId');
                filePath = filePath + '&token=' + this.fileToken;
                if (openType === 'download') {
                    let downloadPath =
                        window.config.context +
                        '/DocumentService/fileManage/download/' +
                        fileId +
                        '?sessionId=' +
                        utils.getLoginUserInfo('sessionId') +
                        '&token=' +
                        this.fileToken;
                    window.open(downloadPath);
                    return false;
                }
                let baseUrl = window.location.protocol + '//' + window.location.host;
                let finalUrl = `${baseUrl}/spms/static/document/vendors/pdfjs/web/viewer.html?file=${encodeURIComponent(
                    filePath
                )}`;
                window.open(finalUrl);
            }
        }
    }
};
</script>
<style lang="less" scoped>
.help-info {
    cursor: pointer;
    position: fixed;
    right: 10px;
    bottom: 20%;
    z-index: 1010;
}
.container-outer-wrapper {
    width: 44px;
    height: 130px;
    background: #539eff;
    cursor: pointer;

    .container {
        display: table;
        margin-left: auto;
        margin-right: auto;
        .center-block {
            display: table-cell;
            vertical-align: middle;
        }
    }
}
.icon-1 {
    display: block;
    width: 32/2px;
    height: 32/2px;
    background-size: 32/2px;
    background-repeat: no-repeat;
    background-image: url('../../common/layouts/images/helpblock/help_1@2x.png');
    margin-bottom: 5px;
}
.icon-2 {
    display: block;
    width: 42/2px;
    height: 48/2px;
    background-size: 42/2px;
    background-repeat: no-repeat;
    background-image: url('../../common/layouts/images/helpblock/help_2@2x.png');
}
.icon-3 {
    display: block;
    width: 48/2px;
    height: 48/2px;
    background-size: 48/2px;
    background-repeat: no-repeat;
    background-image: url('../../common/layouts/images/helpblock/help_3@2x.png');
}
.icon-4 {
    display: block;
    width: 48/2px;
    height: 32/2px;
    background-size: 48/2px;
    background-repeat: no-repeat;
    background-image: url('../../common/layouts/images/helpblock/help_4@2x.png');
}
.icon-5 {
    display: block;
    width: 48/2px;
    height: 48/2px;
    background-size: 48/2px;
    background-repeat: no-repeat;
    background-image: url('../../common/layouts/images/helpblock/help_5@2x.png');
}
.weixin-code {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 7px;
    width: 160/2px;
    height: 160/2px;
    background-size: 160/2px;
    background-repeat: no-repeat;
    background-image: url('../../common/layouts/images/helpblock/weixin-code.png');
}
.vertical-block {
    display: block;
    font-size: 14px;
    color: #fff;
}
.popover-help-info {
    width: 320px;
    text-align: left;
    padding: 14px 10px;
    .title {
        font-size: 14px;
    }
}
.block-wrapper {
    display: block;
    .item {
        display: inline-block;
        vertical-align: middle;
        &:first-child {
            margin-right: 10px;
            width: 24px;
            text-align: center;
            span {
                margin-left: auto;
                margin-right: auto;
            }
        }
    }
    .title {
        color: #000;
        display: block;
        padding-bottom: 2px;
    }
    .subtitle {
        color: #999;
        display: block;
        a {
            color: #999;
        }
    }
}
.popover-container {
    position: relative;
    li:not(:last-child) {
        margin-bottom: 24px;
    }
}
.weixin-block {
    padding-top: 20px;
    text-align: center;
}
.icon-close {
    z-index: 1;
    cursor: pointer;
    color: #999;
    position: absolute;
    right: 20px;
    top: 18px;
}
</style>
