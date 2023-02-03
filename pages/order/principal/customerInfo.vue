<template>
	<view>
		<view class="u-p-10">
			<u-search placeholder="请输入客户完整电话" bg-color="#fff" v-model="keyword" @search="search" @custom="search">
			</u-search>
			<u-toast ref="uToast" />
		</view>
		<u-card margin="0" v-for="(item,index) in result" :key="index" class="u-p-10">
			<view slot="head" class="u-flex u-row-between">
				<view>{{item.khmc}}</view>
				<u-button size="mini" type="primary" @click="determine(item)">选择</u-button>
			</view>
			<view slot="body">
				<view class="u-p-b-20">客户编号:<text style="color: #000000;">{{item.khbh}}</text> </view>
				<view class="u-p-b-20">客户电话:
					<text style="color: #000000;">{{item.khdh1}}</text>
					<text style="color: #000000;" v-if="item.khdh2">/{{item.khdh2}}</text>
					<text style="color: #000000;" v-if="item.khdh3">/{{item.khdh3}}</text>
				</view>
				<view class="u-p-b-20">用户地址:<text style="color: #000000;">{{item.ssq}}{{item.xxdz}}</text> </view>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				result: []
			}
		},
		methods: {
			search() {
				this.$u.post('/app/Customer/getKhinfo', {
					number: this.keyword
				}).then(res => {
					if (res.code == 0) {
						this.result = res.result
					} else {
						this.$refs.uToast.show({
							title: res.message,
							icon: false
						})
					}
				})
			},
			determine(value) {
				console.log(value)
				uni.setStorageSync('customerInfo', value)
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>

</style>
