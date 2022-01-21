function transHxHistoryData(receiveMsg, myName) {
    let type = JSON.parse(receiveMsg.msgBodies)[0].type
	console.log(type)
    if(type === 'cmd'){
		console.log(receiveMsg,'receiveMsg')
		return ""
	} 
    let renderableMsg
    renderableMsg = {
        msgData: getMsgData(receiveMsg, type),
		msgType: type,
		from: receiveMsg.msgFrom ,
		to: receiveMsg.msgTo ,
		username: receiveMsg.msgFrom == myName ? receiveMsg.msgFrom : receiveMsg.msgTo,
		yourname: receiveMsg.msgFrom,
		cloudCustomDataJson: JSON.parse(receiveMsg.msgExt),
		style: receiveMsg.msgFrom == myName ? "self" : "",
		mid: type + receiveMsg.id,
		id: receiveMsg.id,
		msgId:receiveMsg.id,
		chatType: receiveMsg.type
    }
    if (type == 'img') {
        renderableMsg.msgSize = JSON.parse(receiveMsg.msgBodies)[0].size
    } else if (type == 'audio') {
        renderableMsg.msgLength = JSON.parse(receiveMsg.msgBodies)[0].length
    }
	return renderableMsg
} 
let getMsgData = (receiveMsg, type) => {
	if (type == 'txt'){
		return JSON.parse(receiveMsg.msgBodies)[0].msg;
	} else if (type == 'img' || type == 'audio'){
		return JSON.parse(receiveMsg.msgBodies)[0].url ;
	} 
	return "";
}
export default transHxHistoryData