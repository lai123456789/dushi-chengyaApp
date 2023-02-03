<template>
	<view>
		<view style="position:fixed; top: 0; z-index: 99999; width: 100vw; background-color: #f3f4f6;">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" font-size="24"></u-tabs>
			<view class="u-p-l-32 u-p-r-32 u-p-t-20 u-m-b-20 u-flex ">
				<u-search class="u-flex-1" placeholder="请输入工单编号" shape="square" v-model="dataForm.keyword"
					bg-color="#FFF" @search="onSearch" @custom="onSearch"></u-search>
				<u-button type="primary" class="u-m-l-20" size="mini" v-if="showWfq" @click="createOrder">新建</u-button>
			</view>
		</view>
		<view style="margin-top: 180rpx;">
			<view margin="0" class="u-m-b-20" v-for="(item,index) in dataList" :key="index">
				<u-card @click="goapplicationForm(item)">
					<view slot="head">
						{{item.gdbh}}
					</view>
					<view slot="body">
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">创建人:</view>
							<view class="u-flex-4 u-flex u-row-between">
								<view class="u-m-l-20">{{item.cjr}}</view>
								<u-tag :text="item.pjsqzt" />
							</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">创建时间:</view>
							<view class="u-flex-4 u-m-l-20">{{item.cjsj}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">申请仓库名称:</view>
							<view class="u-flex-4 u-m-l-20">{{item.ckmc}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right">申请仓库类型:</view>
							<view class="u-flex-4 u-m-l-20">{{item.cklx}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right ">申请总数量:</view>
							<view class="u-flex-4 u-m-l-20">{{item.pjzsl}}</view>
						</view>
						<view class="u-flex  u-p-t-10 u-p-b-10">
							<view class="u-flex-2 u-text-right ">申请总金额:</view>
							<view class="u-flex-4 u-m-l-20">{{item.pjzje}}</view>
						</view>
					</view>
				</u-card>
			</view>
			<u-empty mode="list" margin-top="90" v-if='dataList && dataList.length === 0'></u-empty>
			<u-gap></u-gap>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cIndex: 0,
				showWfq: false,
				list: [],
				current: 0,
				listName: 'result', //接口返回的数据名
				dataForm: { //请求参数
					keyword: '',
					OrderStatus: 'wddb',
					pageSize: 100,
				},
				dataList: [],
			}
		},
		onLoad() {
			const userInfo = uni.getStorageSync('userInfo')
			this.rolename = userInfo.rolename
		},
		onShow() {
			this.getCountpjsq()
			this.getDataList()
			this.showWfq = this.rolename === '网点负责人' && this.current === 2
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getCountpjsq()
			this.getDataList()
			this.showWfq = this.rolename === '网点负责人' && this.current === 2
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1500)
		},
		methods: {
			getCountpjsq() {
				this.$u.post('/app/WorkOrder/getCountpjsq').then(res => {
					this.list = res.result
					this.list.forEach((item, index) => {
						if (item.value != 'wddb') {
							item.count = 0
						}
					})
				})
			},
			change(e) {
				this.cIndex = e
				this.dataForm.keyword = ''
				this.dataForm.OrderStatus = this.list[e].value
				this.current = e
				this.showWfq = this.rolename === '网点负责人' && this.current === 2
				this.getDataList()
			},
			//新建配件申请单跳转页面
			createOrder() {
				uni.navigateTo({
					url: './addParts'
				});
			},
			getDataList() {
				let current = this.current
				this.$u.post('/app/WorkOrder/loadmypjsq', this.dataForm).then(res => {
					if (res.result.data.length < 1) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
					this.dataList = res.result.data
				})
			},
			goapplicationForm(value) {
				uni.navigateTo({
					// url: `./applicationForm?workitem_id=${value.workitem_id}&case_id=${value.case_id}&tableid=${value.tableid}&id=${value.id}&cIndex=${this.cIndex}`
					url: `./applicationForm?case_id=${value.slid}&cIndex=${this.cIndex}`
				})
			},
			onSearch() {
				let current = this.current
				this.getDataList()
			},
		},
	}
</script>
