<template>
	<view class="app">
		<router-view></router-view>
		<TabBar />
	</view>
</template>

<script>
	import TabBar from '@/components/common/TabBar.vue'
	export default {
		components: {
			TabBar
		},
		onShow() {
			const systemInfo = uni.getSystemInfo();
			
			// 获取状态栏高度
			this.statusBarHeight = systemInfo.statusBarHeight || 20
			uni.setStorage({
				data:systemInfo.statusBarHeight || 0,
				key:'statusBarHeight'
			})
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/style/index.scss";
</style>