<template>
	<view>
		<view class="list-wrap">
			<u-cell-group title-bg-color="rgb(243, 244, 246)" :title="getGroupTitle(item)" v-for="(item, index) in list" :key="index">
				<u-cell-item :titleStyle="{fontWeight: 500}" @click="openPage(item1.path)" :title="getFieldTitle(item1)" v-for="(item1, index1) in item.list"
				 :key="index1">
					<u-icon slot="icon" :name="item1.icon" size="40" class="u-m-r-10" :color="item1.color"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<u-gap height="70"></u-gap>
	</view>
</template>
<script>
	import list from "./index.config.js";
	export default {
		data() {
			return {
				list: list,
			}
		},
		computed: {
			getIcon() {
				return path => {
					return 'https://cdn.uviewui.com/uview/example/' + path + '.png';
				}
			}
		},
		onShow() {

		},
		created() {

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
			getGroupTitle(item) {
				return item.groupName
			},
			getFieldTitle(item) {
				return item.title
			}
		}
	}
</script>
