<template>
	<view>
		<view class="u-flex u-padding-16 u-flex-1">
			<u-search class="u-flex-1" placeholder="请输入文件名称搜索" bg-color="#fff" @search="onsearch" @custom="onsearch">
			</u-search>
		</view>
		<u-cell-group>
			<u-cell-item :title="item.wjmc" v-for="(item, index) in dataList" :key="index" @click="goInfo(item)"></u-cell-item>
		</u-cell-group>
		<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
	</view>
</template>

<script>
	import loadPage from '@/pages/modules/forum/modulePublic/mixins/loadPage.js'
	import ListLoadingMore from '@/pages/modules/forum/modulePublic/sonComponents/ListLoadingMore.vue'
	export default {
		components: {
			ListLoadingMore
		},
		mixins: [loadPage],
		data() {
			return {
				initial: {
					apiName: '/admin/UserTable/init',
					getDataListIsPage: true, //是否分页
				},
				listName: 'result',
				dataForm: {
					searchString: {
						wjlx: ["czzy2"],
						wjmc: ''
					},
					sortField: "id",
					sortOrder: "descend",
					tplviewid: "03d9987c5d5e44f44010261ec7ea62ff",
				}
			}
		},
		methods: {
			// 搜索栏
			onsearch(e) {
				this.dataForm.searchString.wjmc = e
				this.getDataList()
			},
			goInfo(item){
				uni.navigateTo({
					url: `/pages/modules/reportingGuidelines/guidelines?link=${this.config.url}${item.fj[0].filePath}&noRead=1`
				})
			}
		},
		onLoad() {
			this.getDataList()
		}
	}
</script>

<style lang="scss" scoped>

</style>
