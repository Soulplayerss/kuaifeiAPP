<template>
	<view class="drive">
		<view class="back" @click="back">
			<image src="../../assets/images/over.png" mode="" style="width: 30px;height: 30px;"></image>
		</view>
		<DualChannel :carInfo="carInfo" :macAddress="macAddress" v-if="showDualChannel" />
		<FourChannel :carInfo="carInfo" :macAddress="macAddress" v-if="showFourChannel" />
	</view>
</template>

<script>
	import DualChannel from '@/components/common/DualChannel.vue'
	import FourChannel from '@/components/common/FourChannel.vue'
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
			FourChannel
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
		methods: {
			back() {
				plus.screen.lockOrientation('portrait-primary')
				uni.navigateTo({
					url: '/pages/car/car'
				});
			},
			async getCarInfo() {
				try {
					const response = await request(`/app/carInfo/getInfoByCarId/${this.carId}`, 'GET')
					if (response.code === 200) {
						this.carInfo = response.data
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
		.back {
			padding: 20px;
			width: 30px;
			height: 30px;
		}
	}
</style>