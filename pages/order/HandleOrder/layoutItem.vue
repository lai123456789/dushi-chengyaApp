<template>
	<view>
		<!-- 分割线 -->
		<block v-if="record.type === 'divider'">
			<view class="u-p-t-10 u-p-b-10">
				<u-divider half-width="400" border-color="#e5e4e9" color="#000" fontSize="20">{{record.label}}
				</u-divider>
			</view>
		</block>
		<!-- 卡片布局 -->
		<block v-else-if="record.type === 'card'">
			<u-card margin="0 0 16rpx 0" :border-radius="0" :head-style="{padding: '8rpx', 'background': '#FAFAFA'}"
				:body-style="{padding: '12rpx 8rpx'}">
				<view slot="head" style="font-size: 20rpx; font-weight: 500;">{{record.label}}</view>
				<view slot="body" v-if="record.list.length > 0">
					<layoutItem v-for="(record, index) in record.list" :key="index" :record.sync="record"
						@handleChange="handleChange" @checkInput="checkInput" />
				</view>
			</u-card>
		</block>
		<!-- 标签页布局 -->
		<block v-else-if="record.type === 'tabs'">
			<u-dropdown>
				<u-dropdown-item v-model="value1" :title="title" height="400" :options="record.columns"
					@change="changeTab">
				</u-dropdown-item>
			</u-dropdown>
			<block v-if="selectItemShow && selectItem && selectItem.list.length > 0">
				<layoutItem v-for="(item, index) in selectItem.list" :key="index" :record.sync="item"
					@handleChange="handleChange" />
			</block>
			<block v-else>
				<view v-for="(tabItem, index) in selectItem" :key="index">
					<layoutItem v-for="(item, sindex) in tabItem.list" :key="sindex" :record.sync="item"
						@handleChange="handleChange" @checkInput="checkInput" />
				</view>
			</block>
		</block>
		<!-- 表格 布局 -->
		<block v-else-if="record.type === 'table'">
			<view class="a-table" :style="[tbStyle]" v-if="list.length > 0">
				<block v-for="(item, index) in list" :key="index">
					<view v-if="item.colspan != 0 && item.rowspan != 0" class="item" :style="[item.tdStyle]">
						<layoutItem v-for="(record, subIndex) in item.list" :key="subIndex" :record.sync="record"
							@handleChange="handleChange" @checkInput="checkInput" />
					</view>
				</block>
			</view>
		</block>
		<!-- 栅格布局 -->
		<block v-else-if="record.type === 'grid'">
			<view style="background-color: #FFFFFF; padding: 8rpx 0;" v-if="record.columns.length > 0">
				<u-row>
					<u-col :span="item.span / 2" v-for="(item,index) in record.columns" :key="index">
						<layoutItem v-for="(record, subIndex) in item.list" :key="subIndex" :record.sync="record"
							@handleChange="handleChange" @checkInput="checkInput" />
					</u-col>
				</u-row>
			</view>
		</block>
		<!-- html -->
		<block v-else-if="record.type === 'html'">
			<view v-html="record.options.defaultValue"></view>
		</block>
		<!-- UI组件 --> 
		<block v-else>
			<!-- 文字 -->
			<view v-if="record.type == 'text'" style="font-size: 20rpx; text-align: center;">{{record.label}}</view>
			<!-- 单行文本 -->
			<view v-else-if="['input'].includes(record.type)">
				<text style="font-size: 20rpx;" class="u-content-color" v-if="record.labelShow === '1'">{{ record.label }}:</text> 
				<u-input v-model="record.options.defaultValue" type="text" input-align="center"
					:clearable="false" height="30" :input-style="{'font-size': '20rpx'}" placeholder=" " @focus="checkInput(record)"
					/>
			</view>
			<!-- 多行文本 -->
			<view v-else-if="['textarea'].includes(record.type)">
				<u-divider fontSize="0" border-color="#FFF" height="0"></u-divider> <!-- 加分割线为了解决多行文本框有时无法显示完内容的问题 -->
				<text style="font-size: 20rpx;" class="u-content-color" v-if="record.labelShow === '1'">{{ record.label }}:</text>
				<u-input v-model="record.options.defaultValue" type="textarea" input-align="center"
					:clearable="false" height="30" :input-style="{'font-size': '20rpx'}" placeholder=" " @focus="checkInput(record)"
					/>
			</view>
			<!-- 占位符 -->
			<view v-else-if="record.type == 'placeholder'" class="u-p-t-8 u-p-b-8">
				<u-divider></u-divider>
			</view>
			<!-- 数量输入框 -->
			<view v-else-if="record.type == 'number'" class="u-p-t-8 u-p-b-8">
				<u-number-box :input-width="50" :input-height="30" size="20" v-model="record.options.defaultValue"></u-number-box>
			</view>
			<!-- 单选框 -->
			<view v-else-if="record.type == 'radio'" class="u-p-l-8">
				<u-radio-group v-model="record.options.defaultValue" size="20rpx" width="60rpx"
					v-if="record.options.options.length > 0">
					<u-radio label-size="18rpx"
						v-for="(item, index) in record.options.options" :key="index" :name="item.value">
						{{item.label}}
					</u-radio>
				</u-radio-group>
			</view>
			<!-- 复选框 -->
			<view v-else-if="record.type == 'checkbox'" class="u-p-l-8">
				<u-checkbox-group @change="(e) => { record.options.defaultValue = e }"
					v-if="recordDate.options.options.length > 0">
					<u-checkbox @change="checkboxChange" v-model="item.checked"
						v-for="(item, index) in recordDate.options.options" :key="index" :name="item.value">
						{{item.label}}
					</u-checkbox>
				</u-checkbox-group>
			</view>
			<!-- 开关 -->
			<view v-else-if="record.type == 'switch'">
				<u-switch v-model="recordDate.options.defaultValue"
					@change="(e) => {recordDate.options.defaultValue = e}"></u-switch>
			</view>
			<!-- 日期 -->
			<view v-else-if="record.type == 'date'">
				<u-input @click="dateShow = !dateShow" type="text" placeholder="选择日期" :disabled="true"
					:custom-style="{fontSize: '26rpx', textAlign: 'center'}"
					v-model="recordDate.options.defaultValue" />
				<u-calendar v-model="dateShow" mode="date" safe-area-inset-bottom
					@change="(e) => { record.options.defaultValue = e.result}">
				</u-calendar>
			</view>
			<!-- 时间 -->
			<view v-else-if="record.type == 'time'">
				<u-input placeholder="请选择时间" disabled v-model="recordDate.options.defaultValue"
					@click="timeShow = !timeShow" :custom-style="{fontSize: '20rpx', textAlign: 'center'}" />
				<u-picker mode="time" v-model="timeShow" :params="params"
					@confirm="(e) => { record.options.defaultValue = `${e.hour}:${e.minute}:${e.second}` }">
				</u-picker>
			</view>
			<!-- 下拉框 -->
			<view v-else-if="record.type == 'select'">
				<u-dropdown>
					<u-dropdown-item :title="recordDate.options.defaultValue || record.options.options[0].label"
						@change="changeSelect" :options="record.options.options">
					</u-dropdown-item>
				</u-dropdown>
			</view>
			<!-- 上传图片 -->
			<view v-else-if="record.type == 'uploadImg'">
				<u-upload width="130" height="130" @on-success="successCallback" :max-size="8 * 1024 * 1024"
					:max-count="4" :action="action" :name="filename" @on-remove="onRemove" :form-data="formData"
					:show-progress="false"></u-upload>
			</view>
			<!-- 按钮 -->
			<view v-else-if="record.type == 'button'">
				<u-button :type="record.options.type">{{ record.label }}</u-button>
			</view>
			<!-- 警告提示 -->
			<view v-else-if="record.type == 'alert'">
				<u-alert-tips :type="record.options.type" :title="record.label || '提示'"
					:description="record.options.description || '暂无描述，请设置'"></u-alert-tips>
			</view>
			<!-- 签字板 -->
			<view v-else-if="record.type == 'signature'" @click="goSignature(record.key)" class="u-p-8">
				<view v-if="record.file">
					<!-- 已经签名  显示签过的图片 -->
					<image :src="record.file" style="width: 150rpx; height: 150rpx; border: 1rpx solid #EEE;"></image>
				</view>
				<view v-else
					style="background-color: #EEE; width: 150rpx; height: 150rpx; display: flex; align-items: center; justify-content: center;">
					点击签名
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import layoutItem from './layoutItem.vue'
	export default {
		name: 'layoutItem',
		props: {
			record: {
				type: Object,
				default: {}
			},
			index: {
				type: Number,
				default: 0
			}
		},
		components: {
			layoutItem
		},
		watch: {
			record: {
				handler(newVal, oldVal) {
					this.$emit('handleChange', newVal)
				},
				immediate: true,
				deep: true
			},
			colsLength(newVal) {
				this.tbStyle.gridTemplateColumns = `repeat(${newVal}, ${100 / newVal}%)`
			},
			trs: {
				handler(newVal) {
					const arr = newVal.map((item, rowIndex) => {
						if (item.tds.length > 0) {
							item.tds = item.tds.map((im, colIndex) => {
								im.tdStyle = {
									gridColumnStart: colIndex + 1,
									gridColumnEnd: colIndex + 1 + parseInt(im.colspan),
									gridRowStart: rowIndex + 1,
									gridRowEnd: rowIndex + 1 + parseInt(im.rowspan),
								}
								return im
							})
						}
						return item.tds
					})
					this.list = [].concat(...arr)
				},
				immediate: true,
			}
		},
		data() {
			return {
				value1: 1,
				recordDate: this.record, //初始值 针对UI组件的defaultValue变化
				selectItem: '',
				selectItemShow: true, //首次加载默认显示tab的第一栏
				title: '成压',
				letterHeadData: [],
				//表格布局
				tbStyle: {},
				colsLength: 1,
				trs: [],
				list: [],
				//日期
				dateShow: false,
				// 时间
				timeShow: false,
				params: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: true
				},
				//上传图片
				show: false,
				action: `${this.config.url}/admin/attachment/upload/?uploadName=filename`,
				imgLength: 0,
				imgLengthMax: 4,
				imgText: '',
				imgList: []

			}
		},
		//子组件的页面加载事件
		created() {
			// tab标签布局时标题切换
			if (this.record.type === 'tabs') {
				this.selectItem = this.record.columns[0]
				this.title = this.record.columns[0].label
			}
			// 表格布局时 表格合并处理
			if (this.record.trs) {
				this.trs = this.record.trs
				this.colsLength = this.record.trs[0] && this.record.trs[0].tds.length
			}
		},
		methods: {
			goSignature(key) {
				uni.navigateTo({
					url: `/pages/order/HandleOrder/signature?signatureKey=${key}`
				});
			},
			checkInput(item) {
				this.$emit('checkInput', item)
			},
			//上传图片成功返回的信息
			successCallback(data, index, lists) {
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
				this.imgText = `上传图片(${this.imgList.length}/4)`
			},
			handleChange(e) {
				// 每次切换ui组件值的时候也会进入这个方法
				this.$emit('handleChange', e)
			},
			unmberBoxChange(e, record){
				this.$set(this.record.options, 'min', 0)
				this.$set(this.record.options, 'max', 999999)
				console.log("this.record", this.record)
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxChange(e) {
				this.recordDate.options.options.forEach((item, sindex) => { 
					if (e.name == item.value) {
						this.$set(item, 'checked', true)
					}
				})
			},
			// 下拉框切换
			changeSelect(value) {
				let title = this.recordDate.options.options.find(item => item.value == value)
				this.$set(this.recordDate.options, 'defaultValue', title.label)
			},
			changeTab(value) {
				this.selectItemShow = false
				const that = this
				this.selectItem = this.record.columns.filter((item, index) => {
					if (item.value == value) {
						that.title = item.label
					}
					return item.value == value
				})
			},
		},
	}
</script>
<style lang="scss" scoped>
	.a-table {
		display: grid;
		background: #FFFFFF;
		margin-bottom: 16rpx;
	}

	.item {
		font-size: 1em;
		border: 1px solid #e5e4e9;
		margin: 0px -1rpx -1rpx 0;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
</style>
