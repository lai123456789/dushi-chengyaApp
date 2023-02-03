<template>
	<view class="inquireCheck">
		<!-- <list-component page="check" /> -->
		<view class="u-m-16">
			<u-search class="u-flex-1" placeholder="请输入故障代码" shape="square" v-model="code"
				bg-color="#FFF" @search="onSearch" @custom="onSearch"></u-search>
			<view v-if="JSON.stringify(info) != '{}'"
			 class="u-flex u-row-center u-col-center u-type-warning-bg u-m-t-16 u-m-b-16 u-p-8" style="color: white;">搜索结果</view>
			<view class="u-m-t-16 ">
				<u-row gutter="10" class="u-m-b-16">
					<u-col span="6">
						<view class="u-m-b-16 u-flex u-row-between u-col-center u-p-12" style="background: white;">
							<text class="u-line-1 u-flex-1">大类</text>
							<text class="u-line-1 u-flex-1 u-text-right u-content-color">{{ info.dl }}</text>
						</view>
					</u-col>
					<u-col span="6">
						<view class="u-m-b-16 u-flex u-row-between u-col-center u-p-12" style="background: white;">
							<text class="u-line-1 u-flex-1">小类</text>
							<text class="u-line-1 u-flex-1 u-text-right u-content-color">{{ info.xl }}</text>
						</view>
					</u-col>
					<u-col span="12">
						<view class="u-m-b-16 u-flex u-row-between u-col-center u-p-12" style="background: white;">
							<text class="u-line-1 u-flex-1">适用阶段</text>
							<text class="u-line-1 u-flex-1 u-text-right u-content-color">{{ info.syjd }}</text>
						</view>
					</u-col>
				</u-row>
			 </view>
			<view class="u-p-12 u-m-b-16" style="background: white; min-height: 200rpx; max-height: 200rpx; overflow-y: scroll;">
				<view>小类解释</view>
				<view class="u-content-color">{{ info.xljs }}</view>
			</view>
			<view class="u-p-12 u-m-b-16" style="background: white; min-height: 200rpx; max-height: 200rpx; overflow-y: scroll;">
				<view>处理方法</view>
				<view class="u-content-color">{{ info.clff }}</view>
			</view>
			<view class="u-p-12 u-m-b-16" style="background: white; min-height: 200rpx; max-height: 200rpx; overflow-y: scroll;">
				<view>处理方法解释</view>
				<view class="u-content-color">{{ info.clffjs }}</view>
			</view>
			<view class="u-p-12 u-m-b-16" style="background: white; min-height: 200rpx; max-height: 200rpx; overflow-y: scroll;">
				<view>更换的材料</view>
				<view class="u-content-color">{{ info.ghdcl }}</view>
			</view>
		</view>	
	</view>
</template>

<script>
	// import listComponent from './listComponent'
	export default {
		// components: {
		// 	listComponent
		// }
		data() {
			return {
				code: '',
				info:{}
			}
		},
		onLoad() {
		},
		methods:{
			onSearch(){
				console.log("123", JSON.stringify(this.info))
				let param = { "dh": this.code }
				this.$u.post('/crm/Api/xcxGetgzdmk',param).then(res => {
					this.info = res.data
				})
			}
		}
	}
</script>

<style>
	.inquireCheck {
		/* min-height: 100vh; */
	}
</style>
