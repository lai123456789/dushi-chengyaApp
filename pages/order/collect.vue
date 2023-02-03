<template>
	<view class="page">
		<view class="card u-margin-40 u-padding-40">
			<text class="txt1">扫一扫，向我付款</text>
			<text class="txt2">￥ {{total}}</text>
			<image :src="url" />
			<u-button type="primary" @click="onConfirm" style="width: 600rpx; margin-top: 40rpx;">确认收款</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				total: 0,
				url: '',
				detail: {},
			}
		},
		onLoad(options) {
			const globalData = getApp().globalData
			const user = uni.getStorageSync('user') || {}
			const username = user.username
			const order = globalData.order || {}
			const detail = order.orderData || {}
			this.detail = detail
			const orderNumber = detail.gdbh
			this.total = options.total || 0.01
			this.url =
				`${this.config.url}/crm/PartsPay/qrcodePay?orderNumber=${orderNumber}&money=${this.total}&uniqid=${username}`
			uni.connectSocket({
				url: this.config.websocket
			})
			uni.onSocketOpen(function(res) {
				uni.sendSocketMessage({ //发送订阅消息
					data: `{"action":"subscribe","channel":"payment/${username}"}`
				})
			})
			//监听服务端消息
			uni.onSocketMessage((res) => {
				const messageJson = JSON.parse(res.data)
				if (messageJson.data && messageJson.data.includes('status')) {
					const data = JSON.parse(messageJson.data)
					if (data.status == 1) {
						this.$refs.uToast.show({
							title: '支付成功',
							type: 'success',
							duration: 3000,
							callback() {
								const globalData = getApp().globalData
								globalData.ipay = true
								uni.navigateBack()
								uni.closeSocket()
							},
						})
					}
				}
			})
		},
		methods: {
			onConfirm() {
				const globalData = getApp().globalData
				this.$u.post(`crm/Api/xcxCheckPay?orderNumber=${this.detail.gdbh}`).then(res => {
					if (res.code === 1) {
						globalData.ipay = true
						uni.navigateBack()
					} else {
						this.$refs.uToast.show({
							title: '系统没有收到该工单付款信息，如有疑问请联系管理员',
							type: 'error',
							duration: 3000,
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.page {
		width: 100vw;
		height: 100vh;
		background-color: #377FF7;
		overflow: hidden;
	}

	.card {
		background-color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.txt1 {
		font-size: 28rpx;
		margin: 20rpx;
	}

	.txt2 {
		font-size: 50rpx;
		color: red;
	}

	image {
		width: 400rpx;
		height: 400rpx;
		margin: 20rpx;
	}

	.btn {
		width: 300rpx;
	}
</style>
