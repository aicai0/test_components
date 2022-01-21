<template>
  <label for="uploadFile" @click="clickFile" class="wrap">
    <img :src="img" />
     <input type="file"   accept="image/*" class="hide" ref="imgDom" @change="fileChange" />
    <span class="txt">上传图片</span>
  </label>
</template>

<script>
import img from "../../imgs/pic.png";
export default {
  props: {
    inquiryInfo: {
      type: Object,
      value: {},
    },
    offlineConfig:{
      type:Object,
      value:{}
    },
    chatType:{
      type: String,
      default: "1",
    }
  },
  data() {
    return {
      file: null,
      img,
    };
  },
  methods: {
    clickFile() {
      let img = this.$refs.imgDom;
      img && img.click();
    },
    inputRef(node) {
      this.file = node;
    },
    fileChange(e) {
      let that = this;
      let customData = {
        inquiryId: 111,
        sourceType: 1,
      }
      const sendableMsg = {
        msgToUser: "user0",
        file: e.target , // 或者用event.target
        cloudCustomData: JSON.stringify(customData)
      }
      this.$IMManager.sendImageMessage(sendableMsg, this.chatType)
    },
  },
};
</script>
<style scoped>
.hide {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  filter: alpha(opacity=0);
  opacity: 0;
  cursor: inherit;
  display: none;
}
img {
  width: 24px;
  height: 24px;
  /* margin-right: 20px; */
}
.wrap{
      display: flex;

    align-items: center;
}
.txt {
  margin-left: 8px;
  font-size: 14px;
  color: #222222;
  margin-right: 15px;
}
</style>
