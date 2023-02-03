<template>
	<view class="box">
		<u-card title="工单办理">
			<u-form slot="body" :model="form" ref="uForm">
				<u-form-item label="办理方式" label-width="160rpx" prop="wayIndex" required>
					<u-radio-group :wrap="true" v-model="form.wayIndex" @change="radioGroupChange">
						<u-radio :key="key" v-for="(item, key) of listWayData" :name="item.wayIndex"
							v-if="!item.hidden">
							<view style="color: #303133; font-size: 28rpx;">
								<text>{{item.way}}</text>
								<text v-if="item.wayName" class="u-font-20">{{item.wayName}}</text>
							</view>
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<view style="color: red" v-if="fabFlag">
					若需申请配件,请点击右下角“+申请配件”按钮
				</view>
				<u-form-item label="改约原因" label-width="180rpx" prop="gyyy" required v-if="wayIndex === 'zxyy'">
					<u-input style="width: 100%;" placeholder="请选择" v-model="form.gyyy" type="select" :border="false"
						@click="showReturn = true" />
					<u-select v-model="showReturn" mode="single-column" :list="gyList" value-name="number"
						label-name="name" @confirm="(e) => {choiceReason(e, 'gyyy')}"></u-select>
				</u-form-item>
				<u-form-item label="预约上门时间" label-width="180rpx" prop="yysmsj" required v-if="wayIndex === 'zxyy'">
					<u-input style="width: 100%;" placeholder="请选择日期" v-model="form.yysmsj" type="select"
						:border="false" @click="showDate = true" />
					<u-picker mode="time" v-model="showDate" :params="params" @confirm="choiceTime"></u-picker>
				</u-form-item>
				<!-- <u-form-item label="退回工单原因" label-width="180rpx" prop="sfthyy" required v-else-if="wayIndex === 'tuihui_gd'">
					<u-input style="width: 100%;" placeholder="请选择" v-model="form.sfthyy" type="select" :border="false" @click="showReturn = true" />
					<u-select v-model="showReturn" mode="single-column" :list="returnList" value-name="number" label-name="name"
					 @confirm="(e) => {choiceReason(e, 'sfthyy')}"></u-select>
				</u-form-item> -->
				<u-form-item label="办理备注" label-width="180rpx" prop="gdblbz" v-if="subText === '提交'">
					<u-input type="textarea" :border="true" :clearable="true" class="u-flex-1" v-model="remark" />
				</u-form-item>
			</u-form>
		</u-card>
		<view class="footer">
			<u-button type="primary" throttle-time="2500" @click="handleSubmit">{{subText}}</u-button>
		</view>
		<u-modal v-model="modalShow" :content="modalTxt"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		name: 'orderAppoint',
		props: {
			fabFlag: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				detail: {},
				form: {},
				subText: '提交',
				rules: {
					wayIndex: [{
						required: true,
						message: '请选择办理方式',
						trigger: 'blur,change'
					}],
					gyyy: [{
						required: true,
						message: '请选择改约原因',
						trigger: 'blur,change'
					}],
					yysmsj: [{
						required: true,
						message: '请选择预约上门时间',
						trigger: 'blur,change'
					}],
					// sfthyy: [{
					// 	required: true,
					// 	message: '请选择退回工单原因',
					// 	trigger: 'blur,change'
					// }],
				},
				subKey: '',
				listWayData: [],
				wayIndex: '',
				snValue: '',
				oldSn: '',
				appointDate: '', // 预约上门时间
				suspendReason: {}, // 退回工单原因
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				returnList: [],
				gyList: [],
				handOrder: {
					suspendReason: {},
					gyyy: {},
				},
				showDate: false,
				showSubDate: false,
				showReturn: false,
				remark: '',
				modalShow: false,
				modalTxt: '购买日期不能大于当天日期，请重新选择',
				handleObj: {},
				handles: [],
				picsLen: 0,
				partsSelect: false, // 配件申请模态框
				parts: [], //配件信息
				choicePart: [], // 配件多选框选中
				choiceParts: [], // 确认选择
			}
		},
		created() {
			const gdlx = {
				'安装': [{
						way: '完成服务',
						wayIndex: 'clwc'
					}, {
						way: '完成检测',
						wayIndex: 'jcwc'
					}, {
						way: '重新预约',
						wayIndex: 'zxyy'
					},
					// {
					// 	way: '退回工单',
					// 	wayIndex: 'tuihui_gd'
					// },
					{
						way: '需转鉴定',
						wayIndex: 'xzjd'
					}
				],
				'维修': [{
						way: '完成服务',
						wayIndex: 'clwc'
					}, {
						way: '上门检测/测试',
						wayIndex: 'jcwc'
					}, {
						way: '重新预约',
						wayIndex: 'zxyy'
					},
					// {
					// 	way: '退回工单',
					// 	wayIndex: 'tuihui_gd'
					// }, 
					{
						way: '需转鉴定',
						wayIndex: 'xzjd'
					}
				],
				'拆机': [{
						way: '拆机完成',
						wayIndex: 'cj',
						wayName: '（只拆一台产品）',
					}, {
						way: '拆装机完成',
						wayIndex: 'czj',
						wayName: '（拆和装各一台产品）',
					},
					// {
					// 	way: '退回工单',
					// 	wayIndex: 'tuihui_gd'
					// }, 
					{
						way: '重新预约',
						wayIndex: 'zxyy'
					}
				],
				'测量': [{
						way: '完成服务',
						wayIndex: 'clwc'
					}, {
						way: '重新预约',
						wayIndex: 'zxyy'
					},
					// {
					// 	way: '退回工单',
					// 	wayIndex: 'tuihui_gd'
					// },
				],
				'换货': [{
					way: '送装完成',
					wayIndex: 'szwc'
				}, {
					way: '重新预约',
					wayIndex: 'zxyy'
				}],
				'退货': [{
					way: '处理完成',
					wayIndex: 'clwc'
				}, {
					way: '重新预约',
					wayIndex: 'zxyy'
				}],
				'清洗': [{
						way: '完成服务',
						wayIndex: 'clwc'
					}, {
						way: '重新预约',
						wayIndex: 'zxyy'
					},
					// {
					// 	way: '退回工单',
					// 	wayIndex: 'tuihui_gd'
					// },
				],
			}
			let globalData = getApp().globalData
			this.detail = globalData.order ? globalData.order.orderData : {},
				this.listWayData = gdlx[this.detail.gdlx] || []
			if (this.detail.gdlx === '拆机' && this.detail.cppl === '空调类') {
				this.listWayData.splice(2, 0, {
					way: '拆整机完成',
					wayIndex: 'czj2',
					wayName: '（拆内机及外机各一台产品）',
				}, {
					way: '拆装整机完成',
					wayIndex: 'czzj',
					wayName: '（拆和装内机及外机各一台产品）',
				})
			}
			this.subKey = globalData.order ? globalData.order.subKey : ''
		},
		mounted() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			// 选择办理工单
			radioGroupChange(e) {
				this.wayIndex = e
				if (e === 'zxyy') {
					if (this.gyList.length === 0) {
						this.$u.post('/admin/dict/linkageDictList', {
							parent_number: 'yysbyy'
						}).then(res => {
							this.gyList = res.result
						})
					}
					this.subText = '提交'
				} else if (e === 'tuihui_gd') {
					if (this.returnList.length === 0) {
						this.$u.post('/admin/dict/linkageDictList', {
							parent_number: 'sfthyy'
						}).then(res => {
							this.returnList = res.result
						})
					}
					this.subText = '提交'
				} else {
					// this.$emit('goTo', e)
					this.subText = '下一步'
				}
				this.form = {}
				this[this.subKey] = {}
				this.form.wayIndex = e
			},

			// 预约上门时间
			choiceTime(e) {
				const time = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`
				const date = new Date(time).valueOf()
				const nowDate = new Date().valueOf()
				if (date < nowDate) {
					this.modalShow = true
					this.modalTxt = '预约时间不能小于当天日期，请重新选择'
				} else {
					this.form.yysmsj = time
					this[this.subKey].yysmsj = time
				}
			},

			// 选择预约失败原因
			choiceReason(e, type) {
				this.form[type] = e[0].label
				this[this.subKey][type] = e[0].value
			},

			// 提交工单
			async handleSubmit() {
				if (this.subText !== '下一步') {
					this.$refs.uForm.validate(valid => {
						if (valid) {
							const order = getApp().globalData.order
							const params = {
								case_id: order.workitemData.case_id,
								handleRemarks: this.remark,
								handleWay: this.wayIndex,
								workitem_id: order.workitemData.workitem_id,
								tableid: 'c289bf71e6254134d7c35833e1014b18',
							}
							params[this.subKey] = this[this.subKey]
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
										title: res.message
									})
								}
							})
						} else {
							console.log('验证失败')
						}
					})
				} else {
					this.$emit('goTo', this.wayIndex)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	// 扫码
	.scan {
		position: relative;
	}

	.icon {
		position: absolute;
		right: 0;
		top: 50%;
		z-index: 11;
		transform: translateY(-50%);
	}

	// 照片墙
	.scene {
		width: 300rpx;
		height: 300rpx;
		margin-bottom: 24rpx;
		transform: rotateZ(360deg);
		box-sizing: border-box;

		.scene_img_box {
			width: 100%;
			height: 100%;
			position: relative;

			.scene_img {
				width: 300rpx;
				height: 300rpx;
			}

			.del {
				position: absolute;
				top: 0;
				right: 0;
				transform: translate(50%, -50%);
				width: 32rpx;
				height: 32rpx;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #ff0000;
			}
		}

		.add_img {
			width: 100%;
			height: 100%;
			padding: 24rpx;
			border: 1rpx dashed #c8c8c8;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.word {
				margin-top: 20rpx;
				font-size: 24rpx;
				color: grey;
			}
		}

	}

	// 增加减少图片
	.plus {
		width: 100%;
		text-align: end;

		.plus_icon {
			margin-left: 24rpx;
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

	.part_content {
		padding-left: 32rpx;
		height: 600rpx;
		overflow: auto;
	}

	// 减 
	.minus {
		margin-left: 10rpx;
		font-size: 28rpx;
	}

	// 发送短信评价说明
	.tips {
		color: #999;
		font-size: 26rpx;
	}
</style>
