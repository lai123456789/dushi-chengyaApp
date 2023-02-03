const Mock = require('better-mock/dist/mock.mp.js')
import md5 from 'md5'
import {
	builder,
	getQueryParameters,
	getBody,
} from '../util'
const login = (options) => {
	const {
		username,
		password
	} = getBody(options)
	if (username === 'admin' && password === md5('dos123456')) {
		const token = 'mock-49b2f4830a53c47e25ec152909281608-' + new Date().valueOf()
		uni.setStorageSync('token', token)
		return builder({
			token: token,
			username: username
		})
	} else {
		return builder('登录失败', '用户名或密码错误', 4002)
	}
}
const getMyInfo = (options) => {
	const data = {
		"myInfo": {
			"id": "21",
			"xtyhm": "shenzhen002",
			"yhmm": "dos123456",
			"zsxm": "sz",
			"lxdh": "15919923549",
			"ssjs": "网点师傅",
			"zt": "启用",
			"zzzt": "在职",
			"zzsf": "正式员工",
			"sfjb": "高级工程师",
			"cyhm": "XL",
			"rzrq": "2020-11-14",
			"jsrz": "技术认证",
			"jzdz": "上海市,上海市,崇明区",
			"jzxxdz": "福田师傅的详细地址",
			"khyh": "中国银行9987",
			"yhkh": "41254511457441454514",
			"sfzhm": "41185565441125",
			"gkzp": "[]",
			"sfzzp": "[]",
			"qtfj": "[]",
			"glwdbh": "WD202011151535357496",
			"_cyhm_": "xl",
			"_jzdz_": "a4e0e38eaa449f590b53d1630c8e5c11,c002c32a76187434bc25c0037bd86040,134402e195d20b3600904970471184c7",
			"_sfjb_": "gjgcs",
			"_ssjs_": "wdsf",
			"_zt_": "d546e846ec00b450668fe0c88b891062",
			"_zzsf_": "zsyg",
			"_zzzt_": "zz"
		},
		"userinfo": {
			"id": "178",
			"userid": "1000178",
			"username": "shenzhen002",
			"realname": "sz",
			"phone": "15919923549",
			"status": "1",
			"letter": "sz|sz",
			"password": "bba9bcbb80f5c74d3a9cd92eb00b6b33",
			"reset_password": "0",
			"observer": "",
			"roleid": "12351d539d3384c5bdcf76e361b86395",
			"departmentid": "WD202011151535357496",
			"isleader": "0",
			"lastloginip": "183.11.70.133",
			"lastlogintime": "2020-11-18 10:28:21",
			"email": "",
			"sex": "男",
			"device": "",
			"extension": "",
			"setting": {
				"headImage": "https://ds.doscs.com/doscss_trunk/public/public/static/images/moren.gif"
			},
			"access_token": "8977d6b4f7eeb5b06a184c3502048459",
			"remarks": "",
			"update_user": "",
			"update_time": "2020-11-18 10:28:21",
			"priv": "",
			"rolename": "网点师傅",
			"disabled": "0",
			"departmentname": "深圳网点"
		},
		"licounts": [{
				"liname": "已结算",
				"count": "1598.00",
				"alias": "overMoney",
				"dw": "元"
			},
			{
				"liname": "已完单",
				"count": "865",
				"alias": "overCount",
				"dw": "单"
			},
			{
				"liname": "待结算",
				"count": "6542.63",
				"alias": "waitMoney",
				"dw": "元"
			}
		]
	}
	return builder(data)
}
const logout = (options) => {
	return builder('')
}
//用户登录
Mock.mock(/\/app\/Index\/login/, 'post', login)
//获取用户个人信息
Mock.mock(/\/app\/User\/getMyInfo/, 'post', getMyInfo)
//用户退出
Mock.mock(/\/app\/Index\/logout/, 'get', logout)
