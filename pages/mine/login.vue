<template>
	<view class="page">
		<u-swiper :list="apiImage" :height="300"></u-swiper>
		<u-gap></u-gap>
		<view class="card">
			<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
				<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="account" label-width="120"
					label="账号" prop="username">
					<u-input placeholder="请输入用户名" v-model="model.username" type="text"></u-input>
				</u-form-item>
				<u-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="lock-open" label-width="120"
					label="密码" prop="password">
					<u-input :password-icon="true" type="password" @confirm="submit" v-model="model.password"
						placeholder="请输入密码"></u-input>
				</u-form-item>
			</u-form>
			<u-gap height="40"></u-gap>
			<u-button :custom-style="customStyle" :loading="loading" @click="submit">登录</u-button>
		</view>
		<!-- <u-button type="primary" @click="cancel">解绑登录</u-button> -->
		<view v-if="config.showDemo" class="u-p-20">
			<u-button @click="showDemo">查看demo</u-button>
		</view>
		<view class="u-text-center u-absolute u-light-color u-padding-bottom-40" style="width: 100%; bottom: 0;">
			技术支持：{{config.publisher}}
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import md5 from 'md5'
	export default {
		data() {
			return {
				config: this.config,
				apiImage: [this.config.banner[0]],
				loading: false,
				cancelRes: '',
				model: {
					username: '',
					password: '',
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: ['blur'],
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['blur'],
					}]
				},
				errorType: ['message'],
				customStyle: {
					backgroundColor: '#28beca',
					color: '#fff',
				}
			}
		},
		watch: {
			loading(newVal) {
				if (newVal) {
					setTimeout(() => {
						this.loading = false
					}, 2000)
				}
			}
		},
		onLoad() {
			if (uni.getStorageSync('token')) {
				// 如果用户已经处于登录状态，则直接跳转到首页
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			async submit() {
				// 微信小程序登录
				//#ifdef MP-WEIXIN
				this.wxLogin()
				//#endif

				// app登录，不支持H5登录
				//#ifndef MP-WEIXIN
				if (this.config.bindingWechat) {
					uni.getProvider({
						service: 'oauth',
						success: (res) => {
							this.appLogin()
						}
					})
				} else {
					this.requestLogin({})
				}
				//#endif
			},

			// 微信登录
			async wxLogin() {
				let code = ''
				await new Promise((resolve) => {
					uni.login({
						provider: 'weixin',
						success: (res) => {
							code = res.code
							resolve()
						}
					})
				})
				let result = {}
				let token = ''
				await new Promise((resolve) => {
					this.$refs.uForm.validate((suc, error) => {
						if (suc) {
							const data = this.$u.deepClone(this.model)
							data.password = md5(data.password)
							data.code = code
							this.loading = true
							this.$u.post('/app/Index/login', data).then(res => {
								if (res.code == 0) {
									token = res.result.token
									result = res.result
									resolve()
								} else {
									this.$u.toast(res.message)
								}
							})
						}
					})
				})
				this.requestLogin(result)
			},

			async appLogin() {
				let result = ''
				await new Promise((resolve) => {
					uni.login({
						provider: 'weixin',
						success: (res) => {
							result = res.authResult
							resolve()
						}
					})
				})
				this.requestLogin(result)
			},

			async requestLogin(result) {
				const globalData = getApp().globalData
				const pd = md5(this.model.password)
				await this.$u.post('app/Index/userLogin', {
					unionid: result.unionid,
					username: this.model.username,
					password: pd,
					cid: this.config.cid
				}).then(res => {
					if (res.code === 0) {
						uni.setStorageSync('token', res.result.token)
						uni.setStorageSync('user', {
							username: this.model.username,
							password: md5(this.model.password)
						})
						// 获取用户个人信息
						this.$u.post('/app/User/getMyInfo').then(res => {
							const userInfo = res.result.userinfo
							const myWdinfo = res.result.myWdinfo
							const myInfo = res.result.myInfo
							uni.setStorageSync('userInfo', userInfo)
							uni.setStorageSync('myWdinfo', myWdinfo)
							uni.setStorageSync('myInfo', myInfo)
						})
						uni.switchTab({
							url: '/pages/index/index'
						})
					} else {
						this.$refs.uToast.show({
							title: res.message,
							type: 'error'
						})
					}
				})

			},
			cancel() {
				const pd = md5('dos123456')
				this.$u.post('/app/Index/userUnbind', {
					"unionid": "oR6jy06WN7B4PW5tBrL1seuCh7IA",
					"username": this.model.username,
					"password": pd
				}).then(res => {
					this.cancelRes = JSON.stringify(res)
				})
			},

			showDemo() {
				uni.navigateTo({
					url: '/pages/modules/demo/index'
				});
			}
		}
	}
</script>
<style scoped>
	.login {
		width: 100%;
		margin-top: 20rpx;
		text-align: center;
		color: #7F7F7F;
		font-size: 24rpx;
	}

	.page {
		width: 100vw;
		height: 100vh;
		box-sizing: border-box;
		background-color: #FFFFFF;
	}

	.card {
		margin-top: 40rpx;
		padding: 0 40rpx;
	}
</style>
