<template>
	<view class="accountSetting">
		<AppBar title='用户设置' @goBank="goBank" />
		<view style="padding: 16px;">
			<view class="content">
				<view class="settingItem">
					<view class="left">
						<span>头像</span>
					</view>
					<view class="flex items-center">
						<image :src="avatar" mode="" class="avatar mr-8" @click="chooseImage">
						</image>
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>账号</span>
					</view>
					<view class="flex items-center">
						<span class="mr-8 color-c2a9bb">{{userInfo.phoneNumber}}</span>
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>昵称</span>
					</view>
					<view class="flex items-center">
						<span class="mr-8 color-c2a9bb">{{userInfo.userName}}</span>
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>方向盘IP</span>
					</view>
					<view class="flex items-center">
						<span class="mr-8 color-c2a9bb">127.0.0.1</span>
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>清除缓存</span>
					</view>
					<view class="flex items-center">
						<span class="mr-8 color-c2a9bb">2.3M</span>
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>注销账号</span>
					</view>
					<view class="flex items-center">
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>版本更新</span>
					</view>
					<view class="flex items-center">
						<span class="mr-8 color-c2a9bb">V2.2.1</span>
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="btns">
			<view class="btn">
				<u-button type="primary" shape="circle" text="退出登录" style="color: #30313D;"
					color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))" @click="logOut"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	import request from '@/utils/request';
	import {
		requestUrl
	} from '@/utils/request';
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				imagePath: '',
				avatar:'',
			}
		},
		components: {
			AppBar
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			goBank() {
				uni.navigateTo({
					url: '/pages/my/my',
				})
			},
			async logOut() {
				try {
					const response = await request('/logout', 'POST', {})
					uni.clearStorage()
					uni.navigateTo({
						url: '/pages/login/login',
					})
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.imagePath = res.tempFilePaths[0];
						this.uploadImage(this.imagePath, res.tempFiles[0]);
					},
					fail: (err) => {
						console.log('选择图片失败', err);
					}
				});
			},
			// 上传图片
			uploadImage(url, file) {
				var token = ''
				uni.getStorage({
					key: 'Token',
					success(res) {
						token = res.data
					}
				})
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: `${requestUrl}/system/user/profile/avatar`,
						filePath: url,
						name: 'file',
						header: {
							'Authorization': `Bearer ${token}`
						},
						formData: {
							avatarfile: file
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							this.avatar = requestUrl + data.imgUrl
							this.userInfo.avatar = data.imgUrl
							uni.setStorage({
								key: 'userInfo',
								data: this.userInfo,
								success(res) {
									this.$store.commit('setUserInfo')
								}
							})
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
		},
		mounted() {
			this.avatar = requestUrl + this.userInfo.avatar
		}
	}
</script>

<style scoped lang="less">
	.accountSetting {
		width: 100%;
		min-height: 100vh;
		background: url('../../assets/images/tab-bg.png') no-repeat;
		background-size: 100% auto;
		background-color: #eea618;
		box-sizing: border-box;
		padding-bottom: 72px;

		.content {
			width: 100%;
			height: calc(100vh - 194px);
			background-color: #FFF;
			border-radius: 8px;
			box-sizing: border-box;
			padding: 16px;

			.avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				margin-right: 8px;
				border: solid 1px #eea618;
			}
		}

		.btns {
			background-color: #eea618;
			position: fixed;
			bottom: 0px;
			left: 0;
			width: 100%;
			box-sizing: border-box;
			padding: 16px;
			display: flex;

			.btn {
				flex: 1;
			}
		}
	}
</style>