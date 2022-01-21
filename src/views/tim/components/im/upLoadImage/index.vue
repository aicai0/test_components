<template>
  <label for="uploadImage" @click="clickFile" class="wrap">
    <img :src="img" :class="!canRecording ? 'mr' : ''" />
    <span class="txt">拍照上传</span>
    <input
      type="file"
      capture="camare"
      accept="image/*"
      class="hide"
      ref="imgDom"
      @change="pictureChange"
    />
  </label>
</template>

<script>
import img from "../../imgs/camera.png";
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
      image: null,
      img,
      canRecording: false,
    };
  },
  methods: {
    // TODO 当前username、及type不是从pams里取
    pictureChange(e) {
      let that = this;
      let customData = {
        inquiryId: 111,
        sourceType: 1,
      }
      const sendableMsg = {
        msgToUser: "user0",
        file: e.target , // 或者用event.target
        cloudCustomData: JSON.stringify(customData),
      }
      this.$IMManager.sendImageMessage(sendableMsg, this.chatType)
    },
    clickFile() {
      let img = this.$refs.imgDom;
      img && img.click();
    },
    inputRef(node) {
      this.image = node;
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
.txt {
  margin-left: 8px;
  font-size: 14px;
  color: #222222;
}
.wrap{
      display: flex;
    align-items: center;
}
</style>
