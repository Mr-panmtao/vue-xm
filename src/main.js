import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'

// rem布局
import 'amfe-flexible'
// 导入axios
import axios from 'axios'

import './main.css'
import 'vant/lib/index.css'

// 导入 nprogress 进度条组件的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import { Toast, SwipeCell } from 'vant'

Vue.use(Toast)
Vue.use(SwipeCell)

// 配置请求的根路径
axios.defaults.baseURL = 'http://49.232.193.192:3007/api/'
// axios请求拦截
axios.interceptors.request.use(config => {
  // 每次发起请求都展示进度条
  NProgress.start()
  Toast.loading({ message: '加载中...', forbidClick: true })
  return config
})
axios.interceptors.response.use(config => {
  // 隐藏进度条
  NProgress.done()
  Toast.clear()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 延时器定时清除token
// setTimeout(() => {
//   window.sessionStorage.removeItem('token')
// }, 400000)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
