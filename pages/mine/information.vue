<template>
	<view>
		<u-navbar back-icon-color="#000" title-color="#000" :custom-back="customBack">
			<view class="u-flex u-font-16 u-row-between u-flex-1 u-p-r-32">
				<view></view>
				<view>
					<text>消息</text>
					<text v-if="sum">({{parseInt(sum) < 100 ? sum : '99+'}})</text>
				</view>
				<view class="u-type-primary u-font-14" @click="handleReady">全部已读</view>
			</view>
		</u-navbar>
		<u-cell-group>
			<u-cell-item :arrow="false" v-for="(item, index) in dataList" :key="index" @click="goDetail(item)">
				<view class="img" slot="icon">
					<u-image width="80" height="80" :src="item.imgUrl"></u-image>
					<u-badge :count="item.count" :absolute="true" :offset="[-15, -15]"></u-badge>
				</view>
				<view slot="title">
					<view class="title">
						<text class="u-main-color u-font-16">{{item.name}}</text>
						<view>{{item.firstTime}}</view>
					</view>
					<view class="u-tips-color u-line-1" style="width: 600rpx">
						{{item.content ? item.content.title : ' '}}
					</view>
				</view>
			</u-cell-item>
		</u-cell-group>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				sum: 0
			}
		},
		onShow() {
			this.getList()
		},
		methods: {
			getList() {
				this.$u.post('/app/User/messageMenu').then(res => {
					console.log('res', res)
					this.dataList = res.result.map(item => {
						item.imgUrl = item.icon && item.icon.length > 0 &&
							`${this.config.url}${item.icon[0].filePath}`
						if (item.content) {
							let time = item.content.input_time.split(' ')[0]
							const ymd = time.split('-')
							const m = ymd[1]
							const d = ymd[2]
							item.firstTime = `${m}月${d}日`
						}
						this.sum += item.count
						item.name = item.type === 'workitem' ? '工单提醒' : item.name
						return item
					})
					console.log('sum', this.sum)
				})
			},
			//返回事件
			customBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			handleReady() {
				this.$u.post('/app/User/setRead').then(res => {
					this.$refs.uToast.show({
						type: 'success',
						title: '操作成功',
						callback: () => {
							this.getList()
						}
					})
				})
			},
			goDetail(item) {
				uni.navigateTo({
					url: `./informationList?type=${item.type}`
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.img {
		position: relative;
		margin-right: 20rpx;
	}
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
