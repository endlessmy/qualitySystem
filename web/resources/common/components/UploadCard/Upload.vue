<!--
@name: 批量导入 - 导入弹窗中“点击上传”的组件
@description:
1.只能上传Excel文件
@author: csx
@date: 2018/7/31
-->
<template>
    <span class="upload-action">
        <label for="uplaodfile">
            <span class="icon-tianjiahuoxinjian" />
            <span class="text">
                点击上传
            </span>
        </label>
        <input
            id="uplaodfile"
            ref="input"
            :accept="accept"
            type="file">
    </span>
</template>

<script>
import MessageMixins from 'common/mixins/message';
export default {
    name: 'Uploader',
    mixins: [MessageMixins],
    props: {
        accept: String // 传入的可上传的文件类型
    },
    data() {
        return {};
    },
    computed: {
        // 获取可传入的文件类型
        allowedType() {
            let allowed = this.accept ? this.accept.split(',') : [];
            allowed = allowed.map(t => t.trim());
            return allowed;
        }
    },
    mounted() {
        this.$refs.input.onchange = this.handleFileChange;
    },
    methods: {
        // 文件类型校验
        fileTypeValid(name) {
            let valid = false;
            this.allowedType.map(t => {
                let regex = new RegExp(`${t}$`, 'g');
                if (regex.test(name)) {
                    valid = true;
                }
            });
            return valid;
        },
        handleFileChange(e) {
            if (e.target.files && e.target.files.length) {
                const targetFile = e.target.files[0];
                if (this.fileTypeValid(targetFile.name)) {
                    this.$emit('change', targetFile);
                } else {
                    this.showErrorMsg('文件格式不支持');
                }
                e.target.value = '';
            }
        }
    }
};
</script>

<style lang="less" scoped>
#uplaodfile {
    display: none;
}
.upload-action {
    label {
        background: #ffffff;
        border: 1px solid #bbd9ff;
        border-radius: 3px;
        display: inline-block;
        font-size: 12px;
        color: #4f9afe;
        line-height: 12px;
        width: auto;
        height: auto;
        padding: 8px 12px;
        cursor: pointer;
    }
    span.text {
        padding-left: 3px;
    }
    .icon-tianjiahuoxinjian {
        font-size: 22px;
        display: inline-block;
        width: 12px;
        height: 12px;
        overflow: hidden;
        position: relative;
        top: 1px;
        padding-right: 10px;
        &:before {
            position: relative;
            left: -5px;
            top: -5px;
        }
    }
}
</style>
