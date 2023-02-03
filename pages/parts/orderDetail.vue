<template>
	<view class="all-container">
		<!-- 配件申请单详情页面 -->
		<customCard title="配件申请工单信息" :bodyStyle="{padding: '0 16rpx'}">
			<u-form>
				<u-form-item label="工单类型" label-width="200rpx">
					<view class="u-content-color">{{formParts.gdlx}}</view>
				</u-form-item>
				<u-form-item label="创建人" label-width="200rpx">
					<view class="u-content-color">{{formParts.cjr}}</view>
				</u-form-item>
				<u-form-item label="创建时间" label-width="200rpx">
					<view>{{formParts.cjsj}}</view>
				</u-form-item>
			</u-form>
		</customCard>
		<customCard title="配件申请明细">
			<view slot="headRight">
				<u-icon name="plus-circle-fill" color="#007AFF" size="35" @click="go_addParts"></u-icon>
			</view>
			<view class="body_content clearScrollBar">
				<view class="u-flex u-border-bottom u-p-t-24 u-p-b-32" v-for="(item,index) in apiOptionParts.details"
					:key="index">
					<view v-if="item.pjfj">
						<u-image :src="configAll.url + item.pjfj.filePath" width="180rpx" height="180rpx"></u-image>
					</view>
					<view class="u-m-l-10 u-flex-1">
						<u-row>
							<u-col span="5">
								<view class="u-p-t-10 u-p-b-12 u-p-l-10 u-main-color u-line-1">{{item.pjmc}}</view>
							</u-col>
							<u-col span="7">
								<view class="u-text-right">
									<u-number-box :min="1" v-model="item.sqsl" @change="valChange(item,index)">
									</u-number-box>
								</view>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="4">
								<view class="u-content-color u-text-right">配件编号：</view>
							</u-col>
							<u-col span="8">
								<view class="u-main-color u-flex-1 u-line-2">{{item.glpjbh}}</view>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="4">
								<view class="u-content-color u-text-right">配件型号：</view>
							</u-col>
							<u-col span="8">
								<view class="u-main-color u-flex-1 u-line-2">{{item.pjxh}}</view>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="4">
								<view class="u-content-color u-text-right">单价：</view>
							</u-col>
							<u-col span="8">
								<view class="u-main-color u-flex-1 u-line-1">{{item.price}}</view>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="4">
								<view class="u-content-color u-text-right">网点库存：</view>
							</u-col>
							<u-col span="8">
								<view class="u-main-color u-flex-1 u-line-1">{{item.kysl}}</view>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>

		</customCard>
		<customCard title="办理方式">
			<u-form :model="apiOptionParts" ref="uForm2">
				<u-form-item label="办理方式" label-width="180">
					<u-radio-group v-model="valueActivedParts" :wrap="true">
						<u-radio :key="index" v-for="(item, index) in listWayDataParts" :name="item.way"
							:disabled="false" @change="radioChangeParts(item,index)">
							<view style="color: #303133; font-size: 28rpx;">{{item.way}}</view>
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<!-- <u-form-item label="SN码" label-width="180" :required="true">
						<view class="flex_center">
							{{apiOptionParts.data.snm}}
						</view>
					</u-form-item> -->
				<u-form-item label="收配件姓名" label-width="180" :required="true">
					<u-input type="text" v-model="apiOptionParts.data.spjlxr" :border="true" style="width: 100%;" />
				</u-form-item>
				<u-form-item label="收配件电话" label-width="180" :required="true">
					<u-input type="text" v-model="apiOptionParts.data.spjlxdh" :border="true" style="width: 100%;" />
				</u-form-item>
				<u-form-item label="收配件地址" label-width="180" :required="true">
					<u-input type="text" v-model="apiOptionParts.data.cityname" :border="true" disabled
						@click="getCityData"></u-input>
					<u-select v-model="showCity" :list="cityList" mode="mutil-column-auto" child-name="children"
						value-name="value" label-name="label" @confirm="confirmCity"></u-select>
				</u-form-item>
				<u-form-item label="详细地址" label-width="180" :required="true">
					<u-input type="text" v-model="apiOptionParts.data.spjdqssqjd.details" :border="true"
						style="width: 100%;" />
				</u-form-item>
				<u-form-item label="报单照片" label-width="180" :required="false">
					<view class="u-flex u-flex-wrap" style="font-size: 12px;">
						<block v-for="(im, idx) in apiOptionParts.data.pjfj" :key="idx">
							<u-upload :show-progress="false" @on-success="val => { getImg(val, im, idx) }"
								@on-remove="removeImg(im, idx)" :max-size="5 * 1024 * 1024" :max-count="1"
								:action="action" :name="filename" :form-data="formData" :upload-text="im.name"
								width="150rpx" height="150rpx"></u-upload>
						</block>
					</view>
				</u-form-item>
				<u-form-item label="备注" label-width="180">
					<u-input type="textarea" placeholder="请描述申请备注" v-model="apiOptionParts.handleRemarks" :border="true"
						style="width: 100%;" />
				</u-form-item>
			</u-form>

		</customCard>
		<view style="position: fixed; bottom: 110rpx; right: 40rpx; z-index: 1500;" @click="clickFab" v-if="showBtn">
			<u-icon name="plus-circle-fill" size="120" class="u-type-primary"></u-icon>
		</view>
		<view class="footer">
			<u-button type="primary" throttle-time="2500" v-if="pageType && !showComplate" @click="submitParts">提交
			</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import customCard from '@/components/customCard.vue'
	import config from '@/common/config.js'
	import uniFab from '@/pages/order/components/uni-fab/uni-fab.vue';
	export default {
		components: {
			customCard
		},
		data() {
			return {
				configAll: this.config,
				role: '', //角色
				wdjb: uni.getStorageSync('userInfo').wdjb, //网点级别 一级网点 二级网点 
				//发货、付款方式
				fhfsLable: '', //发货方式显示label值 
				fkfsLable: '', //付款方式显示label值
				city: '', //选择完地址显示值
				showfhfs: false,
				showfkfs: false,
				fhfsList: uni.getStorageSync('fhfsListOption'), //发货方式list
				fkfsList: uni.getStorageSync('fkfsListOption'), //付款方式list
				//
				label_width: '200rpx',
				//网点负责人
				showPaiShiFu: false,
				shifuValue: '',
				showSelectPaiShiFu: false,
				shifuList: [], //获取师傅列表
				shifuForm: {},
				//
				signNameImgSrc: '', //签名图片
				//完工服务 保养单或维修单状态 完工信息内容显示逻辑
				pjmxIndexPrice: '', //配件总和 费用
				checked: false,
				showSelect: false,
				listSelect: [],
				faultValue: '',
				serverSheetList: [], //服务措施
				showServer: false,
				serverValue: '',
				gzlb: {
					yjgz: '',
					ejgz: '',
					sjgz: ''
				},
				gdlx: uni.getStorageSync('gdlx') || '',
				allPrice: '', //总应收合计
				serverMoney: 0,
				serverMoneyRemark: '',
				showServerMoneyAdd: false,
				//
				formComplateStyle: {
					width: '100%',
					paddingLeft: '10rpx'
				},
				OrderStatus: '',
				identicalData: true,
				showMap: false,
				showYwg: false,
				showBtn: false,
				apiForm: '',
				apiFormAll: '',
				imgLength: 0,
				imgText: '上传图片(0/4)',
				// 完工服务上传图片
				filename: 'headImage',
				formData: {
					'accept': 'image/*'
				},
				action: `${config.url}/admin/attachment/upload/?uploadName=headImage`,
				stepCurrent: 0, //后面调试完改为0
				customStyle: {
					borderRadius: '0',
				},
				//完工服务
				numList: [{
					name: '完善产品'
				}, {
					name: '添加用料'
				}, {
					name: '完工信息'
				}, {
					name: '客户确认'
				}],
				// 完成服务 显示 后面调试完 改为false
				showComplate: false,
				type: 'number',
				valInput: '0124',
				apiList: [], //上一页面 选择数量之后的数组
				relationOrder_id: '', //工单编号
				pattern: {
					buttonColor: '#2979ff'
				},
				//申请单明细列表
				list: [],
				//配件申请单基础信息
				formParts: {},
				addressnNme: '',
				// 上一页面进入类型 pageType值为parts表示配件申请进入
				pageType: '',
				//退回原因
				showReturn: false,
				comboboxLabel: "",
				comboboxApiVal: '',
				returnSheetList: [],
				//预约失败原因
				showResult: false,
				valueResult: '',
				actionSheetList: [],
				//改约原因
				showRenegotiation: false,
				renegotiationResult: '',
				renegotiationSheetList: [],
				//改约时间
				showRenegotiationDate: false,
				renegotiationDateResult: '',
				showDate: false,
				createSuccsee: false,
				covers: [{ //地图
					latitude: 39.909,
					longitude: 116.39742,
					// iconPath: '/static/location.png'
				}],
				latitude: '', //经度
				longitude: '', //纬度
				address: '', //详细地址
				show: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				listWayData: [],
				loglist: [],
				valueActivedParts: '提交申请',
				valueActiveAppointment: '预约成功', //待预约默认选中按钮
				valueActiveComplate: '退回工单', //待完工默认选中按钮
				listWayDataParts: [],
				noClick: true, //是否重复点击
				//表单输入项
				glkhbh: '', //关联客户编号
				_gmqd_: '', //购买渠道页面显示
				formComplate: {
					snm: '',
					warrantyTime: '12' //延保时长（天）
				},
				problemDesc: '',
				form: {},
				apiOption: { //工单列表 提交申请参数
					workitem_id: '',
					case_id: '',
					valueKey: '', //value对象的键值对里面的键key
					//预约日期选择
					appointmentDate: '',
					//办理备注
					handleRemarks: ''
				},
				apiOptionParts: { //配件申请提交 参数
					// case_id: '',
					details: [], //配件申请信息 数组
					handleWay: '', //办理方式名称 如 '提交申请'
					handleRemarks: '', //办理备注
					data: {
						pjzje: 0,
						pjzsl: 0,
						spjlxr: '',
						spjlxdh: '',
						cityname: '',
						spjdqssqjd: {
							details: ''
						},
						pjfj: [
							// 	{
							// 	name: '整机SN码图',
							// 	enName: 'sn',
							// 	value: '',
							// }, {
							// 	name: '故障所需物料图',
							// 	enName: 'fault',
							// 	value: '',
							// }, {
							// 	name: '开箱图',
							// 	enName: 'box',
							// 	value: '',
							// }, 
							{
								name: '照片（选填）',
								enName: 'other',
								value: '',
							}
						],
						// snm: '',
					} //接口返回的 data
				},
				handleInstallDesc: '', //师傅安装情况描述
				imgList: [],
				cityList: uni.getStorageSync('cityListOption'),
				showCity: false,
			}
		},
		onLoad(option) {
			const globalData = getApp().globalData
			//先判断是否缓存，若缓存不用请求，避免多次重复请求
			if (!uni.getStorageSync('cityListOption')) {
				this.$u.post('/app/Setting/getCityAddress', {}).then(res => {
					uni.setStorageSync('cityListOption', res.result)
				})
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
			let userInfo = uni.getStorageSync('userInfo')
			if (userInfo.roleid == "a942fdfe5c81e07417d5f1eed98d027a") {
				//网点负责人
				this.role = 'fzr'
			} else {
				//师傅端
				this.role = 'sf'
			}
			this.relationOrder_id = option.relationOrder_id || ''
			let apiList = globalData.apiList
			this.choiceList = globalData.choiceList
			if (apiList) { //option.apiList 原先
				//上一页面 选择申请数量之后组成的数组 直接传接口参数details（配件申请信息 数组类型）
				this.apiOptionParts.details = apiList //JSON.parse(option.apiList) //原先的 apiList
			}
			if (option.pjzje) {
				this.apiOptionParts.data.pjzje = Number(option.pjzje).toFixed(2)
				this.apiOptionParts.data.pjzsl = Number(option.pjzsl)
			}
			//配件申请进来
			if (option.pageType) {
				this.pageType = option.pageType
				uni.setNavigationBarTitle({
					title: '配件申请单'
				});
				this.getPartsOrderInfo() //获取配件申请单详情
			}
		},
		//完工步骤 产品选择产品之后 返回原页面
		onShow() {
			let img = uni.getStorageSync('signNameImg')
			if (img) {
				this.signNameImgSrc = this.config.url + img.result.filePath
			}
			let product = uni.getStorageSync('product')
			if (product) {
				let newData = Object.assign({}, product, {
					warrantyTime: '13'
				})
				let oldData = this.formComplate
				if (newData.glcpbh == oldData.glcpbh) {
					this.identicalData = true
					uni.setStorageSync('dataFalt', 0)
				} else {
					this.identicalData = false
					uni.setStorageSync('dataFalt', 1)
					this.formComplate = newData
					uni.setStorageSync('formComplate', newData)
					this.$store.commit('setFormComplate', newData)
				}
				this.$store.commit('setproduct', {})
				uni.removeStorageSync('product')
			} else if (uni.getStorageSync('dataFalt') == '0') {
				this.identicalData = true
			} else if (uni.getStorageSync('dataFalt') == '1') {
				this.identicalData = false
			} else {}
			//添加用料完 跳转回到该页面
			let oldformComplate = uni.getStorageSync('oldformComplate')
			if (oldformComplate) {
				this.formComplate = oldformComplate
				uni.removeStorageSync('oldformComplate')
			}
		},
		methods: {
			confirmCity(e) {
				let city = []
				this.apiOptionParts.data.spjdqssqjd.address = e[2].value
				e.map(item => {
					city.push(item.label)
				})
				this.apiOptionParts.data.cityname = city.join('/')
			},
			onBlur(val) {
				this.apiOptionParts.data.snm = val
			},
			getCityData() {
				this.showCity = true
				this.cityList = uni.getStorageSync('cityListOption')
			},
			// 选择级联列表 故障类别 内容 点击确认后回调
			confirmSelect(e) {
				this.faultValue = `${e[0].label}/${e[1].label}/${e[2].label}`
				this.gzlb.yjgz = e[0].value
				this.gzlb.ejgz = e[1].value
				this.gzlb.sjgz = e[2].value
				let par = {
					gzlist: e
				}
				this.$u.post('/app/Setting/getfwcslist', par).then(res => {
					this.serverSheetList = []
					res.result.forEach((item, index) => {
						this.serverSheetList.push({
							text: item.value //lable
						})
					})
				})
			},
			// 添加图片
			getImg(data, item, index) {
				item.value = data.result
				this.apiOptionParts.data.pjfj.splice(index, 1, item)
			},
			// 移除图片
			removeImg(item, index) {
				item.value = ''
				this.apiOptionParts.data.pjfj.splice(index, 1, item)
			},
			goAddPart() {
				uni.setStorageSync('oldformComplate', this.formComplate)
				let cpbh = this.formComplate.glcpbh
				uni.navigateTo({
					url: `/pages/order/addParts?complate=1&cpbh=${cpbh}`
				});
			},
			//完工页点击返回
			goback() {
				this.stepCurrent = 0
				this.showComplate = false

				this.apiForm = ''
			},
			valChange(item, index) {
				let price = 0
				let quantity = 0
				let that = this
				let detailes = that.apiOptionParts.details
				detailes.forEach(sItem => {
					price += parseFloat(Number(sItem.price) * sItem.sqsl)
					quantity += parseInt(sItem.sqsl)
				})
				this.apiOptionParts.data.pjzje = Number(price).toFixed(2) //配件申请总金额
				this.apiOptionParts.data.pjzsl = quantity //配件申请总数量

				const globalData = getApp().globalData
				//以下新增
				let choiceList = globalData.choiceList
				choiceList.forEach((sitem, sindex) => {
					if (item.glpjbh == sitem.pjbh) {
						sitem.reworkNumber = item.sqsl
					}
				})
			},
			//配件申请数量修改
			changeValNum(e, bItem, index) {
				this.apiOptionParts.details[index].sqsl = Number(e)
			},
			//跳转回到选择配件列表界面 
			go_addParts() {
				uni.navigateBack({
					delta: 1
				})
			},
			//配件申请单详情 发起配件申请
			getPartsOrderInfo() {
				let data = {
					glgdbh: this.relationOrder_id || '',
					workflow_id: '721ed9f42695ca9fb37613c3cf9a5395'
				}
				this.$u.post('/app/WorkOrder/wcaseadd', data).then(res => {
					this.formParts = res.result.data //配件单基础信息
					this.addressnNme = res.result.data.cityname
					// this.valueActivedParts = res.result.wayData[0].way
					// this.listWayDataParts = res.result.wayData //配件单办理方式
					//配件单办理方式 云米办理方式先写死 只有一个提交申请handleWay: "tj"
					this.listWayDataParts = [{
						alias: "tj",
						rule: [{
							field: "",
							status: "",
							mandatory: ""
						}],
						way: "提交申请"
					}]
					this.apiOptionParts.data = Object.assign(this.apiOptionParts.data, res.result.data)
					const globalData = getApp().globalData
					this.apiOptionParts.data.snm = globalData.snm
					this.apiOptionParts.handleWay = 'tj' //res.result.wayData[0].way 写死默认 tj
				}).catch()
			},
			//悬浮按钮点击事件
			clickFab() {
				let relationOrder_id = this.relationOrder_id
				uni.navigateTo({
					url: `/pages/order/addParts?relationOrder_id=${relationOrder_id}&pageType=parts`
				})
			},
			//扫码
			scan() {
				uni.scanCode({
					success: res => {
						this.$set(this.apiOptionParts.data, 'snm', res.result)
					}
				})
			},
			//提交配件申请单
			submitParts() {
				const globalData = getApp().globalData
				if (this.apiOptionParts.data.spjlxr == '') {
					this.$u.toast("请输入收配件姓名")
					return
				}
				if (this.apiOptionParts.data.spjlxdh == '') {
					this.$u.toast("请输入收配件电话")
					return
				}
				if (!this.$u.test.mobile(this.apiOptionParts.data.spjlxdh)) {
					this.$u.toast("电话号码格式有误，请检查")
					return
				}
				if (this.apiOptionParts.data.cityname == '') {
					this.$u.toast("请输入收配件地址")
					return
				}
				if (this.apiOptionParts.data.spjdqssqjd.details == '') {
					this.$u.toast("请输入收配件详细地址")
					return
				}
				const pjAll = []
				for (let i = 0; i < this.apiOptionParts.data.pjfj.length; i++) {
					const item = this.apiOptionParts.data.pjfj[i]
					if (!item.value && item.enName !== 'other') {
						this.$u.toast(`请上传${item.name}`)
						return
					}
					if (item.value) {
						pjAll.push(item.value)
					}
				}
				// if (this.apiOptionParts.handleRemarks == '') {
				// 	this.$u.toast("请输入描述故障情况和申请原因")
				// 	return
				// }
				const that = this
				if (that.apiOptionParts.data.pjzsl === 0) { //配件申请总数量 ，//	判断配件数量为0  不给提交
					that.$u.toast("当前申请总数不能为0")
					return
				}
				let kyed = Number(that.formParts.kyed) // 网点可用额度
				let pjzje = Number(that.apiOptionParts.data.pjzje) // 配件申请总计金额
				// 付款方式
				if (that.fkfsLable == '使用网点余额' && kyed < pjzje) {
					that.$u.toast("当前网点可用额度不足以支付")
					return
				}
				let detailsList = that.apiOptionParts.details
				let paramsList = []
				detailsList.forEach((item, index) => {
					paramsList.push({
						glpjbh: item.glpjbh,
						sqsl: item.sqsl
					})
				})
				let praData = JSON.parse(JSON.stringify(that.apiOptionParts.data))
				let formPar = Object.assign(praData, {
					glgdbh: this.relationOrder_id
				})
				let params = Object.assign({}, {
					data: formPar,
					details: paramsList, //筛选后的配件申请明细 配件编号跟申请数量
					handleRemarks: that.apiOptionParts.handleRemarks,
					handleWay: that.apiOptionParts.handleWay,
					openid: uni.getStorageSync('openid')
				})
				params.data.fkfs = 'sywdye' //付款方式默认值 设置 使用网点余额
				params.data.pjfj = pjAll
				that.submitApiparam(params) //无需在线支付  如办理方式选择了网点余额 或线下付款  直接提交即可
			},
			//提交配件申请所需参数函数
			submitApiparam(apiPar) {
				this.$u.post('/app/WorkOrder/addPjcase', apiPar).then(res => {
					if (res.code == 0) {
						this.$refs.uToast.show({
							type: 'success',
							title: '提交配件申请成功',
							callback: () => {
								this.tragettomypartOrder()
							}
						})
					} else {
						this.$u.toast(res.message)
					}
				}).catch()
			},
			//提交配件申请工单成功，跳转至我的配件申请单
			tragettomypartOrder() {
				uni.removeStorageSync('newList') //清空原页面缓存选择的配件列表
				uni.removeStorageSync('allNewList') //清空页面缓存选择的配件列表 -》对应更改配件数量的逻辑
				// uni.switchTab({ //原先是跳到配件申请单页面
				// 	url: '/pages/parts/parts'
				// })
				uni.navigateBack({ //返回工单详情页
					delta: 2
				});
			},
			//配件申请单办理方式选择其中一项change操作
			radioChangeParts(item, index) {
				this.apiOptionParts.handleWay = item.way
			},
		}
	}
</script>
<style lang="scss" scoped>
	// @import 'index.scss';
	@import '../order/modulePublic/scss/public.scss';

	/deep/.u-col {
		padding: 0 !important;
	}

	//折叠面板
	/deep/.u-collapse {
		background-color: white;

		.u-collapse-item {
			border: 1rpx solid $u-border-color;
			margin-bottom: 16rpx;
		}

		.u-collapse-head {
			font-weight: bold;
			background: $u-type-info-light;
			padding: 24rpx !important;
		}

		//内容主体栏
		.body_content {
			padding: 0 32rpx;
		}

		.clearScrollBar {
			&::-webkit-scrollbar {
				display: none;
			}
		}
	}

	.all-container {
		height: 100%;
		overflow: scroll !important;
		padding-bottom: 200rpx;

		/deep/.u-collapse-body {
			overflow: scroll !important;
		}

		/deep/.u-form-item--right__content__slot {
			//右边内容行  小程序显示异常解决  h5不加这个也正常显示
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		//配件申请明细里面内容
		.partItem {
			background-color: #FFFFFF;

			view:nth-of-type(1) {
				color: $u-main-color;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			view {
				color: $u-tips-color;
			}
		}

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

		//uni-fab按钮样式
		/deep/ .uni-fab,
		/deep/.uni-fab__circle {
			margin-bottom: 100rpx;
		}
	}

	.flex_center {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
