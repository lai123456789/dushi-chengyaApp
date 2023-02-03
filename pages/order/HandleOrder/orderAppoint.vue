<template>
	<view>
		<customCard title="处理结果" :bodyStyle="{padding: '16rpx'}" v-if="detail.fwxm === '质量回馈'">
			<view class="u-flex u-row-between">
				<view class="btn">
					<button @longpress="startRecognize" @touchend="stop"
						style="background: transparent; border: none !important;">
						<text class="iconfont luyin" style="width: 60rpx; height: 60rpx;"></text>
					</button>
				</view>
				<u-input type="textarea" v-model="form.cljg" placeholder-style="font-size: 22rpx" height="120"
					placeholder="填写初步原因分析、处理步骤、处理措施、更换零部件情况，最后解决结果，文字描述故障时机器状态和损坏零部件的形态或提供照片说明，应注明损坏零部件的名称、图号、编码、生产厂家、旧件是否回厂"
					:border="true" style="width: 100%;" />
			</view>
		</customCard>
		<u-form :model="form" ref="uForm">
			<customCard title="工单办理" :bodyStyle="{padding: '16rpx'}">
				<view class="u-p-l-16 u-p-r-16">
					<u-form-item label="办理方式" label-width="200rpx" required>
						<u-radio-group v-model="wayIndex" @change="onChange" size="24">
							<u-radio :key="key" v-for="(item, key) in wayList" :name="item.wayIndex || item.alias">
								<view style="color: #303133;">{{item.way}}</view>
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<view style="color: red" v-if="fabFlag && wayIndex === 'zbwc'">
						若需申请配件,请点击右边“+申请配件”按钮
					</view>
					<view v-if="handles && handles.length > 0">
						<block v-for="(im, idx) in handles" :key="idx">
							<u-form-item :label="im.name" label-width="200rpx" :prop="im.field" :required="im.required"
								v-if="im.type === 'time'">
								<u-input style="width: 100%;" placeholder="请选择日期时间" v-model="form[im.field]"
									type="select" :border="false" @click="onPlay(im, idx)" />
								<u-picker mode="time" v-model="im.show" :params="params"
									@confirm="(e) => {choiceTime(e, im, idx)}" @cancel="onCancel(im, idx)"></u-picker>
							</u-form-item>
							<u-form-item :label="im.name" label-width="200rpx" :prop="im.field" :required="im.required"
								v-if="im.type === 'date'">
								<u-input style="width: 100%;" placeholder="请选择日期" v-model="form[im.field]" type="select"
									:border="false" @click="onPlay(im, idx)" />
								<u-picker mode="time" v-model="im.show" :params="paramsDate"
									@confirm="(e) => {choiceTime(e, im, idx)}" @cancel="onCancel(im, idx)"></u-picker>
							</u-form-item>
							<u-form-item :label="im.name" label-width="200rpx" :prop="im.field" :required="im.required"
								v-else-if="im.type === 'select'">
								<u-input style="width: 100%;" :placeholder="im.placeholder" :value="im.value"
									type="select" :border="false" @click="onPlay(im, idx)" />
								<u-select v-model="im.show" mode="single-column" :mask-close-able="false"
									:list="im.list" value-name="number" label-name="name"
									@confirm="(e) => {choiceReason(e, im, idx)}" @cancel="onCancel(im, idx)"></u-select>
							</u-form-item>
							<u-form-item :label="im.name" label-width="200rpx" :prop="im.field" :required="im.required"
								v-else-if="im.type === 'mutil'">
								<u-input style="width: 100%;" :placeholder="im.placeholder" :value="im.value"
									type="select" :border="false" @click="onPlay(im, idx)" />
								<u-select v-model="im.show" mode="mutil-column-auto" :mask-close-able="false"
									:list="im.list" @confirm="(e) => {choiceSq(e, im, idx)}"
									@cancel="onCancel(im, idx)">
								</u-select>
							</u-form-item>
							<u-form-item :label="im.name" label-width="200rpx" :prop="im.field" :required="im.required"
								v-if="im.type === 'text'">
								<u-input style="width: 100%;" :placeholder="im.placeholder" :value="form[im.field]"
									@input="(val) => { inputChange(val, im) }" type="text" :border="im.border"
									:disabled="im.disabled" />
							</u-form-item>
							<u-form-item :label="im.name" label-width="200rpx" :prop="im.field" :required="im.required"
								v-if="im.type === 'number'">
								<u-input style="width: 100%;" :placeholder="im.placeholder" :value="form[im.field]"
									@input="(val) => { inputChange(val, im) }" type="number" :border="im.border" />
							</u-form-item>
							<u-form-item :label="im.name" label-width="200rpx" :prop="im.field" :required="im.required"
								v-if="im.type === 'textarea'">
								<u-input style="width: 100%;" :placeholder="im.placeholder" :value="form[im.field]"
									@input="(val) => { inputChange(val, im) }" type="textarea" :border="im.border" />
							</u-form-item>
							<!-- 输入框+右侧按钮 点击按钮跳转页面选择数据 返回显示输入框内容 -->
							<u-form-item :label="im.name" label-width="200rpx" :prop="im.field" :required="im.required"
								v-if="im.type === 'textDataChange'">
								<view class="u-flex u-row-between u-flex-1">
									<u-input style="width: 100%;" :placeholder="fxgcs || im.placeholder"
										:value="form[im.field]" type="text" :border="im.border" v-if="!fxgcs"
										:disabled="im.disabled" />
									<text v-else>{{fxgcs}}</text>
									<u-icon name="plus-circle" size="40" color="#2979ff" style="margin-left: 4rpx;"
										@click="textChange(im)"></u-icon>
								</view>
							</u-form-item>
						</block>
					</view>
					<!-- 表格列表数据 -->
					<u-table v-if="tableTextData && tableTextData.length" font-size="20">
						<u-tr>
							<u-td width="20%">序号</u-td>
							<u-td width="60%">文件名称</u-td>
							<u-td width="20%">填写状态</u-td>
						</u-tr>
						<u-tr v-for="(tableItem, tableIndex) in tableTextData" :key="tableIndex">
							<u-td width="20%">{{ tableIndex + 1 }}</u-td>
							<u-td width="60%">
								<view style="color: #2979FF; font-size: 20rpx;" @click="openTable(tableItem)">
									{{ tableItem.bgmc }}
								</view>
							</u-td>
							<u-td width="20%">
								<view>{{ tableItem.sftx === 's' ? '已填写' : '未填写' }}</view>
							</u-td>
						</u-tr>
					</u-table>
					<u-form-item label="办理备注" label-width="200rpx" prop="remark" :required="info.remark">
						<u-input type="textarea" placeholder="请输入办理备注" :border="true" :clearable="true" class="u-flex-1"
							v-model="form.remark" />
					</u-form-item>

					<!-- 维保单 012、013、017、019办理节点 各个施工项目 要求上传保养图片-->
					<view v-if="['388943180c7b441e8f5474ec2c7a0e22','2319919dccef4c7e8f2f39e14ff8e6ee','302491c8af474af887463c5811a64bb6',
					'e3788832501b4d378c6e5d9c85313844'].includes(order.workitemData.transition_id)">
						<view v-if="byzp && byzp.length > 0">
							<view v-for="(item,index) in byzp" :key="index">
								<u-form-item :label="item.name" label-width="200rpx" :required="true"
									v-if="item.showString.includes(detail.fwxm)">
									<u-upload width="150rpx" height="150rpx" @on-remove="onRemove(item,$event)"
										:file-list="item.previewfileList" @on-success="successCallbackBytp(item,$event)"
										:max-size="8 * 1024 * 1024" :max-count="2" :action="action" :name="filename"
										:form-data="formData" :show-progress="false">
									</u-upload>
								</u-form-item>
							</view>
						</view>
					</view>
					<!-- 所有类型工单 流程节点 从 011节点开始-结束节点 都需要上传图片 不包含 如上012、013、017、019办理节点 -->
					<view v-if="!is11_begin && (!['388943180c7b441e8f5474ec2c7a0e22','2319919dccef4c7e8f2f39e14ff8e6ee','302491c8af474af887463c5811a64bb6',
					'e3788832501b4d378c6e5d9c85313844'].includes(order.workitemData.transition_id))">
						<view v-if="byzp && byzp.length > 0">
							<view v-for="(item,index) in byzp" :key="index">
								<u-form-item :label="item.name" label-width="200rpx" :required="true">
									<u-upload width="150rpx" height="150rpx" @on-remove="onRemove(item,$event)"
										:file-list="item.previewfileList" @on-success="successCallbackBytp(item,$event)"
										:max-size="8 * 1024 * 1024" :max-count="2" :action="action" :name="filename"
										:form-data="formData" :show-progress="false">
									</u-upload>
								</u-form-item>
							</view>
						</view>
					</view>
				</view>

			</customCard>

			<customCard title="准备方案" :bodyStyle="{padding: '16rpx'}" v-if="['b1a32087297f4b05bc7e33a9bac72f95','1079e231e5744d42a37a967e1d6379ef','297f847f09184ca48155f9824a38cff8',
				'1038ebd81c81416a88f30b8203806c3e'].includes(order.workitemData.transition_id)">
				<!-- 维保流程/大修改造/新机安装/故障处理  005节点技术员准备方案 -->
				<view class="u-p-l-16 u-p-r-16">
					<u-form-item :label="item.label" label-width="200rpx" :required="item.status==='wc2'"
						v-for="(item, index) in readyList" :key="index">
						<view class="u-flex">
							<!-- 完成/未完成单选框 -->
							<u-radio-group v-model="item.status" @change="onChangeProgramme(item,$event)" size="24"
								v-if="item.value !== 'qtfjsm'">
								<u-radio :key="key" v-for="(item, key) of item.wayList" :name="item.wayIndex">
									<view style="color: #303133;">{{item.way}}</view>
								</u-radio>
							</u-radio-group>
							<view v-else style="width: 300rpx; margin-right: 16rpx;">
								<!-- 附加说明 输入框-->
								<u-input type="textarea" v-model="item.remark" :border="true" style="width: 100%;" />
							</view>
							<!-- 上传按钮 -->
							<u-upload v-if="!item.file && item.isUpload" :custom-btn="true" :show-upload-list="false"
								@on-success="successCallback(item,$event)" :max-size="8 * 1024 * 1024" :max-count="1"
								:action="action" :name="filename" :form-data="formData" :show-progress="false">
								<u-icon slot="addBtn" name="attach" size="34" color="#2979FF"></u-icon>
							</u-upload>
							<text v-if="item.file" class="u-type-success">上传成功</text>
						</view>
					</u-form-item>
				</view>
			</customCard>
		</u-form>
		<view class="footer">
			<u-button type="primary" throttle-time="2500" @click="handleSubmit">提交</u-button>
		</view>
		<u-modal v-model="showModal" content="未查询到与此业务关联的配件申请单,请确认无误后再提交任务,依然提交吗？" show-cancel-button
			@confirm="sureSubmit" :content-style="{'line-height': '36rpx'}">
		</u-modal>
		<u-modal v-model="modalShow" :content="modalTxt"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import customCard from '@/components/customCard.vue'
	import appointConfig from './appointConfig.js'
	export default {
		components: {
			customCard
		},
		name: 'orderAppoint',
		props: {
			fabFlag: {
				type: Boolean,
				default: false
			},
			tableTextData: {
				type: Array,
				default: []
			},
			fxgcs: {
				type: String,
				default: ''
			}
		},
		watch: {
			fxgcs2: {
				handler(newVal, oldVal) {
					console.log('oldVal', oldVal);
					console.log('newVal', newVal);
				},
				immediate: true,
				deep: true
			},
		},
		data() {
			return {
				is11_begin: false,
				//图片上传参数 start
				filename: 'headImage',
				formData: {
					'accept': 'image/*'
				},
				action: `${this.config.url}/admin/attachment/upload/?uploadName=headImage`,
				imgLength: 0, //图片数量
				imgText: '图片数量为0', //图片数量描述文字
				imgList: [],
				// end
				isPjsqd: true,
				showModal: false,
				byzp: '',
				//005技术员准备方案 填写方案
				readyList: [{
					isUpload: true,
					value: 'sgfa',
					label: '施工方案',
					status: 'wc2',
					wayList: [{
						way: '完成',
						wayIndex: 'wc2'
					}, {
						way: '未完成',
						wayIndex: 'wwc'
					}]
				}, {
					isUpload: true,
					value: 'yjfa',
					label: '应急方案',
					status: 'wc2',
					wayList: [{
						way: '完成',
						wayIndex: 'wc2'
					}, {
						way: '未完成',
						wayIndex: 'wwc'
					}]
				}, {
					isUpload: true,
					value: 'dzfa',
					label: '吊装方案',
					status: 'wc2',
					wayList: [{
						way: '完成',
						wayIndex: 'wc2'
					}, {
						way: '未完成',
						wayIndex: 'wwc'
					}]
				}, {
					isUpload: true,
					value: 'ydfa',
					label: '用电方案',
					status: 'wc2',
					wayList: [{
						way: '完成',
						wayIndex: 'wc2'
					}, {
						way: '未完成',
						wayIndex: 'wwc'
					}]
				}, {
					isUpload: true,
					value: 'dhfa',
					label: '动火方案',
					status: 'wc2',
					wayList: [{
						way: '完成',
						wayIndex: 'wc2'
					}, {
						way: '未完成',
						wayIndex: 'wwc'
					}]
				}, {
					isUpload: true,
					value: 'xcsyfa',
					label: '现场试验方案',
					status: 'wc2',
					wayList: [{
						way: '完成',
						wayIndex: 'wc2'
					}, {
						way: '未完成',
						wayIndex: 'wwc'
					}]
				}, {
					isUpload: true,
					value: 'qtfjsm',
					label: '其他附加说明',
					remark: ''
				}],
				fxgcs2: this.fxgcs,
				order: {},
				detail: {},
				form: {
					remark: '',
					cljg: ''
				}, // 表单数据
				info: {}, // 办理工单信息
				loglist: [],
				wayIndex: 'yuyue_cg',
				wayList: [],
				handles: [],
				rules: {},
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				paramsDate: {
					year: true,
					month: true,
					day: true
				},
				remark: '',
				modalShow: false,
				modalTxt: '选择的时间不能小于当前时间，请重新选择',
				// previewfileList: [{
				// 	url: 'https://dev.doscs.com/demo/chengya/doscall/public/upload/2021/07/21/20210721023345834595.jpeg'
				// }],
				previewfileList: [],
			}
		},
		created() {
			let globalData = getApp().globalData
			this.order = globalData.order || {}
			this.detail = this.order.orderData || {}
			// 调查问卷
			const transitionId = this.order.workitemData.transition_id
			let obj = {
				// 变迁流程id 根据该id显示对应的办理界面内办理方式
				// 维保流程
				'e71a181fbaa24edd98c095f1e9e873f5': 'fgsldsh', //003 分公司领导审核
				'41a93addc6df4a0587f83b4f8910c41d': 'dgcsjd', //004 待工程师接单
				'b1a32087297f4b05bc7e33a9bac72f95': 'jsyzbfa', //005 技术员准备方案
				'de8a27674e604fe29e47257392b630d1': 'gcssgzb', //006 工程师施工准备
				'91e130044d1c48438be36f97096b0a20': 'wcblzrzg', //010节点，完成办理准入资格
				//012-013节点
				'388943180c7b441e8f5474ec2c7a0e22': 'wcjdxnjc',
				'2319919dccef4c7e8f2f39e14ff8e6ee': 'wcqjdjc',
				//大修改造
				'd4cabd1f002249f686077aafa8ee6e7c': 'fgsldsh',
				'9964c438f016474199bbfcf882c98684': 'dgcsjd',
				'1079e231e5744d42a37a967e1d6379ef': 'jsyzbfa',
				'22fdfc49fcb74f5f817ef7562e911571': 'gcssgzb',
				'b61e4fbd95ab43738edfbfc6a82697f3': 'dxcsyjj', //待现场试验交接
				//新机安装
				'c45995d9426643cd82fc934ef1f9334a': 'fgsldsh',
				'ead0c7cbab1f49af81ea0ee12f794968': 'dgcsjd',
				'297f847f09184ca48155f9824a38cff8': 'jsyzbfa',
				'b9cd86f9291140208d89994fb26e15fd': 'gcssgzb',
				'0d6e64e725084687a716886a859e5d7c': 'dxcsyjj',
				// 故障处理
				'f1816707f29645deb793712e948ac3f7': 'fgsldsh',
				'2e1483167e86401d8b619f357c461b2c': 'dgcsjd',
				'1038ebd81c81416a88f30b8203806c3e': 'jsyzbfa',
				'4171cc0362c347be89409af042d27c38': 'gcssgzb',
				'897d34cea75b429e8bed6f9ed5ef6be3': 'gzyy' //选择故障原因
			}
			const key = obj[transitionId]
			// 判断是否有该节点的对应数据  appointConfig文件
			if (key) {
				const info = JSON.parse(JSON.stringify(appointConfig[key]))
				if (transitionId === 'e71a181fbaa24edd98c095f1e9e873f5') {
					info.wayList[2].wayIndex = 'qx'
				}
				if (transitionId === '41a93addc6df4a0587f83b4f8910c41d') {
					info.wayList[0].wayIndex = 'js'
					info.wayList[1].wayIndex = 'th'
				}
				if (transitionId === 'b61e4fbd95ab43738edfbfc6a82697f3') {
					info.wayList[0].handle[0].field = 'dxtysj'
				}
				this.byzp = info.byzp
				this.info = info
				this.wayList = info.wayList || []
				this.rules = info.rules
			} else {
				//取接口的办理方式
				this.wayList = this.order.wayData
			}
			if (this.wayList.length > 0) {
				this.wayIndex = this.wayList[0].wayIndex || this.wayList[0].alias
				this.onChange(this.wayList[0].wayIndex)
			}

			//技术员准备方案节点005 查询该关联工单是否有申请过的配件单
			if (['b1a32087297f4b05bc7e33a9bac72f95', '1079e231e5744d42a37a967e1d6379ef',
					'297f847f09184ca48155f9824a38cff8',
					'1038ebd81c81416a88f30b8203806c3e'
				].includes(this.order.workitemData.transition_id)) {
				this.getPjd()
			}
			//判断当前办理节点 是否是从011节点开始 如果是 需要增加上传图片功能  
			let transtionId_list = JSON.parse(JSON.stringify(appointConfig.transtionId_list))
			this.is11_begin = transtionId_list.includes(transitionId) //为true表示是 004-010节点 false表示 011节点开始-结束节点
			if (!this.is11_begin && (!['388943180c7b441e8f5474ec2c7a0e22', '2319919dccef4c7e8f2f39e14ff8e6ee',
					'302491c8af474af887463c5811a64bb6',
					'e3788832501b4d378c6e5d9c85313844'
				].includes(transitionId))) {
				this.byzp = [{
					name: this.detail.lczt,
					file: ''
				}]
			}
			let previewDataParam = uni.getStorageSync('previewData' + this.detail.gdbh)
			if (previewDataParam?.gdbh === this.detail.gdbh && previewDataParam?.namefileList?.length) {
				this.byzp = previewDataParam.namefileList
				this.byzp.forEach(item => {
					previewDataParam.namefileList.forEach(subItem => {
						if (item.name === subItem.name) {
							if (subItem.file) {
								item.previewfileList = subItem.file.map(ssItem => {
									return {
										url: this.config.url + ssItem.filePath
									}
								})
							}
						}
					})
				})
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.$refs.uForm.setRules(this.rules)
			})
		},
		methods: {
			startRecognize() {
				var options = {};
				options.engine = 'baidu'
				options.continue = true
				const that = this
				options.timeout = 500
				options.lang = 'zh-lmz'
				plus.speech.startRecognize(options, function(s) {
						const string = s.replace(/？|。/g, '')
						that.form.cljg = string
						plus.speech.stopRecognize()
					},
					function(e) {
						console.log("语音识别失败：" + e.message);
					});
			},
			stop() {
				plus.speech.stopRecognize();
			},
			//技术员方案选择
			onChangeProgramme(item, e) {
				console.log('e', e);
				this.$set(item, 'isUpload', true)
				if (item.status === 'wwc') {
					this.$set(item, 'file', '')
					this.$set(item, 'isUpload', false)
				}
			},
			//上传图片成功返回的信息 维保流程 005技术员准备方案办理节点的方案提交附件图片
			successCallback(item, data) {
				let imgList = []
				imgList.push({
					fileName: data.result.fileName,
					filePath: data.result.filePath
				})
				this.$set(item, 'file', imgList)
			},
			//上传图片成功返回的信息 
			successCallbackBytp(item, data) {
				let imgList = []
				if (item.file.length === 1) {
					let obj = [{
						fileName: data.result.fileName,
						filePath: data.result.filePath
					}]
					imgList = [...item.file, ...obj]
				} else {
					imgList.push({
						fileName: data.result.fileName,
						filePath: data.result.filePath
					})
				}
				this.$set(item, 'file', imgList)
				uni.setStorageSync('previewData' + this.detail.gdbh, {
					gdbh: this.detail.gdbh,
					namefileList: this.byzp
				})
			},
			//移除图片事件
			onRemove(item, index) {
				item.file.splice(index, 1)
				
				//重置更新 缓存 对应图片
				let previewDataParam = uni.getStorageSync('previewData' + this.detail.gdbh)
				if (previewDataParam) {
					uni.setStorageSync('previewData' + this.detail.gdbh, {
						gdbh: this.detail.gdbh,
						namefileList: this.byzp
					})
				}
			},
			// 选择办理方式
			onChange(e) {
				for (let i = 0; i < this.wayList.length; i++) {
					if (this.wayList[i].wayIndex === e) {
						this.handles = this.wayList[i].handle || []
						if (this.handles.length > 0) {
							this.handles.forEach(item => {
								if (item.type === 'select' && item.list.length === 0) {
									if (item.field !== 'sfxm') {
										this.$u.post('/admin/dict/linkageDictList', {
											parent_number: item.field
										}).then(res => {
											item.list = res.result
										})
									} else {
										this.$u.post(
											'/admin/UserTable/init?sortField=id&sortOrder=descend&pageNo=1&pageSize=1000', {
												"tplviewid": "ead892dd866f2743fa4001ae8b4d95e6",
												"relation": {},
												"type": "associated",
												"customColumns": [],
												"associated": [{
													"val": this.detail.wdbh,
													"op": "=",
													"field": "glwdbh"
												}]
											}).then(res => {
											item.list = res.result.data ? res.result.data.map((item,
												index) => {
												const obj = item
												item.number = item.xtyhm
												item.name = item.zsxm
												return obj
											}) : []
										})
									}
								} else if (item.type === 'mutil' && item.list.length === 0) {
									this.$u.post('/crm/Workflow/getjilianOption', {
										parent_number: item.param
									}).then(res => {
										item.list = item.param === 'thd' ? res.result.map(im => {
											im.children = im.children || [{
												label: '',
												value: ''
											}]
											im.children = im.children.map(c => {
												c.children = c.children || [{
													label: '',
													value: ''
												}]
												return c
											})
											return im
										}) : res.result
									})
								} else if (item.type === 'time') {
									const val = this.detail.yysmsj && this.detail.yysmsj !==
										'0000-00-00 00:00:00' ?
										this.detail.yysmsj : ''
									this.$set(this.form, item.field, val)
								}
							})
						}
						return false
					}
				}
			},
			onPlay(im, idx) {
				im.show = true
				this.handles.splice(idx, 1, im)
			},
			openTable(tableItem) {
				let globalData = getApp().globalData
				globalData.formData = tableItem
				globalData.orderDataDetail = this.detail
				uni.navigateTo({
					url: `/pages/order/HandleOrder/tableText`
				})
			},
			onCancel(im, idx) {
				im.show = false
				this.handles.splice(idx, 1, im)
			},
			// 选择预约上门时间
			choiceTime(e, im) {
				let time = null
				if (im.type === 'time') {
					time = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`
				} else {
					time = `${e.year}-${e.month}-${e.day}`
				}
				this.form[im.field] = time
				// const date = new Date(time).valueOf()
				// const nowDate = new Date().valueOf()
				// if (date <= nowDate) {
				// 	this.modalShow = true
				// } else {
				// 	this.form[im.field] = time
				// }
			},

			// 单选
			choiceReason(e, im, idx) {
				const val = e[0].value
				im.show = false
				im.value = e[0].label
				this.handles.splice(idx, 1, im)
				this.form[im.field] = val

				// 选项是师傅，把师傅级别带出来
				if (im.field === 'sfxm') {
					this.form[im.field] = e[0].label
					let valObj = {}
					for (let i in im.list) {
						if (im.list[i].xtyhm === val) {
							valObj = im.list[i]
						}
					}
					this.form.sfyhm = val
					for (let k in this.handles) {
						if (this.handles[k].field === 'sfjb') {
							const item = this.handles[k]
							item.value = valObj.sfjb
							this.form.sfjb = valObj['_sfjb_']
						} else if (this.handles[k].field === 'sfdh') {
							this.form.sfdh = valObj['lxdh']
						}
					}
					this.handles = JSON.parse(JSON.stringify(this.handles))
				}
			},

			// 多选
			choiceSq(e, im, idx) {
				let val = ''
				let label = ''
				e.forEach(item => {
					val = val ? `${val},${item.value}` : item.value
					label = label ? `${label},${item.label}` : item.label
				})
				im.value = label
				this.form[im.field] = val
				this.handles.splice(idx, 1, im)
			},

			// input框输入
			inputChange(val, im) {
				this.$set(this.form, im.field, val)
			},

			// 输入框+右侧图标选择切换数据显示
			textChange(im) {
				let ssfgs = this.detail._ssfgs_
				uni.navigateTo({
					url: `/pages/order/HandleOrder/selectMinorEngineer?ssfgs=${ssfgs}`
				});
			},
			//查询关联工单的配件单
			getPjd() {
				let params = {
					sortField: 'id',
					sortOrder: 'descend',
					pageNo: 1,
					pageSize: 999,
					tplviewid: '06283354da5e0766b2fea1c6fedff782',
					flowStatus: 'proceed',
					flowCondition: 'all_process',
					searchString: {
						gdbh: "",
						glgdbh: this.detail.gdbh,
						pjzsl: {},
						pjzje: {}
					}
				}
				this.$u.post('/admin/Centerflow/worklist', params).then(res => {
					if (res.code === 0) {
						if (res.result.data.length === 0) {
							this.isPjsqd = false
						} else {
							this.isPjsqd = true
						}
					}
				})
			},
			sureSubmit() {
				this.isPjsqd = true
				this.handleSubmit()
			},
			// 提交工单
			handleSubmit() {
				if (['b1a32087297f4b05bc7e33a9bac72f95', '1079e231e5744d42a37a967e1d6379ef',
						'297f847f09184ca48155f9824a38cff8',
						'1038ebd81c81416a88f30b8203806c3e'
					].includes(this.order.workitemData.transition_id)) {
					// 技术员准备方案
					let list = this.readyList.filter(item => {
						return item.status === 'wc2'
					})
					let isEnd = list.every(item => {
						return item.file && item.file.length > 0
					})
					//005技术员准备方案节点  校验选择 完成 的方案是否有提交了图片
					if (isEnd) {
						if (!this.isPjsqd) {
							this.showModal = true
							return
						}
					} else {
						this.$u.toast('请在选择了完成的方案中提交对应的附件')
						return
					}
				}
				let globalData = getApp().globalData
				// 004工程师接单节点
				if (this.wayIndex === 'js' && globalData.fxgcs == '') {
					this.$u.toast('请先选择辅修再提交')
					return
				}
				const params = {
					case_id: this.order.workitemData.case_id,
					handleRemarks: this.form.remark,
					handleWay: this.wayIndex,
					workitem_id: this.order.workitemData.workitem_id,
					// tableid: this.info.tableid,
				}
				const key = 'crm_xjaz' //this.info.gdlx
				params[key] = {}
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.handles.forEach(item => {
							if (item.field === 'hhdtype' || item.field === 'thdtype') {
								params[item.field] = this.form[item.field] ? this.form[item.field].split(
									',') : []
							} else if (item.field === 'fxgcs') {
								params.fxgcs_data = getApp().globalData.fxgcs
							} else if (item.field === 'zbwc') {
								//技术员方案提交
								params.jsyfa = []
								this.readyList.forEach(item => {
									params.jsyfa.push({
										famc: item.label,
										wczt: item.file && item.file.length > 0 ? 'wc2' :
											'wwc',
										tp: item.file || '',
										smbz: item.remark || '',
									})
								})
							} else if (['wcqjdjc', 'wcjdxnjc', 'wcjzsyh', 'wcxcjj'].includes(item.field)) {
								//013节点 完成清洁度检查  012节点精度性能检测 017、019节点 
								let byzp12 = this.byzp.filter(item => {
									return item.showString.includes(this.detail.fwxm)
								}) || ''
								let byzpList = byzp12.map(item => {
									return {
										name: item.name,
										file: item.file || []
									}
								})
								params.byzp = byzpList
							} else {
								params[key][item.field] = this.form[item.field]
							}
						})
						// 011节点开始 且 节点id不等于 012、013、017、019节点  上传图片 参数byzp
						console.log('this.byzpthis.byzp', this.byzp);
						if (!this.is11_begin && !['388943180c7b441e8f5474ec2c7a0e22',
								'2319919dccef4c7e8f2f39e14ff8e6ee',
								'302491c8af474af887463c5811a64bb6',
								'e3788832501b4d378c6e5d9c85313844'
							].includes(this.order.workitemData.transition_id)) {
							let byzpList = this.byzp.map(item => {
								return {
									name: item.name,
									file: item.file || []
								}
							})
							params.byzp = byzpList
						}
						if (params.byzp && params.byzp.length) {
							let isByzp = params.byzp.every(item => item.file && item.file.length)
							if (!isByzp) {
								this.$u.toast('请选择上传相应图片')
								return
							}
						}
						//质量回馈单
						if (this.detail.fwxm === '质量回馈') {
							console.log('this.byzp', this.byzp)
							delete params.byzp
							params[key].cljg = this.form.cljg
							if (this.byzp[0].file) {
								let zlhkfj = this.byzp[0].file
								params[key].zlhkfj = zlhkfj
							}
							// params.tableid = this.order.tableid
						}
						params.tableid = this.order.tableid || ''
						params.bqid = this.order.workitemData.transition_id || '' //变迁id
						console.log('提交参数params', params)
						this.$u.post('/admin/workitem/processing', params, true).then(res => {
							if (res.code === 0) {
								uni.removeStorageSync('previewData' + this.detail.gdbh)
								getApp().globalData.fxgcs = ''
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
				});

			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		button::after {
			border: none !important;
		}
	}

	.box {
		padding-bottom: 80rpx;
	}

	.node {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		margin-right: -56rpx;
	}

	.color_blue {
		background-color: #2979ff;
	}

	.color_gray {
		background-color: #c0c4cc;
	}

	.log-content {
		margin-left: -56rpx;
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

	.slot-btn {
		width: 329rpx;
		height: 140rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgb(244, 245, 246);
		border-radius: 10rpx;
	}

	.slot-btn__hover {
		background-color: rgb(235, 236, 238);
	}
</style>
