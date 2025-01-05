<template>
	<view class="myFeedback">
		<AppBar title='我的订单' @goBank="navigateTo('/pages/my/my')" />
		<view style="padding: 16px;">
			<view class="content">
				<view style="text-align: right;margin-bottom: 16px;">
					<span style="color: #eea618;">刷新</span>
				</view>
				<view class="list">
					<scroll-view v-if="dataList.length" scroll-y @refresherrefresh="onRefresh"
						refresher-background="#FFF" @scrolltolower="onLoadMore" :refresher-triggered="isRefreshing"
						:style="{ height: '100%' }" refresher-enabled :refresher-threshold="50">
						<!-- 列表内容 -->
						<view v-for="(item,index) in dataList" :key="index" class="">
							<view class="commonDataItem">
								<view class="leftBox"></view>
								<view class="rightInfo">
									<view>
										订单编号：{{item.codeOrder}}
									</view>
									<view>
										车辆编号：{{item.codeCar}}
									</view>
									<view class="flex justify-between">
										<span>订单金额：{{item.amount}}电池</span>
										<span style="min-width:100px;">状态：<span
												style="color: #81ee6d;">{{item.status}}</span></span>
									</view>
									<view class="flex justify-between">
										<span>开始时间：{{item.startTime}}</span>
										<span style="min-width:100px;">时长：{{item.dateTime}}</span>
									</view>
									<view class="flex justify-between">
										<span>结束时间：{{item.endTime}}</span>
										<span style="min-width:100px;">支付：{{item.payType}}</span>
									</view>
								</view>
							</view>
							<view class="flex gap-20" style="padding: 0 16px 20px;">
								<view class="btn">
									重新进入
								</view>
								<view class="btn complaintOrder" @click="navigateTo('/pages/feedback/feedback?page=myOrder')">
									投诉订单
								</view>
							</view>
						</view>
						<!-- 加载更多提示 -->
						<view v-if="loading" class="loading-more">正在加载...</view>
						<u-loadmore v-show="hittingBottom" loadmoreText="没有更多数据" color="#1CD29B" lineColor="#1CD29B"
							dashed line />
					</scroll-view>
				</view>
			</view>
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
			}
		},
		components: {
			AppBar
		},
		methods: {
			navigateTo(url){
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
						codeOrder: 'weqdascacacqqeq11346515',
						codeCar: 'YYYSSFF',
						amount: '100',
						status: '已结束',
						startTime: '2024-12-05',
						endTime: '2024-12-05',
						dateTime: '2分钟',
						payType: '余额'
					},
					{
						codeOrder: 'weqdascacacqqeq11346515',
						codeCar: 'YYYSSFF',
						amount: '100',
						status: '已结束',
						startTime: '2024-12-05',
						endTime: '2024-12-05',
						dateTime: '2分钟',
						payType: '余额'
					}, {
						codeOrder: 'weqdascacacqqeq11346515',
						codeCar: 'YYYSSFF',
						amount: '100',
						status: '已结束',
						startTime: '2024-12-05',
						endTime: '2024-12-05',
						dateTime: '2分钟',
						payType: '余额'
					}, {
						codeOrder: 'weqdascacacqqeq11346515',
						codeCar: 'YYYSSFF',
						amount: '100',
						status: '已结束',
						startTime: '2024-12-05',
						endTime: '2024-12-05',
						dateTime: '2分钟',
						payType: '余额'
					}, {
						codeOrder: 'weqdascacacqqeq11346515',
						codeCar: 'YYYSSFF',
						amount: '100',
						status: '已结束',
						startTime: '2024-12-05',
						endTime: '2024-12-05',
						dateTime: '2分钟',
						payType: '余额'
					}, {
						codeOrder: 'weqdascacacqqeq11346515',
						codeCar: 'YYYSSFF',
						amount: '100',
						status: '已结束',
						startTime: '2024-12-05',
						endTime: '2024-12-05',
						dateTime: '2分钟',
						payType: '余额'
					}, {
						codeOrder: 'weqdascacacqqeq11346515',
						codeCar: 'YYYSSFF',
						amount: '100',
						status: '已结束',
						startTime: '2024-12-05',
						endTime: '2024-12-05',
						dateTime: '2分钟',
						payType: '余额'
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

			.btn {
				flex: 1;
				height: 36px;
				background-color: #eea618;
				border-radius: 4px;
				line-height: 36px;
				font-size: 14px;
				color: #FFF;
				text-align: center;
			}

			.complaintOrder {
				background-color: #c6d0c6;
				color: #636863;
			}
		}
	}
</style>