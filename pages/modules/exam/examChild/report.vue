<template>
	<view>
		<view>
			<u-navbar back-text="返回" title="考试结果" :background="background" :back-text-style="backstyle" back-icon-color="#FFF"
			 title-color="#FFF" :custom-back="customBack">
			</u-navbar>
			<view class="content">
				<!-- 正文内容 -->
			</view>
		</view>
		<u-card :show-head="false">
			<view class="u-m-t-50" slot="body">
				<view class="" style="color: #259beb" v-if="reportData.grade_pass == '1'">
					<view class="u-text-center u-m-b-40" style="font-size: 60rpx;">恭喜您通过了考试</view>
					<view style="font-size: 100rpx; font-weight: bold; " class="u-m-b-30 u-text-center">
						{{reportData.grade}}
					</view>
				</view>
				<view v-else-if="reportData.grade_pass == '0'" style="color: #9c9c9c">
					<view class="u-text-center  u-m-b-40" style="font-size: 60rpx;">很遗憾您没有通过考试</view>
					<view style="font-size: 100rpx; font-weight: bold; " class="u-m-b-30 u-text-center">
						{{reportData.grade}}
					</view>
				</view>
				<view class="u-text-center">
					<view class="u-m-b-30 u-flex u-row-center">
						<view class="u-text-left">考生姓名：</view>
						<u-tag :text="reportData.username" type="primary" />
					</view>
					<view class="u-flex u-row-center" style="margin-bottom: 200rpx; margin-left: -50rpx;">
						<view class="u-text-left">试卷名称：</view>
						<view class="">{{ reportData.title }}</view>
					</view>
				</view>

				<view class="u-text-center" style="color: #909399;">
					注：填空题与问答题分数由人工阅卷最终确定
				</view>
			</view>
		</u-card>
		<view style="position: fixed;bottom: 1px; width: 100%;">
			<u-card margin="0" padding="0" border-radius="0" :show-head="false">
				<view slot="body" class="u-p-16">
					<u-button v-if="reportData.typeVisible != 'score'" type="primary" @click="goToview">查看答案</u-button>
				</view>
			</u-card>

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				reportData: {},
				background: {
					backgroundColor: '#1890ff',
				},
				backstyle: {
					color: '#FFF',
				},
				gradeid: '',
				grade_pass: ''
			}
		},
		methods: {
			getResults() {
				this.$u.get('exam/Achievement/checkGrade', {
					gradeid: this.gradeid
				}, true).then(res => {
					this.reportData = res.result.data
				})
			},
			goToview() {
				uni.navigateTo({
					url: './examDetails?disabled=examine&gradeid=' + this.gradeid
				})
			},
			customBack() {
				// uni.navigateTo({
				// 	url: '../exam'
				// })
				uni.navigateBack({
					delta: 1
				});
			}
		},
		onLoad(options) {
			this.gradeid = options.gradeid
			this.getResults()
		}
	}
</script>

<style>

</style>
