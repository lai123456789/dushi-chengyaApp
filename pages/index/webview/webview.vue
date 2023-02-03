<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(options) {
			// 获取传递过来的链接
			if (options.url) {
				this.url = decodeURIComponent(options.url)
			}
		}
	}
</script>
