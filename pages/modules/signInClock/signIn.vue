<template>
	<view style="height: 100vh; background-color: #FFF; display: flex; flex-direction: column;">
		<u-tabs :list="tabsList" :is-scroll="false" :current="current" @change="onChange" font-size="24"></u-tabs>
		<view v-if="current === 0" style="display: flex; flex-direction: column; flex: 1;">
			<view class="u-flex u-row-between u-col-center u-m-l-30 u-m-r-30 u-p-t-16 u-p-b-16 u-border-bottom">
				<view class="u-flex" v-if="userInfo">
					<u-avatar :src="configAll.url + JSON.parse(userInfo.zp)[0].filePath"
						v-if="userInfo && userInfo.zp !== '[]'"></u-avatar>
					<view class="u-m-l-24">
						<view class="u-m-b-8">{{userInfo.dlyhm}}</view>
						<view>{{userInfo.ssfgs ? userInfo.ssfgs + ':': ''}} {{userInfo.ssbm}}</view>
					</view>
				</view>
				<view>
					<u-tag text=" + 添加关联业务" type="primary" mode="plain" size="mini" @click="goAdd" />
					<view style="color: #227B13; margin-top: 12rpx;">{{date}}</view>
				</view>
			</view>
			<view class="u-text-center u-p-t-80 u-flex-1 u-m-16" style="background: #D6E3F9;">
				<view v-if="!isCheckIn">
					<!-- 未打卡 -->
					<view class="u-flex u-row-center u-col-center" @click="checkIn"
						style="border-radius: 50%; background-color: #FF9500; margin: 0 auto; width: 230rpx; height: 230rpx;">
						<view class="u-flex u-row-center u-col-center"
							style="border-radius: 50%; background-color: #FFFFFF; margin: 0 auto; width: 200rpx; height: 200rpx;">
							<view style="line-height: 64rpx;">
								<view style="font-size: 36rpx; margin-bottom: 32rpx; color: #227B13;">
									打卡
								</view>
								<view style="font-size: 42rpx; color: #227B13;">{{time}}</view>
							</view>
						</view>
					</view>
					<view v-if="isOver !== 'none'">
						<view class="u-m-t-30 u-text-center">
							<view><text class="u-m-l-8 u-m-r-8">业务编号：</text><text class="u-m-r-8">{{glyw.gdbh}}</text>
							</view>
							<view class="u-m-t-20">
								<text class="u-m-l-8 u-m-r-8">安装地点：</text>
								<text class="u-m-r-8">{{glyw.azdd}}</text>
							</view>
						</view>
						<view class="u-m-t-30 u-flex u-col-center u-row-center u-m-l-16 u-m-r-16">
							<u-icon :name="!isOver ? 'checkmark-circle-fill' : 'close-circle-fill'"
								:style="{'color': !isOver?'#227B13':'#fa3534'}" size="30"></u-icon>
							<text class="u-m-l-8 u-m-r-8"
								:style="{'color': !isOver?'#227B13':'#fa3534', 'white-space': 'nowrap'}">
								{{!isOver ? '已进入安装地点范围':'未进入安装地点范围' }}：
							</text>
							<text class="u-m-r-8">{{address}}</text>
							<u-icon name="map-fill" style="color: #2979ff;" size="30"></u-icon>
						</view>
					</view>
				</view>
				<view v-else>
					<!-- 已打卡 -->
					<u-icon name="checkmark-circle-fill" size="200" style="color: #32B51D;"></u-icon>
					<view class="u-m-t-30 u-m-b-30 u-flex u-col-center u-row-center" style="color: #32B51D;">
						打卡完成
					</view>
					<view style="width: 400rpx; margin: 0 auto; border-top: 2rpx solid #CED1D6">
						<view class="u-p-t-24 u-p-b-24 u-flex u-row-between">
							<text>打卡时间</text>
							<text>{{time}}</text>
						</view>
						<view class="u-flex u-row-between u-p-b-24">
							<text style="white-space: nowrap;">业务编号</text>
							<text>{{glyw.gdbh}}</text>
						</view>
						<view class="u-flex u-row-between u-p-b-24">
							<text style="white-space: nowrap;">安装地点</text>
							<text style="text-align: right;">{{glyw.azdd + glyw.azxxdz}}</text>
						</view>
						<view class="u-flex u-row-between u-p-b-24">
							<text>打卡位置</text>
							<text :style="{'color': !isOver?'':'#fa3534'}">{{!isOver?'范围内':'范围外'}}</text>
						</view>
					</view>
				</view>

			</view>

		</view>
		<view v-else>
			<view
				style="display: flex; background-color: #F8F8F8; align-items: center; justify-content: space-between; padding: 16rpx;">
				<view style="padding: 0 8rpx; background-color: #FFF;">
					<u-input placeholder="请选择日期" type="select" :custom-style="{width: '200rpx'}" height="65"
						:value="cjsj2" @click="show = !show"></u-input>
				</view>
				<u-calendar v-model="show" mode="date" @change="change"></u-calendar>
			</view>
			<view class="u-flex-1" style="background-color: #F8F8F8;">
				<u-empty mode="data" v-if="dataList.length === 0"></u-empty>
				<view class="u-p-16" style="background-color: #FFF;" v-else>
					<u-table font-size="20">
						<u-tr>
							<u-td>关联工单编号</u-td>
							<u-td>打卡时间</u-td>
							<u-td>是否进入打卡范围</u-td>
							<u-td>安装地点</u-td>
							<u-td>打卡地点</u-td>
							<u-td>认证是否成功</u-td>
							<u-td>打卡人</u-td>
						</u-tr>
						<u-tr v-for="(item, index) in dataList" :key="index">
							<u-td>
								<view style="word-break: break-all">{{item.glgdbh}}</view>
							</u-td>
							<u-td>
								<view style="word-break: break-all">{{item.dksj}}</view>
							</u-td>
							<u-td>
								<view style="word-break: break-all"
									:style="{'color': item.sfjrdkfw == '打卡范围外' ? 'red': ''}">{{item.sfjrdkfw}}</view>
							</u-td>
							<u-td>
								<view style="word-break: break-all">{{item.azdd}}</view>
							</u-td>
							<u-td>
								<view style="word-break: break-all"
									:style="{'color': item.sfjrdkfw == '打卡范围外' ? 'red': ''}">{{item.dkdd}}</view>
							</u-td>
							<u-td>
								<view style="word-break: break-all">{{item.rzsfcg}}</view>
							</u-td>
							<u-td>
								<view style="word-break: break-all">{{item.dkr}}</view>
							</u-td>
						</u-tr>
					</u-table>
					<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
				</view>

			</view>
		</view>

	</view>
</template>

<script>
	//引入混入的文件
	import loadPage from '@/pages/modules/forum/modulePublic/mixins/loadPage.js'
	//引入 loading状态组件
	import ListLoadingMore from '@/pages/modules/forum/modulePublic/sonComponents/ListLoadingMore.vue'
	const QQMapWX = require('../../../common/wxmap_sdk/qqmap-wx-jssdk.min.js')
	const qqmapsdk = new QQMapWX({
		key: 'KV7BZ-K4BCP-R2GD4-LJQCX-5YNUS-CUFR6'
	})
	export default {
		components: {
			ListLoadingMore
		},
		mixins: [loadPage], //使用混入文件
		data() {
			return {
				signInAddress: '',
				glyw: '',
				configAll: this.config,
				userInfo: uni.getStorageSync('myInfo'),
				isCheckIn: false, //是否打卡
				time: '', //当前显示时间 08:00
				timeApi: '', //传接口时间 2020-06-08 20:00:16
				isOver: 'none', //是否打卡范围内 默认未设置考勤地点
				address: '',
				//当前用户位置经纬度
				latitude: '',
				longitude: '',
				date: new Date().toISOString().slice(0, 10), //当前日期
				show: false,
				current: 0,
				dkjl: { //今日打卡记录
					sb: 0,
					xb: 0
				},
				tabsList: [{
					name: '打卡'
				}, {
					name: '我提交的'
				}],
				cjsj2: '',
				//分页参数如下
				initial: {
					apiName: '/admin/UserTable/init', // 分页数据接口地址
					getDataListIsPage: true, // 是否分页
				},
				listName: 'result', //接口返回的数据结果集名称
				dataForm: {
					searchString: {
						cjsj: '',
						dkr: uni.getStorageSync('myInfo').dlyhm
					},
					tplviewid: '091f35d786bec8518e1065209f7a291b'
				},
				apiParam: {}
			}
		},
		methods: {
			goAdd() {
				uni.navigateTo({
					url: `/pages/modules/reportingGuidelines/associatedOrder?selectString=signIn`
				});
			},
			//打卡按钮
			checkIn() {
				if (!this.glyw) {
					this.$u.toast('请先添加关联业务')
					return
				}
				let info = uni.getStorageSync('myInfo')
				let param = {
					tplviewid: '3fe64f18b8bda85df77cbf7583bee7d3',
					action: "submit",
					crm_dkjlb: {
						sfjrdkfw: !this.isOver ? 'dkfwn' : 'dkfww', //是否进入打卡范围
						dkdd: this.address, //打卡地址 中文
						azdd: this.glyw.azdd + this.glyw.azxxdz, //安装地点
						rzsfcg: "", //认证是否成功
						glgdbh: this.glyw.gdbh,
						dkrfgs: this.userInfo.ssfgs, //打卡人分公司
						dkr: this.userInfo.xm, //打卡人
						dksj: this.timeApi, //打卡时间 年月日时分秒
						ssbm: info.ssbm,
						ssfgs: info.ssfgs,
						gyhm: info.gyhm
					}
				}
				this.apiParam = param //提交打卡的api接口所需数据 先存起来 再跳转页面 后续认证成功返回该页面直接取即可
				//跳转人脸识别
				uni.navigateTo({
					url: '../../modules/auth/authorize'
				})
			},
			//提交打卡数据
			submitData() {
				this.$u.post('/admin/UserTable/add', this.apiParam).then(res => {
					if (res.code === 0) {
						this.isCheckIn = true
						this.getTimeData() //刷新当前时间
						this.getDataList() //重新刷新 提交的记录数据 该方法是用了 mixin里面混入方法
					}
				})
			},
			getdksjb() {
				return new Promise((resolve) => {
					this.isOver = false
					//中文地址 转 经纬度
					let dz = this.signInAddress.split('/')[0] + this.signInAddress.split('/')[1] + this
						.signInAddress.split('/')[
							2]
					qqmapsdk.geocoder({
						address: dz, //需要转换为经纬度的地址：如 '广东省揭阳市普宁市梅塘镇长美村东路口'
						success: function(res) { //返回的数据里面有该地址的经纬度
							resolve(res)
						}
					})
				})
			},
			onChange(e) {
				this.current = e
			},
			//获取当前时间数据
			getTimeData() {
				// 获取当前时间 格式 08:00
				var date = new Date();
				var year = date.getFullYear(); //年 ,从 Date 对象以四位数字返回年份
				var month = date.getMonth() + 1; //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
				var day = date.getDate(); //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
				var hours = date.getHours(); //小时 ,返回 Date 对象的小时 (0 ~ 23)
				var minutes = date.getMinutes(); //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
				var seconds = date.getSeconds(); //秒 ,返回 Date 对象的秒数 (0 ~ 59)
				//修改月份格式
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				//修改日期格式
				if (day >= 0 && day <= 9) {
					day = "0" + day;
				}
				//修改小时格式
				if (hours >= 0 && hours <= 9) {
					hours = "0" + hours
				}
				//修改分钟格式
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes
				}
				//修改秒格式
				if (seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				}
				this.time = hours + ":" + minutes
				this.timeApi = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
			},
			change(e) {
				this.cjsj2 = e.result
				let a = e.year + '-' + e.month + '-' + e.day + ' ' + '23:59:59'
				let b = e.year + '-' + e.month + '-' + (Number(e.day) - 1) + ' ' + '23:59:59'
				this.dataForm.searchString.cjsj = [b, a]
				console.log('this.dataForm.searchString.cjsj', this.dataForm.searchString.cjsj)
				this.getDataList()
			},
			getLocation() {
				return new Promise((resolve) => {
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: (res) => {
							this.latitude = res.latitude || 39.909
							this.longitude = res.longitude || 116.39742
							console.log('res地址', res)
							resolve(res)
							// let globalData = getApp().globalData
							// globalData.jwd = `${this.longitude},${this.latitude}`
							const jwd = `${this.latitude},${this.longitude}`
							qqmapsdk.reverseGeocoder({
								location: jwd,
								success: (res) => {
									this.address = res.result.address
								}
							})
						},
						fail(error) {
							uni.showToast({
								title: '当前地址获取失败，请检查确认是否开启了位置信息权限',
								icon: 'none'
							});
						}
					})
				})
			},
			async getDistance() {
				let jwd = await this.getLocation() //获取当前定位地址信息
				let adt = await this.getdksjb() //获取该工单的安装打卡地点： 中文地址转经纬度的回调值 
				// 计算当前位置和打卡地址的直线距离
				qqmapsdk.calculateDistance({
					mode: 'straight',
					from: '', //jwd  若起点有数据则采用起点坐标，若为空默认当前地址
					to: `${adt.result.location.lat},${adt.result.location.lng}`, //终点坐标
					success: (res) => {
						if (res.message === 'query ok') {
							let result = res.result.elements[0].distance //单位米 数值如 1512
							console.log('距离', result)
							if (result > 1000) { //超出一公里 范围外
								this.isOver = true
							} else {
								//范围内
							}
						}
					},
					fail: (err) => {
						console.log('err信息', err)
					}
				})
			}
		},
		onShow() {
			let status = uni.getStorageSync('motionPending')
			if (status === 0 || status === 1) {
				this.apiParam.crm_dkjlb.rzsfcg = status === 0 ? 's' : 'f' //0 是-认证成功 1 否-认证失败
				this.submitData() //提交打卡数据
				uni.removeStorageSync('motionPending') //清除认证状态
			}

			const globalData = getApp().globalData
			if (globalData.glyw && globalData.selectString === 'signIn') {
				this.glyw = globalData.glyw
				this.signInAddress = globalData.glyw.azdd + globalData.glyw.azxxdz
				this.getDistance() //获取当前位置和工单安装地点的 距离差距（1公里 超出为范围外）
				globalData.glyw = ''
				globalData.selectString = ''
			}

		},
		onLoad() {
			this.getDataList() //获取总打卡记录
			this.getTimeData()
		}
	}
</script>

<style lang="scss" scoped>
	.u-td {
		height: auto;
	}
</style>
