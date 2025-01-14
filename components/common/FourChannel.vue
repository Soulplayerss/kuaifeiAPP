<template>
	<view class="container">
		<view class="back" @click="back">
			<image src="../../assets/images/over.png" mode="" style="width: 30px;height: 30px;"></image>
		</view>
		<!-- <view class="slider" v-show="carInfo.appCarChannelList && carInfo.appCarChannelList.length> 0">
			<view class="sliderItem" v-for="(item,index) in carInfo.appCarChannelList" :key="item.channelNum"
				v-show="index <= 5">
				<span>{{item.channelName}}</span>
				<span style="display: inline-block;width: 35px;">{{item.minValue}}</span>
				<view class="sliderBox" v-if="sliderLeftList.length >=  carInfo.appCarChannelList.length">
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
					<view class="box2" :id="`slider${index + 1}`"
						:style="{left:sliderLeftList[index].box2Left + 'px', width:sliderLeftList[index].box2Width + 'px'}">
						<view class="dire"></view>
					</view>
				</view>
				<span style="display: inline-block;width: 35px;">{{item.maxValue}}</span>
			</view>
		</view> -->
		<view class="" style="padding: 16px;color: #FFF;">
			{{message}}
		</view>
		<view class="operateBox">
			<view class="parent">
				<view class="draggable" id="motor" :style="{ left: leftHandle.x + 'px', top: leftHandle.y + 'px' }"
					@touchstart="onTouchStart('leftHandle', $event)" @touchmove="onTouchMove('leftHandle', $event)"
					@touchend="onTouchEnd('leftHandle', $event)">
				</view>
			</view>
			<view class="parent" v-show="carInfo.appCarChannelList && carInfo.appCarChannelList.length >= 5">
				<view class="draggable" id="fiveChannel" :style="{ left:fiveHandle.x + 'px', top:fiveHandle.y + 'px' }"
					@touchstart="onTouchStart('fiveHandle', $event)" @touchmove="onTouchMove('fiveHandle', $event)"
					@touchend="onTouchEnd('fiveHandle', $event)">
				</view>
			</view>
			<view class="parent" v-show="carInfo.appCarChannelList && carInfo.appCarChannelList.length >= 6">
				<view class="draggable" id="sixChannel" :style="{ left:sixHandle.x + 'px', top:sixHandle.y + 'px' }"
					@touchstart="onTouchStart('sixHandle', $event)" @touchmove="onTouchMove('sixHandle', $event)"
					@touchend="onTouchEnd('sixHandle', $event)">
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
	import {
		socketUrl
	} from '@/utils/request';
	export default {
		props: {
			carInfo: {
				type: Object,
				default: {}
			},
			macAddress: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				// carInfo: this.carInfo,
				// macAddress: this.macAddress,
				parentWidth: 150, // 父元素宽度
				parentHeight: 150, // 父元素高度
				draggableWidth: 50, // 子元素宽度
				draggableHeight: 50, // 子元素高度
				newDirection: '', //  电机新方向
				oldDirection: '', //  电机老方向
				ruddernewDirection: '', //  航舵新方向
				rudderoldDirection: '', //  航舵老方向
				fivenewDirection: '',
				fiveoldDirection: '',
				sixnewDirection: '',
				sixoldDirection: '',
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
				carId: '',
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
				fiveHandle: {
					x: 50,
					y: 50,
					isDragging: false,
					startX: 0,
					startY: 0,
					identifier: null
				},
				sixHandle: {
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

		},
		onUnload() {
			this.closeWebSocket();
		},
		mounted() {
			console.log(this.carInfo.appCarChannelList)
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
				this.clearHeartbeat(); // 清理心跳和重连
				this.isBack = true
				this.clearHeartbeat(); // 清理心跳和重连
				if (this.socket) {
					this.closeWebSocket();
				}
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
				handle.box2Width = this.sliderRightList[index].x - Math.min(Math.max(newX, 0), maxX)

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
				const maxX = 100; // 假设按钮宽度为50
				const maxY = 100; // 假设按钮高度为50

				if (handleKey === 'fiveHandle' || handleKey === 'sixHandle') {
					handle.x = 50;
					handle.y = Math.min(Math.max(newY, 0), maxY);
				} else {
					handle.x = Math.min(Math.max(newX, 0), maxX);
					handle.y = Math.min(Math.max(newY, 0), maxY);
				}
				//判断朝哪个方向
				this.checkPosition(handle.x, handle.y, event.target.id);
			},

			// 触摸结束
			onTouchEnd(handleKey, event) {
				const handle = this[handleKey];
				const touch = Array.from(event.changedTouches).find(
					(t) => t.identifier === handle.identifier
				);
				if (event.target.id == 'motor' && this.carInfo) {
					clearInterval(this.intervarTime)
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.carInfo.appCarChannelList[0].channelNum, // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
						"timestamp": new Date().getTime(),
						"mac": this.macAddress //设备mac地址
					}))
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.carInfo.appCarChannelList[1].channelNum, // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
						"timestamp": new Date().getTime(),
						"mac": this.macAddress //设备mac地址
					}))
				} else if (event.target.id == 'rudder' && this.carInfo) {
					clearInterval(this.rudderIntervarTime)
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.carInfo.appCarChannelList[2].channelNum, // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
						"timestamp": new Date().getTime(),
						"mac": this.macAddress //设备mac地址
					}))
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.carInfo.appCarChannelList[3].channelNum, // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
						"timestamp": new Date().getTime(),
						"mac": this.macAddress //设备mac地址
					}))
				} else if (event.target.id == 'fiveChannel' && this.carInfo) {
					clearInterval(this.fiveIntervarTime)
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.carInfo.appCarChannelList[4].channelNum, // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
						"timestamp": new Date().getTime(),
						"mac": this.macAddress //设备mac地址
					}))
				} else if (event.target.id == 'sixChannel' && this.carInfo) {
					clearInterval(this.sixIntervarTime)
					this.sendMessage(JSON.stringify({
						"bizCode": 602, //固定值
						"channelNum": this.carInfo.appCarChannelList[5].channelNum, // 通道号1-8
						"duty": 1500, //通道信号的高电平时间（单位微秒）
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
				this.fivenewDirection = ''
				this.fiveoldDirection = ''
				this.sixnewDirection = ''
				this.sixoldDirection = ''
			},
			checkPosition(positionX, positionY, id) {
				if (positionX > 45 && positionX < 55) {
					switch (true) {
						case positionY <= 10 && positionY >= 0:
							id === 'motor' ? this.newDirection = "top5" : id === 'rudder' ? this.ruddernewDirection =
								"top5" : id === 'fiveChannel' ? this.fivenewDirection = "top5" : this.sixnewDirection =
								"top5"
							break;
						case positionY <= 20 && positionY > 10:
							id === 'motor' ? this.newDirection = "top4" : id === 'rudder' ? this.ruddernewDirection =
								"top4" : id === 'fiveChannel' ? this.fivenewDirection = "top4" : this.sixnewDirection =
								"top4"
							break;
						case positionY <= 30 && positionY > 20:
							id === 'motor' ? this.newDirection = "top3" : id === 'rudder' ? this.ruddernewDirection =
								"top3" : id === 'fiveChannel' ? this.fivenewDirection = "top3" : this.sixnewDirection =
								"top3"
							break;
						case positionY <= 40 && positionY > 30:
							id === 'motor' ? this.newDirection = "top2" : id === 'rudder' ? this.ruddernewDirection =
								"top2" : id === 'fiveChannel' ? this.fivenewDirection = "top2" : this.sixnewDirection =
								"top2"
							break;
						case positionY <= 45 && positionY > 40:
							id === 'motor' ? this.newDirection = "top1" : id === 'rudder' ? this.ruddernewDirection =
								"top1" : id === 'fiveChannel' ? this.fivenewDirection = "top1" : this.sixnewDirection =
								"top1"
							break;
						case positionY <= 55 && positionY > 45:
							id === 'motor' ? this.newDirection = "motorStop" : id === 'rudder' ? this.ruddernewDirection =
								"rudderStop" : id === 'fiveChannel' ? this.fivenewDirection = "fiveStop" : this
								.sixnewDirection = "sixStop"
							break;
						case positionY <= 60 && positionY > 55:
							id === 'motor' ? this.newDirection = "bottom1" : id === 'rudder' ? this.ruddernewDirection =
								"bottom1" : id === 'fiveChannel' ? this.fivenewDirection = "bottom1" : this
								.sixnewDirection = "bottom1"
							break;
						case positionY <= 70 && positionY > 60:
							id === 'motor' ? this.newDirection = "bottom2" : id === 'rudder' ? this.ruddernewDirection =
								"bottom2" : id === 'fiveChannel' ? this.fivenewDirection = "bottom2" : this
								.sixnewDirection = "bottom2"
							break;
						case positionY <= 80 && positionY > 70:
							id === 'motor' ? this.newDirection = "bottom3" : id === 'rudder' ? this.ruddernewDirection =
								"bottom3" : id === 'fiveChannel' ? this.fivenewDirection = "bottom3" : this
								.sixnewDirection = "bottom3"
							break;
						case positionY <= 90 && positionY > 80:
							id === 'motor' ? this.newDirection = "bottom4" : id === 'rudder' ? this.ruddernewDirection =
								"bottom4" : id === 'fiveChannel' ? this.fivenewDirection = "bottom4" : this
								.sixnewDirection = "bottom4"
							break;
						case positionY <= 100 && positionY > 90:
							id === 'motor' ? this.newDirection = "bottom5" : id === 'rudder' ? this.ruddernewDirection =
								"bottom5" : id === 'fiveChannel' ? this.fivenewDirection = "bottom5" : this
								.sixnewDirection = "bottom5"
							break;
					}
				} else if (positionY > 45 && positionY < 55) {
					switch (true) {
						case positionX <= 10 && positionX >= 0:
							id === 'motor' ? this.newDirection = "left5" : this.ruddernewDirection = "left5"
							break;
						case positionX <= 20 && positionX > 10:
							id === 'motor' ? this.newDirection = "left4" : this.ruddernewDirection = "left4"
							break;
						case positionX <= 30 && positionX > 20:
							id === 'motor' ? this.newDirection = "left3" : this.ruddernewDirection = "left3"
							break;
						case positionX <= 40 && positionX > 30:
							id === 'motor' ? this.newDirection = "left2" : this.ruddernewDirection = "left2"
							break;
						case positionX <= 45 && positionX > 40:
							id === 'motor' ? this.newDirection = "left1" : this.ruddernewDirection = "left1"
							break;
						case positionX <= 55 && positionX > 45:
							id === 'motor' ? this.newDirection = "motorStop" : this.ruddernewDirection = "rudderStop"
							break;
						case positionX <= 60 && positionX > 55:
							id === 'motor' ? this.newDirection = "right1" : this.ruddernewDirection = "right1"
							break;
						case positionX <= 70 && positionX > 60:
							id === 'motor' ? this.newDirection = "right2" : this.ruddernewDirection = "right2"
							break;
						case positionX <= 80 && positionX > 70:
							id === 'motor' ? this.newDirection = "right3" : this.ruddernewDirection = "right3"
							break;
						case positionX <= 90 && positionX > 80:
							id === 'motor' ? this.newDirection = "right4" : this.ruddernewDirection = "right4"
							break;
						case positionX <= 100 && positionX > 90:
							id === 'motor' ? this.newDirection = "right5" : this.ruddernewDirection = "right5"
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
						dutyX: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, -4),
						channelNumX: this.carInfo.appCarChannelList[0].channelNum,
						dutyY: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, 4),
						channelNumY: this.carInfo.appCarChannelList[1].channelNum
					},
					"leftBottom": {
						dutyX: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, -4),
						channelNumX: this.carInfo.appCarChannelList[0].channelNum,
						dutyY: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, -4),
						channelNumY: this.carInfo.appCarChannelList[1].channelNum
					},
					"rightTop": {
						dutyX: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, 4),
						channelNumX: this.carInfo.appCarChannelList[0].channelNum,
						dutyY: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, 4),
						channelNumY: this.carInfo.appCarChannelList[1].channelNum
					},
					"rightBottom": {
						dutyX: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, 4),
						channelNumX: this.carInfo.appCarChannelList[0].channelNum,
						dutyY: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, -4),
						channelNumY: this.carInfo.appCarChannelList[1].channelNum
					},
					"top1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, 1),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"top2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, 2),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"top3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, 3),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"top4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, 4),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"top5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, 5),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"motorStop": {
						duty: 1500,
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"bottom1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, -1),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"bottom2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, -2),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"bottom3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, -3),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"bottom4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, -4),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"bottom5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[1].channelNum, -5),
						channelNum: this.carInfo.appCarChannelList[1].channelNum
					},
					"right1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, 1),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					},
					"right2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, 2),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					},
					"right3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, 3),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					},
					"right4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, 4),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					},
					"right5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, 5),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					},
					"left1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, -1),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					},
					"left2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, -2),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					},
					"left3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, -3),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					},
					"left4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, -4),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					},
					"left5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[0].channelNum, -5),
						channelNum: this.carInfo.appCarChannelList[0].channelNum
					}
				};

				const rudderDutyMap = {
					"leftTop": {
						dutyX: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, -4),
						channelNumX: this.carInfo.appCarChannelList[3].channelNum,
						dutyY: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, 4),
						channelNumY: this.carInfo.appCarChannelList[2].channelNum
					},
					"leftBottom": {
						dutyX: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, -4),
						channelNumX: this.carInfo.appCarChannelList[3].channelNum,
						dutyY: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, -4),
						channelNumY: this.carInfo.appCarChannelList[2].channelNum
					},
					"rightTop": {
						dutyX: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, 4),
						channelNumX: this.carInfo.appCarChannelList[3].channelNum,
						dutyY: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, 4),
						channelNumY: this.carInfo.appCarChannelList[2].channelNum
					},
					"rightBottom": {
						dutyX: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, 4),
						channelNumX: this.carInfo.appCarChannelList[3].channelNum,
						dutyY: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, -4),
						channelNumY: this.carInfo.appCarChannelList[2].channelNum
					},
					"top1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, 1),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"top2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, 2),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"top3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, 3),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"top4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, 4),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"top5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, 5),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"bottom1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, -1),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"bottom2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, -2),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"bottom3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, -3),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"bottom4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, -4),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"bottom5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[2].channelNum, -5),
						channelNum: this.carInfo.appCarChannelList[2].channelNum
					},
					"right1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, 1),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"right2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, 2),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"right3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, 3),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"right4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, 4),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"right5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, 5),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"rudderStop": {
						duty: 1500,
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"left1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, -1),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"left2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, -2),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"left3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, -3),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"left4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, -4),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					},
					"left5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[3].channelNum, -5),
						channelNum: this.carInfo.appCarChannelList[3].channelNum
					}
				};

				const fivedutyMap = {
					"top1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, 1),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"top2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, 2),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"top3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, 3),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"top4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, 4),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"top5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, 5),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"fiveStop": {
						duty: 1500,
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"bottom1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, -1),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"bottom2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, -2),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"bottom3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, -3),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"bottom4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, -4),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					},
					"bottom5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[4].channelNum, -5),
						channelNum: this.carInfo.appCarChannelList[4].channelNum
					}
				};
				const sixDutyMap = {
					"top1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, 1),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"top2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, 2),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"top3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, 3),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"top4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, 4),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"top5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, 5),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"sixStop": {
						duty: 1500,
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"bottom1": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, -1),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"bottom2": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, -2),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"bottom3": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, -3),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"bottom4": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, -4),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					},
					"bottom5": {
						duty: this.getDutyValue(this.carInfo.appCarChannelList[5].channelNum, -5),
						channelNum: this.carInfo.appCarChannelList[5].channelNum
					}
				};

				// 清理和启动定时器的函数
				const clearAndStartInterval = (direction, dutyMap, intervalTime, id =
					'motor') => {
					clearInterval(id == 'rudder' ? this.rudderIntervarTime : id == 'motor' ? this
						.intervarTime : id ==
						'fiveChannel' ? this.fiveIntervarTime : this.sixIntervarTime);

					// 停止信号直接发送一次
					if (direction === 'motorStop' || direction === 'rudderStop' || direction === 'fiveStop' ||
						direction === 'sixStop') {
						this.sendMessage(JSON.stringify({
							bizCode: 602, //固定值
							channelNum: dutyMap[direction].channelNum, // 通道号1-8
							duty: dutyMap[direction].duty, //通道信号的高电平时间（单位微秒）
							timestamp: new Date().getTime(),
							mac: this.macAddress //设备mac地址
						}));
					} else {
						var intervalID = null
						if (direction === 'leftTop' || direction === 'leftBottom' || direction === 'rightTop' ||
							direction === 'rightBottom') {
							const sendDutyUpdate = () => {
								this.sendMessage(JSON.stringify({
									bizCode: 602, //固定值
									channelNum: dutyMap[direction].channelNumX, // 通道号1-8
									duty: dutyMap[direction].dutyX, //通道信号的高电平时间（单位微秒）
									timestamp: new Date().getTime(),
									mac: this.macAddress //设备mac地址
								}));
								this.sendMessage(JSON.stringify({
									bizCode: 602, //固定值
									channelNum: dutyMap[direction].channelNumY, // 通道号1-8
									duty: dutyMap[direction].dutyY, //通道信号的高电平时间（单位微秒）
									timestamp: new Date().getTime(),
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
									timestamp: new Date().getTime(),
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
						} else if (id == 'fiveChannel') {
							this.fiveIntervarTime = intervalID;
						} else if (id == 'sixChannel') {
							this.sixIntervarTime = intervalID;
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

				// 五通道方向变化处理
				if (this.fivenewDirection !== this.fiveoldDirection) {
					clearAndStartInterval(this.fivenewDirection, fivedutyMap, 100, id);
					this.fiveoldDirection = this.fivenewDirection;
				}

				// 流通到方向变化处理
				if (this.sixnewDirection !== this.sixoldDirection) {
					clearAndStartInterval(this.sixnewDirection, sixDutyMap, 100, id);
					this.sixoldDirection = this.sixnewDirection;
				}
			},

			getCurrentTime() {
				const now = new Date();

				// 获取年、月、日、时、分、秒
				const year = now.getFullYear(); // 年
				const month = now.getMonth() + 1; // 月（从 0 开始，需要加 1）
				const day = now.getDate(); // 日
				const hours = now.getHours(); // 时
				const minutes = now.getMinutes(); // 分
				const seconds = now.getSeconds(); // 秒

				// 格式化时间
				const formattedTime =
					`${year}年${this.padZero(month)}月${this.padZero(day)}日 ${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;

				return formattedTime;
			},

			// 补零函数（确保两位数格式）
			padZero(num) {
				return num < 10 ? `0${num}` : num;
			},
			initWebSocket() {
				this.socket = uni.connectSocket({
					url: `ws://${socketUrl}/ws/${this.macAddress}`,
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
				this.socket.onMessage((event) => {
					this.message = event.data
					// 如果是心跳响应
					if (event.data === 'pong') {
						console.log('收到心跳响应: pong');
						clearTimeout(this.heartbeatTimeout);
					} else {
						console.log('收到消息:', JSON.parse(event.data));
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
					this.sendMessage('ping')
					this.resetHeartbeatTimeout();
				}, 10000);

				// 设置心跳超时检测
			},

			// 重置心跳超时计时器
			resetHeartbeatTimeout() {
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
							this.message = message + this.getCurrentTime()
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

			getDutyValue(channelNum, number) {
				if (this.carInfo.appCarChannelList && this.carInfo.appCarChannelList.length > 0) {

					let maxValue = this.carInfo.appCarChannelList.find((item) => item.channelNum == channelNum)
						.maxValue
					let minValue = this.carInfo.appCarChannelList.find((item) => item.channelNum == channelNum)
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
			}
		},
		beforeDestroy() {

		},
	};
</script>

<style scoped lang="less">
	.container {
		height: 100vh;
		width: 100vw;

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

	.back {
		padding: 20px;
		width: 30px;
		height: 30px;
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
		text-align: center;
		color: #FFF;

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