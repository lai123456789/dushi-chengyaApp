<template>
	<view>
		<!-- 以下 -->
		<u-card title="产品申请工单信息" :body-style="{padding: '0rpx 32rpx'}">
			<u-form slot="body" :model="dataList" ref="uForm">
				<u-form-item label="产品申请单号 " label-width="200rpx">
					<view class="u-content-color">{{dataList.gdbh}}</view>
				</u-form-item>
				<u-form-item label="工单类型" label-width="200rpx">
					<view class="u-content-color">{{dataList.gdlx}}</view>
				</u-form-item>
				<u-form-item label="创建人" label-width="200rpx">
					<view class="u-content-color">{{dataList.cjr}}</view>
				</u-form-item>
				<u-form-item label="创建时间" label-width="200rpx">
					<view>{{dataList.cjsj}}</view>
				</u-form-item>
				<u-form-item label="申请仓库名称" label-width="200rpx">
					<view>{{dataList.sqckmc}}</view>
				</u-form-item>
				<u-form-item label="申请仓库编号" label-width="200rpx">
					<view>{{dataList.sqckbh}}</view>
				</u-form-item>
				<u-form-item label="收件联系人" label-width="200rpx">
					<!-- 根据是否我的待办判断是否可编辑展示 -->
					<block v-if="cIndex > 0">
						<view>{{dataList.sjlxr}}</view>
					</block>
					<block v-else>
						<u-input v-model="dataList.sjlxr" type="text" border class="u-flex-1"></u-input>
					</block>
				</u-form-item>
				<u-form-item label="收件联系方式" label-width="200rpx" prop="sjlxdh">
					<block v-if="cIndex > 0">
						<view>{{dataList.sjlxdh}}</view>
					</block>
					<block v-else>
						<u-input v-model="dataList.sjlxdh" type="number" border class="u-flex-1"></u-input>
					</block>
				</u-form-item>
				<u-form-item label="收件地址(省市区)" label-width="200rpx">
					<u-select v-model="show" :list="cityList" mode="mutil-column-auto" child-name="children" value-name="value"
					 label-name="label" @confirm="confirmCity"></u-select>
					<block v-if="cIndex > 0">
						<view>{{dataList.sjdz}}</view>
					</block>
					<block v-else>
						<u-input placeholder="请选择客户地址省市区" v-model="dataList.sjdz" :disabled="true" @click="getCityData" border></u-input>
					</block>
				</u-form-item>
				<u-form-item label="收件详细地址" label-width="200rpx">
					<block v-if="cIndex > 0">
						<view>{{dataList.sjxxdz}}</view>
					</block>
					<block v-else>
						<u-input placeholder="请输入客户详细地址" v-model="dataList.sjxxdz" border></u-input>
					</block>
				</u-form-item>
				<u-form-item label="付款凭证" label-width="200rpx" v-if="dataList.fkpz">
					<u-image @click="previewImg(dataList.fkpz)" :src="dataList.fkpz" width="140" height="140"></u-image>
				</u-form-item>

			</u-form>


		</u-card>
		<u-card title="产品申请明细">
			<view slot="body">
				<view class="u-flex u-border-bottom u-p-t-10 u-p-b-20" v-for="(item,index) in dataList.cpsqmx" :key="item.id"
				 v-show="true">
					<u-image @click="previewImg(item.cptp)" :src="item.cptp" width="180rpx" height="180rpx"></u-image>
					<view class="u-m-l-20 u-flex-1">
						<view class="u-main-color u-line-1">{{item.cpmc}}</view>
						<view class="u-flex u-col-top u-flex-1">
							<view class="u-content-color u-text-right" style="width: 140rpx;">产品编号：</view>
							<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.cpbh}}</view>
						</view>
						<view class="u-flex u-col-top u-flex-1">
							<view class="u-content-color u-text-right" style="width: 140rpx;">产品型号：</view>
							<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.cpxh}}</view>
						</view>
						<view class="attribute u-flex u-row-between">
							<view class="u-flex u-col-top u-flex-1">
								<view class="u-content-color u-text-right" style="width: 140rpx;">单价：</view>
								<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.dj}}</view>
							</view>
							<view>
								<text class="u-content-color">数量：</text>
								<text class="u-main-color">{{item.sqsl}}</text>
							</view>
							<!-- <view v-if="role == 'fzr'">
								<text class="u-content-color">数量：</text>
								<text class="u-main-color">{{item.sqsl}}</text>
							</view>
							<view v-if="role == 'sf'">
								<u-number-box v-if="cIndex === 0" v-model="item.sqsl" @change="valChange($event,item,index)"></u-number-box>
								<view v-else>
									<text class="u-content-color">数量：</text>
									<text class="u-m-l-8 u-main-color">{{item.sqsl}}</text>
								</view>
							</view> -->
						</view>
					</view>

				</view>
				<view class="u-m-t-20 u-flex u-row-right"><text>总计：</text><text class="u-type-error">￥{{form.cpzje}}</text></view>
			</view>
		</u-card>
		<u-card title="工单办理" v-if="cIndex === 0">
			<u-form slot="body" :model="form" ref="uForm">
				<u-form-item label="办理方式" label-width="200">
					<u-radio-group v-model="handleWay" :wrap="true">
						<u-radio active-color="#2979ff" v-for="(item, index) in radiolist" :key="index" :name="item.way" @change="radioChange(item,index)">
							{{ item.way }}</u-radio>
					</u-radio-group>
				</u-form-item>
				<block v-if="showBan">
					<u-form-item label="付款方式" label-width="200" v-if="role == 'fzr' && wdjb == '一级网点'">
						<block v-if="cIndex > 0">
							<u-input class="u-flex-1" v-model="dataList.fkfs" :border="false" disabled />
						</block>
						<block v-if="cIndex === 0">
							<u-input class="u-flex-1" placeholder="请选择" v-model="fkfsLable" type="select" :border="false" @click="fkfsClick" />
							<u-select v-model="showfkfs" :list="fkfsList" @confirm="confirmfkfs"></u-select>
						</block>
					</u-form-item>
				</block>
				<u-form-item label="工单办理" label-width="200">
					<u-input type="textarea" v-model="handleRemarks" :border="true" style="width: 100%;" />
				</u-form-item>
			</u-form>

		</u-card>
		<u-card title="工单日志">
			<view slot="body">
				<u-read-more :toggle="true" close-text="查看完整日志" ref="uReadMore">
					<!-- <loglistTimeLine :loglist="loglist"></loglistTimeLine> -->
					<u-time-line>
						<u-time-line-item v-for="(item,index) in loglist" :key="index">
							<template v-slot:node>
								<view :class="index == '0'?'u-node-active':'u-node-gray'"></view>
							</template>
							<template v-slot:content>
								<view style="margin-top: -6rpx;" class="u-p-l-24">
									<view class="u-order-desc u-rela" style="left: -56rpx;">{{item.title}}</view>
									<view class="u-order-desc u-tips-color u-rela" style="left: -56rpx;" v-if="item.username && item.type">
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
		</u-card>
		<u-card title="发货信息" :body-style="{padding: '0rpx 32rpx'}">
			<u-form slot="body">
				<u-form-item label="寄送物流公司" v-if="dataList.jswlgs" label-width="200rpx">
					<view class="u-content-color">{{dataList.jswlgs}}</view>
				</u-form-item>
				<u-form-item label="寄送物流单号" v-if="dataList.jswldh" label-width="200rpx">
					<view class="u-content-color">{{dataList.jswldh}}</view>
				</u-form-item>
				<u-form-item label="物流付款方式" v-if="dataList.wlfkfs" label-width="200rpx">
					<view class="u-content-color">{{dataList.wlfkfs}}</view>
				</u-form-item>
				<u-form-item label="物流最新状态" v-if="dataList.wlzxzt" label-width="200rpx">
					<view>{{dataList.wlzxzt}}</view>
				</u-form-item>
				<u-form-item label="申请仓库编号" v-if="dataList.sqckbh" label-width="200rpx">
					<view>{{dataList.sqckbh}}</view>
				</u-form-item>
				<u-form-item label="发放仓库名称" v-if="dataList.ffckmc" label-width="200rpx">
					<view>{{dataList.ffckmc}}</view>
				</u-form-item>
				<u-form-item label="发放仓库联系人" v-if="dataList.ffcklxr" label-width="200rpx">
					<view>{{dataList.ffcklxr}}</view>
				</u-form-item>
				<u-form-item label="发放仓库联系方式" v-if="dataList.ffcklxdh" label-width="200rpx">
					<view>{{dataList.ffcklxdh}}</view>
				</u-form-item>
				<u-form-item label="发货地址" v-if="dataList.ffckdz" label-width="200rpx">
					<view>{{dataList.ffckdz + dataList.ffckxxdz}}</view>
				</u-form-item>
			</u-form>

		</u-card>

		<view class="u-p-16" v-if="radiolist.length!=0 && cIndex === 0">
			<u-button type="primary" @click="submit">提交</u-button>
		</view>

		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import AdaPay from '@/common/adapay_sdk/adaPay.js'
	import loglistTimeLine from '@/components/loglistTimeLine.vue'
	export default {
		components: {
			loglistTimeLine
		},
		data() {
			return {
				rules1: {
					sjlxdh: [{
							required: true,
							message: '请输入手机号',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						{
							validator: (rule, value, callback) => {
								console.log("value value value", value);
								return this.$u.test.mobile(value);
							},
							message: '手机号有误',
							trigger: ['change', 'blur']
						},

					]
				},
				show: false,
				cityList: uni.getStorageSync('cityListOption'), //省市区级联数据
				isEdit: false,
				role: 'sf',
				wdjb: uni.getStorageSync('userInfo').userinfo.wdjb, //网点级别 一级网点 二级网点
				cIndex: 0,
				radiolist: [],
				handleWay: '',
				dataList: {
					sjlxdh: ''
				},
				label_width: '224rpx',
				form: {
					gdbh: '',
					gdlx: '',
					cjr: '',
					spjlxr: '',
					spjlxdh: '',
					spjdqssqjd: '',
					cpzje: 0,
					// pjzsl: 0,
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
				ids: {},
				handleRemarks: '',
				case_id: '',
				workitem_id: '',
				tableid: '',
				id: '',
				pjsqmx: [],
				loglist: [],
				showBan: false
			}
		},
		computed: {},
		methods: {
			//点击图片预览放大
			previewImg(logourl) {
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},
			confirmCity(e) {
				let city = []
				this.form.ssq.address = e[2].value
				e.map(item => {
					city.push(item.label)
				})
				this.city = city.join('/')
			},
			getCityData() {
				this.show = true
			},
			//以上新增**********************
			//选择产品办理方式
			radioChange(item, index) {
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
				this.form.pjzje = Number(price).toFixed(2) //产品申请总金额
				this.form.pjzsl = quantity //产品申请总数量
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
					city.push(item.label)
				})
				this.dataList.sjdz = city.join('/')
			},

			getpjsqinfo(value) {
				let paramVal;
				if (value === undefined || value === 'undefined') {
					paramVal = null
				} else {
					paramVal = value
				}
				let that = this
				this.$u.post('/app/WorkOrder/getcpsqinfo', {
					workitem_id: paramVal,
					case_id: this.case_id
				}).then(res => {
					that.$nextTick(function() {

						//展开加载更多，接口请求完数据之后  需要再初始化init方法 否则展开按钮不会出现 生效
						that.$refs.uReadMore.init();

						this.dataList = res.result.data
						this.form.cpsqmx = res.result.data.cpsqmx

						// let price = 0
						// let quantity = 0
						// this.form.pjsqmx.map(sItem => {
						// 	price += parseFloat(sItem.pjdj * sItem.sqsl)
						// 	quantity += parseInt(sItem.sqsl)
						// })
						this.form.cpzje = Number(res.result.data.sqzje).toFixed(2) //产品申请总金额
						// this.form.pjzsl = quantity //产品申请总数量
						this.radiolist = res.result.wayData
						this.loglist = res.loglist
						this.tableid = res.result.tableid
						this.id = res.result.data.id
						this.workitem_id = res.result.workitem_id
						this.case_id = res.result.case_id

						this.form.spjdqssqjd = res.result.data._sjdz_ //新增
						// this.dataList.spjdqssqjd = res.result.data.spjdqssqjd.replace(/,/g, '');


					})

				})
			},
			submit() {
				if (this.handleWay == '') {
					this.$u.toast("请选择办理方式")
					return
				}
				let fkfsSelect = this.fkfsLable
				if (fkfsSelect == '' && this.handleWay == '审核通过并向总部申请') {
					this.$u.toast("请选择付款方式")
					return
				}
				let kyed = Number(this.dataList.kyed) //网点可用额度
				let pjzje = Number(this.form.pjzje) //产品申请总计金额

				if (fkfsSelect == '使用网点余额') {
					if (kyed < pjzje) {
						this.$u.toast("当前网点可用额度不足以支付")
						return
					}
				}
				let newArr = this.dataList.cpsqmx.map((item, index) => {
					return {
						id: item.id,
						sqsl: item.sqsl,
						sqxj: parseFloat(item.sqsl * item.pjdj)
					}
				})
				let param = {
					case_id: this.case_id,
					workitem_id: this.workitem_id,
					tableid: this.tableid,
					id: this.id,
					handleWay: this.handleWay,
					parameter: {},
					handleRemarks: this.handleRemarks,
					values: {
						sjdz: {
							address: this.form.spjdqssqjd,
							details: this.dataList.sjxxdz
						},
						sjlxr: this.dataList.sjlxr,
						sjlxdh: this.dataList.sjlxdh,
						fkfs: 'xxzf'
					},
					// pjsqmx: newArr,
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
							uni.redirectTo({
								url: './productOrder'
							})
						}, 1500)
					} else {
						this.$u.toast(res.message)
					}

				})
			},
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.uForm.setRules(this.rules1);
		},
		onLoad(option) {
			let userInfo = uni.getStorageSync('userInfo')
			//网点负责人
			if (userInfo.userinfo.roleid == 'a942fdfe5c81e07417d5f1eed98d027a') {
				this.isEdit = true //不能编辑 师傅提交的产品单的金额数量
				this.role = 'fzr'

			}

			if (option) {
				this.ids = option
				this.case_id = option.case_id
				this.cIndex = option.cIndex
				console.log(option)
				this.getpjsqinfo(option.workitem_id)
			}
			if (!uni.getStorageSync('fhfsListOption')) {
				this.$u.post('/app/Setting/getjilianOption', {
					parent_number: 'fhfs'
				}).then(res => {
					uni.setStorageSync('fhfsListOption', res.result)
				})
			}
			if (!uni.getStorageSync('fkfsListOption')) {
				this.$u.post('/app/Setting/getjilianOption', {
					parent_number: 'fkfs'
				}).then(res => {
					uni.setStorageSync('fkfsListOption', res.result)
				})
			}
			//省市区级联数据
			if (!uni.getStorageSync('cityListOption')) {
				this.$u.post('/app/Setting/getCityAddress', {}).then(res => {
					uni.setStorageSync('cityListOption', res.result)
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import '../modulePublic/scss/public.scss';

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
