<template>
	<view class="all-container">
		<view v-if="!pageType && !showComplate && showMap">
			<!-- && role == 'sf'-->
			<map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
		</view>

		<!-- 配件申请单详情页面 -->
		<block v-if="pageType && !showComplate">
			<u-card title="配件申请工单信息" :body-style="{padding: '0rpx 32rpx'}">
				<u-form slot="body">
					<u-form-item label="配件申请单号 " label-width="200rpx">
						<view class="u-content-color">{{formParts.gdbh}}</view>
					</u-form-item>
					<u-form-item label="工单类型" label-width="200rpx">
						<view class="u-content-color">{{formParts.gdlx}}</view>
					</u-form-item>
					<u-form-item label="创建人" label-width="200rpx">
						<view class="u-content-color">{{formParts.cjr}}</view>
					</u-form-item>
					<u-form-item label="创建时间" label-width="200rpx">
						<view>{{formParts.cjsj}}</view>
					</u-form-item>
					<u-form-item label="收件地址" label-width="200rpx">
						<view class="u-line-2">{{addressnNme}}</view>
					</u-form-item>
					<u-form-item label="网点可用额度" label-width="200rpx">
						<view>{{formParts.kyed}}</view>
					</u-form-item>
				</u-form>
			</u-card>
			<u-card :body-style="{padding: '0rpx 32rpx'}">
				<view slot="head" class="u-flex u-flex-1 u-row-between">
					<view class="u-font-15">配件申请明细</view>
					<u-icon name="plus-circle-fill" color="#007AFF" size="45" @click="go_addParts"></u-icon>
				</view>
				<view class="body_content clearScrollBar" slot="body">
					<view class="u-flex u-border-bottom u-p-t-24 u-p-b-32" v-for="(item,index) in apiOptionParts.details" :key="index">
						<u-image :src="item.pjtp" width="180rpx" height="180rpx"></u-image>
						<view class="u-m-l-10 u-flex-1">
							<u-row>
								<u-col span="5">
									<view class="u-p-t-10 u-p-b-12 u-p-l-10 u-main-color u-line-1">{{item.pjmc}}</view>
								</u-col>
								<u-col span="7">
									<view class="u-text-right">
										<u-number-box v-model="item.sqsl" @change="valChange(item,index)"></u-number-box>
									</view>
								</u-col>
							</u-row>
							<u-row>
								<u-col span="4">
									<view class="u-content-color u-text-right">配件编号：</view>
								</u-col>
								<u-col span="8">
									<view class="u-main-color u-flex-1 u-line-2">{{item.glpjbh}}</view>
								</u-col>
							</u-row>
							<u-row>
								<u-col span="4">
									<view class="u-content-color u-text-right">配件型号：</view>
								</u-col>
								<u-col span="8">
									<view class="u-main-color u-flex-1 u-line-2">{{item.pjxh}}</view>
								</u-col>
							</u-row>
							<u-row>
								<u-col span="4">
									<view class="u-content-color u-text-right">单价：</view>
								</u-col>
								<u-col span="8">
									<view class="u-main-color u-flex-1 u-line-1">{{item.price}}</view>
								</u-col>
							</u-row>
							<u-row>
								<u-col span="4">
									<view class="u-content-color u-text-right">网点库存：</view>
								</u-col>
								<u-col span="8">
									<view class="u-main-color u-flex-1 u-line-1">{{item.kysl}}</view>
								</u-col>
							</u-row>
						</view>

					</view>
					<view class="u-m-t-20 u-m-b-20 u-flex u-row-right"><text>总计：</text><text class="u-type-error">￥{{apiOptionParts.data.pjzje}}</text></view>
				</view>
			</u-card>
			<u-card title="办理方式" :body-style="{padding: '0rpx 32rpx'}">
				<u-form :model="form" ref="uForm" slot="body">
					<u-form-item label="办理方式" label-width="200">
						<u-radio-group v-model="valueActivedParts" :wrap="true">
							<u-radio :key="index" v-for="(item, index) in listWayDataParts" :name="item.way" :disabled="false" @change="radioChangeParts(item,index)">
								<view style="color: #303133;font-size: 28rpx;">{{item.way}}</view>
							</u-radio>
						</u-radio-group>
					</u-form-item>

					<u-form-item label="发货方式" label-width="200rpx">
						<u-input class="u-flex-1" placeholder="请选择" v-model="fhfsLable" type="select" :border="false" @click="fhfsClick" />
						<u-select v-model="showfhfs" :list="fhfsList" @confirm="confirmfhfs"></u-select>
					</u-form-item>
					<u-form-item v-if="role == 'fzr' && wdjb == '一级网点'" label="付款方式" label-width="200rpx">
						<u-input class="u-flex-1" placeholder="请选择" v-model="fkfsLable" type="select" :border="false" @click="fkfsClick" />
						<u-select v-model="showfkfs" :list="fkfsList" @confirm="confirmfkfs"></u-select>
					</u-form-item>

					<u-form-item label="办理备注" label-width="200">
						<u-input type="textarea" v-model="apiOptionParts.handleRemarks" :border="true" style="width: 100%;" />
					</u-form-item>
				</u-form>

			</u-card>
			<!-- <u-collapse :accordion="false">
				<u-collapse-item :open="true">
					<view slot="title">
						<view class="head_content">
							<view class="title">配件申请工单信息</view>
						</view>
					</view>
					<view class="body_content">
						<u-form>
							<u-form-item label="配件申请单号 " label-width="200rpx">
								<view class="u-content-color">{{formParts.gdbh}}</view>
							</u-form-item>
							<u-form-item label="工单类型" label-width="200rpx">
								<view class="u-content-color">{{formParts.gdlx}}</view>
							</u-form-item>
							<u-form-item label="创建人" label-width="200rpx">
								<view class="u-content-color">{{formParts.cjr}}</view>
							</u-form-item>
							<u-form-item label="创建时间" label-width="200rpx">
								<view>{{formParts.cjsj}}</view>
							</u-form-item>
							<u-form-item label="收件地址" label-width="200rpx">
								<view class="u-line-2">{{addressnNme}}</view>
							</u-form-item>
						</u-form>
					</view>
				</u-collapse-item>
				<u-gap></u-gap>
				<u-collapse-item :open="true">
					<view slot="title" style="width: 100%;">
						<view class="head_content" style="display: flex;justify-content: space-between;align-items: center;">
							<view class="title">配件申请明细</view>
							<u-icon name="plus-circle-fill" color="#007AFF" size="45" @click="go_addParts"></u-icon>
						</view>
					</view>
					<view class="body_content clearScrollBar">
						<view class="u-flex u-border-bottom u-p-t-32 u-p-b-32" v-for="(item,index) in apiOptionParts.details" :key="index">
							<u-image :src="item.pjtp" width="180rpx" height="180rpx"></u-image>
							<view class="u-m-l-20 u-flex-1">
								<view class="u-flex u-col-top u-row-between">
									<view class="u-main-color">{{item.pjmc}}</view>
									<u-number-box v-model="item.sqsl" @change="valChange(item,index)"></u-number-box>
								</view>
								<view class="u-flex u-col-top u-flex-1">
									<view class="u-content-color u-text-right" style="width: 140rpx;">配件编号：</view>
									<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.glpjbh}}</view>
								</view>
								<view class="u-flex u-col-top u-flex-1">
									<view class="u-content-color u-text-right" style="width: 140rpx;">配件型号：</view>
									<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.pjxh}}</view>
								</view>
								<view class="u-flex u-col-top u-flex-1">
									<view class="u-content-color u-text-right" style="width: 140rpx;">单价：</view>
									<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.price}}</view>
								</view>
								<view class="attribute u-flex u-row-between">
									<view class="u-flex u-col-top u-flex-1">
										<view class="u-content-color u-text-right" style="width: 140rpx;">网点库存：</view>
										<view class="u-m-l-8 u-main-color u-flex-1 u-line-2">{{item.kysl}}</view>
									</view>
								</view>

							</view>


						</view>
						<view class="u-m-t-20 u-m-b-20 u-flex u-row-right"><text>总计：</text><text class="u-type-error">￥{{apiOptionParts.data.pjzje}}</text></view>

					</view>
				
				</u-collapse-item>
				<u-gap></u-gap>
				<u-collapse-item :open="true">
					<view slot="title">
						<view class="head_content">
							<view class="title">工单办理</view>
						</view>
					</view>
					<view class="body_content clearScrollBar">
						<u-form :model="form" ref="uForm">
							<u-form-item label="办理方式" label-width="200">
								<u-radio-group v-model="valueActivedParts" :wrap="true">
									<u-radio :key="index" v-for="(item, index) in listWayDataParts" :name="item.way" :disabled="false" @change="radioChangeParts(item,index)">
										<view style="color: #303133;font-size: 28rpx;">{{item.way}}</view>
									</u-radio>
								</u-radio-group>
							</u-form-item>

							<u-form-item label="发货方式" label-width="200rpx">
								<u-input class="u-flex-1" placeholder="请选择" v-model="fhfsLable" type="select" :border="false" @click="fhfsClick" />
								<u-select v-model="showfhfs" :list="fhfsList" @confirm="confirmfhfs"></u-select>
							</u-form-item>
							<u-form-item v-if="role == 'fzr' && wdjb == '一级网点'" label="付款方式" label-width="200rpx">
								<u-input class="u-flex-1" placeholder="请选择" v-model="fkfsLable" type="select" :border="false" @click="fkfsClick" />
								<u-select v-model="showfkfs" :list="fkfsList" @confirm="confirmfkfs"></u-select>
							</u-form-item>

							<u-form-item label="办理备注" label-width="200">
								<u-input type="textarea" v-model="apiOptionParts.handleRemarks" :border="true" style="width: 100%;" />
							</u-form-item>
						</u-form>
					
					</view>
				</u-collapse-item>
			</u-collapse> -->

		</block>
		<!-- 工单详情页面 -->
		<block v-if="!pageType && !showComplate">

			<u-card title="工单基础信息" :body-style="{padding: '0rpx 32rpx'}">
				<u-form slot="body">
					<u-form-item label="工单编号" label-width="170rpx">
						<view>{{form.gdbh}}</view>
						<u-tag v-if="form.jjcd" :text="form.jjcd" mode="plain" color="red" style="white-space: nowrap" />
					</u-form-item>
					<u-form-item label="服务项目" label-width="170rpx">
						<view>{{form.fuwu_xm}}</view>
					</u-form-item>
					<u-form-item label="工单状态" label-width="170rpx">
						<view>{{form.lczt}}</view>
					</u-form-item>
					<u-form-item label="产品名称" label-width="170rpx">
						<view>{{form.cpmc}}</view>
					</u-form-item>
					<u-form-item label="产品品类" label-width="170rpx">
						<view>{{form.chanpin_fl}}</view>
					</u-form-item>
					<u-form-item label="产品型号" label-width="170rpx" v-if="form.cpxh">
						<view>{{form.cpxh}}</view>
						<u-icon name="file-text" color="#2979ff" size="50" @click="copy"></u-icon>
					</u-form-item>
					<u-form-item label="期望时间" label-width="170rpx">
						<view>{{form.qwsmsj}}</view>
					</u-form-item>
					<u-form-item label="出厂编码" label-width="170rpx" v-if="form.snm">
						<view>{{form.snm}}</view>
					</u-form-item>
					<u-form-item label="联系人" label-width="170rpx">
						<view>{{form.gdlxr}}</view>
					</u-form-item>
					<u-form-item label="联系电话" label-width="170rpx" v-if="form.gdlxdh">
						<view>{{form.gdlxdh}}</view>
						<u-button type="primary" size="mini" @click="makePhoneCall(form.gdlxdh)">拨打</u-button>
					</u-form-item>
					<!-- <u-form-item label="客户电话2" label-width="170rpx" v-if="form.khdh2">
						<view>{{form.khdh2}}</view>
						<u-button type="primary" size="mini" @click="makePhoneCall(form.khdh2)">拨打</u-button>
					</u-form-item> -->
					<u-form-item label="联系地址" label-width="170rpx">
						<view>{{form.azssq + form.azxxdz}}</view>
					</u-form-item>
					<u-form-item label="问题描述" label-width="170rpx">
						<!-- v-if="!showYwg"-->
						<block v-if="form.yhfkwt">
							<view>{{form.yhfkwt}}</view>
						</block>
						<block v-else>
							<u-input style="width: 100%;" placeholder="请输入问题描述" type="textarea" :border="true" v-model="problemDesc"></u-input>
						</block>
					</u-form-item>
				</u-form>


			</u-card>
			<u-card title="工单办理" v-if="OrderStatus != 'ywg' &&  listWayData.length > 0">
				<u-form slot="body">
					<u-form-item label="办理方式" label-width="200rpx">
						<!--办理方式1-->
						<u-radio-group :wrap="true">
							<block v-for="(item, index) in listWayData" :key="item.way">
								<u-radio :key="index" v-if="item.show" :name="item.way" :disabled="false" @change="radioChangeWork(item,index)">
									<view style="color: #303133;font-size: 28rpx;">{{item.way}}</view>
								</u-radio>
							</block>
						</u-radio-group>
					</u-form-item>
					<!-- 接收并派送师傅 -->
					<block v-if="showPaiShiFu">
						<u-form-item label="师傅姓名" label-width="200rpx" :required="true">
							<u-input style="width: 100%;" placeholder="请选择师傅" v-model="shifuValue" type="select" :border="false" @click="clickSelectShiFu" />
						</u-form-item>
					</block>
					<!-- 网点负责人办理工单 办理方式选择师傅弹框 -->
					<u-popup v-model="showSelectPaiShiFu" mode="center" border-radius="16" height="50%" width="75%">
						<view class="u-text-center u-p-t-32">选择师傅</view>
						<view class="u-p-t-32">
							<view v-for="(item,index) in shifuList" :key="index">
								<u-cell-group>
									<u-cell-item :title="item.sfxm" :label="item.sfdh" value="选择" @click="sureSelectShiFu(item)">
										<u-image width="80rpx" height="80rpx" :src="item.gkzp" v-if="item.gkzp" class="u-m-r-20"></u-image>
									</u-cell-item>
								</u-cell-group>
							</view>
						</view>
					</u-popup>

					<!-- 工单办理方式里面的类型 -->
					<u-form-item :label="subItem.name" label-width="200rpx" v-for="(subItem,subIndex) in apiForm.rule" :key="subIndex"
					 :required="true">
						<!-- 日期时间类型控件 -->
						<block v-if="subItem.formtype == 'datetime'">
							<u-input style="width: 100%;" placeholder="请选择日期" v-model="apiOption.appointmentDate" type="select" :border="false"
							 @click="showDate = true" />
							<u-picker mode="time" v-model="showDate" :params="params" @confirm="confirm"></u-picker>
						</block>
						<!-- combobox select多列选择控件 -->
						<block v-if="subItem.formtype == 'combobox'">
							<u-input style="width: 100%;" placeholder="请选择" v-model="comboboxLabel" type="select" :border="false" @click="showReturn = true" />
							<u-action-sheet :list="returnSheetList" v-model="showReturn" @click="returnSheetCallback"></u-action-sheet>
						</block>
						<!-- text 输入框控件 -->
						<block v-if="subItem.formtype == 'text'">
							<u-input style="width: 100%;" placeholder="请输入" v-model="valueResult" :border="true" @click="showResult = true" />
							<!-- <u-action-sheet :list="actionSheetList" v-model="showResult" @click="actionSheetCallback"></u-action-sheet> -->
						</block>
					</u-form-item>

					<u-form-item label="办理备注" label-width="200rpx">
						<!--办理备注1-->
						<u-input type="textarea" :border="true" class="u-flex-1" v-model="apiOption.handleRemarks" />
					</u-form-item>
				</u-form>
			</u-card>
			<u-card title="工单日志">
				<view slot="body">
					<loglistTimeLine :loglist="loglist"></loglistTimeLine>
				</view>
			</u-card>
		</block>
		<view style="position: fixed; bottom: 110rpx; right: 40rpx; z-index: 1500;" @click="clickFab" v-if="showBtn">
			<u-icon name="plus-circle-fill" size="120" class="u-type-primary"></u-icon>
		</view>
		<view class="footer" v-if="!showComplate">
			<!-- &&  !showYwg-->
			<!-- throttle-time 节流的时间间隔(一定时间内无论点击多少次，多少秒内只会触发一次click事件) -->
			<!--配件申请提交-->
			<u-button type="primary" throttle-time="2500" v-if="pageType && !showComplate" @click="submitParts">提交</u-button>
			<!--工单办理提交-->
			<u-button type="primary" throttle-time="2500" v-if="!pageType && !showComplate &&OrderStatus != 'ywg' && listWayData.length > 0"
			 @click="submit">提交</u-button>
		</view>
		<!-- 完工服务页面 -->
		<block v-if="showComplate">
			<view style="background: white;">
				<view class="u-padding-top-30">
					<u-steps :list="numList" :current="stepCurrent" mode="number"></u-steps>
				</view>
				<!-- 完善产品 -->
				<view v-if="stepCurrent == 0" class="u-padding-30">
					<u-form>
						<u-form-item label="出厂编码" label-width="200rpx">
							<u-input placeholder="请输入MA-开头的数字" @input="btnAClick($event)" v-model="formComplate.snm" style="width: 100%;"></u-input>
							<u-icon name="scan" color="#2979ff" size="50" @click="scan" class="u-margin-left-20"></u-icon>
						</u-form-item>
						<u-form-item label="产品名称" label-width="200rpx">
							<u-input :custom-style="formComplateStyle" style="width: 100%;" v-model="formComplate.cpmc" disabled></u-input>
							<u-icon name="arrow-right" color="#2979ff" size="36" @click="selectProduct" class="u-margin-left-20"></u-icon>
						</u-form-item>
						<u-form-item label="产品品类" label-width="200rpx">
							<u-input :custom-style="formComplateStyle" style="width: 100%;" v-model="formComplate.chanpin_fl" disabled></u-input>
						</u-form-item>
						<u-form-item label="产品型号" label-width="200rpx">
							<u-input :custom-style="formComplateStyle" style="width: 100%;" v-model="formComplate.cpxh" disabled></u-input>
						</u-form-item>
						<u-form-item label="购买日期" label-width="200rpx">
							<u-input style="width: 100%;" placeholder="" v-model="formComplate.gmrq" disabled></u-input>
						</u-form-item>
						<u-form-item label="购买渠道" label-width="200rpx">
							<view v-if="formComplate.gmqd">{{_gmqd_}}</view>
						</u-form-item>
						<u-form-item label="质保期(月)" label-width="200rpx">
							<u-input :custom-style="formComplateStyle" style="width: 100%;" v-model="formComplate.bxszy" disabled></u-input>
						</u-form-item>
						<u-form-item label="默认质保期" label-width="200rpx">
							<u-input style="width: 100%;" placeholder="" v-model="formComplate.zbdqr"></u-input>
						</u-form-item>
						<u-form-item label="质保剩余天数" label-width="200rpx">
							<u-input :custom-style="formComplateStyle" style="width: 100%;" v-model="formComplate.zbsyts" disabled></u-input>
						</u-form-item>
					</u-form>
				</view>
				<!-- 用料明细 -->
				<view v-if="stepCurrent == 1" class="u-padding-30">
					<u-card margin="0">
						<view slot="head">
							<view class="head_content u-flex u-row-between u-col-center">
								<view class="title  u-flex-1">用料明细</view>
								<u-button type="primary" size="mini" @click="goAddPart">添加</u-button>
							</view>
						</view>
						<block v-if="apiOptionParts.details.length == '0'">
							<view slot="body">
								<u-empty text="暂无数据" mode="data" margin-top="40"></u-empty>
							</view>
						</block>
						<block v-if="apiOptionParts.details.length > 0">
							<view slot="body" class="partItem u-border-bottom u-padding-top-10 u-padding-bottom-20" v-for="(item,index) in apiOptionParts.details"
							 :key="index">
								<view class="u-flex u-col-top u-row-between">
									<text>{{item.pjmc}}</text>
									<u-number-box v-model="item.sqsl" @change="valChange"></u-number-box>
								</view>
								<view class="attribute">配件编号：{{item.glpjbh}}</view>
								<view class="attribute">
									<text>单价：{{item.price}}</text>
								</view>
								<view class="attribute u-flex u-row-between u-col-center">
									<text class="u-line-2  u-flex-1">配件型号：{{item.pjxh}}</text>
									<text style="color: #007AFF;">网点库存：{{item.kysl}}</text>
								</view>
								<view class="attribute  u-flex u-row-between u-col-center">
									<text>配件描述：{{item.pjgn}}</text>
								</view>
							</view>
						</block>
					</u-card>
				</view>
				<!-- 完工信息 安装单跟 维修和保养单 两种显示方式不同-->
				<!-- 安装单 -->
				<view v-if="stepCurrent === 2 && gdlx === '安装单'" class="u-padding-40">
					<u-form>
						<u-form-item label-width="200rpx" label="安装情况描述">
							<u-input type="textarea" v-model="handleInstallDesc" :border="true" style="width: 100%;" />
						</u-form-item>
						<u-form-item label-width="200rpx" :label="imgText">
							<u-upload @on-success="list1" :max-size="8 * 1024 * 1024" :max-count="4" :action="action" :name="filename"
							 :form-data="formData"></u-upload>
						</u-form-item>
						<u-form-item label-width="200rpx" label="备注">
							<u-input type="textarea" v-model="apiOptionParts.handleRemarks" :border="true" style="width: 100%;" />
						</u-form-item>
					</u-form>
				</view>
				<!-- 保养单和维修单  -->
				<view v-if="stepCurrent === 2 && gdlx !== '安装单'" class="u-padding-40">
					<u-form>
						<u-form-item label-width="200" label="是否故障">
							<view class="u-flex u-row-right u-flex-1">
								<u-switch v-model="checked"></u-switch>
							</view>
						</u-form-item>
						<u-form-item label-width="200" label="故障类别">
							<view class="u-flex u-row-between u-flex-1" @click="faultSelect">
								<view class="u-line-1" style="width: 430rpx;">{{faultValue}}</view>
								<u-icon name="arrow-right" color="#C1C1C1" size="36"></u-icon>
							</view>
						</u-form-item>
						<u-form-item label-width="200" label="服务措施">
							<u-input style="width: 100%;" placeholder=" " v-model="serverValue" type="select" :border="false" @click="showServer = true" />
							<u-action-sheet :list="serverSheetList" v-model="showServer" @click="serverSheetCallback"></u-action-sheet>
						</u-form-item>
						<u-form-item label-width="200" label="故障现象描述">
							<u-input type="textarea" v-model="handleInstallDesc" :border="true" style="width: 100%;" />
						</u-form-item>
						<u-form-item label-width="200" :label="imgText">
							<u-upload @on-success="list1" :max-size="8 * 1024 * 1024" :max-count="4" :action="action" :name="filename"
							 :form-data="formData"></u-upload>
						</u-form-item>
						<u-form-item label-width="200" label="备注">
							<u-input type="textarea" v-model="apiOptionParts.handleRemarks" :border="true" style="width: 100%;" />
						</u-form-item>
					</u-form>
				</view>
				<!-- 客户确认 -->
				<view v-if="stepCurrent == 3" class="u-padding-30">
					<u-card margin="0" title="账单明细" foot-border-top="false">
						<view slot="body">
							<u-modal v-model="showServerMoneyAdd" title="添加" show-cancel-button="true" @confirm="sureAddServerMoeny"
							 :content-style="{padding:'0 60rpx'}">
								<u-form>
									<u-form-item label-width="200" label="现场服务费">
										<u-input placeholder="请输入金额" v-model="serverMoney" @input="serverMoneyAdd"></u-input>
										<text>元</text>
									</u-form-item>
									<u-form-item label-width="200" label="备注">
										<u-input placeholder="请输入备注" v-model="serverMoneyRemark" @input="MoneyRemark"></u-input>
									</u-form-item>
								</u-form>
							</u-modal>
							<view class="partItem u-m-b-10  u-border-bottom u-padding-top-10 u-padding-bottom-10">
								<view class="u-m-b-10 u-flex u-row-between u-col-center">
									<text class="u-flex-1">现场服务费</text>
									<u-button type="primary" size="mini" @click="showServerMoneyAdd = !showServerMoneyAdd">添加</u-button>
								</view>
								<view class="u-m-b-10  u-flex u-row-between u-col-center">
									<text>{{serverMoneyRemark}}</text>
									<text style="color: red;">￥ {{serverMoney}}</text>
								</view>
							</view>
							<view class="partItem u-m-b-10  u-border-bottom u-padding-top-10 u-padding-bottom-10">
								<view class="u-m-b-10 u-flex u-row-between u-col-center">
									<text>标准工单费</text>
									<u-tag text="服务费" mode="plain" color="#2979ff" />
								</view>
								<view class="u-m-b-10  u-flex u-row-between u-col-center">
									<text>￥ 0</text>
									<text style="color: red;">￥ 0</text>
								</view>
							</view>
							<!-- 配件材料费 -->
							<view class="partItem u-m-b-10  u-border-bottom u-padding-top-10 u-padding-bottom-10" v-for="(item,index) in apiOptionParts.details"
							 :key="index">
								<view class="u-m-b-10 u-flex u-row-between u-col-center">
									<text>{{item.pjmc}}</text>
									<u-tag text="材料费" mode="plain" color="#2979ff" />
								</view>
								<view class="u-m-b-10  u-flex u-row-between u-col-center">
									<text>￥ {{item.price}}</text>
									<text>x{{item.sqsl}}</text>
									<text style="color: red;">￥ {{item.indexPrice}}</text>
								</view>
							</view>
						</view>
						<view slot="foot" class="u-flex u-row-right">
							<text class="u-m-r-50 u-main-color">应收合计：</text>
							<text style="color: red;">￥ {{allPrice}}</text>
						</view>
					</u-card>
					<u-gap></u-gap>
					<u-card margin="0" title="客户签名">
						<view v-if="!signNameImgSrc" slot="body" class="u-flex u-row-center u-col-center u-m-t-60 u-m-b-60" @click="goqianming">
							点击进入手写签名版
						</view>
						<u-image v-else slot="body" :src="signNameImgSrc" width="100%" height="220rpx"></u-image>
					</u-card>
				</view>
				<!-- 级联组件 故障类别-->
				<u-select v-model="showSelect" mode="mutil-column-auto" child-name="children" value-name="value" label-name="label"
				 :list="listSelect" @confirm="confirmSelect"></u-select>
			</view>
			<view style="width: 100%;display: flex;position: fixed;bottom: 0;z-index: 1000;">
				<u-button v-if="stepCurrent == 0" type="primary" style="width: 50%;" :custom-style="customStyle" @click='goback'>返回</u-button>
				<u-button v-if="stepCurrent > 0 || stepCurrent == (numList.length-1)" type="primary" style="width: 50%;"
				 :custom-style="customStyle" @click='prevStep'>上一步</u-button>
				<u-button type="success" style="width: 50%;" :custom-style="customStyle" v-if="stepCurrent !== (numList.length-1)"
				 @click='nextStep'>下一步</u-button>
				<u-button type="success" style="width: 50%;" :custom-style="customStyle" v-if="stepCurrent > 0 && stepCurrent == (numList.length-1)"
				 @click='complate'>完成服务</u-button>
			</view>
		</block>
		<u-toast ref="uToast" />
	</view>
</template>
<script>
	import QQMapWX from '@/common/wxmap_sdk/qqmap-wx-jssdk.min.js' //引用js文件
	import uniFab from '@/pages/order/components/uni-fab/uni-fab.vue';
	import AdaPay from '@/common/adapay_sdk/adaPay.js'
	import loglistTimeLine from '@/components/loglistTimeLine.vue'
	export default {
		components: {
			uniFab,
			loglistTimeLine
		},
		data() {
			return {
				role: '', //角色
				wdjb: uni.getStorageSync('userInfo').userinfo.wdjb, //网点级别 一级网点 二级网点 
				//发货、付款方式
				fhfsLable: '', //发货方式显示label值 
				fkfsLable: '', //付款方式显示label值
				city: '', //选择完地址显示值
				showfhfs: false,
				showfkfs: false,
				fhfsList: uni.getStorageSync('fhfsListOption'), //发货方式list
				fkfsList: uni.getStorageSync('fkfsListOption'), //付款方式list
				//
				label_width: '200rpx',
				//网点负责人
				showPaiShiFu: false,
				shifuValue: '',
				showSelectPaiShiFu: false,
				shifuList: [], //获取师傅列表
				shifuForm: {},
				//
				signNameImgSrc: '', //签名图片
				//完工服务 保养单或维修单状态 完工信息内容显示逻辑
				pjmxIndexPrice: '', //配件总和 费用
				checked: false,
				showSelect: false,
				listSelect: [],
				faultValue: '',
				serverSheetList: [], //服务措施
				showServer: false,
				serverValue: '',
				gzlb: {
					yjgz: '',
					ejgz: '',
					sjgz: ''
				},
				gdlx: uni.getStorageSync('gdlx') || '',
				allPrice: '', //总应收合计
				serverMoney: 0,
				serverMoneyRemark: '',
				showServerMoneyAdd: false,
				//
				formComplateStyle: {
					width: '100%',
					paddingLeft: '10rpx'
				},
				OrderStatus: '',
				identicalData: true,
				showMap: false,
				showYwg: false,
				showBtn: false,
				apiForm: '',
				apiFormAll: '',
				imgLength: 0,
				imgText: '上传图片(0/4)',
				// 完工服务上传图片
				filename: 'headImage',
				formData: {
					'accept': 'image/*'
				},
				action: `${this.config.url}/admin/attachment/upload/?uploadName=headImage`,
				stepCurrent: 0, //后面调试完改为0
				customStyle: {
					borderRadius: '0',
				},
				//完工服务
				numList: [{
					name: '完善产品'
				}, {
					name: '添加用料'
				}, {
					name: '完工信息'
				}, {
					name: '客户确认'
				}],
				// 完成服务 显示 后面调试完 改为false
				showComplate: false,
				type: 'number',
				valInput: '0124',
				apiList: [], //上一页面 选择数量之后的数组
				relationOrder_id: '', //工单编号
				pattern: {
					buttonColor: '#2979ff'
				},
				//申请单明细列表
				list: [{
					name: '新云配件',
					number: '1545',
					price: '29',
					brand: '中国制造',
					utletsInventory: '3'
				}, {
					name: '测试配件',
					number: '1578',
					price: '17',
					brand: '新云',
					utletsInventory: '4'
				}, {
					name: '测试配件',
					number: '1578',
					price: '17',
					brand: '新云',
					utletsInventory: '4'
				}],
				//配件申请单基础信息
				formParts: {

				},
				addressnNme: '',
				// 上一页面进入类型 pageType值为parts表示配件申请进入
				pageType: '',

				//退回原因
				showReturn: false,
				comboboxLabel: "",
				comboboxApiVal: '',
				returnSheetList: [{
					text: '客户信息错误'
				}, {
					text: '客户取消上门'
				}, {
					text: '无法按客户要求时间上门'
				}, {
					text: '其他情况（请描述）'
				}],
				//预约失败原因
				showResult: false,
				valueResult: '',
				actionSheetList: [{
					text: '信息有误'
				}, {
					text: '打通电话未接通'
				}, {
					text: '打不通电话'
				}, {
					text: '其他情况'
				}],
				//改约原因
				showRenegotiation: false,
				renegotiationResult: '',
				renegotiationSheetList: [{
					text: '改约原因1'
				}, {
					text: '改约原因2'
				}, {
					text: '改约原因3'
				}, {
					text: '改约原因4'
				}],
				//改约时间
				showRenegotiationDate: false,
				renegotiationDateResult: '',
				showDate: false,
				covers: [{ //地图
					latitude: 39.909,
					longitude: 116.39742,
					// iconPath: '/static/location.png'
				}],
				latitude: '', //经度
				longitude: '', //纬度
				address: '', //详细地址
				show: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				listWayData: [],
				loglist: [],
				valueActivedParts: '',
				valueActiveAppointment: '预约成功', //待预约默认选中按钮
				valueActiveComplate: '退回工单', //待完工默认选中按钮
				listWayDataParts: [],
				noClick: true, //是否重复点击
				//表单输入项
				glkhbh: '', //关联客户编号
				_gmqd_: '', //购买渠道页面显示
				formComplate: {
					snm: '',
					warrantyTime: '12' //延保时长（天）
				},
				problemDesc: '',
				form: {},
				apiOption: { //工单列表 提交申请参数
					workitem_id: '',
					case_id: '',
					valueKey: '', //value对象的键值对里面的键key
					//预约日期选择
					appointmentDate: '',
					//办理备注
					handleRemarks: ''
				},
				apiOptionParts: { //配件申请提交 参数
					// case_id: '',
					details: [], //配件申请信息 数组
					handleWay: '', //办理方式名称 如 '提交申请'
					handleRemarks: '', //办理备注
					data: {
						pjzje: 0,
						pjzsl: 0
					} //接口返回的 data
				},
				handleInstallDesc: '', //师傅安装情况描述
				imgList: []
			}
		},
		onLoad(option) {
			if (!uni.getStorageSync('fhfsListOption')) {
				this.$u.post('/app/Setting/getjilianOption', {
					parent_number: 'fhfs'
				}).then(res => {
					uni.setStorageSync('fhfsListOption', res.result)
				})
			}
			if (!uni.getStorageSync('fkfsListOption')) {
				this.$u.post('/app/Setting/getjilianOption', {
					parent_number: 'fkfs'
				}).then(res => {
					uni.setStorageSync('fkfsListOption', res.result)
				})
			}
			let userInfo = uni.getStorageSync('userInfo')
			if (userInfo.userinfo.roleid == "a942fdfe5c81e07417d5f1eed98d027a") {
				//网点负责人
				this.role = 'fzr'
			} else {
				//师傅端
				this.role = 'sf'
			}

			//工单列表页进来
			if (option.case_id) {
				this.apiOption.workitem_id = option.workitem_id
				this.apiOption.case_id = option.case_id

				let state = option.OrderStatus
				this.OrderStatus = state
				if (state == 'dwg') {
					this.showMap = true
					this.getLocation() //获取位置信息
				}

				this.getWorkOrderInfo() //获取工单详情
			}
			this.relationOrder_id = option.relationOrder_id || ''
			if (option.apiList) {
				//上一页面 选择申请数量之后组成的数组 直接传接口参数details（配件申请信息 数组类型）
				this.apiOptionParts.details = JSON.parse(option.apiList)

				console.log(option, "option");
				this.apiOptionParts.data.pjzje = Number(option.pjzje).toFixed(2)
				this.apiOptionParts.data.pjzsl = Number(option.pjzsl)
			}
			//配件申请进来
			if (option.pageType) {
				this.pageType = option.pageType
				uni.setNavigationBarTitle({
					title: '配件申请单'
				});
				this.getPartsOrderInfo() //获取配件申请单详情
			}
			//完工服务选择完配件之后进来
			if (option.showComplate) {
				this.showComplate = true
				this.stepCurrent = 1
				this.formComplate.glcpbh = option.cpbh
			}

		},
		//完工步骤 产品选择产品之后 返回原页面
		onShow() {
			let img = uni.getStorageSync('signNameImg')
			if (img) {
				this.signNameImgSrc = this.config.url + img.result.filePath
			}
			let product = uni.getStorageSync('product')
			if (product) {
				let newData = Object.assign({}, product, {
					warrantyTime: '13'
				})
				let oldData = this.formComplate
				if (newData.glcpbh == oldData.glcpbh) {
					this.identicalData = true
					uni.setStorageSync('dataFalt', 0)
				} else {
					this.identicalData = false
					uni.setStorageSync('dataFalt', 1)
					this.formComplate = newData
					uni.setStorageSync('formComplate', newData)
					this.$store.commit('setFormComplate', newData)
				}
				this.$store.commit('setproduct', {})
				uni.removeStorageSync('product')
			} else if (uni.getStorageSync('dataFalt') == '0') {
				this.identicalData = true
			} else if (uni.getStorageSync('dataFalt') == '1') {
				this.identicalData = false
			} else {}
			//添加用料完 跳转回到该页面
			let oldformComplate = uni.getStorageSync('oldformComplate')
			if (oldformComplate) {
				this.formComplate = oldformComplate
				console.log(this.formComplate, "this.formComplatethis这里最终");
				uni.removeStorageSync('oldformComplate')
			}
		},
		methods: {
			getCityData() {
				this.showCity = true
				this.cityList = uni.getStorageSync('cityListOption')
			},
			confirmfhfs(e) {
				console.log(e)
				this.fhfsLable = e[0].label
				this.apiOptionParts.data.fhfs = e[0].value
			},
			confirmfkfs(e) {
				console.log(e)
				this.fkfsLable = e[0].label
				this.apiOptionParts.data.fkfs = e[0].value
				////////



			},
			fhfsClick() {
				this.showfhfs = true
				this.fhfsList = uni.getStorageSync('fhfsListOption')
			},
			fkfsClick() {
				this.showfkfs = true
				this.fkfsList = uni.getStorageSync('fkfsListOption')
			},
			//复制工单基础信息产品型号内容
			copy() {
				uni.setClipboardData({
					//准备复制的数据
					data: this.form.cpxh,
					success: function(res) {
						this.$u.toast("复制成功")
					}
				})
			},
			//选择师傅调用接口查询师傅列表
			clickSelectShiFu() {
				this.$u.post('/app/WdOrder/sfOption', {
					keyword: ''
				}).then(res => {
					this.shifuList = res.result

				})
				this.showSelectPaiShiFu = true
			},
			//确定选择师傅
			sureSelectShiFu(item) {
				console.log("fawefwae");
				this.showSelectPaiShiFu = false
				this.shifuForm = item
				this.shifuValue = item.sfxm
			},
			//确认添加服务费
			sureAddServerMoeny() {
				let serverMoney = this.serverMoney //金额
				let serverMoneyRemark = this.serverMoneyRemark //备注
				let pjmxIndexPrice = this.pjmxIndexPrice //配件总和费用
				this.allPrice = (Number(serverMoney) + Number(pjmxIndexPrice)).toFixed(2)
			},
			//签名页面
			goqianming() {
				uni.navigateTo({
					url: '/pages/order/complateWork' //signName
				});
			},
			//添加服务费
			serverMoneyAdd(e) {
				this.serverMoney = e
			},
			MoneyRemark(e) {
				this.serverMoneyRemark = e
			},
			//点击故障类别
			faultSelect() {
				this.showSelect = true

			},

			// 选择级联列表 故障类别 内容 点击确认后回调
			confirmSelect(e) {
				console.log(e);
				this.faultValue = `${e[0].label}/${e[1].label}/${e[2].label}`
				this.gzlb.yjgz = e[0].value
				this.gzlb.ejgz = e[1].value
				this.gzlb.sjgz = e[2].value
				let par = {
					gzlist: e
				}
				this.$u.post('/app/Setting/getfwcslist', par).then(res => {
					console.log(res);
					this.serverSheetList = []
					res.result.forEach((item, index) => {
						this.serverSheetList.push({
							text: item.value //lable
						})
					})
				})
			},
			//完工信息输入snm码校验
			btnAClick(e) { //防抖
				this.formComplate.snm = e
				this.$u.debounce(this.toNext, 1500)
			},
			toNext() {
				let val = this.formComplate.snm
				console.log(val);
				let paramsSNM = {
					snm: val,
					gdbh: this.formComplate.gdbh
				}
				this.$u.post('/app/Goods/authSnm', paramsSNM).then(res => {
					if (res.code === 1) { //不存在snm码 或者 该产品已经安装过，不能重新安装
						this.$u.toast(res.message)
						return
					}
					this.formComplate = Object.assign(res.result, {
						warrantyTime: ''
					})
					this._gmqd_ = res.result._gmqd_

				})
			},
			list1(data, index, lists) {
				console.log(lists)
				this.imgLength = index + 1
				this.imgText = `上传图片(${index+1}/4)`
				let imgList = []
				lists.forEach((item, index) => {
					imgList.push(item.response.result)
				})
				this.imgList = imgList
				uni.setStorageSync('formComplate', this.formComplate)
				uni.setStorageSync('ceshi', 123)
			},
			goAddPart() {
				uni.setStorageSync('oldformComplate', this.formComplate)
				let cpbh = this.formComplate.glcpbh
				console.log("this.formComplate");
				console.log(this.formComplate);
				uni.navigateTo({
					url: `/pages/order/addParts?complate=1&cpbh=${cpbh}`
				});
			},
			//完工页点击返回
			goback() {
				this.stepCurrent = 0
				this.showComplate = false

				this.apiForm = ''
			},
			//点击上一步
			prevStep() {
				this.stepCurrent -= 1
			},
			//点击下一步
			nextStep() {
				this.gdlx = uni.getStorageSync('gdlx')

				let length = this.numList.length - 1
				if (length > this.stepCurrent) {
					this.stepCurrent += 1
				}
				console.log(this.formComplate, "this.formComplate");
				console.log(this.apiOptionParts, "apiOptionParts");
				if (this.stepCurrent === 2) { //完工信息步骤
					//完工服务 保养单或维修单 的服务类别 联动数据
					let param = {
						chanpin_fl: this.formComplate._chanpin_fl_, //新增
					}
					this.$u.post('app/Setting/guzhangOptions', param).then(res => {
						this.listSelect = res.result
					})
				}
				if (this.stepCurrent === 3) {
					let pjmxIndexPriceList = []
					this.apiOptionParts.details.forEach((item, index) => {
						item.indexPrice = (item.price * item.sqsl).toFixed(2)
						// pjmxIndexPrice = this.apiOptionParts[index].indexPrice
						pjmxIndexPriceList.push(Number(item.indexPrice))
					})
					console.log(pjmxIndexPriceList);

					function sum(arr) {
						var s = 0;
						arr.forEach((val, idx, arr) => {
							s += val;
						}, 0);
						return s;
					};
					let pjmxIndexPrice = sum(pjmxIndexPriceList) //配件 所有费用
					this.pjmxIndexPrice = pjmxIndexPrice
					// let bzgdf = //标准工单费
					this.allPrice = pjmxIndexPrice.toFixed(2)
				}

			},
			//步骤页 点击完成服务按钮
			complate() {
				let pjsymx = []
				this.apiOptionParts.details.forEach((item, index) => {
					pjsymx.push({
						pjbh: item.glpjbh,
						sysl: item.sqsl
					})
				})
				let paramsId = this.$store.state.submitParamId

				//安装情况描述
				let sfjlgzxx = {
					sfjlgzxx: this.handleInstallDesc
				}
				//上传照片 数组
				let xcwgsczp = {
					xcwgsczp: this.imgList
				}

				//完工信息栏目参数
				//是否故障
				let sfgz;
				if (this.checked) {
					sfgz = {
						sfgz: 's'
					}
				} else {
					sfgz = {
						sfgz: 'f'
					}
				}
				//故障类别
				let yjgz = {
					yjgz: this.gzlb.yjgz
				}
				let ejgz = {
					ejgz: this.gzlb.ejgz
				}
				let sjgz = {
					sjgz: this.gzlb.sjgz
				}
				//服务措施
				let fwcs = {
					fwcs: this.serverValue
				}
				// 客户确认栏目参数
				//现场服务费
				let wxf = {
					wxf: Number(this.serverMoney)
				}
				//配件材料总和费
				let pjf = {
					pjf: this.pjmxIndexPrice
				}
				//应收合计
				let sfzj = {
					sfzj: this.allPrice
				}
				//客户签字图片
				let imgKh = uni.getStorageSync('signNameImg')
				if (!imgKh) {
					this.$u.toast("请先核实信息并签名")
					return
				}
				let khqz = {
					khqz: [{
						fileName: imgKh.result.fileName,
						filePath: imgKh.result.filePath
					}]
				}
				let values; //数据不同  values值插入最新的apiFormComplate 如果相同 则不插入
				let gdlx = uni.getStorageSync('gdlx')
				if (!this.identicalData) { //不相同
					let formComplate = this.$store.state.formComplate //uni.getStorageSync('formComplate')
					let apiFormComplate = {
						snm: formComplate.snm,
						cpmc: formComplate.cpmc,
						cpxh: formComplate.cpxh,
						chanpin_fl: formComplate._chanpin_fl_,
						cplb: formComplate.cplb,
						gmrq: formComplate.gmrq,
						gmqd: formComplate.gmqd,
						bxszy: formComplate.bxszy,
						zbdqr: formComplate.zbdqr,
						zbsyts: formComplate.zbsyts
					}
					if (gdlx == "安装单") { //工单类型安装单 无需传完工信息全部参数
						values = Object.assign({}, apiFormComplate, sfjlgzxx, xcwgsczp, wxf, pjf, sfzj, khqz)
					} else {
						values = Object.assign({}, apiFormComplate, sfjlgzxx, xcwgsczp, sfgz, yjgz, ejgz, sjgz, fwcs, wxf, pjf, sfzj,
							khqz) //Object.assign(this.formComplate,sfjlgzxx,xcwgsczp)
					}
					console.log("这里数据不一样")
				} else { //相同
					if (gdlx == "安装单") { //工单类型安装单 无需传完工信息全部参数
						values = Object.assign({}, sfjlgzxx, xcwgsczp, wxf, pjf, sfzj, khqz)
					} else {
						values = Object.assign({}, sfjlgzxx, xcwgsczp, sfgz, yjgz, ejgz, sjgz, fwcs, wxf, pjf, sfzj, khqz) //Object.assign(this.formComplate,sfjlgzxx,xcwgsczp)
					}
					console.log("这里数据一样")
				}
				uni.removeStorageSync('ceshi')
				uni.removeStorageSync('dataFalt')
				let params = {
					case_id: paramsId.case_id,
					workitem_id: paramsId.workitem_id,
					tableid: paramsId.tableid,
					id: paramsId.id,
					//以下 新改值
					handleWay: uni.getStorageSync('banlifangshi'), //this.apiForm.way
					values: values,
					handleRemarks: this.apiOptionParts.handleRemarks || '', //备注
					pjsymx: pjsymx //配件使用明细
				}
				console.log(params, '22222222222222222222222')
				//步骤页 点击完工服务按钮触发的事件
				// return
				this.$u.post('/app/WorkOrder/processing', params).then(res => {
					if (res.code === 0) {
						//完工服务逻辑
						this.$refs.uToast.show({
							title: '工单办理成功',
							type: 'success'
						})
						uni.setStorageSync('OrderStatusString', this.OrderStatus)
						// uni.setStorageSync('updateFalt', true)
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/order/index',
								success: function(e) {
									//返回页面 刷新
									let page = getCurrentPages().pop();
									if (page == undefined || page == null) return;
									page.onLoad();
								}
							})
						}, 1500)
					} else {
						this.$u.toast(res.message)
						return
					}

				}).catch()

			},
			valChange(item, index) {
				let price = 0
				let quantity = 0
				let that = this
				let detailes = that.apiOptionParts.details
				detailes.forEach(sItem => {
					price += parseFloat(Number(sItem.price) * sItem.sqsl)
					quantity += parseInt(sItem.sqsl)
				})
				this.apiOptionParts.data.pjzje = Number(price).toFixed(2) //配件申请总金额
				this.apiOptionParts.data.pjzsl = quantity //配件申请总数量
				//以下新增
				let allList = uni.getStorageSync('allNewList')
				allList.forEach((sitem, sindex) => {
					if (item.glpjbh == sitem.pjbh) {
						sitem.reworkNumber = item.sqsl
					}
				})
				uni.setStorageSync('allNewList', allList)
			},
			//配件申请数量修改
			changeValNum(e, bItem, index) {
				this.apiOptionParts.details[index].sqsl = Number(e)
			},
			//跳转回到选择配件列表界面 
			go_addParts() {
				uni.navigateBack({
					delta: 1
				})
			},
			//配件申请单详情 发起配件申请
			getPartsOrderInfo() {
				let data = {
					glgdbh: this.relationOrder_id || '',
					workflow_id: "721ed9f42695ca9fb37613c3cf9a5395"
				}
				this.$u.post('/app/WorkOrder/wcaseadd', data).then(res => {
					this.formParts = res.result.data //配件单基础信息
					this.addressnNme = res.result.data.cityname
					this.valueActivedParts = res.result.wayData[0].way
					this.listWayDataParts = res.result.wayData //配件单办理方式
					this.apiOptionParts.data = Object.assign(this.apiOptionParts.data, res.result.data)
					this.apiOptionParts.handleWay = res.result.wayData[0].way
				}).catch()
			},
			//服务工单详情
			getWorkOrderInfo() {
				// let url = this.role == 'sf' ? '/app/WorkOrder/HandleOrder' : '/app/WdOrder/HandleOrder'
				let url = '/app/WorkOrder/HandleOrder'
				this.$u.post(url, this.apiOption).then(res => {
					// if (res.result.OrderStatus == 'ywg') {
					// 	this.showYwg = true
					// }
					// if (res.result.data.lczt == '待客服处理') {
					// 	this.showYwg = true
					// }
					this.showBtn = res.result.showbtn
					console.log(res)
					let submitParamId = { //拼接后续提交服务单的所需参数id
						workitem_id: res.result.workitem_id,
						case_id: res.result.case_id,
						tableid: res.result.tableid,
						id: res.result.data.id,
					}
					this.$store.commit('setSubmitParamId', submitParamId)
					this.apiOption = submitParamId
					console.log(res.result.wayData, "res.result.wayData");
					this.apiFormAll = res.result.wayData
					// uni.setStorageSync('banlifangshi', res.result.wayData[0].way)
					this.listWayData = res.result.wayData //工单办理方式


					this.loglist = res.loglist //工单日志
					this.form = res.result.data //工单基础信息 
					this.formComplate = Object.assign(this.formComplate, res.result.data) //工单基础信息 完工步骤页显示信息 
					this._gmqd_ = res.result.data.gmqd //购买渠道
					this.glkhbh = res.result.data.glkhbh
					uni.setStorageSync('gdlx', res.result.data.gdlx) //工单类型
				}).catch()
			},
			//悬浮按钮点击事件
			clickFab() {

				let relationOrder_id = this.relationOrder_id
				uni.navigateTo({
					url: `/pages/order/addParts?relationOrder_id=${relationOrder_id}&pageType=parts`
				})
			},
			//服务措施列表点击回调
			serverSheetCallback(index) {
				this.serverValue = this.serverSheetList[index].text;
			},
			// 改约原因列表回调
			renegotiationSheetCallback(index) {
				this.renegotiationResult = this.renegotiationSheetList[index].text;
			},
			// 点击原因列表回调
			returnSheetCallback(index) {
				this.comboboxLabel = this.returnSheetList[index].text;
				this.comboboxApiVal = this.returnSheetList[index].value;
			},
			// 点击预约失败原因选择列表回调
			actionSheetCallback(index) {
				this.valueResult = this.actionSheetList[index].text;
			},
			makePhoneCall(phone) {
				//打电话
				uni.makePhoneCall({
					phoneNumber: phone,
					success: () => {
						console.log('成功拨打电话');
					}
				});
			},
			//跳转 选择产品列表页
			selectProduct() {
				let khbh = this.glkhbh
				uni.navigateTo({
					// url: `/pages/order/serviceCenter/basicService/reservationService/reservationServiceBrother?glkhbh=${khbh}`
					url: `/pages/order/principal/productInfo?khbh=${khbh}`
				});
			},
			//扫码
			scan() {
				let _this = this
				uni.scanCode({
					success: res => {
						this.formComplate.snm = res.result
						let paramsSNM = {
							snm: res.result,
							gdbh: this.formComplate.gdbh
						}
						console.log(paramsSNM);
						_this.$u.post('/app/Goods/authSnm', paramsSNM).then(response => {
							if (response.code === 1) { //不存在snm码 或者 该产品已经安装过，不能重新安装
								let message = response.message
								_this.$u.toast(message)
								return
							}
							console.log("response");
							console.log(response);
							_this.formComplate = Object.assign(response.result, {
								warrantyTime: '扫码'
							})
						})
						// this.form.snCode = res.result;
					}
				});
			},
			getLocation() {
				let qqmapsdk = new QQMapWX({
					key: this.config.tencentSdkKey // 必填key（即密钥，可以获取设置新的项目key） 要改成自己的 对应不同的项目
				});
				const _this = this
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success: function(res) {
						if (res.errMsg == 'getLocation:ok') {
							console.log("地址信息如下res")
							console.log(res)
							_this.latitude = res.latitude;
							_this.longitude = res.longitude;
							qqmapsdk.reverseGeocoder({ //把回调拿到的经纬度作为参数传给腾讯地图api接口
								location: {
									//纬度
									latitude: res.latitude,
									//经度
									longitude: res.longitude
								},
								success: function(res) { //结果拿到 由经纬度转化成的当前的真实中文地址信息
									// _this.$u.toast(res.result.address.toString())
									_this.address = res.result.address
									console.log(res.result);
								},
								fail: function(res) {
									console.log(res);
								}
							})

						} else {
							uni.showToast({
								title: '当前地址获取失败',
								icon: 'none'
							});
						}
					}
				});
			},
			//提交办理工单服务单
			submit() {
				let apiForm = this.apiForm
				let apiVal;
				let object = {}
				let object1 = {}
				let object2 = {}
				let object3 = {}
				//新增
				if (apiForm.way == '接收并派送师傅') {
					if (this.shifuValue == '') {
						this.$u.toast("请选择师傅")
						return
					}
					object = {
						sfxm: this.shifuForm.sfxm,
						sfyhm: this.shifuForm.sfyhm,
						sfdh: this.shifuForm.sfdh,
						sfjb: this.shifuForm.sfjb
					}
				} else if (apiForm.way == '打卡成功') {
					let latitude = this.latitude //经度
					let longitude = this.longitude //纬度
					let address = this.address //详细地址
					object = {
						dkpcgls: 0, //定位偏差公里数
						smdkdwdz: address, //上门打卡定位地址
						smdkjwd: `${latitude},${longitude}`, //定位经纬度 '105.3321,13.654124'
						snm: this.form.snm // 出厂编码
					}
				} else {
					if (apiForm === '' || apiForm === null || apiForm === undefined) { //rule 是否数组 有值
						this.$u.toast("请选择办理方式")
						return
					} else if (apiForm.rule.length > 0) {

						if (apiForm.way == '预约成功') { //校验选择的办理方式对应的信息 不能为空
							if (this.apiOption.appointmentDate === undefined) {
								this.$u.toast('请选择预约上门时间')
								return
							}
						} else if (apiForm.way == '预约失败' || apiForm.way == '改约') {
							if (this.comboboxLabel == '') {
								this.$u.toast('请选择输入相应信息')
								return
							}
						} else if (apiForm.way == '退回工单') {
							if (this.valueResult == '') {
								this.$u.toast('请选择输入相应信息')
								return
							}
						}
						console.log(apiForm);
						apiForm.rule.forEach((item, index) => {
							//赋值给object1 object2 object3 传到接口参数
							if (item.formtype == 'combobox') {
								//单选框
								apiVal = this.comboboxApiVal
								object1 = {
									[item.field]: apiVal
								}
							} else if (item.formtype == 'datetime') {
								//日期控件
								apiVal = this.apiOption.appointmentDate
								object2 = {
									[item.field]: apiVal
								}
							} else if (item.formtype == 'text') {
								//输入控件
								apiVal = this.valueResult
								object3 = {
									[item.field]: apiVal
								}
							}
							object = Object.assign(object1, object2, object3)
						})
					} else {
						// this.$u.toast("这里单个 没有/f/")  //单个 没有rule规则的时候 即没有text commbox datetime类型那些控件
						// 	return
					}
				}
				//问题描述字段
				let yhfkwt = {
					yhfkwt: this.problemDesc
				}
				if (this.problemDesc != '') { //如果输入了问题描述 则把描述字段带上 反则不带
					object = Object.assign(object, yhfkwt)
				}
				let params = {
					case_id: this.apiOption.case_id,
					workitem_id: this.apiOption.workitem_id,
					tableid: this.apiOption.tableid,
					id: this.apiOption.id,
					//以下 新改值
					handleWay: apiForm.way,
					values: object,
					handleRemarks: this.apiOption.handleRemarks || ''
				}
				console.log(params, "1111111") //工单提交按钮
				// return
				//提交工单 不管师傅还是网点负责人 哪种角色 都是同一个接口
				this.$u.post('/app/WorkOrder/processing', params).then(res => {
					if (res.code === 0) {
						this.$refs.uToast.show({
							title: '工单提交成功',
							type: 'success'
						})
						uni.setStorageSync('OrderStatusString', this.OrderStatus)
						uni.setStorageSync('updateFalt', true)
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/order/index',
								success: function(e) {
									//返回页面 刷新
									let page = getCurrentPages().pop();
									if (page == undefined || page == null) return;
									page.onLoad();
								}
							})
						}, 1500)
					} else {
						this.$u.toast(res.message)
					}

				}).catch()
			},
			//提交配件申请单
			submitParts() {
				if (this.fkfsLable == '' && this.role == 'fzr' && this.wdjb == '一级网点') {
					this.$u.toast("请选择付款方式")
					return
				}
				if (this.apiOptionParts.data.pjzsl > 0) { //配件申请总数量
				} else {
					//	判断配件数量为0  不给提交
					this.$u.toast("当前配件数量为0，请添加配件再提交")
					return
				}
				console.log(this.apiOptionParts, "this.apiOptionParts");
				let kyed = Number(this.formParts.kyed) //网点可用额度
				let pjzje = Number(this.apiOptionParts.data.pjzje) //配件申请总计金额
				//付款方式
				if (this.fkfsLable == '使用网点余额') {
					if (kyed < pjzje) {
						this.$u.toast("当前网点可用额度不足以支付")
						return
					}
				}
				let t = this
				//////////////提交参数如下start
				let detailsList = this.apiOptionParts.details
				let paramsList = []
				detailsList.forEach((item, index) => {
					paramsList.push({
						glpjbh: item.glpjbh,
						sqsl: item.sqsl
					})
				})
				let params = Object.assign({}, {
					data: this.apiOptionParts.data,
					details: paramsList, //筛选后的配件申请明细 配件编号跟申请数量
					handleRemarks: this.apiOptionParts.handleRemarks,
					handleWay: this.apiOptionParts.handleWay,
					openid: uni.getStorageSync('openid')
				})
				///////////参数 end
				if (this.fkfsLable == '在线支付' && pjzje > 0) {
					this.$u.post('/app/workOrder/getOrderpjsq', params).then(res => {
						if (res.code == 0) {
							if (res.result.status == 'succeeded') { //发起支付 根据该字段标识 是否吊起支付控件
								let payment = res.result
								AdaPay.doPay(payment, (res) => {
									//支付结果参数
									console.log(res)
									if (res.result_status == 'succeeded') { //支付成功
										//调用提交方法
										let apiPar = Object.assign(params, {
											order_no: res.result_info.order_no
										})
										t.submitApiparam(apiPar)
									} else {
										//取消支付
										t.$u.toast('支付已取消')
									}
								})
							}
						} else { //res.code 不为0的时候 接口返回报错信息
							this.$u.toast(res.message)
						}

					}).catch()

				} else { //无需在线支付  如办理方式选择了网点余额 或线下付款  直接提交即可
					t.submitApiparam(params)
				}
			},
			//提交配件申请所需参数函数
			submitApiparam(apiPar) {
				this.$u.post('/app/WorkOrder/addPjcase', apiPar).then(res => {
					if (res.code == 0) {
						uni.removeStorageSync('newList') //清空原页面缓存选择的配件列表
						uni.removeStorageSync('allNewList') //清空页面缓存选择的配件列表 -》对应更改配件数量的逻辑
						this.$u.toast('提交配件申请成功') //
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/order/accessories/accessoriesOrder'
							});
						}, 1500)
					} else {
						this.$u.toast(res.message)
					}
				}).catch()

			},
			//预约成功 选择日期
			confirm(e) {
				this.apiOption.appointmentDate = '';
				if (this.params.year) this.apiOption.appointmentDate += e.year;
				if (this.params.month) this.apiOption.appointmentDate += '-' + e.month;
				if (this.params.day) this.apiOption.appointmentDate += '-' + e.day;
				if (this.params.hour) this.apiOption.appointmentDate += ' ' + e.hour;
				if (this.params.minute) this.apiOption.appointmentDate += ':' + e.minute;
				if (this.params.second) this.apiOption.appointmentDate += ':' + e.second;
			},
			// 工单办理方式选择其中一项change操作
			radioChangeWork(item, index) {
				uni.setStorageSync('banlifangshi', item.way)
				this.apiOption.handleWay = item.way
				this.apiForm = item
				if (item.way == '打卡成功') {
					this.apiForm.rule = []
					return
				}
				if (item.way == '完成服务' || item.way == '一步完工') {
					this.showComplate = true
					this.apiForm.rule = []
					return
				}
				//网点负责人逻辑
				if (item.way == '接收并派送师傅') {
					this.showPaiShiFu = true
					this.apiForm.rule = []
					return
				}
				this.showPaiShiFu = false
				//
				let allWayData = this.apiFormAll
				let selectWayData = []
				allWayData.forEach((Subitem, Subindex) => {
					if (Subitem.way == item.way) {
						selectWayData = Subitem
					}
				})
				console.log(selectWayData)
				if (selectWayData.rule === '') { //没有rule字段时 表单标签不用显示

				} else {
					if (selectWayData.rule[0].formtype == 'image') { //完成服务时 不用显示，是直接跳到步骤条逻辑
						return
					}
					selectWayData.rule.forEach((subItem, subIndex) => {
						if (subItem.formtype == 'combobox') {
							this.returnSheetList = []
							for (let x in subItem.option) {
								this.returnSheetList.push({
									text: subItem.option[x].label,
									value: subItem.option[x].value
								})
							}
						}
					})
				}
			},
			//配件申请单办理方式选择其中一项change操作
			radioChangeParts(item, index) {
				console.log(item);
				this.apiOptionParts.handleWay = item.way
			},
		}
	}
</script>
<style lang="scss" scoped>
	// @import 'index.scss';
	@import './modulePublic/scss/public.scss';

	/deep/.u-col {
		padding: 0 !important;
	}

	//折叠面板
	/deep/.u-collapse {
		background-color: white;

		.u-collapse-item {
			border: 1rpx solid $u-border-color;
			margin-bottom: 16rpx;
		}

		.u-collapse-head {
			font-weight: bold;
			background: $u-type-info-light;
			padding: 24rpx !important;
		}

		//内容主体栏
		.body_content {
			padding: 0 32rpx;
		}

		.clearScrollBar {
			&::-webkit-scrollbar {
				display: none;
			}
		}
	}

	.all-container {
		height: 100%;
		overflow: scroll !important;
		padding-bottom: 200rpx;

		/deep/.u-collapse-body {
			overflow: scroll !important;
		}

		/deep/.u-form-item--right__content__slot {
			//右边内容行  小程序显示异常解决  h5不加这个也正常显示
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		//配件申请明细里面内容
		.partItem {
			background-color: #FFFFFF;

			view:nth-of-type(1) {
				color: $u-main-color;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			view {
				color: $u-tips-color;
			}
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

		//uni-fab按钮样式
		/deep/ .uni-fab,
		/deep/.uni-fab__circle {
			margin-bottom: 100rpx;
		}
	}
</style>
