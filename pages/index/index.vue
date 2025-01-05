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
			<view class="tab">
				<view class="item" @click="changeTab('car')">
					<span :class="tabActive=='car' ? 'tabActive' : ''">共享车辆</span>
					<image src="../../assets/images/tab-car.png" mode=""></image>
				</view>
				<view class="item" @click="changeTab('battery')">
					<span :class="tabActive=='battery' ? 'tabActive' : ''">电池套餐</span>
					<image src="../../assets/images/tab-battery.png" mode="" class="battery"></image>
				</view>
			</view>
			<image src="../../assets/images/diveder.png" mode="" class="divider"></image>
			<view class="content" v-show="tabActive=='car'">
				<view class="title">
					<image src="../../assets/images/index-title.png" mode="" class="projectImg"></image>
					<view class="text">
						<view class="site">选择场地</view>
						<span class="desc">多场景多设备，充分满足你的工程梦想，感受物联网带来的乐趣</span>
					</view>
					<span style="color: #FFF;">刷新</span>
				</view>
				<view v-for="(item,index) in carData" :key="index" class="listItem">
					<image :src="item.img" mode=""></image>
					<view class="right">
						<view class="name">{{item.name}}</view>
						<view class="tag">
							<span v-for="tage in item.tage">{{tage}}</span>
						</view>
						<view class="deviceNumber">
							<view class="total">
								<span class="round"></span>
								<span>总数</span>
								<span>{{item.total}}</span>
							</view>
							<view class="online">
								<span class="round online-round"></span>
								<span>在线</span>
								<span>{{item.online}}</span>
							</view>
							<view class="idle">
								<span class="round idle-round"></span>
								<span>空闲</span>
								<span>{{item.idle}}</span>
							</view>
						</view>
						<view class="driving">
							<span>驾驶中：{{item.driving}}</span>
							<view class="selectionCar" @click="selectCar(item)">
								选车
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<TabBar :activeValue="0" />
	</view>
</template>

<script>
	import TabBar from '@/components/common/TabBar.vue'
	export default {
		data() {
			return {
				current: 0,
				tabActive: 'car',
				statusBarHeight: '',
				pageStyle: {},
				bannerList: [
					'../../static/banner.jpg',
					'../../static/banner1.jpg'
				],
				carData: [{
						img: '/static/index-list-img.jpg',
						name: '我的工地',
						tage: ['工程车', '越野车'],
						total: 8,
						online: 5,
						idle: 3,
						driving: 1
					},
					{
						img: '/static/index-list-img.jpg',
						name: '你的工地',
						tage: ['工程车', '越野车'],
						total: 8,
						online: 5,
						idle: 3,
						driving: 2
					}
				]
			}
		},
		components: {
			TabBar
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
		onLoad() {

		},
		methods: {
			changeTab(type) {
				this.tabActive = type
			},
			selectCar(item) {
				uni.navigateTo({
					url: '/pages/selectCar/selectCar?page=index',
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.indexPage {
		width: 100%;
		min-height: 100vh;
		background-color: rgb(238, 166, 24);
		box-sizing: border-box;
		padding-bottom: 86px;

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
					height: 60px;
					background: url('../../assets/images/tab-bg.jpg') no-repeat;
					background-size: 100% 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 18px;
					font-weight: bold;
					gap: 4px;
					color: #8bffc5;

					.tabActive {
						color: #eea618;

					}

					span {
						padding-bottom: 12px;
					}

					image {
						width: 60px;
						height: 60px;
					}

					.battery {
						width: 46px;
						height: 46px;
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

				.title {
					display: flex;
					align-items: center;
					margin-bottom: 20px;

					.projectImg {
						width: 68px;
						height: 48px;
					}

					.text {
						flex: 1;
						padding: 0 8px;

						.site {
							font-size: 18px;
							color: #FFF;
							font-weight: bold;
						}

						.desc {
							font-size: 8px
						}
					}
				}

				.listItem {
					background-color: #FFF;
					display: flex;
					margin-bottom: 16px;
					border-radius: 8px;
					overflow: hidden;

					image {
						width: 40%;
						height: 120px;
					}

					.right {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding: 8px 16px 8px 8px;

						.name {
							font-size: 16px;
							margin-bottom: 8px;
						}

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
							align-items: center;
							font-size: 14px;

							span {

								color: #aaaa7f;
							}

							.selectionCar {
								font-size: 14px;
								height: 26px;
								line-height: 26px;
								padding: 0px 16px;
								color: #FFF;
								border-radius: 13px;
								background-color: #9048d8;
							}
						}
					}
				}
			}
		}

	}
</style>