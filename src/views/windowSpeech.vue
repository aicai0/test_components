<template>
    <div class="window-speech">
        <div class="button-box">
            <span class="button" @click="allPlay">循环播放</span>
            <span class="button" @click="go_erasure">消音</span>
        </div>
        <div class="list-box">
            <div v-for="(item) in speechList" :key="item.index" :class="activeIndex == item.index?'red':''">
                <span>{{item.text}}</span>
                <span class="button" @click="onePlay(item)" v-if="item.status === 0">播放</span>
                <span class="button" @click="onePause(item)" v-if="item.status === 1">暂停</span>
                <span class="button" @click="oneContinue(item)" v-if="item.status === 2">继续 </span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'windowSpeech',
    data(){
        return {  
            speechList:[  // 0 停止 1 播放中 2 暂停中
                {text:'测试报警声音001', index:0, status:0},
                {text:'测试报警声音002', index:1, status:0},
                {text:'测试报警声音003', index:2, status:0},
                {text:'测试报警声音004', index:3, status:0},
                {text:'测试报警声音005', index:4, status:0},
                {text:'测试报警声音006', index:5, status:0},
                {text:'测试报警声音007', index:6, status:0},
                {text:'测试报警声音008', index:7, status:0},
                {text:'测试报警声音009', index:8, status:0},
            ],
            activeIndex: -1,
            windowMsg:null,
            windowSpeech:null,
            playFlag: true,
        }   
    },
    created(){
         // var msg = new SpeechSynthesisUtterance("测试");
        //msg.rate = 4 播放语速
        //msg.pitch = 10 音调高低
        //msg.text = "播放文本"
        //msg.volume = 0.5 播放音量
        // window.speechSynthesis.speak(msg);
        // window.speechSynthesis.pause(); // 暂停
        // window.speechSynthesis.resume(); // 继续
        // window.speechSynthesis.cancel(); // 取消
    },
    mounted(){
        this.windowMsg = new window.SpeechSynthesisUtterance()
        this.windowSpeech = window.speechSynthesis   
    },
    methods:{
        onePause(data){
            console.log('暂停')
            this.windowSpeech.pause()
        },
        oneContinue(data){
            console.log('继续')
            this.windowSpeech.resume()
        },
        onePlay(data){
            console.log('bofang')
            this.playFlag = true;
            this.circleFlag = false;
            this.play(data); 
        },
        play(data){
            if(!this.playFlag){
                console.log('消音了')
                this.windowSpeech.cancel();
                return
            }
            if(!this.windowMsg || !this.windowSpeech ){
                this.windowMsg = new window.SpeechSynthesisUtterance();
                this.windowSpeech = window.speechSynthesis
            }
            this.windowMsg.text = data.text;
            this.windowMsg.volume = 1;
            this.windowMsg.voiceURI = 'Google 普通话（中国大陆）';
            
            
            console.log(this.windowMsg,'this.windowMsg')
            console.log(this.windowSpeech,'this.windowMsg')
            this.windowMsg.onstart = ()=>{
                
                console.log('开始合成')
                this.activeIndex = data.index;
                this.speechList[data.index].status = 1;
            }
            this.windowMsg.onerror = (e)=>{
                console.log('出问题了',e)
                this.speechList[data.index].status = 0;
            }
            this.windowMsg.onend = ()=>{
                if(this.circleFlag){
                    console.log('播放完成一条',this.activeIndex)
                    this.activeIndex++
                    if(this.activeIndex == this.speechList.length){
                        this.activeIndex = 0;
                    }
                    this.play(this.speechList[this.activeIndex])
                }else{
                    this.activeIndex = -1;
                } 
                this.speechList[data.index].status = 0;
            }
            this.windowMsg.onresume = () => {
                this.speechList[data.index].status = 1;
            }
            this.windowMsg.onpause = (e) => {
                console.log('暂停',e)
                this.speechList[data.index].status = 2;
            }


            this.windowSpeech.speak(this.windowMsg);
        },
        allPlay(){
            this.circleFlag = true;
            this.activeIndex = 0;
            this.play(this.speechList[this.activeIndex])
        },
        go_erasure(){
            this.playFlag = false;
            this.$message.success('消音成功')
        }
    }
}
</script>
<style lang="less" scoped>
.window-speech{
    width: 60%;
    margin: auto;
    .button{
        display: inline-block;
        line-height: 40px;
        cursor: pointer;
        margin: 0 10px;
    }
    .button-box{

    }
    .list-box{
        .red{
            color: red;
        }
    }
}
</style>