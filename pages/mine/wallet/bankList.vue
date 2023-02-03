<template>
	<view class="bankList">
		<view class="content">
			<view class="box" v-for="(item, index) in list" :key="index">
				<image :src="item.bankLogo" style="width: 40rpx; height: 40rpx; margin-right: 16rpx;"></image>
				<text>{{item.bankName}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			};
		},
		onLoad() {
			this.$u.post('/crm/AdapayApi/bankcard').then(res => {
				if (res.code === 0) {
					this.list = res.result
				}
			})
		},
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-wrap: wrap;
		padding: 20rpx;
		justify-content: space-between;
	}
	
	.box {
		width: 28%;
		margin: 12rpx;
	}
</style>
