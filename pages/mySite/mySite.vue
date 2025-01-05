<template>
	<view class="mySite">
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
				<view v-for="(item,index) in dataList" :key="index" class="listItem">
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
							<span>正在驾驶中：{{item.driving}}</span>
							<view class="selectionCar" @click="selectCar(item)">
								选车
							</view>
						</view>
					</view>
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
	export default {
		data() {
			return {
				page: 1,
				pageSize: 10,
				loading: false,
				isRefreshing: false,
				total: 18,
				hittingBottom: false,
				dataList: []
			}
		},
		components: {
			AppBar
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
					},
					{
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
					},
					{
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
				background-color: #FFF;
				display: flex;
				margin-bottom: 16px;
				border-radius: 8px;
				overflow: hidden;

				image {
					width: 50%;
					height: 130px;
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
							line-height: 14px;
							padding: 4px 12px;
							background-color: #9048d8;
							color: #FFF;
							border-radius: 12px;
						}
					}
				}
			}
		}
	}
</style>