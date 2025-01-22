<template>
	<view class="camera">
		摄像头
	</view>
</template>

<script>
	import {
		generateTime,
		fnGetSignature
	} from '@/assets/js/getSignature.js';
	export default {
		data() {
			return {
				headerParms: {
					'Content-Type': 'application/json',
					'uuid': '6763c5921f96978377583672',
					'appKey': 'd2b66ca4998f1bcedbff6dd62c87c622',
					'timeMillis': generateTime,
					'signature': fnGetSignature
				}
			}
		},
		onLoad(options) {

		},
		methods: {
			getDeviceToken() {
				uni.request({
					url: `https://api.jftechws.com/gwp/v3/rtc/device/token`,
					method: 'POST',
					header: this.headerParms,
					data: {
						sns: ['09bf5ddf079e8069']
					},
					success: (res) => {
						if (res.data.code == 2000) {
							this.getlivestream(res.data.data[0].token)
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '请求失败',
							type: 'error',
							icon: 'error',
						});
					},
				})
			},
			getlivestream(deviceToken) {
				uni.request({
					url: `https://api.jftechws.com/gwp/v3/rtc/device/livestream/${deviceToken}`,
					method: 'POST',
					header: this.headerParms,
					data: {
						channel: '1',
						stream: '1',
						protocol: 'mp4-url',
						username: 'admin'
					},
					success: (res) => {
						console.log(res)
					},
					fail: (err) => {
						uni.showToast({
							title: '请求失败',
							type: 'error',
							icon: 'error',
						});
					},
				})
			}
		},
		mounted() {
			this.getDeviceToken()
		}
	}
</script>

<style scoped lang="less">
	.camera {
		width: 100%;
		height: 100%;
	}
</style>