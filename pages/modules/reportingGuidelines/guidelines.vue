<template>
	<view style="padding-bottom: 120rpx">
		<web-view :src="fileType === 'pdf' ? `/static/generic/web/viewer.html?file=${url}` : url"></web-view>
		<view style="position: fixed; z-index: 2; padding: 20rpx; bottom: 0; width: 100%; display: flex; background: #FFFFFF;
		justify-content: space-around;" v-if="noRead === 0">
			<u-button style="width: 100%;" :custom-style="{'background': show ? '#a0cfff' : '#2b85e4'}"
				@click="checkRead">
				<u-checkbox @change="checkboxChange" v-model="checked" active-color="#2979ff" size="24"
					:disabled="disabled"></u-checkbox>
				<view class="u-flex u-col-center">
					<text
						style="color: #FFFFFF; margin-left: -18rpx; margin-right: 4rpx; padding-top: 8rpx;">我已阅读</text>
					<view class="u-p-t-8" v-if="show">
						<text>(</text>
						<u-count-down ref="uCountDown" :autoplay="false" color="#606266" :show-border="false"
							font-size="24" bg-color="#a0cfff" :timestamp="5" :show-days="false" :show-hours="false"
							:show-minutes="false" @end="endChange"></u-count-down>
						<text>秒)</text>
					</view>
				</view>
			</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: "https://dev.doscs.com/demo/chengya/doscall//public/upload/2021/07/02/20210702104753275387.pdf", //pdf文件路径
				show: true,
				checked: false,
				disabled: true,
				wdbh: '',
				fileType: '',
				// 为0 从每日汇报的操作指引进入 需要显示阅读5秒  为1 从其他页面进入 直接预览文件
				noRead: 0,
			}
		},
		methods: {
			checkboxChange(e) {
				const globalData = getApp().globalData
				globalData.wdbhRead = this.wdbh
				globalData.meReady = true
				uni.navigateBack({
					delta: 1
				});
			},
			checkRead() {
				if (this.disabled) {
					this.$u.toast('您需要阅读5秒后才能勾选已阅读')
				}
			},
			endChange() {
				this.show = false
				this.disabled = false
			}
		},
		onLoad(option) {
			this.url = option.link || ''
			this.fileType = option.link.includes('pdf') ? 'pdf' : 'else' //根据返回的url判断文件类型
			if (option.wdbh) {
				this.wdbh = option.wdbh
				setTimeout(() => {
					this.$refs.uCountDown.start();
				}, 1000)
			}
			if (option.noRead) {
				this.noRead = option.noRead
				uni.setNavigationBarTitle({
					title: '文件详情'
				})
			}
			// #ifdef APP-PLUS
			if(this.noRead === 0){
				let currentWebview = this.$scope.$getAppWebview(); //获取当前web-view
				let duration_timeout = setTimeout(function() {
					let wv = currentWebview.children()[0];
					console.log(wv);
					wv.setStyle({
						//设置web-view距离顶部的距离以及自己的高度，单位为px  
						top: 70,
						left: 0,
						width: 0,
						height: 650,
					});
					clearTimeout(duration_timeout);
				}, 1000);
			}
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-checkbox {
		.u-checkbox__icon-wrap {
			background: #FFFFFF;
		}
	}
</style>
