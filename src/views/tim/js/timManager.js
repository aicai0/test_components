// 引入腾讯 IM SDK
import TIM from 'tim-js-sdk';
// 发送图片、文件等消息需要的上传插件
// import TIMUploadPlugin from '../utils/tim-upload-plugin.js'
import TIMUploadPlugin from 'tim-upload-plugin';
import disp from "../utils/observer"
class TIMManager {
    constructor (options) {
        // sdk 实例
        this.tim = ''
        // TIM用户id
        this.userId = ""
        // TIM用户签名
        this.userSig = ""
        // sdkAppId
        this.sdkAppId = '1400591832'
        // 初始化 sdk ready 状态
        this.sdkReady = ''
        // 端到端单聊会话 
        this.conversationType = TIM.TYPES.CONV_C2C
        // 数据兼容，对应关系
        this.msgTypeEnum = {
            "TIMTextElem": "txt",
            "TIMImageElem": "img",
            "TIMSoundElem": "audio"
        }
        // 初始化 sdk
        this.initSdk();
    }
    
    /**
     * @description: 初始化 sdk 相关----前提是获取用户相关信息完成
     * @return: void
     */
    initSdk () {
        // 创建实例
        this.tim = TIM.create({SDKAppID: Number(this.sdkAppId) })
        // 设置日志级别
        this.tim.setLogLevel(0)
        // 注册腾讯云即时通信 IM 上传插件 可用于发送图片语音等
        this.tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin})
        // 注册监听事件
        this.registerEvents()
    }
    /**
     * @description:  注册 sdk 事件信息- 注册成功后进行sdk login
     * @return: void
     */
    registerEvents() {
        // 收到 SDK 进入 ready 状态通知
        this.tim.on(TIM.EVENT.SDK_READY, this.onReadyStateUpdate, this)
        // 收到推送的新消息
        this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived, this)
        // 收到消息已读通知
        this.tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, this.onMessageReadByPeer, this)
        // 收到会话列表更新通知
        this.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onConvListUpdate, this)
        // 收到 SDK 进入 not ready 状态通知
        this.tim.on(TIM.EVENT.SDK_NOT_READY, this.onSdkNotReady, this)
        // 收到被踢下线通知
        this.tim.on(TIM.EVENT.KICKED_OUT, this.onKickedOut, this)
        // 网络状态发生改变
        this.tim.on(TIM.EVENT.NET_STATE_CHANGE, this.onNetStateChange, this)   
        // 收到 SDK 发生错误通知
        this.tim.on(TIM.EVENT.ERROR,this.onError, this)
    }

    /**
     * @description 获取回话列表
     */
    getConversionList(){
        return new Promise((resolve, reject)=>{
			this.tim.getConversationList().then(res=>{
				this.sendLogMessage("pc_tim_getConversionSuccess", res)
				resolve(res)
			}).catch(err=>{
				this.sendLogMessage("pc_tim_getConversionfail", err)
				reject(err)
			})
		})
    }

    /**
     * @description: 收到 sdk ready 状态的通知，可进行调用sendMessage
     * @param event.name - TIM.EVENT.SDK_READY
     * @return: void
     */ 
    onReadyStateUpdate(event) {
        console.log("tim sdk ready状态的通知 onReadyStateUpdate:", event.name)
        this.sdkReady = event.name
        this.dispatchData().fire("onSdkReady", event.name)
    }

    /**
     * @description: IM 接收消息回调
     * @param event.data - 存储 Message 对象的数组 - [Message]
     * @param event.name - TIM.EVENT.MESSAGE_RECEIVED
     * @return: void
     */ 
    onMessageReceived(event) {
        // 消息配置类型
        const receiveConfig = {
            "TIMTextElem": (item) => {
                console.log('tim 接收的文本消息', item)
                this.dealShowData(item, 'txt', "newMessage")
            },
            "TIMImageElem": (item) => {
                console.log('tim 接收的图片消息', item)
                this.dealShowData(item, 'img', "newMessage");
            },
            "TIMSoundElem": (item) => {
                console.log('tim 接收的音频消息')
                this.dealShowData(item, 'audio', "newMessage");
            },
            "TIMCustomElem": (item) => {
                // cmd 消息处理
                console.log('tim 接收自定义消息', JSON.stringify(item))
                let receiveMsg = JSON.parse(item.cloudCustomData)
                this.dealShowData(receiveMsg, 'cmd', "newMessage");
            }
        }

        event.data.forEach((item) => {
            receiveConfig[item.type](item)
            this.sendLogMessage(`pc_tim_acceptMsg`, item)
        })

    }

    /**
     * @description: 收到对端已读消息通知，SDK 版本为2.7.0以上
     * @param event.data - 存储 Message 对象的数组 - [Message]
     * 每个 Message 对象的 isPeerRead 属性值为 true
     * @param event.name -TIM.EVENT.MESSAGE_READ_BY_PEER
     * @return: void
     */ 
    onMessageReadByPeer(event) {
        console.log('收到对端已读消息通知 onMessageReadByPeer:', event.data)
    }

    /**
     * @description: 收到会话列表更新通知
     * 可通过遍历 event.data 获取群组列表数据并渲染到页面
     * @param event.data - 存储 Group 对象的数组 - [Group]
     * @param event.name -TIM.EVENT.CONVERSATION_LIST_UPDATED
     * @return: void
     */
    onConvListUpdate(event) {
        console.log("收到会话列表更新通知 onConvListUpdate:", event.data)
    }

    /**
     * @description: 到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
     * @param event.name -TIM.EVENT.SDK_NOT_READY
     * @return: void
     */
    onSdkNotReady(event) {
        console.log("tim SDK 进入 not ready 状态通知 onSdkNotReady:", event.name)
        this.dispatchData().fire("onSdkNotReady", event.name)
        this.sdkReady = ""
    }

    /**
     * @description: 收到被踢下线通
     * @param event.name -TIM.EVENT.KICKED_OUT
     * @param event.data
     * - event.data.type - 被踢下线的原因
     * - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
     * - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
     * - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢（v2.4.0起支持）
     * @return: void
     */
    onKickedOut(event) {
        switch (event.data.type ) {
            case TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED:
                // todo 签名过期
                break
        }
        console.log("收到被踢下线通知 onKickedOut:", event.data)
        this.sendLogMessage(`xcx_tim_onkickedout`, event.data)
    }
    /**
     * @description: 网络状态发生改变（v2.5.0 起支持）
     * @param event.name -TIM.EVENT.NET_STATE_CHANGE
     * @param event.data.state 当前网络状态，枚举值及说明如下
     * - TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
     * - TIM.TYPES.NET_STATE_CONNECTING - 连接中。
     * - TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。SDK 仍会继续重试
     * @return: toast 对象 ｜ object
     */
    onNetStateChange(event) {
        console.log("网络状态发生改变 onNetStateChange:", event.data)
        switch (event.data) {
            case TIM.TYPES.NET_STATE_CONNECTED:
                this.showToast({ title: '已接入网络', duration: 2000 })
            case TIM.TYPES.NET_STATE_CONNECTING:
                this.showToast({ title: '当前网络不稳定', duration: 2000 })
            case TIM.TYPES.NET_STATE_DISCONNECTED:
                this.showToast({ title: '当前网络不可用', duration: 2000 })
            default:
            return ''
        }
    }

    /**
     * @description: 调用 sdk login 前的逻辑处理
     * @return: void
     */ 
    handleLogin(params) {
        if(!params &&  this.userId && !this.userSig) return 
        this.userId = params.userId
        this.userSig = params.userSig
        this.login().then((imResponse)=>{
            // 埋点
            this.sendLogMessage(`pc_tim_login_success`, imResponse)
            // 登录成功
            console.log("tim 登录成功 handleLogin:", imResponse.data);
            
        }).catch((imError)=>{
            // 登录失败的相关逻辑-可进行异常处理上报&重新触发登陆等
            console.warn('login error:', imError);
            // 埋点 登录失败
            this.sendLogMessage(`pc_tim_login_fail`, imError)
        })
    }
    
    /**
     * @description: 调用 sdk login api 进行登陆
     * @return: promise
     */
    login() {
        // 通过调用后端获取 userId 和 userSig
        return this.tim.login({userID: this.userId, userSig: this.userSig})
    }

    /**
     * @description: 调用 sdk 进行退出操作
     * @return: promise
     */
    logout() {
        return this.tim.logout()
    }

    /**
     * @description: 创建消息实例并且组合&处理发送的数据
     * @return: void
     */
    createMessage() {
        // 发送消息之前需要校验 sdk 是否已经 ready 状态
        console.log('sdk ready 状态:', this.sdkReady)
        if (!this.sdkReady) {
            console.log("sdkReady not ready")
            this.sendLogMessage(`pc_tim_onSdkNotReady`)
            throw Error('sdk not ready')
            return void 0
        }
        
        return {
            // 文本消息
            textMessage: ({ msgToUser, text, cloudCustomData }) => {
                // 创建文本消息结构体   
                const message = this.tim.createTextMessage({
                    to: msgToUser,
                    conversationType: this.conversationType,
                    cloudCustomData: cloudCustomData,
                    payload: { text: text },
                })
                // 发送文本消息
                this.sendMessage(message)
            },
            // 图片消息
            imageMessage: ({ msgToUser, file, cloudCustomData }) => {
                // 创建图片消息
                const message = this.tim.createImageMessage({
                    to: msgToUser,
                    conversationType: this.conversationType,
                    payload: {
                      file: file,
                    },
                    cloudCustomData: cloudCustomData,
                    onProgress: function(event) { console.log('file uploading:', event) }
                });
                // 发送图片消息
                this.sendMessage(message)
            },
        }
    }

    /**
     * @description: 发送消息
     * @param message 创建消息的消息实例
     * @return: promise
     */
    sendMessage(message) {
        let data = this.dealShowData(message, this.msgTypeEnum[message.type], "createSuccess")
        this.tim.sendMessage(message)
        .then((imResponse) => {
            console.log('发送消息成功，消息:', imResponse.data.message)
            data.msgFlag = "sendSuccess"
            this.dispatchData().fire("onTIMMessageReceived", data)
            // 发送成功 埋点
            this.sendLogMessage(`pc_tim_sendMsg_success`, imResponse.data.message)
        }).catch((imError)=>{
            data.msgFlag = "sendFail"
            this.dispatchData().fire("onTIMMessageReceived", data)
            console.error('发送消息失败', imError)
            // 发送失败 埋点
            this.sendLogMessage(`pc_tim_sendMsg_fail`, imError)
        });
    }

    /**
     * @description: 处理显示数据结构
     * @param {*} msgData 消息体 消息数据
     * @param {*} type 消息格式类型 
     * @param {*} flag 消息标识: newMessage、createSuccess sendSuccess、sendFail
     */
    dealShowData(msgData, type, flag){
        let myName = this.userId
        let cloudCustomDataJson = JSON.parse(msgData.cloudCustomData || "{}")
        let data =  {
            cloudCustomDataJson: cloudCustomDataJson,
            mid: msgData.type + msgData.ID,
            id: msgData.ID,
            style: msgData.from == myName ? "self" : "",
            msgType: type,
            msgData: this.getMsgData(msgData, type),
            msgFlag: flag
        }
        if(type === "audio"){
            data.msgLength = msgData.payload.second;
        }
        this.dispatchData().fire("onTIMMessageReceived", data)
        return data
    }
    /**
     * @description 处理腾讯数据 在页面中中展示使用
     * @param {*} sendableMsg 原始数据结构
     * @param {*} type 数据类型
     * @returns 
     */
    getMsgData (sendableMsg, type) {
        if (type == 'txt'){
            return sendableMsg.payload.text
        } else if (type == 'img'){
          return sendableMsg.payload.imageInfoArray[0].url;
        } else if (type == 'audio'){
          return sendableMsg.payload.remoteAudioUrl;
        }
        return "";
    }

    /**
     * @description: 数据派发
     * @return: void
     */
    dispatchData() {
        return {
            "on": function(key, callback) {
                disp.on(key, callback)
            },
            "fire": function(key, ...args) {
                disp.fire(key, ...args)
            },
            "off": function(key, callback) {
                disp.off(key, callback)  
            }
        }
    }

    /**
     * @description: 收到 SDK 发生错误通知，可以获取错误码和错误信息
     * @param event.name -TIM.EVENT.ERROR
     * @param event.data.code - 错误码
     * @param event.data.message - 错误信息
     * @return: void
     */
    onError(event) {
        console.log('onError---------',event)
        // tim 错误 埋点
        this.sendLogMessage(`pc_tim_error`, event)
        const config = {}
        // TODO: code 值的判断
        if (config[event.data.code]) {
            this.showToast({
                title: event.data.message,
            })
            // 可进行数据上报
        }
    }
    /**
     * @description 设置消息已读
     * @param conversationID 回话ID
     */
    setMessageRead(conversationID){
        this.tim.setMessageRead({conversationID}).then(res=>{
            console.log("设置已读成功")
        }).catch(err=>{
            console.log("设置已读失败")
        })
    }
    
    /**
     * @description: toast 
     * @param title 标题
     * @param duration 显示时间
     * @return void
     */
    showToast(options) {
        console.log("message:",  options.title)
    }

    /**
     * @description: 上报日志：雪地、elk
     * @param key - 日志标识
     * @param logMsg - 日志内容
     */
    sendLogMessage(key, logMsg) {
        // todo
    }

}

export default TIMManager
