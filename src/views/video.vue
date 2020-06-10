<template>
    <div class="video">
        <video :id="videoId"
               class="video-js vjs-default-skin vjs-big-play-centered"
                 preload="auto"
                 autoplay
                 controls
                 style="width: 100%;height: 100%;"
                 data-setup='{"html5" : { "nativeTextTracks" : false }}'>
            <source :src="videoSrc" type="rtmp/flv">
        </video>
    </div>
</template>
<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import SWF_URL from 'videojs-swf/dist/video-js.swf'
videojs.options.flash.swf = SWF_URL
export default {
    name:'QnvideoPlayer',
    props:{
        videoId:{
            type:String,
            default:'hot',

        },
        videoSrc:{
            type:String,
            default:'rtmp://202.69.69.180:443/webcast/bshdlive-pc'
            // default:'rtmp://124.204.51.166:1935/live/main'
        },
        videoShow:{
            type:Boolean,
            default:true,
        }
    },
    data(){
        return {
           videoPlayer: undefined,
        }
    },
    created(){
        
    },
    mounted(){
        this.$nextTick(()=>{
            if(this.videoShow){
                this.selectVideo();
            }
            
        })
    },
    destroyed(){
        // console.log('销毁-----------------')
        this.disposeVideo();
    },
    methods: {
      // 选择摄像头时的触发事件，可以根据摄像头信息获取对应的直播流地址后对videoSrc进行赋值
      selectVideo() {
            this.videoPlayer = videojs(this.videoId);// 关联video标签的id
            console.log(this.videoPlayer)
            this.videoPlayer.src({
               src: this.videoSrc,
               type: 'rtmp/flv'
            });
            this.videoPlayer.play();
            this.videoPlayer.pause();
        },
        disposeVideo(){
            if(this.videoPlayer){
                this.videoPlayer.dispose()
            }
        }
      },
    components:{
        
    },
    watch:{
        videoShow(n){
            if(n){
               this.selectVideo();
            }else{
                this.disposeVideo();
            }
        },
        videoSrc(){
            this.selectVideo();
        }
    }

}
</script>
<style lang="less" scoped>
.video{
    width: 300px;
    height: 400px;
}
</style>