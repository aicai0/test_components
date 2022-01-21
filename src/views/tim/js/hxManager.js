
import config from "../utils/WebIMConfig";
import websdk from "easemob-websdk";
// 引入事件订阅
import disp from "../utils/observer"
var WebIM = {};
WebIM = websdk;
class HxManager {
    constructor(options){
       this.userId = ""
       this.userPass = ""
	   // status 代表环信登陆状态 （0 未登陆 1 已登陆）
	   this.status = "offline"
	   this.webIMConn = {}
       this.initSdk()
    }

	/**
     * @description: 初始化sdk
     * @return: void
     */ 
    initSdk(){
        WebIM.config = config;
		// WebIM.config.appkey = "1131220113134887#demo"
        WebIM.status=''
        this.webIMConn = WebIM.conn = new WebIM.connection({
	        appKey: WebIM.config.appkey,
	        isHttpDNS: WebIM.config.isHttpDNS,
	        isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	        https: WebIM.config.https,
	        url: WebIM.config.xmppURL,
	        apiUrl: WebIM.config.apiURL,
	        isAutoLogin: true,
	        heartBeatWait: WebIM.config.heartBeatWait,
	        autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	        autoReconnectInterval: WebIM.config.autoReconnectInterval,
	        isStropheLog: WebIM.config.isStropheLog,
	        delivery: WebIM.config.delivery
        });
		WebIM.time = function () {
			var date = new Date();
			var Hours = date.getHours();
			var Minutes = date.getMinutes();
			var Seconds = date.getSeconds();
			var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
				+ (Hours < 10 ? "0" + Hours : Hours) + ":" + (Minutes < 10 ? "0" + Minutes : Minutes) + ":" + (Seconds < 10 ? "0" + Seconds : Seconds);
			return time;
		};
		this.registerEvents()
		this.sendLogMessage("pc_hx_initSdk")
    }

	/**
     * @description: 注册事件
     * @return: void
     */ 
    registerEvents(){
		let that = this;
		console.log(this.webIMConn,"this.webIMConn")
        this.webIMConn.listen({
			// 连接成功回调
        	onOpened: function (message) { 
		        WebIM.status='online'
				that.setStatus("online")
				that.dispatchData().fire("onHXOpened")
        	},
			// 连接关闭回调
        	onClosed: function (message) {
		        WebIM.status='offline'
				that.setStatus("offline")
				that.dispatchData().fire("onHXClosed")
        	}, 
		    // 收到文本消息
        	onTextMessage: function (message) {
		        const { from, to, type, time } = message;
		        const chatId = type !== "chat" ? to : from;
		        const typeMap = {
			       chat: "contact",
			       groupchat: "group",
			       chatroom: "chatroom"
		        };
		        if (message)  {
			        if (that.getImErrorMessage(message)) {
			            // todo emit textMessage
						that.dealShowData(message, 'txt', "newMessage")
						console.log('hxReceive',message)
			        }
		        }      
		        type === 'chat' && that.ack(message);

        	}, 
			 // 收到表情消息
        	onEmojiMessage: function (message) {
		        console.log("onEmojiMessage", message);
		        const { type } = message;
		        type === 'chat' && that.ack(message);
        	},
			// 收到图片消息
        	onPictureMessage: function (message) {
		        const { from, to, type, time } = message;
		        const chatId = type !== "chat" ? to : from;
		        const typeMap = {
			        chat: "contact",
			        groupchat: "group",
			        chatroom: "chatroom"
		        };
		        if (message) {
			       if (that.getImErrorMessage(message)) {
					that.dealShowData(message, 'img', "newMessage")
					console.log('hxReceive',message)
					   // todo emit imgMessage
			       }
		        }
		        type === 'chat' && that.ack(message);
        	}, 
            // 收到命令消息
        	onCmdMessage: function (msg) {
		        if (msg) {
		        	console.log(msg)
		        	let renderableMsg = JSON.parse(JSON.stringify(msg))
		        	let receiveMsg = renderableMsg.ext
					that.dealShowData(receiveMsg, 'cmd', "newMessage")
		        	console.log('hxReceive',message)
		        	// todo emit cmdMessage
		        }
        	},
			// 收到音频消息
        	onAudioMessage: function (message) {
        		const typeMap = {
        			chat: "contact",
        			groupchat: "group",
        			chatroom: "chatroom"
        		};
        		const chatId = message.type !== "chat" ? message.to : message.from;
        		let options = {
        			url: message.url,
        			headers: { Accept: "audio/mp3" },
        			onFileDownloadComplete: function (response) {
        				if (message) {
        					if (that.getImErrorMessage(message)) {
								// todo emit audioMessage
								that.dealShowData(message, 'audio', "newMessage")
        					    console.log('hxReceive',message)
        					}
        				}
        			},
        			onFileDownloadError: function () {
        				console.log("音频下载失败");
        			}
        		};
        		WebIM.utils.download.call(WebIM.conn, options);
        		message.type === 'chat' &&that.ack(message);
        	}, 
			// 收到文件消息
        	onFileMessage: function (message) {        
		        const { from, to, type, time } = message;
		        const chatId = type !== "chat" ? to : from;
		        const typeMap = {
			        chat: "contact",
			        groupchat: "group",
			        chatroom: "chatroom"
		        };
		        type === 'chat' && that.ack(message);
        	}, 
		    // 本机网络连接成功
        	onOnline: function () {        
		        console.log("onOnline 网络已连接");
        	}, 
			// 本机网络掉线
        	onOffline: function () {        
		        console.log("onOffline 网络已断开");
        	}, 
			// 失败回调
        	onError: function (message) {        
		        console.log('onError', message)
				that.sendLogMessage("pc_hx_onError", message)
        	}, 
			// 收到消息送达服务器回执
        	onReceivedMessage: function (message) {        

        	}, 
            // 收到消息送达客户端回执
        	onDeliveredMessage: function (message) {        
		        console.log("onDeliveredMessage", message);
        	}, 
            // 收到消息已读回执
        	onReadMessage: function (message) {        
		        console.log("onReadMessage", message);
        	}, 
        });
    }

	/**
	 * @description 获取配置 appKey
	 * @returns appkey
	 */
	getAppkey(){
		return config.appkey
	}
	
	/**
	 * @description 获取配置 host
	 * @returns Host
	 */
	getHost(){
		return config.Host
	}

	/**
     * @description: 创建消息实例并且组合&处理发送的数据
     * @return: void
     */
	createMessage() {
		let that = this;
        return {
            // 文本消息
            textMessage: ({ msgToUser, text, cloudCustomData }) => {
                // 创建文本消息结构体   
                let id = this.webIMConn.getUniqueId();
                let msg = new WebIM.message('txt', id);
				msg.set({
					msg: text,
					to: msgToUser,
					from: this.userId,
					chatType: 'singleChat',
					roomType: false,
					ext: JSON.parse(cloudCustomData),
					success(id, serverMsgId) {
						// todo 成功卖点
						that.sendLogMessage("pc_hx_sendMessageSuccess", msg.body)
						// todo 通知页面
						that.dealShowData(msg.body, "txt", "sendSuccess","create")
					},
					fail(error) {
						// todo 失败埋点
						that.sendLogMessage("pc_hx_sendMessagefail", error)
						// todo 通知页面
						that.dealShowData(msg.body, "txt", "sendFail", "create")
					}
				})
				that.dealShowData(msg.body, "txt", "createSuccess", "create")
				// 发送图片消息
                this.sendMessage(msg)
            },
            // 图片消息
            imageMessage: ({ msgToUser, file, cloudCustomData }) => {
                // 创建图片消息
                let id = this.webIMConn.getUniqueId();
				let apiURL = WebIM.config.apiURL;
                let msg = new WebIM.message('img', id);
				let fileUrl = WebIM.utils.getFileUrl(file);
				msg.set({
					apiUrl: apiURL,
					from: this.userId,
					to: msgToUser,
					file: fileUrl,
					ext: JSON.parse(cloudCustomData),
					roomType: false,
					chatType: "singleChat",
					onFileUploadError: function () {      // 消息上传失败
						console.log('onFileUploadError');
					},
					onFileUploadProgress: function (e) { // 上传进度的回调
						console.log(e)
					},
					onFileUploadComplete: function () {   // 消息上传成功
						console.log('onFileUploadComplete');
					},
					success: function () {
					  // 暴露事件
					  that.dealShowData(msg.body, "img", "sendSuccess", "create")
					  // 埋点
					  that.sendLogMessage("pc_hx_sendMessageSuccess", msg.body)
					},
					fail(error) {
						// todo 通知页面
						that.dealShowData(msg.body, "img", "sendFail", "create")
						// todo 失败埋点
						that.sendLogMessage("pc_hx_sendMessagefail", error)
					}
				});
				that.dealShowData(msg.body, "img", "createSuccess","create")
                // 发送图片消息
                this.sendMessage(msg)
            },
        }
    }

	/**
	 * @description 发送消息
	 */
	sendMessage(msg){
		this.webIMConn.send(msg.body);
	}

	/**
     * @description: 处理显示数据结构
     * @param {*} msgData 消息体
     * @param {*} type 消息类型
	 * @param {*} flag 消息标识: newMessage、createSuccess sendSuccess、sendFail
	 * @param {*} source 消息来源 create / "" 
     */
	dealShowData(msgData, type, flag, source){
		let myName = this.userId
        let cloudCustomDataJson = msgData.ext
        let data =  {
            cloudCustomDataJson: cloudCustomDataJson,
            mid: type + msgData.id,
            id: msgData.id,
            style: msgData.from == myName ? "self" : "",
            msgType: type,
            msgData: this.getMsgData(msgData, type, source),
            msgFlag: flag
        }
        if(type === "audio"){
            data.msgLength = msgData.payload.second;
        }
        this.dispatchData().fire("onHXMessageReceived", data)
        return data
	}

	/**
     * @description 处理环信数据 在页面中中展示使用
     * @param {*} sendableMsg 原始数据结构
     * @param {*} type 数据类型
     * @returns 
     */
	getMsgData (sendableMsg, type, source) {
		console.log(sendableMsg, type, source, "type")
        if (type == 'txt'){
            return source=="create" ? sendableMsg.msg : sendableMsg.data
        } else if (type == 'img'){
          return source=="create" ? sendableMsg.file.url : sendableMsg.url;
        } else if (type == 'audio'){
          return source=="create" ? sendableMsg.file.url : sendableMsg.url;
        }
        return "";
    }

    /**
	 * @description 消息已读
	 */
	ack(message) {
		let bodyId = message.id; // 需要发送已读回执的消息id
		let msg = new WebIM.message("read", WebIM.conn.getUniqueId());
		msg.set({
			id: bodyId,
			to: message.from
		});
		this.sendMessage(msg)
	}

	/**
     * @description: 调用 sdk open 
     * @return: void
     */ 
	handleLogin(params) {
		if(!params && !this.userId && !this.userPass) return 
		this.userId = params.userId
		this.userPass = params.userPass
		let that = this;
        this.webIMConn.open({
			apiUrl: WebIM.config.apiURL,
			user: this.userId,
			pwd: this.userPass,
			grant_type: 'password',
			appKey: WebIM.config.appkey,
			success: function (res) {
			  console.log("im initIM success:", res)
			  // todo 日志埋点
			  this.sendLogMessage("pc_hx_openSuccess", res)
			},
			error: function (err) {
			  console.error("im initIM error:", err)
			  // todo 日志埋点
			  this.sendLogMessage("pc_hx_openfail", err)
			}
		})
    }

    /**
     * @description 获取回话列表
     */
	getConversionList(){
		return new Promise((resolve, reject)=>{
			this.webIMConn.getSessionList().then(res=>{
				this.sendLogMessage("pc_hx_getConversionSuccess", res)
				resolve(res)
			}).catch(err=>{
				this.sendLogMessage("pc_hx_getConversionfail", err)
				reject(err)
			})
		})
    }

    // 设置登录状态
	setStatus(status){
		this.status = status
	}
	
    /**
	 * @description 异常消息处理
	 * @param {*} msg 
	 * @returns 
	 */
    getImErrorMessage(msg) {
	    if (msg.type === "error") {
	    	console.log(msg.errorText);
	    	return false;
	    }
	    return true;
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
	 * 关闭 IM
	 */
	logout() {
        this.webIMConn.close()
    }

	/**
     * @description 设置消息已读
     * @param conversationID 回话ID
     */
	setMessageRead(username){
        let msg = new WebIM.message('channel',WebIM.conn.getUniqueId());
        msg.set({
           to: username
        });
        this.sendMessage(msg)
    }
	
    /**
     * @description: 上报日志：雪地、elk
     * @param key - 日志标识
     * @param logMsg - 日志内容
     */
	sendLogMessage(key, logMsg) {
        // todo 日志埋点
    }
}

export default HxManager