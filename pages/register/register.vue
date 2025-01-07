<template>
	<view class="register">
		<image src="../../assets/images/logo.png" mode="" class="logo"></image>
		<span class="kuaifei">快飞云控</span>
		<span class="loginText">注册</span>
		<view class="formBox">
			<view class="formItem">
				<u-icon name="phone" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input type="text" border="bottom" v-model="userInfo.phoneNumber" placeholder="请输入手机号" />
				</view>
			</view>
			<view class="formItem">
				<u-icon name="email" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input type="text" border="bottom" v-model="userInfo.code" placeholder="请输入验证码" />
					<u-button @tap="getCode" type="success" size="mini" color="#FFF" style="color: #eea618;"
						:disabled="disabled" class="sendCode">{{tips}}</u-button>
				</view>
			</view>
			<view class="formItem">
				<u-icon name="account" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input type="text" border="bottom" v-model="userInfo.username" placeholder="请输入昵称" />
				</view>
			</view>
			<view class="formItem">
				<u-icon name="share" size="28" color="#FFF"></u-icon>
				<view class="itemRight">
					<u--input type="text" border="bottom" v-model="userInfo.inviteCode"
						placeholder="请输入邀请码(选填,填写赠送体验电池)" />
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
					<u--input type="password" border="bottom" v-model="confirmPassword" placeholder="请确认密码" />
				</view>
			</view>
		</view>
		<view class="forgetPassword" @click="toLogin">
			有账号？去登陆
		</view>
		<u-button type="primary" shape="circle" text="注册" class="btn" style="color: #30313D;"
			color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))" @click="register"></u-button>
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
	import {
		requestUrl
	} from '@/utils/request';
	export default {
		data() {
			return {
				userInfo: {
					phoneNumber: '',
					code: '',
					username: '',
					inviteCode: '',
					password: '',
				},
				confirmPassword: '',
				tips: '发送验证码',
				protocolValue: [],
				showOverlay: false,
				disabled: false
			};
		},
		components: {
			Protocol
		},
		methods: {
			register() {
				uni.request({
					url: `${requestUrl}/app/user/register`,
					method: 'POST',
					data: this.userInfo,
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: '注册成功',
								icon: 'success',
							});
							this.toLogin()
						} else {
							uni.showToast({
								title: res.data.msg,
								type: 'error',
								icon: 'error',
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '请求失败',
							type: 'error',
							icon: 'error',
						});
					},
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
				uni.request({
					url: `${requestUrl}/app/user/getVerificationCode/${this.userInfo.phoneNumber}`,
					method: 'GET',
					success: (res) => {
						if (res.data.code === 200) {
							console.log('请求成功:', res.data);
						} else {
							console.error('请求失败:', res);
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
					},
				})
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
		.sendCode{
			position: absolute;
			right: 16px;
			bottom: 6px;
			width: 100px;
			height: 30px;
		}
	}
</style>