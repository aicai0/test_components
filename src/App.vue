<template>
  <div id="app" :class="routerExtraClass">
    <div class="nav-handler" @mouseover="navShow=true"></div>
    <div id="nav" :class="navShow?'nav-show':''" @mouseleave="navShow=false">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item :index="router.id" v-for="(router,index) in topNav" :key="index" @click="go_router(router)">{{router.name}}</el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>
<script>
import {topNav} from "./views/topMenu.js"
export default {
  name:'App',
  data(){
    return{
      topNav:[],
      activeIndex:"0",
      navShow: false,
      routerToClassName: {
        '/countdown': 'count-bac',
      },
      routerExtraClass:""
    }
  },
  created(){
     this.topNav = topNav;
     this.classInit();
  },
  methods:{
    go_router(router){
      this.$router.push({path: router.path})
    },
    classInit(){
      this.routerExtraClass = this.routerToClassName[this.$route.path];
    }
  },
  watch:{
    "$route"(){
      this.classInit();
    }
  }
}
</script>
<style lang="less">
html{
    width: 100%;
    height: 100%;
    body{
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
}
#app {
  width: 100%;
  height: 100%;
  position: relative;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  position: fixed;
  top: -60px;
  left: 0;
  height: 60px;
  padding: 0 30px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  background: #fff;
  transition: 1s;
  overflow: hidden;
}
.nav-handler{
  position: fixed;
  top: 0px;
  left: 0;
  height: 10px;
  padding: 0 30px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  background: transparent;
  // background: #ccc;
  cursor: pointer;
  overflow: hidden;
}
#nav.nav-show{
  top: 0;
  transition: 1s;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.main{
  width: 100%;
  height: 100%;
  padding:10px 60px;
  padding-top: 80px;
  box-sizing: border-box;
}
.count-bac{
  background: #000;
}
</style>
