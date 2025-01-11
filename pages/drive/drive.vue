<template>
	<view class="drive">
		<view class="back" @click="back">
			<image src="../../assets/images/over.png" mode="" style="width: 30px;height: 30px;"></image>
		</view>
		<DualChannel :carInfo="carInfo" :macAddress="macAddress" v-if="carInfo.appCarChannelList.length == 2" />
		<FourChannel :carInfo="carInfo" :macAddress="macAddress" v-if="carInfo.appCarChannelList.length == 4" />
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
				carInfo: {
					appCarChannelList: [{
							minValue: 1000,
							maxValue: 3000,
							channelId: 1,
							channelName: '第一通道'
						},
						{
							minValue: 1000,
							maxValue: 3000,
							channelId: 2,
							channelName: '第二通道'
						},
						{
							minValue: 1000,
							maxValue: 3000,
							channelId: 3,
							channelName: '第三通道'
						},
						{
							minValue: 1000,
							maxValue: 3000,
							channelId: 4,
							channelName: '第四通道'
						},
					]
				},
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
			// plus.screen.lockOrientation('landscape-primary');
		},
		onUnload() {
			// 页面卸载时恢复竖屏
			// plus.screen.lockOrientation('portrait-primary')
		},
		methods: {
			back() {
				// plus.screen.lockOrientation('portrait-primary')
				uni.navigateTo({
					url: '/pages/car/car'
				});
			},
			async getCarInfo() {
				// try {
				// 	const response = await request(`/app/carInfo/getInfoByCarId/${this.carId}`, 'GET')
				// 	if (response.code === 200) {
				// 		this.carInfo = response.data
				// 	}
				// } catch (error) {
				// 	uni.showToast({
				// 		title: '加载失败',
				// 		icon: 'none',
				// 	});
				// }
			},
		},
		mounted() {
			// this.getCarInfo()
		}
	};
</script>

<style scoped lang="less">
	.drive {

		.back {
			padding: 20px;
			width: 30px;
			height: 30px;
		}
	}
</style>