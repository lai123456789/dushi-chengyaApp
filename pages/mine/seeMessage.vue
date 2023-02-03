<template>
	<view style="padding-bottom: 120rpx">
		<view class="seeMessage">
			<view class="title">
				{{data.title}}
			</view>
			<view class="son_title">
				<u-icon name="account"size="28"></u-icon>
				<text class="name">{{data.username}}</text>
				<text>{{data.update_time}}</text>
			</view>
			<view class="content">
				{{data.content}}
			</view>
		</view>
		<view style="position: fixed; z-index: 2; padding: 20rpx; bottom: 0; width: 100%; display: flex; background: #FFFFFF;
		justify-content: space-around;">
			<u-button style="width: 100%;" type="primary" @click="openTask">打开任务</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {
					title: '',
					content: '',
					input_time: '',
					username: ''
				}
			}
		},
		methods:{
			openTask(){
				let caseid = JSON.parse(this.data.setting).case_id
				uni.navigateTo({
					url: `/pages/order/order?caseid=${caseid}`
				})
			}
		},
		onLoad(options) {
			const id = options.id
			this.$u.post(`/app/User/getMeassage?id=${id}`).then(res => {
				console.log('res', res)
				this.data = res.result
			})
		},
	}
</script>

<style lang="scss" scoped>
	.seeMessage {
		padding: 20rpx;
	}
	.title {
		margin-top: 20rpx;
		text-align: center;
		font-size: 30rpx;
		font-weight: 550;
	}

	.content {
		margin-top: 20rpx;
	}
	
	.son_title {
		text-align: center;
		font-size: 24rpx;
		margin-top: 20rpx;
	}
	
	.name {
		padding: 0 20rpx;
	}
</style>
