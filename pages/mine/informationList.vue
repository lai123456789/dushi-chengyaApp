<template>
	<view>
		<u-sticky>
			<!--吸顶 只能有一个根元素 -->
			<view style="background: #F3F4F6;">
				<u-tabs :list="list" :is-scroll="false" :current="current" @change="onChange"></u-tabs>
			</view>
		</u-sticky>
		<u-gap height="20"></u-gap>
		<u-swipe-action :show="item.show" :index="index" v-for="(item,index) in dataList" :key="item.id"
			@click="onClick" @open="open" :options="options">
			<view class="cell" @click="goDetail(item, index)">
				<view class="u-m-l-10">
					<view class="cell_item u-main-color u-flex">
						<u-icon size="30" name="bell" class="u-m-r-20"></u-icon>
						<text>{{item.title}}</text>
					</view>
					<view class="cell_item u-tips-color u-line-1 u-flex">
						<u-icon size="30" name="clock" class="u-m-r-20"></u-icon>
						<text>{{item.input_time}}</text>
					</view>
				</view>
				<view class="dot" v-if="item.isread == 0"></view>
			</view>
		</u-swipe-action>
		<u-loadmore class="u-p-20" :status="status" v-if="dataList.length !== 0" />
		<u-empty class="u-p-80" text="数据为空" mode="list" v-else></u-empty>
		<u-gap height="60"></u-gap>
		<view class="u-p-20 u-flex u-row-between footer" v-if="current === 0" @click="readAll">全部已读</view>
		<u-toast ref="uToast" />
		<u-modal v-model="modal.show" :content="modal.text" :cancel-text="modal.cancel" show-cancel-button
			:confirm-text="modal.confirm" @confirm="onConfirm"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messageType: 'notice',
				list: [{
					name: '未读'
				}, {
					name: '已读'
				}],
				current: 0,
				params: {
					type: 'notice',
					isread: 0,
					pageNo: 1,
				},
				status: 'loadmore',
				dataList: [{
					title: '安装单：测试消息提醒的消息',
					desc: '2020-02-09 16:00:09',
					time: '10-08',
					count: 8,
					show: false
				}, {
					title: 'SLA预警',
					desc: '2020-02-30 21:00:09',
					time: '10-12',
					count: 15,
					show: false
				}],
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [{
						text: '已读',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				modal: {
					show: false,
					text: '请确认是否删除该条消息记录？',
					confirm: '确认',
					cancel: '取消',
				}
			}
		},
		onLoad(options) {
			this.messageType = options.type
			this.params = {
				type: options.type,
				isread: 0,
				page: 1
			}
			this.getList('refresh')
		},
		methods: {
			getList(type) {
				uni.showLoading({
					title: '加载中'
				})
				this.$u.post('/app/User/messageList', this.params).then(res => {
					console.log('res', res)
					if (type === 'refresh') {
						this.dataList = res.result
					} else {
						this.dataList = [...this.dataList, ...res.result]
					}
					if (res.result.length < 20) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore'
					}
					this.dataList.forEach(item => {
						item.isread = this.current
						item.show = false
					})
					uni.hideLoading();
					console.log('this.dataLis', this.dataList)
				})
			},
			onChange(index) {
				this.current = index
				console.log('current', this.current)
				this.params.isread = this.current
				this.params.page = 1
				const options = [{
						text: '已读',
						style: {
							backgroundColor: '#007aff'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
				this.options = this.current === 0 ? options : [options[1]]
				this.getList('refresh')
			},
			onClick(index, index1) {
				const item = this.dataList[index]
				if (index1 === 1 || (this.current === 1 && index1 === 0)) {
					this.$u.post(`/app/User/delRemind`, {
						id: [item.id]
					}).then(res => {
						this.dataList.splice(index, 1)
					})
				} else {
					if (this.current === 0) {
						item.show = false
						item.isread = 1
						const id = item.id
						this.$u.post(`/app/User/getMeassage?id=${id}`)
						this.dataList.splice(index, 1, item)
					}
				}
			},
			open(index) {
				this.dataList[index].show = true
				this.dataList.forEach((val, idx) => {
					if (index !== idx) this.dataList[idx].show = false
				})
				this.dataList = JSON.parse(JSON.stringify(this.dataList))
			},
			// 全部已读
			readAll() {
				this.$u.post(`/app/User/setRead?type=${this.messageType}`).then(res => {
					this.$refs.uToast.show({
						type: 'success',
						title: '操作成功'
					})
				})
			},
			// 模态框确认
			onConfirm() {
				this.modal.action()
			},
			// 查看小夏详情
			goDetail(item, index) {
				if (this.current === 0) {
					item.isread = 1
					this.dataList.splice(index, 1, item)
				}
				uni.navigateTo({
					url: `./seeMessage?id=${item.id}`
				})
			},
		},
		//下滑加载更多
		async onReachBottom() {
			if (this.status !== 'nomore') {
				this.params.page++
				this.status = 'loading'
				this.getList()
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.params.page = 1
			this.getList('refresh')
			setTimeout(() => {
				uni.stopPullDownRefresh()
			},1500)
		}
	}
</script>

<style lang="scss" scoped>
	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #EEE;
	}
	
	.cell {
		width: 100vw;
		padding: 16rpx 60rpx 16rpx;
		box-sizing: border-box;
		position: relative;
		border-bottom: 1rpx solid #ccc;
	}
	.cell_item {
		margin: 16rpx 0;
	}

	.dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background: red;
		position: absolute;
		right: 40rpx;
		top: 50%;
		transform: translate(0, -50%);
	}
</style>
