import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

import echarts from 'echarts'   //引入echarts
Vue.prototype.$echarts = echarts;  //注册组件

import ElementUI from 'element-ui' //引入eleui
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
