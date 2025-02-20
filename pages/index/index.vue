<template>
	<view class="indexPage">
		<view class="header" :style="pageStyle">
			<view class="remind">
				<image src="../../assets/images/remind.png" mode=""></image>
				如有未结束订单，请到我的订单中进入或结束!
			</view>
			<view class="banner">
				<u-swiper :list="bannerList" @change="e => current = e.current" circular :autoplay="true" height="200">
					<view slot="indicator" class="indicator">
						<view class="indicator__dot" v-for="(item, index) in bannerList" :key="index"
							:class="[index === current && 'indicator__dot--active']">
						</view>
					</view>
				</u-swiper>
			</view>
		</view>
		<view class="tabBox">
			<!-- <view class="tab">
				<view class="item" @click="changeTab('car')">
					<span :class="tabActive=='car' ? 'tabActive' : ''">共享车辆</span>
					<image src="../../assets/images/tab-car.png" mode=""></image>
				</view>
				<view class="item" @click="changeTab('battery')">
					<span :class="tabActive=='battery' ? 'tabActive' : ''">电池套餐</span>
					<image src="../../assets/images/tab-battery.png" mode="" class="battery"></image>
				</view>
			</view> -->
			<!-- <image src="../../assets/images/diveder.png" mode="" class="divider"></image> -->
			<view class="content">
				<view class="typeItem">
					<view class="title">
						<image src="../../assets/images/index-site.png" mode="" class="projectImg"></image>
						<view class="text">
							<view class="site">云控工地</view>
							<span class="desc">多场景多设备，感受物联网带来的工程乐趣</span>
						</view>
						<span style="color: #FFF;" @click="loadSiteData(siteType)">刷新</span>
					</view>
					<u-scroll-list v-show="siteData.length">
						<view v-for="(item,index) in siteData" :key="index" class="listItem">
							<view class="item">
								<view class="drivingNum">
									<view class="name">{{item.siteName}}</view>驾驶中：{{item.drivingNum}}
								</view>
								<view class="right">
									<view class="tag">
										<span v-for="tage in item.tage">{{tage}}</span>
									</view>
									<view class="deviceNumber">
										<view class="total">
											<span class="round"></span>
											<span>总数</span>
											<span>{{item.totalNum}}</span>
										</view>
										<view class="online">
											<span class="round online-round"></span>
											<span>在线</span>
											<span>{{item.onlineNum}}</span>
										</view>
										<view class="idle">
											<span class="round idle-round"></span>
											<span>空闲</span>
											<span>{{item.freeNum}}</span>
										</view>
									</view>
									<view class="driving">
										<u-button type="primary" shape="circle" text="选车" class="btn"
											color="linear-gradient(to bottom, rgb(255, 224, 65), rgb(255, 137, 41))"
											@click="selectCar(item.siteId)"></u-button>

									</view>
								</view>
								<image :src="item.sitePictureUrl" mode=""></image>
							</view>
						</view>
					</u-scroll-list>
					<view class="_nodata" v-show="!siteData.length">
						<image src="../../assets/images/nodata.png" mode="" style="width: 100px;height: 100px;"></image>
						<span>暂无数据</span>
					</view>
				</view>

				<view class="typeItem">
					<view class="title">
						<image src="../../assets/images/index-drones.png" mode="" class="projectImg"></image>
						<view class="text">
							<view class="site">无人机</view>
							<span class="desc">玩转无人机，生活填乐趣</span>
						</view>
						<span style="color: #FFF;" @click="loadDronesData(siteType)">刷新</span>
					</view>
					<u-scroll-list v-show="dronesData.length">
						<view v-for="(item,index) in dronesData" :key="index" class="listItem">
							<view class="item">
								<view class="drivingNum">
									<view class="name">{{item.siteName}}</view>飞行中：{{item.drivingNum}}
								</view>
								<image :src="item.sitePictureUrl" mode=""></image>
								<view class="right">
									<view class="name">{{item.siteName}}</view>
									<view class="tag">
										<span v-for="tage in item.tage">{{tage}}</span>
									</view>
									<view class="deviceNumber">
										<view class="total">
											<span class="round"></span>
											<span>总数</span>
											<span>{{item.totalNum}}</span>
										</view>
										<view class="online">
											<span class="round online-round"></span>
											<span>在线</span>
											<span>{{item.onlineNum}}</span>
										</view>
										<view class="idle">
											<span class="round idle-round"></span>
											<span>空闲</span>
											<span>{{item.freeNum}}</span>
										</view>
									</view>
									<view class="driving">
										<u-button type="primary" shape="circle" text="选机" class="btn"
											color="linear-gradient(to bottom, rgb(255, 192, 66), rgb(255, 167, 43))"
											@click="selectCar(item)"></u-button>

									</view>
								</view>
							</view>
						</view>
					</u-scroll-list>
					<view class="_nodata" v-show="!dronesData.length">
						<image src="../../assets/images/nodata.png" mode="" style="width: 100px;height: 100px;"></image>
						<span>暂无数据</span>
					</view>
				</view>

				<view class="typeItem">
					<view class="title">
						<image src="../../assets/images/index-yacht.png" mode="" class="projectImg"></image>
						<view class="text">
							<view class="site">游艇专场</view>
							<span class="desc">快速遥控游艇：探索水上遥控模型的乐趣</span>
						</view>
						<span style="color: #FFF;" @click="loadYachtData(siteType)">刷新</span>
					</view>
					<u-scroll-list v-show="yachtData.length">
						<view v-for="(item,index) in yachtData" :key="index" class="listItem">
							<view class="item">
								<view class="drivingNum">
									<view class="name">{{item.siteName}}</view>驾驶中：{{item.drivingNum}}
								</view>
								<image :src="item.sitePictureUrl" mode=""></image>
								<view class="right">
									<view class="name">{{item.siteName}}</view>
									<view class="tag">
										<span v-for="tage in item.tage">{{tage}}</span>
									</view>
									<view class="deviceNumber">
										<view class="total">
											<span class="round"></span>
											<span>总数</span>
											<span>{{item.totalNum}}</span>
										</view>
										<view class="online">
											<span class="round online-round"></span>
											<span>在线</span>
											<span>{{item.onlineNum}}</span>
										</view>
										<view class="idle">
											<span class="round idle-round"></span>
											<span>空闲</span>
											<span>{{item.freeNum}}</span>
										</view>
									</view>
									<view class="driving">
										<u-button type="primary" shape="circle" text="选艇" class="btn"
											color="linear-gradient(to bottom, rgb(255, 192, 66), rgb(255, 167, 43))"
											@click="selectCar(item)"></u-button>

									</view>
								</view>
							</view>
						</view>
					</u-scroll-list>
					<view class="_nodata" v-show="!yachtData.length">
						<image src="../../assets/images/nodata.png" mode="" style="width: 100px;height: 100px;"></image>
						<span>暂无数据</span>
					</view>
				</view>

				<view class="typeItem">
					<view class="title">
						<image src="../../assets/images/index-racing.png" mode="" class="projectImg"></image>
						<view class="text">
							<view class="site">RC赛车</view>
							<span class="desc">玩转漂移乐趣的全新体验，圆你赛车梦</span>
						</view>
						<span style="color: #FFF;" @click="loadRacingData(siteType)">刷新</span>
					</view>
					<u-scroll-list v-show="racingData.length">
						<view v-for="(item,index) in racingData" :key="index" class="listItem">
							<view class="item">
								<view class="drivingNum">
									<view class="name">{{item.siteName}}</view>驾驶中：{{item.drivingNum}}
								</view>
								<image :src="item.sitePictureUrl" mode=""></image>
								<view class="right">
									<view class="name">{{item.siteName}}</view>
									<view class="tag">
										<span v-for="tage in item.tage">{{tage}}</span>
									</view>
									<view class="deviceNumber">
										<view class="total">
											<span class="round"></span>
											<span>总数</span>
											<span>{{item.totalNum}}</span>
										</view>
										<view class="online">
											<span class="round online-round"></span>
											<span>在线</span>
											<span>{{item.onlineNum}}</span>
										</view>
										<view class="idle">
											<span class="round idle-round"></span>
											<span>空闲</span>
											<span>{{item.freeNum}}</span>
										</view>
									</view>
									<view class="driving">
										<u-button type="primary" shape="circle" text="选车" class="btn"
											color="linear-gradient(to bottom, rgb(255, 192, 66), rgb(255, 167, 43))"
											@click="selectCar(item)"></u-button>

									</view>
								</view>
							</view>
						</view>
					</u-scroll-list>
					<view class="_nodata" v-show="!racingData.length">
						<image src="../../assets/images/nodata.png" mode="" style="width: 100px;height: 100px;"></image>
						<span>暂无数据</span>
					</view>
				</view>
			</view>
		</view>
		<TabBar :activeValue="0" />
	</view>
</template>

<script>
	import TabBar from '@/components/common/TabBar.vue'
	import NoData from '@/components/common/NoData.vue'
	import request from '@/utils/request';
	import {
		requestUrl
	} from '@/utils/request';
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				pollingTime: null,
				current: 0,
				tabActive: 'car',
				statusBarHeight: '',
				pageStyle: {},
				bannerList: [
					'../../static/banner.jpg',
					'../../static/banner1.jpg'
				],
				siteData: [],
				dronesData: [],
				yachtData: [],
				racingData: [],
				siteType: []
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
		computed: {
			...mapState(['siteLabel'])
		},
		onLoad() {},
		methods: {
			changeTab(type) {
				this.tabActive = type
			},
			selectCar(siteId) {
				clearInterval(this.pollingTime)
				uni.navigateTo({
					url: `/pages/selectCar/selectCar?page=index&siteId=${siteId}`,
				})
			},
			getData(siteType) {
				this.loadSiteData(siteType);
				this.loadDronesData(siteType);
				this.loadYachtData(siteType);
				this.loadRacingData(siteType);
			},
			async loadSiteData(siteType) {
				try {
					const siteData = await request(`/app/site/getSiteForApp`, 'POST', {
						siteType: siteType[0].dictValue,
						siteStatus: 1
					})
					this.siteData = siteData.data
					this.siteData.forEach((item) => {
						item.sitePictureUrl = requestUrl + item.sitePictureUrl;
					})
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			async loadDronesData(siteType) {
				try {
					const dronesData = await request(`/app/site/getSiteForApp`, 'POST', {
						siteType: siteType[1].dictValue,
						siteStatus: 1
					})
					this.dronesData = dronesData.data
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			async loadYachtData(siteType) {
				try {
					const yachtData = await request(`/app/site/getSiteForApp`, 'POST', {
						siteType: siteType[1].dictValue,
						siteStatus: 1
					})
					this.yachtData = yachtData.data
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			async loadRacingData(siteType) {
				try {
					const racingData = await request(`/app/site/getSiteForApp`, 'POST', {
						siteType: siteType[1].dictValue,
						siteStatus: 1
					})
					this.racingData = racingData.data
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
		},
		mounted() {
			let siteTypeInterval = setInterval(() => {
				var siteType = []
				siteType = uni.getStorageSync('siteType')
				this.siteType = siteType
				if (siteType.length != 0) {
					clearInterval(siteTypeInterval)
					this.getData(siteType)
					this.pollingTime = setInterval(() => {
						this.getData(siteType)
					}, 10000)
				}
			}, 200)
		},
		onHide() {
			clearInterval(this.pollingTime)
		}
	}
</script>

<style scoped lang="less">
	.indexPage {
		width: 100%;
		min-height: 100vh;
		background-color: rgb(238, 166, 24);
		box-sizing: border-box;
		padding-bottom: 22.9vw;

		.header {
			background: url('../../assets/images/index-bg.png') no-repeat;
			background-size: 100% 100%;
			padding: 16px;
			width: 100%;
			height: 110vw;
			box-sizing: border-box;

			.remind {
				width: 100%;
				min-height: 40px;
				border-radius: 8px;
				background-color: rgb(255, 245, 230);
				display: flex;
				justify-content: start;
				align-items: center;
				font-size: 14px;
				line-height: 14px;
				box-sizing: border-box;
				padding: 16px;
				margin-bottom: 16px;

				image {
					width: 20px;
					height: 20px;
					margin-right: 8px;
				}
			}

			.banner {
				width: 100%;
				border-radius: 8px;
				overflow: hidden;
				height: 70vw;

				image {
					width: 100%;
					height: 70vw;
				}

				.indicator {
					@include flex(row);
					justify-content: center;
					display: flex;

					&__dot {
						height: 6px;
						width: 6px;
						border-radius: 100px;
						background-color: rgba(255, 255, 255, 0.35);
						margin: 0 5px;
						transition: background-color 0.3s;

						&--active {
							background-color: #ffffff;
						}
					}
				}
			}
		}


		.tabBox {
			width: 100%;
			background: url('../../assets/images/tab-bg.png') no-repeat;
			background-size: 100% auto;

			.tab {
				display: flex;
				gap: 20px;
				padding: 0 16px;

				.item {
					flex: 1;
					height: 16vw;
					background: url('../../assets/images/tab-bg.jpg') no-repeat;
					background-size: 100% 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 4.8vw;
					font-weight: bold;
					gap: 1.1vw;
					color: #8bffc5;

					.tabActive {
						color: #eea618;

					}

					span {
						padding-bottom: 3.2vw;
					}

					image {
						width: 16vw;
						height: 16vw;
					}

					.battery {
						width: 12.3vw;
						height: 12.3vw;
						padding-bottom: 8px;
					}
				}
			}

			.divider {
				width: 100%;
				height: 10px;
				margin: 20px 0;
			}

			.content {
				padding: 0 16px;

				.typeItem {
					margin-bottom: 16px;

					._nodata {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						span {
							font-size: 14px;
							color: #FFF;
						}
					}
				}

				.title {
					display: flex;
					align-items: center;
					margin-bottom: 20px;

					.projectImg {
						width: 13vw;
						height: 13vw;
					}

					.text {
						flex: 1;
						padding: 0 8px;

						.site {
							font-size: 20px;
							color: #FFF;
							font-weight: bold;
						}

						.desc {
							font-size: 12px
						}
					}
				}

				.listItem {
					margin-bottom: 16px;
					margin-right: 16px;

					.item {
						background-color: #FFF;
						border-radius: 8px;
						overflow: hidden;
						position: relative;

						.drivingNum {
							position: absolute;
							z-index: 999;
							width: 100%;
							box-sizing: border-box;
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: 12px;
							padding: 0 8px;
							top: 8px;
							color: #FFF;

							.name {
								font-size: 15px;
								line-height: 15px;
								font-weight: bold;
								height: 15px;
							}
						}

						image {
							width: 45vw;
							height: 28vw;
						}

						.right {
							position: absolute;
							z-index: 999;
							bottom: 0;
							width: 100%;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							padding: 8px;
							color: #FFF;

							.tag {
								display: flex;
								font-size: 10px;
								gap: 8px;
								line-height: 10px;
								margin-bottom: 8px;

								span {
									display: inline-block;
									padding: 4px 8px;
									border: solid 1px #eea618;
									border-radius: 10px;
								}
							}

							.deviceNumber {
								display: flex;
								justify-content: space-around;
								font-size: 12px;
								gap: 6px;

								view {
									display: flex;
									align-items: center;

									.round {
										display: inline-block;
										width: 6px;
										height: 6px;
										border-radius: 50%;
										background-color: #0055ff;
										margin-right: 4px;
									}

									.online-round {
										background-color: #aaaa7f;
									}

									.idle-round {
										background-color: #aaff00;
									}
								}
							}

							.driving {
								display: flex;
								justify-content: space-between;
								padding-top: 16px;

								.btn {
									width: 50%;
									height: 7vw;
									font-weight: bold;
								}
							}
						}
					}


				}
			}
		}

	}
</style>