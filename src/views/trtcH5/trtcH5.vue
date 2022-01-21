<template>
<div class="template-1v1">
    <div id="main-video" class="view-container player-container" v-if="isConnectioned">
    </div>
    <div class="view-container pusher-container">
      <div id="stream-video"></div>
      <div class="loading" v-if="!isConnectioned">
        <div class="loading-img">
          <img :src="loading" class="rotate-img">
        </div>
        <view class="loading-text">等待医生接诊中...</view>
      </div>
    </div>
    <div class="bottom-btns">
      <div class="btn-hangup" @click="_hangUp">
        <img class="btn-image" :src="hangup">
      </div>
      <!-- 接通视频后 开始计时 -->
      <div class="btn-timer" v-if="isConnectioned">
        <div>{{ formatTimer }}</div>
      </div>
      <div class="btn-normal" @click="_switchCamera" >
        <img class="btn-image" :src="switchi">
      </div>
    </div> 
</div>
</template>
<script>
import loading from "./static/loading.png"
import hangup from "./static/hangup.png"
import switchi from "./static/switch.png"
import { TRTCERROR } from "./trtcH5utils"
export default {
    name:"trtcH5",
    props:{
      client:{
        default(){
          return null
        }
      },
      trtcConfig:{
        default(){
          return {}
        }
      },
      roomId:{
        type: Number,
        default:47845
      },
    },
    data(){
        return {
            loading, hangup, switchi,
            streamList:[], 
            members_:new Map(),
            isConnectioned: false,
            localStream: null,
            isPublished: false,
            formatTimer: '00:00:00',
            timer: 0, // 从 0s 开始计时 
            timerInstance: null
        }
    },
    created(){
      this.init();
    },
    methods:{
      /**
       * @description 初始化 绑定事件 以及进入房间
       * @return viod
       */
        init(){
          // 绑定事件
          this.handleEvents();
          //  进入房间
          this.enterRoom();
        },
        /**
         * 进入房间 发布本地视频流
         */
        async enterRoom(){
          if (this.isConnectioned) {
            console.warn('duplicate RtcClient.join() observed');
            return;
          }
          try {
            await this.client.join({roomId: parseInt(this.roomId)});
            this.isConnectioned = true;
          
            this.localStream = TRTC.createStream({
              audio: true,
              video: true,
              userId: this.trtcConfig.userId,
              mirror: true
            });

            try {
              // initialize the local stream and the stream will be populated with audio/video
              await this.localStream.initialize();
              console.log('initialize local stream success');

              this.localStream.on('player-state-changed', event => {
                console.log(`local stream ${event.type} player is ${event.state}`);
              });
            } catch (error) {
              console.error('failed to initialize local stream - ' + error);
              this.localStreamErrHandler(error)
            }

            try {
              // publish the local stream
              await this.publish();

              this.localStream.play('main-video');
            } catch (error) {
              console.error('failed to publish local stream - ', error);
            }
          }catch (error) {
            console.error('join room failed! ' + error);
          } 
        },
        /**
         * @description 本地流 错误处理
         * @params errEvent
         */
        localStreamErrHandler(error){
          console.log(TRTCERROR[error.name])
        },
        /**
         * @description 订阅 trtc 事件
         * @return: void
         */
        handleEvents(){
          this.client.on('error', err => {
            console.error(err);
          });
          this.client.on('client-banned', err => {
            console.error('client has been banned for ' + err);
          });
          // fired when a remote peer is joining the room
          this.client.on('peer-join', evt => {
            const userId = evt.userId;
            console.log('peer-join ' + userId);
          });
          // fired when a remote peer is leaving the room
          this.client.on('peer-leave', evt => {
            const userId = evt.userId;
            console.log('peer-leave ' + userId);
          });
          // fired when a remote stream is added
          this.client.on('stream-added', evt => {
            const remoteStream = evt.stream;
            console.log('subscribe to this remote stream');
            const userId = remoteStream.getUserId();
            this.members_.set(userId, remoteStream);
            this.client.subscribe(remoteStream);
          });
          // fired when a remote stream has been subscribed
          this.client.on('stream-subscribed', evt => {
            const uid = evt.userId;
            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            this.streamList.push(remoteStream);
            remoteStream.play("stream-video").then(()=>{
              this.timerInstance = setInterval(() => {
                this.formatTimer = this.secondToDate(++this.timer);
                // 10s后可以挂断
                if (this.timer == 10) {
                  this.canIHangUp = true
                }
              }, 1000)
            });
            console.log('stream-subscribed ID: ', id);
          });
          // fired when the remote stream is removed, e.g. the remote user called Client.unpublish()
          this.client.on('stream-removed', evt => {
            const remoteStream = evt.stream;
            const id = remoteStream.getId();
            remoteStream.stop();
            this.streamList = this.streamList.filter(stream => {
              return stream.getId() !== id;
            });
            console.log(`stream-removed ID: ${id}  type: ${remoteStream.getType()}`);
          });

          this.client.on('stream-updated', evt => {
            const remoteStream = evt.stream;
            console.log("remoteStream change:", remoteStream)
          });
        },
        /**
         * @description trtc 检测
         * @return: promise
         */
        rtcDetection(){
            return new Promise((resolve, reject)=>{
                TRTC.checkSystemRequirements().then(result=>{
                    resolve(result)
                }).catch(err => reject({"检测err:":err}))
            })
        },
        /**
         * @description 挂断通话 执行退房
         * @return: void
         */
        _hangUp(){
          if (this.canIHangUp && !this.isConnectioned) { // 能挂断 而且 远端没进房间
            // 患者未接通挂断
            console.log("正在为您派单，是否中断问诊?")
            this.$emit("goBack")
            return 
          } else if (!this.canIHangUp && this.isConnectioned) { // 不能挂断 而且 远端在
            console.log("10秒内无法结束问诊")
            return;
          }
          console.log("问诊已结束")

          setTimeout(() => {
            this.exitRoom();
            // to 处方详情
            console.log('患者端主动挂断，问诊结束，to 问诊详情');
            this.toDetail();
          }, 1000);
        },
        _switchCamera(){

        },
        /**
         * @description 跳转详情
         * @return: void
         */
        toDetail(){
          this.$emit("goDetail")
        },
        /**
         * @description 退出房间
         * @return: void
         */
        async exitRoom() {
          if (!this.isConnectioned) {
            console.warn('leave() - please join() firstly');
            return;
          }
          // ensure the local stream is unpublished before leaving.
          await this.unpublish();
      
          // leave the room
          await this.client.leave();
      
          this.localStream.stop();
          this.localStream.close();
          this.localStream = null;
          this.isConnectioned = false;
        },
        /**
         * @description 发布本地流
         * @return: void
         */
        async publish() {
          if (!this.isConnectioned) {
            console.warn('publish() - please join() firstly');
            return;
          }
          if (this.isPublished) {
            console.warn('duplicate RtcClient.publish() observed');
            return;
          }
          try {
            await this.client.publish(this.localStream);
          } catch (error) {
            console.error('failed to publish local stream ' + error);
            this.isPublished = false;
          }

          this.isPublished = true;
        },
        /**
         * @description 取消发布本地流 退房之前执行
         * @return: void
         */
        async unpublish() {
          if (!this.isConnectioned) {
            console.warn('unpublish() - please join() firstly');
            return;
          }
          if (!this.isPublished) {
            console.warn('RtcClient.unpublish() called but not published yet');
            return;
          }
          await this.client.unpublish(this.localStream);
          this.isPublished = false;
        },
        /**
         * @description 秒转时分秒
         * @return: void
         */
        secondToDate(result) {
          let h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
          let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
          let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
          return result = h + ":" + m + ":" + s;
        },
    }
}
</script>
<style lang="less">
.main{
    padding: 0;
}
.template-1v1{
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #000;
}
.pusher {
  width: 100%;
  height: 100%;
}

.player {
  width: 100%;
  height: 100%;
}
.template-1v1 .pusher-container{
  width: 240px;
  height: 320px;
  position: absolute;
  right: 0px;
  top: 0px;
  z-index: 2;
}

.template-1v1 .pusher-container.fullscreen{
  width: 100vw;
  height: 100vh;
  top: 0;
  right: 0;
}

.template-1v1 .loading {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-63%, 0);
  width: 300px;
  height: 250px;
  border-radius: 12px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
}
.template-1v1 .loading-img {
  height: 200px;
  display:flex;
  justify-content: center;
  align-items: center;
  animation: rotate 2s linear infinite;
}
.template-1v1 .rotate-img {
  width:160px;
  height: 160px;
}
.template-1v1 .loading-text {
  width: 100%;
  padding-top: 40px;
  text-align: center;
}
@keyframes rotate {
  0%{ transform: rotate(0deg);}
  50%{ transform: rotate(180deg);}
  100%{ transform: rotate(360deg);}
}
.template-1v1 .player-container:nth-child(1){
  width: 100vw;
  height: 100vh;
}

.template-1v1 .handle-btns {
  position: absolute;
  z-index: 3;
  bottom: 15vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.template-1v1 .bottom-btns {
  position: absolute;
  z-index: 3;
  bottom: 7vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

/* .template-1v1 image {
  width: 4vh;
  height: 4vh;
} */

.template-1v1 .btn-normal {
  width: 8vh;
  height: 8vh;
  box-sizing: border-box;
  display: flex;
  background: white;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.template-1v1 .btn-hangup .btn-image,
.template-1v1 .btn-normal .btn-image{
  width: 4vh;
  height: 4vh;
}
.template-1v1 .btn-hangup  {
  width: 8vh;
  height: 8vh;
  background: #f75c45;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.template-1v1 .btn-timer {
  position: relative;
  top: -30px;
  background: none;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
}
</style>