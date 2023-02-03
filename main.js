import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from "uview-ui";
Vue.use(uView);

// 全局引入dayjs
import dayjs from "dayjs"
Vue.prototype.dayjs = dayjs

const app = new Vue({
	store,
	...App
})

import '@/common/bootstrap.js'
//http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

app.$mount()
