<template>
	<view class="pageIndex">
		<u-tabs v-if="complate" :list="tabsList" :is-scroll="false" :current="current" @change="onChange"></u-tabs>
		<view class="order_search">
			<u-search placeholder="请输入名称/型号" class="u-flex-1" bg-color="#fff" v-model="formParts.keyword" @search="onsearch"
			 @custom="onsearch" v-if="searchType === 'peijian'"></u-search>
			<u-search placeholder="请输入名称" class="u-flex-1" bg-color="#fff" v-model="formParts.keyword" @search="onsearch"
			 @custom="onsearch" v-else></u-search>
		</view>
		<view class="partItem u-flex u-row-between" v-for="(item, index) in list" :key="index">
			<view>
				<u-image width="130rpx" height="130rpx" :src="item.tp" mode="" @click="previewImg(item.tp)"></u-image>
			</view>
			<view class="u-p-l-20 u-flex-1" v-show="searchType === 'peijian'">
				<view>
					<text>{{item.pjmc}}</text>
					<u-number-box :value="item.reworkNumber" :min="0" :max="item.kysl" @change="(e) => {valChange(e, item, index)}"
					 v-if="item.reworkNumber > 0"></u-number-box>
					<u-icon name="plus-circle-fill" color="#007AFF" size="45" @click="clickNumbox(item, index)" v-else></u-icon>
				</view>
				<view><text class="u-content-color">编号：</text><text class="u-m-l-8 u-main-color">{{item.pjbh}}</text></view>
				<view><text class="u-content-color">单价：</text><text class="u-m-l-8 u-main-color">{{item.lsj}}</text></view>
				<view class="u-flex u-row-between u-col-center">
					<text style="width: 330rpx;" class="u-line-2  u-content-color">型号：<text class="u-m-l-8 u-main-color">{{item.pjxh}}</text></text>
					<text class="u-type-primary">网点库存：<text class="u-m-l-8 u-main-color">{{item.kysl}}</text></text>
				</view>
			</view>
			<view class="u-p-l-20 u-flex-1" v-show="searchType !== 'peijian'">
				<view>
					<text>{{item.fcmc}}</text>
					<u-number-box :value="item.reworkNumber" :min="0" @change="e => {valChange(e, item, index)}" v-if="item.reworkNumber > 0"></u-number-box>
					<u-icon name="plus-circle-fill" color="#007AFF" size="45" @click="clickNumbox(item, index)" v-else></u-icon>
				</view>
				<view><text class="u-content-color">类别：</text><text class="u-m-l-8 u-main-color">{{item.fclb}}</text></view>
				<view><text class="u-content-color">单价：</text><text class="u-m-l-8 u-main-color">{{item.fcjg}} {{item.fcdw}}</text></view>
			</view>
		</view>
		<u-empty text="暂无数据" mode="list" v-if="emptyFlag"></u-empty>
		<u-loadmore :status="status" v-if="current !== 0 && !emptyFlag" />
		<view class="u-flex" style="width: 100%; position: fixed;bottom: 0; z-index: 1000;">
			<u-button type="primary" style="width: 50%;" :custom-style="customStyle" @click='goback'>返回</u-button>
			<u-button type="success" style="width: 50%;" :custom-style="customStyle" @click='addDetailedList'>加入清单</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				searchType: 'peijian',
				emptyFlag: true,
				listObj: {
					pj: {
						init: true,
						page: 1,
						list: []
					},
					allPj: {
						init: true,
						page: 1,
						list: []
					},
					fc: {
						init: true,
						page: 1,
						list: []
					},
					allFc: {
						init: true,
						page: 1,
						list: []
					}
				},
				tabsList: [{
					name: '产品BOM',
					count: ''
				}, {
					name: '所有配件',
					count: ''
				}, {
					name: '产品辅材',
					count: ''
				}, {
					name: '所有辅材',
					count: ''
				}],
				clickIndex: 0,
				relationOrder_id: '', //工单编号
				totalCount: '',
				status: 'nomore', //没有更多 状态
				formParts: {
					pageNo: 1,
					pageSize: 20,
					sortField: "id",
					sortOrder: "desc",
					keyword: ''
				},
				customStyle: {
					borderRadius: '0',
				},
				value: 0, //选择数量加减
				list: [],
				partsList: [],
				complate: '',
				cpbh: '',
				cplb: '',
			}
		},
		watch: {
			list(newVal) {
				this.emptyFlag = newVal.length === 0
			}
		},
		async onLoad(option) {
			const globalData = getApp().globalData
			this.partsList = globalData.partsList ? JSON.parse(JSON.stringify(globalData.partsList)) : []
			const detail = globalData.order ? globalData.order.orderData : {}
			this.cplb = detail['_cplb_']
			this.relationOrder_id = option.relationOrder_id || ''
			if (option.complate) { //完工服务步骤条添加用料明细按钮进入
				this.complate = option.complate
				this.cpbh = option.cpbh
			}
			await this.getPartsList() // 获取可选配件列表
			this.list = this.listObj.pj.list
			const list = this.getShowList(this.list, this.partsList)
			this.list = JSON.parse(JSON.stringify(list))
		},
		methods: {
			//点击图片预览放大
			previewImg(logourl) {
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},

			//顶部tab点击切换
			async onChange(index) {
				this.current = index
				this.searchType = (index === 0 || index === 1) ? 'peijian' : 'fuchai'
				const key = ['pj', 'allPj', 'fc', 'allFc'][index]
				const currentObj = this.listObj[key]
				if (currentObj.init) {
					this.formParts = {
						pageNo: 1,
						pageSize: 20,
						sortField: "id",
						sortOrder: "desc",
						keyword: ''
					}
					await this.getPartsList()
				}
				this.formParts.keyword = ''
				let list = currentObj.list
				list = this.getShowList(list, this.partsList)
				this.list = JSON.parse(JSON.stringify(list))
			},

			// 搜索
			onsearch(val) {
				if (this.current === 0) {
					const list = this.listObj.pj.list
					this.list = list.filter(item => {
						return item.pjmc.includes(this.formParts.keyword) || item.pjxh.includes(this.formParts.keyword)
					})
				} else {
					this.formParts.keyword = val
					this.formParts.pageNo = 1
					let param = this.formParts
					this.list = []
					const key = ['pj', 'allPj', 'fc', 'allFc'][this.current]
					this.listObj[key].page = 1
					this.getPartsList('search').then((res) => {
						if (res !== 'error') {
							this.list = res
							const list = this.getShowList(this.list, this.partsList)
							this.list = JSON.parse(JSON.stringify(list))
						} else {
							this.list = []
						}
					})
				}
			},
			valChange(e, item, index) {
				const key = ['pj', 'allPj', 'fc', 'allFc'][this.current]
				const partsList = JSON.parse(JSON.stringify(this.partsList))
				partsList.forEach(part => {
					if (part.tabKey === key && part.id === item.id) {
						part.reworkNumber = e.value
					}
				})
				this.partsList = partsList
			},

			// 添加用料
			clickNumbox(item, index) {
				if (this.searchType === 'peijian') {
					const globalData = getApp().globalData
					const detail = globalData.order ? globalData.order.orderData : {}
					const {
						gmrq,
						cjsj,
						zbsyts
					} = detail
					const params = {
						parts: {
							yxq: item.yxq,
							sfqyyxq: item['_sfqyyxq_'] || 'f',
							sfsb: item['_sfsb_'] || 'f',
						},
						order: {
							gmrq,
							cjsj,
							zbsyts
						}
					}
					this.$u.post('/app/Goods/partsWarranty', params).then(res => {
						item.showNumberBox = true
						item.reworkNumber = 1
						this.list.splice(index, 1, item)
						const key = ['pj', 'allPj', 'fc', 'allFc'][this.current]
						let idArr = []
						this.partsList.forEach(part => {
							if (part.tabKey === key) {
								idArr.push(part.id)
							}
						})
						item.bnbw = res.result ? 1 : 0
						if (!idArr.includes(item.id)) {
							item.tabKey = key
							this.partsList.push(item)
						}
					})
				} else {
					item.showNumberBox = true
					item.reworkNumber = 1
					this.list.splice(index, 1, item)
					const key = ['pj', 'allPj', 'fc', 'allFc'][this.current]
					let idArr = []
					this.partsList.forEach(part => {
						if (part.tabKey === key) {
							idArr.push(part.id)
						}
					})
					if (!idArr.includes(item.id)) {
						item.tabKey = key
						this.partsList.push(item)
					}
				}
			},
			//获取可选配件列表
			getPartsList(type) {
				return new Promise((resolve, reject) => {
					const key = ['pj', 'allPj', 'fc', 'allFc'][this.current]
					const currentObj = this.listObj[key]
					const init = currentObj.init
					const dataArr = [{
						data: {
							pageNo: type !== 'search' ? currentObj.page : 1,
							pageSize: 100,
							sortField: "id",
							sortOrder: "desc",
							keyword: '',
							cpbh: this.cpbh,
						},
						url: '/app/goods/getcpbom'
					}, {
						data: {
							pageNo: type !== 'search' ? currentObj.page : 1,
							pageSize: 10,
							sortField: "id",
							sortOrder: "desc",
							keyword: this.formParts.keyword
						},
						url: '/app/goods/getPjlistAll'
					}, {
						data: {
							pageNo: type !== 'search' ? currentObj.page : 1,
							pageSize: 10,
							cplb: this.cplb,
							keyword: this.formParts.keyword
						},
						url: '/app/Goods/getFcList'
					}, {
						data: {
							pageNo: type !== 'search' ? currentObj.page : 1,
							pageSize: 10,
							keyword: this.formParts.keyword
						},
						url: '/app/Goods/getFcList'
					}]
					const data = dataArr[this.current].data
					const url = dataArr[this.current].url
					this.$u.post(url, data).then(res => {
						if (res.code === 1) {
							this.$u.toast(res.message)
							resolve('error')
						} else {
							if (init) {
								currentObj.list = res.result.data.map(item => {
									item.reworkNumber = 0
									item.showNumberBox = false
									return item
								})
								currentObj.init = false
								resolve()
							} else {
								const result = res.result.data.map(item => {
									item.reworkNumber = 0
									item.showNumberBox = false
									return item
								})
								if (type !== 'search') {
									currentObj.list = [...currentObj.list, ...result]
								} else {
									currentObj.list = result
								}
								resolve(result)
							}
							currentObj.list && currentObj.list.forEach(item => {
								if (key === 'fc' || key === 'allFc') {
									if (item.fctp && item.fctp.length > 0) {
										item.tp = `${this.config.url}${item.fctp[0].filePath}`
									}
								} else {
									if (item.pjtp && item.pjtp.length > 0) {
										item.tp = item.pjtp[0]
									}
								}
							})
							this.$set(this.listObj, key, currentObj)
							const totalCount = res.result.totalCount || res.result.data.length // 总记录条数
							this.totalCount = totalCount
							if (totalCount > 9) {
								this.status = 'loadmore'
							} else {
								this.status = 'nomore'
							}
						}
					}).catch()
				})
			},

			// 比较列表和添加用料表
			getShowList(list, partsList) {
				const pList = JSON.parse(JSON.stringify(partsList))
				const key = ['pj', 'allPj', 'fc', 'allFc'][this.current]
				const arr = list.map(item => {
					partsList.forEach(part => {
						if (part.tabKey === key && part.id === item.id) {
							item.reworkNumber = part.reworkNumber
							item.showNumberBox = part.reworkNumber > 0
						}
					})
					return item
				})
				return arr
			},

			goback() {
				uni.navigateBack({
					delta: 1
				});
			},
			//加入清单
			addDetailedList() {
				let globalData = getApp().globalData
				globalData.partsList = this.partsList.filter(item => item.reworkNumber > 0)
				uni.navigateBack({
					delta: 1
				})
			}
		},
		//下滑加载更多
		async onReachBottom() {
			if (this.current !== 0) {
				const key = ['pj', 'allPj', 'fc', 'allFc'][this.current]
				const currentObj = this.listObj[key]
				currentObj.page++
				this.status = 'loading';
				await this.getPartsList()
				this.list = currentObj.list
				const list = this.getShowList(this.list, this.partsList)
				this.list = JSON.parse(JSON.stringify(list))
			}
		}
	}
</script>

<style lang="scss" scoped>
	// @import 'index.scss';
	.pageIndex {
		position: relative;
		padding-bottom: 100rpx;

		.order_search {
			padding: 0 26rpx;
			height: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.partItem {
			margin-bottom: 20rpx;
			border-radius: 20rpx;
			background: #FFFFFF;
			padding: 20rpx;


			view:nth-of-type(1) {
				color: $u-main-color;
				font-weight: bold;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			view {
				color: $u-tips-color;
			}

		}

	}
</style>
