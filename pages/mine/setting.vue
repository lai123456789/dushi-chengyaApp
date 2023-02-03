<template>
	<view class="setting">
		<view class="title">
			<text>新消息通知</text>
			<u-switch v-model="checked" @change="onChange" inactive-color="#e1e1e1" active-color="#19BE6B"></u-switch>
		</view>
		<u-cell-group>
			<u-cell-item title="开发者环境设置" :value="value" @click="showModal"></u-cell-item>
		</u-cell-group>
		<u-modal v-model="modal.show" :title="modal.title" show-cancel-button :cancel-text="modal.cancelText"
			:confirm-text="modal.confirmText" @confirm="onConfirm">
			<view class="modal_content">
				<u-input type="password" placeholder="请输入密码" :focus="true" border v-model="password"></u-input>
				<view class="u-font-12 tips">该功能仅限管理员使用，(切换环境后请重新进入)</view>
			</view>
		</u-modal>
		<u-action-sheet :list="list" @click="clickAction" v-model="actionShow"></u-action-sheet>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked: false,
				modal: {
					title: '提示',
					show: false,
					text: '请输入管理员密码(该功能仅限管理员使用)？',
					cancelText: '取消',
					confirmText: '确定',
					confirmFunc: 'setEnvironment'
				},
				password: '',
				value: '开发环境',
				actionShow: false,
				list:  [{
					text: '开发环境',
					value: 'https://dev.doscs.com/demo/chengya/doscall'
				}, {
					text: '生产环境',
					value: 'https://cy.doscs.com/doscall'
				}],
			}
		},
		onLoad() {
			this.$u.post('/app/User/getMyInfo').then(res => {
				const userInfo = res.result.userinfo || {}
				this.checked = userInfo.notice == 1
			})
			const environmentArr = ['https://dev.doscs.com/demo/chengya/doscall', 'https://cy.doscs.com/doscall']
			const valueArr = ['开发环境', '生产环境']
			const index = environmentArr.indexOf(this.config.url)
			this.value = valueArr[index] 
		},
		methods: {
			onChange() {
				this.$u.post('/app/User/setNoticeStatus')
			},
			// 打开弹窗
			showModal() {
				if (this.config.psdable) {
					this.actionShow = true
				}else {
					this.modal.show = true
				}
			},
			// 模态框确认
			onConfirm() {
				const func = this.modal.confirmFunc
				this[func]()
			},
			// 设置环境
			setEnvironment() {
				if (this.password === this.config.psd || this.password === 'dos123456') {
					this.actionShow = true
					this.config.psdable = true
				} else {
					this.$refs.uToast.show({
						type: 'error',
						title: '密码错误，请重新输入'
					})
				}
			},
			// 选择环境
			clickAction(index) {
				const arr = ['develop', 'product']
				this.config.url = this.list[index].value
				this.value = index === 0 ? '开发环境' : '生产环境'
				uni.setStorageSync('env', arr[index])
				uni.setStorageSync('envUrl', this.config.url)
				this.$refs.uToast.show({
					type: 'success',
					title: '切换成功'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.setting {
		padding: 40rpx 0;
	}

	.title {
		width: 100%;
		height: 100rpx;
		background-color: #FFFFFF;
		padding: 26rpx 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30rpx;
	}

	.modal_content {
		padding: 32rpx 64rpx;
	}

	.tips {
		color: red;
		margin-top: 20rpx;
	}
</style>
