<template>
	<view style="padding-bottom: 120rpx;">
		<u-card margin="32rpx 0" :show-head="false" :border="false" border-radius="0">
			<view slot="body">
				<u-input maxlength="100" @input="descInput" v-model="form.title" type="textarea" placeholder="请输入标题。提问应遵循客观、明确的原则，结尾建议加“？”"></u-input>
				<view class="u-flex u-row-right">{{ form.title.length }}/100</view>
			</view>
		</u-card>
		<u-card margin="32rpx 0" :show-head="false" :border="false" border-radius="0">
			<view slot="body">
				<u-input type="textarea" v-model="form.desc" height="250" placeholder="请输入描述"></u-input>
				<!-- 发起提问问题 图片视频上传 -->
				<view v-if="!isEdit">
					<u-row gutter="16">
						<u-col span="4" v-for="(image,index) in imageList" :key="index">
							<!-- 图片 -->
							<view class="uni-uploader__file u-m-r-10 u-m-b-40">
								<u-icon size="40" name="close-circle-fill" color="#fa3534" class="icon-cuo" @tap="delect(index)"></u-icon>
								<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
							</view>
						</u-col>
						<u-col span="4" v-if="src">
							<!-- 视频 -->
							<view class="uni-uploader__file u-m-b-40">
								<view class="uploader_video">
									<u-icon size="40" name="close-circle-fill" color="#fa3534" class="icon-cuo" @tap="delectVideo"></u-icon>
									<video :src="src" class="video"></video>
								</view>
							</view>
						</u-col>
						<u-col span="4">
							<view style="background: #EEE; width: 180rpx; height: 180rpx; border-radius: 10rpx;" class=" u-m-b-40 u-flex u-row-center u-col-center"
							 v-if="VideoOfImagesShow" @tap="chooseVideoImage">
								<u-icon color="#999999" name="plus" size="80"></u-icon>
							</view>
						</u-col>
					</u-row>
				</view>
				<!-- 编辑问题 编辑图片删除或新增 -->
				<view v-else>
					<u-row gutter="16">
						<u-col span="4" v-for="(sitem,index) in imageList" :key="index">
							<!-- 图片 -->
							<view class="uni-uploader__file u-m-r-10 u-m-b-40">
								<u-icon size="40" name="close-circle-fill" color="#fa3534" class="icon-cuo" @tap="delect(index)"></u-icon>
								<u-image @click="previewImg(config.url + sitem)" :src="config.url + sitem" width="180" height="180"></u-image>
							</view>
						</u-col>
						<u-col span="4" v-if="questionInfo.videos">
							<!-- v-if="src"-->
							<!-- 视频 -->
							<view class="uni-uploader__file u-m-b-40">
								<view class="uploader_video">
									<u-icon size="40" name="close-circle-fill" color="#fa3534" class="icon-cuo" @tap="delectVideo"></u-icon>
									<video class="u-m-b-40" :src="config.url + questionInfo.videos" controls style="width: 180rpx; height: 180rpx;"></video>
								</view>
							</view>
						</u-col>
						<u-col span="4">
							<view style="background: #EEE; width: 180rpx; height: 180rpx; border-radius: 10rpx;" class=" u-m-b-40 u-flex u-row-center u-col-center"
							 v-if="VideoOfImagesShow" @tap="chooseVideoImage">
								<u-icon color="#999999" name="plus" size="80"></u-icon>
							</view>
						</u-col>
					</u-row>
				</view>



			</view>
		</u-card>

		<view class="u-p-l-32 u-p-b-10">
			<text class="u-type-error">*</text>
			<text>分类</text>
		</view>
		<u-card margin="0" :body-style="{padding:'16rpx 32rpx'}" :show-head="false" :border="false" border-radius="0">
			<view slot="body">
				<view class="u-flex u-row-between u-p-b-16 u-p-t-16" @click="showPopup = true" v-if="show">
					<view>请至少选择一个分类</view>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<view class="" v-if="!show">
					<u-tag class="u-m-10" v-for="(item,index) in selectTagList" :key="index" :text="item.name" closeable :show="showTag"
					 @close="tagClickClose(item,index)" />
				</view>
			</view>
		</u-card>
		<view class="u-p-l-32 u-p-r-32  u-p-b-10 u-p-t-10 u-flex u-flex-wrap">
			<view class="u-m-r-16">热门分类:</view>
			<u-tag v-for="(item,index) in hotList" :key="index" class="u-m-10" :text="item.name" type="info" @click="selectTag(item)"></u-tag>
		</view>
		<view class="popupLeftFooter">
			<u-button style="width: 90%;" type="primary" @click="submit">发表</u-button>
		</view>

		<u-popup v-model="showPopup" mode="bottom" height="40%" closeable>
			<u-card :show-head="false" :border="false">
				<view slot="body" class="u-p-b-60">
					<u-checkbox-group>
						<!-- :wrap="true"-->
						<u-checkbox style="margin-bottom: 20rpx;" v-model="item.checked" v-for="(item, index) in hotList" :key="index"
						 :name="item.name">{{item.name}}</u-checkbox>
					</u-checkbox-group>
				</view>
			</u-card>
			<!-- <view style="position: fixed; bottom: 30rpx; width: 100%;">
				<u-button @click="popupSure" type="primary" :customStyle="{'width':'90%'}">确定</u-button>
			</view> -->
			<view style="position: fixed; padding: 20rpx; bottom: 0; width: 100%; display: flex; background: #FFFFFF;
			justify-content: space-around;">
				<u-button style="width: 100%;" type="primary" @click="popupSure">确定</u-button>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	export default {
		data() {
			return {
				config: this.config,
				isEdit: '',
				questionInfo: '', //编辑问题详情
				showPopup: false,
				showTag: true,
				show: true,
				list: [],
				form: {
					title: '',
					desc: ''
				},
				number: '',
				hotList: [{
						name: '测试分类1'
					},
					{
						name: '测试分类1'
					},
					{
						name: '测试分类1'
					},
					{
						name: '测试分类1'
					},
					{
						name: '测试分类1'
					},
					{
						name: '测试分类1'
					},
					{
						name: '测试分类1'
					},
					{
						name: '测试分类1'
					},
				],
				selectTagList: [], //选中后的所有分类列表
				apiImageList: [],
				apiVideo: '',
				//以下为图片视频上传模块逻辑***********
				imageList: [], //图片
				src: "", //视频存放
				sourceTypeIndex: 2,
				checkedValue: true,
				checkedIndex: 0,
				sourceType: ['拍摄', '相册', '拍摄或相册'],
				cameraList: [{
						value: 'back',
						name: '后置摄像头',
						checked: 'true'
					},
					{
						value: 'front',
						name: '前置摄像头'
					},
				],
				cameraIndex: 0,
				VideoOfImagesShow: true,
			}
		},
		onUnload() {
			this.src = '',
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍摄', '相册', '拍摄或相册'];
		},
		methods: {
			//点击图片预览放大 编辑图片时预览 跟下面的上传图片预览 两种方法不一样
			previewImg(logourl) {
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},
			descInput() {
				if (this.form.title.length >= 100) {
					this.$u.toast('标题内容应控制在100字以内')
					return
				}
			},
			//发表按钮
			submit() {
				let selectTagList = this.selectTagList
				let category_numberList = selectTagList.map((item, index) => {
					return item.number
				})
				let category_number = category_numberList.join(',')
				let apiImageList, apiVideo, number
				if (this.isEdit) {
					//编辑图片 接口返回的：已经是这种拼接好的数据格式 ["/upload//2020/12/26/20201226111723629749.png"] 无需处理
					apiImageList = this.imageList
					//视频同理
					apiVideo = this.questionInfo.videos
					number = this.questionInfo.number
				} else {
					//发起上传图片 需要处理拼接数据格式 同上
					apiImageList = this.apiImageList
					apiVideo = this.apiVideo
					number = ''
				}
				let param = {
					title: this.form.title,
					category_number,
					content: this.form.desc,
					images: apiImageList,
					videos: apiVideo,
					number: number //新增时传空值，编辑修改时传number值不能为空***************************
				}
				this.$u.post('/forum/Index/saveQuestion', param, true).then(res => {
					if (res.code == 0) {
						this.$refs.uToast.show({
							title: '发表成功',
							type: 'success'
						})
						setTimeout(() => {
							if (this.isEdit) { //编辑状态 返回上一页刷新数据
								uni.navigateBack({
									delta: 1
								});
							} else { //发表提问状态跳转列表页
								uni.redirectTo({
									url: '/pages/modules/forum/center'
								});
							}
						}, 1500)
					} else {
						this.$refs.uToast.show({
							title: res.message,
							type: 'error'
						})
					}

				})
			},
			//popup 确定按钮
			popupSure() {
				this.showPopup = false
				this.show = false
				let List = this.hotList
				this.selectTagList = List.filter((item, index) => {
					return item.checked === true
				})
			},
			//选中热门分类标签
			selectTag(item) {
				this.show = false
				let selectTagList = this.selectTagList
				let indexOf = selectTagList.indexOf(item)
				if (indexOf === -1) { //存在返回当前索引 不存在返回-1  则插入对象
					selectTagList.push(item)
				} else {
					this.$refs.uToast.show({
						title: '已添加该分类',
						type: 'warning'
					})

				}

			},
			//点击关闭标签按钮
			tagClickClose(item, index) {
				// this.show = false;
				let selectTagList = this.selectTagList
				selectTagList.forEach((subItem, subIndex) => {
					if (item == subItem) {
						selectTagList.splice(subIndex, 1)
					}
				})

				if (selectTagList.length == 0) {
					this.show = !this.show
				}

			},
			// 获取热门分类
			gethotList() {
				let param = {
					recommended: '1' //0所有分类 1热门分类
				}
				this.hotList = []
				this.$u.post('forum/Setting/getCategorys', param, true).then(res => {
					res.result.data.forEach((item, index) => {
						let object = { ...item,
							checked: false
						}
						this.hotList.push(object)
					})
				})
			},
			//以下为视频图片模块 点击+号按钮操作
			chooseVideoImage() {
				uni.showActionSheet({
					title: "选择上传类型",
					itemList: ['图片', '视频'],
					success: (res) => {
						console.log(res)
						if (res.tapIndex == 0) {
							this.chooseImages()
						} else {
							this.chooseVideo()
						}
					}
				})
			},
			chooseImages() {
				const config = this.config
				// 上传图片
				uni.chooseImage({
					count: 8, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						console.log(res, "图片回调");
						if (this.isEdit) {
							//编辑状态 无需写多一步回显临时地址图片 下方的 编辑图片方法里有加入了该图片
						} else {
							//上传图片
							this.imageList = this.imageList.concat(res.tempFilePaths);
						}
						console.log(this.imageList, "this.imageList");
						if (this.imageList.length == 9) { //图片数量
							this.VideoOfImagesShow = false
						}
						if (this.src && this.imageList.length == 8) { //视频
							this.VideoOfImagesShow = false
						}

						//上传图片到接口
						const tempFilePaths = res.tempFilePaths; //数组 
						//可能有多个 ['http://tmp/h8CeN6680.jpg','http://tmp/h8CeN6680123.jpg']
						for (let x in tempFilePaths) {
							let that = this
							uni.uploadFile({
								url: `${config.url}/admin/attachment/upload/?uploadName=headImage`,
								filePath: tempFilePaths[x],
								filename: 'headImage',
								formData: {
									accept: '*' //image/*
								},
								name: 'headImage',
								header: {
									"Content-Type": "application/json; charset=utf-8"
								},
								success(res) {
									console.log(res, "成功");
									let Object1 = JSON.parse(res.data)
									//添加图片数组参数 作为传到提交时的接口参数image
									// that.apiImageList.push(Object1.result.filePath)
									if (that.isEdit) {
										//编辑图片
										that.imageList.push(Object1.result.filePath)
									} else {
										//发起上传图片
										that.apiImageList.push(Object1.result.filePath)
									}
								}
							})

						}

					}
				});
			},
			chooseVideo() {
				const config = this.config
				// 上传视频
				uni.chooseVideo({
					maxDuration: 10,
					count: 1,
					camera: this.cameraList[this.cameraIndex].value,
					sourceType: sourceType[this.sourceTypeIndex],
					success: (res) => {
						console.log(res, '上传视频回调')
						console.log(JSON.stringify(res.tempFilePath), '视频')
						this.src = res.tempFilePath;
						console.log(this.src)

						if (this.src && this.imageList.length == 8) { //视频图片数量为9隐藏
							this.VideoOfImagesShow = false
						}
						//上传视频到接口
						let that = this
						uni.uploadFile({
							url: `${config.url}/admin/attachment/upload/?uploadName=upload`,
							filePath: res.tempFilePath,
							filename: 'upload',
							formData: {
								accept: '*'
							},
							name: 'upload',
							header: {
								"Content-Type": "application/json; charset=utf-8"
							},
							success(res) {
								console.log(res, "成功");
								let Object1 = JSON.parse(res.data)
								//添加视频参数 作为传到提交时的接口参数video
								if (that.isEdit) {
									//编辑视频
									that.questionInfo.videos = Object1.result.filePath
								} else {
									//发起上传视频
									that.apiVideo = Object1.result.filePath
								}
							}
						})

					}
				})
			},
			previewImage: function(e) {
				console.log(e);
				//预览图片
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			delect(index) {
				uni.showModal({
					title: "提示",
					content: "是否要删除该图片",
					success: (res) => {
						if (res.confirm) {
							this.imageList.splice(index, 1)

							this.VideoOfImagesShow = true

						}
					}
				})
			},
			delectVideo() {
				uni.showModal({
					title: "提示",
					content: "是否要删除此视频",
					success: (res) => {
						if (res.confirm) {
							if (this.isEdit) {
								//编辑视频
								this.questionInfo.videos = ''
							} else {
								//发起上传视频
								this.src = ''
							}
							this.VideoOfImagesShow = true
						}
					}
				})
			}
		},
		onLoad(e) {

			if (e.isEdit) { //编辑问题  来源页面路径是 centerQuestionInfo页面
				let questionInfo = uni.getStorageSync('info')
				this.questionInfo = questionInfo
				this.isEdit = e.isEdit
				this.form.title = questionInfo.title
				this.form.desc = questionInfo.content
				//图片视频
				this.imageList = questionInfo.images
				// this.videos = questionInfo.videos

				//分类标签名 页面显示
				this.show = false
				this.selectTagList = []
				questionInfo.category_name.forEach((item, index) => {
					this.selectTagList.push({
						name: item
					})
				})
				//分类编码数组 传接口参数值
				let category_numberList = questionInfo.category_number.split(',')
				console.log("category_numberList", category_numberList);
				category_numberList.forEach((item, index) => {
					this.selectTagList[index].number = item
				})

			}

			this.gethotList() //获取热门问题分类列表
		}
	}
</script>

<style lang="scss" scoped>
	.popupLeftFooter {
		position: fixed;
		padding: 20rpx 0;
		bottom: 0;
		width: 100%;
		display: flex;
		background: #FFFFFF;
		justify-content: space-around;

		// button {
		// 	width: 90%;
		// }
	}


	.form-item {
		width: 100%;
	}

	.form-item textarea {
		display: block;
		height: 220rpx;
		width: 100%;
		color: #AAAAAA;
		font-size: 28rpx;
	}

	.uni-uploader__file,
	.uploader_video {
		position: relative;
		z-index: 1;
		width: 180rpx;
		height: 180rpx;
	}

	.uni-uploader__img {
		width: 180rpx;
		height: 180rpx;
	}

	.icon-cuo {
		position: absolute;
		right: 0;
		top: 5rpx;
		// background: linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
		color: #FFFFFF;
		z-index: 999;
		border-top-right-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}

	.video {
		width: 100%;
		height: 100%;
	}

	.login-input-box {
		position: relative;
		border-bottom: 1rpx solid #EEEEEE;
	}

	.login-input-box .forget,
	.login-input-box .phone {
		position: absolute;
		top: 0;
		height: 100%;
		z-index: 100;
	}

	.login-input-box .phone {
		width: 100rpx;
		left: 0;
		color: #666666;
		font-weight: bold;
	}

	.login-input-box .phone-input {
		padding-left: 100rpx;
	}

	.address-wrap,
	.open-info {
		margin-top: 20rpx;
	}

	.open-info>view:last-child {
		font-size: 28rpx;
		color: #999999;
	}

	.address-wrap .address {
		background: #F2F2F2;
		border-radius: 40rpx;
		padding: 0 20rpx;
	}

	.user-set-btn {
		margin: 40rpx;
		background: linear-gradient(90deg, rgba(251, 91, 80, 1) 0%, rgba(240, 45, 51, 1) 100%);
		color: #FFFFFF;
		text-align: center;
		height: 88rpx;
		line-height: 88rpx;
	}
</style>
