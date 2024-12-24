<template>
	<view class="login">
		<image src="../../static/logo.png" mode="" class="logo"></image>
		<span class="loginText">登录</span>
		<view class="formBox">
			<view class="formItem">
				<u-icon name="account" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<input type="text" v-model="userInfo.phone" placeholder="请输入手机号" />
				</view>
			</view>
			<view class="formItem">
				<u-icon name="lock" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<input type="password" v-model="userInfo.password" placeholder="请输入密码" />
				</view>
			</view>
		</view>
		<view class="forgetPassword">
			忘记密码
		</view>
		<u-button type="primary" shape="circle" text="登录" class="btn"
			color="linear-gradient(to bottom, rgb(134, 211, 254), rgb(27, 156, 219))" @click="toIndex"></u-button>
		<u-button type="primary" shape="circle" text="注册" class="btn" style="color:#30313D;fontSize: 16px;"
			color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))"></u-button>
		<view class="protocol">
			<u-checkbox-group v-model="protocol" placement="column" @change="checkboxChange">
				<u-checkbox label="" :name="true"></u-checkbox>
			</u-checkbox-group>
			<span style="color:#30313D;">我已阅读并同意</span>
			<span @click="show = true">用户协议</span>
			<span style="color:#30313D;">和</span>
			<span @click="show = true">隐私协议</span>
		</view>

		<u-overlay :show="show" @click="show = false">
			<view class="overlayBox">
				<view class="title">温馨提示</view>
				<view class="content">
					欢迎来到快飞云控!
				</view>
				<view class="content">
					我们深知个人信息对你的重要性也感谢你对我们的信任。
				</view>
				<view class="content">
					为了更好地保护你的权益，同时遵守相关监管的要求，我们将通过《<span class="protocolText">快飞云控隐私权政策</span>》向你说明我们会如何收集、存储保护、使用及对外提供你的信息，并说明你享有的权利。
				</view>
				<view class="content">
					更多详情，敬请查阅《<span class="protocolText">快飞云控隐私权政策</span>》全文
				</view>
				<view class="btns">
					<span class="no">不同意</span>
					<span class="yes">同意</span>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					phone: '',
					password: '',
				},
				protocol: '',
				show: false,
			};
		},
		methods: {
			toIndex(){
				uni.navigateTo({
					url: '/pages/index/index',
				})
			},
			checkboxChange(e) {
				console.log(e)
			}
		},
		onReady() {
			
		},
	};
</script>

<style lang="less">
	.login {
		width: 100%;
		height: 1010vh;
		background-color: rgb(238, 166, 24);
		color: #FFF;
		box-sizing: border-box;
		padding-top: 80rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

		.logo {
			width: 100rpx;
			height: 100rpx;
		}

		.loginText {
			font-size: 60rpx;
		}


		.forgetPassword {
			width: 70%;
			text-align: right;
			color: #30313D;
			margin: 40rpx 0;
		}

		.btn {
			width: 70%;
			font-weight: bold;
			font-size: 16px;
			margin-bottom: 40rpx;
		}

		.protocol {
			position: fixed;
			bottom: 40rpx;
			display: flex;
			align-items: center;

			.u-checkbox__icon-wrap {
				color: #30313D !important;
				line-height: 18px !important;
			}
		}

		.u-transition {
			display: flex;
			align-items: center;
			justify-content: center;

			.overlayBox {
				width: 80%;
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
				
				.content {
					text-indent: 2em;
					font-size: 14px;
					color: #30313D;
					line-height: 24px;
					.protocolText {
						color: #b9dd04;
					}
				}
				.btns{
					margin-top: 40rpx;
					text-align: right;
					color: #b9dd04;
					.no{
						color: darkgrey;
						padding-right: 40rpx;
					}
				}
			}
		}
	}
</style>