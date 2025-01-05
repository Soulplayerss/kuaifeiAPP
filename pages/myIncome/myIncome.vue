<template>
	<view class="myFeedback">
		<AppBar title='我的收益' @goBank="goBank" />
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
						<view v-for="(item,index) in dataList" :key="index" class="commonDataItem">
							<view class="leftBox">

							</view>
							<view class="rightInfo">
								<view>
									订单编号：{{item.code}}
								</view>
								<view class="flex justify-between">
									<span>变动金额：{{item.number}}</span>
									<span style="min-width:100px;">类型：<span
											:style="{color:item.status == '提现' ? '#4cee1b' : item.status == '支出' ? '#c38513' : item.status == '充值' ? '#5a5dee' : '#eea816'}">{{item.status}}</span></span>
								</view>
								<view>
									资金事项：{{item.remarks}}
								</view>
								<view>
									订单时间：{{item.processingTime}}
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
			goBank() {
				uni.navigateTo({
					url: '/pages/wallet/wallet',
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
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
					{
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
					{
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
					{
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
					{
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
					{
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
					{
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
					{
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
					{
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
					{
						code: 'weqdascacacqqeq11346515',
						status: '收益',
						processingTime: '2024-12-05',
						number: '100',
						remarks: '玩车订单-广场（余额）'
					},
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

			.pickerBox {
				width: 30%;
				border: solid 1px #e5e5e6;
				border-radius: 4px;
				padding: 6px 16px;

				.picker {
					background-color: #fff;
					
					font-size: 16px;
				}
			}

			.list {
				flex: 1;
				overflow: hidden;
			}
		}
	}
</style>