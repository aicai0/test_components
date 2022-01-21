<template>
    <div class="tim-index">
        <div class="msg-box">
            <msgListSpeed :inquiryInfo="inquiryInfo" :chatType="radio"
            :offlineConfig="offlineConfig" @hideInputBar="hideInputBar"></msgListSpeed>
        </div>
        <!--消息控控制按钮-->
        <div class="input-bar" v-if="isInputBar">
          <chat-inputbar :chatType="radio" :offlineConfig="offlineConfig" :inquiryInfo="inquiryInfo"  />
        </div>
        <div>
            <el-radio v-model="radio" label="1">腾讯TIM</el-radio>
            <el-radio v-model="radio" label="0">环信IM</el-radio>
        </div>
    </div>
</template>
<script>
import chatInputbar from "./components/im/inputBar";
import msgListSpeed from "./components/msgList/index.vue";
export default {
    name:"timIndex",
    components:{
        msgListSpeed, chatInputbar,
    },
    data(){
        return{
            inquiryInfo: {},
            inquiryType:"",
            isInputBar: true,
            offlineConfig:{
                disablePush: false,
                title: '患者消息提醒',
                description: '您有一条新的消息，请及时处理',
                extension: {
                    patientUserId: "test_123", // //患者id
                    inquiryId: "", //问诊id
                    imPlatform : "1" , //im标识: 0 环信 1 腾讯 
                },
                androidOPPOChannelID: "imoffine"
            },
            radio: "1"
        } 
    },
    created(){
        
    },
    mounted(){
    },
    computed:{},
    methods: {
        hideInputBar() {
            this.isInputBar = false;
        },
    },
}
</script>
<style lang="less" scoped>
.tim-index{
    width: 500px;
    height: 100%;
    .msg-box{
        width:100%;
        height: 400px;
    }
    .input-bar{
        width: 100%;
    }
}
</style>