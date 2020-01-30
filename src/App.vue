<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/function">function</router-link> |
      <router-link to="/video">videoPlayer</router-link> | 
      <router-link to="/point">point</router-link> | 
      <router-link to="/tableSelect">tableDemo</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name:'App',
  data(){
    return{}
  },
  created(){
    // window.onbeforeunload = function () {
    //     return "Do you really want to close?";
    // };
  }
}
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
