<template>
	<view class="page">
		<u-navbar :is-back="false" :border-bottom="false" :background="background" title="首页"
			title-color="#FFF"></u-navbar> <!-- title-size="24" -->
		<view style="background: linear-gradient(to right, #2979FC , #19B7FF); height: 250rpx; border-bottom-left-radius: 45rpx;
		 border-bottom-right-radius: 45rpx;"></view>
		<view style="margin-top: -230rpx; padding: 0 30rpx;">
			<u-swiper :list="configList" :height="320" :border-radius="10" mode="dot"></u-swiper>
		</view>
		<!-- 业务统计数据 -->
		<u-card :show-head="false" :border-radius="16" margin="15rpx 30rpx" :body-style="{padding: '30rpx 0'}"
			v-if="ywtjsj.length > 0">
			<u-grid slot="body" :col="5" :border="false">
				<u-grid-item
					:custom-style="{padding: '0', 'border-right': (index1 !== ywtjsj.length -1) ? '1rpx solid #EEE':'', 'text-align': 'center'}"
					v-for="(item, index1) in ywtjsj" :key="index1" @click="goPageA(item)">
					<view>
						<text :style="{'color':item.color, 'font-weight': '600'}">{{item.count}}</text>
						<view class="u-m-t-8"  >{{ item.name }}</view>
					</view>
				</u-grid-item>
			</u-grid>
		</u-card>

		<view class="u-flex u-m-l-32 u-m-t-32">
			<view class="u-m-r-16">办公区</view>
			<text class="iconfont xiangxiajiantou" style="width: 23rpx; height: 12rpx;"></text>
		</view>
		<u-card :show-head="false" :border-radius="16" margin="15rpx 30rpx" :body-style="{padding: '30rpx 0 0 0'}"
			v-if="bgq.length > 0">
			<u-grid slot="body" :col="4" :border="false">
				<u-grid-item v-for="item in bgq" :key="item.id" @click="goPage(item)"
					:custom-style="{padding: '0', 'margin-bottom': '30rpx'}">
					<u-badge :count="item.count" v-if="item.count" :offset="[0, 20]"></u-badge>
					<text class="iconfont" :class="item.icon"></text>
					<view class="u-m-t-8"  >{{ item.name }}</view>
				</u-grid-item>
				<u-grid-item :custom-style="{padding: '0', 'margin-bottom': '30rpx'}" @click="goPageHk">
					<u-icon name="server-man" size="54" style="color: #1B9AFF;"></u-icon>
					<view class="u-m-t-8"  >质量回馈</view>
				</u-grid-item>
			</u-grid>
		</u-card>

		<view class="u-flex u-m-l-32 u-m-t-32">
			<view class="u-m-r-16">知识区</view>
			<text class="iconfont xiangxiajiantou" style="width: 23rpx; height: 12rpx;"></text>
		</view>
		<u-card :show-head="false" :border-radius="16" margin="15rpx 30rpx" :body-style="{padding: '30rpx 0 0 0'}">
			<u-grid :col="4" :border="false" slot="body">
				<u-grid-item v-for="(item, index) in productList" :key="index" @click="goProduct(item)"
					:custom-style="{padding: '0', 'margin-bottom': '30rpx'}">
					<text class="iconfont" :class="item.icon"></text>
					<view class="u-m-t-8"  >{{item.name}}</view>
				</u-grid-item>
			</u-grid>
		</u-card>
		<u-toast ref="uToast" />
		<app-update ref="appUpdate" :force="true" :tabbar="true"></app-update>
	</view>
</template>
<script>
	import count from './count.js'
	import appUpdate from '../../components/AppUpdate/AppUpdate.vue'
	export default {
		components: {
			appUpdate
		},
		data() {
			return {
				background: {
					background: 'linear-gradient(to right, #2979FC , #19B7FF)' //'linear-gradient(59deg, #2979FC 0%, #19B7FF 100%)'
				},
				token: '',
				configList: [],
				// 知识库
				productList: [{
						icon: 'chanpinbaike1',
						name: '产品百科',
						en: 'cp',
						url: './knowledgeBase'
					}, {
						icon: 'anzhuangzhiyin',
						name: '安装指引',
						en: 'az',
						url: './knowledgeBase'
					}, {
						icon: 'caozuozhiyin1',
						name: '作业指导书',
						en: 'cz',
						url: '/pages/modules/reportingGuidelines/guideBook'
					}, {
						icon: 'chanpinbaike1',
						name: '操作指引',
						en: 'cz',
						url: '/pages/modules/reportingGuidelines/operational'
					}, {
						icon: 'guzhangdaima',
						name: '故障代码',
						url: '/pages/modules/inquire/inquireCheck'
					}, {
						icon: 'fuwuzhengce1',
						name: '服务政策',
						url: './knowledgeBase'
					},
					// {
					// 	icon: 'guzhangzijian',
					// 	name: '故障自查',
					// 	url: '/pages/modules/inquire/inquireCheck'
					// },
					// {
					// 	icon: 'shoufeibiaozhun',
					// 	name: '收费标准',
					// 	url: '/pages/modules/inquire/inquireFee'
					// }, {
					// 	icon: 'zaixiankaoshi1',
					// 	name: '在线考试',
					// 	url: '/pages/modules/exam/exam'
					// }
				],
				orderData: [],
				// 业务统计数据
				ywtjsj: [],
				//办公区
				bgq: [{
					id: 0,
					name: '待处理',
					state: 'dcl',
					icon: 'daichuli1',
					type: 'switchTab'
				}, {
					id: 1,
					name: '待接收',
					state: 'djs',
					icon: 'daijieshou',
					type: 'switchTab'
				}, {
					id: 2,
					name: '已处理',
					state: 'ycl',
					icon: 'yichuli2',
					type: 'switchTab'
				}, {
					id: 3,
					name: '已取消',
					state: 'yqx',
					icon: 'yiquxiao1',
					type: 'switchTab'
				}, {
					id: 4,
					name: '全部业务',
					state: 'qbyw',
					icon: 'quanbuyewu',
					type: 'switchTab'
				}, {
					id: 5,
					name: '每日汇报',
					state: 'mrhb',
					icon: 'meiyuehuibao'
				}, {
					id: 6,
					name: '我的日程',
					state: 'wdrc',
					icon: 'woderili'
				}, {
					id: 7,
					name: '消息提醒',
					state: 'xxtx',
					icon: 'xiaoxitixing',
					type: 'xxzx'
				}, {
					id: 8,
					name: '签到打卡',
					state: 'qddk',
					icon: 'qiandaodaka'
				}],
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			const token = uni.getStorageSync('token')
			let userInfo = uni.getStorageSync('userInfo')
			this.token = token
			if (!userInfo) {
				// 获取用户个人信息
				this.$u.post('/app/User/getMyInfo').then(res => {
					userInfo = res.result.userinfo
					const myWdinfo = res.result.myWdinfo
					const myInfo = res.result.myInfo
					uni.setStorageSync('userInfo', userInfo)
					uni.setStorageSync('myWdinfo', myWdinfo)
					uni.setStorageSync('myInfo', myInfo)
				})
			}
			if (token) {
				this.getWorkCount()
			}
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1500)
		},
		onLoad() {
			// 获取相关配置
			this.$u.post('/app/Setting/getSetting').then(res => {
				res.result.bindingWechat = res.result.binding_wechat ? parseInt(res.result.binding_wechat) : 0
				this.config = Object.assign(this.config, res.result)
				this.configList = this.config.banner
				console.log('this.configList', this.configList)
			})
		},
		onReady() {
			// #ifdef APP-PLUS
			this.$refs.appUpdate.update()
			// #endif
		},
		async onShow() {
			const token = uni.getStorageSync('token')
			let userInfo = uni.getStorageSync('userInfo')
			this.token = token
			if (!userInfo) {
				// 获取用户个人信息
				await this.$u.post('/app/User/getMyInfo').then(res => {
					userInfo = res.result.userinfo
					const myWdinfo = res.result.myWdinfo
					const myInfo = res.result.myInfo
					uni.setStorageSync('userInfo', userInfo)
					uni.setStorageSync('myWdinfo', myWdinfo)
					uni.setStorageSync('myInfo', myInfo)
				})
			}
			if (token) {
				this.getWorkCount()
			}
		},
		methods: {
			// 工单数量
			getWorkCount() {
				this.$u.post('/app/WorkOrder/getIndexMenu').then(res => {
					if (res.code === 0) {
						this.bgq[0].count = res.result.dcl
						this.bgq[1].count = res.result.djs
						this.bgq[7].count = res.result.xxtx
						// 业务统计数据
						this.ywtjsj = []
						this.ywtjsj.push({
							type: 'switchTab',
							color: "#2979FC",
							count: res.result.dcl,
							icon: "daichulidingdan",
							isshow: true,
							name: "待处理",
							state: "dcl"
						}, {
							type: 'switchTab',
							color: "#1DBE6B",
							count: res.result.ycl,
							icon: "yichuli",
							isshow: true,
							name: "已处理",
							state: "ycl"
						}, {
							type: 'switchTab',
							color: "#C5A179",
							count: res.result.yqx,
							icon: "yiquxiao",
							isshow: true,
							name: "已取消",
							state: "yqx"
						}, {
							type: 'switchTab',
							color: "#FD9926",
							count: res.result.ywc,
							icon: "yiwancheng",
							isshow: true,
							name: "已完成",
							state: "ywc"
						}, {
							type: 'switchTab',
							color: "#FA3534",
							count: res.result.qbyw,
							icon: "huodaofukuan",
							isshow: true,
							name: "全部业务",
							state: "qbyw"
						})
					}
				})
			},
			goPageA(item) {
				const globalData = getApp().globalData
				const states = ['dcl', 'djs', 'ycl', 'yqx', 'qbyw']
				globalData.gdglIndex = states.indexOf(item.state)
				uni.switchTab({
					url: `./order`
				})
			},
			goPageHk() {
				uni.navigateTo({
					url: '/pages/order/pending/pending'
				});
			},
			// 页面跳转
			goPage(item) {
				//每日汇报
				if (item.state === 'mrhb') {
					uni.navigateTo({
						url: '/pages/modules/reportingGuidelines/reporting'
					})
				} else if (item.state === 'qddk') {
					uni.navigateTo({
						url: '/pages/modules/signInClock/signIn'
					})
				} else if (item.type === 'order') {
					uni.navigateTo({
						url: `/pages/order/pending/pending?state=${item.key}&title=${item.name}`
					})
				} else if (item.type === 'switchTab') {
					const globalData = getApp().globalData
					const states = ['dcl', 'djs', 'ycl', 'yqx', 'qbyw']
					globalData.gdglIndex = states.indexOf(item.state)
					uni.switchTab({
						url: `./order`
					})
				} else if (item.state === 'wdrc') {
					uni.navigateTo({
						url: '../modules/schedule/schedule',
					})
				} else if (item.type === 'xxzx') {
					uni.navigateTo({
						url: '../mine/information'
					})
				} else {
					this.$refs.uToast.show({
						type: 'warning',
						title: '功能正在开发中'
					})
				}
			},
			//  跳转论坛中心
			goForum() {
				uni.navigateTo({
					url: `/pages/modules/forum/center`
				});
			},

			// 跳转考试页面
			goExam() {
				uni.navigateTo({
					url: "/pages/modules/exam/exam"
				})
			},

			// 知识库跳转
			goProduct(item) {
				if (!this.token) {
					uni.redirectTo({
						url: '../mine/login'
					})
					return false
				}
				uni.navigateTo({
					url: `${item.url}?name=${item.name}`
				})
			},

		},
		//分享给好友
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '',
				path: '/pages/index/index'
			}
		},

		//分享朋友圈
		onShareTimeline(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: '',
				path: '/pages/index/index'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #efefef;
	}
</style>
