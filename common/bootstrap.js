import Vue from 'vue'
import mock from '@/mock'
import {
	getConfig,
	setLoading
} from '@/common/common.js';
Vue.prototype.config = getConfig();
Vue.prototype.setLoading = setLoading
