<template>
    <div class="video-demo">
        <QnvideoPlayer :videoId='videoId1' :videoSrc='videoSrc1'></QnvideoPlayer>
        <QnvideoPlayer :videoId='videoId2' :videoSrc='videoSrc2'></QnvideoPlayer>
    </div>
</template>
<script>
import QnvideoPlayer from './video.vue'
export default {
    name:'videoHtml',
    
    components:{
        QnvideoPlayer,
    },
    data(){
        return {
           videoId1:'hot',
           videoSrc1:'rtmp://202.69.69.180:443/webcast/bshdlive-pc',
           videoId2:'leng',
           videoSrc2:'rtmp://192.168.20.251/live/main1',

        }
    },
    created(){
        
    },
    mounted(){
       
    },
    destroyed(){
        
    },
    methods: {
     
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

}
</style>