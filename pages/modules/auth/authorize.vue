<template>
	<view class="auth">
		<view class="head u-flex u-row-center">
			为了保证信息安全，即将进行人脸验证
		</view>
		<view class="content u-flex">
			<view class="flex-col">
				<image src="../../../static/image/auth1.jpg" mode=""></image>
				<text>不要遮挡眼睛</text>
			</view>
			<view class="flex-col">
				<image src="../../../static/image/auth2.jpg" mode=""></image>
				<text>不要带帽</text>
			</view>
			<view class="flex-col">
				<image src="../../../static/image/auth3.jpg" mode=""></image>
				<text>光线不要太暗</text>
			</view>
		</view>
		<view class="btn">
			<u-button type="primary" style="width: 600rpx" @click="goTo">同意并开始识别</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				myInfo: {}, // 师傅信息
				status: 0, // 认证状态
				sfName: '',
				sfId: '',
			};
		},
		onLoad() {},
		methods: {
			goTo() {
				uni.redirectTo({
					url: './idCertification',
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.auth {
		background-color: #ffffff;
		overflow: hidden;
		min-height: 100vh;
	}

	.head {
		width: 100%;
		height: 80rpx;
		margin: 40rpx 0;
		font-size: 30rpx;
		color: #666666;
	}

	.content {
		width: 100%;

		image {
			width: 240rpx;
			height: 240rpx;
		}
	}

	.flex-col {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.btn {
		margin-top: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		padding: 12rpx 20rpx;
		margin-top: 20rpx;
		font-size: 32rpx;
		background-color: #fff;

		text:first-child {
			color: blue;
			margin-bottom: 16rpx;
		}
	}
</style>
