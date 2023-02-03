<template>
	<view style="height: 100%;" class="content">
		<u-navbar back-text="返回" title="考试" :background="background" :back-text-style="backstyle" back-icon-color="#FFF"
		 title-color="#FFF" :custom-back="customBack">
		</u-navbar>
		<view>
			<view class="u-p-20">
				<u-icon name="clock" size="30"></u-icon><text class="u-m-l-20">{{toLiveBtn}}</text>
				<u-modal :content='overtext' v-model="overshow" @confirm="overconfirm" ref="overModal" :show-cancel-button="false"
				 :async-close="true"></u-modal>
			</view>
			<u-card :show-head="false" :show-foot="true" border-radius="0" margin="0">
				<view slot="body">
					<view class="u-padding-14  u-font-16" style="line-height: 60rpx;">
						<u-tag :text="dataList[index].type" size="mini" class="u-m-r-20" />
						{{ dataList[index].title }}
					</view>
				</view>
			</u-card>
			<u-gap bg-color="#f3f4f6"></u-gap>
			<u-card :show-head="false" :show-foot="true" border-radius="0" margin="0" v-if="!disabled">
				<view slot="body">
					<view class="m-b-c">
						<view v-if="dataList[index].type == '单选题'" class="u-padding-left-20 ">
							<u-radio-group v-model="deposit[index].answer" :wrap="true" :disabled="disabled" @change="singleChange(i,e)">
								<u-radio v-for="(item, i) in dataList[index].setting.list" :key="i" :name="item.value">
									<view style="line-height: 80rpx;">{{ letter[i] }}.{{item.name}}</view>
								</u-radio>
							</u-radio-group>
						</view>
						<view v-show="dataList[index].type == '判断题'" class="u-padding-left-20 ">
							<u-radio-group v-model="deposit[index].answer" :wrap="true" :disabled="disabled">
								<u-radio v-for="(item, index) in judges" :key="index" :name="item.name" @change="judgeRadio">
									<view style="line-height: 80rpx;">{{ item.name | judge }}</view>
								</u-radio>
							</u-radio-group>
						</view>
						<view v-if="dataList[index].type == '多选题'" class="u-padding-left-20 ">
							<u-checkbox-group :wrap="true" @change="multipleChoice" :disabled="disabled">
								<u-checkbox v-for="(item, i) in dataList[index].setting.list" :key="i" :name="item.value" v-model="item.checked">
									<view style="line-height: 80rpx;">{{ letter[i] }} . {{ item.name }}</view>
								</u-checkbox>
							</u-checkbox-group>
						</view>
						<view v-if="dataList[index].type == '填空题'" class="u-padding-left-20">
							<u-field :disabled="disabled" v-for="(item,i) in dataList[index].setting.answer" :key='i' v-model="fill[index][i]"
							 @input="inputtext(text,index,i)" :label="'填空项'+(i+1)" placeholder="请填写答案">
							</u-field>
						</view>
						<view v-if="dataList[index].type == '简答题'" class="u-padding-left-20">
							<view class="u-p-20">
								<u-input :disabled="disabled" height="300" v-model="deposit[index].answer" type="textarea" :border="true"
								 :placeholder="disabled ? '':'请输入答案'" />
							</view>
						</view>
					</view>
				</view>
			</u-card>
		</view>
		<u-card :show-head="false" :show-foot="true" border-radius="0" margin="0" v-if="disabled" class="u-m-b-40">
			<view slot="body">
				<view class="u-padding-20 u-m-t-20 residue">
					<!-- allList.paper_setting.paper_after == '0'
						paper_after考试交卷后：0-得分可见 1-得分、对错 2-得分、对错、正确答案跟答案解析 （状态进行中，在活动时间内）
						esam_after字段值0 1 2定义同上 该字段表示考试结束后 即状态已结束（不在活动时间内）-->
					<!-- 填空题 -->
					<view v-if="dataList[index].type == '填空题'">
						<!-- 没回答没填 -->
						<view v-if="!dataList[index].answer">
							<text>你的回答：</text>
							<text class="u-m-r-10">未填</text>
							<block v-if="allList.paper_setting.paper_after == '1' || allList.paper_setting.paper_after == '2'">
								<u-icon name="close" color="#fa3534"></u-icon>
							</block>
						</view>
						<!-- 填了回答了 -->
						<block v-else-if="dataList[index].answer">
							<text>你的回答：</text>
							<view v-for="(item,i) in dataList[index].answer" :key="i" class="content-color">
								<view v-if=" dataList[index].setting.allow != '1'">
									<text>填空项{{i+1}}</text>：
									<text class="u-m-r-10">{{ item == '' ? '未填' : item }}</text>
									<block v-if="allList.paper_setting.paper_after == '1' || allList.paper_setting.paper_after == '2'">
										<u-icon name="checkmark" color="#19be6b" v-if="item == dataList[index].setting.answer[i]"></u-icon>
										<u-icon name="close" color="#fa3534" v-else></u-icon>
									</block>
								</view>
								<view v-else>
									<text>填空项{{i+1}}</text>：
									<text class="u-m-r-10">{{ item == '' ? '未填' : item }}</text>
									<block v-if="allList.paper_setting.paper_after == '1' || allList.paper_setting.paper_after == '2'">
										<u-icon name="checkmark" color="#19be6b" v-if="(dataList[index].setting.answer.indexOf(item))>=0"></u-icon>
										<u-icon name="close" color="#fa3534" v-else></u-icon>
									</block>
								</view>
							</view>

						</block>

					</view>

					<!-- 简答题 -->
					<!-- <view v-if="dataList[index].type == '简答题'">
						//
						</view> -->

					<!-- 非填空题 -->
					<view v-else class="u-m-b-20 u-flex">
						你的回答：
						<text class="u-m-r-20" v-if="dataList[index].type == '判断题' && dataList[index].answer">{{dataList[index].answer == '1' ? '对' : '错'}}</text>
						<text class="u-m-r-20" v-else>{{dataList[index].answer ? dataList[index].answer : '未填'}}</text>
						<block v-if="allList.paper_setting.paper_after == '1' || allList.paper_setting.paper_after == '2'">
							<!-- 回答跟正确答案一致 打钩 -->
							<view v-if="dataList[index].correct == 1&&dataList[index].type != '简答题'">
								<u-icon name="checkmark" color="#19be6b"></u-icon>
							</view>
							<!-- 回答跟正确答案不一致 打× -->
							<view v-else-if="dataList[index].correct == 0&&dataList[index].type != '简答题'">
								<u-icon name="close" color="#fa3534"></u-icon>
							</view>
							<!-- 没回答默认错 打× -->
							<view v-else-if="dataList[index].type != '简答题'">
								<u-icon name="close" color="#fa3534"></u-icon>
							</view>
						</block>
						<!-- <view style="background: #EEE;">{{JSON.stringify(dataList[index])}}</view> -->
					</view>

					<block v-if="allList.paper_setting.paper_after == '2'">
						<view class="u-m-b-20">
							<text v-if="dataList[index].type == '判断题'">正确答案：{{dataList[index].setting.answer == '1' ? '对' : '错'}}</text>
							<text v-else-if="dataList[index].type == '简答题'">正确答案：{{dataList[index].setting.answer}}</text>
							<text v-else>正确答案：<text v-if="dataList[index].type != '简答题'">{{ dataList[index].setting.answer }}</text></text>
						</view>
						<view class="u-m-b-20" v-if="dataList[index].setting.analysis">
							答案解析：{{dataList[index].setting.analysis}}
						</view>
					</block>

				</view>
			</view>
		</u-card>
		<u-modal v-model="modalshow" :content="content" :show-confirm-button="true" :show-cancel-button="true" @confirm="confirm"
		 :show-title="false"></u-modal>
		<u-toast ref="uToast" />
		<u-card :show-head="false" :show-foot="true" border-radius="0" margin="0" style="position: absolute;bottom: 1px;width: 100%">
			<view slot="body">
				<view>
					<view class="u-flex u-row-between">
						<view class="u-flex-1">
							<view v-show="index > 0" @click="step">
								<u-icon name="play-left" size="28" /><text class="u-m-l-20">上一题</text>
							</view>
						</view>
						<view @click="selet" class="u-flex">
							<u-icon name="grid" size="48rpx" color="#c8c9cc"></u-icon>
							<view class="u-m-l-20">{{ index+1 }}/{{ dataList.length }}</view>
						</view>
						<view class="u-flex-1 u-text-right">
							<view v-if="(index+1) != dataList.length" @click="next">
								<text class="u-m-r-20">下一题</text>
								<u-icon name="play-right" size="28" />
							</view>
							<u-button type="primary" shape="circle" size="mini" class="u-m-0 " v-if="(index+1) == dataList.length && !disabled"
							 @click="submit">交卷</u-button>
						</view>
					</view>
					<u-popup v-model="show" mode="bottom" height="500">
						<view class="u-padding-20 u-flex u-row-left" style="border: 1px solid #f5f5f5;">
							<view class="u-flex-1">
							</view>
							<view class="u-flex u-row-center u-flex-1">
								<u-icon name="grid" size="48rpx" color="#c8c9cc"></u-icon>
								<view class="u-m-l-20">{{ index+1 }}/{{ dataList.length }}</view>
							</view>
							<view class="u-flex-1 u-text-right ">
								<u-button type="primary" shape="circle" size="mini" class="u-m-0 " v-if="!disabled" @click="submit">交卷</u-button>
							</view>
						</view>
						<view class="u-padding-20 u-flex u-flex-wrap ">
							<u-button shape="circle" v-for="(item,i) in deposit" :key="i" :class=" btnindex==i ? 'u-m-0 u-m-r-30 u-m-b-30 btn btnborder' : 'u-m-0 u-m-r-30 u-m-b-30 btn'"
							 :type="item.answer.length!= 0 ? 'primary' : ''" @click="switchover(i)">
								{{ i+1 }}
							</u-button>
							<u-button v-if="disabled" shape="circle" :class=" btnindex==i ? 'u-m-0 u-m-r-30 u-m-b-30 btn btnborder' : 'u-m-0 u-m-r-30 u-m-b-30 btn' "
							 v-for="(item,i) in dataList" :key="i" @click="switchover(i)">
								{{ i+1 }}
							</u-button>
						</view>
					</u-popup>
				</view>
			</view>
		</u-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
				current: -1,

				judges: [{
					name: '1',
				}, {
					name: '0',
				}],
				value: '',
				show: false,
				index: 0,
				disabled: false,
				background: {
					backgroundColor: '#1890ff',
				},
				backstyle: {
					color: '#FFF',
				},
				countTime: 7200,
				interval: '',
				toLiveBtn: '00时00分00秒',
				content: '确定交卷吗?',
				modalshow: false,
				btnindex: 0,
				paperid: 0, //考试管理ID
				examid: 0, //试卷管理ID
				dataList: [],
				allList: {}, //接口的result总数据
				checkbox: [],
				deposit: [],
				gradeid: '', //考生试卷ID
				fill: [],
				overshow: false,
				overtext: '考试时间结束，已为您提交试卷'
			}
		},
		watch: {
			'index': function(news, older) {
				this.btnindex = news
			}
		},
		filters: {
			judge: (value) => {
				if (value == '1') {
					return '对'
				} else if (value == '0') {
					return '错'
				}
			}
		},
		methods: {
			singleChange(i, e) {},
			inputtext(t, e, v) {
				this.deposit[e].answer = this.fill[e]
			},
			judgeRadio(e) {
				if (e == '对') {
					this.deposit[this.index].answer = '1'
				} else {
					this.deposit[this.index].answer = '0'
				}
			},
			getDataList() {
				this.$u.post('exam/Achievement/exam', {
					"paperid": this.paperid,
					"examid": this.examid,
					"action": 'start',
				}, true).then(res => {
					this.gradeid = res.result.gradeid
					for (var i in res.result.question) {
						let odd = {
							question: res.result.question[i].id,
							answer: ''
						}
						if (res.result.question[i].type == 'multiple' || res.result.question[i].type == 'single') {
							if (res.result.question[i].type == 'multiple') {
								res.result.question[i].type = '多选题'
							} else if (res.result.question[i].type == 'single') {
								res.result.question[i].type = '单选题'
							}
							let checkbox = []
							let options = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
							let num = 0
							res.result.question[i].setting.list = Object.values(res.result.question[i].setting.list)
							res.result.question[i].setting.list.map(item => {
								let check = {
									name: '',
									checked: false,
									value: ''
								}
								check.name = item
								check.value = options[num]
								num++
								checkbox.push(check)
								res.result.question[i].setting.list = checkbox
							})
						} else if (res.result.question[i].type == 'fills') {
							res.result.question[i].type = '填空题'
							let c = 0
							for (var i = 0; i < res.result.question.length; i++) {
								this.fill[i] = []
							}
						} else if (res.result.question[i].type == 'judge') {
							res.result.question[i].type = '判断题'
						} else if (res.result.question[i].type == 'answer') {
							res.result.question[i].type = '简答题'
						}
						this.deposit.push(odd)
					}
					this.dataList = res.result.question
					this.allList = res.result
				})
			},
			examine() {
				this.$u.get('exam/Achievement/checkGrade', {
					gradeid: this.gradeid
				}, true).then(res => {
					// Number(res.result.data.duration)
					let secondTime = parseInt(Number(res.result.data.duration) * 60) //将传入的秒的值转化为Number
					let min = 0 // 初始化分
					let h = 0 // 初始化小时
					let resultTime = ''
					if (secondTime >= 60) { //如果秒数大于或等于60，将秒数转换成整数
						min = parseInt(secondTime / 60) //获取分钟，除以60取整数，得到整数分钟
						secondTime = parseInt(secondTime % 60) //获取秒数，秒数取佘，得到整数秒数
						if (min > 60) { //如果分钟大于60，将分钟转换成小时
							h = parseInt(min / 60) //获取小时，获取分钟除以60，得到整数小时
							min = parseInt(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
						}
					}
					resultTime =
						`${h.toString().padStart(2,'0')}时${min.toString().padStart(2,'0')}分${secondTime.toString().padStart(2,'0')}秒`
					this.toLiveBtn = resultTime

					for (var i in res.result.question) {
						if (res.result.question[i].type == 'multiple') {
							res.result.question[i].type = '多选题'
						} else if (res.result.question[i].type == 'fills') {
							res.result.question[i].type = '填空题'
						} else if (res.result.question[i].type == 'judge') {
							res.result.question[i].type = '判断题'
						} else if (res.result.question[i].type == 'answer') {
							res.result.question[i].type = '简答题'
						} else if (res.result.question[i].type == 'single') {
							res.result.question[i].type = '单选题'
						}
					}
					this.dataList = res.result.question
					this.allList = res.result
				})
			},
			next() {
				this.index++
			},
			step() {
				this.index--
			},
			selet() {
				this.show = true
			},
			switchover(value) {
				this.index = value
				this.btnindex = value
				this.show = false
			},
			multipleChoice(e) {
				this.deposit[this.index].answer = e
			},
			answer(datas) {
				this.$u.post('/exam/Index/answer', datas, true).then(res => {})
			},
			submit() {
				this.modalshow = true
				this.show = false

			},
			confirm() {
				this.$u.post('exam/Achievement/exam', {
					action: 'submit',
					gradeid: this.gradeid,
					setting: this.deposit
				}, true).then(res => {
					this.$refs.uToast.show({
						title: '交卷成功',
						type: 'success',
					})
					uni.redirectTo({
						url: './report?gradeid=' + this.gradeid
					})

				})
			},
			customBack() {
				let _this = this
				// this.showLogout = true
				if (this.disabled) {
					//查看考试结果可直接退出
					// uni.redirectTo({
					// 	url: '../exam'
					// })
					uni.navigateBack({
						delta: 1
					});
				} else {
					//正在考试状态中
					uni.showModal({
						title: '提示',
						content: '正在考试中,确认交卷并退出考试吗？',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								_this.confirm()
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			},
			getCode() {
				this.interval = setInterval(() => {
					if (this.countTime == 0) {
						clearInterval(this.interval)
						this.overshow = true
						this.$u.post('exam/Achievement/exam', {
							action: 'submit',
							gradeid: this.gradeid,
							setting: this.deposit
						}, true).then(res => {
							console.log(res)
						})
					} else {
						this.countTime--
						let hr = parseInt(this.countTime / 60 / 60 % 24)
						let min = parseInt(this.countTime / 60 % 60)
						let sec = parseInt(this.countTime % 60)
						hr = hr > 9 ? hr : '0' + hr
						min = min > 9 ? min : '0' + min
						sec = sec > 9 ? sec : '0' + sec
						this.toLiveBtn = `${hr}时${min}分${sec}秒`
					}
				}, 1000);
			},
			overconfirm() {
				uni.redirectTo({
					url: './report?gradeid=' + this.gradeid
				})
			}
		},
		onLoad(options) {
			if (options.disabled) {
				//查看考试结果
				this.disabled = true
				this.gradeid = options.gradeid
				this.examine()
			} else {
				this.paperid = parseInt(options.paperid)
				this.examid = parseInt(options.examid)
				this.getDataList()
			}
			if (options.interval != undefined) {
				this.countTime = options.interval
				// this.countTime=10
				this.getCode()
			}

		},
		onHide() {
			this.$u.post('exam/Achievement/exam', {
				action: 'submit',
				gradeid: this.gradeid,
				setting: this.deposit
			}, true).then(res => {
				this.$refs.uToast.show({
					title: '交卷成功',
					type: 'default',
				})
				uni.redirectTo({
					url: './report?gradeid=' + this.gradeid
				})

			})
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		border-radius: 50% !important;
		width: 84rpx !important;
	}

	/* #ifdef MP-WEIXIN*/
	.btnborder {
		/deep/ button {
			background-color: #dbf1e1 !important;
		}
	}

	/* #endif */
	/* #ifdef MP-WEIXIN || H5*/
	.content {
		display: flex;
		flex-direction: column;

		.residue {
			flex-grow: 1
		}
	}

	/* #endif */
</style>
