<template>
	<view class="u-p-b-80">
		<view style="background: #F3F4F6; display: flex; align-items: center;">
			<view class="u-flex u-padding-16 u-flex-1">
				<u-search class="u-flex-1" placeholder="搜索服务人员" bg-color="#fff" v-model="keyword" @search="onsearch"
					@custom="onsearch"></u-search>
				<text @click="show = true" class="iconfont filter"></text>
			</view>
		</view>
		<view style="width: 100%; overflow-x: hidden; text-align: center;">
			<u-card margin="0" :show-head="false" :body-style="{padding: '8rpx'}" v-for="(item,index) in dataList"
				:key="index">
				<view slot="body" class="u-flex">
					<view class="checkBox u-flex u-col-center u-m-l-8">
						<u-checkbox-group>
							<u-checkbox v-model="item.checked" :name="item.id"
								@change="(e) => { checkboxGroupChange(e,item) }"></u-checkbox>
						</u-checkbox-group>
					</view>
					<view class="u-flex u-row-around u-flex-1 u-border-left" style="margin-left: -12rpx;">
						<view class="szfcgcs">
							<u-row>
								<u-col :span="4">
									<view><text>姓名：</text><text>{{item.xm}}</text></view>
									<view><text>所属部门：</text><text>{{item.ssbm}}</text></view>
									<view><text>岗位：</text><text>{{item.gw}}</text></view>
								</u-col>
								<u-col :span="4">
									<view class="u-line-1"><text>电话号码：</text><text>{{item.dhhm}}</text></view>
									<view class="u-line-1"><text>分公司：</text><text>{{item.ssfgs}}</text></view>
									<view><text>职称：</text><text>{{item.zc}}</text></view>
								</u-col>
								<u-col :span="4">
									<view><text>性别：</text><text>{{item.xb}}</text></view>
									<view class="u-line-1"><text>参工日期：</text><text>{{item.cgrq}}</text></view>
									<view><text>技术等级：</text><text>{{item.jsdj}}</text></view>
								</u-col>
							</u-row>
							<u-row>
								<u-col :span="12"><text>擅长技能：</text><text>{{item.szjn}}</text></u-col>
							</u-row>
							<u-row>
								<u-col :span="12"><text>具备证书：</text><text>{{item.jbzs}}</text></u-col>
							</u-row>
						</view>
						<view>
							<u-image v-if="item.zp && item.zp.length > 0" width="100rpx" height="100rpx"
								:src="config.url + item.zp[0].filePath" mode=""></u-image>
							<u-image v-else width="100rpx" height="100rpx" mode="">
								<view slot="error" style="font-size: 18rpx;">暂无图片</view>
							</u-image>
						</view>
					</view>
				</view>
			</u-card>
		</view>
		<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
		<u-button type="primary" @click="selectSure"
			:custom-style="{padding: '16rpx', position: 'fixed', bottom: '0', width: '100%', 'z-index': '2'}">
			确认选择
		</u-button>
		<u-popup v-model="show" mode="left">
			<view class="popupLeft u-m-t-32">
				<view class="popupLeftItem">
					<view class="popupLeftTitle">排序规则</view>
					<view class="popupLeftContent" v-for="(itemChildren, indexChildren) in pxgz" :key="indexChildren">
						<u-tag :text="itemChildren.name"
							@click="pxgzIndex = indexChildren; pxgzVal = itemChildren.value"
							:mode="pxgzIndex === indexChildren ? 'dark' : 'light'"></u-tag>
					</view>
				</view>
				<view class="popupLeftItem">
					<view class="popupLeftTitle">擅长技能</view>
					<view class="popupLeftContent" v-for="(itemChildren, indexChildren) in fwlb" :key="indexChildren">
						<u-tag :text="itemChildren.name"
							@click="fwlbIndex = indexChildren; fwlbVal = itemChildren.value"
							:mode="fwlbIndex === indexChildren ? 'dark' : 'light'"></u-tag>
					</view>
				</view>
				<view class="popupLeftItem">
					<view class="popupLeftTitle">具备证书</view>
					<view class="popupLeftContent" v-for="(itemChildren, indexChildren) in jbzs" :key="indexChildren">
						<u-tag :text="itemChildren.name"
							@click="jbzsIndex = indexChildren; jbzsVal = itemChildren.value"
							:mode="jbzsIndex === indexChildren ? 'dark' : 'light'"></u-tag>
					</view>
				</view>
			</view>
			<view class="popupLeftFooter">
				<u-button @click="pxgzIndex = -1;fwlbIndex = -1;jbzsIndex = -1" size="mini"
					:custom-style="{width: '200rpx'}">重置
				</u-button>
				<u-button type="primary" @click="sureFilter" size="mini" :custom-style="{width: '200rpx'}">确定</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	//引入混入的文件
	import loadPage from '@/pages/order/modulePublic/mixins/loadPage.js'
	//引入 loading状态组件
	import ListLoadingMore from '@/pages/order/modulePublic/sonComponents/ListLoadingMore.vue'
	export default {
		components: {
			ListLoadingMore
		},
		mixins: [loadPage], //使用混入文件
		data() {
			return {
				show: false,
				pxgzVal: '',
				pxgzIndex: -1,
				pxgz: [{
					name: '默认（按姓名首字母排序）',
					value: 'xm'
				}, {
					name: '按参工日期升序',
					value: 'cgrq'
				}],
				fwlbVal: '',
				fwlbIndex: -1,
				fwlb: [],
				jbzsVal: '',
				jbzsIndex: -1,
				jbzs: [],
				//
				initial: {
					apiName: '/crm/Order/fxgcslb',
					getDataListIsPage: true,
				},
				listName: 'result',
				dataForm: {
					searchString: {
						ssfgs: ''
					},
					sortField: "id",
					sortOrder: "ascend",
					tplviewid: "b2ed068b0996174adfa86df412f02ea9"
				},
				//分页参数如上
				config: this.config,
				keyword: '',
				show: false,
				selectRow: []
			}
		},
		methods: {
			sureFilter() {
				if (this.pxgzIndex !== -1 || this.fwlbIndex !== -1 || this.jbzsIndex !== -1) {
					this.pxgzIndex = -1;
					this.fwlbIndex = -1;
					this.dataForm.sortField = this.pxgzVal || 'id'
					this.dataForm.searchString.szjn = this.fwlbVal || ''
					this.dataForm.searchString.jbzs = this.jbzsVal || ''
					this.getDataList()
					this.dataForm.sortField = 'id'
					this.dataForm.searchString.szjn = ''
					this.dataForm.searchString.jbzs = ''
				}
				this.show = false
			},
			//擅长技能
			getSzjn() {
				let param = {
					parentNumber: 'szzyjn'
				}
				this.$u.post('/admin/dict/getCascaderData', param).then(res => {
					this.fwlb = res.result.map(item => {
						let obj = {
							name: item.label,
							value: item.value
						}
						return obj
					})
				})
			},
			//具备证书
			getJbzs() {
				let param = {
					parentNumber: 'zzzsmc'
				}
				this.$u.post('/admin/dict/getCascaderData', param).then(res => {
					this.jbzs = res.result.map(item => {
						let obj = {
							name: item.label,
							value: item.value
						}
						return obj
					})
				})
			},
			//确认选择
			selectSure() {
				let globalData = getApp().globalData
				console.log('this.selectRow', this.selectRow)
				console.log('globalData.fxgcs', globalData.fxgcs)
				if (this.selectRow.length === 0 && globalData.fxgcs.length === 0) {
					this.$u.toast('请至少选择一个工程师')
					return
				}
				if (globalData.fxgcs) {
					globalData.fxgcs = [...globalData.fxgcs, ...this.selectRow]
				} else {
					globalData.fxgcs = this.selectRow
				}
				let array = Array.from(new Set(globalData.fxgcs));
				globalData.fxgcs = array
				uni.navigateBack({
					delta: 1
				})
			},
			getShow(e) {
				this.show = e
			},
			onsearch(e) {
				console.log(e);
				this.dataForm.searchString.xm = e
				this.getDataList()
			},
			checkboxGroupChange(e, item) {
				let globalData = getApp().globalData
				if (globalData.fxgcs && e.value) {
					globalData.fxgcs.forEach((subItem, subIndex) => {
						if (subItem.id !== item.id && !this.selectRow.includes(subItem)) {
							this.selectRow.push(item)
						}
					})
				} else if (!globalData.fxgcs && e.value) {
					this.selectRow.push(item)
				} else if (globalData.fxgcs && !e.value) {
					globalData.fxgcs.forEach((subItem, subIndex) => {
						if (subItem.id === item.id) {
							globalData.fxgcs.splice(subIndex, 1)
						}
					})
					if (this.selectRow) {
						this.selectRow.forEach((subItem, subIndex) => {
							if (subItem.id === item.id) {
								// console.log("删除哦");
								this.selectRow.splice(subIndex, 1)
							}
						})
					}
				}
				if (!e.value) {
					// console.log("进入这里了");
					this.selectRow.forEach((subItem, subIndex) => {
						if (subItem.id === item.id) {
							// console.log("删除这个");
							this.selectRow.splice(subIndex, 1)
						}
					})
				}
			}
		},
		watch: {
			dataList(newVal, oldVal) {
				let globalData = getApp().globalData
				if (globalData.fxgcs) {
					setTimeout(() => {
						newVal.forEach((item, index) => {
							globalData.fxgcs.forEach((subItem, subIndex) => {
								if (item.id === subItem.id) {
									this.$set(item, 'checked', true)
								}
							})
						})
					}, 500)
				}
			}
		},
		onLoad(option) {
			this.dataForm.searchString.ssfgs = option.ssfgs
			this.getSzjn()
			this.getJbzs()
			this.getDataList()
		}
	}
</script>

<style lang="scss" scoped>
	@import '../index.scss';

	.szfcgcs {
		width: 530rpx;

		view {
			line-height: 30rpx;
		}

		text {
			font-size: 14rpx;
		}
	}
</style>
