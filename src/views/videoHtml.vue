<template>
    <div class="video-demo">
        <!-- <div @click='stop'>  tingz</div> -->
        <div class="video-box">
            <div class="titie">rtmp</div>
            <QnvideoPlayer :videoId='videoId1' :videoSrc='videoSrc1'></QnvideoPlayer>
        </div>
        <div class="video-box">
            <div class="titie">Flv</div>
            <videoFlv  :videoSrc='videoSrc2'></videoFlv>
        </div>
    </div>
</template>
<script>
import QnvideoPlayer from './video.vue'
import videoFlv from './videoFlv.vue'
export default {
    name:'videoHtml',
    
    components:{
        QnvideoPlayer,videoFlv,
    },
    data(){
        return {
           videoId1:'hot',
           videoSrc1:'rtmp://202.69.69.180:443/webcast/bshdlive-pc',
           timer:null,
        //    videoSrc2:'https://d1--cn-gotcha03.bilivideo.com/live-bvc/881547/live_17561885_332_c521e483_4000.flv?cdn=cn-gotcha03&expires=1589187453&len=0&oi=2071683237&pt=web&qn=400&trid=fea3ebd2af1245db8cfe1cfa79dcf1e1&sigparams=cdn,expires,len,oi,pt,qn,trid&sign=7391db44c218f9d1c3e58e86fed5b1a2&ptype=0&platform=web&pSession=hR73bApm-a9Q7-4m5N-DbS4-HyjBTtFKQmdy',
           videoSrc2: "http://192.168.20.75/live/main1.flv",

        }
    },
    created(){
        
    },
    mounted(){
       this.timer = setInterval(()=>{
       },1000)
    },
    destroyed(){
        this.stop();
    },
    methods: {
        stop(){
            // console.log('tingz')
            clearInterval(this.timer)
        }
    },
    watch:{
        
    }

}
</script>
<style lang="less" scoped>
.video-demo{
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: space-around;
    .video-box{
        width: 45%;
        .title{
            line-height: 40px;
            margin-bottom:10px;
            font-size: 14px;
            color: red;
        }
    }

}
</style>