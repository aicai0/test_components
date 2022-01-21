export class GenerateClient {
  async init(options){
        if(!this.checkParam(options)){
            console.log('checkParam false: 缺少必要参数, 初始化未执行')
            return false
        }
        let networkFlag = await this.checkNetwork()
        if(!networkFlag){
            console.log('checkNetwork false: 网络连接失败')
            return
        }
        
        return this.rtcDetection().then(res=>{
            const {result, detail} = res
            if(result){
              const client = TRTC.createClient(options);
                console.log(client, "client")
                return client;
            }else{
                console.log('checkResult', result, 'checkDetail', detail);
            }
        })
    }
    /**
     * @description trtc 设备 检测
     * @return: promise
     */
    rtcDetection(){
        return new Promise((resolve, reject)=>{
            TRTC.checkSystemRequirements().then(result=>{
                resolve(result)
            }).catch(err => reject({"检测err:":err}))
        })
    }
    /**
     * @description 判断网络连接
     * @returns boolean
     */
    async checkNetwork(){
        const isFileProtocol = location.protocol === 'file:';
        const hasNetworkConnect = isFileProtocol ? navigator.onLine : await this.isOnline();
        return hasNetworkConnect;
    }
    /**
      * @description trtc 初始化 必选参数检测
      * @param {Object} rtcConfig rtc参数
      * @returns {Boolean}
      */
    checkParam(rtcConfig){
        if (!rtcConfig.sdkAppId) {
          console.error('未设置 sdkAppId')
          return false
        }
        if (!rtcConfig.userId) {
          console.error('未设置 userId')
          return false
        }
        if (!rtcConfig.userSig) {
          console.error('未设置 userSig')
          return false
        }
        return true
    }
    /**
     * @description 测试网络连接
     * @returns promise
     */
    isOnline(){
        return new Promise(resolve => {
          try {
            let xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(true);
            };
            xhr.onerror = function() {
              resolve(false);
            };
            xhr.open('GET', 'data/mock.json', true);
            xhr.send();
          } catch (err) {
            console.log(err);
          }
        });
    }
}
export const TRTCERROR = {
    "NotReadableError": "暂时无法访问摄像头/麦克风，请确保系统允许当前浏览器访问摄像头/麦克风，并且没有其他应用占用摄像头/麦克风",
    "NotAllowedError": "请确保系统允许当前浏览器访问摄像头/麦克风",
    "NotFoundError": "浏览器获取不到摄像头/麦克风设备，请检查设备连接并且确保系统允许当前浏览器访问摄像头/麦克风"
}