<template>
	<view class="box">
		<map style="width: 750rpx; height: 300rpx;" :latitude="latitude" :longitude="longitude" :markers="covers"
			v-if="status === 1 && isShow" :circles="circles"></map>
		<u-tabs :list="tabsList" :current="current" @change="onChange" font-size="20" height="60" :is-scroll="isScroll">
		</u-tabs>
		<view v-if="detail.fwxm !== '质量回馈'">
			<block v-if="current == 0">
				<customCard title="客户基础信息">
					<u-form>
						<u-row gutter="32">
							<u-col :span="4" v-for="(item, index) in allList.khjcxx" :key="index">
								<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top"
									:label="item.name" :border-bottom="index < allList.khjcxx.length - 3">
									<view style="font-size: 20rpx; width: 200rpx;" class="u-line-1">
										{{detail[item.field] || '无'}}
									</view>
								</u-form-item>
							</u-col>
						</u-row>
					</u-form>
				</customCard>
				<customCard title="机组信息">
					<u-form>
						<u-row gutter="32">
							<u-col :span="4" v-for="(item, index) in allList.jzxx" :key="index">
								<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top"
									:label="item.name">
									<view class="u-flex">
										<view
											:style="{'font-size': '20rpx', 'width': item.field === 'jzxh'? '58rpx': '200rpx'}"
											class="u-line-1">{{detail[item.field] || '无'}}</view>
									</view>
								</u-form-item>
							</u-col>
						</u-row>
						<u-row gutter="32">
							<u-col :span="6" v-for="(item, index) in allList.azdz" :key="index">
								<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top"
									:label="item.name" :border-bottom="index < allList.azdz.length - 2">
									<view style="font-size: 20rpx; width: 300rpx;" class="u-line-1">
										{{detail[item.field] || '无'}}
									</view>
									<view v-if="item.field === 'jzxh'"
										style="position: absolute; margin-top: -38rpx; margin-left: 92rpx;">
										<u-tag text="作业指导书" color="#2979ff" mode="plain" type="primary" size="mini"
											class="tagClass" @click='goGuide(detail[item.field])' />
									</view>
								</u-form-item>
							</u-col>
						</u-row>
					</u-form>
				</customCard>
				<customCard title="建单信息">
					<u-form>
						<u-row gutter="32">
							<u-col :span="6" v-for="(item, index) in allList.jdxx" :key="index">
								<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top"
									:label="item.name">
									<view style="font-size: 20rpx; width: 300rpx;" class="u-line-1">
										{{detail[item.field] || '无'}}
									</view>
								</u-form-item>
							</u-col>
						</u-row>
						<u-row gutter="32">
							<u-col :span="12">
								<u-form-item :label-style="{'font-size': '16rpx'}" :label="allList.jdxx2end.name"
									:border-bottom="false" label-position="top">
									<view style="font-size: 20rpx;">{{detail[allList.jdxx2end.field] || '无'}}</view>
								</u-form-item>
							</u-col>
						</u-row>
					</u-form>
				</customCard>
				<customCard title="派工信息">
					<u-form>
						<u-row gutter="32">
							<u-col :span="4" v-for="(item, index) in allList.pgxx" :key="index">
								<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top"
									:label="item.name" :border-bottom="index < allList.pgxx.length - 3">
									<view style="font-size: 20rpx; width: 200rpx;" class="u-line-1">
										{{detail[item.field] || '无'}}
									</view>
								</u-form-item>
							</u-col>
						</u-row>
					</u-form>
				</customCard>
				<orderAppoint v-if="status === 0 && isShow" :fabFlag="fabFlag" :tableTextData="tableTextData"
					:fxgcs="fxgcs"></orderAppoint>
				<!-- 工单办理 打卡出发到达 008-009节点-->
				<clockIn v-else-if="status === 1 && isShow" :fabFlag="fabFlag" :transitionId="transitionId"
					:ch_address="ch_address"></clockIn>
				<view style="position: fixed; bottom: 175rpx; right: 40rpx; z-index: 1500; background-color: white;"
					@click="clickFab" v-if="fabFlag && isShow">
					<u-icon name="plus-circle-fill" size="70" class="u-type-primary"></u-icon>
					<view style="color: white; background-color: #2979FF; font-size: 16rpx; text-align: center;">
						{{applyPart? '申请配件':'领取配件'}}
					</view>
				</view>
			</block>
			<block v-if="current == 1">
				<customCard title="流程日志">
					<u-read-more :toggle="true" :show-height="400" close-text="查看全部日志" ref="uReadMore">
						<u-time-line>
							<u-time-line-item v-for="(item, index) in loglist" :key="index">
								<template v-slot:node>
									<view class="node" :class="index === 0 ? 'color_blue':'color_gray'">
									</view>
								</template>
								<template v-slot:content>
									<view class="u-p-l-24 log-content">
										<view class="u-order-desc u-rela">{{item.title}}</view>
										<view class="u-order-desc u-rela">{{item.content}}</view>
										<view class="u-light-color u-rela">{{item.create_time}}</view>
									</view>
								</template>
							</u-time-line-item>
						</u-time-line>
					</u-read-more>
				</customCard>
			</block>
			<block v-if="current == 2">
				<view class="u-flex u-padding-16 u-flex-1">
					<u-search class="u-flex-1" placeholder="搜索工程师" bg-color="#fff" @search="onsearch"
						@custom="onsearch">
					</u-search>
				</view>
				<u-card margin="16rpx" :show-head="false" :body-style="{padding: '8rpx'}"
					v-for="(item, index) in dataList" :key="index">
					<view slot="body">
						<view class="u-flex u-row-around">
							<view class="sgryxx" style="width: 600rpx;">
								<u-row>
									<u-col :span="4">
										<view class="u-line-1"><text>姓名：</text><text>{{item.xm || '无'}}</text></view>
										<view class="u-line-1"><text>所属部门：</text><text>{{item.ssbm || '无'}}</text>
										</view>
										<view class="u-line-1"><text>岗位：</text><text>{{item.gw || '无'}}</text></view>
									</u-col>
									<u-col :span="4">
										<view class="u-line-1"><text>电话号码：</text><text>{{item.dhhm || '无'}}</text>
										</view>
										<view class="u-line-1"><text>分公司：</text><text>{{item.ssfgs || '无'}}</text>
										</view>
										<view class="u-line-1"><text>职称：</text><text>{{item.zc || '无'}}</text></view>
									</u-col>
									<u-col :span="4">
										<view class="u-line-1"><text>性别：</text><text>{{item.xb || '无'}}</text></view>
										<view class="u-line-1"><text>参工日期：</text><text>{{item.cgrq || '无'}}</text>
										</view>
										<view class="u-line-1"><text>技术等级：</text><text>{{item.jsdj || '无'}}</text>
										</view>
									</u-col>
								</u-row>
								<u-row>
									<u-col :span="12"><text>擅长技能：</text><text>{{item.szjn || '无'}}</text></u-col>
								</u-row>
								<u-row>
									<u-col :span="12"><text>具备证书：</text><text>{{item.jbzs || '无'}}</text></u-col>
								</u-row>
							</view>
							<view>
								<u-image v-if="item.zp && item.zp.length > 0" width="100rpx" height="100rpx"
									:src="configUrl.url + item.zp[0].filePath" mode=""></u-image>
								<u-image v-else width="100rpx" height="100rpx" mode="">
									<view slot="error" style="font-size: 18rpx;">暂无图片</view>
								</u-image>
							</view>
						</view>

					</view>
				</u-card>
				<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
			</block>
			<block v-if="current == 3">
				<view class="u-flex u-padding-16 u-flex-1">
					<u-search class="u-flex-1" placeholder="请输入工程师姓名" bg-color="#fff" @search="onsearch"
						@custom="onsearch">
					</u-search>
				</view>
				<u-card margin="16rpx" :show-head="false" :body-style="{padding: '8rpx'}"
					v-for="(item, index) in dataList" :key="index">
					<view class="sgryxx" slot="body">
						<u-row justify="center">
							<u-col :span="4">
								<view><text>资质证书名称：</text><text>{{item.zzzsmc || '无'}}</text></view>
							</u-col>
							<u-col :span="4">
								<view><text>资质证书编号：</text><text>{{item.zzzsbh || '无'}}</text></view>
							</u-col>
							<u-col :span="4">
								<view><text>发证部门：</text><text>{{item.fzbm || '无'}}</text></view>
							</u-col>
						</u-row>
						<u-row>
							<u-col :span="4">
								<view><text>拥有姓名：</text><text>{{item.gcsxm || '无'}}</text></view>
							</u-col>
							<u-col :span="4">
								<view><text>所属分公司：</text><text>{{item.ssfgs || '无'}}</text></view>
							</u-col>
							<u-col :span="4">
								<view><text>发证日期：</text><text>{{item.fzrq || '无'}}</text></view>
							</u-col>
						</u-row>
					</view>
				</u-card>
				<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
			</block>
			<block v-if="current == 4">
				<view class="u-flex u-padding-16 u-flex-1">
					<u-search class="u-flex-1" placeholder="请输入车牌号" bg-color="#fff" @search="onsearch"
						@custom="onsearch">
					</u-search>
				</view>
				<u-card margin="16rpx" :show-head="false" :body-style="{padding: '8rpx'}"
					v-for="(item, index) in dataList" :key="index">
					<view class="sgryxx" slot="body">
						<u-row justify="center">
							<u-col :span="4">
								<view><text>车辆类型：</text><text>{{item.cllx || '无'}}</text></view>
							</u-col>
							<u-col :span="4">
								<view><text>车牌号：</text><text>{{item.cph || '无'}}</text></view>
							</u-col>
							<u-col :span="4">
								<view><text>司机姓名：</text><text>{{item.sjxm || '无'}}</text></view>
							</u-col>
						</u-row>
						<u-row>
							<u-col :span="4">
								<view><text>司机电话：</text><text>{{item.sjdh || '无'}}</text></view>
							</u-col>
							<u-col :span="4">
								<view><text>所属分公司：</text><text>{{item.ssfgs || '无'}}</text></view>
							</u-col>
						</u-row>
					</view>
				</u-card>
				<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
			</block>
			<block v-if="current == 5">
				<u-card :show-head="false">
					<view slot="body">
						<view class="u-flex u-border-bottom u-p-t-10 u-p-b-20" v-for="(item, index) in dataList"
							:key="index">
							<u-image v-if="item.pjtp && item.pjtp.length > 0" :src="item.pjtp" width="150rpx"
								height="150rpx"></u-image>
							<u-image v-else width="150rpx" height="150rpx">
								<view slot="error" class="u-font-18">暂无图片</view>
							</u-image>
							<view class="u-m-l-20 u-flex-1">
								<view class="u-main-color u-line-1 u-m-b-8">{{item.pjmc}}</view>
								<view class="u-flex u-col-top u-flex-1 u-m-b-8">
									<view class="u-content-color u-text-right" style="width: 140rpx;">配件编号：</view>
									<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.glpjbh}}</view>
								</view>
								<view class="u-flex u-col-top u-flex-1 u-m-b-8">
									<view class="u-content-color u-text-right" style="width: 140rpx;">配件型号：</view>
									<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.pjxh}}</view>
								</view>
								<view class="attribute u-flex u-row-between u-m-b-8">
									<view class="u-flex u-col-top u-flex-1">
										<view class="u-content-color u-text-right" style="width: 140rpx;">单价：</view>
										<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.pjdj}}</view>
									</view>
									<view>
										<text class="u-content-color">数量：</text>
										<text class="u-main-color">{{item.sqsl}}</text>
									</view>
								</view>
							</view>
						</view>
						<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
					</view>
				</u-card>
			</block>
			<block v-if="current == 6">
				<u-table font-size="20">
					<u-tr>
						<u-td>序号</u-td>
						<u-td>出发时间</u-td>
						<u-td>出发地点</u-td>
						<u-td>到达时间</u-td>
						<u-td>到达地点</u-td>
					</u-tr>
					<u-tr v-for="(item, index) in dataList" :key="index">
						<u-td>{{index + 1}}</u-td>
						<u-td>{{item.cfsj}}</u-td>
						<u-td>{{item.cfdd}}</u-td>
						<u-td>{{item.ddsj}}</u-td>
						<u-td>{{item.dddd}}</u-td>
					</u-tr>
					<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
				</u-table>
			</block>
			<block v-if="current == 7">
				<u-table font-size="20">
					<u-tr>
						<u-td><text class="u-font-20">操作</text></u-td>
						<u-td><text class="u-font-20">方案名称</text></u-td>
						<u-td><text class="u-font-20">完成状态</text></u-td>
					</u-tr>
					<u-tr v-for="(item, index) in dataList" :key="index">
						<u-td>
							<text class="u-type-primary u-font-20" @click="preview(item.tp[0].filePath)">
								{{item.tp && item.tp.length>0?'查看':''}}
							</text>
						</u-td>
						<u-td>
							<text class="u-font-20">{{item.famc}}</text>
							<text v-if="item.smbz" class="u-font-20">({{item.smbz}})</text>
						</u-td>
						<u-td><text class="u-font-20">{{item.wczt}}</text></u-td>
					</u-tr>
					<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
				</u-table>
			</block>
			<block v-if="current == 8">
				<u-table font-size="20">
					<u-tr>
						<u-td width="20%">序号</u-td>
						<u-td width="60%">文件名称</u-td>
						<u-td width="20%">填写状态</u-td>
					</u-tr>
					<u-tr v-for="(item, index) in dataList" :key="index">
						<u-td width="20%">{{ index + 1 }}</u-td>
						<u-td width="60%">
							<view style="color: #2979FF; font-size: 20rpx;" @click="openTable(item)">
								{{ item.bgmc }}
							</view>
						</u-td>
						<u-td width="20%">
							<view>{{ item._sftx_ === 's' ? '已填写' : '未填写' }}</view>
						</u-td>
					</u-tr>
					<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
				</u-table>
			</block>
			<block v-if="current == 9">
				<u-table font-size="20">
					<u-tr>
						<u-td width="30%">图片</u-td>
						<u-td width="30%">名称</u-td>
						<u-td width="20%">创建人</u-td>
						<u-td width="20%">创建时间</u-td>
					</u-tr>
					<u-tr v-for="(item, index) in dataList" :key="index">
						<u-td width="30%">
							<view class="u-flex u-row-center" v-if="item.tp && item.tp.length > 0">
								<view v-for="(imgItem, imgIndex) in item.tp" class="u-m-r-10"
									@click="preview(imgItem.filePath)">
									<u-image :src="configUrl.url + imgItem.filePath" width="50rpx" height="50rpx">
									</u-image>
								</view>
							</view>
						</u-td>
						<u-td width="30%">{{ item.mc }}</u-td>
						<u-td width="20%">{{ item.cjr }}</u-td>
						<u-td width="20%">{{ item.cjsj }}</u-td>
					</u-tr>
					<ListLoadingMore :status="loadingStatus"></ListLoadingMore>
				</u-table>
			</block>
		</view>
		<view v-else>
			<!-- 质量回馈单 -->
			<block v-if="current == 0">
				<customCard title="基础信息">
					<u-form>
						<u-row gutter="32">
							<u-col :span="4" v-for="(item, index) in allList.zlhk1" :key="index">
								<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top"
									:label="item.name">
									<view
										:style="{'font-size': '20rpx', 'width': item.field === 'jzxh'? '58rpx': '200rpx'}"
										class="u-line-1">{{detail[item.field] || '无'}}</view>
								</u-form-item>
							</u-col>
						</u-row>
						<u-row gutter="32">
							<u-col :span="6" v-for="(item, index) in allList.zlhk2" :key="index">
								<u-form-item :label-style="{'font-size': '16rpx'}" label-position="top"
									:label="item.name" :border-bottom="index < allList.azdz.length - 2">
									<view style="font-size: 20rpx; width: 300rpx;" class="u-line-1">
										{{detail[item.field] || '无'}}
									</view>
									<view v-if="item.field === 'jzxh'"
										style="position: absolute; margin-top: -38rpx; margin-left: 92rpx;">
										<u-tag text="作业指导书" color="#2979ff" mode="plain" type="primary" size="mini"
											class="tagClass" @click='goGuide(detail[item.field])' />
									</view>
								</u-form-item>
							</u-col>
						</u-row>
						<u-row gutter="32">
							<u-col :span="12">
								<u-form-item :label-style="{'font-size': '16rpx'}" :label="allList.zlhk3[0].name"
									:border-bottom="false" label-position="top">
									<view style="font-size: 20rpx;">{{detail[allList.zlhk3[0].field] || '无'}}</view>
								</u-form-item>
							</u-col>
						</u-row>
					</u-form>
				</customCard>
				<orderAppoint v-if="status === 0 && isShow" :fabFlag="fabFlag" :tableTextData="tableTextData"
					:fxgcs="fxgcs"></orderAppoint>
			</block>
			<block v-if="current == 1">
				<customCard title="流程日志">
					<u-read-more :toggle="true" :show-height="400" close-text="查看全部日志" ref="uReadMore">
						<u-time-line>
							<u-time-line-item v-for="(item, index) in loglist" :key="index">
								<template v-slot:node>
									<view class="node" :class="index === 0 ? 'color_blue':'color_gray'">
									</view>
								</template>
								<template v-slot:content>
									<view class="u-p-l-24 log-content">
										<view class="u-order-desc u-rela">{{item.title}}</view>
										<view class="u-order-desc u-rela">{{item.content}}</view>
										<view class="u-light-color u-rela">{{item.create_time}}</view>
									</view>
								</template>
							</u-time-line-item>
						</u-time-line>
					</u-read-more>
				</customCard>
			</block>
		</view>

		<!-- 工单办理 师傅安装完成 -->
		<finishOrder v-else-if="status === 2" @goTo="goTo" :fabFlag="fabFlag"></finishOrder>
		<u-toast ref="uToast" />
		<u-popup v-model="popShow" width="600" height="300" mode="center" border-radius="12" closeable>
			<view class="pop_box">
				<view class="pop_title">
					师傅邀请码
				</view>
				<view class="pop_content">
					{{yqm}}
				</view>
				<view class="pop_footer">
					状态：{{yqmStatus}}
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import loadPage from '@/pages/order/modulePublic/mixins/loadPage.js'
	import ListLoadingMore from '@/pages/order/modulePublic/sonComponents/ListLoadingMore.vue'
	import allList from './orderDetail.js'
	const QQMapWX = require('../../common/wxmap_sdk/qqmap-wx-jssdk.min.js')
	let qqmapsdk
	import orderAppoint from './HandleOrder/orderAppoint.vue'
	import clockIn from './HandleOrder/clockIn.vue'
	import finishOrder from './HandleOrder/finishOrder.vue'
	import tableText from './HandleOrder/tableText.vue'
	import customCard from '@/components/customCard.vue' //已在main.js 全局注册组件  全局注册不生效，只能单个页面引入
	export default {
		components: {
			orderAppoint,
			clockIn,
			finishOrder,
			customCard,
			ListLoadingMore
		},
		mixins: [loadPage], //使用混入文件
		data() {
			return {
				isScroll: true,
				ch_address: '',
				//新增参数
				isOnReachBottom: false, //下滑底部是否加载请求
				initial: {
					apiName: '/admin/UserTable/init',
					getDataListIsPage: true, //是否分页
				},
				listName: 'result',
				dataForm: {
					searchString: {},
					sortField: "id",
					sortOrder: "descend",
					tplviewid: "",
					type: "table_form_list",
					relation: {
						key: "",
						val: ''
					}
				},
				//分页参数如上
				configUrl: this.config,
				fxgcs: '',
				current: 0,
				tabsList: [{
						id: 0,
						name: '数据窗口'
					},
					{
						id: 1,
						name: '流程日志'
					},
					{
						id: 2,
						name: '施工人员信息'
					},
					{
						id: 3,
						name: '证书信息'
					},
					{
						id: 4,
						name: '车辆信息表'
					}, {
						id: 5,
						name: '配件领取明细'
					}, {
						id: 6,
						name: '出发到达表'
					}, {
						id: 7,
						name: '方案表'
					}, {
						id: 8,
						name: '各类信息表'
					}, {
						id: 9,
						name: '上传图片表'
					}
				],
				slid: '',
				allList: allList,
				//以上新增
				detail: {},
				loglist: [],
				tableTextData: [],
				status: -1, // 0待预约工单，1待上门打开，2待上门安装
				covers: [], // 地图marks
				latitude: 39.909, // 纬度
				longitude: 116.39742, // 经度
				circles: [],
				transitionId: '',
				fabFlag: false,
				popShow: false,
				applyPart: false,
				receivePart: false,
				yqm: '', // 邀请码
				yqmStatus: '',
				isShow: true
			}
		},
		onLoad(options) {
			//以上新增
			let globalData = getApp().globalData
			const {
				orderDetail
			} = globalData
			let params = {
				case_id: options.caseid || orderDetail.slid
			}
			this.slid = params.case_id
			if (options.connection) {
				params.connection = options.connection
			}
			this.$u.post('/app/WorkOrder/orderDetail', params).then(res => {
				if (JSON.stringify(res.result.workitemData) === '[]') {
					this.isShow = false
				}
				this.detail = res.result.orderData
				if (this.detail.fwxm === '质量回馈') {
					this.isScroll = false
					this.tabsList = [{
						id: 0,
						name: '数据窗口'
					}, {
						id: 1,
						name: '流程日志'
					}]
				}
				const userInfo = uni.getStorageSync('userInfo');
				//技术员准备方案005节点 提供申请配件按钮
				if (['b1a32087297f4b05bc7e33a9bac72f95', '1079e231e5744d42a37a967e1d6379ef',
						'297f847f09184ca48155f9824a38cff8', '1038ebd81c81416a88f30b8203806c3e'
					].includes(this.detail.dqjdid)) {
					this.fabFlag = true
					this.applyPart = true
				}
				//工程师施工准备006节点 提供领取配件按钮
				if (['de8a27674e604fe29e47257392b630d1', '22fdfc49fcb74f5f817ef7562e911571',
						'b9cd86f9291140208d89994fb26e15fd', '4171cc0362c347be89409af042d27c38'
					].includes(this.detail.dqjdid)) {
					this.fabFlag = true
					this.receivePart = true
				}

				if (this.detail.xcwgsczp && this.detail.xcwgsczp.includes('filePath')) {
					this.detail.xcwgsczp = JSON.parse(this.detail.xcwgsczp)
					this.detail.xcwgsczp.forEach(item => {
						item.filePath = `${this.config.url}${item.filePath}`
					})
				}
				const transitionId = res.result.workitemData ? res.result.workitemData.transition_id : ''
				this.transitionId = transitionId
				globalData.order = res.result
				this.loglist = res.result.logData
				// 判断工单办理流程
				const staArr = [
					//维保/大修改造/故障处理/新机安装/故障处理  在008节点009节点 打卡出发、到达打卡 都需要显示地图定位信息
					'ebebce568df94ed69f9c7c4345ff930f', 'd55a5fb892f941be9a0b3a27405d6835',
					'56be4f3f0ca64fa180278abf14d099d0', 'dea9b11aa3964510b83d0cc38f316106',
					'b60d76526a4845488a57b91ff27142df', 'ae8e3fdffb944f1db968e05a32c5b4d3',
					'aafe0bc2b41d45408b799e1aa0c368b4', 'ae149b8605a94ad58f778f10dc99c7f1'
				]
				this.status = 0
				if (staArr.includes(transitionId)) {
					this.status = 1
				}
				// 判断哪个数据表单
				const workflowId = res.result.workitemData ? res.result.workitemData.workflow_id : ''
				const workObj = {
					'7da0996c5a39882e02fd34a09e39c026': 'crm_xjaz'
				}
				globalData.order.subKey = workObj[workflowId] || ''
				if (res.result.orderData && res.result.orderData.lczt && res.result.orderData.lczt.includes(
						'打卡')) {
					this.detail.khdz = `${this.detail.ssq} ${this.detail.xxdz}`
					let ssq
					if (this.detail.ssq) {
						ssq = this.detail.ssq.replace('/\//g', '')
					}
					const adress = `${ssq}${this.detail.xxdz}`
					this.$u.post(`/app/WorkOrder/getlocaltion?address=${adress}`).then(res => {
						const result = res.result
						globalData.khdz = result
						this.covers.push({
							id: 0,
							latitude: result.lat,
							longitude: result.lng,
							iconPath: '/static/image/target.png',
							width: 20,
							height: 20,
							label: {
								content: '客户地址',
								color: '#ff0000'
							}
						})
						this.circles = [{
							latitude: result.lat,
							longitude: result.lng,
							fillColor: '#55aaff33',
							radius: 3000,
							color: '#fff',
						}]
					})
					qqmapsdk = new QQMapWX({
						key: 'KV7BZ-K4BCP-R2GD4-LJQCX-5YNUS-CUFR6'
					})
					this.getLocation()
				}
				if (this.status === 0) {
					this.getTableText()
				}
			})
		},
		onShow() {
			if (getApp().globalData.isTableShow) {
				//数据窗口的表格数据
				this.getTableText()
				//各类信息表 子表的表格数据
				this.dataForm.sortOrder = 'ascend'
				this.dataForm.relation.key = 'slid'
				this.dataForm.relation.val = this.slid
				this.dataForm.tplviewid = '32fada055c87eaec523d56f81191c859'
				this.isOnReachBottom = true
				this.getDataList()
				getApp().globalData.isTableShow = false
			}
			if (getApp().globalData.fxgcs) {
				let list = getApp().globalData.fxgcs.map(item => item.xm)
				this.fxgcs = list.join('/')
			}
		},
		onUnload() {
			getApp().globalData.fxgcs = ''
		},
		methods: {
			openTable(tableItem) {
				let globalData = getApp().globalData
				globalData.formData = tableItem
				uni.navigateTo({
					url: `/pages/order/HandleOrder/tableText`
				})
			},
			preview(filePath) {
				console.log('filePath', filePath)
				let imgs = []
				imgs.push(this.config.url + filePath)
				uni.previewImage({
					urls: imgs
				});
			},
			// 搜索栏
			onsearch(e) {
				let currentIndex = this.current
				this.dataForm.searchString = {}
				if (currentIndex === 2) { //施工人员信息
					this.dataForm.searchString.gcsxm = e
				} else if (currentIndex === 3) { //证书信息
					this.dataForm.searchString.gcsxm = e
				} else if (currentIndex === 4) { //车辆信息
					this.dataForm.searchString.cph = e
				}
				this.getDataList()
			},
			goGuide(jzxh) {
				let num = jzxh.slice(0, 3)
				uni.navigateTo({
					url: `/pages/modules/reportingGuidelines/guideBook?jzxh=${num}`
				})
			},
			getTableText() {
				let globalData = getApp().globalData
				const {
					orderDetail
				} = globalData
				const paramsData = {
					transition_id: this.transitionId,
					slid: orderDetail.slid
				}
				this.$u.post('/crm/Order/queryTransitionFormsetData', paramsData).then(res => {
					this.tableTextData = res.result.data
					// globalData.isTableShow = false
				})
			},
			onChange(e) {
				//索引值 0开始
				this.current = e
				this.dataForm.searchString = {}
				this.isOnReachBottom = false
				this.dataForm.sortOrder = 'descend'
				this.initial.apiName = '/admin/UserTable/init'
				switch (e) {
					case 1:
						// 流程日志 初始化u-read-more按钮
						this.$nextTick(() => {
							this.$refs.uReadMore.init()
						})
						break;
					case 2: //施工人员信息表
						this.dataForm.relation.key = 'glgdbh'
						this.dataForm.relation.val = this.detail.gdbh
						this.dataForm.tplviewid = 'daf119df5607b26f15870f2780ab70ba'
						this.isOnReachBottom = true
						this.initial.apiName = '/crm/Order/sgryxx'
						this.getDataList()
						break;
					case 3: //证书信息表
						this.dataForm.relation.key = 'gcsxm'
						this.dataForm.relation.val = this.detail.zxgcs
						this.dataForm.tplviewid = '224ee2cd91d9005470fc22768ce2af19'
						this.isOnReachBottom = true
						this.getDataList()
						break;
					case 4: //车辆信息表
						this.dataForm.relation.key = 'glgdbh'
						this.dataForm.relation.val = this.detail.gdbh
						this.dataForm.tplviewid = '13e87166c230f4f8c224443651012e5d'
						this.isOnReachBottom = true
						this.getDataList()
						break;
					case 5: //配件领取明细
						this.dataForm.relation.key = 'glgddh' //关联工单单号 gd
						this.dataForm.relation.val = this.detail.gdbh
						this.dataForm.tplviewid = '3987236172bf79b30c49697ef77f42ff'
						this.isOnReachBottom = true
						this.getDataList()
						break;
					case 6: //出发到达表
						this.dataForm.relation.key = 'glgdbh' //编号 bd
						this.dataForm.relation.val = this.detail.gdbh
						this.dataForm.tplviewid = 'b2b3606e601d0ae9de9c04214b98970b'
						this.isOnReachBottom = true
						this.getDataList()
						break;
					case 7: //方案表
						this.dataForm.relation.key = 'glgdbh'
						this.dataForm.relation.val = this.detail.gdbh
						this.dataForm.tplviewid = '006536a23cba660495ebee4cd43ce57d'
						this.isOnReachBottom = true
						this.getDataList()
						break;
					case 8: //各类信息表
						this.dataForm.sortOrder = 'ascend'
						this.dataForm.relation.key = 'slid'
						this.dataForm.relation.val = this.slid
						this.dataForm.tplviewid = '32fada055c87eaec523d56f81191c859'
						this.isOnReachBottom = true
						this.getDataList()
						break;
					case 9: //上传图片表
						this.dataForm.relation.key = 'glgdbh'
						this.dataForm.relation.val = this.detail.gdbh
						this.dataForm.tplviewid = '7799943234ba32195be6b3207810d8ce'
						this.isOnReachBottom = true
						this.getDataList()
						break;
				}
			
			},
			//以上新增
			clickFab() {
				if (this.applyPart) {
					//申请配件
					let relationOrder_id = this.detail.gdbh
					uni.navigateTo({
						url: `/pages/parts/addParts?relationOrder_id=${relationOrder_id}&pageType=parts`
					})
				} else {
					//领取配件
					uni.switchTab({
						url: '/pages/parts/parts'
					})
				}

			},
			// 获取当前地址
			getLocation() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (res) => {
						console.log('当前位置信息', res)
						this.latitude = res.latitude || 39.909
						this.longitude = res.longitude || 116.39742
						let globalData = getApp().globalData
						const jwd = `${this.latitude},${this.longitude}`
						globalData.jwd = `${this.longitude},${this.latitude}`
						qqmapsdk.reverseGeocoder({
							location: jwd,
							success: (res) => {
								globalData.dkdz = res.result.address
								this.ch_address = globalData.dkdz
							}
						})
						this.covers.push({
							id: 1,
							latitude: res.latitude,
							longitude: res.longitude,
							width: 20,
							height: 20,
							iconPath: '/static/image/current.png',
							label: {
								content: '当前地址',
								color: '#1296db',
							}
						})
					},
					fail(error) {
						uni.showToast({
							title: '当前地址获取失败，请检查确认是否开启了位置信息权限',
							icon: 'none'
						});
					}
				})
			},
			//打电话
			makePhoneCall(phone) {
				uni.makePhoneCall({
					phoneNumber: phone,
					success: () => {}
				});
			},
			goTo(value) {
				uni.navigateTo({
					url: `./HandleOrder/finishStep?key=${value}`
				})
			},
			// 显示邀请码
			showPop() {
				this.$u.post('/crm/ApiInvite/getCode/', {
					gdbh: this.detail.gdbh
				}).then(res => {
					if (res.code === 0) {
						this.popShow = true
						this.yqm = res.result && res.result.yqm
						this.yqmStatus = res.result.syzt == 1 ? '已使用' : '未使用'
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	/deep/.u-time-axis {
		&::before {
			//设置时间轴的左边线
			left: 28rpx !important;
		}
	}

	.sgryxx {
		view {
			line-height: 30rpx;
		}

		text {
			font-size: 16rpx;
		}
	}

	/deep/.tagClass {
		.u-size-mini {
			font-size: 20rpx;
		}
	}

	//以上新增*******************
	.box {
		padding-bottom: 80rpx;
	}

	.node {
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		margin-right: -56rpx;
	}

	.color_blue {
		background-color: #2979ff;
	}

	.color_gray {
		background-color: #c0c4cc;
	}

	.log-content {
		margin-left: -56rpx;
	}

	/deep/.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	//底部提交按钮
	.footer {
		position: fixed;
		z-index: 1000;
		width: 100%;
		bottom: 0;
		margin: auto;
		color: #a1a1a1;
		text-align: center;
		line-height: 100rpx;
	}

	// 弹窗内容样式
	.pop_box {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.pop_title {
		width: 100%;
		margin-top: 32rpx;
		font-size: 32rpx;
		text-align: center;
		font-weight: 550;
	}

	.pop_content {
		margin-top: 48rpx;
		font-size: 50rpx;
		letter-spacing: 8rpx;
		color: #28beca;
		text-align: center;
	}

	.pop_footer {
		margin-top: 16rpx;
		color: #666;
		text-align: center;
	}
</style>
