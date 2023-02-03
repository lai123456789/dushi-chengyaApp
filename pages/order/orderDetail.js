const allList = {
	//客户基础信息
	khjcxx: [{
		name: '业务编号',
		field: 'gdbh',
		status: 'all',
		content: 'WH2021201230'
	}, {
		name: '作业区',
		field: 'zyq',
		status: 'all',
		content: '西南分公司'
	}, {
		name: '联系人',
		field: 'lxr1xm',
		status: 'all',
		content: '张小明'
	}, { //第二列
		name: '增压站',
		field: 'zyz',
		status: 'all',
		content: '西南分公司'
	}, {
		name: '客户单位（矿区）',
		field: 'khdwkq',
		status: 'all',
		content: '中油煤气矿'
	}, {
		name: '联系电话',
		field: 'lxr1dh',
		status: 'all',
		content: '131708292983'
	}],
	//机组信息
	azdz: [{
		name: '机组型号',
		field: 'jzxh',
		status: 'all',
		content: 'DTY1120ML664'
	}, {
		name: '客户产品编号',
		field: 'glkhcpbh',
		status: 'all',
		content: 'KHCP012451'
	}, {
		name: '安装地点',
		field: 'azdd',
		status: 'all',
		content: '山西省/祁州市/保德县'
	}, {
		name: '安装详细地址',
		field: 'azxxdz',
		status: 'all',
		content: '大兴路119号一号村街道'
	}],
	jzxx: [{
			name: '出厂编号',
			field: 'ccbh',
			status: 'all',
			content: '201220'
		}, {
			name: '机组类型',
			field: 'jzlx',
			status: 'all',
			content: '天然气机驱动'
		}, {
			name: '安装单位',
			field: 'azdw',
			status: 'all',
			content: '西南分公司'
		}, {
			name: '制造单位',
			field: 'zzdw',
			status: 'all',
			content: '中油济柴成都压缩机厂'
		}, {
			name: '制造时间',
			field: 'zzsj',
			status: 'all',
			content: '2012-03-06'
		}, {
			name: '投用时间',
			field: 'tysj',
			status: 'all',
			content: '2014-09-23'
		}, {
			name: '机组运行状态',
			field: 'jzyhzt',
			status: 'all',
			content: '正常运行'
		}
		// ,{
		// 	name: '主机型号',
		// 	field: 'zjxh',
		// 	status: 'all',
		// 	content: 'DTY'
		// }
		, {
			name: '压缩机型号',
			field: 'ysjxh',
			status: 'all',
			content: '202008'
		}, {
			name: '累计运行时间',
			field: 'ljyhsj',
			status: 'all',
			content: '48000小时'
		}
	],
	//建单信息
	jdxx: [{
			name: '服务项目',
			field: 'fwxm',
			status: 'all',
			content: '机组月保'
		}, {
			name: '要求实施入场日期',
			field: 'yqssrcrq',
			status: 'all',
			content: '2021-06-03'
		}, //第二列
		{
			name: '处理单位',
			field: 'azdw',
			status: 'all',
			content: '西南分公司'
		}, {
			name: '预计完成日期',
			field: 'yjwcrq',
			status: 'all',
			content: '2021-06-31'
		}
	],
	jdxx2end: {
		name: '服务需求',
		field: 'fwxq',
		status: 'all',
		content: '尽快入场完成机组月保任务尽快入场完成尽快入场完成尽快入场完成尽快入场完成尽快入场完成尽快入场完成'
	},
	//派工信息
	pgxx: [{
			name: '调度员姓名',
			field: 'tdyxm',
			status: 'all',
			content: '刘亦菲'
		}, {
			name: '服务类型',
			field: 'fwlx',
			status: 'all',
			content: '三包内'
		}, {
			name: '派工时间',
			field: 'pgsj',
			status: 'all',
			content: '2021-06-03'
		}, {
			name: '主修电话',
			field: 'zxgcsdh',
			status: 'all',
			content: '13160512676'
		}, {
			name: '本项目必备技能',
			field: 'bxmbbjn',
			status: 'all',
			content: '压缩机修理'
		}, {
			name: '派工审核人',
			field: 'pgshr',
			status: 'all',
			content: '张大明'
		}, //第二列
		{
			name: '调度员电话',
			field: 'tdydh',
			status: 'all',
			content: '刘亦菲'
		}, {
			name: '技术员',
			field: 'jsy',
			status: 'all',
			content: '胡歌'
		}, {
			name: '主修',
			field: 'zxgcs',
			status: 'all',
			content: '吴彦祖'
		}, {
			name: '本项目必备证件',
			field: 'bxmbbzj',
			status: 'all',
			content: '安全管理证'
		}, {
			name: '项目总工时',
			field: 'xmzgs',
			status: 'all',
			content: '200小时'
		}, {
			name: '派工审核时间',
			field: 'pgshsj',
			status: 'all',
			content: '2021-06-05'
		}
	],
	//质量回馈 
	zlhk1: [{
			name: '业务通知单编号',
			field: 'ywtzdbh',
			status: 'all',
			content: ''
		}, {
			name: '签认单编号',
			field: 'qrdbh',
			status: 'all',
			content: ''
		},
		{
			name: '信息编号',
			field: 'xxbh',
			status: 'all',
			content: ''
		}, {
			name: '信息提出单位',
			field: 'xxdw',
			status: 'all',
			content: ''
		}, {
			name: '发出时间',
			field: 'fcsj',
			status: 'all',
			content: ''
		}, {
			name: '批转处理单位',
			field: 'pzcldw',
			status: 'all',
			content: ''
		}, {
			name: '联系人',
			field: 'lxr',
			status: 'all',
			content: ''
		}, {
			name: '联系电话',
			field: 'lxdh',
			status: 'all',
			content: ''
		}, {
			name: '要求解决时间',
			field: 'yqjjsj',
			status: 'all',
			content: ''
		}, {
			name: '急缓',
			field: 'wtjh',
			status: 'all',
			content: ''
		}, {
			name: '类别',
			field: 'lb',
			status: 'all',
			content: ''
		}, {
			name: '编号',
			field: 'bh',
			status: 'all',
			content: ''
		}, {
			name: '启用时间',
			field: 'qysj',
			status: 'all',
			content: ''
		}, {
			name: '运转时间',
			field: 'yzsj',
			status: 'all',
			content: ''
		}, {
			name: '使用单位',
			field: 'sydw',
			status: 'all',
			content: ''
		}
	],
	zlhk2: [{
		name: '地点',
		field: 'sydd',
		status: 'all',
		content: ''
	}, {
		name: '机组型号',
		field: 'jzxh',
		status: 'all',
		content: ''
	}],
	zlhk3: [{
		name: '信息内容',
		field: 'xxnr',
		status: 'all',
		content: ''
	}]
}

export default allList
