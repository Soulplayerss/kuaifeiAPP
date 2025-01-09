<template>
	<view class="myFeedback">
		<AppBar title='提现记录' @goBank="goBank" />
		<view style="padding: 16px;">
			<view class="content">
				<view style="text-align: right;margin-bottom: 16px;">
					<span style="color: #eea618;" @click="onRefresh">刷新</span>
				</view>
				<view class="list">
					<scroll-view v-if="dataList.length" scroll-y @refresherrefresh="onRefresh"
						refresher-background="#FFF" @scrolltolower="onLoadMore" :refresher-triggered="isRefreshing"
						:style="{ height: '100%' }" refresher-enabled :refresher-threshold="50">
						<!-- 列表内容 -->
						<view v-for="(item,index) in dataList" :key="index" class="commonDataItem">
							<view class="leftBox">

							</view>
							<view class="rightInfo">
								<view>
									订单编号：{{item.assetNo}}
								</view>
								<view class="flex justify-between">
									<span>申请数量：{{item.totalAmount}}</span>
									<span style="min-width:100px;">状态：<span
											:style="{color:item.status == 0 ? '#eea818' : item.status == 2 ? '#c38513' : '#81ee6d'}">
											{{item.status == 0 ? '审核中' : item.status == 1 ? '已通过' :  item.status == 2 ? '已驳回' : ''}}
										</span></span>
								</view>
								<view class="flex justify-between">
									<span>手续费：{{item.commission}}</span>
									<span style="min-width:100px;">提现方式：{{item.remark}}</span>
								</view>
								<view>
									实际打款：{{item.realAmount}} 元
								</view>
								<view>
									申请时间：{{item.createTime}}
								</view>
								<view>
									审核时间：{{item.updateTime}}
								</view>
							</view>
						</view>
						<!-- 加载更多提示 -->
						<view v-if="loading" class="loading-more">正在加载...</view>
						<u-loadmore v-show="hittingBottom" loadmoreText="没有更多数据" color="#1CD29B" lineColor="#1CD29B"
							dashed line />
					</scroll-view>
					<NoData v-show="showNoData" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	import NoData from '@/components/common/NoData.vue'
	import request from '@/utils/request';
	export default {
		data() {
			return {
				pageNum: 1,
				pageSize: 10,
				loading: false,
				isRefreshing: false,
				total: 0,
				hittingBottom: false,
				showNoData: false,
				dataList: [],
			}
		},
		components: {
			AppBar,
			NoData
		},
		methods: {
			goBank() {
				uni.navigateTo({
					url: '/pages/wallet/wallet',
				})
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
					const response = await request('/app/assetDetail/list', 'GET', {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						type: 3

					})
					const data = response.rows
					this.total = response.total
					this.dataList = this.pageNum === 1 ? data : this.dataList.concat(
						data)
					this.showNoData = this.dataList.length == 0 ? true : false
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
			this.loadData();
		}
	}
</script>

<style scoped lang="less">
	.myFeedback {
		width: 100%;
		min-height: 100vh;
		background: url('../../assets/images/tab-bg.png') no-repeat;
		background-size: 100% auto;
		background-color: #eea618;

		.content {
			width: 100%;
			padding: 16px;
			height: calc(100vh - 122px);
			background-color: #FFF;
			border-radius: 8px;
			box-sizing: border-box;
			overflow: hidden;
			display: flex;
			flex-direction: column;

			.list {
				flex: 1;
				overflow: hidden;
			}
		}
	}
</style>