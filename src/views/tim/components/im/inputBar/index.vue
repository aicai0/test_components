<!--inputbar控制区域-->
<template>
  <div id="input-box" class="input-box">
    <div class="messagebox-footer">
      <div class="fotter-send input-send-msg-box" >
          <input @keydown="keydown" class="sengTxt" v-model="msg"  placeholder="输入消息内容" />
          <div  class="button" :class="msg.length?'btn-back':''" @click="onSendTextMsg">发送</div>
      </div>
      <div class="footer-icon">
        <UpLoadImage
          :chatType="chatType" 
          class="image-margin"
          :inquiryInfo="this.inquiryInfo"
          :chatId="activedKey[type]"
          :offlineConfig="offlineConfig"
        />
        <UpLoadFile
          :chatType="chatType" 
          :inquiryInfo="this.inquiryInfo"
          :offlineConfig="offlineConfig"
          :chatId="activedKey[type]"
        />
      </div>
    </div>

  </div>
</template>
<script>
import iconCamera from "../../imgs/camera.png";
import iconImage from "../../imgs/pic.png";
import UpLoadImage from "../upLoadImage/index.vue";
import UpLoadFile from "../upLoadFile/index.vue";
export default {
  props: {
    inquiryInfo: {
      type: Object,
      value: {},
    },
    offlineConfig:{
      type: Object,
      value: {},
    },
    chatType:{
      type: String,
      default: "1",
    }
  },
  components: {
    UpLoadImage,
    UpLoadFile,
  },
  data() {
    return {
      __comps__: {
        record: null,
        camera: null,
        image: null,
      },
      type: "contact",
      iconCamera: iconCamera,
      iconImage: iconImage,
      isIpx: "",
      userId: "",
      msg: "",
      userMessage: "",
      prescripeData: "",
      hasPrescripeData: false,
      isShowHalfScreenDialog: true,
      isShowPrescripe: false,
      userInfo: {},
      nowIsVideo: false,
      activedKey: {
        contact: "",
        group: "",
        chatroom: "",
      },
    };
  },
  created(){
  },
  methods: {
    keydown(e){
      let key = e.key
      if(key == "Enter"){
        console.log("Enter发送消息")
        this.onSendTextMsg()
      }
    },
    onSendTextMsg() {
        if (this.$data.msg == "" || this.$data.msg == "\n") {
        this.$data.msg = "";
        return;
      }
      let that = this;
      let customData = {
        inquiryId: 111,
        sourceType: 1,
      }
      let sendableMsg = {
        text:  this.$data.msg,
        msgToUser: "user0",
        cloudCustomData: JSON.stringify(customData)
      }
      console.log("TIM txt msg:", sendableMsg)
      this.$IMManager.sendTextMessage(sendableMsg, this.chatType)
    },
  },
};
</script>
<style scoped lang="less">
.input-box {
  width: 100%;
  height: auto;
  z-index: 1;
  background-color: #ffffff;
  padding-bottom: 29px;
}

.prescripe-content {
  padding-top: 20px;
}
.prescripe-no-content-box {
  width: 100%;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.prescripe-no-content-box image {
  width: 320px;
  height: 200px;
}
.prescripe-no-content-box text {
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(204, 204, 204, 1);
  line-height: 30px;
  margin-top: 14px;
}
.label-nth-child {
  padding: 14px 0;
}

.input-send-msg-box {
  padding:5px 8px; 
  display: flex;
}

.input-send-msg-box .button {
  width:60px;
  height: 34px;
  background: #cccccc;
  border-radius: 4px;
  line-height: 34px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  margin-left: 10px;
}

.input-send-msg-box .sengTxt {
  flex: 1;
  height: 34px;
  background: #f5f5f5;
  border-radius: 4px;
  // padding:0 5px;
  line-height: 34px;
  // margin-top: 5px;
}
.input-send-type-box_common {
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
}
.input-send-type-box {
  height: 42px;
}
.input-send-type-box_ipx {
  height: 42px;
  padding-bottom: 15px;
}
.input-send-type-box_common .item {
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.input-send-type-box_common .item image {
  width: 44px;
  height: 44px;
}

.sengTxt {
  text-align: left;
  height: 54px;
  width: 100%;
  box-sizing: border-box;
  bottom: 5px;
  font-size: 14px;
  padding-left: 10px;
  border: 1px solid #fff;
  outline-style: none;
  box-shadow: none !important;
}
.footer-icon{
  padding-left: 10px;
  box-sizing: border-box;
  display: flex;
  .image-margin{
    margin-right: 10px;
  }
}
.btn-back{
  background: #00b955 !important;
}

</style>