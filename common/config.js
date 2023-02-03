export default {
	//版本号
	version: '1.0.0',
	//发行时间
	release: '2020-10-31',
	//发行商，首页底部版权信息
	publisher: '深圳市笃实科技有限公司',
	//程序名称，如首页顶部标题
	name: '成压服务',
	//mock开关
	mock: false,
	//调试环境接口地址																
	urlDevelopment: 'https://dev.doscs.com/demo/chengya/doscall',  //https://dev.doscs.com/demo/chengya/doscall
	//生产环境接口地址
	urlProduction: 'https://cy.doscs.com/doscall',   //'https://cy.doscs.com/doscall',
	//后端接口地址，如果为空则根据运行环境自动决定使用urlDevelopment或urlProduction
	url: '',
	//banner, 首页顶部轮播图片，可以是多张图片 app/Setting/getSetting通过这个接口获取
	banner: [
		'/static/banner.jpg'
	],
	//个人中心-》服务时间，仅展示
	serviceTime: '8:00-17:30',
	//个人中心-》服务热线，点击后启动拨号功能
	serviceNumber: '4001002632',
	//腾讯地图定位位置服务
	tencentSdkKey: 'EHRBZ-WB4WX-Y3B44-7ZHRB-SXYLQ-LSB6Z',
	//腾讯地图地图选点服务
	tencentChooseLocation: 'KIPBZ-ADGKP-K6GDV-LQMYL-62T53-2IFYX',
	//登录界面显示demo按钮
	showDemo: false,
	// 是否开启微信验证 1开启，0不开启
	bindingWechat: 1,
	// tab我的相关配置
	mineInfo: {},
	// appid和secret
	appid: 'wxb73281a66571ef20',
	appSecret: ''
}
