// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import Moment from "moment";
import App from "./App";
import firebase from "firebase";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/ja";

import Home from "./pages/home.vue";
import config from "./config.js";

Vue.config.productionTip = false;

firebase.initializeApp(config);
Vue.use(ElementUI, { locale });
Vue.use(VueRouter);
Vue.use(Moment);
// Initialize Firebase

const routes = [
  { path: "/", component: Home },
  { path: "/event", component: App }
];
const router = new VueRouter({ mode: "history", routes });

/* eslint-disable no-new */
new Vue({
  router
}).$mount("#app");
