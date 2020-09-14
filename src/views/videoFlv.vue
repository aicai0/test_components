<template>
    <div class="video-flv">
        <div class="video-box">
            <video id="videoElement" class="videoElement" controls autoplay  ref="videoElement">
                Your browser is too old which doesn't support HTML5 video.
            </video>
        </div>
        <div class="video-control"></div>
    </div>
</template>
<script>
// import './flv.min.js'
// import flvPlayer from 'flv.js'
export default {
    name:'videoFlv',
    props:{
        videoShow:{
            type:Boolean,
            default:true,
        },
        videoSrc:{
            type:String,
            default:'http://www.lb50.cn/LIveUrl/TYUrl.Asp?1412.flv',
            // default:''
        },
    },
    data(){
        return{
            playerElement:null,
            flvPlayer:null,
            // | enableStashBuffer | 是否开启播放器端缓存 |
            // | stashInitialSize  | 播放器端缓存        | 
            // | isLive            | 是否为直播流        |
            // | hasAudio          | 是否播放声音        | 
            // | hasVideo          | 是否播放画面        |
        }
    },
    destroyed(){
        this.flvDestroy();
    },
    mounted(){
        this.$nextTick(()=>{
            console.log(this.videoShow,this.videoSrc,this.videoShow&&this.videoSrc,'his.videoShow&&this.videoSrc')
            if(this.videoShow&&this.videoSrc){
                this.videoInit();
            }
        })
    },
    methods:{
        videoInit(){
            // debugger
            this.playerElement = this.$refs.videoElement;
            if (flvjs.isSupported()) {
                this.flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    "isLive": true,      //<====加个这个 
                    url: this.videoSrc,//<==自行修改
                });
                this.flvPlayer.attachMediaElement(this.playerElement); // videoElement：h5 video 元素
                this.flvPlayer.load(); //加载
                this.flvPlay();
            }
        },
        flvPlay(){
            this.flvPlayer.play();
        },
        flvDestroy(){
            if(this.flvPlayer){
                this.flvPlayer.pause();
                this.flvPlayer.unload();
                this.flvPlayer.detachMediaElement();
                this.flvPlayer.destroy();
                this.flvPlayer = null;
                this.playerElement = null;
            }   
        }
    },
    watch:{
        videoSrc(){
            console.log(this.videoSrc,'videoSrc');
            if(this.videoShow){
                this.$nextTick(()=>{
                    this.videoInit();
                })
            } 
        },
    }
}
</script>
<style lang="less" scoped>
.video-flv{
    .video-box{
        width: 100%;
        height: 100%;
        .videoElement{
            width: 100%;
            height: 100%;
        }
    }
}
</style>