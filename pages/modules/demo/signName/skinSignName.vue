<template>
	<view>
		<view class="u-p-32 u-m-b-24">
			<u-button @click="goSignName">点击开始签名</u-button>
		</view>
		<u-image v-if="src" :src="src" width="100%" height="300"></u-image>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				src: ''
			}
		},
		methods: {
			goSignName() {
				if (this.config.platform == 'MP-WEIXIN') {
					uni.navigateTo({
						url: '/pages/modules/demo/signName/autographArea'
					});
				} else {
					this.$u.toast('请在微信小程序中测试该功能')
				}

			}
		},
		onShow() {
			let dataImg = uni.getStorageSync('signNameTestImg')
			if (dataImg) {
				this.src = this.config.url + dataImg.result.filePath
				uni.removeStorageSync('signNameTestImg')
			}
		}
	}
</script>
