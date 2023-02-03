<template>
	<view class="page">
		<u-tabs :list="tabs" :is-scroll="false" :current="current" @change="onChange"></u-tabs>
		<view class="tab_left" v-if="current === 0">
			<list-component page="auxiliary" />
		</view>
		<view class="tab_left" v-else-if="current === 2">
			<list-component page="other" />
		</view>
		<view class="tab_center" v-else>
			<u-sticky>
				<view class="u-flex u-p-t-26 u-p-l-16 u-p-r-16 u-p-b-12">
					<u-search class="u-flex-1" placeholder="请输入产品型号搜索" bg-color="#f7f8f8" v-model="keyword" @search="onSearch" @custom="onSearch"></u-search>
				</view>
			</u-sticky>
			<view class="search_content">
				<view class="search_list" v-for="(item, index) in searchList" :key="index" @click="goToPart(item)">
					{{item.cpxh}} {{item.cpmc}}
				</view>
				<u-empty text="抱歉，没有找到相关的产品" mode="search" v-if="emptyFlag"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import listComponent from './listComponent'
	export default {
		components: {
			listComponent
		},
		data() {
			return {
				tabs: [{
					name: '辅材费用'
				}, {
					name: '配件费用'
				}, {
					name: '人工/其他'
				}],
				current: 0,
				keyword: '',
				searchList: [],
				emptyFlag: false
			}
		},
		onLoad(options) {},
		methods: {
			onChange(index) {
				this.current = index
				if (this.current === 1) {
					this.onSearch('')
				}
			},
			onSearch(val) {
				this.$u.post('crm/Api/xcxProductList', {
					search_model: val
				}).then(res => {
					this.searchList = res.data
					this.emptyFlag = res.data.length === 0
				})
			},
			goToPart(item) {
				const {
					cpmc,
					cpxh,
					ljm,
					cptp
				} = item
				const obj = {
					cpmc,
					cpxh,
					ljm,
					cptp
				}
				const str = JSON.stringify(obj)
				uni.navigateTo({
					url: `./feeDetail?params=${str}`,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #FFFFFF;
		min-height: 100vh;
	}

	.tab_left {
		height: calc(100vh - 80rpx);
	}

	.tab_center {
		width: 100%;
		height: calc(100vh - 80rpx);
		background-color: #f7f8f8;

		/* 搜索列表 */
		.search_content {
			background-color: #fff;
			min-height: calc(100vh - 182rpx);
		}

		.search_list {
			padding: 28rpx 32rpx;
			border-bottom: 1rpx solid #eee;
			font-size: 28rpx;
		}
	}
</style>
