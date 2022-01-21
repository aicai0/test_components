/**
 * TIM历史消息转为页面消息体结构
 * @param { type } 消息类型
 * @param { sendableMsg } 消息数据
 */
let transTIMHistoryData = (sendableMsg, myName) => {
    let msgTypeEnum = {
       "TIMTextElem": "txt",
       "TIMImageElem": "img",
       "TIMSoundElem": "audio",
	   "TIMCustomElem": 'cmd'
    }
    let type = msgTypeEnum[JSON.parse(sendableMsg.msgBodies)[0].MsgType]
	if(type === 'cmd') return ""
	let renderableMsg = {
		msgData: getMsgData(sendableMsg, type),
		msgType: type,
		from: sendableMsg.msgFrom,
		to: sendableMsg.msgTo,
		username: sendableMsg.msgFrom == myName ? sendableMsg.msgFrom : sendableMsg.msgTo,
		yourname: sendableMsg.msgFrom,
		cloudCustomDataJson: JSON.parse(sendableMsg.msgExt),
		style: sendableMsg.msgFrom == myName ? "self" : "",
		mid: type + sendableMsg.msgId,
		id: sendableMsg.msgId,
		msgId:sendableMsg.msgId,
		chatType: sendableMsg.msgChatType
	};

	if (type == 'img') {
		renderableMsg.msgSize = {
			width: JSON.parse(sendableMsg.msgBodies)[0].MsgContent.ImageInfoArray[0].Width,
			height: JSON.parse(sendableMsg.msgBodies)[0].MsgContent.ImageInfoArray[0].Height,
		};
    } else if (type == 'audio') {
		renderableMsg.msgLength = JSON.parse(sendableMsg.msgBodies)[0].MsgContent.Second;
    }
	return renderableMsg;
}

let getMsgData = (sendableMsg, type) => {
	if (type == 'txt'){
		return JSON.parse(sendableMsg.msgBodies)[0].MsgContent.Text;
	} else if (type == 'img'){
		return JSON.parse(sendableMsg.msgBodies)[0].MsgContent.ImageInfoArray[0].URL;
	} else if (type == 'audio') {
		return JSON.parse(sendableMsg.msgBodies)[0].MsgContent.Url
	}
	return "";
}

export default transTIMHistoryData
