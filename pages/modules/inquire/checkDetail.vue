<template>
	<view class="product_detail">
		<view class="title">{{checkItem.gzlx}}</view>
		<view class="time">{{checkItem.cjsj}}</view>
		<u-parse :html="checkItem.zccs" />
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
				},
				checkItem: {},
			}
		},
		onLoad() {
			const globalData = getApp().globalData
			 this.checkItem = globalData.checkItem
		}
	}
</script>

<style lang="scss" scoped>
	.product_detail {
	  padding: 32rpx;
	  padding-bottom: 168rpx;
	}
	
	.title {
	  font-size: 32rpx;
	  color: #2c2c2c;
	  font-weight: 550;
	}
	
	.time {
	  color: #b2b2b2;
	  font-size: 28rpx;
	  margin: 10rpx 0 20rpx;
	}
</style>
