<template>
	<view>
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view class="u-padding-20">
			<u-search placeholder="请输入产品名称/型号/出厂编码" style="width: 100%;" bg-color="#fff" v-model="param.keyword" @search="onsearch"
			 @custom="onsearch"></u-search>
			<u-toast ref="uToast" />
		</view>
		<view v-show="current==0">
			<view>
				<view class="productlist" v-for="(item,index) in myProductList" :key="index" @click="goBack(item)">
					<view class="productlist_left">
						<u-image width="150rpx" height="150rpx" :src="item.cptp[0]" mode=""></u-image>
					</view>
					<view class="prodictlist_right">
						<view class="u-font-15">{{item.cpmc}}</view>
						<view>
							<view class="u-tips-color u-font-13">产品型号：{{item.cpxh}}</view>
							<view class="u-tips-color u-font-13">出厂编码：{{item.snm}}</view>
							<view class="u-tips-color u-font-13">购买日期：{{item.gmrq}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-show="current==1">
			<view>
				<view class="productlist" v-for="(item,index) in allProductList" :key="index" @click="goBack(item)">
					<view class="productlist_left">
						<u-image width="150rpx" height="150rpx" :src="item.cptp[0]" mode=""></u-image>
					</view>
					<view class="prodictlist_right">
						<view class="u-font-15">{{item.cpmc}}</view>
						<view>
							<view class="u-tips-color u-font-13">产品品类：{{item.chanpin_fl}}</view>
							<view class="u-tips-color u-font-13">产品型号：{{item.cpxh}}</view>
						</view>
					</view>
				</view>
				<u-empty v-if="showNoData"></u-empty>
			</view>
		</view>

	</view>
</template>
<script>
	export default {
		data() {
			return {
				showNoData: false,
				current: 0,
				list: [{
					name: '客户已有产品',
					value: "myProduct"
				}, {
					name: '所有产品',
					value: 'allProduct'
				}],
				myProductList: [],
				allProductList: [],
				param: {
					khbh: '',
					keyword: ''
				}
			};
		},
		methods: {
			goBack(item) {
				// 该页面共用了,创建服务单页面点击选择产品跳转进来/完工服务页选择产品进来
				uni.setStorageSync('productInfo', item) //返回建单页需要用到
				this.$store.commit('setproduct', item)
				uni.setStorageSync('product', item) //返回完工服务页需要用到
				uni.navigateBack({
					delta: 1
				})
			},
			change(item) {
				this.current = item
				this.param.keyword = ''
				this.onsearch()



			},
			getProductList() {
				this.$u.post('app/Customer/getKhcps', this.param).then(res => {
					this.myProductList = res.result
					if (res.code == 1) {
						this.$refs.uToast.show({
							title: '当前客户没有产品，请查询所有产品',
							icon: false
						})
					}
				})
			},
			getAllProduc() {
				let t = this
				this.$u.post('app/Goods/getCplist', {
					keyword: this.param.keyword
				}).then(res => {
					if (res.code == 1) {
						this.allProductList = []
						t.showNoData = true
						return
					}
					this.allProductList = res.result
				})
			},

			onsearch() {
				if (this.current == 0) {
					this.getProductList(this.param)
				} else {
					this.getAllProduc()
				}
			}
		},
		onLoad(option) {
			this.param.khbh = option.khbh
			this.getProductList()
		}
	}
</script>

<style lang="scss" scoped>
	.productlist {
		display: flex;
		background-color: #fff;
		margin: 8rpx 0;
		padding: 16rpx 32rpx;
		align-items: center;

		.productlist_left {
			margin-right: 30rpx;

			image {
				width: 150rpx;
				height: 150rpx;
			}
		}

		.prodictlist_right {
			display: flex;
			flex-direction: column;
			justify-content: center;

			view {
				margin: 6rpx;
			}
		}

	}
</style>
