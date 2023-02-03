const sf = [{
		id: 0,
		name: '待处理',
		state: 'dcl',
		icon: 'daichuli',
		key: 'processing',
		type: 'order',
	}, {
		id: 1,
		name: '待预约',
		state: 'dyy',
		icon: 'daiyuyue',
		key: 'appointment',
		type: 'order',
	}, {
		id: 2,
		name: '待打卡',
		state: 'ddk',
		icon: 'daidaka',
		key: 'ondoor',
		type: 'order',
	}, {
		id: 3,
		name: '待完工',
		state: 'dwg',
		icon: 'daiwangong',
		key: 'finishing',
		type: 'order',
	}, {
		id: 4,
		name: '已完工',
		state: 'ywg',
		icon: 'yiwangong',
		key: 'finished',
		type: 'order',
	}, {
		id: 5,
		name: '已完结',
		state: 'ywj',
		icon: 'quanbudingdan',
		type: 'switchTab',
	}, {
		id: 6,
		name: '已取消',
		state: 'yqx',
		icon: 'yiquxiao',
		type: 'switchTab',
	}, {
		id: 7,
		name: '暂停单',
		state: 'ztd',
		icon: 'zantingdan',
		type: 'switchTab',
	},
	// {
	// 	id: 8,
	// 	name: '预警工单',
	// 	state: 'yujing',
	// 	icon: 'daichuli',
	// 	key: 'yujing',
	// 	type: 'order',
	// }, 
	// {
	// 	id: 9,
	// 	name: '超时工单',
	// 	state: 'chaoshi',
	// 	icon: 'daichuli',
	// 	key: 'chaoshi',
	// 	type: 'order',
	// }, 
	{
		id: 10,
		name: '催单客诉',
		state: 'cdks',
		icon: 'daibankesu',
		type: 'switchTab',
	},
	{
		id: 11,
		name: '日程',
		state: 'rc',
		icon: 'gengxinshuoming',
		type: 'rc'
	}, {
		id: 12,
		name: '消息中心',
		state: 'xxzx',
		icon: 'xiaoxizhongxin',
		type: 'xxzx'
	}
]

const wd = [{
	id: 0,
	name: '待处理',
	state: 'dcl',
	icon: 'daichuli',
	key: 'processing',
	type: 'order',
}, {
	id: 1,
	name: '已处理',
	state: 'ycl',
	icon: 'yichuli',
	key: 'handled',
	type: 'order',
}, {
	id: 2,
	name: '待派单',
	state: 'dpd',
	icon: 'daipaidan',
}, {
	id: 3,
	name: '待办客诉',
	state: 'cdks',
	icon: 'daibankesu',
	type: 'switchTab',
}, {
	id: 5,
	name: '已完结',
	state: 'ywj',
	icon: 'quanbudingdan',
	type: 'switchTab',
}, {
	id: 6,
	name: '已取消',
	state: 'yqx',
	icon: 'yiquxiao',
	type: 'switchTab',
}, {
	id: 7,
	name: '工单统计',
	state: 'gdtj',
	icon: 'gongdan'
}, {
	id: 8,
	name: '消息中心',
	state: 'dcl',
	icon: 'xiaoxizhongxin',
	type: 'xxzx'
}]

const dqyy = [{
	id: 0,
	name: '待处理',
	state: 'dcl',
	icon: 'daichuli',
	key: 'processing',
	type: 'order',
}, {
	id: 1,
	name: '已处理',
	state: 'ycl',
	icon: 'yichuli',
	key: 'handled',
	type: 'order',
}, {
	id: 3,
	name: '待办客诉',
	state: 'cbks',
	icon: 'daibankesu',
	type: 'switchTab',
}, {
	id: 5,
	name: '已完结',
	state: 'ywj',
	icon: 'quanbudingdan',
	type: 'switchTab',
}, {
	id: 7,
	name: '工单统计',
	state: 'gdtj',
	icon: 'gongdan'
}, {
	id: 8,
	name: '消息中心',
	state: 'dcl',
	icon: 'xiaoxizhongxin',
	type: 'xxzx'
}]
const icon = {
	'催单客诉': 'cuidankesu',
	'暂停单': 'zantingdan',
	'已取消': 'yiquxiao',
	'全部工单': 'quanbudingdan',
	'我的日程': 'wodeyiban',
	'待预约': 'daiyuyue',
	'待打卡': 'daidaka',
	'待完工': 'daiwangong',
	'待处理': 'daichuli',
	'待鉴定': 'daijianding',
	'已处理': 'yichuli',
	'已完工': 'yiwangong',
	'待结算': 'daijiesuan',
	'已结算': 'yijiesuan',
	'配件申请': 'peijianshenqing',
	'我的待办': 'wodedaiban',
	'我的已办': 'wodeyiban',
	'历史发起': 'wofaqide',
	'我的发起': 'wofaqide',
	'工单统计': 'gongdan',
	'待派单': 'daipaidan',
	'待办客诉': 'daibankesu',
	'收费标准': 'fuwubiaozhun',
	'产品百科': 'chanpinbaike',
	'操作指引': 'caozuozhiyin',
	'服务政策': 'fuwuzhengce',
	'故障自查': 'guzhangzijian',
	'在线考试': 'zaixiankaoshi',
	'论坛中心': 'luntanzhongxin',
	'状态说明': 'zhuangtaishuoming',
	'消息中心': 'xiaoxizhongxin',
	'接单学习': '',
}

export default {
	sf,
	wd,
	dqyy,
	icon
}
