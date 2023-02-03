<template>
	<view class="u-p-20">
		<u-button v-if="config.platform=='MP-WEIXIN'" button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">获取用户手机号码</u-button>
		<u-button v-else @click="onGetPhoneNumber">点击获取用户手机号码</u-button>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				config: this.config,
				session_key: null
			}
		},
		onLoad() {
			console.log('config', this.config)
			if (this.config.platform == 'MP-WEIXIN') {
				uni.login({
					success: (res) => {
						console.log("login", res);
						this.$u.post('/weixin/open/sessionKey', {
							appId: this.config.appId,
							code: res.code
						}).then(res => {
							console.log("login2", res);
							this.session_key = res.session_key
						})
					}
				})
			}
		},
		methods: {
			onGetPhoneNumber: function(e) {
				console.log('onGetPhoneNumber', e)
				if (this.config.platform == 'MP-WEIXIN') {
					if (e.detail.errMsg == 'getPhoneNumber:ok') {
						this.$u.post('/weixin/open/dataCrypt', {
							appId: this.config.appId,
							session_key: this.session_key,
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
						}).then(res => {
							console.log("onGetPhoneNumber2", res);
							this.$u.toast('您已确认授权，您的手机号码号码是：' + res.phoneNumber)
						})
					} else {
						this.$u.toast('您已取消授权，无法获取手机号码')
					}
				} else {
					this.$u.toast('请在微信小程序中测试该功能')
				}
			}
		}
	}
</script>
