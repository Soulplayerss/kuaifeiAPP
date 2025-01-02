<template>
	<view class="rechargeCenter">
		<view class="appbar">
			<view style="width: 24px;">
				<u-icon name="arrow-left" color="#FFF" size="24" @click="goBank"></u-icon>
			</view>
			<span>电池充值</span>
			<span style="display: inline-block;width: 24px;height: 24px;"></span>
		</view>
		<view class="content">
			<view class="title">
				选择套餐
			</view>
			<view class="list">
				<view v-for="(item,index) in dataList" :key="index" class="item" :style="{borderColor: active === index ? '#4980ff' : '#FFF'}" @click="active = index">
					<view style="margin-bottom: 8px;font-weight: bold;"><span
							style="font-size: 24px;">{{item.number}}</span>电池<span
							v-show="item.giveaway > 0">(送{{item.giveaway}})</span></view>
					<span style="color: #eea618;">{{item.amount}}元</span>
				</view>
			</view>
			<view class="notice">
				<view style="color: #cf9817;">注意事项:</view>
				<view class="remark">1.未成年人禁止充值玩车，充值消费后概不退款</view>
				<view class="remark">2.充值电池实时到账，如未到账请联系客服处理</view>
				<view class="remark">3.优先扣除充值电池，赠送电池不可提现</view>
				<view class="remark">4.充值电池可申请提现，提现收取1%手续费</view>
				<view class="remark">5.提现后赠送电池会被清空</view>
			</view>
			<view class="btns">
				<view class="btn">
					<u-button type="primary" shape="circle" text="立即充值" style="color: #FFF;"
						color="linear-gradient(to bottom, rgb(133,210,254), rgb(29, 157, 229))" @click="showPopup = true"></u-button>
				</view>
			</view>
		</view>

		<u-popup :show="showPopup" mode="bottom" :round="10" @close="close">
			<view class="popupContent">
				<view class="title">
					支付方式
				</view>
				<view class="typeList">
					<view class="item" @click="payType='微信'" :style="{borderColor:payType === '微信' ? '#88aad8' : '#c4fffc'}">
						<image src="../../assets/images/weChat.png" mode="" style="height: 24px;"></image>
						<span>微信支付</span>
					</view>
					<view class="item" @click="payType='支付宝'" :style="{borderColor:payType === '支付宝' ? '#88aad8' : '#c4fffc'}">
						<image src="../../assets/images/alipay.png" mode=""></image>
						<span>支付宝支付</span>
					</view>
				</view>
				<view style="padding: 0 32px;">
					<u-button type="primary" shape="circle" text="立即充值" style="color: #FFF;"
						color="linear-gradient(to bottom, rgb(133,210,254), rgb(29, 157, 229))"></u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPopup: false,
				payType: '微信',
				active: 0,
				dataList: [{
						number: 5,
						giveaway: 0,
						amount: 5.00
					},
					{
						number: 10,
						giveaway: 0,
						amount: 10.00
					}, {
						number: 20,
						giveaway: 0,
						amount: 20.00
					}, {
						number: 30,
						giveaway: 0,
						amount: 30.00
					}, {
						number: 50,
						giveaway: 10,
						amount: 50.00
					}, {
						number: 100,
						giveaway: 30,
						amount: 100.00
					}, {
						number: 100,
						giveaway: 50,
						amount: 100.00
					}, {
						number: 200,
						giveaway: 100,
						amount: 200.00
					}
				]
			}
		},
		methods: {
			goBank() {
				uni.navigateTo({
					url: '/pages/wallet/wallet',
				})
			},
			close() {
				this.showPopup = false
			}
		}
	}
</script>

<style scoped lang="less">
	.rechargeCenter {
		width: 100%;
		min-height: 100vh;
		background: url('../../assets/images/rechange-bg.jpg') no-repeat;
		background-size: 100% 100%;
		padding: 16px;
		box-sizing: border-box;

		.appbar {
			height: 44px;
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #FFF;
			font-size: 18px;
			font-weight: bold;
		}

		.content {
			padding: 16px 0;

			.title {
				font-size: 18px;
			}

			.list {
				margin-top: 30px;
				display: flex;
				flex-wrap: wrap;
				gap: 16px;

				.item {
					height: 88px;
					width: calc((100% - 20px) / 2);
					box-sizing: border-box;
					border-radius: 8px;
					background-color: #FFF;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 16px;
					color: #4980ff;
					border: solid 1px #FFF;
				}
			}

			.notice {
				margin-top: 60px;

				.remark {
					padding: 4px 0;
					font-size: 14px;
					color: #616162;
				}
			}

			.btns {
				width: 100%;
				box-sizing: border-box;
				padding: 16px;
				display: flex;
				margin-top: 32px;

				.btn {
					flex: 1;
				}
			}
		}
	
		.popupContent{
			padding: 16px;
			.title{
				font-size: 18px;
				margin-bottom: 16px;
			}
			.typeList{
				display: flex;
				gap: 20px;
				margin-bottom: 20px;
				.item{
					flex: 1;
					box-sizing: border-box;
					background-color: #c4fffc;
					border-radius: 24px;
					height: 48px;
					border: solid 1px #c4fffc;
					display: flex;
					justify-content: center;
					align-items: center;
					gap: 4px;
					image{
						width: 29px;
						height: 29px;
					}
				}
			}
		}
	}
</style>