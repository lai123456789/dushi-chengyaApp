<template>
	<view class="listComponent">
		<view class="left">
			<view class="list u-row-center u-flex" v-for="(item, index) in leftList" :key="index" @click="choiceList(item, index)">
				<view :class="{ list_item: active === index}" class="u-row-center u-flex">
					{{item.title}}
				</view>
			</view>
		</view>
		<view class="right">
			<block v-if="page === 'check'">
				<u-card v-for="(item, index) in rightList" :key="index" :title="item.title" margin="20rpx" padding="0" :border="false"
				 :head-border-bottom="false" :head-style="headStyle" :body-style="bodyStyle">
					<view slot="body">
						<block v-if="item.list && item.list.length > 0">
							<view class="u-flex u-row-between content" v-for="(item1, index1) in item.list" :key="index1" @click="goTo(item1)">
								<text>{{item1.gzlx}}</text>
								<text class="iconfont lists_button_more_black" style="width: 40rpx; height: 40rpx;"></text>
							</view>
						</block>
					</view>
				</u-card>
			</block>
			<block v-else-if="page !== 'check'">
				<u-card v-for="(item, index) in rightList" :key="index" :title="item.title" margin="20rpx" padding="0" :border="false"
				 :head-border-bottom="false" :head-style="headStyle" :body-style="bodyStyle">
					<view slot="body">
						<block v-if="item.list && item.list.length > 0">
							<block v-for="(item1, index1) in item.list" :key="index1">
								<view class="u-flex u-row-between content" @click="showDetail(item1, index, index1)">
									<text>{{item1.fclb}}</text>
									<text class="iconfont lists_button_switch" style="width: 40rpx; height: 40rpx;" v-if="item1.show"></text>
									<text class="iconfont lists_button_switch_click" style="width: 40rpx; height: 40rpx;" v-else></text>
								</view>
								<view v-if="item1.show">
									<view class="info u-flex">
										<u-image class="info_img" width="120rpx" height="120rpx" :src="item1.tp" />
										<view class="flex_auto">
											<view class="u-font-26">{{item1.fcmc || item1.fymc}}</view>
											<view class="u-font-22 color_gray line">{{item1.fcbz || item1.fysm}}</view>
											<view>
												<text class="u-font-32 color_red">{{item1.fcjg || item1.jg}}</text>
												<text class="u-font-22 color_gray">{{item1.fcdw || item1.dw}}</text>
											</view>
										</view>
									</view>
								</view>
							</block>
						</block>
					</view>
				</u-card>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				leftList: [],
				rightList: [],
				active: 0,
				headStyle: {
					padding: '20rpx'
				},
				bodyStyle: {
					padding: '0 20rpx'
				}
			}
		},
		props: {
			page: {
				type: String,
				default: 'check'
			}
		},
		watch: {
			page: {
				handler(newVal) {
					const obj = {
						check: '/crm/Api/xcxFaultCheckList?number=chanpin_fl',
						auxiliary: '/crm/Api/xcxAuxiliary?number=chanpin_fl',
						other: '/crm/Api/xcxOtherFeeList?number=chanpin_fl',
					}
					const url = obj[newVal]
					this.$u.post(url).then(res => {
						this.leftList = res.data
						this.rightList = this.leftList[this.active].list || []
						if (newVal !== 'check') {
							this.rightList = this.rightList.map(item => {
								item.list = item.list.map(item1 => {
									item1.show = false
									let tp = item1.fctp || item.tp || ''
									if (tp.includes('filePath')) {
										const tpArr = JSON.parse(tp)
										tp = `${this.config.url}${tpArr[0].filePath}`
									}
									item1.tp = tp
									return item1
								})
								return item
							})
						}
					})
				},
				immediate: true
			},
		},
		methods: {
			choiceList(item, index) {
				this.active = index
				this.rightList = this.leftList[this.active].list || []
				if (this.page !== 'check') {
					this.rightList = this.rightList.map(item => {
						item.list = item.list.map(item1 => {
							item1.show = false
							let tp = item1.fctp || item1.tp || ''
							if (tp.includes('filePath')) {
								const tpArr = JSON.parse(tp)
								tp = `${this.config.url}${tpArr[0].filePath}`
							}
							item1.tp = tp
							return item1
						})
						return item
					})
				}
			},
			goTo(item) {
				const globalData = getApp().globalData
				globalData.checkItem = item
				uni.navigateTo({
					url: './checkDetail'
				})
			},
			showDetail(item1, index, index1) {
				item1.show = !item1.show
				const item = this.rightList[index]
				item.list[index1] = item1
				this.rightList.splice(index, 1, item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.listComponent {
		height: 100%;
		background-color: #f8f8f8;
		display: flex;
	}

	.left {
		background-color: #FFFFFF;
		height: 100%;
		width: 160rpx;
		overflow: scroll;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		.list {
			width: 100%;
			height: 92rpx;
			color: #666;
			font-size: 24rpx;
		}

		.list_item {
			width: 100%;
			box-sizing: border-box;
			border-left: 6rpx solid #28beca;
			color: #28beca;
			font-weight: bold;
			font-size: 28rpx;
		}
	}

	.right {
		flex: 1;
		height: 100%;
		overflow: scroll;

		.content {
			padding: 12rpx 0;
			color: #666666;
			font-size: 24rpx;
		}

		.info {
			width: 100%;
			box-sizing: border-box;
			color: #2c2c2c;
			margin: 24rpx 0;
		}

		.info_img {
			margin-right: 24rpx;
		}

		.color_red {
			color: #d73c39;
		}

		.color_gray {
			color: #b2b2b2;
		}
	}
</style>
