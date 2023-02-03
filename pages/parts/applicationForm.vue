<template>
	<view>
		<customCard title="配件申请工单信息">
			<u-form>
				<u-form-item label="配件申请单号" :label-width="label_width">
					<view class="u-content-color">{{dataList.gdbh}}</view>
				</u-form-item>
				<u-form-item label="工单类型" :label-width="label_width">
					<view class="u-content-color">{{dataList.gdlx}}</view>
				</u-form-item>
				<u-form-item label="创建人" :label-width="label_width">
					<view class="u-content-color">{{dataList.cjr}}</view>
				</u-form-item>
				<u-form-item label="收配件联系人" :label-width="label_width">
					<view class="u-content-color">{{dataList.spjlxr}}</view>
				</u-form-item>
				<u-form-item label="收配件联系方式" :label-width="label_width">
					<view class="u-content-color">{{dataList.spjlxdh}}</view>
				</u-form-item>
				<u-form-item label="收配件地址" :label-width="label_width">
					<view class="u-line-2 u-content-color">{{dataList.spjdqssqjd + dataList.spjxxdz}}</view>
				</u-form-item>
				<u-form-item label="物流公司" :label-width="label_width">
					<view class="u-content-color">{{dataList.pjjswlgs || '无'}}</view>
				</u-form-item>
				<u-form-item label="物流单号" :label-width="label_width">
					<view class="u-content-color">{{dataList.pjjswldh || '无'}}</view>
				</u-form-item>
				<u-form-item label="报单照片" :label-width="label_width" :border-bottom="false">
					<view class="u-flex u-flex-wrap">
						<view v-if="dataList.pjfj && dataList.pjfj.length > 0">
							<u-image v-for="(sitem, sindex) in dataList.pjfj" :key="sindex"
								style="margin-right: 20rpx; margin-top: 20rpx;" :width="150" :height="150"
								:src="config.url + sitem.filePath" @click="previewImg(sindex)"></u-image>
						</view>
						<view v-else>无</view>
					</view>
				</u-form-item>
			</u-form>

		</customCard>
		<customCard title="配件申请明细">
			<view>
				<view class="u-flex u-border-bottom u-p-t-10 u-p-b-20" v-for="(item,index) in dataList.pjsqmx"
					:key="item.id" v-show="true">
					<view v-if="item.pjtp">
						<u-image :src="item.pjtp" width="150rpx" height="150rpx"></u-image>
					</view>
					<view class="u-m-l-20 u-flex-1">
						<view class="u-main-color u-line-1">{{item.pjmc}}</view>
						<view class="u-flex u-col-top u-flex-1">
							<view class="u-content-color u-text-right" style="width: 140rpx;">配件编号：</view>
							<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.glpjbh}}</view>
						</view>
						<view class="u-flex u-col-top u-flex-1">
							<view class="u-content-color u-text-right" style="width: 140rpx;">配件型号：</view>
							<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.pjxh}}</view>
						</view>
						<view class="attribute u-flex u-row-between">
							<view class="u-flex u-col-top u-flex-1">
								<view class="u-content-color u-text-right" style="width: 140rpx;">单价：</view>
								<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.lsj || '--'}}</view>
							</view>
							<view v-if="role == 'fzr'">
								<text class="u-content-color">数量：</text>
								<text class="u-main-color">{{item.sqsl}}</text>
							</view>
							<view v-if="role == 'sf'">
								<u-number-box v-if="cIndex === 0" v-model="item.sqsl"
									@change="valChange($event,item,index)"></u-number-box>
								<view v-else>
									<text class="u-content-color">数量：</text>
									<text class="u-m-l-8 u-main-color">{{item.sqsl}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

		</customCard>
		<customCard title="工单办理" v-if="cIndex === 0">
			<u-form :model="form" ref="uForm">
				<u-form-item label="办理方式" label-width="200">
					<u-radio-group v-model="handleWay" :wrap="true">
						<u-radio active-color="#2979ff" v-for="(item, index) in radiolist" :key="index" :name="item.way"
							@change="radioChange(item,index, val)">{{ item.way }}</u-radio>
					</u-radio-group>
				</u-form-item>
				<block v-if="showBan">
					<u-form-item label="付款方式" label-width="200" v-if="role == 'fzr' && wdjb == '一级网点'">
						<block v-if="cIndex > 0">
							<u-input class="u-flex-1" v-model="dataList.fkfs" :border="false" disabled />
						</block>
						<block v-if="cIndex === 0">
							<u-input class="u-flex-1" placeholder="请选择" v-model="fkfsLable" type="select"
								:border="false" @click="fkfsClick" />
							<u-select v-model="showfkfs" :list="fkfsList" @confirm="confirmfkfs"></u-select>
						</block>
					</u-form-item>
				</block>
				<u-form-item label="工单办理" label-width="200">
					<u-input type="textarea" v-model="handleRemarks" :border="true" style="width: 100%;" />
				</u-form-item>
			</u-form>
		</customCard>
		<customCard title="工单日志">
			<view>
				<u-read-more :show-height="400" :toggle="true" close-text="查看完整工单日志" ref="uReadMore">
					<u-time-line>
						<u-time-line-item v-for="(item,index) in loglist" :key="index">
							<template v-slot:node>
								<view :class="index == '0'?'u-node-active':'u-node-gray'"></view>
							</template>
							<template v-slot:content>
								<view style="margin-top: -6rpx;" class="u-p-l-24">
									<view class="u-order-desc u-rela" style="left: -56rpx;">{{item.title}}</view>
									<view class="u-order-desc u-tips-color u-rela" style="left: -56rpx;"
										v-if="item.username && item.type">
										{{item.username}}:
										<text class="u-m-l-8">{{item.type}}</text>
									</view>
									<text class="u-tips-color">{{item.content}}</text>
									<view class="u-light-color u-rela" style="left: -56rpx;">{{item.create_time}}</view>
								</view>
							</template>
						</u-time-line-item>
					</u-time-line>
				</u-read-more>
			</view>

		</customCard>
		<view class="u-p-16" v-if="radiolist.length!=0 && cIndex === 0">
			<u-button type="primary" @click="submit">提交</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import customCard from '@/components/customCard.vue'
	import AdaPay from '@/common/adapay_sdk/adaPay.js'
	import loglistTimeLine from '@/components/loglistTimeLine.vue'
	export default {
		components: {
			loglistTimeLine,
			customCard
		},
		data() {
			return {
				isEdit: false,
				role: 'sf',
				wdjb: uni.getStorageSync('userInfo').wdjb, //网点级别 一级网点 二级网点
				cIndex: 0,
				radiolist: [],
				handleWay: '',
				handleWayEn: '',
				dataList: {},
				label_width: '224rpx',
				form: {
					gdbh: '',
					gdlx: '',
					cjr: '',
					spjlxr: '',
					spjlxdh: '',
					spjdqssqjd: '',
					pjzje: 0,
					pjzsl: 0,
					fhfs: '',
					fkfs: ''
				},
				fhfsLable: '', //发货方式显示label值
				fkfsLable: '', //付款方式显示label值
				//发货方式
				showfhfs: false,
				showfkfs: false,
				fhfsList: uni.getStorageSync('fhfsListOption'), //发货方式list
				fkfsList: uni.getStorageSync('fkfsListOption'), //付款方式list
				//
				handleRemarks: '',
				case_id: '',
				workitem_id: '',
				tableid: '',
				id: '',
				pjsqmx: [],
				loglist: [],
				showBan: false,
				config: this.config
			}
		},
		methods: {
			//点击图片预览放大
			previewImg(index) {
				let _this = this;
				let imgsArray = this.dataList.pjfj;
				let imgs = imgsArray.map((item, index) => {
					return this.config.url + item.filePath
				})
				uni.previewImage({
					current: index,
					urls: imgs
				});
			},
			//选择配件办理方式
			radioChange(item, index) {
				console.log('item,', item)
				this.handleWayEn = item.alias
				if (item.way == '审核通过并向总部申请') {
					this.showBan = true
				} else {
					this.showBan = false
				}
			},
			valChange(item) {
				let price = 0
				let quantity = 0
				this.form.pjsqmx.map(sItem => {
					price += parseFloat(sItem.pjdj * sItem.sqsl)
					quantity += parseInt(sItem.sqsl)
				})
				this.form.pjzje = Number(price).toFixed(2) //配件申请总金额
				this.form.pjzsl = quantity //配件申请总数量
			},
			confirmfhfs(e) {
				console.log(e)
				this.fhfsLable = e[0].label
				this.form.fhfs = e[0].value
				//
				this.dataList.fhfs = e[0].label
			},
			confirmfkfs(e) {
				console.log(e)
				this.fkfsLable = e[0].label
				this.form.fkfs = e[0].value
			},
			fhfsClick() {
				this.showfhfs = true
				this.fhfsList = uni.getStorageSync('fhfsListOption')
			},
			fkfsClick() {
				this.showfkfs = true
				this.fkfsList = uni.getStorageSync('fkfsListOption')
			},
			confirmCity(e) {
				let city = []
				this.form.spjdqssqjd = e[2].value
				e.map(item => {
					// this.form.spjdqssqjd.push(item.value)
					city.push(item.label)
				})
				this.dataList.spjdqssqjd = city.join('/')
			},

			getpjsqinfo(value) {
				this.$u.post('/app/WorkOrder/getpjsqinfo', {
					workitem_id: value,
					case_id: this.case_id
				}).then(res => {
					this.dataList = res.result.data
					this.dataList.pjfj = JSON.parse(this.dataList.pjfj)
					this.dataList.spjdqssqjd = res.result.data.spjdqssqjd.replace(/,/g, '');
					this.form.pjsqmx = res.result.data.pjsqmx
					this.form.spjdqssqjd = res.result.data._spjdqssqjd_ //新增
					let price = 0
					let quantity = 0
					this.form.pjsqmx.map(sItem => {
						price += parseFloat(sItem.pjdj * sItem.sqsl)
						quantity += parseInt(sItem.sqsl)
					})
					this.form.pjzje = Number(price).toFixed(2) //配件申请总金额
					this.form.pjzsl = quantity //配件申请总数量
					this.tableid = res.result.tableid
					this.id = res.result.data.id
					this.workitem_id = res.result.workitem_id
					this.case_id = res.result.case_id
					this.radiolist = res.result.wayData || []
					this.loglist = res.loglist
					// 文本渲染后初始化u-read-more按钮
					this.$nextTick(function() {
						this.$refs.uReadMore.init()
					})

				})
			},
			submit() {
				if (this.handleWayEn == '') {
					this.$u.toast("请选择办理方式")
					return
				}
				let fkfsSelect = this.fkfsLable
				if (fkfsSelect == '' && this.handleWay == '审核通过并向总部申请') {
					this.$u.toast("请选择付款方式")
					return
				}
				let kyed = Number(this.dataList.kyed) //网点可用额度
				let pjzje = Number(this.form.pjzje) //配件申请总计金额

				if (fkfsSelect == '使用网点余额') {
					if (kyed < pjzje) {
						this.$u.toast("当前网点可用额度不足以支付")
						return
					}
				}
				let newArr = this.dataList.pjsqmx.map((item, index) => {
					return {
						id: item.id,
						sqsl: item.sqsl,
						sqxj: parseFloat(item.sqsl * item.pjdj)
					}
				})
				let param = {
					case_id: this.case_id,
					// workitem_id: this.workitem_id, 不传
					tableid: this.tableid,
					id: this.id,
					handleWay: this.handleWayEn,
					parameter: {},
					handleRemarks: this.handleRemarks,
					values: {
						pjzje: this.form.pjzje,
						pjzsl: this.form.pjzsl,
						spjdqssqjd: {
							address: this.form.spjdqssqjd,
							details: this.dataList.spjxxdz
						},
						spjlxdh: this.dataList.spjlxdh,
						spjlxr: this.dataList.spjlxr,
						fkfs: this.form.fkfs //付款方式
					},
					pjsqmx: newArr,
					openid: uni.getStorageSync('openid')
				}
				console.log(param);
				let t = this
				if (fkfsSelect == "在线支付") {
					let parApi = {
						id: this.id,
						openid: uni.getStorageSync('openid')
					}
					this.$u.post('/app/WorkOrder/handlepayparam', parApi).then(res => {
						if (res.code == 0) {
							if (res.result.status == 'succeeded') { //发起支付 根据该字段标识 是否吊起支付控件
								let payment = res.result
								AdaPay.doPay(payment, (res) => {
									//支付结果参数
									console.log(res)
									if (res.result_status == 'succeeded') { //支付成功

										//调用提交方法  把order_no订单编号带上 传到接口
										let apiPar = Object.assign(param, {
											order_no: res.result_info.order_no
										})
										t.submitApiparam(apiPar)

									} else {
										//取消支付
										t.$u.toast('支付已取消')
									}
								})
							}
						} else if (res.code != 0) { //res.code 不为0的时候 接口返回报错信息
							this.$u.toast(res.message)
						} else {
							this.$u.toast("请求参数有误")
						}
					})
				} else { //无需在线支付  如办理方式选择了网点余额 或线下付款  直接提交即可
					this.submitApiparam(param)
				}
			},
			//提交所需参数函数
			submitApiparam(param) {
				this.$u.post('/app/WorkOrder/processing', param).then(res => {
					//支付逻辑测试代码块
					if (res.code == 0) {
						this.$refs.uToast.show({
							title: '提交成功',
							type: 'success'
						})
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/parts/parts'
							})
						}, 1500)
					} else {
						this.$u.toast(res.message)
					}

				})
			},
		},
		onLoad(option) {
			let userInfo = uni.getStorageSync('userInfo')
			//网点负责人
			// if (userInfo.roleid == 'a942fdfe5c81e07417d5f1eed98d027a') {
			// 	this.isEdit = true //不能编辑 师傅提交的配件单的金额数量
			// 	this.role = 'fzr'
			// }

			if (option) {
				this.case_id = option.case_id
				this.cIndex = Number(option.cIndex)
				console.log('Number(option.cIndex)', Number(option.cIndex))
				this.getpjsqinfo(option.workitem_id)
			}
			// if (!uni.getStorageSync('fhfsListOption')) {
			// 	this.$u.post('/app/Setting/getjilianOption', {
			// 		parent_number: 'fhfs'
			// 	}).then(res => {
			// 		uni.setStorageSync('fhfsListOption', res.result)
			// 	})
			// }
			// if (!uni.getStorageSync('fkfsListOption')) {
			// 	this.$u.post('/app/Setting/getjilianOption', {
			// 		parent_number: 'fkfs'
			// 	}).then(res => {
			// 		uni.setStorageSync('fkfsListOption', res.result)
			// 	})
			// }

		}
	}
</script>

<style lang="scss" scoped>
	@import '../order/modulePublic/scss/public.scss';

	/deep/.u-radio {
		margin-bottom: 8rpx;
	}

	//单元格
	/deep/.u-cell {
		padding: 0 !important;
	}

	//时间轴
	/deep/.u-time-axis {
		.u-time-axis-item {
			.u-order-time {
				line-height: 60rpx;
			}
		}

		.u-node-active {
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			background: $u-type-primary;
		}

		.u-node-gray {
			width: 28rpx;
			height: 28rpx;
			border-radius: 50%;
			background: $u-light-color;
		}
	}
</style>
