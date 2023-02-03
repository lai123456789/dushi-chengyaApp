<template>
	<view>
		<u-card title="考生试卷" margin="0" border-radius="0">
			<view slot="body" class="">
				<view v-if="dataList.length>0" class="u-p-b-20 u-m-b-20 u-font-16 u-border-bottom" v-for="(item,index) in dataList"
				 :key="index" @click="goreport(item)">
					<view class="u-m-b-20">
						{{ item.title }}
					</view>
					<view>
						<text>完成时间：{{ item.finishtime }}</text>
					</view>
				</view>
				<u-empty v-if="dataList.length == 0" text="暂无数据" mode="list"></u-empty>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataList: [],
				paperid: '', //考试管理id
				username: '',
				id: '', //考生试卷id
			}
		},
		methods: {
			getDataList() {
				this.$u.get('exam/Achievement/userGrades', {
					paperid: this.paperid
				}, true).then(res => {
					console.log(res)
					this.dataList = res.result.data
				})
			},
			goreport(value) {
				this.id = value.id
				// uni.redirectTo({
				// 	url: './report?gradeid=' + this.id
				// })
				uni.navigateTo({
					url: './report?gradeid=' + this.id
				})
			}
		},
		onLoad(options) {
			this.paperid = options.paperid
			this.getDataList()
		}
	}
</script>

<style>

</style>
