<script>
	export default {
		onLaunch: function() {
			const that = this
			// 下载新版本
			if (wx.canIUse('getUpdateManager')) {
				//更新小程序版本
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调 如果有新版本，则更新版本
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							wx.showModal({
								content: '有新版本了，立即更新',
								showCancel: false, //隐藏取消按钮
								confirmText: "好的", //只保留确定更新按钮
								success: function(res) {
									if (res.confirm) {
										updateManager.applyUpdate()
									}
								}
							})
						})
						//下载版本失败 如断网情况
						updateManager.onUpdateFailed(function() {
							wx.showModal({
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							})
						})
					}
				})
			}
			uni.getSystemInfo({
				//获取设备信息以适配样式
				success: function(res) {
					let model = 'iPhone X';
					// 后期请使用 env(safe-area-inset-bottom) 方案
					if (
						res &&
						res.model &&
						(res.model.indexOf(model) > -1 ||
							res.model.indexOf('iPhone 11') > -1 ||
							res.model.indexOf('iPhone 12') > -1)
					) {
						that.globalData.isIPX = true;
					}
				},
			})
			// #ifdef APP-PLUS
			//客户端标识    
			let timeId = setInterval(() => {
				if (!this.config.cid) {
					var pinf = plus.push.getClientInfo()
					this.config.cid = pinf.clientid
				} else {
					clearInterval(timeId)
				}
			}, 1000)

			// 添加用户点击推送消息事件，可以放在app.vue中的onLaunch函数中，用于跳转某个页面之类的操作
			plus.push.addEventListener('click', (message) => {
				console.log('click', message)
			})

			// 用户接受到推送消息
			plus.push.addEventListener('receive', (message) => {
				console.log('receive', message)
				if (message.payload && message.payload.caseid) {
					const caseid = message.payload.caseid
					uni.navigateTo({
						url: `/pages/order/order?caseid=${caseid}`
					})
					this.$u.post(`/app/PushMsg/changereadstatus?id=${message.payload.id}`)
				} else {
					let innerAudioContext = uni.createInnerAudioContext()
					innerAudioContext.autoplay = true
					innerAudioContext.src = `/static/audio/${message.content}`
				}
			})
			// #endif
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style lang="scss">
	@import 'static/css/iconfont.css';
	@import 'uview-ui/index.scss';
	@import 'static/css/index.scss';
</style>
