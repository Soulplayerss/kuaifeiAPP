<template>
	<view class="container">
		<view class="back" @click="back">
			<image src="../../assets/images/over.png" mode="" style="width: 30px;height: 30px;"></image>
		</view>

		<view class="slider">
			<view class="sliderItem" v-for="(item,index) in carInfo.appCarChannelList" :key="item.channelId">
				<span>{{item.channelName}}</span>
				<span>{{item.minValue}}</span>
				<view class="sliderBox">
					<view class="leftBox" :style="{ left: sliderLeftList[index].x + 'px'}"
						@touchstart="onSliderLeftTouchStart(index,$event)"
						@touchmove="onSliderLeftTouchMove(index,$event)" @touchend="onSliderLeftTouchEnd(index,$event)">
					</view>
					<view class="box1"></view>
					<view class="rightBox" :style="{ left: sliderRightList[index].x + 'px'}"
						@touchstart="onSliderRightTouchStart(index,$event)"
						@touchmove="onSliderRightTouchMove(index,$event)"
						@touchend="onSliderRightTouchEnd(index,$event)">
					</view>
					<view class="box2" :id="`slider${index + 1}`" :style="{left:sliderLeftList[index].box2Left + 'px'}">
						<view class="dire"></view>
					</view>
				</view>
				<span>{{item.maxValue}}</span>
			</view>
		</view>

		<view class="operateBox">
			<view class="parent">
				<view class="draggable" id="motor" :style="{ left: leftHandle.x + 'px', top: leftHandle.y + 'px' }"
					@touchstart="onTouchStart('leftHandle', $event)" @touchmove="onTouchMove('leftHandle', $event)"
					@touchend="onTouchEnd('leftHandle', $event)">
				</view>
			</view>
			<view class="parent">
				<view class="draggable" id="rudder" :style="{ left: rightHandle.x + 'px', top: rightHandle.y + 'px' }"
					@touchstart="onTouchStart('rightHandle', $event)" @touchmove="onTouchMove('rightHandle', $event)"
					@touchend="onTouchEnd('rightHandle', $event)">
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '@/utils/request';
	export default {
		data() {
			return {
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
				intervarTime: null,
				rudderIntervarTime: null,
				heartbeatInterval: null, // 心跳定时器
				heartbeatTimeout: null, // 心跳超时定时器
				reconnectTimeout: null, // 重连定时器
				reconnectAttempts: 0, // 重连次数
				maxReconnectAttempts: 5, // 最大重连次数
				isBack: false, // 最大重连次数
				macAddress: '',
				carId: '',
				carInfo: {},
				sliderLeftList: [],
				sliderRightList: [],
				box2Left: 0,
				leftHandle: {
					x: 50,
					y: 50,
					isDragging: false,
					startX: 0,
					startY: 0,
					identifier: null
				},
				rightHandle: {
					x: 50,
					y: 50,
					isDragging: false,
					startX: 0,
					startY: 0,
					identifier: null
				},
			};
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
			this.getCarInfo()
			// this.initWebSocket();
		},
		onUnload() {

			this.closeWebSocket();
			// 页面卸载时恢复竖屏
			// plus.screen.lockOrientation('portrait-primary')
		},
		mounted() {
			// 获取父元素和子元素的宽高
			this.isBack = false
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
				this.closeWebSocket();
				this.isBack = true
				uni.navigateTo({
					url: '/pages/car/car'
				});
			},
			onSliderLeftTouchStart(index, event) {
				const touch = event.touches[event.touches.length - 1]; // 当前的最后一个触摸点
				const handle = this.sliderLeftList[index];
				if (!handle.isDragging) {
					handle.isDragging = true;
					handle.startX = touch.clientX - handle.x;
					handle.startY = touch.clientY - handle.y;
					handle.identifier = touch.identifier; // 记录触摸点的 identifier
				}
			},
			onSliderLeftTouchMove(index, event) {
				const handle = this.sliderLeftList[index];
				if (!handle.isDragging) return;

				// 根据 identifier 找到当前触摸点
				const touch = Array.from(event.touches).find(
					(t) => t.identifier === handle.identifier
				);
				if (!touch) return;

				const newX = touch.clientX - handle.startX;

				const maxX = this.sliderRightList[index].x - 36;

				handle.x = Math.min(Math.max(newX, 0), maxX)
				handle.box2Left = Math.min(Math.max(newX, 0), maxX)
				let sliderDocment = document.getElementById(`slider${index + 1}`)
				let sliderDocmentWidth = sliderDocment.offsetWidth
				sliderDocment.style.width = (this.sliderRightList[index].x - Math.min(Math.max(newX, 0), maxX)) + 'px'
				let channelItem = this.carInfo.appCarChannelList[index]
				channelItem.minValue = Math.round(channelItem.defaultMinValue + (((channelItem.defaultMaxValue -
					channelItem.defaultMinValue) / 200) * handle.x))
			},
			onSliderLeftTouchEnd(index, event) {
				const handle = this.sliderLeftList[index];
				const touch = Array.from(event.changedTouches).find(
					(t) => t.identifier === handle.identifier
				);
				if (touch) {
					handle.isDragging = false;
					handle.identifier = null;
				}
			},
			onSliderRightTouchStart(index, event) {
				const touch = event.touches[event.touches.length - 1]; // 当前的最后一个触摸点
				const handle = this.sliderRightList[index];
				if (!handle.isDragging) {
					handle.isDragging = true;
					handle.startX = touch.clientX - handle.x;
					handle.startY = touch.clientY - handle.y;
					handle.identifier = touch.identifier; // 记录触摸点的 identifier
				}
			},
			onSliderRightTouchMove(index, event) {
				const handle = this.sliderRightList[index];
				if (!handle.isDragging) return;

				// 根据 identifier 找到当前触摸点
				const touch = Array.from(event.touches).find(
					(t) => t.identifier === handle.identifier
				);
				if (!touch) return;

				const newX = touch.clientX - handle.startX;

				const maxX = 182;

				handle.x = Math.min(Math.max(newX, 0), maxX)
				let sliderDocment = document.getElementById(`slider${index + 1}`)
				sliderDocment.style.width = (Math.min(Math.max(newX, 0), maxX) - this.sliderLeftList[index].x) + 'px'
				if (handle.x <= (this.sliderLeftList[index].x + 36)) {
					handle.x = this.sliderLeftList[index].x + 36
					sliderDocment.style.width = 36 + 'px'
				}
				let channelItem = this.carInfo.appCarChannelList[index]
				channelItem.maxValue = Math.round(channelItem.defaultMaxValue - (((channelItem.defaultMaxValue -
					channelItem.defaultMinValue) / 200) * (182 - handle.x)))
			},
			onSliderRightTouchEnd(index, event) {
				const handle = this.sliderRightList[index];
				const touch = Array.from(event.changedTouches).find(
					(t) => t.identifier === handle.identifier
				);
				if (touch) {
					handle.isDragging = false;
					handle.identifier = null;
				}
			},
			// 触摸开始
			onTouchStart(handleKey, event) {
				const touch = event.touches[event.touches.length - 1]; // 当前的最后一个触摸点
				const handle = this[handleKey];
				if (!handle.isDragging) {
					handle.isDragging = true;
					handle.startX = touch.clientX - handle.x;
					handle.startY = touch.clientY - handle.y;
					handle.identifier = touch.identifier; // 记录触摸点的 identifier
				}
			},

			// 触摸移动
			onTouchMove(handleKey, event) {
				const handle = this[handleKey];
				if (!handle.isDragging) return;

				// 根据 identifier 找到当前触摸点
				const touch = Array.from(event.touches).find(
					(t) => t.identifier === handle.identifier
				);
				if (!touch) return;

				const newX = touch.clientX - handle.startX;
				const newY = touch.clientY - handle.startY;

				// 限制范围
				const maxX = this.parentWidth - this.draggableWidth; // 假设按钮宽度为50
				const maxY = this.parentHeight - this.draggableHeight; // 假设按钮高度为50

				if (event.target.id == 'motor') {
					handle.x = 50;
					handle.y = Math.min(Math.max(newY, 0), maxY);
				} else {
					handle.x = Math.min(Math.max(newX, 0), maxX);
					handle.y = 50;
				}

				//判断朝哪个方向
				this.checkPosition(handle.x, handle.y);
			},

			// 触摸结束
			onTouchEnd(handleKey, event) {
				const handle = this[handleKey];
				const touch = Array.from(event.changedTouches).find(
					(t) => t.identifier === handle.identifier
				);
				if (event.target.id == 'motor') {
					clearInterval(this.intervarTime)
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": 2, // 通道号1-8
						"duty": this.getDutyValue(2, 0), //通道信号的高电平时间（单位微秒）
						"timestamp": new Date().getTime(),
						"mac": this.macAddress //设备mac地址
					}))
				} else {
					clearInterval(this.rudderIntervarTime)
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": 1, // 通道号1-8
						"duty": this.getDutyValue(1, 0), //通道信号的高电平时间（单位微秒）
						"timestamp": new Date().getTime(),
						"mac": this.macAddress //设备mac地址
					}))
				}
				if (touch) {
					handle.isDragging = false;
					handle.identifier = null; // 释放触摸点
					handle.x = 50;
					handle.y = 50;
				}
				this.oldDirection = ''
				this.newDirection = ''
				this.rudderoldDirection = ''
				this.ruddernewDirection = ''
			},
			checkPosition(positionX, positionY) {
				if (positionX == 50 && (positionY <= 10 && positionY >= 0)) {
					this.newDirection = "top5"
				} else if (positionX == 50 && (positionY <= 20 && positionY > 10)) {
					this.newDirection = "top4"
				} else if (positionX == 50 && (positionY <= 30 && positionY > 20)) {
					this.newDirection = "top3"
				} else if (positionX == 50 && (positionY <= 40 && positionY > 30)) {
					this.newDirection = "top2"
				} else if (positionX == 50 && (positionY <= 45 && positionY > 40)) {
					this.newDirection = "top1"
				} else if ((positionX > 40 && positionX <= 45) && positionY == 50) {
					this.ruddernewDirection = "left1"
				} else if ((positionX > 30 && positionX <= 40) && positionY == 50) {
					this.ruddernewDirection = "left2"
				} else if ((positionX > 20 && positionX <= 30) && positionY == 50) {
					this.ruddernewDirection = "left3"
				} else if ((positionX > 10 && positionX <= 20) && positionY == 50) {
					this.ruddernewDirection = "left4"
				} else if ((positionX >= 0 && positionX <= 10) && positionY == 50) {
					this.ruddernewDirection = "left5"
				} else if (positionX == 50 && (positionY > 45 && positionY < 55)) {
					this.newDirection = "motorStop"
				} else if ((positionX > 45 && positionX < 55) && positionY == 50) {
					this.ruddernewDirection = "rudderStop"
				} else if ((positionX >= 55 && positionX < 60) && positionY == 50) {
					this.ruddernewDirection = "right1"
				} else if ((positionX >= 60 && positionX < 70) && positionY == 50) {
					this.ruddernewDirection = "right2"
				} else if ((positionX >= 70 && positionX < 80) && positionY == 50) {
					this.ruddernewDirection = "right3"
				} else if ((positionX >= 80 && positionX < 90) && positionY == 50) {
					this.ruddernewDirection = "right4"
				} else if ((positionX >= 90 && positionX <= 100) && positionY == 50) {
					this.ruddernewDirection = "right5"
				} else if (positionX == 50 && (positionY >= 55 && positionY < 60)) {
					this.newDirection = "bottom1"
				} else if (positionX == 50 && (positionY >= 60 && positionY < 70)) {
					this.newDirection = "bottom2"
				} else if (positionX == 50 && (positionY >= 70 && positionY < 80)) {
					this.newDirection = "bottom3"
				} else if (positionX == 50 && (positionY >= 80 && positionY < 90)) {
					this.newDirection = "bottom4"
				} else if (positionX == 50 && (positionY >= 90 && positionY <= 100)) {
					this.newDirection = "bottom5"
				}

				this.updateDirection()
			},
			updateDirection() {
				let ChannelDuty = {
					"bizCode": 602, //固定值
					"channelNum": 2, // 通道号1-8
					"duty": 0, //通道信号的高电平时间（单位微秒）
					"timestamp": new Date().getTime(),
					"mac": this.macAddress //设备mac地址
				}
				let rudderChannelDuty = {
					"bizCode": 602, //固定值
					"channelNum": 1, // 通道号1-8
					"duty": 0, //通道信号的高电平时间（单位微秒）
					"timestamp": new Date().getTime(),
					"mac": this.macAddress //设备mac地址
				}
				// Duty 值映射表
				const dutyMap = {
					"top1": this.getDutyValue(2, 1),
					"top2": this.getDutyValue(2, 2),
					"top3": this.getDutyValue(2, 3),
					"top4": this.getDutyValue(2, 4),
					"top5": this.getDutyValue(2, 5),
					"motorStop": this.getDutyValue(2, 0),
					"bottom1": this.getDutyValue(2, -1),
					"bottom2": this.getDutyValue(2, -2),
					"bottom3": this.getDutyValue(2, -3),
					"bottom4": this.getDutyValue(2, -4),
					"bottom5": this.getDutyValue(2, -5)
				};

				const rudderDutyMap = {
					"right1": this.getDutyValue(1, 1),
					"right2": this.getDutyValue(1, 2),
					"right3": this.getDutyValue(1, 3),
					"right4": this.getDutyValue(1, 4),
					"right5": this.getDutyValue(1, 5),
					"rudderStop": this.getDutyValue(1, 0),
					"left1": this.getDutyValue(1, -1),
					"left2": this.getDutyValue(1, -2),
					"left3": this.getDutyValue(1, -3),
					"left4": this.getDutyValue(1, -4),
					"left5": this.getDutyValue(1, -5)
				};

				// 清理和启动定时器的函数
				const clearAndStartInterval = (direction, dutyMap, channelDuty, intervalTime, isRudder = false) => {
					const duty = dutyMap[direction]; // 默认为 1500 (停止)
					clearInterval(isRudder ? this.rudderIntervarTime : this.intervarTime);

					// 停止信号直接发送一次
					if (direction === 'motorStop' || direction === 'rudderStop') {
						channelDuty.duty = duty;
						this.sendMessage(JSON.stringify(channelDuty));
					} else {
						const sendDutyUpdate = () => {
							channelDuty.duty = duty;
							this.sendMessage(JSON.stringify(channelDuty));
						};
						const intervalID = setInterval(sendDutyUpdate, intervalTime);
						// 存储定时器ID
						if (isRudder) {
							this.rudderIntervarTime = intervalID;
						} else {
							this.intervarTime = intervalID;
						}
					}
				};

				// 电机方向变化处理
				if (this.newDirection !== this.oldDirection) {
					clearAndStartInterval(this.newDirection, dutyMap, ChannelDuty, 100);
					this.oldDirection = this.newDirection;
				}

				// 舵机方向变化处理
				if (this.ruddernewDirection !== this.rudderoldDirection) {
					clearAndStartInterval(this.ruddernewDirection, rudderDutyMap, rudderChannelDuty, 100, true);
					this.rudderoldDirection = this.ruddernewDirection;
				}
			},
			initWebSocket() {
				this.socket = uni.connectSocket({
					url: `ws://36d29893.r32.cpolar.top/ws/${this.macAddress}`,
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
					// this.startHeartbeat(); // 开始心跳机制
				});

				// 监听 WebSocket 收到消息事件
				this.socket.onMessage((event) => {
					console.log('收到消息：', event)
					// 如果是心跳响应
					if (event.data === 'pong') {
						console.log('收到心跳响应: pong');
						// this.resetHeartbeatTimeout(); // 重置心跳超时计时器
					} else {
						console.log('收到消息:', JSON.parse(event.data));
					}
				});

				// 监听 WebSocket 关闭事件
				this.socket.onClose(() => {
					console.log('WebSocket已关闭');
					// this.reconnect(); // 尝试重连
				});

				// 监听 WebSocket 错误事件
				this.socket.onError((err) => {
					console.error('WebSocket发生错误', err);
					// this.reconnect(); // 尝试重连
				});
			},

			// 开始心跳机制
			startHeartbeat() {
				// 定时发送心跳消息
				this.heartbeatInterval = setInterval(() => {
					if (this.socket && this.socket.readyState === WebSocket.OPEN) {
						this.sendMessage('ping')
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
				if (this.reconnectAttempts >= this.maxReconnectAttempts || this.isBack) {
					return;
				}

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
			async getCarInfo() {
				try {
					const response = await request(`/app/carInfo/getInfoByCarId/${this.carId}`, 'GET')
					if (response.code === 200) {
						this.carInfo = response.data
						if (this.carInfo.appCarChannelList.length) {
							this.carInfo.appCarChannelList.forEach((item) => {
								item.defaultMinValue = item.minValue
								item.defaultMaxValue = item.maxValue
								this.sliderLeftList.push({
									x: 0,
									y: 0,
									isDragging: false,
									startX: 0,
									startY: 0,
									box2Left: 0,
									identifier: null
								})
								this.sliderRightList.push({
									x: 182,
									y: 0,
									isDragging: false,
									startX: 0,
									startY: 0,
									box2Left: 0,
									identifier: null
								})
							})
						}
					}
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			getDutyValue(channelName, number) {
				let maxValue = this.carInfo.appCarChannelList.find((item) => item.channelId == channelName).maxValue
				let minValue = this.carInfo.appCarChannelList.find((item) => item.channelId == channelName).minValue
				let median = (maxValue + minValue) / 2 // 中间值
				let share = (maxValue - minValue) / 10 // 份额
				let value = Math.round(median + (share * number))
				if (number == 5) {
					value = maxValue
				} else if (number == -5) {
					value = minValue
				}

				return value
			}
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
		height: 100vh;
		width: 100vw;
		background-color: rgba(0, 0, 0, 0.8);

		.back {
			padding: 20px;
			width: 30px;
			height: 30px;
		}

		.slider {
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.sliderItem {
				width: 50%;
				display: flex;
				align-items: center;
				gap: 16px;
				box-sizing: border-box;
				padding: 16px;
				color: #FFF;
				font-size: 14px;

				.sliderBox {
					width: 200px;
					height: 18px;
					display: flex;
					align-items: center;
					position: relative;
					overflow: hidden;

					.box1 {
						width: 100%;
						height: 3px;
						background-color: #8fcac3;
					}

					.box2 {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						display: flex;
						align-items: center;
						z-index: 2;

						.dire {
							width: 100%;
							height: 3px;
							background-color: #f0dd09;
						}

					}

					.leftBox,
					.rightBox {
						position: absolute;
						z-index: 3;
						top: 0;
						width: 18px;
						height: 18px;
						border-radius: 50%;
						background-color: #eea618;
					}

					.leftBox {
						left: 0;
					}

					.rightBox {
						right: 182px;
					}
				}
			}
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