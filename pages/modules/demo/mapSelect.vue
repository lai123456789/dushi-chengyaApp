<!-- 
	1、登录腾讯开放平台：https://lbs.qq.com/dev/console/key/manage
	2、找到key管理 点击创建新密钥 创建一个
	3、页面引用 const chooseLocation = requirePlugin('chooseLocation');
	4、点击按钮跳转腾讯地图选点页面 （里面的key是开发者信息自己的key值，修改此处即可）
	uni.navigateTo({
		url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}` //&category=${category}
	});
	5、“微信小程序官方后台-设置-第三方服务-插件管理” 里点击 “添加插件”，搜索 “腾讯位置服务地图选点” 申请
	6、app.json（uniapp框架是在manifest.json文件）修改文件  代码如下
	   页面实例请看下方实例运行代码(点击源码视图 里面 找到 “小程序特有相关” 写在里面)
	    "plugins": {
	        "chooseLocation": {
	        "version": "1.0.5",
	        "provider": "wx76a9a06e5b4e693e"
	        }
	    },
		"permission": {
		        "scope.userLocation": {
		        "desc": "你的位置信息将用于小程序定位"
		        }
		    }
	
	具体可参照官方文档操作：https://lbs.qq.com/miniProgram/plugin/pluginGuide/locationPicker
 -->
<template>
	<view class="u-p-32">
		<u-button @click="getLocaltionMap">点击开始地图选点</u-button>
		<view class="u-p-t-40">
			注意事项：小程序appid需绑定该key值，否则打开跳转到页面跳转不了，显示空白，控制台会提示appid未授权
		</view>
	</view>
</template>
<script>
	//小程序平台环境
	// #ifdef MP-WEIXIN
	const chooseLocation = requirePlugin('chooseLocation'); //引用选点插件
	// #endif

	export default {
		data() {
			return {

			}
		},
		methods: {
			//获取用户地址 地图加列表选择 周边
			getLocaltionMap() {
				if (this.config.platform == 'MP-WEIXIN') {
					let _this = this
					uni.getLocation({
						type: 'wgs84',
						geocode: true,
						success: function(res) {
							if (res.errMsg == 'getLocation:ok') {
								console.log("地址信息如下res")
								console.log(res)
								//该Key值是自己创建新密钥成功后 返回的key值
								const key = _this.config.tencentChooseLocation; //使用在腾讯位置服务申请的key  
								const referer = '万利达厨卫'; //调用插件的app的名称
								const location = JSON.stringify({
									latitude: res.latitude,
									longitude: res.longitude
								});
								uni.navigateTo({
									url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}`
								});
							} else {
								uni.showToast({
									title: '当前地址获取失败',
									icon: 'none'
								});
							}
						}
					});
				} else {
					this.$u.toast('请在微信小程序中测试该功能')
				}

			},
		},
		onShow() {
			const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
			if (location) {
				console.log(location);
			}
		},
		onUnload() {
			// 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
			chooseLocation.setLocation(null);
		}
	}
</script>
