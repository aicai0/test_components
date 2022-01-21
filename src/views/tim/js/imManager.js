
import httpRequest from "../utils/request";
import TIMManager from "./timManager"
import HxManager from "./hxManager"
import disp from "../utils/observer"
// 转换 腾讯tim 历史消息
import transTIMHistoryData from "../utils/transTIMHistoryData.js"
// 转换 环信im 历史消息
import transHxHistoryData from "../utils/transHxHistoryData.js"
import { genTestUserSig } from '../utils/genetateTestUserSig.js'
// 历史消息假数据
import { timHisData, hxHisData } from "../utils/data.js"
const API = {
    // TIM 用户信息
    getUserTencent : "tencentIM/createUserTim",
    // IM 用户信息
    getUserHX : "usermanager/getUserEasemo",
    // 获取历史消息
    getHistory : "",
}
class IMManager {
    static instance = null
    constructor(options){
        this.curUserId = options.userId
        this.TimInitData = {}
        this.HxInitData = {}
        this.timManager = null
        this.HXManager = null
        // sdk 初始化
        this.initSdk()
        // 用户登录
        this.handlerLogin()
    }
     /**
     * @description: 创建 TIM 实例
     * @return: [Function] TIM 实例
     */
    static getImInstanceof = function(options){
        if (!this.instance){
           this.instance = new IMManager(options)
        }
        return this.instance
    }

    /**
     * @description 实例销毁
     * @param {*} context 实例对象
     * @returns 
     */
    static destroyImInstance = function (context){
        return new Promise(async(resolve,reject)=>{
            try{
                await context.HXManager.logout()
                await context.timManager.logout()
                this.instance = null
                resolve()
            }catch(err){
                reject(err)
            }
        })
    }

    /**
     * @description 初始化sdk信息
     */
    initSdk(){
        this.timManager = new TIMManager()
        this.HXManager = new HxManager()
        this.registerEvents();
    }

    /**
     * @description 登录 账户登录
     */
    async handlerLogin(){
        // try{
        //     this.TimInitData = await this.getTencentUserData();
        //     this.HxInitData = await this.getHXUserData();
        // }catch(err){
        //     console.log(err)
        // }
        
        let userId = "user1"
        this.TimInitData = {
            userSig: genTestUserSig(userId).userSig,
            userId: userId,
        }
        this.HxInitData = {
            userId: "test_purchase_user_889550",
            userPass: "21cf85c766fcf3873212dd50d683589b"
        }
        this.timManager.handleLogin(this.TimInitData);
        this.HXManager.handleLogin(this.HxInitData);
    }

    /**
     * @description 腾讯账户登录
     */
    handlerTimLogin(){
        this.timManager.handleLogin();
    }

    /**
     * @description 环信账户登录
     */
    handlerHxLogin(){
        this.HXManager.handleLogin();
    }

    /**
     * @description: 根据用户 id 获取腾讯账户
     */
    getTencentUserData(){
        return new Promise((resolve, reject)=>{
            httpRequest.request({
                url: API.getUserTencent,
                method: "get",
                params: {
                    userId: this.curUserId
                },
            }).then(res => {
                if (res.data.code === 0 && res.data.result) {
                    resolve({
                        userSig: res.data.result.usersig,
                        userId : res.data.result.tencentUserId,
                        sdkAppId : res.data.result.sdkAppId
                    })
                } else {
                    reject("获取腾讯账号信息失败！")
                    this.showToast(res.data.msg || "获取腾讯账号信息失败！")
                }
            }).catch(err=>{
                reject(err)
            })
        })
    }

    /**
     * @description: 根据用户 id 获取环信账户信息
     */
    getHXUserData(){
        return new Promise((resolve, reject)=>{
            httpRequest.request({
                url: API.getUserHX,
                method: "get",
                params: {
                    userId: this.curUserId
                },
            }).then(res => {
                if (res.data.code === 0 && res.data.result) {
                    resolve({
                        userId : res.data.result.easeMoUserId,
                        userPass : res.data.result.easeMoUserPassword
                    })
                } else {
                    reject("获取环信账号信息失败！")
                    this.showToast(res.data.msg || "获取环信账号信息失败！")
                }
            }).catch(err=>{
                reject(err)
            })
        })
    }

    /**
     * @description 注册事件
     */
    registerEvents(){
        let that = this
        this.timManager.dispatchData().on("onTIMMessageReceived", (data)=>{
            that.dispatchData().fire("onMessageReceived", data)
        })
        this.HXManager.dispatchData().on("onHXMessageReceived", (data)=>{
            that.dispatchData().fire("onMessageReceived", data)
        })
        this.timManager.dispatchData().on("onSdkReady", async ()=>{
            that.dispatchData().fire("onTimReady")
            let timConversion = await that.timManager.getConversionList()
            let emitTimConversion = that.dealTimConversion(timConversion)
            that.dispatchData().fire("onConversationList", {implatform: 1, data:emitTimConversion})
        })
        this.timManager.dispatchData().on("onSdkNotReady", async ()=>{
            that.dispatchData().fire("onTimNotReady")
        })
        this.HXManager.dispatchData().on("onHXOpened", async ()=>{
            that.dispatchData().fire("onHXReady")
            let hxConversion = await that.HXManager.getConversionList()
            let emitHxConversion = that.dealHxConversion(hxConversion)
            that.dispatchData().fire("onConversationList", {implatform: 0, data:emitHxConversion})
        })
        this.HXManager.dispatchData().on("onHXClosed", async ()=>{
            that.dispatchData().fire("onHXNotReady")
        })
    }

    /**
     * @description 注册事件
     * @param {*} eventType 
     * @param {*} handler 
     */
    on(eventType, handler){
        this.dispatchData().on(eventType, handler)
    }
    
    /**
     * @description 移除事件
     * @param {*} eventType 
     * @param {*} handler 
     */
    off(eventType, handler){
        this.dispatchData().off(eventType, handler)
    }

    /**
     * @description 处理腾讯会话数据
     * @returns conversion Object
     */
    dealTimConversion(conversionInfo){
        let conversionList = conversionInfo.data.conversationList;
        let resObj = {}
        conversionList.forEach(v=>{
            if(!resObj[v.conversationID]){
                resObj[v.conversationID] = {
                    unreadCount: v.unreadCount,
                    lastMessage: {
                        time: v.lastMessage.lastTime,
                        msgData: v.lastMessage.messageForShow
                    }
                }
            }
        })
        return resObj
    }

    /**
     * @description 处理环信会话数据
     * @returns conversion Object
     */
    dealHxConversion(conversionInfo){
        let conversionList = conversionInfo.data.channel_infos;
        let appKey = this.HXManager.getAppkey()
        let domain = this.HXManager.getHost()
        let resObj = {}
        conversionList.forEach(v=>{
            let conversationId = v.channel_id.split(appKey + "_")[1].split("@" + domain)[0]
            console.log(conversationId,"conversationId")
            if(!resObj[conversationId]){
                resObj[conversationId] = {
                    lastMessage:{
                        time: v.meta.timestamp,
                        msgData: this.getHxLastMessage(v.meta.payload)
                    },
                    unreadCount: v.unread_num
                }
            }
        })
        return resObj
    }

    /**
     * @description 获取环信最后一条数据展示
     * @param {*} stringData 
     * @returns 
     */
    getHxLastMessage(stringData){
        let jsonData = JSON.parse(stringData)
        let type = jsonData.bodies[0].type
        if(type == "txt"){
            return jsonData.bodies[0].msg
        }else if(type == "img"){
            return "[图片]"
        }else if(type == "audio"){
            return "[语音]"
        }
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
     * @description 发送文本消息
     * @param {*} message 
     * @param {*} platform 
     */
    sendTextMessage(message, platform){
        if(platform == 1){
            this.timManager.createMessage().textMessage(message)
        }else if(platform == 0){
            this.HXManager.createMessage().textMessage(message)
        }
    }

    /**
     * @description 发送图片消息
     */
    sendImageMessage(message, platform){
        if(platform == 1){
            this.timManager.createMessage().imageMessage(message)
        }else if(platform == 0){
            this.HXManager.createMessage().imageMessage(message)
        }
    }

    /**
    * @description 获取历史消息记录
    * @param {*} params 
    * @returns 
    */
    getHistoryMessage(params){
        // let requestData = {
        //     endTime: new Date().getTime(),
        //     inquiryId: params.inquiryId,
        //     msgFrom: params.msgFrom,
        //     msgTo: this.TimInitData.userId,
        //     pageNum: params.pageNum,
        //     pageSize: params.pageSize,
        //     sourceType: 1,
        // }
        return new Promise((resolve, reject)=>{
            // httpRequest.request({
            //     url: API.getHistory,
            //     method: "get",
            //     params: requestData,
            // }).then(res => {
            //     if (res.data.code === 0 && res.data.result) {
            //         let arr = res.data.result.list
                    let arr = params=='0' ? hxHisData.result.list : timHisData.result.list
                    let resData = []
                    console.log(arr,"getHistoryMessage")
                    this.TimInitData.userId = "test_purchase_user_889550"
                    this.HxInitData.userId = "test_purchase_user_889550"
                    arr.forEach((item)=>{
                        let timFlag = JSON.parse(item.msgExt).imPlatform;
                        let itemObj
                        if (timFlag) {
                          itemObj = transTIMHistoryData(item, this.TimInitData.userId)
                        } else {
                          itemObj = transHxHistoryData(item, this.HxInitData.userId)
                        }
                        if(itemObj !== "") resData.push(itemObj)
                    })
                    resolve(resData)
            //     } else {
            //         reject("获取腾讯账号信息失败！")
            //         this.showToast(res.data.msg || "获取腾讯账号信息失败！")
            //     }
            // }).catch(err=>{
            //     reject(err)
            // })
        })
    }

    /**
     * @description 设置会话已读
     * @param {*} options 
     */
    setMessageRead(params){
        const {imPlatform, userId} = params
        if(imPlatform == 1){
            let conversationID = `C2C${userId}`
            this.timManager.setMessageRead(conversationID)
        }else{
            let conversationID = userId
            this.HXManager.setMessageRead(conversationID)
        }
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
}

export default IMManager