// pages/inquiry/trtcJs/trtcRoom.js
import TRTC from "./utils/trtc-wx"
const TAG_NAME = 'TRTC-ROOM'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pusher: null,
    streamList: [], // 用于渲染player列表,存储stram
    trtcConfig:{
      sdkAppID: '', // 开通实时音视频服务创建应用后分配的 SDKAppID
      userID: '', // 用户 ID，可以由您的帐号系统指定
      userSig: '', // 身份签名，相当于登录密码的作用
      template: '1v1', // 画面排版模式
      roomID: '',  //房间号
      debugMode: false,
      enableMic: true,
      enableCamera: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
    this.TRTC = new TRTC(this);
  
    // 初始化数据
    this.init(this.data.trtcConfig);
    // 绑定事件
    this.bindEvent();
    // 初始化页面状态
    this.initStatus();
    // 进入房间
    this.enterRoom()
  },
  /**
   * @description: 数据初始化
   * @return: void
   */
  init(data){
    // pusher 初始化参数
    const pusherConfig = {
      beautyLevel: 9,
      cloudenv: "DEV",
    }
    const pusher = this.TRTC.createPusher(pusherConfig)
  },
  /**
   * @description: 发布本地流，订阅事件。进入房间
   * @return: void
   */
  enterRoom: function () {
    if (!this.checkParam(this.data.trtcConfig)) {
      console.log('checkParam false: 缺少必要参数, 进房未执行')
      return
    }
    this.setData({
      pusher: this.TRTC.enterRoom(this.data.trtcConfig),
    }, () => {
      // 开始进行推流
      this.TRTC.getPusherInstance().start({
        success: function (event) {
          console.log("推流成功--------", event)
        },
        fail: function (err) {
          console.log("推流失败--------", err)
        }
      }) 
      this.status.isPush = true;
    })
  },
  /**
    * @description: 退房，停止推流和拉流，并重置数据
    * @return: void
    */
  exitRoom(){
    const result = this.TRTC.exitRoom()
    this.setData({
        pusher: result.pusher,
        streamList: result.playerList,
    })
  },
  /**
   * @description: 初始化页面状态
   * @return: void
   */
  initStatus() {
    this.status = {
      isPush: false, // 推流状态
      isPending: false, // 挂起状态，触发5000事件标记为true，onShow后标记为false
    }
  },
  /**
    * @description: 绑定事件 监听 trtc 状态
    * @return: void
    */
  bindEvent(){
    const EVENT = this.TRTC.EVENT;
    // 本地用户进房
    this.TRTC.on(EVENT.LOCAL_JOIN, this.onLocalJoin, this);
    // 本地用户离开
    this.TRTC.on(EVENT.LOCAL_LEAVE, this.onLocalLeave, this);
    // 远端用户进房
    this.TRTC.on(EVENT.REMOTE_USER_JOIN, this.onRemoteJoin, this)
    // 远端用户离开
    this.TRTC.on(EVENT.REMOTE_USER_LEAVE, this.onRemoteLeave, this)
    // 视频状态 true
    this.TRTC.on(EVENT.REMOTE_VIDEO_ADD, this.onRemoteChange,this)
    // 视频状态 false
    this.TRTC.on(EVENT.REMOTE_VIDEO_REMOVE, this.onRemoteChange, this)
    // 音频可用
    this.TRTC.on(EVENT.REMOTE_AUDIO_ADD, this.onRemoteChange, this)
    // 音频不可用
    this.TRTC.on(EVENT.REMOTE_AUDIO_REMOVE, this.onRemoteChange, this)
    // 错误处理
    this.TRTC.on(EVENT.ERROR, this.onTrtrError)
    // 本地推流网络状态变更
    this.TRTC.on(EVENT.LOCAL_NET_STATE_UPDATE, this.onLocalNetStateChange)
    // 远端推流网络状态变更
    this.TRTC.on(EVENT.REMOTE_NET_STATE_UPDATE, this.onRemoteNetStateUpdate)
  },
  /**
   * @description: trtc 事件监听绑定函数
   * @param {*} event 
   * @return: void
   */
  onRemoteJoin(event){
    this.log("远端用户进房", event)
    const { data } = event;
    const { playerList } = data;
    this.setData({
      streamList: playerList,
    }, () => {
      // 接通后业务
    })
  },
  onRemoteLeave(event){
    this.log("远端用户离开", event)
    const { data, eventCode } = event;
    const { playerList, userID } = data;
    const _this = this;
    if (userID) {
      this.setList({
        streamList: playerList
      }).then(() => {
        // 执行用户离开逻辑
      })
    }
  },
  onRemoteChange(event){
    const { data, eventCode } = event;
    const { player } = data;
    let option = {}
    switch (eventCode) {
      case "REMOTE_AUDIO_REMOVE":
        Object.assign(option, { muteAudio: true })
        this.log("远端音频移除", event)
        break;
      case "REMOTE_AUDIO_ADD":
        Object.assign(option, { muteAudio: false })
        this.log("远端音频可用", event)
        break;
      case "REMOTE_VIDEO_REMOVE":
        Object.assign(option, { muteVideo: true })
        this.log("远端视频移除", event)
        break; 
      case "REMOTE_VIDEO_ADD":
        Object.assign(option, { muteVideo: false })
        this.log("远端视频可用", event)
        break; 
    }
    this.setPlayerAttributesHandler(player, option)
  },
  onLocalJoin(event){
    this.log("本地用户进房", event)
  },
  onLocalLeave(event){
    this.log("本地用户离开", event)
  },
  onTrtrError(event){
    this.log("Trtr Error", event)
  },
  onLocalNetStateChange(event){
    this.log("本地网络变化", event)
    const pusher = event.data.pusher
    this.setData({
      pusher: pusher
    })
  },
  onRemoteNetStateUpdate(event){
    this.log("远端网络变化", event)
    const { playerList } = event.data;
    this.setData({
      streamList: playerList
    })
  },
  /**
   * @description 设置某个 player 属性
   * @param {*} player 
   * @param {*} options { muteAudio: true/false , muteVideo: true/false }
   * @return: void
   */
  setPlayerAttributesHandler(player, options) {
    this.setData({
      streamList: this.TRTC.setPlayerAttributes(player.streamID, options),
    })
  },
  /**
   * @description 设置列表数据，并触发页面渲染
   * @param {Object} params include  stramList
   * @returns {Promise}
   */
  setList(params) {
    console.log(TAG_NAME, 'setList', params, this.data.template)
    const { streamList } = params
    return new Promise((resolve, reject) => {
      const data = {
        streamList: streamList || this.data.streamList,
      }
      this.setData(data, () => {
        resolve(params)
      })
    })
  },
  /**
   * @description trtc 初始化room 必选参数检测
   * @param {Object} rtcConfig rtc参数
   * @returns {Boolean}
   */
  checkParam(rtcConfig) {
    console.log(TAG_NAME, 'checkParam config:', rtcConfig)
    if (!rtcConfig.sdkAppID) {
      console.error('未设置 sdkAppID')
      return false
    }
    if (rtcConfig.roomID === undefined) {
      console.error('未设置 roomID')
      return false
    }
    if (rtcConfig.roomID < 1 || rtcConfig.roomID > 4294967296) {
      console.error('roomID 超出取值范围 1 ~ 4294967295')
      return false
    }
    if (!rtcConfig.userID) {
      console.error('未设置 userID')
      return false
    }
    if (!rtcConfig.userSig) {
      console.error('未设置 userSig')
      return false
    }
    if (!rtcConfig.template) {
      console.error('未设置 template')
      return false
    }
    return true
  },
  /**
   * @description pusher event handler
   * @param {*} event 事件实例
   */
  _pusherStateChangeHandler(event) {
    console.log(event, "pusherEventHandler")
    this.TRTC.pusherEventHandler(event)
    const code = event.detail.code
    const message = event.detail.message
    switch (code) {
        case 5000:
          console.log(TAG_NAME, '小程序被挂起: ', code)
          break
        case 5001:
          // 20200421 仅有 Android 微信会触发该事件
          console.log(TAG_NAME, '小程序悬浮窗被关闭: ', code)
          console.log(this.status.isPush, "this.status.isPush")
          this.status.isPending = true
          if (this.status.isPush) {
              this.exitRoom()
          }
          break
    }
  },
  _pusherNetStatusHandler(event) {
    this.warnLog('NetStatus', event)
    this.TRTC.pusherNetStatusHandler(event)
  },
  _pusherErrorHandler(event) {
    this.warnLog('pusherErro', event)
    this.TRTC.pusherErrorHandler(event)
  },
  _pusherBGMStartHandler(event) {
    this.warnLog('pusherBGMStart', event)
    this.TRTC.pusherBGMStartHandler(event)
  },
  _pusherBGMProgressHandler(event) {
    this.warnLog('BGMProgress', event)
    this.TRTC.pusherBGMProgressHandler(event)
  },
  _pusherBGMCompleteHandler(event) {
    this.warnLog('BGMComplete', event)
    this.TRTC.pusherBGMCompleteHandler(event)
  },
  _pusherAudioVolumeNotify(event) {
    this.warnLog('AudioVolume', event)
    this.TRTC.pusherAudioVolumeNotify(event)
  },
  _playerStateChange(event) {
    this.warnLog('playerStateChange', event)
    this.TRTC.playerEventHandler(event)
  },
  _playerFullscreenChange(event) {
    this.warnLog('Fullscreen', event)
    this.TRTC.playerFullscreenChange(event)
  },
  _playerNetStatus(event) {
    this.warnLog('playerNetStatus', event)
    this.TRTC.playerNetStatus(event)
  },
  _playerAudioVolumeNotify(event) {
    this.warnLog('playerAudioVolume', event)
    this.TRTC.playerAudioVolumeNotify(event)
  },
  /**
   * @description console.warn 方法
   * @param {*} msg: message detail string
   * @param {*} event : event object
   */
  warnLog (msg, event) {
    console.warn(TAG_NAME, msg, event)
  },
  /**
   * @description console.log 方法
   * @param {*} msg: message detail string
   * @param {*} event : event object
   * @return: void
   */
  log(msg, event){
    console.log(TAG_NAME, msg, event)
  },
})