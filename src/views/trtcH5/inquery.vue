<template>
    <div class="wenzhen">
        <span class="btn" @click="goWenzhen" v-if="inqueryBtn">
            问诊
        </span>
        <trtcH5 :client="client" :trtcConfig="trtcConfig" v-else></trtcH5>
    </div>
</template>
<script>
import {GenerateClient} from  "./trtcH5utils"
import trtcH5 from "./trtcH5.vue"
export default {
    name:"inquery",
    components:{
        trtcH5
    },
    data(){
        return {
            inqueryBtn: true,
            GenerateClient:null,
            client:null,
            trtcConfig:{
                mode: 'rtc',
                sdkAppId:1400573664,
                userId:"user_61774661",
                userSig:"eJwtzM0KglAQBeB3udtCxut1tKCNCBUURF6i2kQ2U4yViNof0bsn6vJ853C*yi4S58mlGivtgBq2WYjzWs7S8qPi8oBuEBhEtx9UdD0WhZAauwbADzxE0zW13LlR9LQOYWSgU34XUjaOYELorZJL825f01W25fR2omSTGW852yU25j0NPkanRGmUW9-O43UUTtTvDxbAMnQ_",
            }
        }
    },
    created(){
        this.GenerateClient = new GenerateClient();
    },
    methods:{
        goWenzhen(){
            this.GenerateClient.rtcDetection().then(res=>{
                const {result, detail} = res
                if(result){
                    this.GenerateClient.init(this.trtcConfig).then(res=>{
                        console.log(res)
                        this.client = res
                        this.inqueryBtn = false
                    })
                }else{
                    console.log('checkResult', result, 'checkDetail', detail);
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.wenzhen{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn{
        width: 100px;
        height: 30px;
    }
}
</style>