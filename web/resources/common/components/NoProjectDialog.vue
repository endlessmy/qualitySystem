<!--
@name: 没有项目时候的提示
@author: shenah
@date: 2018/6/9
-->
<template>
    <modal
        :visible="isShown"
        @onClosed="doClose">
        <span slot="head">
            提示
        </span>
        <span slot="body">
            <div class="mb20">
                您尚未加入任何项目，暂不能使用{{ data.remark }}，申请新项目请前往
                <a
                    :href="url"
                    target="_blank">研发工单Plus</a>
            </div>
        </span>
        <el-button
            slot="foot"
            type="primary"
            @click="doClose()">关闭
        </el-button>
    </modal>

</template>
<script>
import {PERMISSIONPLUS_CREATE_APPLY_ROUTER} from 'common/constants/const';
import Modal from 'common/components/Modal';
import utils from 'common/utils/misc';
import api from '../utils/api';
export default {
    name: 'NoProjectDialog',
    components: { Modal },
    props: {
        value: Boolean,
        data: Object
    },
    data() {
        return {
            url: ''
        };
    },
    computed: {
        isShown() {
            return this.value;
        }
    },
    mounted() {
        this.queryParams();
    },
    methods: {
        queryParams() {
            api
                .queryDictionary({
                    service_id: 6
                })
                .then(res => {
                    let newProjectApply = res.result.new_project_apply;
                    let objMap = utils.listToMap(newProjectApply);
                    this.url = `${PERMISSIONPLUS_CREATE_APPLY_ROUTER}/${objMap.flow_manage_id}/${objMap.bizform_id}`;
                });
        },
        doClose() {
            this.$emit('input', false);
            this.$emit('onClose');
        }
    }
};
</script>
