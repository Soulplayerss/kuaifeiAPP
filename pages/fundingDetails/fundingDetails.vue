<template>
	<view class="myFeedback">
		<AppBar title='资金明细' @goBank="goBank" />
		<view style="padding: 16px;">
			<view class="content">
				<view style="margin-bottom: 16px;" class="flex justify-between">
					<span></span>
					<view class="pickerBox">
						<picker mode="selector" :range="options" @change="onPickerChange">
							<view class="picker">
								<text>{{ selectedOption }}</text>
								<u-icon name="arrow-down" size="16"></u-icon>
							</view>
						</picker>
					</view>
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
									<span>变动金额：{{item.totalAmount}}</span>
									<span style="min-width:100px;">类型：<span
											:style="{color:item.type == 3 ? '#4cee1b' : item.type == 0 ? '#c38513' : item.type == 2 ? '#eea816' : '#5a5dee'}">
											{{item.type == 0 ? '支出' : item.type == 1 ? '收益' :  item.type == 2 ? '充值' : '提现'}}
										</span></span>
								</view>
								<view>
									资金事项：{{item.remark}}
								</view>
								<view>
									订单时间：{{item.createTime}}
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
				total: 18,
				hittingBottom: false,
				showNoData: false,
				dataList: [],
				options: ['全部', '提现', '支出', '充值', '收益'],
				selectedOption: '全部',
				type: '',
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
			onPickerChange(e) {
				const selectedIndex = e.detail.value;
				this.selectedOption = this.options[selectedIndex];
				switch (this.selectedOption) {
					case '提现':
						this.type = 3
						break;
					case '支出':
						this.type = 0
						break;
					case '充值':
						this.type = 2
						break;
					case '收益':
						this.type = 1
						break;
					case '全部':
						this.type = ''
						break;
					default:
						this.type = ''
				}
				this.onRefresh()
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
			// 加载数据方法
			async loadData() {
				try {
					const response = await request('/app/assetDetail/list', 'GET', {
						pageNum: this.pageNum,
						pageSize: this.pageSize,
						type: this.type

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

			.pickerBox {
				width: 30%;
				border: solid 1px #e5e5e6;
				border-radius: 4px;
				padding: 4px 16px;

				.picker {
					background-color: #fff;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 16px;
					color: #aaaaaa;
				}
			}

			.list {
				flex: 1;
				overflow: hidden;
			}
		}
	}
</style>