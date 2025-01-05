<template>
	<view class="tabbar">
		<view class="contentBox">
			<view v-for="(item, index) in tabList" :key="index" :class="['tab-item', index === active ? 'active' : '']"
				@click="navigateToEvent(index, item.pagePath)">
				<image class="icon" :src="index === active ? item.selectedIconPath : item.iconPath" />
				<text>{{ item.text }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			activeValue: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				active: this.activeValue,
				routerpage: '',
				tabList: [{
						pagePath: "/pages/index/index",
						iconPath: "../../static/index.png",
						selectedIconPath: "../../static/index-active.png",
						text: "广场"
					},
					{
						pagePath: "/pages/car/car",
						iconPath: "../../static/car.png",
						selectedIconPath: "../../static/car-active.png",
						text: "车辆"
					},
					{
						pagePath: "/pages/shared/shared",
						iconPath: "../../static/shared.png",
						selectedIconPath: "../../static/shared-active.png",
						text: "共享"
					},
					{
						pagePath: "/pages/my/my",
						iconPath: "../../static/my.png",
						selectedIconPath: "../../static/my-active.png",
						text: "我的"
					}
				]
			};
		},
		methods: {
			navigateToEvent(index, pagePath) {
				this.$nextTick(() => {
					uni.navigateTo({
						url: pagePath
					});
				});
			},
		}
	};
</script>

<style scoped lang="less">
</style>