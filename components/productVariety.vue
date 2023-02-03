<template>
	<view>
		<!-- 品类 -->
		<u-card margin="0rpx" :border="false" border-radius="10">
			<view slot="head">
				<view>请选择产品品类</view>
			</view>
			<view slot="body" class="u-flex u-flex-1 u-flex-wrap">
				<view v-for="(item,index) in dataList" :key="index" class="u-m-r-30 u-m-b-30">
					<u-tag :text="item.label" type="primary" :mode="isactive==index ? 'dark' : 'plain'" @click="selectClick(item,index,1)" />
				</view>
			</view>
		</u-card>
		<!-- 类别 -->
		<u-card margin="0rpx" :border="false" border-radius="10" v-if="categoryList.length > 0">
			<!-- v-if="isactive !== -1"-->
			<view slot="head">
				<view>请选择产品类别</view>
			</view>
			<view slot="body" class="u-flex u-flex-1 u-flex-wrap">
				<view v-for="(item,index) in categoryList" :key="index" class="u-m-r-30 u-m-b-30">
					<u-tag :text="item.label" type="primary" :mode="ategory==index ? 'dark' : 'plain'" @click="selectClick(item,index,2)" />
				</view>
			</view>
		</u-card>
		<!-- 类型 -->
		<u-card margin="0rpx" :border="false" border-radius="10" v-if="typeList.length > 0">
			<!--v-if="ategory !== -1"-->
			<view slot="head">
				<view>请选择产品类型</view>
			</view>
			<view slot="body" class="u-flex u-flex-1 u-flex-wrap">
				<view v-for="(item,index) in typeList" :key="index" class="u-m-r-30 u-m-b-30">
					<u-tag :text="item.label" type="primary" :mode="typeactive==index ? 'dark' : 'plain'" @click="selectClick(item,index,3)" />
				</view>
			</view>
		</u-card>
		<!-- 型号 -->
		<u-card margin="0rpx" :border="false" border-radius="10" v-if="modelList.length > 0">
			<!-- v-if="isactive !== -1"-->
			<view slot="head">
				<view>请选择产品型号</view>
			</view>
			<view slot="body" class="u-flex u-flex-1 u-flex-wrap">
				<view v-for="(item,index) in modelList" :key="index" class="u-m-r-30 u-m-b-30">
					<u-tag :text="item.label" type="primary" :mode="modelactive==index ? 'dark' : 'plain'" @click="chooseSure(item,index)" />
				</view>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		props: ['dataList'],
		watch: {},
		data() {
			return {
				customStyle: {
					marginBottom: '20rpx',
					color: "#303133"
				},
				isactive: -1, //品类选择
				ategory: -1, //类别选择
				typeactive: -1, //类型选择
				modelactive: -1, //型号选择
				variety: [],
				u_class: [],
				CategoryData: [],
				choiceVal: {}, // 选中的数据
				//新增以下
				paramApi: {},
				categoryList: [], //类别
				typeList: [], //类型
				modelList: [] //型号
			};
		},
		methods: {
			selectClick(item, index, number) {
				console.log('item', item)
				this.paramApi.chanpin_fl = item.value
				this.paramApi.cpplLabel = item.label
				if (number == 1) {
					//品类点击
					this.isactive = index
					this.typeList = [] //类型清空
					this.modelList = [] //型号清空
					this.ategory = -1 //类别清除选中效果
					this.typeactive = -1 //类型同上
					this.modelactive = -1 //型号同上
					if (item.children) {
						// 如果存在children 表示可以继续往下展示子类
						this.categoryList = item.children //类别数组
					} else {
						let param = {
							chanpin_fl: item.value
						}
						this.$u.post('/app/Setting/getcpxinghao', param).then(res => {
							this.modelList = res.result
						})
					}
					this.choiceVal = {
						cppl: item.value
					}
					this.$emit('getType', this.choiceVal)
				} else if (number == 2) {
					//类别点击
					this.ategory = index
					this.typeactive = -1 //类型同上
					this.modelactive = -1 //型号同上
					// this.ategory = -1
					if (item.children) {
						this.typeList = item.children //类型数组
					} else {
						let param = {
							chanpin_fl: item.value
						}
						this.$u.post('/app/Setting/getcpxinghao', param).then(res => {
							this.modelList = res.result
						})
					}
					this.choiceVal = {
						cppl: this.choiceVal.cppl,
						cplb: item.value
					}
					this.$emit('getType', this.choiceVal)
				} else if (number == 3) {
					//类型点击
					this.typeactive = index
					if (!item.children) {
						let param = {
							chanpin_fl: item.value
						}
						this.$u.post('/app/Setting/getcpxinghao', param).then(res => {
							this.modelList = res.result
						})
					}
					this.choiceVal = {
						cppl: this.choiceVal.cppl,
						cplb: this.choiceVal.cplb,
						cplx: item.value
					}
					this.$emit('getType', {
						cplx: item.value
					})
				}
			},
			//型号
			chooseSure(item, index) {
				this.modelactive = index
				this.paramApi.cplb = ''
				this.paramApi.cplx = ''
				this.paramApi.cpxh = item.value
				this.paramApi.cpxhLabel = item.label
				this.choiceVal = Object.assign(this.choiceVal, { cpxh: item.value })
				this.$emit('getType', this.choiceVal)
			}
		},
	}
</script>

<style lang="scss">
	.selectClass {
		background-color: $u-type-primary !important;
		color: white !important;
	}
</style>
