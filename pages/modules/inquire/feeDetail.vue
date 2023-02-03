<template>
	<view class="self_part">
		<view class="part_header center-Two">
			<u-image class="img" width="176rpx" height="176rpx" :src="imgUrl" />
			<view class="u-flex-1 u-font-28">
				<view>{{detail.cpmc}}</view>
				<view class="color_gray">产品型号：{{detail.cpxh}}</view>
			</view>
		</view>
		<view class="part_list">
			<view class="part_list_title">配件列表</view>
			<view class="part_list_content u-font-28 u-flex u-row-center" v-for="(item, index) in partsList" :key="index">
				<u-image class="img" :src="item.pjtp" width="176rpx" height="176rpx" />
				<view class="part_list_wrapper betweencolumn">
					<view>
						<view>{{item.pjmc}}</view>
						<view class="tips u-font-22 color_gray">{{item.bz}}垃圾搭建了的法律法辣椒放辣椒发了发佛前皮无人区二</view>
					</view>
					<view>
						<text class="u-font-22 color_red">￥</text>
						<text class="u-font-32 color_red">{{item.lsj}}</text>
						<text class="u-font-22 color_gray">{{item.dw}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				partsList: [],
				imgUrl: '',
				detail: {},
			}
		},
		onLoad(options) {
			const params = JSON.parse(options.params)
			this.detail = params
			this.imgUrl = params.cptp ? params.cptp.filePath : ''
			this.$u.post('/crm/Api/xcxPartsList', {
				'product_69_code': params.ljm
			}).then(res => {
				this.partsList = res.data.map(item => {
					item.pjtp = item.pjtp && item.pjtp.filePath ? `${this.config.url}${item.pjtp.filePath}` : ''
					return item
				})
			})
		},
	}
</script>


<style lang="scss" scoped>
	.part_header {
		padding: 32rpx 54rpx 32rpx 34rpx;
	}

	.part_header image {
		width: 176rpx;
		height: 176rpx;
		margin-right: 24rpx;
	}

	.img {
		margin-right: 24rpx;
	}

	.color_gray {
		color: #b2b2b2;
	}

	/* 配件列表 */
	.part_list_title {
		padding: 32rpx 0 0 32rpx;
	}

	.part_list_content {
		padding: 32rpx;
	}

	.part_list_content image {
		width: 176rpx;
		height: 176rpx;
		margin-right: 24rpx;
	}

	.part_list_wrapper {
		min-height: 176rpx;
		flex: 1;
	}

	.tips {
		margin-top: 6rpx;
	}

	.color_red {
		color: #d73c39;
	}

	.betweencolumn {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.center-Two {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
