<!--视频播放弹窗-->
<!--文档模块，用户反馈报告-->
<!--缺陷、用户反馈上传，编辑，详情-->
<!--父组件调用该组件，同时调用common/mixins下的video.js, 调用showVideo进行播放 -->
<!--父组件的子组件调用播放视频，在子组件触发父组件的triggerVideo事件 -->
<template>
    <modal
        :visible="isShown"
        :close-on-press-escape="false"
        :modal="modal"
        :size="!modal? 'small' : 'xlarge'"
        class="video-dialog"
        @onClosed="doClose">
        <span slot="head">{{ data.fileName || data.file_name }}</span>
        <div
            slot="body"
            :class="{'small': !modal}"
            class="video-box">
            <video-player
                ref="videoPlayer"
                :options="playerOptions"
                :events="moreEvents"
                @fullscreenchange="onPlayerFullscreenChange($event)"
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
                @ended="onPlayerEnded($event)"
                @waiting="onPlayerWaiting($event)"
                @playing="onPlayerPlaying($event)"
                @loadeddata="onPlayerLoadeddata($event)"
                @timeupdate="onPlayerTimeupdate($event)"
                @canplay="onPlayerCanplay($event)"
                @canplaythrough="onPlayerCanplaythrough($event)"
                @statechanged="playerStateChanged($event)"
                @ready="playerReadied">
            </video-player>
        </div>
    </modal>
</template>
<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import MessageMixins from '../mixins/message';
import Modal from 'common/components/Modal';
import utils from 'common/utils/misc';
import VueVideoPlayer from 'vue-video-player';
import 'video.js/dist/video-js.css';

Vue.use(VueVideoPlayer, {
    events: ['fullscreenchange']
});

export default {
    name: 'ViewVideoDialog',
    components: { Modal },
    mixins: [MessageMixins],
    props: {
        value: Boolean,
        onSave: Function,
        data: Object,
        modal: { default: true }
    },
    data() {
        return {
            moreEvents: ['fullscreenchange'],
            playerOptions: {
                // videojs options
                muted: false, // true 禁音， false 播放声音
                language: 'zh-CN',
                autoplay: true,
                playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放频率
                poster: '',
                sources: [
                    {
                        type: 'video/mp4',
                        src: ''
                    }
                ]
            }
        };
    },
    computed: {
        ...mapState({}),
        player() {
            return this.$refs.videoPlayer.player;
        },
        isShown() {
            return this.value;
        }
    },
    watch: {
        data(newVal, oldVal) {
            this.initUrl(this.data);
        }
    },
    mounted() {
        this.initUrl(this.data);
    },
    methods: {
        doClose() {
            this.$emit('input', false);
            this.$emit('onClose');
            // 弹窗关闭前停止播放视频
            this.player && this.player.pause();
        },
        initUrl(data) {
            if (!data) return;
            let sessionId = utils.getLoginUserInfo('sessionId');
            let context = window.config.context;
            let fileId = data.file_id || data.fileId;
            let url = '';
            if (data.serviceData && !data.isExtraVideo) {
                // 附件中视频url
                url = `${context}/DocumentService/attachment/downloadattachment/service/${
                    data.serviceData
                }/file/${fileId}?sessionId=${sessionId}`;
            } else if (data.serviceData && data.isExtraVideo) {
                // url = `${context}/${data.short_url}`;
                url = data.short_url;
            } else {
                // 文档模块，用户反馈报告视频url
                // url = `${context}/DocumentService/fileManage/download/${fileId}?sessionId=${sessionId}`;
                url = `${context}/DocumentService/fileManage/video/${fileId}?sessionId=${sessionId}`;
            }
            this.playerOptions.sources[0].src = url;
        },
        // listen event
        onPlayerFullscreenChange(play) {
            // console.log('onPlayerFullscreenChange', play);
        },
        onPlayerPlay(player) {
            // console.log('player play!', player)
        },
        onPlayerPause(player) {
            // console.log('player pause!', player)
        },
        onPlayerEnded(player) {
            // console.log('player ended!', player)
        },
        onPlayerWaiting(player) {
            // console.log('player waiting!', player)
        },
        onPlayerPlaying(player) {
            // console.log('player playing!', player)
        },
        onPlayerLoadeddata(player) {
            // console.log('player loadeddata!', player)
        },
        onPlayerTimeupdate(player) {
            // console.log('player timeupdateuse!', player)
        },
        onPlayerCanplay(player) {
            // console.log('player cancel!', player)
        },
        onPlayerCanplaythrough(player) {
            // console.log('player can play through', player)
        },
        // or listen state event
        playerStateChanged(playerCurrentState) {
            // console.log('player current update state', playerCurrentState)
        },
        // player is ready
        playerReadied(player) {
            // console.log('the player is readied', player)
        }
    }
};
</script>

<style lang='less' scope>
.video-dialog {
    .el-dialog {
        background: #fff;
        .el-dialog__header {
            z-index: 1000;
            height: 40px;
            line-height: 40px;
            padding: 0 16px;
            background: #14191e;
            color: #b5b9bc;
            &:after {
                height: 0;
            }
        }
        .el-dialog__body {
            padding: 0;
        }
        .el-dialog__footer {
            padding: 0;
        }
    }

    .video-box {
        &.small {
            width: 570px;
            .video-player {
                .video-js {
                    width: 570px;
                }
            }
        }
        width: 760px;
        height: 428px;
        background: #000;

        .vjs_video_3-dimensions {
            width: 100%;
            height: 100%;
        }
        .video-player {
            width: 100%;
            height: 100%;
            .video-js {
                width: 760px;
                height: 428px;
            }
            .vjs-big-play-button {
                left: 50%;
                top: 50%;
                margin-left: -1.5em;
                margin-top: -0.75em;
            }
        }
    }
}
</style>
