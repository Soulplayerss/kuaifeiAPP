<template>
	<view class="container">
		<view class="back" @click="back">
			返回
		</view>
		<!-- 父容器 -->
		<view class="parent">
			<!-- 可拖动子元素 -->
			<view class="draggable" :style="{ left: positionX + 'px', top: positionY + 'px' }"
				@touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
			</view>
		</view>
	</view>
</template>


<script>
	import {
		fnGetSignature,
		generateTime
	} from '@/assets/js/getSignature.js'

	export default {
		data() {
			return {
				positionX: 50, // 子元素初始位置 X
				positionY: 50, // 子元素初始位置 Y
				startX: 0, // 触摸起始点 X
				startY: 0, // 触摸起始点 Y
				parentWidth: 0, // 父元素宽度
				parentHeight: 0, // 父元素高度
				draggableWidth: 0, // 子元素宽度
				draggableHeight: 0, // 子元素高度
				newDirection: '', //  新方向
				oldDirection: '', //  老方向
				counter: 0,
				socket: null,
			};
		},
		onLoad() {
			// 设置横屏
			// plus.screen.lockOrientation('landscape-primary');
			// this.initWebSocket();
			// uni.request({
			// 	url: 'https://api.jftechws.com/gwp/v3/rtc/device/bind',
			// 	method: 'POST',
			// 	data: {
			// 		// 需要传递的参数
			// 		sn: '2252445'
			// 	},
			// 	header: {
			// 		'Content-Type': 'application/json',
			// 		'uuid': '6763c5921f96978377583672',
			// 		'appKey': 'd2b66ca4998f1bcedbff6dd62c87c622',
			// 		'timeMillis': generateTime,
			// 		'signature': fnGetSignature
			// 	},
			// 	success: (res) => {
			// 		// 接口调用成功的回调函数
			// 		console.log(res.data);
			// 	},
			// 	fail: (err) => {
			// 		// 接口调用失败的回调函数
			// 		console.error(err);
			// 	},
			// 	complete: () => {
			// 		// 接口调用结束的回调函数（成功或失败都会执行）
			// 		console.log('接口调用结束');
			// 	}
			// });
		},
		onUnload() {
			//链接Socket
			// this.closeWebSocket();
			// 页面卸载时恢复竖屏
			// plus.screen.lockOrientation('portrait-primary')
		},
		mounted() {
			// 获取父元素和子元素的宽高
			const query = uni.createSelectorQuery().in(this);
			query
				.select(".parent")
				.boundingClientRect((data) => {
					this.parentWidth = data.width;
					this.parentHeight = data.height;
				})
				.exec();
			query
				.select(".draggable")
				.boundingClientRect((data) => {
					this.draggableWidth = data.width;
					this.draggableHeight = data.height;
				})
				.exec();
		},
		methods: {
			back() {
				uni.switchTab({
					url: '/pages/index/index', // 返回上一级页面，默认为1
				});
			},
			// 开始触摸
			onTouchStart(e) {
				this.startX = e.touches[0].pageX - this.positionX;
				this.startY = e.touches[0].pageY - this.positionY;
			},
			// 拖动过程
			onTouchMove(e) {
				const moveX = e.touches[0].pageX;
				const moveY = e.touches[0].pageY;

				// 计算新的位置
				let newX = moveX - this.startX;
				let newY = moveY - this.startY;

				// 限制范围
				newX = Math.max(0, Math.min(newX, this.parentWidth - this.draggableWidth));
				newY = Math.max(0, Math.min(newY, this.parentHeight - this.draggableHeight));

				this.positionX = newX;
				this.positionY = newY;

				//判断朝哪个方向
				this.checkPosition(this.positionX, this.positionY);
			},
			// 结束触摸
			onTouchEnd() {
				this.sendMessage('拖拽结束')
				console.log("拖拽结束");
				this.positionX = 50;
				this.positionY = 50;
			},
			checkPosition(positionX, positionY) {
				if (positionY <= 15) {
					if (positionX <= 10) {
						this.newDirection = "左上"
					} else if (positionX >= 40 && positionX <= 60) {
						this.newDirection = "上"
					} else if (positionX >= 90) {
						this.newDirection = "右上"
					}
				} else if (positionY >= 45 && positionY <= 55) {
					if (positionX <= 10) {
						this.newDirection = "左"
					} else if (positionX >= 40 && positionX <= 60) {
						this.newDirection = "停止"
					} else if (positionX >= 90) {
						this.newDirection = "右"
					}
				} else if (positionY >= 85) {
					if (positionX <= 10) {
						this.newDirection = "左下"
					} else if (positionX >= 40 && positionX <= 60) {
						this.newDirection = "下"
					} else if (positionX >= 90) {
						this.newDirection = "右下"
					}
				}
				this.updataDirection()
			},
			updataDirection() {
				if (this.newDirection !== this.oldDirection) {
					this.oldDirection = this.newDirection
					this.sendMessage(this.oldDirection)
				}
			},

			initWebSocket() {
				this.socket = uni.connectSocket({
					url: 'ws://5858a12f.r32.cpolar.top/ws/3211333',
					success: () => {
						console.log('WebSocket连接成功');
					},
					fail: (err) => {
						console.error('WebSocket连接失败', err);
					},
				});

				// 监听 WebSocket 打开事件
				this.socket.onOpen(() => {
					console.log('WebSocket已打开');
				});

				// 监听 WebSocket 收到消息事件
				this.socket.onMessage((res) => {
					console.log('收到消息：', res.data);
				});

				// 监听 WebSocket 关闭事件
				this.socket.onClose(() => {
					console.log('WebSocket已关闭');
				});

				// 监听 WebSocket 错误事件
				this.socket.onError((err) => {
					console.error('WebSocket发生错误', err);
				});
			},

			// 发送消息
			sendMessage(message) {
				if (this.socket) {
					this.socket.send({
						data: message,
						success: () => {
							console.log('消息发送成功:', message);
						},
						fail: (err) => {
							console.error('消息发送失败:', err);
						},
					});
				} else {
					console.error('WebSocket尚未连接');
				}
			},

			// 关闭 WebSocket
			closeWebSocket() {
				if (this.socket) {
					this.socket.close({
						success: () => {
							console.log('WebSocket关闭成功');
						},
						fail: (err) => {
							console.error('WebSocket关闭失败:', err);
						},
					});
				}
			},
		},
	};
</script>


<style scoped lang="less">
	.container {
		display: flex;
		justify-content: start;
		align-items: center;
		height: 100vh;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.8);

		.back {
			position: fixed;
			z-index: 2;
			top: 20px;
			left: 20px;
			width: 50px;
			height: 40px;
			line-height: 40px;
			background-color: aliceblue;
			color: #30313D;
			text-align: center;
		}
	}

	.parent {
		position: relative;
		width: 150px;
		height: 150px;
		margin-left: 40rpx;
		border-radius: 50%;
		background: url('../../assets/images/remote-sensing.png') no-repeat;
		background-size: 100% 100%;
		/* 防止子元素溢出 */
	}

	.draggable {
		position: absolute;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: url('../../assets/images/remote-sensing.png') no-repeat;
		background-size: 100% 100%;
		/* 防止选中文字 */
		touch-action: none;
		/* 禁止默认触摸行为 */
	}
</style>