<template>
	<view class="load">
		<u-loadmore v-if="status!=='noData'" :status="status" :loadText="loadText" :icon-type="iconType" @loadmore="()=>{$emit('loadmore')}" />
		<u-empty v-else :text="emptyText" :mode="emptyIcon"></u-empty>
		<u-gap></u-gap>
	</view>
</template>

<script>
	export default {
		props: {
			status: { //加载状态
				type: String,
				default: 'loadmore'
			},
			iconType: {
				type: String,
				default: 'circle'
			},
			loadText: {
				type: Object,
				default: () => {
					return {
						loadmore: '', //点击或上拉加载更多
						loading: '正在加载...',
						nomore: '没有更多了'
					}
				}
			},
			emptyIcon: { //支持类型参考https://uviewui.com/components/empty.html
				type: String,
				default: 'list'
			},
			emptyText: {
				type: String,
				default: '暂无数据'
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.load {
		padding-top: 30upx;
	}
</style>
