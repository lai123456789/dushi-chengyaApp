<template>
	<view class="wallet">
		<view class="header">
			<view class="header_line">
				本周可提现余额
			</view>
			<view class="header_line">
				<text class="u-font-40">{{ktx}}</text> 元
			</view>
			<view class="header_btn u-flex u-row-around">
				<u-button size="medium" :custom-style="{color: 'red', backgroundColor: '#FACD91'}"
					@click="handleExtract">立即提现</u-button>
				<u-button size="medium" @click="seeDetail(0, 0)"> 查看明细</u-button>
			</view>
		</view>
		<view class="line_1 u-flex u-row-between">
			<view class="flex_col">
				<view class="u-margin-top-10">
					<u-icon name="info-circle" size="28"></u-icon>
					<text class="u-m-l-10">所有可提现</text>
				</view>
				<view class="u-margin-top-10">
					￥{{alltotal}}元
				</view>
			</view>
			<u-button size="small"  :custom-style="customStyle" @click="seeDetail(0, 1)">查看明细</u-button>
		</view>
		<u-gap height="40"></u-gap>
		<view class="content u-flex u-flex-col u-col-center">
			<block v-for="item in list" :key="item.id">
				<view class="line_2 u-flex u-row-between" style="borderBottom: '1px solid #f1f1f1'">
					<view class="flex_col">
						<view class="u-margin-top-10">
							<u-icon name="info-circle" size="28"></u-icon>
							<text class="u-m-l-10">{{item.name}}</text>
						</view>
						<view class="u-margin-top-10">
							￥{{item.money}}元
						</view>
					</view>
					<u-button size="small"  :custom-style="customStyle" @click="seeDetail(item.id)">
						查看明细</u-button>
				</view>
			</block>
			<view class="footer">
				<u-icon name="info-circle" size="28"></u-icon>
				<text class="u-m-l-10">待处理小计</text>
				<text class="u-m-l-80 u-m-r-20">￥{{total}}</text>
			</view>
			<u-modal v-model="modalShow" content="系统检测到您还没有绑定银行卡, 是否跳转绑定银行卡" show-cancel-button @confirm="onConfirm"></u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customStyle: {
					padding: '16rpx 32rpx',
					fontSize: '24rpx',
					color: '#fff',
					backgroundColor: '#28beca',
				},
				isBindCard: false, // 是否绑定银行卡
				ktx: '', // 可提现金额
				alltotal: '', // 所有可提现
				list: [{
					id: 1,
					name: '待审核',
					money: '',
					alias: 'dsh_total'
				}, {
					id: 2,
					name: '待到账',
					money: '',
					alias: 'ddz_total'
				}, {
					id: 3,
					name: '异常',
					money: '',
					alias: 'yc_total'
				}],
				modalShow: false,
				total: ''
			}
		},
		onShow() {
			this.$u.post('/app/Account/myAccount').then(res => {
				if (res.code === 0) {
					const data = res.result || {}
					const total = data.total || {}
					this.isBindCard = !!data.settle_account_id
					this.list[0].money = total.dsh_total || '0.00'
					this.list[1].money = total.ddz_total || '0.00'
					this.list[2].money = total.yc_total || '0.00'
					this.list = JSON.parse(JSON.stringify(this.list))
					this.ktx = total.thisweek_total || '0.00'
					this.alltotal = total.all_total || '0.00'
					this.total = parseFloat(total.dsh_total) + parseFloat(total.ddz_total) + parseFloat(total.yc_total)
					this.total = this.total.toFixed(2)
				}
			})
		},
		methods: {
			// 立即提现
			handleExtract() {
				if (this.isBindCard) {
					uni.navigateTo({
						url: `./extract?ktx=${this.ktx}`
					})
				} else {
					this.modalShow = true
				}

			},
			onConfirm () {
				uni.navigateTo({
					url: `./myCard`
				})
			},
			seeDetail(index, tabIndex) {
				uni.navigateTo({
					url: `./feeDetail?index=${index}&tabIndex=${tabIndex}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		width: 710rpx;
		height: 340rpx;
		background-color: #E04659;
		border-radius: 16rpx;
		margin: 32rpx 20rpx;
		color: #fff;
		padding-top: 60rpx;
		box-sizing: border-box;

		.header_line {
			margin: 20rpx;
			width: 100%;
			text-align: center;
		}

		.header_btn {
			margin-top: 60rpx;
		}
	}

	.content {
		width: 710rpx;
		background-color: #fff;
		margin: 0 20rpx;
		border-radius: 8rpx;
	}

	.line_1 {
		width: 710rpx;
		padding: 6rpx 12rpx;
		background-color: #fff;
		border-radius: 8rpx;
		margin: 0 20rpx;
	}

	.line_2 {
		width: 710rpx;
		padding: 6rpx 12rpx;
		border-bottom: 1px solid #f1f1f1;
	}

	.footer {
		width: 710rpx;
		height: 110rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	
	.flex_col {
		display: flex;
		flex-direction: column;
	}
</style>
