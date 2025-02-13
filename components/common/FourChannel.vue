<template>
	<view class="container">
		<!-- <Camera /> -->
		<web-view class="webview" src="/static/webRTC/onminirtc.html"></web-view>
		<cover-view class="content">
			<cover-view class="verifyBox" v-show="showVerify">
				<u-icon name="play-left-fill" :size="20" color="#FFF"></u-icon>
				<cover-view class="verifyContent">
					<cover-view class="flex justify-between title">
						释放降落伞
						<u-icon name="close" :size="20" @click="showVerify = false"></u-icon>
					</cover-view>
					<XlSliderVerify @success="verifySuccess" v-show="isSocket" />
				</cover-view>
			</cover-view>
			<cover-view class="topInfo">
				<cover-view class="parachute"
					style="background-color: #FFF;width: 32px;padding: 6px;position: relative;margin-left: 16px;">
					<cover-image src="../../assets/images/parachute.png" mode="" style="width: 32px;height: 32px;"
						@click="showVerify = !showVerify"></cover-image>

				</cover-view>

				<cover-view class="_item">
					<cover-view>电池电压：{{socket503Data.voltage_battery}} V</cover-view>
					<cover-view>电池电流：{{socket503Data.current_battery}} A</cover-view>
					<cover-view>电池电量：{{socket503Data.battery_remaining}}</cover-view>
					<cover-view>信号强度：{{socket501Data.myCsq}}</cover-view>
				</cover-view>

				<cover-image src="../../assets/images/over.png" mode="" style="width: 30px;height: 30px;"
					@click="back"></cover-image>
			</cover-view>
			<cover-view class="centerInfo">
				<cover-view class="_item" style="width: 30%;">
					<cover-view>纬度：{{socket502Data.lat}}</cover-view>
					<cover-view>经度：{{socket502Data.lon}}</cover-view>
					<cover-view>绝对高度：{{socket502Data.alt}}</cover-view>
					<cover-view>相对高度：{{socket502Data.relative_alt}}</cover-view>
					<cover-view>X速度：{{socket502Data.vx}}</cover-view>
					<cover-view>Y速度：{{socket502Data.vy}}</cover-view>
					<cover-view>Z速度：{{socket502Data.vz}}</cover-view>
					<cover-view>航向角：{{socket502Data.hdg}}</cover-view>
				</cover-view>
				<cover-view class="_item" style="width: 65%;">
					<cover-view>滚转角：{{socket504Data.roll}} rad</cover-view>
					<cover-view>俯仰角：{{socket504Data.pitch}} rad</cover-view>
					<cover-view>偏航角：{{socket504Data.yaw}} rad</cover-view>
					<cover-view>滚转角速度：{{socket504Data.rollspeed}} rad/s</cover-view>
					<cover-view>俯仰角速度：{{socket504Data.pitchspeed}} rad/s</cover-view>
					<cover-view>偏航角速度：{{socket504Data.yawspeed}} rad/s</cover-view>
				</cover-view>
			</cover-view>
			<!-- <cover-view class="slider" v-show="carInfo.appCarChannelList && carInfo.appCarChannelList.length> 0">
			<cover-view class="sliderItem" v-for="(item,index) in carInfo.appCarChannelList" :key="item.channelNum"
				v-show="index <= 5">
				<span>{{item.channelName}}</span>
				<span style="display: inline-block;width: 35px;">{{item.minValue}}</span>
				<cover-view class="sliderBox" v-if="sliderLeftList.length >=  carInfo.appCarChannelList.length">
					<cover-view class="leftBox" :style="{ left: sliderLeftList[index].x + 'px'}"
						@touchstart="onSliderLeftTouchStart(index,$event)"
						@touchmove="onSliderLeftTouchMove(index,$event)" @touchend="onSliderLeftTouchEnd(index,$event)">
					</cover-view>
					<cover-view class="box1"></cover-view>
					<cover-view class="rightBox" :style="{ left: sliderRightList[index].x + 'px'}"
						@touchstart="onSliderRightTouchStart(index,$event)"
						@touchmove="onSliderRightTouchMove(index,$event)"
						@touchend="onSliderRightTouchEnd(index,$event)">
					</cover-view>
					<cover-view class="box2" :id="`slider${index + 1}`"
						:style="{left:sliderLeftList[index].box2Left + 'px', width:sliderLeftList[index].box2Width + 'px'}">
						<cover-view class="dire"></cover-view>
					</cover-view>
				</cover-view>
				<span style="display: inline-block;width: 35px;">{{item.maxValue}}</span>
			</cover-view>
		</cover-view> -->

			<cover-view class="operateBox">
				<cover-view class="parent">
					<cover-image src="../../assets/images/remote-sensing.png" mode=""
						style="width: 100%;height: 100%;position: absolute;"></cover-image>
					<cover-image src="../../assets/images/remote-sensing.png" id="motor"
						:style="{ left: leftHandle.x + 'px', top: leftHandle.y + 'px' }"
						@touchstart="onTouchStart('leftHandle', $event)" @touchmove="onTouchMove('leftHandle', $event)"
						@touchend="onTouchEnd('leftHandle', $event)" @touchcancel="onTouchCancel('leftHandle', $event)"
						mode="" class="draggable"></cover-image>
				</cover-view>
				<cover-view class="actionButtonBox">
					<cover-view class="actionButton" :class="[fiveActive == 'up' ? 'activeFiveButton' : '']">
						<cover-image src="../../assets/images/up.png" mode="" @click="sendFiveMessage(5, 'up')"
							style="width: 36px;height: 36px;"></cover-image>
					</cover-view>
					<cover-view class="actionButton" :class="[fiveActive == 'center' ? 'activeFiveButton' : '']">
						<cover-image src="../../assets/images/center.png" mode="" @click="sendFiveMessage(0, 'center')"
							style="width: 36px;height: 36px;"></cover-image>
					</cover-view>
					<cover-view class="actionButton" :class="[fiveActive == 'down' ? 'activeFiveButton' : '']">
						<cover-image src="../../assets/images/down.png" mode="" @click="sendFiveMessage(-5, 'down')"
							style="width: 36px;height: 36px;"></cover-image>
					</cover-view>
				</cover-view>
				<cover-view class="actionButtonBox">
					<cover-view class="actionButton" :class="[sixActive == 'up' ? 'activeFiveButton' : '']">
						<cover-image src="../../assets/images/up.png" mode="" @click="sendSixMessage(5, 'up')"
							style="width: 36px;height: 36px;"></cover-image>
					</cover-view>
					<cover-view class="actionButton" :class="[sixActive == 'center' ? 'activeFiveButton' : '']">
						<cover-image src="../../assets/images/center.png" mode="" @click="sendSixMessage(0, 'center')"
							style="width: 36px;height: 36px;"></cover-image>
					</cover-view>
					<cover-view class="actionButton" :class="[sixActive == 'down' ? 'activeFiveButton' : '']">
						<cover-image src="../../assets/images/down.png" mode="" @click="sendSixMessage(-5, 'down')"
							style="width: 36px;height: 36px;"></cover-image>
					</cover-view>
				</cover-view>
				<cover-view class="parent">
					<cover-image src="../../assets/images/remote-sensing.png" mode=""
						style="width: 100%;height: 100%;position: absolute;"></cover-image>
					<cover-image class="draggable" id="rudder" src="../../assets/images/remote-sensing.png" mode=""
						:style="{ left: rightHandle.x + 'px', top: rightHandle.y + 'px' }"
						@touchstart="onTouchStart('rightHandle', $event)"
						@touchmove="onTouchMove('rightHandle', $event)" @touchend="onTouchEnd('rightHandle', $event)"
						@touchcancel="onTouchCancel('rightHandle', $event)"></cover-image>
				</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
	import {
		socketUrl
	} from '@/utils/request';
	import XlSliderVerify from '@/components/common/XlSliderVerify.vue'
	// import Camera from '@/components/common/Camera.vue'
	export default {
		props: {
			carInfo: {
				type: Object,
				default: {}
			},
			macAddress: {
				type: String,
				default: ''
			},
			carId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				fiveActive: 'center',
				sixActive: 'center',
				showVerify: false,
				hours: 0,
				minutes: 0,
				seconds: 0,
				parentWidth: 150, // 父元素宽度
				parentHeight: 150, // 父元素高度
				draggableWidth: 50, // 子元素宽度
				draggableHeight: 50, // 子元素高度
				newDirection: '', //  电机新方向
				oldDirection: '', //  电机老方向
				ruddernewDirection: '', //  航舵新方向
				rudderoldDirection: '', //  航舵老方向
				counter: 0,
				socket: null,
				intervarTime: null,
				rudderIntervarTime: null,
				fiveIntervarTime: null,
				sixIntervarTime: null,
				heartbeatInterval: null, // 心跳定时器
				heartbeatTimeout: null, // 心跳超时定时器
				reconnectTimeout: null, // 重连定时器
				reconnectAttempts: 0, // 重连次数
				maxReconnectAttempts: 5, // 最大重连次数
				isBack: false, // 最大重连次数
				socket501Data: {},
				socket502Data: {},
				socket503Data: {},
				socket504Data: {},
				logList: [],
				sliderLeftList: [{
					x: 0,
					y: 0,
					isDragging: false,
					startX: 0,
					startY: 0,
					box2Left: 0,
					box2Width: 200,
					identifier: null
				}],
				sliderRightList: [{
					x: 182,
					y: 0,
					isDragging: false,
					startX: 0,
					startY: 0,
					box2Left: 0,
					identifier: null
				}],
				box2Left: 0,
				message: '',
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
				startTouch: [],
				moveTouch: [],
				endTouch: [],
				endIdentifier: null,
				unrepeatedObjects: {},
				touching: false,
				isSocket: false,
				touchCancel: []
			};
		},
		onLoad(options) {

		},
		components: {
			XlSliderVerify
			// Camera
		},
		onUnload() {
			this.closeWebSocket();
		},
		mounted() {
			if (this.carInfo.appCarChannelList.length) {
				this.initWebSocket();
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
						box2Width: 200,
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
			this.isBack = false
		},
		methods: {
			back() {
				this.$emit('back')
				this.clearHeartbeat(); // 清理心跳和重连
				this.isBack = true
				if (this.socket) {
					this.closeWebSocket();
				}
				uni.navigateTo({
					url: '/pages/car/car'
				});
			},
			async endCar() {
				try {
					const response = await request(`/app/carInfo/endCar/${this.macAddress}`, 'GET')
					if (response.code == 200) {
						this.back()
					}
				} catch (error) {
					uni.showToast({
						title: '结束失败',
						icon: 'none',
					});
				}
			},
			verifySuccess() {
				this.sendMessage(JSON.stringify({
					"bizCode": 605,
					"handledParachuteSwitch": 1,
					"timestamp": this.getTimestamp(),
					"mac": this.macAddress
				}))
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
					(t) => t.identifier == handle.identifier
				);
				if (!touch) return;

				const newX = touch.clientX - handle.startX;

				const maxX = this.sliderRightList[index].x - 36;

				handle.x = Math.min(Math.max(newX, 0), maxX)
				handle.box2Left = Math.min(Math.max(newX, 0), maxX)
				handle.box2Width = this.sliderRightList[index].x - Math.min(Math.max(newX, 0), maxX)

				let channelItem = this.carInfo.appCarChannelList[index]
				channelItem.minValue = Math.round(channelItem.defaultMinValue + (((channelItem.defaultMaxValue -
					channelItem.defaultMinValue) / 200) * handle.x))
			},
			onSliderLeftTouchEnd(index, event) {
				const handle = this.sliderLeftList[index];
				const touch = Array.from(event.changedTouches).find(
					(t) => t.identifier == handle.identifier
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
					(t) => t.identifier == handle.identifier
				);
				if (!touch) return;

				const newX = touch.clientX - handle.startX;

				const maxX = 182;

				handle.x = Math.min(Math.max(newX, 0), maxX)

				if (handle.x <= (this.sliderLeftList[index].x + 36)) {
					handle.x = this.sliderLeftList[index].x + 36
				}
				this.sliderLeftList[index].box2Width = handle.x - this.sliderLeftList[index].x
				let channelItem = this.carInfo.appCarChannelList[index]
				channelItem.maxValue = Math.round(channelItem.defaultMaxValue - (((channelItem.defaultMaxValue -
					channelItem.defaultMinValue) / 200) * (182 - handle.x)))
			},
			onSliderRightTouchEnd(index, event) {
				const handle = this.sliderRightList[index];
				const touch = Array.from(event.changedTouches).find(
					(t) => t.identifier == handle.identifier
				);
				if (touch) {
					handle.isDragging = false;
					handle.identifier = null;
				}
			},
			// 触摸开始
			onTouchStart(handleKey, event) {
				event.stopPropagation(); // 阻止事件冒泡
				const touch = event.touches[event.touches.length - 1]; // 当前的最后一个触摸点
				this.startTouch = event.touches
				const handle = this[handleKey];
				if (!handle.isDragging) {
					handle.isDragging = true;
					if (this.touchCancel.length > 1 && this.touching) {
						if (this.endTouch.length == 0) {
							let touchs = event.touches.find(item => item.identifier == 0)
							handle.startX = touchs.clientX - handle.x;
							handle.startY = touchs.clientY - handle.y;
							handle.identifier = 0
							this.endTouch.push(touchs)
						} else {
							let identifier = this.touchCancel[this.endTouch.length].identifier
							let touchs = event.touches.find(item => item.identifier == identifier)
							handle.startX = touchs.clientX - handle.x;
							handle.startY = touchs.clientY - handle.y;
							handle.identifier = identifier
							this.endTouch.push(touchs)
							if (this.endTouch.length == this.touchCancel.length) {
								this.touchCancel = []
								this.touching = false
							}
						}
					} else {
						this.touching = false
						if (this.endTouch.length == 0) {
							handle.startX = touch.clientX - handle.x;
							handle.startY = touch.clientY - handle.y;
							handle.identifier = touch.identifier
							this.endTouch = JSON.parse(JSON.stringify(this.startTouch))
						} else {
							this.unrepeatedObjects = this.findUnrepeatedObjects(this.startTouch, this.endTouch,
								'identifier')
							handle.startX = this.unrepeatedObjects[0].clientX - handle.x;
							handle.startY = this.unrepeatedObjects[0].clientY - handle.y;
							handle.identifier = this.unrepeatedObjects[0].identifier
						}

					}
				}
			},

			findUnrepeatedObjects(array1, array2, key) {
				return array1.filter(item => !array2.some(i => i[key] == item[key])) // 只存在于第一个数组的对象
					.concat(array2.filter(item => !array1.some(i => i[key] == item[key]))); // 只存在于第二个数组的对象
			},

			// 触摸移动
			onTouchMove(handleKey, event) {
				event.preventDefault()
				const handle = this[handleKey]
				if (!handle.isDragging) return

				this.moveTouch = event.touches
				if (!this.touching) {
					this.endTouch = JSON.parse(JSON.stringify(this.moveTouch))
				}
				// 根据 identifier 找到当前触摸点
				const touch = Array.from(event.touches).find(
					(t) => t.identifier == handle.identifier
				);
				if (!touch) return

				const newX = touch.clientX - handle.startX
				const newY = touch.clientY - handle.startY

				// 限制范围
				const maxX = 100
				const maxY = 100

				handle.x = Math.min(Math.max(newX, 0), maxX);
				handle.y = Math.min(Math.max(newY, 0), maxY);
				//判断朝哪个方向
				this.checkPosition(handle.x, handle.y, event.target.id);
			},

			// 触摸结束
			onTouchEnd(handleKey, event) {
				const handle = this[handleKey];

				this.endTouch = this.endTouch.filter(item => !(item.identifier == event.changedTouches[0].identifier));
				handle.isDragging = false;
				handle.identifier = null;
				handle.x = 50;
				handle.y = 50;
				this.sendEndMessage(event.target.id)
			},
			sendFiveMessage(number, value) {
				this.fiveActive = value
				clearInterval(this.fiveIntervarTime);
				this.fiveIntervarTime = setInterval(() => {
					this.sendMessage(JSON.stringify({
						bizCode: 602,
						channelNum: this.getChannelNum(5),
						duty: this.getDutyValue(5, number),
						timestamp: this.getTimestamp(),
						mac: this.macAddress
					}))
				}, 1500)
			},
			sendSixMessage(number, value) {
				this.sixActive = value
				clearInterval(this.sixIntervarTime);
				this.sixIntervarTime = setInterval(() => {
					this.sendMessage(JSON.stringify({
						bizCode: 602,
						channelNum: this.getChannelNum(6),
						duty: this.getDutyValue(6, number),
						timestamp: this.getTimestamp(),
						mac: this.macAddress
					}))
				}, 1500)
			},
			sendEndMessage(id) {
				if (id == 'motor' && this.carInfo) {
					clearInterval(this.intervarTime)
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.getChannelNum(1), // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
						"timestamp": this.getTimestamp(),
						"mac": this.macAddress //设备mac地址
					}))
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.getChannelNum(2), // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
						"timestamp": this.getTimestamp(),
						"mac": this.macAddress //设备mac地址
					}))
					this.oldDirection = ''
					this.newDirection = ''
				} else if (id == 'rudder' && this.carInfo) {
					clearInterval(this.rudderIntervarTime)
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.getChannelNum(3), // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
						"timestamp": this.getTimestamp(),
						"mac": this.macAddress //设备mac地址
					}))
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.getChannelNum(4), // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
						"timestamp": this.getTimestamp(),
						"mac": this.macAddress //设备mac地址
					}))
					this.rudderoldDirection = ''
					this.ruddernewDirection = ''
				}
			},
			onTouchCancel(handleKey, event) {
				this.touchCancel = JSON.parse(JSON.stringify(this.moveTouch))
				this.touching = true
				this.leftHandle = {
					x: 50,
					y: 50,
					isDragging: false,
					startX: 0,
					startY: 0,
					identifier: null
				}
				this.rightHandle = {
					x: 50,
					y: 50,
					isDragging: false,
					startX: 0,
					startY: 0,
					identifier: null
				}
				this.endTouch = []
				this.sendEndMessage('motor')
				this.sendEndMessage('rudder')
			},
			checkPosition(positionX, positionY, id) {
				if (positionX > 45 && positionX < 55) {
					switch (true) {
						case positionY <= 10 && positionY >= 0:
							id == 'motor' ? this.newDirection = "top5" : id == 'rudder' ? this.ruddernewDirection =
								"top5" : ''
							break;
						case positionY <= 20 && positionY > 10:
							id == 'motor' ? this.newDirection = "top4" : id == 'rudder' ? this.ruddernewDirection =
								"top4" : ''
							break;
						case positionY <= 30 && positionY > 20:
							id == 'motor' ? this.newDirection = "top3" : id == 'rudder' ? this.ruddernewDirection =
								"top3" : ''
							break;
						case positionY <= 40 && positionY > 30:
							id == 'motor' ? this.newDirection = "top2" : id == 'rudder' ? this.ruddernewDirection =
								"top2" : ''
							break;
						case positionY <= 45 && positionY > 40:
							id == 'motor' ? this.newDirection = "top1" : id == 'rudder' ? this.ruddernewDirection =
								"top1" : ''
							break;
						case positionY <= 55 && positionY > 45:
							id == 'motor' ? this.newDirection = "motorStop" : id == 'rudder' ? this.ruddernewDirection =
								"rudderStop" : ''
							break;
						case positionY <= 60 && positionY > 55:
							id == 'motor' ? this.newDirection = "bottom1" : id == 'rudder' ? this.ruddernewDirection =
								"bottom1" : ''
							break;
						case positionY <= 70 && positionY > 60:
							id == 'motor' ? this.newDirection = "bottom2" : id == 'rudder' ? this.ruddernewDirection =
								"bottom2" : ''
							break;
						case positionY <= 80 && positionY > 70:
							id == 'motor' ? this.newDirection = "bottom3" : id == 'rudder' ? this.ruddernewDirection =
								"bottom3" : ''
							break;
						case positionY <= 90 && positionY > 80:
							id == 'motor' ? this.newDirection = "bottom4" : id == 'rudder' ? this.ruddernewDirection =
								"bottom4" : ''
							break;
						case positionY <= 100 && positionY > 90:
							id == 'motor' ? this.newDirection = "bottom5" : id == 'rudder' ? this.ruddernewDirection =
								"bottom5" : ''
							break;
					}
				} else if (positionY > 45 && positionY < 55) {
					switch (true) {
						case positionX <= 10 && positionX >= 0:
							id == 'motor' ? this.newDirection = "left5" : this.ruddernewDirection = "left5"
							break;
						case positionX <= 20 && positionX > 10:
							id == 'motor' ? this.newDirection = "left4" : this.ruddernewDirection = "left4"
							break;
						case positionX <= 30 && positionX > 20:
							id == 'motor' ? this.newDirection = "left3" : this.ruddernewDirection = "left3"
							break;
						case positionX <= 40 && positionX > 30:
							id == 'motor' ? this.newDirection = "left2" : this.ruddernewDirection = "left2"
							break;
						case positionX <= 45 && positionX > 40:
							id == 'motor' ? this.newDirection = "left1" : this.ruddernewDirection = "left1"
							break;
						case positionX <= 55 && positionX > 45:
							id == 'motor' ? this.newDirection = "motorStop" : this.ruddernewDirection = "rudderStop"
							break;
						case positionX <= 60 && positionX > 55:
							id == 'motor' ? this.newDirection = "right1" : this.ruddernewDirection = "right1"
							break;
						case positionX <= 70 && positionX > 60:
							id == 'motor' ? this.newDirection = "right2" : this.ruddernewDirection = "right2"
							break;
						case positionX <= 80 && positionX > 70:
							id == 'motor' ? this.newDirection = "right3" : this.ruddernewDirection = "right3"
							break;
						case positionX <= 90 && positionX > 80:
							id == 'motor' ? this.newDirection = "right4" : this.ruddernewDirection = "right4"
							break;
						case positionX <= 100 && positionX > 90:
							id == 'motor' ? this.newDirection = "right5" : this.ruddernewDirection = "right5"
							break;
					}
				} else if (positionX < 20 && positionY < 20) {
					switch (id) {
						case 'motor':
							this.newDirection = "leftTop"
							break;
						case 'rudder':
							this.ruddernewDirection = "leftTop"
							break;
					}
				} else if (positionX < 20 && positionY > 80) {
					switch (id) {
						case 'motor':
							this.newDirection = "leftBottom"
							break;
						case 'rudder':
							this.ruddernewDirection = "leftBottom"
							break;
					}
				} else if (positionX > 80 && positionY > 80) {
					switch (id) {
						case 'motor':
							this.newDirection = "rightBottom"
							break;
						case 'rudder':
							this.ruddernewDirection = "rightBottom"
							break;
					}
				} else if (positionX > 80 && positionY < 20) {
					switch (id) {
						case 'motor':
							this.newDirection = "rightTop"
							break;
						case 'rudder':
							this.ruddernewDirection = "rightTop"
							break;
					}
				}

				this.updateDirection(id)
			},
			updateDirection(id) {
				// Duty 值映射表
				const dutyMap = {
					"leftTop": {
						dutyX: this.getDutyValue(1, -5),
						channelNumX: this.getChannelNum(1),
						dutyY: this.getDutyValue(2, 5),
						channelNumY: this.getChannelNum(2)
					},
					"leftBottom": {
						dutyX: this.getDutyValue(1, -5),
						channelNumX: this.getChannelNum(1),
						dutyY: this.getDutyValue(2, -5),
						channelNumY: this.getChannelNum(2)
					},
					"rightTop": {
						dutyX: this.getDutyValue(1, 5),
						channelNumX: this.getChannelNum(1),
						dutyY: this.getDutyValue(2, 5),
						channelNumY: this.getChannelNum(2)
					},
					"rightBottom": {
						dutyX: this.getDutyValue(1, 5),
						channelNumX: this.getChannelNum(1),
						dutyY: this.getDutyValue(2, -5),
						channelNumY: this.getChannelNum(2)
					},
					"top1": {
						duty: this.getDutyValue(2, 1),
						channelNum: this.getChannelNum(2)
					},
					"top2": {
						duty: this.getDutyValue(2, 2),
						channelNum: this.getChannelNum(2)
					},
					"top3": {
						duty: this.getDutyValue(2, 3),
						channelNum: this.getChannelNum(2)
					},
					"top4": {
						duty: this.getDutyValue(2, 4),
						channelNum: this.getChannelNum(2)
					},
					"top5": {
						duty: this.getDutyValue(2, 5),
						channelNum: this.getChannelNum(2)
					},
					"motorStop": {
						duty: 1500,
						channelNum: this.getChannelNum(2)
					},
					"bottom1": {
						duty: this.getDutyValue(2, -1),
						channelNum: this.getChannelNum(2)
					},
					"bottom2": {
						duty: this.getDutyValue(2, -2),
						channelNum: this.getChannelNum(2)
					},
					"bottom3": {
						duty: this.getDutyValue(2, -3),
						channelNum: this.getChannelNum(2)
					},
					"bottom4": {
						duty: this.getDutyValue(2, -4),
						channelNum: this.getChannelNum(2)
					},
					"bottom5": {
						duty: this.getDutyValue(2, -5),
						channelNum: this.getChannelNum(2)
					},
					"right1": {
						duty: this.getDutyValue(1, 1),
						channelNum: this.getChannelNum(1)
					},
					"right2": {
						duty: this.getDutyValue(1, 2),
						channelNum: this.getChannelNum(1)
					},
					"right3": {
						duty: this.getDutyValue(1, 3),
						channelNum: this.getChannelNum(1)
					},
					"right4": {
						duty: this.getDutyValue(1, 4),
						channelNum: this.getChannelNum(1)
					},
					"right5": {
						duty: this.getDutyValue(1, 5),
						channelNum: this.getChannelNum(1)
					},
					"left1": {
						duty: this.getDutyValue(1, -1),
						channelNum: this.getChannelNum(1)
					},
					"left2": {
						duty: this.getDutyValue(1, -2),
						channelNum: this.getChannelNum(1)
					},
					"left3": {
						duty: this.getDutyValue(1, -3),
						channelNum: this.getChannelNum(1)
					},
					"left4": {
						duty: this.getDutyValue(1, -4),
						channelNum: this.getChannelNum(1)
					},
					"left5": {
						duty: this.getDutyValue(1, -5),
						channelNum: this.getChannelNum(1)
					}
				};
				const rudderDutyMap = {
					"leftTop": {
						dutyX: this.getDutyValue(4, -4),
						channelNumX: this.getChannelNum(4),
						dutyY: this.getDutyValue(3, -4),
						channelNumY: this.getChannelNum(3)
					},
					"leftBottom": {
						dutyX: this.getDutyValue(4, -4),
						channelNumX: this.getChannelNum(4),
						dutyY: this.getDutyValue(3, 4),
						channelNumY: this.getChannelNum(3)
					},
					"rightTop": {
						dutyX: this.getDutyValue(4, 4),
						channelNumX: this.getChannelNum(4),
						dutyY: this.getDutyValue(3, -4),
						channelNumY: this.getChannelNum(3)
					},
					"rightBottom": {
						dutyX: this.getDutyValue(4, 4),
						channelNumX: this.getChannelNum(4),
						dutyY: this.getDutyValue(3, 4),
						channelNumY: this.getChannelNum(3)
					},
					"top1": {
						duty: this.getDutyValue(3, -1),
						channelNum: this.getChannelNum(3)
					},
					"top2": {
						duty: this.getDutyValue(3, -2),
						channelNum: this.getChannelNum(3)
					},
					"top3": {
						duty: this.getDutyValue(3, -3),
						channelNum: this.getChannelNum(3)
					},
					"top4": {
						duty: this.getDutyValue(3, -4),
						channelNum: this.getChannelNum(3)
					},
					"top5": {
						duty: this.getDutyValue(3, -5),
						channelNum: this.getChannelNum(3)
					},
					"bottom1": {
						duty: this.getDutyValue(3, 1),
						channelNum: this.getChannelNum(3)
					},
					"bottom2": {
						duty: this.getDutyValue(3, 2),
						channelNum: this.getChannelNum(3)
					},
					"bottom3": {
						duty: this.getDutyValue(3, 3),
						channelNum: this.getChannelNum(3)
					},
					"bottom4": {
						duty: this.getDutyValue(3, 4),
						channelNum: this.getChannelNum(3)
					},
					"bottom5": {
						duty: this.getDutyValue(3, 5),
						channelNum: this.getChannelNum(3)
					},
					"right1": {
						duty: this.getDutyValue(4, 1),
						channelNum: this.getChannelNum(4)
					},
					"right2": {
						duty: this.getDutyValue(4, 2),
						channelNum: this.getChannelNum(4)
					},
					"right3": {
						duty: this.getDutyValue(4, 3),
						channelNum: this.getChannelNum(4)
					},
					"right4": {
						duty: this.getDutyValue(4, 4),
						channelNum: this.getChannelNum(4)
					},
					"right5": {
						duty: this.getDutyValue(4, 5),
						channelNum: this.getChannelNum(4)
					},
					"rudderStop": {
						duty: 1500,
						channelNum: this.getChannelNum(4)
					},
					"left1": {
						duty: this.getDutyValue(4, -1),
						channelNum: this.getChannelNum(4)
					},
					"left2": {
						duty: this.getDutyValue(4, -2),
						channelNum: this.getChannelNum(4)
					},
					"left3": {
						duty: this.getDutyValue(4, -3),
						channelNum: this.getChannelNum(4)
					},
					"left4": {
						duty: this.getDutyValue(4, -4),
						channelNum: this.getChannelNum(4)
					},
					"left5": {
						duty: this.getDutyValue(4, -5),
						channelNum: this.getChannelNum(4)
					}
				};

				// 清理和启动定时器的函数
				const clearAndStartInterval = (direction, dutyMap, intervalTime, id =
					'motor') => {
					clearInterval(id == 'rudder' ? this.rudderIntervarTime : id == 'motor' ? this
						.intervarTime : '');

					// 停止信号直接发送一次
					if (direction == 'motorStop' || direction == 'rudderStop') {
						this.sendMessage(JSON.stringify({
							bizCode: 602, //固定值
							channelNum: dutyMap[direction].channelNum, // 通道号1-8
							duty: dutyMap[direction].duty, //通道信号的高电平时间（单位微秒）
							timestamp: this.getTimestamp(),
							mac: this.macAddress //设备mac地址
						}));
					} else {
						var intervalID = null
						if (direction == 'leftTop' || direction == 'leftBottom' || direction == 'rightTop' ||
							direction == 'rightBottom') {
							const sendDutyUpdate = () => {
								this.sendMessage(JSON.stringify({
									bizCode: 602, //固定值
									channelNum: dutyMap[direction].channelNumX, // 通道号1-8
									duty: dutyMap[direction].dutyX, //通道信号的高电平时间（单位微秒）
									timestamp: this.getTimestamp(),
									mac: this.macAddress //设备mac地址
								}));
								this.sendMessage(JSON.stringify({
									bizCode: 602, //固定值
									channelNum: dutyMap[direction].channelNumY, // 通道号1-8
									duty: dutyMap[direction].dutyY, //通道信号的高电平时间（单位微秒）
									timestamp: this.getTimestamp(),
									mac: this.macAddress //设备mac地址
								}));
							};
							intervalID = setInterval(sendDutyUpdate, intervalTime);
						} else {
							const sendDutyUpdate = () => {
								this.sendMessage(JSON.stringify({
									bizCode: 602, //固定值
									channelNum: dutyMap[direction].channelNum, // 通道号1-8
									duty: dutyMap[direction].duty, //通道信号的高电平时间（单位微秒）
									timestamp: this.getTimestamp(),
									mac: this.macAddress //设备mac地址
								}));
							};
							intervalID = setInterval(sendDutyUpdate, intervalTime);
						}
						// 存储定时器ID
						if (id == 'motor') {
							this.intervarTime = intervalID;
						} else if (id == 'rudder') {
							this.rudderIntervarTime = intervalID;
						}
					}
				};

				// 电机方向变化处理
				if (this.newDirection !== this.oldDirection) {
					clearAndStartInterval(this.newDirection, dutyMap, 100, id);
					this.oldDirection = this.newDirection;
				}

				// 舵机方向变化处理
				if (this.ruddernewDirection !== this.rudderoldDirection) {
					clearAndStartInterval(this.ruddernewDirection, rudderDutyMap, 100, id);
					this.rudderoldDirection = this.ruddernewDirection;
				}

			},

			getCurrentTime() {
				const now = new Date();

				const year = now.getFullYear()
				const month = now.getMonth() + 1
				const day = now.getDate()
				const hours = now.getHours()
				const minutes = now.getMinutes()
				const seconds = now.getSeconds()

				// 格式化时间
				const formattedTime =
					`${year}年${this.padZero(month)}月${this.padZero(day)}日 ${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;

				return formattedTime;
			},

			// 补零函数（确保两位数格式）
			padZero(num) {
				return num < 10 ? `0${num}` : num;
			},
			getTimestamp() {
				return new Date().getTime().toString()
			},
			initWebSocket() {
				this.socket = uni.connectSocket({
					url: `ws://${socketUrl}/ws/${this.macAddress}`,
					success: () => {
						console.log('WebSocket连接成功');
						console.log('WebSocket连接地址：', socketUrl);
					},
					fail: (err) => {
						console.error('WebSocket连接失败', err);
					},
				});

				// 监听 WebSocket 打开事件
				this.socket.onOpen(() => {
					console.log('WebSocket已打开');
					this.isSocket = true
					this.sendFiveMessage(0, 'center')
					this.sendSixMessage(0, 'center')
					// this.startHeartbeat(); // 开始心跳机制
				});

				// 监听 WebSocket 收到消息事件
				this.socket.onMessage((event) => {
					this.message = event.data
					// 如果是心跳响应
					if (event.data == 'pong') {
						console.log('收到心跳响应: pong');
						clearTimeout(this.heartbeatTimeout);
					} else {
						let data = JSON.parse(event.data)
						if (data.data && data.data.bizCode == 501) {
							this.socket501Data = data.data
						} else if (data.data && data.data.bizCode == 502) {
							this.socket502Data = data.data
						} else if (data.data && data.data.bizCode == 503) {
							this.socket503Data = data.data
						} else if (data.data && data.data.bizCode == 504) {
							this.socket504Data = data.data
						}
					}
				});

				// 监听 WebSocket 关闭事件
				this.socket.onClose(() => {
					console.log('WebSocket已关闭');
					this.isSocket = false
				});

				// 监听 WebSocket 错误事件
				this.socket.onError((err) => {
					console.error('WebSocket发生错误', err);
					this.isSocket = false
				});
			},

			// 开始心跳机制
			startHeartbeat() {
				// 定时发送心跳消息
				this.heartbeatInterval = setInterval(() => {
					this.sendMessage('ping')
					this.resetHeartbeatTimeout();
				}, 10000);

				// 设置心跳超时检测
			},

			// 重置心跳超时计时器
			resetHeartbeatTimeout() {
				this.heartbeatTimeout = setTimeout(() => {
					console.error('心跳超时，连接断开');
					this.socket.onClose();
					this.reconnect();
				}, 10000);
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
				clearInterval(this.fiveIntervarTime);
				clearInterval(this.sixIntervarTime);
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

			getDutyValue(buttonNo, number) {
				if (this.carInfo.appCarChannelList && this.carInfo.appCarChannelList.length > 0) {

					let maxValue = this.carInfo.appCarChannelList.find((item) => item.buttonNo == buttonNo)
						.maxValue
					let minValue = this.carInfo.appCarChannelList.find((item) => item.buttonNo == buttonNo)
						.minValue
					if (number > 0) {
						if (number == 5) {
							return maxValue
						}
						if (maxValue == 1600) {
							return 1600
						} else {
							return (((maxValue - 1600) / 4) * (number - 1)) + 1600
						}
					} else if (number == 0) {
						return 1500
					} else if (number < 0) {
						if (number == -5) {
							return minValue
						}
						if (minValue == 1400) {
							return 1400
						} else {
							return 1400 - (((1400 - minValue) / 4) * (Math.abs(number) - 1))
						}
					}
				} else {
					return 0
				}
			},
			getChannelNum(buttonNo) {
				if (this.carInfo.appCarChannelList && this.carInfo.appCarChannelList.length > 0) {

					let channelNum = this.carInfo.appCarChannelList.find((item) => item.buttonNo == buttonNo)
						.channelNum
					return channelNum
				} else {
					return 1
				}
			}
		},
		beforeDestroy() {

		},
		onHide() {
			console.log('页面被覆盖');
		}
	};
</script>

<style scoped lang="less">
	.container {
		height: 100vh;
		width: 90vw;
		touch-action: none;
		position: relative;

		.webview {
			width: 100vw;
		}

		.content {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99999999999999999;
			width: 90vw;
			height: 100vh;
		}

		.verifyBox {
			color: #000;
			position: absolute;
			z-index: 999999999999999999;
			left: 85px;
			top: 20px;
			display: flex;
			align-items: center;

			.verifyContent {
				padding: 16px;
				background-color: #FFF;
				margin-left: -5px;

				.title {
					margin-bottom: 16px;
				}

			}
		}

		.topInfo {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 90vw;
			box-sizing: border-box;
			padding: 32px 16px;
			font-size: 15px;
			color: #FFF;

			._item {
				flex: 1;
				display: flex;
				justify-content: center;
				gap: 20px;
			}


		}



		.centerInfo {
			display: flex;
			justify-content: space-between;
			width: 90%;
			box-sizing: border-box;
			padding: 16px;
			font-size: 13px;
			color: #FFF;

			._item {
				display: flex;
				justify-content: space-between;
				align-items: start;
				flex-wrap: wrap;
				gap: 8px;
			}
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
				flex-wrap: wrap;

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
		width: 90%;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0px 0px 50px 10%;
		text-align: center;
		color: #FFF;

		.actionButtonBox {
			width: 60px;
			height: auto;
			display: flex;
			flex-direction: column;
			gap: 1px;
			background-color: #000;
			border-radius: 6px;
			overflow: hidden;

			.actionButton {
				flex: 1;
				width: 100%;
				background-color: #FFF;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.activeFiveButton,
			.activeSixButton {
				background-color: #ebe388;
			}
		}

		.parent {
			position: relative;
			width: 150px;
			height: 150px;
			border-radius: 50%;
			background-size: 100% 100%;

			/* 防止子元素溢出 */
			.draggable {
				position: absolute;
				width: 50px;
				height: 50px;
				border-radius: 50%;
				background-size: 100% 100%;
				/* 防止选中文字 */
				touch-action: none;
				/* 禁止默认触摸行为 */
			}
		}
	}
</style>