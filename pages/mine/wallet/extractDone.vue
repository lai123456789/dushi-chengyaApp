<template>
	<view class="extractDone">
		<view class="u-flex u-flex-col u-row-center" v-if="done">
			<i class="iconfont gou" style="width: 120rpx; height: 120rpx;"></i>
			<text class="words">提现申请成功，等待平台处理</text>
			<text class="tips">预计1个工作日内到账</text>
			<view class="line"></view>
			<view class="money">
				<text>提现金额</text>
				<text>￥{{ktx}}</text>
			</view>
			<!-- <view class="card">
				<text>手续费</text>
				<text>￥{{fuwu_f}}</text>
			</view> -->
			<view class="card">
				<text>提现银行卡</text>
				<text>{{bankName}}({{number}})</text>
			</view>
			<u-button type="primary" class="btn" @click="goBack">完成</u-button>
		</view>
		<view class="u-flex u-flex-col u-row-center" v-else>
			<i class="iconfont cha" style="width: 120rpx; height: 120rpx;"></i>
			<text class="words_h">提现申请失败，请稍后重试</text>
			<u-button type="primary" class="btn" @click="goBack">返回钱包</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				done: true,
				number: '',
				bankName: '',
				fuwu_f: '',
				ktx: ''
			}
		},
		onLoad(options) {
			this.bankName = options.bankName
			this.number = options.number
			this.ktx = options.ktx || '0.00'
			this.fuwu_f = parseFloat(this.ktx) * 0.0035
			this.fuwu_f = this.fuwu_f.toFixed(2)
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 2
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.extractDone {
		padding: 160rpx 0 0;
	}

	.words {
		font-size: 40rpx;
		color: #18B565;
		font-weight: 550;
		margin: 40rpx 0 20rpx;
	}

	.words_h {
		font-size: 40rpx;
		font-weight: 550;
		margin: 40rpx 0 20rpx;
	}

	.tips {
		color: #787878;
	}

	.line {
		margin-top: 60rpx;
		width: 100%;
		height: 1px;
		border-bottom: 1px solid #ccc;
	}

	.money {
		width: 100%;
		padding: 32rpx 32rpx 16rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card {
		width: 100%;
		padding: 0 32rpx 16rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.btn {
		margin-top: 32rpx;
		width: 90%;
	}
</style>
