<template>
	<view style="padding-bottom: 300rpx;">
		<u-navbar back-text="返回" title="服务单" :background="background" :back-text-style="backstyle" back-icon-color="#FFF"
		 title-color="#FFF" :custom-back="customBack">
		</u-navbar>
		<u-collapse :accordion="false">
			<u-collapse-item :open="true">
				<view slot="title">
					<view class="head_content">
						<view class="title">客户信息</view>
					</view>
				</view>
				<view class="u-p-l-32 u-p-r-32">
					<u-form :model="form" ref="uForm1">
						<u-form-item label="客户姓名" label-width="200rpx" :required="true">
							<!--  prop="khmc" -->
							<u-input placeholder="请输入客户姓名" v-model="form.khmc"></u-input>
						</u-form-item>
						<u-form-item label="客户电话1" label-width="200rpx" :required="true">
							<!--  prop="khdh1" -->
							<u-input placeholder="请输入客户电话" v-model="form.khdh1"></u-input>
							<u-icon name="search" size="40" slot="right" @click="gocustomerinfo"></u-icon>
						</u-form-item>
						<u-form-item label="客户电话2" label-width="200rpx">
							<u-input placeholder="请输入客户电话" v-model="form.khdh2"></u-input>
						</u-form-item>
						<u-form-item label="客户电话3" label-width="200rpx">
							<u-input placeholder="请输入客户电话" v-model="form.khdh3"></u-input>
						</u-form-item>
						<u-form-item label="性别" label-width="200rpx">
							<u-input placeholder="请选择性别" type="text" :disabled="true" @click="showReturn=true" v-model="form.xb" />
							<u-select v-model="showReturn" :list="generalList.xb" mode="single-column" @confirm="returnSheetCallback"></u-select>
						</u-form-item>
						<u-form-item label="省市区" label-width="200rpx" :required="true">
							<u-select v-model="show" :list="cityList" mode="mutil-column-auto" child-name="children" value-name="value"
							 label-name="label" @confirm="confirmCity"></u-select>
							<u-input placeholder="请选择客户地址省市区" v-model="city" :disabled="true" @click="getCityData"></u-input>
						</u-form-item>
						<u-form-item label="详细地址" label-width="200rpx" :required="true">
							<u-input placeholder="请输入客户详细地址" v-model="form.ssq.details"></u-input>
						</u-form-item>
					</u-form>

				</view>
			</u-collapse-item>
			<u-gap></u-gap>
			<u-collapse-item :open="true">
				<view slot="title">
					<view class="head_content">
						<view class="title">产品信息</view>
					</view>
				</view>
				<view class="u-p-l-32 u-p-r-32">
					<u-form :model="form" ref="uForm2">
						<u-form-item label="出厂编码" label-width="200" :required="true" prop="snm">
							<u-input placeholder="请输入MA-开头的数字" type="text" v-model="form.snm" @input="inputSnm($event)" />
							<u-icon class="icon-style" name="scan" size="40" slot="right" @click="scan"></u-icon>
						</u-form-item>
						<u-form-item label="产品名称" label-width="200">
							<u-input placeholder="请搜索产品名称" type="text" v-model="form.cpmc" disabled />
							<!--:disabled="isEdit"-->
							<u-icon name="search" size="40" slot="right" @click="goproductinfo"></u-icon>
						</u-form-item>
						<!-- <u-form-item label="产品型号" label-width="200">
							<u-input placeholder="请输入产品型号" type="text" v-model="form.cpxh" />
							<u-icon name="search" size="40" slot="right" @click="goproductinfo"></u-icon>
						</u-form-item> -->
						<u-form-item label="产品分类" label-width="200" :required="true" prop="chanpin_fl">
							<view v-if="isEdit">{{chanpin_flLabel}}</view>
							<u-input v-else placeholder="请选择产品分类" type="select" v-model="chanpin_flLabel" @click="popupShow = true" />
						</u-form-item>
						<u-form-item label="产品型号" label-width="200" :required="true">
							<!--原先是产品类别-->
							<u-input placeholder="请选择产品型号" @click="prompt" disabled v-model="cpxhLabel" />
						</u-form-item>
						<u-form-item label="购买日期" label-width="200" :required="true" prop="gmrq">
							<view>
								<u-input placeholder="请输入购买日期" type="text" @click="dateshow = true" :disabled="true" v-model="form.gmrq" />
							</view>

						</u-form-item>
						<u-form-item label="购买渠道" label-width="200">
							<u-input placeholder="请选择购买渠道" type="text" :disabled="true" @click="showchannel=true" v-model="form.gmqd" />
							<u-select v-model="showchannel" :list="generalList.gmqd" mode="single-column" @confirm="getchannel"></u-select>
						</u-form-item>
						<u-form-item label="质保期(月)" label-width="200">
							<u-input type="number" v-model="form.bxszy" />
						</u-form-item>
						<u-form-item label="质保到期日" label-width="200" :custom-style="formComplateStyle">
							<u-input type="dateshow" placeholder="输入质保日期" :disabled="true" v-model="form.zbdqr" />
							<u-calendar mode="date" @change="setdate2"></u-calendar>
						</u-form-item>
						<u-form-item label="质保剩余天数" label-width="200" :custom-style="formComplateStyle">
							<u-input type="number" v-model="form.zbsyts" :disabled="true" />
						</u-form-item>
					</u-form>
					<u-calendar v-model="dateshow" mode="date" @change="setdate"></u-calendar>
				</view>
			</u-collapse-item>
			<u-gap></u-gap>
			<u-collapse-item :open="true">
				<view slot="title">
					<view>
						<view class="title">工单信息</view>
					</view>
				</view>
				<view class="u-p-l-32 u-p-r-32">
					<u-form :model="form">
						<u-form-item label="服务项目" label-width="200" :required="true">
							<u-input placeholder="请选择服务项目" v-model="OrderType" type="select" @click="getOrderType" :disabled="true" />
							<u-select v-model="showOrder" :list="OrderTypeList" mode="mutil-column-auto" child-name="children" value-name="value"
							 label-name="label" @confirm="confirmOrderType"></u-select>
						</u-form-item>
						<u-form-item label="工单来源" label-width="200" :required="true">
							<u-input type="text" v-model="form.gdly" :disabled="true" />
						</u-form-item>
						<u-form-item label="紧急程度" label-width="200" :required="true">
							<u-input placeholder="请选择紧急程度" type="text" :disabled="true" @click="showgeneral=true" v-model="emergencys" />
							<u-select v-model="showgeneral" :list="generalList.jjcd" mode="single-column" @confirm="emergency"></u-select>
						</u-form-item>
						<u-form-item label="付款对象" label-width="200" :required="true">
							<u-input placeholder="请选择付款对象" type="text" :disabled="true" @click="payment=true" v-model="paymenttext" />
							<u-select v-model="payment" :list="generalList.fkdx" mode="single-column" @confirm="setpayment"></u-select>
						</u-form-item>
						<u-form-item label="上门时间" label-width="200" :required="true" prop="qwsmsj">
							<u-input style="width: 100%;" placeholder="请选择日期" v-model="form.qwsmsj" type="select" :border="false" @click="expectdate = true" />
							<u-picker mode="time" v-model="expectdate" :params="params" @confirm="confirm"></u-picker>
						</u-form-item>
						<u-form-item label="工单联系人" label-width="200">
							<u-input placeholder="请输入工单联系人" type="text" v-model="form.gdlxr" />
						</u-form-item>
						<u-form-item label="工单联系电话" label-width="200">
							<u-input placeholder="请输入工单联系电话" type="text" v-model="form.gdlxdh" @blur="phoneTest(form.gdlxdh)" />
						</u-form-item>
						<u-form-item label="用户反馈问题" label-width="200">
							<u-input placeholder="请输入用户反馈问题" type="text" v-model="form.yhfkwt" />
						</u-form-item>

					</u-form>
				</view>
			</u-collapse-item>
			<u-gap></u-gap>
			<u-collapse-item :open="true">
				<view slot="title">
					<view>
						<view class="title">工单备注</view>
					</view>
				</view>
				<view class="u-p-l-32 u-p-r-32" style="overflow-y: scroll; padding-bottom: 150rpx;">
					<u-form>
						<u-form-item label="办理备注" label-width="200">
							<u-input placeholder="请输入办理备注" type="text" v-model="handleRemarks" />
						</u-form-item>
						<u-form-item label="凭证照片" label-width="200rpx" :required="true">
							<u-upload :show-progress="false" @on-success="list1" :max-size="8 * 1024 * 1024" :max-count="4" :action="action"
							 :name="filename" :form-data="formData"></u-upload>
						</u-form-item>
					</u-form>
				</view>
			</u-collapse-item>
		</u-collapse>

		<!-- 下方弹出层 选择产品品类 -->
		<view>
			<u-popup v-model="popupShow" mode="bottom" height="700" border-radius="14" close-icon-size="12">
				<view class="u-p-16 u-text-center" style="border-bottom: 1px solid #f5f5f5;">选择产品信息</view>
				<view>
					<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" :show-bar="false"></u-tabs>
				</view>
				<view class="u-m-l-40">{{breadCrumbs.join('/')}}</view>
				<!-- 品类 -->
				<view v-show="current==0">
					<view class="u-flex u-p-32 u-flex-wrap">
						<view class="u-margin-bottom-20 u-margin-right-20" v-for="(item,index) in cpjlList" :key="index">
							<u-button size="mini" @click="setStyle(item,index)">
								{{item.label}}
							</u-button>
						</view>
					</view>
				</view>
				<!-- 类别 -->
				<view v-show="current==1">
					<view class="u-flex u-p-32 u-flex-wrap">
						<view class="u-margin-bottom-20 u-margin-right-20" v-for="(item,index) in categoryList" :key="index">
							<u-button size="mini" @click="selectAtegory(item,index)">
								{{item.label}}
							</u-button>
						</view>
					</view>
				</view>
				<!-- 类型 -->
				<view v-show="current==2">
					<view class="u-flex u-p-32 u-flex-wrap">
						<view class="u-margin-bottom-20 u-margin-right-20" v-for="(item,index) in typeList" :key="index">
							<u-button size="mini" @click="chooseType(item,index)">
								{{item.label}}
							</u-button>
						</view>
					</view>
				</view>
				<!-- 型号 -->
				<view v-show="showModelList">
					<view class="u-flex u-p-32 u-flex-wrap">
						<view class="u-margin-bottom-20 u-margin-right-20" v-for="(item,index) in modelList" :key="index">
							<u-button size="mini" @click="chooseSure(item,index)">
								{{item.label}}
							</u-button>
						</view>
						<!-- <u-empty class="abs" text="请选择类别" v-if="typeList.length<1"></u-empty> -->
					</view>
				</view>

			</u-popup>

		</view>

		<view style="position: fixed; bottom: 0; width: 100%; z-index: 9999;" class="u-p-20">
			<u-button style="width: 100%;" type="primary" @click="submit" throttle-time="2500">提交</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//上传图片
				filename: 'headImage',
				formData: {
					'accept': 'image/*'
				},
				action: `${this.config.url}/admin/attachment/upload/?uploadName=headImage`,
				imgLength: 0, //图片数量
				imgText: '', //图片数量描述文字
				imgList: [], //图片回调数组 格式为 [{file}]

				background: {
					backgroundColor: '#1890ff',
				},
				backstyle: {
					color: '#FFF',
				},
				//产品选择
				popupShow: false,
				showModelList: false,
				list: [{
						name: '品类'
					}
					// , {
					// 	name: '型号'
					// }
				],
				current: 0,
				cpjlList: uni.getStorageSync('cpjlListOption'), //品类数组
				categoryList: [], //类别数组
				typeList: [], //类型数组
				modelList: [], //型号数组
				breadCrumbs: [],
				breadCrumbstext: '',
				chanpin_flLabel: '',
				cpxhLabel: '',
				isEdit: false,
				//
				falt: true,
				handleRemarks: '',
				handleWay: '提交',
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				formComplateStyle: {
					width: '100%',
					backgroundColor: '#f3f4f6',
					paddingLeft: '10rpx'
				},

				form: {
					ssq: {
						address: "",
						details: ""
					},
					gdly: '网点自助报单',
					khdh1: '',
					khdh2: '',
					khdh3: '',
					xxdz: '',
					khmc: "",
					cpmc: "",
					chanpin_fl: '',
					snm: 'MA-',
					cpxh: '',
					gmrq: '',
					gmqd: '',
					zbdqr: '',
					zbsyts: '',
					fkdx: '',
					qwsmsj: '',
					gdlxr: '',
					gdlxdh: '',
					yhfkwt: '',
					// gdlx: '',
					xb: '',
					bdsczp: [],
				},
				// rules1: {
				// 	khmc: [{
				// 		required: true,
				// 		message: '请输入姓名',
				// 		// 可以单个或者同时写两个触发验证方式 
				// 		trigger: ['change'], //, 'blur'
				// 	}],
				// 	khdh1: [{
				// 		required: true,
				// 		message: '请输入电话号码',
				// 		trigger: ['change'],
				// 	},
				// 	{ //检测手机号是否正确
				// 		validator: (rule, value, callback) => {
				// 			return this.$u.test.mobile(value);
				// 		},
				// 		message: '手机号有误，请核对',
				// 		trigger: ['blur']
				// 	}]
				// },
				rules2: {
					snm: [{
						required: true,
						message: '请输入出厂编码',
						trigger: ['change', 'blur'],
					}],
					chanpin_fl: [{
						required: true,
						message: '请输入产品品类',
						trigger: ['change', 'blur'],
					}]
				},
				label: '',
				showReturn: false,
				cityList: uni.getStorageSync('cityListOption'),
				show: false,
				city: '',
				dateshow: false,
				expectdate: false,
				showOrder: false,
				OrderTypeList: uni.getStorageSync('OrderTypeList'),
				OrderType: '',
				generalList: uni.getStorageSync('getfieldOptions'),
				showgeneral: false,
				payment: false,
				showchannel: false,
				emergencys: '',
				paymenttext: '',
				customerId: '',
				cpxh: '',
				bxszy: '',
				gdlx: '',
				fuwu_xm: '',
				jjcd: '',
				channel: '',
				glkhbh: '',

				inputSnmVal: '',
				testForm: {
					name: '',
					ceshi: ''
				}
			}
		},
		methods: {
			//上传图片成功回调
			list1(data, index, lists) {
				console.log(lists)
				this.imgLength = index + 1
				this.imgText = `上传图片(${index+1}/4)`
				let imgList = []
				lists.forEach((item, index) => {
					imgList.push(item.response.result)
				})
				this.imgList = imgList
				this.form.bdsczp = imgList //上传接口参数数组
			},
			customBack() {
				//页面返回按钮 左上角返回按钮
				// let arr;
				// if ((arr = Object.keys(this.form).filter(v=>!this.form[v])).length<=0) {
				//   console.log("无空值");
				// }else{
				//   console.log("有空值");
				// }
				// let param = this.form
				// this.objectValueAllEmpty(param)
				uni.showModal({
					title: '提示',
					content: '当前页面正编辑中，确认返回？',
					success: function(res) {
						if (res.confirm) {
							uni.navigateBack({
								delta: 1
							});
						}
					}
				});
			},
			objectValueAllEmpty: function(object) {
				// let isEmpty = true;
				// let t = this
				// let a = Object.keys(object).every(function(x) { 
				// 	//Object.keys把对象内每一个可枚举属性  合并成数组  some方法 有一个满足条件则返回true every方法全部满足条件才返回true
				// 	return object[x] != null && object[x] != ""
				// })
				// console.log(a,"a");
			},
			inputSnm(e) {
				this.$u.debounce(this.toNext, 1500)
				this.inputSnmVal = e
			},
			toNext() {
				let mm = /^MA-[0-9]*$/;
				if (!mm.test(this.inputSnmVal)) {
					this.$u.toast("请输入MA-开头的数字")
					this.form.snm = 'MA-'
					return false
				} else {
					console.log("校验通过");
					this.form.snm = this.inputSnmVal
				}
			},
			phoneTest(val) { //工单联系电话校验手机号  @blur事件
				if (!this.$u.test.mobile(val)) {
					this.$refs.uToast.show({
						title: '手机号格式有误',
						type: 'error'
					})
				}
			},
			//  选择产品信息逻辑start
			change(index) {
				this.current = index
				// this.breadCrumbs.splice(index)

				let length = this.list.length
				if (index < length) {
					this.modelList = [] //清空已选型号数据
					this.list.splice(index + 1) //删除tabs栏 对应后面的目录

					this.breadCrumbs.splice(index + 1) //同步更新删除  更新面包屑栏文字
				}

			},
			//总共有4类 品类-类别-类型-型号  型号需要点击最后一类时 通过接口传参获取
			//品类
			setStyle(item, index) {
				this.breadCrumbs[this.current] = item.label //面包屑名称
				this.form.chanpin_fl = item.value //接口api字典值
				this.chanpin_flLabel = item.label //页面显示值
				this.current = 1 //tabs索引 自增1
				if (item.children) {
					//如果有children 表示类别
					this.list = [{
						name: '品类'
					}, {
						name: '类别'
					}]
					this.categoryList = item.children
				} else {
					//没有则表示最后一层了即型号  直接搜索型号即可  只有两层：品类-型号
					this.showModelList = true //显示型号tab栏
					this.list = [{
						name: '品类'
					}, {
						name: '型号'
					}]
					let param = {
						chanpin_fl: item.value
					}
					this.$u.post('/app/Setting/getcpxinghao', param).then(res => {
						this.modelList = res.result //型号数据
					})
				}
			},
			//类别
			selectAtegory(item, index) {
				this.breadCrumbs[this.current] = item.label //面包屑名称
				this.form.chanpin_fl = item.value //接口api字典值
				this.chanpin_flLabel = item.label //页面显示值
				this.current = 2 //tabs索引 自增1
				if (item.children) {
					//如果有children 表示类型
					this.list = [{
						name: '品类'
					}, {
						name: '类别'
					}, {
						name: '类型'
					}]
					this.typeList = item.children
				} else {
					//没有则表示最后一层了即型号  直接搜索型号即可  只有两层：品类-型号
					this.showModelList = true //显示型号tab栏
					this.list = [{
						name: '品类'
					}, {
						name: '类别'
					}, {
						name: '型号'
					}]
					let param = {
						chanpin_fl: item.value
					}
					this.$u.post('/app/Setting/getcpxinghao', param).then(res => {
						this.modelList = res.result //型号数据
					})
				}
			},
			//类型
			chooseType(item, index) {
				this.breadCrumbs[this.current] = item.label //面包屑名称
				this.form.chanpin_fl = item.value //接口api字典值
				this.chanpin_flLabel = item.label //页面显示值
				this.current = 3 //tabs索引 自增1

				this.list = [{
					name: '品类'
				}, {
					name: '类别'
				}, {
					name: '类型'
				}, {
					name: '型号'
				}]
				if (item.children) {
					//如果有children 表示还有最后一层 暂无设置
					// this.list = [{name:'品类'},{name:'类别'},{name:'类型'},{name:'型号'}]
					this.typeList = item.children
				} else {
					//没有则表示最后一层了即型号  直接搜索型号即可  只有两层：品类-型号
					this.showModelList = true //显示型号tab栏
					// this.list = [{name:'品类'},{name:'类别'},{name:'类型'}]
					let param = {
						chanpin_fl: item.value
					}
					this.$u.post('/app/Setting/getcpxinghao', param).then(res => {
						this.modelList = res.result //型号数据
					})
				}
			},
			//型号
			chooseSure(item) {
				this.form.cpxh = item.label //接口api字典值
				this.cpxhLabel = item.label //页面显示值
				this.breadCrumbs[this.current] = item.label
				this.popupShow = false
			},
			//  选择产品信息逻辑end
			returnSheetCallback(item) {
				this.form.xb = item[0].label
			},
			getCityData() {
				this.show = true
				this.cityList = uni.getStorageSync('cityListOption')
			},
			confirmCity(e) {
				let city = []
				this.form.ssq.address = e[2].value
				e.map(item => {
					// this.form.ssq.push(item.value)
					city.push(item.label)
				})
				this.city = city.join('/')
			},
			prompt() {
				if (this.form.chanpin_fl == '' || this.form.chanpin_fl == undefined) {
					this.$refs.uToast.show({
						title: '请先选择产品品类',
						type: 'default',
						icon: false
					})
				}
			},
			setdate(e) {
				this.form.gmrq = e.result
			},
			setdate2(e) {
				this.form.zbdqr = e.result
			},
			getOrderType() {
				this.showOrder = true
			},
			confirmOrderType(e) {
				console.log(e, "eeeeeeeeeeeeeeeeeeee");
				// this.form.gdlx = e[0].value
				if (e[1]) { //有些没有二级列表
					this.form.fuwu_xm = e[1].value
				}
				console.log(this.form)
				let order = []
				e.map(item => {
					order.push(item.label)
				})
				this.OrderType = order.join('/')
			},
			getchannel(e) {
				this.form.gmqd = e[0].label
			},
			setTopDoor(e) {
				this.form.qwsmsj = e.result
			},
			emergency(e) {
				this.form.jjcd = e[0].value
				this.emergencys = e[0].label
			},
			setpayment(e) {
				this.form.fkdx = e[0].value
				this.paymenttext = e[0].label
			},
			submit() {
				// console.log("this.formthis.form",this.form);
				// return
				if (this.$u.test.isEmpty(this.form.khmc)) {
					this.$u.toast("请输入客户姓名")
					return
				}
				if (this.$u.test.isEmpty(this.form.khdh1)) {
					this.$u.toast("请输入客户电话1")
					return
				}
				if (!this.$u.test.mobile(this.form.khdh1) && this.form.khdh1) {
					this.$u.toast("客户电话1手机号格式有误")
					return
				}
				if (!this.$u.test.mobile(this.form.khdh2) && this.form.khdh2) {
					this.$u.toast("客户电话2手机号格式有误")
					return
				}
				if (!this.$u.test.mobile(this.form.khdh3) && this.form.khdh3) {
					this.$u.toast("客户电话3手机号格式有误")
					return
				}
				if (this.$u.test.isEmpty(this.city)) {
					this.$u.toast("请选择省市区")
					return
				}
				if (this.$u.test.isEmpty(this.form.ssq.details)) {
					this.$u.toast("请输入详细地址")
					return
				}
				this.$refs.uForm2.validate(valid => { //产品信息校验
					if (valid) {
						console.log('验证通过1');
						this.$refs.uForm2.validate(valid => {
							if (valid) {
								if (this.$u.test.isEmpty(this.form.gmrq)) {
									this.$u.toast("请选择购买日期")
									return
								}
								console.log('验证通过2');
								console.log('验证通过3');
								if (this.OrderType == '') {
									this.$u.toast("服务项目不能为空")
									return
								}
								if (this.emergencys == '') {
									this.$u.toast("紧急程度不能为空")
									return
								}
								if (this.paymenttext == '') {
									this.$u.toast("付款对象不能为空")
									return
								}
								if (this.form.qwsmsj == '') {
									this.$u.toast("期望上门时间不能为空")
									return
								}
								if (!this.$u.test.mobile(this.form.gdlxdh) && this.form.gdlxdh) {
									this.$u.toast("手机号格式有误")
									return
								}

								if (this.$u.test.isEmpty(this.imgList)) {
									this.$u.toast("请上传购买凭证图片")
									return
								}


								//所有验证项通过之后才调用接口
								// uni.showLoading({
								//     title: '正在提交',
								// 	icon: 'loading',
								// 	duration:100000, //时间写长一点，如果不写，默认是1500毫秒  预防网络延迟慢的情况 1500毫秒内就消失了
								// 	mask:true //调用接口前 开启遮罩层 防止多次触摸点透
								// });
								this.$u.post('app/WdOrder/createOrder', {
									handleRemarks: this.handleRemarks,
									handleWay: this.handleWay,
									info: this.form
								}).then(res => {
									// uni.hideLoading()  //接口调用成功后 去掉遮罩层
									if (res.code == 0) {
										this.$refs.uToast.show({
											title: '提交成功',
											type: 'success',
											url: '/pages/order/index',
											isTab: true
										})
									} else {
										this.$u.toast(res.message)
									}
								})

							}
						});
					} else {
						console.log('验证失败');
						// this.$u.toast("请输入第一个框内容")
						return
					}
				});


			},
			gocustomerinfo() {
				uni.navigateTo({
					url: './customerInfo'
				})
			},
			goproductinfo() {
				this.falt = true
				uni.navigateTo({
					url: './productInfo?khbh=' + this.customerId
				})
			},
			scan() {
				let _this = this
				uni.scanCode({
					success: res => {
						this.falt = false
						this.form.snm = res.result
						let paramsSNM = {
							snm: res.result,
						}
						_this.$u.post('/app/Goods/authSnm', paramsSNM).then(response => {
							if (response.code === 1) { //不存在snm码 或者 该产品已经安装过，不能重新安装
								let message = response.message
								_this.$u.toast(message)
								this.form.cpmc = ''
								this.form.cpxh = ''
								this.cpxhLabel = ''
								this.form.chanpin_fl = ''
								this.chanpin_flLabel = ''
								return
							}
							console.log("response");
							console.log(response);
							this.form.cpmc = response.result.cpmc
							this.form.cpxh = response.result.cpxh //接口值
							this.cpxhLabel = response.result.cpxh //页面显示值
							this.form.chanpin_fl = response.result._chanpin_fl_ //接口值
							this.chanpin_flLabel = response.result.chanpin_fl //页面显示值 
						})
					}
				});

			},
			confirm(e) {
				this.form.qwsmsj = '';
				if (this.params.year) this.form.qwsmsj += e.year;
				if (this.params.month) this.form.qwsmsj += '-' + e.month;
				if (this.params.day) this.form.qwsmsj += '-' + e.day;
				if (this.params.hour) this.form.qwsmsj += ' ' + e.hour;
				if (this.params.minute) this.form.qwsmsj += ':' + e.minute;
				if (this.params.second) this.form.qwsmsj += ':' + e.second;
			},
		},

		onLoad() {

			uni.removeStorageSync('customerInfo')
			uni.removeStorageSync('productInfo')

			//先判断是否缓存，若缓存不用请求，避免多次重复请求
			if (!uni.getStorageSync('cityListOption')) {
				this.$u.post('/app/Setting/getCityAddress', {}).then(res => {
					uni.setStorageSync('cityListOption', res.result)
				})
			}
			if (!uni.getStorageSync('getfieldOptions')) {
				this.$u.post('/app/Setting/getfieldOptions', {
					workflow_id: '58a480d869acb16a0b6634479fd9157c'
				}).then(res => {
					uni.setStorageSync('getfieldOptions', res.result)
					this.generalList = res.result
				})
			}
			if (!uni.getStorageSync('OrderTypeList')) {
				this.$u.post('/app/Setting/getjilianOption', {
					parent_number: 'fwdgdlx'
				}).then(res => {
					this.OrderTypeList = res.result
					uni.setStorageSync('OrderTypeList', res.result)
				})
			}
			if (!uni.getStorageSync('cpjlListOption')) { //产品品类 级联列表
				this.$u.post('/app/Setting/getOptionGoodsClass', {}).then(res => {
					uni.setStorageSync('cpjlListOption', res.result)
					this.cpjlList = res.result
				})
			} else {
				this.cpjlList = uni.getStorageSync('cpjlListOption')
			}
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			// this.$refs.uForm1.setRules(this.rules1);
			this.$refs.uForm2.setRules(this.rules2);
			// this.$refs.uForm3.setRules(this.rules3);
		},
		onShow() {
			if (this.falt) {
				let forms = uni.getStorageSync('customerInfo')
				let typeform = uni.getStorageSync('productInfo')
				console.log(typeform)
				if (typeform) {
					this.isEdit = true //禁选
					this.$refs.uForm2.resetFields(); //重置表单并去除规则校验结果
					this.form.cpmc = typeform.cpmc
					this.form.cpxh = typeform.cpxh
					this.form.chanpin_fl = typeform._chanpin_fl_
					this.chanpin_flLabel = typeform.chanpin_fl //页面显示

					this.form.cpxh = typeform.cpxh
					this.cpxhLabel = typeform.cpxh //页面
					this.form.glkhcpbh = typeform.khcpbh || ''
					this.form.glcpbh = typeform.glcpbh || typeform.cpbh
					this.form.zbdqr = typeform.zbdqr || ''
					this.form.gmrq = typeform.gmrq || ''
					this.form.bxszy = typeform.bxszy || ''
					this.form.gmqd = typeform.gmqd || ''
				}
				if (forms) {
					this.$refs.uForm1.resetFields();
					this.form.ssq.address = forms._ssq_
					this.form.khdh1 = forms.khdh1
					this.form.khdh2 = forms.khdh2
					this.form.khdh3 = forms.khdh3
					this.form.khxz = forms.khxz
					this.form.ssq.details = forms.xxdz
					this.form.khmc = forms.khmc
					this.form.xb = forms.xb
					this.form.glkhbh = forms.khbh
					this.city = forms.ssq.replace(/,/g, '/')
					this.customerId = forms.khbh
				}

			}

		},
		// onHide() {
		// 	uni.removeStorageSync('customerInfo')
		// 	uni.removeStorageSync('productInfo')
		// },
		onUnload() {
			// uni.removeStorageSync('customerInfo')
			// uni.removeStorageSync('productInfo')
		}
	}
</script>

<style lang="scss">
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
	}
</style>
