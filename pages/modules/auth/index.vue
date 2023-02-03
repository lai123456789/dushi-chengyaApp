<template>
	<view>
		<u-button @click="certification">点击上传身份证</u-button>
		<view>{{name}}{{idNumber}}</view>
		<u-button @click="camera">开始认证人脸</u-button>
		<view>{{pic}}</view>
		<u-button @click="system">公安验证</u-button>
		<view>相似度：{{score}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				grant_type:'client_credentials',
				client_id:'NEAHHAvFVZWCONXvFlTl0Wfn',
				client_secret:'jrapUfeKnwHhqyoW6KMpuihdR72rVzIV',
				access_token:'',
				imgFile:'',
				imgFileBase64:'',
				idNumber:'',
				name:'',
				videoFile:'',
				videoFileBase64:'',
				res:[],
				pic:'',
				score:''
			}
		},
		methods: {
			certification() {
				uni.chooseImage({
				    count: 2, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['camera'], //从相册选择
				    success:  (res)=>{
						this.imgFile=res.tempFiles[0].path
						uni.getFileSystemManager().readFile({
						    filePath: this.imgFile, //选择图片返回的相对路径
						    encoding: 'base64', //编码格式
						    success: res => {
								 this.imgFileBase64=res.data
								 this.getCardMsg(this.imgFileBase64)
						    }
						})
				    }
				});
			},
			camera() {
				uni.chooseVideo({
					sourceType:['camera'],
					maxDuration:10,
					compressed:true,
					camera:'front',
					success: (res) => {
						this.videoFile=res.tempFilePath
						uni.getFileSystemManager().readFile({
						    filePath: this.videoFile, //选择图片返回的相对路径
						    encoding: 'base64', //编码格式
						    success: res => { //成功的回调
								this.videoFileBase64=res.data
								this.getFace(this.videoFileBase64)
								console.log(res)
						    },
							fail:res=>{
								console.log(res)
							}
						})
						console.log(res)
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			getCardMsg(value) {
				console.log('开始请求百度卡证接口')
				uni.request({
					url:`https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=${this.access_token}`,
					method:'POST',
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					data:{
						image:value,
						id_card_side:'front',
					},
					success: (res) => {
						this.idNumber=res.data.words_result.公民身份号码.words
						this.name=res.data.words_result.姓名.words
					}
					
				})
			},
			getFace(value) {
				uni.request({
					url:`https://aip.baidubce.com/rest/2.0/face/v1/faceliveness/verify?access_token=${this.access_token}`,
					method:'POST',
					header:{
						'Content-Type':'application/x-www-form-urlencoded'
					},
					data:{
						video_base64:value,
					},
					success:(res)=>{
						this.pic=res.data.result.pic_list[0].pic
						console.log(res)
					}
				})
			},
			system() {
				uni.request({
					url:`https://aip.baidubce.com/rest/2.0/face/v3/person/verify?access_token=${this.access_token}`,
					method:'POST',
					header:{
						'Content-Type':'application/json'
					},
					data:{
						'image_type':'BASE64', //选择图片上传方式URL或BASE64
						'image':this.pic, // 图片公网可访问的地址或转成base64的数据
						'id_card_number':this.idNumber, //卡证识别拿到的身份证号码
						'name':this.name //卡证识别拿到的姓名
					},
					success: (res) => {
						this.score=res.data.result.score
						console.log(res.data.result.score)
					}
					
				})
			}
		},
		onLoad() {
			// #ifdef  MP-WEIXIN
			uni.request({
				url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=${this.grant_type}&client_id=${this.client_id}&client_secret=${this.client_secret}`,
				method:'POST',
				success: (res) => {
					this.access_token=res.data.access_token
					console.log(res)
					console.log(this.access_token)
				}
			})
			// #endif
		}
	}
</script>

<style>

</style>
