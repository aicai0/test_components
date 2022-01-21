/*
 * @Description: 请求接口封装类
 * @Author: yangsshuai
 * @Date: 2020-06-02
 * @LastEditTime: 2020-06-02
 * @LastEditors: yangshuai
 */

// import { getEnvConfig } from "./env";
import axios from "axios";
import qs from "qs";
// import { Toast } from "vant";
/**
 * 发起请求方法 request
 * 参数依据axios文档 post方式参数 data  get方式参数params
 * post请求 contentType参数可配置数据格式
 */

class Request {
  #CONTENTTYPE = {
    JSON: "application/json;charset=UTF-8",
    FORM: "application/x-www-form-urlencoded; charset=UTF-8"
  }
  constructor() {
    this.instance = this.create();
    this.interceptors();
  }
  /**
   * 请求拦截
   * @param {*} instance
   */
  interceptors() {
    /**
     * 添加请求拦截器
     * @params config 请求拦截器配置
     */
    this.instance.interceptors.request.use(
      config => {
        const { method, data = {}, headers = {} } = config;
        // header 头配置
        config.headers = Object.assign(headers, this.initHeader());
        if (method.toLocaleLowerCase() === "post") {
          switch (config["contentType"]) {
            case this.#CONTENTTYPE.FORM: config.data = qs.stringify(data); break;
            case this.#CONTENTTYPE.JSON: config.data = JSON.stringify(data); break;
            default: break;
          }
        }
        return config;
      },
      error => {
        // 对请求错误处理的回调
        return Promise.reject(error);
      }
    );

    /**
     * 添加响应拦截器
     * @params {res} 响应拦截器的返回结果
     */
    this.instance.interceptors.response.use(
      response => {
        
        const res = response.data;
        // token 过期 此处修改成自己的code
        if (res.code === 9009 || res.code === 10000) {
          // Toast({
          //   message: res.msg || "token 失效,请重新登陆",
          //   duration: 2000,
          //   onClose: () => {
          //     // 页面地址暂定
          //     console.log("跳转到登录页面");
          //     window.Location.href = `${process.env.VUE_APP_PAGE_LOCATION_URL}/login`;
          //     localStorageRemove("wz_token");
          //   }
          // });
        }
        // 接口请求失败
        if (res.code !== 0) {
          // Toast({ message: res.msg || "请求服务失败", duration: 1000 });
          //   setTimeout(() => {
          //     Toast.clear()
          //   }, 1000);
        }
        return response;
      },
      error => {
        // Toast({ message: "服务内部错误", duration: 2000 });
        return Promise.reject(error);
      }
    );
  }
  // 补充请求头信息
  initHeader() {
    return {
      userType: "groupuser",
      appName: "ykq-xcx",
      appType: "1",
      appVersion: "v3.1.7"
    }
  }
  // 创建实例
  create() {
    const instance = axios.create({
      timeout: 30000,
      // baseURL: getEnvConfig.REQUEST_URL
    });
    return instance;
  }
  // 请求实例
  request(options) {
    return this.instance(options);
  }
}

const server = new Request();

// 导出构造函数
export default server;
