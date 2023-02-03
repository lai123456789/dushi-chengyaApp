<template>
	<view>
		<customCard title="工单办理" :bodyStyle="{padding: '16rpx 32rpx'}">
			<u-form :model="form">
				<u-form-item label="办理方式" label-width="200rpx" required>
					<u-radio-group :wrap="true" v-model="wayIndex" @change="onChange">
						<u-radio :key="key" v-for="(item, key) of listWayData" :name="item.wayIndex"
							v-if="!item.hidden">
							<view style="color: #303133; font-size: 24rpx;">{{item.way}}</view>
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<view style="color: red" v-if="fabFlag">
					若需申请配件,请点击右下角“+申请配件”按钮
				</view>
				<u-form-item :label="wayIndex === 'dkcf'?'出发地点':'到达地点'" label-width="200rpx"
					:border-bottom="wayIndex === 'dkcf'?false:true">
					{{ch_address}}
					<!-- <view class="scan">
							<u-input style="width: 100%; margin-right: 10rpx;" placeholder="请选择" :value="ch_address"
								type="text" :border="false" :disabled="true" />
						</view> -->
				</u-form-item>
				<u-form-item label="到达时间" label-width="200rpx" v-if="wayIndex === 'dddk'" :border-bottom="false">
					{{dateTime}}
				</u-form-item>
				<!-- <u-form-item label="预约上门时间" label-width="200rpx" v-if="wayIndex === 'gaiyue'" required prop="yysmsj">
						<u-input style="width: 100%;" placeholder="请选择日期" v-model="form.yysmsj" type="select"
							:border="false" @click="showDate = true" />
						<u-picker mode="time" v-model="showDate" :params="params" @confirm="choiceTime"></u-picker>
					</u-form-item>
					<u-form-item label="改约原因" label-width="200rpx" v-if="wayIndex === 'gaiyue'" required prop="gyyy">
						<u-input style="width: 100%;" placeholder="请选择" v-model="handOrder.gyyy.label" type="select"
							:border="false" @click="showReturn = true" />
						<u-select v-model="showReturn" mode="single-column" :list="gyList" value-name="number"
							label-name="name" @confirm="(e) => {choiceReason(e, 'gyyy')}"></u-select>
					</u-form-item>
					<u-form-item label="退回工单原因" label-width="200rpx" v-else-if="wayIndex === 'tuihui_gd'" required
						prop="sfthyy">
						<u-input style="width: 100%;" placeholder="请选择" v-model="handOrder.sfthyy.label" type="select"
							:border="false" @click="showReturn = true" />
						<u-select v-model="showReturn" mode="single-column" :list="returnList" value-name="number"
							label-name="name" @confirm="(e) => {choiceReason(e, 'sfthyy')}"></u-select>
					</u-form-item>
					<u-form-item label="办理备注" label-width="200rpx">
						<u-input type="textarea" :border="true" :clearable="true" class="u-flex-1" v-model="remark" />
					</u-form-item> -->
			</u-form>

		</customCard>
		<view class="footer">
			<u-button type="primary" throttle-time="2500" @click="submit">提交</u-button>
			<!-- <u-button type="primary" throttle-time="2500" @click="getDistance" v-else>提交</u-button> -->
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import customCard from '@/components/customCard'
	const QQMapWX = require('../../../common/wxmap_sdk/qqmap-wx-jssdk.min.js')
	let qqmapsdk
	export default {
		name: 'orderAppoint',
		props: {
			fabFlag: {
				type: Boolean,
				default: false
			},
			transitionId: {
				type: String,
				default: ''
			},
			ch_address: {
				type: String,
				default: ''
			}
		},
		components: {
			customCard
		},
		data() {
			return {
				dateTime: '',
				detail: {},
				loglist: [],
				form: {},
				subKey: '',
				jwd: '', // 打卡经纬度
				dkdz: '', // 打卡地址
				listWayData: [{
						way: '打卡出发',
						wayIndex: 'dkcf'
					}
					// {
					// 	way: '打卡成功',
					// 	wayIndex: 'dkcf'
					// }
					// , {
					// 	way: '改约',
					// 	wayIndex: 'gaiyue'
					// },
					// {
					// 	way: '退回工单',
					// 	wayIndex: 'tuihui_gd'
					// },
				],
				wayIndex: 'dkcf',
				returnList: [],
				gyList: [],
				handOrder: {
					sfthyy: {},
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				showDate: false,
				showReturn: false,
				remark: '',
			}
		},
		created() {
			if (['d55a5fb892f941be9a0b3a27405d6835', 'dea9b11aa3964510b83d0cc38f316106',
					'ae8e3fdffb944f1db968e05a32c5b4d3',
					'ae149b8605a94ad58f778f10dc99c7f1'
				].includes(this.transitionId)) {
				this.wayIndex = 'dddk'
				this.listWayData = [{
					way: '到达打卡',
					wayIndex: 'dddk'
				}]
			}
			let globalData = getApp().globalData
			this.detail = globalData.order
			this.subKey = globalData.order ? globalData.order.subKey : ''
		},
		mounted() {
			qqmapsdk = new QQMapWX({
				key: 'KV7BZ-K4BCP-R2GD4-LJQCX-5YNUS-CUFR6'
			})
			let globalData = getApp().globalData
			const jwd = globalData.jwd || ''
			this.latitude = jwd.split(',')[1]
			this.longitude = jwd.split(',')[0]
			// 获取当前时间 格式 2020-09-08 13:00:08
			var date = new Date();
			var year = date.getFullYear(); //年 ,从 Date 对象以四位数字返回年份
			var month = date.getMonth() + 1; //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
			var day = date.getDate(); //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
			var hours = date.getHours(); //小时 ,返回 Date 对象的小时 (0 ~ 23)
			var minutes = date.getMinutes(); //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
			var seconds = date.getSeconds(); //秒 ,返回 Date 对象的秒数 (0 ~ 59)   
			//获取当前系统时间  
			var currentDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
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
				hours = "0" + hours;
			}
			//修改分钟格式
			if (minutes >= 0 && minutes <= 9) {
				minutes = "0" + minutes;
			}
			//修改秒格式
			if (seconds >= 0 && seconds <= 9) {
				seconds = "0" + seconds;
			}
			//获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)
			var currentFormatDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
			this.dateTime = currentFormatDate
		},
		methods: {
			// 选择办理方式
			onChange(e) {
				if (e === 'tuihui_gd' && this.returnList.length === 0) {
					this.$u.post('/admin/dict/linkageDictList', {
						parent_number: 'sfthyy'
					}).then(res => {
						this.returnList = res.result
					})
				} else if (e === 'gaiyue' && this.gyList.length === 0) {
					this.$u.post('/admin/dict/linkageDictList', {
						parent_number: 'yysbyy'
					}).then(res => {
						this.gyList = res.result
					})
				}
			},
			//打电话
			makePhoneCall(phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: () => {}
				});
			},
			// 提交
			submit() {
				this.onConfirm('handleSubmit')
			},

			onConfirm(func) {
				if (func !== 'none') {
					this[func]()
				}
			},

			// 选择预约上门时间
			choiceTime(e) {
				const time = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`
				const date = new Date(time).valueOf()
				const nowDate = new Date().valueOf()
				if (date <= nowDate) {
					this.cancelText = '取消'
					this.confirmText = '确定'
					this.modalTxt = '预约时间不能小于当前时间，请重新选择预约时间'
					this.confirmFunc = 'none'
				} else {
					this.$set(this.form, 'yysmsj', time)
				}
			},
			// 选择预约失败原因
			choiceReason(e, type) {
				this.handOrder[type] = e[0]
				this.form[type] = e[0].value
			},

			// 获取师傅打开地址和联系地址的直线距离
			getDistance() {
				// 获取联系地址的经纬度
				let ssq = this.detail.orderData && this.detail.orderData.ssq
				ssq = ssq.replace(/\//g, '')
				const xxdz = this.detail.orderData && this.detail.orderData.xxdz
				const address = `${ssq}${xxdz}`
				const globalData = getApp().globalData
				let lxLat = globalData.khdz && globalData.khdz.lat
				let lxLng = globalData.khdz && globalData.khdz.lng
				// 计算师傅当前位置和联系地址的直线距离
				qqmapsdk.calculateDistance({
					mode: 'straight',
					from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
					to: `${lxLat},${lxLng}`, //终点坐标
					success: (res) => {
						if (res.message === 'query ok') {
							let result = -1
							if (res.result.elements && res.result.elements.length >
								0) {
								result = res.result.elements[0].distance
							}
							this.distance = result
							// if (this.distance > 3000) {
							// 	this.cancelText = '取消'
							// 	this.confirmText = '确定'
							// 	this.modalTxt = '打卡位置已超出用户坐标3公里，请确认是否继续打卡'
							// 	this.confirmFunc = 'handleSubmit'
							// } else {
							// 	this.onConfirm('handleSubmit')
							// }
							this.onConfirm('handleSubmit')
						}
					}
				})
			},
			// 提交工单
			handleSubmit() {
				let params = {
					case_id: this.detail.workitemData.case_id,
					handleRemarks: this.remark,
					handleWay: this.wayIndex,
					workitem_id: this.detail.workitemData.workitem_id,
					tableid: 'c289bf71e6254134d7c35833e1014b18',
				}
				// params[this.subKey] = {}
				params.parameter = {}
				if (this.wayIndex === 'dkcf' || this.wayIndex === 'dddk') {
					const globalData = getApp().globalData
					let value = this.wayIndex === 'dkcf' ? 'cfdd' : 'dddd'
					params.parameter[value] = globalData.dkdz
					// params[this.subKey].smdkjwd = globalData.jwd
					// params[this.subKey].dkpcgls = this.distance
				} else if (this.wayIndex === 'gaiyue') {
					params[this.subKey].yysmsj = this.form.yysmsj
					params[this.subKey].gyyy = this.form.gyyy
				} else if (this.wayIndex === 'tuihui_gd') {
					params[this.subKey].sfthyy = this.form.sfthyy
				}
				this.$u.post('/admin/workitem/processing', params, true).then(res => {
					if (res.code === 0) {
						this.$refs.uToast.show({
							type: 'success',
							title: '工单办理成功',
							callback() {
								uni.navigateBack({
									delta: 1
								})
							}
						})
					} else {
						this.$refs.uToast.show({
							type: 'error',
							title: res.message,
							duration: 3000
						})
					}
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	//底部提交按钮
	.footer {
		position: fixed;
		z-index: 1000;
		width: 100%;
		bottom: 0;
		margin: auto;
		color: #a1a1a1;
		text-align: center;
		line-height: 100rpx;
	}

	.scan {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
