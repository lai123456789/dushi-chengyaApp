import platform from '@/common/platform.js';
import config from '@/common/config.js'
const getConfig = () => {
	config.platform = platform
	config.appId = null
	const getUrl = () => {
		let url
		if (config.url) {
			url = config.url
		} else {
			const settingEnv = uni.getStorageSync('env')
			if (settingEnv) {
				url = uni.getStorageSync('envUrl')
			} else if (platform == 'MP-WEIXIN') {
				config.appId = wx.getAccountInfoSync().miniProgram.appId
				if (__wxConfig.envVersion == 'develop' || __wxConfig.envVersion == 'trial') {
					url = config.urlDevelopment
				} else {
					url = config.urlProduction
				}
			} else {
				url = process.env.NODE_ENV !== 'development' ? config.urlProduction : config.urlDevelopment
			}
		}
		return url
	}
	config.url = getUrl()
	return config
}
const setLoading = (loading, title) => {
	if (loading) {
		title = title || '加载中'
		uni.showLoading({
			mask: true,
			title: title
		});
	} else {
		uni.hideLoading()
	}
}
export {
	getConfig,
	setLoading
}
