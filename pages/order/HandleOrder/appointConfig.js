// 大修改造/故障处理/新机安装/维保流程 004工程师接单 - 完成办理准入资格节点 的流程id
const transtionId_list = [
	// 维保
	'e71a181fbaa24edd98c095f1e9e873f5', //003分公司领导审核
	'41a93addc6df4a0587f83b4f8910c41d', //004 待工程师接单
	'b1a32087297f4b05bc7e33a9bac72f95', //005 技术员准备方案
	'de8a27674e604fe29e47257392b630d1', //006 工程师施工准备
	'3955ac3e0b04435f968fb4ff454b12ad', //007 调度员交底
	'ebebce568df94ed69f9c7c4345ff930f', //008 打卡出发
	'd55a5fb892f941be9a0b3a27405d6835', //009 到达打卡
	'91e130044d1c48438be36f97096b0a20', //010节点，完成办理准入资格
	//大修改造
	'd4cabd1f002249f686077aafa8ee6e7c', '9964c438f016474199bbfcf882c98684',
	'1079e231e5744d42a37a967e1d6379ef', '22fdfc49fcb74f5f817ef7562e911571',
	'56be4f3f0ca64fa180278abf14d099d0', 'dea9b11aa3964510b83d0cc38f316106', '1628772027144f608ba20a2256433f98',
	//新机安装
	'c45995d9426643cd82fc934ef1f9334a', 'ead0c7cbab1f49af81ea0ee12f794968',
	'297f847f09184ca48155f9824a38cff8', 'b9cd86f9291140208d89994fb26e15fd',
	'b60d76526a4845488a57b91ff27142df', 'ae8e3fdffb944f1db968e05a32c5b4d3', 'bc30c8d11164424f8b6a26f99b5931bd',
	// 故障处理
	'f1816707f29645deb793712e948ac3f7', '2e1483167e86401d8b619f357c461b2c',
	'1038ebd81c81416a88f30b8203806c3e', '4171cc0362c347be89409af042d27c38',
	'aafe0bc2b41d45408b799e1aa0c368b4', 'ae149b8605a94ad58f778f10dc99c7f1', 'c51f5bf1c6224a588e6b62dcfacddb25'
]

// 维保单流程的办理节点如下
//003、分公司领导审核
const fgsldsh = {
	gdlx: 'crm_xjaz',
	wayList: [{
		way: '审核通过',
		wayIndex: 'shtg',
		handle: [{
			field: 'xmzgs',
			name: '项目总工时',
			placeholder: '0',
			type: 'number',
			value: '0',
			show: false,
			required: true,
			border: true
		}]
	},{
		way: '审核不通过',
		wayIndex: 'shbtg',
		handle: []
	},{
		way: '取消',
		wayIndex: 'qxgd',
		handle: []
	}],
	rules: {
		xmzgs: [{
			required: true,
			message: '请输入项目总工时',
			trigger: ['change', 'blur'],
		}]
	}
}

//004、待工程师接单
const dgcsjd = {
	gdlx: 'crm_xjaz',
	tableid: '23a2a43a04225a22d5413727ff474c6e',
	wayList: [{
		way: '接收', //'预约成功',
		wayIndex: 'jsgd', //'yuyue_cg',
		handle: [{
			field: 'fxgcs', //'yysmsj', fxgcs_data
			name: '辅修',
			placeholder: '请点击右侧图标选择',
			type: 'textDataChange',
			show: false,
			required: false,
			disabled: true,
			border: true
		}]
	}, {
		way: '退回',
		wayIndex: 'thgd',
		handle: [{
			field: 'tdyy',
			name: '退单原因',
			placeholder: '请输入退回原因',
			type: 'textarea',
			value: '',
			show: false,
			required: true,
			border: true
		}]
	}],
	rules: {
		fxgcs: [{
			required: false,
			message: '请选择辅修',
			trigger: ['change', 'blur'],
		}],
		tdyy: [{
			required: true,
			message: '请输入退回原因',
			trigger: ['change', 'blur'],
		}]
	}
}
//005、技术员准备方案
const jsyzbfa = {
	gdlx: 'crm_xjaz',
	tableid: '23a2a43a04225a22d5413727ff474c6e',
	wayList: [{
		way: '准备完成',
		wayIndex: 'zbwc',
		handle: [{
			field: 'zbwc'
		}]
	}],
	rules: {}
}

//006、工程师施工准备
const gcssgzb = {
	gdlx: 'crm_xjaz',
	tableid: '23a2a43a04225a22d5413727ff474c6e',
	wayList: [{
		way: '完成施工准备',
		wayIndex: 'wcsgzb',
		handle: []
	}],
	rules: {}
}
// 010
const wcblzrzg = {
	// gdlx: 'crm_thd',
	// tableid: '07f974cf838f0b817e61d6e485854efe',
	wayList: [{
		way: '完成办理准入资格',
		wayIndex: 'wcblzrzg',
		handle: []
	}]
}
//011
const wcbyqdqzh = {
	gdlx: 'crm_xjaz',
	tableid: '23a2a43a04225a22d5413727ff474c6e',
	wayList: [{
		way: '完成保养前-氮气置换',
		wayIndex: 'wcbyqdqzh',
		handle: []
	}],
	rules: {}
}

//012
const wcjdxnjc = {
	gdlx: 'crm_xjaz',
	tableid: '23a2a43a04225a22d5413727ff474c6e',
	wayList: [{
		way: '完成精度性能检测',
		wayIndex: 'wcjdxnjc',
		handle: [{
			field: 'wcjdxnjc'
		}]
	}],
	rules: {},
	byzp: [{
			name: '检查十字头滑道间隙',
			file: '',
			showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
		},
		{
			name: '检查曲轴轴向、连杆轴向间隙',
			file: '',
			showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
		},
		{
			name: '检查气阀',
			file: '',
			showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
		},
		{
			name: '电机和风扇轴承加脂',
			file: '',
			showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
		},
		{
			name: '紧固主轴承螺栓、连杆螺栓',
			file: '',
			showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
		},
		{
			name: '机组保养后运行参数',
			file: '',
			showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
		},
		{
			name: '测量活塞杆跳动',
			file: '',
			showString: ['机组半年保', '机组年保']
		},
		{
			name: '联轴器对中检测',
			file: '',
			showString: ['机组半年保', '机组年保']
		},
		{
			name: '检查链条情况',
			file: '',
			showString: ['机组半年保', '机组年保']
		},
		{
			name: '检查十字头销及销孔间隙',
			file: '',
			showString: ['机组年保']
		},
		{
			name: '检查压缩缸内径',
			file: '',
			showString: ['机组年保']
		},
		{
			name: '检查活塞杆及活塞外径',
			file: '',
			showString: ['机组年保']
		},
		{
			name: '检查活塞死点间隙',
			file: '',
			showString: ['机组年保']
		},
		{
			name: '检查填料、刮油环',
			file: '',
			showString: ['机组年保']
		},
		{
			name: '检查活塞环、支撑环',
			file: '',
			showString: ['机组年保']
		},
		{
			name: '检查紧固电和压缩机底座螺栓、联轴器螺栓、压缩缸上连接螺栓、法兰螺栓、管卡螺栓等',
			file: '',
			showString: ['机组年保']
		}
	]
}
//013
const wcqjdjc = {
	gdlx: 'crm_xjaz',
	tableid: '23a2a43a04225a22d5413727ff474c6e',
	wayList: [{
		way: '完成清洁度检查',
		wayIndex: 'wcqjdjc',
		handle: [{
			field: 'wcqjdjc'
		}]
	}],
	rules: {},
	byzp: [{
			name: '清洗曲轴箱',
			file: '',
			showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
		},
		{
			name: '清洗Y型过滤器',
			file: '',
			showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
		}
	]
}

//017
const wcjzsyh = {
	gdlx: 'crm_xjaz',
	tableid: '23a2a43a04225a22d5413727ff474c6e',
	wayList: [{
		way: '完成机组试运行	',
		wayIndex: 'wcjzsyh',
		handle: [{
			field: 'wcjzsyh'
		}]
	}],
	rules: {},
	byzp: [{
		name: '机组试运行',
		file: '',
		showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
	}]
}
//019
const wcxcjj = {
	gdlx: 'crm_xjaz',
	tableid: '23a2a43a04225a22d5413727ff474c6e',
	wayList: [{
		way: '完成现场交接',
		wayIndex: 'wcxcjj',
		handle: [{
			field: 'wcxcjj'
		}]
	}],
	rules: {},
	byzp: [{
		name: '现场交接',
		file: '',
		showString: ['机组月保', '机组季保', '机组半年保', '机组年保']
	}]
}
//待现场试验交接
const dxcsyjj = {
	gdlx: 'crm_xjaz',
	wayList: [{
		way: '完成现场试验交接',
		wayIndex: 'wcxcsyjj',
		handle: [{
			field: 'tysj',
			name: '投用时间',
			placeholder: '0',
			type: 'date',
			value: '',
			show: false,
			required: true,
			border: true
		}]
	}],
	rules: {
		tysj: [{
			required: true,
			message: '请输入投用时间',
			trigger: ['change', 'blur'],
		}]
	}
}
//（故障处理工单）013节点、跟上面的013节点是不同工单类型
const gzyy = {
	gdlx: 'crm_xjaz',
	tableid: '23a2a43a04225a22d5413727ff474c6e',
	wayList: [{
		way: '完成情况判断',
		wayIndex: 'wcqkpd',
		handle: [{
			field: 'gzyy',
			name: '故障原因',
			placeholder: '请选择故障原因',
			type: 'select',
			list: [{
				number: 'rwyy2',
				name: '人为原因'
			}, {
				number: 'pjyy2',
				name: '配件原因'
			}, {
				number: 'sj',
				name: '设计'
			}, {
				number: 'zpyy',
				name: '装配原因'
			}],
			show: false,
			required: true,
			border: true
		}]
	}],
	rules: {
		gzyy: [{
			required: true,
			message: '请选择故障原因',
			trigger: ['change', 'blur'],
		}]
	}
}

export default {
	transtionId_list,
	fgsldsh,
	dgcsjd,
	wcblzrzg,
	jsyzbfa,
	gcssgzb,
	wcbyqdqzh,
	wcjdxnjc,
	wcqjdjc,
	wcjzsyh,
	wcxcjj,
	dxcsyjj,
	gzyy
}
