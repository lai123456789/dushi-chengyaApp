<template>
	<view style="padding-bottom: 120rpx;">
		<u-card margin="0" :body-style="{padding:'16rpx 32rpx'}" :show-head="false" :border="false" border-radius="0">
			<view slot="body">
				<view class="u-font-16 u-m-t-14 u-m-b-14 u-main-color">{{questionInfo.title}}</view>
				<view class="u-flex u-row-between u-m-b-10 u-font-13 u-content-color">
					<view @click="goAllBack">查看全部回答({{answerLength}})</view>
					<view class="u-type-primary" v-if="questionInfo.hasanswer">您已回答</view>
				</view>
			</view>
		</u-card>
		<u-card margin="32rpx 0" :body-style="{padding:'16rpx 32rpx'}" :show-head="false" :border="false" border-radius="0">
			<view slot="body">
				<view class="u-flex u-row-between u-p-t-20">
					<view class="u-flex">
						<u-image shape="circle" :src="config.url + answerInfo.avatar" width="60" height="60"></u-image>
						<view>
							<view class="u-m-l-20 u-m-r-20">{{answerInfo.inputuser}}</view>
							<view class="u-m-l-20 u-m-r-20 u-font-12" v-if="!answerInfo.edit_priv">{{answerInfo.inputtime}}</view>
						</view>
					</view>
					<view v-if="answerInfo.bsetanswer ==1">
						<u-tag text="最佳答案" type="error"></u-tag>
					</view>
				</view>
				<view class="u-p-t-20">
					<view class="u-content-color u-font-15 u-m-b-16">
						{{answerInfo.content}}
					</view>
					<u-row gutter="16">
						<u-col span="4" v-for="(sitem,sindex) in answerInfo.images" :key="sindex">
							<view class="u-m-b-40">
								<u-image @click="previewImg(config.url + sitem)" :src="config.url + sitem" width="180" height="180"></u-image>
							</view>
						</u-col>
						<u-col span="4" v-if="answerInfo.videos">
							<video class="u-m-b-40" :src="config.url + answerInfo.videos" controls style="width: 180rpx; height: 180rpx;"></video>
						</u-col>
					</u-row>
				</view>
				<view class="u-flex u-row-between u-m-b-16">
					<view v-if="answerInfo.edit_priv" class="u-tips-color u-font-12">
						{{answerInfo.inputtime}}
					</view>
					<view>
						<!-- {{answerInfo}} -->
						<text class="u-type-primary" @click="edit" v-if="answerInfo.edit_priv">编辑</text>
						<text class="u-type-error u-m-l-20" @click="del" v-if="answerInfo.del_priv">删除</text>
					</view>
				</view>
			</view>
		</u-card>
		<view class="u-flex u-row-between u-p-l-32 u-p-r-32 u-p-b-20">
			<view v-if="AnswerCommentList.length>0" class="u-main-color">大家评论({{AnswerCommentList.length}})</view>
			<view v-else>暂无评论</view>
		</view>
		<u-card margin="0" v-for="(item,index) in AnswerCommentList" :key="index" :body-style="{padding:'24rpx 32rpx'}"
		 :show-head="false" :border="true" border-radius="0">
			<view slot="body" class="u-flex u-flex-1">
				<view class="u-flex u-col-top u-flex-1">
					<view style="width: 50rpx;">
						<u-image shape="circle" :src="config.url + item.avatar" width="60" height="60"></u-image>
					</view>
					<view class="u-m-l-20 u-m-r-20 u-flex-1">
						<view class="u-tips-color">{{item.inputuser}}</view>
						<view class="u-m-b-20 u-m-t-10 u-main-color u-font-15">{{item.content}}</view>
						<view v-if="item.comment_list.length > 0" style="background: #F2F2F2; border-radius: 10rpx;" class="u-p-l-32">
							<view class="u-border-bottom u-p-b-24 u-p-t-24" v-for="(subItem,subIndex) in item.comment_list">
								<view class="u-m-b-10">{{subItem.inputuser}} ：</view>
								<view>{{subItem.content}}</view>
							</view>
						</view>
						<view class="u-flex u-flex-1 u-row-between u-m-t-16">
							<view>
								<text class="u-type-primary" @click="commentClick('reply',item)">回复</text>
								<text v-if="item.del_priv" class="u-type-error u-m-l-24" @click="delComment(item)">删除</text>
							</view>
							<view class="u-flex u-flex-nowrap u-font-12">{{item.inputtime}}</view>
						</view>

					</view>
				</view>
			</view>
		</u-card>
		<view class="u-p-20 u-flex u-row-between" style="position: fixed;
		padding: 20rpx;
		bottom: 0;
		width: 100%;
		background: #FFFFFF;
		z-index: 1000;">
			<u-search search-icon="edit-pen" shape="square" placeholder="评论一下" disabled :show-action="false" @click="commentClick('answer')"></u-search>
			<u-icon name="thumb-up" size="48" class="u-m-l-24 u-m-r-24"></u-icon>
		</view>
		<u-popup v-model="showInput" mode="top" closeable>
			<view class="u-p-32">
				<u-input type="textarea" v-model="commentContent" :placeholder="placeholderText" height="220"></u-input>
				<view class="u-text-right">
					<u-button size="mini" @click="showInput = false">取消</u-button>
					<u-button class="u-m-l-32" size="mini" type="primary" @click="sureSubmit">确定</u-button>
				</view>
			</view>

		</u-popup>
		<!-- 删除我自己的回答 -->
		<u-modal v-model="showModal" content="是否确认删除" :show-cancel-button="true" @confirm="sureDel"></u-modal>
		<!-- 删除我自己的评论 二级评论 -->
		<u-modal v-model="showModalComment" content="是否确认删除" :show-cancel-button="true" @confirm="sureDelComment"></u-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				numberComment: '', //二级评论的每一项的编码
				showModal: false,
				showModalComment: false,
				commentContent: '', //输入的内容
				showInput: false,
				placeholderText: '请输入评论',
				text: '',
				replyItem: '', //选中的 回复item
				config: this.config,
				answerLength: 0,
				questionInfo: uni.getStorageSync('questionInfo'), //问题详情
				answerInfo: uni.getStorageSync('answerInfo'), //回答内容
				AnswerCommentList: [],
			}
		},
		methods: {
			//删除我自己的回答
			del() {
				this.showModal = true
			},
			//确认删除回答操作
			sureDel() {
				let param = {
					answer_number: this.answerInfo.number
				}
				this.$u.post('/forum/Index/delAnswer', param, true).then(res => {
					if (res.code == 0) {
						uni.setStorageSync('isDel', true)
						this.$refs.uToast.show({
							title: res.message,
							type: 'success'
						})
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
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
			//删除二级评论 我自己的评论才可以删除
			delComment(item) {
				this.showModalComment = true
				this.numberComment = item.number
			},
			//确认删除二级评论操作
			sureDelComment() {
				let param = {
					number: this.numberComment
				}
				this.$u.post('/forum/Index/delComment', param, true).then(res => {
					if (res.code == 0) {
						uni.setStorageSync('isDel', true)
						this.$refs.uToast.show({
							title: res.message,
							type: 'success'
						})
						this.getAnswerCommentList()
					} else {
						this.$refs.uToast.show({
							title: res.message,
							type: 'error'
						})
					}
				})
			},
			//编辑我的回答
			edit() {
				uni.navigateTo({
					url: `/pages/modules/forum/answer?hasanswerNumber=${this.answerInfo.number}`
				});
			},
			commentClick(text, item) {
				this.showInput = true

				this.commentContent = ''
				this.text = text
				if (item) {
					this.replyItem = item
				}
				// this.placeholderText = `请输入${this.answerInfo.inputuser}的评论`
				if (text == 'reply') {
					//回复评论 2级评论
					this.placeholderText = '请输入回复内容'
				} else {
					//评论回答 1级评论
					this.placeholderText = '请输入评论'
				}
			},
			sureSubmit() {
				if (this.commentContent == '') {
					this.$refs.uToast.show({
						title: '请输入内容',
						type: 'warning'
					})
					return
				}

				let text = this.text

				// if(text == 'reply'){
				// 	//回复评论 2级评论
				// }else{
				// 	//评论回答 1级评论
				// }

				let param = {
					answer_number: this.answerInfo.number, //评论的答案编号
					content: this.commentContent //评论内容
				}
				if (text == 'reply') {
					//回复评论 2级评论   被评论的评论编号 评论列表里面每一项的number 二级评论时需传递该参数
					param = Object.assign(param, {
						comment_number: this.replyItem.number
					})
				}
				this.$u.post('/forum/Index/commentAnswer', param, true).then(res => {
					if (res.code == 0) {
						this.showInput = false
						this.getAnswerCommentList() //刷新评论列表
						this.$refs.uToast.show({
							title: res.message,
							type: 'success'
						})
					} else {
						this.$refs.uToast.show({
							title: res.message,
							type: 'error'
						})
					}
				})

			},
			goAllBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			//获取回答的总评论列表
			getAnswerCommentList() {
				let param = {
					answer_number: this.answerInfo.number
				}
				this.$u.post('/forum/Index/getcomments', param, true).then(res => {
					this.AnswerCommentList = res.result
				})
			}
		},
		onLoad(e) {
			if (e.dataLength) {
				//回答总数量
				this.answerLength = e.dataLength
			}
			this.getAnswerCommentList()
		},
		onShow() {
			//在answer页面 编辑我自己的回答提交  过来的  刷新数据
			let isAnswer = uni.getStorageSync('isAnswer')
			if (isAnswer) {
				let param = {
					number: this.answerInfo.number
				}
				this.$u.post('forum/Index/getAnswerDetailes', param, true).then(res => {
					this.answerInfo = res.result
					//修改
					this.answerInfo.edit_priv = true
					this.answerInfo.del_priv = true
				})
				uni.removeStorageSync('isAnswer')
			}

		}
	}
</script>

<style lang="scss" scoped>
</style>
