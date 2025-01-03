<template>
	<view class="login">
		<image src="../../assets/images/logo.png" mode="" class="logo"></image>
		<span class="kuaifei">快飞云控</span>
		<span class="loginText">登录</span>
		<view class="formBox">
			<view class="formItem">
				<u-icon name="phone" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input border="bottom" type="text" v-model="userInfo.phone" placeholder="请输入手机号" />
				</view>
			</view>
			<view class="formItem">
				<u-icon name="lock" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input border="bottom" type="password" v-model="userInfo.password" placeholder="请输入密码" />
				</view>
			</view>
		</view>
		<view class="forgetPassword" @click="toRetrieve">
			忘记密码
		</view>
		<u-button type="primary" shape="circle" text="登录" class="btn"
			color="linear-gradient(to bottom, rgb(134, 211, 254), rgb(27, 156, 219))" @click="toIndex"></u-button>
		<u-button type="primary" shape="circle" text="注册" class="btn" style="color: #30313D;"
			color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))" @click="toRegister"></u-button>
		<view class="protocol">
			<u-checkbox-group v-model="protocolValue" placement="column" @change="checkboxChange">
				<u-checkbox label="" name="yes"></u-checkbox>
			</u-checkbox-group>
			<span style="color:#30313D;">我已阅读并同意</span>
			<span @click="oprnProtocol">用户协议</span>
			<span style="color:#30313D;">和</span>
			<span @click="oprnProtocol">隐私协议</span>
		</view>

		<Protocol @clsoeEvent="clsoeEvent" :overlay="showOverlay" />
	</view>
</template>

<script>
	import Protocol from '@/components/common/Protocol.vue';
	import TabBar from '@/components/common/TabBar.vue'
	export default {
		data() {
			return {
				userInfo: {
					phone: '',
					password: '',
				},
				protocolValue: [],
				showOverlay: false,
				pageRoute: ''
			};
		},
		components: {
			Protocol,
			TabBar
		},
		methods: {
			toIndex() {
				uni.navigateTo({
					url: '/pages/index/index',
				})
			},
			toRegister() {
				uni.navigateTo({
					url: '/pages/register/register',
				})
			},
			toRetrieve() {
				uni.navigateTo({
					url: '/pages/forgetPassword/forgetPassword',
				})
			},
			checkboxChange(e) {
				console.log(e)
				// this.showOverlay = true
			},
			oprnProtocol() {
				this.showOverlay = false
				setTimeout(() => {
					this.showOverlay = true
				}, 100)
			},
			clsoeEvent(type) {
				this.protocolValue = [type]

			}
		},
		onReady() {

		},
	};
</script>

<style lang="less">
	.login {
		width: 100%;
		height: 100vh;
		background: url('../../assets/images/login-bg.jpg') no-repeat;
		background-size: 100% auto;
		background-color: #eea618;
		color: #FFF;
		box-sizing: border-box;
		padding-top: 80px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.logo {
			width: 105px;
			height: 54px;
		}

		.kuaifei {
			color: #30313D;
			display: block;
			padding: 16px;
			font-size: 14px
		}

		.loginText {
			font-size: 56rpx;
			margin-bottom: 40rpx;
		}


		.forgetPassword {
			width: 70%;
			text-align: right;
			color: #30313D;
			font-size: 14px;
			margin-top: 8px;
			margin-bottom: 50rpx;
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
	}
</style>