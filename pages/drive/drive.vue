<template>
	<view class="container">
		<view class="back" @click="back">
			<image src="../../assets/images/over.png" mode="" style="width: 30px;height: 30px;"></image>
		</view>
		<view class="operateBox">
			<view class="parent">
				<view class="draggable" :style="{ left: positionX + 'px', top: positionY + 'px' }"
					@touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
				</view>
			</view>
			<view class="parent">
				<view class="draggable" :style="{ left: rudderpositionX + 'px', top: rudderpositionY + 'px' }"
					@touchstart="onRudderTouchStart" @touchmove="onRudderTouchMove" @touchend="onRudderTouchEnd">
				</view>
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
				positionX: 50, // 电机子元素初始位置 X
				positionY: 50, // 电机子元素初始位置 Y
				rudderpositionX: 50, // 航舵子元素初始位置 X
				rudderpositionY: 50, // 航舵子元素初始位置 Y
				startX: 0, // 电机触摸起始点 X
				startY: 0, // 电机触摸起始点 Y
				rudderstartX: 0, // 航舵触摸起始点 X
				rudderstartY: 0, // 航舵触摸起始点 Y
				parentWidth: 0, // 父元素宽度
				parentHeight: 0, // 父元素高度
				draggableWidth: 0, // 子元素宽度
				draggableHeight: 0, // 子元素高度
				newDirection: '', //  电机新方向
				oldDirection: '', //  电机老方向
				ruddernewDirection: '', //  航舵新方向
				rudderoldDirection: '', //  航舵老方向
				counter: 0,
				socket: null,
				dutyValue: 1500,
				rudderDutyValue: 1500,
				intervarTime: null,
				rudderIntervarTime: null,
				heartbeatInterval: null, // 心跳定时器
				heartbeatTimeout: null, // 心跳超时定时器
				reconnectTimeout: null, // 重连定时器
				reconnectAttempts: 0, // 重连次数
				maxReconnectAttempts: 5, // 最大重连次数
			};
		},
		onLoad() {
			// 设置横屏
			// plus.screen.lockOrientation('landscape-primary');
			this.initWebSocket();
		},
		onUnload() {
			//链接Socket
			this.closeWebSocket();
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
				// plus.screen.lockOrientation('portrait-primary')
				uni.navigateTo({
					url: '/pages/car/car'
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
				this.positionX = 50;
				this.positionY = newY;

				//判断朝哪个方向
				this.checkPosition(this.positionX, this.positionY);
			},
			// 结束触摸
			onTouchEnd() {
				clearInterval(this.intervarTime)
				this.positionX = 50;
				this.positionY = 50;
				this.oldDirection = ''
				this.newDirection = ''
			},
			// 开始触摸
			onRudderTouchStart(e) {
				this.rudderstartX = e.touches[0].pageX - this.rudderpositionX;
				this.rudderstartY = e.touches[0].pageY - this.rudderpositionY;
			},
			// 拖动过程
			onRudderTouchMove(e) {
				const moveX = e.touches[0].pageX;
				const moveY = e.touches[0].pageY;

				// 计算新的位置
				let newX = moveX - this.rudderstartX;
				let newY = moveY - this.rudderstartY;

				// 限制范围
				newX = Math.max(0, Math.min(newX, this.parentWidth - this.draggableWidth));
				newY = Math.max(0, Math.min(newY, this.parentHeight - this.draggableHeight));
				this.rudderpositionX = newX;
				this.rudderpositionY = 50;

				//判断朝哪个方向
				this.checkPosition(this.rudderpositionX, this.rudderpositionY);
			},
			// 结束触摸
			onRudderTouchEnd() {
				clearInterval(this.rudderIntervarTime)
				this.rudderpositionX = 50;
				this.rudderpositionY = 50;
				this.rudderoldDirection = ''
				this.ruddernewDirection = ''
			},
			checkPosition(positionX, positionY, type) {
				if (positionX == 50 && positionY <= 40) {
					this.newDirection = "上"
				} else if (positionX <= 40 && positionY == 50) {
					this.ruddernewDirection = "左"
				} else if (positionX == 50 && (positionY > 40 && positionY < 60)) {
					this.newDirection = "电机停止"
				} else if ((positionX > 40 && positionX < 60) && positionY == 50) {
					this.ruddernewDirection = "航舵停止"
				} else if (positionX >= 60 && positionY == 50) {
					this.ruddernewDirection = "右"
				} else if (positionX == 50 && positionY >= 60) {
					this.newDirection = "下"
				}

				this.updataDirection()
			},
			updataDirection() {
				let ChannelDuty = {
					"bizCode": 602, //固定值
					"channelNum": 2, // 通道号1-8
					"duty": this.dutyValue, //通道信号的高电平时间（单位微秒）
					"timestamp": new Date().getTime(),
					"mac": "94:54:C5:E8:07:D4" //设备mac地址
				}
				let rudderChannelDuty = {
					"bizCode": 602, //固定值
					"channelNum": 1, // 通道号1-8
					"duty": this.rudderDutyValue, //通道信号的高电平时间（单位微秒）
					"timestamp": new Date().getTime(),
					"mac": "94:54:C5:E8:07:D4" //设备mac地址
				}
				if (this.newDirection !== this.oldDirection) {
					clearInterval(this.intervarTime)
					ChannelDuty.duty = this.dutyValue
					if (this.newDirection == '上') {
						this.intervarTime = setInterval(() => {
							if (ChannelDuty.duty >= 2500) {
								ChannelDuty.duty = 2500
							} else {
								ChannelDuty.duty += 100
							}
							this.sendMessage(JSON.stringify(ChannelDuty))
						}, 300)
					} else if (this.newDirection == '电机停止') {
						this.intervarTime = setInterval(() => {
							ChannelDuty.duty = this.dutyValue
							this.sendMessage(JSON.stringify(ChannelDuty))
						}, 300)
					} else if (this.newDirection == '下') {
						this.intervarTime = setInterval(() => {
							if (ChannelDuty.duty <= 500) {
								ChannelDuty.duty = 500
							} else {
								ChannelDuty.duty -= 100
							}
							this.sendMessage(JSON.stringify(ChannelDuty))
						}, 300)
					}
					this.oldDirection = this.newDirection
				}
				if (this.ruddernewDirection !== this.rudderoldDirection) {
					clearInterval(this.rudderIntervarTime)
					rudderChannelDuty.duty = this.rudderDutyValue
					if (this.ruddernewDirection == '右') {
						this.rudderIntervarTime = setInterval(() => {
							if (rudderChannelDuty.duty >= 2500) {
								rudderChannelDuty.duty = 2500
							} else {
								rudderChannelDuty.duty += 100
							}
							this.sendMessage(JSON.stringify(rudderChannelDuty))
						}, 300)
					} else if (this.ruddernewDirection == '航舵停止') {
						this.rudderIntervarTime = setInterval(() => {
							rudderChannelDuty.duty = this.rudderDutyValue
							this.sendMessage(JSON.stringify(rudderChannelDuty))
						}, 300)
					} else if (this.ruddernewDirection == '左') {
						this.rudderIntervarTime = setInterval(() => {
							if (rudderChannelDuty.duty <= 500) {
								rudderChannelDuty.duty = 500
							} else {
								rudderChannelDuty.duty -= 100
							}
							this.sendMessage(JSON.stringify(rudderChannelDuty))
						}, 300)
					}
					this.rudderoldDirection = this.ruddernewDirection
				}
			},

			initWebSocket() {
				this.socket = uni.connectSocket({
					url: 'ws://1.95.71.155:8888/ws/94:54:C5:E8:07:D4',
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
					this.startHeartbeat(); // 开始心跳机制
				});

				// 监听 WebSocket 收到消息事件
				this.socket.onMessage((res) => {
					console.log('收到消息:', event.data);
					const message = JSON.parse(event.data);

					// 如果是心跳响应
					if (message.type === 'pong') {
						console.log('收到心跳响应: pong');
						this.resetHeartbeatTimeout(); // 重置心跳超时计时器
					}
				});

				// 监听 WebSocket 关闭事件
				this.socket.onClose(() => {
					console.log('WebSocket已关闭');
					this.reconnect(); // 尝试重连
				});

				// 监听 WebSocket 错误事件
				this.socket.onError((err) => {
					console.error('WebSocket发生错误', err);
					this.reconnect(); // 尝试重连
				});
			},

			// 开始心跳机制
			startHeartbeat() {
				// 定时发送心跳消息
				this.heartbeatInterval = setInterval(() => {
					if (this.socket && this.socket.readyState === WebSocket.OPEN) {
						console.log('发送心跳: ping');
						this.socket.send(JSON.stringify({
							type: 'ping'
						}));
					}
				}, 5000); // 每5秒发送一次心跳

				// 设置心跳超时检测
				this.resetHeartbeatTimeout();
			},

			// 重置心跳超时计时器
			resetHeartbeatTimeout() {
				clearTimeout(this.heartbeatTimeout);
				this.heartbeatTimeout = setTimeout(() => {
					console.error('心跳超时，连接断开');
					this.socket.close(); // 主动关闭连接
					this.reconnect(); // 尝试重连
				}, 10000); // 如果10秒内未收到心跳响应，视为超时
			},

			// 重连逻辑
			reconnect() {
				if (this.reconnectAttempts >= this.maxReconnectAttempts) {
					console.error('超过最大重连次数，停止重连');
					return;
				}

				console.log('尝试重连...');
				this.reconnectAttempts++;

				this.reconnectTimeout = setTimeout(() => {
					this.initWebSocket(); // 重新初始化 WebSocket 连接
				}, 3000); // 每3秒尝试重连一次
			},

			// 清理心跳和重连
			clearHeartbeat() {
				clearInterval(this.heartbeatInterval);
				clearTimeout(this.heartbeatTimeout);
				clearTimeout(this.reconnectTimeout);
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
		beforeDestroy() {
			this.clearHeartbeat(); // 清理心跳和重连
			if (this.socket) {
				this.socket.close(); // 关闭 WebSocket 连接
			}
		}
	};
</script>


<style scoped lang="less">
	.container {
		display: flex;
		justify-content: start;
		align-items: center;
		height: 100vh;
		width: 100vw;
		background-color: rgba(0, 0, 0, 0.8);

		.back {
			position: fixed;
			z-index: 2;
			top: 20px;
			left: 20px;
			width: 30px;
			height: 30px;
		}
	}

	.operateBox {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 30px;

		.parent {
			position: relative;
			width: 150px;
			height: 150px;
			border-radius: 50%;
			background: url('../../assets/images/remote-sensing.png') no-repeat;
			background-size: 100% 100%;

			/* 防止子元素溢出 */
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
		}
	}
</style>