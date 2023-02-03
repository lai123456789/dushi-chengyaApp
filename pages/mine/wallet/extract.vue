<template>
	<view class="extract">
		<u-card>
			<view class="u-flex u-row-between u-p-10" slot="head">
				<text>提现银行卡</text>
				<text>{{card.bankName}}({{card.number}})</text>
			</view>
			<view slot="body">
				<view class="u-m-b-80">
					<text>提现金额</text>
					<u-icon name="info-circle" size="28"></u-icon>
				</view>
				<view class="ipt u-flex u-row-between">
					<text class="icon">￥</text>
					<u-input input-align="right" type="number" :custom-style="{fontSize: '60rpx'}" placeholder=" "
						:focus="true" v-model="ktx" disabled></u-input>
				</view>
			</view>
			<view class="" slot="foot">
				<text>本周可提现金额 ￥{{ktx}}</text>
			</view>
		</u-card>
		<view class="footer">
			<view>目前仅支持将可提现金额一次性全部提现；</view>
			<!-- <view class="u-margin-bottom-40">2.支付平台手续费费率0.35%</view> -->
			<u-button type="error" size="medium" :custom-style="{width: '700rpx'}" @click="onComplete">
				1个工作日内到账，确认提现
			</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ktx: '',
				card: {
					bankName: '',
					number: '',
				}
			}
		},
		onLoad(options) {
			this.ktx = options.ktx
			this.$u.post('/app/Account/getMyBankCard').then(res => {
				if (res.code === 0) {
					this.card.bankName = res.result.bankName
					this.card.number = res.result.yhkh && res.result.yhkh.slice(-4)
				}
			})
		},
		methods: {
			onComplete() {
				this.$u.post('/app/Account/drawcash').then(res => {
					if (res.code === 0) {
						if (res.result && res.result.status === 'pending') {
							uni.navigateTo({
								url: `./extractDone?bankName=${this.card.bankName}&number=${this.card.number}&ktx=${this.ktx}`
							})
						}
					} else {
						this.$refs.uToast.show({
							title: `提现失败，${res.message}`,
							type: 'error'
						})
					}
				})

			},
		}
	}
</script>

<style lang="scss" scoped>
	.u-card-wrap {
		background-color: $u-bg-color;
		padding: 1px;
	}

	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}

	.ipt {
		font-size: 60rpx;

		.icon {
			color: #000000;
		}
	}

	.blue {
		color: blue;
	}

	.footer {
		width: 100%;
		padding: 32rpx;
		color: #999;
	}
</style>
