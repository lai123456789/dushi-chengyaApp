<template>
	<view class="page">
		<view style="background: white;">
			<view class="u-padding-top-20">
				<u-steps :list="numList" :current="stepCurrent" mode="number"></u-steps>
			</view>
			<!-- 完善产品 -->
			<view v-if="stepCurrent == 0" class="u-padding-30 u-p-b-80">
				<u-form>
					<u-form-item :label="detail.snmText" label-width="200rpx" required>
						<view class="flex_center">
							<u-input :disabled="qxFlag" class="u-flex-1" placeholder="请输入SN码" v-model="formComplate.snm"
								@input="onInput"></u-input>
							<u-icon v-if="!qxFlag" name="scan" color="#2979ff" size="40"
								@click="scan('formComplate', 'snm')" class="u-margin-left-20"></u-icon>
						</view>
					</u-form-item>
					<block v-if="productBase.cppl === '空调类'">
						<u-form-item :label="'室内机SN码' + (index + 1)" label-width="210rpx" v-for="(item, index) in gdzcp"
							:key="index" required>
							<view class="flex_center">
								<u-input placeholder="请输入室内机SN码" v-model="item.cpsn" @input="snInput(item, index)">
								</u-input>
								<u-icon name="scan" color="#2979ff" size="40" @click="scan('gdzcp', 'cpsn', index)"
									class="u-margin-left-10"></u-icon>
								<u-icon name="plus" color="#2979ff" size="40" @click="add" class="u-margin-left-10">
								</u-icon>
								<u-icon name="minus" :color="minusColor" size="40" @click="handleReduce(index)"
									class="u-margin-left-10"></u-icon>
							</view>
						</u-form-item>
					</block>
					<u-form-item label="产品名称" label-width="200rpx">
						<view>{{formComplate.cpmc}}</view>
					</u-form-item>
					<u-form-item label="产品品类" label-width="200rpx">
						<view>{{formComplate.chanpin_fl}}</view>
					</u-form-item>
					<u-form-item label="产品型号" label-width="200rpx">
						<view>{{formComplate.cpxh}}</view>
					</u-form-item>
					<u-form-item label="购买日期" label-width="200rpx" required>
						<u-input :disabled="qxFlag" style="width: 100%;" placeholder="请选择购买日期"
							v-model="formComplate.gmrq" type="select" @click="purTime = !qxFlag" />
						<u-picker mode="time" v-model="purTime" :params="timePra" @confirm="choiceTime"></u-picker>
					</u-form-item>
					<u-form-item label="购买渠道" label-width="200rpx">
						<view>{{formComplate.gmqd}}</view>
					</u-form-item>
					<u-form-item label="默认质保期" label-width="200rpx">
						<view>{{formComplate.zbdqr}}</view>
					</u-form-item>
					<u-form-item label="质保剩余天数" label-width="200rpx">
						<view>{{formComplate.zbsyts}}</view>
					</u-form-item>
				</u-form>
			</view>
			<!-- 用料明细 -->
			<view v-show="stepCurrent == 1" class="u-padding-30">
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
						<view slot="foot" style="color: red">
							注：若没有使用配件或辅材,可直接点击【下一步】
						</view>
					</block>
					<block v-if="apiOptionParts.details.length > 0">
						<view slot="body" class="partItem u-border-bottom u-padding-top-10 u-padding-bottom-20"
							v-for="(item, index) in apiOptionParts.details" :key="index">
							<block v-if="item.type === 'pj'">
								<view class="u-flex u-col-top u-row-between u-margin-bottom-10">
									<text class="u-flex-1">{{item.mc}}</text>
									<u-tag :text="item.bnbw ? '保内':'保外'" type="error" />
									<u-number-box v-model="item.sqsl" @change="(e) => { valChange(e, item, index) }">
									</u-number-box>
								</view>
								<view class="attribute u-flex u-row-between u-col-center">
									<text>云米编号：{{item.bh}}</text>
									<u-tag :text="item.ms" type="primary" />
								</view>
								<view class="attribute">
									<text>单价：{{item.dj}}元</text>
								</view>
								<view class="attribute u-flex u-row-between u-col-center">
									<text class="u-line-2  u-flex-1">配件型号：{{item.xh}}</text>
									<text style="color: #007AFF;">网点库存：{{item.kysl}}</text>
								</view>
							</block>
							<block v-else>
								<view class="u-flex u-col-top u-row-between u-margin-bottom-10">
									<text>{{item.mc}}</text>
									<u-number-box v-model="item.sqsl" @change="(e) => { valChange(e, item, index) }">
									</u-number-box>
								</view>
								<view class="attribute u-flex u-row-between u-col-center">
									<text>编号：{{item.bh}}</text>
									<u-tag :text="item.ms" type="primary" />
								</view>
								<view class="attribute">
									<text>单价：{{item.dj}}元</text>
								</view>
								<view class="attribute">
									<text class="u-line-2  u-flex-1">辅材规格：{{item.fcgg}}</text>
								</view>
							</block>
						</view>
					</block>
				</u-card>
				<u-gap height="40"></u-gap>
			</view>
			<!-- 完工信息 -->
			<view v-show="stepCurrent === 2" class="u-padding-40">
				<u-form :model="form" ref="uForm" v-if="detail.gdlx !== '测量'">
					<u-form-item label="工单保内保外" label-width="200rpx">
						<view>{{formComplate.gdbnw}}</view>
					</u-form-item>
					<block v-for="(item, index) in complateInfo" :key="item.id">
						<u-form-item label-width="200rpx" :label="item.name" :prop="item.field"
							v-if="item.field === 'liji_tscs'" required>
							<u-switch v-model="form[item.field]"></u-switch>
						</u-form-item>
						<u-form-item label-width="200rpx" :label="item.name" :prop="item.field"
							v-else-if="item.field === 'tds_cs' && form.liji_tscs" required>
							<u-input type="number" :placeholder="item.required.message" v-model="form[item.field]"
								:border="true" style="width: 100%;" />
						</u-form-item>
						<u-form-item label-width="200rpx" :label="item.name" :prop="item.field"
							v-else-if="item.field === 'tds_fs' && form.liji_tscs" required>
							<u-input type="number" :placeholder="item.required.message" v-model="form[item.field]"
								:border="true" style="width: 100%;" />
						</u-form-item>
						<u-form-item label-width="200rpx" :label="item.name" :prop="item.field"
							v-else-if="item.field === 'tds_js' && form.liji_tscs" required>
							<u-input type="number" :placeholder="item.required.message" v-model="form[item.field]"
								:border="true" style="width: 100%;" />
						</u-form-item>
						<u-form-item label-width="200rpx" :label="item.name" :prop="item.field"
							v-else-if="item.field === 'butong_scssm' && !form.liji_tscs" required>
							<u-input type="textarea" placeholder="请输入不通水说明" v-model="form[item.field]" :border="true"
								style="width: 100%;" />
						</u-form-item>
						<u-form-item label-width="200rpx" :label="item.name" :prop="item.field"
							v-else-if="item.field === 'yaohao_pcg'">
							<u-switch v-model="form[item.field]"></u-switch>
						</u-form-item>
						<u-form-item label-width="200rpx" :label="item.name" :prop="item.field"
							v-else-if="item.field === 'hpjt' && form.yaohao_pcg" required>
							<view @click="onChooseComplete">
								<u-upload @on-success="(data) => { uploadImg(data, item.field, 0) }"
									@on-remove="onRemove(item.field, 0)" :max-size="8 * 1024 * 1024" :max-count="1"
									:action="action" name="file" width="200rpx" height="200rpx" :formData="formData">
								</u-upload>
							</view>
							<u-input type="text" v-model="form[item.field]" :border="true" v-show="false" />
						</u-form-item>
						<u-form-item label-width="200rpx" :label="item.name" :prop="item.field"
							v-else-if="item.field === 'sflw'">
							<u-switch v-model="form[item.field]"></u-switch>
						</u-form-item>
						<u-form-item label-width="200rpx" :label="item.name" :prop="item.field"
							v-else-if="item.field === 'didbh' && form.sflw">
							<u-input type="test" placeholder="请输入DID编码" v-model="form[item.field]" :border="true"
								style="width: 100%;" />
						</u-form-item>

						<!-- 鉴定服务 -->
						<u-form-item :label="item.name" label-width="200rpx" :prop="item.field"
							v-else-if="item.field === 'gzlb'" required>
							<u-input style="width: 100%;" placeholder="请选择故障类别" v-model="form[item.field]" type="select"
								:border="false" @click="getReasons" />
							<u-select v-model="faultFlag" mode="mutil-column-auto" :list="faultType"
								@confirm="(e) => {choiceReason(e, index, 'gzlb')}"></u-select>
						</u-form-item>
						<u-form-item :label="item.name" label-width="200rpx" :prop="item.field"
							v-else-if="item.field === 'fwcs'" required>
							<u-input style="width: 100%;" placeholder="请选择服务措施" v-model="form[item.field]" type="select"
								:border="false" @click="measuresFlag = true" />
							<u-select v-model="measuresFlag" mode="single-column" :list="measuresType" label-name="name"
								value-name="name" @confirm="(e) => {choiceReason(e, index, 'fwcs')}"></u-select>
						</u-form-item>
						<u-form-item :label="item.name" label-width="200rpx" :prop="item.field"
							v-else-if="item.field === 'sfjlgzxx'" required>
							<u-input style="width: 100%;" placeholder="请输入故障记录" v-model="form[item.field]"
								type="textarea" :border="false" />
						</u-form-item>
						<u-form-item :label="item.name" label-width="200rpx" :prop="item.field"
							v-else-if="item.field === 'jyjdjg'" required>
							<u-checkbox-group>
								<u-checkbox v-for="(item1, index1) in resultList" :key="index1" v-model="item1.checked"
									:name="item1.name" @change="(e) => { checkChange(e, item.field, item1) }">
									{{item1.name}}
								</u-checkbox>
							</u-checkbox-group>
						</u-form-item>
						<u-form-item :label="item.name" label-width="200rpx" :prop="item.field"
							v-else-if="item.field === 'jyjdxq'" required>
							<u-input style="width: 100%;" placeholder="请输入详情" v-model="form[item.field]" type="textarea"
								:border="true" />
						</u-form-item>
						<u-form-item :label="item.name" label-width="200rpx" :prop="item.field"
							v-else-if="item.field === 'bzjdjg'" required>
							<u-checkbox-group>
								<u-checkbox v-for="(item1, index1) in packingList" :key="index1" v-model="item1.checked"
									:name="item1.name" @change="(e) => { checkChange(e, item.field, item1) }">
									{{item1.name}}
								</u-checkbox>
							</u-checkbox-group>
						</u-form-item>
						<u-form-item :label="item.name" label-width="200rpx" :prop="item.field"
							v-else-if="item.field === 'bzjdxq'" required>
							<u-input style="width: 100%;" placeholder="请输入详情" v-model="form[item.field]" type="textarea"
								:border="true" />
						</u-form-item>
						<u-form-item :label="item.name" label-width="200rpx" :prop="item.field"
							v-else-if="item.field === 'wdlxxx'" required>
							<u-input style="width: 100%;" placeholder="请输入网点联系信息" v-model="form[item.field]"
								type="textarea" :border="true" />
						</u-form-item>
						<!-- 拆机工单 -->
						<u-form-item :label="item.name" label-width="200rpx" :prop="item.field"
							v-else-if="item.field === 'jjsnm'" required>
							<view class="flex_center">
								<u-input placeholder="请输入拆机sn码" v-model="form[item.field]"></u-input>
								<u-icon name="scan" color="#2979ff" size="40" @click="scan('form', item.field)"
									class="u-margin-left-20"></u-icon>
							</view>
						</u-form-item>
						<!-- <block v-if="detail.cppl === '空调类' && item.field === 'jjsn'">
							<u-form-item :label="'拆机室内SN码' + (index1 + 1)" label-width="210rpx" v-for="(item1, index1) in gdzcp" :key="index1"
							 required>
								<view class="flex_center">
									<u-input placeholder="请输入拆机室内SN码" v-model="item1.jjsn"></u-input>
									<u-icon name="scan" color="#2979ff" size="40" @click="scan('gdzcp', 'jjsn', index1)" class="u-margin-left-10"></u-icon>
									<u-icon name="plus" color="#2979ff" size="40" @click="add" class="u-margin-left-10"></u-icon>
									<u-icon name="minus" :color="minusColor" size="40" @click="handleReduce(index1)" class="u-margin-left-10"></u-icon>
								</view>
							</u-form-item>
						</block> -->
						<!-- 安维照片 -->
						<u-form-item label-width="200rpx" :label="item.name" required :border-bottom="false"
							label-position="top" v-if="item.field === 'xcwgsczp'">
							<view class="flex_start" style="font-size: 12px;">
								<view v-for="(im, imIndex) in imgSetting" :key="im.id" @click="onChooseComplete">
									<u-upload @on-success="(data) => { uploadImg(data, 'imgSetting', imIndex) }"
										@on-remove="onRemove('imgSetting', imIndex)" :max-size="8 * 1024 * 1024"
										:max-count="1" :action="action" name="file" width="200rpx" height="200rpx"
										:formData="formData" :upload-text="im.words"></u-upload>
								</view>
								<view v-for="(im, imIndex) in imgLast" :key="im.id" @click="onChooseComplete">
									<u-upload @on-success="(data) => { uploadImg(data, 'imgLast', imIndex) }"
										@on-remove="onRemove('imgLast', imIndex)" :max-size="8 * 1024 * 1024"
										:max-count="1" :action="action" name="file" width="200rpx" height="200rpx"
										:formData="formData" :upload-text="im.words"></u-upload>
								</view>
							</view>
						</u-form-item>
					</block>
					<u-form-item label-width="200rpx" label="工单办理备注">
						<u-input type="textarea" placeholder="请填写工单办理备注" v-model="form.gdblbz" :border="true"
							style="width: 100%;" />
					</u-form-item>
				</u-form>
				<u-form :model="form" ref="uForm" v-else-if="detail.gdlx === '测量'">
					<u-form-item label="工单保内保外" label-width="200rpx">
						<view>{{formComplate.gdbnw}}</view>
					</u-form-item>
					<u-card margin="20rpx -20rpx" v-for="(test, tIndex) in gdcljg" :key="tIndex">
						<view class="u-flex u-flex-1 u-row-between" slot="head">
							<text>测量结果{{tIndex + 1}}</text>
							<view>
								<u-icon name="plus" color="#2979ff" size="40" @click="addTest" class="u-margin-left-10">
								</u-icon>
								<u-icon name="minus" color="#2979ff" size="40" @click="reduceTest(tIndex)"
									class="u-margin-left-10"></u-icon>
							</view>
						</view>
						<view class="" slot="body">
							<block v-for="(cItem, cIndex) in clForm" :key="cItem.id">
								<u-form-item label-width="200rpx" :label="cItem.name" :prop="cItem.field + tIndex"
									:required="!!cItem.required" :border-bottom="false" v-if="cItem.type === 'select'">
									<u-input style="width: 100%;" :placeholder="cItem.placeholder"
										v-model="form[cItem.field + tIndex]" type="select" :border="false"
										@click="handleShowSelect(test, tIndex, cItem.field)" />
									<u-select v-model="test[cItem.field].showFlag" mode="single-column"
										:list="cItem.list" @confirm="(e) => {getClForm(e, tIndex, test, cItem.field)}">
									</u-select>
								</u-form-item>
								<u-form-item label-width="200rpx" :label="cItem.name" :prop="cItem.field + tIndex"
									:required="!!cItem.required" :border-bottom="false"
									v-else-if="cItem.type === 'textarea'">
									<u-input :placeholder="cItem.placeholder" type="textarea"
										v-model="test[cItem.field].value"
										@input="(value) => { textInput(value, test, tIndex, cItem.field) }"></u-input>
								</u-form-item>
								<u-form-item label-width="200rpx" :label="cItem.name" :prop="cItem.field + tIndex"
									:required="!!cItem.required" :border-bottom="false" v-else>
									<u-input :placeholder="cItem.placeholder" v-model="form[cItem.field + tIndex]"
										@input="(value) => { textInput(value, test, tIndex, cItem.field) }"></u-input>
								</u-form-item>
							</block>
						</view>
					</u-card>
					<u-form-item label-width="200rpx" label="完工照片" prop="xcwgsczp" required :border-bottom="false"
						label-position="top">
						<view class="flex_start" style="font-size: 12px;">
							<view class="flex_start" style="font-size: 12px;">
								<view v-for="(im, imIndex) in imgSetting" :key="imIndex" @click="onChooseComplete">
									<u-upload @on-success="(data) => { uploadImg(data, 'imgSetting', imIndex) }"
										@on-remove="onRemove('imgSetting', imIndex)" :max-size="8 * 1024 * 1024"
										:max-count="1" :action="action" name="file" width="200rpx" height="200rpx"
										:formData="formData" :upload-text="im.words"></u-upload>
								</view>
								<view v-for="(im, imIndex) in imgLast" :key="imIndex" @click="onChooseComplete">
									<u-upload @on-success="(data) => { uploadImg(data, 'imgLast', imIndex) }"
										@on-remove="onRemove('imgLast', imIndex)" :max-size="8 * 1024 * 1024"
										:max-count="1" :action="action" name="file" width="200rpx" height="200rpx"
										:formData="formData" :upload-text="im.words"></u-upload>
								</view>
							</view>
						</view>
					</u-form-item>
				</u-form>
				<u-gap height="40"></u-gap>
			</view>
			<!-- 客户确认 -->
			<view v-if="stepCurrent == 3">
				<u-card padding="0" :head-style="{ padding: '30rpx'}" :foot-style="{ padding: '30rpx'}">
					<view slot="head" class="fee_head">
						<text style="font-size: 32rpx;">收费明细</text>
						<view class="img_box" v-if="detail.sfmd === '是'">
							<text class="iconfont miandan" style="width: 100rpx; height: 100rpx;"></text>
						</view>
					</view>
					<view slot="body">
						<view class="line_box">
							<view class="u-flex title">
								<text>服务费：</text>
								<view class="u-flex" style="width: 150rpx; color: #999" v-if="!ipay">
									<u-input type="digit" :value="fee.fuwu_f" @input="getFuwuFee" :border="true"
										height="40" :clearable="false" />
									元
								</view>
								<text v-else>{{fee.fuwu_f}}元</text>
							</view>
						</view>
						<view class="line_box">
							<view class="u-flex title">
								<text>配件费：</text>
								<text class="money">￥{{fee.pjf}}</text>
							</view>
							<view class="content">
								<block v-for="(im, idx) in pjList" :key="idx">
									<view class="u-flex list" v-if="im.sqsl > 0">
										<text class="u-flex-1">{{im.mc}}</text>
										<text style="width: 280rpx; text-align: right;">￥{{ im.dj }}x{{ im.sqsl }} =
											￥{{ parseFloat(im.dj) * im.sqsl }}</text>
									</view>
								</block>
							</view>
						</view>
						<view class="line_box" v-if="fee.fcf">
							<view class="u-flex title">
								<text>辅材费：</text>
								<text class="money">￥{{fee.fcf}}</text>
							</view>
							<view class="content">
								<block v-for="(im, idx) in fcList" :key="idx">
									<view class="u-flex list" v-if="im.sqsl > 0">
										<text class="u-flex-1">{{im.mc}}</text>
										<text style="width: 280rpx; text-align: right;">￥{{ im.dj }}x{{ im.sqsl }} =
											￥{{ parseFloat(im.dj) * im.sqsl }}</text>
									</view>
								</block>
							</view>
						</view>
						<view class="line_box">
							<view class="u-flex title" v-if="fee.zdjmje">
								<text>自动减免金额：</text>
								<text class="money">￥-{{fee.zdjmje}}</text>
							</view>
							<view class="content">
								<view class="u-flex list" v-if="jmf.md">
									<text>免单减免</text>
									<text>￥-{{jmf.md}}</text>
								</view>
								<view class="u-flex list" v-if="jmf.bn">
									<text>保内配件减免</text>
									<text>￥-{{jmf.bn}}</text>
								</view>
								<view class="u-flex list" v-if="jmf.xj">
									<text>辅材限价减免</text>
									<text>￥-{{jmf.xj}}</text>
								</view>
							</view>
						</view>
						<view class="line_box">
							<view class="u-flex title">
								<text>优惠金额：</text>
								<view class="u-flex" style="width: 150rpx; color: #999" v-if="!ipay">
									<u-input type="digit" :value="fee.yhje" @input="getFee" :border="true" height="40"
										:clearable="false" />
									元
								</view>
								<text v-else>{{fee.yhje}}元</text>
							</view>
						</view>
					</view>
					<view slot="foot" class="u-flex u-row-between" style="width: 100%;">
						<u-tag text="客户已付款" mode="plain" type="error" v-show="ipay" />
						<view class="u-flex-1 u-flex u-row-right">
							<text class="u-main-color">应收合计：</text>
							<text style="color: red;">￥ {{fee.sfzj || 0}}元</text>
						</view>
					</view>
				</u-card>
				<view class="center u-font-32" v-if="!ipay">
					<view class="u-flex title">
						<view class="u-m-r-16">
							收款方式：
						</view>
						<u-radio-group v-model="paymentMethod" wrap class=" u-flex-1">
							<u-radio name="xssk">
								<view>
									<text class="u-m-r-32">在线收款</text>
									<u-button type="primary" size="mini" class="u-margin-left-40" @click="goCollect"
										v-if="paymentMethod === 'xssk'">
										<u-icon name="scan" size="30" class="u-m-r-12"> </u-icon>
										收款码
									</u-button>
								</view>
							</u-radio>
							<u-radio name="xjsk">
								现金收款
							</u-radio>
						</u-radio-group>
					</view>
				</view>
				<u-card margin="0" title="客户签名">
					<view v-if="!signNameImgSrc" slot="body" class="u-flex u-row-center u-col-center u-m-t-60 u-m-b-60"
						@click="goqianming">
						点击进入手写签名版
					</view>
					<u-image v-else slot="body" :src="signNameImgSrc" width="100%" height="220rpx" @click="goqianming">
					</u-image>
				</u-card>
				<u-gap height="80"></u-gap>
				<u-modal v-model="feeModal" content="优惠金额不能大于实际收费金额，请重新输入" show-cancel-button @confirm="clearFee"
					@cancel="clearFee"></u-modal>
				<u-modal v-model="collectModel" content="请确认服务费、辅材费、配件费等准确填写，确定生成收款码后，不可再更改。" show-cancel-button
					@confirm="handleCollect"></u-modal>
			</view>
		</view>
		<view style="width: 100%;display: flex;position: fixed;bottom: 0;z-index: 1000;">
			<u-button v-if="stepCurrent == 0" type="primary" style="width: 50%;" :custom-style="customStyle"
				@click='goback'>返回</u-button>
			<u-button v-if="stepCurrent > 0 || stepCurrent == (numList.length-1)" type="primary" style="width: 50%;"
				:custom-style="customStyle" @click='prevStep'>上一步</u-button>
			<u-button type="success" style="width: 50%;" :custom-style="customStyle"
				v-if="stepCurrent !== (numList.length-1)" @click='nextStep'>下一步</u-button>
			<u-button type="success" style="width: 50%;" :custom-style="customStyle"
				v-if="stepCurrent > 0 && stepCurrent == (numList.length-1)" @click='handleComplate'>完成服务</u-button>
		</view>
		<u-toast ref="uToast" />
		<u-modal v-model="modalShow" :content="modalTxt" :cancel-text="cancelText" show-cancel-button
			:confirm-text="confirmText" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import formConfig from '../config.js'
	const QQMapWX = require('../../../common/wxmap_sdk/qqmap-wx-jssdk.min.js')
	let qqmapsdk
	export default {
		data() {
			return {
				stepCurrent: 0,
				wayIndex: '',
				detail: {},
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
				customStyle: {
					borderRadius: '0',
				},
				formComplateStyle: {
					width: '100%',
					paddingLeft: '10rpx'
				},
				noProduct: false, // 根据SN码更新产品，判断产品信息是否存在
				formComplate: {
					cpmc: '',
					cpxh: '',
					cppl: '',
					cplb: '',
					pp: '',
					snm: '',
					cp69m: '',
					chanpin_fl: '',
					sfsmaz: '',
					wxfwfs: '',
					gmqd: '',
					gmrq: '',
					zbdqr: '',
					zbsyts: '',
					gdbnw: '',
				},
				formSnm: '', // 提交表单额snm码
				productBase: {}, // 产品基础信息
				qxFlag: false, // 清洗单，第一步不能编辑
				purTime: false, // 购买日期选择
				timePra: {
					year: true,
					month: true,
					day: true
				},
				apiOptionParts: {
					details: [],
					data: {}
				},
				complateInfo: [],
				minusColor: 'gray',
				form: {
					gdblbz: ''
				}, // 表单
				rules: {}, // 表单规则
				action: `${this.config.url}/admin/attachment/upload/?uploadName=file`, // 上传照片
				formData: {
					'accept': 'image/*',
				},
				showServerMoneyAdd: false,
				pjmxIndexPrice: '', // 配件费用总和
				serverMoney: 0,
				serverMoneyRemark: '',
				total: 0,
				fcTotal: 0,
				xjfc: 0,
				bxjfc: 0,
				pjTotal: 0,
				myxj: false,
				autoFee: 0,
				fwfDisabled: false,
				pjList: [],
				fcList: [],
				fee: {
					fuwu_f: 0, // 服务费
					yhje: 0, // 优惠金额
					pjf: 0, // 配件费
					fcf: 0, // 辅材费
					zdjmje: 0, // 自动减免金额
					sfzj: 0, // 收费总计
				},
				jmf: {
					md: 0, // 免单
					bn: 0, // 保内
					xj: 0, // 限价
				},
				oldFwf: 0,
				oldYhje: 0,
				signNameImgSrc: '',
				faultType: [], // 故障类别
				faultFlag: false, // 选择器
				measuresType: [], // 服务措施
				measuresFlag: false, // 选择器
				resultList: [],
				packingList: [],
				gdzcp: [],
				gdcljg: [],
				clForm: [],
				modalShow: false,
				modalTxt: '',
				cancelText: '',
				confirmText: '',
				confirmType: '',
				feeModal: false,
				collectModel: false,
				actions: new Map([
					[
						'',
						function(value, inputValue) {
							return true
						}
					],
					[
						'contain',
						function(value, inputValue, allValue) {
							if (allValue) {
								if (allValue.indexOf(inputValue) !== -1 && inputValue) {
									return true
								} else if (allValue.indexOf(inputValue) === -1) {
									return false
								}
							} else if (inputValue.indexOf(value) === -1) {
								return false
							} else if (inputValue.indexOf(value) !== -1) {
								return true
							}
						}
					],
					[
						'equal',
						function(value, inputValue) {
							if (inputValue === value) {
								return true
							} else {
								return false
							}
						}
					],
					[
						'great',
						function(value, inputValue) {
							if (inputValue > value) {
								return true
							} else {
								return false
							}
						}
					],
					[
						'nc',
						function(value, inputValue, allValue) {
							if (allValue) {
								if (allValue.indexOf(inputValue) === -1) {
									return true
								} else if (allValue.indexOf(inputValue) !== -1) {
									return false
								}
							} else if (inputValue.indexOf(value) !== -1) {
								return false
							} else if (inputValue.indexOf(value) === -1) {
								return true
							}
						}
					],
					[
						'ne',
						function(value, inputValue) {
							if (inputValue !== value) {
								return true
							} else {
								return false
							}
						}
					],
					[
						'lt',
						function(value, inputValue) {
							if (inputValue < value) {
								return true
							} else {
								return false
							}
						}
					],
					[
						'ge',
						function(value, inputValue) {
							if (inputValue > value || inputValue === value) {
								return true
							} else {
								return false
							}
						}
					],
					[
						'le',
						function(value, inputValue) {
							if (inputValue < value || inputValue === value) {
								return true
							} else {
								return false
							}
						}
					],
					[
						'bw',
						function(value, inputValue) {
							if (inputValue.indexOf(value) === 0) {
								return true
							} else {
								return false
							}
						}
					],
					[
						'ew',
						function(value, inputValue) {
							const len = value.length
							if (inputValue.slice(-len) === value) {
								return true
							} else {
								return false
							}
						}
					]
				]),
				imgSetting: [], // 只能上传一张图片
				imgLast: [], // 可以上传多张图片
				lastLen: 0, // 上传至多张
				imgMax: 0,
				subKey: '',
				ipay: false, // 是否已收款
				tableidArr: {
					'crm_fwd': 'c289bf71e6254134d7c35833e1014b18',
					'crm_zxd': '81394861d20770bb0a0c0fd85d9f1354',
					'crm_thd': '07f974cf838f0b817e61d6e485854efe',
					'crm_tsd': '0deaad5923b007a61a6432dce398f5c2'
				}, // 数据表的tableid
				adress: '',
				paymentMethod: 'xssk'
			}
		},
		onLoad(options) {
			qqmapsdk = new QQMapWX({
				key: 'KV7BZ-K4BCP-R2GD4-LJQCX-5YNUS-CUFR6'
			})
			let globalData = getApp().globalData
			try {
				// 进入页面之后，删除用户 签名
				uni.removeStorageSync('signNameImg')
				// 客户没有付款
			} catch (e) {
				// error
			}
			// 工单产品基础信息
			this.detail = globalData.order ? globalData.order.orderData : {},
				this.detail.snmText = 'SN码'

			if (this.detail.skfs === 'xssk') {
				// 判断订单是否已支付
				this.$u.post(`crm/Api/xcxCheckPay?orderNumber=${this.detail.gdbh}`).then(res => {
					globalData.ipay = res.code !== 0
				})
			} else if (this.detail.skfs === 'xjsk') {
				globalData.ipay = true
			}

			// 第一步完善产品表单信息
			for (let key in this.formComplate) {
				this.formComplate[key] = this.detail[key]
			}
			this.formSnm = this.formComplate.snm
			if (this.formComplate.snm) {
				this.formComplate.snm = !this.formComplate.snm.includes('/') ? `${this.formComplate.snm}/` : this
					.formComplate.snm
			} else {
				this.formComplate.snm = `${this.detail.glcpbh}/`
			}
			// 产品基础信息
			this.productBase = JSON.parse(JSON.stringify(this.detail))
			let reg = /^[0-9A-Za-z]{6}\/[0-9A-Za-z]{8}$/
			if (reg.test(this.formComplate.snm)) {
				this.onInput()
			}
			// 清洗单第一步表单不能填写
			this.qxFlag = this.detail.gdlx && this.detail.gdlx.includes('清洗')

			this.wayIndex = options.key
			this.subKey = globalData.order ? globalData.order.subKey : ''
			const formObj = new formConfig.handleObj()
			let action = `${this.detail.gdlx}_${options.key}`

			// 获取图片字段的配置信息
			this.$u.post('/app/Setting/getFieldSetting', {
				tableid: this.tableidArr[this.subKey],
				alias: 'xcwgsczp'
			}).then(res => {
				if (res.result.form && res.result.form.appSetting) {
					this.getImgSetting(res.result.form.appSetting)
				}
			})
			this.complateInfo = formObj[action] || []

			// 安装单，如果是净水类则需要增加通水测试
			if (this.detail.gdlx && this.detail.gdlx.includes('安装')) {
				if (this.detail.cplb && !this.detail.cplb.includes('净水类')) {
					const arr = ['liji_tscs', 'tds_cs', 'tds_fs', 'tds_js', 'butong_scssm']
					this.complateInfo = this.complateInfo.filter(item => !arr.includes(item.field))
				}
			} else if (this.detail.gdlx === '测量') {
				// 工单测量结果
				const data = this.complateInfo[0].data
				let cppl = this.detail.cppl || '空调类'
				if (cppl.indexOf('/') !== -1) {
					cppl = cppl.split('/')[0]
				}
				const formData = data[cppl] || []
				const obj = {}
				formData.forEach(item => {
					item.showValue = ''
					item.value = ''
					if (item.type === 'select') {
						item.showFlag = false
					}
					obj[item.field] = item
				})
				this.gdcljg.push(obj)
				this.$u.post('/app/Setting/getaliasOption', {
					tableid: '4312496a1b2ea1e5151612b69c797b1e',
				}).then(res => {
					const result = res.result.options || []
					this.clForm = formData.map(item => {
						if (item.type === 'select') {
							item.list = result[item.field] || []
							item.showFlag = false
						}
						return item
					})
				})
				this.gdcljg.forEach((item, index) => {
					for (let k in item) {
						const key = k + index
						this.$set(this.form, key, '')
						this.$set(this.rules, key, item[k].required)
					}
				})
				return false
			}

			// 判断是否有检验鉴定结果
			let jdFlag = false
			this.complateInfo.forEach(item => {
				if (item.type === 'image') {
					item.required = [{
						validator: () => {
							if (this.form[item.field] instanceof Array && this.form[item.field]
								.length > 0) {
								return true
							} else {
								return false
							}
						},
						message: '请上传照片',
						trigger: ['change', 'blur']
					}]
				}
				if (item.field === 'jyjdjg') {
					jdFlag = true
				}
				if (item.field === 'wdlxxx') {
					const myWdinfo = uni.getStorageSync('myWdinfo') || {
						wddq: '',
						wdxxdz: '',
						wdlxr: '',
						wdlxdh: '',
					}
					item.initValue = `${myWdinfo.wddq}${myWdinfo.wdxxdz}、${myWdinfo.wdlxr}、${myWdinfo.wdlxdh}`
				}
				this.$set(this.form, item.field, item.initValue)
				this.$set(this.rules, item.field, item.required)
			})

			// 获取数据字典的值
			if (jdFlag) {
				this.$u.post('admin/dict/linkageDictList', {
					parent_number: 'jyjdjg'
				}).then(res => {
					const result = res.result || []
					this.resultList = result.map(item => {
						item.checked = false
						return item
					})
				})
				this.$u.post('admin/dict/linkageDictList', {
					parent_number: 'bzjdjg'
				}).then(res => {
					const result = res.result || []
					this.packingList = result.map(item => {
						item.checked = false
						return item
					})
				})
			}

			// 获取师傅当前地址信息
			this.getLocation().then(res => {
				this.adress = res
			})
		},
		onShow() {
			const globalData = getApp().globalData
			const partsList = globalData.partsList || []
			this.apiOptionParts.details = partsList.map(part => {
				let obj = {}
				obj.sqsl = part.reworkNumber
				if (part.tabKey === 'pj' || part.tabKey === 'allPj') {
					obj.type = 'pj'
					obj.mc = part.pjmc
					obj.bh = part.pjbh
					obj.dj = part.lsj
					obj.ms = '配件'
					obj.xh = part.pjxh
					obj.kysl = part.kysl
					obj.bnbw = part.bnbw
				} else {
					obj.type = 'fc'
					obj.mc = part.fcmc
					obj.bh = part.fclb
					obj.dj = part.fcjg
					obj.ms = '辅材'
					obj.fcgg = part.fcgg
					obj.sfxj = part['_sfxj_']
				}
				return obj
			})
			if (uni.getStorageSync('signNameImg')) {
				const nameUrl = uni.getStorageSync('signNameImg')
				this.signNameImgSrc = `${this.config.url}${nameUrl.result.filePath}`
			}
			this.ipay = globalData.ipay
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules)
		},
		onUnload() {
			let globalData = getApp().globalData
			globalData.partsList = []
		},
		watch: {
			gdzcp: {
				handler(newVal) {
					this.minusColor = newVal.length === 1 ? 'gray' : '#2979ff'
				},
				immediate: true,
				deep: true
			},
			productBase: {
				handler(newVal) {
					//  SN码字段label名
					if (newVal.cppl === '空调类') {
						this.detail.snmText = this.detail.gdlx === '拆机' ? '装机室外机SN码' : '室外机SN码'
					} else {
						this.detail.snmText = this.detail.gdlx === '拆机' ? '装机SN码' : 'SN码'
					}

					// 工单子产品
					if (newVal.cppl === '空调类' && this.gdzcp.length === 0) {
						this.gdzcp = this.detail.gdzcp || [{
							cpbh: '',
							cpsn: '',
							jjsn: ''
						}]
					}
					// 空调类室外机sn码不能填写室内机sn码
					if (newVal.cppl === '空调类' && newVal.sfsmaz === '否' && newVal.snType !== '外机') {
						this.$refs.uToast.show({
							type: 'error',
							title: `${this.formSnm}为室内机，此处请输入室外机SN码`
						})
					}
				},
				immediate: true,
				deep: true
			}
		},
		methods: {
			// 初始值与设定值比较
			handleSimple(include, value, inputValue, allValue) {
				const action = this.actions.get(`${include}`)
				return action(value, inputValue, allValue)
			},

			getConditionFlag(logic, conditionFlagArr) {
				if (logic === 'and') {
					return conditionFlagArr.every(item => {
						return item
					})
				} else {
					return conditionFlagArr.some(item => {
						return item
					})
				}
			},

			// 获取图片字段设置
			getImgSetting(appSetting) {
				appSetting.forEach(dataItem => {
					const simpleFlagArr = []
					dataItem.conditions.forEach(item => {
						const conditionFlagArr = []
						item.condition.forEach((myitem) => {
							let inputValue
							const key = `_${item.field}_`
							if (this.detail[key]) {
								inputValue = this.detail[key]
							} else {
								inputValue = this.detail[item.field]
							}
							const flag = this.handleSimple(myitem.include, myitem.value,
								inputValue, myitem.allValue)
							conditionFlagArr.push(flag)
						})
						item.flag = this.getConditionFlag(item.logic, conditionFlagArr)
						simpleFlagArr.push(item.flag)
					})
					if (dataItem.conditions.length === 0) {
						dataItem.flag = true
					} else {
						dataItem.flag = this.getConditionFlag(dataItem.logic, simpleFlagArr)
					}
				})
				for (let i = 0; i < appSetting.length; i++) {
					if (appSetting[i].flag) {
						const arr = appSetting[i].imgData
						const len = arr.length
						this.imgSetting = arr.slice(0, len - 1)
						this.imgLast = arr.slice(len - 1)
						this.lastLen = appSetting[i].load - appSetting[i].btn
						this.lastLen = this.lastLen + 1
						this.imgMax = appSetting[i].load
						return false
					}
				}
			},

			onInput() {
				const sn = this.formComplate.snm
				this.formSnm = sn
				let reg = /^[0-9A-Za-z]{6}\/[0-9A-Za-z]{8}$/
				if (this.detail.gdlx && this.detail.gdlx.includes('维修') && !sn) {
					return false
				}
				if (reg.test(sn)) {
					const cpbh = sn.split('/')[0]
					this.$u.post('/app/Goods/getGoodsInfo', {
						cpbh,
					}).then(response => {
						// 不存在snm码 或者 该产品已经安装过，不能重新安装
						if (response.code === 1) {
							let message = response.message
							this.noProduct = true
							this.$refs.uToast.show({
								type: 'error',
								title: '该产品不存在，请重新填写SN码'
							})
						} else {
							this.noProduct = false
							this.productBase = response.result || {}
							for (let key in this.formComplate) {
								this.formComplate[key] = response.result[key] || this.formComplate[key]
							}
							this.getSnm()
						}
					})
				}
			},

			// 维修单室内机
			snInput(item, index) {
				let reg = /^[0-9A-Za-z]{6}\/[0-9A-Za-z]{8}$/
				if (!reg.test(item.cpsn)) {
					return false
				}
				if (this.detail.gdlx && this.detail.gdlx.includes('维修')) {
					// 外机snm存在但是不符合snm规则
					if (!reg.test(this.formComplate.snm) && index === 0) {
						this.formSnm = item.cpsn
						const cpbh = item.cpsn.split('/')[0]
						this.$u.post('/app/Goods/getGoodsInfo', {
							cpbh,
						}).then(response => {
							// 不存在snm码 或者 该产品已经安装过，不能重新安装
							if (response.code === 1) {
								let message = response.message
								this.noProduct = true
								this.$refs.uToast.show({
									type: 'error',
									title: '该产品不存在，请重新填写室内机SN码1'
								})
							} else {
								this.noProduct = false
								this.productBase = response.result || {}
								this.productBase.snType = '外机'
								for (let key in this.formComplate) {
									this.formComplate[key] = response.result[key] || this.formComplate[key]
								}
								this.getSnm()
							}
						})
					}
				}
			},
			// 获取snm，判断是否保内保外
			getSnm() {
				const sn = this.formSnm
				var reg = /^[0-9A-Za-z]{6}\/[0-9A-Za-z]{8}$/
				if (reg.test(sn)) {
					// 计算产品保内保外
					this.$u.post('/app/Goods/goodsWarranty', {
						snm: sn,
						gmrq: this.formComplate.gmrq,
						cjsj: this.detail.cjsj,
						fkdx: this.detail['_fkdx_'],
						info: {
							gdlxdh: this.detail.gdlxdh,
							cjsj: this.detail.cjsj,
							snm: sn,
							cpxh: this.productBase.cpxh,
							ddbh: this.detail.ddbh,
							gmrq: this.formComplate.gmrq,
							ybkh: this.detail.ybkh,
						}
					}).then((res) => {
						if (res.result) {
							const obj = res.result
							if (obj.gdbnw) {
								obj.gdbnw = obj.gdbnw === 'bn' ? '保内' : '保外'
							}
							const obj1 = JSON.parse(JSON.stringify(obj))
							this.formComplate = Object.assign(this.formComplate, obj)
							this.detail = Object.assign(this.detail, obj1)
						}
					})
				} else {
					this.$refs.uToast.show({
						type: 'error',
						title: '请输入正确和完整的SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码'
					})
				}
			},

			// 打标签
			handleOrderTag() {
				const sn = this.formSnm
				if (this.detail.gdlx === '安装' || this.detail.gdlx === '维修') {
					let gdbq = this.detail.gdbq && JSON.parse(this.detail.gdbq) || []
					let gdbqStr = ''
					gdbq.forEach((item, index) => {
						gdbqStr = index === 0 ? item.name : `${gdbqStr},${item.name}`
					})

					let params = {
						tableid: this.tableidArr[this.subKey],
						'crm_fwd': {
							gdlx: this.detail.gdlx === '安装' ? 'azd' : 'wxd',
							id: this.detail.id,
							snm: sn,
							gdbq: gdbqStr,
						}
					}
					params.tag = this.detail.gdlx === '安装' ? 'SN重复安装' : '15天重复维修'
					if (this.detail.gdlx === '维修') {
						params['crm_fwd'].gzlb = this.form.gzlb
					}
					this.$u.post('/app/WorkOrder/orderTag', params).then(res => {
						if (res.result) {
							this.modalShow = true
							this.modalTxt = this.detail.gdlx === '安装' ? '重复编码，请确认SN码是否属实' :
								'15天内重复维修编码，请确认SN码是否属实'
							this.cancelText = '取消'
							this.confirmText = '确定'
							this.confirmType = 'secondStep'
						} else {
							this.secondStep()
						}
					})
				} else {
					this.secondStep()
				}

			},
			// 扫码获取产品信息
			scan(type, field, index) {
				uni.scanCode({
					success: res => {
						const snm = res.result
						var reg = /^[0-9A-Za-z]{6}\/[0-9A-Za-z]{8}$/
						if (!reg.test(snm)) {
							this.$refs.uToast.show({
								type: 'error',
								title: '请输入正确和完整的SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码'
							})
							return false
						}
						if (type === 'formComplate') {
							this.$set(this[type], field, snm)
							this.onInput()
						} else if (type === 'gdzcp') {
							const item = this.gdzcp[index]
							item[field] = snm
							if (field === 'cpsn') {
								item.cpbh = snm.split('/')[0]
							}
							this.gdzcp.splice(index, 1, item)
						} else {
							this.$set(this[type], field, snm)
						}
					}
				})
			},

			choiceTime(e) {
				const time = `${e.year}-${e.month}-${e.day}`
				const date = new Date(time).valueOf()
				const cjsj = new Date(this.detail.cjsj).valueOf()
				const cjsjDate = this.detail.cjsj && this.detail.cjsj.split(' ')[0]
				if (date >= cjsj) {
					this.$refs.uToast.show({
						type: 'error',
						title: `购买日期不能大于建单日期${cjsjDate}`,
						duration: 3000
					})
				} else {
					this.formComplate.gmrq = time
					this.detail.gmrq = time
					this.getSnm()
				}
			},

			add() {
				const obj = {
					cpbh: '',
					cpsn: '',
					jjsn: '',
				}
				this.gdzcp.push(obj)
			},

			handleReduce(index) {
				if (this.gdzcp.length > 1) {
					this.gdzcp.splice(index, 1)
				}
			},

			// 添加用料明细
			goAddPart() {
				uni.setStorageSync('oldformComplate', this.formComplate)
				let cpbh = this.formSnm && this.formSnm.split('/')[0]
				uni.navigateTo({
					url: `/pages/order/addParts?complate=1&cpbh=${cpbh}`
				});
			},

			// 修改用料
			valChange(e, item, index) {
				item.sqsl = e.value
				const partsList = getApp().globalData.partsList
				const part = partsList[index]
				part.reworkNumber = e.value
				getApp().globalData.partsList = partsList
			},

			// 上传照片
			uploadImg(res, key, index) {
				if (key === 'imgSetting') {
					const item = this.imgSetting[index]
					item.value = res.result
					this.imgSetting.splice(index, 1, item)
				} else if (key === 'imgLast') {
					const item = this.imgLast[index]
					item.value = res.result
					this.imgLast.splice(index, 1, item)
					if (index === this.imgLast.length - 1 && index < this.lastLen - 1) {
						this.imgLast.push({
							id: parseInt(item.id) + 1,
							required: '0',
							words: '其他'
						})
					}
				} else {
					let data = this.form[key] || []
					data.splice(index, 1, res.result)
					this.$set(this.form, key, data)
				}
			},

			// 获取师傅当前地址
			getLocation() {
				return new Promise((resolve, reject) => {
					uni.getLocation({
						type: 'gcj02',
						geocode: true,
						success: (res) => {
							this.latitude = res.latitude || 39.909
							this.longitude = res.longitude || 116.39742
							const jwd = `${this.latitude},${this.longitude}`
							qqmapsdk.reverseGeocoder({
								location: jwd,
								success: (res) => {
									resolve(res.result.address)
								}
							})
						},
						fail() {
							reject()
							uni.showToast({
								title: '当前地址获取失败',
								icon: 'none'
							});
						}
					})
				})
			},
			async onChooseComplete() {
				const sfxm = this.detail.sfxm
				const wdmc = this.detail.wdmc
				const now = new Date()
				const time = this.dayjs(now).format('YYYY-MM-DD HH:mm:ss')
				this.formData.watermarkStatus = true
				this.formData.watermarkText = `${this.adress}\n${time}\n${wdmc}\n${sfxm}`
			},

			// 删除照片
			onRemove(key, index) {
				if (key === 'imgSetting' || key === 'imgLast') {
					const data = this.imgSetting[index]
					data.value = []
					this.imgSetting.splice(index, 1, data)
				} else {
					let data = this.form[key] || []
					data.splice(index, 1)
					this.form[key] = data
				}
			},

			// 工单办理备注
			remarkChange(val) {
				this.$set(this.form, 'gdblbz', val)
			},

			// 收款
			goCollect() {
				this.collectModel = true
			},

			// 师傅确认信息并跳转收款页面
			handleCollect() {
				uni.navigateTo({
					url: `/pages/order/collect?total=${this.fee.sfzj}`
				})
			},

			//签名页面
			goqianming() {
				uni.navigateTo({
					url: '/pages/order/complateWork'
				})
			},

			// 获取故障类别
			getReasons() {
				// 根据输入的产品sn码请求故障类别
				const cplb = this.productBase['_cplb_']
				this.$u.post('/app/Goods/getFaultType', {
					cplb: cplb
				}).then(res => {
					this.faultType = getList(res.result.data)
					this.faultFlag = true
				})

				function getList(arr) {
					const result = arr.map((item, index) => {
						const obj = item
						obj.value = index
						if (obj.children && obj.children.length > 0) {
							obj.children = getList(obj.children)
						}
						return obj
					})
					return result
				}
			},
			// 选择故障类别和服务措施
			choiceReason(e, index, type) {
				let item = ''
				if (type === 'gzlb') {
					item = `${e[0].label}/${e[1].label}/${e[2].label}`
					const a1 = e[0].value
					const a2 = e[1].value
					const a3 = e[2].value
					this.form.yjgz = e[0].label
					this.form.ejgz = e[1].label
					this.form.sjgz = e[2].label
					// 待处理
					this.measuresType = this.faultType[a1].children[a2].children[a3].fwcs
				} else {
					item = e[0].value
					this.measuresType.forEach(im => {
						if (im.name === item) {
							this.form.weixiu_cd = im['_weixiu_cd_']
						}
					})
				}
				this.$set(this.form, type, item)
			},

			// 多选：鉴定结果
			checkChange(e, type, item1) {
				let choice = this.form[type] || ''
				if (e.value) {
					choice = choice ? `${choice},${item1.number}` : item1.number
				} else {
					const choiceArr = choice.split(',')
					const index = choiceArr.indexOf(item1.number)
					choiceArr.splice(index, 1)
					choice = choiceArr.join(',')
				}
				this.$set(this.form, type, choice)
			},

			// 增加测量结果
			addTest() {
				const obj = JSON.parse(JSON.stringify(this.gdcljg[0]))
				for (let k in obj) {
					obj[k].value = ''
					obj[k].showValue = ''
				}
				this.gdcljg.push(obj)
				this.gdcljg.forEach((item, index) => {
					for (let k in item) {
						const key = k + index
						const value = this.form[key] || ''
						this.$set(this.form, key, value)
						this.$set(this.rules, key, item[k].required)
					}
				})
				this.$refs.uForm.setRules(this.rules)
			},
			// 删除测量结果
			reduceTest(index) {
				this.gdcljg.splice(index, 1)
				this.gdcljg.forEach((item, index) => {
					for (let k in item) {
						const key = k + index
						const value = this.form[key] || ''
						this.$set(this.form, key, value)
						this.$set(this.rules, key, item[k].required)
					}
				})
				this.$refs.uForm.setRules(this.rules)
			},
			// 测量结果多选
			handleShowSelect(item, index, field) {
				item[field].showFlag = true
				this.gdcljg.splice(index, 1, item)
			},

			// 获取选择测量参数
			getClForm(e, index, item, field) {
				item[field].showValue = e[0].label
				item[field].value = e[0].value
				this.gdcljg.splice(index, 1, item)
				const key = field + index
				this.$set(this.form, key, e[0].label)
			},

			// 表单输入框
			textInput(value, item, index, field) {
				item[field].value = value
				this.gdcljg.splice(index, 1, item)
			},

			// 检测是否为残次机
			checkDefective() {
				return new Promise((resolve) => {
					const sn = this.formSnm
					var reg = /^[0-9A-Za-z]{6}\/[0-9A-Za-z]{8}$/
					if (reg.test(sn)) {
						this.$u.post('/app/Goods/checkDefectiveSn', {
							snm: sn,
						}).then(res => {
							if (res.result.snlx === 'yth' && this.detail.gdbnw === '保外') {
								this.modalShow = true
								this.modalTxt = '该工单费用由客户支付，请注意收费'
								this.cancelText = '取消'
								this.confirmText = '确定'
								this.confirmType = 'checkDefective'
								resolve(false)
							} else if (res.result.snlx === 'yth' && this.detail.gdbnw === '保内' && this
								.detail.fkdx === '合作方') {
								this.modalShow = true
								this.modalTxt = '该sn码产品为等级品，不提供退换服务和免费安装/维修服务'
								this.cancelText = '通知网点取消'
								this.confirmText = '客户付费服务'
								this.confirmType = 'checkDefective'
								resolve(false)
							} else {
								resolve(true)
							}
						})
					} else {
						resolve(false)
						this.$refs.uToast.show({
							type: 'error',
							title: '请输入正确和完整的SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码'
						})
					}
				})
			},

			confirm() {
				if (this.confirmType === 'checkDefective') {
					this.stepCurrent++
				} else {
					this[this.confirmType]()
				}
			},

			// 服务费
			getFuwuFee(val) {
				val = parseFloat(val) || 0
				this.$set(this.fee, 'fuwu_f', val)
				this.getFee(this.fee.yhje)
			},
			// 优惠金额
			getFee(val) {
				val = parseFloat(val) || 0
				const otherFee = this.fee.fuwu_f + this.fee.pjf + this.fee.fcf - this.fee.zdjmje
				if (val > otherFee) {
					this.feeModal = true
				} else {
					this.$set(this.fee, 'yhje', val)
					this.fee.sfzj = otherFee - val
					this.fee.sfzj = this.fee.sfzj.toFixed(2)
				}
			},

			// 优惠金额清空
			clearFee() {
				this.$set(this.fee, 'yhje', 0)
				this.getFee(0)
			},

			//完工页点击返回
			goback() {
				uni.navigateBack({
					delta: 1
				})
			},
			//点击上一步
			prevStep() {
				this.stepCurrent -= 1
				if (this.stepCurrent === 1) {
					// 重新计算费用
					this.fee = {
						fuwu_f: 0, // 服务费
						yhje: 0, // 优惠金额
						pjf: 0, // 配件费
						fcf: 0, // 辅材费
						zdjmje: 0, // 自动减免金额
						sfzj: 0, // 收费总计
					}
					this.jmf = {
						md: 0, // 免单
						bn: 0, // 保内
						xj: 0, // 限价
					}
				}
			},
			//点击下一步
			async nextStep() {
				this.gdlx = uni.getStorageSync('gdlx')
				let flag = true
				//完工信息步骤
				if (this.stepCurrent === 0) {
					// 清洗单不填写表单
					if (!this.qxFlag) {
						// 判断SN是否符合规则
						var reg = /^[0-9A-Za-z]{6}\/[0-9A-Za-z]{8}$/
						if (this.productBase.cppl === '空调类' && this.productBase.sfsmaz === '否') {
							this.$refs.uToast.show({
								type: 'error',
								title: `${this.formSnm}为室内机，请输入正确室外机SN码`
							})
							return false
						}
						if (this.productBase.cppl === '空调类' && this.detail.gdlx === '安装') {
							if (!reg.test(this.formSnm)) {
								this.$refs.uToast.show({
									type: 'error',
									title: '请输入正确室外机SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码'
								})
								return false
							}
							const noZcp = this.gdzcp.every(im => {
								return !im.cpsn
							})
							if (noZcp) {
								this.$refs.uToast.show({
									type: 'error',
									title: '请输入至少一个正确室内机SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码'
								})
								return false
							}
						} else if (this.productBase.cppl === '空调类' && this.detail.gdlx === '维修') {
							const noZcp = this.gdzcp.every(im => {
								return !im.cpsn
							})
							if (!reg.test(this.formSnm) && noZcp) {
								this.$refs.uToast.show({
									type: 'error',
									title: '请输入至少一个正确室外/内机SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码'
								})
								return false
							}
						} else {
							if (!reg.test(this.formSnm)) {
								this.$refs.uToast.show({
									type: 'error',
									title: '请输入正确SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码'
								})
								return false
							}
						}
						if (!reg.test(this.formSnm)) {
							this.$refs.uToast.show({
								type: 'error',
								title: this.detail.gdlx !== '维修' && this.detail.cppl !== '空调类' ?
									'请输入正确和完整的SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码' :
									'请输入正确的SN码或者室内机SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码'
							})
							return false
						}
						// 判断SN码是否在产品管理中存在信息
						if (this.noProduct) {
							this.$refs.uToast.show({
								type: 'error',
								title: '该产品不存在，请重新填写SN码'
							})
							return false
						}

						// 安装、维修单完工时，若填写的SN对应的产品是非安维的，不允许回传
						if (this.productBase.sfsmaz !== '是' && this.productBase.wxfwfs !== '上门维修') {
							this.$refs.uToast.show({
								type: 'error',
								title: `${this.formSnm}属于是非上门服务产品，请确认填写正确或联系业务管理员`
							})
							return false
						}

						// 购买日期是否存在且不能大于当前日期
						const gmrq = this.formComplate.gmrq
						const date = new Date(gmrq).valueOf()
						const nowDate = new Date().valueOf()
						if (date >= nowDate) {
							this.$refs.uToast.show({
								type: 'error',
								title: '购买日期不能大于当前日期'
							})
							return false
						}
						if (!this.formComplate.gmrq || this.formComplate.gmrq === '0000-00-00') {
							this.$refs.uToast.show({
								type: 'error',
								title: '请选择购买日期'
							})
							return false
						}
					}
					if (this.productBase.chanpin_fl && this.productBase.chanpin_fl.includes('冰洗类')) {
						await this.checkDefective().then(res => {
							flag = res
						})
					}
					const length = this.numList.length - 1
					if (flag && length > this.stepCurrent) {
						this.stepCurrent++
					}
				} else if (this.stepCurrent === 1) {
					// 费用计算
					const partsList = this.apiOptionParts.details
					let pjList = partsList.filter(item => item.type === 'pj')
					this.pjList = pjList
					let fcList = partsList.filter(item => item.type === 'fc')
					this.fcList = fcList
					let fcxjList = []
					if (this.productBase.cplb && this.productBase.cplb.includes('电热水器') || this.productBase.cplb
						.includes('燃气热水器')) {
						fcxjList = fcList.filter(item => item.sfxj === 's') || []
					}
					const {
						detail
					} = this

					// 增·服务费
					let fuwu_f = this.detail.fuwu_f ? parseFloat(this.detail.fuwu_f) : 0
					// 增·配件费
					let pjf = 0
					// 如果有一个配件保内，整个工单保内
					if (pjList.some(item => item.bnbw == 1)) {
						this.formComplate.gdbnw = '保内'
					}
					pjList.forEach(item => {
						item.dj = parseFloat(item.dj) || 0
						// 保内配件不计算费用
						if (item.bnbw == 1) {
							item.dj = 0
						}
						pjf = pjf + parseFloat(item.dj) * item.sqsl
					})
					// 增·辅材费
					let fcf = 0
					fcList.forEach(item => {
						item.dj = parseFloat(item.dj) || 0
						fcf = fcf + parseFloat(item.dj) * item.sqsl
					})
					// 计算辅材减免金额
					let xjfcf = 0
					fcxjList.forEach(item => {
						item.dj = parseFloat(item.dj) || 0
						xjfcf = xjfcf + parseFloat(item.dj) * item.sqsl
					})
					if (this.productBase.cplb && this.productBase.cplb.includes('电热水器') && xjfcf > 200) {
						this.jmf.xj = xjfcf - 200
					} else if (this.productBase.cplb && this.productBase.cplb.includes('燃气热水器') && xjfcf > 300) {
						this.jmf.xj = xjfcf - 300
					}

					if (this.formComplate.gdbnw === '保内' && detail.sfmd === '是') {
						fuwu_f = 0
						this.fee.fcf = 0
						this.jmf.md = fcf
					} else {
						if (this.formComplate.gdbnw === '保内' && detail.sfmd === '否') {
							fuwu_f = 0
						} else if (this.formComplate.gdbnw === '保外') {
							const pjbn = pjList.some(item => item.bnbw == 1 && item.sqsl > 0)
							if (pjbn) {
								fuwu_f = 0
							}
						}
					}
					this.fee.fuwu_f = fuwu_f
					this.fee.fcf = fcf
					this.fee.pjf = pjf
					this.fee.zdjmje = this.jmf.md + this.jmf.bn + this.jmf.xj
					this.fee.sfzj = this.fee.fuwu_f + this.fee.fcf + this.fee.pjf - this.fee.zdjmje

					// 完工信息中照片水印
					this.onChooseComplete()
					const length = this.numList.length - 1
					if (flag && length > this.stepCurrent) {
						this.stepCurrent++
					}
				} else if (this.stepCurrent === 2) {
					// 完工信息
					this.$refs.uForm.validate(valid => {
						if (!valid) {
							flag = false
						}
					})
					if (flag) {
						var reg = /^[0-9]{6}\/[0-9]{8}$/
						// 判断是否输入装机室内SN码
						const snFlag = this.gdzcp.every(item => {
							return !!item.jjsn && reg.test(item.jjsn)
						})
						if (!snFlag && this.gdlx.includes('拆机')) {
							this.$refs.uToast.show({
								type: 'error',
								title: '请选输入正确拆机室内SN码'
							})
							return false
						}
						flag = this.imgSetting.every(im => {
							if (im.required == 1) {
								if (!im.value || im.value.length === 0) {
									const err = `请上传${im.words}`
									this.$refs.uToast.show({
										type: 'error',
										title: err
									})
									return false
								} else {
									return true
								}
							} else {
								return true
							}
						})
					}
					if (this.detail.gdlx === '测量') {
						this.gdcljg = JSON.parse(JSON.stringify(this.gdcljg))
					} else if (this.detail.gdlx === '换货') {
						const jjFlag = this.gdzcp.some((im) => {
							return im.cpsn === this.form.jjsnm
						})
						if (this.form.jjsnm === this.formSnm || jjFlag) {
							this.$refs.uToast.show({
								type: 'error',
								title: '新旧机SN码重复，请修正后再提交'
							})
							return false
						}
						const reg = /^[0-9A-Za-z]{6}\/[0-9A-Za-z]{8}$/
						if (!reg.test(this.form.jjsnm)) {
							this.$refs.uToast.show({
								type: 'error',
								title: '请输入正确和完整的旧件SN码（6位前缀/8位后缀）；若扫码有带出“SN:”，需手动去掉；特殊机型，联系业务管理员提供通用SN码'
							})
							return false
						}
					}
					const length = this.numList.length - 1
					if (flag && length > this.stepCurrent) {
						this.handleOrderTag()
					}
				}
			},

			// 第二步计算
			secondStep() {
				this.stepCurrent++
			},

			handleComplate() {
				let scpdsj = this.detail.scpdsj || ''
				scpdsj = scpdsj.replace(/-/g, '/')
				let preDate = new Date(scpdsj)
				preDate = preDate.getTime()
				const now = Date.now()
				const duration = now - preDate
				if (duration < 14400000) {
					this.modalShow = true
					this.cancelText = '关闭提示'
					this.confirmText = '完成服务'
					this.modalTxt = '疑似异常！本次完工时效小于正常作业4小时。如没有问题，请忽略！点击完成服务提交工单。'
					this.confirmType = 'complate'
				} else {
					this.complate()
				}
			},
			// 完成服务
			async complate() {
				if (!this.signNameImgSrc) {
					this.$refs.uToast.show({
						type: 'error',
						title: '请客户输入签名'
					})
					return false
				}
				if (this.paymentMethod === 'xssk' && this.fee.sfzj > 0 && !this.ipay) {
					this.$refs.uToast.show({
						type: 'error',
						title: '系统暂未匹配到付款成功的记录，请确认收款成功后，再提交完成服务'
					})
					return false
				}
				// 需修改和额外提交数据
				let subData = this.$u.deepClone(this.formComplate)
				// 兼容维修空调单
				subData.snm = this.formSnm
				// 提交数据字典的值
				for (let k in subData) {
					const key = `_${k}_`
					if (this.productBase[key]) {
						subData[k] = this.productBase[key]
					}
					// 获取产品69码，工单保内外
					if (k === 'cp69m') {
						subData[k] = this.productBase.ljm
					}
				}
				subData['gdbnw'] = this.formComplate['gdbnw'] === '保内' ? 'bn' : 'bw'
				// 关联产品编号
				subData['glcpbh'] = this.formSnm.slice(0, 6)
				// 购买渠道
				subData['gmqd'] = this.detail['_gmqd_']
				// 产品数量
				subData['chanpin_sl'] = this.detail['chanpin_sl'] || 1

				const partsList = getApp().globalData.partsList || []
				let pjsymx = [] // 配件申请明细
				let hcsymx = [] // 辅材申请明细
				const keyArr = ['pjbh', 'pjmc', 'pjxh', 'peijian_fl', 'dw', 'sfxfj', 'pjlx', 'pjlb', 'pjpl',
					'hxck'
				]
				const myInfo = uni.getStorageSync('myInfo') || {}
				const now = new Date()
				const cjsj = this.dayjs(cjsj).format('YYYY-MM-DD HH:ss:mm')
				partsList.forEach(part => {
					part.sysl = part.reworkNumber
					if (part.tabKey === 'pj' || part.tabKey === 'allPj') {
						const obj = {
							glgdbh: this.detail.gdbh,
							pjdj: part.xinjian_jg,
							lsj: part.lsj,
							sysl: part.reworkNumber,
							hxzt: part.bnbw == 1 ? 'dhx' : 'bhx',
							khxsl: part.bnbw == 1 ? part.reworkNumber : 0,
							sykhxsl: part.bnbw == 1 ? part.reworkNumber : 0,
							wdbh: this.detail.wdbh,
							wdmc: this.detail.wdmc,
							sfxfj: part['_sfxfj_'],
							sfxm: myInfo.sfzxm,
							sfyhm: myInfo.xtyhm,
							cjsj,
							cjr: myInfo.xtyhm,
							'__action__': 'add'
						}
						keyArr.forEach(im => {
							const key = `_${im}_`
							obj[im] = part[key] !== undefined && part[key] !== null ? part[key] : part[
								im]
						})
						pjsymx.push(obj)
					} else {
						const obj = {
							glgdbh: this.detail.gdbh,
							hcmc: part.fcmc,
							hcxh: part['_cplb_'],
							zj: parseFloat(part.fcjg) * parseInt(part.reworkNumber),
							dj: part.fcjg,
							sysl: part.reworkNumber,
							'__action__': "add"
						}
						hcsymx.push(obj)
					}
				})
				// 完工信息数据
				const wgxx = {}
				for (let k in this.form) {
					const key = `_${k}_`
					if (this.form[key] !== undefined && this.form[key] !== null) {
						wgxx[k] = this.form[key]
					} else {
						wgxx[k] = this.form[k]
					}
					if (k === 'sflw' || k === 'yaohao_pcg') {
						wgxx[k] = this.form[k] ? 's' : 'f'
					}
				}
				const nameUrl = uni.getStorageSync('signNameImg') || {
					result: ''
				}
				// 费用字段
				const fy = this.fee
				if (this.detail.gdlx === '测量') {
					subData = Object.assign(subData, fy, {
						pjsymx,
						hcsymx,
					})
				} else if (this.detail.gdlx === '退货' || this.detail.gdlx === '换货') {
					subData = Object.assign(subData, wgxx)
				} else {
					subData = Object.assign(subData, wgxx, fy, {
						pjsymx,
						hcsymx,
					})
				}
				let globalData = getApp().globalData
				const detail = globalData.order || {}
				const params = {
					case_id: detail.workitemData.case_id,
					handleRemarks: wgxx.gdblbz,
					handleWay: this.wayIndex,
					workitem_id: detail.workitemData.workitem_id,
					tableid: this.tableidArr[this.subKey],
				}
				params[this.subKey] = subData
				params[this.subKey].gdbh = this.detail.gdbh // 工单编号
				if (this.detail.gdlx === '拆机') {
					params.handleWay = 'clwc'
					params[this.subKey].fuwu_xm = this.wayIndex
					params[this.subKey].sqlb = this.wayIndex
					params[this.subKey].gdzcp = this.gdzcp
				} else if (this.detail.gdlx === '测量') {
					params[this.subKey].gdcljg = this.gdcljg.map(item => {
						const obj = {}
						for (let k in item) {
							obj[k] = item[k].value
						}
						return obj
					})
				} else if (this.detail.gdlx === '安装') {
					// 安装单，维修单，小程序或PC端完工时，对应变更{工单类型}的子类、{诉求类别}。
					if (this.wayIndex === 'clwc') {
						params[this.subKey].fuwu_xm = 'bdaz'
						params[this.subKey].sqlb = 'bdaz'
					} else if (this.wayIndex === 'xzjd' || this.wayIndex === 'jcwc') {
						params[this.subKey].fuwu_xm = 'smjc'
						params[this.subKey].sqlb = 'smjc'
					}
				} else if (this.detail.gdlx === '维修') {
					if (this.wayIndex === 'clwc') {
						params[this.subKey].fuwu_xm = 'bdwx'
						params[this.subKey].sqlb = 'bdwx'
					} else if (this.wayIndex === 'xzjd' || this.wayIndex === 'jcwc') {
						params[this.subKey].fuwu_xm = 'smjc2'
						params[this.subKey].sqlb = 'smjc2'
					}
				}
				let arr = []
				this.imgSetting.forEach(im => {
					if (im.value) {
						arr.push(im.value)
					}
				})
				this.imgLast.forEach(im => {
					if (im.value) {
						arr.push(im.value)
					}
				})
				params[this.subKey].xcwgsczp = arr
				params[this.subKey].khqz = [nameUrl.result]
				if (this.detail.gdlx === '退货' || this.detail.gdlx === '换货') {
					const arr = ['khqz', 'fuwu_f', 'sfzj', 'zdjmje', 'weixiu_cd', 'yhje']
					arr.forEach(key => {
						delete params[this.subKey][key]
					})
				}
				// 收款方式
				params[this.subKey].skfs = this.paymentMethod
				this.$u.post('/admin/workitem/processing', params).then(res => {
					if (res.code === 0) {
						this.$refs.uToast.show({
							type: 'success',
							title: '工单办理成功',
							callback() {
								uni.reLaunch({
									url: `../pending/pending?state=processing&title=待处理`
								})
							}
						})
					} else {
						this.$refs.uToast.show({
							type: 'error',
							title: `${res.message},请与管理员联系`
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '../modulePublic/scss/public.scss';

	.page {
		background-color: #FFFFFF;
	}

	// 收费明细
	.fee_head {
		position: relative;

		.img_box {
			position: absolute;
			right: 80rpx;
			top: -30rpx;
			transform: rotate(45deg);
		}
	}

	.line_box {
		width: 100%;
		box-sizing: border-box;
		padding: 32rpx;
		border-bottom: 1rpx solid #f1f1f1;

		.title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #666;
			font-size: 32rpx;

			.money {
				color: red;
			}
		}

		.content {
			margin-top: 20rpx;
			color: #999;

			.list {
				margin-top: 8rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
	}


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

	/deep/ .u-add-tips {
		font-size: 24rpx;
	}

	/deep/.flex_center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.foot_border {
		width: 100%;
		padding: 20rpx 0;
		box-sizing: border-box;
		border-top: 1rpx solid #f1f1f1;
		margin-top: 20rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	// 收款方式
	.center {
		padding: 20rpx 36rpx;
	}
</style>
