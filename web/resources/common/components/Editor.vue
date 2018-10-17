<template lang="html">
    <div
        id="editor"
        :class="customClass"
        style="padding-top:6px"
        @input="outputContent">
    </div>
</template>
<script>
/**
* 使用的模块：缺陷，需求，反馈的新建编辑页面，其中新建缺陷有默认的前置条件。
* 新建版本用的是项目下的editor组件。
* 兼容性说明：
  windows下从word粘贴内容到chrome和firefox会有超级多冗余无用代码，字数会超出, 更改wangEditor源码，去掉标签和样式；
  ie支持较好，支持复制文字样式和粘贴图片，所包含的标签和样式属于正常的标签；
  从wps、excel粘贴没有问题；
  pasteTextHandle 这个方法ie不支持
 */
/*eslint-disable */
import WangEditor from 'common/vendors/wangeditor2/release/wangEditor.js';
/* eslint-enable */
import { EDITOR_INIT_STRING } from '../constants/const';
import utils from 'common/utils/misc';

export default {
    name: 'Editor',
    props: {
        inputContent: {
            type: String,
            default: ''
        },
        uploadUrl: {
            type: String,
            default: ''
        },
        contentInfo: {
            type: String,
            default: ''
        },
        customClass: {
            type: String,
            default: 'custom-editor'
        }
    },
    data() {
        return {
            content: '',
            instance: null
        };
    },
    computed: {},
    mounted() {
        this.createEditor();
    },
    methods: {
        createEditor() {
            this.$nextTick(() => {
                const self = this;
                let WangEditor = window.wangEditor;
                const editor = new WangEditor('#editor');
                this.instance = editor;
                // editor.customConfig.pasteText = true; //粘贴保留样式
                editor.customConfig.menus = ['bold', 'foreColor', 'image', 'table'];
                editor.customConfig.uploadImgServer = this.uploadUrl;
                editor.customConfig.uploadFileName = 'file';
                editor.customConfig.showLinkImg = false; // 隐藏网络图片
                editor.customConfig.zIndex = 100;
                // pasteTextHandle 会执行2次
                editor.customConfig.pasteTextHandle = (content = '') => {
                    // chrome和firefox，word复制文本会有很多额外的代码
                    let brContent = content.replace(/\n/g, '<br>');
                    return brContent.replace(/\s/g, '&nbsp;');
                };
                editor.customConfig.onchange = function() {
                    self.formatContent(editor.txt.html());
                };
                // 上传图片
                editor.customConfig.uploadImgHooks = {
                    customInsert(insertImg, result, editor) {
                        setTimeout(() => {
                            let sessionId = utils.getLoginUserInfo('sessionId') || 'b168ae50e33d9281d26f1465f22b9819';
                            var url = `${window.config.context}${result.filelink}?sessionId=${sessionId}`;

                            var imgList = editor.$textElem[0].querySelectorAll('img');
                            for (var i = 0; i < imgList.length; i++) {
                                var src = imgList[i].getAttribute('src');
                                if (~src.indexOf('base64')) {
                                    imgList[i].setAttribute('src', url);
                                    return;
                                }
                            }
                            insertImg(url);
                        }, 1);
                    }
                };
                var html = this.contentInfo ? this.contentInfo : EDITOR_INIT_STRING;
                editor.create();
                editor.txt.html(html);
                document.querySelector('#editor .w-e-text').blur();
                this.$emit('ready', this.instance);
            });
        },
        formatContent(content) {
            this.content = content;
            this.outputContent();
        },
        outputContent() {
            this.$emit('input', this.content);
            this.$emit('validEditor');
        }
    }
};
</script>

<style lang="less" scoped>
#editor {
    max-height: 400px;

    &.modal-height {
        max-height: 200px;
    }
    .w-e-toolbar {
        height: 40px;
        background: #fff !important;
        border: 1px solid #dcdfe5 !important;
    }
    .w-e-text-container {
        padding-top: 8px;
        border: 1px solid #dcdfe5 !important;
        border-top: none !important;
        height: 353px;
    }
}
</style>
