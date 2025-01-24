<template>
	<view class="mySite">
		<Loding v-show="showLoading" />
		<AppBar title='我的场地' @goBank="goBank" />
		<view class="content">
			<view class="title">
				<view class="car">场地列表</view>
				<view class="">
					<span @click="toAddSite">添加场地</span>
				</view>
			</view>

			<scroll-view v-if="dataList.length" scroll-y @refresherrefresh="onRefresh" refresher-background="#eea618"
				@scrolltolower="onLoadMore" :refresher-triggered="isRefreshing" :style="{ height: '100%' }"
				refresher-enabled :refresher-threshold="50">
				<!-- 列表内容 -->
				<view class="listItem" v-for="(item,index) in dataList" :key="index">
					<u-swipe-action>
						<u-swipe-action-item :options="options" @click="deleteItem(item.siteId)">
							<view class="itemContent">
								<image :src="item.sitePictureUrl" mode=""></image>
								<view class="right">
									<view class="name">{{item.siteName}}</view>
									<view class="tag">
										<span v-for="name in item.tag">{{name}}</span>
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
										<span>正在驾驶中：{{item.driving}}</span>
									</view>
									<view class="flex">
										<view class="selectionCar" @click="selectCar(item)">
											选车
										</view>
										<view class="onlineOffline" @click="changeSiteStatus(item.siteId)">
											{{item.siteStatus == 1 ? '下线' : '上线'}}
										</view>
									</view>
								</view>
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>

				<!-- 加载更多提示 -->
				<view v-if="loading" class="loading-more">正在加载...</view>
				<u-loadmore v-show="hittingBottom" loadmoreText="没有更多数据" color="#1CD29B" lineColor="#1CD29B" dashed
					line />
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	import Loding from '@/components/common/Loding.vue'
	import request from '@/utils/request';
	import {
		mapState
	} from 'vuex';
	import {
		requestUrl
	} from '@/utils/request';
	export default {
		data() {
			return {
				showLoading: false,
				pageNum: 1,
				pageSize: 10,
				loading: false,
				isRefreshing: false,
				total: 0,
				hittingBottom: false,
				dataList: [],
				options: [{
					text: '删除'
				}]
			}
		},
		components: {
			AppBar,
			Loding
		},
		computed: {
			...mapState(['siteLabel'])
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
			goBank() {
				uni.navigateTo({
					url: '/pages/my/my',
				})
			},
			toAddSite() {
				uni.navigateTo({
					url: '/pages/addSite/addSite?page=mySite',
				})
			},
			selectCar(item) {
				uni.navigateTo({
					url: '/pages/selectCar/selectCar?page=mySite',
				})
			},
			async changeSiteStatus(siteId) {
				this.showLoading = true
				try {
					const response = await request(`/app/site/updateStatus/${siteId}`, 'GET')
					if (response.code === 200) {
						setTimeout(() => {
							this.showLoading = false
							this.loadData();
						}, 500)
					}
				} catch (error) {
					this.showLoading = false
					uni.showToast({
						title: '操作失败',
						icon: 'none',
					});
				}

			},
			async deleteItem(siteId) {
				this.showLoading = true
				try {
					const response = await request('/app/site/' + siteId, 'POST', {})
					if (response.code === 200) {
						setTimeout(() => {
							this.showLoading = false
							this.loadData();
						}, 500)
					}
				} catch (error) {
					this.showLoading = false
					uni.showToast({
						title: '删除失败',
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
				}, 500)
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
			// 加载数据方法
			async loadData() {
				try {
					const response = await request('/app/site/listByUserId', 'POST', {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					})
					const data = response.rows
					this.total = response.total
					this.dataList = this.pageNum === 1 ? data : this.dataList.concat(
						data)
					const labelMap = this.siteLabel.reduce((map, label) => {
						map[label.dictValue] = label.dictLabel;
						return map;
					}, {});

					this.dataList.forEach((item) => {
						item.sitePictureUrl = requestUrl + item.sitePictureUrl.split(",")[0];

						// 使用 labelMap 加速查找
						item.tag = item.siteLabel.split(',').map(tagValue => labelMap[tagValue]).filter(
							Boolean);
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
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			}
		},
		mounted() {
			this.loadData()
		}
	}
</script>

<style scoped lang="less">
	.mySite {
		width: 100%;
		min-height: 100vh;
		background-color: #eea618;


		.content {
			width: 100%;
			height: calc(100vh - 146px);
			box-sizing: border-box;
			padding: 16px;

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

			.listItem {
				margin-bottom: 16px;
				border-radius: 8px;
				overflow: hidden;

				.itemContent {
					background-color: #FFF;
					display: flex;
					height: 100%;

					image {
						width: 45%;
						height: 170px;
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
							flex-wrap: wrap;

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

						}

						.selectionCar {
							line-height: 16px;
							padding: 5px 5vw;
							background-color: #9048d8;
							color: #FFF;
							border-radius: 12px;
							margin-right: 16px;
							font-size: 14px;
						}

						.onlineOffline {
							line-height: 16px;
							padding: 5px 5vw;
							width: auto;
							background-color: #eea618;
							color: #FFF;
							border-radius: 12px;
							margin-right: 16px;
							font-size: 14px;
						}

					}
				}

			}
		}
	}
</style>