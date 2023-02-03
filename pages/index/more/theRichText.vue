<template>
	<view class="page u-content">
		<u-parse :html="content" @linkpress="onLinkpress"></u-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: ''
			}
		},

		onLoad(options) {
			uni.setNavigationBarTitle({
				title: options.page
			})
			this.$u.post('/app/Knowledge/detail', {
				id: options.id
			}).then(res => {
				this.content = res.result.content
			})
		},
		methods: {
			onLinkpress(e) {
				uni.showLoading({
					title: '加载中，请稍等',
					mask: true
				})
				uni.downloadFile({
					url: e.href,
					success: function(res) {
						if (res.statusCode === 200) {
							let Path = res.tempFilePath
							uni.openDocument({
								filePath: Path,
								success: function(res) {
									uni.hideLoading();
								}
							})
						}
					},
					fail: function(res) {
						uni.hideLoading({
							success: () => {
								uni.showToast({
									title: '加载失败',
								})
							}
						})
					}
				})
				e.ignore() // 阻止自动跳转/复制
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		padding: 20rpx;
	}
</style>
