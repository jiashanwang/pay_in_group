// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from "axios"

import ElementUI from 'element-ui'
import 'lib-flexible/flexible.js'

import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false

import "@/assets/common.css";


Vue.prototype.$http = axios;

Vue.use(ElementUI)
/* 引入工具类  */
import utils from "./utils";
// 配置全局路由守卫

router.beforeEach((to, from, next) => {
  if (to.path != "/") {
    /* 校验 用户是否登陆过首页，并且正确填写手机号码  */
      var user_info = JSON.parse(sessionStorage.getItem("domain"));

    if (user_info) {
      next();
    } else {
      next("/");
    }

  } else {
    next();
  }
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})