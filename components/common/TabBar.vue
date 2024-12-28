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
			pageRoute: {
				type: String,
				default: '/pages/index/index'
			},
		},
		data() {
			return {
				active: 0,
				tabList: [{
						pagePath: "/pages/index/index",
						iconPath: "../../static/index.png",
						selectedIconPath: "../../static/index-active.png",
						text: "广场"
					}, {
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
					}, {
						pagePath: "/pages/my/my",
						iconPath: "../../static/my.png",
						selectedIconPath: "../../static/my-active.png",
						text: "我的"
					}
				]
			};
		},
		onShow() {

		},
		methods: {
			navigateToEvent(index, pagePath) {
				this.active = index
				setTimeout(() => {
					uni.navigateTo({
						url: pagePath,
					});
				}, 100);
			},
			processingRoutes(value) {
				switch (value) {
					case "/pages/index/index":
						this.navigateToEvent(0, value)
						break;
					case "/pages/car/car":
						this.navigateToEvent(1, value)
						break;
					case "/pages/shared/shared":
						this.navigateToEvent(2, value)
						break;
					case "/pages/my/my":
						this.navigateToEvent(3, value)
						break;
					default:
				}
			}
		},
		mounted() {
		},
		watch: {
			pageRoute: {
				handler(newVal, oldVal) {
					this.processingRoutes(newVal)
				},
			}
		}
	};
</script>

<style scoped lang="less">
	.tabbar {
		position: fixed;
		z-index: 999;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 86px;
		background-color: #eea618;
		display: flex;
		justify-content: center;
		align-items: center;

		.contentBox {
			width: 90%;
			height: 66px;
			background-color: #FFF;
			border-radius: 33px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding: 0 20px;

			.tab-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #30313D;
				font-size: 14px;

				.icon {
					width: 24px;
					height: 24px;
					margin-bottom: 4px;
				}
			}

			.active {
				color: #eea618;
			}

		}
	}
</style>