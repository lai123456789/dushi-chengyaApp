<template>
	<view>
		<u-tabs :list="tabsList" :is-scroll="false" :current="current" @change="onChange" font-size="24"></u-tabs>
		<block v-if="current === 0">
			<view class="u-text-center u-m-t-80" @click="goInfo('daily')">
				<view class="u-flex u-row-center u-col-center"
					style="border-radius: 50%; background-color: #FFFFFF; margin: 0 auto; width: 160rpx; height: 160rpx;">
					<text class="iconfont baogao" style="color: #2979ff; width: 100rpx; height: 100rpx;"></text>
				</view>
				<view style="line-height: 64rpx;">日报-服务事业部</view>
			</view>
			<view class="u-text-center" style="margin-top: 100rpx;" @click="goInfo('session')">
				<view class="u-flex u-row-center u-col-center"
					style="border-radius: 50%; background-color: #FFFFFF; margin: 0 auto; width: 160rpx; height: 160rpx;">
					<text class="iconfont wodejihua" style="color: #2979ff; width: 100rpx; height: 100rpx;"></text>
				</view>
				<view style="line-height: 64rpx;">晨会-服务事业部</view>
			</view>
		</block>
		<block v-else>
			<view
				style="display: flex; align-items: center; justify-content: space-between; padding: 16rpx; margin: 8rpx;">
				<view style="background-color: white; padding: 0 8rpx;">
					<u-input placeholder="请选择日期" type="select" :custom-style="{width: '200rpx'}" height="65"
						:value="dataForm.searchDate" @click="show = !show"></u-input>
				</view>
				<u-calendar v-model="show" mode="date" @change="change"></u-calendar>
				<view class="u-flex-1 u-m-l-80">
					<u-search style="width: 100%;" shape="square" :show-action="true" class="u-flex-1"
						placeholder="搜索汇报内容" bg-color="#fff" v-model="dataForm.searchContent" @search="onsearch"
						@custom="onsearch"></u-search>
				</view>
			</view>
			<view>
				<u-empty mode="data" v-if="dataList.length === 0"></u-empty>
				<u-card v-else margin="0 16rpx" :show-head="false" :body-style="{padding: '8rpx'}">
					<view slot="body">
						<view class="u-flex u-row-around u-p-t-16 u-p-b-16" v-for="(item, index) in dataList"
							:key="index" :class="index === dataList.length-1?'':'u-border-bottom'" @click="info(item)">
							<view style="width: 100%;">
								<u-row gutter="32" justify="between">
									<u-col :span="2">
										<u-avatar :src="item.hbrtx"></u-avatar>
									</u-col>
									<u-col :span="10">
										<view>{{item.hbr}}</view>
										<view class="u-flex u-row-between u-col-center u-m-t-8">
											<text>汇报类型：{{item.hblx}}</text>
											<text>{{item.hbrq}}</text>
										</view>
										<view class="u-flex u-m-t-8">
											<view style="white-space: nowrap;">汇报内容：</view>
											<view>{{item.hbnr}}</view>
										</view>
										<view class="u-flex u-m-t-8">
											<view style="white-space: nowrap;">关联业务：</view>
											<view>{{item.glywbh}}/{{item.fwxm}}/{{item.jzxh}}</view>
										</view>
									</u-col>
								</u-row>
							</view>
						</view>
					</view>
				</u-card>
				<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
			</view>
		</block>
	</view>
</template>

<script>
	//引入混入的文件
	import loadPage from '@/pages/modules/forum/modulePublic/mixins/loadPage.js'
	//引入 loading状态组件
	import ListLoadingMore from '@/pages/modules/forum/modulePublic/sonComponents/ListLoadingMore.vue'

	export default {
		components: {
			ListLoadingMore
		},
		mixins: [loadPage], //使用混入文件
		data() {
			return {
				show: false,
				current: 0,
				tabsList: [{
					name: '新建'
				}, {
					name: '我提交的'
				}],
				engineerList: [],
				//分页参数如下
				// pageSize: 20, //这里可随意控制每页显示条数 也可删掉该参数，根据业务需求即可，在loadPage.js混入文件有定义 默认是10条/页
				initial: {
					apiName: '/crm/Order/dailyReportQueryHistory', // 分页数据接口地址
					getDataListIsPage: true, // 是否分页
				},
				listName: 'result', //接口返回的数据结果集名称
				dataForm: {
					//请求参数 无需加pageNo,pageSize 已封装
					username: uni.getStorageSync('userInfo').username || '', //"广州花都-师傅",
					searchDate: '',
					searchContent: ''
				}
			}
		},
		methods: {
			info(item){
				const globalData = getApp().globalData
				globalData.record = item
				let title = item.hblx === '日报' ? 'daily' : 'session'
				uni.navigateTo({
					url: `/pages/modules/reportingGuidelines/reportingInfo?title=${title}`
				})
			},
			onsearch() {
				this.getDataList()
			},
			onChange(e) {
				this.current = e
			},
			change(e) {
				this.dataForm.searchDate = e.result //2020-06-04
				// this.dataList = []
				this.getDataList()
			},
			goInfo(val) {
				let title = 'daily'
				if (val === 'session') {
					title = 'session'
				}
				uni.navigateTo({
					url: `/pages/modules/reportingGuidelines/reportingInfo?title=${title}`
				});
			},
		},
		onLoad() {
			//调用接口获取数据 getDataList方法在引入的loadPage文件有定义了
			this.getDataList()
		},
		onShow() {
			const globalData = getApp().globalData
			if (globalData.currentHb && globalData.currentHb === 1) {
				this.current = globalData.currentHb
				this.getDataList()
				globalData.currentHb = ''
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
