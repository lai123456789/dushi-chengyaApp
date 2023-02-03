<template>
	<view>
		<u-navbar :is-back="false" :border-bottom="false" :background="background" title="我的业务" title-size="24"
			title-color="#FFF"></u-navbar>
		<u-sticky>
			<view>
				<view
					style="background: linear-gradient(to right, #2979FC , #19B7FF); display: flex; align-items: center; padding-bottom: 60rpx;">
					<view class="u-flex u-padding-16 u-flex-1">
						<u-search class="u-flex-1" placeholder="请输入任务编号" bg-color="rgba(255, 255, 255, 0.5)"
							placeholder-color="#FFF" :input-style="{'font-size': '22rpx'}" color="#FFF" height="42"
							v-model="keyword" :action-style="{'font-size': '22rpx', color: '#FFF'}" @input="onInput"
							@search="onsearch" @custom="onsearch"></u-search>
						<text @click="show = true" class="iconfont shaixuan"
							style="width: 30rpx; height: 29rpx;"></text>
					</view>
				</view>
				<view style="margin-top: -40rpx; padding: 0 30rpx; position: absolute; width: 100%;">
					<u-tabs :list="tabsList" :is-scroll="false" :current="current" @change="onChange" font-size="20">
					</u-tabs>
				</view>
			</view>
		</u-sticky>
		<view class="u-p-30 u-m-t-32">
			<view v-for="(item, index) in orderList" :key="index">
				<u-card :show-head="false" @click="toDetail(item)" margin="0" padding="16"
					:body-style="{'border-top': '2rpx solid #2979FC'}" :border-radius="0">
					<view slot="body" class="card_body_content">
						<u-row>
							<view class="u-m-b-12">
								<u-col>
									<view class="u-flex">
										<text style="font-size: 18rpx; font-weight: bold;">{{item.lxr1xm}}</text>
										<text
											style="font-size: 18rpx; font-weight: bold; margin: 0 16rpx;">{{item.lxr1dh}}</text>
										<u-tag text="拨打电话" shape="circle" mode="plain" type="primary" size="mini"
											class="tagClass" @click.native.stop='callPhone(item.lxr1dh)' />
									</view>
								</u-col>
							</view>
						</u-row>
						<view class="u-m-b-12 u-m-t-12">
							<u-row>
								<u-col :span="6">
									<view class="u-flex">
										<view class="u-m-r-8">
											<view style="font-size: 16rpx;" class="u-tips-color">任务编号</view>
											<view style="font-size: 20rpx;">{{item.gdbh}}</view>
										</view>
										<u-tag text="一键复制" shape="circle" mode="plain" type="primary" size="mini"
											class="tagClass" @click.native.stop='handleCopy(item.gdbh)' />
									</view>
								</u-col>
								<u-col :span="6">
									<view class="u-flex">
										<view class="u-m-r-8">
											<view style="font-size: 16rpx;" class="u-tips-color">任务项目</view>
											<view style="font-size: 20rpx;">{{item.fwxm}}</view>
										</view>
										<u-tag v-if="item.lczt" :text="item.lczt" shape="circle" mode="dark"
											class="tagClass" type="primary" size="mini" />
									</view>
								</u-col>
							</u-row>
						</view>
						<view class="u-m-b-12">
							<u-row>
								<u-col :span="6">
									<view class="u-flex">
										<view class="u-m-r-8">
											<view style="font-size: 16rpx;" class="u-tips-color">创建时间</view>
											<view style="font-size: 20rpx; white-space: nowrap;">{{item.cjsj}}</view>
										</view>
									</view>
								</u-col>
								<u-col :span="6">
									<view class="u-flex">
										<view class="u-m-r-8">
											<view style="font-size: 16rpx;" class="u-tips-color">要求实施入场时间</view>
											<view style="font-size: 20rpx;">{{item.yqssrcrq}}</view>
										</view>
									</view>
								</u-col>

							</u-row>
						</view>
						<u-row>
							<u-col>
								<view class="u-flex u-p-t-12" v-if="item.ssq">
									<view class="u-m-r-8">
										<view style="font-size: 16rpx;" class="u-tips-color">客户地址</view>
										<view class="u-flex u-flex-wrap">
											<view style="font-size: 20rpx;">{{item.ssq}} {{item.azxxdz}}</view>
											<text class="iconfont dizhi" @click.native.stop="seeAddress(item)"
												style="width: 30rpx;height: 30rpx; margin-left: 20rpx;"></text>
										</view>
									</view>
								</view>
							</u-col>
						</u-row>
						<view style="border: 1rpx dashed #EEE; width: 100%; height: 1rpx; margin: 14rpx 0;"></view>
						<view class="u-font-15">
							<view class="u-flex">
								<view>
									<u-image v-if="item.tp && item.tp.length > 0" width="120rpx" height="120rpx"
										:src="config.url + item.tp[0].filePath" mode=""></u-image>
									<u-image v-else width="120rpx" height="120rpx"></u-image>
								</view>
								<view class="u-main-color u-m-l-16">
									<view class="content">
										<view style="font-size: 22rpx;">{{item.zjxh}} {{item.jzlx}}</view>
										<view class="u-flex u-flex-1">
											<view class="name u-content-color">出厂编号：</view>
											<view class="u-m-l-8 u-main-color">{{item.ccbh}}</view>
										</view>
										<view class="u-flex u-flex-1">
											<view class="name u-content-color u-text-right">制造单位：</view>
											<view class="u-m-l-8 u-main-color">{{item.zzdw}}</view>
										</view>
										<view class="u-flex u-flex-1">
											<view class="name u-content-color u-text-right">压缩机型号：</view>
											<view class="u-m-l-8 u-main-color">{{item.ysjxh || '无'}}</view>
										</view>
										<view class="u-flex u-flex-1">
											<view class="name u-content-color u-text-right">制造时间：</view>
											<view class="u-m-l-8 u-main-color">{{item.zzsj}}</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</u-card>
				<u-gap height="16"></u-gap>
			</view>


		</view>

		<u-loadmore :status="status" v-if="orderList.length !== 0" />
		<u-empty mode="data" v-if="orderList.length === 0" margin-top="40"></u-empty>
		<u-gap></u-gap>
		<u-popup v-model="show" mode="left">
			<view class="popupLeft u-m-t-32">
				<view class="popupLeftItem">
					<view class="popupLeftTitle">排序规则</view>
					<view class="popupLeftContent" v-for="(itemChildren, indexChildren) in pxgz" :key="indexChildren">
						<u-tag :text="itemChildren.name"
							@click="pxgzIndex = indexChildren; pxgzVal = itemChildren.value"
							:mode="pxgzIndex === indexChildren ? 'dark' : 'light'"></u-tag>
					</view>
				</view>
				<view class="popupLeftItem">
					<view class="popupLeftTitle">服务类别</view>
					<view class="popupLeftContent" v-for="(itemChildren, indexChildren) in fwlb" :key="indexChildren">
						<u-tag :text="itemChildren.name"
							@click="fwlbIndex = indexChildren; fwlbVal = itemChildren.value"
							:mode="fwlbIndex === indexChildren ? 'dark' : 'light'"></u-tag>
					</view>
				</view>
			</view>
			<view class="popupLeftFooter">
				<u-button @click="pxgzIndex = -1;fwlbIndex = -1" size="mini" :custom-style="{width: '200rpx'}">重置
				</u-button>
				<u-button type="primary" @click="sureFilter" size="mini" :custom-style="{width: '200rpx'}">确定</u-button>
			</view>
		</u-popup>
	</view>
</template>
<script>
	const QQMapWX = require('../../common/wxmap_sdk/qqmap-wx-jssdk.min.js')
	let qqmapsdk
	export default {
		data() {
			return {
				pxgzVal: '',
				pxgzIndex: -1,
				pxgz: [{
					name: '按要求实施时间降序',
					value: 'yqssrcrq'
				}, {
					name: '按派单时间降序',
					value: 'pgsj'
				}],
				fwlbVal: '',
				fwlbIndex: -1,
				fwlb: [{
					name: '全部',
					value: ''
				}, {
					name: '机组月保',
					value: 'jzyb'
				}, {
					name: '机组季保',
					value: 'jzjb'
				}, {
					name: '机组半年保',
					value: 'jzbnb'
				}, {
					name: '机组年保',
					value: 'jznb'
				}, {
					name: '故障处理',
					value: 'gzcl'
				}, {
					name: '新机安装',
					value: 'xjaz'
				}, {
					name: '大修改造',
					value: 'dxgz'
				}],
				background: {
					background: 'linear-gradient(to right, #2979FC , #19B7FF)'
				},
				show: false,
				config: this.config,
				orderList: [],
				status: 'loadmore',
				current: 0,
				tabsList: [{
						id: 0,
						name: '待处理',
						count: 5,
						params: {
							sortField: 'id',
							condition: 'dcl',
							pageSize: 10,
							sortOrder: 'desc',
							fwxm: ['jzyb', 'jzjb', 'jzbnb', 'jznb', 'gzcl', 'xjaz', 'dxgz'],
							keyword: ''
						}
					},
					{
						id: 1,
						name: '待接收',
						count: 5,
						params: {
							sortField: 'id',
							condition: 'djs',
							pageSize: 10,
							sortOrder: 'desc',
							fwxm: ['jzyb', 'jzjb', 'jzbnb', 'jznb', 'gzcl', 'xjaz', 'dxgz'],
							keyword: ''
						}
					},
					{
						id: 2,
						name: '已处理',
						params: {
							sortField: 'id',
							condition: 'ycl',
							pageSize: 10,
							sortOrder: 'desc',
							fwxm: ['jzyb', 'jzjb', 'jzbnb', 'jznb', 'gzcl', 'xjaz', 'dxgz'],
							keyword: ''
						}
					},
					{
						id: 3,
						name: '已取消',
						params: {
							sortField: 'id',
							condition: 'yqx',
							pageSize: 10,
							sortOrder: 'desc',
							fwxm: ['jzyb', 'jzjb', 'jzbnb', 'jznb', 'gzcl', 'xjaz', 'dxgz'],
							keyword: ''
						}
					},
					{
						id: 4,
						name: '全部业务',
						params: {
							sortField: 'id',
							condition: 'qbyw',
							pageSize: 10,
							sortOrder: 'desc',
							fwxm: ['jzyb', 'jzjb', 'jzbnb', 'jznb', 'gzcl', 'xjaz', 'dxgz'],
							keyword: ''
						}
					},
				],
				showMoreStatus: true,
				keyword: '',
				page: 1,
			}
		},
		watch: {
			orderList(val) {
				const config = this.config
				const now = Date.now()
				val.forEach(item => {
					if (item.cptp) {
						const imgArr = JSON.parse(item.cptp)
						const imgUrl = `${config.url}${imgArr[0].filePath}`
						item.imgUrl = imgUrl
					}
					let startTime = ''
					let finishTime = ''
					if (item.transition_status === '已完结' || item.transition_status === '回访') {
						startTime = item.scpdsj && item.scpdsj.replace(/-/g, '/')
						finishTime = item.sfwgsj && item.sfwgsj.replace(/-/g, '/')
					} else if (item.transition_status === '已取消') {
						startTime = item.scpdsj && item.scpdsj.replace(/-/g, '/')
						finishTime = item.end_date && item.end_date.replace(/-/g, '/')
					} else if (item.enabled_date && item.enabled_date.includes('-')) {
						startTime = item.enabled_date.replace(/-/g, '/')
						finishTime = new Date()
					}
					startTime = new Date(startTime)
					startTime = startTime.getTime()
					finishTime = new Date(finishTime)
					finishTime = finishTime.getTime()
					const duration = finishTime - startTime
					item.duration = this.getDuration(duration)
					if (item.duration.time && item.duration.time.includes('NaN')) {
						item.duration.time = 0
					}
					// 判断工单使用哪些字段 orderStatus 0 咨询单 1服务单（网点，师傅） 2投诉单 3服务单（技术支持）
					const orderArr = ['azd', 'wxd', 'thd', 'hhd', 'cld', 'cjd', 'qxd']
					if (orderArr.includes(item['_gdlx_'])) {
						item.orderStatus = 1
						if (item.transition_id.includes('f51fc9ec764645caa325c4dd4a176420')) {
							item.orderStatus = 3
						}
					} else if (item['_gdlx_'] === 'zx') {
						item.orderStatus = 0
					} else if (item['_gdlx_'] === 'ts2') {
						item.orderStatus = 2
					}
				})
			}
		},
		onLoad(options) {
			qqmapsdk = new QQMapWX({
				key: 'KV7BZ-K4BCP-R2GD4-LJQCX-5YNUS-CUFR6'
			})
		},
		onShow() {
			this.page = 1
			const globalData = getApp().globalData
			this.current = globalData.gdglIndex || 0
			this.getWorkList('refresh')
			this.getCount()
		},
		methods: {
			getCount(){
				this.$u.post('/app/WorkOrder/getIndexMenu').then(res => {
					if (res.code === 0) {
						this.tabsList[0].count = res.result.dcl
						this.tabsList[1].count = res.result.djs
					}
				})
			},
			sureFilter() {
				if (this.pxgzIndex !== -1 || this.fwlbIndex !== -1) {
					this.pxgzIndex = -1;
					this.fwlbIndex = -1;
					this.tabsList[this.current].params.sortField = this.pxgzVal
					this.tabsList[this.current].params.fwxm = this.fwlbVal
					this.getWorkList('refresh')
					this.tabsList[this.current].params.sortField = ''
					this.tabsList[this.current].params.fwxm = ''
				}
				this.show = false
			},
			handleCopy(number) {
				uni.setClipboardData({
					data: number,
					success: function() {}
				})
			},
			//以上新增
			// 毫秒转换
			getDuration(my_time) {
				const days = my_time / 1000 / 60 / 60 / 24
				const daysRound = Math.floor(days)
				const hours = my_time / 1000 / 60 / 60 - (24 * daysRound)
				const hoursRound = Math.floor(hours)
				const minutes = my_time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound)
				const minutesRound = Math.floor(minutes)
				let color = ''
				if (days < 1 && hoursRound < 2) {
					color = '#008000'
				} else if (days < 1) {
					color = '#FF8800'
				} else {
					color = '#ff0000'
				}
				const time = `${daysRound}天${hoursRound}时${minutesRound}分`
				return {
					time,
					color
				}
			},

			// 监听tabs栏变化
			onChange(val) {
				this.current = val
				this.getWorkList('refresh')
				this.keyword = this.tabsList[val].params.keyword
			},

			// 监听输入框输入
			onInput(val) {
				this.tabsList[this.current].params.keyword = val
			},
			//工单列表
			async getWorkList(type) {
				const tab = this.tabsList[this.current]
				const params = JSON.parse(JSON.stringify(tab.params))
				params.pageNo = this.page
				let data = []
				await this.$u.post('/app/WorkOrder/orderList', params).then(res => {
					if (res.code === 0) {
						data = res.result.data || []
						if (type === 'refresh') {
							this.orderList = data || []
						} else {
							this.orderList = [...this.orderList, ...data]
						}
						if (data.length < 9) {
							this.page--
							this.status = 'nomore'
						} else {
							this.status = 'loadmore'
						}
					}
				})
				return data
			},
			//拨打电话
			callPhone(e) {
				uni.makePhoneCall({
					phoneNumber: e,
					success: () => {
						console.log('成功拨打电话')
					}
				})
			},
			toDetail(item) {
				let globalData = getApp().globalData
				globalData.orderDetail = item
				// 已完结和已取消工单为历史工单
				if (this.current === 1 || this.current === 4) {
					uni.navigateTo({
						url: '../order/order?connection=doscss_history'
					})
				} else {
					uni.navigateTo({
						url: '../order/order'
					})
				}
			},
			onsearch() {
				this.page = 1
				this.getWorkList('refresh')
			},
			// 查看位置
			seeAddress(item) {
				const adress = `${item.ssq}${item.xxdz}`
				qqmapsdk.geocoder({
					address: adress,
					success: (res) => {
						if (res.status === 0) {
							const result = res.result.location
							uni.openLocation({
								latitude: result.lat,
								longitude: result.lng,
								success: function() {
									console.log('打开地址成功')
								}
							})
						}
					}
				})
			},
		},
		//下滑加载更 多
		async onReachBottom() {
			if (this.status !== 'nomore') {
				this.page++
				this.status = 'loading'
				this.getWorkList()
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.getCount()
			this.getWorkList('refresh')
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1500)
		}
	}
</script>
<style lang="scss" scoped>
	@import '../order/index.scss';

	/deep/.u-search {
		.u-input {
			background-color: transparent !important;
		}
	}

	/deep/.tagClass {
		.u-size-mini {
			font-size: 18rpx;
		}
	}

	.content {
		view {
			font-size: 20rpx;
		}
	}
</style>
