<template>
	<view class="wallet">
		<AppBar title='我的钱包' @goBank="navigateTo('/pages/my/my')" />
		<view class="content">
			<view class="title">
				余额
			</view>
			<view class="balance">
				<span class="number mr-8">6952</span>
				<span class="new">(+20.00)</span>
			</view>
			<view class="btns">
				<view class="btn">
					<u-button type="primary" text="充值" style="color: #30313D;"
						color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))" @click="navigateTo('/pages/rechargeCenter/rechargeCenter')"></u-button>
				</view>
				<view class="btn">
					<u-button type="primary" text="提现" style="color: #FFF;"
						color="linear-gradient(to bottom, rgb(130,209,253), rgb(27,156, 229))" @click="navigateTo('/pages/withdrawal/withdrawal')"></u-button>
				</view>
			</view>
			<view class="list">
				<view class="settingItem" @click="navigateTo('/pages/rechargeRecord/rechargeRecord')">
					<view class="left">
						<image src="../../assets/images/topup.png" mode=""></image>
						<span>我的充值</span>
					</view>
					<view class="flex items-center">
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem" @click="navigateTo('/pages/myIncome/myIncome')">
					<view class="left">
						<image src="../../assets/images/my-income.png" mode=""></image>
						<span>我的收益</span>
					</view>
					<view class="flex items-center">
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem" @click="navigateTo('/pages/withdrawalHistory/withdrawalHistory')">
					<view class="left">
						<image src="../../assets/images/top-history.png" mode=""></image>
						<span>提现记录</span>
					</view>
					<view class="flex items-center">
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem" @click="navigateTo('/pages/fundingDetails/fundingDetails')">
					<view class="left">
						<image src="../../assets/images/funding-details.png" mode=""></image>
						<span>资金明细</span>
					</view>
					<view class="flex items-center">
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem" @click="navigateTo('/pages/feedback/feedback?page=wallet')">
					<view class="left">
						<image src="../../assets/images/question-feedback.png" mode=""></image>
						<span>问题反馈</span>
					</view>
					<view class="flex items-center">
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
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

			}
		},
		components: {
			AppBar
		},
		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.wallet {
		width: 100%;
		min-height: 100vh;
		background-color: #eea618;

		.content {
			width: 100%;
			box-sizing: border-box;
			padding: 16px;
			background: url('../../assets/images/tab-bg.png') no-repeat;
			background-size: 100% auto;
			height: calc(100vh - 90px);
			display: flex;
			flex-direction: column;
			
			.title {
				text-align: center;
				color: #FFF;
				padding-top: 32px;
				margin-bottom: 16px;
			}

			.balance {
				text-align: center;
				color: #FFF;
				margin-bottom: 32px;
				
				.number {
					font-size: 28px;
					font-weight: bold;
				}

				.new {
					font-size: 14px;
				}
			}
			
			.btns {
				background-color: #eea618;
				width: 100%;
				display: flex;
				justify-content: center;
				gap: 20px;
				margin-bottom: 24px;
				.btn {
					width: 120px;
				}
			}
			
			.list{
				flex: 1;
				width: 100%;
				box-sizing: border-box;
				padding: 16px;
				background-color: #FFF;
				border-radius: 8px;
			}
		}
	}
</style>