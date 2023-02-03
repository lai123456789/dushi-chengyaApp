<template>
	<u-card margin="32rpx 0rpx" title="工单流程" border-radius="0" :border="false">
		<u-grid slot="body" :col="4" :border="false">
			<u-grid-item v-for="(item, index) in orderData" :key="index" @click="openPage(item.path)">
				<u-badge :count="item.count"></u-badge>
				<u-icon :name="item.icon" custom-prefix="custom-icon" :size="46" :color="item.iconColor"></u-icon>
				<view class="u-m-t-8 u-font-12">{{ item.name }}</view>
			</u-grid-item>
		</u-grid>
	</u-card>
</template>
<script>
	export default {
		data() {
			return {
				orderData: [{
					count: 3,
					name: '待预约',
					icon: 'calendar',
					iconColor: '#E54D42',
					path: '/pages/modules/demo/blank'
				}, {
					count: 0,
					name: '待完工',
					icon: 'daifuwu2',
					iconColor: '#F37B1D'
				}, {
					count: 120,
					name: '已完工',
					icon: 'quanbugongdan2',
					iconColor: '#FBBD08'
				}, {
					count: 0,
					name: '配件申请单',
					icon: 'file-text',
					iconColor: '#6638B4'
				}]
			}
		},
		methods: {
			openPage(path) {
				if (path) {
					this.$u.route({
						url: path
					})
				} else {
					this.$u.toast('逐步开放中……')
				}
			},
		}
	}
</script>
