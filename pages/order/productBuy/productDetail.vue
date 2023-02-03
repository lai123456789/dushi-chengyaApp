<template>
	<view class="all-container">
		<u-toast ref="uToast" />
		<!-- 产品申请单详情页面 -->
		<u-card title="产品申请单信息" :body-style="{padding: '0rpx 32rpx'}">
			<u-form slot="body">
				<u-form-item label="产品申请单号 " label-width="200rpx">
					<view class="u-content-color">{{apiOptionParts.data.gdbh}}</view>
				</u-form-item>
				<u-form-item label="工单类型" label-width="200rpx">
					<view class="u-content-color">{{apiOptionParts.data.gdlx}}</view>
				</u-form-item>
				<u-form-item label="创建人" label-width="200rpx">
					<view class="u-content-color">{{apiOptionParts.data.cjr}}</view>
				</u-form-item>
				<u-form-item label="创建时间" label-width="200rpx">
					<view>{{apiOptionParts.data.cjsj}}</view>
				</u-form-item>
				<u-form-item label="申请仓库名称" label-width="200rpx">
					<view>{{apiOptionParts.data.sqckmc}}</view>
				</u-form-item>
				<u-form-item label="申请仓库编号" label-width="200rpx">
					<view>{{apiOptionParts.data.sqckbh}}</view>
				</u-form-item>
				<u-form-item label="收件联系人" label-width="200rpx">
					<u-input v-model="apiOptionParts.data.sjlxr" type="text" border></u-input>
				</u-form-item>
				<u-form-item label="收件联系方式" label-width="200rpx">
					<u-input v-model="apiOptionParts.data.sjlxdh" type="number" border></u-input>
				</u-form-item>
				<u-form-item label="收件地址(省市区)" label-width="200rpx">
					<u-select v-model="show" :list="cityList" mode="mutil-column-auto" child-name="children" value-name="value"
					 label-name="label" @confirm="confirmCity"></u-select>
					<u-input placeholder="请选择客户地址省市区" v-model="apiOptionParts.data.address.address" :disabled="true" @click="getCityData"
					 border></u-input>
				</u-form-item>
				<u-form-item label="收件详细地址" label-width="200rpx">
					<u-input placeholder="请输入客户详细地址" v-model="apiOptionParts.data.sjdz.details" border></u-input>
				</u-form-item>
				<!-- <u-form-item label="收件地址" label-width="200rpx">
					<u-input v-model="formParts.sjdz" type="textarea" border class="u-flex-1"></u-input>
				</u-form-item> -->
				<!-- 	<u-form-item label="收产品详细地址" :border="false" label-width="200rpx">
					<u-input v-model="formParts.sjlxr" type="text" border class="u-flex-1"></u-input>
				</u-form-item> -->

			</u-form>

		</u-card>
		<u-card :body-style="{padding: '0rpx 32rpx'}">
			<view slot="head" class="u-flex u-row-between u-col-center">
				<view class="title">产品申请明细</view>
				<u-icon name="plus-circle-fill" color="#007AFF" size="45" @click="go_addParts"></u-icon>
			</view>
			<view class="body_content clearScrollBar" slot="body">
				<view class="u-flex u-border-bottom u-p-t-24 u-p-b-32" v-for="(item,index) in apiOptionParts.details" :key="index">
					<u-image :src="item.pjtp" width="180rpx" height="180rpx"></u-image>
					<view class="u-m-l-10 u-flex-1">
						<u-row>
							<u-col span="5">
								<view class="u-p-t-10 u-p-b-12 u-p-l-10 u-main-color u-line-1">{{item.pjmc}}</view>
							</u-col>
							<u-col span="7">
								<view class="u-text-right">
									<u-number-box min="1" v-model="item.sqsl" @change="valChange(item,index)"></u-number-box>
								</view>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="4">
								<view class="u-content-color u-text-right">产品编号：</view>
							</u-col>
							<u-col span="8">
								<view class="u-main-color u-flex-1 u-line-2">{{item.glpjbh}}</view>
							</u-col>
						</u-row>
						<u-row>
							<u-col span="4">
								<view class="u-content-color u-text-right">产品型号：</view>
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
				<!-- <view class="u-m-t-20 u-m-b-20 u-flex u-row-right"><text>总计：</text><text class="u-type-error">￥{{apiOptionParts.data.pjzje}}</text></view> -->
				<view class="u-m-t-20 u-m-b-20 u-flex u-row-right"><text>总计：</text><text class="u-type-error">￥{{cpsqzje}}</text></view>

			</view>

		</u-card>

		<u-card title="工单办理" :body-style="{padding: '0rpx 32rpx'}">
			<u-form :model="form" slot="body" ref="uForm">
				<u-form-item label="办理方式" label-width="200" v-if="listWayDataParts.length > 0">
					<u-radio-group v-model="valueActivedParts" :wrap="true">
						<u-radio :key="index" v-for="(item, index) in listWayDataParts" :name="item.way" :disabled="false" @change="radioChangeParts(item,index)">
							<view style="color: #303133;font-size: 28rpx;">{{item.way}}</view>
						</u-radio>
					</u-radio-group>
				</u-form-item>

				<u-form-item label="发货方式" label-width="200rpx">
					<u-input class="u-flex-1" placeholder="请选择" v-model="fhfsLable" type="select" :border="false" @click="fhfsClick" />
					<u-select v-model="showfhfs" :list="fhfsList" @confirm="confirmfhfs"></u-select>
				</u-form-item>
				<u-form-item v-if="role == 'fzr' && wdjb == '一级网点'" label="付款方式" label-width="200rpx">
					<!-- <u-input class="u-flex-1" placeholder="请选择" v-model="fkfsLable" type="select" :border="false" @click="fkfsClick" />
					<u-select v-model="showfkfs" :list="fkfsList" @confirm="confirmfkfs"></u-select> -->
					<view>线下支付</view>
				</u-form-item>

				<u-form-item label="付款凭证" label-width="200rpx">
					<view style="margin-left: -8rpx;">
						<u-upload @on-success="successCallback" :max-size="8 * 1024 * 1024" :max-count="1" :action="action" :name="filename"
						 @on-remove="onRemove" :form-data="formData" :show-progress="false"></u-upload>
					</view>
				</u-form-item>

				<u-form-item label="办理备注" label-width="200">
					<u-input type="textarea" v-model="apiOptionParts.handleRemarks" :border="true" style="width: 100%;" />
				</u-form-item>
			</u-form>

		</u-card>


		<view class="footer">
			<!--产品申请提交-->
			<u-button type="primary" throttle-time="2500" @click="submitParts">提交</u-button>
		</view>
	</view>
</template>
<script>
	import AdaPay from '@/common/adapay_sdk/adaPay.js'
	export default {
		components: {},
		data() {
			return {
				//上传图片所需参数
				filename: 'headImage',
				formData: {
					'accept': 'image/*'
				},
				action: `${this.config.url}/admin/attachment/upload/?uploadName=headImage`,
				imgLength: 0, //图片数量
				imgText: '', //图片数量描述文字
				imgList: [], //上传图片回调数组作为参数数组传到接口 格式为 [{fileName:"aqzfawef45454.jpg",filePath:"/upload//2021/01/07/20210.jpg"}]

				cityList: uni.getStorageSync('cityListOption'), //省市区级联数据
				role: '', //角色
				wdjb: uni.getStorageSync('userInfo').userinfo.wdjb, //网点级别 一级网点 二级网点 
				//发货、付款方式
				fhfsLable: '', //发货方式显示label值 
				fkfsLable: '', //付款方式显示label值
				city: '', //选择完地址显示值
				showfhfs: false,
				showfkfs: false,
				fhfsList: uni.getStorageSync('fhfsListOption'), //发货方式list
				fkfsList: uni.getStorageSync('fkfsListOption'), //付款方式list
				//
				//完工服务 保养单或维修单状态 完工信息内容显示逻辑
				pjmxIndexPrice: '', //产品总和 费用
				gdlx: uni.getStorageSync('gdlx') || '',
				identicalData: true,
				apiList: [], //上一页面 选择数量之后的数组
				//申请单明细列表
				list: [{
					name: '新云产品',
					number: '1545',
					price: '29',
					brand: '中国制造',
					utletsInventory: '3'
				}, {
					name: '测试产品',
					number: '1578',
					price: '17',
					brand: '新云',
					utletsInventory: '4'
				}, {
					name: '测试产品',
					number: '1578',
					price: '17',
					brand: '新云',
					utletsInventory: '4'
				}],
				//产品申请单基础信息
				formParts: {

				},
				addressnNme: '',
				show: false,
				valueActivedParts: '',
				listWayDataParts: [],
				//表单输入项
				formComplate: {
					snm: '',
					warrantyTime: '12' //延保时长（天）
				},

				cpsqzje: 0, //产品申请总金额 页面显示
				apiOptionParts: { //产品申请提交 参数
					// case_id: '',
					details: [], //产品申请信息 数组
					handleWay: '', //办理方式名称 如 '提交申请'
					handleRemarks: '', //办理备注
					data: {
						// pjzje: 0,
						// pjzsl: 0
					} //接口返回的 data
				},
			}
		},
		onLoad(option) {
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
			if (userInfo.userinfo.roleid == "a942fdfe5c81e07417d5f1eed98d027a") {
				//网点负责人
				this.role = 'fzr'
			} else {
				//师傅端
				this.role = 'sf'
			}
			if (option.apiList) {
				//上一页面 选择申请数量之后组成的数组 直接传接口参数details（产品申请信息 数组类型）
				this.apiOptionParts.details = JSON.parse(option.apiList)

				this.cpsqzje = Number(option.pjzje).toFixed(2)
				// this.apiOptionParts.data.pjzje = Number(option.pjzje).toFixed(2)
				// this.apiOptionParts.data.pjzsl = Number(option.pjzsl)
			}
			this.getPartsOrderInfo() //发起产品 获取产品申请单信息 如办理方式 工单信息 申请明细


			//省市区级联数据
			if (!uni.getStorageSync('cityListOption')) {
				this.$u.post('/app/Setting/getCityAddress', {}).then(res => {
					uni.setStorageSync('cityListOption', res.result)
				})
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
				console.log(this.formComplate, "this.formComplatethis这里最终");
				uni.removeStorageSync('oldformComplate')
			}
		},
		methods: {
			//上传图片成功返回的信息 格式如上
			successCallback(data, index, lists) {
				console.log(lists)
				this.imgLength = index + 1
				this.imgText = `上传图片(${index+1}/4)`
				let imgList = []
				lists.forEach((item, index) => {
					imgList.push(item.response.result)
				})
				this.imgList = imgList
			},
			//移除图片事件
			onRemove(index, lists, name) {
				this.imgList.splice(index, 1) //删除图片
			},
			confirmCity(e) {
				let city = []
				this.apiOptionParts.data.sjdz.address = e[2].value
				e.map(item => {
					city.push(item.label)
				})
				this.apiOptionParts.data.address.address = city.join('/')
			},
			getCityData() {
				this.show = true
				this.cityList = uni.getStorageSync('cityListOption')
			},
			confirmfhfs(e) {
				console.log(e)
				this.fhfsLable = e[0].label
				this.apiOptionParts.data.fhfs = e[0].value
			},
			confirmfkfs(e) {
				console.log(e)
				this.fkfsLable = e[0].label
				this.apiOptionParts.data.fkfs = e[0].value
			},
			fhfsClick() {
				this.showfhfs = true
				this.fhfsList = uni.getStorageSync('fhfsListOption')
			},
			fkfsClick() {
				this.showfkfs = true
				this.fkfsList = uni.getStorageSync('fkfsListOption')
			},
			goAddPart() {
				uni.setStorageSync('oldformComplate', this.formComplate)
				let cpbh = this.formComplate.glcpbh
				console.log("this.formComplate");
				console.log(this.formComplate);
				uni.navigateTo({
					url: `/pages/order/addParts?complate=1&cpbh=${cpbh}`
				});
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
				console.log(this.apiOptionParts);

				this.cpsqzje = Number(price).toFixed(2) //产品申请总金额
				// this.apiOptionParts.data.pjzje = Number(price).toFixed(2) //产品申请总金额
				// this.apiOptionParts.data.pjzsl = quantity //产品申请总数量
				console.log(price, "price");

				//更新产品数量后 点击+图标返回上一页 需把当前页面的产品数量更新到上一页 同步
				//以下新增
				let allList = uni.getStorageSync('allNewList')
				allList.forEach((sitem, sindex) => {
					if (item.glpjbh == sitem.cpbh) {
						sitem.reworkNumber = item.sqsl
					}
				})
				uni.setStorageSync('allNewList', allList)


			},
			//产品申请数量修改
			changeValNum(e, bItem, index) {
				this.apiOptionParts.details[index].sqsl = Number(e)
			},
			//跳转回到选择产品列表界面 
			go_addParts() {
				uni.navigateBack({
					delta: 1
				})
			},
			//产品申请单详情 发起产品申请
			getPartsOrderInfo() {
				this.$u.post('/app/WorkOrder/BuyCpCase', {}).then(res => {
					this.formParts = res.result.data //产品单基础信息
					// this.addressnNme = res.result.data.cityname.replace(/,/g, "") + res.result.data.spjxxdz
					this.listWayDataParts = res.result.wayData //产品单办理方式
					this.valueActivedParts = res.result.wayData[0].way
					this.apiOptionParts.handleWay = res.result.wayData[0].way
					this.apiOptionParts.data = Object.assign(this.apiOptionParts.data, res.result.data)
				}).catch()
			},
			//提交产品申请单
			submitParts() {
				// if (this.fkfsLable == '' && this.role == 'fzr' && this.wdjb == '一级网点') {
				// 	this.$u.toast("请选择付款方式")
				// 	return
				// }

				// let kyed = Number(this.formParts.kyed) //网点可用额度
				// let pjzje = Number(this.apiOptionParts.data.pjzje) //产品申请总计金额
				// //付款方式
				// if (this.fkfsLable == '使用网点余额') {
				// 	if (kyed < pjzje) {
				// 		this.$u.toast("当前网点可用额度不足以支付")
				// 		return
				// 	}
				// }
				let t = this
				//////////////提交参数如下start
				let detailsList = this.apiOptionParts.details
				let paramsList = []
				detailsList.forEach((item, index) => {
					paramsList.push({
						// glpjbh: item.glpjbh,
						cpbh: item.glpjbh,
						sqsl: item.sqsl
					})
				})
				let params = {
					data: Object.assign(this.apiOptionParts.data, {
						fkfs: 'xxzf',
						fkpz: this.imgList
					}),
					details: paramsList, //筛选后的产品申请明细 产品编号跟申请数量
					handleRemarks: this.apiOptionParts.handleRemarks,
					handleWay: this.apiOptionParts.handleWay,
					openid: uni.getStorageSync('openid')
				}
				///////////参数 end
				if (this.fkfsLable == '在线支付' && pjzje > 0) {
					this.$u.post('/app/workOrder/getOrderpjsq', params).then(res => {
						if (res.code == 0) {
							if (res.result.status == 'succeeded') { //发起支付 根据该字段标识 是否吊起支付控件
								let payment = res.result
								AdaPay.doPay(payment, (res) => {
									//支付结果参数
									console.log(res)
									if (res.result_status == 'succeeded') { //支付成功
										//调用提交方法
										let apiPar = Object.assign(params, {
											order_no: res.result_info.order_no
										})
										t.submitApiparam(apiPar)
									} else {
										//取消支付
										t.$u.toast('支付已取消')
									}
								})
							}
						} else { //res.code 不为0的时候 接口返回报错信息
							this.$u.toast(res.message)
						}

					}).catch()

				} else { //无需在线支付  如办理方式选择了网点余额 或线下付款  直接提交即可
					t.submitApiparam(params)
				}
			},
			//提交产品申请所需参数函数
			submitApiparam(apiPar) {
				this.$u.post('/app/WorkOrder/addCpcase', apiPar).then(res => {
					if (res.code == 0) {
						uni.removeStorageSync('newList') //清空原页面缓存选择的产品列表
						uni.removeStorageSync('allNewList') //清空页面缓存选择的产品列表 -》对应更改产品数量的逻辑
						this.$refs.uToast.show({
							title: '提交产品申请成功',
							type: 'success'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: './productOrder'
							});
						}, 1500)
					} else {
						this.$u.toast(res.message)
					}
				}).catch()

			},
		}
	}
</script>
<style lang="scss" scoped>
	// @import 'index.scss';
	// @import './modulePublic/scss/public.scss';
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

		//产品申请明细里面内容
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
	}
</style>
