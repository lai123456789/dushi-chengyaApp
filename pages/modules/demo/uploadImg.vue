<template>
	<u-card margin="0" :border-radius="0" :show-head="false">
		<template slot="body">
			<view v-if="show">
				<view>{{imgText}}</view>
				<u-upload @on-success="onSuccess" :max-size="8 * 1024 * 1024" :max-count="imgLengthMax" :action="action" name="filename"
				 @on-remove="onRemove" :form-data="{accept: 'image/*'}" :show-progress="false"></u-upload>
				<u-gap></u-gap>
				要提交的数据如下：
				<u-gap></u-gap>
				<view>{{JSON.stringify(imgList)}}</view>
			</view>
			<view v-else>
				<u-button @click="showUpload">点击开始上传</u-button>
			</view>
		</template>
	</u-card>
</template>
<script>
	export default {
		data() {
			return {
				show: false,
				action: `${this.config.url}/admin/attachment/upload/?uploadName=filename`,
				imgLength: 0, //图片数量
				imgLengthMax: 4,
				imgText: '', //图片数量描述文字
				imgList: [] //上传图片回调数组作为参数数组传到接口 格式为 [{fileName:"aqzfawef45454.jpg",filePath:"/upload//2021/01/07/20210.jpg"}]
			}
		},
		methods: {
			//上传图片成功返回的信息 格式如上
			onSuccess(data, index, lists) {
				this.imgLength = index + 1
				this.imgText = `上传图片(${index+1}/${this.imgLengthMax})`
				let imgList = []
				lists.forEach((item, index) => {
					if (item.progress == 100)
						imgList.push(item.response.result)
				})
				this.imgList = imgList
			},
			//移除图片事件
			onRemove(index, lists, name) {
				this.imgList.splice(index, 1) //删除图片
				this.imgText = `上传图片(${this.imgList.length}/${this.imgLengthMax})`
			},
			showUpload() {
				this.show = true
				this.imgText = `上传图片(${this.imgList.length}/${this.imgLengthMax})`
			}
		}
	}
</script>
