<template>
	<view class="myCard">
		<view class="" v-if="exist">
			<view class="card" @click="goAddCard('detail')">
				<view class="card_top">
					<view class="img">
						<image :src="card.bankLogo" style="width: 80rpx; height: 80rpx;"></image>
					</view>
					<view class="card_info">
						<view> {{card.bankName}} </view>
						<view> 储蓄卡 </view>
					</view>
				</view>
				<view class="card_bottom u-flex">
					<text class="u-m-r-16">****</text>
					<text class="u-m-r-16">****</text>
					<text class="u-m-r-16">****</text>
					<text>{{card.number}}</text>
				</view>
			</view>
			<view class="btn">
				<u-button type="primary" @click="goAddCard('replace')">更换银行卡</u-button>
			</view>
		</view>
		<view class="empty" v-else>
			<u-icon name="plus" size="48"></u-icon>
			<text class="u-m-l-20" @click="goAddCard('add')">添加银行卡</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				exist: false,
				card: {
					bankLogo: '',
					bankName: '',
					type: '储蓄卡',
					number: ''
				}
			}
		},
		onShow() {
			this.$u.post('/app/Account/getMyBankCard').then(res => {
				if (res.code === 0) {
					const globalData = getApp().globalData
					globalData.bankInfo = res.result
					this.card.bankName = res.result.bankName
					this.card.bankLogo = res.result.bankLogo
					this.card.number = res.result.yhkh && res.result.yhkh.slice(-4)
					this.exist = true
				} else {
					this.exist = false
				}
			})
		},
		methods: {
			goAddCard(info) {
				uni.navigateTo({
					url: `./addCard?info=${info}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myCard {
		display: flex;
		justify-content: center;
	}

	.card {
		width: 700rpx;
		height: 300rpx;
		background-color: #C64F57;
		border-radius: 16rpx;
		margin-top: 20rpx;
		padding-bottom: 40rpx;
		color: #f1f1f1;
	}

	.btn {
		margin-top: 160rpx;
	}

	.card_top {
		padding-top: 32rpx;
		padding-left: 48rpx;
		display: flex;
	}

	.img {
		width: 100rpx;
		height: 100rpx;
		background-color: #f1f1f1;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card_info {
		font-size: 36rpx;
	}

	.card_info view:last-child {
		font-size: 32rpx;
		color: #e1e1e1;
	}

	.card_bottom {
		font-size: 60rpx;
		margin-top: 40rpx;
		margin-left: 148rpx;
	}

	.dot {
		font-size: 80rpx;
		margin-right: 32rpx;
	}

	.empty {
		width: 700rpx;
		height: 150rpx;
		background-color: #FFFFFF;
		border-radius: 16rpx;
		margin-top: 40rpx;
		display: flex;
		align-items: center;
		padding: 32rpx;
		box-sizing: border-box;
		font-size: 40rpx;
	}
</style>
