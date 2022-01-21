import config from "@/utils/WebIMConfig";
import websdk from "easemob-websdk";
import _ from 'lodash'
import msgStorage from '@/utils/msgStorage';
import disp from '@/utils/broadcast';
// 声网音视频sdk
// import AgoraRTC from "agora-rtc-sdk-ng"
function ack(message) {
	var bodyId = message.id; // 需要发送已读回执的消息id
	var msg = new WebIM.message("read", WebIM.conn.getUniqueId());
	msg.set({
		id: bodyId,
		to: message.from
	});
	WebIM.conn.send(msg.body);
}
/**
* 统一处理接收消息错误
* @param { msg } Object 消息
*/
function getImErrorMessage(msg) {
	if (msg.type === "error") {
		Toast(msg.errorText);
		return false;
	}
	return true;
};
const rtc = {
	// 用来放置本地客户端。
	client: null,
	// 用来放置本地音视频频轨道对象。
	localAudioTrack: null,
	localVideoTrack: null,
};

// 初始化IM SDK
var WebIM = {};
WebIM = window.WebIM = websdk;
WebIM.config = config;
WebIM.status=''
WebIM.conn = new WebIM.connection({
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
if (!WebIM.conn.apiUrl) {
	WebIM.conn.apiUrl = WebIM.config.apiURL;
  }
  

//通话状态
const CALLSTATUS = {
	idle: 0,
	inviting: 1,
	alerting: 2,
	confirmRing: 3, // caller
	receivedConfirmRing: 4, // callee
	answerCall: 5,
	receivedAnswerCall: 6,
	confirmCallee: 7
}

// 注册监听回调
WebIM.conn.listen({
	onOpened: function (message) { // 连接成功回调
		// 登录或注册成功后 跳转到好友页面
		WebIM.status='online'
	},
	onClosed: function (message) {
		WebIM.status='offline'
	}, // 连接关闭回调
	onTextMessage: function (message) {
		const { from, to, type, time } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		if (message) {
			if (getImErrorMessage(message)) {
			msgStorage.saveReceiveMsg(message, 'txt');
			}
		}
		type === 'chat' && ack(message);

	}, // 收到文本消息
	onEmojiMessage: function (message) {
		console.log("onEmojiMessage", message);
		const { type } = message;
		type === 'chat' && ack(message);
	}, // 收到表情消息
	onPictureMessage: function (message) {
		const { from, to, type, time } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		if (message) {
			if (getImErrorMessage(message)) {
			msgStorage.saveReceiveMsg(message, 'img');
			}
		}
		type === 'chat' && ack(message);
	}, // 收到图片消息

	onCmdMessage: function (msg) {
		if (msg) {
			console.log(msg)
			let renderableMsg = JSON.parse(JSON.stringify(msg))
			// if (getImErrorMessage(msg)) {
			let receiveMsg = renderableMsg.ext
			console.log(receiveMsg,'receiveMsg')
			// msgStorage.saveReceiveMsg(extMsg, 'cmd');
			if (receiveMsg.type === 10) {
				// 接单的透传消息
				console.log('===============', receiveMsg.type)
				console.log("===============", receiveMsg)
				disp.fire('em.chat.accept', receiveMsg)
			} else {
				disp.fire('em.chat.newCmdMsg', receiveMsg)
			}
		}
	},
	// 收到命令消息
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
					if (getImErrorMessage(message)) {
					msgStorage.saveReceiveMsg(message, 'audio');
					}
				}
				// let objectUrl = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
				// Vue.$store.commit("updateMsgList", {
				// 	chatType: typeMap[message.type],
				// 	chatId: chatId,
				// 	msg: objectUrl,
				// 	bySelf: false,
				// 	type: "audio",
				// 	from: message.from,
				// 	time: message.time
				// });
			},
			onFileDownloadError: function () {
				console.log("音频下载失败");
			}
		};
		WebIM.utils.download.call(WebIM.conn, options);
		message.type === 'chat' && ack(message);
	}, // 收到音频消息
	onLocationMessage: function (message) {
		console.log("onLocationMessage", message);
		message.type === 'chat' && ack(message);
	}, // 收到位置消息
	onFileMessage: function (message) {
		const { from, to, type, time } = message;
		const chatId = type !== "chat" ? to : from;
		const typeMap = {
			chat: "contact",
			groupchat: "group",
			chatroom: "chatroom"
		};
		type === 'chat' && ack(message);
	}, // 收到文件消息
	onOnline: function () {
		console.log("onOnline 网络已连接");
	}, // 本机网络连接成功
	onOffline: function () {
		console.log("onOffline 网络已断开");
	}, // 本机网络掉线
	onError: function (message) {
		console.log('onError', message)
	}, // 失败回调
	onRecallMessage: message => {
		console.log("撤回消息", message);
		// message.status = "recall";
		// message.msg = "对方撤回了一条消息";
		// Vue.$store.commit("updateMessageStatus", message);
	},
	onBlacklistUpdate: function (list) { // 黑名单变动
		// 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
		// 更新好友黑名单
		console.log("黑名单变动", list);
		// let blackList = list;
		// Vue.$store.commit("updateBlackList", blackList);
	},
	onReceivedMessage: function (message) {
		// console.log("onReceivedMessage", message);
		// Vue.$store.commit("updateMessageMid", message);
		// message.status = "sent";
		// Vue.$store.commit("updateMessageStatus", message);
	}, // 收到消息送达服务器回执

	onDeliveredMessage: function (message) {
		console.log("onDeliveredMessage", message);
		// Vue.$store.commit('updateMessageStatus', message)
	}, // 收到消息送达客户端回执

	onReadMessage: function (message) {
		console.log("onReadMessage", message);
		message.status = "read";
		// Vue.$store.commit("updateMessageStatus", message);
	}, // 收到消息已读回执

	onCreateGroup: function (message) {
		console.log("onCreateGroup", message);
		// Vue.$store.dispatch("onGetGroupUserList");
	}, // 创建群组成功回执（需调用createGroupNew）
	onMutedMessage: function (message) {
		// console.log("onMutedMessage", message);
	} // 如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});

// WebIM.WebRTC = window.webrtc; // 本项目引入 UMD 文件有问题，暂时这样引入
// WebIM.EMedia = window.emedia;
// WebIM.AgoraRTC = AgoraRTC;
WebIM.rtc = rtc;
WebIM.parseEmoji = function (msg) {
	if (typeof WebIM.Emoji === "undefined" || typeof WebIM.Emoji.map === "undefined") {
		return msg;
	}
	var emoji = WebIM.Emoji,
		reg = null;
	var msgList = [];
	var objList = [];
	for (var face in emoji.map) {
		if (emoji.map.hasOwnProperty(face)) {
			while (msg.indexOf(face) > -1) {
				msg = msg.replace(face, "^" + emoji.map[face] + "^");
			}
		}
	}
	var ary = msg.split("^");
	var reg = /^e.*g$/;
	for (var i = 0; i < ary.length; i++) {
		if (ary[i] != "") {
			msgList.push(ary[i]);
		}
	}
	for (var i = 0; i < msgList.length; i++) {
		if (reg.test(msgList[i])) {
			var obj = {};
			obj.data = msgList[i];
			obj.type = "emoji";
			objList.push(obj);
		}
		else {
			var obj = {};
			obj.data = msgList[i];
			obj.type = "txt";
			objList.push(obj);
		}
	}
	return objList;
};

WebIM.time = function () {
	var date = new Date();
	var Hours = date.getHours();
	var Minutes = date.getMinutes();
	var Seconds = date.getSeconds();
	var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
		+ (Hours < 10 ? "0" + Hours : Hours) + ":" + (Minutes < 10 ? "0" + Minutes : Minutes) + ":" + (Seconds < 10 ? "0" + Seconds : Seconds);
	return time;
};

export default WebIM;
