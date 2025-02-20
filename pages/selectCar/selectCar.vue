<template>
	<view class="selectCar">
		<Loding v-show="showLoading" />
		<AppBar title='选择车辆' @goBank="goBank" />
		<view class="content">
			<view class="title">
				<span class="car">场地车辆</span>
				<span @click="getList">刷新</span>
			</view>
			<scroll-view v-if="dataList.length" scroll-y @refresherrefresh="onRefresh" refresher-background="#eea618"
				@scrolltolower="onLoadMore" :refresher-triggered="isRefreshing" :style="{ height: '100%' }"
				refresher-enabled :refresher-threshold="50">
				<!-- 列表内容 -->
				<view v-for="(item,index) in dataList" :key="index" class="dataItem">
					<view class="carInfo">
						<image :src="item.sitePictureUrl" mode="" class="carImg"></image>
						<view class="carDesc">
							<view class="carName">
								{{item.carName}}
							</view>
							<view class="attribution">
								归属：{{item.userName}}
							</view>
							<view class="code">
								编号：{{item.carNo}}
							</view>
							<view class="btns">
								<view class="btn operate" @click="clickCar(item)" v-show="item.carStatus != 0"
									:style="{backgroundColor:item.carStatus === 3 ? '#eea618' : '#0055ff'}">
									<span>{{item.carStatus == 3 ? '围观' : item.carStatus == 2 ? '驾驶' : ''}}</span>
								</view>
								<view class="btn watch">
									规则
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
							<span>状态：<span
									:style="{color: item.carStatus == 0 ? '#dd0000' : '#00d400'}">{{item.carStatus == 0 ? '离线' : '在线'}}</span></span>
						</view>
						<view class="">
							<image src="../../assets/images/battery.png" mode=""></image>
							<span>电量：{{item.carQuantity}}%</span>
						</view>
						<view class="">
							<image src="../../assets/images/battery.png" mode=""></image>
							<span>电压：{{item.carVoltage}}</span>
						</view>
					</view>
				</view>
				<!-- 加载更多提示 -->
				<view v-if="loading" class="loading-more">正在加载...</view>
				<u-loadmore v-show="hittingBottom" loadmoreText="没有更多数据" color="#FFF" lineColor="#FFF" dashed line />
			</scroll-view>

			<NoData v-show="showNoData" />
		</view>

		<view class="allVenues">
			<u-button type="primary" shape="circle" text="全部场地" class="btn" style="color: #30313D;font-weight: 700;"
				color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))" @click="goBank"></u-button>
		</view>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	import Loding from '@/components/common/Loding.vue'
	import NoData from '@/components/common/NoData.vue'
	import request from '@/utils/request';
	import {
		requestUrl
	} from '@/utils/request';
	export default {
		data() {
			return {
				showNoData: false,
				showLoading: false,
				loading: false,
				isRefreshing: false,
				total: 0,
				hittingBottom: false,
				dataList: [],
				superiorPage: 'index',
				siteId: '',
			}
		},
		components: {
			AppBar,
			Loding,
			NoData
		},
		onLoad(options) {
			const {
				page,
				siteId
			} = options;
			this.superiorPage = page
			this.siteId = siteId
		},
		methods: {
			goBank() {
				if (this.superiorPage === 'index') {
					uni.navigateTo({
						url: '/pages/index/index',
					})
				}
				if (this.superiorPage === 'mySite') {
					uni.navigateTo({
						url: '/pages/mySite/mySite',
					})
				}
			},
			clickCar(item) {
				if (item.carStatus == 2) {
					this.startCar(item)
				}
			},
			startCar(item) {
				this.navigateTo(`/pages/drive/drive?macAddress=${item.macAddress}&carId=${item.carId}`)
			},
			navigateTo(url) {
				clearInterval(this.pollingTime)
				uni.navigateTo({
					url
				})
			},
			// 下拉刷新
			onRefresh() {
				if (this.isRefreshing) return;
				this.isRefreshing = true;
				setTimeout(() => {
					this.dataList = []
					this.loadData();
				}, 500)
			},

			// 上拉加载更多
			onLoadMore() {
				if (this.loading) return;
				if (this.hittingBottom) return;
				this.loading = true;
				setTimeout(() => {
					this.loadData()
				}, 1000)
			},

			// 加载数据方法
			async loadData() {
				try {
					const response = await request(`/app/site/getCarList/${this.siteId}`, 'GET')
					const data = response.data
					this.total = response.data.length
					this.dataList = data
					this.showLoading = false
					this.showNoData = this.dataList.length == 0 ? true : false

					this.dataList.forEach((item) => {
						item.sitePictureUrl = requestUrl + item.sitePictureUrl.split(",")[0];
						item.myCsq = this.getValueBetweenChars(item.myCsq || '+signal#10,0', '#', ',')
					});
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
					this.showLoading = false
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
			getList() {
				this.showLoading = true
				setTimeout(() => {
					this.loadData();
				}, 500)
			}
		},
		mounted() {
			this.getList()
		}
	}
</script>

<style scoped lang="less">
	.selectCar {
		width: 100%;
		height: 100vh;
		background-color: #eea618;
		box-sizing: border-box;
		padding-bottom: 72px;

		.content {
			width: 100%;
			height: calc(100vh - 162px);
			box-sizing: border-box;
			padding: 16px;
			padding-bottom: 40px;

			.title {
				display: flex;
				justify-content: space-between;
				color: #fff;
				margin-bottom: 16px;

				.car {
					font-size: 16px;
					font-weight: bold;
				}
			}

			.dataItem {
				margin-bottom: 16px;
				width: 100%;
				border-radius: 8px;
				overflow: hidden;
				background-color: #FFF;
				box-sizing: border-box;
				
				.carInfo {
					display: flex;
					justify-content: center;

					.carImg {
						width: 100%;
						height: 32vw;
					}

					.carDesc {
						position: absolute;
						width: 100%;
						box-sizing: border-box;
						padding: 16px;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.carName {
							font-size: 16px;
							font-weight: bold;
						}

						.attribution,
						.code {
							margin-top: 12px;
							font-size: 12px;
						}

						.btns {
							display: flex;
							justify-content: space-between;
							margin: 12px 0;

							.btn {
								font-size: 14px;
								height: 36px;
								line-height: 36px;
								width: 40%;
								color: #FFF;
								text-align: center;
								border-radius: 18px;
								background-color: #0055ff;
							}

							.watch {
								height: 34px;
								line-height: 34px;
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
					padding: 8px 16px;
					view {
						display: flex;
						align-items: center;
						font-size: 12px;

						image {
							width: 24px;
							height: 24px;
							margin-right: 4px;
						}
					}
				}
			}
		}

		.allVenues {
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 2;
			width: 100%;
			padding: 16px;
			box-sizing: border-box;
			background-color: #eea618;
		}

	}
</style>