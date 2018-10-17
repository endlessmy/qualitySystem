<!--
@name: 详情页面 - 评论 & 评论列表
@description:
    1.每个模块通过自定义mixins进行引入，参看功能需求模块
    2.包含评论功能、列表显示功能
@author: qqli
@date: 21/03/2018
-->
<template>
    <div class="detail-part sideFile">
        <div class="part-head">
            <span class="part-label el-form-item__label">评论：</span>
            <span
                class="part-btn el-form-item__content"
                @click="opened = true">
                <i class="icon-comment"></i>
                <span class="underline">添加评论</span>
            </span>
        </div>
        <div
            v-show="opened"
            class="detail-comment detail-border">
            <el-form
                ref="addCommentForm"
                :model="commentForm"
                :rules="commentRules">
                <el-form-item prop="comment_content">
                    <el-input
                        v-model.trim="commentForm.comment_content"
                        type="textarea"
                        class="middle"
                        placeholder="添加评论，限定200字符">
                    </el-input>
                </el-form-item>
                <el-form-item class="btn-group">
                    <el-button
                        type="primary"
                        size="small"
                        @click="submitComment('addCommentForm')">提交</el-button>
                    <el-button
                        size="small"
                        @click="resetForm('addCommentForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="detail-list">
            <ul class="comment-list">
                <li
                    v-for="item in commentRenderList"
                    :key="item"
                    class="comment-item clearfix">
                    <div class="comment-icon"></div>
                    <div class="comment-detail">
                        <div class="comment-info">
                            <span class="name">{{ item.comment_user_name }}</span>
                            <span class="time">{{ item.comment_create_time }}</span>
                        </div>
                        <div class="comment-text">
                            <span>{{ item.comment_content }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import utils from 'common/utils/misc';

export default {
    name: 'DetailComment',

    props: {
        addComment: Function,
        serviceName: String,
        commentList: {
            type: Array,
            default: []
        },
        referenceId: Number
    },

    data() {
        return {
            opened: false,
            commentForm: {
                service_name: this.serviceName, // 服务模块，这里是FuncRequireService
                comment_content: '',
                reference_id: this.referenceId // 关联ID，这里是功能需求的id
            },
            commentRules: {
                comment_content: [
                    { required: true, message: '请输入评论', trigger: 'blur' },
                    { min: 1, max: 200, message: '不超过200个字符', trigger: 'blur' }
                ]
            }
        };
    },

    computed: {
        commentRenderList() {
            var arr = [];
            if (utils.isArray(this.commentList)) {
                arr = arr.concat(this.commentList);
            }
            return arr;
        }
    },

    methods: {
        close() {
            this.opened = false;
        },
        submitComment(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    this.addComment(this.commentForm);
                }
            });
        },
        resetForm() {
            this.$refs['addCommentForm'].resetFields();
            this.close();
        }
    }
};
</script>
<style lang='less'>
</style>
