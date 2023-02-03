<template>
	<view style="height: 100%;">
		<u-navbar back-text="返回" title="考试" :background="background" :back-text-style="backstyle" back-icon-color="#FFF"
		 title-color="#FFF" :custom-back="customBack">
		</u-navbar>
		<u-card :title="dataList.title" margin="0" border-radius="0">
			<view slot="body" class="u-padding-20">
				<view class="u-m-b-20">
					<u-icon name="hourglass"></u-icon><text class="u-m-l-20">考试时间限时：{{ dataList.time }}分钟</text>
				</view>
				<view>
					<u-icon name="info-circle"></u-icon><text class="u-m-l-20">考试次数：{{ dataList.exam_num }} (已考{{ dataList.myexam_num }}次)</text>
				</view>
			</view>
		</u-card>
		<u-gap bg-color="#f3f4f6"></u-gap>
		<u-card title="考试说明" margin="0" border-radius="0" :show-foot="false" style="height: 60%;">
			<view slot="body" class="u-padding-20">
				{{ dataList.remarks }}
			</view>
		</u-card>
		<view style="position: fixed;bottom: 0px;width: 100%;">
			<u-card margin="0" padding="0" border-radius="0" :show-head="false">
				<view slot="body" class="u-flex u-p-16" v-if="status == 'during'">
					<u-button style="width: 100%;" v-if="dataList.myexam_num == 0" @click="goIn">进入考试</u-button>
					<u-button style="width: 100%;" class="u-m-r-10" v-else-if="dataList.myexam_num > 0 && dataList.myexam_num < dataList.exam_num"
					 @click="goIn">重新考试</u-button>
					<u-button style="width: 100%;" v-if="dataList.myexam_num > 0" type="primary" @click="goExaminationList">查看结果</u-button>
				</view>
				<view slot="body" class="u-flex u-p-16" v-else-if="status == 'notstarted'">
					<u-button class="u-m-0" style="width: 100%;" :disabled="true">考试将于{{ dataList.starttime }}开始</u-button>
				</view>
				<view slot="body" class="u-flex u-p-16" v-else-if="status == 'over'">
					<u-button v-if="dataList.myexam_num >= 1" class="u-flex-1" type="primary" @click="goExaminationList">查看结果</u-button>
					<u-button v-else class="u-flex-1" :disabled="true">考试已结束，但你并未参加考试</u-button>
				</view>
			</u-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: {},
				background: {
					backgroundColor: '#1890ff',
				},
				backstyle: {
					color: '#FFF',
				},
				key: '',
				status: '',
				paperid: '', // 考试管理id
				starttime: 0, //开始时间
				endtime: 0, //结束时间
				currenttime: 0, //当前时间
				duration: 0, //时长
				timeremaining: 0 //剩余时间
			}
		},
		methods: {
			getExamination(value) {
				this.$u.get('exam/Achievement/examDetail', {
					paperid: value
				}, true).then(res => {
					this.paperid = res.result.data.id
					this.dataList = res.result.data
					this.starttime = new Date(res.result.data.starttime).getTime()
					this.endtime = new Date(res.result.data.endtime).getTime()
					this.duration = res.result.data.time * 60
				})
			},
			goIn() {
				let interval = 0
				this.currenttime = new Date().getTime()
				this.timeremaining = Math.ceil((this.endtime - this.currenttime) / 1000)
				if (this.timeremaining < this.duration) {
					interval = this.timeremaining
				} else {
					interval = this.duration
				}
				uni.redirectTo({
					url: `./examDetails?paperid=${this.paperid}&examid=${this.dataList.examid}&interval=${interval}`
				})
			},
			goExaminationList() {
				uni.navigateTo({ //redirectTo
					url: `./examinationList?paperid=${this.paperid}`
				})
			},
			customBack() {
				uni.navigateTo({
					url: '../exam'
				})
			}
		},
		onLoad(v) {
			this.key = v.id
			this.status = v.state
			this.getExamination(v.id)
		}
	}
</script>

<style>

</style>
