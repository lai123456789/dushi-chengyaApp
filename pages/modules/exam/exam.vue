<template>
	<view>
		<u-navbar back-text="返回" title="考试" :custom-back="customBack"></u-navbar>
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<u-gap></u-gap>
		<view class="u-m-b-20" v-for="(item, index) in dataList" :key="index">
			<u-card @click="goDetaile(item)" :show-head="false" border-radius="0" margin="0">
				<view slot="body">
					<view class="u-padding-top-20 u-padding-bottom-20 u-font-16 font-weight: bold;">{{ item.title }}</view>
					<view class="u-light-color u-font-14">考试时间：{{ item.starttime }} ~ {{ item.endtime }}</view>
				</view>
			</u-card>
		</view>
		<u-loadmore :status="status.nomore" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 20,
				list: [{
					name: '进行中',
					state: 'during',
					value: 1
				}, {
					name: '未开始',
					state: 'notstarted',
					value: 0
				}, {
					name: '已结束',
					state: 'over',
					value: 2
				}],
				current: 0,
				dataList: [],
				status: {
					loadmore: 'loadmore',
					loading: 'loading ',
					nomore: 'nomore'
				}
			}
		},
		methods: {
			getDataList(data) {
				this.$u.post('exam/Achievement/myExam', {
					title: '',
					type: '',
					starttime: [],
					endtime: [],
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					status: this.list[this.current].value
				}, true).then(res => {
					res.result.data.map(item => {
						this.dataList.push(item)
					})

				})
			},
			change(value) {
				this.current = value
				this.pageNo = 1
				this.dataList = []
				let data = {}
				data.type = this.list[value].name
				this.getDataList(data)
			},
			goDetaile(data) {
				// uni.redirectTo({
				// 	url: `./examChild/examination?id=${data.id}&state=${this.list[this.current].state}`
				// })
				uni.navigateTo({
					url: `./examChild/examination?id=${data.id}&state=${this.list[this.current].state}`
				})
			},
			customBack() {
				uni.switchTab({
					url: '../../index/index'
				})
			},
			onReachBottom() {
				this.pageNo++
				this.getDataList()
			}
		},
		onLoad() {
			this.getDataList({
				type: '进行中'
			})
		}
	}
</script>
