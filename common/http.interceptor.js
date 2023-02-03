// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token
// 同时，我们也可以在此使用getApp().globalData，如果你把token放在getApp().globalData的话，也是可以使用的
import Vue from 'vue'
const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: Vue.prototype.config.url,
		timeout: 30000,
		// 如果将此值设置为true，拦截回调中将会返回服务端返回的所有数据response，而不是response.data
		// 设置为true后，就需要在this.$u.http.interceptor.response进行多一次的判断，请打印查看具体值
		originalData: true,
		// 设置自定义头部content-type
		// header: {
		// 	'content-type': 'xxx'
		// }
	});
	let loadingTag = false
	let env = uni.getStorageSync('env')
	let envUrl = uni.getStorageSync('envUrl')
	// 请求拦截，配置Token等参数
	Vue.prototype.$u.http.interceptor.request = (config) => {
		// 如果环境进行切换，需要重新定义环境
		if (uni.getStorageSync('env')) {
			env = uni.getStorageSync('env')
			envUrl = uni.getStorageSync('envUrl')
			Vue.prototype.$u.http.setConfig({
				baseUrl: envUrl,
				timeout: 30000,
				originalData: true,
			})
		}
		if (typeof(config.header) === 'string') {
			loadingTag = true
			const msg = config.header
			Vue.prototype.setLoading(true, msg)
			config.header = {}
		} else if (config.header === true) {
			loadingTag = true
			Vue.prototype.setLoading(true)
			config.header = {}
		}
		config.header['Access-Token-App'] = uni.getStorageSync('token')
		config.header['appId'] = Vue.prototype.config.appId
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式，见：https://uviewui.com/components/globalVariable.html
		// config.header.token = vm.token;

		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;

		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;

		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的，所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
		const data = {
			method: config.method,
			url: config.url,
			data: config.data,
		}
		// console.log('%c请求参数=>', 'background-color: green; color: white; padding: 2px 5px; border-radius: 2px;', data)
		return config;
	}
	// 响应拦截，判断状态码是否通过
	Vue.prototype.$u.http.interceptor.response = (res) => {
		if (loadingTag) {
			Vue.prototype.setLoading(false)
			loadingTag = false
		}
		// 如果把originalData设置为了true，这里得到将会是服务器返回的所有的原始数据
		// 判断可能变成了res.statueCode，或者res.data.code之类的，请打印查看结果
		if (res.statusCode == 200) {
			// 如果把originalData设置为了true，这里return回什么，this.$u.post的then回调中就会得到什么
			if (res.data.code === 4001) {
				//登录状态失效 跳转到登录页面
				uni.clearStorageSync();
				// 如果设置了env环境，还原env环境设置
				if (env) {
					uni.setStorageSync('env', env)
					uni.setStorageSync('envUrl', envUrl)
				}
				Vue.prototype.$u.toast(res.data.message);
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/mine/login'
					})
				}, 1500)
				return new Promise(() => {})
			} else if (res.data.code !== 0 && res.data.code !== 1 && res.data.code !== 2) {
				uni.showToast({
					icon: 'none',
					title: res.data.msg || res.data.message || '操作不成功,请稍后重新尝试操作'
				})
				return new Promise(() => {})
			}
			const data = Object.assign(res.data)
			// console.log('%c返回结果=>', 'background-color: green; color: white; padding: 2px 5px;', data);
			return data;
		} else {
			uni.showToast({
				icon: 'none',
				title: '操作不成功,请稍后重新尝试操作',
				duration: 4000
			})
			return new Promise(() => {})
		}
	}
}

export default {
	install
}
