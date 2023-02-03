<template>
	<view class="pageIndex">
		<u-sticky>
			<view class="order_search" style="background: #F3F4F6;" v-if="pageType !=='parts'">
				<u-search placeholder="请输入名称" class="u-flex-1" bg-color="#fff" v-model="formParts.keyword"
					@search="onSearch" @custom="onSearch"></u-search>
				<u-icon name="hourglass" @click="show = true" size="40" color="#2979ff"></u-icon>
			</view>
			<view class="header" style="background: #F3F4F6;" v-else>
				<u-search placeholder="请输入配件全称名称" bg-color="#fff" shape="square" :clearabled="false" v-model="cpbh"
					@search="onSearch" @custom="onSearch"></u-search>
				<!-- <u-icon name="scan" color="#2979ff" size="40" @click="scan" class="icon"></u-icon> -->
			</view>
		</u-sticky>
		<view class="partItem u-flex u-row-between" v-for="(item,index) in list" :key="index">
			<view @click="previewImg(item.tp[0])">
				<u-image v-if="item.tp && item.tp.length > 0" width="130rpx" height="130rpx"
					:src="config.url + item.tp[0].filePath" mode="">
				</u-image>
				<u-image v-else width="130rpx" height="130rpx" mode="">
					<view slot="error" style="font-size: 18rpx;">暂无图片</view>
				</u-image>
			</view>
			<view class="u-p-l-20 u-flex-1">
				<view>
					<text>{{item.pjmc}}</text>
					<u-number-box :value="item.reworkNumber" :min="0" @change="valChange($event,item,index)"
						v-if="item.reworkNumber>0"></u-number-box>
					<u-icon name="plus-circle-fill" color="#007AFF" size="45" @click="clickNumbox(item,index)" v-else>
					</u-icon>
				</view>
				<view><text class="u-content-color">编号：</text><text class="u-m-l-8 u-main-color">{{item.pjbh}}</text>
				</view>
				<view class="u-flex u-row-between u-col-center">
					<text class="u-content-color">单价： <text class="u-m-l-8 u-main-color">{{item.xsjg}}</text></text>
				</view>
				<view class="u-flex u-row-between u-col-center">
					<text class="u-content-color" style="width: 330rpx;">型号： <text
							class="u-m-l-8 u-main-color">{{item.pjxh}}</text></text>
					<!-- <text class="u-type-primary" style="width: 220rpx;">网点库存：<text
							class="u-m-l-8 u-main-color">{{item.kysl}}</text></text> -->
				</view>
			</view>
		</view>
		<u-loadmore :status="status" v-if="list.length > 0" />
		<view style="margin-top: 80rpx" v-else>
			<u-empty text="暂无数据" mode="list"></u-empty>
		</view>
		<view class="u-flex" style="width: 100%; position: fixed;bottom: 0; z-index: 1000;">
			<u-button type="primary" style="width: 50%;" :custom-style="customStyle" @click='goback'>返回</u-button>
			<u-button type="success" style="width: 50%;" :custom-style="customStyle" @click='addDetailedList'>加入清单
			</u-button>
		</view>
		<u-popup v-model="show" mode="left" width="70%">
			<view class="popupLeft u-p-b-80">
				<condition :dataList="productdata" @getType="getType" ref="childrenDom"></condition>
			</view>
			<view class="popupLeftFooter">
				<u-button @click="onReset" size="medium">重置</u-button>
				<u-button type="primary" @click="onConfirm" size="medium">确定</u-button>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
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
				config: this.config,
				show: false,
				clickIndex: 0,
				relationOrder_id: '', //工单编号
				cpbh: '', // 关联产品编号
				pageType: '', // 进入页面
				totalCount: '',
				status: 'nomore', //没有更多 状态
				formParts: {
					pageNo: 1,
					pageSize: 20,
					sortField: "id",
					sortOrder: "desc",
					keyword: '',
					searchString: {
						pjmc: ''
					}
				},
				customStyle: {
					borderRadius: '0',
				},
				value: 0, //选择数量加减
				list: [], // 配件列表
				newList: [], // 请求的配件列表
				choiceList: [],
				productdata: [], // 弹窗产品数据
			}
		},
		onLoad(options) {
			const globalData = getApp().globalData
			globalData.choiceList = []
			console.log('options', options)
			this.relationOrder_id = options.relationOrder_id || ''
			this.pageType = options.pageType
			this.cpbh = ''
			console.log('this.pageType', this.pageType)
			if (this.pageType === 'parts') {
				const params = JSON.parse(JSON.stringify(this.formParts))
				this.getBom(params) // 获取配件列表 005技术员准备方案 申请配件
			} else {
				this.getPartsList('refresh') // 获取可选配件列表
				this.$u.post('/app/Setting/getOptionGoodsClass').then(res => {
					this.productdata = res.result
				})
			}
		},
		onShow() {
			const globalData = getApp().globalData
			this.choiceList = globalData.choiceList || []
			this.list = this.getShowList(this.list, this.choiceList)
		},
		watch: {
			newList(newVal) {
				this.list = newVal
				this.list = this.getShowList(this.list, this.choiceList)
			},
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
			onSearch(val) {
				if (this.pageType === 'parts') {
					// const params = JSON.parse(JSON.stringify(this.formParts))
					this.formParts.searchString.pjmc = val
					// this.formParts.keyword = val
					this.formParts.pageNo = 1
					this.getBom(this.formParts)
				} else {
					this.formParts.keyword = val
					this.formParts.pageNo = 1
					this.getPartsList('refresh')
				}
			},
			valChange(e, item, index) {
				item.reworkNumber = item.reworkNumber || 0
				item.reworkNumber = e.value
				this.list.splice(index, 1, item)
				this.choiceList.forEach(part => {
					if (part.id === item.id) {
						part.reworkNumber = e.value
					}
				})
				if (e.value === 0) {
					this.choiceList = this.choiceList.filter((part) => {
						return part.id !== item.id
					})
				}
			},
			clickNumbox(item, index) {
				item.reworkNumber = item.reworkNumber || 0
				item.reworkNumber++
				this.list.splice(index, 1, item)
				this.choiceList.push(item)
			},
			// 扫码获取SN码
			scan() {
				uni.scanCode({
					success: res => {
						console.log('res', res)
						this.cpbh = res.result || ''
						const params = JSON.parse(JSON.stringify(this.formParts))
						this.getBom(params)
					}
				})
			},
			// 成压申请配件
			getBom(params) {
				// // 只允许搜索一个
				// this.choiceList = []
				// // 产品编号只传前6位
				// let cpbh = ''
				// if (this.cpbh && this.cpbh.includes('/')) {
				// 	cpbh = this.cpbh.split('/')[0]
				// } else {
				// 	cpbh = this.cpbh
				// }
				params.associated = []
				params.customColumns = []
				params.selectAction = true
				params.tplviewid = "8083ce075821c08621bc95b5d93cb557"
				params.type = "table_subform_list"
				params.flowStatus = 'proceed'
				params.pageSize = 100
				console.log(params)
				this.$u.post('/admin/UserTable/init', params).then(res => {
					if (res.code === 0) {
						this.newList = res.result.data
					}
				})
			},
			//获取可选配件列表
			getPartsList(type) {
				this.$u.post('/app/WorkOrder/loadPjlist', this.formParts).then(res => {
					if (res.code === 0) {
						if (type === 'refresh') {
							this.newList = res.result.data
						} else {
							this.newList = [...this.newList, ...res.result.data]
						}
						let totalCount = res.result.totalCount
						let pageSize = this.formParts.pageSize
						this.status = totalCount > pageSize ? 'loadmore' : 'nomore'
					} else {
						this.$u.toast(res.message)
					}
				})
			},
			// 比较列表和添加用料表
			getShowList(list, partsList) {
				console.log('partsList', partsList)
				const arr = list.map(item => {
					partsList.forEach(part => {
						if (part.id === item.id) {
							item.reworkNumber = part.reworkNumber || part.sqsl
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

			// 搜索
			getType(val) {
				const arr = ['cppl', 'cplb', 'cplx', 'cpxh']
				arr.forEach(key => {
					this.formParts[key] = val[key]
				})
			},
			// 重置已选择产品分类
			onReset() {
				const arr = ['cppl', 'cplb', 'cplx', 'cpxh']
				arr.forEach(key => {
					this.formParts[key] = ''
				})
				this.$refs.childrenDom.isactive = -1
				this.$refs.childrenDom.ategory = -1
				this.$refs.childrenDom.modelactive = -1
				this.$refs.childrenDom.typeactive = -1
			},
			// 确认并搜索
			onConfirm() {
				this.show = false
				this.keyword = ''
				this.pageNo = 1 // 初始化请求数据页
				this.getPartsList('refresh')
			},

			//加入清单
			addDetailedList() {
				const newList = this.choiceList
				if (newList.length === 0) {
					this.$u.toast("请选择配件")
					return false
				}
				const reg = /^[0-9A-Za-z]{6}\/[0-9A-Za-z]{8}$/
				let apiList = []
				let pjzje = 0
				let pjzsl = 0
				newList.forEach((item, index) => { //组成新的数组 并把内层的对象名更改
					apiList.push(Object.assign({}, {
						glpjbh: item.pjbh, //关联物品/配件 编号 
						sqsl: item.reworkNumber, //申请数量
						pjmc: item.pjmc, //名称
						price: item.xsjg, //单价
						pjxh: item.pjxh, //配件型号
						// kysl: item.kysl, //库存数
						// pjgn: item.pjgn, //配件描述
						pjfj: item.tp[0] || '',
						// zbkc: item.zbkc
					}))
					pjzje += parseFloat(item.xsjg * item.reworkNumber)
					pjzsl += parseInt(item.reworkNumber)
				})
				let relationOrder_id = this.relationOrder_id
				const globalData = getApp().globalData
				globalData.apiList = apiList
				globalData.choiceList = this.choiceList
				// globalData.snm = this.cpbh
				//配件申请详情 继续添加配件进入
				uni.navigateTo({
					url: `./orderDetail?pageType=parts&relationOrder_id=${relationOrder_id}&pjzje=${pjzje}&pjzsl=${pjzsl}`
				})

			}
		},
		onPullDownRefresh() {
			if (this.pageType !== 'parts') {
				this.formParts.pageNo = 1
				this.getPartsList('refresh')
			}
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1500)
		},
		//下滑加载更多
		onReachBottom() {
			if (this.status !== 'nomore' && this.pageType !== 'parts') {
				this.formParts.pageNo++
				this.status = 'loading'
				this.getPartsList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	// @import 'index.scss';
	.pageIndex {
		position: relative;
		padding-bottom: 100rpx;

		.header {
			padding: 20rpx 26rpx;
			position: relative;

			.icon {
				position: absolute;
				right: 140rpx;
				top: 34rpx;
				z-index: 111;
			}
		}

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

	/deep/.flex_center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popupLeftFooter {
		position: fixed;
		padding-bottom: 20rpx;
		bottom: 0;
		width: 100%;
		display: flex;
		background: #FFFFFF;
		justify-content: space-around;

		button {
			width: 200rpx;
		}

	}
</style>
