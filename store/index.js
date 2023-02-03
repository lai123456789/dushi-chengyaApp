import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		submitParamId: '',
		formComplate: ''
	},
	mutations: {
		//工单详情进入页面 选择办理方式为 完成服务时 进入的页面参数id
		setSubmitParamId(state, value) {
			state.submitParamId = value
		},
		//工单详情进入页面 选择办理方式为 完成服务时 进入的页面form表单参数
		setFormComplate(state, value) {
			state.formComplate = value
		}
	},
	actions: {}
})
export default store
