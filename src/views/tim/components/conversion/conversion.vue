<template>
    <div class="tim-conversion">
        <div v-for="item in chatMsg" :key="item.mid" :direction="'up'" class="msg-box"
          :immediate-check="false" @load="refresh">
            <div v-if="item.style == 'self'" class="self" :key="item.mid">
                <!--当前用户发送聊天消息-->
                <div class="pub-right-container">
                    <div class="person-name">
                        {{ inquiryInfo.patientName }}
                    </div>
                    <div class="msg" :class="item.msgType == 'txt' || item.msgType == 'audio' ? 'txt-bg' : ''">
                        <!--img 类型的消息-->
                        <div v-if="item.msgType == 'img'">
                            <img class="img-msg" :src="item.msgData" @click="previewImage(item.msgData)"/>
                        </div>
                        <!--文本类型的消息-->
                        <div v-else-if="item.msgType == 'txt'" class="template">
                            <!--正常文本消息-->
                            <span class="msg-txt">{{ item.msgData }}</span>
                        </div>
                        <div class="msg-status">
                            <img v-if="item.sendStatus == 'fail'"  @click="showresend(item)"  :src="sendFail" alt="" >  
                            <img v-if="item.sendStatus == 'loading'" :src="loading" alt="" class="loading"> 
                        </div>
                    </div>
                </div>
                <img class="avatar" :src="inquiryInfo.patientSex === 1 ? selfHeadDefault1 : selfHeadDefault0"/>
            </div>
            <div v-else-if="item.style == 'timertip'" class="interrogation-timer">
                当前问诊还有
                <span class="number">5</span>
                分钟结束
            </div>
            <div v-else class="doctor" :key="item.mid">
                <!--接收医生消息-->
                <img class="avatar" :src="iconDoctorDefault"/>
                <div class="pub-right-container">
                    <div class="person-name">
                        {{ inquiryInfo.physicianName }}
                    </div>
                    <!--聊天消息-->
                    <div class="msg" 
                        :class="(item.msgType == 'txt' || item.msgType == 'audio') && !item.cloudCustomDataJson.rxId && !item.cloudCustomDataJson.rerecommendId? 'txt-bg': '' ">
                        <!--img 类型的消息-->
                        <div v-if="item.msgType == 'img'">
                            <img class="img-msg" :src="item.msgData" @click="previewImage(item.msgData)"/>
                        </div>
                        <!--音频类型的消息-->
                        <imAudio :audioVue="audioVue" :playIng="playIng" :audioEle="audioEle" @playStatus="playStatus" v-else-if="item.msgType == 'audio'" :is-self="false" :msg="item"/>
                        <div v-else-if="item.msgType == 'txt'">
                            <!--扩展消息 推荐商品-->
							<div class="doctor drugs" v-if="item.cloudCustomDataJson.rerecommendId">
								<!--接收医生消息-->
								<div class="pub-right-container" style="margin:0">
									<div class="drugs_recommend">
										<div class="drugs_recommend_title">
											<img class="rerecomendImg" src="/images/rerecomend.png" mode="widthFix" />
											推荐商品
										</div>
										<div class="drugs_recommend_tips">根据您的情况，推荐使用：</div>
										<div class="drugs_list_wrap" v-for="(item,index) in item.cloudCustomDataJson.rerecommendData" :key="index">
											<div class="info">
												<span> {{index+1+'.'+item.productName}}</span>
												<span style="color:#666883">{{item.attributeSpecification}}</span>
												<span>{{'【'+item.quantity+item.medicinesPackageUtil+
												'】'}}</span>
											</div>
											<div class="use">
												用法用量： {{item.useFrequencyCH+" 每次"+(item.singleDoseCH ? item.singleDoseCH+item.singleUnit : item.singleUnit)+' '+item.directions}}
											</div>
										</div>
										<div class="likeBtn" @click="goBuyMedicinePage(item.cloudCustomDataJson.rerecommendId)">
											去购药
										</div>
									</div>
								</div>
							</div>
							<!--扩展消息 电子病历--> 
							<div v-else-if="item.cloudCustomDataJson.recordId" class="template"
								@click="handleMsgExtRecord(item.cloudCustomDataJson.recordId)">
								<div class="msg-txt-ext">
									<div class="msg-txt-ext-title">医生已开具电子病历</div>
									<div class="msg-txt-ext-btn">查看病历</div>
								</div>
							</div>
                            <!-- 电子处方 -->
                            <div v-else-if="item.cloudCustomDataJson.rxId" class="template" 
                                @click="handleMsgExt(item.cloudCustomDataJson.rxId)">
                                <div class="msg-txt-ext">
                                    <div class="msg-txt-ext-title">医生已开具电子处方</div>
                                    <div class="msg-txt-ext-btn">查看处方</div>
                                </div>
                            </div>
                            <!--文本类型的消息-->
                            <div v-else class="template">
                                <span class="msg-txt">{{ item.msgData }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import sendFail from "../imgs/sendFail.png"
import loading from "../imgs/sendLoading.png"
import selfHeadDefault0 from "../imgs/self_head_default0.png";
import selfHeadDefault1 from "../imgs/self_head_default1.png";
import doctor_head_default from "../imgs/doctor_head_default.png";
import imAudio from "../im/audio";
export default {
    data(){
        return {
            sendFail, loading,
            selfHeadDefault0, selfHeadDefault1,
            iconDoctorDefault: doctor_head_default,
            playIng: false,
            audioEle: null,
            audioVue: null,
        }
    },
    components: {
        imAudio
    },
    props:{
        inquiryInfo:{
            type: Object,
            value: {}
        },
        chatMsg:{
            type: Array,
            value: []
        },
        offlineConfig:{
            type: Object,
            value: {}
        }
    },
    methods:{
        showresend(item){
            
        },
        reSend(item){
            this.$timInstance.findEooroMesaage(item)
        },
        /**
         * 上拉加载历史消息
         */
        refresh() {
            this.$emit("refresh")
        },
        /**
        * 患者信息图片预览
        * @param { event }
        * 事件回调
        */
        previewImage: function(arr) {
           
        },
        /**
        * 点击扩展消息查看处方
        * 跳转处方详情
        */
        handleMsgExt(id) {
           const query = { guid: id };
        },
        /**
         * 点击扩展消息查看病历
         * 跳转病历详情
         */
        handleMsgExtRecord(id) {
            console.log(id,"id")
            const query = { recordId: id };
        },
        goBuyMedicinePage(id){
            let recommendId = id
        },
        playStatus(status, audio, vue){
            this.playIng = status;
            this.audioEle = audio;
            this.audioVue = vue;
        }
    },
    watch:{
        chatMsg:{
            handler(){},
            deep: true
        }
    }
}
</script>
<style lang="less" scoped>
.tim-conversion{
    .msg-box {
        height: 100% !important;
        padding-top: 15px;
        .avatar{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .pub-right-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            margin-left: 10px;
            .person-name {
                color: #999999;
                font-size: 10px;
                margin-bottom: 2px;
            }
        }
        /* 问诊倒计时5分钟显示 */
        .interrogation-timer {
          width: 160px;
          height: 30px;
          line-height: 30px;
          background-color: #eeeeee;
          margin: 15px auto;
          text-align: center;
          font-size: 12px;
          color: #999999;
          border-radius: 15px;
        }
        .number {
          color: #00b955;
        }
        .self {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;
            .pub-right-container {
                align-items: flex-end;
                margin-right: 10px;
                margin-left: 0;
            }
            .person-name {
                text-align: right;
            }
            .msg {
                position: relative;
                flex-shrink: 0;
                max-width: 70%;
                border-radius: 10px 0px 10px 10px;
                position: relative;
                .msg-status{
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: -25px;
                    font-size: 10px;
                    color: #000;
                    img{
                        width: 20px;
                        height: 20px;
                    }
                    .icon{
                        font-size: 20px;
                        color: red;
                    }
                    .loading {
                        animation:rotation 1s linear infinite;
                    }
                }
            }
            .msg-txt {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                word-break: break-all;
                line-height: 30px;
            }
            .txt-bg {
                background: #00b955;
                color: rgba(255, 255, 255, 1);
                padding: 10px;
            }
            .img-msg {
                width: 90px;
               /* margin-right: -20px;  */
               border-radius: 10px;
            }
        }
        .doctor {
            display: flex;
            justify-content: flex-start;
            align-content: flex-start;
            .msg {
                flex-shrink: 0;
                max-width: 74%;
                border-radius: 0px 10px 10px 10px;
                position: relative;
                .msg-status{
                    position: absolute;
                    top: 50%;
                    bottom: 50%;
                    transform: translateY(-50%);
                    right: -15px;
                    font-size: 10px;
                    color: #000;
                }
            }
            .msg-txt {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                word-break: break-all;
                line-height: 30px;
            }
            .txt-bg {
                background: rgba(255, 255, 255, 1);
                color: rgba(48, 48, 60, 1);
                padding: 10px;
            }
            .img-msg {
                width: 90px;
                /* margin-left: -20px;  */
               border-radius: 10px;
            }
            .msg-txt-ext {
                width: 210px;
                background: rgba(255, 255, 255, 1);
                border-radius: 8px;
                .msg-txt-ext-title {
                    height: 46px;
                    width: 100%;
                    text-align: center;
                    line-height: 46px;
                    font-size: 15px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 600;
                    color: #333333;
                }
                .msg-txt-ext-btn {
                    height: 41px;
                    width: 100%;
                    font-size: 15px;
                    text-align: center;
                    line-height: 41px;
                    border-top: 1px solid #eeeeee;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 600;
                    color: #00b955;
                }
            }
            .drugs_recommend {
              background: #ffffff;
              width: 243px;
              border-radius: 4px;
                .drugs_recommend_title {
                    height: 36px;
                    display: flex;
                    align-items: center;
                    background: rgba(0, 185, 85, 0.1);
                    font-size: 15px;
                    font-family: PingFangSC, PingFangSC-Medium;
                    color: #fff;
                    padding: 0 12px;
                    line-height: 36px;
                    color: #00b955;
                    img{
                        margin-left: 5px;
                    }
                    .rerecomendImg{
                        width: 14px;
                        height: 14px;
                        margin-right: 5px;
                    }
               }
               .drugs_recommend_tips {
                    font-size: 12px;
                    font-family: PingFangSC, PingFangSC-Regular;
                    font-weight: 400;
                    text-align: left;
                    color: #999999;
                    line-height: 20px;
                    padding: 10px 12px;
                    .use {
                        font-size: 12px;
                        font-family: PingFangSC, PingFangSC-Regular;
                        font-weight: 400;
                        text-align: justify;
                        color: #666883;
                    }
          
                    .info {
                        font-size: 14px;
                        font-family: PingFangSC, PingFangSC-Regular;
                        font-weight: 400;
                        color: #111334;
                    }
                }
                .drugs_list_wrap {
                    padding: 0 10px;
                    padding-bottom: 13px;
                }
                .likeBtn {
                    font-size: 15px;
                    font-family: PingFangSC, PingFangSC-Medium;
                    font-weight: 500;
                    text-align: center;
                    color: #00b955;
                    line-height: 45px;
                    height: 45px;
                    border-top: 1px solid #eee;
                }
            }
        }
    }
    .template {
        font-size: 0;
    }
}
@keyframes rotation {
	from {
	    -webkit-transform:rotate(0deg);
    }
    to {
	    -webkit-transform:rotate(360deg);
    }
}
</style>
<style lang="less">
.tim-conversion{
    .msg-box {

    }
}
</style>