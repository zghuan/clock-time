// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
Vue.prototype.$axios = axios

import Mock from './mock/mock.js' //引入模拟数据

import less from 'less'
Vue.use(less)

import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.rem.css';
Vue.use(YDUI);
import 'vue-ydui/dist/ydui.base.css';//ydui基础css

import mycss from './assets/app.css'//自己的css
import './assets/rem.js'
import './assets/font.ttf'
//import Vuex from 'vuex';
//Vue.use(Vuex);
import store from './store/index'

Vue.config.productionTip = false

import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
