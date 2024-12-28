<template>
	<view>
		<router-view></router-view>
		<TabBar v-show="showTabBar" :pageRoute='pageRoute' />
	</view>
</template>

<script>
	import TabBar from '@/components/common/TabBar.vue'
	export default {
		data() {
			return {
				pageRoute: '',
				showTabBar: false
			};
		},
		onLaunch() {

		},
		components: {
			TabBar
		},
		onShow() {
			let that = this
			uni.addInterceptor('navigateTo', {
				invoke(args) {
					that.processingRoutes(args.url)
				},
			});
		},
		onHide() {
			console.log('页面隐藏');
			// 可以做一些清理工作
		},
		methods: {
			processingRoutes(router) {
				this.pageRoute = router
				console.log(router)
				switch (router) {
					case "/pages/index/index":
						this.showTabBar = true
						break;
					case "/pages/car/car":
						this.showTabBar = true
						break;
					case "/pages/shared/shared":
						this.showTabBar = true
						break;
					case "/pages/my/my":
						this.showTabBar = true
						break;
					default:
						this.showTabBar = false
				}
			}
		},
		mounted() {
			this.processingRoutes(this.$route.path)
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/style/index.scss";
</style>