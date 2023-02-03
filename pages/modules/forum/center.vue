<template>
	<view>
		<u-toast ref="uToast" />
		<u-sticky>
			<!--吸顶 只能有一个根元素  -->
			<view style="background: #F3F4F6;">
				<view class="u-flex u-p-t-26 u-p-l-16 u-p-r-16 u-p-b-12">
					<u-search class="u-flex-1" placeholder="请输入问题标题" bg-color="#fff" v-model="formParam.keyword" @click="goSearch"
					 @custom="onsearch"></u-search>
					<u-icon name="filter" @click="showFilter" custom-prefix="custom-icon" size="45" color="#2979ff"></u-icon>
				</view>
			</view>
		</u-sticky>
		<view class="u-m-t-16 u-p-l-32 u-p-r-32" style="background-color: #FFFFFF;">
			<view v-for="(item,index) in searchList" :key="index" @click="goBack(item)" class="u-border-bottom u-p-t-20 u-p-b-20">
				<text class="u-content-color">{{item.cpxh}}</text>
				<text class="u-m-l-30 u-main-color">{{item.cpmc}}</text>
			</view>
		</view>
		<view v-for="(item,index) in dataList" :key="index">
			<u-card @click="goInfo(item)" border-radius="0" padding="8" margin="0rpx" :head-border-bottom="false" :border="false">
				<view slot="body">
					<view class="u-p-l-16 u-p-r-16">
						<view class="u-font-16 u-m-b-20 u-main-color u-line-2" style="line-height: 50rpx;">{{item.title}}</view>
						<view class="u-flex u-row-between u-m-t-10 u-m-b-14 u-content-color">
							<view>
								<text>浏览 {{item.views}}</text>
								<text class="u-m-l-10">·</text>
								<text class="u-m-l-10 u-m-r-10">回答 {{item.answer}}</text>
							</view>
							<!-- <view>{{item.effect_start_time}}</view> -->
							<view>{{item.inputtime}}</view>
						</view>
					</view>
				</view>
			</u-card>
			<u-gap></u-gap>
		</view>
		<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
		<view style="position: fixed; bottom: 200rpx; right: 50rpx;">
			<u-icon @click="goPutQuestions" name="edit-square" custom-prefix="custom-icon" size="70" class="u-type-primary"></u-icon>
		</view>


		<u-popup v-model="show" mode="left" width="70%">
			<view class="popupLeft">
				<view class="u-p-16">
					<view class="u-p-b-16">排序规则</view>
					<view class="u-m-r-16 u-m-b-16" v-for="(item, index) in sortRulesList" :key="index">
						<view class="popupLeftContent">
							<u-tag :text="item.name" :mode="item.tagStyle" @click="sortRules(item, index)"></u-tag>
						</view>
					</view>
				</view>
				<view class="u-p-16">
					<view class="u-p-b-16">问题分类</view>
					<view class="u-flex u-flex-wrap">
						<view class="u-m-r-16 u-m-b-16" v-for="(item, index) in categorysList" :key="index">
							<u-tag :text="item.name" :mode="item.tagStyle" @click="categorys(item, index)"></u-tag>
						</view>
					</view>
				</view>
				<view class="u-p-16">
					<view class="u-p-b-16">与我有关</view>
					<view class="u-flex u-flex-wrap">
						<view class="u-m-r-16 u-m-b-16" v-for="(item, index) in myList" :key="index">
							<u-tag :text="item.name" :mode="item.tagStyle" @click="my(item, index)"></u-tag>
						</view>
					</view>
				</view>
			</view>
			<view class="popupLeftFooter">
				<u-button @click="resetFilter()" size="medium">重置</u-button>
				<u-button type="primary" @click="show = false;downCallback();" size="medium">确定</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	//引入混入的文件
	import loadPage from './modulePublic/mixins/loadPage.js'
	// //引入 loading状态组件
	import ListLoadingMore from './modulePublic/sonComponents/ListLoadingMore.vue'
	export default {
		components: {
			ListLoadingMore
		},
		mixins: [loadPage],
		data() {
			return {
				sortRulesList: [],
				categorysList: [],
				myList: [{
					type: 0,
					name: '全部',
					tagStyle: 'light'
				}, {
					type: 1,
					name: '我提问的',
					tagStyle: 'light'
				}, {
					type: 2,
					name: '我回答的',
					tagStyle: 'light'
				}, {
					type: 3,
					name: '我关注的',
					tagStyle: 'light'
				}],
				filterForm: {},
				//以上新增
				url: '',
				show: false,
				cpjlList: uni.getStorageSync('cpjlListOption'), //品类数组
				modelList: [], //型号数组
				formParam: {
					keyword: "",
				},
				searchList: [],
				questionList: [],
				param: '',
				//分页参数如下
				pageSize: 8, //这里可随意控制每页显示条数 也可删掉该参数，根据业务需求即可，在loadPage.js混入文件有定义 默认是20条/页
				initial: {
					apiName: '/forum/Index/init', // 分页数据接口地址
					getDataListIsPage: true, // 是否分页
				},
				listName: 'result', //接口返回的数据名
				dataForm: { //请求参数
					keyword: '',
					sortOrder: 'desc', //排序规则 默认：'desc' -倒叙 ，'asc' = 正序
					categorys: [] //分类编号
				},
			}
		},
		methods: {
			//点击筛选按钮图标 弹出左侧弹框
			showFilter() {
				this.show = true
			},
			//排序规则数组
			getsortRulesList() {
				let param = {}
				this.$u.post('/forum/Index/sortRules', param, true).then(res => {
					this.sortRulesList = []
					res.result.forEach((item, index) => {
						item.tagStyle = 'light'
						this.sortRulesList.push(item)
					})
				})
			},
			sortRules(item, index) { //点击排序里面按钮
				this.sortRulesList.forEach((subItem, subIndex) => {
					if (index == subIndex) {
						this.sortRulesList[index].tagStyle = 'dark'
					} else {
						subItem.tagStyle = 'light'
					}
				})
				this.filterForm.apisortRule = item.rules
			},
			//分类列表
			getcategorysList() {
				let param = {
					recommended: 0
				} //默认：0-表示请求所有分类，1表示只请求热门分类
				this.$u.post('/forum/Setting/getCategorys', param, true).then(res => {
					this.categorysList = []
					res.result.data.forEach((item, index) => {
						item.tagStyle = 'light'
						this.categorysList.push(item)
					})
					this.categorysList.unshift({
						name: '全部',
						tagStyle: 'light',
						number: 0
					})
				})
			},
			categorys(item, index) { //点击分类里面按钮
				this.categorysList.forEach((subItem, subIndex) => {
					if (index == subIndex) {
						this.categorysList[index].tagStyle = 'dark'
					} else {
						subItem.tagStyle = 'light'
					}
				})
				let apicategorys;
				if (item.number === 0) { //全部 默认传[]
					apicategorys = []
				} else { //否则传对应的number值
					apicategorys = [item.number]
				}
				this.filterForm.apicategorys = apicategorys
			},
			//与我有关  无需接口调用 前端写死
			my(item, index) { //点击与我有关里面按钮
				this.myList.forEach((subItem, subIndex) => {
					if (index == subIndex) {
						this.myList[index].tagStyle = 'dark'
					} else {
						subItem.tagStyle = 'light'
					}
				})
				this.filterForm.apitype = item.type
			},
			downCallback() { //筛选点击确定
				this.dataForm.sortRule = this.filterForm.apisortRule
				this.dataForm.categorys = this.filterForm.apicategorys
				this.dataForm.type = this.filterForm.apitype
				this.getDataList()
			},
			//点击进问题详情页
			goInfo(item) {
				uni.removeStorageSync('info') //删除上一次的详情
				uni.setStorageSync('number', item.number)
				uni.navigateTo({
					url: `./centerQuestionInfo?number=${item.number}`
				});
			},
			goPutQuestions() {
				uni.navigateTo({
					url: './putQuestions'
				});
			},
			//点击重置
			resetFilter() {
				let sortRulesList = this.sortRulesList
				let categorysList = this.categorysList
				let myList = this.myList
				sortRulesList.forEach((item, index) => {
					item.tagStyle = 'light'
				})
				categorysList.forEach((item, index) => {
					item.tagStyle = 'light'
				})
				myList.forEach((item, index) => {
					item.tagStyle = 'light'
				})
				//重新刷新请求全部数据
				this.dataForm.keyword = ''
				this.dataForm.sortOrder = 'desc'
				this.dataForm.categorys = []
				this.getDataList()
			},
			goSearch() {},
			goBack(item) {

			},
			//点击搜索
			onsearch(val) {
				this.dataForm = { //请求参数
					keyword: val,
					sortOrder: 'desc', //排序规则 默认：'desc' -倒叙 ，'asc' = 正序
					categorys: [] //分类编号
				}
				this.getDataList()
			},
		},
		onShow() {
			//最新如下
			this.getDataList()
		},
		onLoad(e) {
			this.getsortRulesList()
			this.getcategorysList()
		},
	}
</script>

<style lang="scss" scoped>
	//抽屉底部 确定重置按钮
	.popupLeftFooter {
		position: fixed;
		padding-bottom: 20rpx;
		bottom: 0;
		width: 100%;
		display: flex;
		background: #FFFFFF;
		justify-content: space-around;

		button {
			width: 200rpx;
		}

	}
</style>
