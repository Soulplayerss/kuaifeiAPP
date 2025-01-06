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
						<image src="../../assets/images/avatar.jpg" mode="" class="avatar mr-8" @click="chooseImage">
						</image>
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>账号</span>
					</view>
					<view class="flex items-center">
						<span class="mr-8 color-c2a9bb">16888855423</span>
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>昵称</span>
					</view>
					<view class="flex items-center">
						<span class="mr-8 color-c2a9bb">张三丰</span>
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
	export default {
		data() {
			return {
				imagePath: '', // 图片路径
			}
		},
		components: {
			AppBar
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
						this.uploadImage(this.imagePath);
					},
					fail: (err) => {
						console.log('选择图片失败', err);
					}
				});
			},
			// 上传图片
			uploadImage(filePath) {
				this.uploading = true;

				uni.uploadFile({
					url: 'https://example.com/upload',
					filePath: filePath,
					name: 'file',
					formData: {
						// 'user': 'test' 
					},
					header: {
						'content-type': 'multipart/form-data'
					},
					success: (uploadRes) => {
						console.log('上传成功', uploadRes);
					},
					fail: (err) => {
						console.log('上传失败', err);
					},
				});
			},
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