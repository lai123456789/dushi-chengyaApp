<template>
	<view class="addCard">
		<view class="tips">
			为了您的资金安全，系统仅支持绑定本人储蓄卡
		</view>
		<view class="line">
			<text>卡号</text>
			<view>
				<u-input placeholder="请输入卡号" v-model="cardNmuber" @input="cardInput" :disabled="isSee"></u-input>
			</view>
		</view>
		<view class="tips u-m-l-32" v-if="status === 2">
			<u-icon class="color_red" name="info-circle" style="color: red"></u-icon>
			<text class="color_red u-flex-1">暂不支持绑定该银行卡，请使用其他银行的储蓄卡</text>
			<text class="color_blue" @click="goToBank">查看银行列表</text>
		</view>
		<view class="tips u-m-l-32" v-else-if="status === 0 || status === 1">
			<image :src="cardInfo.bankLogo" style="width: 40rpx; height: 40rpx; margin-right: 16rpx;"></image>
			<text :class="status === 1 ? 'color_red' : ''">{{cardInfo.bankName}}</text>
		</view>
		<view class="line line_bottom">
			<text>银行发卡城市</text>
			<view v-if="isSee || status !== 0">
				<u-input placeholder="请选择银行发卡城市" v-model="cities" :disabled="isSee || status !== 0"></u-input>
			</view>
			<view v-else>
				<u-input placeholder="请选择银行发卡城市" v-model="cities" type="select" @click="showSelect"></u-input>
				<u-select v-model="show" mode="mutil-column-auto" :list="selectList" @confirm="onConfirm"></u-select>
			</view>
		</view>
		<view class="line line_bottom">
			<text>持卡人</text>
			<view>
				<u-input v-model="username" placeholder="请输入持卡人姓名" :disabled="isSee  || status !== 0"></u-input>
			</view>
		</view>
		<view class="line line_bottom">
			<text>身份证号码</text>
			<view>
				<u-input v-model="userId" placeholder="请输入身份证号码" :disabled="isSee || status !== 0"></u-input>
			</view>
		</view>
		<view class="line">
			<text>手机号码</text>
			<view>
				<u-input v-model="userphone" placeholder="请输入手机号码" :disabled="isSee || status !== 0"></u-input>
			</view>
		</view>
		<view class="footer" v-if="!isSee">
			<u-button type="error" :disabled="disable" @click="onComplate">验证并绑定信息</u-button>
		</view>
		<view class="tips u-font-22" style="color: #333;margin-top: 20rpx;" v-else>
			温馨提示：如信息绑定错误，请返回上一页点击更换银行卡按钮，重新绑定
		</view>
		<view class="foot_tips" :style="[isIPX ? { bottom: '100rpx' } : { bottom: '32rpx' }]">
			<text @click="goToBank" >查看可绑银行列表</text>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				isSee: false,
				cardNmuber: '',
				cardInfo: {
					bankLogo: '',
					bankName: ''
				},
				selectList: [],
				cities: '',
				citieValue: [],
				username: '',
				userId: '',
				userphone: '',
				preInfo: '', // 上个页面携带的信息
				status: -1,
				isIPX: false,
			}
		},
		computed: {
			disable() {
				return !(this.cardNmuber && this.cities && this.username && this.userId && this.userphone)
			}
		},
		async onLoad(options) {
			const globalData = getApp().globalData
			this.isIPX = globalData.isIPX
			const info = options.info
			this.preInfo = info
			this.isSee = options.info === 'detail'
			await this.$u.post('/crm/AdapayApi/getCardcity').then((res) => {
				const data = res.result || []
				this.selectList = data.map(item => {
					const children = item.cities.map(im => {
						return {
							label: im.title,
							value: im.value
						}
					})
					const obj = {
						label: item.title,
						value: item.value,
						children: children
					}
					return obj
				})
			})
			if (info === 'detail') {
				const globalData = getApp().globalData
				const bankInfo = globalData.bankInfo || {}
				let cities = ''
				this.selectList.forEach(item => {
					if (item.value === bankInfo.prov_code) {
						cities = item.label
						item.children.forEach(im => {
							if (im.value === bankInfo.area_code) {
								cities = `${cities} ${im.label}`
							}
						})
					}
				})
				this.cities = cities
				const number = bankInfo.yhkh && bankInfo.yhkh.slice(-4)
				this.cardNmuber = `**** *** **** **** ${number}`
				this.cardInfo = {
					bankLogo: bankInfo.bankLogo,
					bankName: bankInfo.bankName,
					bank: bankInfo.bank,
				}
				const name = bankInfo.sfzxm && bankInfo.sfzxm.slice(-1)
				this.username = `**${name}`
				const id = bankInfo.sfzhm && bankInfo.sfzhm.slice(-4)
				this.userId = `*************${id}`
				const phone = bankInfo.tel_no && bankInfo.tel_no.slice(-4)
				this.userphone = `********${phone}`
			}
		},
		methods: {
			// 输入卡号
			cardInput(val) {
				val = val.replace(/[ ]/g, '')
				this.$u.debounce(() => {
					this.$u.post('crm/AdapayApi/getBankname', {
						account: val
					}).then(res => {
						this.status = res.code
						if (res.code === 0) {
							this.cardInfo = res.result
						} else {
							this.cardInfo = {
								bankLogo: '',
								bankName: '暂无银行数据，请输入正确的储蓄卡账号'
							}
						}
					})
				}, 1000)
			},
			// 显示选择城市列表
			showSelect() {
				this.show = true
			},
			goToBank(){
				uni.navigateTo({
					url: './bankList'
				})
			},
			onConfirm(val) {
				this.cities = `${val[0].label} ${val[1].label}`
				this.citieValue = [val[0].value, val[1].value]
			},
			onComplate() {
				const account = this.cardNmuber.replace(/[ ]/g, '')
				const params = {
					phone: this.userphone,
					realname: this.username,
					idcard: this.userId,
					bank: this.cardInfo.bank,
					prov_code: this.citieValue[0],
					area_code: this.citieValue[1],
					account: account
				}
				this.$u.post('/app/Account/bindCard', params).then(res => {
					if (res.code === 0) {
						this.$refs.uToast.show({
							title: '绑卡成功',
							type: 'success',
							callback: () => {
								uni.navigateBack({
									delta: 1
								})
							}
						})
					} else {
						this.$refs.uToast.show({
							title: res.message || '绑卡失败，请稍后再试',
							type: 'error',
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tips {
		padding: 16rpx 32rpx;
		color: #333;
		display: flex;
		align-items: center;
	}

	.color_red {
		color: red;
		margin-right: 8rpx;
	}

	.color_blue {
		color: blue;
	}

	.line {
		width: 100vw;
		box-sizing: border-box;
		padding: 8rpx;
		background-color: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		text {
			width: 180rpx;
			text-align: right;
			margin-right: 20rpx;
		}

		view {
			width: 460rpx;
		}
	}

	.line_bottom {
		border-bottom: 1rpx solid #f1f1f1;
	}

	.footer {
		margin-top: 200rpx;
		width: 100vw;
		padding: 0 40rpx;
	}
	
	.foot_tips {
		width: 100%;
		position: absolute;
		left: 0;
		text-align: center;
		color: #28beca;
	}
</style>
