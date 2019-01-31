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

Vue.config.productionTip = false;
var config = {
  apiKey: "AIzaSyD1Q8EXXuDImbIg_qJ0VYyWFps_chekNDw",
  authDomain: "cwnote-afb4b.firebaseapp.com",
  databaseURL: "https://cwnote-afb4b.firebaseio.com",
  projectId: "cwnote-afb4b",
  storageBucket: "cwnote-afb4b.appspot.com",
  messagingSenderId: "360806917172"
};

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
