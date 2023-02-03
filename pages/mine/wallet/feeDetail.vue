<template>
	<view class="feeDetail">
		<u-sticky>
			<view>
				<u-tabs active-color="#28beca" :list="tabsList" :is-scroll="false" :current="current" @change="onChange"></u-tabs>
				<view class="search u-flex">
					<u-search class="u-flex-1" placeholder="请输入工单编号搜索" bg-color="#fff" v-model="gdbh" @search="onSearch"
						@custom="onSearch"></u-search>
					<u-icon name="hourglass" @click="showPop" size="40" color="#2979ff"
						v-if="current === 4 || current === 5"></u-icon>
				</view>
				<view class="tab" v-if="current === 0">
					<view class="tab_l" :class="tabIndex === 0 ? 'active' : ''" @click="changeTab(0)">
						本周可提现
					</view>
					<view class="tab_r" :class="tabIndex === 1 ? 'active' : ''" @click="changeTab(1)">
						所有可提现
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="content">
			<u-card padding="0" :head-style="headStyle" :body-style="bodyStyle" v-for="(item, index) in list"
				:key="item.id">
				<view class="u-flex u-row-between" slot="head">
					<text>{{item.glgdbh}}</text>
					<u-tag :text="item.txzt" type="primary" size="mini" />
				</view>
				<view slot="body" class="card_body">
					<view class="card_box">
						<text class="card_left">工单类型:</text>
						<text>{{item.sqlb}}</text>
					</view>
					<view class="card_box" v-if="item.status === 0">
						<text class="card_left">可提现金额:</text>
						<text style="color: red">￥{{item.txje}}</text>
					</view>
					<view class="card_box">
						<text class="card_left">服务费:</text>
						<text>￥{{item.fuwu_f}}</text>
					</view>
					<view class="card_box">
						<text class="card_left">配件费:</text>
						<text>￥{{item.pjf}}</text>
					</view>
					<view class="card_box">
						<text class="card_left">辅材费:</text>
						<text>￥{{item.fcf}}</text>
					</view>
					<view class="card_box">
						<text class="card_left">自动优惠金额:</text>
						<text>￥{{item.zdjmje}}</text>
					</view>
					<view class="card_box">
						<text class="card_left">优惠合计:</text>
						<text>￥{{item.yhje}}</text>
					</view>
					<view class="card_box">
						<text class="card_left">应收合计:</text>
						<text>￥{{item.sfzj}}</text>
					</view>
					<view class="card_box">
						<text class="card_left">手续费:</text>
						<text>￥{{item.sxf}}</text>
					</view>
					<view class="card_box">
						<text class="card_left">提现金额:</text>
						<text>￥{{item.txje}}</text>
					</view>
					<view class="card_box">
						<text class="card_left">退款金额:</text>
						<text>￥{{item.tkje}}</text>
					</view>
					<view class="card_box" v-if="item.status === 3 || item.status === 4">
						<text class="card_left">提现时间:</text>
						<text>{{item.txsj}}</text>
					</view>
					<view class="card_box" v-if="item.status === 4">
						<text class="card_left">到账时间:</text>
						<text>{{item.dzsj}}</text>
					</view>
					<view class="card_box" v-if="item.status === 2">
						<text class="card_left">处理状态:</text>
						<text>{{item.lczt}}</text>
					</view>
				</view>
			</u-card>
			<u-loadmore :status="status" v-if="list.length !== 0" />
			<u-gap height="20"></u-gap>
		</view>
		<u-empty mode="list" v-if="list.length === 0"></u-empty>
		<u-popup v-model="popShow" mode="bottom" :length="current === 4 ? '40%': '30%'" safe-area-inset-bottom
			border-radius="12">
			<view class="pop_wrapper">
				<block v-if="current === 5">
					<view class="pop_title">
						提现状态:
					</view>
					<view class="pop_content">
						<view class="list" :class="item.active ?  'active' : ''" v-for="(item, index) in tabsList"
							:key="index" @click="choiceTab(index)">
							{{item.name}}
						</view>
					</view>
				</block>
				<block v-if="current === 4">
					<view class="pop_title">
						快捷筛选:
					</view>
					<view class="pop_content">
						<view class="list" :class="index === timeIndex ?  'active' : ''"
							v-for="(item, index) in timeArr" :key="index" @click="choiceTab(index)">
							{{item}}
						</view>
					</view>
					<view class="pop_title">
						自定义:
					</view>
					<view class="pop_content nowrap" @click="pickerShow = true">
						<u-input border height="40" v-model="startday" @click="pickerShow = true" disabled
							placeholder="年/月/日"></u-input>
						<text class="u-m-l-10 u-m-r-10">~</text>
						<u-input border height="40" v-model="endday" @click="pickerShow = true" disabled
							placeholder="年/月/日"></u-input>
					</view>
				</block>
				<view class="pop_footer">
					<view class="btn_l" @click="onReset">
						重置
					</view>
					<view class="btn_r" @click="onChoice">
						确定
					</view>
				</view>
			</view>
		</u-popup>
		<u-calendar v-model="pickerShow" mode="range" safe-area-inset-bottom @change="choiceTime"></u-calendar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIndex: 0, // 待提现的所有tab选项
				current: 0, // tab栏当前所选栏
				tabsList: [{
					name: '待提现',
					params: {
						gdbh: '',
						pageNo: 1,
						pageSize: 20,
						txzt: 'dtx',
						rand: '',
					},
					list: [],
					active: false, // active 在所有栏筛选中是否被选中
				}, {
					name: '待审核',
					params: {
						gdbh: '',
						pageNo: 1,
						pageSize: 20,
						txzt: 'dsh3'
					},
					list: [],
					active: false,
				}, {
					name: '待到账',
					params: {
						gdbh: '',
						pageNo: 1,
						pageSize: 20,
						txzt: 'dptdz'
					},
					list: [],
					active: false,
				}, {
					name: '异常',
					params: {
						gdbh: '',
						pageNo: 1,
						pageSize: 20,
						txzt: 'dclyc'
					},
					list: [],
					active: false,
				}, {
					name: '已提现',
					params: {
						gdbh: '',
						pageNo: 1,
						pageSize: 20,
						txzt: 'ytx'
					},
					list: [],
					active: false,
				}, {
					name: '所有',
					params: {
						gdbh: '',
						pageNo: 1,
						pageSize: 20,
						txzt: ''
					},
					list: [],
					active: false,
				}],
				list: [],
				gdbh: '', // 搜索框的值
				headStyle: {
					fontWeight: 500,
					padding: '16rpx 32rpx'
				},
				bodyStyle: {
					padding: '16rpx 0'
				},
				status: 'loadmore',
				popShow: false,
				timeArr: ['近一个月', '近三月', '近半年'],
				timeIndex: -1,
				pickerShow: false,
				startday: '',
				endday: ''
			}
		},
		onLoad(options) {
			this.current = parseInt(options.index)|| 0
			this.tabIndex = parseInt(options.tabIndex) || 0
			this.tabsList[0].params.rand = this.tabIndex === 1 ? 'all' : ''
			this.getList()
		},
		methods: {
			changeTab(index) {
				if (this.tabIndex !== index) {
					const item = this.tabsList[0]
					item.params.rand = index === 1 ? 'all' : '',
						item.params.pageNo = 0
					this.getList('refresh')
				}
				this.tabIndex = index
			},
			onChange(val) {
				this.current = val
				const item = this.tabsList[this.current]
				this.gdbh = item.params.gdbh
				if (item.list.length > 0) {
					this.list = JSON.parse(JSON.stringify(item.list))
				} else {
					this.getList('refresh')
				}
			},
			// 搜索
			onSearch(val) {
				const item = this.tabsList[this.current]
				item.params.gdbh = val
				item.params.pageNo = 1
				this.tabsList.splice(this.current, 1, item)
				this.getList('refresh')
			},
			showPop() {
				this.popShow = true
			},
			getList(type) {
				uni.showLoading()
				const params = this.tabsList[this.current].params
				this.$u.post('/app/Account/getDatalist', params).then(res => {
					uni.hideLoading()
					if (res.code === 0) {
						const result = res.result.data || []
						const item = this.tabsList[this.current]
						if (type === 'refresh') {
							item.list = result
						} else {
							item.list = [...item.list, ...result]
						}
						item.list = item.list.map(im => {
							const arr = ['dtx', 'dsh3', 'dclyc', 'dptdz', 'ytx']
							im.status = arr.indexOf(im['_txzt_'])
							im.sxf = parseFloat(im.sfzj )- parseFloat(im.real_amt)
							im.sxf = im.sxf.toFixed(2)
							return im
						})
						this.list = item.list
						// 加载更多
						this.status = result.length < item.params.pageSize ? 'nomore' : 'loadmore'
					}
				})
			},
			choiceTab(index) {
				if (this.current === 5) {
					const item = this.tabsList[index]
					item.active = !item.active
					if (index === 5) {
						this.tabsList.forEach(im => {
							im.active = this.tabsList[5].active
						})
					} else {
						const tabArr = this.tabsList.filter((im, index) => index !== 5)
						this.tabsList[5].active = tabArr.every(im => im.active)
					}
					this.tabsList = JSON.parse(JSON.stringify(this.tabsList))
				} else {
					this.timeIndex = index === this.timeIndex ? -1 : index
					const month = index === 0 ? 1 : (index === 1 ? 3 : 6)
					const objDate = this.getDay(month)
					this.startday = objDate.startday
					this.endday = objDate.endday
				}
			},
			onReset() {
				if (this.current === 5) {
					this.tabsList.forEach(im => {
						im.active = false
					})
					this.tabsList = JSON.parse(JSON.stringify(this.tabsList))
				} else {
					this.startday = ''
					this.endday = ''
					this.timeIndex = -1
				}
			},
			onChoice() {
				this.popShow = false
				const item = this.tabsList[this.current]
				item.params.pageNo = 1
				if (this.current === 4) {
					item.params.startday = this.startday
					item.params.endday = this.endday
				} else {
					const tabArr = this.tabsList.filter(im => im.active)
					let arr = []
					tabArr.forEach(im => {
						arr.push(im.params.txzt)
					})
					item.params.ztrand = arr
				}
				this.getList('refresh')
			},
			choiceTime(val) {
				this.startday = val.startDate
				this.endday = val.endDate
			},
			getDay(mon) {
				const today = new Date()
				const tYear = today.getFullYear()
				let tMonth = today.getMonth() + 1
				let tDate = today.getDate()
				let sYear, sMonth, sDate
				if (tMonth - mon < 1) {
					sYear = tYear - 1
					sMonth = 12 + tMonth - mon
				} else {
					sYear = tYear
					sMonth = tMonth - mon
				}
				if (tMonth === 1 || tMonth === 12 && tDate === 31) {
					sDate =  30
				} else {
					sDate = tDate
				}
				sMonth = this.doHandleMonth(sMonth)
				sDate = this.doHandleMonth(sDate)
				tMonth = this.doHandleMonth(tMonth)
				tDate = this.doHandleMonth(tDate)
				const startday = sYear + '-' + sMonth + '-' + sDate
				const endday = tYear + '-' + tMonth + '-' + tDate
				return {startday, endday}
			},
			doHandleMonth(m) {
				m = m < 10 ? `0${m}` : m
				return m
			}
		},
		//下滑加载更 多
		async onReachBottom() {
			if (this.status !== 'nomore') {
				const item = this.tabsList[this.current]
				item.params.pageNo++
				this.status = 'loading'
				this.getList()
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			const item = this.tabsList[this.current]
			item.params.pageNo = 1
			this.getList('refresh')
			setTimeout(() => {
				uni.stopPullDownRefresh()
			},1500)
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		padding: 20rpx 12rpx;
		background-color: #F3F4F6;
	}

	.tab {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #F3F4F6;
	}

	.tab_l,
	.tab_r {
		width: 300rpx;
		padding: 8rpx 16rpx;
		text-align: center;
		border: 1px solid #28beca;
		background-color: #fff;
	}

	.tab_l {
		border-right: 0;
	}

	.active {
		background-color: #28beca;
		color: #fff;
	}

	.content {
		width: 100vw;
	}

	.card_body {
		display: flex;
		flex-wrap: wrap;
	}

	.card_box {
		min-width: 300rpx;
		padding: 4rpx 8rpx;
		box-sizing: border-box;
		display: flex;
	}

	.card_left {
		margin-right: 16rpx;
		width: 180rpx;
		text-align: right;
	}

	.pop_wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
	}

	.pop_title {
		padding: 48rpx 24rpx 24rpx 48rpx;
		color: #666;
	}

	.pop_content {
		width: 100vw;
		padding-left: 48rpx;
		padding-right: 48rpx;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;

		.list {
			width: 160rpx;
			margin-right: 24rpx;
			text-align: center;
			padding: 6rpx 0;
			border: 1rpx solid #ccc;
			margin-bottom: 20rpx;
		}
	}

	.nowrap {
		flex-wrap: nowrap;
	}

	.pop_footer {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100vw;
		display: flex;
		justify-content: space-around;
		border-top: 1rpx solid #f1f1f1;

		.btn_l,
		.btn_r {
			width: 50vw;
			height: 80rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.btn_r {
			color: #2979FF;
		}
	}
</style>
