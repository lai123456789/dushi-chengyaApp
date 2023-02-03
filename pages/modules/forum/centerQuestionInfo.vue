<template>
	<view style="padding-bottom: 120rpx;">
		<u-card margin="0" :body-style="{padding:'16rpx 32rpx'}" :show-head="false" :border="false" border-radius="0">
			<view slot="body">
				<u-tag class="u-m-r-20 u-m-b-14" type="info" size="mini" mode="plain" :text="item" v-for="(item,index) in info.category_name"
				 :key="index"></u-tag>
				<view class="u-font-16 u-m-t-14 u-main-color">{{info.title}}</view>
				<view class="u-flex u-row-between u-tips-color u-font-13 u-m-t-16 u-m-b-16">
					<view class="u-flex u-col-center">
						<u-image shape="circle" :src="config.url + info.avatar" width="45" height="45"></u-image>
						<view>
							<view class="u-m-l-20 u-m-r-30 u-font-14">{{info.inputuser}}</view>
							<view class="u-m-l-20 u-font-12">{{info.inputtime}}</view>
						</view>
					</view>
					<view>{{info.views}} 浏览</view>
				</view>
				<view>
					<view class="u-content-color u-font-15">
						{{info.content}}
					</view>
					<view class="u-m-t-20">
						<u-row gutter="16">
							<u-col span="4" v-for="(sitem,sindex) in info.images" :key="sindex">
								<view class="u-m-b-40">
									<u-image @click="previewImg(sindex)" :src="config.url + sitem" width="180" height="180"></u-image>
								</view>
							</u-col>
							<u-col span="4" v-if="info.videos">
								<video class="u-m-b-40" :src="config.url + info.videos" controls style="width: 180rpx; height: 180rpx;"></video>
							</u-col>
						</u-row>
					</view>
				</view>

				<view class="u-flex u-row-between u-m-b-10 u-font-13 u-content-color">
					<view>
						{{info.subscribe}}
						<text class="u-m-l-10">已关注</text>
					</view>
					<view>
						<text class="u-type-primary" @click="editQuestion" v-if="info.edit_priv">编辑</text>
						<text class="u-type-error u-m-l-20" @click="delQuestion" v-if="info.del_priv">删除</text>
					</view>
				</view>
			</view>
		</u-card>

		<u-gap></u-gap>
		<view class="u-flex u-row-between u-p-l-32 u-p-r-32">
			<view>{{dataList.length}}条回答</view>
			<view @click="show = true">
				<text class="u-m-r-20">默认排序</text>
				<u-icon name="arrow-down" size="32"></u-icon>
			</view>
		</view>
		<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
		<u-card margin="32rpx 0" @click="goComment(item)" v-for="(item,index) in dataList" :key="index" :body-style="{padding:'16rpx 32rpx'}"
		 :show-head="false" :border="false" border-radius="0">
			<view slot="body">
				<view class="u-flex u-row-between u-p-t-20">
					<view class="u-flex">
						<u-image shape="circle" :src="config.url + item.avatar" width="45" height="45"></u-image>
						<text class="u-m-l-20 u-m-r-20">{{item.inputuser}}</text>
					</view>
					<view v-if="item.bsetanswer ==1">
						<u-tag text="最佳答案" type="error"></u-tag>
					</view>
				</view>
				<view class="u-p-t-20">
					<view class="u-content-color u-font-15 u-m-b-16">
						{{item.content}}
					</view>
					<u-row gutter="16">
						<u-col span="4" v-for="(sitem,sindex) in item.images" :key="sindex">
							<view class="u-m-b-40">
								<u-image @click.native.stop="previewImgAnswer(sindex,item.images)" :src="config.url + sitem" width="180" height="180"></u-image>
							</view>
						</u-col>
						<u-col span="4" v-if="item.videos">
							<video class="u-m-b-40" :src="config.url + item.videos" controls style="width: 180rpx; height: 180rpx;"></video>
						</u-col>
					</u-row>
				</view>
				<view class="u-flex u-row-between u-m-b-16">
					<view class="u-tips-color u-font-13">{{item.inputtime}}</view>
					<view>
						<u-icon name="chat-fill" class="u-tips-color"></u-icon>
						<text class="u-m-l-10">{{item.comment}}</text>
					</view>
					<view>
						<u-button type="primary" plain size="mini" @click="star(item,index)">
							<u-icon :name="item.hasstar?'thumb-up-fill':'thumb-up'" size="35"></u-icon>
							<text class="u-m-l-10">{{item.star}}</text>
						</u-button>
					</view>
				</view>
			</view>
		</u-card>

		<ListLoadingMore :status="loadingStatus"></ListLoadingMore>

		<view class="u-p-20 u-flex u-row-between" style="position: fixed;
		padding: 20rpx;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		z-index: 1000;">
			<u-button style="width: 45%;" type="" @click="follow(info.number)">
				{{info.hassub?'已关注':'关注'}}
			</u-button>
			<u-button style="width: 45%;" type="primary" @click="answer">
				{{info.hasanswer?'编辑回答':'我要回答'}}
			</u-button>
		</view>
		<!-- 删除自己的问题 -->
		<u-modal v-model="showModal" content="是否确认删除" :show-cancel-button="true" @confirm="sureDel"></u-modal>
		<u-toast ref="uToast"></u-toast>
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
		mixins: [loadPage], //使用
		data() {
			return {
				showModal: false,
				show: false, //默认排序弹层
				list: [{
					value: 'inputtime',
					label: '默认' //回答时间是默认
				}, {
					value: 'star',
					label: '点赞数'
				}, {
					value: 'comment',
					label: '评论数'
				}],
				questionNumber: '', //问题编码number
				info: {},
				config: this.config,
				//分页参数如下
				pageSize: 8, //这里可随意控制每页显示条数 也可删掉该参数，根据业务需求即可，在loadPage.js混入文件有定义 默认是20条/页
				initial: {
					apiName: '/forum/Index/getAnswers', // 分页数据接口地址
					getDataListIsPage: true, // 是否分页
				},
				listName: 'result', //接口返回的数据名
				dataForm: { //请求参数
					keyword: '',
					// pageNo: 1,
					// pageSize: 5,
					// sortField:'', //排序字段 默认：inputtime-回答时间 ,可选: star-点赞数 ，comment-评论数
					sortOrder: 'desc', //排序规则 默认：'desc' -倒叙 ，'asc' = 正序
					// categorys: [], //分类编号
					number: ''
				},
			}
		},
		methods: {
			//编辑自己的问题
			editQuestion() {
				uni.setStorageSync('info', this.info)
				uni.navigateTo({
					url: '/pages/modules/forum/putQuestions?isEdit=true'
				});
			},
			//删除自己的问题
			delQuestion() {
				this.showModal = true
			},
			//确认删除问题
			sureDel() {
				let number = this.info.number
				let param = {
					number: [number]
				}
				this.$u.post('/forum/Index/delQuestion', param, true).then(res => {
					if (res.code == 0) {
						this.$refs.uToast.show({
							title: res.message,
							type: 'success'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/modules/forum/center'
							});
						}, 1500)
					} else {
						this.$refs.uToast.show({
							title: res.message,
							type: 'error'
						})
					}
				})
			},
			//去评论
			goComment(item) {
				uni.setStorageSync('questionInfo', this.info) //问题
				let dataLength = this.dataList.length //回答列表总数量
				uni.setStorageSync('answerInfo', item) //回答内容
				uni.navigateTo({
					url: `/pages/modules/forum/lookComment?dataLength=${dataLength}`
				});
			},
			//默认排序弹窗
			confirm(e) {
				console.log(e);
				let newParam = {
					sortField: e[0].value
				}
				this.dataForm = {
					...this.dataForm,
					...newParam
				}
				this.dataList = []
				this.getDataList()
			},
			//点赞
			star(item, index) {
				let param = {
					answer_number: item.number
				}
				this.$u.post('/forum/Setting/changeStar', param, true).then(res => {
					if (res.code == 0) {
						if (res.result.handleway == "up") {
							this.dataList[index].hasstar = true
							this.$refs.uToast.show({
								title: '点赞成功',
								type: 'success'
							})
						} else {
							this.dataList[index].hasstar = false
							this.$refs.uToast.show({
								title: '取消点赞',
								type: 'success'
							})
						}
						this.dataList[index].star = res.result.star
						return
					}
					this.$refs.uToast.show({
						title: res.message,
						type: 'error'
					})
				})
			},
			//关注按钮
			follow(number) {
				let param = {
					number
				}
				this.$u.post('/forum/Setting/changeSubscribe', param, true).then(res => {
					if (res.code == 0) {
						console.log(this.info);
						if (res.result.handleway == "up") {
							this.info.hassub = true
							this.$refs.uToast.show({
								title: '关注成功',
								type: 'success'
							})
						} else {
							this.info.hassub = false
							this.$refs.uToast.show({
								title: '取消关注',
								type: 'success'
							})
						}
						this.info.subscribe = res.result.subscribe
						return
					}
					this.$refs.uToast.show({
						title: res.message,
						type: 'error'
					})
				})
			},
			//我要回答按钮
			answer() {
				if (this.info.hasanswer) {
					uni.navigateTo({
						url: `/pages/modules/forum/answer?hasanswerNumber=${this.info.hasanswer}`
					});
				} else {
					uni.setStorageSync('info', this.info)
					uni.navigateTo({
						url: `/pages/modules/forum/answer`
					});
				}
			},
			getInfo(e) {
				this.dataForm.number = e
				let param = {
					number: e
				}
				this.$u.post('/forum/Index/details', param, true).then(res => {
					this.info = res.result
				})
			},
			//点击图片预览放大
			previewImg(index) {
				let _this = this;
				let imgsArray = this.info.images;
				let imgs = imgsArray.map((item, index) => {
					return this.config.url + item
				})
				uni.previewImage({
					current: index,
					urls: imgs
				});
			},
			previewImgAnswer(index, imgList) {
				let _this = this;
				let imgs = imgList.map((item, index) => {
					return this.config.url + item
				})
				uni.previewImage({
					current: index,
					urls: imgs
				});
			}
		},
		onLoad(e) {
			let number = uni.getStorageSync('number')
			this.getInfo(number)
			this.getDataList()
		},
		onShow() {
			//发表或编辑完回答 返回该页面 刷新数据
			let number = uni.getStorageSync('number')
			let isAnswer = uni.getStorageSync('isAnswer')
			if (isAnswer) {
				this.getInfo(number)
				this.getDataList()
				uni.removeStorageSync('isAnswer')
			}
			//删除完回答后返回该页面刷新数据
			if (uni.getStorageSync('isDel')) {
				this.getDataList()
				uni.removeStorageSync('isDel')
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
