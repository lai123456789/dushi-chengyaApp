<template>
	<view style="height: 100vh; display: flex; flex-direction: column;">
		<!-- #ifdef APP-PLUS -->
		<u-card :show-head="false" border-radius="0" margin="0">
			<view slot="body">
				<u-steps :list="numList" :current="current"></u-steps>
			</view>
		</u-card>
		<view v-if="current == 0" style="flex: 1; background-color: #FFF;">
			<view class="wrapper u-flex u-row-center">
				<u-image src="/static/image/face.png" width="50%" height="50%" v-if="!videoPath" @click="motion">
				</u-image>
				<video :src="videoPath" controls v-else style="width: 100vw;"></video>
			</view>
			<view class="u-p-10" style="margin-top: 60rpx;">
				<u-button type="primary" @click="motion" :disabled="motionForbidden">{{ motionContent }}</u-button>
			</view>
		</view>
		<view v-else class="u-p-b-20" style="background-color: #FFF; flex: 1;">
			<image src="/static/image/succee.png" style="width: 100%; height: 400rpx;"></image>
			<view class="u-border u-p-16" style="width: 60%; margin: 40rpx auto;">
				<view class="u-flex u-row-between u-col-center" v-if="myInfo">
					<u-image width="220rpx" height="220rpx"  v-if="myInfo && myInfo.zp !== '[]'"
					 :src="config.url + JSON.parse(myInfo.zp)[0].filePath"></u-image>
					<view class="u-m-l-24">
						<view style="font-weight: bold; color: red; margin-bottom: 16rpx;">识别成功</view>
						<view style="font-weight: bold;" class="u-flex u-row-between">
							<text class="u-font-20">姓名：{{myInfo.xm}}</text>
							<text class="u-font-20">性别：{{myInfo.xb}}</text>
						</view>
						<view style="font-weight: bold; font-size: 20rpx; margin: 8rpx 0;">识别时间：{{successTime}}</view>
						<view class="u-flex u-row-between">
							<text class="u-font-20">岗位：{{myInfo.gw || '无'}}</text>
							<text class="u-font-20">职称：{{myInfo.zc || '无'}}</text>
						</view>
						<view class="u-flex">
							<view class="u-font-20" style="white-space: nowrap;">部门：</view>
							<view class="u-font-20">{{myInfo.ssbm}}</view>
						</view>
						<view class="u-font-20">分公司：{{myInfo.ssfgs}}</view>
						<view class="u-font-20">员工编码：{{myInfo.erpbh || '无'}}</view>
					</view>
				</view>
			</view>
			<view style="width: 60%; margin: 40rpx auto; text-align: center; font-size: 28rpx;">恭喜您，认证成功</view>
		</view>
		<view class="" style="position: absolute;left: 0;top:0;width: 100%;z-index: 100000;">
			<u-modal v-model="show" :content="content" style="z-index: 100000;"></u-modal>
		</view>
		<u-toast ref="uToast" />
		<!-- #endif -->
	</view>
</template>
<script>
	// #ifdef APP-PLUS
	import {
		pathToBase64
	} from 'image-tools'
	export default {
		data() {
			return {
				config: this.config,
				userInfo: uni.getStorageSync('userInfo'),
				myInfo: uni.getStorageSync('myInfo'),
				current: 0,
				nextFlag: true,
				numList: [{
					name: '人脸认证'
				}, {
					name: '完成认证'
				}],
				tabList: [{
					name: '语音视频识别'
				}, {
					name: '动作视频识别'
				}],
				widthrpx: '',
				access_token: '', //百度access_token
				sessionid: '', //验证码接口获取
				voiceSrc: '', // 获取动作语音
				videoPath: '', // 录制视频路径
				mask: true,
				name: '',
				src: '',
				windowWidth: '', //屏幕宽度
				pic: '',
				innerAudioContext: {},
				voicePrompt: '',
				voicePromptPath: [],
				state: true,
				certificationMsg: '',
				ctx: '',
				show: false,
				content: '',
				btnstate: false,
				certificationPass: true,
				tabCurrent: 0,
				verificationCode: '',
				seconds: 30,
				tips: '',
				motionForbidden: false,
				motionContent: '打开相机录制动作视频',
				succeed: true,
				tipsBidden: false,
				systemType: '',
				successTime: '' //识别时间
			};
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync() || {}
			this.systemType = sysInfo.system && sysInfo.system.includes('iOS') ? 'iOS' : 'Android'
			// this.ctx = uni.createCameraContext() //APP 不能使用该API
			const grant_type = 'client_credentials'
			const client_id = 'iiY1XfneshwcDsai8SjGdtYu'
			const client_secret = 'mviPeDFZBDnk85eG8x3QxILgnFNvATNT'
			uni.request({
				url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}`,
				method: 'POST',
				success: (res) => {
					this.access_token = res.data.access_token
				}
			})
		},
		methods: {
			// 获取当前时间
			getTimeData() {
				let date = new Date();
				let year = date.getFullYear(); //年 ,从 Date 对象以四位数字返回年份
				let month = date.getMonth() + 1; //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
				let day = date.getDate(); //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
				let hours = date.getHours(); //小时 ,返回 Date 对象的小时 (0 ~ 23)
				let minutes = date.getMinutes(); //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
				let seconds = date.getSeconds(); //秒 ,返回 Date 对象的秒数 (0 ~ 59)
				//修改月份格式
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				//修改日期格式
				if (day >= 0 && day <= 9) {
					day = "0" + day;
				}
				//修改小时格式
				if (hours >= 0 && hours <= 9) {
					hours = "0" + hours
				}
				//修改分钟格式
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes
				}
				//修改秒格式
				if (seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				}
				this.successTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
			},
			//动作识别录制按钮
			async motion() {
				const voiceArr = []
				try {
					let code = ''
					await this.getCode().then(res => code = res)
					// 语音播报
					let innerAudioContext = uni.createInnerAudioContext()
					innerAudioContext.autoplay = true
					innerAudioContext.src = this.voiceSrc
					let faceInfo = ''
					// #ifdef MP-WEIXIN
					// 打开相机
					this.motionForbidden = true
					await this.startRecode(code)
					await this.stopRecord().then(res => faceInfo = res)
					await this.getFace(faceInfo, 'action')
					this.system()
					// #endif
					// #ifndef MP-WEIXIN
					if (this.systemType === 'iOS') {
						innerAudioContext.onEnded(() => {
							this.openCamera().then(res => {
								const faceInfo = res
								this.getFace(faceInfo, 'action').then(() => {
									this.system()
								})
							})
						})
					} else {
						this.openCamera1().then(res => {
							const faceInfo = res
							this.getFace(faceInfo, 'action').then(() => {
								this.system()
							})
						})
					}
					// #endif
				} catch (e) {
					//TODO handle the exception
				}
			},

			// 获取验证码
			getCode() {
				return new Promise((resolve) => {
					uni.request({
						url: `https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/sessioncode?access_token=${this.access_token}`,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							type: 1,
							max_code_length: 1
						},
						success: (res) => {
							if (res.data.error_msg === 'SUCCESS') {
								const {
									result
								} = res.data
								this.sessionid = result.session_id
								this.voiceSrc = `/static/audio/${result.code}.mp3`
								resolve(result.code)
							}
						}
					})
				})
			},

			// 打开相机
			startRecode(code) {
				return new Promise((resolve) => {
					this.ctx.startRecord({
						success: () => {
							let i = 5
							const timer = setInterval(() => {
								i--
								const voice = ['请眨眨眼', '', '请右转头', '请左转头', '请抬头', '请低头',
									'请左右转头'
								]
								this.motionContent = `${voice[code]}, 录制倒计时${i}s`
								if (i === 0) {
									clearInterval(timer)
									resolve()
								}
							}, 1000)
						}
					})
				})
			},

			// 停止相机
			stopRecord() {
				return new Promise((resolve) => {
					this.ctx.stopRecord({
						compressed: true,
						success: (res) => {
							this.motionContent = '正在认证中请耐心等待'
							// 将获取到的视频转成base64
							uni.getFileSystemManager().readFile({
								filePath: res.tempVideoPath,
								encoding: 'base64',
								success: res => {
									resolve(res.data)
								},
							})
						},
						fail: () => {
							this.motionForbidden = false
							this.motionContent = '系统出错，请重新认证'
						}
					})
				})
			},

			// 打开相机 IOS
			openCamera() {
				const that = this
				return new Promise((resolve) => {
					this.motionContent = '认证中，请耐心等待...'
					this.motionForbidden = true
					uni.chooseVideo({
						sourceType: ['camera'],
						maxDuration: 5,
						camera: 'front',
						success: (res) => {
							that.videoPath = res.tempFilePath
							uni.compressVideo({
								src: res.tempFilePath,
								quality: 'medium',
								success: (res) => {
									const path1 = plus.io.convertLocalFileSystemURL(res
										.tempFilePath) //绝对路径
									const fileReader = new plus.io.FileReader()
									fileReader.readAsDataURL(path1)
									fileReader.onloadend = (res) => { // 读取文件成功完成的回调函数
										resolve(res.target.result.split(",")[1])
									}
								},
								fail: () => {
									this.motionContent = '认证失败，请重新认证'
									this.motionForbidden = false
								}
							})
						},
						fail: () => {
							this.motionContent = '认证失败，请重新认证'
							this.motionForbidden = false
						}
					})
				})
			},

			// 打开相机 安卓
			openCamera1() {
				const that = this
				return new Promise((resolve) => {
					const cmr = plus.camera.getCamera()
					const res = cmr.supportedVideoResolutions[0]
					const fmt = cmr.supportedVideoFormats[0]
					this.motionContent = '认证中，请耐心等待...'
					this.motionForbidden = true
					cmr.startVideoCapture(function(path) {
							that.videoPath = path
							const path1 = plus.io.convertLocalFileSystemURL(path) //绝对路径
							const leleCompressor = uni.requireNativePlugin('Lele-Compressor')
							leleCompressor.start({
								originalPath: path1, //原始文件地址
								appName: 'xxx', //app名
								isUseTimestampNaming: false, //可选，是否以时间戳命名文件，默认命名格式为'appName-temp'
								level: 'low' //可选，压缩等级，默认普通。{high-保持高质量，medium-普通，low-省流}
							}, result => {
								if (result.code == 0) {
									const path1 = plus.io.convertLocalFileSystemURL(result
										.compressedPath) //绝对路径
									const fileReader = new plus.io.FileReader()
									fileReader.readAsDataURL(path1)
									fileReader.onloadend = (res) => { // 读取文件成功完成的回调函数
										resolve(res.target.result.split(",")[1])
									}
								}
							});
						},
						function(error) {
							this.motionContent = '认证失败，请重新认证'
							this.motionForbidden = false
						}, {
							resolution: '400*800',
							format: fmt,
							index: 2,
							videoMaximumDuration: 10
						}
					)
				})
			},

			// 活体检测接口
			getFace(value, type) {
				return new Promise((resolve, reject) => {
					uni.request({
						url: `https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/verify?access_token=${this.access_token}`,
						method: 'POST',
						header: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						data: {
							video_base64: value,
							session_id: this.sessionid,
							type_identify: type
						},
						success: (res) => {
							if (res.data.error_msg === 'SUCCESS' && res.data.result.score > 0.90) {
								this.pic = res.data.result.pic_list[0].pic
								resolve('success')
							} else {
								this.motionForbidden = true
								this.motionContent = '认证失败，5秒后返回...'
								//人脸识别 检测不到人脸
								uni.setStorageSync('motionPending', 1)
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									});
								}, 5000)
							}

						},
						fail: (err) => {
							this.motionForbidden = false
							this.motionContent = '认证失败，请重新认证'
						}
					})
				})
			},
			//人脸识别 - 头像 验证
			system() {
				uni.request({
					url: `https://aip.baidubce.com/rest/2.0/face/v3/match?access_token=${this.access_token}`,
					method: 'POST',
					header: {
						'Content-Type': 'application/json',
					},
					data: [{
						"image": this.userInfo.setting.headImage,
						"image_type": "URL"
					}, {
						"image": this.pic,
						"image_type": "BASE64"
					}],
					success: (res) => {
						if (res.data.error_msg === 'SUCCESS') {
							uni.setStorageSync('motionPending', 0) //认证状态 0-成功 1-失败
							this.getTimeData() //获取打卡成功的当前时间
							this.current = 1
							this.motionContent = '认证成功'
							this.motionForbidden = true
							this.certificationPass = false
							this.$u.toast('等候5秒后返回...')
						} else {
							//人脸检测到的图像 跟 系统头像图片比对 对不上
							uni.setStorageSync('motionPending', 1)
							this.motionForbidden = false
							this.motionContent = '认证失败，5秒后返回...'
						}
						setTimeout(() => {
							//不管认证成功或失败 都返回打卡成功界面
							uni.navigateBack({
								delta: 1
							});
						}, 5000)
					},
					fail: (err) => {
						console.log("人脸识别失败", err)
					}
				})
			},
			// 年月日格式调整
			getTime(str) {
				const y = str.slice(0, 4)
				const m = str.slice(4, 6)
				const d = str.slice(6)
				return `${y}-${m}-${d}`
			}
		}
	}
	// #endif
</script>

<style lang="scss">
	cover-view,
	cover-image {
		display: inline-block;
	}

	.column {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	// video盒子
	.wrapper {
		width: 100vw;
		height: 100vw;
		background-color: #FFFFFF;
	}
</style>
