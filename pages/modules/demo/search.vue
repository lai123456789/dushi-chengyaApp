<template>
	<u-card margin="0" :show-head="false" border-radius="0" :border="false">
		<u-search slot="body" placeholder="请输入内容后点击搜索" v-model="keyword" @custom="clickSearch"></u-search>
	</u-card>
</template>
<script>
	export default {
		data() {
			return {
				keyword: ''
			}
		},
		methods: {
			//点击搜索按钮事件
			clickSearch(val) {
				this.$u.toast("搜索内容为：" + (val ? val : '空'))
			}
		}
	}
</script>
