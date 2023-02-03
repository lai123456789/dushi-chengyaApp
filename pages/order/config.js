class handleObj {
	'安装_clwc' = [{
		id: 0,
		field: 'liji_tscs',
		name: '立即通水测试',
		initValue: false
	}, {
		id: 1,
		field: 'tds_cs',
		name: '纯水TDS',
		initValue: 0,
		required: {
			required: true,
			type: 'number',
			message: '请输入纯水TDS',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'tds_fs',
		name: '废水TDS',
		initValue: 0,
		required: {
			required: true,
			type: 'number',
			message: '请输入废水TDS',
			trigger: ['change', 'blur']
		}
	}, {
		id: 3,
		field: 'tds_js',
		name: '进水TDS',
		initValue: 0,
		required: {
			required: true,
			type: 'number',
			message: '请输入进水TDS',
			trigger: ['change', 'blur']
		}
	}, {
		id: 4,
		field: 'butong_scssm',
		name: '不通水测试说明',
		initValue: '',
		required: {
			required: true,
			message: '请输入不通水测试说明',
			trigger: ['change', 'blur']
		}
	}, {
		id: 5,
		field: 'yaohao_pcg',
		name: '邀好评成功',
		initValue: false
	}, {
		id: 6,
		field: 'hpjt',
		type: 'image',
		name: '订单好评截图',
		initValue: '',
		required: {
			required: true,
			message: '请上传订单好评截图',
			trigger: ['change', 'blur']
		}
	}, {
		id: 7,
		field: 'sflw',
		name: '设备是否联网',
		initValue: false,
		required: {
			required: false,
		}
	}, {
		id: 8,
		field: 'didbh',
		name: 'DID编码',
		initValue: '',
		required: {
			required: false,
		}
	}, {
		id: 9,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
	'安装_jcwc' = [{
		id: 0,
		field: 'liji_tscs',
		name: '立即通水测试',
		initValue: false
	}, {
		id: 1,
		field: 'tds_cs',
		name: '纯水TDS',
		initValue: 0,
		required: {
			required: true,
			type: 'number',
			message: '请输入纯水TDS',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'tds_fs',
		name: '废水TDS',
		initValue: 0,
		required: {
			required: true,
			type: 'number',
			message: '请输入废水TDS',
			trigger: ['change', 'blur']
		}
	}, {
		id: 3,
		field: 'tds_js',
		name: '进水TDS',
		initValue: 0,
		required: {
			required: true,
			type: 'number',
			message: '请输入进水TDS',
			trigger: ['change', 'blur']
		}
	}, {
		id: 4,
		field: 'butong_scssm',
		name: '不通水测试说明',
		initValue: '',
		required: {
			required: true,
			message: '请输入不通水测试说明',
			trigger: ['change', 'blur']
		}
	}, {
		id: 5,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
	'安装_xzjd' = [{
		id: 0,
		field: 'gzlb',
		name: '故障类别',
		initValue: '',
		required: {
			required: true,
			message: '请选择故障类别',
			trigger: ['change', 'blur']
		}
	}, {
		id: 1,
		field: 'fwcs',
		name: '服务措施',
		initValue: '',
		required: {
			required: true,
			message: '请选择服务措施',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'sfjlgzxx',
		name: '故障记录',
		initValue: '',
		required: {
			required: true,
			message: '请输入故障记录',
			trigger: ['change', 'blur']
		}
	}, {
		id: 3,
		field: 'jyjdjg',
		name: '检验鉴定结果（多选）',
		initValue: '',
		required: {
			required: true,
			message: '请选择检验鉴定结果',
			trigger: ['change', 'blur']
		}
	}, {
		id: 4,
		field: 'jyjdxq',
		name: '详情',
		initValue: '',
		required: {
			required: true,
			message: '请输入检验鉴定详情',
			trigger: ['change', 'blur']
		}
	}, {
		id: 5,
		field: 'bzjdjg',
		name: '	包装鉴定结果（多选）',
		initValue: '',
		required: {
			required: true,
			message: '请选择包装鉴定结果',
			trigger: ['change', 'blur']
		}
	}, {
		id: 6,
		field: 'bzjdxq',
		name: '详情',
		initValue: '',
		required: {
			required: true,
			message: '请输入包装鉴定详情',
			trigger: ['change', 'blur']
		}
	}, {
		id: 7,
		field: 'wdlxxx',
		name: '网点联系信息	',
		initValue: '',
		required: {
			required: true,
			message: '请输入网点联系信息',
			trigger: ['change', 'blur']
		}
	},{
		id: 8,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]

	'维修_clwc' = [{
		id: 0,
		field: 'gzlb',
		name: '故障类别',
		initValue: '',
		required: {
			required: true,
			message: '请选择故障类别',
			trigger: ['change', 'blur']
		}
	}, {
		id: 1,
		field: 'fwcs',
		name: '服务措施',
		initValue: '',
		required: {
			required: true,
			message: '请选择服务措施',
			trigger: ['change', 'blur']
		}
	}, {
		id: 5,
		field: 'yaohao_pcg',
		name: '邀好评成功',
		initValue: false
	}, {
		id: 6,
		field: 'hpjt',
		type: 'image',
		name: '订单好评截图',
		initValue: '',
		required: {
			required: true,
			message: '请上传订单好评截图',
			trigger: ['change', 'blur']
		}
	}, {
		id: 7,
		field: 'sflw',
		name: '设备是否联网',
		initValue: false,
		required: {
			required: false,
		}
	}, {
		id: 8,
		field: 'didbh',
		name: 'DID编码',
		initValue: '',
		required: {
			required: false,
		}
	}, {
		id: 9,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]

	'维修_jcwc' = [{
		id: 0,
		field: 'gzlb',
		name: '故障类别',
		initValue: '',
		required: {
			required: true,
			message: '请选择故障类别',
			trigger: ['change', 'blur']
		}
	}, {
		id: 1,
		field: 'fwcs',
		name: '服务措施',
		initValue: '',
		required: {
			required: true,
			message: '请选择服务措施',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]

	'维修_xzjd' = [{
		id: 0,
		field: 'gzlb',
		name: '故障类别',
		initValue: '',
		required: {
			required: true,
			message: '请选择故障类别',
			trigger: ['change', 'blur']
		}
	}, {
		id: 1,
		field: 'fwcs',
		name: '服务措施',
		initValue: '',
		required: {
			required: true,
			message: '请选择服务措施',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'sfjlgzxx',
		name: '故障记录',
		initValue: '',
		required: {
			required: true,
			message: '请输入故障记录',
			trigger: ['change', 'blur']
		}
	}, {
		id: 3,
		field: 'jyjdjg',
		name: '检验鉴定结果（多选）',
		initValue: '',
		required: {
			required: true,
			message: '请选择检验鉴定结果',
			trigger: ['change', 'blur']
		}
	}, {
		id: 4,
		field: 'jyjdxq',
		name: '详情',
		initValue: '',
		required: {
			required: true,
			message: '请输入检验鉴定详情',
			trigger: ['change', 'blur']
		}
	}, {
		id: 5,
		field: 'bzjdjg',
		name: '	包装鉴定结果（多选）',
		initValue: '’',
		required: {
			required: true,
			message: '请选择包装鉴定结果',
			trigger: ['change', 'blur']
		}
	}, {
		id: 6,
		field: 'bzjdxq',
		name: '详情',
		initValue: '',
		required: {
			required: true,
			message: '请输入包装鉴定详情',
			trigger: ['change', 'blur']
		}
	}, {
		id: 7,
		field: 'wdlxxx',
		name: '网点联系信息	',
		initValue: '',
		required: {
			required: true,
			message: '请输入网点联系信息',
			trigger: ['change', 'blur']
		}
	},{
		id: 8,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]

	'拆机_cj' = [{
		id: 1,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
	'拆机_czj' = [{
		id: 0,
		field: 'jjsnm',
		name: '拆机SN码',
		initValue: '',
		required: {
			required: true,
			message: '请输入拆机SN码',
			trigger: ['change', 'blur']
		}
	}, {
		id: 1,
		field: 'jjsn',
		name: '拆机室内SN码1',
		initValue: '',
		required: {
			required: true,
			message: '拆机请输入室内SN码1',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
	'拆机_czj2' = [{
		id: 1,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
	'拆机_czzj' = [{
		id: 0,
		field: 'jjsnm',
		name: '旧件SN码',
		initValue: '',
		required: {
			required: true,
			message: '请输入旧件SN码',
			trigger: ['change', 'blur']
		}
	}, {
		id: 1,
		field: 'jjsn',
		name: '室内旧机SN码1',
		initValue: '',
		required: {
			required: true,
			message: '请输入室内旧机SN码1',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
	'测量_clwc' = [{
		id: 0,
		field: 'cl',
		name: '测量',
		data: {
			'空调类': [{
				id: 0,
				field: 'sycj',
				name: '使用场景',
				initValue: '',
				placeholder: '请输入使用场景',
				required: {
					required: true,
					message: '请输入使用场景',
					trigger: ['change', 'blur']
				}
			}, {
				id: 1,
				field: 'fjdx',
				name: '房间大小',
				placeholder: '请输入房间大小',
				initValue: '',
				required: {
					required: true,
					message: '请输入房间大小',
					trigger: ['change', 'blur']
				}
			}, {
				id: 2,
				field: 'fjcx',
				name: '朝向',
				placeholder: '请选择朝向',
				initValue: '',
				type: 'select',
				list: [],
				required: {
					required: true,
					message: '请输入房间朝向',
					trigger: ['change', 'blur']
				}
			}, {
				id: 3,
				field: 'syrs',
				name: '人数',
				placeholder: '请输入人数',
				initValue: ''
			}, {
				id: 4,
				field: 'cpxh',
				name: '建议机型',
				placeholder: '请输入建议机型',
				required: {
					required: true,
					message: '请输入建议机型',
					trigger: ['change', 'blur']
				}
			}, {
				id: 5,
				field: 'cpsl',
				name: '使用数量',
				placeholder: '请输入使用数量',
				initValue: '',
				required: {
					required: true,
					message: '请输入使用数量',
					trigger: ['change', 'blur']
				}
			}, {
				id: 6,
				field: 'clbz',
				name: '测量备注',
				placeholder: '请输入测量备注',
				initValue: '',
			}],
			// 暂时智能家居改为5G
			'5G类': [{
				id: 7,
				field: 'cpxh',
				name: '电机型号',
				placeholder: '请输入电机型号',
				initValue: '',
				required: {
					required: true,
					message: '请输入电机型号',
					trigger: ['change', 'blur']
				}
			},{
				id: 0,
				field: 'gdxz',
				name: '导轨形状',
				placeholder: '请输入导轨形状',
				initValue: '',
				required: {
					required: true,
					message: '请输入导轨形状',
					trigger: ['change', 'blur']
				}
			}, {
				id: 1,
				field: 'gdzd',
				name: '导轨长度',
				placeholder: '请输入导轨长度',
				initValue: '',
				required: {
					required: true,
					message: '请输入导轨长度',
					trigger: ['change', 'blur']
				}
			}, {
				id: 2,
				field: 'khfs',
				name: '开合方式',
				placeholder: '请选择开合方式',
				initValue: '',
				type: 'select',
				list: [],
				required: {
					required: true,
					message: '请选择开合方式',
					trigger: ['change', 'blur']
				}
			}, {
				id: 3,
				field: 'azfs',
				name: '安装方式',
				placeholder: '请选择安装方式',
				initValue: '',
				type: 'select',
				list: [],
				required: {
					required: true,
					message: '请选择安装方式',
					trigger: ['change', 'blur']
				}
			}, {
				id: 4,
				field: 'gdcs',
				name: '轨道层数',
				placeholder: '请选择轨道层数',
				initValue: '',
				type: 'select',
				list: [],
				required: {
					required: true,
					message: '请选择轨道层数',
					trigger: ['change', 'blur']
				}
			}, {
				id: 5,
				field: 'ksm',
				name: '宽说明',
				placeholder: '请选择宽说明',
				initValue: '',
				type: 'select',
				list: [],
				required: {
					required: true,
					message: '请选择宽说明',
					trigger: ['change', 'blur']
				}
			}, {
				id: 6,
				field: 'clbz',
				name: '测量备注',
				placeholder: '请输入测量备注',
				initValue: '',
				type: 'textarea',
			}],
			'厨卫类': [{
				id: 0,
				field: 'sy',
				name: '水压MPa',
				placeholder: '请输入水压MPa',
				initValue: '',
				required: {
					required: true,
					message: '请输入水压MPa',
					trigger: ['change', 'blur']
				}
			}, {
				id: 1,
				field: 'sll',
				name: '水流量L/min',
				placeholder: '请输入水流量L/mi',
				initValue: '',
				required: {
					required: true,
					message: '请输入水流量L/min',
					trigger: ['change', 'blur']
				}
			}, {
				id: 2,
				field: 'kj',
				name: '坑距mm',
				placeholder: '请输入坑距mm',
				initValue: '',
				required: {
					required: true,
					message: '请输入坑距mm',
					trigger: ['change', 'blur']
				}
			}, {
				id: 3,
				field: 'clbz',
				name: '测量备注',
				placeholder: '请输入测量备注',
				initValue: ''
			}]
		},
	}, {
		id: 1,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
	'清洗_clwc' = [{
		id: 0,
		field: 'yaohao_pcg',
		name: '邀好评成功',
		initValue: false
	}, {
		id: 1,
		field: 'hpjt',
		type: 'image',
		name: '订单好评截图',
		initValue: '',
		required: {
			required: true,
			message: '请上传订单好评截图',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'sflw',
		name: '设备是否联网',
		initValue: false,
		required: {
			required: false,
		}
	}, {
		id: 3,
		field: 'didbh',
		name: 'DID编码',
		initValue: '',
		required: {
			required: false,
		}
	}, {
		id: 4,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
	
	'换货_szwc' = [{
		id: 10,
		field: 'jjsnm',
		name: '旧件SN码',
		initValue: '',
		required: {
			required: true,
			message: '请输入旧件SN码',
			trigger: ['change', 'blur']
		}
	},{
		id: 0,
		field: 'gzlb',
		name: '故障类别',
		initValue: '',
		required: {
			required: true,
			message: '请选择故障类别',
			trigger: ['change', 'blur']
		}
	}, {
		id: 1,
		field: 'fwcs',
		name: '服务措施',
		initValue: '',
		required: {
			required: true,
			message: '请选择服务措施',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'sfjlgzxx',
		name: '故障记录',
		initValue: '',
		required: {
			required: true,
			message: '请输入故障记录',
			trigger: ['change', 'blur']
		}
	},{
		id: 7,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
	'退货_clwc' = [{
		id: 0,
		field: 'gzlb',
		name: '故障类别',
		initValue: '',
		required: {
			required: true,
			message: '请选择故障类别',
			trigger: ['change', 'blur']
		}
	}, {
		id: 1,
		field: 'fwcs',
		name: '服务措施',
		initValue: '',
		required: {
			required: true,
			message: '请选择服务措施',
			trigger: ['change', 'blur']
		}
	}, {
		id: 2,
		field: 'sfjlgzxx',
		name: '故障记录',
		initValue: '',
		required: {
			required: true,
			message: '请输入故障记录',
			trigger: ['change', 'blur']
		}
	},{
		id: 7,
		field: 'xcwgsczp',
		type: 'image',
		name: '完工照片',
		initValue: ''
	}]
}

export default {
	handleObj
}
