<template>
	<view class="shardPage">
		<u-toast ref="uToast"></u-toast>
		<view class="content" :style="pageStyle">
			<view class="title">
				<view class="car">共享车辆</view>
				<view class="">
					<span @click="">刷新</span>
				</view>
			</view>
			<scroll-view v-if="dataList.length" scroll-y @refresherrefresh="onRefresh" @scrolltolower="onLoadMore"
				:refresher-triggered="isRefreshing" :style="{ height: '100%' }" refresher-enabled
				:refresher-threshold="50" refresher-background="#eea618">
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
								<view class="btn" :style="{backgroundColor: item.isDrive===1 ? '#eea618': '#0055ff'}"
									@click="showInputPassword = true">
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

		<u-overlay :show="showInputPassword">
			<view class="overlayBox">
				<view class="title">请输入密码</view>
				<view class="serialNumber">
					获取密码请联系车主
				</view>
				<view class="formItem">
					<view class="itemRight">
						<u--input border="none" type="number" v-model="password" placeholder="请输入共享密码" />
					</view>
				</view>

				<view class="btns">
					<span @click="showInputPassword = false" style="margin-right: 16px;background-color: #c2a9bb;"
						class="#FFF">取消</span>
					<span class="commit" @click="commit">确认</span>
				</view>
			</view>
		</u-overlay>
		<TabBar :activeValue="2" />
	</view>
</template>

<script>
	import TabBar from '@/components/common/TabBar.vue'
	export default {
		data() {
			return {
				page: 1,
				pageSize: 10,
				loading: false,
				isRefreshing: false,
				total: 18,
				hittingBottom: false,
				showAddSite: true,
				showInputPassword: false,
				dataList: [],
				password: '',
				pageStyle:{}
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
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				})
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
			},
			commit() {
				this.showInputPassword = false
				// this.showToast({
				// 	type: 'success',
				// 	position: 'top',
				// 	message: "添加成功",
				// 	iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				// })
				this.showToast({
					type: 'success',
					position: 'top',
					message: "添加失败",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
				})
			},
			showToast(params) {
				this.$refs.uToast.show({
					...params
				})
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style scoped lang="less">
	.shardPage {
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

		.loading-more {
			text-align: center;
			padding: 10px;
			color: #666;
		}

		.u-transition {
			display: flex;
			align-items: center;
			justify-content: center;

			.overlayBox {
				width: 70%;
				height: auto;
				background-color: #FFF;
				padding: 16px;
				border-radius: 8px;

				.title {
					font-size: 18px;
					font-weight: bold;
					text-align: center;
					color: #30313D;
					margin-bottom: 40rpx;
				}

				.serialNumber {
					font-size: 16px;
					color: #30313D;
					line-height: 30px;

					.protocolText {
						color: #b9dd04;
					}
				}

				.itemRight {
					padding: 8px 0;
					border-bottom: solid 1px #dadbde;
					box-sizing: border-box;
				}

				.limit {
					padding: 8px 0;
					text-align: right;
					color: #eea618;
				}

				.btns {
					margin-top: 40rpx;
					text-align: center;

					span {
						display: inline-block;
						padding: 8px 40px;
						background-color: #eea618;
						color: #FFF;
						border-radius: 19px;
					}
				}
			}
		}
	}
</style>