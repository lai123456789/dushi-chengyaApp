<template>
	<view>
		<view style="position:fixed; top: 0; z-index: 99999; width: 100vw; background-color: #f3f4f6;">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
			<view class="u-p-l-32 u-p-r-32 u-p-t-20 u-m-b-20 u-flex ">
				<u-search class="u-flex-1" placeholder="请输入工单编号" shape="square" v-model="dataForm.keyword" bg-color="#FFF" @custom="keyword"></u-search>
				<u-button type="primary" class="u-m-l-20" size="mini" v-if="showWfq" @click="createOrder">新建</u-button>
			</view>
		</view>
		<view style="margin-top: 180rpx;">
			<view v-show="current==0" margin="0" class="u-m-b-20" v-for="(item,index) in dataList" :key="index">
				<u-card @click="goapplicationForm(item)">
					<view slot="head">
						{{item.gdbh}}
					</view>
					<view slot="body">
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">创建人:</view>
							<view class="u-flex-4 u-flex u-row-between">
								<view class="u-m-l-20">{{item.cjr}}</view>
								<u-tag :text="item.cpsqzt" />
							</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">创建时间:</view>
							<view class="u-flex-4 u-m-l-20">{{item.cjsj}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">申请仓库名称:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqckmc}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">申请仓库类型:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqcklx}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right ">申请总数量:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqzsl}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right ">申请总金额:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqzje}}</view>
						</view>
					</view>
				</u-card>
			</view>
			<view v-show="current==1" margin="0" class="u-m-b-20" v-for="(item,index) in dataList" :key="index">
				<u-card @click="goapplicationForm(item)">
					<view slot="head">
						{{item.gdbh}}
					</view>
					<view slot="body">
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">创建人:</view>
							<view class="u-flex-4 u-flex u-row-between">
								<view class="u-m-l-20">{{item.cjr}}</view>
								<u-tag :text="item.cpsqzt" />
							</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">创建时间:</view>
							<view class="u-flex-4 u-m-l-20">{{item.cjsj}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">申请仓库名称:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqckmc}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">申请仓库类型:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqcklx}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right ">申请总数量:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqzsl}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right ">申请总金额:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqzje}}</view>
						</view>
					</view>
				</u-card>
			</view>
			<view v-show="current==2" margin="0" class="u-m-b-20" v-for="(item,index) in dataList" :key="index">
				<u-card @click="goapplicationForm(item)">
					<view slot="head">
						{{item.gdbh}}
					</view>
					<view slot="body">
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">创建人:</view>
							<view class="u-flex-4 u-flex u-row-between">
								<view class="u-m-l-20">{{item.cjr}}</view>
								<u-tag :text="item.cpsqzt" />
							</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">创建时间:</view>
							<view class="u-flex-4 u-m-l-20">{{item.cjsj}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">申请仓库名称:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqckmc}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">申请仓库类型:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqcklx}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right ">申请总数量:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqzsl}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right ">申请总金额:</view>
							<view class="u-flex-4 u-m-l-20">{{item.sqzje}}</view>
						</view>

					</view>
				</u-card>
			</view>
			<!-- <u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" /> -->
			<list-loading-more :status="loadingStatus"></list-loading-more>
			<u-gap></u-gap>
		</view>
	</view>
</template>

<script>
	//引入混入的文件
	import loadPage from '@/pages/order/modulePublic/mixins/loadPage.js'
	//引入 loading状态组件
	import ListLoadingMore from '@/pages/order/modulePublic/sonComponents/ListLoadingMore.vue'
	export default {
		components: {
			ListLoadingMore
		},
		mixins: [loadPage], //使用
		data() {
			return {
				cIndex: 0,
				showWfq: false,
				list: [],
				current: 0,
				pageNo: 0,
				wddbdataList: [],
				wdfqdataList: [],
				wdybdataList: [],
				param: {
					// pageNo: 1,
					// OrderStatus: '',
					keyword: ''
				},
				//分页参数如下
				pageSize: 5, //这里可随意控制每页显示条数 也可删掉该参数，根据业务需求即可，在loadPage.js混入文件有定义
				initial: {
					apiName: '/app/WorkOrder/loadmycpsq', // 分页数据接口地址
					getDataListIsPage: true, // 是否分页
				},
				listName: 'result', //接口返回的数据名
				dataForm: { //请求参数
					keyword: '',
					OrderStatus: 'wddb'
				},
			}
		},
		methods: {
			change(e) {
				if (e === 2) {
					this.showWfq = true
				} else {
					this.showWfq = false
				}
				this.cIndex = e
				this.wddbdataList = []
				this.wdfqdataList = []
				this.wdybdataList = []
				// this.param.pageNo = 1
				this.dataForm.keyword = ''
				this.dataForm.OrderStatus = this.list[e].value
				this.current = e
				this.getDataList()
			},
			//新建配件申请单跳转页面
			createOrder() {
				uni.navigateTo({
					url: '/pages/order/productBuy/addProduct'
				});
			},
			// getDataList() {
			// 	let current = this.current
			// 	this.$u.post('/app/WorkOrder/loadmypjsq', this.param).then(res => {
			// 		if (res.result.data.length < 1) {
			// 			this.status = 'nomore'
			// 		} else {
			// 			this.status = 'loadmore'
			// 		}
			// 		if (current == 0) {
			// 			let wddb = this.wddbdataList.concat(res.result.data)
			// 			this.wddbdataList = wddb
			// 		} else if (current == 1) {
			// 			let wdfq = this.wdfqdataList.concat(res.result.data)
			// 			this.wdfqdataList = wdfq
			// 		} else if (current == 2) {
			// 			let wdyb = this.wdybdataList.concat(res.result.data)
			// 			this.wdybdataList = wdyb
			// 		}
			// 	})
			// },
			goapplicationForm(value) {
				console.log(value)
				uni.navigateTo({
					url: `./productApplicationForm?workitem_id=${value.workitem_id}&case_id=${value.case_id}&tableid=${value.tableid}&id=${value.id}&cIndex=${this.cIndex}`
					// url: `./productDetail?workitem_id=${value.workitem_id}&case_id=${value.case_id}&tableid=${value.tableid}&id=${value.id}&cIndex=${this.cIndex}`
				})
			},
			keyword() {
				console.log("efwaefawfe");
				let current = this.current
				this.getDataList()
				// this.param.pageNo = 1
				// this.$u.post('/app/WorkOrder/loadmypjsq', this.param).then(res => {
				// 	if (res.result.data.length < 1) {
				// 		this.status = 'nomore'
				// 	}
				// 	if (current == 0) {
				// 		this.wddbdataList = res.result.data
				// 	} else if (current == 1) {
				// 		this.wdfqdataList = res.result.data
				// 	} else if (current == 2) {
				// 		this.wdybdataList = res.result.data
				// 	}
				// })
			},
			getCountpjsq() {
				this.$u.post('/app/WorkOrder/getCountcpsq').then(res => {
					this.list = res.result
					this.list.forEach((item, index) => {
						if (item.value != 'wddb') {
							item.count = 0
						}
					})
				})
			},

			// onReachBottom() {
			// 	this.status = 'loading'
			// 	this.param.pageNo++
			// 	this.getDataList()
			// }
		},
		onLoad() {
			this.getDataList()
		},
		onShow() {
			this.getCountpjsq()
		}
	}
</script>

<style>

</style>
