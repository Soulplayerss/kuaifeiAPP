<template>
	<view class="about">
		<AppBar title='关于我们' @goBank="goBank" />
		<view style="padding: 16px;">
			<view class="content">
				<image src="../../assets/images/logo.png" mode="" class="logo"></image>
				<view class="brandName">
					快飞运控
				</view>
				<view class="version">
						版本号：V2.2.1
				</view>
				<view class="settingItem">
					<view class="left">
						<span>联系客服</span>
					</view>
					<view class="flex items-center">
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>用户协议</span>
					</view>
					<view class="flex items-center">
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="settingItem">
					<view class="left">
						<span>隐私协议</span>
					</view>
					<view class="flex items-center">
						<u-icon name="arrow-right" size="22" color="#b09aaa"></u-icon>
					</view>
				</view>
				<view class="record">
					<view>
						@ 2024 四川快飞 All rights reserced.
					</view>
					<view>
						备案号:蜀ICP备20241212008号
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
			goBank() {
				uni.navigateTo({
					url: '/pages/my/my',
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.about {
		width: 100%;
		min-height: 100vh;
		background: url('../../assets/images/tab-bg.png') no-repeat;
		background-size: 100% auto;
		background-color: #eea618;

		.content {
			width: 100%;
			padding: 16px;
			height: calc(100vh - 76px);
			background-color: #FFF;
			border-radius: 8px;
			box-sizing: border-box;
			padding-top: 48px;
			text-align: center;
			position: relative;
			
			.logo {
				width: 105px;
				height: 54px;
			}
			
			.brandName{
				padding: 16px;
			}
			
			.version{
				margin-bottom: 30px;
				font-size: 14px;
			}
			
			.record{
				position: absolute;
				bottom: 30px;
				left: 0;
				width: 100%;
				font-size: 14px;
				line-height: 22px;
			}
		}

	}
</style>