const Mock = require('better-mock/dist/mock.mp.js')
import {
	getConfig
} from '@/common/common.js';
const config = getConfig()
if (config.mock) {
	require('./index')
	require('./mine')
	require('./order')
	require('./index/exam.js')
}
