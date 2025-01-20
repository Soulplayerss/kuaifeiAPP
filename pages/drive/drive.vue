<template>
	<view class="drive">
		<!-- <Camera /> -->
		<DualChannel :carInfo="carInfo" :macAddress="macAddress" v-if="showDualChannel" />
		<FourChannel :carInfo="carInfo" :macAddress="macAddress" v-if="showFourChannel" />
	</view>
</template>

<script>
	import DualChannel from '@/components/common/DualChannel.vue'
	import FourChannel from '@/components/common/FourChannel.vue'
	// import Camera from '@/components/common/Camera.vue'
	import request from '@/utils/request';
	export default {
		data() {
			return {
				macAddress: '',
				carId: '',
				showFourChannel: false,
				showDualChannel: false,
				carInfo: {},
			};
		},
		components: {
			DualChannel,
			FourChannel,
			// Camera
		},
		onLoad(options) {
			const {
				macAddress,
				carId
			} = options;
			this.macAddress = macAddress
			this.carId = carId
			// 设置横屏
			plus.screen.lockOrientation('landscape-primary');
		},
		onUnload() {
			// 页面卸载时恢复竖屏
			plus.screen.lockOrientation('portrait-primary')
		},
		onHide() {
			plus.screen.lockOrientation('portrait-primary')
		},
		methods: {
			async getCarInfo() {
				try {
					const response = await request(`/app/carInfo/getInfoByCarId/${this.carId}`, 'GET')
					if (response.code === 200) {
						let data = JSON.parse(JSON.stringify(response.data))
						this.carInfo = data
						if (this.carInfo.appCarChannelList.length == 2) {
							this.showDualChannel = true
						} else if (this.carInfo.appCarChannelList.length >= 4) {
							this.showFourChannel = true
						}
					}
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
		},
		mounted() {
			this.getCarInfo()
		}
	};
</script>

<style scoped lang="less">
	.drive {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		overflow: hidden;

	}
</style>