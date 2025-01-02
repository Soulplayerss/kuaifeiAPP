<template>
	<view class="my">
		<u-toast ref="uToast"></u-toast>
		<view class="user">
			<view class="info">
				<image src="../../assets/images/avatar.jpg" mode="" class="avatar"></image>
				<view class="">
					<view class="userName">
						张三丰
					</view>
					<span class="code">邀请码：258644</span>
				</view>
			</view>
			<u-icon name="setting" color="#FFF" size="24" @click="navigateTo('/pages/accountSetting/accountSetting')"></u-icon>
		</view>
		<view class="assets">
			<view class="wallet" @click="navigateTo('/pages/wallet/wallet')">
				<image src="../../assets/images/tab-battery.png" mode=""></image>
				<view class="info">
					<view style="font-size: 20px;font-weight: bold;line-height:20px;">100</view>
					<span style="font-size: 14px;">钱包</span>
				</view>
			</view>
			<view class="divider">

			</view>
			<view class="income">
				<image src="../../assets/images/income.png" mode=""></image>
				<view class="info">
					<view style="font-size: 20px;font-weight: bold;line-height:20px;">10</view>
					<span style="font-size: 14px;">收益</span>
				</view>
			</view>
		</view>
		<view class="settingList">
			<view class="settingItem" @click="navigateTo('/pages/myOrder/myOrder')">
				<view class="left">
					<image src="../../assets/images/my-order.png" mode=""></image>
					<span>我的订单</span>
				</view>
				<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
			</view>
			<view class="settingItem" @click="navigateTo('/pages/drivingRecord/drivingRecord')">
				<view class="left">
					<image src="../../assets/images/history.png" mode=""></image>
					<span>驾驶记录</span>
				</view>
				<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
			</view>
			<view class="settingItem" @click="navigateTo('/pages/mySite/mySite')">
				<view class="left">
					<image src="../../assets/images/my-side.png" mode=""></image>
					<span>我的场地</span>
				</view>
				<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
			</view>
			<view class="settingItem" @click="navigateTo('/pages/myShare/myShare')">
				<view class="left">
					<image src="../../assets/images/my-shared.png" mode=""></image>
					<span>我的共享</span>
				</view>
				<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
			</view>
			<view class="settingItem" @click="showChangePassword = true">
				<view class="left">
					<image src="../../assets/images/change-password.png" mode=""></image>
					<span>修改密码</span>
				</view>
				<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
			</view>
			<view class="settingItem" @click="navigateTo('/pages/forgetPassword/forgetPassword')">
				<view class="left">
					<image src="../../assets/images/forget-password.png" mode=""></image>
					<span>忘记密码</span>
				</view>
				<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
			</view>
			<view class="settingItem" @click="navigateTo('/pages/feedback/feedback?page=my')">
				<view class="left">
					<image src="../../assets/images/feedback.png" mode=""></image>
					<span>问题反馈</span>
				</view>
				<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
			</view>
			<view class="settingItem" @click="navigateTo('/pages/myFeedback/myFeedback')">
				<view class="left">
					<image src="../../assets/images/my-feedback.png" mode=""></image>
					<span>我的反馈</span>
				</view>
				<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
			</view>
			<view class="settingItem" @click="navigateTo('/pages/about/about')">
				<view class="left">
					<image src="../../assets/images/about.png" mode=""></image>
					<span>关于我们</span>
				</view>
				<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
			</view>
		</view>
		
		<u-overlay :show="showChangePassword">
			<view class="overlayBox">
				<view class="title">修改密码</view>
				<view class="formItem">
					<span style="margin-right: 16px;">原密码</span>
					<view class="itemRight flex">
						<u--input border="none" type="number" v-model="oldPassword" placeholder="请输入原密码" />
					</view>
				</view>
				<view class="formItem">
					<span style="margin-right: 16px;">新密码</span>
					<view class="itemRight flex">
						<u--input border="none" type="number" v-model="newPassword" placeholder="请输入新密码" />
					</view>
				</view>
				<view class="btns">
					<span class="commit" @click="commit">确认</span>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showChangePassword: false,
				oldPassword: '',
				newPassword: ''
			}
		},

		methods: {
			navigateTo(url) {
				uni.navigateTo({
					url
				})
			},
			commit() {
				this.showChangePassword = false
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
		}
	}
</script>

<style scoped lang="less">
	.my {
		width: 100%;
		min-height: 100vh;
		background: url('../../assets/images/login-bg.jpg') no-repeat;
		background-size: 100% auto;
		background-color: #eea618;
		padding: 16px;
		box-sizing: border-box;
		padding-bottom: 104px;
		.user {
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #FFF;
			padding: 24px 8px;

			.info {
				display: flex;
				align-items: center;
				gap: 16px;

				.avatar {
					width: 68px;
					height: 68px;
					border-radius: 50%;
				}

				.userName {
					font-size: 18px;
					font-weight: bold;
					margin-bottom: 8px;
				}

				.code {
					font-size: 14px
				}
			}
		}

		.assets {
			width: 100%;
			height: 80px;
			box-sizing: border-box;
			padding: 16px;
			border-radius: 8px;
			background-color: #fdf6e8;
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-bottom: 16px;

			.divider {
				width: 1px;
				height: 40px;
				background-color: #eea618;
			}

			.wallet,
			.income {
				display: flex;
				align-items: center;

				image {
					width: 40px;
					height: 40px;
					margin-right: 16px;
				}

				.view {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
			}
		}

		.settingList {
			width: 100%;
			box-sizing: border-box;
			padding: 16px;
			background-color: #FFF;
			border-radius: 8px;
			padding-bottom: 32px;

			
		}
		
		.u-transition {
			display: flex;
			align-items: center;
			justify-content: center;
		
		}
	}
</style>