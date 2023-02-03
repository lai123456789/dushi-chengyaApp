<template>
	<view>
		<view>
			<button @longpress="startRecognize" @touchend="stop" style="position: fixed; right: 32rpx; top: 80rpx; background: gray; width: 80rpx; height: 80rpx; border-radius: 50%;
			z-index: 1; display: flex; align-items: center; justify-content: center;">
				<view>
					<view>
						<u-icon name="mic" size="40" color="#FFF"></u-icon>
					</view>
					<view style="color: #FFF; font-size: 18rpx;">识别</view>
				</view>
			</button>
		</view>
		<layoutItem v-for="record in dataList" :key="record.key" :record.sync="record" @handleChange="handleChange"
			@checkInput="checkInput" style="width: 100%;">
		</layoutItem>
		<u-button @click="go" v-if="dataList.length > 0">保存</u-button>
	</view>
</template>

<script>
	import layoutItem from './layoutItem.vue'
	export default {
		components: {
			layoutItem
		},
		data() {
			return {
				dataList: [],
				params: {},
				inputKey: '',
				checkKey: ''
			}
		},
		methods: {
			startRecognize() {
				var options = {};
				options.engine = 'baidu'
				options.continue = true
				const that = this
				that.inputKey = 0
				options.timeout = 500
				plus.speech.startRecognize(options, function(s) {
						const string = s.replace(/？|。/g, '').split('，')
						let lastLocal = false
						const getTemplate = (array) => {
							array.forEach((temItem, index) => {
								if (string[that.inputKey] && that.checkKey) {
									if (temItem.columns) {
										getTemplate(temItem.columns)
									} else if (temItem.trs) {
										getTemplate(temItem.trs)
									} else if (temItem.tds) {
										getTemplate(temItem.tds)
									} else if (temItem.list) {
										getTemplate(temItem.list)
									} else {
										if (that.checkKey === temItem.key && !lastLocal) {
											lastLocal = true
											that.$set(temItem.options, 'defaultValue', string[that
												.inputKey])
											that.inputKey++
										} else if (that.checkKey && lastLocal && temItem.type ===
											'input') {
											that.$set(temItem.options, 'defaultValue', string[that
												.inputKey])
											that.inputKey++
										}
									}
								}
							})
						}
						getTemplate(that.dataList)
						plus.speech.stopRecognize()
					},
					function(e) {
						console.log("语音识别失败：" + e.message);
					});
			},
			stop() {
				plus.speech.stopRecognize();
			},
			handleChange(e) {
				const getTemplate = (array) => {
					array.forEach((temItem, index) => {
						if (temItem.columns) {
							getTemplate(temItem.columns)
						} else if (temItem.trs) {
							getTemplate(temItem.trs)
						} else if (temItem.tds) {
							getTemplate(temItem.tds)
						} else if (temItem.list) {
							getTemplate(temItem.list)
						} else {
							if (temItem.key === e.key) {
								this.$set(temItem.options, 'defaultValue', e.options.defaultValue)
								return false
							}
							//是否签名
							let globalData = getApp().globalData
							let signatureKey = globalData.signatureKey || ''
							let signNameImg = globalData.signNameImg || ''
							if (temItem.key === signatureKey) {
								this.$set(temItem, 'file', this.config.url + signNameImg.result.filePath)
								globalData.signatureKey = ''
								globalData.signNameImg = ''
							}
						}
					})
				}
				getTemplate(this.dataList)
			},
			go() {
				const params = {
					action: 'submit',
					tableViewField: 'bgnr',
					tableViewVal: this.dataList,
					id: this.params.id,
					tplviewid: this.params.tplviewid
				}
				params[this.params.tableName] = {}
				params[this.params.tableName]['bgnr'] = ''
				params[this.params.tableName]['sftx'] = 's'
				this.$u.post('/admin/UserTable/edit', params).then(res => {
					if (!res.code) {
						getApp().globalData.isTableShow = true
						uni.navigateBack()
						uni.showToast({
							title: '操作成功',
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: 'error'
						})
					}

				})
			},
			checkInput(item) {
				this.checkKey = item.key
			},
			getTable(data) {
				let sftx = ''
				// 两种状态进入该页面 
				// 一种是数据窗口查询表格 /crm/Order/queryTransitionFormsetData这个接口  data.sftx为 's'/'f'
				// 一种是 子表 查询表格 /admin/UserTable/init这个接口  data.sftx为 '是'/'否'
				if (['s', '是'].includes(data.sftx)) {
					sftx = 's'
				} else {
					sftx = 'f'
				}
				const params = {
					action: 'edit',
					flowStatus: 'proceed',
					id: data.id,
					tableViewField: sftx === 's' ? 'bgnr' : '',
					record: data,
					listTplviewid: 'dbcaf0430b67b6b53115faf86197e217',
					tplviewid: data.stid,
				}
				const url = '/admin/UserTable/edit'
				this.params = params
				this.$u.post(url, params).then(res => {
					this.params.tableName = res.result.tableName
					this.dataList = res.result.template
					this.$u.toast('当前表格数据加载中，请耐心等候', 5000)
					
					//根据 工单详情已有字段 自动填充到表格对应字段
					let globalData = getApp().globalData
					let orderDataDetail = globalData.orderDataDetail
					console.log('orderDataDetail', orderDataDetail)
					const getTemplate = (array) => {
						array.forEach((temItem, index) => {
							if (temItem.columns) {
								getTemplate(temItem.columns)
							} else if (temItem.trs) {
								getTemplate(temItem.trs)
							} else if (temItem.tds) {
								getTemplate(temItem.tds)
							} else if (temItem.list) {
								getTemplate(temItem.list)
							} else {
								// 数字输入框组件
								// if(temItem.type === 'number'){
								// 	this.$set(temItem.options, 'min', 0)
								// 	this.$set(temItem.options, 'max', 99999)
								// }
								// 复选框组件 选中切换
								if (temItem.type === 'checkbox') {
									if(temItem.options.defaultValue ?.length){
										temItem.options.defaultValue.forEach((item,index) => {
											temItem.options.options.forEach((sitem,sindex) => {
												if(sitem.checked == '1'){
													this.$set(sitem, 'checked', true)
												}else if(item == sitem.value){
													this.$set(sitem, 'checked', true)
												}else{
													this.$set(sitem, 'checked', false)
												}
											})
										})
									}else{
										temItem.options.options.forEach((sitem,sindex) => {
											this.$set(sitem, 'checked', false)
										})
									}
								}
								
								if (['设备规格型号及编号','机组型号','机组编号'].includes(temItem.label)) {
									this.$set(temItem.options, 'defaultValue', orderDataDetail.jzxh)
								}
								if (temItem.label === '增压站') {
									this.$set(temItem.options, 'defaultValue', orderDataDetail.zyz)
								}
								if (temItem.label === '作业区') {
									this.$set(temItem.options, 'defaultValue', orderDataDetail.zyq)
								}
								if (temItem.label === '累计运行时间') {
									this.$set(temItem.options, 'defaultValue', orderDataDetail.ljyhsj)
								}
								if (['所属流程','工程名称'].includes(temItem.label)) {
									this.$set(temItem.options, 'defaultValue', orderDataDetail.fwxm)
								}
								if (['地点','安装地点'].includes(temItem.label)) {
									this.$set(temItem.options, 'defaultValue', orderDataDetail.azdd)
								}
								if (temItem.label === '维保人员') {
									this.$set(temItem.options, 'defaultValue', orderDataDetail.zxgcs)
								}
								if (temItem.label === '压缩机组型号') {
									this.$set(temItem.options, 'defaultValue', orderDataDetail.ysjxh)
								}
								if (temItem.label === '维保单位') {
									this.$set(temItem.options, 'defaultValue', orderDataDetail.azdw)
								}
							}
						})
					}
					getTemplate(this.dataList)
				})
			}
		},
		onShow() {
			let globalData = getApp().globalData
			if (globalData.signatureKey) {
				this.handleChange('')
			}
		},
		onLoad(e) {
			let globalData = getApp().globalData
			let data = globalData.formData
			this.getTable(data)
		}
	}
</script>

<style lang="scss" scoped>
	/deep/.u-numberbox {
		.u-icon-plus,
		.u-icon-minus {
			width: 40rpx !important;
		}
	}
	
	//多行文本框的 分割线  加分割线为了解决多行文本框有时无法显示完内容的问题
	// /deep/.u-divider-line{
	// 	border-color: #FFF !important;
	// }
</style>
