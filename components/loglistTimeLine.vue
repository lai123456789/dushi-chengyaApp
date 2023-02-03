<template>
	<u-read-more :toggle="true" close-text="查看全部日志">
		<u-time-line>
			<u-time-line-item v-for="(item,index) in loglist" :key="index">
				<template v-slot:node>
					<view :class="index == '0'?'u-node-active':'u-node-gray'"></view>
				</template>
				<template v-slot:content>
					<view style="margin-top: -6rpx;" class="u-p-l-24">
						<view class="u-order-desc u-rela" style="left: -56rpx;">{{item.title}}</view>
						<view class="u-order-desc u-tips-color u-rela" style="left: -56rpx;" v-if="item.username && item.type">
							{{item.username}}:
							<text class="u-m-l-8">{{item.type}}</text>
						</view>
						<text class="u-tips-color">{{item.content}}</text>
						<view class="u-light-color u-rela" style="left: -56rpx;">{{item.create_time}}</view>
					</view>
				</template>
			</u-time-line-item>
		</u-time-line>
	</u-read-more>
</template>

<script>
	export default {
		props: ['loglist'],
	}
</script>
