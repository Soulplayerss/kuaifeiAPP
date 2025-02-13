<template>
	<view class="register">
		<AppBar title='重置密码' @goBank="goBank" v-show="superiorPage == 'my'" />
		<image src="../../assets/images/logo.png" mode="" class="logo"></image>
		<span class="kuaifei">快飞云控</span>
		<span class="loginText">重置密码</span>
		<view class="formBox">
			<view class="formItem">
				<u-icon name="phone" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input type="text" border="bottom" v-model="userInfo.phone" placeholder="请输入手机号" />
				</view>
			</view>
			<view class="formItem">
				<u-icon name="email" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input type="text" border="bottom" v-model="userInfo.code" placeholder="请输入验证码">
						<template slot="suffix">
							<u-button @tap="getCode" :text="tips" type="success" size="mini" color="#FFF"
								style="color: #eea618;" :disabled="disabled"></u-button>
						</template>
					</u--input>
				</view>
			</view>
			<view class="formItem">
				<u-icon name="lock" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input type="password" border="bottom" v-model="userInfo.password" placeholder="请输入密码" />
				</view>
			</view>
			<view class="formItem">
				<u-icon name="lock" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input type="password" border="bottom" v-model="userInfo.confirmPassword" placeholder="请确认密码" />
				</view>
			</view>
		</view>
		<view class="forgetPassword" @click="toLogin">
			去登陆
		</view>
		<u-button type="primary" shape="circle" text="确认重置" class="btn" style="color: #30313D;"
			color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))" @click="register"></u-button>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	export default {
		data() {
			return {
				userInfo: {
					phone: '',
					code: '',
					password: '',
					confirmPassword: '',
				},
				tips: '发送验证码',
				disabled: false,
				superiorPage: 'login',
			};
		},
		components: {
			AppBar
		},
		onLoad(options) {
			const {
				page,
				siteId
			} = options;
			this.superiorPage = page
		},
		methods: {
			goBank() {
				uni.navigateTo({
					url: '/pages/my/my',
				})
			},
			register() {

			},
			checkboxChange(e) {
				console.log(e)
				// this.showOverlay = true
			},
			getCode() {
				let count = 10
				let timers = setInterval(() => {
					if (count <= 0) {
						clearInterval(timers)
						this.tips = '重新发送'
						this.disabled = false
					} else {
						count -= 1
						this.tips = count + '秒后重新发送'
						this.disabled = true
					}
				}, 1000)

			},
			toLogin() {
				uni.navigateTo({
					url: '/pages/login/login',
				})
			}
		},
		onReady() {

		},
	};
</script>

<style lang="less">
	.register {
		width: 100%;
		height: 1010vh;
		background: url('../../assets/images/login-bg.jpg') no-repeat;
		background-size: 100% auto;
		background-color: rgb(238, 166, 24);
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