import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import( "./views/Home.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () => import( "./views/About.vue")
    },
    {
      path: "/function",
      name: "function",
      component: () => import( "./views/function.vue")
    },
    {
      path: "/video",
      name: "video",
      component: () => import( "./views/videoHtml.vue")
    },
    {
      path: "/point",
      name: "point",
      component: () => import( "./views/point.vue")
    },
    {
      path: "/tableSelect",
      name: "tableSelect",
      component: () => import("./views/tableDemo.vue")
    },
    {
      path: "/mapPoint",
      name: "mapPoint",
      component: () => import("./views/mapPoint.vue")
    },
    {
      path: "/canvasDemo",
      name: "canvasDemo",
      component: () => import("./views/canvas.vue")
    },
    {
      path: "/windowSpeech",
      name: "windowSpeech",
      component: () => import("./views/windowSpeech.vue")
    },
    {
      path: "/countdown",
      name: "countdown",
      component: () => import("./views/countdown.vue")
    },
    {
      path: "/gaodeMap",
      name: "gaodeMap",
      component: () => import("./views/gaodeMap.vue")
    },
    {
      path: "/trtcH5",
      name: "inquery",
      component: () => import("./views/trtcH5/inquery.vue")
    },
    {
      path: "/timIndex",
      name: "timIndex",
      component: () => import("./views/tim/timIndex.vue")
    },
  ]
});
