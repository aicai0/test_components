<template>
<!-- // inqueryTpe === 2 -->
  <div class="msg-wrap">
    <!--IM消息-->
      <conversion :offlineConfig="offlineConfig" :inquiryInfo="inquiryInfo" @refresh="refresh" :chatMsg="chatMsg" />
  </div>
</template>

<script>
// 新抽离的组件
import conversion from "../conversion/conversion.vue"
import IMManager from "../../js/imManager.js"
import Vue from "vue"
export default {
  name:"MsgSpeed",
  props: {
    inquiryInfo: {
      type: Object,
      value: {}
    },
    offlineConfig:{
      type: Object,
      value: {}
    },
    chatType:{
      type: String,
      value: "1"
    }
  },
  watch: {
  },
  components: {
    conversion,
  },
  created() {
    let IMInstance = IMManager.getImInstanceof({userId: 1})
    Vue.prototype.$IMManager = IMInstance
    this.initEvent()
  },
  updated() {
  },
  data() {
    return {
      chatMsg: [],
      hideInputBar: false,
    };
  },
  mounted(){},
  methods: {
   /**
     * 上拉加载历史消息
     */
    refresh() {
    },
    initEvent(){
      this.$IMManager.on("onMessageReceived", this.onMessageReceived)
      this.$IMManager.on("onConversationList", this.onConversationList)
      this.$IMManager.getHistoryMessage().then(res=>{
        this.chatMsg = res
      })

    },
    onConversationList(data){
      console.log(data, "onConversationList")
    },
    onMessageReceived(msg){
      if(msg.msgFlag === "newMessage" || msg.msgFlag === "createSuccess"){
        this.chatMsg.push(msg)
      }else if(msg.msgFlag === "sendSuccess" || msg.msgFlag === "sendFail"){
        let index = this.chatMsg.findIndex(v=> v.mid === msg.mid)
        this.chatMsg.splice(index, 1, msg)
      }
      
    }
  },
  watch:{
    chatType(val){
      console.log("chatType", val)
      this.$IMManager.getHistoryMessage(val).then(res=>{
        this.chatMsg = res
      })
    }
  }
};
</script>
<style type="less" scoped>
.msg-wrap {
  width: 100%;
  height: 100%;
  display: block;
  overflow-y: hidden;
  background: rgba(245, 245, 245, 1);
  padding: 15px;
  box-sizing: border-box;
  overflow: scroll;
}
.scroll_view {
  padding-bottom: 225px;
  background: rgba(245, 245, 245, 1);
  height: 100%;
  overflow-y: scroll;
}
.bottom320 {
  padding-bottom: 160px;
}

.scroll_view_X {
  padding: 25px 0 185px 0;
  background: rgba(245, 245, 245, 1);
}
.msg-wrap {
  height: 100%;
}

</style>
