<template>
	<view class="selectCar">
		<AppBar title='选择车辆' @goBank="goBank" />
		<view class="content">
			<view class="title">
				<span class="car">场地车辆</span>
				<span>刷新</span>
			</view>
			<scroll-view v-if="dataList.length" scroll-y @refresherrefresh="onRefresh" refresher-background="#eea618"
				@scrolltolower="onLoadMore" :refresher-triggered="isRefreshing" :style="{ height: '100%' }"
				refresher-enabled :refresher-threshold="50">
				<!-- 列表内容 -->
				<view v-for="(item,index) in dataList" :key="index" class="dataItem">
					<view class="carInfo">
						<image :src="item.img" mode="" class="carImg"></image>
						<view class="carDesc">
							<view class="carName">
								{{item.carName}}
							</view>
							<view class="attribution">
								归属：{{item.attribution}}
							</view>
							<view class="code">
								编号：{{item.code}}
							</view>
							<view class="btns">
								<view class="btn operate"
									:style="{backgroundColor:item.isDrive===1 ? '#eea618' : '#0055ff'}">
									<span>{{item.isDrive===1 ? '围观' : '驾驶'}}</span>
								</view>
								<view class="btn watch">
									规则
								</view>
							</view>
						</view>
					</view>
					<view class="configuration">
						<view class="">
							<image src="../../assets/images/signal.png" mode=""></image>
							<span>状态：<span
									:style="{color: item.status == '离线' ? '#dd0000' : '#00d400'}">{{item.status}}</span></span>
						</view>
						<view class="">
							<image src="../../assets/images/battery.png" mode=""></image>
							<span>电量：{{item.power}}%</span>
						</view>
						<view class="">
							<image src="../../assets/images/battery.png" mode=""></image>
							<span>电压：{{item.voltage}}</span>
						</view>
					</view>
				</view>
				<!-- 加载更多提示 -->
				<view v-if="loading" class="loading-more">正在加载...</view>
				<u-loadmore v-show="hittingBottom" loadmoreText="没有更多数据" color="#1CD29B" lineColor="#1CD29B" dashed
					line />
			</scroll-view>
		</view>

		<view class="allVenues">
			<u-button type="primary" shape="circle" text="全部场地" class="btn" style="color: #30313D;font-weight: 700;"
				color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))" @click="goBank"></u-button>
		</view>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	export default {
		data() {
			return {
				page: 1,
				pageSize: 10,
				loading: false,
				isRefreshing: false,
				total: 18,
				hittingBottom: false,
				dataList: [],
				superiorPage: 'index',
			}
		},
		components: {
			AppBar
		},
		onLoad(options) {
			const {
				page
			} = options; // 获取具体的参数值
			console.log(page); // JohnDoe
			this.superiorPage = page
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
			// 下拉刷新
			onRefresh() {
				if (this.isRefreshing) return;

				this.isRefreshing = true;
				this.page = 1;
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
					this.page++;
					this.loadData()
				}, 1000)
			},


			// 加载数据方法
			loadData() {
				const data = [{
						img: '/static/20.png',
						carName: '挖挖机',
						attribution: '这是车辆提供者名称',
						code: 'KFCFKxingqi4',
						status: '在线',
						power: '80',
						voltage: '8.0V',
						isDrive: 1
					},
					{
						img: '/static/21.png',
						carName: '推土机',
						attribution: '这是车辆提供者名称',
						code: 'KFCFKxingqi4',
						status: '离线',
						power: '88',
						voltage: '8.0V',
						isDrive: 0
					},
					{
						img: '/static/22.png',
						carName: '卡车',
						attribution: '这是车辆提供者名称',
						code: 'KFCFKxingqi4',
						status: '在线',
						power: '20',
						voltage: '8.0V',
						isDrive: 0
					},
					{
						img: '/static/20.png',
						carName: '挖挖机',
						attribution: '这是车辆提供者名称',
						code: 'KFCFKxingqi4',
						status: '在线',
						power: '80',
						voltage: '8.0V',
						isDrive: 1
					},
					{
						img: '/static/21.png',
						carName: '推土机',
						attribution: '这是车辆提供者名称',
						code: 'KFCFKxingqi4',
						status: '离线',
						power: '88',
						voltage: '8.0V',
						isDrive: 0
					},
					{
						img: '/static/22.png',
						carName: '卡车',
						attribution: '这是车辆提供者名称',
						code: 'KFCFKxingqi4',
						status: '在线',
						power: '20',
						voltage: '8.0V',
						isDrive: 0
					}
				]

				this.dataList = this.page === 1 ? data : this.dataList.concat(
					data)

				if (this.dataList.length >= this.total) {
					this.hittingBottom = true
				} else {
					this.hittingBottom = false
				}

				this.isRefreshing = false;
				this.loading = false;
				if (this.page >= 5) {
					this.loading = false;
				}
			}
		},
		mounted() {
			this.loadData();
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
			height: calc(100vh - 116px);
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
				background-color: #FFF;
				box-sizing: border-box;
				padding: 16px;

				.carInfo {
					display: flex;

					.carImg {
						width: 140px;
						height: 120px;
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