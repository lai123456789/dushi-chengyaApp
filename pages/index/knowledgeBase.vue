<template>
	<view class="page">
		<u-sticky>
			<!--吸顶 只能有一个根元素 -->
			<view style="background: #F3F4F6;">
				<view class="u-flex u-p-t-26 u-p-l-16 u-p-r-16 u-p-b-12">
					<u-search class="u-flex-1" placeholder="请输入相关文字搜索" bg-color="#fff" v-model="keyword"
						@search="onSearch" @custom="onSearch"></u-search>
					<u-icon name="hourglass" @click="show = true" size="40" color="#2979ff"></u-icon>
				</view>
			</view>
		</u-sticky>
		<view v-for="(item, index) in list" :key="index">
			<u-card border-radius="0" padding="8" margin="0rpx" :head-border-bottom="false" :border="false"
				@click="gorichtext(item)">
				<view slot="body">
					<view class="u-p-l-16 u-p-r-16">
						<view class="u-font-16 u-m-b-10 u-main-color">
							<u-parse :html="item.title"></u-parse>
						</view>
						<view class="u-tips-color u-flex u-m-t-20 u-m-b-20">
							<u-icon name="account-fill" size="35"></u-icon>
							<view class="u-m-l-20 u-m-r-20 u-line-1" style="width: 150rpx;">{{item.author}}</view>
							<view>{{item.effect_start_time}}</view>
						</view>
						<view class="u-content-color u-m-t-10 u-font-15 u-line-3">
							{{item.content}}
						</view>
						<view class="u-flex u-m-t-10 u-m-b-14 u-light-color">
							<view>
								<u-icon name="more-circle-fill" size="30"></u-icon>
								<text class="u-m-l-10 u-m-r-10">{{item.comment_num}}</text>
							</view>
							<view class="u-m-l-40 u-m-r-40">
								<u-icon name="thumb-up-fill" size="30"></u-icon>
								<text class="u-m-l-10 u-m-r-10">{{item.liked_num}}</text>
							</view>
							<view>
								<u-icon name="eye-fill" size="30"></u-icon>
								<text class="u-m-l-10 u-m-r-10">{{item.browse_num}}</text>
							</view>
						</view>
					</view>
				</view>
			</u-card>
			<u-gap></u-gap>
		</view>
		<u-popup v-model="show" mode="left" width="70%">
			<view class="popupLeft u-p-b-80">
				<condition :dataList="productdata" @getType="getType" ref="childrenDom"></condition>
			</view>
			<view class="popupLeftFooter">
				<u-button @click="resetFilter" size="medium">重置</u-button>
				<u-button type="primary" @click="downCallback" size="medium">确定</u-button>
			</view>
		</u-popup>
		<u-loadmore :status="status" v-if="list.length !== 0" />
		<u-empty mode="list" v-else margin-top="40"></u-empty>
	</view>
</template>

<script>
	import condition from '@/components/productVariety.vue'
	export default {
		components: {
			condition
		},
		data() {
			return {
				page: '',
				status: 'loadmore',
				keyword: '',
				list: [],
				url: '',
				show: false,
				cpjlList: uni.getStorageSync('cpjlListOption'), //品类数组
				productdata: uni.getStorageSync('cpjlListOption'), //品类数组
				modelList: [], //型号数组
				pageNo: 1,
				pageSize: 20,
				param: {
					rolename: '师傅',
				}
			}
		},
		onLoad(options) {
			this.$u.post('/app/Setting/getOptionGoodsClass').then(res => {
				this.productdata = res.result
			})
			this.page = options.name
			uni.setNavigationBarTitle({
				title: `查询${options.name}`
			})
			this.onSearch()
		},
		methods: {
			gorichtext(item) {
				let id = item.id
				uni.navigateTo({
					url: `./more/theRichText?id=${id}&page=${this.page}`
				})
			},
			getType(val) {
				this.param = val
			},
			// 重置知识库分类
			resetFilter() {
				this.param = {
					rolename: '师傅',
				}
				this.$refs.childrenDom.isactive = -1
				this.$refs.childrenDom.ategory = -1
				this.$refs.childrenDom.modelactive = -1
				this.$refs.childrenDom.typeactive = -1
			},
			// 选择知识库分类
			downCallback() {
				this.show = false
				this.keyword = ''
				this.pageNo = 1 // 初始化请求数据页
				this.getList('refresh')
			},
			// 搜索栏搜索知识库
			onSearch(val) {
				let param = {
					keyword: val,
					catename: this.page
				}
				this.pageNo = 1 // 初始化请求数据页
				this.$u.post('/app/Knowledge/searchtitlekeyword', param).then(res => {
					if (res.code == 0) {
						this.list = res.result.data.map(item => {
							const redWord = `<span style="color: red">${this.keyword}</span>`
							item.title = this.keyword ? item.title.replace(this.keyword, redWord) : item
								.title
							return item
						})
						console.log("this.list", this.list)
						this.status = 'nomore'
					} else {
						this.$u.toast(res.message)
					}
				})
			},
			// 获取知识库列表
			getList(type) {
				this.status = 'loading'
				this.param.pageNo = this.pageNo
				this.param.pageSize = this.pageSize
				this.param.catename = this.page
				this.$u.post('/app/Knowledge/Konwledgelistforcp', this.param).then(res => {
					this.status = 'loadmore'
					if (type === 'refresh') {
						this.list = res.result.data
					} else {
						this.list = [...this.list, ...res.result.data]
					}
					if (res.result.data && res.result.data.length < this.param.pageSize) {
						this.status = 'nomore'
					}
				})
			},
		},
		onReachBottom() {
			if (this.status !== 'nomore') {
				this.pageNo++
				this.getList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	//抽屉底部 确定重置按钮
	.popupLeftFooter {
		position: fixed;
		padding: 20rpx 0;
		bottom: 0;
		width: 100%;
		display: flex;
		background: #FFFFFF;
		justify-content: space-around;

		button {
			width: 200rpx;
		}

	}

	.page {
		min-height: 100vh;
		padding-bottom: 20rpx;
	}
</style>
