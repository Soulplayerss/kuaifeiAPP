
<script>
	export default {
		onShow() {
			const systemInfo = uni.getSystemInfo();
			// 获取状态栏高度
			uni.setStorage({
				data:systemInfo.statusBarHeight || 30,
				key:'statusBarHeight'
			})
			
			 this.$store.commit('setSiteStatus')
			 this.$store.commit('setSiteType')
			 this.$store.commit('setSiteLabel')
			 this.$store.commit('setUserInfo')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/style/index.scss";
</style>