<!--
    文档模块，富文本编辑框使用，全屏显示
    @dengxue
-->
<template lang="html">
    <div
        id="editor"
        :style="heightSet"
        @input="outputContent">
    </div>
</template>
<script>
/*eslint-disable */
import WangEditor from 'common/vendors/wangeditor2/release/wangEditor.js';
/* eslint-enable */
import utils from 'common/utils/misc';
import { EDITOR_INIT_STRING } from '../constants/const';
import { mapActions } from 'vuex';

export default {
    props: ['inputContent', 'uploadUrl', 'contentInfo'],
    data() {
        return {
            content: '',
            instance: null,
            heightSet: { height: '300px', marginBottom: '40px' },
            imgIdList: []
        };
    },
    mounted() {
        this.createEditor();
        this.openSizeChange();
    },
    methods: {
        ...mapActions(['changeEditorFlag']),
        openSizeChange() {
            // 弹出框的大小随窗口的变化而变化
            let _this = this;
            this.heightSet.height = document.body.offsetHeight - 186 + 'px';
            window.onresize = function() {
                _this.heightSet.height = document.body.offsetHeight - 186 + 'px';
                _this.$forceUpdate();
            };
        },
        createEditor() {
            this.$nextTick(() => {
                const self = this;
                let WangEditor = window.wangEditor;
                const editor = new WangEditor('#editor');
                this.instance = editor;
                editor.customConfig.menus = [
                    'head', // 标题
                    'bold', // 粗体
                    'italic', // 斜体
                    'underline', // 下划线
                    'strikeThrough', // 删除线
                    'foreColor', // 文字颜色
                    'backColor', // 背景颜色
                    'list', // 列表
                    'justify', // 对齐方式
                    'quote', // 引用
                    'emoticon', // 表情
                    'image', // 插入图片
                    'table', // 表格
                    'code', // 插入代码
                    'undo', // 撤销
                    'redo' // 重复
                ];
                editor.customConfig.uploadImgServer = self.uploadUrl;
                editor.customConfig.showLinkImg = false; // 隐藏网络图片
                editor.customConfig.zIndex = 100;
                editor.customConfig.uploadImgParams = {
                    name: '',
                    projectName: 'SPMS'
                };
                //                editor.customConfig.uploadImgMaxLength = 1;
                editor.customConfig.uploadFileName = 'file';

                editor.customConfig.onchange = function() {
                    self.formatContent(editor.txt.html());
                    self.changeEditorFlag(true);
                };

                // 上传处理
                editor.customConfig.uploadImgHooks = {
                    customInsert(insertImg, result, editor) {
                        let sessionId = utils.getLoginUserInfo('sessionId');
                        let url = `${window.config.context}/DocumentService/fileManage/markdown/queryimage/${
                            result.result.image_id
                        }?sessionId=${sessionId}`;
                        insertImg(url);
                    },
                    success(xhr, editor, result) {
                        self.imgIdList.push(result.result.image_id);
                    }
                };

                var html = !this.contentInfo ? EDITOR_INIT_STRING : this.contentInfo;
                editor.create();
                editor.txt.html(html);
                // 失去焦点
                document.querySelector('#editor .w-e-text').blur();
                // 限制总字符数为5000
                // document.querySelector('#editor.wangEditor-txt').onkeyup = function(){
                //     let _html = this.innerHTML;
                //     // let _text = this.innerText;
                //     if(_html.length > 5000){
                //         this.innerHTML = _html.substr(0,5000);
                //         this.blur();
                //     }
                // };

                // 绑定事件，当 UEditor 初始化完成后，将编辑器实例通过自定义的 ready 事件交出去
                // this.instance.addListener('ready', () => {
                this.$emit('ready', this.instance, self.imgIdList);
                // });
            });
        },
        formatContent(content) {
            this.content = content;
            this.outputContent();
        },
        outputContent() {
            this.$emit('input', this.content);
        }
    }
};
</script>

<style lang="less" >
#editor {
    height: 100%;
    .w-e-toolbar {
        height: 40px;
        line-height: 34px;
        background: #fff !important;
        border: 1px solid #dcdfe5 !important;
    }
    .w-e-text-container {
        border: 1px solid #dcdfe5 !important;
        border-top: none !important;
        height: 100% !important;
        min-height: 300px;
    }
}
</style>
