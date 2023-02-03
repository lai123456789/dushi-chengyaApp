<template>
	<view>
		<customCard title="汇报基本信息">
			<u-form>
				<u-row gutter="32">
					<u-col :span="4">
						<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top" label="关联业务编号">
							<view  v-if="recordInfo" style="font-size: 20rpx; width: 200rpx; margin-top: -4rpx;" class="u-line-1">
								{{ hbjbxx.glywbh || '无' }}
							</view>
							<view  v-else style="font-size: 20rpx; width: 200rpx; margin-top: -4rpx;" class="u-line-1">
								<u-tag text="+ 添加关联业务" type="info" mode="plain" size="mini" @click="goAdd" />
							</view>
						</u-form-item>
					</u-col>
					<u-col :span="4">
						<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top" label="客户单位(气矿)">
							<view style="font-size: 20rpx; width: 200rpx;" class="u-line-1">{{hbjbxx.khdwkq || '无'}}
							</view>
						</u-form-item>
					</u-col>
					<u-col :span="4">
						<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top" label="压缩机型号"> <!-- 主机型号 -->
							<view style="font-size: 20rpx; width: 200rpx;" class="u-line-1">{{hbjbxx.ysjxh || '无'}} <!-- zjxh -->
							</view>
						</u-form-item>
					</u-col>
					<u-col :span="4">
						<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top" label="机组类型"
							:border-bottom="false">
							<view style="font-size: 20rpx; width: 200rpx;" class="u-line-1">{{hbjbxx.jzlx || '无'}}
							</view>
						</u-form-item>
					</u-col>
					<u-col :span="4">
						<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top" label="机组型号"
							:border-bottom="false">
							<view style="font-size: 20rpx; width: 200rpx;" class="u-line-1">{{hbjbxx.jzxh || '无'}}
							</view>
						</u-form-item>
					</u-col>
					<u-col :span="4">
						<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top" label="累计运行时间"
							:border-bottom="false">
							<view style="font-size: 20rpx; width: 200rpx;" class="u-line-1">{{hbjbxx.ljyhsj || '无'}}
							</view>
						</u-form-item>
					</u-col>
				</u-row>
			</u-form>

		</customCard>
		<!-- 日报 -->
		<block v-if="form.hblx === '日报'">
			<customCard title="今日任务"> <!--  v-if="!recordInfo" -->
				<view class="u-p-16 u-flex">
					<view> {{date}}</view>
					<view class="u-m-l-40">{{lczt || '无'}}</view>
				</view>
			</customCard>

			<customCard title="今日结果" :bodyStyle="{padding: '0'}">
				<view class="u-p-16">
					<view class="u-border-bottom u-flex u-row-between u-p-t-8 u-p-b-16">
						<view class="u-m-r-16 u-text-center">
							<view style="white-space: nowrap;">汇报内容</view>
							<view class="btn" v-if="!recordInfo">
								<button @longpress="startRecognize('hbnr')" @touchend="stop"
									style="background: transparent; border: none !important;">
									<text class="iconfont luyin" style="width: 60rpx; height: 60rpx;"></text>
								</button>
							</view>
						</view>
						<u-input maxlength="10000" :disabled="recordInfo" type="textarea" v-model="form.hbnr" :border="true" style="width: 100%;" />
					</view>
					<view class="u-border-bottom u-flex u-row-between u-p-t-16 u-p-b-16">
						<view class="u-m-r-16 u-text-center">
							<view style="white-space: nowrap;">其他备注</view>
							<view class="btn" v-if="!recordInfo">
								<button @longpress="startRecognize('qtbz')" @touchend="stop"
									style="background: transparent; border: none !important;">
									<text class="iconfont luyin" style="width: 60rpx; height: 60rpx;"></text>
								</button>
							</view>
						</view>
						<u-input maxlength="10000" :disabled="recordInfo" type="textarea" v-model="form.qtbz" :border="true" style="width: 100%;" />
					</view>
					<view class="u-flex u-p-t-16 u-p-b-16 u-border-bottom">
						<view class="u-m-r-16" style="white-space: nowrap;">完成情况</view>
						<view class="u-flex u-row-center u-col-center" style="width: 100%;">
							<u-radio-group v-model="form.wcqk" @change="onChange1" :disabled="recordInfo">
								<u-radio :key="key" v-for="(item, key) of list1" :name="item.name">
									<view style="color: #303133">{{item.name}}</view>
								</u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="u-flex u-p-t-16 u-p-b-16">
						<view class="u-m-r-16" style="white-space: nowrap;">是否异常</view>
						<view class="u-flex u-row-center u-col-center" style="width: 100%;">
							<u-radio-group v-model="form.sfyc" @change="onChange2" :disabled="recordInfo">
								<u-radio :key="key" v-for="(item, key) of list2" :name="item.name">
									<view style="color: #303133">{{item.name}}</view>
								</u-radio>
							</u-radio-group>
						</view>
					</view>
				</view>

			</customCard>
		</block>
		<!-- 晨会-->
		<block v-else>
			<customCard title="安全指引阅读">
				<u-row v-if="dataList.length > 0">
					<u-col :span="6" v-for="(item,index) in dataList" :key="index">
						<view class="u-flex u-p-t-10 u-p-b-10" @click="checkboxGou(item.sfbd)"
							:class="index < dataList.length -2 ? 'u-border-bottom': ''">
							<u-checkbox-group @change="checkboxGroupChange($event,item.sfbd)" size="24"
								style="margin-top: 4rpx;">
								<u-checkbox v-model="item.checked" :name="item.id" :disabled="item.sfbd === '是'">
								</u-checkbox>
							</u-checkbox-group>
							<view class="u-flex u-col-center">
								<text style="font-size: 20rpx; margin-left: -18rpx; white-space: nowrap">我已阅读</text>
								<text style="font-size: 20rpx;" class="u-type-primary"
									@click.stop="goSafeInfo(item)">《{{item.wjmc}}》</text>
							</view>
						</view>
					</u-col>
				</u-row>
				<u-empty mode="data" v-else></u-empty>
			</customCard>
			<customCard title="汇报内容">
				<view class="u-flex u-row-between">
					<view class="btn" v-if="!recordInfo">
						<button @longpress="startRecognize('hbnr')" @touchend="stop"
							style="background: transparent; border: none !important;">
							<text class="iconfont luyin" style="width: 60rpx; height: 60rpx;"></text>
						</button>
					</view>
					<u-input maxlength="10000" :disabled="recordInfo" type="textarea" v-model="form.hbnr" :border="true" style="width: 100%;" />
				</view>
			</customCard>

			<customCard title="其他备注">
				<view>
					<view class="u-flex u-row-between u-p-b-16">
						<view class="btn" v-if="!recordInfo">
							<button :disabled="recordInfo" @longpress="startRecognize('qtbz')" @touchend="stop"
								style="background: transparent; border: none !important;">
								<text class="iconfont luyin" style="width: 60rpx; height: 60rpx;"></text>
							</button>
						</view>
						<u-input maxlength="10000" :disabled="recordInfo" type="textarea" v-model="form.qtbz" :border="true" style="width: 100%;" />
					</view>
					<view class="u-border-bottom u-flex">
						<view class="u-m-r-16">
							<view style="white-space: nowrap;">晨会照片</view>
						</view>
						<view v-if="recordInfo" class="u-flex u-flex-wrap">
							<block v-if="chzp && chzp.length > 0">
								<u-image @click="previewImg(index)" width="150rpx" height="150rpx"  v-for="(item,index) in chzp" :key="index"
									:src="item" mode="" style="margin: 8rpx;"></u-image>
							</block>
							<u-image v-else width="150rpx" height="150rpx" mode="">
								<view slot="error" style="font-size: 18rpx;">暂无照片</view>
							</u-image>
						</view>
						<u-upload v-else width="150" height="150" @on-success="successCallback" :max-size="8 * 1024 * 1024"
							:max-count="4" :action="action" :name="filename" @on-remove="onRemove" :form-data="formData"
							:show-progress="false"></u-upload>
					</view>
				</view>

			</customCard>
		</block>
		<u-button type="primary" @click="submit"  v-if="!recordInfo">提交</u-button>
		<!-- <view style="position: fixed; z-index: 2; padding: 20rpx; bottom: 0; width: 100%; display: flex; background: #FFFFFF;
		justify-content: space-around;">
			<u-button style="width: 100%;" type="primary" @click="popupSure">确定</u-button>
		</view> -->
	</view>
</template>

<script>
	import customCard from '@/components/customCard.vue'
	export default {
		components: {
			customCard
		},
		data() {
			return {
				date: new Date().toISOString().slice(0, 10), //当前日期
				//图片上传参数
				filename: 'headImage',
				formData: {
					'accept': 'image/*'
				},
				//config.url是全局定义的主域名
				action: `${this.config.url}/admin/attachment/upload/?uploadName=headImage`,
				imgLength: 0, //图片数量
				imgText: '图片数量为0', //图片数量描述文字
				imgList: [],
				//
				dataList: [],
				// [{  //调用接口去掉这个 后面
				// 		id: 1,
				// 		checked: false
				// 	}],
				form: {
					hbr: uni.getStorageSync('userInfo').username, //汇报人
					hblx: '', //汇报类型
					hbnr: '', //汇报内容
					qtbz: '', //其他备注
					wcqk: '是', //完成情况 是/否
					sfyc: '是' //是否异常  是/否
				},
				list1: [{
					name: '是',
					disabled: true
				}, {
					name: '否',
					disabled: false
				}],
				list2: [{
					name: '是',
					disabled: true
				}, {
					name: '否',
					disabled: false
				}],
				hbjbxx: {},
				lczt: '',
				dqjdid: '',
				recordInfo: false,
				chzp: ''
			}
		},
		methods: {
			startRecognize(name) {
				var options = {};
				options.engine = 'baidu'
				options.continue = true
				const that = this
				options.timeout = 500
				options.lang = 'zh-lmz' //语言类型 四川话（不太准） 默认是中文普通话 不设置方言 删除改行即可
				plus.speech.startRecognize(options, function(s) {
						const string = s.replace(/？|。/g, '')
						that.form[name] = string
						plus.speech.stopRecognize()
					},
					function(e) {
						console.log("语音识别失败：" + e.message);
					});
			},
			stop() {
				plus.speech.stopRecognize();
			},
			submit() {
				if (JSON.stringify(this.hbjbxx) === '{}') {
					this.$u.toast('请添加关联业务再提交')
					return
				}

				//校验操作指引是否全部阅读完
				let isRead = this.dataList.every(item => {
					// return item.sfbd === '否' || item.sfbd === ''
					return item.checked
				})
				if (!isRead && this.form.hblx === '晨报') {
					this.$u.toast('请先阅读完所有操作指引文档')
					return
				}

				let obj = Object.assign(this.hbjbxx, this.form)
				
				// obj.zjxh = obj.ysjxh
				// delete obj.ysjxh
				
				this.$u.post('/crm/Order/dailyReportSubmit', obj).then(res => {
					if (res.code === 0) {
						this.$u.toast('提交成功')
						const globalData = getApp().globalData
						globalData.currentHb = 1
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					}
				})
			},
			checkboxGroupChange(e, sfbd) {
				console.log(e, sfbd)
			},
			checkboxGou(sfbd) {
				if (sfbd === '是') {
					this.$u.toast("请点击进入阅读页面阅读勾选")
				}
			},
			goAdd() {
				uni.navigateTo({
					url: './associatedOrder?selectString=daily'
				});
			},
			goSafeInfo(item) {
				uni.navigateTo({
					url: `/pages/modules/reportingGuidelines/guidelines?wdbh=${item.wdbh}&link=${item.fj}`
				})
				// uni.downloadFile({
				//   url: 'https://dev.doscs.com/demo/chengya/doscall//public/upload/2021/07/02/20210702104753275387.pdf',
				//   success: function (res) {
				//     var filePath = res.tempFilePath;
				//     uni.openDocument({
				//       filePath: filePath,
				//       success: function (res) {
				//         console.log('打开文档成功');
				//       }
				//     });
				//   }
				// });
			},
			onChange1(e) {
				this.form.wcqk = e === 1 ? '是' : '否'
				console.log(e);
			},
			onChange2(e) {
				this.form.sfyc = e === 1 ? '是' : '否'
				console.log(e);
			},
			//上传图片成功返回的信息 格式如上
			successCallback(data, index, lists) {
				console.log(lists)
				this.imgLength = index + 1
				this.imgText = `上传图片(${index+1}/4)`
				let imgList = []
				lists.forEach((item, index) => {
					imgList.push(item.response.result)
				})
				this.imgList = imgList
				this.form.chzp = imgList //晨会照片
			},
			//移除图片事件
			onRemove(index, lists, name) {
				this.imgList.splice(index, 1) //删除图片
				this.imgText = `上传图片(${this.imgList.length}/4)`
			},
			//获取操作指引数据
			getGuide() {
				let obj = {
					syjx: this.hbjbxx.ysjxh, //'cfa'  zjxh
					transition_id: this.dqjdid //当传此参数时，为流程办理节点获取文档；
				}
				this.$u.post('/crm/Order/queryOperationGuide', obj).then(res => {
					if (res.code === 0) {
						this.dataList = res.result.data.map(item => {
							item.checked = false
							return item
						})
						console.log('this.dataList', this.dataList)
					}
				})
			},
			//点击图片数组预览
			previewImg(index) {
				uni.previewImage({
					current: index,
					urls: this.chzp
				});
			},
		},
		onLoad(option) {
			let title = option.title === 'daily' ? '日报' : '晨报' //session
			this.form.hblx = title
			uni.setNavigationBarTitle({
				title: '每日汇报-' + title
			})
		},
		onShow() {
			const globalData = getApp().globalData
			if (globalData.glyw && !globalData.meReady && globalData.selectString === 'daily') {
				this.hbjbxx = {
					glywbh: globalData.glyw.gdbh,
					khdwkq: globalData.glyw.khdwkq,
					zjxh: globalData.glyw.zjxh,
					ysjxh: globalData.glyw.ysjxh, //新增 压缩机型号 -》 主机型号
					jzlx: globalData.glyw.jzlx,
					jzxh: globalData.glyw.jzxh,
					ljyhsj: globalData.glyw.ljyhsj
				}
				this.lczt = globalData.glyw.lczt
				this.dqjdid = globalData.glyw.dqjdid
				this.getGuide() //操作指引文档列表
				globalData.glyw = ''
			}
			//文档是否点击进入阅读完 文档编号
			let wdbhRead = globalData.wdbhRead
			if (wdbhRead && globalData.meReady) {
				this.dataList.forEach(item => {
					if (item.wdbh === wdbhRead) {
						item.checked = true
						item.sfbd = '否' //把阅读过的文档 改为否
					}
				})
				globalData.wdbhRead = false
			}
			
			//在reporting 我提交的-》点击日报/晨报 列表item 进入该页面显示详情 （只读）
			if(globalData.record){
				console.log("globalData.record", globalData.record)
				this.recordInfo = true
				this.hbjbxx = {
					glywbh: globalData.record.glywbh,
					khdwkq: globalData.record.khdwkq,
					zjxh: globalData.record.zjxh,
					ysjxh: globalData.record.ysjxh,
					jzlx: globalData.record.jzlx,
					jzxh: globalData.record.jzxh,
					ljyhsj: globalData.record.ljyhsj
				}
				this.form = {
					hblx: globalData.record.hblx,
					hbnr: globalData.record.hbnr,
					qtbz: globalData.record.qtbz,
					wcqk: globalData.record.wcqk,
					sfyc: globalData.record.sfyc
				}
				if(globalData.record.chzp){
					this.chzp = globalData.record.chzp.split(",")
				}
			}
		},
		onUnload() {
			const globalData = getApp().globalData
			globalData.glyw = ''
			globalData.record = ''
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		button::after {
			border: none !important;
		}
	}
</style>
