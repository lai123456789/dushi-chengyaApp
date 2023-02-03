<template>
	<view>
		<view>
			<view class="u-flex u-p-32" style="background-color: #FFF;">
				<view class="u-margin-30">
					<u-image width="150rpx" height="150rpx" :src="datas.cptp[0]" mode=""></u-image>
				</view>
				<view class="col_right_text u-col-center u-p-l-80">
					<view class="u-main-color">{{datas.cpmc}}</view>
					<view class="u-tips-color">{{datas.cpxh}}</view>
				</view>
			</view>
			<view class="issueList u-p-l-32 u-p-r-32">
				<u-collapse :item-style="customStyle">
					<u-collapse-item :open="false" v-for="(item,index) in dataList" :key="index">
						<view slot="title" class="u-p-16">
							<view class="title">{{item.catname}}</view>
						</view>
						<view class="u-m-l-20 u-m-r-20 u-m-t-10 u-m-b-20">
							<view>
								<view class="my_card u-m-b-16" @click="gorichtext(subItem)"
									v-for="(subItem,subIndex) in item.list" :key="subIndex">
									<view class="title">{{subItem.title}}</view>
									<view class="date">{{subItem.effect_start_time}}</view>
									<view class="details">{{subItem.content}}</view>
								</view>
							</view>
						</view>
					</u-collapse-item>
					<u-gap></u-gap>
				</u-collapse>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				datas: {},
				dataList: [],
				customStyle: {
					'background': '#FFF',
					'padding': '20rpx',
					'marginBottom': '20rpx'
				}
			};
		},
		methods: {
			gorichtext(item) { //统一跳转到详情页面 富文本
				let id = item.id
				uni.navigateTo({
					url: `./more/theRichText?id=${id}`
				})
			},
			getProductDetails(e) {
				// uni.request({
				// 	url: '/test/Operation/searchodd',
				// 	method: 'GET',
				// 	success: (res) => {
				// 		this.datas = res.data.result.data
				// 		console.log(this.datas)
				// 	}
				// })
				console.log("内容是", e);
				let param = {
					rolename: "客户", //角色名【'客户','师傅','客服'】，目前就这三个角，这里只传 '客户'
					// cppl: e.cppl, //品类 原来的_cppl_
					// cplb: "",
					// cplx: "",
					chanpin_fl: e.chanpin_fl,
					cpxh: e.cpxh //型号
				}
				let url = '/app/Knowledge/getCpczzy'
				this.$u.post(url, param).then(res => {
					this.dataList = res.result
				})
			}
		},
		onLoad(option) {
			console.log(option);
			if (option.selectMyproduct) {
				let jsonSelectMyproduct = JSON.parse(option.selectMyproduct)
				let param = {
					cpxh: jsonSelectMyproduct.cpxh
				}
				//拿到上一页面的 产品型号 传到查询产品列表接口 返回对应产品信息
				this.$u.post('/app/Goods/getcpinfo', param).then(res => {
					this.datas = res.result
				})
				console.log('this.datas', this.datas);
				console.log('jsonSelectMyproduct', jsonSelectMyproduct);
				this.getProductDetails(jsonSelectMyproduct)
				return
			}

			//点击输入产品型号搜索进来的
			// let pjProduct = uni.getStorageSync('pjProduct')
			// if (pjProduct) {
			// 	this.datas = pjProduct
			// 	this.getProductDetails(pjProduct)
			// 	uni.removeStorageSync('pjProduct')
			// }
		}
	}
</script>

<style lang="scss" scoped>
	// @import '../index.scss';

	.issueList {
		margin-top: 40rpx;

		.u-collapse {
			/deep/.u-collapse-head {
				background-color: #FFF !important;

			}

			.body_content {
				background-color: #f3f4f6;

				.body_content_son {
					padding: 16rpx 32rpx;
				}
			}
		}

	}

	.my_card {
		background-color: #d3eff0;
		padding: 16rpx 32rpx;

		view {
			margin: 8rpx 0;
		}

		.title {
			font-weight: bold;
			color: #000;
		}

		.date {
			font-size: 10px;
		}
	}
</style>
