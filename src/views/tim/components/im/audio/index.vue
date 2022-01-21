<template>
  <div class="audio">
    <div
      v-if="isSelf"
      class="audio-player"
      :style="{ opacity: opcity }"
      @click="audioPlay(1)"
    >
      <span class="time">{{ time }}</span>
      <div class="controls play-btn">
        <audio
          @ended="end"
          :src="msg.msgData"
          ref="voicemsgmy"
          class="audios"
        ></audio>
        <img :src="style == 'self' ? voicemsgmy : voicemsg" />
      </div>
    </div>
    <div v-else class="audio-player" :style="{ opacity: opcity }">
      <div class="controls play-btn" @click="audioPlay(2)">
        <span class="time">{{ time }}</span>
        <audio @ended="end" :src="msg.msgData" ref="voicemsg" class="audios"></audio>
        <img :src="style == 'self' ? voicemsgmy : voicemsg" />
      </div>
    </div>
  </div>
</template>
<script>
import voicemsg from "../../imgs/voicemsg.png";
import voicemsgmy from "../../imgs/voicemsgmy.png";
export default {
  props: {
    msg: {
      type: Object,
      val: {},
    },
    isSelf: {
      type: Boolean,
      val: true,
    },
    audioEle:"",
    playIng:{
      type:Boolean,
      dafault:false,
    },
    audioVue:null,
  },
  created() {
    this.time = this.msg.msgLength + "''";
    this.style = this.msg.style;
  },
  data() {
    return {
      style: "",
      voicemsg,
      voicemsgmy,
      time: "0'",
      opcity: 1,
      __comps__: {
        audioCtx: null,
      },
      timer: null,
    };
  },
  methods: {
    audioPlay(type) {
      if(this.playIng){
        this.audioEle.pause();
        this.opcity = 1;
        clearInterval(this.audioVue.timer);
        this.audioVue.opcity = 1
      }
      let audio;
      if (type == 1) {
        audio = this.$refs.voicemsgmy;
      } else {
        audio = this.$refs.voicemsg;
      }
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(() => {
        let opcity = this.opcity;
        this.opcity = opcity == 1 ? 0.4 : 1;
      }, 500);
      audio.play();
      this.$emit("playStatus", true, audio, this)
    },
    end() {
      this.opcity = 1;
      this.$emit("playStatus", false, null, null)
      clearInterval(this.timer);
    },
  },
};
</script>
<style  scoped>
.audio-player {
  position: relative;
  overflow: hidden;
  display: flex;
  transition: opacity 0.5s;
  padding: 0 5px;
}

.audio-player .controls {
  height: 20px;
  align-items: center;
  display: flex;
  position: relative;
}

.audio-player .controls img {
  height: 24px;
  width: 15px;
  margin: 0 4px 0 17px;
}

.audio-player .time {
  font-size: 17px;
  line-height: 20px;
  flex: 1;
  text-align: left;
}
.audio-player audio {
  /* position: absolute; */
  width: 1px;
  height: 1px;
}
.audios {
  width: 1px !important;
  height: 1px !important;
}
</style>