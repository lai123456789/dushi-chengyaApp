<template>
	<view class="pageIndex">
		<u-tabs v-if="complate" :list="tabsList" :is-scroll="false" :current="current" @change="onChange"></u-tabs>
		<view class="order_search">
			<u-search placeholder="请输入名称/型号" class="u-flex-1" bg-color="#fff" v-model="formParts.keyword"
				@custom="onsearch"></u-search>
		</view>

		<view class="partItem u-flex u-row-between" v-for="(item,index) in list" :key="index">
			<view>
				<u-image width="130rpx" height="130rpx" :src="item.cptp[0]" mode="" @click="previewImg(item.cptp[0])">
				</u-image>
			</view>
			<view class="u-p-l-20 u-flex-1">
				<view>
					<text>{{item.cpmc}}</text>
					<u-number-box :value="item.reworkNumber" :min="0" @change="valChange($event,item,index)"
						v-if="item.showNumberBox && item.reworkNumber>0"></u-number-box>
					<u-icon name="plus-circle-fill" color="#007AFF" size="45" @click="clickNumbox(item,index)" v-else>
					</u-icon>
				</view>
				<view><text class="u-content-color">编号：</text><text class="u-m-l-8 u-main-color">{{item.cpbh}}</text>
				</view>
				<view><text class="u-content-color">单价：</text><text class="u-m-l-8 u-main-color">{{item.qdj}}</text>
				</view>
				<view class="u-flex u-row-between u-col-center">
					<text style="width: 330rpx;" class="u-line-2  u-content-color">型号：<text
							class="u-m-l-8 u-main-color">{{item.cpxh}}</text></text>
					<text class="u-type-primary">网点库存：<text class="u-m-l-8 u-main-color">{{item.kysl}}</text></text>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" />
		<view class="u-flex" style="width: 100%; position: fixed;bottom: 0; z-index: 1000;">
			<u-button type="primary" style="width: 50%;" :custom-style="customStyle" @click='goback'>返回</u-button>
			<u-button type="success" style="width: 50%;" :custom-style="customStyle" @click='addDetailedList'>加入清单
			</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				tabsList: [{
					name: '产品BOM',
					count: ''
				}, {
					name: '所有产品',
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
				complate: '',
				cpbh: ''
			}
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
			onChange(index) {
				this.current = index
				console.log(index)
				this.list = [] //先清空
				//切换时 form表单改为初始值
				this.formParts.pageNo = 1
				this.formParts.pageSize = 20
				this.formParts.sortField = "id"
				this.formParts.sortOrder = "desc"
				this.formParts.keyword = ""
				this.getPartsList()
			},
			onsearch(val) {
				this.formParts.keyword = val
				this.formParts.pageNo = 1
				let param = this.formParts

				//搜索时 判断是否有添加过产品 有的话就叠加进数组 存到缓存 再清空list = []
				let newList = this.list.filter((item, index) => {
					return item.reworkNumber > 0
				})
				let newListStorage = uni.getStorageSync('newList')
				if (newListStorage) {
					let storageList = [...newListStorage, ...newList]
					uni.setStorageSync('newList', storageList)
				} else {
					uni.setStorageSync('newList', newList)
				}
				console.log(param);
				this.list = []
				this.getPartsList()
			},
			valChange(e, item, index) {
				console.log(e.value) //选择的数值
				console.log(index) //当前选中的索引项
				this.list[index]['reworkNumber'] = e.value;

			},
			clickNumbox(item, index) {
				this.list[index].showNumberBox = true
				this.list[index].reworkNumber += 1 //点击+1
				console.log("这里 index", index);
			},
			//获取可选产品列表
			getPartsList() {
				let url, data
				if (this.complate && this.current === 0) {
					//完工步骤条进入选择产品   产品BOM
					data = Object.assign(this.formParts, {
						cpbh: this.cpbh
					}) //加多一个产品编号对象
					url = '/app/WorkOrder/getcpbom'
				} else if (this.current === 1) {
					//所有产品  只传关键词
					data = {
						keyword: this.formParts.keyword
					}
					url = '/app/WorkOrder/getPjlist'
				} else {
					//产品列表 申请进入
					data = this.formParts
					url = '/app/WorkOrder/loadCplist'
				}
				this.$u.post(url, data).then(res => {
					if (res.code === 1 && this.formParts.keyword != '') {
						this.$u.toast(res.message)
						return false
					}
					if (this.list.length == 0) {
						if (this.current === 1) { //所有产品关键词搜索 返回的数据结构 没有包含data这一层
							this.list = res.result.map(item => {
								item.reworkNumber = 0
								item.showNumberBox = false
								return item
							})
						} else {
							this.list = res.result.data.map(item => {
								item.reworkNumber = 0
								item.showNumberBox = false
								return item
							})
						}
					} else {
						this.list = this.list.concat(res.result.data).map(item => {
							if (item.showNumberBox) {} else {
								item.reworkNumber = 0
								item.showNumberBox = false
							}
							return item
						})
					}
					console.log("this.list")
					console.log(this.list)
					let totalCount = res.result.totalCount //总记录条数
					let pageSize = this.formParts.pageSize //每页显示条数
					this.totalCount = totalCount
					if (totalCount > pageSize) {
						this.status = 'loadmore'
					} else {
						this.status = 'nomore'
					}
				}).catch()

			},

			goback() {
				uni.navigateBack({
					delta: 1
				});
			},
			//加入清单
			addDetailedList() {
				let storageList = uni.getStorageSync('newList')
				let indexList = this.list.filter((item, index) => { //删选出新的数组
					return item.reworkNumber > 0
				})
				// this.list

				let newList = [...storageList, ...indexList]
				uni.setStorageSync('allNewList', newList)

				if (newList.length === 0) {
					this.$u.toast("请选择产品")
					return
				}

				let apiList = []
				let pjzje = 0
				let pjzsl = 0
				newList.forEach((item, index) => { //组成新的数组 并把内层的对象名更改
					apiList.push(Object.assign({}, {
						glpjbh: item.cpbh, //关联物品/产品 编号 
						sqsl: item.reworkNumber, //申请数量
						pjmc: item.cpmc, //名称
						price: item.qdj, //单价
						pjxh: item.cpxh, //产品型号
						kysl: item.kysl, //库存数
						pjgn: item.cpgn, //产品描述
						pjtp: item.cptp[0]
					}))
					pjzje += parseFloat(item.qdj * item.reworkNumber)
					pjzsl += parseInt(item.reworkNumber)
				})
				let relationOrder_id = this.relationOrder_id
				let stringArr = JSON.stringify(apiList)
				//完工服务步骤进入选择产品
				if (this.complate) {
					let cpbh = this.cpbh
					uni.navigateTo({
						url: `/pages/order/orderDetail?apiList=${stringArr}&showComplate=true&cpbh=${cpbh}`
					})
				} else {
					//产品申请详情 继续添加产品进入
					uni.navigateTo({
						// url: `/pages/order/orderDetail?pageType=parts&relationOrder_id=${relationOrder_id}&apiList=${stringArr}&pjzje=${pjzje}&pjzsl=${pjzsl}`
						url: `/pages/order/productBuy/productDetail?pageType=parts&relationOrder_id=${relationOrder_id}&apiList=${stringArr}&pjzje=${pjzje}&pjzsl=${pjzsl}`
					})
				}

			}
		},
		onShow() {
			//在下一页面更改产品数量后 返回该页面对应更改该页面产品数量
			let allList = uni.getStorageSync('allNewList')
			let thisList = this.list.filter((item, index) => { //删选出新的数组
				return item.reworkNumber > 0
			})
			if (thisList.length > 0) {
				if (allList) {
					console.log("当前list", thisList);
					allList.forEach((sitem, sindex) => {
						for (let x in thisList) {
							if (thisList[x].cpbh == sitem.cpbh) {
								thisList[x].reworkNumber = sitem.reworkNumber
							}
						}
					})
				}
			}

		},
		onLoad(option) {

			uni.removeStorageSync('newList')
			uni.removeStorageSync('allNewList')

			this.relationOrder_id = option.relationOrder_id || ''
			if (option.complate) { //完工服务步骤条添加用料明细按钮进入
				this.complate = option.complate
				this.cpbh = option.cpbh
			}
			this.getPartsList() //获取可选产品列表
		},
		onUnload() {
			// uni.removeStorageSync('newList')
		},
		onPullDownRefresh() {

		},
		//下滑加载更多
		onReachBottom() {
			let totalCount = this.totalCount //总数据条数
			let pageSize = this.formParts.pageSize //每页显示条数
			let loadIsNum = Math.ceil(totalCount / pageSize) //向上取整
			let pageNo = this.formParts.pageNo //页码
			setTimeout(() => {
				if (pageNo < loadIsNum) {
					this.status = 'loading'; //加载中
					this.formParts.pageNo = ++this.formParts.pageNo;
					this.getPartsList()
				} else {
					this.status = 'nomore'; //没有更多数据
				}
			}, 1000)
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
