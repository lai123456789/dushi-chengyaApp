<template>
	<view>
		<view class="u-p-32" style="background-color: white;">
			<view class="u-flex u-col-top">
				<view class="u-flex-1" v-if="userInfo">
					<view class="u-padding-top-10 u-flex">
						<text class="u-font-xl">{{userInfo.xm || ''}}</text>
						<view class="u-m-l-32 u-m-r-16" v-if="userInfo.gw">
							<u-tag type="primary" mode="plain" size="mini" :text="userInfo.gw"></u-tag>
						</view>
						<view v-if="userInfo.zc">
							<u-tag type="success" mode="plain" size="mini" :text="userInfo.zc"></u-tag>
						</view>
					</view>
					<view class="u-tips-color u-padding-top-10">{{userInfo.dhhm}}</view>
					<view class="u-content-color u-padding-top-20 u-padding-bottom-10">{{userInfo.ssfgs}}</view>
				</view>
				<view v-if="userInfo && userInfo.zp !== '[]'">
					<image class="u-m-10" :src="configAll.url + JSON.parse(userInfo.zp)[0].filePath"
						style="width: 120upx; height: 120upx; border: 1upx solid #e4e7ed; border-radius: 50%;"></image>
				</view>
			</view>
		</view>
		<u-gap></u-gap>
		<u-cell-group>
			<u-cell-item :arrow="true" v-for="(item, index) in data1" :key="index" :title="item.name" :value="item.info"
				@click="callFunc(item.handler,item)">
				<text slot="icon" class="iconfont" :class="item.icon"
					style="width: 40rpx; height: 40rpx; margin-right: 16rpx;"></text>
				<u-badge type="error" :count="item.count" :offset="[35, 70]"></u-badge>
			</u-cell-item>
		</u-cell-group>
		<u-gap></u-gap>
		<u-cell-group>
			<u-cell-item :arrow="true" v-for="(item, index) in data2" :key="index" :title="item.name" :value="item.info"
				@click="callFunc(item.handler,item)">
				<text slot="icon" class="iconfont" :class="item.icon"
					style="width: 40rpx; height: 40rpx; margin-right: 16rpx;"></text>
			</u-cell-item>
		</u-cell-group>
		<u-gap></u-gap>
		<u-cell-group>
			<u-cell-item :arrow="true" v-for="(item, index) in data3" :key="index" :title="item.name" :value="item.info"
				@click="callFunc(item.handler,item)">
				<text slot="icon" class="iconfont" :class="item.icon"
					style="width: 40rpx; height: 40rpx; margin-right: 16rpx;"></text>
			</u-cell-item>
		</u-cell-group>
		<u-gap></u-gap>
		<u-cell-group>
			<u-cell-item :arrow="true" v-for="(item, index) in data4" :key="index" :title="item.name" :value="item.info"
				@click="callFunc(item.handler,item)">
				<text slot="icon" class="iconfont" :class="item.icon"
					style="width: 40rpx; height: 40rpx; margin-right: 16rpx;"></text>
			</u-cell-item>
		</u-cell-group>
		<u-gap></u-gap>
		<!-- ???????????? -->
		<u-modal v-model="show" :content="content" :show-cancel-button="true" @confirm="onConfirm"></u-modal>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				configAll: this.config,
				userInfo: {},
				loading: false,
				show: false,
				showType: '',
				content: '????????????????????????',
				data1: [{
					icon: 'xiaoxizhongxin',
					name: '????????????',
					info: '',
					iconColor: '#ffaa00',
					count: ''
				}],
				data2: [
					// 	{
					// 	icon: 'kefuzhongxin',
					// 	name: '????????????',
					// 	info: this.config.serviceNumber,
					// 	iconColor: '#6EC2BD'
					// },
					{
						icon: 'shezhi',
						name: '??????',
						info: '',
						iconColor: '#8F9DA6'
					}
				],
				data3: [{
					icon: 'gengxinshuoming',
					name: '???????????????',
					info: '',
					iconColor: '#F1BF42'
				}, {
					icon: 'guanyuwomen',
					name: '????????????',
					info: this.config.versionApp || '1.0.00',
					iconColor: '#377FF7'
				}],
				data4: [{
					icon: 'tuichudenglu',
					name: '????????????',
					info: '',
					handler: 'logoutModal',
					iconColor: '#D4584A'
				}]
			}
		},
		onShow() {
			// this.userInfo = uni.getStorageSync('userInfo')
			this.userInfo = uni.getStorageSync('myInfo') //myInfo
			console.log('this.userInfo', this.userInfo);
			const token = uni.getStorageSync('token')
			if (!token) {
				uni.redirectTo({
					url: '../mine/login'
				})
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList() {
				this.$u.post('/app/User/messageMenu').then(res => {
					this.data1[0].count = res.result[1].count || ''
				})
			},
			callFunc(func, item) {
				if (item.name == '????????????') {
					uni.makePhoneCall({
						phoneNumber: item.info,
						success: () => {
							console.log('??????????????????')
						}
					});
				} else if (item.name === '????????????') {
					uni.navigateTo({
						url: '../mine/information'
					})
				} else if (item.name === '????????????') {
					// #ifdef APP-PLUS
					uni.navigateTo({
						url: '../modules/auth/authorize'
					})
					// #endif
					// #ifdef MP-WEIXIN
					this.showType = 'auth'
					this.logoutModal()
					// #endif
				} else if (typeof(this[func]) == 'function') {
					this.showType = 'logout'
					this[func]()
				} else if (item.name === '??????') {
					uni.navigateTo({
						url: '../mine/setting'
					})
				} else if (item.name === '????????????') {
					uni.navigateTo({
						url: '../mine/wallet/wallet'
					})
				} else if (item.name === '???????????????') {
					uni.navigateTo({
						url: '../mine/wallet/myCard'
					})
				} else {
					this.$u.toast('???????????????')
				}
			},
			logoutModal() {
				this.show = !this.show
				this.content = this.showType === 'logout' ? '????????????????????????' : '???????????????????????????????????????APP???????????????????????????????????????????????????????????????'
			},
			onConfirm() {
				if (this.showType === 'logout') {
					this.logout()
				}
			},
			logout() {
				this.loading = true
				this.$u.get('/app/Index/logout').then(res => {
					this.loading = false;
					//?????????????????? ????????????????????????
					uni.clearStorageSync();
					uni.reLaunch({
						url: '/pages/mine/login'
					})
				})
			}
		},
	}
</script>
