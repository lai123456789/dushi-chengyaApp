<template>
	<view>
		<view class="u-flex u-row-between u-m-l-32 u-m-t-16  u-m-r-32">
			<view class="u-flex u-col-center">
				<view class="u-m-r-16" style="font-size: 20rpx;">{{title}}</view>
				<text class="iconfont xiangxiajiantou" style="width: 16rpx; height: 8rpx;"></text>
			</view>
			<!-- 头部标题右边的内容 根据插槽 在引用的父组件自定义内容 -->
			<slot name="headRight"></slot>
		</view>
		<u-card :show-head="false" :body-style="bodyStyle" :margin="margin">
			<view slot="body">
				<slot></slot>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		props: {
			//卡片标题
			title: {
				type: String,
				default: '标题'
			},
			//卡片body样式
			bodyStyle: {
				type: Object,
				default: () => {
					return {
						padding: '16rpx',
					}
				}
			},
			// 卡片外边距
			margin: {
				type: String,
				default: '15rpx 30rpx'
			}
		},
		data() {
			return {

			}
		},
		methods: {},
		onLoad() {

		}
	}
</script>

<style lang="scss" scoped>

</style>
