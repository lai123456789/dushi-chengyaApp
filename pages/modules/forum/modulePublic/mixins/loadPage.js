export default {

	data() {
		return {
			initial: {
				createdIsNeed: false, // 此页面是否在创建时，调用查询数据列表接口？
				apiName: '', // API名称
				getDataListIsPage: false, // 是否分页
			},
			loadingStatus: 'loadmore', //loadmore:上滑加载更多  loading:加载中 nomore:我是有底线的 noData 显示empty组件暂无数据
			timer: {
				pull: null,
				reachBottom: null,
			},
			iconType: 'circle',
			dataForm: {}, // 请求参数
			dataList: [], // 请求到的数据
			listName: 'result', // 请求的数据列表名称
			page: 1, // 页码
			pageSize: 10,
			totalSize: '' // 总条数
		}
	},
	created() {
		if (this.initial.createdIsNeed) {
			this.getDataList()
		}
	},
	onPullDownRefresh() {
		this.dataList = []
		this.loadingStatus = 'loading'
		this.timer.pull = setTimeout(() => {
			this.getDataList()
			//新增
			uni.stopPullDownRefresh()
			this.$refs.uToast.show({
				title: '刷新成功',
				type: 'success'
			})
		}, 1000)
	},

	onReachBottom() {
		this.loadmore()
	},
	activated() {},
	methods: {
		loadmore() {
			if (this.totalSize === this.dataList.length) {
				this.dataList.length ? this.loadingStatus = "nomore" : this.loadingStatus = "noData"
			} else {
				this.loadingStatus = "loading"
				let hideLoading = true
				this.timer.reachBottom = setTimeout(() => {
					this.page++
					this.getData(null, hideLoading)
				}, 1000)
			}
		},
		coverItem(item) { //转化每个列表项的数据内容 必须返回一个对象
			return item
		},
		clearTimer() {
			for (let key in this.timer) {
				clearTimeout(this.timer[key])
				this.timer[key] = null
			}
		},
		getDataList(callback) {
			this.page = 1
			this.loadingStatus = "loadmore"
			this.getData(callback)
		},

		// 获取数据
		getData(callback, hideLoading) {
			if (hideLoading) {
				this.loadingStatus = "loading"
			}
			let args = {
				pageNo: this.initial.getDataListIsPage ? this.page : null,
				pageSize: this.initial.getDataListIsPage ? this.pageSize : null,
				...this.dataForm
			}
			this.$u.post(this.initial.apiName, args).then(res => {
				let list = res[this.listName].data.map(this.coverItem)
				if (this.initial.getDataListIsPage == true && this.page !== 1) {
					this.dataList = this.dataList.concat(list)
				} else {
					this.dataList = list
				}
				this.totalSize = res.result.totalCount
			}).finally(() => {
				if (this.dataList.length) {
					this.dataList.length == this.totalSize ? this.loadingStatus = "nomore" : this
						.loadingStatus = 'loadmore'
				} else {
					this.loadingStatus = "noData"
				}
			})
		}
	},
	onHide() {
		this.clearTimer()
	},
	onUnload() {
		this.clearTimer()
	},
	destroyed() {
		this.clearTimer()
	}
}
