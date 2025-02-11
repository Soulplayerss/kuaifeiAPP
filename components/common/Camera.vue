<!-- <template>
	<view class="camera">
		<view class="paizhao" @click="paizhao">
			拍照
		</view>
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
				mp: {},
				videoUrl: '',
				player:null,
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
		onShow() {
			if(this.player){
				this.player.play()
			}
		}
		onUnload() {
			this.mp.destroy()
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
						channel: '0',
						stream: '1',
						protocol: 'rtmp-flv',
						username: 'admin'
					},
					success: (res) => {
						if (res.data.code == 2000) {
							this.videoUrl = res.data.data.url
							let pages = getCurrentPages()
							let page = pages[pages.length - 1]
							let currentWebview = page.$getAppWebview()

							this.player = new plus.video.VideoPlayer('video-player', {
								src: this.videoUrl,
								top: '0px',
								left: '0px',
								width: '100%',
								height: '100%',
								position: 'static'
							})

							currentWebview.append(this.player)

							this.player.play()
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
			paizhao() {
				uni.request({
					url: `https://api.jftechws.com/gwp/v3/rtc/device/capture/${deviceToken}`,
					method: 'POST',
					header: this.headerParms,
					data: {
						Name: "OPSNAP",
						OPSNAP: {
							"Channel": 0,
							"PicType": 0
						}
					},
					success: (res) => {
						if (res.data.code == 2000) {

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
		},
		destroyed() {
			if (this.mp) {
				this.mp.destroy(); // 销毁播放器
			}
		},
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

		.paizhao {
			position: fixed;
			top: 50px;
			right: 50px;
			color: #FFF;

		}
	}
</style> -->

<template>
  <view>
    <web-view src="/static/webRTC/onminirtc1.html"></web-view>
  </view>
</template>