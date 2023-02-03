<template>
	<view>
		<u-top-tips ref="uTips"></u-top-tips>
		<uni-segmented-control  :list="list" @getCurrentTime="getCurrentTime" />
	</view>
</template>

<script>
	import uniSegmentedControl from "../components/uni-segmented-control/calendar.vue"
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				list:[
					// {start:'02',end:'17',desc:'长宁页岩气作业区-机组年保','color':'#000000'},
					// {start:'01',end:'05',desc:'长宁页岩气作业区-机组年保','color':'blue'},
					// {start:'01',end:'24',desc:'长宁页岩气作业区-机组年保','color':'red'}
				] 
			}
		},
		onReady() {
			this.$refs.uTips.show({
				title: '手指滑动左右翻页可查看上一月或下一月日程数据',
				type: 'primary',
				duration: '2300'
			})		
		},
		onLoad() {
			// this.getMyData()
		},
		methods: {
			getCurrentTime(e){
				console.log('当前日期',e)
				this.getMyData(e)
			},
			getMyData(e){
				let userInfo = uni.getStorageSync('myInfo')
				let param = { rq: e, sfxm: userInfo.xm } //userInfo.xm || 
				this.$u.post('/crm/Api/xcxMyCalendar',param).then(res => {
					if(res.result && res.result.data && res.result.data.length > 0){
						let tYear = e.split('-')[0]
						let tMonth = e.split('-')[1]
						let d = new Date(tYear, tMonth, 0)
						let days = d.getDate() //当前月有多少天
						res.result.data.forEach((item,index) => {
							let startA = new Date(item.start).getTime()
							let endA = new Date(item.end).getTime()
							//相差天数
							let absDay = parseInt(Math.abs(endA  -  startA)  /  1000  /  60  /  60  /24) + 1
							let itemStart = item.start.split('-')[1] //每个日期的开始时间
							if(absDay > days && itemStart == tMonth){
								item.end = '0000' + '-' + '00' + '-' + days
							}
						})
						this.list = res.result.data.map((item,index) => {
							let obj = {
								start: item.start.split('-')[2],
								end: item.end.split('-')[2],
								desc: item.title,
								color: item.className === 'grayColor' ? '#BFBFBF' : item.className === 'greenColor' ? '#a0c468' : '#d3818a'
							}
							return obj
						})
					}else{
						this.list = []
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.article_blue {
		background-color: #e6f7ff;
		border-left: 4rpx solid #1890ff;
		color: #1890ff
	}

	.article_red {
		background-color: #fff1f0;
		border-left: 4rpx solid #f5222d;
		color: #f5222d
	}

	.article_gray {
		background-color: #F5F5F5;
		border-left: 4rpx solid #C8C8C8;
		color: #C8C8C8
	}
</style>
