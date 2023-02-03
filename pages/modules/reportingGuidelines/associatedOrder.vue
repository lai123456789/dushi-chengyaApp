<template>
	<view>
		<view class="u-p-l-32 u-p-r-32 u-p-t-20 u-m-b-20 u-flex ">
			<u-search class="u-flex-1" placeholder="搜索任务" shape="square" v-model="dataForm.search" bg-color="#FFF"
				@search="getDataList()" @custom="getDataList()"></u-search>
		</view>
		<u-card :show-head="false" :body-style="{padding:'0'}" margin="30rpx 15rpx 120rpx">
			<u-table slot="body" font-size="24">
				<u-tr>
					<u-td>操作（单选）</u-td>
					<u-td>业务编号</u-td>
					<u-td>客户单位（矿区）</u-td>
					<u-td>压缩机型号</u-td>
					<u-td>机组类型</u-td>
					<u-td>机组型号</u-td>
					<u-td>累计运行时间</u-td>
				</u-tr>
				<u-radio-group v-model="selectVal" @change="radioGroupChange">

					<u-tr v-for="(item, index) in dataList" :key="index">
						<u-td>
							<view style="word-break: break-all">
								<u-radio :name="item.gdbh" :disabled="item.disabled" shape="square" icon-size="20">
								</u-radio>
							</view>
						</u-td>
						<u-td>
							<view style="word-break: break-all">{{item.gdbh}}</view>
						</u-td>
						<u-td>
							<view style="word-break: break-all">{{item.khdwkq}}</view>
						</u-td>
						<u-td>
							<view style="word-break: break-all">{{item.ysjxh}}</view>
						</u-td>
						<u-td>
							<view style="word-break: break-all">{{item.jzlx}}</view>
						</u-td>
						<u-td>
							<view style="word-break: break-all">{{item.jzxh}}</view>
						</u-td>
						<u-td>
							<view style="word-break: break-all">{{item.ljyhsj}}</view>
						</u-td>
					</u-tr>
				</u-radio-group>
				<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
			</u-table>
		</u-card>
		<u-button style="width: 100%; position: fixed; z-index: 2; bottom: 0;" type="primary" @click="sure">确认</u-button>
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
				selectString: '',
				//分页参数如下
				// pageSize: 5, //这里可随意控制每页显示条数 也可删掉该参数，根据业务需求即可，在loadPage.js混入文件有定义 默认是10条/页
				initial: {
					apiName: '/crm/Order/dailyReportQueryOrderList', // 分页数据接口地址
					getDataListIsPage: true, // 是否分页
				},
				listName: 'result', //接口返回的数据结果集名称
				dataForm: {
					//请求参数 无需加pageNo,pageSize 已封装
					username: uni.getStorageSync('userInfo').username || '', //"唐啟万",
					search: '',
				},
				selectVal: ''
			}
		},
		methods: {
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				this.selectVal = e
			},
			//确认
			sure() {
				const globalData = getApp().globalData
				globalData.glyw = this.dataList.filter(item => item.gdbh === this.selectVal)[0]
				globalData.selectString = this.selectString //日报/晨报 跳转=daily  签到跳转=signIn
				console.log('globalData.glyw', globalData.glyw)
				globalData.meReady = false
				uni.navigateBack({
					delta: 1
				})
			},
		},
		onLoad(e) {
			this.getDataList()
			this.selectString = e.selectString || ''
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-radio {
		padding-left: 20rpx;
	}

	.u-td {
		height: auto;
	}
</style>
