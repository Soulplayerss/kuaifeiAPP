<template>
	<view class="configuration">
		<AppBar title='车辆配置' @goBank="goBank" />
		<view class="content">
			<image :src="carInfo.sitePictureUrl" mode="" class="carImg"></image>
			<view class="item">
				<span class="left">车辆编号</span>
				<span class="right">{{carInfo.carNo}}</span>
			</view>
			<view class="item">
				<span class="left">车辆名称</span>
				<span class="right" @click="showChangeName = true">{{carInfo.carName}}</span>
			</view>
			<view class="item">
				<span class="left">车辆状态</span>
				<span class="right"
					:style="{color:carInfo.carStatus == 0 ? '#c38513' : ''}">{{carInfo.carStatus == 0 ? '离线' : '在线'}}</span>
			</view>
			<view class="item">
				<span class="left">图传状态</span>
				<span class="right">获取中</span>
			</view>
			<view class="item">
				<span class="left">电池电量</span>
				<span class="right">{{carInfo.carQuantity}}%</span>
			</view>
			<view class="item" style="border: none;">
				<span class="left">电压</span>
				<span class="right">{{carInfo.carVoltage}}V</span>
			</view>
			<u-collapse accordion>
				<!-- <u-collapse-item title="选择场地">
					<text class="u-collapse-content">选择场地</text>
				</u-collapse-item>
				<u-collapse-item title="系统设置">
					<text class="u-collapse-content">系统设置</text>
				</u-collapse-item> -->
				<u-collapse-item title="通道设置">
					<view class="carChannel" v-for="(item,index) in carInfo.appCarChannelList" :key="item.channelId">
						<view class="channelName">
							{{item.channelName}}
						</view>
						<view class="channelValue">
							<input type="number" @blur="handleBlur($event,index,'minValue')" v-model="item.minValue"
								class="valueInput" />
							<span>-</span>
							<input type="number" @blur="handleBlur($event,index,'maxValue')" v-model="item.maxValue"
								class="valueInput" />
						</view>
					</view>
				</u-collapse-item>
				<!-- <u-collapse-item title="图传设置">
					<text class="u-collapse-content">图传设置</text>
				</u-collapse-item>
				<u-collapse-item title="操控设置">
					<text class="u-collapse-content">操控设置</text>
				</u-collapse-item> -->
				<u-collapse-item title="摄像头配置">
					<view class="carChannel">
						<view class="channelName">
							DevId
						</view>
						<view class="channelValue">
							<input type="text" v-model="devId" class="valueInput cameraInput" />
						</view>
					</view>
					<view class="carChannel">
						<view class="channelName">
							Series
						</view>
						<view class="channelValue">
							<input type="text" v-model="series" class="valueInput cameraInput" />
						</view>
					</view>
				</u-collapse-item>
			</u-collapse>
			<!-- <view class="item">
				<span class="left">共享车辆</span>
			</view> -->
		</view>

		<view class="btns">
			<view class="btn">
				<u-button type="primary" shape="circle" text="保存" style="color: #30313D;"
					color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))" @click="save"></u-button>
			</view>
			<view class="btn">
				<u-button type="primary" shape="circle" text="删除车辆"
					color="linear-gradient(to bottom, rgb(248, 124, 23), rgb(219, 76, 4))"></u-button>
			</view>
		</view>

		<u-overlay :show="showChangeName">
			<view class="overlayBox">
				<view class="serialNumber">
					新名称
				</view>
				<view class="formItem">
					<view class="itemRight">
						<u--input border="none" type="text" v-model="carInfo.carName" placeholder="请输入新名称" />
					</view>
				</view>
				<view class="commitBox">
					<span class="cancel" @click="showChangeName = false">取消</span>
					<span class="commit" @click="commit">确认</span>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	import request from '@/utils/request';
	import {
		requestUrl
	} from '@/utils/request';
	export default {
		data() {
			return {
				carId: '',
				carInfo: {},
				showChangeName: false,
				devId: '',
				series: '',
			}
		},
		onLoad(options) {
			const {
				carId
			} = options; // 获取具体的参数值
			this.carId = carId
		},
		components: {
			AppBar
		},
		methods: {
			goBank() {
				uni.navigateTo({
					url: '/pages/car/car',
				})
			},
			handleBlur(event, index, type) {
				let value = event.detail.value
				if (type == 'minValue') {
					if (value >= 1400) {
						this.carInfo.appCarChannelList[index].minValue = 1400
					} else if (value <= 0) {
						this.carInfo.appCarChannelList[index].minValue = 0
					}
				} else {
					if (value <= 1600) {
						this.carInfo.appCarChannelList[index].maxValue = 1600
					}
				}
			},
			async getCarInfo() {
				try {
					const response = await request(`/app/carInfo/getInfoByCarId/${this.carId}`, 'GET')
					this.carInfo = response.data
					this.carInfo.sitePictureUrl = requestUrl + response.data.sitePictureUrl
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			async getCarCameraInfo() {
				try {
					const response = await request(`/app/camera/getInfoByCarId/${this.carId}`, 'GET')
					console.log(response)
					if (response.code == 200 && response.data) {
						this.devId = response.data.devId
						this.series = response.data.series
					}
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			commit() {
				if (this.carName != '') {
					this.showChangeName = false
				} else {
					uni.showToast({
						title: '请输入名称',
						icon: 'none',
					});
				}
			},
			async save() {
				try {
					const response = await request(`/app/carInfo/updateCarInfo`, 'POST', {
						carName: this.carInfo.carName,
						carId: this.carInfo.carId,
						carChannelList: this.carInfo.appCarChannelList.map((item) => {
							return {
								channelId: item.channelId,
								minValue: item.minValue,
								maxValue: item.maxValue,
							}
						})
					})
					if (response.code === 200) {
						uni.showToast({
							title: '保存成功',
							icon: 'success',
						});
						setTimeout(() => {

							this.goBank()
						}, 1000)
					}
				} catch (error) {
					uni.showToast({
						title: '保存失败',
						icon: 'none',
					});
				}
			}
		},
		mounted() {
			this.getCarInfo()
			this.getCarCameraInfo()
		}
	}
</script>

<style scoped lang="less">
	.configuration {
		width: 100%;
		min-height: 100vh;
		background-color: #eea618;
		box-sizing: border-box;
		padding-bottom: 72px;

		.content {
			background-color: #FFF;
			border-radius: 8px;
			padding: 16px;
			box-sizing: border-box;
			margin: 16px;
			height: calc(100vh - 194px);
			overflow-y: auto;

			.carImg {
				width: 80%;
				margin-left: 10%;
				margin-bottom: 16px;
			}

			.item {
				height: 42px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 15px;
				border-bottom: solid 1px #d6d7d9;
				padding: 0 16px;
				box-sizing: border-box;

				.right {
					color: #98999a;
				}
			}

			.u-cell {
				border: solid 1px #d6d7d9;
			}
		}

		.btns {
			background-color: #eea618;
			position: fixed;
			bottom: 0px;
			left: 0;
			width: 100%;
			box-sizing: border-box;
			padding: 16px;
			display: flex;
			gap: 20px;

			.btn {
				flex: 1;
			}
		}

		.carChannel {
			height: 40px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: 20px;

			.channelName {
				height: 30px;
				line-height: 30px;
				color: #FFF;
				padding: 0px 12px;
				border-radius: 4px;
				background-color: #eea618;
			}

			.channelValue {
				flex: 1;
				display: flex;
				align-items: center;

				span {
					padding: 0 16px;
				}

				.valueInput {
					display: block;
					flex: 1;
					height: 30px;
					box-sizing: border-box;
					border: solid 1px #d6d7d9;
					text-align: center;
				}
				
				.cameraInput{
					padding-left: 16px;
					text-align: left;
				}
			}
		}

		.u-transition {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>