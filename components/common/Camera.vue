<template>
	<view class="camera">
		<view class="url">
			{{videoUrl}}
		</view>
		<video :src="videoUrl" autoplay="" class="video"></video>
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
				videoUrl: '',
				timeOut: null,
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
						console.log(res)
						if (res.data.code == 2000) {
							clearTimeout(this.timeOut)
							this.getlivestream(res.data.data[0].token)
						}
						if (res.data.code == 28005) {
							// this.timeOut = setTimeout(() => {
							// 	this.getDeviceToken()
							// }, 100)
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
						channel: '0',
						stream: '1',
						protocol: 'rtsp-sdp',
						username: 'admin'
					},
					success: (res) => {
						if (res.data.code == 2000) {
							this.videoUrl = res.data.data.url

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

		.video {
			width: 100%;
			height: 100%;
		}

		.url {
			position: fixed;
			top: 0;
			left: 0;
			color: #FFF;
			z-index: 3;
		}
	}
</style>