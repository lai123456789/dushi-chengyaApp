<template>
	<view style="padding-bottom: 120rpx;">
		<view class="u-p-t-32 u-p-l-32">
			<view v-if="hasanswerNumber">我的回答：</view>
			<view class="u-main-color u-font-14">{{info.title}}</view>
			<view class="u-tips-color u-m-t-10 u-m-b-20">{{info.content}}</view>
			<u-row gutter="16">
				<u-col span="4" v-for="(sitem,sindex) in info.images" :key="sindex">
					<view class="u-m-b-40">
						<u-image @click="previewImg(config.url + sitem)" :src="config.url + sitem" width="180" height="180"></u-image>
					</view>
				</u-col>
				<u-col span="4" v-if="info.videos">
					<video class="" :src="config.url + info.videos" controls style="width: 180rpx; height: 180rpx;"></video>
				</u-col>
			</u-row>
		</view>
		<u-card margin="32rpx 0" :show-head="false" :border="false" border-radius="0">
			<view slot="body">
				<u-input type="textarea" v-model="form.desc" height="250" :placeholder="hasanswerNumber?'请编辑回答':'请输入回答'"></u-input>
				<view>
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
			</view>
		</u-card>
		<view class="popupLeftFooter">
			<u-button style="width: 90%;" type="primary" @click="submit">发表回答</u-button>
		</view>
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
				// questionNumber:'',//问题编码
				hasanswerNumber: '', //回答过的回答问题编码
				info: '',
				//以上最新
				form: {
					title: '',
					desc: ''
				},
				number: '',
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
				accessToken: ''
			}
		},
		onLoad(option) {
			if (option.hasanswerNumber) {
				//如果存在这个 表示是编辑回答  否则 为发表回答 取缓存info数据即可
				this.hasanswerNumber = option.hasanswerNumber
				let param = {
					number: option.hasanswerNumber
				}
				this.$u.post('/forum/Index/getAnswerDetailes', param, true).then(res => {
					this.info = res.result
				})
			} else {
				this.info = uni.getStorageSync('info')
			}
			uni.request({
				url: 'https://api.weixin.qq.com/cgi-bin/token',
				data: {
					grant_type: 'client_credential',
					appid: this.config.appid,
					secret: this.config.appSecret
				},
				success: (res) => {
					console.log('res', res)
					if (res.errMsg === 'request:ok') {
						this.accessToken = res.data.access_token
						console.log('accessToken', this.accessToken)
					}
				}
			})
		},
		onUnload() {
			this.src = ''
			this.sourceTypeIndex = 2
			this.sourceType = ['拍摄', '相册', '拍摄或相册']
		},
		methods: {
			//发表按钮
			async submit() {
				let apiImageList = this.apiImageList
				let apiVideo = this.apiVideo
				let param = {
					// number:this.questionNumber,
					number: uni.getStorageSync('number'), //问题编码
					content: this.form.desc,
					images: this.apiImageList,
					videos: this.apiVideo
					// answer_number 新增发表回答时不传，编辑回答修改时传
				}
				if (this.hasanswerNumber) { //表示编辑回答
					param = Object.assign(param, {
						answer_number: this.hasanswerNumber
					})
				}
				this.$u.post('/forum/Index/saveAnswer', param, true).then(res => {
					if (res.code == 0) {
						this.$refs.uToast.show({
							title: '发表成功',
							type: 'success'
						})
						uni.removeStorageSync('info') //清除缓存
						uni.setStorageSync('isAnswer', true) //设置我自己的回答已回答 返回上一页lookComment页面 刷新回答信息
						// uni.setStorageSync('number',this.questionNumber) //已回答 返回上一页刷新
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
			//以下为视频图片模块
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
				// 上传图片
				uni.chooseImage({
					count: 8, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						console.log(res, "图片回调");
						this.imageList = this.imageList.concat(res.tempFilePaths);
						if (this.imageList.length == 9) { //图片数量
							this.VideoOfImagesShow = false
						}
						if (this.src && this.imageList.length == 8) { //视频
							this.VideoOfImagesShow = false
						}

						//上传图片到接口
						const tempFilePaths = res.tempFilePaths; //选择的图片 数组类型
						for (let x in tempFilePaths) {
							let that = this
							uni.uploadFile({
								url: `${that.config.url}/admin/attachment/upload/?uploadName=headImage`,
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
									console.log(res, "成功")
									let Object1 = JSON.parse(res.data)
									const imgUrl = `${that.config.urlProduction}${Object1.result.filePath}`
									uni.request({
										url: `https://api.weixin.qq.com/wxa/media_check_async?access_token=${that.accessToken}`,
										method: 'POST',
										data: {
											media_url: imgUrl,
											media_type: 2
										},
										success: (res) => {
											console.log('res', res)
											if (res.errcode === 0) {
												//添加图片数组参数 作为传到提交时的接口参数image
												that.apiImageList.push(Object1.result.filePath)
											}
										}
									})
								}
							})

						}

					}
				});
			},
			chooseVideo() {
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
							url: `${that.config.url}/admin/attachment/upload/?uploadName=upload`,
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
								const videoUrl = `${that.config.urlProduction}${Object1.result.filePath}`
								uni.request({
									url: `https://api.weixin.qq.com/wxa/media_check_async?access_token=${that.accessToken}`,
									method: 'POST',
									data: {
										media_url: videoUrl,
										media_type: 1
									},
									success: (res) => {
										console.log('res', res)
										if (res.errcode === 0) {
											//添加视频参数 作为传到提交时的接口参数video
											that.apiVideo = Object1.result.filePath
										}
									}
								})
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
							this.src = ''
							this.VideoOfImagesShow = true
						}
					}
				})
			}
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
