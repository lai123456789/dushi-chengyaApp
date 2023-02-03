const Mock = require('better-mock/dist/mock.mp.js')
import {
	builder,
	getQueryParameters,
	getBody,
} from '../util'
let questionbank = [{
	q_id: '1',
	title: '安全交通测试一',
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	type: '进行中'
}, {
	q_id: '2',
	title: '安全交通测试二',
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	type: '进行中'
}, {
	q_id: '3',
	title: '安全交通测试三',
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	type: '未开始'
}, {
	q_id: '4',
	title: '安全交通测试四',
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	type: '未开始'
}, {
	q_id: '5',
	title: '安全交通测试五',
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	type: '未开始'
}, {
	q_id: '6',
	title: '安全交通测试六',
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	type: '已结束'
}, {
	q_id: '7',
	title: '安全交通测试七',
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	type: '进行中'
}, {
	q_id: '8',
	title: '安全交通测试八',
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	type: '已结束'
}, ]
let setting = [{
	id: '1',
	title: '这是一个试卷名1',
	deadline: '3',
	time: '120分钟',
	formerly: 0,
	judge: true, //判断是否能继续考试,
	explain: '禁止交头接耳',
	state: 'during', //during:进行中 over：结束  notstarted：未开始
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	startime: '2020-11-01 19:44'
}, {
	id: '2',
	title: '这是一个试卷名2',
	deadline: '3',
	time: '120分钟',
	formerly: 0,
	judge: true, //判断是否能继续考试,
	explain: '禁止交头接耳',
	state: 'during', //during:进行中 over：结束  notstarted：未开始
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	startime: '2020-11-01 19:44'
}, {
	id: '3',
	title: '这是一个试卷名3',
	deadline: '3',
	time: '120分钟',
	formerly: 0,
	judge: true, //判断是否能继续考试,
	explain: '禁止交头接耳',
	state: 'notstarted', //during:进行中 over：结束  notstarted：未开始
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	startime: '2020-11-01 19:44'
}, {
	id: '4',
	title: '这是一个试卷名4',
	deadline: '3',
	time: '120分钟',
	formerly: 0,
	judge: true, //判断是否能继续考试,
	explain: '禁止交头接耳',
	state: 'notstarted', //during:进行中 over：结束  notstarted：未开始
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	startime: '2020-11-01 19:44'
}, {
	id: '5',
	title: '这是一个试卷名5',
	deadline: '3',
	time: '120分钟',
	formerly: 0,
	judge: true, //判断是否能继续考试,
	explain: '禁止交头接耳',
	state: 'notstarted', //during:进行中 over：结束  notstarted：未开始
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	startime: '2020-11-01 19:44'
}, {
	id: '6',
	title: '这是一个试卷名6',
	deadline: '3',
	time: '120分钟',
	formerly: 0,
	judge: false, //判断是否能继续考试,
	explain: '禁止交头接耳',
	state: 'over', //during:进行中 over：结束  notstarted：未开始
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	startime: '2020-11-01 19:44'
}, {
	id: '7',
	title: '这是一个试卷名7',
	deadline: '3',
	time: '120分钟',
	formerly: 0,
	judge: true, //判断是否能继续考试,
	explain: '禁止交头接耳',
	state: 'during', //during:进行中 over：结束  notstarted：未开始
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	startime: '2020-11-01 19:44'
}, {
	id: '8',
	title: '这是一个试卷名8',
	deadline: '3',
	time: '120分钟',
	formerly: 1,
	judge: false, //判断是否能继续考试,
	explain: '禁止交头接耳',
	state: 'over', //during:进行中 over：结束  notstarted：未开始
	examtime: '2020-11-01 19:44 ~ 2020-11-30 19:44',
	startime: '2020-11-01 19:44'
}]
let state = {
	type: 'ongoing', //over:结束后的状态  ongoing：考试中的状态
	correctAnswer: true // 是否可见正确答案
}
let visible = {
	typeVisible: 'wrongTopic', //score wrongTopic theCorrect  
	score: '100',
	title: '恭喜您通过考试了',
	name: '刘旋的成绩单',
	volumeName: '安全交通测试',
	endTime: '2020-11-20 14:30',
	state: 'notPass' //pass 通过 notPass
}
let questionData = {
	id: '',
	topic: [{
		id: 1,
		index: 1,
		select: false,
		title: '道路交通安全工作，应当遵循依法管理、方便群众的原则，保障道路交通( )、安全、畅通。',
		questionType: '单选题',
		inputuser: 'admin',
		inputtime: '2020-9-24 19:10:42',
		lastModify: 'admin',
		lastModifiedTime: '2020-9-24 19:10:42',
		answer: 'B',
		myanswer:'',
		keyWord: '1',
		judge: '0',
		Whetherornot: true,
		list: [{
			key: 'A',
			name: 'A.便捷',
			value: ''
		}, {
			key: 'B',
			name: 'B.有序',
			value: ''
		}, {
			key: 'c',
			name: 'C.经济',
			value: ''
		}, {
			key: 'D',
			name: 'D.快速',
			value: ''
		}],
		fill: [],
		analysis: '这是一个非常非常厉害的题目'
	}, {
		id: 2,
		index: 2,
		select: false,
		title: '各级政府应当保障道路交通安全管理工作与经济建设和(  )发展相适应。',
		questionType: '单选题',
		inputuser: 'admin',
		inputtime: '2020-9-24 19:10:42',
		lastModify: 'admin',
		lastModifiedTime: '2020-9-24 19:10:42',
		answer: 'B',
		myanswer:'',
		keyWord: '1',
		judge: '0',
		Whetherornot: true,
		list: [{
			key: 'A',
			name: 'A.社会',
			value: false
		}, {
			key: 'B',
			name: 'B.时代',
			value: false
		}, {
			key: 'C',
			name: 'C.建设',
			value: false
		}, {
			key: 'D',
			name: 'D.组织',
			value: false
		}],
		fill: [],
		analysis: ''
	}, {
		id: 3,
		index: 3,
		select: false,
		title: '交通信号灯包括(  )',
		questionType: '多选题',
		inputuser: 'admin',
		inputtime: '2020-9-24 19:10:42',
		lastModify: 'admin',
		lastModifiedTime: '2020-9-24 19:10:42',
		answer: 'A、B、C',
		keyWord: '1',
		myanswer:'',
		judge: '0',
		Whetherornot: false,
		list: [{
			key: 'A',
			name: 'A.绿灯信号',
			value: false,
		}, {
			key: 'B',
			name: 'B.红灯信号',
			value: false,
		}, {
			key: 'D',
			name: 'C.黄灯信号',
			value: false,
		}, {
			key: 'D',
			name: 'D.停止信号',
			value: false,
		}],
		fill: [],
		analysis: ''
	}, {
		id: 4,
		index: 4,
		select: false,
		title: '骑车可以推行、绕行闯越红灯。',
		questionType: '判断题',
		inputuser: 'admin',
		inputtime: '2020-9-24 19:10:42',
		lastModify: 'admin',
		lastModifiedTime: '2020-9-24 19:10:42',
		answer: '错',
		keyWord: '',
		myanswer:'',
		judge: '0',
		Whetherornot: false,
		list: [{
			name: '对'
		}, {
			name: '错'
		}],
		fill: [],
		analysis: '',

	}, {
		id: 5,
		index: 5,
		select: false,
		title: '机动车行经没有交通信号的道路时，遇有行人横过道路，应当___',
		questionType: '填空题',
		inputuser: 'admin',
		inputtime: '2020-9-24 19:10:42',
		lastModify: 'admin',
		lastModifiedTime: '2020-9-24 19:10:42',
		answer: '',
		keyWord: '',
		myanswer:'',
		judge: '0',
		list: [{
			value: "",
			index: "填空项1"
		}],
		fill: [],
		allow: '1',
		analysis: ''
	}, {
		id: 6,
		index: 6,
		select: false,
		title: '行人应当在___行走，没有人行道的靠___行走',
		questionType: '填空题',
		inputuser: 'admin',
		inputtime: '2020-9-24 19:10:42',
		lastModify: 'admin',
		lastModifiedTime: '2020-9-24 19:10:42',
		answer: '',
		myanswer:'',
		keyWord: '',
		judge: '0',
		Whetherornot: false,
		list: [{
			value: "",
			index: "填空项1"
		}, {
			value: "",
			index: "填空项2"
		}],
		fill: [],
		allow: '1',
		analysis: ''
	}, {
		id: 7,
		index: 7,
		select: false,
		title: '对道路交通安全违法行为的处罚种类包括哪几种',
		questionType: '简答题',
		inputuser: 'admin',
		inputtime: '2020-9-24 19:10:42',
		lastModify: 'admin',
		lastModifiedTime: '2020-9-24 19:10:42',
		answer: '',
		myanswer:'',
		keyWord: '',
		judge: '0',
		list: [''],
		fill: [],
		Whetherornot: false,
		analysis: ''
	}],
}
const topicdata = (options) => {
	let type = getBody(options).type
	let data = questionbank.filter(item => {
		return item.type == type
	})
	console.log(data)
	return builder({
		data: data
	})
}
const oddtopic = (options) => {
	let id = options.body.id
	if (id == undefined) {
		id = 1
	}
	// console.log(options)
	let odd = questionData.topic.filter(item => {
		return item.id == id
	})
	console.log(odd[0].myanswer.length)
	if (odd[0].fill.length == 0 && state.type != 'ongoing') {
		// odd[0].fill.push('--')
		odd[0].myanswer="--"
	}else if(odd[0].myanswer==''){
		console.log('sdfsafas',odd[0])
		// odd[0].myanswer="--"
	}
	return builder({
		data: odd
	})
}
const getsum = (options) => {
	return builder({
		data: questionData.topic
	})
}
const answer = (options) => {
	console.log(options.body)
	let p = new Promise(res => {
		for (var i in questionData.topic) {
			if (options.body.fill.length != 0) {
				// console.log(options.body)
				options.body.select = true
			} else {
				options.body.select = false
			}
			if (questionData.topic[i].id == options.body.id) {
				questionData.topic[i] = options.body
			}
		}
	})
	return builder({
		code: 200
	})
}
const submit = (options) => {
	if (visible.state != 'pass') {
		visible.title = "很遗憾您没有通过考试"
	}
	return builder({
		data: visible
	})
}
const query = (options) => {
	return builder({
		data: state
	})
}
const setState = (options) => {
	console.log(questionData.id)
	for (var i in setting) {
		// console.log(setting[i].id);
		if (setting[i].id == questionData.id) {
			setting[i].formerly++
			if (setting[i].formerly >= setting[i].deadline) {
				console.log('qwe')
				setting[i].judge = false
				console.log(setting[i].judge)
			}
		}
	}
	state.type = 'over'
	return builder({
		code: 200
	})
}
const examination = (options) => {
	let id = options.body.id
	let data = setting.filter(item => {
		return item.id == id
	})
	return builder({
		data: data
	})
}
const enterthetest = (options) => {
	questionData.id = options.body.id
	console.log(questionData.id)
	state.type = 'ongoing'
	return builder({
		code: 200
	})
}
Mock.mock(/\/app\/Index\/topicdata/, 'get', topicdata)
Mock.mock(/\/exam\/Index\/oddtopic/, 'get', oddtopic)
Mock.mock(/\/exam\/Index\/getsum/, 'get', getsum)
Mock.mock(/\/exam\/Index\/answer/, 'post', answer)
Mock.mock(/\/exam\/Index\/submit/, 'get', submit)
Mock.mock(/\/exam\/Index\/query/, 'get', query)
Mock.mock(/\/exam\/Index\/setState/, 'get', setState)
Mock.mock(/\/exam\/Index\/examination/, 'get', examination)
Mock.mock(/\/exam\/Index\/enterthetest/, 'get', enterthetest)
