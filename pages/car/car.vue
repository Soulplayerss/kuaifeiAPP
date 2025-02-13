<template>
	<view class="carPage">
		<u-toast ref="uToast"></u-toast>
		<view class="content" :style="pageStyle">
			<view class="title">
				<view class="car">我的车辆</view>
				<view class="">
					<span show="showAddSite" style="padding-right: 16px;"
						@click="navigateTo('/pages/addSite/addSite?page=car')">添加场地</span>
					<span @click="showAddCar = true">添加车辆</span>
				</view>
			</view>
			<scroll-view v-if="dataList.length" scroll-y @refresherrefresh="onRefresh" @scrolltolower="onLoadMore"
				:refresher-triggered="isRefreshing" :style="{ height: '100%' }" refresher-enabled
				:refresher-threshold="50" refresher-background="#eea618">
				<!-- 列表内容 -->
				<view v-for="(item,index) in dataList" :key="index" class="dataItem">
					<view class="carInfo">
						<image :src="item.sitePictureUrl" mode="" class="carImg"></image>
						<view class="carDesc">
							<view class="carName">
								{{item.carName}}
							</view>
							<view class="code">
								编号：{{item.carNo}}
							</view>
							<view class="btns">
								<view class="btn"
									@click="navigateTo(`/pages/drive/drive?macAddress=${item.macAddress}&carId=${item.carId}`)">
									<span>驾驶</span>
								</view>
								<view class="btn" v-show="item.carStatus != 0"
									@click="checkStatus(item.carStatus,item.macAddress)">
									<span>{{item.carStatus === 1 ? '开放驾驶' : item.carStatus === 2 ? '关闭驾驶' : item.carStatus === 3 ? '驾驶中' : ''}}</span>
								</view>
								<view class="btn watch"
									@click="navigateTo(`/pages/configuration/configuration?carId=${item.carId}`)">
									配置
								</view>
							</view>
						</view>
					</view>
					<view class="configuration">
						<view class="">
							<span v-show="item.myCsq == '-'" style="margin-right: 8px;">-</span>
							<image src="../../assets/images/signal1.png" v-show="item.myCsq <= 8" mode=""></image>
							<image src="../../assets/images/signal2.png" v-show="item.myCsq > 8 && item.myCsq <=16 "
								mode=""></image>
							<image src="../../assets/images/signal3.png" v-show="item.myCsq > 16 && item.myCsq <= 24 "
								mode=""></image>
							<image src="../../assets/images/signal4.png" v-show="item.myCsq > 24 && item.myCsq <=32 "
								mode=""></image>
							<span>状态：<span :style="{color: item.carStatus == 0 ? '#dd0000' : '#00d400'}">
									{{item.carStatus == 0 ? '离线' : item.carStatus == 1 ? '在线': item.carStatus == 2 ? '开放驾驶': '驾驶中'}}</span></span>
						</view>
						<view class="">
							<image src="../../assets/images/battery.png" mode=""></image>
							<span>电量：{{item.carQuantity}}%</span>
						</view>
						<view class="">
							<image src="../../assets/images/battery.png" mode=""></image>
							<span>电压：{{item.carVoltage}}V</span>
						</view>
					</view>
				</view>
				<!-- 加载更多提示 -->
				<view v-if="loading" class="loading-more">正在加载...</view>
				<u-loadmore v-show="hittingBottom" loadmoreText="没有更多数据" color="#1CD29B" lineColor="#1CD29B" dashed
					line />
			</scroll-view>
		</view>

		<u-overlay :show="showAddCar">
			<view class="overlayBox">
				<view class="title">添加车辆</view>
				<view class="serialNumber">
					请输入序列号
				</view>
				<view class="formItem">
					<view class="itemRight flex">
						<u--input border="none" type="text" v-model="serialNumber" placeholder="请输入或扫描12位序列号" />
						<u-icon name="scan" size="28" color="#30313D"></u-icon>
					</view>
				</view>
				<view class="limit">
					{{serialNumber.length}}/12
				</view>
				<view class="btns">
					<span class="cancel" @click="showAddCar = false">取消</span>
					<span class="commit" @click="commitAddCar">确认</span>
				</view>
			</view>
		</u-overlay>
		<TabBar :activeValue="1" />
	</view>
</template>

<script>
	import TabBar from '@/components/common/TabBar.vue'
	import NoData from '@/components/common/NoData.vue'
	import request from '@/utils/request';
	import {
		requestUrl
	} from '@/utils/request';
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				loading: false,
				isRefreshing: false,
				total: 18,
				hittingBottom: false,
				showAddCar: false,
				showAddSite: true,
				showNoData: false,
				dataList: [],
				serialNumber: '',
				pageStyle: {},
				pollingTime: []
			}
		},
		components: {
			TabBar,
			NoData
		},
		onReady() {
			let that = this
			uni.getStorage({
				key: 'statusBarHeight',
				success(res) {
					that.pageStyle = {
						paddingTop: `${res.data + 16}px`
					};
				}
			})
		},
		onShow() {
			this.loadData()
		},
		methods: {
			navigateTo(url) {
				clearInterval(this.pollingTime)
				uni.navigateTo({
					url
				})
			},
			checkStatus(carStatus, macAddress) {
				if (carStatus == 1) {
					this.openDriving(macAddress)
				} else if (carStatus == 2) {
					this.closeDriving(macAddress)
				} else {
					return
				}
			},
			async openDriving(macAddress) {
				try {
					const response = await request(`/app/carInfo/onlineCar/${macAddress}`, 'GET')
					this.pageNum = 1;
					this.loadData()
				} catch (error) {
					uni.showToast({
						title: '开放失败',
						icon: 'none',
					});
				}
			},
			async closeDriving(macAddress) {
				try {
					const response = await request(`/app/carInfo/offlineCar/${macAddress}`, 'GET')
					this.pageNum = 1;
					this.loadData()
				} catch (error) {
					uni.showToast({
						title: '关闭失败',
						icon: 'none',
					});
				}
			},
			// 下拉刷新
			onRefresh() {
				if (this.isRefreshing) return;
				this.isRefreshing = true;
				this.pageNum = 1;
				setTimeout(() => {
					this.dataList = []
					this.loadData();
				}, 1000)
			},
			// 上拉加载更多
			onLoadMore() {
				if (this.loading) return;
				if (this.hittingBottom) return;
				this.loading = true;
				setTimeout(() => {
					this.pageNum++;
					this.loadData()
				}, 1000)
			},
			async loadData() {
				try {
					const response = await request('/app/carInfo/listByUserId', 'GET', {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					})
					clearInterval(this.pollingTime)
					const data = response.rows
					this.total = response.total
					this.dataList = this.pageNum === 1 ? data : this.dataList.concat(
						data)
					this.showNoData = this.dataList.length == 0 ? true : false;
					!this.showNoData ? this.dataList.forEach(
						(item, index) => {
							item.sitePictureUrl = requestUrl + item.sitePictureUrl.split(",")[0];
							item.myCsq = this.getValueBetweenChars(item.myCsq || '+signal#10,0', '#', ',')
							this.pollingTime[index] = setInterval(() => {
								this.polling(item.macAddress, index)
							}, 10000)
						}) : ''
					if (this.dataList.length >= this.total) {
						this.hittingBottom = true
						this.loading = false
					} else {
						this.hittingBottom = false
						this.loading = true
					}

					this.isRefreshing = false;
				} catch (error) {
					console.log(error)
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			getValueBetweenChars(str, startChar, endChar) {
				const startIndex = str.indexOf(startChar);
				const endIndex = str.indexOf(endChar, startIndex + 1);
				if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
					return Number(str.substring(startIndex + 1, endIndex))
				}

				return '-';
			},
			async polling(macAddress, index) {
				try {
					const response = await request(`/app/carInfo/carData/${macAddress}`, 'GET')
					this.dataList[index].carQuantity = response.data.carQuantity
					this.dataList[index].carStatus = response.data.carStatus
					this.dataList[index].carVoltage = response.data.carVoltage
					this.dataList[index].myCsq = response.data.myCsq
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			async commitAddCar() {
				try {
					const response = await request(`/app/carInfo/bindCar/${this.serialNumber}`, 'GET')
					if (response.code === 200) {
						this.showAddCar = false
						this.onRefresh()
						this.showToast({
							type: 'success',
							message: "添加成功",
						})
					} else {
						uni.showToast({
							title: response.msg,
							icon: 'none',
						});
					}
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			showToast(params) {
				this.$refs.uToast.show({
					...params
				})
			}
		},
		mounted() {
		},
		onHide() {
			if (this.dataList.length) {
				this.dataList.forEach(
					(item, index) => {
						clearInterval(this.pollingTime[index])
					})
			}
			this.pollingTime = []
			clearInterval()
		}
	}
</script>

<style scoped lang="less">
	.carPage {
		width: 100%;
		height: 100vh;
		background-color: #eea618;
		box-sizing: border-box;
		padding-bottom: 22.9vw;

		.content {
			width: 100%;
			height: calc(100vh - 25.6vw);
			box-sizing: border-box;
			padding: 16px;
			padding-bottom: 13.33vw;

			.title {
				display: flex;
				justify-content: space-between;
				color: #fff;
				margin-bottom: 16px;
				padding: 8px 0;

				.car {
					font-size: 16px;
					font-weight: bold;
				}
			}

			.dataItem {
				margin-bottom: 16px;
				width: 100%;
				border-radius: 8px;
				background-color: #FFF;
				box-sizing: border-box;
				padding: 16px;

				.carInfo {
					display: flex;

					.carImg {
						width: 37.33vw;
						height: 32vw;
						margin-right: 20px;
					}

					.carDesc {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding: 8px 0;

						.carName {
							font-size: 16px;
							font-weight: bold;
						}

						.attribution,
						.code {
							font-size: 12px;
						}

						.btns {
							display: flex;
							justify-content: space-between;

							.btn {
								font-size: 14px;
								height: 26px;
								line-height: 26px;
								padding: 0px 16px;
								color: #FFF;
								border-radius: 13px;
								background-color: #0055ff;
							}

							.watch {
								height: 24px;
								line-height: 24px;
								background-color: #FFF;
								border: solid 1px #0055ff;
								color: #0055ff;
							}
						}
					}
				}

				.configuration {
					display: flex;
					justify-content: space-between;
					padding: 8px 16px 0px;

					view {
						display: flex;
						align-items: center;
						font-size: 12px;

						image {
							width: 24px;
							height: 18px;
							margin-right: 4px;
						}
					}
				}
			}
		}

		.loading-more {
			text-align: center;
			padding: 10px;
			color: #666;
		}

		.u-transition {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>